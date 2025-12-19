
import React, { useState } from "react";
import CreateItem from "../Masters/ItemMaster/CreateItem";


function EnquiryStatus() {
  const [selectedPage, setSelectedPage] = useState("ManualPR");
  const [view, setView] = useState("active"); // active or inactive

  return (
    <div style={{ minHeight: "80vh"}}>
      <h2 style={{ textAlign: "left", color: "#0066cc", marginBottom: 0 }}>
        Enquiry Status
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
        value="ManualPR"
        checked={selectedPage === 'ManualPR'}
        onChange={() => setSelectedPage('ManualPR')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
   Manual PR Status
    </label>
   <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
      <input
        type="radio"
        name="configTab"
        value="AutoPR"
        checked={selectedPage === 'AutoPR'}
        onChange={() => setSelectedPage('AutoPR')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
   Auto PR Status
    </label>
 
  </div>

</div>




      {/* Render selected page with view prop */}
      <div>
        {/* {selectedPage==='ManualPR'?(<CreateItem/>):<CreateVendor/>} */}
      </div>
    </div>
  );
}

export default EnquiryStatus;
