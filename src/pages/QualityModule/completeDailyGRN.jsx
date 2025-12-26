import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../config/apiconfig";

function CompleteDailyGRN() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);


  
  /* ================= FETCH FUNCTION ================= */
  const fetchRecords = () => {
    setLoading(true);
    fetch(API_ENDPOINTS.GetInwardQCRecords)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        setRecords(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  /* ================= STYLES ================= */
  const containerStyle = { padding: 20, maxWidth: "100%" };
  const tableWrapperStyle = { overflowX: "auto" };
  const tableStyle = { width: "100%", borderCollapse: "collapse", minWidth: 1200 };
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
  const inputStyle = { width: "70px", padding: "4px", textAlign: "center" };
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
  const searchInputStyle = { padding: 6, width: 200 };
  const paginationStyle = { marginTop: 10, textAlign: "right" };

  const getRowStyle = (i) => ({
    backgroundColor: i % 2 === 0 ? "#e7f0ff" : "white",
  });

  /* ================= INPUT HANDLER ================= */
  const handleInputChange = (id, field, value) => {
    setInputValues((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  /* ================= SUBMIT API CALL ================= */
  const handleSubmit = async (productId) => {
    const data = inputValues[productId];

    if (!data?.rejectedQty || !data?.qtyToBeRepaired) {
      alert("Please enter Rejected Qty and Qty To Be Repaired");
      return;
    }

    try {
      const url =
        `${API_ENDPOINTS.SubmitInwardQC}` +
        `?productId=${productId}` +
        `&rejectedQty=${data.rejectedQty}` +
        `&holdQty=${data.qtyToBeRepaired}`;

      const response = await fetch(url, { method: "POST" });
      const result = await response.json();

      if (!result.success) {
        alert(result.message);
        return;
      }

      // ✅ Success message
      alert(result.message);

      // ✅ Refresh table data
      fetchRecords();

      // ✅ Clear input fields for this row
      setInputValues((prev) => {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      });
    } catch (err) {
      console.error(err);
      alert("Error while submitting QC");
    }
  };

  /* ================= SEARCH + PAGINATION ================= */
  const filteredRecords = records.filter((rec) =>
    Object.values(rec).some((v) =>
      String(v).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRecords = filteredRecords.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;

  return (
    <div style={containerStyle}>
      <div className="card shadow-lg">

        {/* HEADER */}
        <div
          className="card-header text-white text-center"
          style={{ backgroundColor: "#1f3c88" }}
        >
          <h5 className="mb-0">📊 INWARD QC REPORT</h5>
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

          {/* TABLE */}
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
            <tr>
              <th style={thStyle}>GRN No<br />GRN Date</th>
              <th style={thStyle}>Supplier Name<br/>UOM</th>
              <th style={thStyle}>Invoice No<br />Invoice Date</th>
              <th style={thStyle}>PO No<br />PO Date</th>
              <th style={thStyle}>Item Name<br />Grade</th>
              <th style={thStyle}>Invoice Qty</th>
              <th style={thStyle}>Received Qty</th>
              <th style={thStyle}>Rejection Qty</th>
              <th style={thStyle}>Qty To Be Hold/Repaired</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>


              <tbody>
                {paginatedRecords.map((rec, i) => {
                  const id = rec.g_Product_Id || rec.id || i;
                  return (
                    <tr key={id} style={getRowStyle(i)}>
                      <td style={tdStyle}>{rec.grN_NO}<br />{rec.grN_Date && new Date(rec.grN_Date).toLocaleDateString()}</td>
                      <td style={tdStyle}>{rec.supplier_Name}<br/>{rec.uom}</td>
                      <td style={tdStyle}>{rec.invoice_NO}<br />{rec.invoice_Date && new Date(rec.invoice_Date).toLocaleDateString()}</td>
                      <td style={tdStyle}>{rec.pO_No}<br />{rec.purchase_Date && new Date(rec.purchase_Date).toLocaleDateString()}</td>
                      <td style={tdStyle}>{rec.item_Name}<br />{rec.item_Descrpition}</td>
                      <td style={tdStyle}>{rec.challan_Qty}</td>
                      <td style={tdStyle}>{rec.received_Qty}</td>

                      <td style={tdStyle}>
                        <input
                          type="number"
                          style={inputStyle}
                          value={inputValues[id]?.rejectedQty || ""}
                          onChange={(e) =>
                            handleInputChange(id, "rejectedQty", e.target.value)
                          }
                        />
                      </td>

                      <td style={tdStyle}>
                        <input
                          type="number"
                          style={inputStyle}
                          value={inputValues[id]?.qtyToBeRepaired || ""}
                          onChange={(e) =>
                            handleInputChange(id, "qtyToBeRepaired", e.target.value)
                          }
                        />
                      </td>

                      <td style={tdStyle}>
                        <button
                          style={buttonSubmit}
                          onClick={() => handleSubmit(id)}
                        >
                          Submit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div style={{ ...paginationStyle, display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          style={{
            padding: "5px 10px",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
          }}
        >
          ⬅ Prev
        </button>

        {/* Page Numbers */}
        {[...Array(totalPages)].map((_, index) => {
          const page = index + 1;
          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                padding: "5px 10px",
                backgroundColor: page === currentPage ? "#1f3c88" : "#f0f0f0",
                color: page === currentPage ? "white" : "black",
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              {page}
            </button>
          );
        })}

        <button
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((p) => Math.min(p + 1, totalPages))
          }
          style={{
            padding: "5px 10px",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          }}
        >
          Next ➡
        </button>
      </div>


        </div>
      </div>
    </div>
  );
}

export default CompleteDailyGRN;
