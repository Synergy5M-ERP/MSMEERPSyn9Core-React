import React, { useState, useEffect } from "react";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "../../components/Pagination";
import { API_ENDPOINTS } from "../../config/apiconfig";

function AccountVoucher() {
    // ----------------------
    // Main States
    // ----------------------
    const [otherVendor, setOtherVendor] = useState("");
    const [voucherCategory, setVoucherCategory] = useState("Vendor Voucher")
    const [voucherNo, setVoucherNo] = useState('');
    const [voucherType, setVoucherType] = useState('');
    const [voucherDate, setVoucherDate] = useState(new Date().toISOString().split("T")[0]);
    const [referenceNo, setReferenceNo] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [paymentMode, setPaymentMode] = useState('');   // selected value
    const [paymentModes, setPaymentModes] = useState([]); // list of payment modes
    const [statusList, setStatusList] = useState([]);  // list of statuses
    const [status, setStatus] = useState('');          // selected status
    const [description, setDescription] = useState('');
    const [vendorNames, setVendorNames] = useState([]);
    const [vendorName, setVendorName] = useState('');
    const [vendorNumber, setVendorNumber] = useState('');
    const [vouchers, setVouchers] = useState([]);
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [saleInvoices, setSaleInvoices] = useState([]);
    const [paymentDueDate, setPaymentDueDate] = useState('');
    const [voucherTypeId, setVoucherTypeId] = useState("");
    
    // Ledger grid row fields
    const [ledgerAccount, setLedgerAccount] = useState('');
    const [creditAmount, setCreditAmount] = useState('');
    const [debitAmount, setDebitAmount] = useState('');
    const [narration, setNarration] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);

    // Data
    const [gridEntries, setGridEntries] = useState([]);
    const [voucherTypes, setVoucherTypes] = useState([]);
    const [ledgerAccounts, setLedgerAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 4;
    const indexOfLast = currentPage * recordsPerPage;
    const indexOfFirst = indexOfLast - recordsPerPage;

    // ----------------------
    // Fetch initial dropdown data
    // ----------------------
    useEffect(() => {
        fetchVoucherTypeNames();
        fetchLedgerNames();
        fetchAllVouchers();
        fetchPaymentMode()
        fetchStatus()
    }, []);

    useEffect(() => {
        if (voucherCategory === "Vendor Voucher") {
            fetchVendorNames();
        } else {
            setVendorNames([]);     // clear vendors
            setVendorName('');
            setVendorNumber('');
        }
    }, [voucherCategory]);

    // ========================
    //  Fetching Functions
    // ========================

    const normalize = (json) =>
        Array.isArray(json) ? json : Array.isArray(json.data) ? json.data : json && typeof json === 'object' && !Array.isArray(json) ? [json] : [];

    const fetchVendorNames = async () => {
        try {
                const res = await fetch(API_ENDPOINTS.Vendors);
                console.log((res));
                
                const json = await res.json();
                setVendorNames(normalize(json));
        } catch (err) {
            toast.error("Failed to load vendors");
        }};

    const fetchVoucherTypeNames = async () => {
        try {
            const res = await fetch(API_ENDPOINTS.VoucherType);
            const json = await res.json();
            setVoucherTypes(Array.isArray(json) ? json : []); 
        } catch (err) {
            toast.error("Failed to load voucher types");
        }};

    const fetchLedgerNames = async () => {
        try {
            const res = await fetch(API_ENDPOINTS.Ledger);
            const json = await res.json();
            setLedgerAccounts(normalize(json));
        } catch (err) {
            toast.error("Failed to load ledger accounts");
        }};

    const fetchAllVouchers = async () => {
        try {
            const res = await fetch(API_ENDPOINTS.Voucher);
            const data = await res.text();

            if (!data) return;

            const json = JSON.parse(data);
            setVouchers(normalize(json));
        } catch (err) {
            toast.error("Failed to load vouchers");
        }
    };

    // -----------------------------
    // Fetch GRN or Invoice based on Voucher Type
    // -----------------------------
    useEffect(() => {
       
    if (!voucherType || voucherTypes.length === 0) return;

    const voucherTypeObj = voucherTypes.find(
        (v) => v.accountVoucherTypeId.toString() === voucherType.toString()
    );

    if (voucherTypeObj?.voucherType === "Payment") fetchPurchaseOrders();
    if (voucherTypeObj?.voucherType === "Receipt") fetchSalesInvoices();
    }, [voucherType, voucherTypes]);

    const fetchPurchaseOrders = async () => {
        try {
            const res = await fetch(API_ENDPOINTS.PurchaseOrders);       
            const json = await res.json();
            setPurchaseOrders(normalize(json));
        } catch (err) {
            toast.error("Failed to load GRN list");
        }
    };

    const fetchSalesInvoices = async () => {
        try {
            const res = await fetch(API_ENDPOINTS.SalesInvoices);
            const json = await res.json();
            setSaleInvoices(normalize(json));
        } catch (err) {
            toast.error("Failed to load Invoice list");
        }
    };

    // -----------------------------
    // Fetch Amount for GRN / Invoice
    // -----------------------------
    useEffect(() => {
    if (voucherCategory === "Other Voucher") {
        setTotalAmount("");
        setVendorName("");
        setVoucherNo("")
    }
    }, [voucherCategory]);

    const fetchGRNAmount = async (refId) => {
        if (!refId) return;
        try {
            const res = await fetch(`${API_ENDPOINTS.GetPurchaseAmountById}?referenceId=${refId}`);
            const json = await res.json();
            if (json.success) setTotalAmount(json.totalAmount);
        } catch (err) {
            toast.error("Failed to fetch GRN amount");
        }
    };

    const fetchInvoiceAmount = async (refId) => {
        if (!refId) return;
        try {
            const res = await fetch(`${API_ENDPOINTS.GetSaleAmountById}?referenceId=${refId}`);
            const json = await res.json();
            if (json.success) setTotalAmount(json.totalAmount);
        } catch (err) {
            toast.error("Failed to fetch invoice amount");
        }
    };

    const fetchPaymentMode = async () => {
    try {
        const res = await fetch(API_ENDPOINTS.PaymentMode);
        const json = await res.json();
        setPaymentModes(normalize(json));   // <-- FIXED
    } catch (err) {
        toast.error("Failed to load Payment Mode");
    } finally {
        setFetchLoading(false);
    }};

    const fetchStatus = async () => {
        try {
            const res = await fetch(API_ENDPOINTS.Status);
            const json = await res.json();
            setStatusList(normalize(json));
        } catch (err) {
            toast.error("Failed to load Status");
        } finally {
            setFetchLoading(false);
        }};
    
    // ----------------------
    // Vendor number auto-generate
    // ----------------------
    useEffect(() => {
        if (voucherCategory === "Other Voucher") {
           generateOtherVoucherNo()
        }
    }, [voucherCategory, vouchers]);

    const generateOtherVoucherNo = async () => {
        try {
            const res = await fetch(
                `${API_ENDPOINTS.GetNextVoucherNumber}?prefix=OV`
            );
            const json = await res.json();

            if (json.success) {
                setVendorNumber(json.voucherNo);
                setOtherVendor("Other Vendor");
            } else {
                toast.error("Failed to generate Other Voucher number");
            }
        } catch (err) {
            toast.error("Error generating Other Voucher number");
        }
    };

    const handleVendorChange = async (vendorId) => {
        setVendorName(vendorId);

        const vendor = vendorNames.find(v => v.vendorId == vendorId);
        if (!vendor) {
            setVendorNumber("");
            return;
        }

        const prefix = vendor.company_Name
            .split(" ")
            .map(w => w[0].toUpperCase())
            .join("")
            .substring(0, 3);

        try {
            const res = await fetch(
                `${API_ENDPOINTS.GetNextVoucherNumber}?vendorId=${vendorId}&prefix=${prefix}`
            );
            const json = await res.json();

            if (json.success) {
                setVendorNumber(json.voucherNo);
            } else {
                toast.error("Failed to generate voucher number");
            }
        } catch (err) {
            toast.error("Error generating voucher number");
        }
    };

    const handleAddToGrid = () => {
        if (!ledgerAccount || (!creditAmount && !debitAmount) || !narration.trim()) {
            toast.warning("Fill all ledger fields");
            return;
        }

        const selectedLedger = ledgerAccounts.find(
            (a) => a.id == ledgerAccount || a.accountLedgerId == ledgerAccount
        );

        const totalDebit = gridEntries.reduce((sum, e) => sum + e.debitAmount, 0);
        const totalCredit = gridEntries.reduce((sum, e) => sum + e.creditAmount, 0);

        const newDebit = parseFloat(debitAmount) || 0;
        const newCredit = parseFloat(creditAmount) || 0;

        // Validate against totalAmount
        if (totalDebit + newDebit > parseFloat(totalAmount)) {
        toast.error("Debit amount exceeds total voucher amount!");
        return;
        }

        if (totalCredit + newCredit > parseFloat(totalAmount)) {
        toast.error("Credit amount exceeds total voucher amount!");
        return;
        }

        const newEntry = {
            id: Date.now(),
            ledgerId: ledgerAccount,
            ledgerName: typeof selectedLedger?.accountLedgerName === 'string' ? selectedLedger.accountLedgerName : 'Unknown',
            creditAmount: Number(creditAmount) || 0,
            debitAmount: Number(debitAmount) || 0,
            narration,
        };

        if (editingIndex !== null) {
            const updated = [...gridEntries];
            updated[editingIndex] = newEntry;
            setGridEntries(updated);
            setEditingIndex(null);
            toast.success("Entry updated");
        } else {
            setGridEntries([...gridEntries, newEntry]);
            toast.success("Entry added");
        }

        setLedgerAccount("");
        setCreditAmount("");
        setDebitAmount("");
        setNarration("");
    };

    const handleReferenceNo = async () =>{
        setTotalAmount('');
        setPaymentDueDate('');
        setPaymentMode('');
        setStatus('');
        setDescription('');
        setGridEntries([]);   // Clear table rows

        // Optional → clear ledger input fields too
        setLedgerAccount('');
        setCreditAmount('');
        setDebitAmount('');
        setNarration('');
    };

    // ----------------------
    // Save Voucher
    // ----------------------
const handleSave = async () => {
    // Trim strings
    const trimmedVoucherNo = vendorNumber?.trim() || "";
    const trimmedReferenceNo = referenceNo?.trim() || "";
    const trimmedDescription = description?.trim() || "";

    const isExists = vouchers.some(
        v => v.voucherNo?.toLowerCase() === trimmedVoucherNo.toLowerCase()
    );

    if (isExists) {
        toast.error("Voucher number already exists. Please try again.");
        return;
    }   

    // Parse numeric fields
    const parsedTotalAmount = parseFloat(totalAmount);
  
    // Validation
    if (voucherCategory === "Vendor Voucher" && !vendorName)
    return toast.warning("Vendor is required!");

    if (voucherCategory === "Other Voucher" && !otherVendor.trim())
    return toast.warning("Other Vendor is required!");

    if (voucherCategory === "Vendor Voucher" && trimmedReferenceNo === "") {
    return toast.warning("Reference number is required!");
    }

    if (voucherCategory === "Other Voucher" && trimmedReferenceNo === "") {
        return toast.warning("Other reference number is required!");
    }

    if (trimmedVoucherNo === "") return toast.warning("Voucher number is required!");
    if (!voucherType) return toast.warning("Voucher type is required!");
    if (!voucherDate) return toast.warning("Voucher date is required!");
    if (!paymentDueDate) return toast.warning("Payment due date is required!");
    if (isNaN(parsedTotalAmount) || parsedTotalAmount <= 0)
        return toast.warning("Total amount must be a valid number greater than 0!");
    if (!paymentMode) return toast.warning("Payment mode is required!");
    if (!status) return toast.warning("Status is required!");
    if (trimmedDescription === "") return toast.warning("Description is required!");
    if (!gridEntries.length) return toast.warning("Add at least one ledger entry!");

    // Validate ledger entries
    for (let i = 0; i < gridEntries.length; i++) {
        const e = gridEntries[i];
        if (!e.ledgerId) return toast.warning(`Ledger ID missing in row ${i + 1}`);
        if ((parseFloat(e.creditAmount) || 0) < 0 || (parseFloat(e.debitAmount) || 0) < 0)
            return toast.warning(`Invalid amount in ledger row ${i + 1}`);
    }

    // Prepare payload
    const payload = {
        voucherNo: trimmedVoucherNo,
        voucherCategory: voucherCategory,
        vendorId: voucherCategory === "Vendor Voucher" ? vendorName : null,
        otherVendor: voucherCategory === "Other Voucher" ? otherVendor.trim() : null, 
        accountVoucherTypeId: parseInt(voucherType),
        voucherDate:voucherDate,       
        referenceNo: voucherCategory === "Vendor Voucher" ? trimmedReferenceNo : 0,        
        otherReferenceNo: voucherCategory === "Other Voucher" ? trimmedReferenceNo : null,           
        totalAmount: parsedTotalAmount,
        paymentDueDate:paymentDueDate,
        paymentModeId: paymentMode,
        accountStatusId: status,
        description: trimmedDescription,
       
        ledgerEntries: gridEntries.map(e => ({
            accountLedgerId: e.ledgerId,         // numeric ID
            creditAmount: parseFloat(e.creditAmount) || 0,
            debitAmount: parseFloat(e.debitAmount) || 0,
            description: e.narration?.trim() || ""
        }))
    };

    console.log(payload)

    setLoading(true);

    try {
        const res = await fetch(API_ENDPOINTS.AccountVoucher, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        console.log(res)

        const json = await res.json();

        if (json.success) {
            toast.success("Voucher saved successfully!");
            
            setVouchers(prev => [
                ...prev,
                { voucherNo: trimmedVoucherNo, vendorId: vendorName }
                ]);
                
                setNarration('')
                setVendorName('')
                setVendorNumber('')
                setVoucherDate(new Date().toISOString().split("T")[0])
                setVoucherNo('')
                setVoucherType('')
                setReferenceNo('')
                setTotalAmount('');
                setPaymentDueDate('');
                setPaymentMode('');
                setStatus('');
                setDescription('');
                setGridEntries([]);   // Clear table rows

                // Optional → clear ledger input fields too
                setLedgerAccount('');
                setCreditAmount('');
                setDebitAmount('');
                setNarration('');                   

        } else {
            toast.error(json.message || "Save failed!");
        }
    } catch (err) {
        toast.error(err.message || "Save failed due to network error!");
    } finally {
        setLoading(false);
    }
};

    if (fetchLoading) return <LoadingSpinner />;

    function LoadingSpinner() {
        return (
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "rgba(255,255,255,0.7)",
                    zIndex: 2000,
                }}
            >
                <Loader2 className="animate-spin" size={48} />
            </div>
        );
    }

    // =========================================
    // UI STARTS HERE
    // =========================================

    return (
        <div className="container-fluid p-3" style={{ minHeight: '100vh', background: '#f5f5f5', padding: '20px' }}>
            <ToastContainer position="top-right" autoClose={2000} />

            <div className="bg-white p-3 rounded shadow scrollbar">

                {/* ---------------------- */}
                {/* Voucher Header Section */}
                {/* ---------------------- */}
                <div className="row mb-2">
                    <div className="col-3">
                        <label className="form-label text-primary">Vendor Category*</label>
                        <select className="form-select" value={voucherCategory}
                            onChange={(e) => setVoucherCategory(e.target.value)}>
                            <option value="">--Select Voucher Category--</option>
                            <option value="Other Voucher">Other Voucher</option>
                            <option value="Vendor Voucher">Vendor Voucher</option>
                        </select>
                    </div>

                    <div className="col-3">
                        <label className="form-label text-primary">Vendor*</label>
                        {voucherCategory === "Vendor Voucher" && (
                                <select className="form-select" value={vendorName}                       
                                    onChange={(e) => handleVendorChange(e.target.value)}>
                               
                                    <option value="">--Select Vendor--</option>
                                    {Array.isArray(vendorNames) &&
                                        vendorNames.map((v) => (
                                            <option key={v.vendorId} value={v.vendorId}>
                                                {typeof v.company_Name === "string"
                                                    ? v.company_Name
                                                    : "Unknown"}
                                            </option>
                                        ))}
                                </select>
                            )}

                            {voucherCategory === "Other Voucher" && (
                                <input type="text" className="form-control" value={otherVendor} readOnly/>                                                                    
                            )}
                    </div>

                    <div className="col-3">
                        <label className="form-label text-primary">Voucher Number*</label>
                        <input type="text" value={vendorNumber}
                        className="form-control" disabled={loading} readOnly />
                    </div>

                    <div className="col-3">
                        <label className="form-label text-primary">Voucher Type*</label>
                        <select
                            className="form-select"
                            value={voucherType}
                            onChange={(e) => setVoucherType(e.target.value)}
                        >
                            <option value="">--Select Voucher Type--</option>
                            {Array.isArray(voucherTypes) ? voucherTypes.map((t) => (
                                <option key={t.accountVoucherTypeId} value={t.accountVoucherTypeId}>
                                    {typeof t.voucherType === 'string' ? t.voucherType : 'Unknown'}
                                </option>
                            )) : []}
                        </select>
                    </div>
                </div>
                <div className="row mb-2">
                    <div className="col-3">
                        <label className="form-label text-primary">Voucher Date*</label>
                        <input
                            type="date"
                            className="form-control"
                            value={voucherDate}
                            onChange={(e) => setVoucherDate(e.target.value)}
                        />
                    </div>

                    <div className="col-3">
                        <label className="form-label text-primary">Reference No*</label>
                         {voucherCategory === "Vendor Voucher" ? (
                            (() => {
                                const voucherTypeObj = voucherTypes.find(
                                    (v) => v.accountVoucherTypeId.toString() === voucherType.toString()
                                );

                                if (voucherTypeObj?.voucherType === "Payment") {
                                    return (
                                        <select className="form-select" value={referenceNo}                                                                              
                                            onChange={(e) => {
                                                setReferenceNo(e.target.value);
                                                handleReferenceNo();
                                                fetchGRNAmount(parseInt(e.target.value));
                                            }}>
                                        
                                            <option value="">--Select GRN--</option>
                                            {Array.isArray(purchaseOrders) &&
                                                purchaseOrders.map((p) => (
                                                    <option key={p.id} value={p.id}>
                                                        {typeof p.purchaseOrderNo === "string"
                                                            ? p.purchaseOrderNo
                                                            : "Unknown"}
                                                    </option>
                                                ))}
                                        </select>
                                    );
                                } else if (voucherTypeObj?.voucherType === "Receipt") {
                                    return (
                                        <select className="form-select" value={referenceNo}                                                                           
                                            onChange={(e) => {
                                                setReferenceNo(e.target.value);
                                                handleReferenceNo();
                                                fetchInvoiceAmount(parseInt(e.target.value));
                                            }}>
                                        
                                            <option value="">--Select Invoice--</option>
                                            {Array.isArray(saleInvoices) &&
                                                saleInvoices.map((i) => (
                                                    <option key={i.id} value={i.id}>
                                                        {typeof i.invoiceNo === "string"
                                                            ? i.invoiceNo
                                                            : "Unknown"}
                                                    </option>
                                                ))}
                                        </select>
                                    );
                                } else {
                                    return (
                                        <input className="form-control" value={referenceNo}                                                                                     
                                            onChange={(e) => {
                                                setReferenceNo(e.target.value);
                                                handleReferenceNo();
                                            }}/>                                        
                                    );
                                }
                            })()
                        ) : (
                            // For Other Voucher, just show a read-only input or nothing
                            <input type="text" className="form-control" value={referenceNo}     
                                    onChange={(e) => setReferenceNo(e.target.value)} placeholder="Enter Reference No"/>                                                                       
                        )}
                    </div>

                     <div className="col-3">
                        <label className="form-label text-primary">Total Amount*</label>
                        <input className="form-control" value={totalAmount}
                                type ="number" onChange={(e) => setTotalAmount(e.target.value)}
                                readOnly={voucherCategory !== "Other Voucher"}
                                placeholder={
                                    voucherCategory === "Other Voucher"
                                    ? "Enter Total Amount"
                                    : ""
                                } />
                    </div>

                     <div className="col-3">
                        <label className="form-label text-primary">Payment Due Date*</label>
                        <input
                            type="date"
                            className="form-control"
                            value={paymentDueDate}
                            onChange={(e) => setPaymentDueDate(e.target.value)}
                        />
                    </div>
                </div>

                <div className="row">                  
                    <div className="col-3">
                        <label className="form-label text-primary">Payment Mode*</label>
                        <select
                            className="form-select"
                            value={paymentMode}
                            onChange={(e) => setPaymentMode(e.target.value)}
                        >
                            <option value="">--Select Payment Mode--</option>
                            {Array.isArray(paymentModes) ? paymentModes.map((t) => (
                               <option key={t.paymentModeId} value={t.paymentModeId}>{typeof t.paymentMode === 'string' ? t.paymentMode : 'Unknown'}</option>
                            )) : []}
                        </select>
                    </div>

                     <div className="col-3">
                        <label className="form-label text-primary">Status*</label>
                        <select value={status} onChange={e => setStatus(e.target.value)} className="form-control" disabled={loading}>
                            <option value="">--Select Status--</option>
                            {Array.isArray(statusList) ? statusList.map((t) => (
                               <option key={t.accountStatusId} value={t.accountStatusId}>{typeof t.status === 'string' ? t.status : 'Unknown'}</option>
                            )) : []}
                        </select>
                    </div>
                {/* </div>

                <div className="row">                    */}
                    <div className="col-6">
                        <label className="form-label text-primary">Description*</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} className="form-control" rows={2} />
                    </div>
                </div>

                {/* ---------------------- */}
                {/* Ledger Section */}
                {/* ---------------------- */}

                <div className="row">
                    <div className="col-4">
                        <label className="form-label text-primary fw-semibold">Ledger Account
                        <span style={{ color: 'red' }}>*</span>
                        </label>
                        <select
                            className="form-select"
                            value={ledgerAccount}
                            onChange={(e) => setLedgerAccount(e.target.value)}
                        >
                            <option value="">--Select--</option>
                            {Array.isArray(ledgerAccounts) ? ledgerAccounts.map((l) => (
                                <option key={l.id || l.accountLedgerId} value={l.id || l.accountLedgerId}>
                                    {typeof l.accountLedgerName === 'string' ? l.accountLedgerName : 'Unknown'}
                                </option>
                            )) : []}
                        </select>
                    </div>

                    <div className="col-4">
                        <label className="form-label text-primary fw-semibold">Credit Amoungt<span style={{ color: 'red' }}>*</span></label>
                        <input
                            className="form-control"
                            type="number"
                            value={creditAmount}
                            onChange={(e) => setCreditAmount(e.target.value)}
                        />
                    </div>

                    <div className="col-4">
                        <label className="form-label text-primary fw-semibold">Debit Amount<span style={{ color: 'red' }}>*</span></label>
                        <input
                            className="form-control"
                            type="number"
                            value={debitAmount}
                            onChange={(e) => setDebitAmount(e.target.value)}
                        />
                    </div>
                </div>

                <div className="row mb-2">
                    <div className="col-12">
                        <label className="form-label text-primary fw-semibold">Narration <span style={{ color: 'red' }}>*</span></label>
                        <textarea
                            className="form-control"
                            value={narration}
                            onChange={(e) => setNarration(e.target.value)}
                        />
                    </div>
                </div>

                {/* Add Button */}
                <div className="mt-2 mb-4">
                    <button
                        className="btn btn-primary save"
                        onClick={handleAddToGrid}
                        disabled={!ledgerAccount || (!creditAmount && !debitAmount) || !narration.trim()}
                        style={{ fontWeight: 600, borderRadius: '6px', minWidth: 120 }}
                    >
                        {editingIndex !== null ? 'Update' : 'Add'}
                    </button>
                </div>

                {/* ---------------------- */}
                {/* Ledger Grid Table */}
                {/* ---------------------- */}

                {gridEntries.length > 0 && (
                    <>
                    <div style={{marginBottom: '1.5rem'}}>
                        <table className="table table-bordered">
                            <thead>
                                <tr style={{ backgroundColor: "#f0f6ff" }}>
                                    <th>Ledger</th>
                                    <th>Credit</th>
                                    <th>Debit</th>
                                    <th>Narration</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>

                            <tbody>
                                {gridEntries.map((row, i) => (
                                    <tr key={row.id}>
                                        <td>{typeof row.ledgerName === 'string' ? row.ledgerName : 'Unknown'}</td>
                                        <td>{row.creditAmount}</td>
                                        <td>{row.debitAmount}</td>
                                        <td>{row.narration}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-warning"
                                                onClick={() => {
                                                    setEditingIndex(i);
                                                    setLedgerAccount(row.ledgerId);
                                                    setCreditAmount(row.creditAmount);
                                                    setDebitAmount(row.debitAmount);
                                                    setNarration(row.narration);
                                                }}
                                            >
                                                <Edit size={16} />
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => {
                                                    setGridEntries(
                                                        gridEntries.filter((_, idx) => idx !== i)
                                                    );
                                                    toast.info("Entry removed");
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                        <div className="mt-3 d-flex gap-2">
                            <button
                                className="btn btn-success"
                                disabled={loading}
                                onClick={handleSave}
                            >
                                Save
                            </button>

                            <button
                                className="btn btn-secondary"
                                onClick={() => window.location.reload()}
                            >
                                Reset
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default AccountVoucher;
