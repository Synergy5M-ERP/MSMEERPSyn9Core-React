
import React, { useEffect, useState } from "react";
import { Edit, Trash2, Plus, Save, X } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_ENDPOINTS } from "../../config/apiconfig";
import axios from "axios";

const taxTypeOptions = [
  { value: "CGST_SGST", label: "CGST_SGST" },
  { value: "IGST", label: "IGST" },
];

const categoryOptions = [
  { value: "SELLER", label: "SELLER" },
  { value: "BUYER", label: "BUYER" },
];

const emptyItem = {
  itemId: null,
  itemName: "",
  itemQty: 0,
  unitId: null,       // ✅ ADD THIS
  itemUnit: "",
  price: 0,
  taxType: "",
  cgst: 0,
  sgst: 0,
  igst: 0,
  totalAmount: 0,
  netAmount: 0,
  totalTaxAmount: 0,
};

export default function AccountCreditNote() {
  const [sellerVendors, setSellerVendors] = useState([]);
  const [buyerVendors, setBuyerVendors] = useState([]);
  const [invoiceOptions, setInvoiceOptions] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);

  const [category, setCategory] = useState("")
  const [vendor, setVendor] = useState({
  vendorId: null,
  vendorName: ""
});

  const [invoice, setInvoice] = useState("");
  const [creditNoteNo, setCreditNoteNo] = useState("");
  const [creditNoteDate, setCreditNoteDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentDueDate, setPaymentDueDate] =useState("")
  
  const [item, setItem] = useState(emptyItem);
  const [items, setItems] = useState([]);
  const [editingIdx, setEditingIdx] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
  fetchNextCreditNoteNo();
  fetchUnits()
}, []);

useEffect(() => {
  if (!item.unitId || unitOptions.length === 0) return;

  const unit = unitOptions.find(
    u => u.unitId === Number(item.unitId)
  );

  if (!unit) return;

  setItem(prev => ({
    ...prev,
    unitId: unit.unitId,
    itemUnit: unit.unitName
  }));
}, [unitOptions]);

const fetchNextCreditNoteNo = async () => {
  try {
    const res = await axios.get(API_ENDPOINTS.GetNextCreditNoteNo);
    if (res.data?.success) {
      setCreditNoteNo(res.data.nextCreditNoteNo);
    }
  } catch (err) {
    toast.error("Failed to fetch Credit Note number");
  }
};

