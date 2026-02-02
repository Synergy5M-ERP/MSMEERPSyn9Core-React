
import React, { useState } from "react";

import CheckPayable from "./CheckPayable";
import ApprovedPayable from "./ApprovedPayable";


function AccountGRN() {
  const [selectedPage, setSelectedPage] = useState("checkPayable");


  return (
    <div style={{ minHeight: "80vh"}}>
      <h2 style={{ textAlign: "left", color: "#0066cc", marginBottom: 0 }}>
        GRN Bill Passing
      </h2>

      {/* Page Selector */}
 <div
 className="radio-btn-header"
>
  <div style={{ display: 'flex', gap: '30px' /* group left radio buttons with gap */ }}>

  <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
      <input
        type="radio"
        name="configTab"
        value="checkPayable"
        checked={selectedPage === 'checkPayable'}
        onChange={() => setSelectedPage('checkPayable')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
  Check Payable
    </label>
   <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
      <input
        type="radio"
        name="configTab"
        value="approvePayable"
        checked={selectedPage === 'approvePayable'}
        onChange={() => setSelectedPage('approvePayable')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
   Approve Payable
    </label>
 
  </div>

</div>




      {/* Render selected page with view prop */}
      <div>
        {selectedPage==='checkPayable'?(<CheckPayable/>):<ApprovedPayable/>
        
         
        }
      </div>
    </div>
  );
}

export default AccountGRN;
