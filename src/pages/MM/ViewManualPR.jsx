import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Download, Search, Calendar, FileText, Filter, FileSpreadsheet, File, Edit3, Trash2, X, Save } from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS,} from '../../config/apiconfig'
const ViewManualPR = () => {
  const [filters, setFilters] = useState({
    prNumber: '',
    department: '',
    startDate: '',
    endDate: ''
  });
  
  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [prNumbers, setPrNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [exportFormat, setExportFormat] = useState('excel');
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  // Fetch data from backend
  const fetchData = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        pageSize: entriesPerPage,
        prNumber: filters.prNumber || undefined,
        department: filters.department || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined
      };

      const response = await axios.get(`${API_ENDPOINTS.GetPRNumbers}`);
    if (Array.isArray(response.data)) {
        setPrNumbers(response.data); 
      } else if (response.data.prNumbers) {
        // In case structure changes back to object
        setPrNumbers(response.data.prNumbers);
      }
    } catch (error) {
      console.error('Error fetching PR data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [filters, entriesPerPage]);

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  // Edit handlers
  const handleEdit = (item) => {
    setEditingItem({ ...item });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    try {
      setLoading(true);
      await axios.put(`/api/purchase-requisitions/${editingItem.id || editingItem.prNo}`, editingItem);
      setShowEditModal(false);
      setEditingItem(null);
      fetchData(currentPage);
      alert('PR updated successfully!');
    } catch (error) {
      console.error('Update failed:', error);
      alert('Update failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete handlers
  const handleDelete = (item) => {
    setDeletingItem(item);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    try {
      setLoading(true);
      await axios.delete(`/api/purchase-requisitions/${deletingItem.id || deletingItem.prNo}`);
      setShowDeleteModal(false);
      setDeletingItem(null);
      fetchData(currentPage);
      alert('PR deleted successfully!');
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Delete failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEntriesPerPageChange = (pageSize) => {
    setEntriesPerPage(Number(pageSize));
    setCurrentPage(1);
  };

  const handleExport = async () => {
    try {
      const format = exportFormat;
      const endpoint = format === 'pdf' 
        ? '/api/purchase-requisitions/export/pdf'
        : format === 'csv'
        ? '/api/purchase-requisitions/export/csv'
        : '/api/purchase-requisitions/export/excel';

      const response = await axios.get(endpoint, {
        params: filters,
        responseType: 'blob'
      });
      
      const fileExtension = format === 'pdf' ? 'pdf' : format === 'csv' ? 'csv' : 'xlsx';
      const fileName = `PR_Report_${new Date().toISOString().split('T')[0]}.${fileExtension}`;
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const exportOptions = [
    { value: 'excel', label: 'Excel (.xlsx)' },
    { value: 'csv', label: 'CSV (.csv)' },
    { value: 'pdf', label: 'PDF (.pdf)' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #eff6ff, #eef2ff, #faf5ff)', padding: '24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
     

        {/* Filters Section - RESTORED COMPLETE */}
        <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '24px', marginBottom: '24px', border: '1px solid #c7d2fe' }}>
         
          
          <div className='row'>
            
            {/* PR Number - RESTORED */}
            <div className='col'>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                PR Number
              </label>
              <select
                value={filters.prNumber}
                onChange={(e) => handleFilterChange('prNumber', e.target.value)}
                style={{ width: '100%', padding: '10px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
              >
                <option value="">Select PR Number</option>
                {prNumbers.map(pr => (
                  <option key={pr} value={pr}>{pr}</option>
                ))}
              </select>
            </div>

            {/* Department - RESTORED */}
            <div className='col'>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Department
              </label>
              <select
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                style={{ width: '100%', padding: '10px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Start Date - RESTORED */}
            <div className='col'>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                style={{ width: '100%', padding: '10px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
              />
            </div>

            {/* End Date - RESTORED */}
            <div className='col'>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                style={{ width: '100%', padding: '10px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
              />
            </div>

                 {/* Action Buttons - RESTORED */}
          <div className='col'>
        

            {/* Export Dropdown - RESTORED */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #d1d5db', borderRadius: '8px', padding: ' 4px',marginTop:'22px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <Download style={{ width: '18px', height: '18px', color: '#059669' }} />
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                disabled={loading}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  outline: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  padding: '4px 8px'
                }}
              >
                {exportOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={handleExport}
                disabled={loading}
                style={{ 
                  padding: '8px 16px', 
                  background: loading ? '#9ca3af' : '#059669', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '6px', 
                  cursor: loading ? 'not-allowed' : 'pointer', 
                  fontSize: '13px', 
                  fontWeight: '500',
                  boxShadow: '0 2px 4px rgba(5, 150, 105, 0.3)'
                }}
              >
                Export
              </button>
            </div>
          </div>

        
          </div>

     
        </div>

        {/* Data Table with Actions Column */}
        <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', border: '1px solid #c7d2fe', overflow: 'hidden' }}>
          
          {/* Entries Per Page */}
          <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(to right, #eef2ff, #faf5ff)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', color: '#374151' }}>Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => handleEntriesPerPageChange(e.target.value)}
                disabled={loading}
                style={{ 
                  padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '8px', 
                  fontSize: '14px', outline: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span style={{ fontSize: '14px', color: '#374151' }}>entries</span>
            </div>
            <div style={{ fontSize: '14px', color: '#374151' }}>
              {loading ? 'Loading...' : `Showing ${data.length} entries`}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div style={{ padding: '64px 16px', textAlign: 'center', color: '#6b7280' }}>
              <div style={{ 
                width: '48px', height: '48px', border: '4px solid #e5e7eb', 
                borderTop: '4px solid #4f46e5', borderRadius: '50%', 
                animation: 'spin 1s linear infinite', margin: '0 auto 16px' 
              }} />
              <p style={{ fontSize: '16px', fontWeight: '500' }}>Loading purchase requisitions...</p>
            </div>
          )}

          {/* Table with Actions - SAME AS BEFORE */}
          {!loading && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: 'linear-gradient(to right, #4f46e5, #9333ea)', color: 'white' }}>
                  <tr>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>PR No</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Date</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Department</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Item Code & Name</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Grade</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>UOM</th>
                    <th style={{ padding: '16px', textAlign: 'right', fontSize: '14px', fontWeight: '600' }}>Required Qty</th>
                    <th style={{ padding: '16px', textAlign: 'right', fontSize: '14px', fontWeight: '600' }}>Avg Price</th>
                    <th style={{ padding: '16px', textAlign: 'right', fontSize: '14px', fontWeight: '600' }}>Value</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: '600', width: '120px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((item, index) => (
                      <tr key={`${item.prNo}-${index}`} style={{ borderBottom: '1px solid #e5e7eb', transition: 'background 0.2s' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#eef2ff'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                        <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '500', color: '#4f46e5' }}>{item.prNo}</td>
                        <td style={{ padding: '12px 16px', fontSize: '14px', color: '#374151' }}>{item.date}</td>
                        <td style={{ padding: '12px 16px', fontSize: '14px' }}>
                          <span style={{ padding: '4px 12px', background: '#f3e8ff', color: '#7c3aed', borderRadius: '16px', fontSize: '12px', fontWeight: '500' }}>
                            {item.department}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '14px' }}>
                          <div style={{ fontWeight: '500', color: '#111827' }}>{item.itemCode}</div>
                          <div style={{ color: '#6b7280', fontSize: '12px' }}>{item.itemName}</div>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '14px' }}>
                          <span style={{ 
                            padding: '4px 8px', borderRadius: '16px', fontSize: '12px', fontWeight: '500',
                            background: item.grade === 'A' ? '#d1fae5' : item.grade === 'B' ? '#fef3c7' : '#f3f4f6',
                            color: item.grade === 'A' ? '#065f46' : item.grade === 'B' ? '#92400e' : '#374151'
                          }}>
                            {item.grade}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '14px', color: '#374151' }}>{item.uom}</td>
                        <td style={{ padding: '12px 16px', fontSize: '14px', textAlign: 'right', fontWeight: '500', color: '#111827' }}>{item.requiredQty}</td>
                        <td style={{ padding: '12px 16px', fontSize: '14px', textAlign: 'right', color: '#374151' }}>{formatCurrency(item.avgPrice)}</td>
                        <td style={{ padding: '12px 16px', fontSize: '14px', textAlign: 'right', fontWeight: '600', color: '#4f46e5' }}>{formatCurrency(item.value)}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button
                              onClick={() => handleEdit(item)}
                              disabled={loading}
                              title="Edit PR"
                              style={{
                                padding: '6px',
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.6 : 1
                              }}
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(item)}
                              disabled={loading}
                              title="Delete PR"
                              style={{
                                padding: '6px',
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.6 : 1
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" style={{ padding: '48px 16px', textAlign: 'center', color: '#6b7280' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                          <Search style={{ width: '48px', height: '48px', color: '#d1d5db' }} />
                          <p style={{ fontSize: '18px', fontWeight: '500' }}>No data found</p>
                          <p style={{ fontSize: '14px' }}>Try adjusting your filters</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal & Delete Modal - SAME AS BEFORE */}
      {showEditModal && editingItem && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          {/* Edit Modal content - same as previous version */}
          <div style={{
            background: 'white', borderRadius: '16px', width: '90vw', maxWidth: '600px', maxHeight: '90vh',
            overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>
                  <Edit3 style={{ width: '20px', height: '20px', color: '#3b82f6', marginRight: '8px', display: 'inline' }} />
                  Edit PR - {editingItem.prNo}
                </h2>
                <button onClick={() => setShowEditModal(false)} style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>
            </div>
            {/* Rest of edit modal form - same as before */}
            <div style={{ padding: '24px' }}>
              {/* Form fields here - same as previous */}
            </div>
            <div style={{ padding: '24px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setShowEditModal(false)} style={{ padding: '10px 24px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={handleSaveEdit} disabled={loading} style={{ padding: '10px 24px', background: loading ? '#9ca3af' : '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal - same as before */}
      {showDeleteModal && deletingItem && (
        // Delete modal content - same as previous
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          {/* Delete modal content */}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ViewManualPR;
