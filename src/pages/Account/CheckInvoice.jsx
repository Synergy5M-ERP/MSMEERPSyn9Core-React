
import React, { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_ENDPOINTS } from "../../config/apiconfig";

const CheckInvoice = () => {
  const [selectedinvoice, setSelectedinvoice] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [invoiceNumbers, setinvoiceNumbers] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [enteredinvoiceNumber, setEnteredinvoiceNumber] = useState("");

  const [formData, setFormData] = useState({
    buyerId: "",
    buyerName: "",
    poNumber: "",
    poDate: "",
    invoiceNumber: "",
    invoiceDate: "",
    vehicleNo: "",
    TransporterName: "",
    paymentDueDate: "",
    status: "",
    totalAmount: 0,
    taxAmount: 0,
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
    if (!formData.buyerName.trim()) {
      toast.error("buyer Name is required");
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
    if (!formData.paymentDueDate) {
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
    const approved = parseFloat(row.approvedQty) || 0;
    const damaged = parseFloat(row.damagedQty) || 0;

    if (damaged > approved) {
      toast.error("Damaged quantity cannot exceed Approved quantity");
      return false;
    }
    if (approved < 0 || damaged < 0) {
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
      const res = await fetch(API_ENDPOINTS.Getbuyers);
      const data = await safeJson(res);
      const buyers = (data.data || []).map(b => ({
          buyerId: b.buyerId,
          buyerName: b.buyerName,
          buyerCode: b.buyerCode
        }));
      setSuppliers(buyers);
    } catch (err) {
      toast.error("Failed to load dropdowns");
    } finally {
      setLoading(false);
    }
  };

  // ✅ LOAD invoice NUMBERS
  const loadinvoiceNumbers = async (buyerCode) => {
    if (!buyerCode) {
      setinvoiceNumbers([]);
      return;
    }
    try {
      const res = await fetch(`${API_ENDPOINTS.GetinvoiceNumbersBybuyer}?buyerCode=${buyerCode}`);
      const data = await safeJson(res);
      setinvoiceNumbers(data.data || []);
    } catch {
      toast.error("Unable to load invoice numbers");
    }
  };

  // --- 1. Adjust fetchInvoiceTableData to ADD items from multiple invoices ---
const fetchInvoiceTableData = async (buyerId) => {
  if (!buyerId) return;

  try {
    setLoading(true);

    const res = await fetch(`${API_ENDPOINTS.GetInvoiceItemDetails}?buyerId=${buyerId}`);
    const result = await safeJson(res);

    if (!result?.success || !result.data) {
      toast.warning("No data found");
      return;
    }  

    /* ===== HEADER ===== */
    const header = result.data.header;
    if (header) {
      setFormData(fd => ({
        ...fd,
        invoiceDate: header.invoiceDate
          ? header.invoiceDate.split("T")[0]
          : "",
        paymentDueDate: header.paymentDueDate
          ? header.paymentDueDate.split("T")[0]
          : "",
        poNumber: header.poNumber || "",
        poDate: header.poDate
          ? header.poDate.split("T")[0]
          : "",
        vehicleNo: header.vehicleNo || "",
        TransporterName: header.transporterName || ""
      }));
    }

    /* ===== ITEMS ===== */
      
    //   console.log(item)
      
    //   // const receivedQty = Number(item.approvedQty) || 0;
    //   // const ratePerUnit =
    //   //   receivedQty > 0
    //   //     ? (Number(item.totalItemValue) || 0) / receivedQty
    //   //     : 0;

    //   // const taxAmount =
    //   //   (item.cgst + item.sgst + item.igst) * receivedQty;

    //    // console.log(taxAmount);
        

    //   return {
    //     id: `${buyerId}-${item.itemCode}-${index}`,
    //     itemName: item.itemName,
    //     itemCode: item.itemCode,
    //     grade: item.itemGrade,
    //     approvedQty: item.approvedQty || 0,
    //     damagedQty: item.rejectedQty || 0,
    //     receivedUnit: "pcs",
    //     cgst: item.cgst,
    //     sgst: item.sgst,
    //     igst: item.igst,
    //     ratePerUnit,
    //     billCheck: false,
    //     isSelected: false,
    //     taxAmount,
    //     totalItemValue: item.totalItemValue,
    //     //billItemValue: item.totalItemValue + taxAmount
    //   };
    // });

    const items = result.data.items.map((item, index) => {

  return {
    id: `${buyerId}-${item.itemCode}-${index}`,
    itemName: item.itemName,
    itemCode: item.itemCode,
    grade: item.itemGrade,
    approvedQty: Number(item.approvedQty) ?? 0, // ✅ now displays
    damagedQty: Number(item.damagedQty) ?? 0,             // ✅ now displays
    ratePerUnit: item.ratePerUnit,                                          // ✅ price
    cgst: Number(item.cgst) || 0,
    sgst: Number(item.sgst) || 0,
    igst: Number(item.igst) || 0,
    taxAmount: Number(item.taxAmount) || 0,                                 // ✅ total tax amount
    totalItemValue: item.totalItemValue || 0,

    billCheck: item.isChecked === true,
    isSelected: item.isChecked === true,
    receivedUnit: "pcs"
  };
});

    setTableData(items);
    updateGrandTotals(items);

  } catch (err) {
    console.error(err);
    toast.error("Unable to load invoice data");
  } finally {
    setLoading(false);
  }
};

const handleSave = async () => { 
  if (!validateForm()) return;

  const TOAST_ID = "saving-invoice";

  toast.loading("Saving invoice data...", {
    toastId: TOAST_ID,
    closeOnClick: false,
    draggable: false,
  });

  // ✅ Prepare payload safely
  const payload = {
    BuyerId: Number(formData.buyerId) || 0,
    InvoiceNo: formData.invoiceNumber || "",
    InvoiceDate: formData.invoiceDate || null,   // YYYY-MM-DD
    PONumber: formData.poNumber || "",
    PODate: formData.poDate || null,
    VehicleNo: formData.vehicleNo || "",
    TranspoterName: formData.TransporterName || "",
    PaymentDueDate: formData.paymentDueDate || null,
    CreatedBy: 1,
    UpdatedBy: 1,

    Items: tableData.map(item => ({
      ItemCode: item.itemCode || "",
      Grade: item.grade || "",
      ApprovedQty: Number(item.approvedQty) || 0,
      DamagedQty: Number(item.damagedQty) || 0,
      PricePerUnit: Number(item.ratePerUnit) || 0,
      CGST: Number(item.cgst) || 0,
      SGST: Number(item.sgst) || 0,
      IGST: Number(item.igst) || 0,
      TotalTax: Number(item.taxAmount) || 0,
      TotalAmount: Number(item.totalItemValue) || 0,
      CheckSale: item.billCheck === true,
      ApprovedSale: item.approvedSale || false  // ✅ send default if missing
    }))
  };

  console.log("💡 Payload to send:", payload);

  try {
    setSaveLoading(true);

    const response = await fetch(API_ENDPOINTS.AccountSale, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });    

    const result = await response.json();

    if (!response.ok) {
      toast.update(TOAST_ID, {
        render: result?.message || "Failed to save invoice",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
      console.error("❌ Save error:", result);
      return;
    }

    toast.update(TOAST_ID, {
      render: "✅ Invoice saved successfully!",
      type: "success",
      isLoading: false,
      autoClose: 2000,
    });

    setTimeout(() => {
      clearForm();
      toast.info("Form cleared", { autoClose: 2000 });
    }, 2200);

  } catch (error) {
    console.error("🌐 Network error:", error);
    toast.update(TOAST_ID, {
      render: "Network error! Please check your connection.",
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
      buyerId: "",
      buyerName: "",
      invoiceNumber: "",
      invoiceDate: "",
      poNumber: "",
      poDate: "",

      vehicleNo: "",
      TransporterName: "",
      paymentDueDate: "",
      status: "",
      totalAmount: 0,
      taxAmount: 0,
      grandTotal: 0,
    });
    setTableData([]);
    setSelectedinvoice("");
    setinvoiceNumbers([]);
    setEnteredinvoiceNumber("");
    setLoading(false);
    setSaveLoading(false);
  };

  // ✅ HANDLE FORM CHANGES
  const handleChange = (e) => {
    const { name, value } = e.target;


    if (name === "buyerId") {
      const selectedBuyer = suppliers.find(s => s.buyerId === Number(value));

      console.log(selectedBuyer)

     if (!selectedBuyer) {
      setFormData(fd => ({ ...fd, buyerId: "", buyerName: "" }));
      setinvoiceNumbers([]);
      setTableData([]);
      setSelectedinvoice("");
      setEnteredinvoiceNumber("");
      return;
    }

     setFormData(fd => ({
      ...fd,
      buyerId: selectedBuyer.buyerId,
      buyerName: selectedBuyer.buyerName
    }));

      loadinvoiceNumbers(selectedBuyer.buyerCode);
      setTableData([]);
      setSelectedinvoice("");
      setEnteredinvoiceNumber("");
      return;
    }

    if (name === "invoiceNumber") {
      const invoiceId = value;
      setSelectedinvoice(invoiceId);

      setFormData(fd => ({
        ...fd,
        invoiceNumber: invoiceId,   // ✅ FIX
        vehicleNo: fd.vehicleNo,
        TransporterName: fd.TransporterName,
        poNumber: fd.poNumber,
        poDate: fd.poDate,
        invoiceDate: fd.invoiceDate,
        paymentDueDate: fd.paymentDueDate
      }));
      if (formData.buyerId) {
        fetchInvoiceTableData(formData.buyerId);
      } else {
        toast.error("Select a buyer first");
      }
      return;
    }

    setFormData(fd => ({ ...fd, [name]: value }));
  };

  // ✅ FIXED BILL CHECK HANDLER - 100% WORKING
  const handleBillCheckChange = useCallback((index) => {
    //console.log("🔄 Toggling billCheck at index:", index);

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
      const ratePerUnit = parseFloat(row.ratePerUnit) || 0;

      newData[index].taxAmount = (cgst + sgst + igst) * receivedQty;
      newData[index].totalItemValue = receivedQty * ratePerUnit;
      newData[index].billItemValue = newData[index].totalItemValue + newData[index].taxAmount;

      updateGrandTotals(newData);
      return newData;
    });
  }, []);

  // ✅ UPDATE GRAND TOTALS
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
          buyerId: "",
          buyerName: "",
          invoiceNumber: "",
          invoiceDate: "",
          poNumber: "",
          poDate: "",
          invoiceNumber: "",
          invoiceDate: "",
          vehicleNo: "",
          TransporterName: "",
          paymentDueDate: "",
          status: "",
          totalAmount: 0,
          taxAmount: 0,
          grandTotal: 0,
        });
        setTableData([]);
        setSelectedinvoice("");
        setinvoiceNumbers([]);
        setEnteredinvoiceNumber("");
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
            <label className="form-label text-primary fw-semibold"> Buyer Name</label>
            <select className="form-select" value={formData.buyerId}
                    onChange={(e) => {
                      const buyerId = Number(e.target.value); // ✅ FIX
                      if (buyerId === formData.buyerId) return; // ✅ prevent re-call

                      const buyer = suppliers.find(b => b.buyerId === buyerId);

                      if (!buyer) return;

                      setFormData(prev => ({
                        ...prev,
                        buyerId: buyer.buyerId, // ✅ REQUIRED
                        buyerName: buyer.buyerName,
                        buyerCode: buyer.buyerCode
                      }));

                      loadinvoiceNumbers(buyer.buyerCode);
                      setTableData([]);
                      setSelectedinvoice("");
                      setEnteredinvoiceNumber("");
                    }}
                  >
                    <option value="">Select buyer</option>
                    {suppliers.map(b => (
                      <option key={b.buyerId} value={b.buyerId} data-buyercode={b.buyerCode}>
                        {b.buyerName}
                      </option>
                    ))}
                  </select>
          </div>
          <div className="col mb-3">
            <label className="form-label text-primary fw-semibold"> Invoice Number</label>
            <select className="form-select" value={formData.invoiceNumber} onChange={handleChange} name="invoiceNumber">
          
              <option value="">Select invoice No.</option>
                  {invoiceNumbers.map(inv => (
                    <option key={inv.invoiceNumber} value={inv.invoiceNumber}>
                      {inv.invoiceNumber}
                    </option>
                  ))}
            </select>
          </div>
          <div className="col mb-3">
            <label className="form-label text-primary fw-semibold"> Invoice Date</label>
            <input type="date" name="invoiceDate" className="form-control" value={formData.invoiceDate} onChange={handleChange} required readOnly/>
          </div>
          <div className="col mb-3">
            <label className="form-label text-primary fw-semibold"> PO Number</label>
            <input type="text" name="poNumber" className="form-control" value={formData.poNumber} onChange={handleChange} required readOnly/>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col mb-3">
            <label className="form-label text-primary fw-semibold"> PO Date</label>
            <input type="date" name="poDate" className="form-control" value={formData.poDate} onChange={handleChange} required readOnly/>
          </div>
          <div className="col mb-3">
            <label className="form-label text-primary fw-semibold"> Vehicle No</label>
            <input type="text" name="vehicleNo" className="form-control" value={formData.vehicleNo} onChange={handleChange} required readOnly/>
          </div>
          <div className="col mb-3">
            <label className="form-label text-primary fw-semibold"> Transporter Name</label>
            <input type="text" name="TransporterName" className="form-control" value={formData.TransporterName} onChange={handleChange} required readOnly/>
          </div>
          <div className="col mb-3">
            <label className="form-label text-primary fw-semibold"> Payment Due Date</label>
            <input type="date" name="paymentDueDate" className="form-control" value={formData.paymentDueDate} onChange={handleChange} required readOnly/>
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
                <th className="text-primary">Approved Qty</th>
                <th className="text-primary">Damaged Qty</th>
                <th className="text-primary">Price</th>
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
                <tr><td colSpan={13} className="text-center text-muted">Select invoice to load items</td></tr>
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
                    <td className="fw-bold text-success">₹{(row.ratePerUnit || 0).toFixed(2)}</td>
                    <td>{(row.cgst || 0).toFixed(2)}%</td>
                    <td>{(row.sgst || 0).toFixed(2)}%</td>
                    <td>{(row.igst || 0).toFixed(2)}%</td>
                    <td className="fw-bold text-success">₹{(row.taxAmount || 0).toFixed(2)}</td>
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

export default CheckInvoice;

