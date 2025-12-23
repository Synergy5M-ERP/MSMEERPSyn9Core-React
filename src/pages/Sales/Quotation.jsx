import React, { useState } from "react";
import NotCreated from "../../components/NotCreated";

function QuotationMaster() {
  const [selectedType, setSelectedType] = useState("ExternalQuotation");
  const [selectedAction, setSelectedAction] = useState("create"); // create, amend, view

  const getPageContent = () => {
    // Based on selection, render appropriate content
    if (selectedType === "ExternalQuotation") {
      switch (selectedAction) {
        case "create":
          return <NotCreated />;
        // case "amend":
        //   return <div>External Quotation Amend Page Content</div>;
        case "view":
          return <div>External Quotation View Page Content</div>;
        default:
          return <NotCreated />;
      }
    } else if (selectedType === "GenericQuotation") {
      switch (selectedAction) {
        case "create":
          return <div>Generic Quotation create Page Content</div>;
        // case "amend":
        //   return <div>Generic Quotation Amend Page Content</div>;
        case "view":
          return <div>Generic Quotation View Page Content</div>;
        default:
          return <NotCreated />;
      }
    }
    return <NotCreated />;
  };

  return (
    <div className="container-fluid" style={{ minHeight: "80vh" }}>
      <div className="row">
        <div className="col-12">
          <h2 className="mb-3 text-primary fw-bold">
          Quotation
          </h2>

          {/* Selection Controls - SAME LINE */}
          <div className="card shadow-sm mb-4">
            <div className="card-body p-3">
              <div className="d-flex align-items-center gap-4">
                {/* Dropdown for GenericQuotation/ExternalQuotation */}
                <div className="d-flex align-items-center gap-2">
                  <label htmlFor="typeSelect" className="form-label fw-semibold mb-0">
                    Type:
                  </label>
                  <select
                    id="typeSelect"
                    className="form-select form-select-sm"
                    style={{ minWidth: "150px" }}
                    value={selectedType}
                    onChange={(e) => {
                      setSelectedType(e.target.value);
                      setSelectedAction("create");
                    }}
                  >
                    <option value="ExternalQuotation">External Quotation</option>
                    <option value="GenericQuotation">Generic Quotation</option>
                  </select>
                </div>

                {/* Separator */}
                <div className="vr" style={{ height: "30px" }}></div>

                {/* Radio buttons for create/Amend/View */}
                <div className="d-flex gap-3 align-items-center">
                  <div className="form-check form-check-inline mb-0">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="action"
                      id="createRadio"
                      value="create"
                      checked={selectedAction === "create"}
                      onChange={() => setSelectedAction("create")}
                    />
                    <label className="form-check-label fw-semibold" htmlFor="createRadio">
                      create
                    </label>
                  </div>
                  
                  {/* <div className="form-check form-check-inline mb-0">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="action"
                      id="amendRadio"
                      value="amend"
                      checked={selectedAction === "amend"}
                      onChange={() => setSelectedAction("amend")}
                    />
                    <label className="form-check-label fw-semibold" htmlFor="amendRadio">
                      Amend
                    </label>
                  </div> */}
                  
                  <div className="form-check form-check-inline mb-0">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="action"
                      id="viewRadio"
                      value="view"
                      checked={selectedAction === "view"}
                      onChange={() => setSelectedAction("view")}
                    />
                    <label className="form-check-label fw-semibold" htmlFor="viewRadio">
                      View
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Display selected page content */}
          <div className="card shadow-sm">
            <div className="card-header bg-light border-0 py-3">
              <h5 className="mb-0 fw-semibold text-dark">
                {selectedType} - {selectedAction.charAt(0).toUpperCase() + selectedAction.slice(1)}
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

export default QuotationMaster;