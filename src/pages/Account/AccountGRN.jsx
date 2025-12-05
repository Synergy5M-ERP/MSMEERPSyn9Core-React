
<<<<<<< HEAD
import React, { useState } from "react";

import NotCreated from "../../components/NotCreated";
import CheckPayable from "./CheckPayable";
import ApprovedPayable from "./ApprovedPayable";

function AccountGRN() {
  const [selectedPage, setSelectedPage] = useState("checkPayable");


  return (
    <div style={{ minHeight: "80vh"}}>
      <h2 style={{ textAlign: "left", color: "#0066cc", marginBottom: 0 }}>
        Account GRN
      </h2>

      {/* Page Selector */}
 <div
  style={{
    display: 'flex',
    justifyContent: 'space-between', // space between two groups
    alignItems: 'center',
    gap: '30px',
    marginTop: '22px',
    marginBottom: '12px',
    padding: '14px 0 14px 5px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.07)',
    background: '#fff',
=======
import React, { useState, useEffect } from "react";
import { Eye, Trash2, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "../../components/Pagination";
import { API_ENDPOINTS } from "../../config/apiconfig";


// Initial new item row structure
const emptyItem = {
    itemName: "",
    receivedQty: 0,
    receivedUnit: "",
    approvedQty: 0,
    approvedUnit: "",
    damagedQty: 0,
    damagedUnit: "",
    taxType: "",
    cgst: 0,
    sgst: 0,
    igst: 0,
    description: "",
};

const AccountGRN = () => {
    const[Grndetails,setGrnDetails]=useState(false);
    // Main data and auxiliary fetched options:
    const [selectedGrn, setSelectedGrn] = useState("");
const [fetchedItems, setFetchedItems] = useState([]);

    const [loading, setLoading] = useState(false);
    const [grns, setGrns] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [ledgerTypes, setLedgerTypes] = useState([]);
    const [grnNumbers, setGrnNumbers] = useState([]);
    const [poNumbers, setPoNumbers] = useState([]);
    
    const [items, setItems] = useState([]);
    const [units, setUnits] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]);
    const [taxTypes, setTaxTypes] = useState([
        { value: "CGST", label: "CGST" },
        { value: "SGST", label: "SGST" },
        { value: "IGST", label: "IGST" }
    ]);
    // Form state:
    const [formData, setFormData] = useState({
        vendorId: "",

        sellerName: "",
        grnNumber: "",
        grnDate: "",
        poNumber: "",
        invoiceNumber: "",
        invoiceDate: "",
        status: "",
        vehicleNo: "",
        description: "",
        items: [],
        totalAmount: 0,
        totalTaxAmount: 0,
        grandTotal: 0,
    });
    const [currentItem, setCurrentItem] = useState(emptyItem);
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 4;
    const indexOfLast = currentPage * recordsPerPage;
    const indexOfFirst = indexOfLast - recordsPerPage;
    const currentRecords = grns.slice(indexOfFirst, indexOfLast);
const handleGrnChange = (e) => {
  const selectedId = e.target.value;

  // 1. Set selected GRN immediately
  setFormData(fd => ({ ...fd, grnNumber: selectedId }));

  // 2. Fetch details asynchronously
  if (selectedId) {
    fetchGRNDetails(selectedId); 
  }
};

    // Data fetches
    useEffect(() => {
        fetchAllDropdowns();
        loadSellers();
     
        loadGrnNumbers();
    },[]);
    const unitOptions = [
        { value: "pcs", label: "Pieces" },
        { value: "kg", label: "Kilograms" },
        { value: "g", label: "Grams" },
        { value: "l", label: "Liters" },
        { value: "ml", label: "Milliliters" },
        { value: "m", label: "Meters" },
        { value: "cm", label: "Centimeters" },
        { value: "box", label: "Boxes" },
        { value: "pack", label: "Packs" },
        { value: "roll", label: "Rolls" },
        { value: "doz", label: "Dozens" },
        { value: "carton", label: "Cartons" },
        { value: "bundle", label: "Bundles" },
        { value: "bottle", label: "Bottles" },
        { value: "ton", label: "Tons" },
        { value: "unit", label: "Units" }
    ];

    // Combined fetch for dropdowns
 // ---------------- SAFE JSON WRAPPER ----------------
const safeJson = async (res) => {
  try {
    return await res.json();
  } catch {
    return {};
  }
};

// ---------------- FETCH DROPDOWNS ----------------
const fetchAllDropdowns = async () => {
  try {
    setLoading(true);

    const [sellersRes, ledgerRes, grnNumRes] = await Promise.all([
      fetch(API_ENDPOINTS.GetSellers),
      fetch(API_ENDPOINTS.Ledger),
      fetch(`${API_ENDPOINTS.GetGRNNumbersBySeller}?sellerName=${formData.sellerName || ""}`)
    ]);

    const sellersData = await safeJson(sellersRes);
    const ledgerData = await safeJson(ledgerRes);
    const grnNumData = await safeJson(grnNumRes);

    setSuppliers(sellersData.data || []);
    setLedgerTypes(ledgerData.data || []);
    setGrnNumbers(grnNumData.data || []);

  } catch (err) {
    toast.error("Failed to load dropdowns");
  } finally {
    setLoading(false);
  }
};

// ---------------- FETCH SELLERS ----------------
const loadSellers = async () => {
  try {
    const res = await fetch(API_ENDPOINTS.GetSellers);

    if (!res.ok) {
      console.error("API ERROR:", res.status);
      setSuppliers([]);
      return;
    }

    const data = await safeJson(res);
    console.log("GetSellers response:", data);

    // Map string array into objects with temporary IDs
    const suppliersWithIds = (data.data || []).map((name, index) => ({
      id: index + 1, // temporary ID
      name
    }));

    setSuppliers(suppliersWithIds); // save in state
  } catch (error) {
    console.error("Fetch error:", error);
    setSuppliers([]);
  }
};

const loadGrnNumbers = async (sellerName) => {
  if (!sellerName) {
    setGrnNumbers([]);
    return;
  }

  try {
    const res = await fetch(`${API_ENDPOINTS.GetGRNNumbersBySeller}?sellerName=${sellerName}`);
    const data = await safeJson(res);

    console.log("GRN numbers API data:", data);  // 👈 SHOW ME THIS

    setGrnNumbers(data.data || []);
  } catch {
    toast.error("Unable to load GRN numbers");
  }
};


// ---------------- FETCH GRN DETAILS ----------------
const fetchGRNDetails = async (grnId) => {
  if (!grnId) return;

  try {
    const res = await fetch(`${API_ENDPOINTS.GetGRNDetails}?grnId=${grnId}`);
    const data = await safeJson(res);

    if (!data.success) return;

    const h = data.data.header;
    const items = data.data.items || [];

    // Set header details in formData
    setFormData(fd => ({
      ...fd,
      grnNumber: h.grnNumber,
      grnDate: h.grN_Date ? h.grN_Date.split("T")[0] : "",
      poNumber: h.poNumber,
      invoiceNumber: h.invoice_NO,
      invoiceDate: h.invoice_Date ? h.invoice_Date.split("T")[0] : "",
      vehicleNo: h.vehicle_No,
      description: h.supplier_Address,
      status: "Received",
      items: [] // Keep table empty initially
    }));

    // Save fetched items for dropdown only
    setFetchedItems(items.map(i => ({
      itemName: i.itemName,
      taxType: i.taxType,
      receivedQty: i.receivedQty,
      approvedQty: i.acceptedQty,
      damagedQty: i.rejectedQty,
      cgst: i.taxType === "CGST" ? i.taxRate : 0,
      sgst: i.taxType === "SGST" ? i.taxRate : 0,
      igst: i.taxType === "IGST" ? i.taxRate : 0,
      description: ""
    })));

    // Initialize currentItem as the first item for dropdown
    if (items.length > 0) {
      const first = items[0];
      setCurrentItem({
        itemName: first.itemName,
        receivedQty: first.receivedQty,
        approvedQty: first.acceptedQty,
        damagedQty: first.rejectedQty,
        receivedUnit: "pcs",
        approvedUnit: "pcs",
        damagedUnit: "pcs",
        taxType: first.taxType || "",
        cgst: first.taxType === "CGST" ? first.taxRate : 0,
        sgst: first.taxType === "SGST" ? first.taxRate : 0,
        igst: first.taxType === "IGST" ? first.taxRate : 0,
        description: ""
      });
    }

    // Update PO numbers list with Invoice No
    setPoNumbers(prev => {
      const exists = prev.find(po => po.PO_No === h.poNumber);
      const invoiceVal = h.invoice_NO || "";
      if (exists) {
        return prev.map(po => po.PO_No === h.poNumber
          ? { PO_No: h.poNumber, Invoice_NO: invoiceVal }
          : po
        );
      } else {
        return [...prev, { PO_No: h.poNumber, Invoice_NO: invoiceVal }];
      }
    });

  } catch (err) {
    toast.error("Unable to load GRN details");
  }
};


// ---------------- FETCH ALL GRNs FOR TABLE ----------------


 const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "sellerName") {
    const selectedSupplier = suppliers.find(s => s.id === Number(value));
    setFormData(fd => ({
      ...fd,
      sellerName: selectedSupplier?.name || "",
      vendorId: Number(value) || 0
    }));

    // Fetch GRNs for the selected seller
    loadGrnNumbers(selectedSupplier?.name || "");
    return;
  }




  if (name === "grnNumber") {
    setFormData(fd => ({ ...fd, grnNumber: value }));
    fetchGRNDetails(value);
    return; // stop further processing for grnNumber
  }

  // For all other fields
  setFormData(fd => ({ ...fd, [name]: value }));
};


const handleAddItem = () => {
  const convert = (v) => (v === "" ? 0 : Number(v));

  if (!currentItem.itemName || !currentItem.taxType) {
    toast.error("Item Name & Tax Type required");
    return;
  }

  const item = {
    ...currentItem,
    taxType: currentItem.taxType,  // 🔥 MUST INCLUDE THIS

    receivedQty: convert(currentItem.receivedQty),
    approvedQty: convert(currentItem.approvedQty),
    damagedQty: convert(currentItem.damagedQty),

    cgst: convert(currentItem.cgst),
    sgst: convert(currentItem.sgst),
    igst: convert(currentItem.igst),

    receivedUnit: currentItem.receivedUnit || "pcs",
    approvedUnit: currentItem.approvedUnit || "pcs",
    damagedUnit: currentItem.damagedUnit || "pcs",
  };

  const newItems = [...formData.items, item];

  setFormData(fd => ({
    ...fd,
    items: newItems,
  }));

  setCurrentItem(emptyItem);
  updateTotals(newItems);
};
// ---------------- ITEM FIELD CHANGE HANDLER ----------------
const handleItemChange = (e) => {
  const { name, value } = e.target;

  setCurrentItem((prev) => ({
    ...prev,
    [name]: value
  }));

  // Auto-set CGST/SGST/IGST values when TaxType changes
  if (name === "taxType") {
    setCurrentItem((prev) => ({
      ...prev,
      taxType: value,
      cgst: value === "CGST" ? prev.cgst || 0 : 0,
      sgst: value === "SGST" ? prev.sgst || 0 : 0,
      igst: value === "IGST" ? prev.igst || 0 : 0,
    }));
  }
};

// ---------------- REMOVE ITEM ----------------
const handleRemoveItem = (idx) => {
  const newItems = formData.items.filter((_, i) => i !== idx);
  setFormData((fd) => ({
    ...fd,
    items: newItems,
  }));
  updateTotals(newItems);
};

// ---------------- EDIT ITEM ----------------
const handleEditItem = (item, idx) => {
  setCurrentItem(item);
  handleRemoveItem(idx);
};

// ---------------- TOTALS CALCULATION ----------------
const updateTotals = (items) => {
  let totalAmount = 0;
  let totalTaxAmount = 0;

  items.forEach((it) => {
    const qty = Number(it.receivedQty) || 0;
    const cgst = Number(it.cgst) || 0;
    const sgst = Number(it.sgst) || 0;
    const igst = Number(it.igst) || 0;

    totalTaxAmount += (cgst + sgst + igst) * qty;
    totalAmount += qty; // Replace with price * qty when available
  });

  setFormData((fd) => ({
    ...fd,
    totalAmount,
    totalTaxAmount,
    grandTotal: totalAmount + totalTaxAmount,
  }));
};
useEffect(() => {
    if (formData.poNumber && !poNumbers.find(po => po.PO_No === formData.poNumber)) {
      setPoNumbers(prev => [...prev, { PO_No: formData.poNumber, Invoice_NO: formData.invoiceNumber }]);
    }
  }, [formData.poNumber, formData.invoiceNumber, poNumbers]);
debugger;
// ---------------- SAVE GRN ----------------
const handleSave = async () => {
  if (!formData.sellerName || !formData.grnNumber) {
    toast.error("Seller Name & GRN Number are required");
    return;
  }

  const payload = {

  VendorId: Number(formData.vendorId) || 0, // int
          SellerName: formData.sellerName, // 🔥 must match backend property name

    grnNumber: formData.grnNumber,
    grnDate: formData.grnDate,
    poNumber: formData.poNumber,
    invoiceNumber: formData.invoiceNumber,
    invoiceDate: formData.invoiceDate,
    status: formData.status,
    vehicleNo: formData.vehicleNo,
    description: formData.description,
    totalAmount: formData.totalAmount,
    totalTaxAmount: formData.totalTaxAmount,
    grandAmount: formData.grandTotal,   // ✔ C# model requires GrandAmount
    items: formData.items.map(item => ({
      itemName: item.itemName,
      receivedQty: Number(item.receivedQty),
      approvedQty: Number(item.approvedQty),
      damagedQty: Number(item.damagedQty),
      unit: item.receivedUnit || "",
  TaxType: item.taxType,   // 🔥 FIXED HERE
      cgst: Number(item.cgst),
      sgst: Number(item.sgst),
      igst: Number(item.igst),
      description: item.description || ""
    }))
  };

  console.log("Sending Payload:", payload);

  try {
const response = await fetch(API_ENDPOINTS.SaveGRN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log("Server Response:", result);

    if (!response.ok || !result.success) {
      toast.error(result.message || "Failed to save GRN");
      return;
    }

    toast.success("GRN saved successfully!");

  } catch (error) {
    toast.error("Something went wrong!");
    console.error("Save Error:", error);
  }
};
const handleUpdate = async () => {
  if (!formData.grnNumber) {
    toast.error("Select GRN to update");
    return;
  }

  const payload = {
    VendorId: Number(formData.vendorId),
    SellerName: formData.sellerName,
    GRNNumber: formData.grnNumber,
    GRNDate: formData.grnDate,
    PO: formData.poNumber,
    InvoiceNumber: formData.invoiceNumber,
    Items: formData.items.map(item => ({
      itemName: item.itemName,
      receivedQty: Number(item.receivedQty),
      approvedQty: Number(item.approvedQty),
      damagedQty: Number(item.damagedQty),
      unit: item.receivedUnit,
      TaxType: item.taxType,
      cgst: Number(item.cgst),
      sgst: Number(item.sgst),
      igst: Number(item.igst),
      description: item.description || ""
    }))
  };

  try {
    const res = await fetch(`${API_ENDPOINTS.UpdateGRN}/${formData.grnNumber}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    if (res.ok && result.success) {
      toast.success("GRN updated successfully!");
    } else {
      toast.error(result.message || "Failed to update GRN");
    }
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong while updating GRN");
  }
};
const handleDeleteGRN = async (grnNumber) => {
  if (!grnNumber) return;

  Swal.fire({
    title: "Are you sure?",
    text: "This GRN will be permanently deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_ENDPOINTS.DeleteGRN}/${grnNumber}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (res.ok && data.success) {
          toast.success("GRN deleted successfully!");
          // Remove from local state
          setGrns(grns.filter(g => g.grnNumber !== grnNumber));
          setFormData({
            ...formData,
            grnNumber: "",
            items: [],
          });
        } else {
          toast.error(data.message || "Failed to delete GRN");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error deleting GRN");
      }
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
            <ToastContainer position="top-center" />
            <div
                style={{
                    background: "white",
                    padding: "25px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
            >
                <div style={{ borderRadius: '5px' }}>
                    <h4 style={{ color: '#0066cc', fontSize: '24px' }}>
                        Account  GRN
                    </h4>
                </div>

                {/* Form Section */}
                <div className="container p-2">
                    <div
                        style={{
                            background: "white",
                            padding: "25px",
                            borderRadius: "8px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                    >
                        <div className="row mb-3">
                            <div className="col-3 mb-3">
                      <label className="form-label text-primary fw-semibold">Seller Name</label>

                        <select
  className="form-select"
  name="sellerName"
  value={formData.vendorId || ""}
  onChange={handleChange}
>
  <option value="">Select Seller</option>
  {suppliers.map((s) => (
    <option key={s.id} value={s.id}>
      {s.name}
    </option>
  ))}
</select>








                            </div>
                            <div className="col-3 mb-3">
  <label className="form-label text-primary fw-semibold">GRN Number</label>
 <select  className="form-select"
  value={selectedGrn || ""}
  onChange={(e) => {
    const id = e.target.value;
    setSelectedGrn(id); // separate state
    setFormData((fd) => ({ ...fd, grnNumber: id })); // update formData
    fetchGRNDetails(id);
>>>>>>> 9320543beb32da4bd4d94e8c3eeeb3d206beeab7
  }}
>
  <div style={{ display: 'flex', gap: '30px' /* group left radio buttons with gap */ }}>

  <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
      <input
        type="radio"
        name="configTab"
        value="checkPayable"
        checked={selectedPage === 'checkPayable'}
        onChange={() => setSelectedPage('checkPayable')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
  Check Payable
    </label>
   <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
      <input
        type="radio"
        name="configTab"
        value="approvedPayable"
        checked={selectedPage === 'approvedPayable'}
        onChange={() => setSelectedPage('approvedPayable')}
        style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
      />
   Approved Payable
    </label>
 
  </div>

</div>




      {/* Render selected page with view prop */}
      <div>
        {selectedPage==='checkPayable'?(<CheckPayable/>):<ApprovedPayable/>
        
         
        }
      </div>
    </div>
  );
}

export default AccountGRN;
