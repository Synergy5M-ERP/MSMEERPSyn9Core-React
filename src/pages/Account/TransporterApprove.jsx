import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_ENDPOINTS } from "../../config/apiconfig";

const TransporterApprove = () => {

  const [grnData, setGrnData] = useState([]);

  /////////////////////////////////////////////////////////////
  // LOAD DATA
  /////////////////////////////////////////////////////////////
  useEffect(() => {
    fetch(API_ENDPOINTS.GetTransporterDetails) // ✅ FIXED
      .then(res => res.json())
      .then(res => {
        if (res?.data) {
          setGrnData(res.data);
        }
      })
      .catch(err => console.error("Error loading data", err));
  }, []);

  /////////////////////////////////////////////////////////////
  // CHECKBOX CHANGE
  /////////////////////////////////////////////////////////////
  const handleCheckChange = (id) => {
    setGrnData(prev =>
      prev.map(item =>
        item.transporterGRNId === id
          ? { ...item, approveTransportation: !item.approveTransportation }
          : item
      )
    );
  };

  /////////////////////////////////////////////////////////////
  // SAVE
  /////////////////////////////////////////////////////////////
 const handleApprove = (item) => {
  const payload = [
    {
      transporterGRNId: item.transporterGRNId,
      approve: true
    }
  ];

  fetch(API_ENDPOINTS.UpdateApproveStatusBulk, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        Swal.fire("Success", res.message, "success");

        // update UI
        setGrnData(prev =>
          prev.map(x =>
            x.transporterGRNId === item.transporterGRNId
              ? { ...x, approveTransportation: true }
              : x
          )
        );
      } else {
        Swal.fire("Error", res.message, "error");
      }
    })
    .catch(() => {
      Swal.fire("Error", "API Failed", "error");
    });
};
  /////////////////////////////////////////////////////////////
  // DATE FORMAT
  /////////////////////////////////////////////////////////////
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return isNaN(d) ? "-" : d.toLocaleDateString("en-GB");
  };

  /////////////////////////////////////////////////////////////
  // UI
  /////////////////////////////////////////////////////////////
  return (
    <div className="container-fluid mt-3">


      <div className="table-responsive">
        <table className="table table-bordered table-striped text-center">

          <thead style={{ backgroundColor: "#007bff", color: "#fff" }}>
            <tr>
              <th>Invoice No</th>
              <th>Transporter</th>
              <th>Date</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Net</th>
              <th>Tax</th>
              <th>Total</th>
              <th>Approve</th>
            </tr>
          </thead>

          <tbody>
            {grnData.length > 0 ? (
              grnData.map((item, index) => (
                <tr key={index}>

                  <td>{item.invoiceNo || "-"}</td>
                  <td>{item.transporterName || "-"}</td>
                  <td>{formatDate(item.invoiceDate)}</td>
                  <td>{item.qty}</td>

                  <td>₹ {item.price?.toLocaleString("en-IN")}</td>
                  <td>₹ {item.netAmount?.toLocaleString("en-IN")}</td>
                  <td>₹ {item.taxAmount?.toLocaleString("en-IN")}</td>

                  <td className="fw-bold text-success">
                    ₹ {item.totalAmount?.toLocaleString("en-IN")}
                  </td>

              <td>
  <button
    className={`btn btn-sm ${
      item.approveTransportation ? "btn-secondary" : "btn-success"
    }`}
    onClick={() => handleApprove(item)}
  >
    {item.approveTransportation ? "Approved" : "Approve"}
  </button>
</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No Data Found</td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default TransporterApprove;