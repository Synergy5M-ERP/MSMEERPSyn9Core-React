
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
                style={{
                    display: 'flex',
                    justifyContent: 'space-between', // space between two groups
                    alignAlternateItems: 'center',
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
