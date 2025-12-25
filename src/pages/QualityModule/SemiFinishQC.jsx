import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../config/apiconfig";

function SemiFinishQC() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  /* ================= FETCH ================= */
  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(API_ENDPOINTS.GetSemiFinishPlanReport);
      if (!res.ok) throw new Error("Failed to fetch data");

      const data = await res.json();
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  /* ================= STYLES ================= */
  const containerStyle = { padding: 20, maxWidth: "100%" };
  const tableWrapperStyle = { overflowX: "auto" };
  const tableStyle = { width: "100%", borderCollapse: "collapse", minWidth: 1600 };
  const thStyle = {
    backgroundColor: "#2c4d9b",
    color: "white",
    padding: "12px 10px",
    border: "1px solid #ddd",
    textAlign: "center",
    whiteSpace: "nowrap",
  };
  const tdStyle = {
    padding: "10px 8px",
    border: "1px solid #ddd",
    textAlign: "center",
    whiteSpace: "nowrap",
  };
  const inputStyle = { width: 70, padding: 4, textAlign: "center" };
  const buttonSubmit = {
    padding: "6px 12px",
    backgroundColor: "#228B22",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  };
  const controlBarStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
    flexWrap: "wrap",
  };
  const searchInputStyle = { padding: 6, width: 220 };
  const paginationStyle = { marginTop: 10, textAlign: "right" };
  const getRowStyle = (i) => ({
    backgroundColor: i % 2 === 0 ? "#e7f0ff" : "white",
  });

  /* ================= INPUT CHANGE ================= */
  const handleRejectionChange = (planId, value, actualQty) => {
    let rejectionQty = parseFloat(value);
    if (isNaN(rejectionQty) || rejectionQty < 0) rejectionQty = 0;

    if (rejectionQty > actualQty) {
      alert("Rejection Quantity cannot exceed Actual Quantity!");
      rejectionQty = actualQty;
    }

    const qtyToWH = actualQty - rejectionQty;

    setInputValues((prev) => ({
      ...prev,
      [planId]: {
        rejectionQty,
        qtyToWH,
      },
    }));
  };

  /* ================= SUBMIT ALL OR SINGLE ================= */
  const handleSubmit = async (planId) => {
    const data = inputValues[planId];
    if (!data) {
      alert("Please enter Rejection Qty first");
      return;
    }

    try {
      const res = await fetch(API_ENDPOINTS.SaveSemiFinRejectionQty, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([
          {
            PlanId: planId,
            RejectionQty: data.rejectionQty,
            QtyToWH: data.qtyToWH,
          },
        ]),
      });

      const result = await res.json();
      if (!result.success) {
        alert(result.message || "Failed to save data");
        return;
      }

      alert(result.message);
      fetchRecords();

      // Clear input values for that row
      setInputValues((prev) => {
        const copy = { ...prev };
        delete copy[planId];
        return copy;
      });
    } catch (err) {
      alert("Error while submitting QC: " + err.message);
    }
  };

  /* ================= SEARCH & PAGINATION ================= */
  const filteredRecords = records.filter((rec) => {
    const search = searchTerm.toLowerCase();
    return (
      rec.planCode?.toLowerCase().includes(search) ||
      rec.location?.toLowerCase().includes(search) ||
      rec.buyerName?.toLowerCase().includes(search) ||
      rec.soNumber?.toLowerCase().includes(search) ||
      rec.finishItemName?.toLowerCase().includes(search) ||
      rec.finishGrade?.toLowerCase().includes(search) ||
      rec.semiFinishItemName?.toLowerCase().includes(search) ||
      rec.semiFinishGrade?.toLowerCase().includes(search) ||
      rec.machineName?.toLowerCase().includes(search) ||
      rec.machineNumber?.toLowerCase().includes(search) ||
      rec.batchNo?.toLowerCase().includes(search)
    );
  });

  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRecords = filteredRecords.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;

  /* ================= UI ================= */
  return (
    <div style={containerStyle}>
      <div className="card shadow-lg">
        <div className="card-header text-white text-center" style={{ backgroundColor: "#1f3c88" }}>
          <h5 className="mb-0">📊 SEMI FINISH QC REPORT</h5>
        </div>
        <div className="card-body">
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

          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Plan Date</th>
                  <th style={thStyle}>Finish Item<br/>Finish Grade</th>
                  <th style={thStyle}>Buyer Name <br/> SO Number</th>
                  <th style={thStyle}>Semi Finish Item <br/>Semi Finish Grade</th>
                  <th style={thStyle}>Plan Code<br/>Location<br/>Operator</th>
                  <th style={thStyle}>Machine Name<br/>Machine No<br/>Capacity</th>
                  <th style={thStyle}>Plan Date<br/>Shift <br/>Batch No</th>
                  <th style={thStyle}>Plan Qty</th>
                  <th style={thStyle}>Actual Qty</th>
                  <th style={thStyle}>Rejection Qty</th>
                  <th style={thStyle}>Qty To WH</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedRecords.map((rec, i) => (
                  <tr key={rec.planId} style={getRowStyle(i)}>
                    <td style={tdStyle}>{rec.date ? new Date(rec.date).toLocaleDateString("en-GB") : "-"}</td>
                    <td style={tdStyle}>{rec.finishItemName}<br />{rec.finishGrade}</td>
                    <td style={tdStyle}>{rec.buyerName}<br />{rec.soNumber}</td>
                    <td style={tdStyle}>{rec.semiFinishItemName}<br />{rec.semiFinishGrade}</td>
                    <td style={tdStyle}>{rec.planCode}<br />{rec.location}<br />{rec.opName}</td>
                    <td style={tdStyle}>{rec.machineName}<br />{rec.machineNumber}<br />{rec.machineCap}</td>
                    <td style={tdStyle}>{rec.planDate ? new Date(rec.planDate).toLocaleDateString("en-GB") : "-"}<br />{rec.shift}<br />{rec.batchNo}</td>
                    <td style={tdStyle}>{rec.planQty}</td>
                    <td style={tdStyle}>{rec.actualQty}</td>

                    <td style={tdStyle}>
                      <input
                        type="number"
                        style={inputStyle}
                        value={inputValues[rec.planId]?.rejectionQty ?? rec.rejectionQty ?? ""}
                        onChange={(e) =>
                          handleRejectionChange(rec.planId, e.target.value, rec.actualQty)
                        }
                      />
                    </td>

                    <td style={tdStyle}>
                      {inputValues[rec.planId]?.qtyToWH ?? (rec.actualQty - (rec.rejectionQty || 0))}
                    </td>

                    <td style={tdStyle}>
                      <button
                        style={buttonSubmit}
                        onClick={() => handleSubmit(rec.planId)}
                      >
                        Submit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ ...paginationStyle, display: "flex", justifyContent: "flex-end", gap: 6 }}>
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>⬅ Prev</button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                style={{
                  backgroundColor: currentPage === i + 1 ? "#1f3c88" : "#eee",
                  color: currentPage === i + 1 ? "white" : "black"
                }}
              >
                {i + 1}
              </button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next ➡</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SemiFinishQC;
