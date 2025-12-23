import React, { useState, useRef, useEffect } from "react";
import CreateBOM from "./CreateBOM";
import NotCreated from "../../../components/NotCreated";
import ViewBOM from "./ViewBOM";

function BOM() {
  const [selectedPage, setSelectedPage] = useState("createBOM"); // createBOM | AmendBOM | report
  const [reportType, setReportType] = useState("BOM_LIST");      // which report inside dropdown
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const renderContent = () => {
    if (selectedPage === "createBOM") return <CreateBOM />;

    if (selectedPage === "viewBom") return <ViewBOM />;

    if (selectedPage === "report") {
      if (reportType === "BOM_LIST") return <div>BOM LIST Report Page</div>;
      if (reportType === "BOUGHT_LIST") return <div>Bought List Report Page</div>;
      if (reportType === "BUYER_WISE_BOM") return <div>Buyer Wise BOM List Report Page</div>;
      return <NotCreated />;
    }

    return <NotCreated />;
  };

  return (
    <div style={{ minHeight: "80vh" }}>
      <h2 style={{ textAlign: "left", color: "#0066cc", marginBottom: 0 }}>BOM</h2>

      {/* Selector row */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
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
        {/* left radios */}
        <div style={{ display: "flex", gap: "30px" }}>
          <label style={{ fontWeight: 600, fontSize: "18px", cursor: "pointer" }}>
            <input
              type="radio"
              name="configTab"
              value="createBOM"
              checked={selectedPage === "createBOM"}
              onChange={() => setSelectedPage("createBOM")}
              style={{ width: 18, height: 18, cursor: "pointer", marginRight: "8px" }}
            />
            Create BOM
          </label>
   <label style={{ fontWeight: 600, fontSize: "18px", cursor: "pointer" }}>
            <input
              type="radio"
              name="configTab"
              value="viewBOM"
              checked={selectedPage === "viewBOM"}
              onChange={() => setSelectedPage("viewBOM")}
              style={{ width: 18, height: 18, cursor: "pointer", marginRight: "8px" }}
            />
            View BOM
          </label>
          {/* <label style={{ fontWeight: 600, fontSize: "18px", cursor: "pointer" }}>
            <input
              type="radio"
              name="configTab"
              value="AmendBOM"
              checked={selectedPage === "AmendBOM"}
              onChange={() => setSelectedPage("AmendBOM")}
              style={{ width: 18, height: 18, cursor: "pointer", marginRight: "8px" }}
            />
            Amend BOM
          </label> */}
        </div>

        {/* right: STANDARD REPORT dropdown like image */}
        {/* <div
          ref={dropdownRef}
          style={{ marginLeft: "auto", position: "relative", marginRight: "12px" }}
        >
          <button
            type="button"
            onClick={() => {
              setSelectedPage("report");
              setOpenDropdown((prev) => !prev);
            }}
            style={{
              backgroundColor: "#ffe800", // yellow like screenshot
              color: "#000",
              fontWeight: 700,
              borderRadius: "3px",
              border: "1px solid #c7b800",
              padding: "6px 18px",
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            STANDARD REPORT ▾
          </button>

          {openDropdown && (
            <div
              style={{
                position: "absolute",
                top: "105%",
                left: 0,
                minWidth: "220px",
                background: "#ffffff",
                borderRadius: "4px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                zIndex: 1000,
              }}
            >
              <div
                onClick={() => {
                  setReportType("BOM_LIST");
                  setSelectedPage("report");
                  setOpenDropdown(false);
                }}
                style={{
                  padding: "8px 14px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 600,
                  borderBottom: "1px solid #eee",
                  whiteSpace: "nowrap",
                }}
              >
                BOM LIST
              </div>
              <div
                onClick={() => {
                  setReportType("BOUGHT_LIST");
                  setSelectedPage("report");
                  setOpenDropdown(false);
                }}
                style={{
                  padding: "8px 14px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 600,
                  borderBottom: "1px solid #eee",
                  whiteSpace: "nowrap",
                }}
              >
                BOUGHT LIST
              </div>
              <div
                onClick={() => {
                  setReportType("BUYER_WISE_BOM");
                  setSelectedPage("report");
                  setOpenDropdown(false);
                }}
                style={{
                  padding: "8px 14px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                BUYER WISE BOM LIST
              </div>
            </div>
          )}
        </div> */}
      </div>

      {/* content area */}
      <div>{renderContent()}</div>
    </div>
  );
}

export default BOM;
