import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import { RefreshCcw, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';

const ViewCommodity = () => {
    const [activeTab, setActiveTab] = useState('cat1');
    const [cat1Data, setCat1Data] = useState([]);
    const [cat2Data, setCat2Data] = useState([]);
    const [cat3Data, setCat3Data] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const API_BASE_URL = 'http://localhost:49980/Commodity';

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            // Fetch Cat1
            const cat1Response = await fetch(`${API_BASE_URL}/GetAllCat1Api`);
            const cat1Result = await cat1Response.json();
            if (cat1Result.success) {
                setCat1Data(cat1Result.data || []);
            }

            // Fetch Cat2
            const cat2Response = await fetch(`${API_BASE_URL}/GetAllCat2Api`);
            const cat2Result = await cat2Response.json();
            if (cat2Result.success) {
                setCat2Data(cat2Result.data || []);
            }

            // Fetch Cat3
            const cat3Response = await fetch(`${API_BASE_URL}/GetAllCat3Api`);
            const cat3Result = await cat3Response.json();
            if (cat3Result.success) {
                setCat3Data(cat3Result.data || []);
            }

            toast.success('Data loaded successfully!');
        } catch (error) {
            toast.error('Error fetching data: ' + error.message);
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, type) => {
        const confirm = await Swal.fire({
            title: `Delete this ${type}?`,
            html: '<small class="text-danger">This action cannot be undone.</small>',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            reverseButtons: true,
        });

        if (!confirm.isConfirmed) return;

        try {
            let endpoint = '';
            if (type === 'Cat1') endpoint = `${API_BASE_URL}/DeleteCat1Api`;
            else if (type === 'Cat2') endpoint = `${API_BASE_URL}/DeleteCat2Api`;
            else if (type === 'Cat3') endpoint = `${API_BASE_URL}/DeleteCat3Api`;

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `id=${id}`,
            });
            const result = await response.json();

            if (result.success) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: `${type} removed successfully.`,
                    timer: 1500,
                    showConfirmButton: false,
                });
                fetchAllData();
            } else {
                Swal.fire('Oops…', result.message || 'Failed to delete.', 'error');
            }
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    };

    const toggleActiveStatus = async (item, type) => {
        try {
            let endpoint = '';
            if (type === 'Cat1') endpoint = `${API_BASE_URL}/ToggleCat1StatusApi`;
            else if (type === 'Cat2') endpoint = `${API_BASE_URL}/ToggleCat2StatusApi`;
            else if (type === 'Cat3') endpoint = `${API_BASE_URL}/ToggleCat3StatusApi`;

            const formData = new FormData();
            formData.append('id', item.Id);
            formData.append('isActive', !item.IsActive);

            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                toast.success(`${type} ${!item.IsActive ? 'activated' : 'deactivated'} successfully!`);
                fetchAllData();
            } else {
                toast.error(result.message || 'Failed to update status');
            }
        } catch (error) {
            toast.error('Error updating status: ' + error.message);
        }
    };

    const handleEdit = (item, type) => {
        setEditingItem({ ...item, type });
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        if (!editingItem) return;

        try {
            let endpoint = '';
            if (editingItem.type === 'Cat1') endpoint = `${API_BASE_URL}/UpdateCat1Api`;
            else if (editingItem.type === 'Cat2') endpoint = `${API_BASE_URL}/UpdateCat2Api`;
            else if (editingItem.type === 'Cat3') endpoint = `${API_BASE_URL}/UpdateCat3Api`;

            const formData = new FormData();
            formData.append('Id', editingItem.Id);
            formData.append('Name', editingItem.Name || '');
            formData.append('IsActive', editingItem.IsActive);

            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                toast.success(`${editingItem.type} updated successfully!`);
                setShowEditModal(false);
                setEditingItem(null);
                fetchAllData();
            } else {
                toast.error(result.message || 'Failed to update');
            }
        } catch (error) {
            toast.error('Error updating: ' + error.message);
        }
    };

    const renderTable = (data, type) => {
        return (
            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-primary">
                        <tr>
                            <th style={{ width: '5%' }}>Sr.No</th>
                            {type === 'Cat2' && <th style={{ width: '25%' }}>Cat 1</th>}
                            {type === 'Cat3' && (
                                <>
                                    <th style={{ width: '20%' }}>Cat 1</th>
                                    <th style={{ width: '20%' }}>Cat 2</th>
                                </>
                            )}
                            <th style={{ width: '30%' }}>{type} Name</th>
                            <th style={{ width: '15%' }}>Status</th>
                            <th style={{ width: '15%' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((item, index) => (
                                <tr key={item.Id}>
                                    <td>{index + 1}</td>
                                    {type === 'Cat2' && <td>{item.Cat1Name}</td>}
                                    {type === 'Cat3' && (
                                        <>
                                            <td>{item.Cat1Name}</td>
                                            <td>{item.Cat2Name}</td>
                                        </>
                                    )}
                                    <td><strong className="text-primary">{item.Name}</strong></td>
                                    <td>
                                        <span
                                            className={`badge ${item.IsActive ? 'bg-success' : 'bg-danger'}`}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => toggleActiveStatus(item, type)}
                                            title="Click to toggle status"
                                        >
                                            {item.IsActive ? (
                                                <>
                                                    <CheckCircle size={14} className="me-1" />
                                                    Active
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle size={14} className="me-1" />
                                                    Inactive
                                                </>
                                            )}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Edit2
                                                size={18}
                                                className="text-primary"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleEdit(item, type)}
                                                title="Edit"
                                            />
                                            <Trash2
                                                size={18}
                                                className="text-danger"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleDelete(item.Id, type)}
                                                title="Delete"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={type === 'Cat3' ? '6' : type === 'Cat2' ? '5' : '4'} className="text-center py-4">
                                    <div className="text-muted h5">No {type} data available.</div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
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
            <div className="container-fluid p-4">
                {/* Header */}
                <div className="row mb-4">
                    <div className="col-md-8">
                        <h4 className="text-primary">View Commodity with Edit and Delete icon</h4>
                    </div>
                    <div className="col-md-4 text-end">
                        <button
                            className="btn btn-primary"
                            onClick={fetchAllData}
                            disabled={loading}
                        >
                            <RefreshCcw size={18} className="me-2" />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <ul className="nav nav-tabs mb-3">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'cat1' ? 'active' : ''}`}
                            onClick={() => setActiveTab('cat1')}
                        >
                            Cat 1 ({cat1Data.length})
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'cat2' ? 'active' : ''}`}
                            onClick={() => setActiveTab('cat2')}
                        >
                            Cat 2 ({cat2Data.length})
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'cat3' ? 'active' : ''}`}
                            onClick={() => setActiveTab('cat3')}
                        >
                            Cat 3 ({cat3Data.length})
                        </button>
                    </li>
                </ul>

                {/* Table Content */}
                <div className="card shadow-sm">
                    <div className="card-body">
                        {activeTab === 'cat1' && renderTable(cat1Data, 'Cat1')}
                        {activeTab === 'cat2' && renderTable(cat2Data, 'Cat2')}
                        {activeTab === 'cat3' && renderTable(cat3Data, 'Cat3')}
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && editingItem && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">Edit {editingItem.type}</h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowEditModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label fw-bold">{editingItem.type} Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editingItem.Name || ''}
                                        onChange={(e) => setEditingItem({ ...editingItem, Name: e.target.value })}
                                    />
                                </div>
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={editingItem.IsActive}
                                        onChange={(e) => setEditingItem({ ...editingItem, IsActive: e.target.checked })}
                                    />
                                    <label className="form-check-label fw-bold">Active Status</label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary" onClick={handleUpdate}>
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
};

export default ViewCommodity;
