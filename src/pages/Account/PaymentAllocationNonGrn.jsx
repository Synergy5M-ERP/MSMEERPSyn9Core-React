import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { API_ENDPOINTS } from "../../config/apiconfig";
import "react-toastify/dist/ReactToastify.css";

const getToday = () => new Date().toISOString().split("T")[0];

const PaymentAllocationNonGrn = () => {

  const [date, setDate] = useState(getToday());
  const [dueDate, setDueDate] = useState("");
  const [balance, setBalance] = useState(0);
const [allocated, setAllocated] = useState(0);
  const [subLedger, setSubLedger] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subLedgers, setSubLedgers] = useState([]);
  const [banks, setBanks] = useState([]);
  const [cashLedgers, setCashLedgers] = useState([]);
const [cashLedgerId, setCashLedgerId] = useState("");
  const [paymentType, setPaymentType] = useState("Bank");
  useEffect(() => {
  fetchSubLedger();   // 🔥 THIS IS MISSING
}, []);
const fetchCashLedger = async () => {

  try {

    const res = await fetch(API_ENDPOINTS.GetLedger);

    const data = await res.json();

    if (data.success) {

      setCashLedgers(data.data || []);

      // ✅ default select Cash On Hand

      const defaultCash = data.data.find(
        x => x.accountLedgerName === "Cash On Hand"
      );

      if (defaultCash) {

        setCashLedgerId(defaultCash.accountLedgerId);

      }

    }

  } catch (err) {

    console.error("Cash Ledger Error", err);

  }

};
const fetchSubLedger = async () => {

  try {

    const res = await fetch(API_ENDPOINTS.GetSubLedger);

    const data = await res.json();

    setSubLedgers(data.data || []);

  } catch (err) {

    console.error("SubLedger load error", err);

  }

};
const fetchLedgerBalance = async (ledgerId) => {

  if (!ledgerId) {

    setBalance(0);
    return;

  }

  try {

    const res = await fetch(
      `${API_ENDPOINTS.GetLedgerBalance}?ledger=${ledgerId}`
    );

    const data = await res.json();

    console.log("Balance API Response:", data);

    if (data.success) {

      setBalance(Number(data.balance || 0));

    } else {

      setBalance(0);

    }

  } catch (err) {

    console.error("Balance API Error", err);

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
nonGrnInvoiceId:
  item.nonGrnInvoiceId ??
  item.NonGrnInvoiceId ??
  item.accountNonGRNInvoiceId ??
  item.AccountNonGRNInvoiceId,
  vendorId: item.vendorId || item.VendorId,                        // ✅ ADD THIS
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

const handlePaidChange = (index, value) => {

  const updatedRows = [...rows];

  const total =
    Number(updatedRows[index].totalAmount) || 0;

  let paid = Number(value) || 0;

  // validation
  if (paid > total) {

    alert("Paid amount cannot exceed total amount");

    paid = 0;
  }

  updatedRows[index].paidAmount = paid;

  updatedRows[index].balanceAmount =
    total - paid;

  setRows(updatedRows);

  // total allocated
  const allocatedTotal = updatedRows.reduce(
    (sum, row) =>
      sum + Number(row.paidAmount || 0),
    0
  );

  setAllocated(allocatedTotal);
};
const handleSave = async () => {

  try {

    const selectedRows = rows.filter(
      x => Number(x.paidAmount) > 0
    );

    if (selectedRows.length === 0) {

      alert("Please enter paid amount");
      return;

    }

    // ✅ CORRECT PAYLOAD
    const payload = {

      Date: date,

      CreatedBy: "Admin",

     Payments: selectedRows.map((row) => ({
  NonGrnInvoiceId: row.nonGrnInvoiceId,   // ✅ FIX
  VendorId: row.vendorId,                 // ✅ FIX

  VendorName: row.vendorName,
  InvoiceNo: row.invoiceNo,
  InvoiceDate: row.invoiceDate,

  TotalAmount: Number(row.totalAmount || 0),
  PaidAmount: Number(row.paidAmount || 0),
  BalanceAmount: Number(row.balanceAmount || 0),

  CGST: Number(row.cgst || 0),
  SGST: Number(row.sgst || 0),
  IGST: Number(row.igst || 0),

  RTGSNo: row.rtgsNo || "",
  RTGSDate: row.rtgsDate || date,

  SubLedgerId:
    paymentType === "Bank" ? Number(subLedger) : null,

  BankId:
    paymentType === "Bank" ? Number(subLedger) : null,

  CashLedgerId:
    paymentType === "Cash" ? Number(cashLedgerId) : null,

  Source: paymentType
}))
    };

    console.log(
      "SAVE PAYLOAD",
      JSON.stringify(payload, null, 2)
    );

    const res = await fetch(
      API_ENDPOINTS.SaveNonGrnPaymentAllocation,
      {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(payload)

      }
    );

    // ✅ IMPORTANT
    const text = await res.text();

    console.log("API RESPONSE:", text);

    let result = {};

    try {
      result = JSON.parse(text);
    } catch {
      result = { message: text };
    }

    if (res.ok) {

      alert("Saved Successfully");

    } else {

      alert(result.message || "Save Failed");

    }

  } catch (err) {

    console.error("Save Error", err);

    alert("Error while saving");

  }

};
  return (
    <>
      <ToastContainer />

      <div className="container-fluid mt-3">

        <div className="card shadow-sm">

          <div className="card-body">
<div className="d-flex align-items-center gap-4 mb-3">

  {/* CASH FIRST */}

  <div className="form-check">

    <input
      className="form-check-input"
      type="radio"
      name="paymentType"
      id="cash"
      value="Cash"
      checked={paymentType === "Cash"}
      onChange={(e) => {

        setPaymentType(e.target.value);

        // ✅ clear bank values
        setSubLedger("");
        setBalance(0);

        // ✅ load cash ledger
        fetchCashLedger();

      }}
    />

    <label
      className="form-check-label fw-bold"
      htmlFor="cash"
    >
      Cash
    </label>

  </div>

  {/* BANK SECOND */}

  <div className="form-check">

    <input
      className="form-check-input"
      type="radio"
      name="paymentType"
      id="bank"
      value="Bank"
      checked={paymentType === "Bank"}
      onChange={(e) => {

        setPaymentType(e.target.value);

        // ✅ clear cash ledger
        setCashLedgerId("");

      }}
    />

    <label
      className="form-check-label fw-bold"
      htmlFor="bank"
    >
      Bank
    </label>

  </div>

</div>
           <div className="row g-3 align-items-end">

  {/* DATE */}

  <div className="col-md-2">
    <label className="form-label fw-bold">Date</label>

    <input
      type="date"
      className="form-control"
      value={date}
      onChange={(e) => setDate(e.target.value)}
    />
  </div>

  {/* CASH LEDGER */}

  <div className="col-md-2">

    <label className="form-label fw-bold">
      Cash Ledger
    </label>

    <select
      className="form-select"
      value={cashLedgerId}
      disabled={paymentType !== "Cash"}
      onChange={(e) =>
        setCashLedgerId(e.target.value)
      }
    >

      <option value="">
        Select Cash Ledger
      </option>

      {cashLedgers.map((l) => (

        <option
          key={l.accountLedgerId}
          value={l.accountLedgerId}
        >
          {l.accountLedgerName}
        </option>

      ))}

    </select>

  </div>

  {/* BANK SUB LEDGER */}

  <div className="col-md-2">

    <label className="form-label fw-bold">
      Bank Sub Ledger
    </label>

    <select
      className="form-select"
      value={subLedger}
      disabled={paymentType !== "Bank"}
      onChange={(e) => {

        const ledgerId = e.target.value;

        setSubLedger(ledgerId);

        // ✅ CALL BALANCE API
        fetchLedgerBalance(ledgerId);

      }}
    >

      <option value="">
        Select Sub Ledger
      </option>

      {subLedgers.map((s) => (

        <option
          key={s.accountLedgerSubid}
          value={s.accountLedgerSubid}
        >
          {s.accountLedgerSubName}
        </option>

      ))}

    </select>

  </div>

  {/* BALANCE */}

{/* BALANCE */}

<div className="col-md-3">

  <label className="form-label fw-bold">
    Balance Details
  </label>

  <div className="alert alert-danger p-2 mb-0">

    Balance ₹
    {(Number(balance) - Number(allocated)).toFixed(2)}

    {" | "}

    Allocated ₹
    {Number(allocated).toFixed(2)}

  </div>

</div>{/* DUE DATE */}

  <div className="col-md-2">

    <label className="form-label fw-bold">
      Select Due Date
    </label>

    <input
      type="date"
      className="form-control"
      value={dueDate}
      onChange={(e) => setDueDate(e.target.value)}
    />

  </div>

  {/* PAGE SIZE */}

  <div className="col-md-1">

    <label className="form-label fw-bold">
      Pages
    </label>

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

             <button
  className="btn btn-success px-4"
  onClick={handleSave}
>
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