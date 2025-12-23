
import React, { useState, useEffect } from "react";
import { Eye, Trash2, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "../components/Pagination";
import { API_ENDPOINTS } from "../config/apiconfig";

const API_BASE_URL = "https://localhost:7026/api";

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
    // Main data and auxiliary fetched options:
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

    // Data fetches
    useEffect(() => {
        fetchAllDropdowns();
        fetchGRNs();
    }, []);
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
    const fetchAllDropdowns = async () => {
        try {
            setLoading(true);
            const [
                suppliersRes,
                ledgerRes,
                grnRes,
                poRes,
                itemRes,
                // unitRes,
                statusRes,
            ] = await Promise.all([
                fetch(API_ENDPOINTS.suppliers),
                fetch(API_ENDPOINTS.Ledger),
                fetch(API_ENDPOINTS.GRN),
                fetch(API_ENDPOINTS.PONumber),
                fetch(API_ENDPOINTS.ItemNames),

                fetch(`${API_BASE_URL}/statuses`)
            ]);
            setSuppliers(await suppliersRes.json());
            setLedgerTypes(await ledgerRes.json());
            setGrnNumbers(await grnRes.json());
            setPoNumbers(await poRes.json());
            setItems(await itemRes.json());

            setStatusOptions(await statusRes.json());
        } catch {
            toast.error("Failed to fetch dropdown data");
        } finally {
            setLoading(false);
        }
    };

    const fetchGRNs = async () => {
        try {
            setLoading(true);
            const res = await fetch(API_ENDPOINTS.GRN);
            setGrns(await res.json());
        } catch (error) {
            toast.error("Error fetching GRNs");
        } finally {
            setLoading(false);
        }
    };

    // Input handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((fd) => ({ ...fd, [name]: value }));
    };
    const handleItemChange = (e) => {
        const { name, value } = e.target;
        setCurrentItem((it) => ({ ...it, [name]: value }));
    };

    // Add item to form
    const handleAddItem = () => {
        // Numeric fields conversion
        const convert = (val) => (val === "" ? 0 : Number(val));
        const item = {
            ...currentItem,
            receivedQty: convert(currentItem.receivedQty),
            approvedQty: convert(currentItem.approvedQty),
            damagedQty: convert(currentItem.damagedQty),
            cgst: convert(currentItem.cgst),
            sgst: convert(currentItem.sgst),
            igst: convert(currentItem.igst),
        };
        setFormData((fd) => ({
            ...fd,
            items: [...fd.items, item],
        }));
        setCurrentItem(emptyItem);
        updateTotals([...formData.items, item]);
    };

    // Remove item from local items list
    const handleRemoveItem = (idx) => {
        const newItems = formData.items.filter((_, i) => i !== idx);
        setFormData((fd) => ({
            ...fd,
            items: newItems,
        }));
        updateTotals(newItems);
    };

    // Edit item
    const handleEditItem = (item, idx) => {
        setCurrentItem(item);
        handleRemoveItem(idx);
    };

    // Calculate totals
    const updateTotals = (items) => {
        let totalAmount = 0, totalTaxAmount = 0;
        items.forEach((it) => {
            const qty = Number(it.receivedQty) || 0;
            const cgst = Number(it.cgst) || 0;
            const sgst = Number(it.sgst) || 0;
            const igst = Number(it.igst) || 0;
            // Dummy: tax sum, can use your backend's calculation logic
            const itemTax = cgst + sgst + igst;
            totalTaxAmount += itemTax * qty;
            // Dummy: just use qty, should multiply by item price if available
            totalAmount += qty;
        });
        setFormData((fd) => ({
            ...fd,
            totalAmount,
            totalTaxAmount,
            grandTotal: totalAmount + totalTaxAmount,
        }));
    };

    // Save GRN
    const handleSave = async () => {
        if (!formData.grnNumber || !formData.sellerName) {
            toast.error("Please fill all mandatory fields!");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(API_ENDPOINTS.GRN, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                toast.success("GRN saved successfully!");
                setFormData({
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
                fetchGRNs();
            } else {
                toast.error("Failed to save GRN!");
            }
        } catch {
            toast.error("Error saving GRN!");
        } finally {
            setLoading(false);
        }
    };

    // Delete GRN
    const handleDelete = async (grnNumber) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to delete this GRN?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`${API_ENDPOINTS.GRN}/${grnNumber}`, {
                        method: "DELETE",
                    });
                    if (res.ok) {
                        toast.success("GRN deleted!");
                        fetchGRNs();
                    } else {
                        toast.error("Failed to delete GRN!");
                    }
                } catch {
                    toast.error("Error deleting GRN!");
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
                                    value={formData.sellerName}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Seller</option>
                                    {suppliers.map((s, idx) => (
                                        <option key={idx} value={s.name}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-3 mb-3">
                                <label className="form-label text-primary fw-semibold">GRN Number</label>
                                <select
                                    className="form-select"
                                    name="grnNumber"
                                    value={formData.grnNumber}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select GRN No.</option>
                                    {grnNumbers.map((g, idx) => (
                                        <option key={idx} value={g.number || g.grnNumber}>{g.number || g.grnNumber}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-3 mb-3">
                                <label className="form-label text-primary fw-semibold">GRN Date</label>
                                <input
                                    className="form-control"
                                    type="date"
                                    name="grnDate"
                                    value={formData.grnDate}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-3 mb-3">
                                <label className="form-label text-primary fw-semibold">Invoice No / PO No</label>
                                <select
                                    className="form-select"
                                    name="poNumber"
                                    value={formData.poNumber}
                                    onChange={handleChange}
                                >
                                    <option value="">Select PO/Invoice No.</option>
                                    {poNumbers.map((po, idx) => (
                                        <option key={idx} value={po.poNumber || po.invoiceNo}>{po.poNumber || po.invoiceNo}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-3 mb-3">
                                <label className="form-label text-primary fw-semibold">Invoice Date</label>
                                <input
                                    className="form-control"
                                    type="date"
                                    name="invoiceDate"
                                    value={formData.invoiceDate}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-3 mb-3">
                                <label className="form-label text-primary fw-semibold">Status</label>
                                <select
                                    className="form-select"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Status</option>
                                    {statusOptions.map((s, idx) => (
                                        <option key={idx} value={s.value || s.status}>{s.label || s.status}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-3 mb-3">
                                <label className="form-label text-primary fw-semibold">Vehicle No</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="vehicleNo"
                                    value={formData.vehicleNo}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Items Entry */}
                        {/* <hr className="my-3" /> */}
                        <div className="row mb-2">
                            <div className="col-3">
                                <label className="form-label text-primary">Item Name</label>
                                <select
                                    className="form-select"
                                    name="itemName"
                                    value={currentItem.itemName}
                                    onChange={handleItemChange}
                                >
                                    <option value="">Select Item</option>
                                    {items.map((i, idx) => (
                                        <option key={idx} value={i.name || i.itemName}>{i.name || i.itemName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-2">
                                <label className="form-label text-primary">Received Qty</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    name="receivedQty"
                                    value={currentItem.receivedQty}
                                    onChange={handleItemChange}
                                />
                            </div>
                            <div className="col-1">
                                <label className="form-label text-primary">Unit</label>
                                <select
                                    className="form-select"
                                    name="receivedUnit"
                                    value={currentItem.receivedUnit}
                                    onChange={handleItemChange}
                                >
                                    <option value="">Unit</option>
                                    {unitOptions.map((u) => (
                                        <option key={u.value} value={u.value}>{u.label}</option>
                                    ))}
                                </select>

                            </div>
                            <div className="col-2">
                                <label className="form-label text-primary">Approved Qty</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    name="approvedQty"
                                    value={currentItem.approvedQty}
                                    onChange={handleItemChange}
                                />
                            </div>
                            <div className="col-1">
                                <label className="form-label text-primary">Unit</label>
                                <select
                                    className="form-select"
                                    name="receivedUnit"
                                    value={currentItem.receivedUnit}
                                    onChange={handleItemChange}
                                >
                                    <option value="">Unit</option>
                                    {unitOptions.map((u) => (
                                        <option key={u.value} value={u.value}>{u.label}</option>
                                    ))}
                                </select>

                            </div>
                            <div className="col-2">
                                <label className="form-label text-primary">Damaged Qty</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    name="damagedQty"
                                    value={currentItem.damagedQty}
                                    onChange={handleItemChange}
                                />
                            </div>
                            <div className="col-1">
                                <label className="form-label text-primary">Unit</label>
                                <select
                                    className="form-select"
                                    name="receivedUnit"
                                    value={currentItem.receivedUnit}
                                    onChange={handleItemChange}
                                >
                                    <option value="">Unit</option>
                                    {unitOptions.map((u) => (
                                        <option key={u.value} value={u.value}>{u.label}</option>
                                    ))}
                                </select>

                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-2">
                                <label className="form-label text-primary">Tax Type</label>
                                <select
                                    className="form-select"
                                    name="taxType"
                                    value={currentItem.taxType}
                                    onChange={handleItemChange}
                                >
                                    <option value="">Select Tax</option>
                                    {taxTypes.map((tt) => (
                                        <option key={tt.value} value={tt.value}>{tt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-2">
                                <label className="form-label text-primary">CGST</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    name="cgst"
                                    value={currentItem.cgst}
                                    onChange={handleItemChange}
                                />
                            </div>
                            <div className="col-2">
                                <label className="form-label text-primary">SGST</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    name="sgst"
                                    value={currentItem.sgst}
                                    onChange={handleItemChange}
                                />
                            </div>
                            <div className="col-2">
                                <label className="form-label text-primary">IGST</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    name="igst"
                                    value={currentItem.igst}
                                    onChange={handleItemChange}
                                />
                            </div>
                            <div className="col-4">
                                <label className="form-label text-primary">Description</label>
                                <input
                                    className="form-control"
                                    name="description"
                                    type="text"
                                    value={currentItem.description}
                                    onChange={handleItemChange}
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-primary my-2"
                            style={{ borderRadius: "6px", fontWeight: 600 }}
                            onClick={handleAddItem}
                        >
                            Add Item
                        </button>

                        {/* Items table */}
                        <div className="table-responsive">
                            <table className="table table-bordered align-middle mt-3">
                                <thead>
                                    <tr style={{ backgroundColor: "#f0f6ff" }}>
                                        <th className="text-primary " >Item Name</th>
                                        <th className="text-primary " >Received Qty + Unit</th>
                                        <th className="text-primary " >Approved Qty + Unit</th>
                                        <th className="text-primary " >Damaged Qty + Unit</th>
                                        <th className="text-primary " >CGST</th>
                                        <th className="text-primary " >SGST</th>
                                        <th className="text-primary " >IGST</th>
                                        <th className="text-primary " >Description</th>
                                        <th className="text-primary " >Edit</th>
                                        <th className="text-primary " >Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formData.items.length === 0 ? (
                                        <tr>
                                            <td colSpan={10} className="text-center text-muted">No items</td>
                                        </tr>
                                    ) : (
                                        formData.items.map((it, idx) => (
                                            <tr key={idx}>
                                                <td>{it.itemName}</td>
                                                <td>{it.receivedQty} {it.receivedUnit}</td>
                                                <td>{it.approvedQty} {it.approvedUnit}</td>
                                                <td>{it.damagedQty} {it.damagedUnit}</td>
                                                <td>{it.cgst}</td>
                                                <td>{it.sgst}</td>
                                                <td>{it.igst}</td>
                                                <td>{it.description}</td>
                                                <td style={{ textAlign: "center" }}>
                                                    <button className="btn btn-link" onClick={() => handleEditItem(it, idx)}>
                                                        <Eye size={16} />
                                                    </button>
                                                </td>
                                                <td style={{ textAlign: "center" }}>
                                                    <button className="btn btn-link text-danger" onClick={() => handleRemoveItem(idx)}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Totals */}
                        <div className="text-center" >
                            <span><b>Total Amount:</b> {formData.totalAmount}</span><br/>
                            <span><b>Total Tax Amount:</b> {formData.totalTaxAmount}</span><br/>
                            <span><b>Grand Total:</b> {formData.grandTotal}</span>
                        </div>
                        {/* Save / Cancel buttons */}
                        <div className="d-flex mb-4">
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="btn btn-primary me-2"
                                style={{ fontWeight: 600, borderRadius: "6px" }}
                            >
                                {loading ? <LoadingSpinner /> : "Save"}
                            </button>
                            <button
                                className="btn btn-danger fw-bold"
                                style={{ borderRadius: "6px" }}
                                onClick={() => setFormData((f) => ({
                                    ...f,
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
                                }))}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>

                   
                </div>
            </div>
        </div>
    );
};

export default AccountGRN;