const fetchUnits = async () => {
  try {
    const res = await axios.get(API_ENDPOINTS.GetUnits);

    if (res.data?.success) {
      setUnitOptions(res.data.data || []);
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed to load units");
  }
};

  useEffect(() => {
    setVendor("");
    setInvoice("");
    setInvoiceOptions([]);

    if (category) {
      fetchVendorsByCategory(category);
    }
  }, [category]);

  const fetchVendorsByCategory = async (category) => {
    // 🔥 DO NOT refetch if already loaded
    if (category === "SELLER" && sellerVendors.length > 0) return;
    if (category === "BUYER" && buyerVendors.length > 0) return;

    setIsLoading(true);
    try {
      const res = await axios.get(API_ENDPOINTS.CategoryVendors, {
        params: { category }, // ?category=seller OR buyer
      });

      if (res.data?.success) {
        if (category === "SELLER") {
          setSellerVendors(res.data.data || []);
        }
        else if (category === "BUYER") {
          setBuyerVendors(res.data.data || []);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load vendors");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Clear invoice & GRNs when vendor changes
    setInvoice("");
    setInvoiceOptions([]);

    if (!vendor) return;

    if (category === "SELLER") {
      fetchSellerGRNs(vendor.vendorName);
    }
    if (category === "BUYER") {
      fetchBuyerInvoices(vendor.vendorName)
    }

    setItemOptions([]);
    setItems([]);
    setItem(emptyItem);
  }, [vendor, category]);

  const fetchSellerGRNs = async (vendorName) => {
    try {
      setIsLoading(true);
      const res = await axios.get(API_ENDPOINTS.GetSellerGRNNumbers, {
        params: { vendorName }
      });

      if (res.data?.success) {
        setInvoiceOptions(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load GRN numbers");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBuyerInvoices = async (buyerName) => {
    try {
      setIsLoading(true);
      const res = await axios.get(API_ENDPOINTS.GetBuyersInvoiceNumbers, {
        params: { buyerName }
      });

      if (res.data?.success) {
        setInvoiceOptions(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load Invoice numbers");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchItemsByGRN = async (grnId) => {
    if (!grnId) return;

    const res = await axios.get(API_ENDPOINTS.GetItemsByGRN, {
      params: { grnId }
    });

    setItemOptions(res.data.success ? res.data.data : []);
  };

  const fetchItemsByInvoice = async (invoiceId) => {
    if (!invoiceId) return;

    const res = await axios.get(API_ENDPOINTS.GetItemsByInvoice, {
      params: { invoiceId }
    });

    setItemOptions(res.data.success ? res.data.data : []);
  };

const fetchItemDetails = async (itemId) => {
  if (!itemId || !["SELLER", "BUYER"].includes(category)) return;

  try {
    const endpoint =
      category === "SELLER"
        ? API_ENDPOINTS.GetGRNItemsDetails
        : API_ENDPOINTS.GetInvoiceItemsDetails;

    const res = await axios.get(endpoint, {
      params: { itemId }// <-- MUST BE A NUMBER
    });

    if (!res?.data?.success || !res.data.data) return;

    const d = res.data.data; // API returns OBJECT

    console.log(d)

    setItem(prev => {
        const unitIdFromApi = d.unitId ? Number(d.unitId) : null;

        const unit = unitOptions.find(
          u => u.unitId === unitIdFromApi
        );

        return {
          ...prev,

          itemQty: Number(d.itemQty) || 0,

          // ✅ ONLY set if unit exists in dropdown
          unitId: unit ? unit.unitId : prev.unitId,
          itemUnit: unit ? unit.unitName : prev.itemUnit,

          price: Number(d.itemPrice) || 0,

          cgst: Number(d.cgst) || 0,
          sgst: Number(d.sgst) || 0,
          igst: Number(d.igst) || 0,

          totalTaxAmount: Number(d.totalTaxAmt) || 0,
          totalAmount: Number(d.totalAmount) || 0,
          netAmount: Number(d.netAmount) || 0,

          taxType: d.taxType || "CGST_SGST"
        };
      });
  } catch (err) {
    console.error("fetchItemDetails error:", err);
    toast.error("Failed to load item details");
  }
};

  const handleAddItem = () => {
    if (!item.itemName) {
      toast.warn("Please select an item name");
      return;
    }
    if (!item.itemUnit) {
      toast.warn("Please select a unit");
      return;
    }
    if (!item.itemQty || item.itemQty <= 0) {
      toast.warn("Please enter a valid quantity");
      return;
    }
    if (!item.price || item.price <= 0) {
      toast.warn("Please enter a valid price");
      return;
    }

    const computedTotal = item.itemQty * item.price;
    const totalTax = computedTotal * (Number(item.cgst) + Number(item.sgst) + Number(item.igst))/100;
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
    setCategory("")
    setVendor("");
    setInvoice("");
    setCreditNoteNo("");
    setCreditNoteDate(new Date().toISOString().split("T")[0]);
    setItems([]);
    setItem(emptyItem);
    setEditingIdx(null);
    toast.info("Form cleared");
  };

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
      toast.warn("Please enter Credit note number");
      return;
    }
    if (!creditNoteDate) {
      toast.warn("Please select Credit note date");
      return;
    }
    if (items.length === 0) {
      toast.warn("Please add at least one item");
      return;
    }

  const CreditNoteData = {
  category,
  vendorId: vendor.vendorId,
  invoiceNoId: invoice,
  creditNoteNo,
  creditNoteDate: creditNoteDate,
  paymentDueDate,

  totalAmount,
  totalTaxAmount,
  grandAmount: grandTotal,
  createdBy: 1,

  creditNoteEntries: items.map(it => ({
    ItemId: it.itemId,
    Qty: Number(it.itemQty),
    UnitId: it.unitId,
    Price: Number(it.price),
    TotalAmount: Number(it.totalAmount),
    TaxTypeId: it.taxType === "IGST" ? 2 : 1,
    CGST: Number(it.cgst),
    SGST: Number(it.sgst),
    IGST: Number(it.igst),
    TotalTax: Number(it.totalTaxAmount),
    NetAmount: Number(it.netAmount)
  }))
};

console.log(CreditNoteData)

    setIsSaving(true);
    try {
      const response = await fetch(API_ENDPOINTS.SaveCreditNote, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(CreditNoteData),
      });

      console.log(response)

      if (!response.ok) {
        throw new Error("Failed to save Credit note");
      }

      await response.json();
      toast.success("Credit note saved successfully!");

      console.log("success")

      setTimeout(() => {
        handleCancel();
        fetchNextCreditNoteNo()
      }, 1500);
    } catch (error) {
      console.error("Error saving Credit note:", error);
      toast.error("Failed to save Credit note. Please try again.");
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
        className="custom-scrollbar" style={{ maxHeight: 400, overflowY: "auto" }}
      >
        <div style={{
          padding: 28,
          borderRadius: 16,
          marginBottom: 32,
          border: "2px solid #e2e8f0"
        }}>
          <div className="row">
            <div className="col-3">
              <label
                style={{
                  textAlign: "left", display: "block", color: "#0066cc", fontSize: "14px", fontWeight: "600", marginBottom: "8px",
                }}>

                Category <span style={{ color: "#ef4444" }}>*</span>
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: 10, border: "2px solid #e2e8f0", fontSize: 15,
                  background: "white", cursor: "pointer", marginBottom: "9px",
                }}>

                <option value="">Select Category</option>
                {categoryOptions.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-3">
              <label style={{
                textAlign: 'left', display: 'block', color: '#0066cc', fontSize: '16px', fontWeight: '600', marginBottom: '8px'
              }}>
                {category === "BUYER" ? "Customer Name" : "Vendor Name"} <span style={{ color: "#ef4444" }}>*</span></label>

             <select
                  value={vendor.vendorId || ""}
                  onChange={(e) => {
                    const selectedVendorId = Number(e.target.value);

                    const vendorList =
                      category === "SELLER" ? sellerVendors : buyerVendors;

                    const selectedVendor = vendorList.find(
                      v => v.vendorId === selectedVendorId
                    );

                    if (!selectedVendor) return;

                    setVendor({
                      vendorId: selectedVendor.vendorId,
                      vendorName: selectedVendor.vendorName
                    });
                  }}
                  disabled={!category || isLoading}
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: 10,                                    
                    border: "2px solid #e2e8f0",fontSize: 15,background: "white",cursor: "pointer",                                                       
                  }}>
                
                  <option value="">
                    {!category
                      ? "Select Category First"
                      : category === "SELLER"
                        ? "Select Seller"
                        : "Select Buyer"}
                  </option>

                  {category === "SELLER" &&
                    sellerVendors.map(v => (
                      <option key={v.vendorId} value={v.vendorId}>
                        {v.vendorName}
                      </option>
                    ))}

                  {category === "BUYER" &&
                    buyerVendors.map(v => (
                      <option key={v.vendorId} value={v.vendorId}>
                        {v.vendorName}
                      </option>
                    ))}
                </select>
            </div>

            <div className="col-3">
              <label style={{
                textAlign: 'left', display: 'block', color: '#0066cc', fontSize: '16px', fontWeight: '600', marginBottom: '8px'
              }}>
                Invoice Number <span style={{ color: "#ef4444" }}>*</span></label>
              <select
                value={invoice}
                onChange={(e) => {
                  const selectedId = e.target.value;

                  setInvoice(selectedId)

                  const selectedObj = invoiceOptions.find(
                    o => o.invoiceGrnId === Number(selectedId)
                  );

                  // FETCH ITEMS HERE 👇
                  if (category === "SELLER") {
                    fetchItemsByGRN(selectedId);
                  } else {
                    fetchItemsByInvoice(selectedId);
                  }

                  setPaymentDueDate(
                    selectedObj?.paymentDueDate
                      ? selectedObj.paymentDueDate.split("T")[0]
                      : ""
                  );

                  setItems([]);
                  setItem(emptyItem);

                }}

                disabled={!vendor || isLoading}
                style={{
                  width: "100%",
                  padding: "5px 6px",
                  borderRadius: 10,
                  border: "2px solid #e2e8f0",
                  fontSize: 15,
                  background: "white",
                  cursor: "pointer",
                }}>

                <option value="">
                  {category === "SELLER" ? "Select GRN No" : "Select Invoice No"}
                </option>

                {invoiceOptions.map((o) => (
                  <option key={o.invoiceGrnId} value={o.invoiceGrnId}>
                    {category === "SELLER" ? o.grnNo : o.invoiceNo}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-3">
              <label style={{
                textAlign: 'left', display: 'block', color: '#0066cc', fontSize: '16px', fontWeight: '600', marginBottom: '8px'
              }}>Credit Note No <span style={{ color: "#ef4444" }}>*</span></label>
              <input
                type="text"
                value={creditNoteNo}
                onChange={e => setCreditNoteNo(e.target.value)}
                placeholder="CN-001"
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: 10,
                  border: "2px solid #e2e8f0", fontSize: 15, transition: "all 0.2s"
                }} />

            </div>

            <div className="col-3">
              <label style={{
                textAlign: 'left', display: 'block', color: '#0066cc', fontSize: '16px', fontWeight: '600', marginBottom: '8px'
              }}>Credit Note Date <span style={{ color: "#ef4444" }}>*</span></label>
              <input
                type="date"
                value={creditNoteDate}
                onChange={e => setCreditNoteDate(e.target.value)}
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: 10,
                  border: "2px solid #e2e8f0", fontSize: 15, transition: "all 0.2s"
                }} />
            </div>

            <div className="col">
              <label
                style={{
                  textAlign: "left", display: "block", color: "#0066cc", fontSize: "14px", fontWeight: "600", marginBottom: "8px",
                }}>

                Payment Due Date <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="date"
                value={paymentDueDate} readOnly
                // onChange={(e) => setPaymentDueDate(e.target.value)}
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: 10,
                  border: "2px solid #e2e8f0", fontSize: 15, transition: "all 0.2s"
                }} />
            </div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 16,
            marginBottom: 20
          }}>
            
            <div>
              <label style={{
                textAlign: 'left', display: 'block', color: '#0066cc', fontSize: '16px', fontWeight: '600', marginBottom: '10px'
              }}>Item Name <span style={{ color: "#ef4444" }}>*</span></label>
              <select
                value={item.itemId || ""}
                onChange={(e) => {
                    const selectedId = Number(e.target.value);

                    const selectedItem = itemOptions.find(
                      i => i.itemId === selectedId
                    );

                    if (!selectedItem) return;

                    setItem(prev => ({
                      ...prev,
                      itemId: selectedItem.itemId,
                      itemName: selectedItem.itemName,
                      unitId: Number(selectedItem.unitId),   // 🔥 force number
                      itemUnit: selectedItem.unitName
                    }));

                    fetchItemDetails(selectedItem.itemId);
                  }}

                style={{
                  width: "100%", padding: "10px 12px", borderRadius: 8,               
                  border: "2px solid #e2e8f0", fontSize: 14, background: "white",cursor: "pointer",                                                
                }}>
              
                <option value="">Select Item</option>

                {itemOptions.map(o => (
                  <option key={o.itemId} value={o.itemId}>
                    {o.itemName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{
                textAlign: 'left', display: 'block', color: '#0066cc', fontSize: '16px', fontWeight: '600', marginBottom: '8px'
              }}>Quantity <span style={{ color: "#ef4444" }}>*</span></label>
              <input
                type="number" min={0}
                value={item.itemQty} onChange={e => setItem(it => ({ ...it, itemQty: e.target.value }))}
                placeholder="0"
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: 8,
                  border: "2px solid #e2e8f0", fontSize: 14, textAlign: "right"
                }} />

            </div>

            <div>
              <label style={{
                textAlign: 'left', display: 'block', color: '#0066cc', fontSize: '16px', fontWeight: '600', marginBottom: '8px'
              }}>Unit <span style={{ color: "#ef4444" }}>*</span></label>
              <select
                  value={item.unitId || ""}
                  onChange={(e) => {
                    const selectedUnitId = Number(e.target.value);

                    console.log(selectedUnitId)

                    if (!selectedUnitId) {
                      setItem(it => ({ ...it, unitId: null, itemUnit: "" }));
                      return;
                    }

                    const selectedUnit = unitOptions.find(
                      u => u.unitId === selectedUnitId
                    );

                    if (!selectedUnit) return;

                    setItem(it => ({
                      ...it,
                      unitId: selectedUnit.unitId,   // 🔥 for backend
                      itemUnit: selectedUnit.unitName // for display
                    }));
                  }}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "2px solid #e2e8f0",
                    fontSize: 14,
                    background: "white",
                    cursor: "pointer"
                  }}
                >
                  <option value="">Select Unit</option>

                  {unitOptions.map(u => (
                    <option key={u.unitId} value={u.unitId}>
                      {u.unitName}
                    </option>
                  ))}
                </select>
            </div>

            <div>
              <label style={{
                textAlign: 'left', display: 'block', color: '#0066cc', fontSize: '16px', fontWeight: '600', marginBottom: '8px'
              }}>Price <span style={{ color: "#ef4444" }}>*</span></label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={item.price}
                onChange={e => setItem(it => ({ ...it, price: e.target.value }))}
                placeholder="0.00"
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: 8, border: "2px solid #e2e8f0", fontSize: 14, textAlign: "right"
                }} />
            </div>

            <div>
              <label style={{
                textAlign: 'left', display: 'block', color: '#0066cc', fontSize: '16px', fontWeight: '600', marginBottom: '8px'
              }}>Net Amount</label>
              <input
                type="number"
                value={
                  item.netAmount
                }
                readOnly
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: 8, border: "2px solid #e2e8f0",
                  fontSize: 14, background: "#f1f5f9", color: "#475569", textAlign: "right", fontWeight: 600
                }}
                className="form-text"
              />
            </div>

          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: 16,
            marginBottom: 20
          }}>
            <div>
              <label style={{
                textAlign: 'left', display: 'block', color: '#0066cc', fontSize: '16px', fontWeight: '600', marginBottom: '8px'
              }}>Tax Type</label>
              <select
                value={item.taxType}
                onChange={e => setItem(it => ({ ...it, taxType: e.target.value }))}
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: 8, border: "2px solid #e2e8f0",
                  fontSize: 14, background: "white", cursor: "pointer"
                }}>

                <option value="">Select</option>
                {taxTypeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <div>
              <label style={{
                textAlign: 'left', display: 'block', color: '#0066cc', fontSize: '16px', fontWeight: '600', marginBottom: '8px'
              }}>CGST (%)</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={item.cgst}
                onChange={e => setItem(it => ({ ...it, cgst: e.target.value || 0 }))}
                placeholder="0"
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: 8, border: "2px solid #e2e8f0", fontSize: 14, textAlign: "right"
                }} />
            </div>

            <div>
              <label style={{
                textAlign: 'left', display: 'block', color: '#0066cc', fontSize: '16px', fontWeight: '600', marginBottom: '8px'
              }}>SGST (%)</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={item.sgst}
                onChange={e => setItem(it => ({ ...it, sgst: e.target.value || 0 }))}
                placeholder="0"
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: 8, border: "2px solid #e2e8f0", fontSize: 14, textAlign: "right"
                }} />
            </div>

            <div>
              <label style={{
                textAlign: 'left', display: 'block', color: '#0066cc', fontSize: '16px', fontWeight: '600', marginBottom: '8px'
              }}>IGST (%)</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={item.igst}
                onChange={e => setItem(it => ({ ...it, igst: e.target.value || 0 }))}
                placeholder="0"
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: 8, border: "2px solid #e2e8f0", fontSize: 14, textAlign: "right"
                }}
              />
            </div>

            <div>
              <label style={{
                textAlign: 'left', display: 'block', color: '#0066cc', fontSize: '16px', fontWeight: '600', marginBottom: '8px'
              }}>
                Total Tax Amount
              </label>
              <input
                type="number"
                value={
                  item.totalTaxAmount
                }
                readOnly
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: 8, border: "2px solid #e2e8f0", fontSize: 14,
                  background: "#f1f5f9", color: "#475569", textAlign: "right", fontWeight: 600
                }}
              />
            </div>

            <div>
              <label style={{
                textAlign: 'left', display: 'block', color: '#0066cc', fontSize: '16px', fontWeight: '600', marginBottom: '8px'
              }}>Total Amount</label>
              <input
                type="number"
                value={item.totalAmount}
                readOnly
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: 8, border: "2px solid #e2e8f0",
                  fontSize: 14, background: "#f1f5f9", color: "#475569", textAlign: "right"
                }} />

            </div>
          </div>

          <button className="mb-2"
            onClick={handleAddItem}
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 10, border: "none",
              background: editingIdx !== null ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white", fontWeight: 600, fontSize: 15, cursor: "pointer",
              boxShadow: editingIdx !== null ? "0 4px 15px rgba(245, 158, 11, 0.4)" : "0 4px 15px rgba(102, 126, 234, 0.4)",
              transition: "all 0.3s"
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = editingIdx !== null ? "0 6px 20px rgba(245, 158, 11, 0.5)" : "0 6px 20px rgba(102, 126, 234, 0.5)";
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = editingIdx !== null ? "0 4px 15px rgba(245, 158, 11, 0.4)" : "0 4px 15px rgba(102, 126, 234, 0.4)";
            }}
          >
            {editingIdx === null ? <><Plus size={18} /> Add </> : <><Edit size={18} /> Update </>}
          </button>

          {items.length > 0 ? (
            <div style={{
              borderRadius: 16, overflow: "hidden", border: "1px solid #e2e8f0", marginBottom: 32
            }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{
                  width: "100%", borderCollapse: "collapse", fontSize: 14
                }}>
                  <thead>
                    <tr style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                      <th style={{ padding: "16px 12px", color: "white", fontWeight: 600, textAlign: "left" }}>Item</th>
                      <th style={{ padding: "16px 12px", color: "white", fontWeight: 600, textAlign: "center" }}>Qty</th>
                      <th style={{ padding: "16px 12px", color: "white", fontWeight: 600, textAlign: "center" }}>Unit</th>
                      <th style={{ padding: "16px 12px", color: "white", fontWeight: 600, textAlign: "right" }}>Price</th>
                      <th style={{ padding: "16px 12px", color: "white", fontWeight: 600, textAlign: "right" }}>Total</th>
                      <th style={{ padding: "16px 12px", color: "white", fontWeight: 600, textAlign: "center" }}>CGST</th>
                      <th style={{ padding: "16px 12px", color: "white", fontWeight: 600, textAlign: "center" }}>SGST</th>
                      <th style={{ padding: "16px 12px", color: "white", fontWeight: 600, textAlign: "center" }}>IGST</th>
                      <th style={{ padding: "16px 12px", color: "white", fontWeight: 600, textAlign: "right" }}>Net</th>
                      <th style={{ padding: "16px 12px", color: "white", fontWeight: 600, textAlign: "center" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it, idx) => (
                      <tr key={idx} style={{
                        background: idx % 2 === 0 ? "white" : "#f8fafc",
                        transition: "background 0.2s"
                      }}
                        onMouseOver={e => e.currentTarget.style.background = "#f1f5f9"}
                        onMouseOut={e => e.currentTarget.style.background = idx % 2 === 0 ? "white" : "#f8fafc"}>
                        <td style={{ padding: "14px 12px", borderBottom: "1px solid #e2e8f0", fontWeight: 500 }}>{it.itemName}</td>
                        <td style={{ padding: "14px 12px", borderBottom: "1px solid #e2e8f0", textAlign: "center" }}>{it.itemQty}</td>
                        <td style={{ padding: "14px 12px", borderBottom: "1px solid #e2e8f0", textAlign: "center" }}>{it.itemUnit}</td>
                        <td style={{ padding: "14px 12px", borderBottom: "1px solid #e2e8f0", textAlign: "right" }}>₹{Number(it.price).toFixed(2)}</td>
                        <td style={{ padding: "14px 12px", borderBottom: "1px solid #e2e8f0", textAlign: "right" }}>₹{it.totalAmount.toFixed(2)}</td>
                        <td style={{ padding: "14px 12px", borderBottom: "1px solid #e2e8f0", textAlign: "center" }}>{it.cgst}%</td>
                        <td style={{ padding: "14px 12px", borderBottom: "1px solid #e2e8f0", textAlign: "center" }}>{it.sgst}%</td>
                        <td style={{ padding: "14px 12px", borderBottom: "1px solid #e2e8f0", textAlign: "center" }}>{it.igst}%</td>
                        <td style={{ padding: "14px 12px", borderBottom: "1px solid #e2e8f0", textAlign: "right", fontWeight: 600 }}>₹{it.netAmount.toFixed(2)}</td>
                        <td style={{ padding: "14px 12px", borderBottom: "1px solid #e2e8f0", textAlign: "center" }}>
                          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                            <button
                              onClick={() => handleEdit(idx)}
                              style={{
                                padding: 8, borderRadius: 8, border: "none", background: "#eff6ff", color: "#2563eb",
                                cursor: "pointer", transition: "all 0.2s"
                              }}
                              onMouseOver={e => e.currentTarget.style.background = "#dbeafe"}
                              onMouseOut={e => e.currentTarget.style.background = "#eff6ff"}
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(idx)}
                              style={{
                                padding: 8, borderRadius: 8, border: "none",
                                background: "#fef2f2", color: "#dc2626", cursor: "pointer", transition: "all 0.2s"
                              }}
                              onMouseOver={e => e.currentTarget.style.background = "#fee2e2"}
                              onMouseOut={e => e.currentTarget.style.background = "#fef2f2"}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div style={{
              background: "#f8fafc", padding: 48, borderRadius: 16,
              textAlign: "center", marginBottom: 32, border: "2px dashed #cbd5e1"
            }}>
              <p style={{
                color: "#64748b", fontSize: 16, margin: 0, fontStyle: "italic"
              }}>No items added yet. Add items to create the Credit note.</p>
            </div>
          )}

          {/* Summary */}
          {items.length > 0 && (
            <div style={{
              background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)", padding: 24, borderRadius: 16,
              marginBottom: 22, border: "2px solid #e2e8f0", textAlign: 'left'
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, textAlign: 'center' }}>
                <div style={{ display: "flex", justifyContent: "space-between", width: 300, fontSize: 15 }}>
                  <span style={{ color: "#64748b", fontWeight: 500 }}>Total Amount:</span>
                  <span style={{ fontWeight: 600, color: "#1e293b" }}>₹{totalAmount.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", width: 300, fontSize: 15 }}>
                  <span style={{ color: "#64748b", fontWeight: 500 }}>Total Tax:</span>
                  <span style={{ fontWeight: 600, color: "#1e293b" }}>₹{totalTaxAmount.toFixed(2)}</span>
                </div>
                <div style={{
                  width: 300,
                  height: 1,
                  background: "#cbd5e1",
                  margin: "2px 0"
                }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", width: 300, fontSize: 18 }}>
                  <span style={{ color: "#475569", fontWeight: 700 }}>Grand Total:</span>
                  <span style={{
                    fontWeight: 700,
                    color: "#667eea",
                    fontSize: 22
                  }}>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{
            display: "flex",
            gap: 16,
            justifyContent: "flex-end",
            flexWrap: "wrap"
          }}>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 12, border: "2px solid #e2e8f0",
                background: "white", color: "#64748b", fontWeight: 600, fontSize: 15,
                cursor: isSaving ? "not-allowed" : "pointer", transition: "all 0.2s", opacity: isSaving ? 0.5 : 1
              }}
              onMouseOver={e => {
                if (!isSaving) {
                  e.currentTarget.style.borderColor = "#cbd5e1";
                  e.currentTarget.style.background = "#f8fafc";
                }
              }}
              onMouseOut={e => {
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
                display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 12, border: "none",
                background: isSaving || items.length === 0 ? "#cbd5e1" : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "white", fontWeight: 600, fontSize: 15, cursor: isSaving || items.length === 0 ? "not-allowed" : "pointer",
                boxShadow: isSaving || items.length === 0 ? "none" : "0 4px 15px rgba(16, 185, 129, 0.4)",
                transition: "all 0.3s"
              }}
              onMouseOver={e => {
                if (!isSaving && items.length > 0) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(16, 185, 129, 0.5)";
                }
              }}
              onMouseOut={e => {
                if (!isSaving && items.length > 0) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(16, 185, 129, 0.4)";
                }
              }}
            >
              {isSaving ? (
                <>
                  <div style={{
                    width: 18, height: 18, border: "3px solid white", borderTopColor: "transparent",
                    borderRadius: "50%", animation: "spin 0.8s linear infinite"
                  }}></div>
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