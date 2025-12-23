import React, { useState } from "react";
import IndivisualGRN from "./IndivisualGRN";
import CompleteDailyGRN from "./completeDailyGRN";

function InwardQC() {
  const [selectedPage, setSelectedPage] = useState("indivisualGRN");

  return (
    <div style={{ minHeight: "80vh" }}>
      <h2 style={{ textAlign: "left", color: "#0066cc", marginBottom: 0 }}>
        Inward QC
      </h2>

      {/* Page Selector */}
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
              value="indivisualGRN"
              checked={selectedPage === "indivisualGRN"}
              onChange={() => setSelectedPage("indivisualGRN")}
              style={{ width: 18, height: 18, marginRight: "8px" }}
            />
            Indivisual GRN
          </label>

          <label style={{ fontWeight: 600, fontSize: "18px", cursor: "pointer" }}>
            <input
              type="radio"
              name="configTab"
              value="completeDailyGRN"
              checked={selectedPage === "completeDailyGRN"}
              onChange={() => setSelectedPage("completeDailyGRN")}
              style={{ width: 18, height: 18, marginRight: "8px" }}
            />
            Complete Daily GRN
          </label>
        </div>
      </div>

      {/* Render selected page */}
      <div>
        {selectedPage === "indivisualGRN" && <IndivisualGRN />}
        {selectedPage === "completeDailyGRN" && <CompleteDailyGRN />}
      </div>
    </div>
  );
}

export default InwardQC;
