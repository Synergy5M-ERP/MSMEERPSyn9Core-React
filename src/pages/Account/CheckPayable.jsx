import React, { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_ENDPOINTS } from "../../config/apiconfig";

const CheckPayable = () => {
  const [selectedGrn, setSelectedGrn] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [grnNumbers, setGrnNumbers] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [invoiceNumbers, setInvoiceNumbers] = useState([]);
const [selectedInvoice, setSelectedInvoice] = useState("");
  const [enteredGrnNumber, setEnteredGrnNumber] = useState("");
  const [masterBillCheck, setMasterBillCheck] = useState(false);
  const [formData, setFormData] = useState({
    vendorId: "",
    sellerName: "",
    grnNumber: "",
    grnDate: "",
    poNumber: "",
    poDate: "",
    invoiceNumber: "",
    invoiceDate: "",
    vehicleNo: "",
    TransporterName: "",
    paymentDue: "",
    status: "",
    totalAmount: 0,
    taxAmount: 0,
    grandTotal: 0,
      // ✅ ADD THESE
  debitNumber: "",
  debitNoteDate: "",

  });
const loadInvoiceNumbers = async (sellerName) => {

  if (!sellerName) {
    setInvoiceNumbers([]);
    return;
  }

  try {

    const res = await fetch(
      `${API_ENDPOINTS.GetInvoicesBySeller}?sellerName=${sellerName}`
    );

    const data = await res.json();

    if (data.success) {
      setInvoiceNumbers(data.data);
    }

  } catch {
    toast.error("Unable to load invoices");
  }
};
  // ✅ SAFE JSON PARSER
  const safeJson = async (res) => {
    try {
      return await res.json();
    } catch {
      return {};
    }
  };

  // ✅ FORM VALIDATION WITH DEBUG
  const validateForm = () => {
    if (!formData.sellerName.trim()) {
      toast.error("Seller Name is required");
      return false;
    }
    if (!formData.grnNumber.trim()) {
      toast.error("GRN Number is required");
      return false;
    }
    if (!formData.grnDate) {
      toast.error("GRN Date is required");
      return false;
    }
    if (!formData.invoiceNumber?.trim()) {
      toast.error("Invoice Number is required");
      return false;
    }
    if (!formData.invoiceDate) {
      toast.error("Invoice Date is required");
      return false;
    }
    if (!formData.poNumber?.trim()) {
      toast.error("PO Number is required");
      return false;
    }
    if (!formData.poDate) {
      toast.error("PO Date is required");
      return false;
    }
    if (!formData.vehicleNo?.trim()) {
      toast.error("Vehicle No is required");
      return false;
    }
    if (!formData.TransporterName?.trim()) {
      toast.error("Transporter Name is required");
      return false;
    }
   {/*if (!formData.paymentDue) {
      toast.error("Payment Due date is required");
      return false;
   */ }

    const selectedItems = tableData.filter(row => row.billCheck === true);
    console.log("🔍 Validation found selected items:", selectedItems.length);

    if (selectedItems.length === 0) {
      toast.error(`Please select at least one item using Bill Check checkbox (0/${tableData.length} selected)`);
      return false;
    }
    return true;
  };

  // ✅ QUANTITY VALIDATION
  const validateQuantities = (row) => {
    const received = parseFloat(row.receivedQty) || 0;
    const approved = parseFloat(row.approvedQty) || 0;
    const damaged = parseFloat(row.damagedQty) || 0;

    if (approved + damaged > received) {
      toast.error("Approved + Damaged quantity cannot exceed Received quantity");
      return false;
    }
    if (received < 0 || approved < 0 || damaged < 0) {
      toast.error("Quantities cannot be negative");
      return false;
    }
    return true;
  };

  // ✅ LOAD DROPDOWNS ON MOUNT
  useEffect(() => {
    fetchAllDropdowns();
  }, []);
const fetchAllDropdowns = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_ENDPOINTS.GetSellers);
      const data = await safeJson(res);
      const suppliersWithIds = (data.data || []).map((name, index) => ({
        id: index + 1,
        name,
      }));
      setSuppliers(suppliersWithIds);
    } catch (err) {
      toast.error("Failed to load dropdowns");
    } finally {
      setLoading(false);
    }
  };


  // ✅ LOAD GRN NUMBERS
  const loadGrnNumbers = async (sellerName) => {
    if (!sellerName) {
      setGrnNumbers([]);
      return;
    }
    try {
      const res = await fetch(`${API_ENDPOINTS.GetGRNNumbersBySeller}?sellerName=${sellerName}`);
      console.log(res)
      const data = await safeJson(res);
      setGrnNumbers(data.data || []);
    } catch {
      toast.error("Unable to load GRN numbers");
    }
  };

  // --- 1. Adjust fetchGRNTableData to ADD items from multiple GRNs ---

 const fetchGRNTableData = async (invoiceNumber) => {
  if (!invoiceNumber) return;

  try {
    setLoading(true);

    const res = await fetch(
      `${API_ENDPOINTS.GetGRNDetails}?invoice=${invoiceNumber}`
    );

    const data = await safeJson(res);

    if (!data.success || !data.data?.items) {
      toast.warning("No items found for this invoice");
      return;
    }

   const newItems = data.data.items.map((item, index) => {
 
  console.log("TAX VALUES FROM API:", item.cgst, item.sgst, item.igst);

  let cgst = parseFloat(item.cgst) || 0;
let sgst = parseFloat(item.sgst) || 0;
let igst = parseFloat(item.igst) || 0;
  return {
    id: item.g_Id || `${invoiceNumber}-${item.itemName}-${index}`,
    itemName: item.itemName || "",
    grade: item.grade || "",
    itemCode: item.itemCode || "",
    receivedQty: Number(item.receivedQty) || 0,
    approvedQty: Number(item.acceptedQty) || 0,
    damagedQty: Number(item.rejectedQty) || 0,
    rate: Number(item.rate) || 0,

    cgst,
    sgst,
    igst,

    backendTaxAmount: Number(item.taxAmount) || 0,
    backendNetAmount: Number(item.netAmount) || 0
  };
});

    // ✅ calculate totals
    const itemsWithTotals = newItems.map((row) => {

      const receivedQty = parseFloat(row.receivedQty) || 0;
      const rate = parseFloat(row.rate) || 0;

      const totalItemValue = receivedQty * rate;
      const taxAmount = Number(row.backendTaxAmount) || 0;

      return {
        ...row,
        totalItemValue,
        taxAmount,
        billItemValue: totalItemValue + taxAmount
      };
    });

    setTableData(prevData => {

      const existingIds = new Set(prevData.map(item => item.id));

      const merged = [...prevData];

      for (const item of itemsWithTotals) {
        if (!existingIds.has(item.id)) {
          merged.push(item);
        }
      }

      updateGrandTotals(merged);

      return merged;
    });

    const header = data.data.header;

    setFormData(fd => ({
      ...fd,
      ...(header
        ? {
            grnNumber: header.grnNumber || "",
            grnDate: header.grnDate
              ? header.grnDate.split("T")[0]
              : "",
            poNumber: header.poNumber || "",
            poDate: data.data.poDetails?.purchaseDate
              ? data.data.poDetails.purchaseDate.split("T")[0]
              : "",
            invoiceNumber: header.invoiceNumber || "",
            invoiceDate: header.invoiceDate
              ? header.invoiceDate.split("T")[0]
              : "",
            vehicleNo: header.vehicleNo || "",
            TransporterName: header.transporterName || "",
            paymentDue: header.paymentDue
              ? header.paymentDue.split("T")[0]
              : "",
            status: "Received"
          }
        : {})
    }));

    setEnteredGrnNumber(invoiceNumber);

  } catch (err) {
    console.error(err);
    toast.error("Unable to load GRN data");
  } finally {
    setLoading(false);
  }
};

const handleMasterBillCheck = useCallback((checked) => {
  setTableData(prevTableData => 
    prevTableData.map(row => ({
      ...row,
      billCheck: checked,
      isSelected: checked
    }))
  );
  setMasterBillCheck(checked);
}, []);

  // --- 2. Save all tableData items, checked or not ---

  // ✅ COMPLETE handleSave WITH AUTO-CLEAR AFTER SUCCESS
  const handleSave = async () => {
    if (!validateForm()) return;

    const TOAST_ID = "saving-grn";

    // Show loading toast
    toast.loading("Saving GRN data...", {
      toastId: TOAST_ID,
      closeOnClick: false,
      draggable: false,
    });

    // ✅ FIXED PAYLOAD - Matches backend model exactly
   const payload = {
  VendorId: Number(formData.vendorId) || 0,
  SellerName: formData.sellerName,
  grnNumber: formData.grnNumber,
  grnDate: formData.grnDate,
  poNumber: formData.poNumber,
  poDate: formData.poDate,
  invoiceNumber: formData.invoiceNumber,
  invoiceDate: formData.invoiceDate,
  vehicleNo: formData.vehicleNo,
  TransporterName: formData.TransporterName,
  paymentDue: formData.paymentDue,
  status: formData.status || "Received",

  // ✅ NEW FIELDS
  TotalNetAmount: tableData.reduce(
    (sum, item) => sum + Number(item.backendNetAmount || 0),
    0
  ),

  CGSTAmount: tableData.reduce(
    (sum, item) => sum + Number(item.cgst || 0),
    0
  ),

  SGSTAmount: tableData.reduce(
    (sum, item) => sum + Number(item.sgst || 0),
    0
  ),

  IGSTAmount: tableData.reduce(
    (sum, item) => sum + Number(item.igst || 0),
    0
  ),

  TotalAmount: tableData.reduce(
    (sum, item) =>
      sum +
      Number(item.backendNetAmount || 0) +
      Number(item.backendTaxAmount || 0),
    0
  ),

  TDSAmount: 0,

  NetPayable: tableData.reduce(
    (sum, item) =>
      sum +
      Number(item.backendNetAmount || 0) +
      Number(item.backendTaxAmount || 0),
    0
  ),

  BillStatus: "Pending",
  Description: formData.sellerName || "Payable GRN",

  Items: tableData.map(item => ({
    Description: `${item.itemName}`,
    itemName: item.itemName,
    grade: item.grade,
    itemCode: item.itemCode,
    receivedQty: parseFloat(item.receivedQty) || 0,
    approvedQty: parseFloat(item.approvedQty) || 0,
    damagedQty: parseFloat(item.damagedQty) || 0,
    unit: item.receivedUnit || "pcs",
    TaxType: item.taxType || "",
    cgst: parseFloat(item.cgst) || 0,
    sgst: parseFloat(item.sgst) || 0,
    igst: parseFloat(item.igst) || 0,
    rate: parseFloat(item.rate) || 0,

    TotalAmount: Number(item.backendNetAmount) || 0,
    TotalTaxAmount: Number(item.backendTaxAmount) || 0,

    billItemValue:
      Number(item.backendNetAmount || 0) +
      Number(item.backendTaxAmount || 0),

    billCheck: item.billCheck === true,
    TransporterName: formData.TransporterName || ""
  }))
};

    console.log("💾 Sending payload to backend:", payload);

    try {
      setSaveLoading(true);

      const response = await fetch(API_ENDPOINTS.SaveGRN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await safeJson(response);

      if (!response.ok) {
        // Detailed error parsing
        let errorMsg = `HTTP ${response.status}`;

        if (result?.errors) {
          const errorsArr = [];
          for (const [field, msgs] of Object.entries(result.errors)) {
            errorsArr.push(`${field}: ${Array.isArray(msgs) ? msgs[0] : msgs}`);
          }
          errorMsg += ` - ${errorsArr.join('; ')}`;
        } else {
          errorMsg += `: ${result?.message || result?.error || 'Validation failed'}`;
        }

        toast.update(TOAST_ID, {
          render: errorMsg,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        console.error("❌ Save error:", result);
        return;
      }

      // ✅ SUCCESS - Show confirmation + AUTO CLEAR FORM
      const successMsg = `✅ Saved ${tableData.length} items successfully!`;
      toast.update(TOAST_ID, {
        render: successMsg,
        type: "success",
        isLoading: false,
        autoClose: 2000, // Short delay before auto-clear
      });

      // ✅ AUTO-CLEAR EVERYTHING AFTER 2 SECONDS (after toast shows)
      setTimeout(() => {
        clearForm();
        toast.info("🆕 Form cleared - ready for new data!", {
          toastId: "form-cleared",
          autoClose: 2000
        });
      }, 2200); // Slightly longer than toast duration

    } catch (error) {
      console.error("🌐 Network error:", error);
      toast.update(TOAST_ID, {
        render: "🌐 Network error! Please check your connection.",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setSaveLoading(false);
    }
  };

  // ✅ NEW: CLEAR FORM FUNCTION
  const clearForm = () => {
    setFormData({
      vendorId: "",
      sellerName: "",
      grnNumber: "",
      grnDate: "",
      poNumber: "",
      poDate: "",
      invoiceNumber: "",
      invoiceDate: "",
      vehicleNo: "",
      TransporterName: "",
      paymentDue: "",
      status: "",
      totalAmount: 0,
      taxAmount: 0,
      grandTotal: 0,
    });
    setTableData([]);
    setSelectedGrn("");
    setGrnNumbers([]);
    setEnteredGrnNumber("");
    setLoading(false);
    setSaveLoading(false);
  };



  // ✅ HANDLE FORM CHANGES
const handleChange = (e) => {
  const { name, value } = e.target;

  // 🔹 Seller Change
  if (name === "sellerName") {

    const selectedSupplier = suppliers.find(
      s => s.id === Number(value)
    );

    setFormData(fd => ({
      ...fd,
      vendorId: Number(value),
      sellerName: selectedSupplier?.name || ""
    }));

    // Load invoices for this seller
    loadInvoiceNumbers(selectedSupplier?.name || "");

    return;
  }

  // 🔹 Invoice Change (LOAD GRN DATA)
  if (name === "invoiceNumber") {

    setSelectedInvoice(value);

    const selectedInvoiceObj = invoiceNumbers.find(
      inv => inv.id === Number(value)
    );

    setFormData(fd => ({
      ...fd,
      invoiceNumber: selectedInvoiceObj?.invoiceNumber || ""

    }));

    // 🔹 Load GRN Details + Items
fetchGRNTableData(selectedInvoiceObj?.invoiceNumber);
    return;
  }

  // 🔹 GRN Change (if you still use GRN dropdown)
  if (name === "grnNumber") {

    const grnId = value;

    setSelectedGrn(grnId);

    setFormData(fd => ({
      ...fd,
      grnNumber: grnId
    }));

    fetchGRNTableData(grnId);

    return;
  }

  // 🔹 Default Field Change
  setFormData(fd => ({
    ...fd,
    [name]: value
  }));
};
  const handleBillCheckChange = useCallback((index) => {
    console.log("🔄 Toggling billCheck at index:", index);
    setTableData(prevTableData => {
      const newTableData = prevTableData.map((row, i) => {
        if (i === index) {
          const newBillCheck = !row.billCheck;
          console.log(`✅ Row ${index} billCheck changed to:`, newBillCheck);
          return {
            ...row,
            billCheck: newBillCheck,
            isSelected: newBillCheck
          };
        }
        return row;
      });

      const allChecked = newTableData.every(row => row.billCheck === true);
      const someChecked = newTableData.some(row => row.billCheck === true);
      setMasterBillCheck(allChecked ? true : someChecked ? 'indeterminate' : false);

      updateGrandTotals(newTableData);
      return newTableData;
    });
  }, []);






  // ✅ QUANTITY CHANGE HANDLER
  const handleQuantityChange = useCallback((index, field) => (e) => {
    const value = e.target.value;
    setTableData(prev => {
      const newData = [...prev];
      newData[index][field] = value;

      const row = newData[index];
      if (!validateQuantities(row)) {
        return prev;
      }

      const receivedQty = parseFloat(row.receivedQty) || 0;
      const cgst = parseFloat(row.cgst) || 0;
      const sgst = parseFloat(row.sgst) || 0;
      const igst = parseFloat(row.igst) || 0;
      const rate = parseFloat(row.rate) || 0;

      newData[index].taxAmount = (cgst + sgst + igst) * receivedQty;
      newData[index].totalItemValue = receivedQty * rate;
      newData[index].billItemValue = newData[index].totalItemValue + newData[index].taxAmount;

      updateGrandTotals(newData);
      return newData;
    });
  }, []);

  // ✅ UPDATE GRAND TOTALS
  // const updateGrandTotals = (data) => {
  //   const selectedItems = data.filter(row => row.billCheck === true);
  //   const totalAmount = selectedItems.reduce((sum, row) => sum + (parseFloat(row.totalItemValue) || 0), 0);
  //   const taxAmount = selectedItems.reduce((sum, row) => sum + (parseFloat(row.taxAmount) || 0), 0);
  //   const grandTotal = totalAmount + taxAmount;

  //   setFormData(fd => ({
  //     ...fd,
  //     totalAmount,
  //     taxAmount,
  //     grandTotal,
  //   }));
  // };
  const updateGrandTotals = (data) => {
    const selectedItems = data.filter(row => row.billCheck === true);
    const totalAmount = selectedItems.reduce((sum, row) => sum + (parseFloat(row.totalItemValue) || 0), 0);
    const taxAmount = selectedItems.reduce((sum, row) => sum + (parseFloat(row.taxAmount) || 0), 0);
    const grandTotal = totalAmount + taxAmount;

    setFormData(fd => ({
      ...fd,
      totalAmount,
      taxAmount,
      grandTotal,
    }));
  };
  // ✅ AUTO UPDATE TOTALS WHEN TABLE CHANGES
  useEffect(() => {
    if (tableData.length > 0) {
      updateGrandTotals(tableData);
    }
  }, [tableData]);



  // ✅ RESET FORM
  const handleCancel = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "All data will be reset!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reset!",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        setFormData({
          vendorId: "",
          sellerName: "",
          grnNumber: "",
          grnDate: "",
          poNumber: "",
          poDate: "",
          invoiceNumber: "",
          invoiceDate: "",
          vehicleNo: "",
          TransporterName: "",
          paymentDue: "",
          status: "",
          totalAmount: 0,
          taxAmount: 0,
          grandTotal: 0,
        });
        setTableData([]);
        setSelectedGrn("");
        setGrnNumbers([]);
        setEnteredGrnNumber("");
        toast.info("Form reset successfully");
      }
    });
  };

  const LoadingSpinner = () => (
    <div className="d-flex justify-content-center align-items-center p-2">
      <Loader2 className="animate-spin" size={18} />
      <span className="ms-2">Loading...</span>
    </div>
  );

  return (
    <div>
      <ToastContainer position="top-center" theme="colored" />
      {/* <div style={{ background: "white", padding: "25px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}> */}

      <div style={{ background: "white", padding: "25px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>

        {/* FORM FIELDS */}
        <div className="row mb-3">
          <div className="col mb-3">
            <label className="form-label text-primary fw-semibold"> Seller Name</label>
           <select className="form-select" name="sellerName" value={formData.vendorId || ""} onChange={handleChange}>
              <option value="">Select Seller</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          {/*<div className="col mb-3">
            <label className="form-label text-primary fw-semibold"> GRN Number</label>
            <select className="form-select" value={selectedGrn || ""} onChange={handleChange} name="grnNumber">
              <option value="">Select GRN No.</option>
              {grnNumbers.map((g) => (
                <option key={g.id} value={String(g.id)} disabled={String(g.id) === enteredGrnNumber}>
                  {g.number || g.grnNumber || g.GRN_NO} {String(g.id) === enteredGrnNumber ? "(Selected)" : ""}
                </option>
              ))}
            </select>
          </div>*/}
          <div className="col mb-3">
<label className="form-label text-primary fw-semibold">
Invoice Number
</label>

<select
  className="form-select"
  name="invoiceNumber"
  value={selectedInvoice}
  onChange={handleChange}
>

<option value="">Select Invoice</option>

{invoiceNumbers.map(inv => (
<option key={inv.id} value={inv.id}>
{inv.invoiceNumber}
</option>
))}

</select>
</div>

          <div className="col mb-3">
            <label className="form-label text-primary fw-semibold"> GRN Date</label>
            <input type="date" name="grnDate" className="form-control" value={formData.grnDate} onChange={handleChange} required />
          </div>
         
          <div className="col mb-3">
            <label className="form-label text-primary fw-semibold"> GRN Number</label>
<input
  type="text"
  name="grnNumber"
  className="form-control"
  value={formData.grnNumber}   // ✅ correct
  onChange={handleChange}
  required
/>          </div>
          <div className="col mb-3">
            <label className="form-label text-primary fw-semibold"> Invoice Date</label>
            <input type="text" name="invoiceDate" className="form-control" value={formData.invoiceDate} onChange={handleChange} required />
          </div>
        </div>
 
        <div className="row mb-3">
          <div className="col mb-3">
            <label className="form-label text-primary fw-semibold"> PO Number</label>
            <input type="text" name="poNumber" className="form-control" value={formData.poNumber} onChange={handleChange} required />
          </div>
          <div className="col mb-3">
            <label className="form-label text-primary fw-semibold"> PO Date</label>
            <input type="date" name="poDate" className="form-control" value={formData.poDate} onChange={handleChange} required />
          </div>
          <div className="col mb-3">
            <label className="form-label text-primary fw-semibold"> Vehicle No</label>
            <input type="text" name="vehicleNo" className="form-control" value={formData.vehicleNo} onChange={handleChange} required />
          </div>
          <div className="col mb-3">
            <label className="form-label text-primary fw-semibold"> Transporter Name</label>
            <input type="text" name="TransporterName" className="form-control" value={formData.TransporterName} onChange={handleChange} required />
          </div>
          <div className="col mb-3">
            <label className="form-label text-primary fw-semibold"> Payment Due</label>
            <input type="date" name="paymentDue" className="form-control" value={formData.paymentDue} onChange={handleChange} required />
          </div>
        </div>
<hr />

<div className="row mt-3">

  <div className="col-md-2 d-flex align-items-center">
    <h6 className="fw-bold text-primary mb-0">
      Debit Note
    </h6>
  </div>

  {/* Debit Note Number */}
  <div className="col-md-4">
    <label className="form-label fw-semibold">
      Debit Note Number
    </label>

    <input
      type="text"
      name="debitNumber"
      className="form-control"
      value={formData.debitNumber || ""}
      readOnly
    />
  </div>

  {/* Debit Note Date */}
  <div className="col-md-4">
    <label className="form-label fw-semibold">
      Debit Note Date
    </label>

    <input
      type="date"
      name="debitNoteDate"
      className="form-control"
      value={formData.debitNoteDate || ""}
      onChange={handleChange}
    />
  </div>

</div>


        {/* ✅ FIXED TABLE WITH WORKING CHECKBOXES */}
{/* ✅ FIXED TABLE WITH CHECKBOX + TOTALS LIKE MVC VIEW */}

{/* ✅ TABLE UI SAME AS IMAGE FORMAT */}

<div className="table-responsive mt-4">
  <table
    className="table table-bordered text-center align-middle"
    style={{
      border: "1px solid #d6d6d6",
      fontSize: "15px"
    }}
  >
    <thead>
      <tr
        style={{
          background: "#eef1f5",
          color: "#1f2d3d",
          fontWeight: "600"
        }}
      >
        <th style={{ minWidth: "260px" }}>
          Item Name
          <br />
          Grade
          <br />
          Item Code
        </th>

        <th style={{ minWidth: "150px" }}>
          Received Qty
          <br />
          Rejected Qty
          <br />
          Approved Qty
        </th>

        <th>Net Amt</th>
        <th>CGST Amt</th>
        <th>SGST Amt</th>
        <th>IGST Amt</th>
        <th>Total Tax (₹)</th>
        <th>Total Amount (₹)</th>
        <th>TDS Amt</th>
        <th>Net Payable</th>
      </tr>
    </thead>

    <tbody>
      {tableData.length === 0 ? (
        <tr>
          <td colSpan={10} className="py-5 text-muted">
            No Data Found
          </td>
        </tr>
      ) : (
        tableData.map((row, index) => {
          const netAmt = Number(row.backendNetAmount || 0);

          const cgst = Number(row.cgst || 0);
          const sgst = Number(row.sgst || 0);
          const igst = Number(row.igst || 0);

          const totalTax = Number(row.backendTaxAmount || 0);

          const totalAmount = netAmt + totalTax;

          const tdsAmt = 0;

          const netPayable = totalAmount - tdsAmt;

          return (
            <tr key={index}>
              {/* ITEM DETAILS */}
              <td className="fw-medium">
                {row.itemName}
                <br />
                {row.grade}
                <br />
                {row.itemCode}
              </td>

              {/* QTY */}
              <td>
                <div>{Number(row.receivedQty || 0).toFixed(2)}</div>
                <div>{Number(row.damagedQty || 0).toFixed(2)}</div>
                <div>{Number(row.approvedQty || 0).toFixed(2)}</div>
              </td>

              {/* NET */}
              <td>
                {netAmt.toFixed(2)}
                <br />
                0.00
              </td>

              {/* CGST */}
              <td>
                {cgst.toFixed(2)}
                <br />
                0.00
              </td>

              {/* SGST */}
              <td>
                {sgst.toFixed(2)}
                <br />
                0.00
              </td>

              {/* IGST */}
              <td>
                {igst.toFixed(2)}
                <br />
                0.00
              </td>

              {/* TOTAL TAX */}
              <td>
                {totalTax.toFixed(2)}
                <br />
                0.00
              </td>

              {/* TOTAL */}
              <td>
                {totalAmount.toFixed(2)}
                <br />
                0.00
              </td>

              {/* TDS */}
              <td>{tdsAmt.toFixed(2)}</td>

              {/* NET PAYABLE */}
              <td>{netPayable.toFixed(2)}</td>
            </tr>
          );
        })
      )}
    </tbody>

    {/* ✅ FOOTER TOTALS */}
    <tfoot>
      <tr
        style={{
          background: "#f5f5f5",
          fontWeight: "700",
          fontSize: "16px"
        }}
      >
        <td colSpan={2}>TOTAL</td>

        {/* NET TOTAL */}
        <td>
          {tableData
            .reduce(
              (sum, item) =>
                sum + Number(item.backendNetAmount || 0),
              0
            )
            .toFixed(2)}
          <br />
          0.00
        </td>

        {/* CGST TOTAL */}
        <td>
          {tableData
            .reduce(
              (sum, item) =>
                sum + Number(item.cgst || 0),
              0
            )
            .toFixed(2)}
          <br />
          0.00
        </td>

        {/* SGST TOTAL */}
        <td>
          {tableData
            .reduce(
              (sum, item) =>
                sum + Number(item.sgst || 0),
              0
            )
            .toFixed(2)}
          <br />
          0.00
        </td>

        {/* IGST TOTAL */}
        <td>
          {tableData
            .reduce(
              (sum, item) =>
                sum + Number(item.igst || 0),
              0
            )
            .toFixed(2)}
          <br />
          0.00
        </td>

        {/* TOTAL TAX */}
        <td>
          {tableData
            .reduce(
              (sum, item) =>
                sum + Number(item.backendTaxAmount || 0),
              0
            )
            .toFixed(2)}
          <br />
          0.00
        </td>

        {/* GRAND TOTAL */}
        <td>
          {tableData
            .reduce(
              (sum, item) =>
                sum +
                Number(item.backendNetAmount || 0) +
                Number(item.backendTaxAmount || 0),
              0
            )
            .toFixed(2)}
          <br />
          0.00
        </td>

        {/* TDS */}
        <td>0.00</td>

        {/* NET PAYABLE */}
        <td>
          {tableData
            .reduce(
              (sum, item) =>
                sum +
                Number(item.backendNetAmount || 0) +
                Number(item.backendTaxAmount || 0),
              0
            )
            .toFixed(2)}
        </td>
      </tr>
    </tfoot>
  </table>
</div>

{/* ✅ APPROVE CHECKBOX */}

<div className="text-center mt-4">
  <label
    className="fw-bold"
    style={{ fontSize: "18px", cursor: "pointer" }}
  >
    <input
      type="checkbox"
      className="form-check-input me-2"
      checked={masterBillCheck === true}
      onChange={(e) =>
        handleMasterBillCheck(e.target.checked)
      }
      style={{
        width: "20px",
        height: "20px"
      }}
    />
    Approve This Bill
  </label>
</div>

{/* ✅ BUTTONS */}

<div className="d-flex justify-content-center gap-3 mt-4">
  <button
  type="button"
  onClick={handleSave}
  disabled={saveLoading}
  className="btn btn-primary px-5 py-2"
  style={{
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "200",
    minWidth: "140px"
  }}
>
  {saveLoading ? "Saving..." : "Save"}
</button>
  <button
    className="btn btn-secondary px-5 py-2"
    style={{
      borderRadius: "10px",
      fontSize: "15px",
      fontWeight: "200",
      minWidth: "140px"
    }}
  >
    Reset
  </button>
</div>
      </div>

      {/* </div> */}
    </div>
  );
};

export default CheckPayable;
