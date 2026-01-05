import React, { useEffect, useState } from "react";
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
        toast.error("Unable to load ledger list.");
        setError("Unable to load ledger list.");
      }
    };

    loadLedgers();
  }, []);

  // ✅ FIXED: Load approved GRNs with COMPLETE dependencies & params
  // useEffect(() => {
  //   const fetchPayments = async () => {
  //     setLoading(true);
  //     setError("");

  //     try {
  //       const params = new URLSearchParams({
  //         ledgerId,           // ✅ Added
  //         date,               // ✅ Added
  //         ...(selectedVendor ? { vendor: selectedVendor } : {}),
  //         page: page.toString(),
  //         pageSize: pageSize.toString()
  //       });

  //       console.log('Fetching GRNs with params:', params.toString());

  //       const res = await fetch(`${API_ENDPOINTS.GetApprovedGrn}?${params.toString()}`);

  //       if (!res.ok) throw new Error(`Failed to load approved GRNs: ${res.status}`);

  //       const data = await res.json();
  //       console.log('API Response:', data);

  //       const items = data.data || [];
  //       console.log('Items count:', items.length);

  //       // ✅ Sort DESC by date (newest first)
  //       const sortedItems = items.sort((a, b) =>
  //         new Date(b.grnDate) - new Date(a.grnDate)
  //       );

  //       const mapped = sortedItems.map((r) => {
  //         const totalAmount = Number(r.TotalAmount || r.totalAmount || r.grandTotal || 0);
  //         const paidAmount = Number(r.paidAmount || 0);
  //         const balanceAmount = totalAmount - paidAmount;

  //         return {
  //           accountGRNId: r.AccountGRNId || r.accountGRNId,
  //           grnNumber: r.GRNNumber || r.grnNumber,
  //           grnDate: (r.GRNDate || r.grnDate)?.split('T')[0] || r.grnDate,
  //           vendorName: r.Description || r.VendorName || r.vendorName,
  //           poNumber: r.poNumber || r.PONumber || '',
  //           poDate: r.poDate || r.PODate || '',
  //           invoiceNumber: r.invoiceNumber || r.InvoiceNumber || '',
  //           invoiceDate: r.invoiceDate || r.InvoiceDate || '',
  //           cgst: Number(r.CGST || r.cgst || 0),
  //           sgst: Number(r.SGST || r.sgst || 0),
  //           igst: Number(r.IGST || r.igst || 0),
  //           totalAmount,
  //           paidAmount,
  //           balanceAmount,
  //           isChecked: balanceAmount === 0
  //         };
  //       });

  //       setRows(mapped);
  //       setTotalCount(data.totalCount || items.length);

  //       const totalPaid = mapped.reduce((sum, row) => sum + (row.paidAmount || 0), 0);
  //       setActualBal(Math.max(0, baseActualBal - totalPaid));

  //     } catch (err) {
  //       console.error('Fetch error:', err);
  //       toast.error("Unable to load approved GRNs.");
  //       setError("Unable to load approved GRNs.");
  //       setRows([]);
  //       setTotalCount(0);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   // ✅ Only fetch if we have required params
  //   if (ledgerId && date) {
  //     fetchPayments();
  //   }
  // }, [ledgerId, date, page, pageSize, selectedVendor, baseActualBal]); // ✅ COMPLETE deps


// ✅ Update API_ENDPOINTS in apiconfig.js
// GetApprovedGrn: '/api/grn/bill-approved-details',

