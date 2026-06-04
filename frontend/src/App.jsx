import './styles/components.css';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import UserRoute from './components/UserRoute';

import UploadResume from './pages/UploadResume';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AdminResumes from './pages/AdminResumes';

export default function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/" element={<UserRoute><UploadResume/></UserRoute>} />
            <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><Dashboard/></ProtectedRoute>} />
            <Route path="/admin/resumes" element={<ProtectedRoute requireAdmin={true}><AdminResumes/></ProtectedRoute>} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}
