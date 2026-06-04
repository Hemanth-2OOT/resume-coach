import io
import os
import re
import json
import logging
import uuid
from starlette.applications import Starlette
from starlette.routing import Route
from starlette.requests import Request
from starlette.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware
from starlette.concurrency import run_in_threadpool  # Runs blocking operations safely
from pypdf import PdfReader

# Database Layer Imports — Pure Asynchronous MongoDB Client Collections
from database import user_collection, resume_collection, database
from security import hash_password, verify_password, create_access_token, decode_access_token
from config import FRONTEND_URL

# ---------------------------------------------------------------------------
# Logging Initialization
# ---------------------------------------------------------------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ALLOWED_CONTENT_TYPES = {"application/pdf"}
MAX_FILE_SIZE_BYTES   = 10 * 1024 * 1024  # 10 MB

# ---------------------------------------------------------------------------
# Auth Helpers
# ---------------------------------------------------------------------------
async def _require_auth(request: Request):
    auth_header = request.headers.get("authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None, JSONResponse({"detail": "Missing or invalid authorization"}, status_code=401)
    
    token = auth_header.replace("Bearer ", "")
    payload = decode_access_token(token)
    if not payload:
        return None, JSONResponse({"detail": "Invalid or expired token"}, status_code=401)
        
    sub = payload.get("sub")
    if not sub:
        return None, JSONResponse({"detail": "Invalid token"}, status_code=401)
    
    # MongoDB IDs are strings (UUID strings) instead of SQLite Auto-increment Integers
    return str(sub), None

# ---------------------------------------------------------------------------
# Auth Routes
# ---------------------------------------------------------------------------
async def login(request: Request):
    try:
        data = await request.json()
        email    = data.get("email")
        password = data.get("password")
        if not email or not password:
            return JSONResponse({"detail": "Email and password required"}, status_code=400)
        
        # Async query looking for user dictionary document
        db_user = await user_collection.find_one({"email": email})
        if not db_user or not verify_password(password, db_user.get("password_hash")):
            return JSONResponse({"detail": "Invalid email or password"}, status_code=401)
            
        is_admin = db_user.get("is_admin", False)
        token = create_access_token({"sub": str(db_user["_id"]), "is_admin": is_admin})
            
        return JSONResponse({
            "success":     True,
            "token":       token,
            "redirect_to": "/admin" if is_admin else "/",
            "role":        "admin" if is_admin else "user"
        })
    except Exception as e:
        logger.exception("Login error")
        return JSONResponse({"detail": str(e)}, status_code=500)


async def register(request: Request):
    try:
        data = await request.json()
        email    = data.get("email")
        password = data.get("password")
        if not email or not password:
            return JSONResponse({"detail": "Email and password required"}, status_code=400)
        
        existing = await user_collection.find_one({"email": email})
        if existing:
            return JSONResponse({"detail": "Email already registered"}, status_code=400)
            
        hashed_pwd = hash_password(password)
        user_id = str(uuid.uuid4())
        
        new_user_document = {
            "_id": user_id,
            "email": email,
            "password_hash": hashed_pwd,
            "is_admin": False
        }
        
        await user_collection.insert_one(new_user_document)
        token = create_access_token({"sub": user_id, "is_admin": False})
            
        return JSONResponse({
            "success":     True,
            "token":       token,
            "redirect_to": "/",
            "role":        "user"
        })
    except Exception as e:
        logger.exception("Register error")
        return JSONResponse({"detail": str(e)}, status_code=500)


async def get_current_user(request: Request):
    try:
        user_id, err = await _require_auth(request)
        if err:
            return err
            
        db_user = await user_collection.find_one({"_id": user_id})
        if not db_user:
            return JSONResponse({"detail": "User not found"}, status_code=404)
            
        return JSONResponse({
            "id": db_user["_id"], 
            "email": db_user["email"], 
            "is_admin": db_user.get("is_admin", False)
        })
    except Exception as e:
        logger.exception("Get current user error")
        return JSONResponse({"detail": str(e)}, status_code=500)

# ---------------------------------------------------------------------------
# Synchronous Helper Offloaders
# ---------------------------------------------------------------------------
def _parse_pdf_sync(pdf_bytes: bytes) -> str:
    pdf  = PdfReader(io.BytesIO(pdf_bytes))
    text = ""
    for page in pdf.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"
    return text

# ---------------------------------------------------------------------------
# Expanded Local Processing Keyword Setup
# ---------------------------------------------------------------------------
LEARNING_RESOURCES = {
    "python":            {"label": "Python Tutorial",           "url": "https://docs.python.org/3/tutorial/"},
    "java":              {"label": "Java Tutorial",             "url": "https://dev.java/learn/"},
    "c++":               {"label": "C++ Tutorial",              "url": "https://www.learncpp.com/"},
    "sql":               {"label": "SQL Tutorial",              "url": "https://www.w3schools.com/sql/"},
    "machine learning":  {"label": "ML Crash Course",           "url": "https://developers.google.com/machine-learning/crash-course"},
    "react":             {"label": "React Docs",                "url": "https://react.dev/learn"},
    "fastapi":           {"label": "FastAPI Docs",              "url": "https://fastapi.tiangolo.com/tutorial/"},
    "html":              {"label": "HTML Tutorial",             "url": "https://www.w3schools.com/html/"},
    "css":               {"label": "CSS Tutorial",              "url": "https://www.w3schools.com/css/"},
    "javascript":        {"label": "JavaScript Tutorial",       "url": "https://javascript.info/"},
    "typescript":        {"label": "TypeScript Handbook",       "url": "https://www.typescriptlang.org/docs/handbook/intro.html"},
    "docker":            {"label": "Docker Getting Started",    "url": "https://docs.docker.com/get-started/"},
    "aws":               {"label": "AWS Getting Started",       "url": "https://aws.amazon.com/getting-started/"},
    "git":               {"label": "Git Tutorial",              "url": "https://www.atlassian.com/git/tutorials"},
    "kubernetes":        {"label": "Kubernetes Basics",         "url": "https://kubernetes.io/docs/tutorials/kubernetes-basics/"},
    "tensorflow":        {"label": "TensorFlow Tutorials",      "url": "https://www.tensorflow.org/tutorials"},
    "pytorch":           {"label": "PyTorch Tutorials",         "url": "https://pytorch.org/tutorials/"},
    "statistics":        {"label": "Khan Academy Statistics",   "url": "https://www.khanacademy.org/math/statistics-probability"},
    "excel":             {"label": "Excel Training",            "url": "https://support.microsoft.com/en-us/office/excel-video-training-9bc05390-e94c-46af-a5b3-d7c22f6990bb"},
    "linux":             {"label": "Linux Command Line Basics", "url": "https://ubuntu.com/tutorials/command-line-for-beginners"},
    "ci/cd":             {"label": "GitHub Actions Quickstart", "url": "https://docs.github.com/en/actions/quickstart"},
    "node.js":           {"label": "Node.js Getting Started",   "url": "https://nodejs.org/en/learn/getting-started/introduction-to-nodejs"},
    "mongodb":           {"label": "MongoDB Basics",            "url": "https://www.mongodb.com/docs/manual/tutorial/getting-started/"},
    "postgresql":        {"label": "PostgreSQL Tutorial",       "url": "https://www.postgresqltutorial.com/"},
    "data visualization":{"label": "Matplotlib Tutorial",       "url": "https://matplotlib.org/stable/tutorials/index.html"},
    "tableau":           {"label": "Tableau Training",          "url": "https://www.tableau.com/learn/training"},
    "figma":             {"label": "Figma Design System Guide", "url": "https://help.figma.com/hc/en-us"},
    "jira":              {"label": "Jira Agile Foundations",    "url": "https://www.atlassian.com/software/jira/guides"},
    "scrum":             {"label": "Scrum Framework Guide",     "url": "https://www.scrum.org/resources/what-is-scrum"}
}

ALL_SKILLS = list(LEARNING_RESOURCES.keys()) + [
    "mathematics", "inventory", "warehousing", "logistics", "next.js", "tailwind css",
    "supply chain", "english", "spanish", "agile", "rest api", "graphql", "redis", "nginx", "flask", "django"
]

ROLE_REQUIREMENTS = {
    "Frontend Developer":        {"required": ["html", "css", "javascript", "react", "git"], "preferred": ["typescript", "next.js", "figma"], "salary": "$115,000 - $145,000"},
    "Backend Developer":        {"required": ["python", "sql", "fastapi", "docker", "git"], "preferred": ["redis", "postgresql", "django"], "salary": "$120,000 - $155,000"},
    "Full Stack Developer":     {"required": ["html", "css", "javascript", "react", "python", "sql", "docker", "git"], "preferred": ["typescript", "node.js", "aws"], "salary": "$130,000 - $165,000"},
    "Data Analyst":             {"required": ["python", "sql", "excel", "statistics", "data visualization"], "preferred": ["tableau", "mathematics"], "salary": "$85,000 - $115,000"},
    "Machine Learning Engineer": {"required": ["python", "machine learning", "tensorflow", "pytorch", "sql"], "preferred": ["statistics", "linux"], "salary": "$145,000 - $185,000"},
    "DevOps Engineer":           {"required": ["docker", "kubernetes", "linux", "aws", "ci/cd", "git"], "preferred": ["python", "nginx"], "salary": "$140,000 - $180,000"},
    "Data Scientist":            {"required": ["python", "machine learning", "statistics", "sql", "data visualization", "tensorflow"], "preferred": ["pytorch", "mathematics"], "salary": "$135,000 - $175,000"},
    "Node.js Developer":         {"required": ["javascript", "typescript", "node.js", "mongodb", "git"], "preferred": ["graphql", "rest api"], "salary": "$110,000 - $140,000"},
    "Product Manager (Tech)":    {"required": ["agile", "scrum", "jira"], "preferred": ["sql", "tableau", "figma"], "salary": "$120,000 - $150,000"},
    "UI/UX Product Designer":    {"required": ["figma", "git"], "preferred": ["react", "css", "html"], "salary": "$95,000 - $130,000"}
}

def analyze_resume_keywords(text: str) -> dict:
    text_lower = text.lower()
    found_skills = [skill for skill in ALL_SKILLS if re.search(r'\b' + re.escape(skill) + r'\b', text_lower)]

    education_keywords  = ["degree", "bachelor", "master", "university", "college", "b.tech", "b.e", "m.tech", "computer science"]
    experience_keywords = ["experience", "internship", "associate", "developer", "engineer", "worked", "project", "led"]

    skill_score = min(30, round((len(found_skills) / 5) * 30))
    edu_score   = 30 if any(w in text_lower for w in education_keywords) else 0
    exp_score   = 40 if any(w in text_lower for w in experience_keywords) else 0
    score       = skill_score + edu_score + exp_score

    recommended_roles = []
    for role, target in ROLE_REQUIREMENTS.items():
        matched = [s for s in target["required"] if s in found_skills]
        missing = [s for s in target["required"] if s not in found_skills]
        pref_match = [s for s in target["preferred"] if s in found_skills]
        
        req_score = (len(matched) / len(target["required"])) * 100 if target["required"] else 100
        pref_score = (len(pref_match) / len(target["preferred"])) * 100 if target["preferred"] else 100
        match_percent = int((req_score * 0.7) + (pref_score * 0.3))
        
        resources = [LEARNING_RESOURCES[s] for s in missing if s in LEARNING_RESOURCES]
        
        why_bullets = [f"Matches {len(matched)} core metrics and {len(pref_match)} preferred stack targets."]
        if missing:
            why_bullets.append(f"Missing core requirements: {', '.join(missing)}")

        if match_percent >= 20:
            recommended_roles.append({
                "role":           role,
                "match":          match_percent,
                "matched_skills": matched,
                "missing_skills": missing,
                "resources":      resources,
                "avg_salary_usd": target["salary"],
                "why":            why_bullets,
                "market_demand":  "high" if match_percent > 60 else "medium"
            })
            
    recommended_roles.sort(key=lambda x: x["match"], reverse=True)

    suggestions = []
    if "git" not in found_skills: suggestions.append("Add Git/GitHub experience — required for almost every developer role.")
    if "docker" not in found_skills: suggestions.append("Learn Docker — containerization is standard for deployment.")
    if "aws" not in found_skills: suggestions.append("Cloud skills like AWS significantly improve employability.")
    if len(found_skills) < 5: suggestions.append("Add more technical skills and personal/academic projects.")
    if edu_score == 0: suggestions.append("Mention your education clearly (degree, university, college).")
    if exp_score == 0: suggestions.append("Include internships, freelance work, or personal projects.")

    return {
        "score":             score,
        "ats_score":         score,
        "skills_found":      found_skills,
        "soft_skills":       ["Team Collaboration", "Problem Solving", "Technical Communication"],
        "recommended_roles": recommended_roles,
        "suggestions":       suggestions if suggestions else ["Structure profiles look clean."],
        "summary":           f"Extracted {len(found_skills)} engineering skills. Evaluated matches across the career track directory.",
        "market_insight":    "Hiring teams currently prioritize foundational domain ownership. Listing tools explicitly optimizes keyword indexing."
    }

# ---------------------------------------------------------------------------
# Resume Routes
# ---------------------------------------------------------------------------
async def upload_pdf(request: Request):
    try:
        user_id, err = await _require_auth(request)
        if err:
            return err

        form     = await request.form()
        file     = form.get("file")
        if not file:
            return JSONResponse({"detail": "No file provided"}, status_code=400)

        content_type = file.content_type or ""
        if content_type not in ALLOWED_CONTENT_TYPES:
            return JSONResponse({"detail": "Only PDF files are accepted."}, status_code=400)

        pdf_bytes = await file.read()
        if len(pdf_bytes) > MAX_FILE_SIZE_BYTES:
            return JSONResponse({"detail": "File must be under 10 MB."}, status_code=400)

        try:
            text = await run_in_threadpool(_parse_pdf_sync, pdf_bytes)
        except Exception:
            return JSONResponse({"detail": "Could not parse PDF. Please upload a valid PDF file."}, status_code=400)

        analysis = analyze_resume_keywords(text)
        resume_id = str(uuid.uuid4())

        resume_document = {
            "_id": resume_id,
            "filename": file.filename,
            "content": text,
            "user_id": user_id
        }
        await resume_collection.insert_one(resume_document)

        return JSONResponse({
            "success":    True,
            "resume_id":  resume_id,
            "filename":   file.filename,
            "analysis":   analysis,
            "text":       text,
            "ai_powered": False,
        })
    except Exception as e:
        logger.exception("Upload PDF error")
        return JSONResponse({"success": False, "error": str(e)}, status_code=500)


async def get_resumes(request: Request):
    try:
        user_id, err = await _require_auth(request)
        if err:
            return err
            
        current_user = await user_collection.find_one({"_id": user_id})
        if not current_user:
            return JSONResponse({"detail": "User not found"}, status_code=404)
            
        resumes = []
        # Admins see everything, typical clients only get their matching IDs
        query_filter = {} if current_user.get("is_admin") else {"user_id": user_id}
        
        async for r in resume_collection.find(query_filter):
            resumes.append({"id": r["_id"], "filename": r["filename"]})
            
        return JSONResponse(resumes)
    except Exception as e:
        logger.exception("Get resumes error")
        return JSONResponse({"detail": str(e)}, status_code=500)


async def delete_resume(request: Request):
    try:
        user_id, err = await _require_auth(request)
        if err:
            return err

        resume_id = request.path_params.get("resume_id")
        current_user = await user_collection.find_one({"_id": user_id})
        resume = await resume_collection.find_one({"_id": resume_id})
        
        if not resume:
            return JSONResponse({"detail": "Resume not found"}, status_code=404)
            
        if not current_user.get("is_admin") and resume.get("user_id") != user_id:
            return JSONResponse({"detail": "Access denied"}, status_code=403)
            
        await resume_collection.delete_one({"_id": resume_id})
        return JSONResponse({"success": True})
    except Exception as e:
        logger.exception("Delete resume error")
        return JSONResponse({"detail": str(e)}, status_code=500)


async def get_stats(request: Request):
    try:
        user_id, err = await _require_auth(request)
        if err:
            return err
            
        current_user = await user_collection.find_one({"_id": user_id})
        if not current_user:
            return JSONResponse({"detail": "User not found"}, status_code=404)

        resumes = []
        query_filter = {} if current_user.get("is_admin") else {"user_id": user_id}
        
        async for r in resume_collection.find(query_filter):
            resumes.append(r)

        total = len(resumes)
        if total > 0:
            def compute_avg():
                scores = [analyze_resume_keywords(r.get("content") or "")["score"] for r in resumes]
                return round(sum(scores) / len(scores))
            avg_score = await run_in_threadpool(compute_avg)
        else:
            avg_score = 0

        return JSONResponse({"total_resumes": total, "avg_score": avg_score})
    except Exception as e:
        logger.exception("Get stats error")
        return JSONResponse({"detail": str(e)}, status_code=500)


async def analyze_resume_by_id(request: Request):
    try:
        user_id, err = await _require_auth(request)
        if err:
            return err
            
        resume_id = request.path_params.get("resume_id")
        current_user = await user_collection.find_one({"_id": user_id})
        resume = await resume_collection.find_one({"_id": resume_id})
        
        if not resume:
            return JSONResponse({"detail": "Resume not found"}, status_code=404)
        if not current_user.get("is_admin") and resume.get("user_id") != user_id:
            return JSONResponse({"detail": "Access denied"}, status_code=403)
            
        text = resume.get("content") or ""
        analysis = analyze_resume_keywords(text)

        return JSONResponse({
            "success":    True,
            "resume_id":  resume_id,
            "analysis":   analysis,
            "ai_powered": False,
        })
    except Exception as e:
        logger.exception("Analyze resume by ID error")
        return JSONResponse({"detail": str(e)}, status_code=500)


async def home(request: Request):
    return JSONResponse({
        "message":    "Resume Coach API",
        "ai_analysis": "disabled (running pure local keyword engine)",
    })


async def get_all_users(request: Request):
    try:
        user_id, err = await _require_auth(request)
        if err: 
            return err
            
        current_user = await user_collection.find_one({"_id": user_id})
        if not current_user or not current_user.get("is_admin"):
            return JSONResponse({"detail": "Access denied. Admins only."}, status_code=403)
            
        users = []
        async for u in user_collection.find():
            users.append({
                "id": u["_id"], 
                "email": u["email"], 
                "is_admin": u.get("is_admin", False)
            })
        return JSONResponse(users)
    except Exception as e:
        return JSONResponse({"detail": str(e)}, status_code=500)

# ---------------------------------------------------------------------------
# Routing Framework (Unified & Fixed Syntax)
# ---------------------------------------------------------------------------
routes = [
    Route("/",                                   endpoint=home),
    Route("/api/auth/login",                     endpoint=login,                methods=["POST"]),
    Route("/api/auth/register",                  endpoint=register,             methods=["POST"]),
    Route("/api/auth/me",                        endpoint=get_current_user),
    Route("/api/upload-pdf",                     endpoint=upload_pdf,           methods=["POST"]),
    Route("/api/resumes",                        endpoint=get_resumes),
    Route("/api/resume/{resume_id:str}",         endpoint=delete_resume,        methods=["DELETE"]),
    Route("/api/resume/{resume_id:str}/analyze", endpoint=analyze_resume_by_id),
    Route("/api/stats",                          endpoint=get_stats),
    Route("/api/admin/users",                    endpoint=get_all_users,        methods=["GET"]),
]

# Initialize Starlette application with the configuration list above
app = Starlette(routes=routes)

# Configure Cross-Origin Resource Sharing (CORS)
# Configure Cross-Origin Resource Sharing (CORS)
# Configure Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    # This dynamically matches any preview or production Vercel URL, plus your local test server
    allow_origin_regex=r"https://.*\.vercel\.app|http://localhost:\d+", 
    allow_credentials=True,  # 👈 Keep this True now!
    allow_methods=["*"],
    allow_headers=["*"],
)
