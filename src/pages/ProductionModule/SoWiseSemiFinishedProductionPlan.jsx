// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Swal from 'sweetalert2';

// const SoWiseSemiFinishedProductionPlan = () => {
//     // --- State Management ---
//     const [formData, setFormData] = useState({
//         prodPlanDate: '',
//         location: '',
//         machineName: '',
//         machineNumber: '',
//         machineCap: '',
//         planDate: '',
//         shift: '',
//         batchNo: '',
//         opName: '',
//         planQty: ''
//     });

//     const [options, setOptions] = useState({
//         locations: [],
//         machines: [],
//         machineNumbers: []
//     });

//     const [productList, setProductList] = useState([]);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     // Get URL Parameters (Mocking Request.QueryString)
//     const queryParams = new URLSearchParams(window.location.search);
//     const staticData = {
//         buyerName: queryParams.get("buyername") || "SWAMI SAMARTH POLYFILM INDUSTRIES PVT LT",
//         soNumber: queryParams.get("sono") || "SSPIPL/1/00006",
//         itemName: queryParams.get("ItemName") || "PRINTING",
//         grade: queryParams.get("Grade") || "356MM/65 MIC",
//         soQty: parseFloat(queryParams.get("totalsoqty") || "1051.25"),
//         reqQty: parseFloat(queryParams.get("totalRequiredQty") || "1051.25"),
//         balProdQty: parseFloat(queryParams.get("balProdQty") || "1051.25"),
//         prodCode: queryParams.get("productioncode") || "PLAN 2"
//     };

//     // --- Batch Number Logic ---
//     useEffect(() => {
//         if (formData.machineNumber && formData.planDate && formData.shift) {
//             const dateObj = new Date(formData.planDate);
//             const day = String(dateObj.getDate()).padStart(2, '0');
//             const month = String(dateObj.getMonth() + 1).padStart(2, '0');
//             const year = String(dateObj.getFullYear()).slice(-2);
//             const shiftNum = formData.shift === "1ST SHIFT" ? "1" : "2";
            
//             const batch = `${formData.machineNumber}/${day}${month}${year}/${shiftNum}`;
//             setFormData(prev => ({ ...prev, batchNo: batch }));
//         }
//     }, [formData.machineNumber, formData.planDate, formData.shift]);

//     // --- Dropdown Cascading ---
//     const handleLocationSearch = async (val) => {
//         setFormData(prev => ({ ...prev, location: val }));
//         try {
//             const res = await axios.get(`/Product/GetPlantList?input=${val}`);
//             setOptions(prev => ({ ...prev, locations: res.data }));
//         } catch (err) { console.error(err); }
//     };

//     const handleLocationChange = async (val) => {
//         setFormData(prev => ({ ...prev, location: val }));
//         const res = await axios.get(`/Product/GetMachineName?location=${val}`);
//         setOptions(prev => ({ ...prev, machines: res.data }));
//     };

//     const handleMachineChange = async (val) => {
//         setFormData(prev => ({ ...prev, machineName: val }));
//         const res = await axios.get(`/Product/GetMachineNumber?location=${formData.location}&name=${val}`);
//         setOptions(prev => ({ ...prev, machineNumbers: res.data }));
//     };

//     // --- Actions ---
//     const handleAddResult = () => {
//         if (!formData.planDate || !formData.shift || !formData.opName || !formData.planQty) {
//             Swal.fire("Error", "Please fill all required fields", "error");
//             return;
//         }

//         const newEntry = { ...formData, id: Date.now() };
//         setProductList([...productList, newEntry]);
        
//         // Clear inputs as per original ClearData()
//         setFormData(prev => ({ ...prev, shift: '', planQty: '', opName: '', batchNo: '' }));
//     };

//     const handleSubmit = async () => {
//         if (productList.length === 0) {
//             Swal.fire("Note", "Please add at least one result", "warning");
//             return;
//         }

//         setIsSubmitting(true);
//         const payload = {
//             ...staticData,
//             Date: formData.prodPlanDate,
//             PQM_TodaysSemiFinPlanTbl: productList
//         };

//         try {
//             await axios.post('/Product/SemiFinProdPlan', payload);
//             Swal.fire("Success", "Data submitted successfully", "success").then(() => {
//                 window.location.reload();
//             });
//         } catch (err) {
//             Swal.fire("Error", "Submission failed", "error");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleCancel = () => {
//         window.location.href = '/RawMaterial/SemiFinItems';
//     };

//     const totalPlanned = productList.reduce((sum, item) => sum + parseFloat(item.planQty || 0), 0);

