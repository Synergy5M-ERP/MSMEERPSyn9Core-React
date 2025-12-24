// PaymentAllocation.jsx
import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../config/apiconfig";

const getToday = () => new Date().toISOString().split("T")[0];

const PaymentAllocation = () => {
  const [date, setDate] = useState(getToday());
  const [ledgerId, setLedgerId] = useState("");
  const [actualBal, setActualBal] = useState(0);

  const [ledgerOptions, setLedgerOptions] = useState([]);

  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ---------- 1. Load ledgers ONCE ----------
  useEffect(() => {
    const loadLedgers = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.Ledger);
        if (!res.ok) throw new Error("Failed to load ledgers");
        const data = await res.json();
        setLedgerOptions(data);

        // optional auto-select FIRST ledger and its closingBal
        if (data.length > 0) {
          const first = data[0];
          setLedgerId(first.accountLedgerId.toString());
          setActualBal(first.closingBal || 0);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load ledger list.");
      }
    };

    loadLedgers();
  }, []); // ✅ DO NOT add ledgerId, actualBal, ledgerOptions here

  // ---------- 2. Load payments with pagination ----------
  useEffect(() => {
    if (!ledgerId || !date) return;

    const fetchPayments = async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          ledgerId,
          date,
          actualBal: actualBal.toString(),
          page: page.toString(),
          pageSize: pageSize.toString()
        });

        const res = await fetch(
          `${API_ENDPOINTS.PaymentAllocations}?${params.toString()}`
        );
        if (!res.ok) throw new Error("Failed to load payment allocations");

        const data = await res.json(); // { items, totalCount }
        setRows(data.items || []);
        setTotalCount(data.totalCount || 0);
      } catch (err) {
        console.error(err);
        setError("Unable to load payment allocations.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [ledgerId, date, actualBal, page, pageSize]); // ✅ DO NOT include rows or totalCount

  // ---------- 3. Pagination ----------
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

  // ---------- 4. Render (NO setState calls here except in event handlers) ----------
  return (
    <div className="container my-4">
      {/* ...same JSX you already have, unchanged... */}
       <div className="card shadow-sm">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">Payment Allocation</h5>
        </div>

        <div className="card-body">
          {/* Filters */}
          <div className="row g-3 mb-3">
            <div className="col-md-3">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="col-md-5">
              <label className="form-label">Ledger Account</label>
              <select
                className="form-select"
                value={ledgerId}
                onChange={(e) => {
                  const id = e.target.value;
                  setLedgerId(id);
                  setPage(1);

                  const selected = ledgerOptions.find(
                    (l) => l.accountLedgerId.toString() === id
                  );
                  if (selected) {
                    setActualBal(selected.closingBal || 0);
                  }
                }}
              >
                <option value="">Select ledger</option>
                {ledgerOptions.map((l) => (
                  <option
                    key={l.accountLedgerId}
                    value={l.accountLedgerId}
                  >
                    {l.accountLedgerName}
                  </option>
                ))}
              </select>


              
            </div>

            <div className="col-md-4">
              <label className="form-label">Actual Balance</label>
              <input
                type="number"
                className="form-control"
                min="0"
                value={actualBal}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  // prevent NaN and negative
                  if (Number.isNaN(val)) {
                    setActualBal(0);
                  } else {
                    setActualBal(Math.max(0, val));
                  }
                  setPage(1);
                }}
              />

            </div>
          </div>

          {/* Error & loading */}
          {error && (
            <div className="alert alert-danger py-2 mb-3" role="alert">
              {error}
            </div>
          )}
          {loading && (
            <div className="alert alert-info py-2 mb-3" role="alert">
              Loading...
            </div>
          )}
          <div className="d-flex align-items-center gap-2">
            <span>Rows per page:</span>
            <select
              className="form-select form-select-sm"
              style={{ width: "90px" }}
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              {[5, 10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          {/* Table: GRN-based columns */}
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>GRN No</th>
                  <th>GRN Date</th>
                  <th>Vendor Name</th>
                  <th>Purchase No</th>
                  <th>Purchase Date</th>
                  <th>Payment Due Date</th>
                  <th>CGST</th>
                  <th>SGST</th>
                  <th>IGST</th>
                  <th>Total Amount</th>
                  <th>Paid Amount</th>
                  <th>Balance Amount</th>
                </tr>
              </thead>
              <tbody>
                {rows.length > 0 ? (
                  rows.map((row) => (
                    <tr key={row.grnNo}>
                      <td>{row.grnNo}</td>
                      <td>{row.grnDate}</td>
                      <td>{row.vendorName}</td>
                      <td>{row.purchaseNo}</td>
                      <td>{row.purchaseDate}</td>
                      <td>{row.paymentDueDate}</td>
                      <td>{row.cgst}</td>
                      <td>{row.sgst}</td>
                      <td>{row.igst}</td>
                      <td>{row.totalAmount}</td>
                      <td>{row.paidAmount}</td>
                      <td>{row.balanceAmount}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="text-center">
                      {loading ? "Loading..." : "No data"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination + range info */}
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between mt-2 gap-2">
            <nav aria-label="Page navigation" className="order-1 order-md-0">
              <ul className="pagination mb-0">
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(1)}
                  >
                    « First
                  </button>
                </li>
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(page - 1)}
                  >
                    ‹ Prev
                  </button>
                </li>
                <li className="page-item disabled">
                  <span className="page-link">
                    Page {page} of {totalPages}
                  </span>
                </li>
                <li
                  className={`page-item ${page === totalPages ? "disabled" : ""
                    }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(page + 1)}
                  >
                    Next ›
                  </button>
                </li>
                <li
                  className={`page-item ${page === totalPages ? "disabled" : ""
                    }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(totalPages)}
                  >
                    Last »
                  </button>
                </li>
              </ul>
            </nav>



            <div className="text-muted small ms-md-3 text-md-end">
              Showing {startIndex}–{endIndex} of {totalCount}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentAllocation;
