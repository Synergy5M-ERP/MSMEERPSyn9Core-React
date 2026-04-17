import React, { useState, useEffect, useCallback } from 'react';
import {
  FileSpreadsheet, Edit3, FilterX, Loader2, Trash2, Download, ListOrdered
} from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/apiconfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewManualPR = ({ onEdit }) => {
  // --- State Management ---
  const [filters, setFilters] = useState({ prNumber: '', department: '', startDate: '', endDate: '' });
  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [prNumbers, setPrNumbers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Reactive Entries Per Page
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Helper to show NA if data is missing
  const formatDisplayValue = (val) => (val === undefined || val === null || val === "" ? "N/A" : val);

  // --- Data Fetching ---
  const fetchTableData = useCallback(async (page = 1, pageSize = entriesPerPage) => {
    setLoading(true);
    try {
      const params = {
        page,
        pageSize: pageSize,
        ...filters
      };

      const response = await axios.get(API_ENDPOINTS.ViewManualPRList, { params });
      const result = response.data;

      setData(result.data || []);
      setTotalRecords(result.totalCount || result.totalRecords || result.total || 0);
      setTotalPages(result.totalPages || Math.ceil((result.totalCount || result.total || 0) / pageSize));
      setCurrentPage(page);

      // Fetch PR numbers for filter dropdown
      const prRes = await axios.get(API_ENDPOINTS.GetPRNumbers);
      setPrNumbers(prRes.data || []);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error("Error loading table data");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [filters, entriesPerPage]);

  const fetchMasterData = useCallback(async () => {
    try {
      const deptRes = await axios.get(API_ENDPOINTS.Departments);
      setDepartments(deptRes.data || []);
    } catch (e) {
      console.error("Master data fetch failed:", e);
    }
  }, []);

  // --- Effects ---
  useEffect(() => {
    fetchMasterData();
  }, [fetchMasterData]);

  useEffect(() => {
    fetchTableData(1, entriesPerPage);
  }, [filters, entriesPerPage, fetchTableData]);

  // --- Event Handlers ---
  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setEntriesPerPage(newSize);
    // useEffect will trigger fetchTableData(1, newSize)
  };

  const handleEditClick = (item) => {
    if (onEdit) onEdit(item);
  };

  const handleDeleteClick = async (item) => {
    if (window.confirm(`Are you sure you want to delete PR ${item.prNo || item.id}?`)) {
      try {
        await axios.delete(API_ENDPOINTS.DeleteManualPR(item.prNo));
        toast.success('PR deleted successfully');
        fetchTableData(currentPage);
      } catch (error) {
        toast.error('Failed to delete PR');
      }
    }
  };


  // Add a helper function for the download logic
  const downloadFile = async (url, fileName, type) => {
    try {
      toast.info(`Generating ${type}...`);
      const response = await axios.get(url, { responseType: 'blob' });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(blobUrl);
      toast.success(`${type} downloaded successfully`);
    } catch (error) {
      toast.error(`Failed to export ${type}`);
    }
  };

  const handleExportExcel = (item) => {
    const fileName = `PR_${(item.prNo || item.id).replace(/[\\/]/g, '_')}.xlsx`;
    const url = `${API_ENDPOINTS.ExportPRByNumber}?prNumber=${item.prNo || item.id}`;
    downloadFile(url, fileName, 'Excel');
  };

  const handleExportPdf = (item) => {
    const fileName = `PR_${(item.prNo || item.id).replace(/[\\/]/g, '_')}.pdf`;
    // Ensure you add this endpoint to your apiconfig.js
    const url = `${API_ENDPOINTS.ExportPRByNumberPdf}?prNumber=${item.prNo || item.id}`;
    downloadFile(url, fileName, 'PDF');
  };

  const handleExportClick = async (item) => {
    try {
      toast.info(`Generating Excel for ${item.prNo || item.id}...`);
      const response = await axios.get(
        `${API_ENDPOINTS.ExportPRByNumber}?prNumber=${item.prNo || item.id}`,
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `PR_${(item.prNo || item.id).replace(/[\\/]/g, '_')}.xlsx`;
      a.click();
      toast.success('Excel exported successfully');
    } catch (error) {
      toast.error('Failed to export Excel');
    }
  };

  // --- Pagination Controls ---
  const PaginationControls = () => (
    <div style={{
      padding: '20px',
      background: 'linear-gradient(to bottom, #f8fafc, #f1f5f9)',
      borderTop: '2px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px'
    }}>


      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className='mb-4'>
        <button
          className="pagination-btn"
          onClick={() => fetchTableData(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: '10px 16px',
            border: '2px solid #e2e8f0',
            background: currentPage === 1 ? '#f1f5f9' : 'white',
            borderRadius: '8px',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            fontWeight: 600, fontSize: '14px'
          }}
        >
          Previous
        </button>

        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNum = currentPage <= 3 ? i + 1 : (currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i);
          if (pageNum <= 0 || pageNum > totalPages) return null;
          return (
            <button
              key={pageNum}
              onClick={() => fetchTableData(pageNum)}
              style={{
                minWidth: '40px', height: '36px', borderRadius: '6px',
                border: currentPage === pageNum ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                background: currentPage === pageNum ? '#3b82f6' : 'white',
                color: currentPage === pageNum ? 'white' : '#374151',
                cursor: 'pointer', fontWeight: 700
              }}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          className="pagination-btn"
          onClick={() => fetchTableData(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: '10px 16px',
            border: '2px solid #e2e8f0',
            background: currentPage === totalPages ? '#f1f5f9' : 'white',
            borderRadius: '8px',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            fontWeight: 600, fontSize: '14px'
          }}
        >
          Next
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '80vh' }}>
      <ToastContainer theme="colored" position="top-right" />

      {/* FILTER SECTION */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '15px', marginBottom: '15px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        {/* <div style={{ marginBottom: '12px' }}>
          <h6 style={{ margin: 0, color: '#1e293b', fontWeight: 700, fontSize: '16px' }}>Filter Purchase Requisitions</h6>
        </div> */}
        <div className='row'>
          <div className="col">
            <label className="label-color">PR Number</label>
            <select className="select-field-style" value={filters.prNumber} onChange={(e) => setFilters({ ...filters, prNumber: e.target.value })}>
              <option value="">All PRs</option>
              {prNumbers.map(pr => <option key={pr.id} value={pr.id}>{pr.id}</option>)}
            </select>
          </div>
          <div className="col">
            <label className="label-color">Department</label>
            <select className="select-field-style" value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })}>
              <option value="">All Departments</option>
              {departments.map(d => <option key={d.id} value={d.departmentName}>{d.departmentName}</option>)}
            </select>
          </div>
          <div className="col">
            <label className="label-color">Start Date</label>
            <input type="date" className="input-field-style" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
          </div>
          <div className="col">
            <label className="label-color">End Date</label>
            <input type="date" className="input-field-style" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
          </div>
          <div className='col'>
            <label className="label-color">Clear</label>
            <button className="btn-clear" onClick={() => setFilters({ prNumber: '', department: '', startDate: '', endDate: '' })}>
              <FilterX size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} className='row'>
        <div style={{ padding: '13px 12px', background: 'linear-gradient(to right, #f8fafc, #f1f5f9)', borderBottom: '2px solid #e2e8f0' }} className='col'>
          <h6 style={{ margin: 0, color: '#1e293b', fontSize: '13px' }}>
            <FileSpreadsheet size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            Purchase Requisition Records
            {!loading && data.length > 0 && (
              <span style={{ marginLeft: '12px', fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
                Page {currentPage} of {totalPages} ({totalRecords} total)
              </span>
            )}
          </h6>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }} className='col'>
          {/* Page Size Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#f8fafc', fontWeight: 600 }}>Show</span>
            <select
              value={entriesPerPage}
              onChange={handlePageSizeChange}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: '2px solid #cbd5e1',
                fontSize: '13px',
                fontWeight: 700,
                color: '#1e293b'
              }}
            ><option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>
            Showing {((currentPage - 1) * entriesPerPage) + 1} to {Math.min(currentPage * entriesPerPage, totalRecords)} of {totalRecords}
          </div>
        </div>
        {loading ? (
          <div style={{ padding: '80px', textAlign: 'center' }}>
            <Loader2 size={48} className="spinner" style={{ color: '#3b82f6' }} />
            <p style={{ marginTop: '16px', color: '#64748b', fontSize: '15px' }}>Loading data...</p>
          </div>
        ) : data.length === 0 ? (
          <div style={{ padding: '80px', textAlign: 'center', color: '#64748b' }}>
            <FileSpreadsheet size={56} style={{ opacity: 0.3, marginBottom: '16px' }} />
            <p style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>No Records Found</p>
          </div>
        ) : (
          <>
            {/* 1. Wrapper to contain the scroll */}
            <div style={{
              maxHeight: '360px',
              overflowY: 'auto',
              position: 'relative',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead style={{
                  /* 2. Makes the header stay at the top */
                  position: 'sticky',
                  top: 0,
                  zIndex: 10,
                  background: '#f1f5f9',
                  boxShadow: '0 1px 0 #e2e8f0'
                }}>
                  <tr>
                    <th className="th-cell">PR No</th>
                    <th className="th-cell">Date</th>
                    <th className="th-cell">Department</th>
                    <th className="th-cell">Item Details</th>
                    <th className="th-cell">Grade</th>
                    <th className="th-cell">Quantity</th>
                    <th className="th-cell">Value</th>
                    <th className="th-cell text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={item.id} className="table-row" style={{ background: index % 2 === 0 ? 'white' : '#fafbfc' }}>
                      <td className="td-cell" style={{ fontWeight: 500, fontSize: '13px', fontFamily: 'monospace' }}>
                        {formatDisplayValue(item.prNo)}
                      </td>
                      <td className="td-cell" style={{ fontWeight: 700, fontSize: '13px', fontFamily: 'monospace' }}>
                        {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td >
                        <div style={{ fontWeight: 600 }}>{formatDisplayValue(item.department)}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{formatDisplayValue(item.itemName)}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>Code: {item.itemCode}</div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{formatDisplayValue(item.grade)}</td>
                      <td >
                        <span style={{ fontWeight: 600 }}>{formatDisplayValue(item.requiredQty)}</span>
                        {item.uom && <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: '4px' }}>{item.uom}</span>}
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: '#059669' }}>
                          {item.value || item.totalValue ? `₹${parseFloat(item.value || item.totalValue).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : 'N/A'}
                        </span>
                      </td>

                      <td className="td-cell text-center">
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          {/* Edit Button */}
                          <button onClick={() => handleEditClick(item)} title="Edit" style={{ background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', border: '1px solid #93c5fd', color: '#1e40af', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                            <Edit3 size={14} />
                          </button>

                          {/* Export Group */}
                          <div className="export-group" style={{ display: 'flex', border: '1px solid #86efac', borderRadius: '6px', overflow: 'hidden' }}>
                            <button
                              onClick={() => handleExportExcel(item)}
                              title="Export Excel"
                              style={{ background: '#dcfce7', color: '#166534', border: 'none', borderRight: '1px solid #86efac', padding: '6px 8px', cursor: 'pointer' }}
                            >
                              <FileSpreadsheet size={14} />
                            </button>
                            <button
                              onClick={() => handleExportPdf(item)}
                              title="Export PDF"
                              style={{ background: '#fef2f2', color: '#991b1b', border: 'none', padding: '6px 8px', cursor: 'pointer' }}
                            >
                              <Download size={14} />
                            </button>
                          </div>

                          {/* Delete Button */}
                          <button onClick={() => handleDeleteClick(item)} title="Delete" style={{ background: 'linear-gradient(135deg, #fee2e2, #fecaca)', border: '1px solid #fca5a5', color: '#b91c1c', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>

                      {/* <td className="td-cell text-center">
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button onClick={() => handleEditClick(item)} style={{ background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', border: '1px solid #93c5fd', color: '#1e40af', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                            <Edit3 size={14} />
                          </button>
                          <button onClick={() => handleExportClick(item)} style={{ background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)', border: '1px solid #86efac', color: '#166534', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                            <Download size={14} />
                          </button>
                          <button onClick={() => handleDeleteClick(item)} style={{ background: 'linear-gradient(135deg, #fee2e2, #fecaca)', border: '1px solid #fca5a5', color: '#b91c1c', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          
            <PaginationControls />
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spinner { animation: spin 1s linear infinite; }
         .filter-input { width: 100%; padding: 6px 4px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 14px; background: white; }
        .btn-clear { background: linear-gradient(to bottom, #f8fafc, #f1f5f9) !important; border: 2px solid #cbd5e1 !important; padding: 6px 4px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 13px; color: #475569; text-transform: uppercase; }
        .th-cell { padding: 10px; text-align: left; font-size: 12px; font-weight: 500; color: #334155; text-transform: uppercase; border-bottom: 2px solid #cbd5e1; }
        .td-cell { padding: 10px 10px; font-size: 14px; color: #1e293b; border-bottom: 1px solid #f1f5f9; }
        .table-row:hover { background: #f8fafc !important; }
        button:hover:not(:disabled) { transform: translateY(-1px) !important; box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important; }
      `}</style>
    </div>
  );
};

export default ViewManualPR;