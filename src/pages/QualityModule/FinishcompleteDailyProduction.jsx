import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../config/apiconfig";

const FinishcompleteDailyProduction = () => {
  // =================== STATE ===================
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCoaModal, setShowCoaModal] = useState(false);
  const [coaData, setCoaData] = useState(null);
  const [parameterRows, setParameterRows] = useState([]);

  // Separate states
  const [submittedRejectionPlanIds, setSubmittedRejectionPlanIds] = useState([]);
  const [submittedCOAPlanIds, setSubmittedCOAPlanIds] = useState([]);

  const [savingCOA, setSavingCOA] = useState(false);

const [searchTerm, setSearchTerm] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const [rowsPerPage, setRowsPerPage] = useState(10);

// Flatten all customer planDetails into individual rows
const flattenedPlans = data.flatMap(cust =>
  cust.planDetails?.map(plan => ({ cust, plan })) || []
);

// Filter flattened rows by search term
const filteredRows = flattenedPlans.filter(({ cust, plan }) => {
  const searchStr = `
    ${cust.buyerName || ""} 
    ${cust.soNumber || ""} 
    ${cust.itemName || ""} 
    ${cust.grade || ""} 
    ${plan.batchNo || ""} 
    ${plan.shift || ""} 
    ${plan.date ? plan.date.substring(0, 10) : ""} 
    ${plan.planDate ? plan.planDate.substring(0, 10) : ""} 
    ${cust.itemCode || ""}
  `.toLowerCase();

  return searchStr.includes(searchTerm.toLowerCase());
});

const indexOfLastRow = currentPage * rowsPerPage;
const indexOfFirstRow = indexOfLastRow - rowsPerPage;
const currentRows = filteredRows.slice(indexOfFirstRow, indexOfLastRow);

const totalPages = Math.ceil(filteredRows.length / rowsPerPage) || 1;

  const searchInputStyle = { padding: 6, width: 200 };
const controlBarStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
    flexWrap: "wrap",
  };

  // =================== HELPERS ===================
  const createEmptyParamRow = (grade = "") => ({
    grade,
    width: "",
    length: "",
    thickness: "",
    height: "",
    partNumber: "",
    weight: "",
    weightPerCover: "",
    printingQuality: "",
    color: "",
    vciTest: "",
    dust: "",
    remark: "",
    moistureFree: "",
  });

  const handleParamChange = (index, field, value) => {
    setParameterRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  const addParamRow = () => {
    setParameterRows([...parameterRows, createEmptyParamRow(coaData?.grade)]);
  };

  const removeParamRow = (index) => {
    setParameterRows(parameterRows.filter((_, i) => i !== index));
  };

  // =================== FETCH OUTWARD QC DATA ===================
  useEffect(() => {
    fetch(API_ENDPOINTS.OutwardQc)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((result) => {
        const updated = result.map((cust) => ({
          ...cust,
          planDetails: cust.planDetails?.map((plan) => ({
            ...plan,
            rejectionQty: plan.rejectionQty ?? null, // default null
            QtyToWH: (plan.actualQty ?? 0) - (plan.rejectionQty ?? 0),
          })),
        }));
        setData(updated);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load data");
        setLoading(false);
      });
  }, []);

  // =================== FETCH SUBMITTED PLAN IDS ===================
  useEffect(() => {
    // fetch submitted rejection plans
    fetch(API_ENDPOINTS.SubmitButtonDisable)
      .then((res) => res.json())
      .then((resp) => {
        if (resp.success && Array.isArray(resp.submitted)) {
          setSubmittedRejectionPlanIds(resp.submitted);
        }
      })
      .catch((err) => console.error("Error fetching submitted plans", err));

    // fetch submitted COA plans
    fetch(API_ENDPOINTS.CheckButton)
      .then((res) => res.json())
      .then((resp) => {
        if (resp.success && Array.isArray(resp.submitted)) {
          setSubmittedCOAPlanIds(resp.submitted);
        }
      })
      .catch((err) => console.error("Error fetching COA plans", err));
  }, []);

  const fetchSubmittedCOAPlans = () => {
    fetch(API_ENDPOINTS.CheckButton)
      .then((res) => res.json())
      .then((resp) => {
        if (resp.success && Array.isArray(resp.submitted)) {
          setSubmittedCOAPlanIds(resp.submitted); // update COA state only
        }
      })
      .catch((err) => console.error("Error fetching submitted COA plans", err));
  };

  // =================== HANDLE REJECTION CHANGE ===================
  const handleRejectionChange = (custIndex, planIndex, value) => {
    setData((prev) => {
      const copy = [...prev];
      const plan = copy[custIndex].planDetails[planIndex];
      const actual = plan.actualQty ?? 0;
      let reject = value === "" ? null : Number(value);

      if (reject !== null && reject > actual) {
        alert("Rejection Qty cannot exceed Actual Qty");
        reject = actual;
      }

      plan.rejectionQty = reject;
      plan.QtyToWH = (actual ?? 0) - (plan.rejectionQty ?? 0);
      return copy;
    });
  };

  // =================== HANDLE SUBMIT ROW ===================
  const handleSubmitRow = (cust, plan) => {
    const payload = {
      productionData: [
        {
          PlanId: plan.planId,
          CustFinProdId: cust.custFinProdId,
          Shift: plan.shift,
          ActualQty: plan.actualQty,
          RejectionQty: plan.rejectionQty ?? 0,
          QtyToWH: plan.QtyToWH ?? 0,
          BatchNo: plan.batchNo,
        },
      ],
      planDate: new Date().toISOString(),
    };

    fetch(API_ENDPOINTS.SaveRejectionQty, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          alert("Rejected Qty Submitted successfully");
          setSubmittedRejectionPlanIds((prev) => [...prev, plan.planId]);
        } else {
          alert(res.message || "Submit failed");
        }
      })
      .catch(() => alert("Submit error"));
  };

  // =================== HANDLE CREATE COA ===================
  const handleCreateCoA = (cust, plan) => {
    setCoaData({
      planId: plan.planId,
      prodPlanDate: plan.date,
      buyerName: cust.buyerName,
      soNumber: cust.soNumber,
      itemName: cust.itemName,
      itemCode: cust.itemCode,
      grade: cust.grade,
      machineNo: cust.machineNumber,
      operator: plan.opName,
      planDate: plan.planDate,
      shift: plan.shift,
      batchNo: plan.batchNo,
      planQty: plan.planQty,
      actualQty: plan.actualQty,
    });
    setParameterRows([createEmptyParamRow(cust.grade)]);
    setShowCoaModal(true);
  };

  const handleSaveCOA = () => {
    if (savingCOA) return;
    if (!coaData || parameterRows.length === 0) {
      alert("Please add COA parameter values");
      return;
    }

    setSavingCOA(true);

    const records = parameterRows.map((row) => ({
      PlanId: coaData.planId,
      ProdPlanDate: coaData.prodPlanDate
        ? new Date(coaData.prodPlanDate).toISOString()
        : new Date().toISOString(),
      PlanDate: coaData.planDate
        ? new Date(coaData.planDate).toISOString()
        : new Date().toISOString(),
      BuyerName: coaData.buyerName || "",
      SONo: coaData.soNumber || "",
      ItemName: coaData.itemName || "",
      ItemCode: coaData.itemCode || "",
      Grade: coaData.grade || "",
      MachineNo: coaData.machineNo || "",
      OperatorName: coaData.operator || "",
      Shift: coaData.shift || "",
      BatchNo: coaData.batchNo || "",
      PlanQty: Number(coaData.planQty) || 0,
      ActualQty: Number(coaData.actualQty) || 0,
      Width: row.width ? Number(row.width) : null,
      Length: row.length ? Number(row.length) : null,
      Thickness: row.thickness ? Number(row.thickness) : null,
      Height: row.height ? Number(row.height) : null,
      PartNumber: row.partNumber || "",
      Weight: row.weight ? Number(row.weight) : null,
      WeightperCover: row.weightPerCover ? Number(row.weightPerCover) : null,
      PrintingQuality: row.printingQuality || "",
      Color: row.color || "",
      VciTest: row.vciTest || "",
      Dust: row.dust || "",
      Remark: row.remark || "",
      MoistureFree: row.moistureFree || "",
    }));

    fetch(API_ENDPOINTS.SaveCOARows, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(records),
    })
      .then(async (res) => {
        const text = await res.text();
        return text ? JSON.parse(text) : {};
      })
      .then((res) => {
        if (res.success) {
          alert(res.message);
          fetchSubmittedCOAPlans(); // update COA tick only
          setShowCoaModal(false);
          setParameterRows([]);
        } else {
          alert(res.message || "COA save failed");
        }
      })
      .catch((err) => {
        console.error("Save COA error:", err);
        alert("Error saving COA (Check backend logs)");
      })
      .finally(() => setSavingCOA(false));
  };
{/* SEARCH BOX */}
<div className="d-flex justify-content-end my-2">
  <input
    type="text"
    className="form-control"
    style={{ width: "220px" }}
    placeholder="Search..."
    value={searchTerm}
    onChange={(e) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1);
    }}
  />
