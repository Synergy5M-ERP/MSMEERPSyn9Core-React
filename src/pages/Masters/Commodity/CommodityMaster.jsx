
import React, { useState } from "react";
import createcommodity from "../Commodity/CreateCommodity";
import ViewCommodity from "./ViewCommodity";
import CreateCommodity from "../Commodity/CreateCommodity";





function CommodityMaster() {
    const [selectedPage, setSelectedPage] = useState("createcommodity");


    return (
        <div style={{ minHeight: "80vh" }}>
            <h2 style={{ textAlign: "left", color: "#0066cc", marginBottom: 0 }}>
                Commodity Master
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
                            value="createcommodity"
                            checked={selectedPage === 'createcommodity'}
                            onChange={() => setSelectedPage('createcommodity')}
                            style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
                        />
                        Create Commodity
                    </label>

                    <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
                        <input
                            type="radio"
                            name="configTab"
                            value="viewCommodity"
                            checked={selectedPage === 'viewCommodity'}
                            onChange={() => setSelectedPage('viewCommodity')}
                            style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
                        />
                        View Commodity
                    </label>

                </div>


            </div>
 <div>
                {
                
                selectedPage === 'createcommodity' ? (<CreateCommodity />) :(
                    <ViewCommodity />
                )
              
                }
            </div>
        </div>
    );
}

export default CommodityMaster;
