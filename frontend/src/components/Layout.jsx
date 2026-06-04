import React from 'react';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Pages that should NOT show the sidebar (public/auth pages)
const PUBLIC_PATHS = ['/login', '/signup', '/register'];

export default function Layout({ children }) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isPublicPage = PUBLIC_PATHS.includes(location.pathname);
  const showSidebar = isAuthenticated && !isPublicPage;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f7f3f7' }}>
      {showSidebar && <Sidebar />}
      <main
        style={{
          flex: 1,
          padding: '2rem',
          marginLeft: showSidebar ? '220px' : 0,
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh',
        }}
      >
        {children}
      </main>
    </div>
  );
}