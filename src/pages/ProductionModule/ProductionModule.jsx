import React, { useState } from 'react';

import Footer from '../../components/Footer';
import ProductionSidebar from './ProductionSidebar';
import ProductionDashboard from './ProductionDashboard';
import SemiFinishInventory from './SemiFinishInventory';
import Broughout from './Broughout';
import RMConsumption from './RMConsumption';
import ActualFinish from './ActualFinish';
import ActualSemiFinish from './ActualSemiFinish';
import FinishProduction from './FinishProduction';
import SemiFinishProduction from './SemiFinishProduction';
import ManualIssuePass from './ManualIssuePass';
import CrystalReport from './CrystalReport';
import StandardReport from './StandardReport';



// Your account configuration component


const ProductionModule = () => {
  const [activePage, setActivePage] = useState('Dashboard');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

      {/* Full-width Header */}
      {/* <Header /> */}

      {/* Main layout with sidebar and content */}
      <div style={{ flex: 1, display: 'flex' }}>
        <ProductionSidebar selected={activePage} onSelect={setActivePage} />

        {/* Main Content area */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          {activePage === 'Dashboard' && <ProductionDashboard />}
        {activePage==='SemiFinishInventory' && <SemiFinishInventory/>}
        {activePage==='BougthOut' && <Broughout/>}
        {activePage==='finishProduction' && <FinishProduction/>}
         {activePage==='SemifinishProduction' && <SemiFinishProduction/>}
          {activePage==='RMConsumption' && <RMConsumption/>}
             {activePage==='ActualFinish' && <ActualFinish/>}
             {activePage==='ActualSemiFinish' && <ActualSemiFinish/>}
             {activePage==='ManualIssuePass' && <ManualIssuePass/>}
             {activePage==='crystalReport' && <CrystalReport/>}
              {activePage==='standardReport' && <StandardReport/>}
          {/* Add more conditions for other pages */}
        </div>
      </div>

      {/* Full-width Footer */}
      <Footer />
    </div>
  );
};

export default ProductionModule;
