
import React, { useState } from "react";
import AccountFiscalPeriod from "./AccountFiscalPeriod";
import AccountBankDetails from "./AccountBankDetails";
import ViewBank from "./ViewBank";
import AccountLedger from "./AccountLedger";
import CreateVoucherType from "../Account/AccountVoucherType";

function AccountConfiguration() {
  const [selectedPage, setSelectedPage] = useState("accountledger");
  const [view, setView] = useState("active"); // active or inactive

  return (
    <div style={{ minHeight: "80vh"}}>
      <h2 style={{ textAlign: "left", color: "#0066cc", marginBottom: 0 }}>
        Account Configuration
      </h2>

      {/* Page Selector */}
 <div className="radio-btn-header">
  <div style={{ display: 'flex', gap: '30px' /* group left radio buttons with gap */ }}>

  <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
      <input
        type="radio"
        name="configTab"
        value="accountledger"
        checked={selectedPage === 'accountledger'}
        onChange={() => setSelectedPage('accountledger')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
    Account Ledger
    </label>
   <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
      <input
        type="radio"
        name="configTab"
        value="accountvoucher"
        checked={selectedPage === 'accountvoucher'}
        onChange={() => setSelectedPage('accountvoucher')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
    Account Voucher Type
    </label>
    <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
      <input
        type="radio"
        name="configTab"
        value="fiscal"
        checked={selectedPage === 'fiscal'}
        onChange={() => setSelectedPage('fiscal')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
      Fiscal Period
    </label>
    <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
      <input
        type="radio"
        name="configTab"
        value="bank"
        checked={selectedPage === 'bank'}
        onChange={() => setSelectedPage('bank')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
      Bank Detail
    </label>
     <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
      <input
        type="radio"
        name="configTab"
        value="viewbank"
        checked={selectedPage === 'viewbank'}
        onChange={() => setSelectedPage('viewbank')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
    View Bank
    </label>
  </div>

  <div style={{ display: 'flex', gap: '30px' /* group right radio buttons with gap */ }}>
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
  </div>
</div>




      {/* Render selected page with view prop */}
       <div>
        {selectedPage === "accountledger" ? (
          <AccountLedger view={view} />
        ) : selectedPage === "accountvoucher" ? (
          <CreateVoucherType view={view} />
        ) : selectedPage === "fiscal" ? (
          <AccountFiscalPeriod view={view} />
        ) : selectedPage === "bank" ? (
          <AccountBankDetails view={view} />
        ) : (
          <ViewBank view={view} />
        )}
      </div>
    </div>
  );
}

export default AccountConfiguration;
