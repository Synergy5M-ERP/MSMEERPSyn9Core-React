import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateInventory = () => {
    // --- State Management ---
    const [itemNames, setItemNames] = useState([]);
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(false);
    const [itemsLoading, setItemsLoading] = useState(false);

    // Form Data State
    const [formData, setFormData] = useState({
        itemName: '',
        grade: '',
        itemCode: '',
        uom: '',
        safeStock: '',
        avgPrice: 0,
        leadTime: '',
        openingBalance: '',
        dailyProduction: '',
        dailyIssue: '',
        closingBalance: 0,
        inventoryValue: 0
    });

    // Validation State
    const [errors, setErrors] = useState({});

    // --- Effects ---

    // 1. LOAD ALL ITEMS DIRECTLY ON MOUNT (No Search)
    useEffect(() => {
        const fetchAllItems = async () => {
            setItemsLoading(true);
            try {
                // Fetch ALL items directly (no search parameter)
                const response = await axios.get(`/Product/GetSemiFinItemList`);
                setItemNames(response.data || []);
            } catch (err) {
                console.error("Error fetching items", err);
                setErrors({ api: "Failed to load items. Please refresh." });
            } finally {
                setItemsLoading(false);
            }
        };

        fetchAllItems();
    }, []);

    // 2. Real-time Calculations: Closing Balance & Inventory Value
    useEffect(() => {
        const ob = parseFloat(formData.openingBalance) || 0;
        const dp = parseFloat(formData.dailyProduction) || 0;
        const di = parseFloat(formData.dailyIssue) || 0;
        const price = parseFloat(formData.avgPrice) || 0;

        const cb = ob + dp - di;
        const iv = cb * price;

        setFormData(prev => ({
            ...prev,
            closingBalance: cb,
            inventoryValue: iv.toFixed(2)
        }));
    }, [formData.openingBalance, formData.dailyProduction, formData.dailyIssue, formData.avgPrice]);

    // --- Event Handlers ---

    const handleItemChange = async (e) => {
        const val = e.target.value;
        setFormData({
            ...formData,
            itemName: val,
            grade: '',
            itemCode: '',
            uom: '',
            safeStock: '',
            avgPrice: 0
        });
        setGrades([]); // Clear grades

        if (val) {
            try {
                const res = await axios.get(`/Product/GetSemiFinGrade?itemName=${val}`);
                setGrades(res.data || []);
            } catch (err) {
                console.error("Error fetching grades:", err);
                setErrors({ ...errors, grade: "Failed to load grades" });
            }
        }
    };

    const handleGradeChange = async (e) => {
        const val = e.target.value;
        setFormData({ ...formData, grade: val });

        if (val && formData.itemName) {
            try {
                const res = await axios.get(`/Product/GetSemiFinProdDeatails?Itemnames=${formData.itemName}&grade=${val}`);
                if (res.data) {
                    setFormData(prev => ({
                        ...prev,
                        itemCode: res.data.itemcode || '',
                        uom: res.data.uom || '',
                        safeStock: res.data.safestock || '',
                        avgPrice: parseFloat(res.data.avgprice) || 0
                    }));
                }
            } catch (err) {
                console.error("Error fetching product details:", err);
            }
        }
    };

    const validate = () => {
        let tempErrors = {};
        if (!formData.itemName) tempErrors.itemName = "Item Name is required.";
        if (!formData.grade) tempErrors.grade = "Grade is required.";
        if (!formData.leadTime) tempErrors.leadTime = "Lead Time is required.";
        if (!formData.openingBalance) tempErrors.openingBalance = "Opening Balance is required.";

        // Numeric Only check (Regex for digits)
        const numericRegex = /^[0-9]*$/;
        if (formData.openingBalance && !numericRegex.test(formData.openingBalance)) {
            tempErrors.openingBalance = "Must contain only digits.";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const payload = {
                ItemName: formData.itemName,
                Grade: formData.grade,
                ItemCode: formData.itemCode,
                UOM: formData.uom,
                SafeStock: formData.safeStock,
                Unit_Price: formData.avgPrice,
                OpeningBalance: formData.openingBalance,
                DailyProduction: formData.dailyProduction,
                DailyIssue: formData.dailyIssue,
                ClosingBalance: formData.closingBalance,
                LeadTime: formData.leadTime,
                Inventory_Value: parseFloat(formData.inventoryValue)
            };

            await axios.post('/Product/Save', payload);
            alert("Data Added successfully");
            // Reset form
            setFormData({
                itemName: '',
                grade: '',
                itemCode: '',
                uom: '',
                safeStock: '',
                avgPrice: 0,
                leadTime: '',
                openingBalance: '',
                dailyProduction: '',
                dailyIssue: '',
                closingBalance: 0,
                inventoryValue: 0
            });
            setGrades([]);
            setItemNames([]); // Refresh items list
            // Reload items to get updated list
            window.location.reload();
        } catch (err) {
            console.error("Submit error:", err);
            alert("Error saving data. Please check your inputs.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field) => (e) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear field-specific errors
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <div className="container " style={{
            backgroundColor: '#f5f5f5',
            borderRadius: '10px',
            padding: '10px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            maxWidth: '1200px'
        }}>
            {/* <h4 className="text-center mb-4" style={{ color: '#2c3e50', fontWeight: '700' }}>
                CREATE SEMIFINISHED INVENTORY
            </h4>
             */}
            <form onSubmit={handleSubmit}>
                <div className="row ">
                    {/* Item Name Dropdown - DIRECT API FETCH */}
                    <div className="col">
                        <label className="label-color">
                            Item Name <span className="text-danger">*</span>
                        </label>
                        <select
                            className={`select-field-style ${errors.itemName ? 'is-invalid' : ''}`}
                            value={formData.itemName}
                            onChange={handleItemChange}
                            disabled={itemsLoading}
                        >
                            <option value="">
                                {itemsLoading ? 'Loading Items...' : 'Select Item Name'}
                            </option>
                            {itemNames.map((item, i) => (
                                <option key={item.Id || i} value={item.Name}>
                                    {item.Name}
                                </option>
                            ))}
                        </select>
                        {errors.itemName && (
                            <div className="text-danger small mt-1">{errors.itemName}</div>
                        )}
                    </div>

                    {/* Grade Dropdown - Cascading */}
                    <div className="col">
                        <label className="label-color">
                            Grade <span className="text-danger">*</span>
                        </label>
                        <select
                            className={`select-field-style ${errors.grade ? 'is-invalid' : ''}`}
                            value={formData.grade}
                            onChange={handleGradeChange}
                            disabled={!formData.itemName || grades.length === 0}
                        >
                            <option value="">
                                {formData.itemName ? 'Select Grade' : 'Select Item First'}
                            </option>
                            {grades.map((g, i) => (
                                <option key={g.id || i} value={g.grade}>
                                    {g.grade}
                                </option>
                            ))}
                        </select>
                        {errors.grade && (
                            <div className="text-danger small mt-1">{errors.grade}</div>
                        )}
                    </div>
                    <div className="col">
                        <label className="label-color">Item Code</label>
                        <input
                            type="text"
                            className="input-field-style bg-light"
                            value={formData.itemCode}
                            readOnly
                        />
                    </div>
                    <div className="col">
                        <label className="label-color">UOM</label>
                        <input
                            type="text"
                            className="input-field-style bg-light"
                            value={formData.uom}
                            readOnly
                        />
                    </div>
                    <div className="col">
                        <label className="label-color">Safe Stock</label>
                        <input
                            type="text"
                            className="input-field-style bg-light"
                            value={formData.safeStock}
                            readOnly
                        />
                    </div>
                    <div className="col">
                        <label className="label-color">Avg Price</label>
                        <input
                            type="text"
                            className="input-field-style bg-light"
                            value={formData.avgPrice.toFixed(2)}
                            readOnly
                        />
                    </div>
                </div>



                {/* Input Fields */}
                <div className="row ">

                    <div className="col">
                        <label className="label-color">
                            Lead Time <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className={`input-field-style ${errors.leadTime ? 'is-invalid' : ''}`}
                            value={formData.leadTime}
                            onChange={handleInputChange('leadTime')}
                        />
                        {errors.leadTime && (
                            <div className="text-danger small mt-1">{errors.leadTime}</div>
                        )}
                    </div>
                    <div className="col">
                        <label className="label-color">
                            Opening Balance <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className={`input-field-style ${errors.openingBalance ? 'is-invalid' : ''}`}
                            value={formData.openingBalance}
                            onChange={handleInputChange('openingBalance')}
                            placeholder="Enter digits only"
                        />
                        {errors.openingBalance && (
                            <div className="text-danger small mt-1">{errors.openingBalance}</div>
                        )}
                    </div>
                    <div className="col">
                        <label className="label-color">Daily Production</label>
                        <input
                            type="text"
                            className="input-field-style"
                            value={formData.dailyProduction}
                            onChange={handleInputChange('dailyProduction')}
                            placeholder="0"
                        />
                    </div>
                    <div className="col">
                        <label className="label-color">Daily Issue</label>
                        <input
                            type="text"
                            className="input-field-style"
                            value={formData.dailyIssue}
                            onChange={handleInputChange('dailyIssue')}
                            placeholder="0"
                        />
                    </div>
                    <div className="col">
                        <label className="label-color">Closing Balance</label>
                        <input
                            type="text"
                            className="input-field-style bg-light fw-bold"
                            value={formData.closingBalance.toFixed(2)}
                            readOnly
                           
                        />
                    </div>
                    <div className="col">
                        <label className="label-color">Inventory Value (₹)</label>
                        <input
                            type="text"
                            className="input-field-style  text-white fw-bold"
                            value={`₹ ${parseFloat(formData.inventoryValue).toLocaleString('en-IN')}`}
                            readOnly
                            style={{ fontSize: '1.2rem' }}
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="save-btn"
                    style={{
                        background: 'linear-gradient(45deg, #28a745, #20c997)',
                        color: 'white',
                        height: '50px',
                        borderRadius: '10px',
                        fontSize: '1.1rem'
                    }}
                    disabled={loading || itemsLoading}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            PROCESSING...
                        </>
                    ) : (
                        'SUBMIT'
                    )}
                </button>


                {/* API Error Display */}
                {errors.api && (
                    <div className="alert alert-danger mt-3" role="alert">
                        {errors.api}
                    </div>
                )}
            </form>
        </div>
    );
};

export default CreateInventory;
