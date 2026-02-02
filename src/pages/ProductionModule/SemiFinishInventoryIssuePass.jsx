import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { API_ENDPOINTS } from '../../config/apiconfig';

const SemiFinishInventoryIssuePass = () => {
    // --- State Management ---
    const [items, setItems] = useState([]);
    const [grades, setGrades] = useState([]);
    const [machines, setMachines] = useState([]);
    const [tableList, setTableList] = useState([]);

    const [formData, setFormData] = useState({
        machineFrom: '',
        machineTo: '',
        itemName: '',
        itemCode: '',
        grade: '',
        uom: '',
        qty: '',
        date: new Date().toISOString().split('T')[0] // Automatically set today's date
    });

    // --- Initial Data Load ---
    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            // Fetching all items directly as requested
            const itemRes = await axios.get(API_ENDPOINTS.UniqueItem);
            setItems(itemRes.data || []);

            // Fetching machines for dropdowns
            const machineRes = await axios.get(API_ENDPOINTS.GetMachines);
            setMachines(machineRes.data || []);
        } catch (err) {
            console.error("Error loading initial data:", err.message);
        }
    };

    // --- Cascading Logic for Item Selection ---
    const handleItemChange = async (e) => {
        const selectedItem = e.target.value;
        setFormData({ ...formData, itemName: selectedItem, grade: '', itemCode: '', uom: '' });
        setGrades([]);

        if (selectedItem) {
            try {
                // Fetch grades and details for the selected item
                const res = await axios.get(`${API_ENDPOINTS.Grade}?itemName=${encodeURIComponent(selectedItem)}`);
                setGrades(res.data || []);
            } catch (err) {
                console.error("Error fetching grades:", err.message);
            }
        }
    };

    const handleGradeChange = async (e) => {
        const selectedGrade = e.target.value;
        if (selectedGrade) {
            try {
                // Fetch specific item code and UOM based on Item + Grade
                const res = await axios.get(`${API_ENDPOINTS.GetItemDetails}?item=${encodeURIComponent(formData.itemName)}&grade=${encodeURIComponent(selectedGrade)}`);
                setFormData({
                    ...formData,
                    grade: selectedGrade,
                    itemCode: res.data?.itemCode || '',
                    uom: res.data?.uom || ''
                });
            } catch (err) {
                console.error("Error fetching item details:", err.message);
            }
        }
    };

    // --- Table Actions ---
    const handleAdd = () => {
        if (!formData.machineFrom || !formData.machineTo || !formData.qty || !formData.itemName) {
            return alert("Please fill all required fields");
        }
        setTableList([...tableList, { ...formData, id: Date.now() }]);
        // Reset specific fields but keep machines and date for convenience
        setFormData({ ...formData, itemName: '', grade: '', itemCode: '', uom: '', qty: '' });
    };

    const handleSave = async () => {
        if (tableList.length === 0) return alert("Add at least one item to the list");
        try {
            await axios.post(API_ENDPOINTS.SaveInventoryIssue, tableList);
            alert("Inventory Issue Pass Saved Successfully!");
            handleCancel();
        } catch (err) {
            alert("Error saving record: " + err.message);
        }
    };

    const handleCancel = () => {
        setTableList([]);
        setFormData({
            machineFrom: '', machineTo: '', itemName: '', itemCode: '',
            grade: '', uom: '', qty: '', date: new Date().toISOString().split('T')[0]
        });
    };

    return (
        <div className="container-fluid mt-4 px-4 pb-5">
            <div className="">
                {/* <div className="card-header bg-dark text-white text-center py-3">
                    <h4 className="mb-0 fw-bold">SEMI FINISH INVENTORY ISSUE PASS</h4>
                </div>
                 */}
                <div className="card-body bg-light ">
                    <div className="row m-2 p-2">
                        <div className="col">
                            <label className="label-color">MACHINE FROM</label>
                            <select className="select-field-style border-2" value={formData.machineFrom} onChange={e => setFormData({ ...formData, machineFrom: e.target.value })}>
                                <option value="">Select Machine</option>
                                {machines.map((m, i) => <option key={i} value={m}>{m}</option>)}
                            </select>
                        </div>
                        <div className="col">
                            <label className="label-color">MACHINE TO</label>
                            <select className="select-field-style border-2" value={formData.machineTo} onChange={e => setFormData({ ...formData, machineTo: e.target.value })}>
                                <option value="">Select Machine</option>
                                {machines.map((m, i) => <option key={i} value={m}>{m}</option>)}
                            </select>
                        </div>
                        <div className="col">
                            <label className="label-color">ITEM NAME</label>
                            <select className="select-field-style border-2" value={formData.itemName} onChange={handleItemChange}>
                                <option value="">Select Item</option>
                                {items.map((it, i) => <option key={i} value={it}>{it}</option>)}
                            </select>
                        </div>

                        <div className="col">
                            <label className="label-color">GRADE</label>
                            <select className="select-field-style border-2" value={formData.grade} onChange={handleGradeChange} disabled={!formData.itemName}>
                                <option value="">Select Grade</option>
                                {grades.map((g, i) => <option key={i} value={g}>{g}</option>)}
                            </select>
                        </div>

                    </div>
                    <div className='row m-2 p-2'>
                        <div className="col">
                            <label className="label-color">ITEM CODE</label>
                            <input type="text" className="input-field-style border-2 bg-light" value={formData.itemCode} readOnly />
                        </div>
                        <div className="col">
                            <label className="label-color">UOM</label>
                            <input type="text" className="input-field-style border-2 bg-light" value={formData.uom} readOnly />
                        </div>

                        <div className="col">
                            <label className="label-color">QTY</label>
                            <input type="number" className="input-field-style border-2" value={formData.qty} onChange={e => setFormData({ ...formData, qty: e.target.value })} />
                        </div>
                        <div className="col">
                            <label className="label-color">DATE</label>
                            <input type="date" className="input-field-style border-2 bg-light" value={formData.date}  />
                        </div>
                        <div className="col d-flex align-items-end">
                            <button className="add-btn" onClick={handleAdd}>ADD</button>
                        </div>
                    </div>
                    {/* Dynamic Table */}
                    <div className="table-responsive shadow-sm rounded">
                        <table className="table table-bordered table-hover align-middle mb-0">
                            <thead className="table-secondary text-center small fw-bold">
                                <tr>
                                    <th>Sr No</th><th>Machine From</th><th>Machine To</th>
                                    <th>Item Name</th><th>Item Code</th><th>Grade</th>
                                    <th>UOM</th><th>Qty</th><th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableList.length > 0 ? tableList.map((row, idx) => (
                                    <tr key={row.id} className="text-center small">
                                        <td>{idx + 1}</td><td>{row.machineFrom}</td><td>{row.machineTo}</td>
                                        <td>{row.itemName}</td><td>{row.itemCode}</td><td>{row.grade}</td>
                                        <td>{row.uom}</td><td>{row.qty}</td><td>{row.date}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="9" className="text-center py-4 text-muted fst-italic">No records added.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-4 d-flex justify-content-center gap-3">
                        <button className="btn btn-primary btn-lg px-5 fw-bold" onClick={handleSave} disabled={tableList.length === 0}>SAVE</button>
                        <button className="btn btn-danger btn-lg px-5 fw-bold" onClick={handleCancel}>CANCEL</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SemiFinishInventoryIssuePass;