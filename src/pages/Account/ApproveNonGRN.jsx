import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { API_ENDPOINTS } from "../../config/apiconfig";

const ApproveNonGrn = () => {

  const [type, setType] = useState("NonGRN");
  const [grnData, setGrnData] = useState([]);

  /////////////////////////////////////////////////////////////
  // FETCH DATA
  /////////////////////////////////////////////////////////////
  const fetchData = async (selectedType) => {
    try {
      const res = await axios.get(API_ENDPOINTS.GetGrnInvoiceDetails, {
        params: { checkval: selectedType }
      });

      if (res.data.success) {
        setGrnData(res.data.grnDetails || []);
      } else {
        setGrnData([]);
        Swal.fire("Error", res.data.message, "error");
      }

    } catch (err) {
      console.log(err);
      Swal.fire("Error fetching data");
    }
  };

  /////////////////////////////////////////////////////////////
  // LOAD DATA
  /////////////////////////////////////////////////////////////
  useEffect(() => {
    fetchData(type);
  }, [type]);

  /////////////////////////////////////////////////////////////
  // RADIO CHANGE
  /////////////////////////////////////////////////////////////
  const handleTypeChange = (val) => {
    setType(val);
  };

  /////////////////////////////////////////////////////////////
  // APPROVE SINGLE ROW
  /////////////////////////////////////////////////////////////
  const handleApprove = async (id) => {

    try {
      const res = await axios.post(
        API_ENDPOINTS.ApproveGrnInvoice,
        [
          {
            nonGrnInvoiceId: id,
            approveNonGRNInvoice: true
          }
        ]
      );

      if (res.data.success) {
        Swal.fire("Approved!", res.data.message, "success");
        fetchData(type);
      } else {
        Swal.fire("Error", res.data.message, "error");
      }

    } catch (err) {
      console.log(err);
      Swal.fire("Error approving invoice");
    }
  };

  /////////////////////////////////////////////////////////////
  // UI
  /////////////////////////////////////////////////////////////
  return (
    <div className="container-fluid mt-3">

      {/* RADIO */}
      <div className="mb-3">
        <label className="me-3 fw-bold">Select Type:</label>

        <input
          type="radio"
          checked={type === "NonGRN"}
          onChange={() => handleTypeChange("NonGRN")}
        /> <span className="me-3">NON GRN</span>

        <input
          type="radio"
          checked={type === "NonSO"}
          onChange={() => handleTypeChange("NonSO")}
        /> NON SALES
      </div>

      {/* NO DATA */}
      {grnData.length === 0 && (
        <div className="text-center text-muted mt-4">
          No Data Found
        </div>
      )}

      {/* TABLE */}
      {grnData.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-striped text-center">

<thead className="custom-header">
              <tr>
                <th>Invoice No</th>
                <th>Date</th>
                <th>Ledger</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Amount</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {grnData.map((item, index) => {

                const isApproved = item.approveNonGRNInvoice === true;

                return (
                  <tr key={index}>

                    <td>{item.invoiceNo || item.grN_NO}</td>

                    <td>
                      {item.invoiceDate
                        ? new Date(item.invoiceDate).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>{item.ledgerName || "-"}</td>

                    <td>{item.description}</td>

                    <td>{item.qty}</td>

                    <td>
                      ₹ {(item.basicAmount || 0).toLocaleString("en-IN")}
                    </td>

                    <td className="fw-bold text-success">
                      ₹ {(item.totalValue || 0).toLocaleString("en-IN")}
                    </td>

                    
                    {/* APPROVE BUTTON */}
                    <td>
                      {!isApproved ? (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleApprove(item.nonGrnInvoiceId)}
                        >
                          Approve
                        </button>
                      ) : (
                        <button className="btn btn-sm btn-secondary" disabled>
                          Approved
                        </button>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      )}

    </div>
  );
};

export default ApproveNonGrn;