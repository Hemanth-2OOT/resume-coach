#!/usr/bin/env python
"""
Resume Coach - Quick Start Helper
Run this to get all the information you need
"""

print("""
╔═══════════════════════════════════════════════════════════════════╗
║                    RESUME COACH - QUICK START                    ║
╚═══════════════════════════════════════════════════════════════════╝

📍 PROJECT LOCATION:
   C:\\Users\\HEMANTH\\Desktop\\py_play\\resume_coach

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 STEP 1: INSTALL DEPENDENCIES

Backend:
   cd C:\\Users\\HEMANTH\\Desktop\\py_play\\resume_coach\\backend
   pip install -r requirements.txt

Frontend:
   cd C:\\Users\\HEMANTH\\Desktop\\py_play\\resume_coach\\frontend
   npm install

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔧 STEP 2: START SERVERS (Use 2 terminals)

TERMINAL 1 - Backend:
   cd C:\\Users\\HEMANTH\\Desktop\\py_play\\resume_coach\\backend
   python -m uvicorn main:app --reload
   
   ✓ Runs on http://127.0.0.1:8000
   ✓ Keep this running!

TERMINAL 2 - Frontend:
   cd C:\\Users\\HEMANTH\\Desktop\\py_play\\resume_coach\\frontend
   npm run dev
   
   ✓ Runs on http://localhost:5173
   ✓ Keep this running!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌐 STEP 3: OPEN BROWSER

   http://localhost:5173

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👥 LOGIN OPTIONS

OPTION A - Admin Account (Built-in):
   Email:    admin@example.com
   Password: admin123
   → Redirects to: /admin (Admin Dashboard)

OPTION B - Create New User Account:
   1. Click "Create account here" on Login page
   2. Enter any email & password
   3. Click "Sign Up"
   → Redirects to: / (Resume Upload Page)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📤 HOW TO UPLOAD RESUME (As Regular User):

1. Login or Create Account
2. You'll see "AI Resume Coach" page
3. Click "Choose PDF" button
4. Select a .pdf file from your computer
5. Click "Upload Resume"
6. See your resume score & skills analyzed!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 WHAT EACH PAGE DOES

Login (/login):
   └─ Enter email & password
   └─ Or click "Create account here" to signup

Signup (/signup):
   └─ Enter email, password, confirm password
   └─ Click "Sign Up" to create account
   └─ Automatically logs you in

Upload Resume (/ - Home):
   └─ Upload your PDF resume
   └─ View analysis score
   └─ View detected skills
   └─ Can upload multiple resumes
   └─ Can only see YOUR resumes

Admin Dashboard (/admin):
   └─ View total resumes (all users)
   └─ View average score
   └─ See sidebar with navigation

Admin Resumes (/admin/resumes):
   └─ View ALL resumes from ALL users
   └─ Can delete any resume
   └─ Shows resume ID, filename, delete button

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 SECURITY

✓ Passwords are HASHED (never stored plain)
✓ Login uses JWT tokens
✓ Protected routes (can't access /admin without being admin)
✓ CORS enabled for frontend/backend communication
✓ Bearer token auto-injected in requests

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 RECOMMENDED TEST FLOW

1. CREATE NEW USER:
   - Go to http://localhost:5173
   - Click "Create account here"
   - Email: testuser@gmail.com
   - Password: testpass123
   - Click Sign Up
   ✓ See Upload Resume page

2. UPLOAD RESUME:
   - Click "Choose PDF"
   - Select any resume PDF from your computer
   - Click "Upload Resume"
   ✓ See score & skills

3. VIEW AS ADMIN:
   - Logout (click Logout button)
   - Login: admin@example.com / admin123
   - Click "Resumes" in sidebar
   ✓ See testuser's resume in list
   - Can click Delete

4. LOGOUT:
   - Click "Logout" button
   ✓ Redirected to login page

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🐛 TROUBLESHOOTING

Backend not starting?
   → Check: python --version (should be 3.14.x)
   → Run: cd backend && pip install -r requirements.txt

Frontend not starting?
   → Check: npm --version
   → Run: cd frontend && npm install

Can't login?
   → Check browser console (F12 → Console tab)
   → Make sure backend is running on http://127.0.0.1:8000
   → Check .env.local has: VITE_API_URL=http://localhost:8000

CORS errors?
   → Restart backend: Ctrl+C then run uvicorn again
   → Clear browser cache (Ctrl+Shift+Delete)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📂 MAIN FILES

Backend:
   backend/main.py              - Main API server
   backend/models/user.py       - User database model
   backend/models/resume.py     - Resume database model
   backend/security.py          - Password hashing & JWT
   backend/database.py          - Database connection
   backend/requirements.txt     - Python dependencies

Frontend:
   frontend/src/App.jsx         - Main app routes
   frontend/src/pages/Login.jsx - Login page
   frontend/src/pages/Signup.jsx - Signup page
   frontend/src/pages/UploadResume.jsx - Upload page
   frontend/src/pages/Dashboard.jsx - Admin dashboard
   frontend/package.json        - Node dependencies

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ EVERYTHING IS READY! 

Open: http://localhost:5173
Enjoy! 🚀

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
""")
