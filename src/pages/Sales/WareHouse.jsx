
import React, { useState } from "react";

import NotCreated from "../../components/NotCreated";

function WareHouse() {
  const [selectedPage, setSelectedPage] = useState("CustomizedFinish");
  const [view, setView] = useState("active"); // active or inactive

  return (
    <div style={{ minHeight: "80vh"}}>
      <h2 style={{ textAlign: "left", color: "#0066cc", marginBottom: 0 }}>
        Ware House
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
        value="CustomizedFinish"
        checked={selectedPage === 'CustomizedFinish'}
        onChange={() => setSelectedPage('CustomizedFinish')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
   Customized Finish Inward
    </label>
   <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
      <input
        type="radio"
        name="configTab"
        value="GenericFinish"
        checked={selectedPage === 'GenericFinish'}
        onChange={() => setSelectedPage('GenericFinish')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
    Generic Finish
    </label>
 

 <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
      <input
        type="radio"
        name="configTab"
        value="Inventory"
        checked={selectedPage === 'Inventory'}
        onChange={() => setSelectedPage('Inventory')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
    Inventory
    </label>
 

  </div>

</div>




      {/* Render selected page with view prop */}
      <div>
        {selectedPage==='CustomizedFinish'?(<NotCreated/>):selectedPage==='GenericFinish'?(<NotCreated/>):<NotCreated/>
        
         
        }
      </div>
    </div>
  );
}

export default WareHouse;
