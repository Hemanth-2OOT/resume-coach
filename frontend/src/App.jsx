import './styles/components.css';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import UploadResume from './pages/UploadResume';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AdminResumes from './pages/AdminResumes';
import Resumes from './pages/Resumes'; // 1. UNCOMMENTED AND FIXED IMPORT

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* --- NORMAL USER PROTECTED ROUTES --- */}
          {/* 2. Upload route is now on top so it matches the priority flow */}
          <Route 
            path="/upload" 
            element={
              <ProtectedRoute requireAdmin={false}>
                <Layout><UploadResume /></Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute requireAdmin={false}>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/resumes" 
            element={
              <ProtectedRoute requireAdmin={false}>
                <Layout><Resumes /></Layout> {/* 3. FIXED: Pointing to Resumes component now */}
              </ProtectedRoute>
            } 
          />

          {/* --- ADMIN ONLY PROTECTED ROUTES --- */}
          <Route 
            path="/admin/resumes" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <Layout><AdminResumes /></Layout>
              </ProtectedRoute>
            } 
          />

          {/* --- ROOT FALLBACK REDIRECT --- */}
          {/* 4. Sends users straight to /login if they type in the base domain URL */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}