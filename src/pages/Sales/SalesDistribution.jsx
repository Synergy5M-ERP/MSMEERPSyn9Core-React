import React, { useState } from 'react';

import Footer from '../../components/Footer';
import Header from '../../components/Header';
import SalesDistributionDashboard from './SalesDistributionDashboard';
import SalesDistributionSidebar from './SalesDistributionSidebar';

// Your account configuration component


const SalesDistribution = () => {
const [activePage, setActivePage] = useState('Dashboard');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      
      {/* Full-width Header */}
      {/* <Header /> */}

      {/* Main layout with sidebar and content */}
      <div style={{ flex: 1, display: 'flex' }}>
        <SalesDistributionSidebar selected={activePage} onSelect={setActivePage} />

        {/* Main Content area */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
       {activePage === 'Dashboard' && <SalesDistributionDashboard />}
         {/* Add more conditions for other pages */}
        </div>
      </div>

      {/* Full-width Footer */}
      <Footer />
    </div>
  );
};

export default SalesDistribution;
