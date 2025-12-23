import React, { useState } from 'react';

import Footer from '../../components/Footer';
import QualitySidebar from './QualitySidebar';
import QualityDashboard from './QualityDashboard';
import InwardQC from './InwardQC';
import CustomizedOutwardQC from './CustomizedOutwardQC';
import GenericOutwardQC from './GenericOutwardQC';
import SemiFinishQC from './SemiFinishQC';
import TDSMaster from './TDS';
import TestingReport from './TestingReport';



// Your account configuration component


const QualityModule = () => {
  const [activePage, setActivePage] = useState('Dashboard');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

      {/* Full-width Header */}
      {/* <Header /> */}

      {/* Main layout with sidebar and content */}
      <div style={{ flex: 1, display: 'flex' }}>
        <QualitySidebar selected={activePage} onSelect={setActivePage} />

        {/* Main Content area */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          {activePage === 'Dashboard' && <QualityDashboard />}
       {activePage ==="inwardQC" && <InwardQC/>}
       {activePage ==="customized" && <CustomizedOutwardQC/>}
       {activePage ==="Generic" && <GenericOutwardQC/>}
        {activePage ==="SemiFInishQC" && <SemiFinishQC/>}
         {activePage ==="TDS" && <TDSMaster/>}
         {activePage ==="TestingReport" && <TestingReport/>}
          {/* Add more conditions for other pages */}
        </div>
      </div>

      {/* Full-width Footer */}
      <Footer />
    </div>
  );
};

export default QualityModule;
