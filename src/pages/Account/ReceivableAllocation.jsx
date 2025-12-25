import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../config/apiconfig";

const getToday = () => new Date().toISOString().split("T")[0]; 

const ReceivableAllocation = () => {
  // filter state
  const [date, setDate] = useState(getToday());
  const [ledgerId, setLedgerId] = useState("");
  const [actualBal, setActualBal] = useState(0);

  // dropdown data
  const [ledgerOptions, setLedgerOptions] = useState([]);

  // table + pagination state
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 1. Load Ledger dropdown once
  useEffect(() => {
    const loadLedgers = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.Ledger);
        if (!res.ok) throw new Error("Failed to load ledgers");
        const data = await res.json();
        setLedgerOptions(data);

        // optional: preselect first ledger and closingBal
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
  }, []);

  // 2. Fetch receivables with pagination
  useEffect(() => {
    if (!ledgerId || !date) return;

    const fetchReceivables = async () => {
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
          `${API_ENDPOINTS.ReceivablesByLedger}?${params.toString()}`
        );
        if (!res.ok) throw new Error("Failed to load receivables");

        const data = await res.json(); // { items, totalCount }
        setRows(data.items || []);
        setTotalCount(data.totalCount || 0);
      } catch (err) {
        console.error(err);
        setError("Unable to load receivables.");
      } finally {
        setLoading(false);
      }
    };

    fetchReceivables();
  }, [ledgerId, date, actualBal, page, pageSize]);

  // 3. Pagination helpers
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  const startIndex = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, totalCount);

  // 4. Render
  return (
    <div className="container my-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Receivables Allocation</h5>
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

          {/* Rows per page selector */}
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

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>Invoice No</th>
                  <th>Invoice Date</th>
                  <th>Buyer Name</th>
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
                    <tr key={row.invoiceNo}>
                      <td>{row.invoiceNo}</td>
                      <td>{row.invoiceDate}</td>
                      <td>{row.buyerName}</td>
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
                    <td colSpan="10" className="text-center">
                      {loading ? "Loading..." : "No data"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between mt-2 gap-5">
            <nav aria-label="Page navigation">
              <ul className="pagination m-0">
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
                  className={`page-item ${
                    page === totalPages ? "disabled" : ""
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
                  className={`page-item ${
                    page === totalPages ? "disabled" : ""
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

export default ReceivableAllocation;
