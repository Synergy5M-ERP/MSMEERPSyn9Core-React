
import React, { useState } from "react";
import AccountVoucher from "./AccountVoucher";
import VoucherList from "./VoucherList";


function VoucherConfiguration() {
  const [selectedPage, setSelectedPage] = useState("accountVoucher");
  const [view, setView] = useState("active"); // active or inactive

  return (
    <div style={{ minHeight: "80vh"}}>
      <h2 style={{ textAlign: "left", color: "#0066cc", marginBottom: 0 }}>
    Account Voucher Configuration
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
        value="accountVoucher"
        checked={selectedPage === 'accountVoucher'}
        onChange={() => setSelectedPage('accountVoucher')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
    Account Voucher
    </label>
 
    <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
      <input
        type="radio"
        name="configTab"
        value="viewVoucher"
        checked={selectedPage === 'viewVoucher'}
        onChange={() => setSelectedPage('viewVoucher')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
      View Voucher 
    </label>

  </div>

  {/* <div style={{ display: 'flex', gap: '30px'  }}>
    <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
      <input
        type="radio"
        name="viewStatus"
        value="active"
        checked={view === 'active'}
        onChange={() => setView('active')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
      Active
    </label>
    <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
      <input
        type="radio"
        name="viewStatus"
        value="inactive"
        checked={view === 'inactive'}
        onChange={() => setView('inactive')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
      Inactive
    </label>
  </div> */}
</div>




      {/* Render selected page with view prop */}
      <div>
        {selectedPage==='accountVoucher'?(<AccountVoucher view={view} />
):(
            <VoucherList/>
        )}
      </div>
    </div>
  );
}

export default VoucherConfiguration;
