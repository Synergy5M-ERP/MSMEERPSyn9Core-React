import React, { useEffect, useState, useCallback, useRef } from "react";
import { API_ENDPOINTS } from "../../config/apiconfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const getToday = () => new Date().toISOString().split("T")[0];

const PaymentAllocation = () => {
  const [date, setDate] = useState(getToday());
  const [ledgerId, setLedgerId] = useState("");
  const [actualBal, setActualBal] = useState(0);
  const [baseActualBal, setBaseActualBal] = useState(0);
  const [selectedVendor, setSelectedVendor] = useState("");

  const [ledgerOptions, setLedgerOptions] = useState([]);
  const [rows, setRows] = useState([]);
  
  // ✅ Track original vs modified data
  const [originalRows, setOriginalRows] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const originalRowsRef = useRef([]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Group rows by vendor for display
  const groupedRows = rows.reduce((acc, row) => {
    if (!acc[row.vendorName]) acc[row.vendorName] = [];
    acc[row.vendorName].push(row);
    return acc;
  }, {});

  // ✅ Check if data has unsaved changes
  const hasUnsavedChanges = useCallback(() => {
    return JSON.stringify(rows) !== JSON.stringify(originalRows);
  }, [rows, originalRows]);

  // Load ledgers on mount
  useEffect(() => {
    const loadLedgers = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.Ledger);
        if (!res.ok) throw new Error("Failed to load ledgers");

        const data = await res.json();
        setLedgerOptions(data || []);

        if (data && data.length > 0) {
          const first = data[0];
          const bal = Number(first.closingBal || 0);
          setLedgerId(first.accountLedgerId.toString());
          setBaseActualBal(bal);
          setActualBal(bal);
        }
      } catch (err) {
        console.error(err);
        toast.error("❌ Unable to load ledger list", {
          toastId: "ledger-load-error"
        });
        setError("Unable to load ledger list.");
      }
    };

    loadLedgers();
  }, []);

  // ✅ Store original data when rows load
  useEffect(() => {
    if (rows.length > 0) {
      originalRowsRef.current = [...rows];
      setOriginalRows([...rows]);
      setIsDirty(false);
    }
  }, [rows.length]);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString()
        });

        const res = await fetch(`${API_ENDPOINTS.GetApprovedGrn}?${params.toString()}`);

        if (!res.ok) throw new Error(`Failed to load approved GRNs: ${res.status}`);

        const data = await res.json();
        const items = data.data || [];

        const sortedItems = items.sort((a, b) =>
          new Date(b.GRNDate || b.grnDate) - new Date(a.GRNDate || a.grnDate)
        );
const mapped = sortedItems.map((r) => {

  console.log("Each Row:", r); // 👈 DEBUG

  const totalAmount = Number(
    r.totalAmount ??
    r.total_Amount ??   // ✅ correct property from API
    0
  );
  const paidAmount = Number(
    r.paidAmount ??
    r.PaidAmount ??
    0
  );

  const balanceAmount = totalAmount - paidAmount;

  return {
    accountGRNId: r.accountGRNId ?? r.AccountGRNId,
    grnNumber: r.grnNumber ?? r.GRNNumber,
    grnDate: (r.grnDate ?? r.GRNDate)?.split("T")[0] || "",
    vendorName: r.vendorName ?? r.VendorName ?? "",
    poNumber: r.poNumber ?? r.PONumber ?? "",
    invoiceNumber: r.invoiceNumber ?? r.InvoiceNumber ?? "",

    bankName: "",
    rtgsNumber: "",
    rtgsDate: "",

    totalAmount,
    paidAmount,
    balanceAmount,
    isChecked: balanceAmount === 0
  };
});
        setRows(mapped);
        setTotalCount(data.totalCount || items.length);

        const totalPaid = mapped.reduce((sum, row) => sum + (row.paidAmount || 0), 0);
        setActualBal(Math.max(0, baseActualBal - totalPaid));

      } catch (err) {
        console.error('Fetch error:', err);
        toast.error("❌ Unable to load approved GRNs", {
          toastId: "grn-load-error"
        });
        setError("Unable to load approved GRNs.");
        setRows([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [page, pageSize, baseActualBal]);

  // ✅ Enhanced handlePaidChange with toast
const handlePaidChange = (accountGRNId, value) => {
  const numeric = Number(value);
  const paidVal = Number.isNaN(numeric) || numeric < 0 ? 0 : numeric;

  setRows(prevRows => {
    const updated = prevRows.map(row => {
      if (row.accountGRNId !== accountGRNId) return row;

      // ✅ Here we calculate balance considering already paid amount
      const totalPaidSoFar = paidVal; // overwrite paidAmount with typed value
      const newBalance = row.totalAmount - totalPaidSoFar;

      return {
        ...row,
        paidAmount: totalPaidSoFar,
        balanceAmount: newBalance,
        isChecked: newBalance === 0
      };
    });

    const totalPaid = updated.reduce((sum, r) => sum + (r.paidAmount || 0), 0);
    setActualBal(Math.max(0, baseActualBal - totalPaid));
    setIsDirty(true);
    return updated;
  });
};

const handleCheckboxChange = (accountGRNId) => {
  setRows(prevRows =>
    prevRows.map(row => {
      if (row.accountGRNId !== accountGRNId) return row;

      // Only allow toggle if fully paid
      if (row.balanceAmount > 0) return row;

      return {
        ...row,
        isChecked: !row.isChecked
      };
    })
  );
  setIsDirty(true);
};

  // ✅ ENHANCED SAVE with detailed toast
  const handleSave = async () => {
    const selectedRows = rows.filter(r => r.paidAmount > 0);
debugger;
    if (selectedRows.length === 0) {
      toast.warning("⚠️ Please enter paid amounts for at least one GRN", {
        toastId: "no-payments"
      });
      return;
    }

    const totalAmount = selectedRows.reduce((sum, r) => sum + r.paidAmount, 0);
    
    if (!window.confirm(
      `💰 Save ${selectedRows.length} payment allocation(s)?\n\n` +
      `Total Amount: ₹${totalAmount.toFixed(2)}\nLedger: ${ledgerOptions.find(l => l.accountLedgerId.toString() === ledgerId)?.accountLedgerName || 'N/A'}\nDate: ${date}`
    )) {
      return;
    }

    toast.loading("💾 Saving payment allocations...", { toastId: "save-loading" });

    try {
     const payload = {
  ledgerId: Number(ledgerId),
  date: date,
  payments: selectedRows.map(row => ({
    accountGRNId: row.accountGRNId,

    totalAmount: Number(row.totalAmount),
    paidAmount: Number(row.paidAmount),
    balanceAmount: Number(row.balanceAmount),

    cgst: 0,
    sgst: 0,
    igst: 0,

    rtgsNo: row.rtgsNumber || "",
    rtgsDate: row.rtgsDate || null
  }))
};


      const res = await fetch(API_ENDPOINTS.SavePaymentAllocation, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save payment allocations");
      }

      toast.dismiss("save-loading");
      toast.success(`✅ Payment allocations saved successfully!\nTotal: ₹${totalAmount.toFixed(2)}`, {
        toastId: "save-success"
      });
      
      setIsDirty(false);
      setOriginalRows([...rows]);
      originalRowsRef.current = [...rows];
      setPage(1);
      
    } catch (err) {
      toast.dismiss("save-loading");
      toast.error(`❌ Save failed: ${err.message}`, {
        toastId: "save-error"
      });
      console.error(err);
    }
  };

  // ✅ ENHANCED CANCEL with detailed toast
  const handleCancel = () => {
    if (!hasUnsavedChanges()) {
      toast.info("ℹ️ No changes to cancel", {
        toastId: "no-changes"
      });
      return;
    }

    const changesCount = rows.filter((row, idx) => 
      row.paidAmount !== originalRowsRef.current.find(r => r.accountGRNId === row.accountGRNId)?.paidAmount
    ).length;

    if (window.confirm(`🚫 Discard ${changesCount} unsaved changes?`)) {
      toast.loading("🔄 Restoring original data...", { toastId: "cancel-loading" });
      
      setRows([...originalRowsRef.current]);
      setIsDirty(false);
      
      const totalPaid = originalRowsRef.current.reduce((sum, r) => sum + (r.paidAmount || 0), 0);
      setActualBal(Math.max(0, baseActualBal - totalPaid));
      
      toast.dismiss("cancel-loading");
      toast.success("✅ Changes discarded successfully", {
        toastId: "cancel-success"
      });
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startIndex = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, totalCount);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  return (
    <>
      <ToastContainer 
        position="top-right" 
        theme="colored"
        limit={3}
        autoClose={4000}
      />
      <div className="container my-4">
        <div className="card shadow-sm">
          <div className="card-header bg-success text-white">
            <h5 className="mb-0">Payment Allocation</h5>
          </div>

          <div className="card-body">
            {/* Filters */}
            <div className="row g-3 mb-3">
              <div className="row align-items-end">
                <div className="col-3">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setPage(1);
                    }}
                    style={{ height: '40px' }}
                  />
                </div>
                <div className="col-4">
                  <label className="form-label">Ledger Account</label>
                  <select
                    className="form-select"
                    style={{ height: '40px' }}
                    value={ledgerId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setLedgerId(id);
                      setPage(1);
                      const selected = ledgerOptions.find(
                        (l) => l.accountLedgerId.toString() === id
                      );
                      if (selected) {
                        const bal = Number(selected.closingBal || 0);
                        setBaseActualBal(bal);
                        setActualBal(bal);
                      }
                    }}
                  >
                    <option value="">Select ledger</option>
                    {ledgerOptions.map((l) => (
                      <option key={l.accountLedgerId} value={l.accountLedgerId}>
                        {l.accountLedgerName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-4">
                  <label className="form-label m-2">Balance Details</label>
                  <div
                    className={`alert mb-0 d-flex align-items-center ${
                      actualBal === 0 ? 'alert-danger' :
                        actualBal < rows.reduce((sum, r) => sum + (r.paidAmount || 0), 0) * 0.1 ? 'alert-warning' : 'alert-success'
                    }`}
                    style={{ height: '40px', paddingTop: '0', paddingBottom: '0' }}
                  >
                    <span>
                      <strong>Balance:</strong> ₹{actualBal.toFixed(2)} |
                      <strong> Allocated:</strong> ₹{rows.reduce((sum, r) => sum + (r.paidAmount || 0), 0).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="col-1">
                  <label className="form-label m-2">Pages:</label>
                  <select
                    className="form-select"
                    style={{ width: "90px" }}
                    value={pageSize}
                    onChange={handlePageSizeChange}
                  >
                    {[1,3,5, 10, 25, 50, 100].map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Error & loading */}
            {error && (
              <div className="alert alert-danger py-2 mb-3" role="alert">{error}</div>
            )}
            {loading && (
              <div className="alert alert-info py-2 mb-3" role="alert">Loading...</div>
            )}

            {/* ✅ Unsaved changes warning */}
            {/* {isDirty && (
              <div className="alert alert-warning py-2 mb-3 d-flex align-items-center" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                <div>
                  <strong>Unsaved changes detected</strong> ({rows.filter(r => r.paidAmount > 0).length} payments)
                  <br className="d-none d-md-block" />
                  <small className="d-md-block">Use Save/Cancel buttons below</small>
                </div>
              </div>
            )} */}

            {/* Table */}
            <div 
              className="table-responsive" 
              style={{ 
                maxHeight: '350px',
                overflowY: 'auto',
                overflowX: 'auto',
                border: '1px solid #dee2e6',
                borderRadius: '0.375rem',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.075)'
              }}
            >
              <table className="table table-striped table-hover table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th className="text-center">Select</th>
                    <th>GRN No</th>
                    <th>GRN Date</th>
                    <th>Vendor Name</th>
                    <th>PO Number</th>
                    <th>Invoice No</th>
                   
                    <th>Total Amount</th>
                    <th>Paid Amount</th>
                    <th>Balance Amount</th>
                      <th>Bank Name</th>
    <th>RTGS Number</th>
    <th>RTGS Date</th>

                  </tr>
                </thead>
                <tbody>
                  {/* Table body remains exactly the same */}
                  {Object.keys(groupedRows).length > 0 ? (
                    Object.entries(groupedRows).map(([vendorName, vendorRows]) => (
                      <React.Fragment key={vendorName}>
                        {vendorRows.map((row) => (
                          <tr key={row.accountGRNId} className="table-hover">
                            <td className="text-center align-middle">
                              <div className="form-check">
                                <input
                                  className="form-check-input shadow-sm"
                                  type="checkbox"
                                  checked={row.isChecked}
                                  disabled={row.balanceAmount > 0}
                                  onChange={() => handleCheckboxChange(row.accountGRNId)}
                                />
                              </div>
                            </td>
                            <td className="align-middle text-muted small">{row.grnNumber}</td>
                            <td className="fw-semibold align-middle text-muted small">{row.grnDate}</td>
                            <td className="fw-semibold align-middle text-muted small">{row.vendorName}</td>
                            <td className="fw-semibold align-middle text-muted small">{row.poNumber}</td>
                            <td className="fw-semibold align-middle text-muted small">{row.invoiceNumber}</td>
                            
                            <td className="fw-semibold text-end align-middle fw-bold text-primary">
₹{Number(row.totalAmount || 0).toFixed(2)}                            </td>
                            <td className="align-middle">
                              <input
                                type="number"
                                className="form-control form-control-sm shadow-sm"
                                style={{ minWidth: "120px" }}
                                min="0"
                                max={row.totalAmount}
                                value={row.paidAmount}
                                onChange={(e) => handlePaidChange(row.accountGRNId, e.target.value)}
                              />
                            </td>
                            <td className="text-end align-middle">
                              <span className={`badge fs-6 fw-semibold px-3 py-2 shadow-sm ${
                                row.balanceAmount === 0
                                  ? 'bg-success text-white border border-2 border-success'
                                  : 'bg-warning text-dark border border-2 border-warning'
                              }`}>
                                ₹{row.balanceAmount.toFixed(2)}
                              </span>
                            </td>
                            <td>
  <input
    type="text"
    className="form-control form-control-sm"
    value={row.bankName}
    onChange={(e) =>
      setRows(prev =>
        prev.map(r =>
          r.accountGRNId === row.accountGRNId
            ? { ...r, bankName: e.target.value }
            : r
        )
      )
    }
  />
</td>

<td>
  <input
    type="text"
    className="form-control form-control-sm"
    value={row.rtgsNumber}
    onChange={(e) =>
      setRows(prev =>
        prev.map(r =>
          r.accountGRNId === row.accountGRNId
            ? { ...r, rtgsNumber: e.target.value }
            : r
        )
      )
    }
  />
</td>

<td>
  <input
    type="date"
    className="form-control form-control-sm"
    value={row.rtgsDate}
    onChange={(e) =>
      setRows(prev =>
        prev.map(r =>
          r.accountGRNId === row.accountGRNId
            ? { ...r, rtgsDate: e.target.value }
            : r
        )
      )
    }
  />
</td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="13" className="text-center py-5">
                        <div className="py-5">
                          <h5 className="text-muted mb-1">{loading ? "Loading approved GRNs..." : "No approved GRNs found"}</h5>
                          <p className="text-muted">Check your filters or vendor selection</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ✅ PAGINATION */}
            <div className="d-flex flex-column flex-md-row align-items-center justify-content-between mt-3 mb-3 gap-2">
              <nav aria-label="Page navigation">
                <ul className="pagination mb-0">
                  <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => handlePageChange(1)}>« First</button>
                  </li>
                  <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => handlePageChange(page - 1)}>‹ Prev</button>
                  </li>
                  <li className="page-item disabled">
                    <span className="page-link">Page {page} of {totalPages}</span>
                  </li>
                  <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => handlePageChange(page + 1)}>Next ›</button>
                  </li>
                  <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => handlePageChange(totalPages)}>Last »</button>
                  </li>
                </ul>
              </nav>
              <div className="text-muted small">
                Showing {startIndex}–{endIndex} of {totalCount}
              </div>
            </div>

            {/* ✅ NEW: Save/Cancel Buttons AT BOTTOM AFTER TABLE */}
            <div className="d-flex justify-content-center gap-3 p-3 bg-light border-top rounded-bottom">
              <button 
                className="btn btn-secondary btn-lg px-4 py-2 shadow-sm"
                onClick={handleCancel}
                disabled={!isDirty || loading}
              >
                {/* <i className="bi bi-x-circle-fill me-2"></i> */}
                Cancel 
              </button>
              <button 
                className={`btn btn-success btn-lg px-4 py-2 shadow-sm position-relative ${
                  !isDirty || rows.filter(r => r.paidAmount > 0).length === 0 ? 'opacity-50' : ''
                }`}
                onClick={handleSave}
                disabled={!isDirty || loading || rows.filter(r => r.paidAmount > 0).length === 0}
              >
                {/* <i className="bi bi-check-circle-fill me-2"></i> */}
                Save 
                {isDirty && rows.filter(r => r.paidAmount > 0).length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {rows.filter(r => r.paidAmount > 0).length}
                    <span className="visually-hidden">payments ready</span>
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentAllocation;





