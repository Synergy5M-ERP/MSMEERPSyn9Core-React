
import React, { useState } from "react";
import NotCreated from "../../../components/NotCreated";





function  AlternateItem() {
    const [selectedPage, setSelectedPage] = useState("createAlternateItem");


    return (
        <div style={{ minHeight: "80vh" }}>
            <h2 style={{ textAlign: "left", color: "#0066cc", marginBottom: 0 }}>
                 Alternate Item Master
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
                            value="createAlternateItem"
                            checked={selectedPage === 'createAlternateItem'}
                            onChange={() => setSelectedPage('createAlternateItem')}
                            style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
                        />
                        Create Alternate Item
                    </label>

                    <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
                        <input
                            type="radio"
                            name="configTab"
                            value="viewAlternateItem"
                            checked={selectedPage === 'viewAlternateItem'}
                            onChange={() => setSelectedPage('viewAlternateItem')}
                            style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
                        />
                        View Alternate Item
                    </label>
 {/* <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
                        <input
                            type="radio"
                            name="configTab"
                            value="AmendAlternateItem"
                            checked={selectedPage === 'AmendAlternateItem'}
                            onChange={() => setSelectedPage('AmendAlternateItem')}
                            style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
                        />
                        Amend Alternate Item
                    </label> */}


             
                </div>


            </div>
 <div>
                {
                
                selectedPage === 'createAlternateItem' ? (<NotCreated />) : selectedPage === 'viewAlternateItem'? (
                    <NotCreated />
                )
                : selectedPage === 'AmendAlternateItem'? (<NotCreated/>):(<NotCreated/>)
                }
            </div>
        </div>
    );
}

export default  AlternateItem;
