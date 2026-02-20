import React, { useState } from "react";
import ViewEmployee from "./ViewEmployee";
import AddEmployee from "./AddEmployee";

function EmployeeMaster() {
  const [selectedPage, setSelectedPage] = useState("ViewEmployee"); // ViewEmployee | AddEmployee
  const [employeeStatus, setEmployeeStatus] = useState("Active"); // All | Active | Inactive

  const renderContent = () => {
    if (selectedPage === "ViewEmployee")
      return <ViewEmployee statusFilter={employeeStatus} />;
    if (selectedPage === "AddEmployee") return <AddEmployee />;
    return null;
  };

  return (
    <div style={{ minHeight: "80vh" }}>
      <h2
        style={{
          textAlign: "left",
          color: "#0066cc",
          marginBottom: "10px",
        }}
      >
        Employee Master
      </h2>

      {/* Selector Row */}
      <div
       className="radio-btn-header"
      >
        {/* Left side: View/Add Tabs */}
        <div style={{ display: "flex", gap: "20px" }}>
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

        {/* Right side: Active / Inactive / All filter */}
        {selectedPage === "ViewEmployee" && (
          <div style={{ display: "flex", gap: "15px" }}>
           

            <label style={{ fontWeight: 600, fontSize: "16px", cursor: "pointer" }}>
              <input
                type="radio"
                name="EmployeeStatus"
                value="Active"
                checked={employeeStatus === "Active"}
                onChange={() => setEmployeeStatus("Active")}
                style={{ marginRight: "6px" }}
              />
              Active
            </label>

            <label style={{ fontWeight: 600, fontSize: "16px", cursor: "pointer" }}>
              <input
                type="radio"
                name="EmployeeStatus"
                value="Inactive"
                checked={employeeStatus === "Inactive"}
                onChange={() => setEmployeeStatus("Inactive")}
                style={{ marginRight: "6px" }}
              />
              Inactive
            </label>
          </div>
        )}
      </div>

      {/* Content */}
      <div>{renderContent()}</div>
    </div>
  );
}

export default EmployeeMaster;
