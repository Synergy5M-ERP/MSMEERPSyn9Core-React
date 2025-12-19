import React, { useState } from "react";
import Domestic from "./Domestic";

function PurchaseOrder() {
  const [mode, setMode] = useState("create");
  const [option, setOption] = useState("domestic");

  const createOptions = [
    { value: "domestic", label: "Domestic" },
    { value: "international", label: "International" },
    { value: "direct", label: "Direct PO" },
    { value: "repeat", label: "Repeat PO" },
    { value: "intlDirect", label: "International Direct PO" },
  ];

  const amendOptions = [
    { value: "amendPo", label: "Amend PO" },
    { value: "amendDirectPo", label: "Amend Direct PO" },
  ];

  const reportOptions = [
    { value: "crystal", label: "Crystal Report" },
    { value: "standard", label: "Standard Report" },
  ];

  const getCurrentOptions = () => {
    if (mode === "create") return createOptions;
    if (mode === "amend") return amendOptions;
    return reportOptions;
  };

  // NEW: get first value for each mode
  const getDefaultOptionForMode = (m) => {
    if (m === "create") return createOptions[0].value;      // "domestic"
    if (m === "amend") return amendOptions[0].value;        // "amendPo"
    if (m === "report") return reportOptions[0].value;      // "crystal"
    return "";
  };

  // when changing mode, also reset option
  const handleModeChange = (newMode) => {
    setMode(newMode);
    setOption(getDefaultOptionForMode(newMode));
  };

  const renderPage = () => {
    if (mode === "create" && option === "domestic") return <Domestic />;
    if (mode === "create" && option === "international")
      return <div>International Create Page JSX here</div>;
    if (mode === "create" && option === "direct")
      return <div>Direct PO Create Page JSX here</div>;
    if (mode === "create" && option === "repeat")
      return <div>Repeat PO Create Page JSX here</div>;
    if (mode === "create" && option === "intlDirect")
      return <div>International Direct PO Create Page JSX here</div>;


    if (mode === "report" && option === "crystal")
      return <div>Crystal Report JSX here</div>;
    if (mode === "report" && option === "standard")
      return <div>Standard Report JSX here</div>;

    return null;
  };

  const cardStyle = {
    minHeight: "80vh",
    padding: "18px 22px 32px",
    background: "#f5f7fb",
  };

  const headerStyle = {
    textAlign: "left",
    color: "#004a99",
    marginBottom: "14px",
    fontSize: "22px",
    fontWeight: 700,
  };

  const chooserBar = {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    marginTop: "6px",
    marginBottom: "18px",
    padding: "10px 16px",
    borderRadius: "10px",
    background: "#ffffff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  };

  const radioLabel = (isActive) => ({
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 10px",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "15px",
    color: isActive ? "#ffffff" : "#333",
    background: isActive ? "#007bff" : "transparent",
    transition: "all 0.15s ease-in-out",
  });

  const radioInput = {
    width: 16,
    height: 16,
    cursor: "pointer",
  };

  const selectStyle = {
    marginLeft: "auto",
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid #ccd4e0",
    fontSize: "14px",
    fontWeight: 500,
    color: "#333",
    background: "#fdfdfd",
  };

  const pageCard = {
    marginTop: 18,
    padding: "18px 18px 24px",
    background: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  };

  return (
    <div style={cardStyle}>
      <h2 style={headerStyle}>Quotation Entry Form</h2>

      <div style={chooserBar}>
        <label style={radioLabel(mode === "create")}>
          <input
            type="radio"
            name="mode"
            value="create"
            checked={mode === "create"}
            onChange={() => handleModeChange("create")}
            style={radioInput}
          />
          Create
        </label>

  

        <label style={radioLabel(mode === "report")}>
          <input
            type="radio"
            name="mode"
            value="report"
            checked={mode === "report"}
            onChange={() => handleModeChange("report")}
            style={radioInput}
          />
          Reports/Views
        </label>

        <select
          value={option}
          onChange={(e) => setOption(e.target.value)}
          style={selectStyle}
        >
          {getCurrentOptions().map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div style={pageCard}>{renderPage()}</div>
    </div>
  );
}

export default PurchaseOrder;
