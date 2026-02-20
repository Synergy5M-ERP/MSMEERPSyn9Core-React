
import React, { useState } from "react";
import PaymentAllocation from "./PaymentAllocation";
import ReceivableAllocation from "./ReceivableAllocation";
function FinancialConfiguration() {
    const [selectedPage, setSelectedPage] = useState("paymentAllocation");
 return (
        <div style={{ minHeight: "80vh" }}>
            <h2 style={{ textAlign: "left", color: "#0066cc", margin: "12px" }}>
                FinancialConfiguration
            </h2>

            {/* Page Selector */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between', // space between two groups
                    alignItems: 'center',
                    gap: '30px',
                    // marginTop: '22px',
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
                            value="paymentAllocation"
                            checked={selectedPage === 'paymentAllocation'}
                            onChange={() => setSelectedPage('paymentAllocation')}
                            style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
                        />
                       Payment Allocation
                    </label>

                    <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
                        <input
                            type="radio"
                            name="configTab"
                            value="receivableAllocation"
                            checked={selectedPage === 'receivableAllocation'}
                            onChange={() => setSelectedPage('receivableAllocation')}
                            style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
                        />
                        Receivable Allocation
                    </label>


                 
                </div>


            </div>
 <div>
                {
                
                selectedPage === 'paymentAllocation' ? (<PaymentAllocation />) : selectedPage === 'receivableAllocation'? (
                    <ReceivableAllocation />
                )
               :(<paymentAllocation/>)
                }
            </div>
        </div>
    );
}

export default FinancialConfiguration;
