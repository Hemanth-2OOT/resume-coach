# 🤖 Resume Intelligence Coach

A full-stack intelligent resume parser and evaluation platform built for candidates and administrators. This application automates the candidate screening process by extracting key profile metrics, computing quality scores, and providing an optimized feedback loop via an interactive, secure dashboard.

## 🚀 Live Demo
* **Frontend Deployment:** [https://resume-coach-eight.vercel.app]

---

## 💡 Key Features

### 👤 Candidate Features
* **Intelligent File Ingestion:** Drag-and-drop resume uploading zone with instant system validation.
* **Dynamic Analytics Workspace:** Interactive user dashboard displaying real-time evaluation metrics, overall profile health status, and grading analysis.
* **Role-Based Workspaces:** Secured routing architectures ensuring users see clear, separate user flows unencumbered by administration tools.

### 🔑 Administration Features
* **Centralized Recruiter Dashboard:** Comprehensive management layout monitoring platform-wide metrics including total processed files and cumulative scoring averages.
* **Granular Route Protection:** Advanced middleware filtering out unauthorized regular accounts from tapping backend administrative datasets.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React.js (Vite), JavaScript (ES6+) | Highly responsive Single Page Application (SPA) architecture. |
| **Styling** | Vanilla CSS, Inline JSX Styles | Minimalist layout tracking unified purple-hued brand tokens. |
| **Routing** | React Router v6 | Dynamic client-side layout structures and route protection guards. |
| **Backend** | [Python (FastAPI / Flask) OR Node.js] | RESTful API generation and token processing. |
| **Database** | [MongoDB / PostgreSQL / SQLite] | Safe management of user records and analyzed metadata. |

---

## 📁 Core File Architecture (Frontend)

```text
src/
├── components/
│   ├── Layout.jsx         # Uniform shell managing the structural sidebar layout
│   └── ProtectedRoute.jsx # Middleware validating role privileges and session cookies
├── context/
│   └── AuthContext.jsx    # Central state tracking authentication and user metadata
├── pages/
│   ├── Login.jsx          # Login portal with inline keyframe injections
│   ├── Signup.jsx         # Candidate onboarding portal
│   ├── Dashboard.jsx      # Safe rendering dashboard with analytics fallback states
│   ├── UploadResume.jsx   # Core drag-and-drop profile ingestion screen
│   └── AdminResumes.jsx   # Privileged administrator parsing overview
├── App.jsx                # Unified application entry point and declarative routing layout
└── main.jsx               # DOM injection engine wrapper
