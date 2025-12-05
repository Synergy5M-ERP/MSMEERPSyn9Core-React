import React, { useState } from "react";
import NotCreated from "../../components/NotCreated";

function StandardReport() {
  const [item, setItem] = useState("SEMI_FINISHED");
  const [issueOption, setIssueOption] = useState("manualIssue");
  const [reportOption, setReportOption] = useState("Finish_Product");

  const renderContent = () => {
    switch (item) {
      case "SEMI_FINISHED":
        return <NotCreated/>;
      case "CUSTOMISE_FINISH":
        return <div>Customise Finished Prod Plan Page</div>;
      case "GENERIC_FINISH":
        return <div>Generic Finished Prod Plan Page</div>;
      case "MACHINE_INFO":
        return <div>Machine Information Page</div>;
      case "RAW_MATERIAL":
        return <div>Raw Material Requirement Page</div>;
      case "CONSOLIDATED_LIST":
        return <div>Consolidated Semi Fini List Page</div>;

      case "ISSUE_PASS":
        if (issueOption === "manualIssue") return <div>Manual Issue Pass</div>;
        if (issueOption === "ACIssuePass") return <div>AC Issue Pass</div>;
        if (issueOption === "AGIssuePass") return <div>AG Issue Pass</div>;
        return <NotCreated />;

      case "PROD_REPORT":
        if (reportOption === "Finish_Product")
          return <div>Finish Product Report Page</div>;
        if (reportOption === "SemiFinish_Product")
          return <div>SemiFinish Product Report Page</div>;
        return <NotCreated />;

      default:
        return <NotCreated />;
    }
  };

  return (
    <div className="container-fluid" style={{ minHeight: "80vh" }}>
      <h2 className="mb-3 text-primary fw-bold">Standard Report</h2>

      {/* ALL ITEMS IN GRID: 4 columns per row */}
      <div className="row g-2 mb-3">

        {/* 1 */}
        <div className="col-12 col-md-3">
          <label className="form-check-label fw-semibold w-100">
            <input
              type="radio"
              className="form-check-input me-2"
              name="menuItem"
              value="SEMI_FINISHED"
              checked={item === "SEMI_FINISHED"}
              onChange={() => setItem("SEMI_FINISHED")}
            />
            SEMI FINISHED PROD PLAN
          </label>
        </div>

        {/* 2 */}
        <div className="col-12 col-md-3">
          <label className="form-check-label fw-semibold w-100">
            <input
              type="radio"
              className="form-check-input me-2"
              name="menuItem"
              value="CUSTOMISE_FINISH"
              checked={item === "CUSTOMISE_FINISH"}
              onChange={() => setItem("CUSTOMISE_FINISH")}
            />
            CUSTOMISE FINISHED PROD PLAN
          </label>
        </div>

        {/* 3 */}
        <div className="col-12 col-md-3">
          <label className="form-check-label fw-semibold w-100">
            <input
              type="radio"
              className="form-check-input me-2"
              name="menuItem"
              value="GENERIC_FINISH"
              checked={item === "GENERIC_FINISH"}
              onChange={() => setItem("GENERIC_FINISH")}
            />
            GENERIC FINISHED PROD PLAN
          </label>
        </div>

        {/* 4 */}
        <div className="col-12 col-md-3">
          <label className="form-check-label fw-semibold w-100">
            <input
              type="radio"
              className="form-check-input me-2"
              name="menuItem"
              value="MACHINE_INFO"
              checked={item === "MACHINE_INFO"}
              onChange={() => setItem("MACHINE_INFO")}
            />
            MACHINE INFORMATION
          </label>
        </div>

        {/* 5 */}
        <div className="col-12 col-md-3">
          <label className="form-check-label fw-semibold w-100">
            <input
              type="radio"
              className="form-check-input me-2"
              name="menuItem"
              value="RAW_MATERIAL"
              checked={item === "RAW_MATERIAL"}
              onChange={() => setItem("RAW_MATERIAL")}
            />
            RAW MATERIAL REQUIREMENT
          </label>
        </div>

        {/* 6: ISSUE PASS + dropdown in same column */}
        <div className="col-12 col-md-3">
          <div className="d-flex flex-column">
            <label className="form-check-label fw-semibold mb-1">
              <input
                type="radio"
                className="form-check-input me-2"
                name="menuItem"
                value="ISSUE_PASS"
                checked={item === "ISSUE_PASS"}
                onChange={() => setItem("ISSUE_PASS")}
              />
              ISSUE PASS
            </label>
            <select
              className="form-select form-select-sm"
              value={issueOption}
              onChange={(e) => setIssueOption(e.target.value)}
              disabled={item !== "ISSUE_PASS"}
            >
              <option value="manualIssue">Manual Issue Pass</option>
              <option value="ACIssuePass">AC Issue Pass</option>
              <option value="AGIssuePass">AG Issue Pass</option>
            </select>
          </div>
        </div>

        {/* 7 */}
        <div className="col-12 col-md-3">
          <label className="form-check-label fw-semibold w-100">
            <input
              type="radio"
              className="form-check-input me-2"
              name="menuItem"
              value="CONSOLIDATED_LIST"
              checked={item === "CONSOLIDATED_LIST"}
              onChange={() => setItem("CONSOLIDATED_LIST")}
            />
            CONSOLIDATED SEMI FINI LIST
          </label>
        </div>

        {/* 8: PRODUCTION REPORT + dropdown */}
        <div className="col-12 col-md-3">
          <div className="d-flex flex-column">
            <label className="form-check-label fw-semibold mb-1">
              <input
                type="radio"
                className="form-check-input me-2"
                name="menuItem"
                value="PROD_REPORT"
                checked={item === "PROD_REPORT"}
                onChange={() => setItem("PROD_REPORT")}
              />
              PRODUCTION REPORT
            </label>
            <select
              className="form-select form-select-sm"
              value={reportOption}
              onChange={(e) => setReportOption(e.target.value)}
              disabled={item !== "PROD_REPORT"}
            >
              <option value="Finish_Product">Finish Product</option>
              <option value="SemiFinish_Product">SemiFinish Product</option>
            </select>
          </div>
        </div>
      </div>

      {/* content area */}
      <div className="card shadow-sm">
        <div className="card-header bg-light border-0 py-2">
          <h5 className="mb-0 fw-semibold text-dark">
            {item}
            {item === "ISSUE_PASS" && ` / ${issueOption}`}
            {item === "PROD_REPORT" && ` / ${reportOption}`}
          </h5>
        </div>
        <div className="card-body p-4">{renderContent()}</div>
      </div>
    </div>
  );
}

export default StandardReport;