//     return (
//         <div className="container-fluid p-4" style={{ fontFamily: 'Cambria' }}>
//             {/* Header Section */}
//             <div className="card shadow-sm mb-4">
//                 <div className="card-header bg-white text-center fw-bold fs-5">SEMI FINISHED PRODUCTION PLAN</div>
//                 <div className="card-body row g-3">
//                     <div className="col-md-3">
//                         <label className="fw-bold small">Prod Plan Date <span className="text-danger">*</span></label>
//                         <input type="date" className="form-control" onChange={e => setFormData({...formData, prodPlanDate: e.target.value})} />
//                     </div>
//                     <div className="col-md-3">
//                         <label className="fw-bold small">Buyer Name</label>
//                         <input type="text" className="form-control bg-light" value={staticData.buyerName} disabled />
//                     </div>
//                     <div className="col-md-3">
//                         <label className="fw-bold small">SO Number</label>
//                         <input type="text" className="form-control bg-light" value={staticData.soNumber} disabled />
//                     </div>
//                     <div className="col-md-3">
//                         <label className="fw-bold small">Item Name</label>
//                         <input type="text" className="form-control bg-light" value={staticData.itemName} disabled />
//                     </div>
//                     <div className="col-md-3">
//                         <label className="fw-bold small">SO Quantity</label>
//                         <input type="text" className="form-control bg-light" value={staticData.soQty.toFixed(2)} disabled />
//                     </div>
//                     <div className="col-md-3">
//                         <label className="fw-bold small">BalProd Qty</label>
//                         <input type="text" className="form-control bg-light" value={(staticData.balProdQty - totalPlanned).toFixed(2)} disabled />
//                     </div>
//                 </div>
//             </div>

//             {/* Daily Plan Section */}
//             <div className="card shadow-sm mb-4">
//                 <div className="card-header bg-white text-center fw-bold small">DAILY PRODUCTION PLAN</div>
//                 <div className="card-body row g-3">
//                     <div className="col-md-3">
//                         <label className="small fw-bold">Search Location</label>
//                         <input type="text" className="form-control" placeholder="Search..." onChange={e => handleLocationSearch(e.target.value)} />
//                     </div>
//                     <div className="col-md-3">
//                         <label className="small fw-bold">Location</label>
//                         <select className="form-select" onChange={e => handleLocationChange(e.target.value)}>
//                             <option value="">Select</option>
//                             {options.locations.map(l => <option key={l.Name} value={l.Name}>{l.Name}</option>)}
//                         </select>
//                     </div>
//                     <div className="col-md-3">
//                         <label className="small fw-bold">Machine Name</label>
//                         <select className="form-select" onChange={e => handleMachineChange(e.target.value)}>
//                             <option value="">Select</option>
//                             {options.machines.map(m => <option key={m.machinename} value={m.machinename}>{m.machinename}</option>)}
//                         </select>
//                     </div>
//                     <div className="col-md-3">
//                         <label className="small fw-bold">Shift</label>
//                         <select className="form-select" value={formData.shift} onChange={e => setFormData({...formData, shift: e.target.value})}>
//                             <option value="">Select</option>
//                             <option value="1ST SHIFT">1ST SHIFT</option>
//                             <option value="2ND SHIFT">2ND SHIFT</option>
//                         </select>
//                     </div>
//                     <div className="col-md-3">
//                         <label className="small fw-bold">Op Name</label>
//                         <input type="text" className="form-control" value={formData.opName} onChange={e => setFormData({...formData, opName: e.target.value})} />
//                     </div>
//                     <div className="col-md-3">
//                         <label className="small fw-bold">Plan Qty</label>
//                         <input type="number" className="form-control" value={formData.planQty} onChange={e => setFormData({...formData, planQty: e.target.value})} />
//                     </div>
//                     <div className="col-md-3">
//                         <label className="small fw-bold">Batch No</label>
//                         <input type="text" className="form-control bg-light" value={formData.batchNo} disabled />
//                     </div>
//                     <div className="col-12 text-center">
//                         <button className="btn btn-success fw-bold px-4" onClick={handleAddResult}>ADD RESULT</button>
//                     </div>
//                 </div>
//             </div>

//             {/* Grid Display */}
//             <div className="table-responsive">
//                 <table className="table table-bordered align-middle">
//                     <thead className="table-light">
//                         <tr>
//                             <th>Sr No</th><th>Location</th><th>Machine</th><th>Date</th><th>Shift</th><th>Batch No</th><th>Plan Qty</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {productList.map((p, i) => (
//                             <tr key={p.id}>
//                                 <td>{i + 1}</td><td>{p.location}</td><td>{p.machineName}</td><td>{p.planDate}</td><td>{p.shift}</td><td>{p.batchNo}</td><td>{p.planQty}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                     <tfoot className="fw-bold">
//                         <tr>
//                             <td colSpan="6" className="text-end">Total</td>
//                             <td>{totalPlanned.toFixed(2)}</td>
//                         </tr>
//                     </tfoot>
//                 </table>
//             </div>

