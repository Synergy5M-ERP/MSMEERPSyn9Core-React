
import React, { useState } from "react";
import NotCreated from "../../../components/NotCreated";





function  InventoryMaster() {
    const [selectedPage, setSelectedPage] = useState("createInventory");


    return (
        <div style={{ minHeight: "80vh" }}>
            <h2 style={{ textAlign: "left", color: "#0066cc", marginBottom: 0 }}>
                  Inventory Master
            </h2>

            {/* Page Selector */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between', // space between two groups
                    alignInventorys: 'center',
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
                            value="createInventory"
                            checked={selectedPage === 'createInventory'}
                            onChange={() => setSelectedPage('createInventory')}
                            style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
                        />
                        Create  Inventory
                    </label>

                    <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
                        <input
                            type="radio"
                            name="configTab"
                            value="viewInventory"
                            checked={selectedPage === 'viewInventory'}
                            onChange={() => setSelectedPage('viewInventory')}
                            style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
                        />
                        View  Inventory
                    </label>
 {/* <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
                        <input
                            type="radio"
                            name="configTab"
                            value="AmendInventory"
                            checked={selectedPage === 'AmendInventory'}
                            onChange={() => setSelectedPage('AmendInventory')}
                            style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
                        />
                        Amend  Inventory
                    </label> */}


             
                </div>


            </div>
 <div>
                {
                
                selectedPage === 'createInventory' ? (<NotCreated />) : selectedPage === 'viewInventory'? (
                    <NotCreated />
                )
                : selectedPage === 'AmendInventory'? (<NotCreated/>):(<NotCreated/>)
                }
            </div>
        </div>
    );
}

export default  InventoryMaster;
