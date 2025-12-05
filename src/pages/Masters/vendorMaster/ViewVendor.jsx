// ============================================
// FILE 1: ViewVendor.jsx (Updated with Records Per Page Dropdown)
// ============================================
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { RefreshCcw } from 'lucide-react';
import { RiDeleteBin3Fill } from 'react-icons/ri';
import { API_ENDPOINTS } from '../../../config/apiconfig';

function ViewVendor() {
    // State management
    const [Vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [VendorsPerPage, setVendorsPerPage] = useState(10); // Changed to state
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredVendors, setFilteredVendors] = useState([]);
    const [editingVendor, setEditingVendor] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    // Base URL for your ASP.NET API
    const API_BASE_URL = 'http://localhost:49980/Vendor';

    // Load Vendors on component mount
    useEffect(() => {
        fetchAllVendors();
    }, []);

    // Filter Vendors based on search term
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredVendors(Vendors);
        } else {
            const filtered = Vendors.filter(Vendor =>
                Vendor.Vendor_Code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                Vendor.Vendor_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                Vendor.Grade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                Vendor.Company_Name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredVendors(filtered);
        }
        setCurrentPage(1); // Reset to first page when filtering
    }, [searchTerm, Vendors]);

    // Reset to first page when VendorsPerPage changes
    useEffect(() => {
        setCurrentPage(1);
    }, [VendorsPerPage]);

    // Handle records per page change
    const handleVendorsPerPageChange = (e) => {
        const newSize = parseInt(e.target.value);
        setVendorsPerPage(newSize);
    };

    // Fetch all Vendors from API
    const fetchAllVendors = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_ENDPOINTS.AllVendor);
            const result = await response.json();

            if (result.success) {
                setVendors(result.data || []);
                toast.success('Vendors loaded successfully!');
            } else {
                toast.error(result.message || 'Failed to load Vendors');
            }
        } catch (error) {
            toast.error('Error fetching Vendors: ' + error.message);
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Delete Vendor
    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: 'Delete this Vendor?',
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
            const response = await fetch(API_ENDPOINTS.DeleteItem, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `id=${id}`,
            });
            const result = await response.json();

            if (result.success) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Vendor removed from list.',
                    timer: 1500,
                    showConfirmButton: false,
                });
                fetchAllVendors();
            } else {
                Swal.fire('Oops…', result.message || 'Failed to delete Vendor.', 'error');
            }
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    };

    // Open edit modal
    const handleEdit = (Vendor) => {
        setEditingVendor({ ...Vendor });
        setShowEditModal(true);
    };

    // Update Vendor
    const handleUpdate = async () => {
        if (!editingVendor) return;

        try {
            const formData = new FormData();
            formData.append('Company_Name', editingVendor.Company_Name || '');
            formData.append('Vendor_Name', editingVendor.Vendor_Name || '');
            formData.append('Grade', editingVendor.Grade || '');
            formData.append('Unit_Of_Measurement', editingVendor.Unit_Of_Measurement || '');
            formData.append('Currency', editingVendor.Currency || '');
            formData.append('Average_Price', editingVendor.Average_Price || '');
            formData.append('Safe_Stock', editingVendor.Safe_Stock || '');
            formData.append('MOQ', editingVendor.MOQ || '');
            formData.append('TC_COA', editingVendor.TC_COA || '');

            const response = await fetch(`${API_ENDPOINTS.UpdateVendor}?id=${editingVendor.Id}`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Vendor updated successfully!');
                setShowEditModal(false);
                setEditingVendor(null);
                fetchAllVendors();
            } else {
                toast.error(result.message || 'Failed to update Vendor');
            }
        } catch (error) {
            toast.error('Error updating Vendor: ' + error.message);
        }
    };

    // Pagination logic
    const indexOfLastVendor = currentPage * VendorsPerPage;
    const indexOfFirstVendor = indexOfLastVendor - VendorsPerPage;
    const currentVendors = filteredVendors.slice(indexOfFirstVendor, indexOfLastVendor);
    const totalPages = Math.ceil(filteredVendors.length / VendorsPerPage);

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
            <div className="vendor-container">
                <div className="container-fluid m-3">
                    {/* Search and Actions */}

                    <div className="row p-3 m-2 flex-nowrap d-flex align-items-center" style={{ overflowX: 'auto' }}>
                        <div className="col-auto px-2">
                            <div className="input-group shadow-sm" style={{ minWidth: '220px' }}>
                                <input
                                    type="text"
                                    className="form-control border-0 rounded-start"
                                    style={{ fontSize: '14px' }}
                                    placeholder="Search by Vendor Code or Company..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button className="btn btn-outline-secondary rounded-end" type="button">
                                    🔍
                                </button>
                            </div>
                        </div>

                        <div className="col-auto flex-grow-1">
                            <h4 className="text-primary h2 mb-0 text-truncate">VIEW VENDOR DETAILS</h4>
                        </div>

                        <div className="col-auto px-2">
                            <button
                                className="btn btn-success shadow-sm"
                                onClick={fetchAllVendors}
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
                                    value={VendorsPerPage}
                                    onChange={handleVendorsPerPageChange}
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
                                Total Vendors: {filteredVendors.length}
                            </span>
                        </div>
                    </div>




                    {/* Vendors Table */}
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-0">
                            <div
                                className="table-responsive table-container"
                                style={{
                                    maxHeight: '600px',
                                    overflowY: 'auto',
                                    overflowX: 'auto',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                <table className="table table-striped table-hover align-middle" style={{ minWidth: '1600px' }}>
                                    <thead className="table-primary border">
                                        <tr>
                                            <th style={{ width: '1%' }}>Sr.No</th>
                                            <th style={{ width: '18%' }}>Vendor Code</th>
                                            <th style={{ width: '8%' }}>Company Name</th>
                                            <th style={{ width: '12%' }}>Vendor Category</th>
                                            <th style={{ width: '10%' }}>Industry Name</th>
                                            <th style={{ width: '15%' }}>Category Name</th>
                                            <th style={{ width: '15%' }}>Subcategory Name</th>
                                            <th style={{ width: '15%' }}>Source</th>
                                            <th style={{ width: '15%' }}>Continent</th>
                                            <th style={{ width: '8%' }}>Country</th>
                                            <th style={{ width: '8%' }}>State/Province</th>
                                            <th style={{ width: '10%' }}>Zone</th>
                                            <th style={{ width: '8%' }}>City</th>
                                            <th style={{ width: '8%' }}>Address</th>
                                            <th style={{ width: '10%' }}>Contact Person</th>
                                            <th style={{ width: '1%' }}>Email</th>
                                            <th style={{ width: '1%' }}>Contact Number</th>
                                            <th style={{ width: '1%' }}>Landline</th>
                                            <th style={{ width: '12%' }}>GST No</th>
                                            <th style={{ width: '18%' }}>Website</th>
                                            <th style={{ width: '10%' }}>Current Account</th>
                                            <th style={{ width: '15%' }}>Bank Name</th>
                                            <th style={{ width: '15%' }}>Branch</th>
                                            <th style={{ width: '15%' }}>IFSC No</th>
                                            <th style={{ width: '8%' }}>CIN No</th>
                                            <th style={{ width: '8%' }}>PAN No</th>
                                            <th style={{ width: '10%' }}>MSME No</th>
                                            <th style={{ width: '8%' }}>Std Payment Days</th>
                                            <th style={{ width: '10%' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentVendors.length > 0 ? (
                                            currentVendors.map((Vendor, index) => (
                                                <tr key={Vendor.Id} className="table-row">
                                                    <td>{indexOfFirstVendor + index + 1}</td>
                                                    <td><strong className="text-primary">{Vendor.Vendor_Code}</strong></td>
                                                    <td>{Vendor.Company_Name}</td>
                                                    <td>{Vendor.Vendor_Categories}</td>
                                                    <td>{Vendor.industry}</td>
                                                    <td>{Vendor.Category}</td>
                                                    <td>{Vendor.Sub_Category}</td>
                                                    <td>{Vendor.Source}</td>
                                                    <td>{Vendor.Continent}</td>
                                                    <td>{Vendor.Country}</td>
                                                    <td>{Vendor.State_Province}</td>
                                                    <td>{Vendor.Zone}</td>
                                                    <td>{Vendor.City}</td>
                                                    <td>{Vendor.Address}</td>
                                                    <td>{Vendor.Contact_Person}</td>
                                                    <td>{Vendor.Email}</td>
                                                    <td>{Vendor.Contact_Number}</td>
                                                    <td>{Vendor.Landline}</td>
                                                    <td>{Vendor.GST_Number}</td>
                                                    <td>{Vendor.Website}</td>
                                                    <td>{Vendor.CurrentAcNo}</td>
                                                    <td>{Vendor.Bank_Name}</td>
                                                    <td>{Vendor.Branch}</td>
                                                    <td>{Vendor.IFSC_No}</td>
                                                    <td>{Vendor.CIN_No}</td>
                                                    <td>{Vendor.PAN_No}</td>
                                                    <td>{Vendor.MSME_No}</td>
                                                    <td>{Vendor.Std_Payment_Days}</td>
                                                    <td>
                                                        <div className="d-flex justify-content-center">
                                                            <button
                                                                className="btn btn-sm shadow-sm"
                                                                onClick={() => handleDelete(Vendor.Id)}
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
                                                <td colSpan="29" className="text-center py-4">
                                                    <div className="text-muted h4">
                                                        {searchTerm ? 'No Vendors found matching your search.' : 'No Vendors available.'}
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
                        <div className="pagination-wrapper mt-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="text-muted">
                                    Showing {indexOfFirstVendor + 1} to {Math.min(indexOfLastVendor, filteredVendors.length)} of {filteredVendors.length} entries
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
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal - Unchanged */}
            {showEditModal && editingVendor && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">Edit Vendor - {editingVendor.Vendor_Code}</h5>
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
                                            value={editingVendor.Company_Name || ''}
                                            onChange={(e) => setEditingVendor({ ...editingVendor, Company_Name: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Vendor Name</label>
                                        <input
                                            type="text"
                                            className="form-control shadow-sm"
                                            value={editingVendor.Vendor_Name || ''}
                                            onChange={(e) => setEditingVendor({ ...editingVendor, Vendor_Name: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Grade</label>
                                        <input
                                            type="text"
                                            className="form-control shadow-sm"
                                            value={editingVendor.Grade || ''}
                                            onChange={(e) => setEditingVendor({ ...editingVendor, Grade: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Unit of Measurement</label>
                                        <input
                                            type="text"
                                            className="form-control shadow-sm"
                                            value={editingVendor.Unit_Of_Measurement || ''}
                                            onChange={(e) => setEditingVendor({ ...editingVendor, Unit_Of_Measurement: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Currency</label>
                                        <input
                                            type="text"
                                            className="form-control shadow-sm"
                                            value={editingVendor.Currency || ''}
                                            onChange={(e) => setEditingVendor({ ...editingVendor, Currency: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Average Price</label>
                                        <input
                                            type="number"
                                            className="form-control shadow-sm"
                                            value={editingVendor.Average_Price || ''}
                                            onChange={(e) => setEditingVendor({ ...editingVendor, Average_Price: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Safe Stock</label>
                                        <input
                                            type="number"
                                            className="form-control shadow-sm"
                                            value={editingVendor.Safe_Stock || ''}
                                            onChange={(e) => setEditingVendor({ ...editingVendor, Safe_Stock: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">MOQ</label>
                                        <input
                                            type="number"
                                            className="form-control shadow-sm"
                                            value={editingVendor.MOQ || ''}
                                            onChange={(e) => setEditingVendor({ ...editingVendor, MOQ: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <label className="form-label fw-bold">TC/COA</label>
                                        <select
                                            className="form-select shadow-sm"
                                            value={editingVendor.TC_COA || ''}
                                            onChange={(e) => setEditingVendor({ ...editingVendor, TC_COA: e.target.value })}
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
                                    Update Vendor
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
}

export default ViewVendor;
