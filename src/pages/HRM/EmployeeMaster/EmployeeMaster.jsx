import React, { useState } from "react";
import ViewEmployee from "./ViewEmployee";
import AddEmployee from "./AddEmployee";


function EmployeeMaster() {
  const [selectedPage, setSelectedPage] = useState("ViewEmployee"); // ViewEmployee | AddEmployee

  const renderContent = () => {
    if (selectedPage === "ViewEmployee") return <ViewEmployee />;
    if (selectedPage === "AddEmployee") return <AddEmployee />;
    return null;
  };

  return (
    <div style={{ minHeight: "80vh" }}>
      <h2 style={{ textAlign: "left", color: "#0066cc", marginBottom: "10px" }}>
        Employee Master  
      </h2>

      {/* Selector row */}
      <div
        style={{
          display: "flex",
          gap: "30px",
          marginTop: "15px",
          marginBottom: "15px",
          padding: "14px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.07)",
          background: "#fff",
        }}
      >
        <label style={{ fontWeight: 600, fontSize: "16px", cursor: "pointer" }}>
          <input
            type="radio"
            name="EmployeeMasterTab"
            value="ViewEmployee"
            checked={selectedPage === "ViewEmployee"}
            onChange={() => setSelectedPage("ViewEmployee")}
            style={{ marginRight: "8px" }}
          />
          View Employee
        </label>

        <label style={{ fontWeight: 600, fontSize: "16px", cursor: "pointer" }}>
          <input
            type="radio"
            name="EmployeeMasterTab"
            value="AddEmployee"
            checked={selectedPage === "AddEmployee"}
            onChange={() => setSelectedPage("AddEmployee")}
            style={{ marginRight: "8px" }}
          />
          Add Employee
        </label>
      </div>

      {/* Content */}
      <div>{renderContent()}</div>
    </div>
  );
}

export default EmployeeMaster;
