
import React, { useState } from "react";
import CreateVendor from "./CreateVendor";
import ViewVendor from "./ViewVendor";





function VendorMaster() {
    const [selectedPage, setSelectedPage] = useState("createvendor");


    return (
        <div style={{ minHeight: "80vh" }}>
            <h2 style={{ textAlign: "left", color: "#0066cc", marginBottom: 0 }}>
                Vendor Master
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
                            value="createvendor"
                            checked={selectedPage === 'createvendor'}
                            onChange={() => setSelectedPage('createvendor')}
                            style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
                        />
                        Create vendor
                    </label>

                    <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
                        <input
                            type="radio"
                            name="configTab"
                            value="viewvendor"
                            checked={selectedPage === 'viewvendor'}
                            onChange={() => setSelectedPage('viewvendor')}
                            style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
                        />
                        View Vendor
                    </label>

                </div>


            </div>
 <div>
                {
                
                selectedPage === 'createvendor' ? (<CreateVendor />) :(
                    <ViewVendor />
                )
              
                }
            </div>
        </div>
    );
}

export default VendorMaster;
