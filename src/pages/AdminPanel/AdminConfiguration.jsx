import React, { useState } from 'react';
import { Routes, Route } from "react-router-dom";

import Footer from '../../components/Footer';
import Header from '../../components/Header';

import AdminSidebar from './AdminSidebar';
//import RegisterPage from '../RegisterPage';
import RegisterPage from '../../pages/AdminPanel/RegisterPage';
import UserApproval from './UserApproval';

import AdminDashboard from './AdminDashboard';

const AdminConfiguration = () => {
  const [activePage, setActivePage] = useState('RegisterPage');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Optional Full-width Header */}
      {/* <Header /> */}

      {/* Main layout with sidebar and content */}
      <div style={{ flex: 1, display: 'flex' }}>
        <AdminSidebar selected={activePage} onSelect={setActivePage} />

        {/* Main Content area */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
           <Routes>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="RegisterPage" element={<RegisterPage />} />
            <Route path="userApproval" element={<UserApproval />} />
          </Routes>
          {/* Add more conditions if you add more pages */}
        </div>
      </div>

      {/* Full-width Footer */}
      <Footer />
    </div>
  );
};

export default AdminConfiguration;
