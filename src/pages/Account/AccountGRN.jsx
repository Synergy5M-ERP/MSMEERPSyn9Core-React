import React, { useState } from "react";

import CheckPayable from "./CheckPayable";
import ApprovedPayable from "./ApprovedPayable";
import CheckNonGRN from "./CheckNonGRN";
import ApproveNonGRN from "./ApproveNonGRN";

function AccountGRN() {
  const [selectedPage, setSelectedPage] = useState("checkGRN");

  return (
    <div style={{ minHeight: "80vh" }}>
      
      <h2 style={{ textAlign: "left", color: "#0066cc", marginBottom: 15 }}>
        Bill Passing
      </h2>

      {/* All Radio Buttons */}
      <div style={{ display: "flex", gap: "30px", flexWrap: "wrap", marginBottom: "20px" }}>

        {/* GRN Check */}
        <label style={{ fontWeight: 600, fontSize: "17px", cursor: "pointer" }}>
          <input
            type="radio"
            name="billType"
            value="checkGRN"
            checked={selectedPage === "checkGRN"}
            onChange={() => setSelectedPage("checkGRN")}
            style={{ marginRight: "8px" }}
          />
          Bill Passing Check (GRN)
        </label>

        {/* GRN Approve */}
        <label style={{ fontWeight: 600, fontSize: "17px", cursor: "pointer" }}>
          <input
            type="radio"
            name="billType"
            value="approveGRN"
            checked={selectedPage === "approveGRN"}
            onChange={() => setSelectedPage("approveGRN")}
            style={{ marginRight: "8px" }}
          />
          Bill Approve (GRN)
        </label>

        {/* NON GRN Check */}
        <label style={{ fontWeight: 600, fontSize: "17px", cursor: "pointer" }}>
          <input
            type="radio"
            name="billType"
            value="checkNonGRN"
            checked={selectedPage === "checkNonGRN"}
            onChange={() => setSelectedPage("checkNonGRN")}
            style={{ marginRight: "8px" }}
          />
          Bill Passing Check (NonGRN)
        </label>

        {/* NON GRN Approve */}
        <label style={{ fontWeight: 600, fontSize: "17px", cursor: "pointer" }}>
          <input
            type="radio"
            name="billType"
            value="approveNonGRN"
            checked={selectedPage === "approveNonGRN"}
            onChange={() => setSelectedPage("approveNonGRN")}
            style={{ marginRight: "8px" }}
          />
          Bill Approve (NonGRN)
        </label>

      </div>

      {/* Render Components */}
      <div>
        {selectedPage === "checkGRN" && <CheckPayable />}
        {selectedPage === "approveGRN" && <ApprovedPayable />}
        {selectedPage === "checkNonGRN" && <CheckNonGRN />}
        {selectedPage === "approveNonGRN" && <ApproveNonGRN />}
      </div>

    </div>
  );
}

export default AccountGRN;