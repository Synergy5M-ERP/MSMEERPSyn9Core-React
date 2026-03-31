import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CreateVendor from "./CreateVendor";
import ViewVendor from "./ViewVendor";

function VendorMaster() {

    const location = useLocation();
    const navigate = useNavigate();
    const vendorId = location.state?.vendorId || null;

    const [selectedPage, setSelectedPage] = useState(
        vendorId ? "createvendor" : "viewvendor"
    );

    useEffect(() => {
        if (vendorId) {
            setSelectedPage("createvendor");
        }
    }, [vendorId]);

    const handleTabChange = (tab) => {
        setSelectedPage(tab);
        navigate("/masters", { replace: true, state: {} });
    };

    return (
        <div style={{ minHeight: "80vh", borderBottom: "2px solid #ccc" }}>

            <div className="radio-btn-header mt-2 mb-2">
                <div style={{
                    color: "#024991",
                    fontWeight: 700,
                    backgroundColor: "aliceblue",
                    fontSize: "20px",
                    padding: "5px 10px"
                }}>
                    Vendor Master
                </div>

                <div style={{
                    display: 'flex',
                    gap: '30px',
                    justifyContent: "center",
                    alignItems: "center",
                    // marginTop: "10px",
                    fontSize: "16px",
                }}>

                    <label style={{ cursor: "pointer", fontWeight: 600, }}>
                        <input
                            type="radio"
                            checked={selectedPage === "createvendor"}
                            onChange={() => handleTabChange("createvendor")}
                            style={{ marginRight: "8px" }}
                        />
                        Create Vendor
                    </label>

                    <label style={{ cursor: "pointer", fontWeight: 600, }}>
                        <input
                            type="radio"
                            checked={selectedPage === "viewvendor"}
                            onChange={() => handleTabChange("viewvendor")}
                            style={{ marginRight: "8px" }}
                        />
                        View Vendor
                    </label>

                </div>
            </div>

            <div>
                {selectedPage === "createvendor" ? (
                    <CreateVendor
                        vendorId={vendorId}
                        isEditMode={!!vendorId}
                    />
                ) : (
                    <ViewVendor />
                )}
            </div>
        </div>
    );
}

export default VendorMaster;