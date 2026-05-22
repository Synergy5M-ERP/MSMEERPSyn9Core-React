import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../config/apiconfig";

const AccountDebitApproval = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 LOAD TABLE DATA (replace with your API)
  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await fetch(API_ENDPOINTS.GetApprovePayables);
      const result = await res.json();

      if (result.success) {
        setData(result.data || []);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 APPROVE DEBIT NOTE (AJAX REPLACEMENT)
  const handleApprove = async (item) => {
    const confirm = window.confirm(
      "Are you sure you want to approve this GRN?"
    );

    if (!confirm) return;

    try {
      const res = await fetch(API_ENDPOINTS.ApproveDebitNote, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          DebitNoteNo: item.debitNoteNo,
          totalAmount: item.netPayable,
        }),
      });

      const result = await res.json();

      if (result.success) {
        alert("GRN Approved Successfully!");
        fetchData(); // refresh table
      } else {
        alert(result.message || "Approval failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="table-container main-content">
      <div
        className="table-responsive w-100 p-3 container-fluid"
        style={{ overflowX: "auto", maxHeight: "500px" }}
      >
        <table className="table table-bordered table-striped">
          <thead style={{ position: "sticky", top: 0, background: "dodgerblue", color: "white" }}>
            <tr>
              <th>GRN No<br />Date</th>
              <th>Invoice No<br />Date</th>
              <th>PO No<br />Date</th>
              <th>Seller Name</th>
              <th>Debit Note No <br /> Date</th>
              <th>Total Net Amount</th>
              <th>Total Tax Value</th>
              <th>Total Amount</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center">
                  No Data Found
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={index}>
                  <td>
                    {item.grnNumber} <br />
                    {item.grnDate?.split("T")[0]}
                  </td>

                  <td>
                    {item.invoiceNo} <br />
                    {item.invoiceDate?.split("T")[0]}
                  </td>

                  <td>
                    {item.poNumber} <br />
                    {item.poDate?.split("T")[0]}
                  </td>

                  <td>{item.sellerName}</td>

                  <td>
                    {item.debitNoteNo} <br />
                    {item.debitNoteDate?.split("T")[0]}
                  </td>

                  <td>{item.totalNetAmount}</td>
                  <td>{item.totalTaxValue}</td>
                  <td>{item.totalAmount}</td>

                  <td>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleApprove(item)}
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountDebitApproval;