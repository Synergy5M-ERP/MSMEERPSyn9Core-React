
import React, { useState } from "react";


function GRN() {
  const [selectedPage, setSelectedPage] = useState("Create");
  const [view, setView] = useState("active"); // active or inactive

  return (
    <div style={{ minHeight: "80vh"}}>
      <h2 style={{ textAlign: "left", color: "#0066cc", marginBottom: 0 }}>
        GRN
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
        value="Create"
        checked={selectedPage === 'Create'}
        onChange={() => setSelectedPage('Create')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
    Create GRN
    </label>

    <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
      <input
        type="radio"
        name="configTab"
        value="view"
        checked={selectedPage === 'view'}
        onChange={() => setSelectedPage('view')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
View
    </label>
       <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
      <input
        type="radio"
        name="configTab"
        value="download"
        checked={selectedPage === 'download'}
        onChange={() => setSelectedPage('download')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
 GRN Download
    </label>
  </div>

</div>




      {/* Render selected page with view prop */}
      <div>
        {/* {selectedPage==='Create'?(<CreateItem/>):<CreateVendor/>} */}
      </div>
    </div>
  );
}

export default GRN;
