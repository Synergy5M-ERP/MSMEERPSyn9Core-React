import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { API_ENDPOINTS } from '../../config/apiconfig';

const SemiFinishedProductionPlan = () => {
    // --- Data Lists ---
    const [buyers, setBuyers] = useState([]);
    const [soNumbers, setSoNumbers] = useState([]);
    const [items, setItems] = useState([]);
    const [grades, setGrades] = useState([]);
    const [productionCodes, setProductionCodes] = useState([]);
    const [partsList, setPartsList] = useState([]);

    // --- Form State ---
    const [formData, setFormData] = useState({
        orderType: '',
        buyerName: '',
        soNumber: '',
        itemName: '',
        grade: '',
        productionPlan: '',
        productionCode: '',
        planQty: ''
    });

    const [loading, setLoading] = useState(false);

    // --- Cascading Logic ---

    // 1. Handle Order Type Change -> Fetch Buyers
    const handleOrderTypeChange = async (e) => {
        const type = e.target.value;
        setFormData({ ...formData, orderType: type, buyerName: '', soNumber: '', itemName: '', grade: '', productionPlan: '', productionCode: '', planQty: '' });
        setBuyers([]);
        
        if (type) {
            try {
                // Fetch buyers based on Order Type (Generic or Custom)
                const res = await axios.get(`${API_ENDPOINTS.GetBuyers}?type=${type}`);
                setBuyers(res.data || []);
            } catch (err) {
                console.error("Error fetching buyers:", err.message);
                setBuyers([]);
            }
        }
    };

    // 2. Handle Buyer Change -> Fetch SO Numbers
    const handleBuyerChange = async (e) => {
        const buyer = e.target.value;
        setFormData({ ...formData, buyerName: buyer, soNumber: '', itemName: '', grade: '', productionPlan: '', productionCode: '', planQty: '' });
        
        if (buyer) {
            try {
                const res = await axios.get(`${API_ENDPOINTS.GetSONumbers}?buyer=${encodeURIComponent(buyer)}`);
                setSoNumbers(res.data || []);
            } catch (err) {
                console.error("Error fetching SO Numbers:", err.message);
                setSoNumbers([]);
            }
        }
    };

    // 3. Handle SO Number Change -> Fetch Items
    const handleSOChange = async (e) => {
        const so = e.target.value;
        setFormData({ ...formData, soNumber: so, itemName: '', grade: '', productionPlan: '', productionCode: '', planQty: '' });
        
        if (so) {
            try {
                const res = await axios.get(`${API_ENDPOINTS.GetItemsBySO}?soNumber=${encodeURIComponent(so)}`);
                setItems(res.data || []);
            } catch (err) {
                console.error("Error fetching Items:", err.message);
                setItems([]);
            }
        }
    };

    // 4. Handle Item Change -> Fetch Grades
    const handleItemChange = async (e) => {
        const item = e.target.value;
        setFormData({ ...formData, itemName: item, grade: '', productionPlan: '', productionCode: '', planQty: '' });
        
        if (item) {
            try {
                const res = await axios.get(`${API_ENDPOINTS.GetGrades}?item=${encodeURIComponent(item)}`);
                setGrades(res.data || []);
            } catch (err) {
                console.error("Error fetching Grades:", err.message);
                setGrades([]);
            }
        }
    };

    // 5. Handle Grade Change -> Fetch Production Plan Value & Codes
    const handleGradeChange = async (e) => {
        const grade = e.target.value;
        setFormData({ ...formData, grade: grade, productionPlan: '', productionCode: '', planQty: '' });
        
        if (grade) {
            try {
                const res = await axios.get(`${API_ENDPOINTS.GetPlanDetails}?so=${encodeURIComponent(formData.soNumber)}&grade=${encodeURIComponent(grade)}`);
                if (res.data) {
                    setFormData(prev => ({
                        ...prev,
                        productionPlan: res.data.productionPlanValue,
                        planQty: res.data.productionPlanValue // Setting Plan Qty same as Prod Plan
                    }));
                    // Fetch Production Codes associated with this setup
                    const codeRes = await axios.get(`${API_ENDPOINTS.GetProductionCodes}`);
                    setProductionCodes(codeRes.data || []);
                }
            } catch (err) {
                console.error("Error fetching Plan Details:", err.message);
            }
        }
    };

    // --- Action Buttons ---

    const handleSearch = async () => {
        if (!formData.grade || !formData.productionCode) {
            return alert("Please select all required fields including Production Code");
        }
        setLoading(true);
        try {
            const res = await axios.get(`${API_ENDPOINTS.GetManufactureParts}?item=${encodeURIComponent(formData.itemName)}`);
            setPartsList(res.data || []);
        } catch (err) {
            console.error("Error fetching parts list:", err.message);
            setPartsList([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (partsList.length === 0) return alert("No data to save");
        try {
            await axios.post(API_ENDPOINTS.SaveProductionPlan, { ...formData, partsList });
            alert("Production Plan Saved Successfully!");
            handleCancel();
        } catch (err) {
            alert("Error saving production plan");
        }
    };

    const handleCancel = () => {
        setFormData({
            orderType: '', buyerName: '', soNumber: '', itemName: '',
            grade: '', productionPlan: '', productionCode: '', planQty: ''
        });
        setPartsList([]);
        setBuyers([]);
        setSoNumbers([]);
        setItems([]);
        setGrades([]);
    };

    return (
        <div className="container-fluid mt-4 px-4 pb-5">
            <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
                <div className="card-header bg-dark text-white text-center py-3">
                    <h4 className="mb-0 fw-bold" style={{ letterSpacing: '1px' }}>SEMI FINISHED PRODUCTION PLAN</h4>
                </div>
                
                <div className="card-body bg-light p-4">
                    {/* Top Filters */}
                    <div className="row g-4 mb-4">
                        <div className="col-md-3">
                            <label className="label-color">Order Type</label>
                            <select className="select-field-style" value={formData.orderType} onChange={handleOrderTypeChange}>
                                <option value="">Select Type</option>
                                <option value="GENERIC">GENERIC</option>
                                <option value="CUSTOM">CUSTOM</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="label-color">Buyer Name</label>
                            <select className="select-field-style" value={formData.buyerName} onChange={handleBuyerChange} disabled={!formData.orderType}>
                                <option value="">Select Buyer</option>
                                {buyers.map((b, i) => <option key={i} value={b.name}>{b.name}</option>)}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="label-color">SO Number</label>
                            <select className="select-field-style" value={formData.soNumber} onChange={handleSOChange} disabled={!formData.buyerName}>
                                <option value="">Select SO</option>
                                {soNumbers.map((s, i) => <option key={i} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="label-color">Item Name</label>
                            <select className="select-field-style" value={formData.itemName} onChange={handleItemChange} disabled={!formData.soNumber}>
                                <option value="">Select Item</option>
                                {items.map((it, i) => <option key={i} value={it}>{it}</option>)}
                            </select>
                        </div>

                        <div className="col-md-3">
                            <label className="label-color">Grade</label>
                            <select className="select-field-style" value={formData.grade} onChange={handleGradeChange} disabled={!formData.itemName}>
                                <option value="">Select Grade</option>
                                {grades.map((g, i) => <option key={i} value={g}>{g}</option>)}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="label-color">Production Plan</label>
                            <input type="text" className="input-field-style" value={formData.productionPlan} readOnly />
                        </div>
                        <div className="col-md-3">
                            <label className="label-color">Production Code</label>
                            <select className="select-field-style" value={formData.productionCode} onChange={(e) => setFormData({...formData, productionCode: e.target.value})} disabled={!formData.grade}>
                                <option value="">Select Code</option>
                                {productionCodes.map((pc, i) => <option key={i} value={pc}>{pc}</option>)}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="label-color">Plan Qty</label>
                            <input type="text" className="input-field-style" value={formData.planQty} readOnly />
                        </div>
                    </div>

                    <div className="text-start mb-5">
                        <button className="add-btn" onClick={handleSearch}>
                            <i className="bi bi-search me-2"></i>
                            
                        </button>
                    </div>

                    {/* Manufacture Parts List Section */}
                    <div className="mt-4 pt-4 border-top">
                        <h5 className="text-center fw-bold mb-4" style={{ color: '#2c3e50' }}>MANUFACTURE PARTS LIST</h5>
                        <div className="table-responsive shadow-sm rounded">
                            <table className="table table-bordered table-hover align-middle mb-0">
                                <thead className="table-dark text-center small">
                                    <tr >
                                        <th className='bg-primary' >ITEM NAME</th><th className='bg-primary'>ITEM CODE</th><th className='bg-primary'>GRADE</th>
                                        <th className='bg-primary'>UOM</th><th className='bg-primary'>LEVEL</th><th className='bg-primary'>QUANTITY</th>
                                        <th className='bg-primary'>TOTAL REQ QTY</th><th className='bg-primary'>SO NO</th><th className='bg-primary'>BUYER NAME</th>
                                        <th className='bg-primary'>REMAINING PROD QTY</th><th className='bg-primary'>Total SO Qty</th>
                                        <th className='bg-primary'>PRODUCTION CODE</th><th className='bg-primary'>PRODUCTION PLAN</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {partsList.length > 0 ? partsList.map((item, idx) => (
                                        <tr key={idx} className="text-center small">
                                            <td>{item.itemName}</td><td>{item.itemCode}</td><td>{item.grade}</td>
                                            <td>{item.uom}</td><td>{item.level}</td><td>{item.qty}</td>
                                            <td>{item.totalReqQty}</td><td>{formData.soNumber}</td><td>{formData.buyerName}</td>
                                            <td>{item.remProdQty}</td><td>{item.totalSoQty}</td>
                                            <td>{formData.productionCode}</td><td>{formData.productionPlan}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="13" className="text-center py-4 text-muted fst-italic">No parts found. Select criteria and click Search.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="mt-5 d-flex  gap-3">
                        <button className="save-btn" onClick={handleSave} disabled={partsList.length === 0}>SAVE</button>
                        <button className="cancel-btn" onClick={handleCancel}>CANCEL</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SemiFinishedProductionPlan;