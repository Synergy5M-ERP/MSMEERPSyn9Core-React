import React, { useState } from 'react';
import Sidebar from './MasterSidebar';
import Footer from '../../components/Footer';
import Header from '../../components/Header';

// Your account configuration component

import Masters from './Masters';
import MasterDashboard from './MasterDashboard';
import CreateItem from './ItemMaster/CreateItem';

import ItemMaster from './ItemMaster/ItemMaster';
import VendorMaster from '../Masters/vendorMaster/VendorMaster';
import CommodityMaster from './Commodity/CommodityMaster';
import CreateBOM from './BOM/CreateBOM';
import ViewBOM from './BOM/ViewBOM';

const MasterConfiguration = () => {
const [activePage, setActivePage] = useState('Dashboard');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      
      {/* Full-width Header */}
      {/* <Header /> */}

      {/* Main layout with sidebar and content */}
      <div style={{ flex: 1, display: 'flex' }}>
        <Sidebar selected={activePage} onSelect={setActivePage} />

        {/* Main Content area */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
       {activePage === 'Dashboard' && <MasterDashboard />}
          {activePage === 'itemMaster' && <ItemMaster />}
            {activePage === 'vendorMaster' && <VendorMaster />}
             {activePage === 'commodityMaster' && <CommodityMaster />}
                {activePage === 'createBOM' && <CreateBOM />}
                 {activePage === 'viewbom' && <ViewBOM />}
          {/* Add more conditions for other pages */}
        </div>
      </div>

      {/* Full-width Footer */}
      <Footer />
    </div>
  );
};

export default MasterConfiguration;
