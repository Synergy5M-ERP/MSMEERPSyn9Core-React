import React, { useState, useRef, useEffect } from "react";
import NotCreated from "../../components/NotCreated";

function TaxInvoice() {
  const [selectedPage, setSelectedPage] = useState("createTaxInvoice"); // createTaxInvoice | AmendTaxInvoice | report
  const [reportType, setReportType] = useState("NormalInvoice");      // which report inside dropdown
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
    if (selectedPage === "createTaxInvoice") return <NotCreated />;

    // if (selectedPage === "AmendTaxInvoice") return <NotCreated />;

    if (selectedPage === "report") {
      if (reportType === "NormalInvoice") return <div>Normal Invoice</div>;
      if (reportType === "InvoiceWithQR") return <div>Invoice With QR Code </div>;
      if (reportType === "POSOWise") return <div>PO/SO Wise Invoice</div>;
      return <NotCreated />;
    }

    return <NotCreated />;
  };

  return (
    <div style={{ minHeight: "80vh" }}>
      <h2 style={{ textAlign: "left", color: "#0066cc", marginBottom: 0 }}>Tax Invoice</h2>

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
              value="createTaxInvoice"
              checked={selectedPage === "createTaxInvoice"}
              onChange={() => setSelectedPage("createTaxInvoice")}
              style={{ width: 18, height: 18, cursor: "pointer", marginRight: "8px" }}
            />
            Create Tax Invoice
          </label>

    

             <label style={{ fontWeight: 600, fontSize: "18px", cursor: "pointer" }}>
            <input
              type="radio"
              name="configTab"
              value="uploadForGST"
              checked={selectedPage === "uploadForGST"}
              onChange={() => setSelectedPage("uploadForGST")}
              style={{ width: 18, height: 18, cursor: "pointer", marginRight: "8px" }}
            />
          Invoice Upload For GST
          </label>
        </div>

        {/* right: STANDARD REPORT dropdown like image */}
        <div
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
                  setReportType("NormalInvoice");
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
               Normal Invoice
              </div>
              <div
                onClick={() => {
                  setReportType("InvoiceWithQR");
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
               Invoice With QR Code
              </div>
              <div
                onClick={() => {
                  setReportType("POSOWise");
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
                PO/SO Wise Invoice
              </div>
            </div>
          )}
        </div>
      </div>

      {/* content area */}
      <div>{renderContent()}</div>
    </div>
  );
}

export default TaxInvoice;
