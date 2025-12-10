
import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Save, Loader2 } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import Pagination from '../../components/Pagination';
import { API_ENDPOINTS } from '../../config/apiconfig.js';

function AccountVoucher() {
    // Main voucher fields
    const [voucherNo, setVoucherNo] = useState('');
    const [voucherType, setVoucherType] = useState('');
    const [voucherDate, setVoucherDate] = useState('');
    const [referenceNo, setReferenceNo] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [paymentMode, setPaymentMode] = useState('');
    const [status, setStatus] = useState('');
    const [description, setDescription] = useState('');
    const [vendorNames, setVendorNames] = useState([]);
    const [vendorName, setVendorName] = useState('');
    const [vendorNumber, setVendorNumber] = useState('');
    const [vouchers, setVouchers] = useState([]);
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [saleInvoices, setSaleInvoices] = useState([]);
    const [paymentDueDate, setPaymentDueDate] = useState('');
    
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
    const [throughOptions] = useState(['Bank', 'Cash']);
    const [statusOptions] = useState(['Draft', 'Posted', 'Approved', 'Cancelled']);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 4;
    const indexOfLast = currentPage * recordsPerPage;
    const indexOfFirst = indexOfLast - recordsPerPage;
    const currentRecords = gridEntries.slice(indexOfFirst, indexOfLast);

    // On mount, fetch dropdowns
    useEffect(() => {
        fetchLedgerNames();
        fetchVoucherTypeNames();
        fetchVendorNames()
        fetchAllVouchers();  // <-- added
    }, []);

    //Generate Vendor number
    const handleVendorChange = (vendorId) => {
    setVendorName(vendorId);

    const vendor = vendorNames.find(v => v.vendorId == vendorId);
    if (!vendor) {
        setVendorNumber("");
        return;
    }

    // 1. Generate prefix (first letter of each word)
    const prefix = vendor.companyName
        .split(" ")
        .filter(x => x.trim().length > 0)
        .map(w => w[0].toUpperCase())
        .join("")
        .substring(0, 3);

    // 2. Find matching voucher numbers (must have vouchers list loaded)
    const matching = vouchers.filter(v =>
        v.voucherNo && v.voucherNo.startsWith(prefix)
    );

    // 3. Calculate next number
    let next = 1;
    if (matching.length > 0) {
        const nums = matching.map(m =>
            parseInt(m.voucherNo.split("-")[1])
        );
        next = Math.max(...nums) + 1;
    }

    // 4. Final vendor number
    setVendorNumber(`${prefix}-${String(next).padStart(3, "0")}`);
};

   const fetchAllVouchers = async () => {
    try {
        const res = await fetch(API_ENDPOINTS.Voucher);

        console.log("Calling Voucher API:", API_ENDPOINTS.Voucher);

        if (!res.ok) {
            console.error("HTTP Error:", res.status);
            toast.error(`Voucher API returned ${res.status}`);
            return;
        }

        // Read raw text
        const text = await res.text();

        if (!text) {
            console.error("Empty response from server");
            toast.error("Voucher API returned empty response");
            return;
        }

        // Try parsing JSON
        let json;
        try {
            json = JSON.parse(text);
        } catch (err) {
            console.error("Invalid JSON:", text);
            toast.error("Invalid JSON from Voucher API");
            return;
        }

        const list = Array.isArray(json)
            ? json
            : json.data || [];

        setVouchers(list);

    } catch (err) {
        console.error("Voucher Fetch Error:", err);
        toast.error("Failed to load vouchers");
    }
};
   
    //fetch all vendor names 
    const fetchVendorNames = async () => {
    try {
        const res = await fetch(API_ENDPOINTS.Vendors);

        const json = await res.json();

        setVendorNames(json.data || []);
    } catch (err) {
        console.error("Vendor Fetch Error:", err);
    }
    };

    //fetch all ledger names
   const fetchLedgerNames = async () => {
    setFetchLoading(true);
    try {
        // Fetch Ledger accounts
        const ledgerRes = await fetch(API_ENDPOINTS.Ledger);
           
        if (ledgerRes.ok) {
            const ledgerData = await ledgerRes.json();

            const list = Array.isArray(ledgerData.data)
            ? ledgerData.data
            : Array.isArray(ledgerData)
            ? ledgerData
            : [];

        setLedgerAccounts(list);
        }
    } catch (err) {
        console.error("Ledger fetch error:", err);
        toast.error("Dropdown fetch error");
    } finally {
        setFetchLoading(false);
    }};

    // fetch all voucher type name
    const fetchVoucherTypeNames = async () => {
    setFetchLoading(true);
    try {
        const voucherRes = await fetch(API_ENDPOINTS.VoucherType);

        if (!voucherRes.ok) throw new Error("Failed to fetch voucher type");

        const voucherData = await voucherRes.json();

        // Works for both: [] OR {data: []}
        const list1 = Array.isArray(voucherData)
            ? voucherData
            : Array.isArray(voucherData.data)
            ? voucherData.data
            : [];

        setVoucherTypes(list1);

    } catch (err) {
        console.error("Voucher type fetch error:", err);
        toast.error("Dropdown fetch error");
    } finally {
        setFetchLoading(false);
    }};

    // fetch purchase order number
    useEffect(() => {
    if (voucherType === "Payment") {
        fetchPurchaseOrders();
    }
    if (voucherType === "Receipt") {
        fetchSalesInvoices();
    }
}, [voucherType]);

const fetchPurchaseOrders = async () => {
    try {
        const res = await fetch(API_ENDPOINTS.PurchaseOrders);
        const json = await res.json();
        setPurchaseOrders(json.data || []);
    } catch (err) {
        console.error("Purchase Order Fetch Error:", err);
    }
};

const fetchSalesInvoices = async () => {
    try {
        const res = await fetch(API_ENDPOINTS.SalesInvoices);
        const json = await res.json();
        setSaleInvoices(json.data || []);
    } catch (err) {
        console.error("Sales Invoice Fetch Error:", err);
    }
};

const fetchAmountByReference = async (refId) => {
    try {
        const res = await fetch(`${API_ENDPOINTS.GetPurchaseAmountById}?referenceId=${refId}`);
        const json = await res.json();

        if (json.success) {
            setTotalAmount(json.totalAmount);
        }
    } catch (err) {
        console.error("Amount fetch error:", err);
    }
};

    // Auto-update total amount on grid change
    // useEffect(() => {
    //     const total = gridEntries.reduce((sum, entry) => sum + (parseFloat(entry.debitAmount) || 0), 0);
    //     setTotalAmount(total.toFixed(2));
    // }, [gridEntries]);

    // Add or update ledger entry   
    const handleAddToGrid = () => {
        if (!ledgerAccount || (!creditAmount && !debitAmount) || !narration.trim()) {
            toast.warning('Fill all ledger fields');
            return;
        }

        const selectedLedger = ledgerAccounts.find(a => 
            a.id == ledgerAccount || a.accountLedgerId == ledgerAccount
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
            voucherNo,
            referenceNo: voucherType === 'payment' ? referenceNo : '',
            invoiceNo: voucherType === 'receipt' ? referenceNo : '',
            // ledgerAccount,
            ledgerId: ledgerAccount,             // ← Save ID for DB
            ledgerName: selectedLedger?.accountLedgerName || "",  // ← Save Name for display
            creditAmount: parseFloat(newCredit) || 0,
            debitAmount: parseFloat(newDebit) || 0,
            narration
        };
        if (editingIndex !== null) {
            const updated = [...gridEntries];
            updated[editingIndex] = newEntry;
            setGridEntries(updated);
            setEditingIndex(null);
            toast.success('Entry updated');
        } else {
            setGridEntries([...gridEntries, newEntry]);
            toast.success('Entry added');
        }
        setLedgerAccount('');
        setCreditAmount('');
        setDebitAmount('');
        setNarration('');
    };

    const handleEditEntry = (index) => {
        const entry = gridEntries[index];
        setLedgerAccount(entry.ledgerId);
        setCreditAmount(entry.creditAmount);
        setDebitAmount(entry.debitAmount);
        setNarration(entry.narration);
        setEditingIndex(index);
    };

    const handleDeleteEntry = async (index) => {
        const confirm = await Swal.fire({
            title: 'Delete this entry?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d'
        });
        if (confirm.isConfirmed) {
            const updated = gridEntries.filter((_, i) => i !== index);
            setGridEntries(updated);
            toast.success('Entry deleted');
        }
    };

    // Save voucher (all data + gridEntries)
    const handleSave = async () => {
        if (!voucherNo || !vendorName || !voucherType || !voucherDate || !referenceNo || !paymentDueDate ||
            !totalAmount || !paymentMode ||  !status || !description) 
        {
            toast.warning("Fill all required fields");
            return;
        }
        if (gridEntries.length === 0) {
            toast.warning('Add at least one ledger entry');
            return;
        }
        setLoading(true);
        try {
            const payload = {
                voucherNo,
                voucherType,
                voucherDate,
                referenceNo,
                totalAmount: parseFloat(totalAmount),
                paymentDueDate,
                paymentMode,
                status,
                description,
                ledgerEntries: gridEntries.map(e =>({
                    ledgerId: e.ledgerId,
                    creditAmount: e.creditAmount,
                    debitAmount: e.debitAmount,
                    narration: e.narration
                }))
            };
            const res = await fetch(API_ENDPOINTS.Voucher, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error(await res.text());
            const result = await res.json();
            if (result.success) {
                toast.success('Voucher saved');
                handleCancel();
            } else {
                throw new Error(result.message || 'API Error');
            }
        } catch (err) {
            toast.error(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Reset form
    const handleCancel = () => {
        setVoucherNo('');
        setVoucherType('');
        setVoucherDate('');
        setReferenceNo('');
        setTotalAmount('');
        setPaymentDueDate('');
        setPaymentMode('');
        setStatus('');
        setDescription('');
        setLedgerAccount('');
        setCreditAmount('');
        setDebitAmount('');
        setNarration('');
        setGridEntries([]);
        setEditingIndex(null);
        toast.info('Form cleared');
    };

    if (fetchLoading) return <LoadingSpinner />;

    function LoadingSpinner() {
        return (
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                backgroundColor: 'rgba(255,255,255,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000
            }}>
                <Loader2 className="animate-spin" size={48} color="#007bff" />
                <style>{`
            .animate-spin { animation: spin 1s linear infinite; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          `}</style>
            </div>
        );
    }

    return (
        <div className="container-fluid" style={{ minHeight: '100vh', background: '#f5f5f5', padding: '20px' }}>
            <ToastContainer position="top-right" autoClose={2000} />
           
            <div className="bg-white p-3 rounded shadow scrollbar">
                {/* Voucher static details */}
                
                <div className="row mb-2">
                       <div className="col-3">
                    <label className="form-label text-primary">Vendor Name*</label>
                    <select value={vendorName}
                            onChange={(e) => handleVendorChange(e.target.value)}
                            disabled={loading} className="form-select">
                    <option value="">--Select Vendor--</option>
                    {vendorNames.map(vt => (
                    <option key={vt.vendorId} value={vt.vendorId}>{vt.companyName}</option>
                    ))}
                    </select>
                    </div>
                    <div className="col-3">
                        <label className="form-label text-primary">Voucher Number*</label>
                        <input type="text" value={vendorNumber} 
                        className="form-control" disabled={loading} readOnly />
                    </div>

                 

                    <div className="col-3">
                        <label className="form-label text-primary">Voucher Type*</label>
                        <select value={voucherType} 
                                onChange={e => setVoucherType(e.target.value)} disabled={loading} className="form-select">
                            <option value="">--Select Type--</option>
                            {voucherTypes.map(vt => (
                                <option key={vt.accountVoucherTypeId} value={vt.accountVoucherTypeId}>{vt.voucherType}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-3">
                        <label className="form-label text-primary">Voucher Date*</label>
                        <input type="date" value={voucherDate} onChange={e => setVoucherDate(e.target.value)} className="form-control" disabled={loading} />
                    </div>
                </div>

                <div className="row">
                    <div className="col-3">
                    {/* Reference Number Handling */}
                    <label className="form-label text-primary">Reference Number*</label>

                    {/* Payment Voucher → Purchase Orders */}
                    {voucherType === "Payment" && (
                        <select
                            className="form-select"
                            value={referenceNo}
                            onChange={(e) => {
                                const refId = e.target.value;
                                setReferenceNo(refId);
                                fetchAmountByReference(refId);
                            }}
                        >
                            <option value="">--Select Purchase Order--</option>
                            {purchaseOrders.map(po => (
                                <option key={po.id} value={po.id}>
                                    {po.purchaseOrderNo}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Receipt Voucher → Sales Invoices */}
                    {voucherType === "Receipt" && (
                        <select
                            className="form-select"
                            value={referenceNo}
                            onChange={(e) => setReferenceNo(e.target.value)}
                        >
                            <option value="">--Select Sale Invoice--</option>
                            {saleInvoices.map(inv => (
                                <option key={inv.id} value={inv.id}>
                                    {inv.invoiceNo}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* For all other voucher types */}
                    {voucherType !== "Payment" && voucherType !== "Receipt" && (
                        <input
                            type="text"
                            className="form-control"
                            value={referenceNo}
                            onChange={(e) => setReferenceNo(e.target.value)}
                        />
                    )}              
                    </div>

                    <div className="col-3">
                        <label className="form-label text-primary">Total Amount*</label>
                        <input type="number" value={totalAmount} 
                                // onChange={e => setTotalAmount(e.target.value)} 
                                className="form-control" readOnly/>
                    </div>

                    <div className="col-3">
                        <label className="form-label text-primary">Payment Due Date*</label>
                        <input type="date" value={paymentDueDate} onChange={e => setPaymentDueDate(e.target.value)}
                               className="form-control" disabled={loading} />
                    </div>

                    <div className="col-3">
                        <label className="form-label text-primary">Payment Mode*</label>
                        <select value={paymentMode} onChange={e => setPaymentMode(e.target.value)} className="form-control" disabled={loading}>
                            <option value="">--Select--</option>
                            {throughOptions.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                </div>
                <div className="row">
                    <div className="col-3">
                        <label className="form-label text-primary">Status*</label>
                        <select value={status} onChange={e => setStatus(e.target.value)} className="form-control" disabled={loading}>
                            <option value="">--Select--</option>
                            {statusOptions.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                    <div className="col-6">
                        <label className="form-label text-primary">Description*</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} className="form-control" rows={2} />
                    </div>
                </div>
                {/* <hr className="my-2" /> */}
                {/* Ledger Entry section, matching your screenshot */}
                <div className="row">
                    <div className="col-4">
                        <label className="form-label text-primary text-primary fw-semibold">
                            Ledger Account <span style={{ color: 'red' }}>*</span>
                        </label>
                        <select value={ledgerAccount}
                                onChange={e => setLedgerAccount(e.target.value)}
                                className="form-control">
                        <option value="">--Select Account--</option>
                            {ledgerAccounts.map(acc => (
                            <option key={acc.id || acc.accountLedgerId}
                                    value={acc.id || acc.accountLedgerId}>{acc.accountLedgerName}
                            </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-4">
                        <label className="form-label text-primary text-primary fw-semibold">
                            Credit Amount <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input type="number" value={creditAmount} onChange={e => setCreditAmount(e.target.value)} className="form-control" />
                    </div>

                    <div className="col-4">
                        <label className="form-label text-primary text-primary fw-semibold">
                            Debit Amount <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input type="number" value={debitAmount} onChange={e => setDebitAmount(e.target.value)} className="form-control" />
                    </div>
                </div>
                <div className="row my-2">
                    <div className="col-12">
                        <label className="form-label text-primary text-primary fw-semibold">
                            Description/Narration <span style={{ color: 'red' }}>*</span>
                        </label>
                        <textarea value={narration} onChange={e => setNarration(e.target.value)} className="form-control" rows={2} disabled={loading} />
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
                {/* Table + Save/Cancel only after an entry has been added */}
                {gridEntries.length > 0 && (
                    <>
                        <div style={{marginBottom: '1.5rem'}}>
                            <table className="table table-bordered">
                                <thead>
                                    <tr style={{ backgroundColor: "#f0f6ff" }}>
                                        <th>Ledger Account</th>
                                        <th>Credit Amount</th>
                                        <th>Debit Amount</th>
                                        <th>Narration</th>
                                        <th>Edit</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentRecords.map((entry, idx) => (
                                        <tr key={entry.id}>
                                            <td>{entry.ledgerName}</td>
                                            <td>{entry.creditAmount}</td>
                                            <td>{entry.debitAmount}</td>
                                            <td>{entry.narration}</td>
                                            <td>
                                                <button className="btn btn-link" onClick={() => handleEditEntry(indexOfFirst + idx)}>
                                                    <Edit />
                                                </button>
                                            </td>
                                            <td>
                                                <button className="btn btn-link text-danger" onClick={() => handleDeleteEntry(indexOfFirst + idx)}>
                                                    <Trash2 />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Pagination
                                totalRecords={gridEntries.length}
                                recordsPerPage={recordsPerPage}
                                currentPage={currentPage}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                        <div className="d-flex" style={{ gap: 10 }}>
                            <button className="btn btn-success" onClick={handleSave} style={{ fontWeight: 600, borderRadius: '6px', minWidth: 120 }}>
                                Save
                            </button>
                            <button className="btn btn-danger" onClick={handleCancel} style={{ fontWeight: 600, borderRadius: '6px', minWidth: 120 }}>
                                Cancel
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default AccountVoucher;
