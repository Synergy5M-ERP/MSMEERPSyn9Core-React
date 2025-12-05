import React, { useState } from "react";
import NotCreated from "../../components/NotCreated";

function CrystalReport() {
  // radio: which report
  const [reportType, setReportType] = useState(" Daily Wise Production"); 
  // dropdown: which variant
  const [variant, setVariant] = useState("Customized"); 

  const getPageContent = () => {
    // here you route to pages using both reportType + variant
    if (reportType === " Daily Wise Production" && variant === "Customized") {
      return <NotCreated />;          //  Daily Wise Production Wise + Customized
    }
    if (reportType === " Daily Wise Production" && variant === "Generic") {
      return <div> Daily Wise Production Generic Page</div>;
    }
    if (reportType === " Daily Wise Production" && variant === "SemiFinished") {
      return <div> Daily Wise Production Semi Finished Page</div>;
    }

    if (reportType === "Machine Wise Production" && variant === "Customized") {
      return <div>Machine Wise Production Customized Page</div>;
    }
    if (reportType === "Machine Wise Production" && variant === "Generic") {
      return <div>Machine Wise Production Generic Page</div>;
    }
    if (reportType === "Machine Wise Production" && variant === "SemiFinished") {
      return <div>Machine Wise Production Semi Finished Page</div>;
    }

    if (reportType === "Buyer Wise Production" && variant === "Customized") {
      return <div>Buyer Wise Production Customized Page</div>;
    }
  

    return <NotCreated />;
  };

  return (
    <div className="container-fluid" style={{ minHeight: "80vh" }}>
      <div className="row">
        <div className="col-12">
          <h2 className="mb-3 text-primary fw-bold">
            Crystal Reports
          </h2>

          {/* 4 radios in one line */}
          <div className="card shadow-sm mb-3">
            <div className="card-body py-2 px-3">
              <div className="d-flex flex-wrap align-items-center gap-4">
                <span className="fw-semibold me-2">Report Type:</span>

                <div className="form-check form-check-inline mb-0">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="reportType"
                    id=" Daily Wise ProductionRadio"
                    value=" Daily Wise Production"
                    checked={reportType === " Daily Wise Production"}
                    onChange={() => setReportType(" Daily Wise Production")}
                  />
                  <label className="form-check-label fw-semibold" htmlFor=" Daily Wise ProductionRadio">
                     Daily Wise Production 
                  </label>
                </div>

                <div className="form-check form-check-inline mb-0">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="reportType"
                    id="Machine Wise ProductionRadio"
                    value="Machine Wise Production"
                    checked={reportType === "Machine Wise Production"}
                    onChange={() => setReportType("Machine Wise Production")}
                  />
                  <label className="form-check-label fw-semibold" htmlFor="Machine Wise ProductionRadio">
                    Machine Wise Production
                  </label>
                </div>

                <div className="form-check form-check-inline mb-0">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="reportType"
                    id="Buyer Wise ProductionRadio"
                    value="Buyer Wise Production"
                    checked={reportType === "Buyer Wise Production"}
                    onChange={() => setReportType("Buyer Wise Production")}
                  />
                  <label className="form-check-label fw-semibold" htmlFor="Buyer Wise ProductionRadio">
                    Buyer Wise Production 
                  </label>
                </div>

                <div className="form-check form-check-inline mb-0">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="reportType"
                    id="Operator Wise ProductionRadio"
                    value="Operator Wise Production"
                    checked={reportType === "Operator Wise Production"}
                    onChange={() => setReportType("Operator Wise Production")}
                  />
                  <label className="form-check-label fw-semibold" htmlFor="Operator Wise ProductionRadio">
                    Operator Wise Production 
                  </label>


                <div className="form-check form-check-inline mb-0">  
                    <select
                  id="variantSelect"
                  className="form-select form-select-sm"
                  style={{ maxWidth: "220px" }}
                  value={variant}
                  onChange={(e) => setVariant(e.target.value)}
                >
                  <option value="Customized">Customized</option>
                  <option value="Generic">Generic</option>
                  <option value="SemiFinished">Semi Finished</option>
                </select></div>
                
                </div>
              </div>
            </div>
          </div>

          {/* One shared dropdown for Customized / Generic / Semi Finished */}
          {/* <div className="card shadow-sm mb-4">
            <div className="card-body py-2 px-3">
              <div className="d-flex align-items-center gap-3">
                <label htmlFor="variantSelect" className="fw-semibold mb-0">
                  Version:
                </label>
                <select
                  id="variantSelect"
                  className="form-select form-select-sm"
                  style={{ maxWidth: "220px" }}
                  value={variant}
                  onChange={(e) => setVariant(e.target.value)}
                >
                  <option value="Customized">Customized</option>
                  <option value="Generic">Generic</option>
                  <option value="SemiFinished">Semi Finished</option>
                </select>
              </div>
            </div>
          </div> */}

          {/* Content based on radio + dropdown */}
          <div className="card shadow-sm">
            <div className="card-header bg-light border-0 py-2">
              <h5 className="mb-0 fw-semibold text-dark">
                {reportType.toUpperCase()} / {variant.toUpperCase()}
              </h5>
            </div>
            <div className="card-body p-4">
              {getPageContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CrystalReport;
