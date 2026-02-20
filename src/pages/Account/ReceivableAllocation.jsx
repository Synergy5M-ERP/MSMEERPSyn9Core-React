import React, { useEffect, useState, useCallback, useRef } from "react";
import { API_ENDPOINTS } from "../../config/apiconfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Badge } from "lucide-react";
import { Spinner } from "react-bootstrap";
const getToday = () => new Date().toISOString().split("T")[0];

const ReceivableAllocation = () => {
  const [date, setDate] = useState(getToday());
  const [ledgerId, setLedgerId] = useState("");
  const [actualBal, setActualBal] = useState(0);
  const [baseActualBal, setBaseActualBal] = useState(0);

  const [ledgerOptions, setLedgerOptions] = useState([]);
  const [rows, setRows] = useState([]);
  
  // ✅ NEW: Save/Cancel state management
  const [originalRows, setOriginalRows] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const originalRowsRef = useRef([]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Group rows by buyer for display
  const groupedRows = rows.reduce((acc, row) => {
    if (!acc[row.buyerName]) acc[row.buyerName] = [];
    acc[row.buyerName].push(row);
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
        toast.error("❌ Unable to load ledger list", { toastId: "ledger-error" });
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

  // ✅ Load approved invoices with pagination
  useEffect(() => {
    const fetchReceivables = async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString()
        });

        console.log('Fetching Invoices with params:', params.toString());

        const res = await fetch(`${API_ENDPOINTS.GetApprovedInvoice}?${params.toString()}`);

        if (!res.ok) throw new Error(`Failed to load approved invoices: ${res.status}`);

        const data = await res.json();
        console.log('API Response:', data);

        const items = data.data || data.items || [];
        console.log('Items count:', items.length);

        const sortedItems = items.sort((a, b) =>
          new Date(b.invoiceDate || b.InvoiceDate) - new Date(a.invoiceDate || a.InvoiceDate)
        );

        const mapped = sortedItems.map((r) => {
          const totalAmount = Number(r.TotalAmount || r.totalAmount || r.grandTotal || 0);
          const receivedAmount = Number(r.receivedAmount || r.ReceivedAmount || 0);
          const balanceAmount = totalAmount - receivedAmount;

          return {
            invoiceId: r.InvoiceId || r.invoiceId,
            invoiceNo: r.InvoiceNo || r.invoiceNo || r.InvoiceNumber,
            invoiceDate: (r.InvoiceDate || r.invoiceDate)?.split('T')[0] || r.invoiceDate,
            buyerName: r.BuyerName || r.buyerName || r.CustomerName,
            paymentDueDate: (r.PaymentDueDate || r.paymentDueDate)?.split('T')[0] || r.paymentDueDate,
            cgst: Number(r.CGST || r.cgst || 0),
            sgst: Number(r.SGST || r.sgst || 0),
            igst: Number(r.IGST || r.igst || 0),
            totalAmount,
            receivedAmount,
            balanceAmount,
            isChecked: balanceAmount === 0
          };
        });

        setRows(mapped);
        setTotalCount(data.totalCount || items.length);

        const totalReceived = mapped.reduce((sum, row) => sum + (row.receivedAmount || 0), 0);
        setActualBal(Math.max(0, baseActualBal - totalReceived));

      } catch (err) {
        console.error('Fetch error:', err);
        toast.error("❌ Unable to load approved invoices", { toastId: "invoices-error" });
        setError("Unable to load approved invoices.");
        setRows([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchReceivables();
  }, [page, pageSize, baseActualBal]);

  // ✅ ENHANCED: REAL-TIME balance validation with dirty state
  const handleReceivedChange = (invoiceId, value) => {
    const numeric = Number(value);
    const receivedVal = Number.isNaN(numeric) || numeric < 0 ? 0 : numeric;

    setRows(prevRows => {
      const currentTotalReceived = prevRows.reduce((sum, row) =>
        row.invoiceId === invoiceId ? sum : sum + (row.receivedAmount || 0), 0
      );
      const proposedTotalReceived = currentTotalReceived + receivedVal;

      if (proposedTotalReceived > baseActualBal) {
        toast.error(
          `⚠️ Insufficient balance!\nAvailable: ₹${baseActualBal.toFixed(2)}\nProposed: ₹${proposedTotalReceived.toFixed(2)}`,
          { toastId: "balance-error" }
        );
        return prevRows;
      }

      const updated = prevRows.map(row => {
        if (row.invoiceId !== invoiceId) return row;
        const newReceived = Math.min(receivedVal, row.totalAmount);
        const newBalance = row.totalAmount - newReceived;
        return {
          ...row,
          receivedAmount: newReceived,
          balanceAmount: newBalance,
          isChecked: newBalance === 0
        };
      });

      const totalReceived = updated.reduce((sum, r) => sum + (r.receivedAmount || 0), 0);
      setActualBal(Math.max(0, baseActualBal - totalReceived));
      setIsDirty(true);
      return updated;
    });
  };

  const handleCheckboxChange = (invoiceId) => {
    setRows(prevRows =>
      prevRows.map(row => {
        if (row.invoiceId !== invoiceId) return row;
        if (row.balanceAmount > 0) return row;
        setIsDirty(true);
        return { ...row, isChecked: !row.isChecked };
      })
    );
  };

  // ✅ ENHANCED SAVE with confirmation & loading
  const handleSave = async () => {
    const selectedRows = rows.filter(r => r.receivedAmount > 0);

    if (selectedRows.length === 0) {
      toast.warning("⚠️ Please enter received amounts for at least one invoice", { toastId: "no-payments" });
      return;
    }

    const totalAmount = selectedRows.reduce((sum, r) => sum + r.receivedAmount, 0);
    
    if (!window.confirm(
      `💰 Save ${selectedRows.length} receivable allocation(s)?\n\n` +
      `Total Amount: ₹${totalAmount.toFixed(2)}\nDate: ${date}`
    )) {
      return;
    }

    toast.loading("💾 Saving allocations...", { toastId: "save-loading" });

    try {
      const payload = {
        ledgerId: Number(ledgerId),
        date,
        receivables: selectedRows.map(row => ({
          invoiceId: row.invoiceId,
          receivedAmount: row.receivedAmount
        }))
      };

      const res = await fetch(API_ENDPOINTS.SaveReceivableAllocation, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to save receivable allocations");

      toast.dismiss("save-loading");
      toast.success(`✅ Saved successfully!\n${selectedRows.length} allocations | ₹${totalAmount.toFixed(2)}`, {
        toastId: "save-success"
      });
      
      // Reset dirty state
      setIsDirty(false);
      setOriginalRows([...rows]);
      originalRowsRef.current = [...rows];
      setPage(1);
      
    } catch (err) {
      toast.dismiss("save-loading");
      toast.error(`❌ Save failed: ${err.message}`, { toastId: "save-error" });
      console.error(err);
    }
  };

  // ✅ NEW: CANCEL with confirmation
  const handleCancel = () => {
    if (!hasUnsavedChanges()) {
      toast.info("ℹ️ No changes to cancel", { toastId: "no-changes" });
      return;
    }

    const changesCount = rows.filter((row, idx) => 
      row.receivedAmount !== originalRowsRef.current.find(r => r.invoiceId === row.invoiceId)?.receivedAmount
    ).length;

    if (window.confirm(`🚫 Discard ${changesCount} unsaved changes?`)) {
      toast.loading("🔄 Restoring original data...", { toastId: "cancel-loading" });
      
      setRows([...originalRowsRef.current]);
      setIsDirty(false);
      
      const totalReceived = originalRowsRef.current.reduce((sum, r) => sum + (r.receivedAmount || 0), 0);
      setActualBal(Math.max(0, baseActualBal - totalReceived));
      
      toast.dismiss("cancel-loading");
      toast.success("✅ Changes cancelled", { toastId: "cancel-success" });
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
        autoClose={5000}
      />
      <div className="container my-4">
        <div className="card shadow-lg border-0">
          {/* ✅ Header with title */}
          <div className="card-header bg-gradient-primary text-white p-3">
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0 fw-bold">
                <i className="bi bi-receipt me-2"></i>
                Receivables Allocation
              </h4>
              {isDirty && (
                <Badge bg="warning" className="fs-6">
                  <i className="bi bi-exclamation-triangle-fill me-1"></i>
                  {rows.filter(r => r.receivedAmount > 0).length} payments pending
                </Badge>
              )}
            </div>
          </div>

          <div className="card-body p-4">
            {/* Filters */}
            <div className="row g-3 mb-4">
              <div className="col-md-3">
                <label className="form-label fw-semibold">Date</label>
                <input
                  type="date"
                  className="form-control form-control-lg"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">Ledger Account</label>
                <select
                  className="form-select form-select-lg"
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

              <div className="col-md-5">
                <label className="form-label fw-semibold mb-2">Balance Details</label>
                <div
                  className={`alert p-2 mb-0 d-flex align-items-center shadow-sm ${
                    actualBal === 0 ? 'alert-danger' :
                      actualBal < rows.reduce((sum, r) => sum + (r.receivedAmount || 0), 0) * 0.1 
                        ? 'alert-warning' : 'alert-success'
                  }`}
                >
                  <div className="w-100">
                    <div className="d-flex justify-content-between">
                      <span><strong>Available:</strong> ₹{actualBal.toFixed(2)}</span>
                      <span><strong>Allocated:</strong> ₹{rows.reduce((sum, r) => sum + (r.receivedAmount || 0), 0).toFixed(2)}</span>
                    </div>
                    <div className="progress mt-1" style={{ height: '4px' }}>
                      <div 
                        className="progress-bar" 
                        role="progressbar"
                        style={{ 
                          width: `${Math.min(100, (rows.reduce((sum, r) => sum + (r.receivedAmount || 0), 0) / baseActualBal) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Error & loading */}
            {error && (
              <div className="alert alert-danger py-3 mb-4 shadow-sm" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            )}
            {loading && (
              <div className="alert alert-info py-3 mb-4 shadow-sm text-center" role="alert">
                <Spinner animation="border" className="me-2" />
                Loading approved invoices...
              </div>
            )}

            {/* ✅ Unsaved changes warning */}
            {isDirty && (
              <div className="alert alert-warning py-3 mb-4 shadow-sm d-flex align-items-center" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
                <div>
                  <strong>🔄 Unsaved changes detected!</strong> 
                  <br className="d-none d-md-block" />
                  <small>{rows.filter(r => r.receivedAmount > 0).length} allocations modified. Use Save/Cancel below.</small>
                </div>
              </div>
            )}

            {/* Page size selector */}
            <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
              <div className="text-muted">
                <strong>{rows.length}</strong> invoices loaded
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="text-muted">Rows per page:</span>
                <select
                  className="form-select form-select-sm"
                  style={{ width: "90px" }}
                  value={pageSize}
                  onChange={handlePageSizeChange}
                >
                  {[1, 3, 5, 10, 25, 50, 100].map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ✅ SCROLLABLE Table with Fixed Height */}
            <div 
              className="table-responsive border rounded shadow-sm mb-4"
              style={{ 
                maxHeight: '500px',  // ✅ Fixed height for scrollbar
                overflowY: 'auto',
                overflowX: 'auto',
                border: '2px solid #e9ecef'
              }}
            >
              <table className="table table-striped table-hover mb-0 align-middle">
                <thead className="table-light sticky-top bg-white shadow-sm">
                  <tr>
                    <th className="text-center" style={{ minWidth: '60px' }}>Select</th>
                    <th style={{ minWidth: '120px' }}>Invoice No</th>
                    <th style={{ minWidth: '110px' }}>Invoice Date</th>
                    <th style={{ minWidth: '180px' }}>Buyer Name</th>
                    <th style={{ minWidth: '130px' }}>Due Date</th>
                    <th style={{ minWidth: '90px' }}>CGST</th>
                    <th style={{ minWidth: '90px' }}>SGST</th>
                    <th style={{ minWidth: '90px' }}>IGST</th>
                    <th style={{ minWidth: '120px' }}>Total Amount</th>
                    <th style={{ minWidth: '140px' }}>Received Amount</th>
                    <th style={{ minWidth: '130px' }}>Balance</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {Object.keys(groupedRows).length > 0 ? (
                    Object.entries(groupedRows).map(([buyerName, buyerRows]) => (
                      <React.Fragment key={buyerName}>
                        {/* ✅ Buyer Group Header */}
                        <tr className="table-group-heading bg-light">
                          <td colSpan="11" className="p-3 fw-bold text-primary border-0">
                            <i className="bi bi-people-fill me-2 text-info"></i>
                            {buyerName} ({buyerRows.length} invoices)
                          </td>
                        </tr>
                        
                        {/* Buyer Invoices */}
                        {buyerRows.map((row) => (
                          <tr key={row.invoiceId} className="table-hover">
                            <td className="text-center align-middle">
                              <div className="form-check">
                                <input
                                  className="form-check-input shadow-sm"
                                  type="checkbox"
                                  checked={row.isChecked}
                                  disabled={row.balanceAmount > 0}
                                  onChange={() => handleCheckboxChange(row.invoiceId)}
                                />
                              </div>
                            </td>
                            <td className="fw-semibold">{row.invoiceNo}</td>
                            <td>{row.invoiceDate}</td>
                            <td className="fw-medium text-wrap">{row.buyerName}</td>
                            <td>{row.paymentDueDate || '-'}</td>
                            <td className="text-end">₹{row.cgst.toFixed(2)}</td>
                            <td className="text-end">₹{row.sgst.toFixed(2)}</td>
                            <td className="text-end">₹{row.igst.toFixed(2)}</td>
                            <td className="fw-bold text-primary text-end">₹{row.totalAmount.toFixed(2)}</td>
                            <td className="align-middle">
                              <input
                                type="number"
                                className="form-control form-control-sm shadow-sm"
                                style={{ minWidth: "120px" }}
                                min="0"
                                max={row.totalAmount}
                                value={row.receivedAmount || ''}
                                onChange={(e) => handleReceivedChange(row.invoiceId, e.target.value)}
                                placeholder="0.00"
                              />
                            </td>
                            <td className="text-end align-middle">
                              <span className={`badge fs-6 fw-semibold px-3 py-2 shadow-sm lh-1 ${
                                row.balanceAmount === 0
                                  ? 'bg-success text-white border border-3 border-success'
                                  : row.balanceAmount < row.totalAmount * 0.1
                                    ? 'bg-warning text-dark border border-2 border-warning'
                                    : 'bg-info text-white border border-2 border-info'
                              }`}>
                                ₹{row.balanceAmount.toFixed(2)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className="text-center py-5 bg-light">
                        <div className="py-5">
                          <i className="bi bi-inbox display-4 text-muted mb-3"></i>
                          <h5 className="text-muted mb-1">
                            {loading ? "Loading approved invoices..." : "No approved invoices found"}
                          </h5>
                          <p className="text-muted mb-0">Check your date range or ledger selection</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ✅ PAGINATION */}
            <div className="d-flex flex-column flex-md-row align-items-center justify-content-between mt-4 mb-3 gap-3">
              <div className="text-muted small">
                <strong>Showing {startIndex}–{endIndex} of {totalCount} invoices</strong>
              </div>
              <nav aria-label="Page navigation">
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => handlePageChange(1)}>
                      <i className="bi bi-chevron-double-left"></i> First
                    </button>
                  </li>
                  <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => handlePageChange(page - 1)}>
                      <i className="bi bi-chevron-left"></i>
                    </button>
                  </li>
                  <li className="page-item disabled">
                    <span className="page-link">
                      Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                    </span>
                  </li>
                  <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => handlePageChange(page + 1)}>
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </li>
                  <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => handlePageChange(totalPages)}>
                      Last <i className="bi bi-chevron-double-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>

            {/* ✅ SAVE/CANCEL BUTTONS AT BOTTOM */}
            <div className="d-flex justify-content-end gap-3 p-4 bg-light border-top rounded-bottom shadow-sm">
              <button 
                className="btn btn-outline-secondary btn-lg px-5 py-3 shadow-sm"
                onClick={handleCancel}
                disabled={!isDirty || loading}
              >
                <i className="bi bi-x-circle-fill me-2"></i>
                Cancel Changes
              </button>
              
              <button 
                className={`btn btn-success btn-lg px-5 py-3 shadow-sm position-relative ${
                  !isDirty || rows.filter(r => r.receivedAmount > 0).length === 0 
                    ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleSave}
                disabled={!isDirty || loading || rows.filter(r => r.receivedAmount > 0).length === 0}
              >
                <i className="bi bi-check-circle-fill me-2"></i>
                Save Allocations
                {isDirty && rows.filter(r => r.receivedAmount > 0).length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light">
                    {rows.filter(r => r.receivedAmount > 0).length}
                    <span className="visually-hidden">payments</span>
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        :global(.bg-gradient-primary) {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        :global(.cursor-not-allowed) {
          cursor: not-allowed !important;
        }
        :global(.table-group-heading) {
          font-size: 1.1em;
        }
        :global(.table-group-divider) > tr > td {
          border-top: 2px solid #dee2e6;
        }
        :global(.sticky-top) {
          top: 0;
          z-index: 10;
        }
      `}</style>
    </>
  );
};

export default ReceivableAllocation;
