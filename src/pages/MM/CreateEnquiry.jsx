
import React, { useState } from "react";
import CreateItem from "../Masters/ItemMaster/CreateItem";
import CreateVendor from "../Masters/vendorMaster/CreateVendor";
import Domestic from "./Domestic";


function CreateEnquiry() {
  const [selectedPage, setSelectedPage] = useState("domestic");
  const [view, setView] = useState("active"); // active or inactive

  return (
    <div style={{ minHeight: "80vh" }}>
      <h2 style={{ textAlign: "left", color: "#0066cc", marginBottom: 0 }}>
        Create Enquiry
      </h2>

      {/* Radio Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "30px",
          marginTop: "22px",
          marginBottom: "12px",
          padding: "14px 0 14px 5px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.07)",
          background: "#fff",
        }}
      >
        <div style={{ display: "flex", gap: "30px" }}>
          <label style={{ fontWeight: 600, fontSize: "18px", cursor: "pointer" }}>
            <input
              type="radio"
              name="configTab"
              value="domestic"
              checked={selectedPage === "domestic"}
              onChange={() => setSelectedPage("domestic")}
              style={{ marginRight: 8 }}
            />
            Domestic
          </label>

          <label style={{ fontWeight: 600, fontSize: "18px", cursor: "pointer" }}>
            <input
              type="radio"
              name="configTab"
              value="International"
              checked={selectedPage === "International"}
              onChange={() => setSelectedPage("International")}
              style={{ marginRight: 8 }}
            />
            International
          </label>

          <label style={{ fontWeight: 600, fontSize: "18px", cursor: "pointer" }}>
            <input
              type="radio"
              name="configTab"
              value="view"
              checked={selectedPage === "view"}
              onChange={() => setSelectedPage("view")}
              style={{ marginRight: 8 }}
            />
            View Enquiry / Standard Report
          </label>

          <label style={{ fontWeight: 600, fontSize: "18px", cursor: "pointer" }}>
            <input
              type="radio"
              name="configTab"
              value="crystalreport"
              checked={selectedPage === "crystalreport"}
              onChange={() => setSelectedPage("crystalreport")}
              style={{ marginRight: 8 }}
            />
            Crystal Report
          </label>
        </div>
      </div>

      {/* Render Pages */}
      <div style={{ marginTop: "20px" }}>
        {selectedPage === "domestic" && <Domestic />}
        {selectedPage === "International" && <h3>International Enquiry</h3>}
        {selectedPage === "view" && <h3>View Enquiry</h3>}
        {selectedPage === "crystalreport" && <h3>Crystal Report</h3>}
      </div>
    </div>
  );
}

export default CreateEnquiry;
