import React, { useState } from 'react';

import Footer from '../../components/Footer';
import Header from '../../components/Header';

import MMSidebar from './MMSidebar';
import MMDashboard from './MMDashboard';
import MannualPR from './ManualPR';
import AutoPR from './AutoPR';
// import CreateEnquiryPage from './StepWise';
import StepWise from './StepWise';
import PP from './PP';
import CreateEnquiry from './CreateEnquiry';
import QuotationEntryForm from './QuotationEntryForm';
import PriceComparison from './PriceComparison';
import PurchaseOrder from './PurchaseOrder';
import EnquiryStatus from './EnquiryStatus';
import GRN from './GRN';
import PurchaseReturninvoice from './PurchaseReturninvoice';

// Your account configuration component


const MMModule = () => {
  const [activePage, setActivePage] = useState('Dashboard');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

      {/* Full-width Header */}
      {/* <Header /> */}

      {/* Main layout with sidebar and content */}
      <div style={{ flex: 1, display: 'flex' }}>
        <MMSidebar selected={activePage} onSelect={setActivePage} />

        {/* Main Content area */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          {activePage === 'Dashboard' && <MMDashboard />}
          {activePage === 'ManualPR' && <MannualPR />}
          {activePage === "AutoPR" && <AutoPR />}
          {activePage === "EnqToPurchase" && <StepWise />}
          {activePage === "pp" && <PP />}
          {activePage === "createEnq" && <CreateEnquiry />}
          {activePage === "QuotationEntry" && <QuotationEntryForm />}
          {activePage === "priceComparison" && <PriceComparison />}
          {activePage === "purchaseOrder" && <PurchaseOrder />}
          {activePage === "EnquiryStatus" && <EnquiryStatus />}
          {activePage === "GRN" && <GRN />}
          {activePage === "PRI" && <PurchaseReturninvoice />}
          {/* Add more conditions for other pages */}
        </div>
      </div>

      {/* Full-width Footer */}
      <Footer />
    </div>
  );
};

export default MMModule;
