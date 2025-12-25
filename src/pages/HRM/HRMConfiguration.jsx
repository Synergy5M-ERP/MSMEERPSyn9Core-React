import React, { useState } from 'react';

import Footer from '../../components/Footer';
import Header from '../../components/Header';


import HrmDashboard from './HrmDashboard';
import HrmSidebar from './HrmSidebar';
import CreateMaster from './CreateMaster';

import CreateMatrix from './CreateMatrix';
import VacantPosition from './VacantPosition';
import SalaryMIS from './SalaryMIS';
import Attendence from './Attendence';
import Report from './Report';
import EmployeeLetter from './EmployeeLetter';
import GrossSalary from './GrossSalary';
import EmployeeMaster from './EmployeeMaster/EmployeeMaster';


const HrmConfiguration = () => {
const [activePage, setActivePage] = useState('Dashboard');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      
      {/* Full-width Header */}
      {/* <Header /> */}

      {/* Main layout with sidebar and content */}
      <div style={{ flex: 1, display: 'flex' }}>
        <HrmSidebar selected={activePage} onSelect={setActivePage} />

        {/* Main Content area */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
       {activePage === 'Dashboard' && <HrmDashboard />}
        {activePage ==="createmaster" && <CreateMaster/>}
        {activePage === "AddEmp" && <EmployeeMaster/>}
        {activePage==="createMatrix" && <CreateMatrix/>}
        {activePage === "vacantposition" && <VacantPosition/>}
              {activePage==="GrossSalary" && <GrossSalary/>}

        {activePage==="salaryMIS" && <SalaryMIS/>}
        {activePage === "attendence" && <Attendence/>}
        {activePage==="report" && <Report/>}
      {activePage==="EmployeeLetter" && <EmployeeLetter/>}

          {/* Add more conditions for other pages */}
        </div>
      </div>

      {/* Full-width Footer */}
      <Footer />
    </div>
  );
};

export default HrmConfiguration;
