import React, { useState } from "react";
import CheckPayable from "./CheckPayable";
import ApprovedPayable from "./ApprovedPayable";
import CheckNonGRN from "./CheckNonGRN";
import ApproveNonGRN from "./ApproveNonGRN";
// Import the new components
import TransporterGRN from "./TransporterGRN";
import TransporterApprove from "./TransporterApprove";

function AccountGRN() {
  const [selectedPage, setSelectedPage] = useState("checkGRN");

  const radioOptions = [
    { id: "checkGRN", label: "Bill Passing(GRN)" },
    { id: "approveGRN", label: "Bill Approve(GRN)" },
    { id: "checkNonGRN", label: "Bill Passing(NonGRN)" },
    { id: "approveNonGRN", label: "Bill Approve(NonGRN)" },
    { id: "transporterGRN", label: "Bill Passing(Transporter)" },
    { id: "transporterApprove", label: "Bill Approve(Transporter)" },
  ];

  return (
    <div style={{ minHeight: "80vh", padding: "20px", background: "#f4f6f9" }}>
      {/* Radio Button Group */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "20px", background: "#fff", padding: "15px", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}>
        {radioOptions.map((opt) => (
          <label key={opt.id} style={{ fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <input
              type="radio"
              name="billType"
              value={opt.id}
              checked={selectedPage === opt.id}
              onChange={() => setSelectedPage(opt.id)}
              style={{ marginRight: "8px" }}
            />
            {opt.label}
          </label>
        ))}
      </div>

      {/* Render Components */}
      <div className="content-area">
        {selectedPage === "checkGRN" && <CheckPayable />}
        {selectedPage === "approveGRN" && <ApprovedPayable />}
        {selectedPage === "checkNonGRN" && <CheckNonGRN />}
        {selectedPage === "approveNonGRN" && <ApproveNonGRN />}
        {selectedPage === "transporterGRN" && <TransporterGRN />}
        {selectedPage === "transporterApprove" && <TransporterApprove />}
      </div>
    </div>
  );
}

export default AccountGRN;