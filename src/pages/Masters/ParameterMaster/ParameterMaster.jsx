import React, { useState } from "react";
import NotCreated from "../../../components/NotCreated";
import CreateParameter from "./CreateParameter";

function ParameterMaster() {

    const [selectedPage, setSelectedPage] = useState("create");
    const [view, setView] = useState("active");

    return (

        <div style={{ minHeight: "80vh", padding: "20px" }}>

            <h2 style={{
                textAlign: "left",
                color: "#0066cc",
                marginBottom: "20px"
            }}>
                Parameter Master
            </h2>

            {/* Header */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px"
            }}>

                {/* Left */}
                <div style={{ display: "flex", gap: "30px" }}>
                    <label style={{ fontWeight: 600, fontSize: "18px", cursor: "pointer" }}>
                        <input
                            type="radio"
                            name="configTab"
                            value="create"
                            checked={selectedPage === "create"}
                            onChange={() => setSelectedPage("create")}
                            style={{ width: 18, height: 18, marginRight: "8px" }}
                        />
                        Create Parameter
                    </label>
                </div>

                {/* Right */}
             <div style={{ display: "flex", gap: "30px", paddingRight: "50px" }}>
                    <label style={{ fontWeight: 600, fontSize: "17px", cursor: "pointer" }}>
                        <input
                            type="radio"
                            name="viewStatus"
                            value="active"
                            checked={view === "active"}
                            onChange={() => setView("active")}
                            style={{ width: 18, height: 18, marginRight: "8px" }}
                        />
                        Active
                    </label>

                    <label style={{ fontWeight: 600, fontSize: "17px", cursor: "pointer" }}>
                        <input
                            type="radio"
                            name="viewStatus"
                            value="inactive"
                            checked={view === "inactive"}
                            onChange={() => setView("inactive")}
                            style={{ width: 18, height: 18, marginRight: "8px" }}
                        />
                        Inactive
                    </label>

                </div>

            </div>

            {/* Content */}
            {selectedPage === "create" && <CreateParameter view={view} />}
            {selectedPage === "view" && <NotCreated />}

        </div>
    );
}

export default ParameterMaster;