</div>

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;

        return (
      <div className="card shadow-lg">

        {/* HEADER */}
        <div
          className="card-header text-white text-center"
          style={{ backgroundColor: "#1f3c88" }}
        >
          <h5 className="mb-0">📊 OUTWARD QC REPORT</h5>
        </div>

        {/* BODY */}
        <div className="card-body">

          {/* CONTROLS */}
          <div style={controlBarStyle}>
            <div>
              Show{" "}
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                {[5, 10, 50, 100].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>{" "}
              entries
            </div>

            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={searchInputStyle}
            />
          </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="text-white text-center" style={{ backgroundColor: "#29417eff" }}>
                <tr>
                  <th>Prod Plan Date</th>
                  <th>Buyer Name<br></br>SO Number</th>
                  <th>Item Name<br></br> Grade</th>
                  <th>Machine <br></br> Operator</th>
                  <th>Plan Date</th>
                  <th>Shift <br></br>Batch No</th>
                  <th>Item Code</th>
                  <th>Plan Qty</th>
                  <th>Actual Qty</th>
                  <th>Rejected Qty</th>
                  <th>Qty To WH</th>
                  <th>Create COA</th>
                  <th>Select</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
               {currentRows.map(({ cust, plan }, idx) => (
  <tr key={idx}>
    <td>{plan.date?.substring(0, 10)}</td>
    <td>{cust.buyerName}<div>{cust.soNumber}</div></td>
    <td>{cust.itemName}<div>{cust.grade}</div></td>
    <td>{cust.machineNumber}<div>{plan.opName}</div></td>
    <td>{plan.planDate?.substring(0, 10)}</td>
    <td>{plan.shift}<div>{plan.batchNo}</div></td>
    <td>{cust.itemCode}</td>
    <td className="text-end">{plan.planQty}</td>
    <td className="text-end">{plan.actualQty ?? 0}</td>
    <td>
      <input
        type="number"
        className="form-control form-control-sm text-end"
        value={plan.rejectionQty ?? ""}
        onChange={(e) => handleRejectionChange(data.indexOf(cust), cust.planDetails.indexOf(plan), e.target.value)}
      />
    </td>
    <td className="text-end">{plan.QtyToWH}</td>
    <td className="text-center">
      {submittedCOAPlanIds.includes(plan.planId) ? (
        <button className="btn btn-sm btn-success" disabled>✔</button>
      ) : (
        <button
          className="btn btn-sm"
          style={{ backgroundColor: "darkcyan", color: "white" }}
          onClick={() => handleCreateCoA(cust, plan)}
        >
          Create COA
        </button>
      )}
    </td>
    <td className="text-center">
      <input type="checkbox" />
    </td>
    <td className="text-center">
      <button
        className={`btn btn-sm ${
          submittedRejectionPlanIds.includes(plan.planId)
            ? "btn-secondary"
            : "btn-success"
        }`}
        disabled={submittedRejectionPlanIds.includes(plan.planId)}
        onClick={() => handleSubmitRow(cust, plan)}
      >
        {submittedRejectionPlanIds.includes(plan.planId) ? "Submitted" : "Submit"}
      </button>
    </td>
  </tr>
))}

              </tbody>
            </table>
            {/* PAGINATION FOOTER */}
<div className="d-flex justify-content-center align-items-center gap-2 my-3">

  {/* PREV BUTTON */}
  <button
    className="btn btn-outline-secondary btn-sm"
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(prev => prev - 1)}
  >
    ⬅ Prev
  </button>

  {/* PAGE NUMBERS */}
  {[...Array(totalPages)].map((_, index) => {
    const page = index + 1;
    return (
      <button
        key={page}
        className={`btn btn-sm ${
          page === currentPage ? "btn-primary" : "btn-outline-secondary"
        }`}
        onClick={() => setCurrentPage(page)}
      >
        {page}
      </button>
    );
  })}

  {/* NEXT BUTTON */}
  <button
    className="btn btn-outline-secondary btn-sm"
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage(prev => prev + 1)}
  >
    Next ➡
  </button>

