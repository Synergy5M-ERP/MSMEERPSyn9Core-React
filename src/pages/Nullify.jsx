
import React, { useState } from "react";

import VoucherList from "./VoucherList";
import AccountsaleNullify from "./AccountsaleNullify";
import AccountpurchaseNullify from "./AccountpurchaseNullify";


function Nullify() {
  const [selectedPage, setSelectedPage] = useState("saleNullify");


  return (
    <div style={{ minHeight: "80vh"}}>
      <h2 style={{ textAlign: "left", color: "#0066cc", marginBottom: 0 }}>
 Nullify
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
        value="saleNullify"
        checked={selectedPage === 'saleNullify'}
        onChange={() => setSelectedPage('saleNullify')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
  Sale Nullify
    </label>
 
    <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
      <input
        type="radio"
        name="configTab"
        value="purchaseNullify"
        checked={selectedPage === 'purchaseNullify'}
        onChange={() => setSelectedPage('purchaseNullify')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
purchase Nullify
    </label>

  </div>

 
</div>




      <div>
        {selectedPage==='saleNullify'?(<AccountsaleNullify/>
):(
            <AccountpurchaseNullify/>
        )}
      </div>
    </div>
  );
}

export default Nullify;
