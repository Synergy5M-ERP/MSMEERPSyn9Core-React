
import React, { useState } from "react";
import NotCreated from "../../../components/NotCreated";





function  FloorInventoryMaster() {
    const [selectedPage, setSelectedPage] = useState("createFloorInventory");


    return (
        <div style={{ minHeight: "80vh" }}>
            <h2 style={{ textAlign: "left", color: "#0066cc", marginBottom: 0 }}>
                  Floor Inventory Master
            </h2>

            {/* Page Selector */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between', // space between two groups
                    alignFloorInventorys: 'center',
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
                            value="createFloorInventory"
                            checked={selectedPage === 'createFloorInventory'}
                            onChange={() => setSelectedPage('createFloorInventory')}
                            style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
                        />
                        Create  Floor Inventory
                    </label>

                    <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
                        <input
                            type="radio"
                            name="configTab"
                            value="viewFloorInventory"
                            checked={selectedPage === 'viewFloorInventory'}
                            onChange={() => setSelectedPage('viewFloorInventory')}
                            style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
                        />
                        View  Floor Inventory
                    </label>



             
                </div>


            </div>
 <div>
                {
                
                selectedPage === 'createFloorInventory' ? (<NotCreated />) : selectedPage === 'viewFloorInventory'? (
                    <NotCreated />
                )
                :(<NotCreated/>)
                }
            </div>
        </div>
    );
}

export default  FloorInventoryMaster;
