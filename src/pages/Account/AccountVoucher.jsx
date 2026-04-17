import React, { useState, useEffect } from "react";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "../../components/Pagination";
import { API_ENDPOINTS } from "../../config/apiconfig";
import Select from "react-select";

function AccountVoucher() {
    // ----------------------
    // Main States
    // ----------------------
    
    const [voucherCategoryList, setVoucherCategoryList] = useState([])
    const [voucherCategoryId, setVoucherCategoryId] = useState("")
    const [voucherNo, setVoucherNo] = useState('');
    const [voucherDate, setVoucherDate] = useState(new Date().toISOString().split("T")[0]);       // selected status
    const [description, setDescription] = useState('');
    const [voucherTypeId, setVoucherTypeId] = useState("");
    const [voucherSource, setVoucherSource] = useState("");
    const [fromAccount, setFromAccount] = useState("");
    const [voucherLoading, setVoucherLoading] = useState(false);
    const [transactionType, setTransactionType] = useState("");
    const [ledgerData, setLedgerData] = useState([]);
    const [ledgerLoading, setLedgerLoading] = useState([])

    // Data
    const [voucherTypes, setVoucherTypes] = useState([]);
    const [subledgerAccounts, setsubLedgerAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 4;
    const indexOfLast = currentPage * recordsPerPage;
    const indexOfFirst = indexOfLast - recordsPerPage;


    useEffect(() => {
        const loadData = async () => {
            try {
                await Promise.all([
                    fetchSubLedgers(),
                    fetchVoucherCategory()
                ]);
            } catch (err) {
                console.error(err);
            } finally {
                setFetchLoading(false); // ✅ IMPORTANT
            }
        };

        loadData();
    }, []);

    // ========================
    //  Fetching Functions
    // ========================

    const normalize = (json) => {
        if (Array.isArray(json)) return json;
        if (json?.data && Array.isArray(json.data)) return json.data;
        return [];
    };

    const fetchVoucherCategory = async () => {
        try {
            const res = await fetch(API_ENDPOINTS.VoucherCategory);

            const json = await res.json();
            setVoucherCategoryList(normalize(json));
        } catch (err) {
            toast.error("Failed to load voucher category");
        }
    };

    const fetchVoucherTypesByCategory = async (categoryId) => {
        try {
            const res = await fetch(
                `${API_ENDPOINTS.VoucherCategoryWiseType}?categoryId=${categoryId}`
            );
            const json = await res.json();
            setVoucherTypes(normalize(json));
        } catch (err) {
            toast.error("Failed to load voucher types");
        }
    };

    // const fetchSubLedgers = async () => {
    //     try {
    //         const res = await fetch(API_ENDPOINTS.AllSubLedger);
    //         const json = await res.json();
    //         setsubLedgerAccounts(normalize(json));
    //     } catch (err) {
    //         toast.error("Failed to load sub ledger accounts");
    //     }
    // };

    const fetchSubLedgers = async () => {
    try {
        const res = await fetch(
            `${API_ENDPOINTS.AllSubLedger}?isActive=true&isBank=true`
        );

        const json = await res.json();
        setsubLedgerAccounts(normalize(json));
    } catch (err) {
        toast.error("Failed to load sub ledger accounts");
    }
};

    const generateVoucherNumber = async (voucherTypeId) => {
        try {
            setVoucherLoading(true);
            const res = await fetch(
                `${API_ENDPOINTS.GenerateVoucherNo}?voucherTypeId=${voucherTypeId}`
            );

            const data = await res.json();
            setVoucherNo(data?.voucherNo || "");

        } catch (err) {
            toast.error("Failed to generate voucher number");
        } finally {
            setVoucherLoading(false);
        }
    };

    const fetchLedgerWiseData = async (accountSubLedgerId) => {
        try {
            setLedgerLoading(true);

            const res = await fetch(
                `${API_ENDPOINTS.GetLedgerWiseData}?accountSubLedgerId=${accountSubLedgerId}`
            );

            const json = await res.json();
            setLedgerData(json || []);
        } catch (err) {
            toast.error("Failed to load ledger data");
        } finally {
            setLedgerLoading(false);
        }
    };

     // ----------------------
    // Save Voucher
    // ----------------------
    const handleSave = async () => {
    try {
        // ✅ Basic validation
        if (!voucherCategoryId || !voucherTypeId || !fromAccount || !transactionType) {
            toast.error("Please fill all required fields");
            return;
        }
          
        const payload = {
            voucherCategoryId,
            voucherTypeId,
            voucherNo,
            voucherDate,
            voucherSource,
            fromAccount,
            transactionType,
            description,
            ledgerData
        };

        setVoucherLoading(true);

        const res = await fetch(API_ENDPOINTS.SaveVoucher, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Save failed");

        toast.success("Voucher saved successfully");

        handleCancel(); // reset form after save

    } catch (err) {
        toast.error("Failed to save voucher");
    } finally {
        setVoucherLoading(false);
    }
};

    // ----------------------
    // Cancel Voucher
    // ----------------------
    const handleCancel = () => {
        setVoucherCategoryId("");
        setVoucherTypeId("");
        setVoucherTypes([]);
        setVoucherNo("");
        setVoucherSource("");
        setFromAccount("");
        setTransactionType("");
        setDescription("");
        setLedgerData([]);
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
                        <label className="form-label text-primary">Voucher Category*</label>
                        <select
                            className="form-select"
                            value={voucherCategoryId}
                            onChange={(e) => {
                                const value = e.target.value;
                                setVoucherCategoryId(value);
                                setVoucherTypeId("");

                                if (value) {
                                    fetchVoucherTypesByCategory(value); // ✅ LOAD TYPES
                                } else {
                                    setVoucherTypes([]); // reset
                                }
                            }}>

                            <option value="">--Select Voucher Category--</option>
                            {voucherCategoryList.map((cat) => (
                                <option key={cat.voucherCategoryId} value={cat.voucherCategoryId}>
                                    {cat.voucherCategory}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-3">
                        <label className="form-label text-primary">Voucher Source*</label>
                        <select
                            className="form-select"
                            value={voucherSource}
                            onChange={(e) => setVoucherSource(e.target.value)}>

                            <option value="">--Select Voucher Source--</option>
                            <option value="Bank">Bank</option>
                            <option value="Cash">Cash</option>
                        </select>
                    </div>

                    <div className="col-3">
                        <label className="form-label text-primary">Voucher Type*</label>
                        <select
                            className="form-select"
                            value={voucherTypeId}   // ✅ FIX
                            onChange={(e) => {
                                const voucherTypeId = e.target.value;
                                setVoucherTypeId(voucherTypeId);

                                if (voucherTypeId) {
                                    generateVoucherNumber(voucherTypeId); // ✅ CALL API
                                } else {
                                    setVoucherNo(""); // reset
                                }
                            }}>

                            <option value="">--Select Voucher Type--</option>
                            {voucherTypes.map((t) => (
                                <option key={t.accountVoucherTypeId} value={t.accountVoucherTypeId}>
                                    {t.voucherType}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-3">
                        <label className="form-label text-primary">Voucher Number*</label>
                        <input type="text" value={voucherNo}
                            className="form-control" disabled={loading} readOnly />
                    </div>

                    <div className="col-3">
                        <label className="form-label text-primary">Voucher Date*</label>
                        <input
                            type="date"
                            className="form-control"
                            value={voucherDate}
                            onChange={(e) => setVoucherDate(e.target.value)}
                        />
                    </div>

                </div>

                <div className="row mb-2">

                    <div className="col-3">
                        <label className="form-label text-primary">From Account*</label>
                        <Select
                            options={subledgerAccounts.map(acc => ({
                                value: acc.accountSubLedgerId,
                                label: acc.accountSubLedger
                            }))}

                            value={subledgerAccounts
                                .map(acc => ({
                                    value: acc.accountSubLedgerId,
                                    label: acc.accountSubLedger
                                }))
                                .find(opt => opt.value === fromAccount)}

                            onChange={(selected) => {
                                const accountSubLedgerId = selected?.value;
                                setFromAccount(accountSubLedgerId);

                                if (accountSubLedgerId) {
                                    fetchLedgerWiseData(accountSubLedgerId);
                                } else {
                                    setLedgerData([]);
                                }
                            }}

                            placeholder="--Search From Account--"
                            isClearable

                            // ✅ ADD THESE
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={{
                                menuPortal: base => ({ ...base, zIndex: 9999 })
                            }}
                        />
                        </div>
                        {/* Credit / Debit */}
                        <div className="col-md-2">
                            <label className="form-label d-block text-center"> </label>

                            <div className="d-flex justify-content-center align-items-center gap-3">

                                <div className="text-center">
                                    <label className="form-label text-primary d-block">Credit</label>
                                    <input
                                        type="radio"
                                        name="transactionType"
                                        value="Credit"
                                        checked={transactionType === "Credit"}
                                        onChange={(e) => setTransactionType(e.target.value)}
                                    />
                                </div>

                                <div className="text-center">
                                    <label className="form-label text-primary d-block">Debit</label>
                                    <input
                                        type="radio"
                                        name="transactionType"
                                        value="Debit"
                                        checked={transactionType === "Debit"}
                                        onChange={(e) => setTransactionType(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-6">
                            <label className="form-label text-primary">Description*</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} className="form-control"  />
                        </div>                  
                </div>

                    <div className="col">
                        <label className="form-label fw-bold">To Account</label>

                        <div className="table-responsive">
                            <table className="table table-bordered text-center align-middle">

                                {/* Header */}
                                <thead style={{ backgroundColor: "#1e6bd6", color: "white" }}>
                                    <tr>
                                        <th>
                                            <input type="checkbox" />
                                        </th>
                                        <th>Party Name</th>
                                        <th>Total Amount</th>
                                        <th>Bank Name</th>
                                        <th>A/c No</th>
                                        <th>IFSC</th>
                                        <th>Credit</th>
                                        <th>Debit</th>
                                    </tr>
                                </thead>

                                {/* Body */}
                                <tbody>
                                    {ledgerData.length > 0 ? (
                                        ledgerData.map((row, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <input type="checkbox" />
                                                </td>
                                                <td>{row.companyName}</td>
                                                <td>{row.totalAmount}</td>
                                                <td>{row.bankName}</td>
                                                <td>{row.accountNo}</td>
                                                <td>{row.ifscCode}</td>

                                                {/* Credit / Debit based on selection */}
                                                <td>{transactionType === "Credit" ? row.totalAmount : 0}</td>
                                                <td>{transactionType === "Debit" ? row.totalAmount : 0}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8">No records available</td>
                                        </tr>
                                    )}
                                </tbody>

                            </table>
                        </div>
                  

                     {/* BUTTONS */}
                            <div className="d-flex justify-content-center gap-3 mt-4 mb-2">
                              <button
                                onClick={handleSave}
                                disabled={voucherLoading}
                                className="btn btn-primary btn-lg px-5 py-2 position-relative"
                                style={{ fontWeight: 600, borderRadius: "8px", minWidth: "140px" }}
                              >
                                {voucherLoading ? (
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
                                disabled={voucherLoading}
                              >
                                Reset
                              </button>
                            </div>
                    </div>
            </div>
        </div>
    );
}

export default AccountVoucher;
