import React, { useState } from "react";
import Create from "./Create";
import View from "./View";

function PieChartPage() {
  return <div style={{ padding: "20px" }}>Pie Chart Page Content</div>;
}

function LocationMaster() {
  const [selectedPage, setSelectedPage] = useState("create");
  const [editData, setEditData] = useState(null); // 🔹 holds row data when editing

  // 🔹 Called from View page when Edit button is clicked
  const handleEditFromView = (item) => {
    setEditData(item);       // pass the row data
    setSelectedPage("create"); // switch to create tab
  };

  // 🔹 Called from Create page when edit is done or cancelled
  const handleEditDone = () => {
    setEditData(null);       // clear edit data
    setSelectedPage("view"); // go back to view
  };

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
            onChange={() => {
              setEditData(null); // clear edit data when manually switching to create
              setSelectedPage("create");
            }}
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
            onChange={() => {
              setEditData(null);
              setSelectedPage("view");
            }}
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
            onChange={() => {
              setEditData(null);
              setSelectedPage("pieChart");
            }}
          />
          Pie Chart
        </label>
      </div>

      {/* Page Load Area */}
      <div style={{ marginTop: "20px" }}>
        {selectedPage === "create" && (
          <Create editData={editData} onEditDone={handleEditDone} />
        )}
        {selectedPage === "view" && (
          <View onEdit={handleEditFromView} />
        )}
        {selectedPage === "pieChart" && <PieChartPage />}
      </div>
    </div>
  );
}

export default LocationMaster;