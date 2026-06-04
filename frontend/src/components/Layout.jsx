import React from 'react';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';

export default function Layout({ children }){
  const location = useLocation();
  const showSidebar = location.pathname.startsWith('/admin');
  
  return (
    <div style={{display:'flex'}}>
      {showSidebar && <Sidebar />}
      <main style={{
        flex: 1, 
        padding: 20,
        marginLeft: showSidebar ? '220px' : 0,
        transition: 'margin-left 0.3s ease'
      }}>
        {children}
      </main>
    </div>
  );
}
