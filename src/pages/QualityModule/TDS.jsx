
import React, { useState } from "react";
import NotCreated from "../../components/NotCreated";





function TDSMaster() {
    const [selectedPage, setSelectedPage] = useState("createTDS");


    return (
        <div style={{ minHeight: "80vh" }}>
            <h2 style={{ textAlign: "left", color: "#0066cc", marginBottom: 0 }}>
                TDS Master
            </h2>

            {/* Page Selector */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between', // space between two groups
                    alignTDSs: 'center',
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
                            value="createTDS"
                            checked={selectedPage === 'createTDS'}
                            onChange={() => setSelectedPage('createTDS')}
                            style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
                        />
                        Create TDS
                    </label>

                    <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
                        <input
                            type="radio"
                            name="configTab"
                            value="viewTDS"
                            checked={selectedPage === 'viewTDS'}
                            onChange={() => setSelectedPage('viewTDS')}
                            style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
                        />
                        View TDS
                    </label>
 <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
                        <input
                            type="radio"
                            name="configTab"
                            value="CompareTDS"
                            checked={selectedPage === 'CompareTDS'}
                            onChange={() => setSelectedPage('CompareTDS')}
                            style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
                        />
                        Compare TDS
                    </label>

{/* 
                     <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
                        <input
                            type="radio"
                            name="configTab"
                            value="Edit"
                            checked={selectedPage === 'Edit'}
                            onChange={() => setSelectedPage('Edit')}
                            style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
                        />
                      Edit
                    </label> */}
                </div>


            </div>
 <div>
                {
                
                selectedPage === 'createTDS' ? (<NotCreated />) : selectedPage === 'viewTDS'? (
                    <NotCreated />
                )
                : selectedPage === 'CompareTDS'? (<NotCreated/>):(<NotCreated/>)
                }
            </div>
        </div>
    );
}

export default TDSMaster;
