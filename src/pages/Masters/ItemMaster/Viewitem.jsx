
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { DeleteIcon, RefreshCcw } from 'lucide-react';
import { RiDeleteBin3Fill } from 'react-icons/ri';
function View_items() {
  // State management
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Base URL for your ASP.NET API
  const API_BASE_URL = 'http://localhost:49980/Item';

  // Load items on component mount
  useEffect(() => {
    fetchAllItems();
  }, []);

  // Filter items based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item =>
        item.Item_Code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Item_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Grade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Company_Name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    }
    setCurrentPage(1); // Reset to first page when searching
  }, [searchTerm, items]);

  // Fetch all items from API
  const fetchAllItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/GetAllItemsApi`);
      const result = await response.json();
      
      if (result.success) {
        setItems(result.data || []);
        toast.success('Items loaded successfully!');
      } else {
        toast.error(result.message || 'Failed to load items');
      }
    } catch (error) {
      toast.error('Error fetching items: ' + error.message);
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete item
const handleDelete = async (id) => {
  // 1️⃣ animated confirmation ----------
  const confirm = await Swal.fire({
    title: 'Delete this item?',
    html: '<small class="text-danger">This action cannot be undone.</small>',
    icon: 'warning',

    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',

    confirmButtonColor: '#d33',
    cancelButtonColor : '#6c757d',

    reverseButtons: true,
    focusCancel: true,
    backdrop: true,
  });

  if (!confirm.isConfirmed) return;   // User pressed “Cancel”

  // 2️⃣ server call ----------
  try {
    const response = await fetch(`${API_BASE_URL}/DeleteItemApi`, {
      method : 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body   : `id=${id}`,
    });
    const result = await response.json();

    if (result.success) {
      await Swal.fire({
        icon            : 'success',
        title           : 'Deleted!',
        text            : 'Item removed from list.',
        timer           : 1500,
        showConfirmButton: false,
      });
      fetchAllItems();                       // refresh
    } else {
      Swal.fire('Oops…', result.message || 'Failed to delete item.', 'error');
    }
  } catch (error) {
    Swal.fire('Error', error.message, 'error');
  }
};

  // Open edit modal
  const handleEdit = (item) => {
    setEditingItem({ ...item });
    setShowEditModal(true);
  };

  // Update item
  const handleUpdate = async () => {
    if (!editingItem) return;

    try {
      const formData = new FormData();
      formData.append('Company_Name', editingItem.Company_Name || '');
      formData.append('Item_Name', editingItem.Item_Name || '');
      formData.append('Grade', editingItem.Grade || '');
      formData.append('Unit_Of_Measurement', editingItem.Unit_Of_Measurement || '');
      formData.append('Currency', editingItem.Currency || '');
      formData.append('Average_Price', editingItem.Average_Price || '');
      formData.append('Safe_Stock', editingItem.Safe_Stock || '');
      formData.append('MOQ', editingItem.MOQ || '');
      formData.append('TC_COA', editingItem.TC_COA || '');

      const response = await fetch(`${API_BASE_URL}/UpdateItemApi?id=${editingItem.Id}`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('Item updated successfully!');
        setShowEditModal(false);
        setEditingItem(null);
        fetchAllItems(); // Refresh the list
      } else {
        toast.error(result.message || 'Failed to update item');
      }
    } catch (error) {
      toast.error('Error updating item: ' + error.message);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
          <style jsx>{`
         body{
          font-size: 14px;
        letter-spacing: 0.01em;
         }
        th{
         fontSize:'13px'}
         `}</style>
      <div className="d-flex flex-column" style={{ minHeight: "80vh" }}>
        <div className="container-fluid m-3">
          {/* <div className="text-center bg-white p-3 m-2 " style={{ position: 'sticky', top: '0', zIndex: '10', borderRadius: '8px' }}>
            <h4 className="text-primary m-2 fw-bold p-2">VIEW ITEM DETAILS</h4>
          </div> */}

          {/* Search and Actions */}
          <div className="row mb-3 p-3 m-2">
            <div className="col-md-4">
              <div className="input-group shadow-sm">
                <input
                  type="text"
                  className="form-control border-0 rounded-start" style={{fontSize:'14px'}}
                  placeholder="Search by Item Code, Name, Grade, or Company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-outline-secondary rounded-end" type="button">
                  🔍
                </button>
              </div>
            </div>
             <div className="col-md-4">
              <h4 className="text-primary m-2  p-2 h2">VIEW ITEM DETAILS</h4>
             </div>
            <div className="col-md-4 text-end">
              <button
                className="btn btn-success me-2 shadow-sm"
                onClick={fetchAllItems}
                disabled={loading}
                style={{
                
                    backgroundColor: "#100670",
                }}
                
              >
                {/* 🔄   */}
                <RefreshCcw/>
              </button>
              <span className="badge bg-info p-2 m-2" style={{fontSize:"14px",height:"30px"}}>
                Total Items: {filteredItems.length}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                <table className="table table-striped table-hover align-middle">
                  <thead className="table-primary border">
                    <tr>
                      <th style={{ width: '1%' , fontSize:'13px'}}>Sr.No</th>
                      <th style={{ width: '12%' , fontSize:'13px'}}>Item Code</th>
                      <th style={{ width: '18%', fontSize:'13px' }}>Item Name</th>
                      <th style={{ width: '10%', fontSize:'13px' , fontSize:'13px'}}>Grade</th>
                      <th style={{ width: '15%', fontSize:'13px' }}>Company Name</th>
                      <th style={{ width: '15%', fontSize:'13px' }}>Industry Name</th>
                      <th style={{ width: '15%', fontSize:'13px' }}>category Name</th>
                      <th style={{ width: '8%', fontSize:'13px' }}>UOM</th>
                      <th style={{ width: '8%', fontSize:'13px' }}>Currency</th>
                      <th style={{ width: '10%', fontSize:'13px' }}>Avg Price</th>
                      <th style={{ width: '8%' , fontSize:'13px'}}>Safe Stock</th>
                      <th style={{ width: '8%' , fontSize:'13px'}}>MOQ</th>
                      <th style={{ width: '8%' , fontSize:'13px'}}>TC/COA</th>
                      <th style={{ width: '10%', fontSize:'13px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? (
                      currentItems.map((item, index) => (
                        <tr key={item.Id} className="table-row">
                          <td>{indexOfFirstItem + index + 1}</td>
                          <td>
                            <strong className="text-primary">{item.Item_Code}</strong>
                          </td>
                          <td>{item.Item_Name}</td>
                          <td>{item.Grade}</td>
                          <td>{item.Company_Name}</td>
                          <td>{item.Industry}</td>
                          <td>{item.ItemCategory}</td>
                          <td>{item.Unit_Of_Measurement}</td>
                          <td>{item.Currency}</td>
                          <td>
                            {item.Average_Price 
                              ? `${item.Currency} ${parseFloat(item.Average_Price).toFixed(2)}` 
                              : '-'}
                          </td>
                          <td>{item.Safe_Stock || '-'}</td>
                          <td>{item.MOQ || '-'}</td>
                          <td>{item.TC_COA || '-'}</td>
                          <td>
                            <div className="d-flex ">
                              {/* <button
                                className="btn btn-sm btn-primary shadow-sm"
                                onClick={() => handleEdit(item)}
                                title="Edit"
                              >
                                ✏️
                              </button> */}
                             
                              <button
                                className="btn btn-sm  shadow-sm center"
                                onClick={() => handleDelete(item.Id)}
                                title="Delete"
                              >
                                <RiDeleteBin3Fill style={{fontSize:"16px" , color:"red"}}/>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="12" className="text-center py-4">
                          <div className="text-muted h4">
                            {searchTerm ? 'No items found matching your search.' : 'No items available.'}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="text-muted">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredItems.length)} of {filteredItems.length} entries
              </div>
              <nav aria-label="Page navigation">
                <ul className="pagination mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>
                  
                  {getPageNumbers().map(number => (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => paginate(number)}
                      >
                        {number}
                      </button>
                    </li>
                  ))}
                  
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Edit Item - {editingItem.Item_Code}</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Company Name</label>
                    <input
                      type="text"
                      className="form-control shadow-sm"
                      value={editingItem.Company_Name || ''}
                      onChange={(e) => setEditingItem({...editingItem, Company_Name: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Item Name</label>
                    <input
                      type="text"
                      className="form-control shadow-sm"
                      value={editingItem.Item_Name || ''}
                      onChange={(e) => setEditingItem({...editingItem, Item_Name: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Grade</label>
                    <input
                      type="text"
                      className="form-control shadow-sm"
                      value={editingItem.Grade || ''}
                      onChange={(e) => setEditingItem({...editingItem, Grade: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Unit of Measurement</label>
                    <input
                      type="text"
                      className="form-control shadow-sm"
                      value={editingItem.Unit_Of_Measurement || ''}
                      onChange={(e) => setEditingItem({...editingItem, Unit_Of_Measurement: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Currency</label>
                    <input
                      type="text"
                      className="form-control shadow-sm"
                      value={editingItem.Currency || ''}
                      onChange={(e) => setEditingItem({...editingItem, Currency: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Average Price</label>
                    <input
                      type="number"
                      className="form-control shadow-sm"
                      value={editingItem.Average_Price || ''}
                      onChange={(e) => setEditingItem({...editingItem, Average_Price: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Safe Stock</label>
                    <input
                      type="number"
                      className="form-control shadow-sm"
                      value={editingItem.Safe_Stock || ''}
                      onChange={(e) => setEditingItem({...editingItem, Safe_Stock: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">MOQ</label>
                    <input
                      type="number"
                      className="form-control shadow-sm"
                      value={editingItem.MOQ || ''}
                      onChange={(e) => setEditingItem({...editingItem, MOQ: e.target.value})}
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label fw-bold">TC/COA</label>
                    <select
                      className="form-select shadow-sm"
                      value={editingItem.TC_COA || ''}
                      onChange={(e) => setEditingItem({...editingItem, TC_COA: e.target.value})}
                    >
                      <option value="">Select...</option>
                      <option value="Required">Required</option>
                      <option value="Not Required">Not Required</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer bg-light">
                <button
                  type="button"
                  className="btn btn-secondary shadow-sm"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary save shadow-sm"
                  onClick={handleUpdate}
                >
                  Update Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />

      <style jsx>{`
        .table-container {
          max-height: 600px;
          overflow-y: auto;
          border-radius: 0.5rem;
        }

        .table {
          border-collapse: collapse;
          width: 100%;
          margin: 0;
        }

        .table th, 
        .table td {
          border: 1px solid #e0e0e0;
          padding: 12px 15px;
          text-align: center;
          vertical-align: middle;
        }

        .table thead th {
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .table tr:nth-child(even) {
          background-color: #f8f9fa;
        }

        .table tr:hover {
          background-color: #e9ecef;
          transform: scale(1.01);
          transition: all 0.2s ease;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          cursor: pointer;
        }

        .table-row {
          transition: all 0.2s ease;
        }

        .table-row:hover {
          background-color: #e9ecef !important;
        }

        /* Custom scrollbar styling */
        .table-container::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }

        .table-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .table-container::-webkit-scrollbar-thumb {
          background: #c0c0c0;
          border-radius: 10px;
          border: 2px solid #f1f1f1;
        }

        .table-container::-webkit-scrollbar-thumb:hover {
          background: #a0a0a0;
        }

        .btn-sm {
          padding: 0.25rem 0.5rem;
          font-size: 0.775rem;
          border-radius: 0.25rem;
        }

        .pagination .page-link {
          font-size: 0.9rem;
          padding: 0.375rem 0.75rem;
          margin: 0 2px;
          border-radius: 0.25rem !important;
          background-color: #f8f9fa;
          border: 1px solid #dee2e6;
        }

        .pagination .page-item.active .page-link {
          z-index: 3;
          color: #fff;
          background-color: #0d6efd;
          border-color: #0d6efd;
        }

        .pagination .page-link:focus {
          z-index: 3;
          outline: 0;
          outline: 0.2rem solid rgba(13, 110, 253, 0.5);
        }

        .shadow-sm {
          box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
        }

        .shadow-lg {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>
    </>
  );
}

export default View_items;


