
import React, { useState, useEffect } from 'react';
import { Eye, Save, Trash2, Loader2, X } from 'lucide-react';
import { API_ENDPOINTS } from "../../config/apiconfig";
//const API_BASE_URL = 'https://msmeerp-syn9core.azurewebsites.net/api/AccountBankDetails';
//const API_BASE_URL = 'https://localhost:7145/api/AccountBankDetails';
const API_BASE_URL = 'https://msmeerpsyn9-core.azurewebsites.net/api '
 //const BASE_URL = "https://localhost:7145/api";



function AccountBankDetails({ view = 'active' }) {
const [vendorId, setVendorId] = useState('');

    const [vendorName, setVendorName] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNo, setAccountNo] = useState('');
    const [branchName, setBranchName] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [stagedBanks, setStagedBanks] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [vendorNames, setVendorNames] = useState([]);
    const [savedBanks, setSavedBanks] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const [errors, setErrors] = useState({
        vendorName: '',
        bankName: '',
        accountNo: '',
        branchName: '',
        ifscCode: '',
    });

    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [alertDialog, setAlertDialog] = useState({ show: false, title: '', message: '', onConfirm: null });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 2000);
    };

    const showAlert = (title, message, onConfirm) => {
        setAlertDialog({ show: true, title, message, onConfirm });
    };

  const fetchVendorNames = async () => {
  try {
    const res = await fetch(API_ENDPOINTS.Vendors);
    if (!res.ok) throw new Error('Failed to fetch vendors');

    const json = await res.json();

    const normalized = (json.data || []).map(v => ({
      id: v.id,                     // ✅ MATCH API
      company_Name: v.company_Name  // ✅ MATCH API (case-sensitive)
    }));

    setVendorNames(normalized);
  } catch (err) {
    showToast(err.message, 'error');
  }
};




    const fetchBanks = async (status = "active") => {
        setFetchLoading(true);
        try {
        let url = `${API_ENDPOINTS.AccountBankDetails}`; 
            if (status === "active") url += "?isActive=true";
            else if (status === "inactive") url += "?isActive=false";

            const response = await fetch(url);
            const result = await response.json();
            const raw = result.data || result || [];
            setSavedBanks(raw);
        } catch (error) {
            showToast(`Fetch Error: ${error.message}`, 'error');
            setSavedBanks([]);
        } finally {
            setFetchLoading(false);
        }
    };

    useEffect(() => {
        fetchVendorNames();
        fetchBanks(view);
    }, [view]);

    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'vendorName':
                if (!value.trim()) error = 'Vendor Name is required';
                break;
            case 'bankName':
                if (!value.trim()) error = 'Bank Name is required';
                break;
            case 'accountNo':
                if (!/^\d{9,18}$/.test(value)) error = 'Account Number must be 9–18 digits';
                break;
            case 'branchName':
                if (!value.trim()) error = 'Branch Name is required';
                break;
            case 'ifscCode':
                if (!/^[A-Z]{4}0\d{6}$/.test(value))
                    error = 'Invalid IFSC format (e.g., SBIN0001234)';
                break;
            default:
                break;
        }

        setErrors((prev) => ({ ...prev, [name]: error }));
        return error === '';
    };

    const validateAllFields = () => {
        const isVendorValid = validateField('vendorName', vendorName);
        const isBankValid = validateField('bankName', bankName);
        const isAccountValid = validateField('accountNo', accountNo);
        const isBranchValid = validateField('branchName', branchName);
        const isIfscValid = validateField('ifscCode', ifscCode);

        return isVendorValid && isBankValid && isAccountValid && isBranchValid && isIfscValid;
    };

    const handleAdd = () => {
        if (!validateAllFields()) {
            showToast('Please fix all errors before adding', 'error');
            return;
        }
 const selectedVendor = vendorNames.find(v => v.id === parseInt(vendorName));

    const newEntry = {
        id: editingIndex !== null ? stagedBanks[editingIndex].id : Date.now(),
        vendorId: parseInt(vendorName),  // store ID
        vendorName: selectedVendor ? selectedVendor.company_Name : '',  // match exact property
        bankName: bankName.trim(),
        accountNo: accountNo.trim(),
        branchName: branchName.trim(),
        ifscCode: ifscCode.trim(),
    };



        if (editingIndex !== null) {
            const updated = [...stagedBanks];
            updated[editingIndex] = newEntry;
            setStagedBanks(updated);
            showToast('Entry updated!');
        } else {
            setStagedBanks([...stagedBanks, newEntry]);
            showToast('Entry added to table!');
        }

        handleClearForm();
    };

  const handleEdit = (index) => {
    const bank = stagedBanks[index];

    // ✅ Only set vendor if it exists in vendorNames
    const selectedVendor = vendorNames.find(v => v.id === bank.vendorId);
    setVendorName(selectedVendor ? selectedVendor.id : ''); // show blank if not selected

    setBankName(bank.bankName);
    setAccountNo(bank.accountNo);
    setBranchName(bank.branchName);
    setIfscCode(bank.ifscCode);
    setEditingIndex(index);
    setEditingId(null); // staged entry, not saved
};


  const handleEditSaved = (bank) => {
    const selectedVendor = vendorNames.find(v => v.id === bank.vendorId);
    setVendorName(selectedVendor ? selectedVendor.id : '');

    setBankName(bank.bankName);
    setAccountNo(bank.accountNo);
    setBranchName(bank.branchName);
    setIfscCode(bank.ifscCode);
    setEditingId(bank.id); // saved entry
    setEditingIndex(null);
};


    const handleSaveEdited = async () => {
    if (!validateAllFields()) {
        showToast('Please fix all errors before saving', 'error');
        return;
    }

    setLoading(true);
    try {
        const payload = {
            vendorId: parseInt(vendorName),
            bankName: bankName.trim(),
            accountNo: accountNo.trim(),
            branchName: branchName.trim(),
            ifscCode: ifscCode.trim(),
        };

        const response = await fetch(`${API_ENDPOINTS.AccountBankDetails}/AccountBankDetails/${editingId}`, {
            method: 'PUT', // updated API handles full edit + isActive toggle
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error(await response.text());
        const result = await response.json();

        if (result.success) {
            showToast('Bank details updated successfully!');
            await fetchBanks(view);
            handleClearForm();
        } else {
            throw new Error(result.message || 'Update failed');
        }
    } catch (error) {
        showToast(`Update Error: ${error.message}`, 'error');
    } finally {
        setLoading(false);
    }
};


    const handleDeleteStaged = (index) => {
        showAlert(
            'Remove this entry?',
            'This will remove it from the table',
            () => {
                setStagedBanks(stagedBanks.filter((_, i) => i !== index));
                showToast('Entry removed!');
                if (editingIndex === index) {
                    handleClearForm();
                }
                setAlertDialog({ show: false, title: '', message: '', onConfirm: null });
            }
        );
    };

 const handleSoftDelete = async (id) => {
    showAlert(
        'Set bank detail as inactive?',
        'It will be moved to the inactive list.',
        async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_ENDPOINTS.AccountBankDetails}/AccountBankDetails/${id}`, {
                    method: 'PUT',  // ✅ use PUT for isActive toggle
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ isActive: false }),
                });

                if (!response.ok) throw new Error(await response.text());
                const result = await response.json();

                if (result.success) {
                    showToast('Bank details moved to inactive!');
                    await fetchBanks(view);
                } else throw new Error(result.message || 'Update failed');
            } catch (error) {
                showToast(`Inactivate Error: ${error.message}`, 'error');
            } finally {
                setLoading(false);
                setAlertDialog({ show: false, title: '', message: '', onConfirm: null });
            }
        }
    );
};


  const handleSaveAll = async () => {
  if (stagedBanks.length === 0) {
    showToast('No entries to save!', 'error');
    return;
  }

  setLoading(true);
  try {
    const payload = stagedBanks.map(bank => ({
      VendorId: parseInt(bank.vendorId),
      BankName: bank.bankName,
      AccountNo: bank.accountNo,
      BranchName: bank.branchName,
      IFSCCode: bank.ifscCode,
      IsActive: true,
     // Vendor:{}
    }));

 const response = await fetch(`${API_ENDPOINTS.AccountBankDetailsSave}/AccountBankDetailsSave`, {
  method: 'POST',
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

    const result = await response.json();

    if (result.success) {
      showToast(result.message || 'All bank details saved successfully!');
      setStagedBanks([]);
      await fetchBanks(view);
    } else {
      throw new Error(result.message || 'Save failed');
    }
  } catch (error) {
    showToast(`Save Error: ${error.message}`, 'error');
  } finally {
    setLoading(false);
  }
};



    const handleClearForm = () => {
        setVendorName('');
        setBankName('');
        setAccountNo('');
        setBranchName('');
        setIfscCode('');
        setEditingIndex(null);
        setEditingId(null);
        setErrors({ vendorName: '', bankName: '', accountNo: '', branchName: '', ifscCode: '' });
    };

    const handleCancelAll = () => {
        handleClearForm();
        setStagedBanks([]);
    };

    const LoadingSpinner = () => (
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
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                zIndex: 2000,
            }}
        >
            <div style={{ textAlign: "center" }}>
                <div style={{
                    display: "inline-block",
                    width: "64px",
                    height: "64px",
                }}>
                    <div style={{
                        display: "block",
                        width: "48px",
                        height: "48px",
                        margin: "8px",
                        borderRadius: "50%",
                        border: "6px solid #007bff",
                        borderColor: "#007bff transparent #007bff transparent",
                        animation: "ring-spin 1.2s linear infinite",
                    }}></div>
                </div>
                <p style={{ marginTop: "8px", fontWeight: "600", color: "#000" }}>Loading...</p>
            </div>
            <style>{`
                @keyframes ring-spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );

    if (fetchLoading) return <LoadingSpinner />;

    return (
        <div style={{ background: '#f5f5f5', minHeight: '80vh', padding: '20px' }}>
            {toast.show && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    padding: '15px 20px',
                    background: toast.type === 'error' ? '#dc3545' : '#28a745',
                    color: 'white',
                    borderRadius: '4px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    zIndex: 3000,
                    fontSize: '16px',
                }}>
                    {toast.message}
                </div>
            )}

            {alertDialog.show && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 3000,
                }}>
                    <div style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: '8px',
                        maxWidth: '400px',
                        width: '90%',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                    }}>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', fontWeight: '600' }}>{alertDialog.title}</h3>
                        <p style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#666' }}>{alertDialog.message}</p>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setAlertDialog({ show: false, title: '', message: '', onConfirm: null })}
                                style={{
                                    padding: '8px 16px',
                                    background: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={alertDialog.onConfirm}
                                style={{
                                    padding: '8px 16px',
                                    background: '#d33',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                }}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Form Section */}
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ background: 'white', padding: '25px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', color: '#0066cc', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                                    Vendor name <span style={{ color: 'red' }}>*</span>
                                </label>
                            <select 
    value={vendorName} 
    onChange={e => {
        setVendorName(e.target.value);
        validateField('vendorName', e.target.value);
    }} 
    disabled={loading} 
    style={{ width: '100%', padding: '10px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '4px' }}
>
    <option value="">--Select Vendor--</option>

     {vendorNames.map(vendor => (
    <option key={vendor.id} value={vendor.id}>
      {vendor.company_Name}
    </option>
   ))}
</select>



                                {errors.vendorName && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.vendorName}</div>}
                            </div>

                            <div>
                                <label style={{ display: 'block', color: '#0066cc', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                                    Bank Name <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={bankName}
                                    onChange={(e) => {
                                        setBankName(e.target.value);
                                        validateField('bankName', e.target.value);
                                    }}
                                    disabled={loading}
                                    style={{ width: '100%', padding: '10px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                                {errors.bankName && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.bankName}</div>}
                            </div>

                            <div>
                                <label style={{ display: 'block', color: '#0066cc', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                                    Account Number <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={accountNo}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        setAccountNo(val);
                                        validateField('accountNo', val);
                                    }}
                                    disabled={loading}
                                    maxLength={18}
                                    style={{ width: '100%', padding: '10px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                                {errors.accountNo && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.accountNo}</div>}
                            </div>

                            <div>
                                <label style={{ display: 'block', color: '#0066cc', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                                    Branch Name <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={branchName}
                                    onChange={(e) => {
                                        setBranchName(e.target.value);
                                        validateField('branchName', e.target.value);
                                    }}
                                    disabled={loading}
                                    style={{ width: '100%', padding: '10px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                                {errors.branchName && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.branchName}</div>}
                            </div>

                            <div>
                                <label style={{ display: 'block', color: '#0066cc', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                                    IFSC Code <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={ifscCode}
                                    onChange={(e) => {
                                        const val = e.target.value.toUpperCase();
                                        setIfscCode(val);
                                        validateField('ifscCode', val);
                                    }}
                                    maxLength={11}
                                    disabled={loading}
                                    style={{ width: '100%', padding: '10px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '4px', textTransform: 'uppercase' }}
                                />
                                {errors.ifscCode && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.ifscCode}</div>}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                                {editingId ? (
                                    <>
                                        <button
                                            onClick={handleSaveEdited}
                                            disabled={loading}
                                            style={{
                                                flex: 1,
                                                fontSize: '18px',
                                                padding: '10px 0',
                                                background: loading ? '#ccc' : '#0066cc',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: loading ? 'not-allowed' : 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '6px'
                                            }}
                                        >
                                            {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={16} />}
                                            Save
                                        </button>
                                        <button
                                            onClick={handleClearForm}
                                            disabled={loading}
                                            style={{
                                                flex: 1,
                                                fontSize: '18px',
                                                padding: '10px 0',
                                                background: '#dc3545',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: loading ? 'not-allowed' : 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '6px'
                                            }}
                                        >
                                            <X size={16} />
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleAdd}
                                        disabled={loading}
                                        style={{
                                            width: '130px',
                                            fontSize: '18px',
                                            padding: '10px 0',
                                            background: 'green',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                        }}
                                    >
                                        {editingIndex !== null ? 'Update' : 'Add'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Staged Table Section */}
                {stagedBanks.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ background: 'white', padding: '25px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ color: '#0066cc', fontSize: '20px', fontWeight: '600', marginBottom: '15px' }}>Staged Entries (Not Saved Yet)</h3>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid #0066cc' }}>
                                            <th style={{ padding: '12px', color: '#0066cc', fontSize: '18px', fontWeight: '600' }}>Vendor Name</th>
                                            <th style={{ padding: '12px', color: '#0066cc', fontSize: '18px', fontWeight: '600' }}>Bank Name</th>
                                            <th style={{ padding: '12px', color: '#0066cc', fontSize: '18px', fontWeight: '600' }}>Account Number</th>
                                            <th style={{ padding: '12px', color: '#0066cc', fontSize: '18px', fontWeight: '600' }}>Branch Name</th>
                                            <th style={{ padding: '12px', color: '#0066cc', fontSize: '18px', fontWeight: '600' }}>IFSC Code</th>
                                            <th style={{ padding: '12px', color: '#0066cc', fontSize: '18px', fontWeight: '600' }}>Edit</th>
                                            <th style={{ padding: '12px', color: '#0066cc', fontSize: '18px', fontWeight: '600' }}>Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stagedBanks.map((bank, index) => (
                                            <tr key={bank.id} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '12px', fontSize: '16px' }}>{bank.vendorName}</td>
                                                <td style={{ padding: '12px', fontSize: '16px' }}>{bank.bankName}</td>
                                                <td style={{ padding: '12px', fontSize: '16px' }}>{bank.accountNo}</td>
                                                <td style={{ padding: '12px', fontSize: '16px' }}>{bank.branchName}</td>
                                                <td style={{ padding: '12px', fontSize: '16px' }}>{bank.ifscCode}</td>
                                                <td style={{ padding: '12px' }}>
                                                    <button
                                                        onClick={() => handleEdit(index)}
                                                        disabled={loading}
                                                        style={{
                                                            padding: '6px 12px',
                                                            background: loading ? '#ccc' : '#0066cc',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: loading ? 'not-allowed' : 'pointer',
                                                        }}
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                </td>
                                                <td style={{ padding: '12px' }}>
                                                    <button
                                                        onClick={() => handleDeleteStaged(index)}
                                                        disabled={loading}
                                                        style={{
                                                            padding: '6px 12px',
                                                            background: loading ? '#ccc' : '#dc3545',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: loading ? 'not-allowed' : 'pointer',
                                                        }}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                <button
                                    onClick={handleSaveAll}
                                    disabled={loading || stagedBanks.length === 0}
                                    style={{
                                        width: '120px',
                                        fontSize: '18px',
                                        padding: '10px 0',
                                        background: loading || stagedBanks.length === 0 ? '#ccc' : '#0066cc',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: loading || stagedBanks.length === 0 ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={16} />}
                                    Save 
                                </button>

                                <button
                                    onClick={handleCancelAll}
                                    disabled={loading}
                                    style={{
                                        width: '120px',
                                        fontSize: '18px',
                                        padding: '10px 0',
                                        background: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    Cancel 
                                </button>
                            </div>
                    </div>
                )}

             
            </div>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

export default AccountBankDetails;