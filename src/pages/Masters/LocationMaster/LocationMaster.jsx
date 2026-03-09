import React, { useState } from "react";
import Create from "./Create";

function ViewPage() {
  return <div style={{ padding: "20px" }}>View Page Content</div>;
}

function PieChartPage() {
  return <div style={{ padding: "20px" }}>Pie Chart Page Content</div>;
}

function LocationMaster() {

  const [selectedPage, setSelectedPage] = useState("create");

  return (
    <div style={{ minHeight: "80vh", padding: "20px" }}>

      <h2 style={{ color: "#0066cc" }}>Location Master</h2>

      <div style={{ display: "flex", gap: "30px", marginTop: "10px" }}>

        {/* Create */}
        <label className="radio-label">
          <input
            type="radio"
            name="tab"
            value="create"
            checked={selectedPage === "create"}
            onChange={() => setSelectedPage("create")}
          />
          Create
        </label>

        {/* View */}
        <label className="radio-label">
          <input
            type="radio"
            name="tab"
            value="view"
            checked={selectedPage === "view"}
            onChange={() => setSelectedPage("view")}
          />
          View
        </label>

        {/* Pie Chart */}
        <label className="radio-label">
          <input
            type="radio"
            name="tab"
            value="pieChart"
            checked={selectedPage === "pieChart"}
            onChange={() => setSelectedPage("pieChart")}
          />
          Pie Chart
        </label>

      </div>

      {/* Page Load Area */}
      <div style={{ marginTop: "20px" }}>

        {selectedPage === "create" && <Create />}
        {selectedPage === "view" && <ViewPage />}
        {selectedPage === "pieChart" && <PieChartPage />}

      </div>

    </div>
  );
}

export default LocationMaster;