
import React, { useState } from "react";

import CheckInvoice from "./CheckInvoice";
import ApprovedInvoice from "./ApprovedInvoice";

function AccountSale() {
  const [selectedPage, setSelectedPage] = useState("checkInvoice");


  return (
    <div style={{ minHeight: "80vh"}}>
      <h2 style={{ textAlign: "left", color: "#0066cc", marginBottom: 0 }}>
        Account Sale
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
        value="checkInvoice"
        checked={selectedPage === 'checkInvoice'}
        onChange={() => setSelectedPage('checkInvoice')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
  Check Invoice
    </label>
   <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
      <input
        type="radio"
        name="configTab"
        value="ApproveInvoice"
        checked={selectedPage === 'ApproveInvoice'}
        onChange={() => setSelectedPage('ApproveInvoice')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
   Approve Invoice
    </label>
 
  </div>

</div>




      {/* Render selected page with view prop */}
      <div>
      {selectedPage==='checkInvoice'?(<CheckInvoice/>):<ApprovedInvoice/>
        
         
        }
      </div>
    </div>
  );
}

export default AccountSale;