</div>

          </div>
        </div>
      </div>

      {/* ===================== COA MODAL ===================== */}
      {showCoaModal && coaData && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.5)", paddingTop: "108px" }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content" style={{ maxWidth: "1155px" }}>
              {/* HEADER */}
              <div className="modal-header justify-content-between" style={{ backgroundColor: "darkcyan", color: "white" }}>
                <h5 className="modal-title">CREATE COA</h5>
                <span style={{ cursor: "pointer", fontWeight: "bold", fontSize: "20px" }} onClick={() => setShowCoaModal(false)}>×</span>
              </div>

              {/* BODY */}
              <div className="modal-body">
                {/* Main Table */}
                <table className="table table-bordered table-striped">
                  <thead style={{ backgroundColor: "rosybrown" }}>
                    <tr>
                      <th>Prod Plan Date</th>
                      <th>Buyer</th>
                      <th>SO</th>
                      <th>Item</th>
                      <th>Item Code</th>
                      <th>Grade</th>
                      <th>Machine</th>
                      <th>Operator</th>
                      <th>Plan Date</th>
                      <th>Shift</th>
                      <th>Batch</th>
                      <th>Plan Qty</th>
                      <th>Actual Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{coaData.prodPlanDate?.substring(0, 10)}</td>
                      <td>{coaData.buyerName}</td>
                      <td>{coaData.soNumber}</td>
                      <td>{coaData.itemName}</td>
                      <td>{coaData.itemCode}</td>
                      <td>{coaData.grade}</td>
                      <td>{coaData.machineNo}</td>
                      <td>{coaData.operator}</td>
                      <td>{coaData.planDate?.substring(0, 10)}</td>
                      <td>{coaData.shift}</td>
                      <td>{coaData.batchNo}</td>
                      <td>{coaData.planQty}</td>
                      <td>{coaData.actualQty}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Parameter Table */}
                <h5 className="text-center fw-bold mt-4 mb-3">PARAMETER VALUES</h5>
                <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
                  <table className="table table-bordered table-striped align-middle" style={{ minWidth: "1500px" }}>
                    <thead style={{ backgroundColor: "rosybrown" }}>
                      <tr>
                        <th style={{ minWidth: "190px" }}>Grade</th>
                        <th style={{ minWidth: "100px" }}>Width in mm/inch</th>
                        <th style={{ minWidth: "100px" }}>Length in mm/inch</th>
                        <th style={{ minWidth: "100px" }}>Thickness/MIC</th>
                        <th style={{ minWidth: "100px" }}>Height in mm/inch</th>
                        <th style={{ minWidth: "100px" }}>Part Number</th>
                        <th style={{ minWidth: "100px" }}>Weight in gram</th>
                        <th style={{ minWidth: "120px" }}>Weight per Cover</th>
                        <th style={{ minWidth: "120px" }}>Printing Quality</th>
                        <th style={{ minWidth: "100px" }}>Color</th>
                        <th style={{ minWidth: "100px" }}>VCI Test</th>
                        <th style={{ minWidth: "100px" }}>Dust</th>
                        <th style={{ minWidth: "100px" }}>Remark</th>
                        <th style={{ minWidth: "120px" }}>Moisture Free</th>
                        <th style={{ minWidth: "80px" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parameterRows.map((row, index) => (
                        <tr key={index}>
                          <td><input className="form-control" value={row.grade} readOnly /></td>
                          <td><input className="form-control" value={row.width} onChange={e => handleParamChange(index, "width", e.target.value)} /></td>
                          <td><input className="form-control" value={row.length} onChange={e => handleParamChange(index, "length", e.target.value)} /></td>
                          <td><input className="form-control" value={row.thickness} onChange={e => handleParamChange(index, "thickness", e.target.value)} /></td>
                          <td><input className="form-control" value={row.height} onChange={e => handleParamChange(index, "height", e.target.value)} /></td>
                          <td><input className="form-control" value={row.partNumber} onChange={e => handleParamChange(index, "partNumber", e.target.value)} /></td>
                          <td><input className="form-control" value={row.weight} onChange={e => handleParamChange(index, "weight", e.target.value)} /></td>
                          <td><input className="form-control" value={row.weightPerCover} onChange={e => handleParamChange(index, "weightPerCover", e.target.value)} /></td>
                          <td><input className="form-control" value={row.printingQuality} onChange={e => handleParamChange(index, "printingQuality", e.target.value)} /></td>
                          <td><input className="form-control" value={row.color} onChange={e => handleParamChange(index, "color", e.target.value)} /></td>
                          <td><input className="form-control" value={row.vciTest} onChange={e => handleParamChange(index, "vciTest", e.target.value)} /></td>
                          <td><input className="form-control" value={row.dust} onChange={e => handleParamChange(index, "dust", e.target.value)} /></td>
                          <td><input className="form-control" value={row.remark} onChange={e => handleParamChange(index, "remark", e.target.value)} /></td>
                          <td><input className="form-control" value={row.moistureFree} onChange={e => handleParamChange(index, "moistureFree", e.target.value)} /></td>
                          <td className="text-center">
                            {index === 0 ? (
                              <button className="btn btn-sm" style={{ backgroundColor: "cornflowerblue", color: "white" }} onClick={addParamRow}>Add</button>
                            ) : (
                              <button className="btn btn-danger btn-sm" onClick={() => removeParamRow(index)}>Remove</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* FOOTER */}
              <div className="modal-footer justify-content-center">
                <button
                  className="btn btn-success"
                  onClick={handleSaveCOA}
                  disabled={savingCOA}
                >
                  {savingCOA ? "Saving..." : "Save COA"}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinishcompleteDailyProduction ;

