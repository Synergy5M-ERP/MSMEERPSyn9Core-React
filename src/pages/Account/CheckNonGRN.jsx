import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import Swal from "sweetalert2";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/apiconfig";

const CheckNonGRN = () => {
  const navigate = useNavigate();

  const [vendors, setVendors] = useState([]);
  const [selectedVendorId, setSelectedVendorId] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isRegularParty, setIsRegularParty] = useState(false);
const [ledgers, setLedgers] = useState([]);
 const [formData, setFormData] = useState({
  partyName: "",
  vendorCode: "",
  address: "",
  city: "",

  contactPerson: "",
  contactNo: "",
  bankName: "",
  branchName: "",

  accountNo: "",
  ifscCode: "",
  gstNo: "",
  invoiceNo: "",

  invoiceDate: "",
  basicAmount: "",
  taxType: "",
  qtyLot: "",

  igstAmount: "",
  sgstAmount: "",
  cgstAmount: "",

  ledgerCode: "",

  description: "",     // invoice description
  glDescription: ""    // GL description
});
useEffect(() => {
  fetchVendors();
  fetchLedgers();
}, []);
  // ================= FETCH VENDORS =================
  // useEffect(() => {
  //   fetchVendors();
  // }, []);
const fetchLedgers = async () => {
  try {
const res = await axios.get(
  `${API_ENDPOINTS.Ledger}?isActive=true`
);
    setLedgers(res.data);
  } catch (error) {
    Swal.fire("Error fetching ledgers");
  }
};
  const handleLedgerChange = (e) => {
  const ledgerId = e.target.value;

  const selectedLedger = ledgers.find(
    (l) => l.accountLedgerId === Number(ledgerId)
  );

  if (selectedLedger) {
    setFormData((prev) => ({
      ...prev,
      ledgerName: selectedLedger.accountLedgerName,
      ledgerCode: selectedLedger.glCode,   // ✅ GLCode from API
      description: selectedLedger.accountLedgerNarration // ✅ Narration from API
    }));
  }
};
const fetchVendors = async () => {
  try {
    const res = await axios.get(API_ENDPOINTS.Vendors);

    if (res.data.success) {
      setVendors(res.data.data);
      return res.data.data;
    }

  } catch (error) {
    console.log("Vendor API error", error); // ❌ No popup
    return [];
  }
};

  // ================= DROPDOWN =================
  const handleVendorChange = (e) => {
    setSelectedVendorId(e.target.value);
  };

 const handleSearch = async () => {

  let vendorList = vendors;

  // If vendor selected then load vendor details
  if (selectedVendorId) {

    if (vendorList.length === 0) {
      vendorList = await fetchVendors();
      setVendors(vendorList);
    }

    const vendor = vendorList.find(
      (v) => v.id === Number(selectedVendorId)
    );

    if (vendor) {
      setFormData({
        partyName: vendor.company_Name || "",
        vendorCode: vendor.vendorCode || "",
        address: vendor.address || "",
        city: vendor.city || "",

        contactPerson: "",
        contactNo: "",
        accountNo: "",
        bankName: "",
        gstNo: "",
        branchName: "",
        ifscCode: "",

        invoiceNo: "",
        invoiceDate: "",
        basicAmount: "",
        taxType: "",
        description: "",
        igstAmount: "",
        sgstAmount: "",
        cgstAmount: "",
        totalTaxValue: "",
        totalItemValue: "",
        qtyLot: "",
        ledgerName: "",
        ledgerCode: "",
      });
    }
  }

  // ✅ Always open popup
  setShowPopup(true);
};
const handleRegularParty = (checked) => {
  setIsRegularParty(checked);

  if (checked) {
    // ✅ If Regular Party → keep vendor autofill data
    setShowPopup(false);
    setShowForm(true);
  } else {
    // ❌ If unchecked → empty form
    setFormData({
      partyName: "",
      vendorCode: "",
      address: "",
      city: "",
      invoiceNo: "",
      invoiceDate: "",
      basicAmount: "",
      taxType: "",
      description: "",
      igstAmount: "",
      sgstAmount: "",
      cgstAmount: "",
      totalTaxValue: "",
      totalItemValue: "",
      qtyLot: "",
      ledgerName: "",
      ledgerCode: "",
    });

    setShowPopup(false);
    setShowForm(true);
  }
};
  // ================= TAX CALC =================
  const calculateTax = (basic, percent) => {
    const tax =
      (parseFloat(basic) || 0) * (parseFloat(percent) || 0) / 100;
    const total = (parseFloat(basic) || 0) + tax;
    return { tax, total };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...formData, [name]: value };

    if (name === "basicAmount" || name === "taxPercent") {
      const calc = calculateTax(
        name === "basicAmount" ? value : updated.basicAmount,
        name === "taxPercent" ? value : updated.taxPercent
      );
      updated.taxAmount = calc.tax.toFixed(2);
      updated.totalAmount = calc.total.toFixed(2);
    }

    setFormData(updated);
  };

  const handleSubmit = () => {
    console.log(formData);
    Swal.fire("Submitted Successfully ✅");
  };
return (
  <div className="container-fluid px-4 py-3">
    <div
      style={{
        background: "#f1f3f6",
        padding: "25px",
        borderRadius: "10px"
      }}
    >

      {/* ================= VENDOR SELECT ================= */}
      <div className="row g-4 mb-4">

        <div className="col-md-3">
          <label className="form-label fw-bold text-primary">
            Select Vendor
          </label>
          <select
            className="form-select"
            value={selectedVendorId}
            onChange={handleVendorChange}
          >
            <option value="">-- Select Vendor --</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.company_Name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-2 d-flex align-items-end">
          <button
            className="btn btn-primary w-100 fw-bold"
            style={{ borderRadius: "6px", height: "38px" }}
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

      </div>

      {/* ================= POPUP ================= */}
      {showPopup && (
        <div
          className="mb-4 p-4"
          style={{
            border: "1px solid #0d6efd",
            borderRadius: "8px",
            background: "#e9f2ff"
          }}
        >
          <h5 className="text-primary fw-bold mb-3">
            Party Information
          </h5>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              checked={isRegularParty}
              onChange={(e) => handleRegularParty(e.target.checked)}
            />
            <label className="form-check-label fw-semibold">
              Is this a Regular Party?
            </label>
          </div>

          <button
            className="btn btn-success me-2 fw-bold"
            style={{ borderRadius: "6px" }}
            onClick={() => navigate("/vendor-master")}
          >
            Yes
          </button>

          <button
            className="btn btn-secondary fw-bold"
            style={{ borderRadius: "6px" }}
            onClick={() => handleRegularParty(false)}
          >
            No
          </button>
        </div>
      )}

      {/* ================= MAIN FORM ================= */}
      {showForm && (
        <>

          {/* Vendor Info */}
          <div className="row g-4 mb-4">

            <div className="col-md-3">
              <label className="form-label fw-bold text-primary">
                Vendor Name
              </label>
              <input
                className="form-control"
                value={formData.partyName}
                readOnly
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-bold text-primary">
                Vendor Code
              </label>
              <input
                className="form-control"
                value={formData.vendorCode}
                readOnly
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-bold text-primary">
                Address
              </label>
              <input
                className="form-control"
                value={formData.address}
                readOnly
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-bold text-primary">
                City
              </label>
              <input
                className="form-control"
                value={formData.city}
                readOnly
              />
            </div>

          </div>

          {/* Contact */}
          <div className="row g-4 mb-4">

            <div className="col-md-3">
              <label className="form-label fw-bold text-primary">
                Contact Person
              </label>
              <input
                name="contactPerson"
                className="form-control"
                value={formData.contactPerson}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-bold text-primary">
                Contact No
              </label>
              <input
                name="contactNo"
                className="form-control"
                value={formData.contactNo}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-bold text-primary">
                Bank Name
              </label>
              <input
                name="bankName"
                className="form-control"
                value={formData.bankName}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-bold text-primary">
                Branch Name
              </label>
              <input
                name="branchName"
                className="form-control"
                value={formData.branchName}
                onChange={handleChange}
              />
            </div>

          </div>

          {/* Bank + GST */}
          <div className="row g-4 mb-4">

            <div className="col-md-3">
              <label className="form-label fw-bold text-primary">
                Account No
              </label>
              <input
                name="accountNo"
                className="form-control"
                value={formData.accountNo}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-bold text-primary">
                IFSC Code
              </label>
              <input
                name="ifscCode"
                className="form-control"
                value={formData.ifscCode}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-bold text-primary">
                GST No
              </label>
              <input
                name="gstNo"
                className="form-control"
                value={formData.gstNo}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-bold text-primary">
                Invoice No
              </label>
              <input
                name="invoiceNo"
                className="form-control"
                onChange={handleChange}
              />
            </div>

          </div>

        {/* Invoice Details */}
<div className="row g-4 mb-4">

  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">
      Invoice Date
    </label>
    <input
      type="date"
      name="invoiceDate"
      className="form-control"
      value={formData.invoiceDate}
      onChange={handleChange}
    />
  </div>

  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">
      Basic Amount
    </label>
    <input
      type="number"
      name="basicAmount"
      className="form-control"
      value={formData.basicAmount}
      onChange={handleChange}
    />
  </div>

  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">
      Tax Type
    </label>
    <select
      name="taxType"
      className="form-select"
      value={formData.taxType}
      onChange={handleChange}
    >
      <option value="">Select</option>
      <option value="IGST">IGST</option>
      <option value="SGST_CGST">SGST + CGST</option>
    </select>
  </div>
 <div className="col-md-3">
    <label className="form-label fw-bold text-primary">
      Descritpion
    </label>
    <input
      type="number"
      name="basicAmount"
      className="form-control"
      value={formData.description}
      onChange={handleChange}
    />
  </div>
  </div>
  <div className="row g-4 mb-4">

  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">
      Qty / Lot
    </label>
    <input
      type="number"
      name="qtyLot"
      className="form-control"
      value={formData.qtyLot}
      onChange={handleChange}
    />
  </div>
 <div className="col-md-3">
    <label className="form-label fw-bold text-primary">
      IGST Amount
    </label>
    <input
      type="number"
      name="igstAmount"
      className="form-control"
      value={formData.igstAmount}
      onChange={handleChange}
    />
  </div>

  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">
      SGST Amount
    </label>
    <input
      type="number"
      name="sgstAmount"
      className="form-control"
      value={formData.sgstAmount}
      onChange={handleChange}
    />
  </div>

  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">
      CGST Amount
    </label>
    <input
      type="number"
      name="cgstAmount"
      className="form-control"
      value={formData.cgstAmount}
      onChange={handleChange}
    />
  </div>
</div>

{/* GST Calculation */}
<div className="row g-4 mb-4">

 

  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">
      Total Tax Value
    </label>
    <input
      className="form-control"
      value={
        Number(formData.igstAmount || 0) +
        Number(formData.sgstAmount || 0) +
        Number(formData.cgstAmount || 0)
      }
      readOnly
    />
  </div>
<div className="col-md-3">
    <label className="form-label fw-bold text-primary">
      Total Item Value
    </label>
    <input
      className="form-control"
      value={
        Number(formData.basicAmount || 0) +
        Number(formData.igstAmount || 0) +
        Number(formData.sgstAmount || 0) +
        Number(formData.cgstAmount || 0)
      }
      readOnly
    />
  </div>
  
  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">
      Select Ledger
    </label>
    <select
      className="form-select"
      value={formData.ledgerCode}
      onChange={handleLedgerChange}
    >
      <option value="">-- Select Ledger --</option>
      {ledgers.map((ledger) => (
        <option
          key={ledger.accountLedgerId}
          value={ledger.accountLedgerId}
        >
          {ledger.accountLedgerName}
        </option>
      ))}
    </select>
  </div>

  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">
      Ledger Code
    </label>
    <input
      className="form-control"
      value={formData.ledgerCode}
      readOnly
    />
  </div>
  
          {/* Description */}
          <div className="mb-4">
            <label className="form-label fw-bold text-primary">
             
             GL Description
            </label>
            <textarea
              className="form-control"
              rows="3"
              value={formData.gldescription}
              readOnly
            />
          </div>
</div>

{/* Total Item Value */}
<div className="row g-4 mb-4">

  

</div>

{/* Ledger Section */}
<div className="row g-4 mb-4">


</div>


          {/* Submit */}
          <div className="text-center">
            <button
              className="btn btn-primary btn-lg px-5 fw-bold"
              style={{ borderRadius: "6px" }}
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>

        </>
      )}

    </div>
  </div>
);
};

export default CheckNonGRN;