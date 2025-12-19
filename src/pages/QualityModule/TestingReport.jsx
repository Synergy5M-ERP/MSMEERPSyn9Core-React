
import React, { useState } from "react";
import NotCreated from "../../components/NotCreated";


function TestingReport() {
  const [selectedPage, setSelectedPage] = useState("TapeTesting");
// active or inactive

  return (
    <div style={{ minHeight: "80vh"}}>
      <h2 style={{ textAlign: "left", color: "#0066cc", marginBottom: 0 }}>
       Testing Report
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
        value="TapeTesting"
        checked={selectedPage === 'TapeTesting'}
        onChange={() => setSelectedPage('TapeTesting')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
 Tape Testing Report
    </label>
   <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
      <input
        type="radio"
        name="configTab"
        value="searchTesting"
        checked={selectedPage === 'searchTesting'}
        onChange={() => setSelectedPage('searchTesting')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
  Search Testing Report
    </label>

  </div>

</div>




      {/* Render selected page with view prop */}
      <div>
        {selectedPage==='TapeTesting'?(<NotCreated/>)
        :(selectedPage==="searchTesting")?(<NotCreated/>)
        
        :<NotCreated/>
        
         
        }
      </div>
    </div>
  );
}

export default TestingReport;
