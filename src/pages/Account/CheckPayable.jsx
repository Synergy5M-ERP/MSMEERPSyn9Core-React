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
  const [enteredGrnNumber, setEnteredGrnNumber] = useState("");

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
    totalTaxAmount: 0,
    grandTotal: 0,
  });

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
    if (!formData.paymentDue) {
      toast.error("Payment Due date is required");
      return false;
    }

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
      const data = await safeJson(res);
      setGrnNumbers(data.data || []);
    } catch {
      toast.error("Unable to load GRN numbers");
    }
  };

// --- 1. Adjust fetchGRNTableData to ADD items from multiple GRNs ---

const fetchGRNTableData = async (grnId) => {
  if (!grnId) return;

  try {
    setLoading(true);
    const res = await fetch(`${API_ENDPOINTS.GetGRNDetails}?grnId=${grnId}`);
    const data = await safeJson(res);

    if (!data.success || !data.data?.items) {
      toast.warning("No items found for this GRN");
      return;
    }

    // Prepare new items with unique IDs to avoid collisions
    const newItems = data.data.items.map((item, index) => ({
      id: `${grnId}-${item.itemName}-${index}`,
      itemName: item.itemName || "",
      grade: item.grade || "",
      itemCode: item.itemCode || "",
      receivedQty: item.receivedQty || 0,
      approvedQty: item.acceptedQty || 0,
      damagedQty: item.rejectedQty || 0,
      receivedUnit: item.receivedUnit || "pcs",
      cgst: item.taxType === "CGST" ? item.taxRate || 0 : 0,
      sgst: item.taxType === "SGST" ? item.taxRate || 0 : 0,
      igst: item.taxType === "IGST" ? item.taxRate || 0 : 0,
      rate: item.rate || 0,
      taxType: item.taxType || "",
      billCheck: false,
      isSelected: false,
      totalTaxValue: 0,
      totalItemValue: 0,
      billItemValue: 0
    }));

    // Calculate totals for new items
    const itemsWithTotals = newItems.map((row) => {
      const receivedQty = parseFloat(row.receivedQty) || 0;
      const cgst = parseFloat(row.cgst) || 0;
      const sgst = parseFloat(row.sgst) || 0;
      const igst = parseFloat(row.igst) || 0;
      const rate = parseFloat(row.rate) || 0;
      return {
        ...row,
        totalTaxValue: (cgst + sgst + igst) * receivedQty,
        totalItemValue: receivedQty * rate,
        billItemValue: (receivedQty * rate) + ((cgst + sgst + igst) * receivedQty),
      };
    });

    setTableData(prevData => {
      // Merge avoiding duplicates by IDs
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

    // Also update formData header from last GRN loaded(optional)
    const header = data.data.header;
    setFormData(fd => ({
      ...fd,
      grnNumber: "", // Clear this if multiple loaded
      grnDate: "",
      poNumber: "",
      poDate: "",
      invoiceNumber: "",
      invoiceDate: "",
      vehicleNo: "",
      TransporterName: "",
      paymentDue: "",
      status: "",
      ...(
        header ? {
          grnNumber: header.grnNumber || "",
          grnDate: header.grN_Date ? header.grN_Date.split("T")[0] : "",
          poNumber: header.poNumber || "",
          poDate: header.poDate ? header.poDate.split("T")[0] : "",
          invoiceNumber: header.invoice_NO || "",
          invoiceDate: header.invoice_Date ? header.invoice_Date.split("T")[0] : "",
          vehicleNo: header.vehicle_No || "",
          TransporterName: header.TransporterName || "",
          paymentDue: header.paymentDue || "",
          status: "Received"
        } : {}
      )
    }));

    setEnteredGrnNumber(grnId);

  } catch (err) {
    toast.error("Unable to load GRN data");
  } finally {
    setLoading(false);
  }
};

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
    totalAmount: formData.totalAmount,
    totalTaxAmount: formData.totalTaxAmount,
    grandAmount: formData.grandTotal,
    Description: formData.sellerName || "Payable GRN", // ✅ Backend required
    Items: tableData.map(item => ({  // ✅ Capital 'I' for Items array
      Description: `${item.itemName} - ${item.grade}`, // ✅ Backend required
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
      totalTaxValue: parseFloat(item.totalTaxValue) || 0,
      totalItemValue: parseFloat(item.totalItemValue) || 0,
      billItemValue: parseFloat(item.billItemValue) || 0,
      billCheck: item.billCheck === true, // ✅ Saves checkbox state to DB
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
    totalTaxAmount: 0,
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

    if (name === "sellerName") {
      const selectedSupplier = suppliers.find(s => s.id === Number(value));
      setFormData(fd => ({
        ...fd,
        sellerName: selectedSupplier?.name || "",
        vendorId: Number(value) || 0
      }));
      loadGrnNumbers(selectedSupplier?.name || "");
      setTableData([]);
      setSelectedGrn("");
      setEnteredGrnNumber("");
      return;
    }

    if (name === "grnNumber") {
      const grnId = value;
      setSelectedGrn(grnId);
      setFormData(fd => ({ ...fd, grnNumber: grnId }));
      fetchGRNTableData(grnId);
      return;
    }

    setFormData(fd => ({ ...fd, [name]: value }));
  };

  // ✅ FIXED BILL CHECK HANDLER - 100% WORKING
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

      newData[index].totalTaxValue = (cgst + sgst + igst) * receivedQty;
      newData[index].totalItemValue = receivedQty * rate;
      newData[index].billItemValue = newData[index].totalItemValue + newData[index].totalTaxValue;

      updateGrandTotals(newData);
      return newData;
    });
  }, []);

  // ✅ UPDATE GRAND TOTALS
  const updateGrandTotals = (data) => {
    const selectedItems = data.filter(row => row.billCheck === true);
    const totalAmount = selectedItems.reduce((sum, row) => sum + (parseFloat(row.totalItemValue) || 0), 0);
    const totalTaxAmount = selectedItems.reduce((sum, row) => sum + (parseFloat(row.totalTaxValue) || 0), 0);
    const grandTotal = totalAmount + totalTaxAmount;

    setFormData(fd => ({
      ...fd,
      totalAmount,
      totalTaxAmount,
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
          totalTaxAmount: 0,
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
              <div className="col mb-3">
                <label className="form-label text-primary fw-semibold"> GRN Number</label>
                <select className="form-select" value={selectedGrn || ""} onChange={handleChange} name="grnNumber">
                  <option value="">Select GRN No.</option>
                  {grnNumbers.map((g) => (
                    <option key={g.id} value={String(g.id)} disabled={String(g.id) === enteredGrnNumber}>
                      {g.number || g.grnNumber || g.GRN_NO} {String(g.id) === enteredGrnNumber ? "(Selected)" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col mb-3">
                <label className="form-label text-primary fw-semibold"> GRN Date</label>
                <input type="date" name="grnDate" className="form-control" value={formData.grnDate} onChange={handleChange} required />
              </div>
              <div className="col mb-3">
                <label className="form-label text-primary fw-semibold"> Invoice No</label>
                <input type="text" name="invoiceNumber" className="form-control" value={formData.invoiceNumber} onChange={handleChange} required />
              </div>
              <div className="col mb-3">
                <label className="form-label text-primary fw-semibold">Invoice Date</label>
                <input type="date" name="invoiceDate" className="form-control" value={formData.invoiceDate} onChange={handleChange} required />
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

        

            {/* ✅ FIXED TABLE WITH WORKING CHECKBOXES */}
            <div className="table-responsive">
              <table className="table table-bordered align-middle mt-3">
                <thead>
                  <tr style={{ backgroundColor: "#f0f6ff" }}>
                    <th className="text-primary">Item Name</th>
                    <th className="text-primary">Grade</th>
                    <th className="text-primary">Item Code</th>
                    <th className="text-primary">Received Qty</th>
                    <th className="text-primary">Approved Qty</th>
                    <th className="text-primary">Damaged Qty</th>
                    <th className="text-primary">CGST</th>
                    <th className="text-primary">SGST</th>
                    <th className="text-primary">IGST</th>
                    <th className="text-primary">Total Tax</th>
                    <th className="text-primary">Item Value</th>
                    <th className="text-primary">Bill Check</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={13} className="text-center"><LoadingSpinner /></td></tr>
                  ) : tableData.length === 0 ? (
                    <tr><td colSpan={13} className="text-center text-muted">Select GRN to load items</td></tr>
                  ) : (
                    tableData.map((row, index) => (
                      <tr key={row.id} className={row.billCheck ? "table-success" : ""}>
                        <td>{row.itemName}</td>
                        <td>{row.grade}</td>
                        <td>{row.itemCode}</td>
                        <td>
                          <input 
                            type="number" 
                            className="form-control form-control-sm"
                            value={row.receivedQty || ""}
                            onChange={handleQuantityChange(index, 'receivedQty')}
                            min="0"
                            step="0.01"
                          />
                        </td>
                        <td>
                          <input 
                            type="number" 
                            className="form-control form-control-sm"
                            value={row.approvedQty || ""}
                            onChange={handleQuantityChange(index, 'approvedQty')}
                            min="0"
                            step="0.01"
                          />
                        </td>
                        <td>
                          <input 
                            type="number" 
                            className="form-control form-control-sm"
                            value={row.damagedQty || ""}
                            onChange={handleQuantityChange(index, 'damagedQty')}
                            min="0"
                            step="0.01"
                          />
                        </td>
                        <td>{(row.cgst || 0).toFixed(2)}%</td>
                        <td>{(row.sgst || 0).toFixed(2)}%</td>
                        <td>{(row.igst || 0).toFixed(2)}%</td>
                        <td className="fw-bold text-success">₹{(row.totalTaxValue || 0).toFixed(2)}</td>
                        <td className="fw-bold text-primary">₹{(row.totalItemValue || 0).toFixed(2)}</td>
                        <td style={{ textAlign: "center", width: "100px" }}>
                          <div className="form-check">
                            <input
                              type="checkbox"
                              id={`billCheck-${row.id}`}
                              key={`billCheck-${row.id}`}
                              checked={row.billCheck === true}
                              onChange={() => handleBillCheckChange(index)}
                              className="form-check-input"
                            />
                            <label 
                              htmlFor={`billCheck-${row.id}`}
                              className="form-check-label ms-1"
                              style={{ cursor: "pointer", fontSize: "14px" }}
                            >
                              Bill
                            </label>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>


            {/* BUTTONS */}
            <div className="d-flex justify-content-center gap-3 mt-4 mb-2">
              <button
                onClick={handleSave}
                disabled={saveLoading || tableData.filter(row => row.billCheck === true).length === 0}
                className="btn btn-primary btn-lg px-5 py-2 position-relative"
                style={{ fontWeight: 600, borderRadius: "8px", minWidth: "140px" }}
              >
                {saveLoading ? (
                  <>
                    <Loader2 className="animate-spin me-2" size={20} />
                    Saving...
                  </>
                ) : (
                  `Save `
                )}
              </button>
              <button
                className="btn btn-outline-secondary btn-lg px-5 py-2 fw-bold"
                style={{ borderRadius: "8px" }}
                onClick={handleCancel}
                disabled={saveLoading}
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
