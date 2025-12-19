
import React, { useState } from "react";
import NotCreated from "../../components/NotCreated";
function  DirecteExternalSO() {
    const [selectedPage, setSelectedPage] = useState("DirectSO");
return (
        <div style={{ minHeight: "80vh" }}>
            <h2 style={{ textAlign: "left", color: "#0066cc", marginBottom: 0 }}>
                 Direct External SO
            </h2>

            {/* Page Selector */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between', // space between two groups
                    alignSOs: 'center',
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
                            value="DirectSO"
                            checked={selectedPage === 'DirectSO'}
                            onChange={() => setSelectedPage('DirectSO')}
                            style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
                        />
                       Direct SO
                    </label>

                     <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
                        <input
                            type="radio"
                            name="configTab"
                            value="ExternalSO"
                            checked={selectedPage === 'ExternalSO'}
                            onChange={() => setSelectedPage('ExternalSO')}
                            style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
                        />
                 External SO
                    </label>

                    <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
                        <input
                            type="radio"
                            name="configTab"
                            value="ViewSO"
                            checked={selectedPage === 'ViewSO'}
                            onChange={() => setSelectedPage('ViewSO')}
                            style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
                        />
                        View/Standard Report
                    </label>
 {/* <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
                        <input
                            type="radio"
                            name="configTab"
                            value="AmendSO"
                            checked={selectedPage === 'AmendSO'}
                            onChange={() => setSelectedPage('AmendSO')}
                            style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
                        />
                        Amend 
                    </label> */}

 <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
                        <input
                            type="radio"
                            name="configTab"
                            value="status"
                            checked={selectedPage === 'status'}
                            onChange={() => setSelectedPage('status')}
                            style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
                        />
                      Direct SO  Status 
                    </label>
             
                </div>


            </div>
 <div>
                {
                
                selectedPage === 'DirectSO' ? (<NotCreated />) :  selectedPage === 'ExternalSO' ? (<NotCreated />) :  selectedPage === 'ViewSO'? (
                    <NotCreated />
                )
               :(<NotCreated/>)
                }
            </div>
        </div>
    );
}

export default  DirecteExternalSO;
