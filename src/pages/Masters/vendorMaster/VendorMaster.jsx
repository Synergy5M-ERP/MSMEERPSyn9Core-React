
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
               className="radio-btn-header"
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
