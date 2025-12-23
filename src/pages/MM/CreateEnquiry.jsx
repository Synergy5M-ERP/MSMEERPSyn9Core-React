
import React, { useState } from "react";
import CreateItem from "../Masters/ItemMaster/CreateItem";
import CreateVendor from "../Masters/vendorMaster/CreateVendor";


function CreateEnquiry() {
  const [selectedPage, setSelectedPage] = useState("domestic");
  const [view, setView] = useState("active"); // active or inactive

  return (
    <div style={{ minHeight: "80vh"}}>
      <h2 style={{ textAlign: "left", color: "#0066cc", marginBottom: 0 }}>
        Create Enquiry
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
        value="domestic"
        checked={selectedPage === 'domestic'}
        onChange={() => setSelectedPage('domestic')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
   Domestic
    </label>
   <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
      <input
        type="radio"
        name="configTab"
        value="International"
        checked={selectedPage === 'International'}
        onChange={() => setSelectedPage('International')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
International
    </label>
 

 {/* <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
      <input
        type="radio"
        name="configTab"
        value="Amend"
        checked={selectedPage === 'Amend'}
        onChange={() => setSelectedPage('Amend')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
Amend
    </label> */}


 <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
      <input
        type="radio"
        name="configTab"
        value="view"
        checked={selectedPage === 'view'}
        onChange={() => setSelectedPage('view')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
View Enquiry/ standard Report
    </label>
     <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
      <input
        type="radio"
        name="configTab"
        value="crystalreport"
        checked={selectedPage === 'crystalreport'}
        onChange={() => setSelectedPage('crystalreport')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
Crystal Report
    </label>
  </div>

</div>




      {/* Render selected page with view prop */}
      <div>
        {/* {selectedPage==='domestic'?(<CreateItem/>):<CreateVendor/>} */}
      </div>
    </div>
  );
}

export default CreateEnquiry;
