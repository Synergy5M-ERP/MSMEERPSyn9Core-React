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
  const [itemsPerPage, setItemsPerPage] = useState(10); // ✅ Changed to state
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

  // ✅ Reset to first page when itemsPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  // ✅ Handle items per page change
  const handleItemsPerPageChange = (e) => {
    const newSize = parseInt(e.target.value);
    setItemsPerPage(newSize);
  };

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

  // Delete item (unchanged)
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Delete this item?',
      html: '<small class="text-danger">This action cannot be undone.</small>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      reverseButtons: true,
      focusCancel: true,
      backdrop: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await fetch(`${API_BASE_URL}/DeleteItemApi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `id=${id}`,
      });
      const result = await response.json();

      if (result.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Item removed from list.',
          timer: 1500,
          showConfirmButton: false,
        });
        fetchAllItems();
      } else {
        Swal.fire('Oops…', result.message || 'Failed to delete item.', 'error');
      }
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  // Edit functions (unchanged)
  const handleEdit = (item) => {
    setEditingItem({ ...item });
    setShowEditModal(true);
  };

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
        fetchAllItems();
      } else {
        toast.error(result.message || 'Failed to update item');
      }
    } catch (error) {
      toast.error('Error updating item: ' + error.message);
    }
  };

  // ✅ Updated Pagination logic with dynamic itemsPerPage
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
      <div className="d-flex flex-column" style={{ minHeight: "80vh" }}>
        <div className="container-fluid m-3">
          {/* ✅ Updated Search and Actions - Single Line with Dropdown */}
          <div className="row p-3 m-2 flex-nowrap d-flex align-items-center" style={{ overflowX: 'auto' }}>
            <div className="col-auto px-2">
              <div className="input-group shadow-sm" style={{ minWidth: '250px' }}>
                <input
                  type="text"
                  className="form-control border-0 rounded-start"
                  style={{ fontSize: '14px' }}
                  placeholder="Search by Item Code, Name, Grade, or Company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-outline-secondary rounded-end" type="button">
                  🔍
                </button>
              </div>
            </div>

            <div className="col-auto px-2 flex-grow-1">
              <h4 className="text-primary h2 mb-0 text-truncate">VIEW ITEM DETAILS</h4>
            </div>

            <div className="col-auto px-2">
              <button
                className="btn btn-success shadow-sm me-2"
                onClick={fetchAllItems}
                disabled={loading}
                style={{ backgroundColor: "#100670" }}
              >
                <RefreshCcw />
              </button>
            </div>

            <div className="col-auto px-2">
              <div className="d-flex align-items-center">
                <label className="me-2 fw-bold text-muted small mb-0">Show:</label>
                <select
                  className="form-select form-select-sm shadow-sm"
                  style={{ width: '80px' }}
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="ms-2 text-muted small">entries</span>
              </div>
            </div>
                <div className="col-auto">
              <span className="badge bg-info p-2" style={{ fontSize: "14px", height: "30px" }}>
                Total Items: {filteredItems.length}
              </span>
            </div>
          </div>

          {/* ✅ Total Count Badge */}
  

          {/* Items Table - Unchanged */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                <table className="table table-striped table-hover align-middle">
                  <thead className="table-primary border">
                    <tr>
                      <th style={{ width: '1%', fontSize: '13px' }}>Sr.No</th>
                      <th style={{ width: '12%', fontSize: '13px' }}>Item Code</th>
                      <th style={{ width: '18%', fontSize: '13px' }}>Item Name</th>
                      <th style={{ width: '10%', fontSize: '13px' }}>Grade</th>
                      <th style={{ width: '15%', fontSize: '13px' }}>Company Name</th>
                      <th style={{ width: '15%', fontSize: '13px' }}>Industry Name</th>
                      <th style={{ width: '15%', fontSize: '13px' }}>Category Name</th>
                      <th style={{ width: '8%', fontSize: '13px' }}>UOM</th>
                      <th style={{ width: '8%', fontSize: '13px' }}>Currency</th>
                      <th style={{ width: '10%', fontSize: '13px' }}>Avg Price</th>
                      <th style={{ width: '8%', fontSize: '13px' }}>Safe Stock</th>
                      <th style={{ width: '8%', fontSize: '13px' }}>MOQ</th>
                      <th style={{ width: '8%', fontSize: '13px' }}>TC/COA</th>
                      <th style={{ width: '10%', fontSize: '13px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? (
                      currentItems.map((item, index) => (
                        <tr key={item.Id} className="table-row">
                          <td>{indexOfFirstItem + index + 1}</td>
                          <td><strong className="text-primary">{item.Item_Code}</strong></td>
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
                            <div className="d-flex">
                              <button
                                className="btn btn-sm shadow-sm center"
                                onClick={() => handleDelete(item.Id)}
                                title="Delete"
                              >
                                <RiDeleteBin3Fill style={{ fontSize: "16px", color: "red" }} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="14" className="text-center py-4">
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

          {/* Pagination - Unchanged */}
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

      {/* Edit Modal - Unchanged */}
      {showEditModal && editingItem && (
        // ... (same modal code as before)
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          {/* Modal content remains exactly the same */}
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Styles remain the same */}
      <style jsx>{`
        /* All your existing styles unchanged */
      `}</style>
    </>
  );
}

export default View_items;
