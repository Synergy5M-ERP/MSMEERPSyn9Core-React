
import React, { useState } from "react";

import AccountCreditNote from "./AccountCreditNote";
import AccountDebitNote from "./AccountDebitNote";


function CreditDebitNote() {
  const [selectedPage, setSelectedPage] = useState("creditNote");
  const [view, setView] = useState("active"); // active or inactive

  return (
    <div style={{ minHeight: "80vh"}}>
      <h2 style={{ textAlign: "left", color: "#0066cc", marginBottom: 0 }}>
  Credit Debit Note
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
        value="creditNote"
        checked={selectedPage === 'creditNote'}
        onChange={() => setSelectedPage('creditNote')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
  Account  Credit Note
    </label>
 
    <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
      <input
        type="radio"
        name="configTab"
        value="debitNote"
        checked={selectedPage === 'debitNote'}
        onChange={() => setSelectedPage('debitNote')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
  Account   Debit Note
    </label>

  </div>

 
</div>




      {/* Render selected page with view prop */}
      <div>
        {selectedPage==='creditNote'?(<AccountCreditNote view={view} />
):(
            <AccountDebitNote/>
        )}
      </div>
    </div>
  );
}

export default CreditDebitNote;
