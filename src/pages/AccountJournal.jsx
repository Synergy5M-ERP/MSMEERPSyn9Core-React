import React, { useState, useEffect } from 'react';
import { Save, Trash2, Loader2, Edit } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

// Configurable API Base URL - CHANGE THIS TO YOUR BACKEND URL
const API_BASE_URL = 'https://msmeerpsyn9-core.azurewebsites.net/api'; // e.g., 'https://your-api.com/api'

function AccountJournal() {
  // Journal form state
  const [journalNumber, setJournalNumber] = useState('');
  const [journalDate, setJournalDate] = useState('');
  const [totalDebit, setTotalDebit] = useState('0.00');
  const [totalCredit, setTotalCredit] = useState('0.00');
  const [description, setDescription] = useState('');
  
  // Ledger entry state
  const [ledgerAccount, setLedgerAccount] = useState('');
  const [debitAmount, setDebitAmount] = useState('');
  const [creditAmount, setCreditAmount] = useState('');
  const [narration, setNarration] = useState('');
  
  // Grid state
  const [gridEntries, setGridEntries] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  
  // Dropdown options state
  const [ledgerAccounts, setLedgerAccounts] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  // Fetch dropdown data on mount
  useEffect(() => {
    fetchDropdownData();
  }, []);

  // Auto-update total debit and credit based on grid entries
  useEffect(() => {
    const debitTotal = gridEntries.reduce((sum, entry) => {
      return sum + (parseFloat(entry.debitAmount) || 0);
    }, 0);
    
    const creditTotal = gridEntries.reduce((sum, entry) => {
      return sum + (parseFloat(entry.creditAmount) || 0);
    }, 0);
    
    setTotalDebit(debitTotal.toFixed(2));
    setTotalCredit(creditTotal.toFixed(2));
  }, [gridEntries]);

  // Fetch dropdown options
  const fetchDropdownData = async () => {
    setFetchLoading(true);
    try {
      // Fetch ledger accounts
      const ledgerAccountsRes = await fetch(`${API_BASE_URL}/ledger-accounts`);
      if (ledgerAccountsRes.ok) {
        const { data } = await ledgerAccountsRes.json();
        setLedgerAccounts(data || []);
      }
    } catch (error) {
      toast.error(`Fetch Error: ${error.message}`);
      console.error('Fetch Error:', error);
    } finally {
      setFetchLoading(false);
    }
  };

  // Add entry to grid
  const handleAddToGrid = () => {
    if (!ledgerAccount || (!debitAmount && !creditAmount) || !narration.trim()) {
      toast.warning('Please fill all ledger entry fields');
      return;
    }

    // Validate that either debit or credit is filled, not both
    if (debitAmount && creditAmount) {
      toast.warning('Please enter either debit or credit amount, not both');
      return;
    }

    const newEntry = {
      id: Date.now(),
      ledgerAccount,
      debitAmount: parseFloat(debitAmount) || 0,
      creditAmount: parseFloat(creditAmount) || 0,
      narration: narration.trim()
    };

    if (editingIndex !== null) {
      // Update existing entry
      const updated = [...gridEntries];
      updated[editingIndex] = newEntry;
      setGridEntries(updated);
      setEditingIndex(null);
      toast.success('Entry updated');
    } else {
      // Add new entry
      setGridEntries([...gridEntries, newEntry]);
      toast.success('Entry added to grid');
    }

    // Clear ledger entry fields
    setLedgerAccount('');
    setDebitAmount('');
    setCreditAmount('');
    setNarration('');
  };

  // Edit grid entry
  const handleEditEntry = (index) => {
    const entry = gridEntries[index];
    setLedgerAccount(entry.ledgerAccount);
    setDebitAmount(entry.debitAmount > 0 ? entry.debitAmount : '');
    setCreditAmount(entry.creditAmount > 0 ? entry.creditAmount : '');
    setNarration(entry.narration);
    setEditingIndex(index);
  };

  // Delete grid entry
  const handleDeleteEntry = async (index) => {
    const confirm = await Swal.fire({
      title: 'Delete this entry?',
      html: '<small class="text-danger">This will remove the entry from the grid.</small>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
    });

    if (confirm.isConfirmed) {
      const updated = gridEntries.filter((_, i) => i !== index);
      setGridEntries(updated);
      toast.success('Entry removed');
    }
  };

  // Validate journal balance
  const validateBalance = () => {
    if (totalDebit !== totalCredit) {
      toast.error('Total Debit and Total Credit must be equal');
      return false;
    }
    return true;
  };

  // Save journal
  const handleSave = async () => {
    if (!journalNumber.trim() || !journalDate || !description.trim()) {
      toast.warning('Please fill all required journal fields');
      return;
    }

    if (gridEntries.length === 0) {
      toast.warning('Please add at least one ledger entry');
      return;
    }

    if (!validateBalance()) {
      return;
    }

    setLoading(true);
    try {
      const payload = {
        journalNumber: journalNumber.trim(),
        journalDate,
        totalDebit: parseFloat(totalDebit),
        totalCredit: parseFloat(totalCredit),
        description: description.trim(),
        ledgerEntries: gridEntries
      };

      const response = await fetch(`${API_BASE_URL}/journals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(await response.text());

      const result = await response.json();
      if (result.success) {
        toast.success('Journal created successfully!');
        handleCancel();
      } else {
        throw new Error(result.message || 'API Error');
      }
    } catch (error) {
      toast.error(`Save Error: ${error.message}`);
      console.error('Save Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cancel form
  const handleCancel = () => {
    setJournalNumber('');
    setJournalDate('');
    setTotalDebit('0.00');
    setTotalCredit('0.00');
    setDescription('');
    setLedgerAccount('');
    setDebitAmount('');
    setCreditAmount('');
    setNarration('');
    setGridEntries([]);
    setEditingIndex(null);
    toast.info('Form cleared');
  };

  // Loading Spinner Component
  const LoadingSpinner = () => (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        zIndex: 2000,
      }}
    >
      <div className="text-center">
        <div className="custom-ring-loader"></div>
        <p className="mt-2 fw-semibold text-dark">Loading...</p>
      </div>
      <style>
        {`
          .custom-ring-loader {
            display: inline-block;
            width: 64px;
            height: 64px;
          }
          .custom-ring-loader:after {
            content: " ";
            display: block;
            width: 48px;
            height: 48px;
            margin: 8px;
            border-radius: 50%;
            border: 6px solid #007bff;
            border-color: #007bff transparent #007bff transparent;
            animation: ring-spin 1.2s linear infinite;
          }
          @keyframes ring-spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}
      </style>
    </div>
  );

  if (fetchLoading) return <LoadingSpinner />;

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: '20px' }}>
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="container-fluid">
        {/* Header */}
        <div style={{ padding: '5px 5px', borderRadius: '5px' }}>
          <h4 style={{ color: '#0066cc',  fontSize: '30px', fontWeight: '600' }}>
            Account Journal
          </h4>
        </div>

        {/* Main Form */}
        <div className="row">
          <div className="col-12">
            <div style={{ background: 'white', padding: '25px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              
              {/* Journal Details Section */}
              <div className="row mb-4">
                {/* Journal Number */}
                <div className="col-md-3 col-sm-6 mb-3">
                  <label style={{ display: 'block', color: '#0066cc', fontSize: '16px', fontWeight: '600', marginBottom: '8px', textAlign: 'left' }}>
                    Journal Number <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={journalNumber}
                    onChange={(e) => setJournalNumber(e.target.value)}
                    placeholder="Enter journal number"
                    disabled={loading}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px', outline: 'none' }}
                  />
                </div>

                {/* Journal Date */}
                <div className="col-md-3 col-sm-6 mb-3">
                  <label style={{ display: 'block', color: '#0066cc', fontSize: '16px', fontWeight: '600', marginBottom: '8px', textAlign: 'left' }}>
                    Journal Date <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="date"
                    value={journalDate}
                    onChange={(e) => setJournalDate(e.target.value)}
                    disabled={loading}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px', outline: 'none' }}
                  />
                </div>

                {/* Total Debit */}
                <div className="col-md-3 col-sm-6 mb-3">
                  <label style={{ display: 'block', color: '#0066cc', fontSize: '16px', fontWeight: '600', marginBottom: '8px', textAlign: 'left' }}>
                    Total Debit <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="number"
                    value={totalDebit}
                    readOnly
                    disabled={loading}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px', outline: 'none', background: '#f0f0f0' }}
                  />
                </div>

                {/* Total Credit */}
                <div className="col-md-3 col-sm-6 mb-3">
                  <label style={{ display: 'block', color: '#0066cc', fontSize: '16px', fontWeight: '600', marginBottom: '8px', textAlign: 'left' }}>
                    Total Credit <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="number"
                    value={totalCredit}
                    readOnly
                    disabled={loading}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px', outline: 'none', background: '#f0f0f0' }}
                  />
                </div>

                {/* Description/Narration */}
                <div className="col-12 mb-3">
                  <label style={{ display: 'block', color: '#0066cc', fontSize: '16px', fontWeight: '600', marginBottom: '8px', textAlign: 'left' }}>
                    Description / Narration <span style={{ color: 'red' }}>*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description"
                    rows="3"
                    disabled={loading}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px', outline: 'none', resize: 'vertical' }}
                  />
                </div>
              </div>

              {/* Ledger Entry Section */}
              <div >
               
                <div className="row mb-3">
                  {/* Ledger Account */}
                  <div className="col-md-4 col-sm-6 mb-3">
                    <label style={{ display: 'block', color: '#0066cc', fontSize: '16px', fontWeight: '600', marginBottom: '8px', textAlign: 'left' }}>
                      Ledger Account <span style={{ color: 'red' }}>*</span>
                    </label>
                    <select
                      value={ledgerAccount}
                      onChange={(e) => setLedgerAccount(e.target.value)}
                      disabled={loading}
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px', outline: 'none' }}
                    >
                      <option value="">Select account</option>
                      {ledgerAccounts.map(acc => (
                        <option key={acc.id} value={acc.name}>{acc.name}</option>
                      ))}
                      <option value="account1">account1</option>
                    </select>
                  </div>

                  {/* Debit Amount */}
                  <div className="col-md-4 col-sm-6 mb-3">
                    <label style={{ display: 'block', color: '#0066cc', fontSize: '16px', fontWeight: '600', marginBottom: '8px', textAlign: 'left' }}>
                      Debit Amount <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="number"
                      value={debitAmount}
                      onChange={(e) => {
                        setDebitAmount(e.target.value);
                        if (e.target.value) setCreditAmount('');
                      }}
                      placeholder="0.00"
                      disabled={loading || creditAmount !== ''}
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px', outline: 'none' }}
                    />
                  </div>

                  {/* Credit Amount */}
                  <div className="col-md-4 col-sm-6 mb-3">
                    <label style={{ display: 'block', color: '#0066cc', fontSize: '16px', fontWeight: '600', marginBottom: '8px', textAlign: 'left' }}>
                      Credit Amount <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="number"
                      value={creditAmount}
                      onChange={(e) => {
                        setCreditAmount(e.target.value);
                        if (e.target.value) setCreditAmount('');
                      }}
                      placeholder="0.00"
                      disabled={loading || debitAmount !== ''}
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px', outline: 'none' }}
                    />
                  </div>

                  {/* Description/Narration */}
                  <div className="col-md-10 mb-3">
                    <label style={{ display: 'block', color: '#0066cc', fontSize: '16px', fontWeight: '600', marginBottom: '8px', textAlign: 'left' }}>
                      Description / Narration <span style={{ color: 'red' }}>*</span>
                    </label>
                    <textarea
                      value={narration}
                      onChange={(e) => setNarration(e.target.value)}
                      placeholder="Enter narration"
                      rows="2"
                      disabled={loading}
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px', outline: 'none', resize: 'vertical' }}
                    />
                  </div>

                  {/* Add to Grid Button */}
                  <div className="col-md-2 col-sm-12 mb-3 d-flex align-items-end">
                    <button
                      onClick={handleAddToGrid}
                      disabled={loading}
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: loading ? '#ccc' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '16px',
                        fontWeight: '600'
                      }}
                    >
                      {editingIndex !== null ? 'Update' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid View */}
              <div style={{ marginTop: '30px' }}>
               
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
                    <thead>
                      <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #0066cc' }}>
                                   <th style={{ padding: '12px', textAlign: 'left', color: '#0066cc', fontSize: '16px', fontWeight: '600', border: '1px solid #ddd' }}>Journal Number</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#0066cc', fontSize: '16px', fontWeight: '600', border: '1px solid #ddd' }}>Ledger Account</th>
                        <th style={{ padding: '12px', textAlign: 'right', color: '#0066cc', fontSize: '16px', fontWeight: '600', border: '1px solid #ddd' }}>Debit amount</th>
                        <th style={{ padding: '12px', textAlign: 'right', color: '#0066cc', fontSize: '16px', fontWeight: '600', border: '1px solid #ddd' }}>Credit Amount</th>
                        <th style={{ padding: '12px', textAlign: 'center', color: '#0066cc', fontSize: '16px', fontWeight: '600', border: '1px solid #ddd' }}>Edit icon</th>
                        <th style={{ padding: '12px', textAlign: 'center', color: '#0066cc', fontSize: '16px', fontWeight: '600', border: '1px solid #ddd' }}>Delete icon</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridEntries.map((entry, index) => (
                        <tr key={entry.id} style={{ borderBottom: '1px solid #ddd' }}>
                          <td style={{ padding: '12px', fontSize: '14px', textAlign: 'left', border: '1px solid #ddd' }}>{entry.ledgerAccount}</td>
                          <td style={{ padding: '12px', fontSize: '14px', textAlign: 'right', border: '1px solid #ddd' }}>
                            {entry.debitAmount > 0 ? entry.debitAmount.toFixed(2) : '-'}
                          </td>
                          <td style={{ padding: '12px', fontSize: '14px', textAlign: 'right', border: '1px solid #ddd' }}>
                            {entry.creditAmount > 0 ? entry.creditAmount.toFixed(2) : '-'}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>
                            <button
                              onClick={() => handleEditEntry(index)}
                              disabled={loading}
                              style={{
                                padding: '6px 12px',
                                background: loading ? '#ccc' : '#0066cc',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: loading ? 'not-allowed' : 'pointer'
                              }}
                            >
                              <Edit size={16} />
                            </button>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>
                            <button
                              onClick={() => handleDeleteEntry(index)}
                              disabled={loading}
                              style={{
                                padding: '6px 12px',
                                background: loading ? '#ccc' : '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: loading ? 'not-allowed' : 'pointer'
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {gridEntries.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '30px', color: '#999', fontSize: '16px', border: '1px solid #ddd', borderTop: 'none' }}>
                      No entries added yet. Use the form above to add ledger entries.
                    </div>
                  )}
                </div>

                {/* Balance Validation Message */}
                {gridEntries.length > 0 && totalDebit !== totalCredit && (
                  <div style={{ 
                    marginTop: '15px', 
                    padding: '10px', 
                    background: '#fff3cd', 
                    border: '1px solid #ffc107', 
                    borderRadius: '4px',
                    color: '#856404',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    ⚠️ Warning: Total Debit (₹{totalDebit}) and Total Credit (₹{totalCredit}) must be equal to save the journal.
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '30px', flexWrap: 'wrap' }}>
                <button
                  onClick={handleSave}
                  disabled={loading || gridEntries.length === 0 || totalDebit !== totalCredit}
                  style={{
                    minWidth: '120px',
                    fontSize: '16px',
                    padding: '10px 20px',
                    background: (loading || gridEntries.length === 0 || totalDebit !== totalCredit) ? '#ccc' : '#0066cc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: (loading || gridEntries.length === 0 || totalDebit !== totalCredit) ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontWeight: '600'
                  }}
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  Save
                </button>

                <button
                  onClick={handleCancel}
                  disabled={loading}
                  style={{
                    minWidth: '120px',
                    fontSize: '16px',
                    padding: '10px 20px',
                    background: loading ? '#ccc' : '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          .animate-spin {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @media (max-width: 768px) {
            table {
              font-size: 12px;
            }
            th, td {
              padding: 8px !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default AccountJournal;