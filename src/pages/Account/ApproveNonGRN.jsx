import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ApproveNonGRN = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    employeeCode: "",
    date: "",
    purpose: "",
    billNo: "",
    amount: "",
    partyName: "",
    totalAmount: ""
  });
const EmployeeNonGRN = () => {
  return <div>Employee Non GRN Component</div>;
}
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!formData.employeeCode || !formData.amount) {
      toast.error("Please fill required fields");
      return;
    }

    setLoading(true);

    console.log("Employee Non GRN Payload:", formData);

    toast.success("Employee Non GRN Saved Successfully ✅");

    setFormData({
      employeeCode: "",
      date: "",
      purpose: "",
      billNo: "",
      amount: "",
      partyName: "",
      totalAmount: ""
    });

    setLoading(false);
  };

  const handleReset = () => {
    Swal.fire({
      title: "Reset Form?",
      icon: "warning",
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        setFormData({
          employeeCode: "",
          date: "",
          purpose: "",
          billNo: "",
          amount: "",
          partyName: "",
          totalAmount: ""
        });
      }
    });
  };

  return (
    <div style={{ background: "white", padding: "25px", borderRadius: "8px" }}>
      <ToastContainer position="top-center" theme="colored" />

      <div className="row mb-3">
        <div className="col">
          <label className="form-label fw-semibold text-primary">Employee Code *</label>
          <input type="text" name="employeeCode" className="form-control"
            value={formData.employeeCode} onChange={handleChange} />
        </div>

        <div className="col">
          <label className="form-label fw-semibold text-primary">Date</label>
          <input type="date" name="date" className="form-control"
            value={formData.date} onChange={handleChange} />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col">
          <label className="form-label fw-semibold text-primary">Purpose</label>
          <input type="text" name="purpose" className="form-control"
            value={formData.purpose} onChange={handleChange} />
        </div>

        <div className="col">
          <label className="form-label fw-semibold text-primary">Bill No</label>
          <input type="text" name="billNo" className="form-control"
            value={formData.billNo} onChange={handleChange} />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col">
          <label className="form-label fw-semibold text-primary">Amount (₹)</label>
          <input type="number" name="amount" className="form-control"
            value={formData.amount} onChange={handleChange} />
        </div>

        <div className="col">
          <label className="form-label fw-semibold text-primary">Party Name</label>
          <input type="text" name="partyName" className="form-control"
            value={formData.partyName} onChange={handleChange} />
        </div>

        <div className="col">
          <label className="form-label fw-semibold text-primary">Total Amount</label>
          <input type="number" name="totalAmount" className="form-control"
            value={formData.totalAmount} onChange={handleChange} />
        </div>
      </div>

      <div className="text-center mt-4">
        <button className="btn btn-primary px-4 me-3"
          onClick={handleSave} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={18} /> : "Save"}
        </button>

        <button className="btn btn-outline-secondary px-4"
          onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default ApproveNonGRN;