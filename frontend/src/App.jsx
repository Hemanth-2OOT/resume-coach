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
// If you have a Resumes page for normal user history, import it here:
// import Resumes from './pages/Resumes'; 

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* --- PUBLIC ROUTES (No Sidebar/Layout here!) --- */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* --- NORMAL USER PROTECTED ROUTES (Wrapped in Layout) --- */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute requireAdmin={false}>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/upload" 
            element={
              <ProtectedRoute requireAdmin={false}>
                <Layout><UploadResume /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/resumes" 
            element={
              <ProtectedRoute requireAdmin={false}>
                <Layout><UploadResume /></Layout> 
                {/* Note: Change <UploadResume /> to your <Resumes /> history page if you have it */}
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
          {/* Automatically kicks users to /login if they land on the base URL */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}