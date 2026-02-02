import React, { useState } from "react";
import CreateBOM from "./CreateBOM";
import ViewBOM from "./ViewBOM";

function BOM() {
  const [selectedPage, setSelectedPage] = useState("createBOM"); // createBOM | viewBOM

  const renderContent = () => {
    if (selectedPage === "createBOM") return <CreateBOM />;
    if (selectedPage === "viewBOM") return <ViewBOM />;
    return null;
  };

  return (
    <div style={{ minHeight: "80vh" }}>
      <h2 style={{ textAlign: "left", color: "#0066cc", marginBottom: "10px" }}>
        BOM Management
      </h2>

      {/* Selector row */}
      <div
        className="radio-btn-header"
      >
        <label style={{ fontWeight: 600, fontSize: "16px", cursor: "pointer" }}>
          <input
            type="radio"
            name="bomTab"
            value="createBOM"
            checked={selectedPage === "createBOM"}
            onChange={() => setSelectedPage("createBOM")}
            style={{ marginRight: "8px" }}
          />
          Create BOM
        </label>

        <label style={{ fontWeight: 600, fontSize: "16px", cursor: "pointer" }}>
          <input
            type="radio"
            name="bomTab"
            value="viewBOM"
            checked={selectedPage === "viewBOM"}
            onChange={() => setSelectedPage("viewBOM")}
            style={{ marginRight: "8px" }}
          />
          View BOM List
        </label>
      </div>

      {/* Content */}
      <div>{renderContent()}</div>
    </div>
  );
}

export default BOM;
