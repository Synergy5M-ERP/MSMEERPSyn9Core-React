import React, { useState } from 'react';
//yy//
import Footer from '../../components/Footer';
import Header from '../../components/Header';

import AdminSidebar from './AdminSidebar';
import RegisterPage from './RegisterPage';
import UserApproval from './UserApproval';

import AdminDashboard from './AdminDashboard';

const AdminConfiguration = () => {
  const [activePage, setActivePage] = useState('RegisterPage');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Optional Full-width Header */}
      {/* <Headers /> */}

      {/* Main layout with sidebar and content */}
      <div style={{ flex: 1, display: 'flex' }}>
        <AdminSidebar selected={activePage} onSelect={setActivePage} />

        {/* Main Content area */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        {activePage === 'adminDashboard' && <AdminDashboard />}

          {activePage === 'RegisterPage' && <RegisterPage />}
          {activePage === 'userApproval' && <UserApproval />}
         
          {/* Add more conditions if you add more pages */}
        </div>
      </div>

      {/* Full-width Footer */}
      <Footer />
    </div>
  );
};

export default AdminConfiguration;
