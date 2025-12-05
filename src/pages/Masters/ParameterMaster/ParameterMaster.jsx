
import React, { useState } from "react";
import NotCreated from "../../../components/NotCreated";
function  ParameterMaster() {
    const [selectedPage, setSelectedPage] = useState("create");


    return (
        <div style={{ minHeight: "80vh" }}>
            <h2 style={{ textAlign: "left", color: "#0066cc", marginBottom: 0 }}>
                  Parameter Master
            </h2>

            {/* Page Selector */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between', // space between two groups
                    alignParameters: 'center',
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
                            value="create"
                            checked={selectedPage === 'create'}
                            onChange={() => setSelectedPage('create')}
                            style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
                        />
                        Create  Parameter
                    </label>

                    <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
                        <input
                            type="radio"
                            name="configTab"
                            value="view"
                            checked={selectedPage === 'view'}
                            onChange={() => setSelectedPage('view')}
                            style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
                        />
                        View  
                    </label>



             
                </div>


            </div>
 <div>
                {
                
                selectedPage === 'create' ? (<NotCreated />) : selectedPage === 'view'? (
                    <NotCreated />
                )
               :(<NotCreated/>)
                }
            </div>
        </div>
    );
}

export default  ParameterMaster;
