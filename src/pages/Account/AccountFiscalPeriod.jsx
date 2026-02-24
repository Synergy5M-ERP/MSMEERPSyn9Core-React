

import React, { useState, useEffect } from 'react';
import { Save, Trash2, Eye, Loader2 } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import { API_ENDPOINTS } from "../../config/apiconfig";
import Pagination from '../../components/Pagination';

function CreateFiscalPeriod({ view }) {
  const [FiscalPeriodName, setFiscalPeriodName] = useState('');
  const [FiscalPeriodStartDate, setFiscalPeriodStartDate] = useState('');
  const [FiscalPeriodEndDate, setFiscalPeriodEndDate] = useState('');
  const [FiscalPeriodStatus, setFiscalPeriodStatus] = useState('');
  const [FiscalYear, setFiscalYear] = useState(new Date().getFullYear());
  const [FiscalPeriods, setFiscalPeriods] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
const [currentPage,setCurrentPage]=useState(1);
const recordsPerPage=3;
const indexOfLast=currentPage*recordsPerPage;
const indexOfFirst=indexOfLast-recordsPerPage
const currentRecords=FiscalPeriods.slice(indexOfFirst,indexOfLast)
  useEffect(() => {
    fetchFiscalPeriods(view);
  }, [view]);

  const fetchFiscalPeriods = async (status = "active") => {
    setFetchLoading(true);
    try{
      let url = API_ENDPOINTS.FiscalPeriod;
      if (status === "active") url += "?isActive=true";
      else if (status === "inactive") url += "?isActive=false";

      const response = await axios.get(url);
      const raw = response.data.data || response.data || [];
      const mappedFiscalPeriods = raw.map((l) => ({
        id: l.accountFiscalPeriodId || l.id,
        FiscalPeriodName: l.fiscalPeriodName,
        FiscalPeriodStartDate: l.fiscalPeriodStartDate,
        FiscalPeriodEndDate: l.fiscalPeriodEndDate,
        FiscalPeriodStatus: l.fiscalPeriodStatus,
        FiscalYear: l.fiscalYear,
        IsActive: l.isActive,
      }));
      setFiscalPeriods(mappedFiscalPeriods);
    }
    catch (error) {
      toast.error(`Fetch Error: ${error.message}`);
      setFiscalPeriods([]);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSave = async () => {
    if (!FiscalPeriodName.trim() || !FiscalPeriodStartDate || !FiscalPeriodEndDate || !FiscalPeriodStatus || !FiscalYear) return;

    setLoading(true);
    try {
      const payload = {
        FiscalPeriodName: FiscalPeriodName.trim(),
        FiscalPeriodStartDate,
        FiscalPeriodEndDate,
        FiscalPeriodStatus,
        FiscalYear,
      };

      let response;
      if (editingId) {
        response = await fetch(`${API_ENDPOINTS.FiscalPeriod}${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(`${API_ENDPOINTS.FiscalPeriod}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      if (!response.ok) throw new Error(await response.text());
      const result = await response.json();
      if (result.success) {
        toast.success(editingId ? 'Fiscal Period updated successfully!' : 'Fiscal Period added successfully!');
        await fetchFiscalPeriods(view);
        handleCancel();
      } else {
        throw new Error(result.message || 'API Error');
      }
    } catch (error) {
      toast.error(`Save Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFiscalPeriodName('');
    setFiscalPeriodStartDate('');
    setFiscalPeriodEndDate('');
    setFiscalPeriodStatus('');
    setFiscalYear(new Date().getFullYear());
    setEditingId(null);
    toast.info('Action canceled');
  };

  const handleEdit = (period) => {
    setFiscalPeriodName(period.FiscalPeriodName);
    setFiscalPeriodStartDate(period.FiscalPeriodStartDate);
    setFiscalPeriodEndDate(period.FiscalPeriodEndDate);
    setFiscalPeriodStatus(period.FiscalPeriodStatus);
    setFiscalYear(period.FiscalYear);
    setEditingId(period.id);
  };

  const handleSoftDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Set fiscal period as inactive?',
      html: '<small class="text-danger">It will be moved to the inactive list.</small>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Inactivate!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      reverseButtons: true,
      focusCancel: true,
      backdrop: true,
    });
    if (!confirm.isConfirmed) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.FiscalPeriod}${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ IsActive: false }),
      });
      if (!response.ok) throw new Error(await response.text());
      const result = await response.json();
      if (result.success) {
        toast.success('Fiscal Period moved to inactive!');
        await fetchFiscalPeriods(view);
      } else {
        throw new Error(result.message || 'Update failed');
      }
    } catch (error) {
      Swal.fire('Error', `Inactivate Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.FiscalPeriod}${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ IsActive: true }),
      });
      if (!response.ok) throw new Error(await response.text());
      const result = await response.json();
      if (result.success) {
        toast.success('Fiscal Period activated!');
        await fetchFiscalPeriods(view);
      } else {
        throw new Error(result.message || 'Activate failed');
      }
    } catch (error) {
      Swal.fire('Error', `Activate Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const LoadingSpinner = () => (
    <div className="d-flex justify-content-center align-items-center" style={{
      height: "100vh",
      width: "100vw",
      position: "fixed",
      top: 0,
      left: 0,
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      zIndex: 2000,
    }}>
      <div className="text-center">
        <div className="custom-ring-loader"></div>
        <p className="mt-2 fw-semibold text-dark">Loading...</p>
      </div>
      <style>{`
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
      `}</style>
    </div>
  );

  if (fetchLoading) return <LoadingSpinner />;

  return (
      <div className="container-fluid py-4" style={{ background: '#f5f5f5', minHeight: '80vh' }}>
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Input Form - unchanged */}
      <div className="row">
        <div className="col-lg-5 mb-4">
          <div className="p-4 bg-white rounded shadow-sm">
            <div className="mb-3">
              <label className="label-color">
                Fiscal Period Name  <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                className="input-field-style"
                value={FiscalPeriodName}
                onChange={(e) => setFiscalPeriodName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="row mb-3">
              <div className="col-6">
                <label className="label-color">
                  Start Date  <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="date" className="input-field-style" value={FiscalPeriodStartDate} onChange={(e) => setFiscalPeriodStartDate(e.target.value)} disabled={loading} />
              </div>
              <div className="col-6">
                <label className="label-color">
                  EndDate  <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="date" className="input-field-style" value={FiscalPeriodEndDate} onChange={(e) => setFiscalPeriodEndDate(e.target.value)} disabled={loading} />
              </div>
            </div>

            <div className="mb-3">
              <label className="label-color">
                Fiscal Period Status  <span style={{ color: 'red' }}>*</span>
              </label>
              <select className="select-field-style" value={FiscalPeriodStatus} onChange={(e) => setFiscalPeriodStatus(e.target.value)} disabled={loading}>
                <option value="">-- Select Status --</option>
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
                <option value="Upcoming">Upcoming</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="label-color">
                FiscalYear  <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                className="input-field-style"
                value={FiscalYear}
                onChange={(e) => setFiscalYear(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="d-flex gap-2">
              <button
                onClick={handleSave}
                disabled={loading || !FiscalPeriodName || !FiscalPeriodStartDate || !FiscalPeriodEndDate || !FiscalPeriodStatus || !FiscalYear}
                className="save-btn"  >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                {editingId ? 'Update' : 'Save'}
              </button>
              <button onClick={handleCancel} disabled={loading} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>

        {/* Right Column containing the table and actions */}
        <div className="col-lg-7 mb-4">
          <div style={{ background: 'white', padding: '25px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ overflowX: 'auto' }}>
              {loading && <LoadingSpinner />}
              <table className="table table-bordered table-striped mt-3">
                <thead>
                  <tr style={{ borderBottom: '2px solid' }}>
                    <th className="text-primary">Fiscal Period Name</th>
                    <th className="text-primary">Start Date</th>
                    <th className="text-primary">End Date</th>
                    <th className="text-primary">Fiscal Period Status</th>
                    <th className="text-primary">Fiscal Year</th>
                    {view === "active" ? (
                      <>
                        <th className="text-primary">Edit</th>
                        <th className="text-primary">Delete</th>
                      </>
                    ) : (
                      <th className="text-primary">Activate</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.map((fp) => (
                    <tr key={fp.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td >{fp.FiscalPeriodName}</td>
                      <td >{fp.FiscalPeriodStartDate}</td>
                      <td >{fp.FiscalPeriodEndDate}</td>
                      <td >{fp.FiscalPeriodStatus}</td>
                      <td >{fp.FiscalYear}</td>
                      {view === "active" ? (
                        <>
                          <td>
                            <button
                              onClick={() => handleEdit(fp)}
                              disabled={loading}
                              style={{
                                padding: '6px 12px',
                                background: loading ? '#ccc' : '#0066cc',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px'
                              }}
                            >
                              <Eye size={18} />
                            </button>
                          </td>
                          <td>
                            <button
                              onClick={() => handleSoftDelete(fp.id)}
                              disabled={loading}
                              style={{
                                padding: '6px 12px',
                                background: loading ? '#ccc' : '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px'
                              }}
                            >
                              {loading ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={18} />}
                            </button>
                          </td>
                        </>
                      ) : (
                        <td>
                          <button
                            onClick={() => handleActivate(fp.id)}
                            disabled={loading}
                            className="btn btn-success btn-sm"
                            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            Activate
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
              totalRecords={FiscalPeriods.length}
              recordsPerPage={recordsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              />
              {FiscalPeriods.length === 0 && !loading && (
                <div style={{ textAlign: 'left', padding: '30px', color: '#999', fontSize: '18px' }}>
                  No Fiscal Periods found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateFiscalPeriod;

