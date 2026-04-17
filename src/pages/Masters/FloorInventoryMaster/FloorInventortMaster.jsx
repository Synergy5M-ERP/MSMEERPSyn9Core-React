
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
                className="radio-btn-header"
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
