
import React, { useState } from "react";
import CreateItem from "./CreateItem";
import Viewitem from "./Viewitem";
import AmendItem from "./AmendItem";
import UploadExcel from "./UploadExcel";




function ItemMaster() {
    const [selectedPage, setSelectedPage] = useState("createitem");


    return (
        <div style={{ minHeight: "80vh" }}>
            <h2 style={{ textAlign: "left", color: "#0066cc", marginBottom: 0 }}>
                ItemMaster
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
                            value="createitem"
                            checked={selectedPage === 'createitem'}
                            onChange={() => setSelectedPage('createitem')}
                            style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
                        />
                        Create Item
                    </label>

                    <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
                        <input
                            type="radio"
                            name="configTab"
                            value="viewItem"
                            checked={selectedPage === 'viewItem'}
                            onChange={() => setSelectedPage('viewItem')}
                            style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
                        />
                        View Item
                    </label>
 {/* <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
                        <input
                            type="radio"
                            name="configTab"
                            value="AmendItem"
                            checked={selectedPage === 'AmendItem'}
                            onChange={() => setSelectedPage('AmendItem')}
                            style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
                        />
                        Amend Item
                    </label> */}


                     <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
                        <input
                            type="radio"
                            name="configTab"
                            value="UploadExcel"
                            checked={selectedPage === 'UploadExcel'}
                            onChange={() => setSelectedPage('UploadExcel')}
                            style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
                        />
                       Upload Excel
                    </label>
                </div>


            </div>
 <div>
                {
                
                selectedPage === 'createitem' ? (<CreateItem />) : selectedPage === 'viewItem'? (
                    <Viewitem />
                )
                : selectedPage === 'AmendItem'? (<AmendItem/>):(<UploadExcel/>)
                }
            </div>
        </div>
    );
}

export default ItemMaster;
