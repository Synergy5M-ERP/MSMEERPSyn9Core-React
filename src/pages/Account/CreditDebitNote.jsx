
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
  className="radio-btn-header"
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
