import React, { useState } from 'react';

import Footer from '../../components/Footer';
import Header from '../../components/Header';
import SalesDistributionDashboard from './SalesDistributionDashboard';
import SalesDistributionSidebar from './SalesDistributionSidebar';
import InventoryMaster from '../Masters/InventoryMaster/InventoryMaster';
import BOM from '../Masters/BOM/BOM';
import SalesInvoice from './SalesInvoice';
import Enquiry from './Enquiry';
import QuotationMaster from './Quotation';
import DirecteExternalSO from './DirectExternalSO';
import GenericRepeateSO from './GenericRepeateSO';
import TaxInvoice from './TaxInvoice';
import WareHouse from './WareHouse';
import DispachAdvise from './DispachAdvise';
import SalesReturnGRN from './SalesReturnGRN';

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
          {activePage === 'inventoryMaster' && <InventoryMaster />}
          {activePage === 'BOM' && <BOM />}
          {activePage === 'SalesInvoice' && <SalesInvoice />}
          {activePage === 'Enquiry' && <Enquiry />}
          {activePage === 'Quotation' && <QuotationMaster />}
          {activePage === 'DirectExternalSO' && <DirecteExternalSO />}
          {activePage === 'GenericRepeateSO' && <GenericRepeateSO />}
          {activePage === 'taxInvoice' && <TaxInvoice />}
{activePage === 'WareHouse' && <WareHouse />}
          {activePage === 'dispachAdvise' && <DispachAdvise />}
          {activePage === 'SalesReturnGRN' && <SalesReturnGRN />}
          {/* Add more conditions for other pages */}
        </div>
      </div>

      {/* Full-width Footer */}
      <Footer />
    </div>
  );
};

export default SalesDistribution;
