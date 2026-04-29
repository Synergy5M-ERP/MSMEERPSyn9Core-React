import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { API_ENDPOINTS } from "../../config/apiconfig";
import "react-toastify/dist/ReactToastify.css";

const getToday = () => new Date().toISOString().split("T")[0];

const PaymentAllocationNonGrn = () => {

  const [date, setDate] = useState(getToday());
  const [dueDate, setDueDate] = useState("");
  const [ledger, setLedger] = useState("");
  const [subLedger, setSubLedger] = useState("");
  const [pageSize, setPageSize] = useState(10);
const [ledgers, setLedgers] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subLedgers, setSubLedgers] = useState([]);
  const [banks, setBanks] = useState([]);
  useEffect(() => {
  fetchLedger();
}, []);
const fetchLedger = async () => {
  try {
    const res = await fetch(API_ENDPOINTS.GetLedger);
    const data = await res.json();

    if (data.success) {
      setLedgers(data.data);
    }
  } catch (err) {
    console.error("Ledger load error", err);
  }
};
const fetchSubLedger = async (ledgerId) => {
  try {
    const res = await fetch(
      `${API_ENDPOINTS.GetSubLedger}?ledgerId=${ledgerId}`
    );

    const data = await res.json();

    if (data.success) {
      setSubLedgers(data.data);
    }

  } catch (err) {
    console.error("SubLedger load error", err);
  }
};
const fetchBank = async (supplier) => {

  try {

    const res = await fetch(
      `${API_ENDPOINTS.GetNonGrnBank}?supplier=${supplier}`
    );

    const data = await res.json();

    setBanks(data.data || []);

  } catch (err) {
    console.error("Bank load error", err);
  }

};
  // 🔹 LOAD DATA FROM API
 useEffect(() => {

  const fetchData = async () => {

    try {

      setLoading(true);

      const res = await fetch(API_ENDPOINTS.GetPaymentAllocNonGrnTrans);

      const result = await res.json();

      if (result.success) {

        const mapped = result.data.map((item) => ({

          vendorName: item.supplier_Name,
          invoiceNo: item.invoice_NO,
          invoiceDate: item.invoice_Date
            ? item.invoice_Date.split("T")[0]
            : "",

          totalAmount: Number(item.total_Amount || 0),

          dueDate: item.due_Date
            ? item.due_Date.split("T")[0]
            : "",

          paidAmount: 0,

          balanceAmount: Number(item.balanceAmount || item.total_Amount || 0),

          bankName: "",
          rtgsNo: "",
          rtgsDate: ""

        }));

        setRows(mapped);

      } else {

        setRows([]);

      }

    } catch (err) {

      console.error("Error loading data", err);

    } finally {

      setLoading(false);

    }

  };

  fetchData();

}, []);

  // 🔹 PAID AMOUNT CHANGE
  const handlePaidChange = (index, value) => {

    const newRows = [...rows];

    const paid = Number(value) || 0;

    newRows[index].paidAmount = paid;

    newRows[index].balanceAmount =
      newRows[index].totalAmount - paid;

    setRows(newRows);

  };

  return (
    <>
      <ToastContainer />

      <div className="container-fluid mt-3">

        <div className="card shadow-sm">

          <div className="card-body">

<div className="card-header bg-success text-white">
            <h5 className="mb-0">Payment Allocation Non-GRN</h5>
          </div>
            <div className="row g-3 align-items-end">

              <div className="col-md-2">
                <label className="form-label fw-bold">Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="col-md-2">
                <label className="form-label fw-bold">Ledger Account</label>
               <select
  className="form-select"
  value={ledger}
onChange={(e) => {
  setLedger(e.target.value);
  fetchSubLedger(e.target.value);
}}  
>
  <option value="">Select Ledger</option>

  {ledgers.map((l) => (
    <option key={l.accountLedgerId} value={l.accountLedgerId}>
      {l.accountLedgerName}
    </option>
  ))}

</select>
              </div>

              <div className="col-md-2">
                <label className="form-label fw-bold">Sub Ledger</label>
               <select
  className="form-select"
  value={subLedger}
  onChange={(e) => setSubLedger(e.target.value)}
>
  <option value="">Select Sub Ledger</option>

  {subLedgers.map((s) => (
    <option key={s.accountLedgerSubid} value={s.accountLedgerSubid}>
      {s.accountLedgerSubName}
    </option>
  ))}

</select>
              </div>

              <div className="col-md-3">
                <label className="form-label fw-bold">Balance Details</label>
                <div className="alert alert-danger p-2 mb-0">
                  Balance ₹0.00 | Allocated ₹0.00
                </div>
              </div>

              <div className="col-md-2">
                <label className="form-label fw-bold">Select Due Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div className="col-md-1">
                <label className="form-label fw-bold">Pages</label>
                <select
                  className="form-select"
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value)}
                >
                  <option>5</option>
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                  <option>100</option>
                </select>
              </div>

            </div>

            {/* TABLE */}

            <div className="table-responsive mt-4">

              <table className="table table-bordered">

                <thead style={{ background: "#cfe2ff" }}>

                  <tr className="text-center">

                    <th>SELECT</th>
                    <th>DUE DATE</th>
                    <th>VENDOR NAME</th>
                    <th>INVOICE NO / DATE</th>
                    <th>TOTAL AMOUNT</th>
                    <th>PAID AMOUNT</th>
                    <th>BALANCE AMOUNT</th>
                    <th>BANK NAME</th>
                  

                  </tr>

                </thead>

                <tbody>

                  {loading ? (

                    <tr>
                      <td colSpan="10" className="text-center">
                        Loading...
                      </td>
                    </tr>

                  ) : rows.length === 0 ? (

                    <tr>
                      <td colSpan="10" className="text-center">
                        No Data Found
                      </td>
                    </tr>

                  ) : (

                    rows.map((row, index) => (

                      <tr key={index} className="text-center">

                        <td>
                          <input type="checkbox" />
                        </td>

                        <td>{row.dueDate}</td>

                        <td>{row.vendorName}</td>

                        <td>
                          {row.invoiceNo}
                          <br />
                          {row.invoiceDate}
                        </td>

                        <td className="fw-bold">
                          ₹{row.totalAmount.toFixed(2)}
                        </td>

                        <td>

                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={row.paidAmount}
                            onChange={(e) =>
                              handlePaidChange(index, e.target.value)
                            }
                          />

                        </td>

                        <td className="fw-bold text-danger">
                          ₹{row.balanceAmount.toFixed(2)}
                        </td>

                        <td>
                          <input className="form-control form-control-sm" />
                        </td>

                       

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

            {/* PAGINATION */}

            <div className="text-center mt-3">

              <button className="btn btn-secondary btn-sm me-2">
                Prev
              </button>

              <button className="btn btn-secondary btn-sm">
                Next
              </button>

            </div>

            {/* ACTION BUTTONS */}

            <div className="d-flex justify-content-center gap-3 mt-4 p-3 bg-light">

              <button className="btn btn-secondary px-4">
                Cancel
              </button>

              <button className="btn btn-success px-4">
                Save
              </button>

            </div>

          </div>

        </div>

      </div>
    </>
  );
};

export default PaymentAllocationNonGrn;