
import React, { useState } from "react";
import NotCreated from "../../components/NotCreated";
function  Enquiry() {
    const [selectedPage, setSelectedPage] = useState("ExternalEnquiry");
return (
        <div style={{ minHeight: "80vh" }}>
            <h2 style={{ textAlign: "left", color: "#0066cc", marginBottom: 0 }}>
                 Enquiry
            </h2>

            {/* Page Selector */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between', // space between two groups
                    alignEnquirys: 'center',
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
                            value="ExternalEnquiry"
                            checked={selectedPage === 'ExternalEnquiry'}
                            onChange={() => setSelectedPage('ExternalEnquiry')}
                            style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
                        />
                       External Enquiry
                    </label>

                     <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
                        <input
                            type="radio"
                            name="configTab"
                            value="onCallEnquiry"
                            checked={selectedPage === 'onCallEnquiry'}
                            onChange={() => setSelectedPage('onCallEnquiry')}
                            style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
                        />
                    On Call Enquiry
                    </label>

                    <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
                        <input
                            type="radio"
                            name="configTab"
                            value="viewEnquiry"
                            checked={selectedPage === 'viewEnquiry'}
                            onChange={() => setSelectedPage('viewEnquiry')}
                            style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
                        />
                        View/Standard Report
                    </label>
 {/* <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
                        <input
                            type="radio"
                            name="configTab"
                            value="AmendEnquiry"
                            checked={selectedPage === 'AmendEnquiry'}
                            onChange={() => setSelectedPage('AmendEnquiry')}
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
                      External Enquiry  Status 
                    </label>
             
                </div>


            </div>
 <div>
                {
                
                selectedPage === 'ExternalEnquiry' ? (<NotCreated />) :  selectedPage === 'onCallEnquiry' ? (<NotCreated />) :  selectedPage === 'viewEnquiry'? (
                    <NotCreated />
                )
               :(<NotCreated/>)
                }
            </div>
        </div>
    );
}

export default  Enquiry;
