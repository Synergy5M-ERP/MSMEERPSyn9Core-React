
import React, { useState } from "react";

import EmployeeList from "./EmployeeList";


function Report() {
  const [selectedPage, setSelectedPage] = useState("EmployeeList");
  const [view, setView] = useState("active"); // active or inactive

  return (
    <div style={{ minHeight: "80vh"}}>
      <h2 style={{ textAlign: "left", color: "#0066cc", marginBottom: 0 }}>
       Standard  Report 
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
        value="EmployeeList"
        checked={selectedPage === 'EmployeeList'}
        onChange={() => setSelectedPage('EmployeeList')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
Employee List
    </label>
   <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
      <input
        type="radio"
        name="configTab"
        value="Matrix"
        checked={selectedPage === 'Matrix'}
        onChange={() => setSelectedPage('Matrix')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
 Matrix
    </label>
  <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
      <input
        type="radio"
        name="configTab"
        value="attendenceList"
        checked={selectedPage === 'attendenceList'}
        onChange={() => setSelectedPage('attendenceList')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
Daily  Attendence List 
    </label>

 <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
      <input
        type="radio"
        name="configTab"
        value="SalaryList"
        checked={selectedPage === 'SalaryList'}
        onChange={() => setSelectedPage('SalaryList')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
  Staff Salary List
    </label>
 <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
      <input
        type="radio"
        name="configTab"
        value="DailySalaryList"
        checked={selectedPage === 'DailySalaryList'}
        onChange={() => setSelectedPage('DailySalaryList')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
Daily Wages Salary List
    </label>

  </div>

</div>




      {/* Render selected page with view prop */}
      <div>
        {selectedPage==='EmployeeList'?(<EmployeeList/>)
        // :(selectedPage==="Matrix")?(<Matrix/>):
        // (selectedPage==="attendenceList")?(<attendenceList/>)
        
        :<EmployeeList/>
        
         
        }
      </div>
    </div>
  );
}

export default Report;
