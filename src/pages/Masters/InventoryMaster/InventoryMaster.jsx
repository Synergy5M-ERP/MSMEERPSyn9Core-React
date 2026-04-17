
import React, { useState } from "react";
import NotCreated from "../../../components/NotCreated";
import InventoryAdd from "./InventoryAdd";
import InventoryPage from "./InventoryEdit";





function  InventoryEdit() {
    const [selectedPage, setSelectedPage] = useState("createInventory");


    return (
        <div style={{ minHeight: "80vh" }}>
            <h2 style={{ textAlign: "left", color: "#0066cc", marginBottom: 0 }}>
                  Inventory Master
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
                
                selectedPage === 'createInventory' ? (<InventoryAdd />) : selectedPage === 'viewInventory'? (
                    < InventoryPage/>
                )
                : selectedPage === 'AmendInventory'? (<NotCreated/>):(<NotCreated/>)
                }
            </div>
        </div>
    );
}

export default  InventoryEdit;