//             {/* Footer Buttons */}
//             <div className="d-flex justify-content-center gap-3 mt-4">
//                 <button className="btn btn-success fw-bold px-5 py-2" onClick={handleSubmit} disabled={isSubmitting}>
//                     {isSubmitting ? "PROCESSING..." : "SUBMIT"}
//                 </button>
//                 <button className="btn btn-danger fw-bold px-5 py-2" onClick={handleCancel}>
//                     CANCEL
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default SoWiseSemiFinishedProductionPlan;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const SemiFinishedActualProduction = () => {
    // --- State Management ---
    const [filters, setFilters] = useState({
        orderType: '',
        buyerName: '',
        soNumber: '',
        finishGrade: '',
        itemName: '',
        grade: '',
        planCode: ''
    });

    const [options, setOptions] = useState({
        orderTypes: ['CUSTOM', 'GENERIC'],
        buyers: [],
        soNumbers: [],
        finishGrades: [],
        items: [],
        grades: [],
        planCodes: []
    });

    const [data, setData] = useState({
        soDetails: null,
        shiftDetails: []
    });

    const [showResults, setShowResults] = useState(false);

    // --- Cascading Filter Logic ---
    const handleFilterChange = async (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));

        try {
            // Logic based on images 5 and 6 for cascading dropdowns
            if (name === 'orderType') {
                const res = await axios.get(`/Product/GetBuyers?type=${value}`);
                setOptions(prev => ({ ...prev, buyers: res.data, soNumbers: [], items: [], grades: [] }));
            } else if (name === 'buyerName') {
                const res = await axios.get(`/Product/GetSONumbers?buyer=${value}`);
                setOptions(prev => ({ ...prev, soNumbers: res.data, items: [], grades: [] }));
            } else if (name === 'soNumber') {
                const res = await axios.get(`/Product/GetItems?so=${value}`);
                setOptions(prev => ({ ...prev, items: res.data, grades: [] }));
            }
            // Continue pattern for Finish Grade, Plan Code, etc.
        } catch (err) {
            console.error("Error fetching cascading data", err);
        }
    };

    // --- Search Logic ---
    const handleSearch = async () => {
        if (!filters.orderType || !filters.planCode) {
            Swal.fire("Note", "Please select Order Type and Plan Code", "warning");
            return;
        }

        try {
            // API call to fetch data seen in images 3 and 4
            const res = await axios.get('/Product/GetSemiFinActualDetails', { params: filters });
            if (res.data && res.data.shiftDetails.length > 0) {
                setData(res.data);
                setShowResults(true);
            } else {
                Swal.fire("Info", "No production plan found for these details.", "info");
            }
        } catch (err) {
            Swal.fire("Error", "Search failed", "error");
        }
    };

    // --- Table Input Logic ---
    const handleShiftInputChange = (index, field, value) => {
        const updatedShifts = [...data.shiftDetails];
        updatedShifts[index][field] = value;
        
        // Auto-calculate Balance Plan Qty logic from image 4
        if (field === 'grossWt') {
            const planQty = parseFloat(updatedShifts[index].planQty) || 0;
            updatedShifts[index].balPlanQty = (planQty - parseFloat(value || 0)).toFixed(2);
        }
        
        setData({ ...data, shiftDetails: updatedShifts });
    };

    // --- Footer Totals ---
    const totalGross = data.shiftDetails.reduce((sum, s) => sum + (parseFloat(s.grossWt) || 0), 0).toFixed(2);
    const totalBal = data.shiftDetails.reduce((sum, s) => sum + (parseFloat(s.balPlanQty) || 0), 0).toFixed(2);

    return (
        <div className="container-fluid p-4" style={{ fontFamily: 'Cambria', fontWeight: 'bold' }}>
            <h4 className="text-primary">SEMI FINISHED ACTUAL PRODUCTION</h4>

            {/* Filter Section (Matches Image 5) */}
            <div className="card shadow-sm p-4 mb-4 bg-light border-0">
                <div className="row g-3">
                    <div className="col-md-3">
                        <label className="label-color">Order Type</label>
                        <select name="orderType" className="input-field-style" onChange={handleFilterChange}>
                            <option value="">Select Type</option>
                            {options.orderTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="label-color">Buyer Name</label>
                        <select name="buyerName" className="input-field-style" onChange={handleFilterChange}>
                            <option value="">Select Buyer</option>
                            {options.buyers.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="label-color">SO Number</label>
                        <select name="soNumber" className="input-field-style" onChange={handleFilterChange}>
                            <option value="">Select Number</option>
                            {options.soNumbers.map(n => <option key={n.no} value={n.no}>{n.no}</option>)}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="label-color">Finish Grade</label>
                        <select name="finishGrade" className="input-field-style" onChange={handleFilterChange}>
                            <option value="">Select Finish Grade</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="label-color">Semi Finish Item Name</label>
                        <select name="itemName" className="input-field-style" onChange={handleFilterChange}>
                            <option value="">Select Item Name</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="label-color">Semi Finish Grade</label>
                        <select name="grade" className="input-field-style" onChange={handleFilterChange}>
                            <option value="">Select Grade</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="label-color">Plan Code</label>
                        <select name="planCode" className="input-field-style" onChange={handleFilterChange}>
                            <option value="">Select Plan Code</option>
                        </select>
                    </div>
                    <div className="col-md-3 d-flex align-items-end">
                        <button className="add-btn" onClick={handleSearch}>SEARCH</button>
                    </div>
                </div>
            </div>

            {showResults && (
                <div className="fade-in">
                    {/* SO Details Table (Matches Image 3) */}
                    <h5 className="text-center mb-2">SO DETAILS</h5>
                    <div className="table-responsive mb-4">
                        <table className="table table-bordered table-sm text-center small align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Prod Plan Date</th><th>Item Code</th><th>Item Name</th>
                                    <th>Grade</th><th>Buyer Name</th><th>SO Number</th>
                                    <th>UOM</th><th>SO Qty</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{data.soDetails?.planDate}</td>
                                    <td>{data.soDetails?.itemCode}</td>
                                    <td>{data.soDetails?.itemName}</td>
                                    <td>{data.soDetails?.grade}</td>
                                    <td>{data.soDetails?.buyerName}</td>
                                    <td>{data.soDetails?.soNumber}</td>
                                    <td>{data.soDetails?.uom}</td>
                                    <td>{data.soDetails?.soQty}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Shift Details Table (Matches Image 4/6) */}
                    <h5 className="text-center mb-2">SHIFT DETAILS</h5>
                    <div className="table-responsive">
                        <table className="table table-bordered table-sm small align-middle">
                            <thead className="table-light text-center">
                                <tr>
                                    <th>Location</th><th>Machine Name</th><th>Machine Number</th>
                                    <th>Capacity</th><th>Production Date</th><th>Shift</th>
                                    <th>Op Name</th><th>Batch No</th><th>Plan Qty</th>
                                    <th>SKU (Multiple)</th><th>Gross wt Qty</th><th>Net Wt(KG)</th>
                                    <th>Bal Plan Qty</th><th>SKU No</th><th>Wastage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.shiftDetails.map((shift, idx) => (
                                    <tr key={idx}>
                                        <td>{shift.location}</td>
                                        <td>{shift.machineName}</td>
                                        <td>{shift.machineNumber}</td>
                                        <td>{shift.capacity}</td>
                                        <td className="text-center">{shift.productionDate}</td>
                                        <td className="text-center">{shift.shift}</td>
                                        <td>{shift.opName}</td>
                                        <td className="text-center">{shift.batchNo}</td>
                                        <td className="text-center">{shift.planQty}</td>
                                        <td>
                                            <select className="input-field-style">
                                                <option>Single S</option>
                                                <option>Multiple</option>
                                            </select>
                                        </td>
                                        <td>
                                            <input type="number" className="form-control form-control-sm" 
                                                value={shift.grossWt || ''} 
                                                onChange={(e) => handleShiftInputChange(idx, 'grossWt', e.target.value)} />
                                        </td>
                                        <td><input type="number" className="form-control form-control-sm" /></td>
                                        <td className="bg-light text-center">{shift.balPlanQty}</td>
                                        <td><input type="text" className="form-control form-control-sm" /></td>
                                        <td><input type="number" className="form-control form-control-sm" /></td>
                                    </tr>
                                ))}
                                <tr className="fw-bold text-center">
                                    <td colSpan="10" className="text-end px-3">Total:</td>
                                    <td>{totalGross}</td>
                                    <td></td>
                                    <td>{totalBal}</td>
                                    <td colSpan="2"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="d-flex justify-content-center gap-3 mt-4 mb-5">
                        <button className="btn btn-success fw-bold px-5 py-2">SUBMIT</button>
                        <button className="btn btn-danger fw-bold px-5 py-2" onClick={() => setShowResults(false)}>CANCEL</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SemiFinishedActualProduction;