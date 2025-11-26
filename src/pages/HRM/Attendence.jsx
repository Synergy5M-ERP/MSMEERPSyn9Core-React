
import React, { useState } from "react";
import EmployeeAttendence from "./EmployeeAttendence";
import CreateMaster from "./CreateMaster";
import GrossSalary from "./GrossSalary";
import SalarySheet from "./SalarySheet";
import SalarySlip from "./SalarySlip";


function Attendence() {
  const [selectedPage, setSelectedPage] = useState("dailyAttendence");
  const [view, setView] = useState("active"); // active or inactive

  return (
    <div style={{ minHeight: "80vh"}}>
      <h2 style={{ textAlign: "left", color: "#0066cc", marginBottom: 0 }}>
        Attendence Management
      </h2>

      {/* Page Selector */}
 <div
  style={{
    display: 'flex',
    justifyContent: 'space-between', // space between two groups
    alignItems: 'center',
    gap: '30px',
    marginTop: '22px',
    marginBottom: '12px',
    padding: '14px 0 14px 5px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.07)',
    background: '#fff',
  }}
>
  <div style={{ display: 'flex', gap: '30px' /* group left radio buttons with gap */ }}>

  <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
      <input
        type="radio"
        name="configTab"
        value="dailyAttendence"
        checked={selectedPage === 'dailyAttendence'}
        onChange={() => setSelectedPage('dailyAttendence')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
   Daily Employee Attendence
    </label>
   <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
      <input
        type="radio"
        name="configTab"
        value="grossSalary"
        checked={selectedPage === 'grossSalary'}
        onChange={() => setSelectedPage('grossSalary')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
  Staff Gross Salary
    </label>
  <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
      <input
        type="radio"
        name="configTab"
        value="salarysheet"
        checked={selectedPage === 'salarysheet'}
        onChange={() => setSelectedPage('salarysheet')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
Daily Wasge SalarySheet 
    </label>

 <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
      <input
        type="radio"
        name="configTab"
        value="salarySlip"
        checked={selectedPage === 'salarySlip'}
        onChange={() => setSelectedPage('salarySlip')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
  Pay Salary Slip
    {/* Pay Salary Slip */}
    </label>


  </div>

</div>




      {/* Render selected page with view prop */}
      <div>
        {selectedPage==='dailyAttendence'?(<EmployeeAttendence/>)
        :(selectedPage==="grossSalary")?(<GrossSalary/>):
        (selectedPage==="salarysheet")?(<SalarySheet/>)
        
        :<SalarySlip/>
        
         
        }
      </div>
    </div>
  );
}

export default Attendence;
