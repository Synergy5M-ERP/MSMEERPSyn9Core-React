import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import Swal from "sweetalert2";
import { API_ENDPOINTS } from "../../config/apiconfig";

const TransporterApprove = () => {
    const [transporters, setTransporters] = useState([]);
    const [selectedTransporter, setSelectedTransporter] = useState('');
    const [grnData, setGrnData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

useEffect(() => {
    fetch(API_ENDPOINTS.GetApproveTransporter)
        .then(res => res.json())
        .then(response => {
            console.log("API Response:", response);

            if (response?.data) {
                const unique = [...new Map(
                    response.data.map(x => [x.transporterGRNId, x])
                ).values()];

                setTransporters(unique);
            }
        })
        .catch(err => console.error("Error loading transporters", err));
}, []);
useEffect(() => {
    if (!selectedTransporter) {
        setGrnData([]);
        return;
    }
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
});
    fetch(`${API_ENDPOINTS.GetApproveTransporterDetails}?id=${selectedTransporter}`)
        .then(res => res.json())
        .then(res => {
            console.log("DETAIL API:", res);

            if (res?.data) {
                // ✅ DIRECT USE (NO MAPPING)
                setGrnData(res.data);
            }
        })
        .catch(err => console.error("Error loading details", err));

}, [selectedTransporter]);
useEffect(() => {
    console.log("FINAL GRN DATA:", grnData);
}, [grnData]);
    // 3. Handle Checkbox Change
   const handleCheckChange = (id) => {
    setGrnData(prev => prev.map(item => 
        item.transporterGRNId === id 
        ? { ...item, approveTransportation: !item.approveTransportation } 
        : item
    ));
};
const handleSave = () => {
    const updates = grnData.map(item => ({
        transporterGRNId: item.transporterGRNId,   // ✅ FIXED
        approve: item.approveTransportation        // ✅ FIXED
    }));

    fetch(API_ENDPOINTS.UpdateApproveStatusBulk, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    })
    .then(res => res.json())
    .then(res => {
        if (res.success) {
            Swal.fire({
                icon: 'success',
                title: 'Approved!',
                text: res.message,
                timer: 1500,
                showConfirmButton: false
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Failed!',
                text: res.message
            });
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
onChange={(e) => setSelectedTransporter(Number(e.target.value))}>
    <option value="">Select Transporter</option>
    {transporters.map(t => (
        <option key={t.transporterGRNId} value={t.transporterGRNId}>
            {t.transporterName}
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
                             <span><strong>Invoice:</strong> {item.invoiceNo || 'N/A'}</span>
<span><strong>Date:</strong> {formatDate(item.invoiceDate)}</span>
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
                                          <td>{item.qty}</td>
    <td>₹{item.price}</td>
    <td>₹{item.netAmount}</td>
    <td>₹{item.taxAmount}</td>
    <td>₹{item.totalAmount}</td>
    <td>
        <button 
            className="btn btn-sm btn-outline-primary"
            onClick={() => { setSelectedItem(item); setShowModal(true); }}
        >
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
        <span className="fw-bold text-success fs-5">
            ₹{item.totalAmount?.toLocaleString('en-IN')}
        </span>
    </div>

    <div className="form-check ">
        <label className="fw-bold me-2">Approve</label>
        <input 
            type="checkbox" 
            className="form-check-input" 
            checked={item.approveTransportation || false}
            onChange={() => handleCheckChange(item.transporterGRNId)}
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
            <Modal.Title className="text-primary fw-bold">
                Invoice: {selectedItem.invoiceNo}
            </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-0">
            <div className="row g-0">
                
                {/* Left Section */}
                <div className="col-md-4 bg-light p-4 border-end">
                    <h6 className="text-primary fw-bold mb-3">💰 Financials</h6>

                    <div className="mb-3">
                        <small className="text-muted">Tax Value</small>
                        <div className="h5 text-danger fw-bold">
                            ₹{selectedItem.taxAmount}
                        </div>
                    </div>

                    <div>
                        <small className="text-muted">Net Value</small>
                        <div className="h5 text-success fw-bold">
                            ₹{selectedItem.netAmount}
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="col-md-8 p-4">
                    <table className="table table-sm">
                        <tbody>
                            <tr>
                                <th>Item Name</th>
                                <td>{selectedItem.itemName || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th>Grade</th>
                                <td>{selectedItem.grade || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th>Received Qty</th>
                                <td>{selectedItem.qty}</td>
                            </tr>
                        </tbody>
                    </table>

                    <hr />

                    <div className="row text-center mt-3">
                        <div className="col">
                            <strong>CGST</strong>
                            <div>₹{selectedItem.cgstAmount}</div>
                        </div>
                        <div className="col">
                            <strong>SGST</strong>
                            <div>₹{selectedItem.sgstAmount}</div>
                        </div>
                        <div className="col">
                            <strong>IGST</strong>
                            <div>₹{selectedItem.igstAmount}</div>
                        </div>
                    </div>
                </div>

            </div>
        </Modal.Body>

        <Modal.Footer className="justify-content-between bg-light">
            <div className="fw-bold">
                Grand Total: ₹{selectedItem.totalAmount}
            </div>

            <div className={`badge p-2 ${
                selectedItem.approveTransportation ? 'bg-success' : 'bg-danger'
            }`}>
                {selectedItem.approveTransportation ? '✔ APPROVED' : '✖ PENDING'}
            </div>
        </Modal.Footer>
    </Modal>
)}
        </div>
    );
};

export default TransporterApprove;