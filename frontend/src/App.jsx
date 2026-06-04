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

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* --- NORMAL USER PROTECTED ROUTES --- */}
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

          {/* --- ADMIN ONLY PROTECTED ROUTES --- */}
          <Route 
            path="/admin/resumes" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <Layout><AdminResumes /></Layout>
              </ProtectedRoute>
            } 
          />

          {/* --- SMART ROOT FALLBACK REDIRECT --- */}
          <Route 
            path="*" 
            element={
              <ProtectedRoute requireAdmin={false}>
                <Navigate to="/upload" replace />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}