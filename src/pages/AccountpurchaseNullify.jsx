import React, { useEffect, useState } from "react";
import { Edit, Trash2, Plus, Save, X } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_ENDPOINTS } from "../config/apiconfig";


const unitOptions = [
  { value: "pcs", label: "Pieces" },
  { value: "kg", label: "Kilograms" },
];

const taxTypeOptions = [
  { value: "CGST", label: "CGST" },
  { value: "SGST", label: "SGST" },
  { value: "IGST", label: "IGST" },
];

const emptyItem = {
  itemName: "",
  qty: 0,
  unit: "",
  price: 0,
  taxType: "",
  cgst: 0,
  sgst: 0,
  igst: 0,
  totalAmount: 0,
  totalTaxAmount: 0,
  netAmount: 0,
};

export default function AccountpurchaseNullify() {
  const [vendorOptions, setVendorOptions] = useState([]);
  const [ponoOptions, setPonoOptions] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);

  const [vendor, setVendor] = useState("");
  const [pono, setPono] = useState("");
  const [creditNoteDate, setCreditNoteDate] = useState("");

  // Primary purchase item state
  const [primaryItem, setPrimaryItem] = useState(emptyItem);

  // Current credit note item input state
  const [creditNoteItem, setCreditNoteItem] = useState(emptyItem);

  // List of credit note items
  const [creditNoteItems, setCreditNoteItems] = useState([]);

  // Editing index for credit note item list
  const [editingIdx, setEditingIdx] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch dropdown data on load
  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    setIsLoading(true);
    try {
      const [vendorRes, ponoRes, itemRes] = await Promise.all([
        fetch(API_ENDPOINTS.Company),
        fetch(API_ENDPOINTS.Ledger),
        fetch(API_ENDPOINTS.BankDetails),
      ]);
      if (!vendorRes.ok || !ponoRes.ok || !itemRes.ok) {
        throw new Error("Failed to fetch dropdown data");
      }
      const vendorData = await vendorRes.json();
      const ponoData = await ponoRes.json();
      const itemData = await itemRes.json();

      setVendorOptions(vendorData);
      setPonoOptions(ponoData);
      setItemOptions(itemData);

      toast.success("Data loaded successfully");
    } catch (error) {
      console.error("Error fetching dropdown data", error);
      toast.error("Failed to load dropdown data. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  };

  // Add or update credit note item in list
  const handleAddCreditNoteItem = () => {
    if (!creditNoteItem.itemName) {
      toast.warn("Please select an item name");
      return;
    }
    if (!creditNoteItem.unit) {
      toast.warn("Please select a unit");
      return;
    }
    if (!creditNoteItem.qty || creditNoteItem.qty <= 0) {
      toast.warn("Please enter a valid quantity");
      return;
    }
    if (!creditNoteItem.price || creditNoteItem.price <= 0) {
      toast.warn("Please enter a valid price");
      return;
    }

    const computedTotal = creditNoteItem.qty * creditNoteItem.price;
    const totalTax =
      (Number(creditNoteItem.cgst) + Number(creditNoteItem.sgst) + Number(creditNoteItem.igst)) *
      creditNoteItem.qty;
    const net = computedTotal + totalTax;

    const newItem = {
      ...creditNoteItem,
      totalAmount: computedTotal,
      totalTaxAmount: totalTax,
      netAmount: net,
    };

    let updatedList = [...creditNoteItems];
    if (editingIdx !== null) {
      updatedList[editingIdx] = newItem;
      setEditingIdx(null);
      toast.success("Credit note item updated successfully");
    } else {
      updatedList.push(newItem);
      toast.success("Credit note item added successfully");
    }

    setCreditNoteItems(updatedList);
    setCreditNoteItem(emptyItem);
  };

  // Edit a credit note item
  const handleEdit = (idx) => {
    setCreditNoteItem(creditNoteItems[idx]);
    setEditingIdx(idx);
    toast.info("Editing item. Make changes and click Update.");
  };

  // Delete credit note item
  const handleDelete = (idx) => {
    setCreditNoteItems(creditNoteItems.filter((_, i) => i !== idx));
    toast.success("Credit note item deleted successfully");
  };

  // Clear full form and states
  const handleCancel = () => {
    setVendor("");
    setPono("");
    setCreditNoteDate("");
    setPrimaryItem(emptyItem);
    setCreditNoteItem(emptyItem);
    setCreditNoteItems([]);
    setEditingIdx(null);
    toast.info("Form cleared");
  };

  // Calculate totals including primary item and credit note items
  const primaryTotalAmount = primaryItem.qty * primaryItem.price;
  const primaryTotalTax =
    (Number(primaryItem.cgst) + Number(primaryItem.sgst) + Number(primaryItem.igst)) *
    primaryItem.qty;
  const primaryNetAmount = primaryTotalAmount + primaryTotalTax;

  const creditTotalAmount = creditNoteItems.reduce(
    (sum, it) => sum + Number(it.totalAmount || 0),
    0,
  );
  const creditTotalTax = creditNoteItems.reduce(
    (sum, it) => sum + Number(it.totalTaxAmount || 0),
    0,
  );
  const creditNetAmount = creditTotalAmount + creditTotalTax;

  const grandTotal = primaryNetAmount + creditNetAmount;

  // Save whole credit note data including primary item and credit note items
  const handleSave = async () => {
    if (!vendor) {
      toast.warn("Please select a vendor");
      return;
    }
    if (!pono) {
      toast.warn("Please select a purchase order number");
      return;
    }
    if (!creditNoteDate) {
      toast.warn("Please select purchase nullify date");
      return;
    }

    if (
      !primaryItem.itemName ||
      !primaryItem.unit ||
      primaryItem.qty <= 0 ||
      primaryItem.price <= 0
    ) {
      toast.warn("Please enter valid details for the primary purchase item");
      return;
    }

    if (creditNoteItems.length === 0) {
      toast.warn("Please add at least one credit note item");
      return;
    }

    // Prepare complete data payload
    const creditNoteData = {
      vendor,
      pono,
      creditNoteDate,
      primaryItem: {
        ...primaryItem,
        totalAmount: primaryTotalAmount,
        totalTaxAmount: primaryTotalTax,
        netAmount: primaryNetAmount,
      },
      creditNoteItems,
      creditTotalAmount,
      creditTotalTax,
      creditNetAmount,
      grandTotal,
    };

    setIsSaving(true);
    try {
      const response = await fetch(API_ENDPOINTS.CreditNote, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creditNoteData),
      });

      if (!response.ok) {
        throw new Error("Failed to save purchase nullify");
      }

      await response.json();
      toast.success("Purchase nullify saved successfully!");
      setTimeout(() => {
        handleCancel();
      }, 1500);
    } catch (error) {
      console.error("Error saving purchase nullify:", error);
      toast.error("Failed to save purchase nullify. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ maxHeight: 400, overflowY: "auto" ,fontFamily: "'Inter', sans-serif", padding: 20 }} className="custom-scrollbar">
      <ToastContainer position="top-right" autoClose={4000} />

      {/* Vendor & Purchase Order Selection */}
     
       <div className="row mb-3">
          <div className="col-3">
            <label style={{ display: "block", marginBottom: 6 }}>
              Vendor Name <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <select
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              disabled={isLoading}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "2px solid #e2e8f0",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              <option value="">Select Vendor</option>
              {vendorOptions.map((o) => (
                <option key={o.id} value={o.name}>
                  {o.name}
                </option>
              ))}    <option value="vender1">vendor</option>
            </select>
          </div>

          <div className="col-3">
            <label style={{ display: "block", marginBottom: 6 }}>
              Purchase Order No <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <select
              value={pono}
              onChange={(e) => setPono(e.target.value)}
              disabled={isLoading}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "2px solid #e2e8f0",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              <option value="">Select PO Number</option>
              {ponoOptions.map((o) => (
                <option key={o.id} value={o.number || o.name}>
                  {o.number || o.name}
                </option>
              ))}    <option value="vender1">vendor</option>
            </select>
          </div>

          <div className="col-3">
            <label style={{ display: "block", marginBottom: 6 }}>
              Purchase Nullify Date <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="date"
              value={creditNoteDate}
              onChange={(e) => setCreditNoteDate(e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "2px solid #e2e8f0",
                fontSize: 16,
              }}
            />
          </div>
          <div className="col-3 ">
            <label>
              Item Name <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <select
              value={primaryItem.itemName}
              onChange={(e) => setPrimaryItem((it) => ({ ...it, itemName: e.target.value }))}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "2px solid #e2e8f0",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              <option value="">Select Item</option>
              {itemOptions.map((o) => (
                <option key={o.id} value={o.name}>
                  {o.name}
                </option>
              ))}<option value="vender1">vendor</option>
            </select>
          </div>
        </div>
   <div className="row mb-2"> 
     <div className="col">
            <label>
              Quantity <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="number"
              min={0}
              value={primaryItem.qty}
              onChange={(e) =>
                setPrimaryItem((it) => ({ ...it, qty: Number(e.target.value) }))
              }
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "2px solid #e2e8f0",
                fontSize: 16,
                textAlign: "right",
              }}
            />
          </div>

          <div className="col">
            <label>
              Unit <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <select
              value={primaryItem.unit}
              onChange={(e) => setPrimaryItem((it) => ({ ...it, unit: e.target.value }))}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "2px solid #e2e8f0",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              <option value="">Select Unit</option>
              {unitOptions.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}<option value="vender1">vendor</option>
            </select>
          </div>

          <div className="col">
            <label>
              Price <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={primaryItem.price}
              onChange={(e) =>
                setPrimaryItem((it) => ({ ...it, price: Number(e.target.value) }))
              }
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "2px solid #e2e8f0",
                fontSize: 16,
                textAlign: "right",
              }}
            />
          </div>

          <div className="col">
            <label>Total Amount</label>
            <input
              type="number"
              value={
                primaryItem.qty && primaryItem.price
                  ? (primaryItem.qty * primaryItem.price).toFixed(2)
                  : ""
              }
              readOnly
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "2px solid #e2e8f0",
                backgroundColor: "#f1f5f9",
                color: "#475569",
                fontSize: 16,
                textAlign: "right",
              }}
            />
          </div>

          <div className="col">
            <label>Tax Type</label>
            <select
              value={primaryItem.taxType}
              onChange={(e) => setPrimaryItem((it) => ({ ...it, taxType: e.target.value }))}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "2px solid #e2e8f0",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              <option value="">Select Tax Type</option>
              {taxTypeOptions.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}<option value="vender1">vendor</option>
            </select>
          </div>
          </div>

      {/* Primary Purchase Item Details */}
     <div className="row mb-2 ">
    <div className="col">
            <label>CGST (%)</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={primaryItem.cgst}
              onChange={(e) =>
                setPrimaryItem((it) => ({ ...it, cgst: Number(e.target.value) }))
              }
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "2px solid #e2e8f0",
                fontSize: 16,
                textAlign: "right",
              }}
            />
          </div>

          <div className="col" >
            <label>SGST (%)</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={primaryItem.sgst}
              onChange={(e) =>
                setPrimaryItem((it) => ({ ...it, sgst: Number(e.target.value) }))
              }
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "2px solid #e2e8f0",
                fontSize: 16,
                textAlign: "right",
              }}
            />
          </div>

          <div className="col">
            <label>IGST (%)</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={primaryItem.igst}
              onChange={(e) =>
                setPrimaryItem((it) => ({ ...it, igst: Number(e.target.value) }))
              }
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "2px solid #e2e8f0",
                fontSize: 16,
                textAlign: "right",
              }}
            />
          </div>

          <div className="col">
            <label>Net Amount</label>
            <input
              type="number"
              value={
                primaryItem.qty && primaryItem.price
                  ? (
                      primaryItem.qty * primaryItem.price +
                      (primaryItem.cgst + primaryItem.sgst + primaryItem.igst) * primaryItem.qty
                    ).toFixed(2)
                  : ""
              }
              readOnly
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "2px solid #e2e8f0",
                backgroundColor: "#f1f5f9",
                color: "#475569",
                fontSize: 16,
                textAlign: "right",
                fontWeight: 600,
              }}
            />
          </div>

          <div className="col">
            <label>Total Tax Amount</label>
            <input
              type="number"
              value={
                primaryItem.qty
                  ? ((primaryItem.cgst + primaryItem.sgst + primaryItem.igst) * primaryItem.qty).toFixed(2)
                  : ""
              }
              readOnly
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "2px solid #e2e8f0",
                backgroundColor: "#f1f5f9",
                color: "#475569",
                fontSize: 16,
                textAlign: "right",
                fontWeight: 600,
              }}
            />
          </div>

     </div>
      {/* Credit Note Item Input */}
      <section >
        <h2 style={{ color: "#0066cc", marginBottom: 16 }}>Add Credit Note Item</h2>

        <div
      className="row"
        >
          <div className="col">
            <label>
              Item Name <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <select
              value={creditNoteItem.itemName}
              onChange={(e) =>
                setCreditNoteItem((it) => ({ ...it, itemName: e.target.value }))
              }
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "2px solid #e2e8f0",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              <option value="">Select Item</option>
              {itemOptions.map((o) => (
                <option key={o.id} value={o.name}>
                  {o.name}
                </option>
              ))}<option value="vender1">vendor</option>
            </select>
          </div>

          <div className="col">
            <label>
              Quantity <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="number"
              min={0}
              value={creditNoteItem.qty}
              onChange={(e) =>
                setCreditNoteItem((it) => ({ ...it, qty: Number(e.target.value) }))
              }
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "2px solid #e2e8f0",
                fontSize: 16,
                textAlign: "right",
              }}
            />
          </div>

          <div className="col">
            <label>
              Unit <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <select
              value={creditNoteItem.unit}
              onChange={(e) =>
                setCreditNoteItem((it) => ({ ...it, unit: e.target.value }))
              }
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "2px solid #e2e8f0",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              <option value="">Select Unit</option>
              {unitOptions.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}<option value="vender1">vendor</option>
            </select>
          </div>

          <div className="col">
            <label>
              Price <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={creditNoteItem.price}
              onChange={(e) =>
                setCreditNoteItem((it) => ({ ...it, price: Number(e.target.value) }))
              }
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "2px solid #e2e8f0",
                fontSize: 16,
                textAlign: "right",
              }}
            />
          </div>

          <div className="col">
            <label>Total Amount</label>
            <input
              type="number"
              value={
                creditNoteItem.qty && creditNoteItem.price
                  ? (creditNoteItem.qty * creditNoteItem.price).toFixed(2)
                  : ""
              }
              readOnly
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "2px solid #e2e8f0",
                backgroundColor: "#f1f5f9",
                color: "#475569",
                fontSize: 16,
                textAlign: "right",
              }}
            />
          </div>
