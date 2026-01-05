

import React, { useEffect, useState } from "react";
import { Edit, Trash2, Plus, Save, X } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/apiconfig";
import Pagination from "../../components/Pagination"; // Adjust path as needed

const unitOptions = [
  { value: "pcs", label: "Pieces" },
  { value: "kg", label: "Kilograms" },
];

const taxTypeOptions = [
  { value: "CGST", label: "CGST" },
  { value: "SGST", label: "SGST" },
  { value: "IGST", label: "IGST" },
];

const categoryOptions = [
  { value: "seller", label: "Seller" },
  { value: "buyer", label: "Buyer" },
];

const emptyItem = {
  itemName: "",
  qty: 0,
  unit: "",
  price: 0,
  totalAmount: 0,
  taxType: "",
  cgst: 0,
  sgst: 0,
  igst: 0,
  netAmount: 0,
  totalTaxAmount: 0,
};

export default function CreditNote() {
  const [vendorOptions, setVendorOptions] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [invoiceOptions, setInvoiceOptions] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);

  const [category, setCategory] = useState("");
  const [vendor, setVendor] = useState("");
  const [invoice, setInvoice] = useState("");
  const [creditNoteNo, setCreditNoteNo] = useState("");
  const [creditNoteDate, setCreditNoteDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentDueDate, setPaymentDueDate] =useState("")

  const [item, setItem] = useState(emptyItem);
  const [items, setItems] = useState([]);
  const [editingIdx, setEditingIdx] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Reset pagination when items change
  useEffect(() => {
    setCurrentPage(1);
  }, [items]);

  useEffect(() => {
    fetchDropdownData();
  }, []);

  useEffect(() => {
    setVendor("");
  }, [category]);

  const fetchDropdownData = async () => {
    setIsLoading(true);
    try {
      const [vendorRes, customerRes, invoiceRes, itemRes] = await Promise.all([
        axios.get(API_ENDPOINTS.Vendors),
        axios.get(API_ENDPOINTS.Getbuyers),
        axios.get(API_ENDPOINTS.Ledger),
        axios.get(API_ENDPOINTS.BankDetails),
      ]);

      setVendorOptions(vendorRes.data || []);
      setCustomerOptions(customerRes.data || [])
      setInvoiceOptions(invoiceRes.data || []);
      setItemOptions(itemRes.data || []);

      toast.success("Data loaded successfully");
    } catch (error) {
      console.error("Error fetching dropdown data", error);
      toast.error("Failed to load dropdown data. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = () => {
    if (!item.itemName) {
      toast.warn("Please select an item name");
      return;
    }
    if (!item.unit) {
      toast.warn("Please select a unit");
      return;
    }
    if (!item.qty || item.qty <= 0) {
      toast.warn("Please enter a valid quantity");
      return;
    }
    if (!item.price || item.price <= 0) {
      toast.warn("Please enter a valid price");
      return;
    }

    const computedTotal = item.qty * item.price;
    const totalTax =
      (Number(item.cgst) + Number(item.sgst) + Number(item.igst)) * item.qty;
    const net = computedTotal + totalTax;

    const newItem = {
      ...item,
      totalAmount: computedTotal,
      totalTaxAmount: totalTax,
      netAmount: net,
    };

    let updatedList = [...items];
    if (editingIdx !== null) {
      updatedList[editingIdx] = newItem;
      setEditingIdx(null);
      toast.success("Item updated successfully");
    } else {
      updatedList.push(newItem);
      toast.success("Item added successfully");
    }

    setItems(updatedList);
    setItem(emptyItem);
  };

  const handleEdit = (idx) => {
    setItem(items[idx]);
    setEditingIdx(idx);
    toast.info("Editing item. Make changes and click Update.");
  };

  const handleDelete = (idx) => {
    setItems(items.filter((_, i) => i !== idx));
    toast.success("Item deleted successfully");
  };

  const handleCancel = () => {
    setCategory("");
    setVendor("");
    setInvoice("");
    setCreditNoteNo("");
    setCreditNoteDate(new Date().toISOString().split("T")[0]);
    setItems([]);
    setItem(emptyItem);
    setEditingIdx(null);
    setCurrentPage(1);
    toast.info("Form cleared");
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentItems = items.slice(indexOfFirstRecord, indexOfLastRecord);

  const totalAmount = items.reduce((sum, it) => sum + Number(it.totalAmount || 0), 0);
  const totalTaxAmount = items.reduce((sum, it) => sum + Number(it.totalTaxAmount || 0), 0);
  const grandTotal = totalAmount + totalTaxAmount;

  const handleSave = async () => {
    if (!category) {
      toast.warn("Please select a Category");
      return;
    }
    if (!vendor) {
      toast.warn("Please select a vendor");
      return;
    }
    if (!invoice) {
      toast.warn("Please select an invoice");
      return;
    }
    if (!creditNoteNo) {
      toast.warn("Please enter credit note number");
      return;
    }
    if (!creditNoteDate) {
      toast.warn("Please select credit note date");
      return;
    }
    if (items.length === 0) {
      toast.warn("Please add at least one item");
      return;
    }

    const creditNoteData = {
      category,
      vendor,
      invoice,
      creditNoteNo,
      creditNoteDate,
      items,
      totalAmount,
      totalTaxAmount,
      grandTotal,
    };

    setIsSaving(true);
    try {
      const response = await axios.post(API_ENDPOINTS.CreditNote, creditNoteData);

      toast.success("Credit note saved successfully!");
      setTimeout(() => {
        handleCancel();
      }, 1500);
    } catch (error) {
      console.error("Error saving credit note:", error);
      toast.error(
        `Failed to save credit note: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div
        className="custom-scrollbar"
        style={{ maxHeight: 400, overflowY: "auto" }}
      >
        <div
          style={{
            padding: 28,
            borderRadius: 16,
            marginBottom: 32,
            border: "2px solid #e2e8f0",
          }}
        >
          {/* Header Form Fields - ALL ORIGINAL FIELDS */}
          <div className="row">
            <div className="col">
                <label style={{ textAlign: "left", display: "block",  color: "#0066cc",
                  }}>
                  Category <span style={{ color: "#ef4444" }}>*</span>
                </label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: "100%", padding: "5px 6px", borderRadius: 10, border: "2px solid #e2e8f0",                                                         
                    fontSize: 15, background: "white",  cursor: "pointer"                                                      
                  }}
                  className="form-select"
                >
                  <option value="">Select Category</option>
                  {categoryOptions.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

            <div className="col">
              <label style={{ textAlign: "left", display: "block", color: "#0066cc", fontSize: "14px",                                                                 
                  fontWeight: "600", marginBottom: "8px",}}>             
                {category === "buyer" ? "Customer Name" : "Vendor Name"} <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <select
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                disabled={!category || isLoading}
                style={{width: "100%", padding: "5px 6px", borderRadius: 10, border: "2px solid #e2e8f0", fontSize: 15,                                                                                   
                  background: "white", cursor: "pointer", transition: "all 0.2s", marginBottom: "9px",                                                 
                }}
                className="form-select"
                >
              
                <option value="">
                  {category ? category === "buyer" ? "Select Customer" : "Select Vendor" : "Select Category First"}</option>
                    {category === "seller" &&
                      vendorOptions.map((o) => (
                        <option key={o.id} value={o.id}> {o.name} </option>                                            
                      ))}

                    {category === "buyer" &&
                      customerOptions.map((o) => (
                        <option key={o.id} value={o.id}>{o.name} </option>                                             
                ))}
              </select>
            </div>

            <div className="col">
              <label
                style={{
                  textAlign: "left",
                  display: "block",
                  color: "#0066cc",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Invoice Number <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <select
                value={invoice}
                onChange={(e) => setInvoice(e.target.value)}
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "5px 6px",
                  borderRadius: 10,
                  border: "2px solid #e2e8f0",
                  fontSize: 15,
                  background: "white",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                className="form-select"
              >
                <option value="">Select Invoice</option>
                {invoiceOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.number || o.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col">
              <label
                style={{
                  textAlign: "left",
                  display: "block",
                  color: "#0066cc",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Credit Note No <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="text"
                value={creditNoteNo}
                onChange={(e) => setCreditNoteNo(e.target.value)}
                placeholder="CN-001"
                style={{
                  width: "100%",
                  padding: "5px 6px",
                  borderRadius: 10,
                  border: "2px solid #e2e8f0",
                  fontSize: 15,
                  transition: "all 0.2s",
                }}
                className="form-text"
              />
            </div>

            <div className="col">
              <label
                style={{
                  textAlign: "left",
                  display: "block",
                  color: "#0066cc",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Credit Note Date <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="date"
                value={creditNoteDate}
                onChange={(e) => setCreditNoteDate(e.target.value)}
                style={{
                  width: "100%",
                  padding: "5px 6px",
                  borderRadius: 10,
                  border: "2px solid #e2e8f0",
                  fontSize: 15,
                  transition: "all 0.2s",
                }}
                className="form-text"
              />
            </div>

            <div className="col">
              <label
                style={{
                  textAlign: "left",
                  display: "block",
                  color: "#0066cc",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Payment Due Date <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="date"
                value={paymentDueDate}
                onChange={(e) => setPaymentDueDate(e.target.value)}
                style={{
                  width: "100%",
                  padding: "5px 6px",
                  borderRadius: 10,
                  border: "2px solid #e2e8f0",
                  fontSize: 15,
                  transition: "all 0.2s",
                }}
                className="form-select"
              />
            </div>
          </div>

          {/* Item Form Fields - ALL ORIGINAL FIELDS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 16,
              marginBottom: 20,
            }}
          >
            <div>
              <label
                style={{
                  textAlign: "left",
                  display: "block",
                  color: "#0066cc",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "10px",
                }}
              >
                Item Name <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <select
                value={item.itemName}
                onChange={(e) => setItem((it) => ({ ...it, itemName: e.target.value }))}
                style={{
                  width: "100%",
                  padding: "5px 6px",
                  borderRadius: 8,
                  border: "2px solid #e2e8f0",
                  fontSize: 14,
                  background: "white",
                  cursor: "pointer",
                }}
                className="form-select"
              >
                <option value="">Select Item </option>
                {itemOptions.map((o) => (
                  <option key={o.id} value={o.name}>
                    {o.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  textAlign: "left",
                  display: "block",
                  color: "#0066cc",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Quantity <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="number"
                min={0}
                value={item.qty}
                onChange={(e) => setItem((it) => ({ ...it, qty: e.target.value }))}
                placeholder="0"
                style={{
                  width: "100%",
                  padding: "5px 6px",
                  borderRadius: 8,
                  border: "2px solid #e2e8f0",
                  fontSize: 14,
                  textAlign: "right",
                }}
                className="form-text"
              />
            </div>

            <div>
              <label
                style={{
                  textAlign: "left",
                  display: "block",
                  color: "#0066cc",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Unit <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <select
                value={item.unit}
                onChange={(e) => setItem((it) => ({ ...it, unit: e.target.value }))}
                style={{
                  width: "100%",
                  padding: "5px 6px",
                  borderRadius: 8,
                  border: "2px solid #e2e8f0",
                  fontSize: 14,
                  background: "white",
                  cursor: "pointer",
                }}
                className="form-select"
              >
                <option value="">Select Unit</option>
                {unitOptions.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  textAlign: "left",
                  display: "block",
                  color: "#0066cc",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Price <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={item.price}
                onChange={(e) => setItem((it) => ({ ...it, price: e.target.value }))}
                placeholder="0.00"
                style={{
                  width: "100%",
                  padding: "5px 6px",
                  borderRadius: 8,
                  border: "2px solid #e2e8f0",
                  fontSize: 14,
                  textAlign: "right",
                }}
                className="form-text"
              />
            </div>

            <div>
              <label
                style={{
                  textAlign: "left",
                  display: "block",
                  color: "#0066cc",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Total Amount
              </label>
              <input
                type="number"
                value={item.qty && item.price ? (item.qty * item.price).toFixed(2) : ""}
                readOnly
                style={{
                  width: "100%",
                  padding: "5px 6px",
                  borderRadius: 8,
                  border: "2px solid #e2e8f0",
                  fontSize: 14,
                  background: "#f1f5f9",
                  color: "#475569",
                  textAlign: "right",
                }}
                className="form-text"
              />
            </div>
          </div>

          {/* Tax Form Fields - ALL ORIGINAL FIELDS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: 16,
              marginBottom: 20,
            }}
          >
            <div>
              <label
                style={{
                  textAlign: "left",
                  display: "block",
                  color: "#0066cc",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Tax Type
              </label>
              <select
                value={item.taxType}
                onChange={(e) => setItem((it) => ({ ...it, taxType: e.target.value }))}
                style={{
                  width: "100%",
                  padding: "5px 6px",
                  borderRadius: 8,
                  border: "2px solid #e2e8f0",
                  fontSize: 14,
                  background: "white",
                  cursor: "pointer",
                }}
                className="form-select"
              >
                <option value="">Select</option>
                {taxTypeOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  textAlign: "left",
                  display: "block",
                  color: "#0066cc",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                CGST (%)
              </label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={item.cgst}
                onChange={(e) => setItem((it) => ({ ...it, cgst: e.target.value || 0 }))}
                placeholder="0"
                style={{
                  width: "100%",
                  padding: "5px 6px",
                  borderRadius: 8,
                  border: "2px solid #e2e8f0",
                  fontSize: 14,
                  textAlign: "right",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  textAlign: "left",
                  display: "block",
                  color: "#0066cc",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                SGST (%)
              </label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={item.sgst}
                onChange={(e) => setItem((it) => ({ ...it, sgst: e.target.value || 0 }))}
                placeholder="0"
                style={{
                  width: "100%",
                  padding: "5px 6px",
                  borderRadius: 8,
                  border: "2px solid #e2e8f0",
                  fontSize: 14,
                  textAlign: "right",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  textAlign: "left",
                  display: "block",
                  color: "#0066cc",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                IGST (%)
              </label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={item.igst}
                onChange={(e) => setItem((it) => ({ ...it, igst: e.target.value || 0 }))}
                placeholder="0"
                style={{
                  width: "100%",
                  padding: "5px 6px",
                  borderRadius: 8,
                  border: "2px solid #e2e8f0",
                  fontSize: 14,
                  textAlign: "right",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  textAlign: "left",
                  display: "block",
                  color: "#0066cc",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Net Amount
              </label>
              <input
                type="number"
                value={
                  item.qty && item.price
                    ? (
                        Number(item.qty) * Number(item.price) +
                        (Number(item.cgst) + Number(item.sgst) + Number(item.igst)) *
                          Number(item.qty)
                      ).toFixed(2)
                    : ""
                }
                readOnly
                style={{
                  width: "100%",
                  padding: "5px 6px",
                  borderRadius: 8,
                  border: "2px solid #e2e8f0",
                  fontSize: 14,
                  background: "#f1f5f9",
                  color: "#475569",
                  textAlign: "right",
                  fontWeight: 600,
                }}
              />
            </div>

            <div>
              <label
                style={{
                  textAlign: "left",
                  display: "block",
                  color: "#0066cc",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Total Tax Amount
              </label>
              <input
                type="number"
                value={
                  item.qty
                    ? (
                        (Number(item.cgst) + Number(item.sgst) + Number(item.igst)) *
                        Number(item.qty)
                      ).toFixed(2)
                    : ""
                }
                readOnly
                style={{
                  width: "100%",
                  padding: "5px 6px",
                  borderRadius: 8,
                  border: "2px solid #e2e8f0",
                  fontSize: 14,
                  background: "#f1f5f9",
                  color: "#475569",
                  textAlign: "right",
                  fontWeight: 600,
                }}
              />
            </div>
          </div>

          {/* Add/Update Button - ORIGINAL */}
          <button
            className="mb-2"
            onClick={handleAddItem}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 28px",
              borderRadius: 10,
              border: "none",
              background:
                editingIdx !== null
                  ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                  : "linear-gradient(135deg, green 0%, green 100%)",
              color: "white",
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
              boxShadow:
                editingIdx !== null
                  ? "0 4px 15px rgba(245, 158, 11, 0.4)"
                  : "0 4px 15px green",
              transition: "all 0.3s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                editingIdx !== null
                  ? "0 6px 20px rgba(245, 158, 11, 0.5)"
                  : "0 6px 20px green";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                editingIdx !== null
                  ? "0 4px 15px rgba(245, 158, 11, 0.4)"
                  : "0 4px 15px green";
            }}
          >
            {editingIdx === null ? (
              <>
                 Add
              </>
            ) : (
              <>
                Update
              </>
            )}
          </button>

          {/* Items Table with Pagination - ALL ORIGINAL STYLING */}
          {items.length > 0 ? (
            <div
              style={{
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid #e2e8f0",
                marginBottom: 32,
              }}
            >
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 14,
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      }}
                    >
                      <th
                        style={{
                          padding: "14px 12px",
                          color: "white",
                          fontWeight: 600,
                          textAlign: "left",
                        }}
                      >
                        Item
                      </th>
                      <th
                        style={{
                          padding: "14px 12px",
                          color: "white",
                          fontWeight: 600,
                          textAlign: "center",
                        }}
                      >
                        Qty
                      </th>
                      <th
                        style={{
                          padding: "14px 12px",
                          color: "white",
                          fontWeight: 600,
                          textAlign: "center",
                        }}
                      >
                        Unit
                      </th>
                      <th
                        style={{
                          padding: "14px 12px",
                          color: "white",
                          fontWeight: 600,
                          textAlign: "right",
                        }}
                      >
                        Price
                      </th>
                      <th
                        style={{
                          padding: "14px 12px",
                          color: "white",
                          fontWeight: 600,
                          textAlign: "right",
                        }}
                      >
                        Total
                      </th>
                      <th
                        style={{
                          padding: "14px 12px",
                          color: "white",
                          fontWeight: 600,
                          textAlign: "center",
                        }}
                      >
                        CGST
                      </th>
                      <th
                        style={{
                          padding: "14px 12px",
                          color: "white",
                          fontWeight: 600,
                          textAlign: "center",
                        }}
                      >
                        SGST
                      </th>
                      <th
                        style={{
                          padding: "14px 12px",
                          color: "white",
                          fontWeight: 600,
                          textAlign: "center",
                        }}
                      >
                        IGST
                      </th>
                      <th
                        style={{
                          padding: "14px 12px",
                          color: "white",
                          fontWeight: 600,
                          textAlign: "right",
                        }}
                      >
                        Net
                      </th>
                      <th
                        style={{
                          padding: "14px 12px",
                          color: "white",
                          fontWeight: 600,
                          textAlign: "center",
                        }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length === 0 ? (
                      <tr>
                        <td
                          colSpan="10"
                          style={{
                            padding: "40px 20px",
                            textAlign: "center",
                            color: "#64748b",
                          }}
                        >
                          {items.length === 0
                            ? "No items added yet"
                            : "No items on this page"}
                        </td>
                      </tr>
                    ) : (
                      currentItems.map((it, idx) => {
                        const actualIndex = idx + (currentPage - 1) * recordsPerPage;
                        return (
                          <tr
                            key={actualIndex}
                            style={{
                              background: idx % 2 === 0 ? "white" : "#f8fafc",
                              transition: "background 0.2s",
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.background = "#f1f5f9")}
                            onMouseOut={(e) =>
                              (e.currentTarget.style.background =
                                idx % 2 === 0 ? "white" : "#f8fafc")
                            }
                          >
                            <td
                              style={{
                                padding: "14px 12px",
                                borderBottom: "1px solid #e2e8f0",
                                fontWeight: 500,
                              }}
                            >
                              {it.itemName}
                            </td>
                            <td
                              style={{
                                padding: "14px 12px",
                                borderBottom: "1px solid #e2e8f0",
                                textAlign: "center",
                              }}
                            >
                              {it.qty}
                            </td>
                            <td
                              style={{
                                padding: "14px 12px",
                                borderBottom: "1px solid #e2e8f0",
                                textAlign: "center",
                              }}
                            >
                              {it.unit}
                            </td>
                            <td
                              style={{
                                padding: "14px 12px",
                                borderBottom: "1px solid #e2e8f0",
                                textAlign: "right",
                              }}
                            >
                              ₹{Number(it.price).toFixed(2)}
                            </td>
                            <td
                              style={{
                                padding: "14px 12px",
                                borderBottom: "1px solid #e2e8f0",
                                textAlign: "right",
                              }}
                            >
                              ₹{it.totalAmount.toFixed(2)}
                            </td>
                            <td
                              style={{
                                padding: "14px 12px",
                                borderBottom: "1px solid #e2e8f0",
                                textAlign: "center",
                              }}
                            >
                              {it.cgst}%
                            </td>
                            <td
                              style={{
                                padding: "14px 12px",
                                borderBottom: "1px solid #e2e8f0",
                                textAlign: "center",
                              }}
                            >
                              {it.sgst}%
                            </td>
                            <td
                              style={{
                                padding: "14px 12px",
                                borderBottom: "1px solid #e2e8f0",
                                textAlign: "center",
                              }}
                            >
                              {it.igst}%
                            </td>
                            <td
                              style={{
                                padding: "14px 12px",
                                borderBottom: "1px solid #e2e8f0",
                                textAlign: "right",
                                fontWeight: 600,
                              }}
                            >
                              ₹{it.netAmount.toFixed(2)}
                            </td>
                            <td
                              style={{
                                padding: "14px 12px",
                                borderBottom: "1px solid #e2e8f0",
                                textAlign: "center",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  gap: 8,
                                  justifyContent: "center",
                                }}
                              >
                                <button
                                  onClick={() => handleEdit(actualIndex)}
                                  style={{
                                    padding: 8,
                                    borderRadius: 8,
                                    border: "none",
                                    background: "#eff6ff",
                                    color: "#2563eb",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                  }}
                                  onMouseOver={(e) => (e.currentTarget.style.background = "#dbeafe")}
                                  onMouseOut={(e) => (e.currentTarget.style.background = "#eff6ff")}
                                  title="Edit"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => handleDelete(actualIndex)}
                                  style={{
                                    padding: 8,
                                    borderRadius: 8,
                                    border: "none",
                                    background: "#fef2f2",
                                    color: "#dc2626",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                  }}
                                  onMouseOver={(e) => (e.currentTarget.style.background = "#fee2e2")}
                                  onMouseOut={(e) => (e.currentTarget.style.background = "#fef2f2")}
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <Pagination
                totalRecords={items.length}
                recordsPerPage={recordsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          ) : (
            <div
              style={{
                background: "#f8fafc",
                padding: 48,
                borderRadius: 16,
                textAlign: "center",
                marginBottom: 32,
                border: "2px dashed #cbd5e1",
              }}
            >
              <p
                style={{
                  color: "#64748b",
                  fontSize: 16,
                  margin: 0,
                  fontStyle: "italic",
                }}
              >
                No items added yet. Add items to create the credit note.
              </p>
            </div>
          )}

          {/* Summary - ALL ORIGINAL STYLING */}
          {items.length > 0 && (
            <div
              style={{
                background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                padding: 24,
                borderRadius: 16,
                marginBottom: 22,
                border: "2px solid #e2e8f0",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: 300,
                    fontSize: 15,
                  }}
                >
                  <span style={{ color: "#64748b", fontWeight: 500 }}>
                    Total Amount:
                  </span>
                  <span style={{ fontWeight: 600, color: "#1e293b" }}>
                    ₹{totalAmount.toFixed(2)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: 300,
                    fontSize: 15,
                  }}
                >
                  <span style={{ color: "#64748b", fontWeight: 500 }}>
                    Total Tax:
                  </span>
                  <span style={{ fontWeight: 600, color: "#1e293b" }}>
                    ₹{totalTaxAmount.toFixed(2)}
                  </span>
                </div>
                <div
                  style={{
                    width: 300,
                    height: 1,
                    background: "#cbd5e1",
                    margin: "2px 0",
                  }}
                ></div>
                <div style={{ display: "flex", justifyContent: "space-between", width: 300, fontSize: 18 }}>
                  <span style={{ color: "#475569", fontWeight: 700 }}>
                    Grand Total:
                  </span>
                  <span
                    style={{
                      fontWeight: 700,
                      color: "#667eea",
                      fontSize: 22,
                    }}
                  >
                    ₹{grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons - ALL ORIGINAL STYLING */}
          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "flex-end",
              flexWrap: "wrap",
            }}
          >
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
              disabled={isSaving || items.length === 0}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 32px",
                borderRadius: 12,
                border: "none",
                background:
                  isSaving || items.length === 0
                    ? "#cbd5e1"
                    : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "white",
                fontWeight: 600,
                fontSize: 15,
                cursor: isSaving || items.length === 0 ? "not-allowed" : "pointer",
                boxShadow:
                  isSaving || items.length === 0
                    ? "none"
                    : "0 4px 15px rgba(16, 185, 129, 0.4)",
                transition: "all 0.3s",
              }}
              onMouseOver={(e) => {
                if (!isSaving && items.length > 0) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(16, 185, 129, 0.5)";
                }
              }}
              onMouseOut={(e) => {
                if (!isSaving && items.length > 0) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 15px rgba(16, 185, 129, 0.4)";
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
      </div>
    </div>
  );
}