// ✅ FIXED Frontend - Only page/pageSize params
useEffect(() => {
  const fetchPayments = async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        // ✅ REMOVED ledgerId, date - backend doesn't use them
        page: page.toString(),
        pageSize: pageSize.toString()
      });

      console.log('Fetching GRNs with params:', params.toString());

      const res = await fetch(`${API_ENDPOINTS.GetApprovedGrn}?${params.toString()}`);

      if (!res.ok) throw new Error(`Failed to load approved GRNs: ${res.status}`);

      const data = await res.json();
      console.log('API Response:', data);

      const items = data.data || [];
      console.log('Items count:', items.length);

      // ✅ Updated mapping for your backend response
      const sortedItems = items.sort((a, b) =>
        new Date(b.GRNDate || b.grnDate) - new Date(a.GRNDate || a.grnDate)
      );

      const mapped = sortedItems.map((r) => {
        const totalAmount = Number(r.TotalAmount || r.totalAmount || r.TotalTaxAmount || 0);
        const paidAmount = Number(r.PaidAmount || r.paidAmount || 0);
        const balanceAmount = totalAmount - paidAmount;

        return {
          accountGRNId: r.AccountGRNId || r.accountGRNId,
          grnNumber: r.GRNNumber || r.grnNumber,
          grnDate: (r.GRNDate || r.grnDate)?.split('T')[0] || r.grnDate,
          vendorName: r.VendorName || r.Description || r.vendorName,
          poNumber: r.poNumber || r.PONumber || '',
          poDate: r.poDate || r.PODate || '',
          invoiceNumber: r.invoiceNumber || r.InvoiceNumber || '',
          invoiceDate: r.invoiceDate || r.InvoiceDate || '',
          cgst: Number(r.CGST || r.cgst || 0),
          sgst: Number(r.SGST || r.sgst || 0),
          igst: Number(r.IGST || r.igst || 0),
          totalAmount,
          paidAmount,
          balanceAmount,
          isChecked: balanceAmount === 0
        };
      });

      setRows(mapped);
      setTotalCount(data.totalCount || items.length); // ✅ Backend provides totalCount

      const totalPaid = mapped.reduce((sum, row) => sum + (row.paidAmount || 0), 0);
      setActualBal(Math.max(0, baseActualBal - totalPaid));

    } catch (err) {
      console.error('Fetch error:', err);
      toast.error("Unable to load approved GRNs.");
      setError("Unable to load approved GRNs.");
      setRows([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  fetchPayments(); // ✅ Always fetch - no ledgerId/date dependency
}, [page, pageSize]); // ✅ ONLY pagination dependencies




  // ✅ REAL-TIME balance validation
  const handlePaidChange = (accountGRNId, value) => {
    const numeric = Number(value);
    const paidVal = Number.isNaN(numeric) || numeric < 0 ? 0 : numeric;

    setRows(prevRows => {
      const currentTotalPaid = prevRows.reduce((sum, row) =>
        row.accountGRNId === accountGRNId ? sum : sum + (row.paidAmount || 0), 0
      );
      const proposedTotalPaid = currentTotalPaid + paidVal;

      if (proposedTotalPaid > baseActualBal) {
        toast.error(
          `Insufficient balance! Available: ₹${baseActualBal.toFixed(2)}, ` +
          `Proposed total: ₹${proposedTotalPaid.toFixed(2)}`
        );
        return prevRows;
      }

      const updated = prevRows.map(row => {
        if (row.accountGRNId !== accountGRNId) return row;
        const newPaid = Math.min(paidVal, row.totalAmount);
        const newBalance = row.totalAmount - newPaid;
        return {
          ...row,
          paidAmount: newPaid,
          balanceAmount: newBalance,
          isChecked: newBalance === 0
        };
      });

      const totalPaid = updated.reduce((sum, r) => sum + (r.paidAmount || 0), 0);
      setActualBal(Math.max(0, baseActualBal - totalPaid));
      return updated;
    });
  };

  const handleCheckboxChange = (accountGRNId) => {
    setRows(prevRows =>
      prevRows.map(row => {
        if (row.accountGRNId !== accountGRNId) return row;
        if (row.balanceAmount > 0) return row;
        return { ...row, isChecked: !row.isChecked };
      })
    );
  };

  const handleSave = async () => {
    const selectedRows = rows.filter(r => r.paidAmount > 0);

    if (selectedRows.length === 0) {
      toast.warning("Please enter paid amounts for at least one GRN");
      return;
    }

    try {
      const payload = {
        ledgerId: Number(ledgerId),
        date,
        payments: selectedRows.map(row => ({
          accountGRNId: row.accountGRNId,
          paidAmount: row.paidAmount
        }))
      };

      const res = await fetch(API_ENDPOINTS.SavePaymentAllocation, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to save payment allocations");

      toast.success("Payment allocations saved successfully!");
      setPage(1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save payment allocations");
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
    setPage(1); // ✅ Reset to first page
  };

  const uniqueVendors = [...new Set(rows.map(r => r.vendorName))].filter(Boolean);

  return (
    <>
      <ToastContainer position="top-right" theme="colored" />
      <div className="container my-4">
        <div className="card shadow-sm">
          <div className="card-header bg-success text-white">
            <h5 className="mb-0">Payment Allocation</h5>
          </div>

          <div className="card-body">
            {/* Filters */}
            <div className="row g-3 mb-3">
              <div className="row align-items-end">
                <div className="col">
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
                {/* Ledger Account Column */}
                <div className="col">
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

                {/* Amount/Balance Column */}
                <div className="col">
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
              </div>
            </div>

            {/* Error & loading */}
            {error && (
              <div className="alert alert-danger py-2 mb-3" role="alert">{error}</div>
            )}
            {loading && (
              <div className="alert alert-info py-2 mb-3" role="alert">Loading...</div>
            )}

            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="d-flex align-items-center gap-2">
                <span>Rows per page:</span>
                <select
                  className="form-select form-select-sm"
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

            {/* ✅ Grouped Table Display */}
            <div className="table-responsive">
              <table className="table table-striped table-hover table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th className="text-center">Select</th>
                    <th>GRN No</th>
                    <th>GRN Date</th>
                    <th>Vendor Name</th>
                    <th>PO Number</th>
                    <th>Invoice No</th>
                    <th>Invoice Date</th>
                    <th>CGST</th>
                    <th>SGST</th>
                    <th>IGST</th>
                    <th>Total Amount</th>
                    <th>Paid Amount</th>
                    <th>Balance Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(groupedRows).length > 0 ? (
                    Object.entries(groupedRows).map(([vendorName, vendorRows]) => (
                      <React.Fragment key={vendorName}>
                        {/* Vendor GRNs */}
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
                            <td className="fw-semibold align-middle text-muted small">{row.invoiceDate}</td>
                            <td className="fw-semibold text-end align-middle text-muted small">₹{row.cgst.toFixed(2)}</td>
                            <td className="fw-semibold text-end align-middle text-muted small">₹{row.sgst.toFixed(2)}</td>
                            <td className="fw-semibold text-end align-middle text-muted small">₹{row.igst.toFixed(2)}</td>
                            <td className="fw-semibold text-end align-middle fw-bold text-primary">
                              ₹{row.totalAmount.toFixed(2)}
                            </td>
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

            {/* Pagination */}
            <div className="d-flex flex-column flex-md-row align-items-center justify-content-between mt-2 gap-2">
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
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentAllocation;