</div>
         <div className="row">
 <div className="col">
            <label>Tax Type</label>
            <select
              value={creditNoteItem.taxType}
              onChange={(e) =>
                setCreditNoteItem((it) => ({ ...it, taxType: e.target.value }))
              }
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "2px solid #e2e8f0",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              <option value="">Select Tax Type</option>
              {taxTypeOptions.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}<option value="vender1">vendor</option>
            </select>
          </div>

          <div className="col">
            <label>CGST (%)</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={creditNoteItem.cgst}
              onChange={(e) =>
                setCreditNoteItem((it) => ({ ...it, cgst: Number(e.target.value) }))
              }
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "2px solid #e2e8f0",
                fontSize: 16,
                textAlign: "right",
              }}
            />
          </div>

          <div className="col">
            <label>SGST (%)</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={creditNoteItem.sgst}
              onChange={(e) =>
                setCreditNoteItem((it) => ({ ...it, sgst: Number(e.target.value) }))
              }
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "2px solid #e2e8f0",
                fontSize: 16,
                textAlign: "right",
              }}
            />
          </div>

          <div className="col">
            <label>IGST (%)</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={creditNoteItem.igst}
              onChange={(e) =>
                setCreditNoteItem((it) => ({ ...it, igst: Number(e.target.value) }))
              }
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "2px solid #e2e8f0",
                fontSize: 16,
                textAlign: "right",
              }}
            />
          </div>

          

          <div className="col">
            <label>Total Tax Amount</label>
            <input
              type="number"
              value={
                creditNoteItem.qty
                  ? (
                      (creditNoteItem.cgst +
                        creditNoteItem.sgst +
                        creditNoteItem.igst) *
                      creditNoteItem.qty
                    ).toFixed(2)
                  : ""
              }
              readOnly
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "2px solid #e2e8f0",
                backgroundColor: "#f1f5f9",
                color: "#475569",
                fontSize: 16,
                textAlign: "right",
                fontWeight: 600,
              }}
            />
          </div>

         </div>
     

        <button
          onClick={handleAddCreditNoteItem}
          style={{
            marginTop: 20,
            padding: "12px 28px",
            borderRadius: 10,
            border: "none",
            background: editingIdx !== null ? "#f59e0b" : "#667eea",
            color: "white",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            marginBottom:20
          }}
        >
          {editingIdx === null ? (
            <>
              <Plus size={18} /> Add 
            </>
          ) : (
            <>
              <Edit size={18} /> Update 
            </>
          )}
        </button>
      </section>

      {/* Credit Note Items Table */}
      {creditNoteItems.length > 0 ? (
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ color: "#0066cc", marginBottom: 16 }}>Credit Note Items</h2>
          <div
            style={{
              overflowX: "auto",
              borderRadius: 16,
              border: "1px solid #e2e8f0",maxHeight: 200, overflowY: "auto" 
            }}     className="custom-scrollbar"
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 14
              }}
          
            >
              <thead>
                <tr
                  style={{
                    background: "#667eea",
                    color: "white",
                    fontWeight: 600,
                  }}
                >
                  <th style={{ padding: "12px" }}>Item</th>
                  <th style={{ padding: "12px", textAlign: "center" }}>Qty</th>
                  <th style={{ padding: "12px", textAlign: "center" }}>Unit</th>
                  <th style={{ padding: "12px", textAlign: "right" }}>Price</th>
                  <th style={{ padding: "12px", textAlign: "right" }}>Total</th>
                  <th style={{ padding: "12px", textAlign: "center" }}>CGST %</th>
                  <th style={{ padding: "12px", textAlign: "center" }}>SGST %</th>
                  <th style={{ padding: "12px", textAlign: "center" }}>IGST %</th>
                  <th style={{ padding: "12px", textAlign: "right" }}>Net Amount</th>
                  <th style={{ padding: "12px", textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {creditNoteItems.map((it, idx) => (
                  <tr
                    key={idx}
                    style={{
                      backgroundColor: idx % 2 === 0 ? "white" : "#f8fafc",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? "white" : "#f8fafc")
                    }
                  >
                    <td style={{ padding: "12px", fontWeight: 500 }}>{it.itemName}</td>
                    <td style={{ padding: "12px", textAlign: "center" }}>{it.qty}</td>
                    <td style={{ padding: "12px", textAlign: "center" }}>{it.unit}</td>
                    <td style={{ padding: "12px", textAlign: "right" }}>₹{Number(it.price).toFixed(2)}</td>
                    <td style={{ padding: "12px", textAlign: "right" }}>₹{it.totalAmount.toFixed(2)}</td>
                    <td style={{ padding: "12px", textAlign: "center" }}>{it.cgst}%</td>
                    <td style={{ padding: "12px", textAlign: "center" }}>{it.sgst}%</td>
                    <td style={{ padding: "12px", textAlign: "center" }}>{it.igst}%</td>
                    <td style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>₹{it.netAmount.toFixed(2)}</td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <button
                        onClick={() => handleEdit(idx)}
                        style={{ marginRight: 8, cursor: "pointer" }}
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(idx)}
                        style={{ cursor: "pointer" }}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <section
          style={{
            padding: 40,
            textAlign: "center",
            border: "2px dashed #cbd5e1",
            borderRadius: 16,
            marginBottom: 32,
          }}
        >
          <p style={{ fontStyle: "italic", color: "#64748b", fontSize: 16 }}>
            No credit note items added yet. Add items to create the Purchase Nullify.
          </p>
        </section>
      )}

      {/* Summary Section */}
      <section
        style={{
        //   background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          padding: 24,
          borderRadius: 16,
          marginBottom: 36,
        //   border: "2px solid #e2e8f0",
          maxWidth: 320,
          marginLeft: "auto",
          marginRight: "auto",
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ color: "#64748b", fontWeight: 500 }}>Primary Item Net Amount:</span>
          <span style={{ fontWeight: 600, color: "#1e293b" }}>₹{primaryNetAmount.toFixed(2)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ color: "#64748b", fontWeight: 500 }}>Credit Note Total Amount:</span>
          <span style={{ fontWeight: 600, color: "#1e293b" }}>₹{creditTotalAmount.toFixed(2)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ color: "#64748b", fontWeight: 500 }}>Credit Note Total Tax:</span>
          <span style={{ fontWeight: 600, color: "#1e293b" }}>₹{creditTotalTax.toFixed(2)}</span>
        </div>
        <hr style={{ borderColor: "#cbd5e1", margin: "6px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18 }}>
          <span style={{ color: "#475569", fontWeight: 700 }}>Grand Total:</span>
          <span style={{ fontWeight: 700, color: "#667eea", fontSize: 22 }}>₹{grandTotal.toFixed(2)}</span>
        </div>
      </section>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: 16, justifyContent: "flex-end", flexWrap: "wrap" }}>
        <button
          onClick={handleCancel}
          disabled={isSaving}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "14px 32px",
            borderRadius: 12,
            border: "2px solid #e2e8f0",
            background: "white",
            color: "#64748b",
            fontWeight: 600,
            fontSize: 15,
            cursor: isSaving ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            opacity: isSaving ? 0.5 : 1,
          }}
          onMouseOver={(e) => {
            if (!isSaving) {
              e.currentTarget.style.borderColor = "#cbd5e1";
              e.currentTarget.style.background = "#f8fafc";
            }
          }}
          onMouseOut={(e) => {
            if (!isSaving) {
              e.currentTarget.style.borderColor = "#e2e8f0";
              e.currentTarget.style.background = "white";
            }
          }}
        >
          <X size={18} />
          Cancel
        </button>

        <button
          onClick={handleSave}
          disabled={isSaving || creditNoteItems.length === 0}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "14px 32px",
            borderRadius: 12,
            border: "none",
            background:
              isSaving || creditNoteItems.length === 0
                ? "#cbd5e1"
                : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "white",
            fontWeight: 600,
            fontSize: 15,
            cursor: isSaving || creditNoteItems.length === 0 ? "not-allowed" : "pointer",
            boxShadow:
              isSaving || creditNoteItems.length === 0
                ? "none"
                : "0 4px 15px rgba(16, 185, 129, 0.4)",
            transition: "all 0.3s",
          }}
          onMouseOver={(e) => {
            if (!isSaving && creditNoteItems.length > 0) {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(16, 185, 129, 0.5)";
            }
          }}
          onMouseOut={(e) => {
            if (!isSaving && creditNoteItems.length > 0) {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(16, 185, 129, 0.4)";
            }
          }}
        >
          {isSaving ? (
            <>
              <div
                style={{
                  width: 18,
                  height: 18,
                  border: "3px solid white",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              ></div>
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              Save
            </>
          )}
        </button>
      </div>
    </div>
  );
}
