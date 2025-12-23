import React, { useState } from "react";
import FinishIndivisualSO from "./FinishIndivisualSO";
import FinishcompleteDailyProduction from "./FinishcompleteDailyProduction";

function CustomizedOutwardQC() {
  const [selectedPage, setSelectedPage] = useState("indivisualSO");

  return (
    <div style={{ minHeight: "80vh" }}>
      <h2 style={{ textAlign: "left", color: "#0066cc" }}>
        OUTWARD QC
      </h2>

      <div
        style={{
          display: "flex",
          gap: "30px",
          marginTop: "22px",
          marginBottom: "12px",
          padding: "14px 0 14px 5px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.07)",
          background: "#fff",
        }}
      >
        <label style={{ fontWeight: 600, fontSize: "18px" }}>
          <input
            type="radio"
            checked={selectedPage === "indivisualSO"}
            onChange={() => setSelectedPage("indivisualSO")}
          />
          Indivisual SO
        </label>

        <label style={{ fontWeight: 600, fontSize: "18px" }}>
          <input
            type="radio"
            checked={selectedPage === "completeDailyProduct"}
            onChange={() => setSelectedPage("completeDailyProduct")}
          />
          Complete Daily Product
        </label>
      </div>

      {selectedPage === "indivisualSO" && <FinishIndivisualSO />}
      {selectedPage === "completeDailyProduct" && (
        <FinishcompleteDailyProduction />
      )}
    </div>
  );
}

export default CustomizedOutwardQC;
