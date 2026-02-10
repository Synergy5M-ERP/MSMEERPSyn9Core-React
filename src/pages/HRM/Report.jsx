import React, { useState } from "react";

import ViewEmployee from "../HRM/EmployeeMaster/ViewEmployee";
import CreateMatrix from "../HRM/CreateMatrix";
import EmployeeAttendanceView from "../HRM/EmployeeAttendanceView";

function Report() {
  const [selectedPage, setSelectedPage] = useState("EmployeeList");
  const [employeeStatus, setEmployeeStatus] = useState("Active");

  return (
    <div style={{ minHeight: "80vh" }}>
      <h2 style={{ textAlign: "left", color: "#0066cc", marginBottom: 0 }}>
        Standard Report
      </h2>

      {/* Page Selector */}
      <div
        style={{
          display: "flex",
          gap: "30px",
          marginTop: "22px",
          marginBottom: "12px",
          padding: "14px 5px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.07)",
          background: "#fff",
        }}
      >
        <label>
          <input
            type="radio"
            name="configTab"
            checked={selectedPage === "EmployeeList"}
            onChange={() => setSelectedPage("EmployeeList")}
          />
          Employee List
        </label>

        <label>
          <input
            type="radio"
            name="configTab"
            checked={selectedPage === "Matrix"}
            onChange={() => setSelectedPage("Matrix")}
          />
          Matrix
        </label>

<label>
  <input
    type="radio"
    name="configTab"
    checked={selectedPage === "AttendanceList"}
    onChange={() => setSelectedPage("AttendanceList")}
  />
  Daily Attendance List
</label>

      </div>

      {/* Render Pages */}
      {selectedPage === "EmployeeList" && (
        <ViewEmployee statusFilter={employeeStatus} />
      )}

      {selectedPage === "Matrix" && <CreateMatrix />}

      {selectedPage === "AttendanceList" && <EmployeeAttendanceView />}
    </div>
  );
}

export default Report;
