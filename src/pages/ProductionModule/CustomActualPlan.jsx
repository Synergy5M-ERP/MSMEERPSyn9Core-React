import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const CustomActualPlan = () => {
    // --- State ---
    const [formData, setFormData] = useState({
        buyerName: '', soNumber: '', itemName: '', grade: '', machineNumber: '', planDate: ''
    });

    const [options, setOptions] = useState({
        buyers: [], soNumbers: [], itemNames: [], grades: [], machines: [], dates: []
    });

    const [tableData, setTableData] = useState({
        plan: null,
        products: [],
    });

    const [showTable, setShowTable] = useState(false);

    // --- Helpers ---
    const formatDate = (jsonDate) => {
        if (!jsonDate) return "";
        const timestamp = typeof jsonDate === 'string' ? parseInt(jsonDate.replace(/\/Date\((\d+)\)\//, '$1')) : jsonDate;
        const date = new Date(timestamp);
        return date.toISOString().split('T')[0].replace(/-/g, '/');
    };

    // --- Dropdown Logic ---
    useEffect(() => {
        axios.get('/Product/GetCustomBuyerNames').then(res => setOptions(prev => ({ ...prev, buyers: res.data })));
    }, []);

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        const endpoints = {
            buyerName: `/Quality/GetCustomSoNumber?buyername=${value}`,
            soNumber: `/Product/GetCustomItemNames?buyername=${formData.buyerName}&sonumber=${value}`,
            itemName: `/Product/GetCustomGrades?buyername=${formData.buyerName}&sonumber=${formData.soNumber}&itemname=${value}`,
            grade: `/Quality/GetCustomMachineNo?buyername=${formData.buyerName}&sonumber=${formData.soNumber}&itemname=${formData.itemName}&grade=${value}`,
            machineNumber: `/Product/GetCustomDates?buyername=${formData.buyerName}&sonumber=${formData.soNumber}&itemname=${formData.itemName}&grade=${formData.grade}&machineno=${value}`
        };

        if (endpoints[name]) {
            const res = await axios.get(endpoints[name]);
            const optionKey = name === 'buyerName' ? 'soNumbers' : name === 'soNumber' ? 'itemNames' : name === 'itemName' ? 'grades' : name === 'grade' ? 'machines' : 'dates';
            setOptions(prev => ({ ...prev, [optionKey]: res.data }));
        }
    };

    // --- Table Logic ---
    const handleSearch = async () => {
        try {
            const res = await axios.get('/Product/SearchCustomDetails', { params: formData });
            if (res.data && res.data.products?.length > 0) {
                setTableData(res.data);
                setShowTable(true);
            } else {
                Swal.fire("Info", "Actual Quantity for this date is already done.", "info");
            }
        } catch (err) { console.error(err); }
    };

    const handleProductChange = (index, field, value) => {
        const updated = [...tableData.products];
        updated[index][field] = value;
        setTableData({ ...tableData, products: updated });
    };

    // --- Totals ---
    const totalGross = tableData.products.reduce((acc, p) => acc + (parseFloat(p.aqty) || 0), 0).toFixed(2);
    const totalAlt = tableData.products.reduce((acc, p) => acc + (parseFloat(p.number) || 0), 0).toFixed(2);

    return (
        <div className="container-fluid py-3" style={{ fontFamily: 'Cambria', fontWeight: 'bold' }}>
            <h4 className="text-primary bold">CUSTOMISED FINISHED ACTUAL PLAN</h4>

            {/* Filters Section */}
            <div className="row g-3 mb-4">
                {[
                    { label: 'Buyer Name', name: 'buyerName', opts: options.buyers, key: 'buyerName' },
                    { label: 'SO Number', name: 'soNumber', opts: options.soNumbers, key: 'soNumber' },
                    { label: 'Item Name', name: 'itemName', opts: options.itemNames, key: 'itemName' },
                    { label: 'Grade', name: 'grade', opts: options.grades, key: 'grade' },
                    { label: 'Machine Number', name: 'machineNumber', opts: options.machines, key: 'machinenumber' },
                    { label: 'Plan Date', name: 'planDate', opts: options.dates, key: 'date', isDate: true }
                ].map(field => (
                    <div className="col" key={field.name}>
                        <label className="label-color">{field.label}</label>
                        <select className="input-field-style" name={field.name} onChange={handleInputChange}>
                            <option value="">Select {field.label}</option>
                            {field.opts.map((opt, i) => (
                                <option key={i} value={field.isDate ? formatDate(opt[field.key]) : opt[field.key]}>
                                    {field.isDate ? formatDate(opt[field.key]) : opt[field.key]}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
                <div className="col-12">
                    <button className="add-btn" onClick={handleSearch}>SEARCH</button>
                </div>
            </div>

            {showTable && (
                <>
                    <h5 className="text-center bg-light py-2 border">MACHINE DETAILS</h5>
                    <div className="table-responsive mb-4">
                        <table className="table table-bordered table-sm text-center align-middle small">
                            <thead className="table-light">
                                <tr>
                                    <th>Prod Plan Date</th><th>Machine Name</th><th>Location</th><th>Machine Number</th>
                                    <th>Capacity</th><th>SO Number</th><th>Buyer Name</th><th>Item Name</th>
                                    <th>Item Code</th><th>Grade</th><th>UOM</th><th>SO Qty</th><th>ProductionCode</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{formatDate(tableData.plan?.date)}</td>
                                    <td>{tableData.plan?.machinename}</td>
                                    <td>{tableData.plan?.location}</td>
                                    <td>{tableData.plan?.machinenumber}</td>
                                    <td>{tableData.plan?.capacity}</td>
                                    <td>{tableData.plan?.sonumber}</td>
                                    <td>{tableData.plan?.buyername}</td>
                                    <td>{tableData.plan?.itemname}</td>
                                    <td>{tableData.plan?.itemcode}</td>
                                    <td>{tableData.plan?.grade}</td>
                                    <td>{tableData.plan?.uom}</td>
                                    <td>{tableData.plan?.soqty}</td>
                                    <td>{tableData.plan?.productioncode}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h5 className="text-center bg-light py-2 border">SHIFT DETAILS</h5>
                    <div className="table-responsive">
                        <table className="table table-bordered table-sm align-middle small">
                            <thead className="table-light text-center">
                                <tr>
                                    <th>Plan Date</th><th>Shift</th><th>Op Name</th><th>Batch No</th>
                                    <th>Plan Qty</th><th>SKU (Multiple)</th><th>Gross Wt</th>
                                    <th>Alt UOM</th><th>Alt Qty</th><th>Rejection/Sample Qty</th><th>QtyToWH</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.products.map((p, i) => (
                                    <tr key={i}>
                                        <td>{formatDate(p.plandate)}</td>
                                        <td>{p.shift}</td>
                                        <td>{p.opname}</td>
                                        <td>{p.batchno}</td>
                                        <td className="text-center">{p.planqty}</td>
                                        <td>
                                            <select className="form-select form-select-sm" style={{ width: '120px' }}>
                                                <option value="single">Single SKU</option>
                                                <option value="multiple">Multiple SKU</option>
                                            </select>
                                        </td>
                                        <td><input type="number" className="form-control form-control-sm" value={p.aqty || 0} onChange={e => handleProductChange(i, 'aqty', e.target.value)} /></td>
                                        <td><select className="form-select form-select-sm"><option>NOS</option></select></td>
                                        <td><input type="number" className="form-control form-control-sm" value={p.number || 0} onChange={e => handleProductChange(i, 'number', e.target.value)} /></td>
                                        <td className="text-center">{p.rejeqty || 0}</td>
                                        <td><input type="number" className="form-control form-control-sm bg-light" value={p.qtygiventowh || 0} disabled /></td>
                                    </tr>
                                ))}
                                <tr className="fw-bold text-center">
                                    <td colSpan="6" className="text-end px-3">Total:</td>
                                    <td>{totalGross}</td>
                                    <td></td>
                                    <td>{totalAlt}</td>
                                    <td colSpan="2"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="text-center mt-4">
                        <button className="btn btn-success fw-bold px-5">SUBMIT</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CustomActualPlan;