import React, { useState } from "react";
import NotCreated from "../../components/NotCreated";

function FinishProduction() {
  const [selectedType, setSelectedType] = useState("Customized");
  const [selectedAction, setSelectedAction] = useState("add"); // add, amend, view

  const getPageContent = () => {
    // Based on selection, render appropriate content
    if (selectedType === "Customized") {
      switch (selectedAction) {
        case "add":
          return <NotCreated />;
      
        case "view":
          return <div>Customized View Page Content</div>;
        default:
          return <NotCreated />;
      }
    } else if (selectedType === "Generic") {
      switch (selectedAction) {
        case "add":
          return <div>Generic Add Page Content</div>;
        case "view":
          return <div>Generic View Page Content</div>;
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
            Finish Production
          </h2>

          {/* Selection Controls - SAME LINE */}
          <div className="card shadow-sm mb-4">
            <div className="card-body p-3">
              <div className="d-flex align-items-center gap-4">
                {/* Dropdown for Generic/Customized */}
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
                      setSelectedAction("add");
                    }}
                  >
                    <option value="Customized">Customized</option>
                    <option value="Generic">Generic</option>
                  </select>
                </div>

                {/* Separator */}
                <div className="vr" style={{ height: "30px" }}></div>

                {/* Radio buttons for Add/Amend/View */}
                <div className="d-flex gap-3 align-items-center">
                  <div className="form-check form-check-inline mb-0">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="action"
                      id="addRadio"
                      value="add"
                      checked={selectedAction === "add"}
                      onChange={() => setSelectedAction("add")}
                    />
                    <label className="form-check-label fw-semibold" htmlFor="addRadio">
                      Add
                    </label>
                  </div>
                  
                  <div className="form-check form-check-inline mb-0">
             
                  </div>
                  
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

export default FinishProduction;