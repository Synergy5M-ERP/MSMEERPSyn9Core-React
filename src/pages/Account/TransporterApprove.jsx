import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';

const TransporterApprove = () => {
    const [transporters, setTransporters] = useState([]);
    const [selectedTransporter, setSelectedTransporter] = useState('');
    const [grnData, setGrnData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // 1. Load Transporters on Mount
    useEffect(() => {
        fetch('/AccountGrn/GetApproveTransporter')
            .then(res => res.json())
            .then(response => {
                if (response?.data) {
                    // Remove duplicates based on ID
                    const unique = [...new Map(response.data.map(x => [x.TransporterGRNId, x])).values()];
                    setTransporters(unique);
                }
            })
            .catch(err => console.error("Error loading transporters", err));
    }, []);

    // 2. Load Details when Transporter changes
    useEffect(() => {
        if (!selectedTransporter) {
            setGrnData([]);
            return;
        }

        fetch('/AccountGrn/GetApproveTransporterDetails')
            .then(res => res.json())
            .then(res => {
                if (res?.data) {
                    const filtered = res.data.filter(x => x.TransporterGRNId == selectedTransporter);
                    setGrnData(filtered);
                }
            });
    }, [selectedTransporter]);

    // 3. Handle Checkbox Change
    const handleCheckChange = (id) => {
        setGrnData(prev => prev.map(item => 
            item.TransporterGRNId === id 
            ? { ...item, ApproveTransportation: !item.ApproveTransportation } 
            : item
        ));
    };

    // 4. Bulk Save
    const handleSave = () => {
        const updates = grnData.map(item => ({
            transporterGRNId: item.TransporterGRNId,
            approve: item.ApproveTransportation
        }));

        fetch('/AccountGrn/UpdateApproveStatusBulk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        })
        .then(res => res.json())
        .then(res => {
            if (res.success) {
                Swal.fire({ icon: 'success', title: 'Approved!', text: res.message, timer: 1500, showConfirmButton: false });
            } else {
                Swal.fire({ icon: 'error', title: 'Failed!', text: res.message });
            }
        });
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return isNaN(date) ? 'N/A' : date.toLocaleDateString('en-GB'); // DD/MM/YYYY
    };

    return (
        <div className="main-content p-4" style={{ backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
            {/* Filter Card */}
            <div className="card p-4 mb-4 shadow-sm border-0" style={{ borderRadius: '10px' }}>
                <div className="row align-items-end">
                    <div className="col-md-4">
                        <label className="text-primary fw-bold mb-2">Transporter Name</label>
                        <select 
                            className="form-select" 
                            value={selectedTransporter}
                            onChange={(e) => setSelectedTransporter(e.target.value)}
                        >
                            <option value="">Select Transporter</option>
                            {transporters.map(t => (
                                <option key={t.TransporterGRNId} value={t.TransporterGRNId}>
                                    {t.TransporterName}
                                </option>
                            ))}
                        </select>
                    </div>
                    {selectedTransporter && (
                        <div className="col-md-2">
                            <button className="btn btn-success w-100 py-2" onClick={handleSave}>SAVE</button>
                        </div>
                    )}
                </div>
            </div>

            {/* GRN Cards Grid */}
            <div className="row">
                {grnData.map((item, index) => (
                    <div className="col-md-6 mb-4" key={index}>
                        <div className="card shadow-sm h-100 border-0 grn-card">
                            <div className="card-header bg-primary text-white d-flex justify-content-between py-3">
                                <span><strong>Invoice:</strong> {item.InvoiceNo || 'N/A'}</span>
                                <span><strong>Date:</strong> {formatDate(item.InvoiceDate)}</span>
                            </div>
                            <div className="card-body">
                                <table className="table table-bordered text-center small">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Qty</th><th>Price</th><th>Net</th><th>Tax</th><th>Total</th><th>View</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{item.Qty}</td>
                                            <td>₹{item.Price}</td>
                                            <td>₹{item.NetAmount}</td>
                                            <td>₹{item.TaxAmount}</td>
                                            <td>₹{item.TotalAmount}</td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-primary" onClick={() => { setSelectedItem(item); setShowModal(true); }}>
                                                    👁
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="card-footer bg-white d-flex justify-content-between align-items-center py-3">
                                <div>
                                    <small className="text-muted d-block">Total Amount</small>
                                    <span className="fw-bold text-success fs-5">₹{item.TotalAmount?.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="form-check form-switch">
                                    <label className="fw-bold me-2">Approve</label>
                                    <input 
                                        type="checkbox" 
                                        className="form-check-input" 
                                        checked={item.ApproveTransportation || false}
                                        onChange={() => handleCheckChange(item.TransporterGRNId)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* View Modal */}
            {selectedItem && (
                <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                    <Modal.Header closeButton className="border-0">
                        <Modal.Title className="text-primary fw-bold">Invoice: {selectedItem.InvoiceNo}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-0">
                        <div className="row g-0">
                            <div className="col-md-4 bg-light p-4 border-end">
                                <h6 className="text-primary fw-bold mb-3">💰 Financials</h6>
                                <div className="mb-3">
                                    <small className="text-muted">Tax Value</small>
                                    <div className="h5 text-danger fw-bold">₹{selectedItem.TaxAmount}</div>
                                </div>
                                <div>
                                    <small className="text-muted">Net Value</small>
                                    <div className="h5 text-success fw-bold">₹{selectedItem.NetAmount}</div>
                                </div>
                            </div>
                            <div className="col-md-8 p-4">
                                <table className="table table-sm">
                                    <tbody>
                                        <tr><th>Item Name</th><td>{selectedItem.ItemName}</td></tr>
                                        <tr><th>Grade</th><td>{selectedItem.Grade}</td></tr>
                                        <tr><th>Received Qty</th><td>{selectedItem.Qty}</td></tr>
                                    </tbody>
                                </table>
                                <hr />
                                <div className="row text-center mt-3">
                                    <div className="col"><strong>CGST</strong><div>₹{selectedItem.CGSTAmount}</div></div>
                                    <div className="col"><strong>SGST</strong><div>₹{selectedItem.SGSTAmount}</div></div>
                                    <div className="col"><strong>IGST</strong><div>₹{selectedItem.IGSTAmount}</div></div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="justify-content-between bg-light">
                        <div className="fw-bold">Grand Total: ₹{selectedItem.TotalAmount}</div>
                        <div className={`badge p-2 ${selectedItem.ApproveTransportation ? 'bg-success' : 'bg-danger'}`}>
                            {selectedItem.ApproveTransportation ? '✔ APPROVED' : '✖ PENDING'}
                        </div>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default TransporterApprove;