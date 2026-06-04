# 📄 Resume Coach - User Guide

## **For Normal Users (Resume Upload)**

### **🎯 Step 1: Create Account**
1. Go to: **http://localhost:5173**
2. You'll see the **Login** page
3. Click on **"Create account here"** link
4. Fill in:
   - Email (e.g., `user@example.com`)
   - Password (min 6 characters)
   - Confirm Password
5. Click **"Sign Up"**

✅ You're now logged in! Redirected to `/` (Upload Resume page)

---

### **📤 Step 2: Upload Resume**
Once logged in, you'll see:
- **Title**: "AI Resume Coach"
- **File input**: "Choose PDF"
- **Button**: "Upload Resume"

1. Click on the file input
2. Select a PDF resume from your computer
3. Click **"Upload Resume"**

⏳ Wait for processing...

✅ You'll see:
- **Filename**: Your resume filename
- **Score**: Resume quality score (0-100)
- **Skills Found**: List of detected skills

---

### **🔄 Step 3: Manage Your Resumes**
After uploading, you can only see resumes you uploaded (not admin resumes).

To upload another resume: Repeat Step 2

---

## **For Admins (Dashboard)**

### **🔐 Step 1: Login as Admin**
1. Go to: **http://localhost:5173/login**
2. Enter:
   - **Email**: `admin@example.com`
   - **Password**: `admin123`
3. Click **"Login"**

✅ Redirected to `/admin` (Admin Dashboard)

---

### **📊 Step 2: View Dashboard**
You'll see:
- **Sidebar** (left) with navigation
- **Dashboard** showing:
  - Total Resumes (all users)
  - Average Score
- **Navigation links**:
  - Dashboard
  - Resumes

---

### **📋 Step 3: View All Resumes**
Click on **"Resumes"** in the sidebar
- See ALL resumes from ALL users
- Can delete any resume
- Each resume shows: ID, Filename, Delete button

---

### **🚪 Step 4: Logout**
Click **"Logout"** button in sidebar
- Redirected to `/login`

---

## **🗺️ User Flow Map**

```
┌─────────────────┐
│  http://localhost:5173
│  (Login Page)
└────────┬────────┘
         │
    ┌────┴────┐
    │          │
   Login    Signup
    │          │
    ├──────────┤
    │          │
 Admin    Regular User
 User      (/ page)
    │          │
    │      Upload
    │      Resume
    │          │
    └──────────┤
              └──────┐
           (Sees own resumes)
                │
           ┌────┴────┐
           │          │
        Upload      View
        More      Resumes
```

---

## **📍 All Routes**

### **Public Routes** (No Login Required)
- `/login` - Login page
- `/signup` - Signup page

### **Protected Routes** (Login Required)
- `/` - Upload Resume page (regular users only)

### **Admin Only Routes**
- `/admin` - Admin Dashboard
- `/admin/resumes` - View all resumes

---

## **💡 Important Notes**

✅ **Users see only their own resumes** (except admins)
✅ **Admins see ALL resumes** from all users
✅ **Each user can upload multiple resumes**
✅ **Resumes are analyzed automatically** when uploaded
✅ **Passwords are hashed** (never stored in plain text)

---

## **🔄 Demo Workflow**

### **Test as Normal User:**
1. **Signup**: `testuser@gmail.com` / `password123`
2. **Upload Resume**: Select any PDF
3. **See Score**: Get resume analysis
4. **Logout**: Click logout

### **Test as Admin:**
1. **Login**: `admin@example.com` / `admin123`
2. **View Dashboard**: See stats
3. **View Resumes**: See testuser's resume
4. **Delete**: Delete testuser's resume
5. **Logout**: Click logout

---

## **❓ Frequently Asked Questions**

**Q: Can I reset my password?**
A: Not yet. Contact admin to reset.

**Q: Where are resumes stored?**
A: SQLite database (`resume_coach.db`)

**Q: Can admins edit resumes?**
A: Only delete. Edit feature coming soon.

**Q: What file formats are supported?**
A: PDF only (`.pdf`)

**Q: Is my data secure?**
A: Yes! JWT tokens + password hashing + HTTPS ready

---

Enjoy! 🚀
