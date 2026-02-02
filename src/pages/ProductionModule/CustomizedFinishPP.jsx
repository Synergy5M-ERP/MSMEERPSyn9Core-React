// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { API_ENDPOINTS } from '../../config/apiconfig';

// const CustomizedFinishPP = () => {
//     // --- Dropdown States ---
//     const [locations, setLocations] = useState([]);
//     const [machineNames, setMachineNames] = useState([]);
//     const [machineNumbers, setMachineNumbers] = useState([]);
//     const [soNumbers, setSoNumbers] = useState([]);
//     const [itemList, setItemList] = useState([]);
//     const [gradeList, setGradeList] = useState([]);

//     // --- Form State ---
//     const [formData, setFormData] = useState({
//         date: '',
//         location: '',
//         machineName: '',
//         machineNo: '',
//         mcCapacity: 0,
//         uom: '',
//         soNumber: '',
//         itemCode: '',
//         itemName: '',
//         grade: '',
//         buyerName: '',
//         soQty: '',
//         balProdQty: '',
//         soDate: '',
//         balMachineCap: 0,
//         // Daily Record Fields
//         planDate: '',
//         shift: '',
//         opName: '',
//         planQty: '',
//         batchNo: ''
//     });

//     const [tableList, setTableList] = useState([]);


// // --- Initial Load ---
//     useEffect(() => {
//         fetchLocations();
//         fetchItems();
//     }, []);

//     const fetchLocations = async () => {
//         try {
//             const res = await axios.get(API_ENDPOINTS.GetLocation);
//             setLocations(res.data || []);
//         } catch (err) {
//             // This logs the error to your browser console (F12) 
//             // but prevents the red error screen in the UI
//             console.error("404/Network Error - Locations:", err.message);
//             setLocations([]); 
//         }
//     };

//     const fetchItems = async () => {
//         try {
//             const res = await axios.get(API_ENDPOINTS.UniqueItem);
//             setItemList(res.data || []);
//         } catch (err) {
//             console.error("404/Network Error - Items:", err.message);
//             setItemList([]);
//         }
//     };

//     // --- Cascading Logic (Example for handleLocationChange) ---
//     const handleLocationChange = async (e) => {
//         const loc = e.target.value;
//         setFormData({ ...formData, location: loc, machineName: '', machineNo: '', mcCapacity: 0, uom: '' });
//         if (loc) {
//             try {
//                 const res = await axios.get(`${API_ENDPOINTS.Machinenames}?location=${loc}`);
//                 setMachineNames(res.data || []);
//             } catch (err) {
//                 // Silently fails to the console only
//                 console.warn(`Machines not found for ${loc}:`, err.message);
//                 setMachineNames([]);
//             }
//         }
//     };


//     // --- Initial Load ---
//     // useEffect(() => {
//     //     fetchLocations();
//     //     fetchItems();
//     // }, []);

//     // const fetchLocations = async () => {
//     //     const res = await axios.get(API_ENDPOINTS.GetLocation);
//     //     setLocations(res.data);
//     // };

//     // const fetchItems = async () => {
//     //     const res = await axios.get(API_ENDPOINTS.UniqueItem);
//     //     setItemList(res.data);
//     // };

//     // --- Machine Cascading Logic ---

//     // const handleLocationChange = async (e) => {
//     //     const loc = e.target.value;
//     //     setFormData({ ...formData, location: loc, machineName: '', machineNo: '', mcCapacity: 0, uom: '' });
//     //     if (loc) {
//     //         const res = await axios.get(`${API_ENDPOINTS.Machinenames}?location=${loc}`);
//     //         setMachineNames(res.data);
//     //     }
//     // };

//     const handleMachineNameChange = async (e) => {
//         const name = e.target.value;
//         setFormData({ ...formData, machineName: name, machineNo: '', mcCapacity: 0, uom: '' });
//         if (name) {
//             const res = await axios.get(`${API_ENDPOINTS.MachineNumber}?location=${formData.location}&name=${name}`);
//             setMachineNumbers(res.data);
//         }
//     };

//     const handleMachineNoChange = async (e) => {
//         const mno = e.target.value;
//         if (mno) {
//             const res = await axios.get(`${API_ENDPOINTS.MachineDetails}?mno=${mno}`);
//             const cap = res.data.capacity12H || 0;
//             setFormData(prev => ({ 
//                 ...prev, 
//                 machineNo: mno,
//                 mcCapacity: cap,
//                 balMachineCap: cap,
//                 uom: res.data.unit_of_Measurement 
//             }));
//         }
//     };

//     // --- Item & SO Cascading Logic ---

//     const handleItemChange = async (e) => {
//         const item = e.target.value;
//         setFormData({ ...formData, itemName: item, grade: '', soNumber: '', itemCode: '', buyerName: '', soQty: '', balProdQty: '', soDate: '' });
//         if (item) {
//             const res = await axios.get(`${API_ENDPOINTS.Grade}?itemName=${item}`);
//             setGradeList(res.data);
//         }
//     };

//     const handleGradeChange = async (e) => {
//         const grade = e.target.value;
//         setFormData({ ...formData, grade: grade, soNumber: '', itemCode: '', buyerName: '', soQty: '', balProdQty: '', soDate: '' });
//         if (grade) {
//             // const res = await axios.get(`/api/Product/GetSONumbersByItemAndGrade?itemName=${formData.itemName}&grade=${grade}`);
//             const res=await axios.get(API_ENDPOINTS.GetSONumber)
//             setSoNumbers(res.data);
//         }
//     };

// const handleSOChange = async (e) => {
//     const selectedSO = e.target.value;
    
//     // Reset fields while loading
//     setFormData(prev => ({ 
//         ...prev, 
//         soNumber: selectedSO,
//         itemCode: '', 
//         soDate: '', 
//         buyerName: '', 
//         soQty: '', 
//         balProdQty: '' 
//     }));

//     if (selectedSO && formData.itemName && formData.grade) {
//         try {
          
//             const encodedItem = encodeURIComponent(formData.itemName);
//             const encodedGrade = encodeURIComponent(formData.grade);
//             const encodedSO = encodeURIComponent(selectedSO);

//             const url = `${API_ENDPOINTS.GetSpecificOrderDetails}?itemName=${encodedItem}&grade=${encodedGrade}&soNumber=${encodedSO}`;
            
//             const res = await axios.get(url);
            
//             if (res.data) {
    
//                 setFormData(prev => ({
//                     ...prev,
//                     itemCode: res.data.itemCode,
//                     soDate: res.data.soDate,
//                     buyerName: res.data.buyerName,
//                     soQty: res.data.prodPlanQtySO,

//                     balProdQty: res.data.balanceProductionQuantity || res.data.prodPlanQtySO 
//                 }));
//             }
//         } catch (err) {
//             console.error("Error fetching specific order details:", err);
//             if (err.response && err.response.status === 404) {
//                 alert("Order details not found for this specific combination in the database.");
//             }
//         }
//     }
// };

   
//     useEffect(() => {
//         const totalPlanned = tableList.reduce((sum, item) => sum + Number(item.planQty || 0), 0);
//         setFormData(prev => ({
//             ...prev,
//             balMachineCap: prev.mcCapacity - totalPlanned
//         }));
//     }, [tableList, formData.mcCapacity]);

//     useEffect(() => {
//         if (formData.machineNo && formData.planDate && formData.shift) {
//             const dateParts = formData.planDate.split('-'); 
//             const formattedDate = `${dateParts[2]}${dateParts[1]}${dateParts[0].slice(-2)}`;
//             const shiftDigit = formData.shift === "1ST SHIFT" ? "1" : "2";
//             const generatedBatch = `${formData.machineNo}/${formattedDate}/${shiftDigit}`;
//             setFormData(prev => ({ ...prev, batchNo: generatedBatch }));
//         }
//     }, [formData.machineNo, formData.planDate, formData.shift]);

//     const handleAddResult = () => {
//         if (!formData.planQty || !formData.opName) return alert("Please fill mandatory fields");
//         if (Number(formData.planQty) > formData.balMachineCap) return alert("Plan Qty exceeds Machine Capacity!");
//         setTableList([...tableList, { ...formData }]);
//         setFormData({ ...formData, opName: '', planQty: '', shift: '', batchNo: '' });
//     };

//     const handleSubmit = async () => {
//         if (tableList.length === 0) return alert("Add at least one result");
//         try {
//             const payload = { ...formData, PQM_TodaysFinPlanTbl: tableList };
//             await axios.post('/api/Product/SavePlan', payload);
//             alert("Saved Successfully!");
//             window.location.reload();
//         } catch (err) { alert("Error saving data"); }
//     };

//     return (
//         <div className="container  p-2 shadow-sm bg-white border rounded">
//             {/* <h4 className="text-center mb-4 bg-success text-white p-2">CUSTOMISED FINISHED PRODUCTION PLAN</h4> */}
            
//             <div className='row'>
//                   <div className="col ">
//                     <label className="label-color">Plan Date *</label>
//                     <input type="date" className="input-field-style" onChange={e => setFormData({...formData, date: e.target.value})} />
//                 </div>
//                 <div className="col">
//                     <label className="label-color">Location *</label>
//                     <select className="select-field-style" value={formData.location} onChange={handleLocationChange}>
//                         <option value="">Select Location</option>
//                         {locations.map((loc, i) => <option key={i} value={loc}>{loc}</option>)}
//                     </select>
//                 </div>
//                 <div className="col">
//                     <label className="label-color">Machine Name *</label>
//                     <select className="select-field-style" value={formData.machineName} onChange={handleMachineNameChange} disabled={!formData.location}>
//                         <option value="">Select Machine</option>
//                         {machineNames.map((m, i) => <option key={i} value={m}>{m}</option>)}
//                     </select>
//                 </div>
//                 <div className="col">
//                     <label className="label-color">Machine No *</label>
//                     <select className="select-field-style" value={formData.machineNo} onChange={handleMachineNoChange} disabled={!formData.machineName}>
//                         <option value="">Select No</option>
//                         {machineNumbers.map((n, i) => <option key={i} value={n}>{n}</option>)}
//                     </select>
//                 </div>
//                  <div className="col">
//                     <label className="label-color font-weight-bold text-primary">Item Name *</label>
//                     <select className="select-field-style border-primary" value={formData.itemName} onChange={handleItemChange}>
//                         <option value="">Select Item</option>
//                         {itemList.map((item, i) => <option key={i} value={item}>{item}</option>)}
//                     </select>
//                 </div>
//             </div>
//             <div className="row ">
    
              

//                 <div className="col">
//                     <label className="label-color font-weight-bold text-primary">Grade *</label>
//                     <select className="select-field-style border-primary" value={formData.grade} onChange={handleGradeChange} disabled={!formData.itemName}>
//                         <option value="">Select Grade</option>
//                         {gradeList.map((g, i) => <option key={i} value={g}>{g}</option>)}
//                     </select>
//                 </div>
//                 <div className="col">
//                     <label className="label-color font-weight-bold text-primary">SO Number *</label>
//                     <select className="select-field-style border-primary" value={formData.soNumber} onChange={handleSOChange} disabled={!formData.grade}>
//                         <option value="">Select SO</option>
//                         {soNumbers.map((so, i) => <option key={i} value={so}>{so}</option>)}
//                     </select>
//                 </div>

         
//                 <div className="col">
//                     <label className="label-color ">Item Code</label>
//                     <input type="text" className="input-field-style bg-light" value={formData.itemCode} readOnly />
//                 </div>
//                 <div className="col">
//                     <label className="label-color ">SO Date</label>
//                     <input type="text" className="input-field-style bg-light" value={formData.soDate} readOnly />
//                 </div>
//                 <div className="col">
//                     <label className="label-color ">Buyer Name</label>
//                     <input type="text" className="input-field-style bg-light" value={formData.buyerName} readOnly />
//                 </div>
           
//             </div>
// <div className='row'>
//      <div className="col">
//                     <label className="label-color ">Prod Plan Qty(SO)</label>
//                     <input type="text" className="input-field-style bg-light" value={formData.soQty} readOnly />
//                 </div>
//                 <div className="col">
//                     <label className="label-color ">M/C Capacity / 12 H</label>
//                     <input type="text" className="input-field-style bg-light" value={formData.mcCapacity} readOnly />
//                 </div>
//                 <div className="col">
//                     <label className="label-color font-weight-bold">Balance Prod Qty</label>
//                     <input type="text" className="input-field-style bg-light text-danger" value={formData.balProdQty} readOnly />
//                 </div>
//                 <div className="col">
//                     <label className="label-color font-weight-bold">Balance Machine Capacity</label>
//                     <input type="text" className="input-field-style " value={formData.balMachineCap} readOnly />
//                 </div>
// </div>
//             {/* <hr className="my-4" />
//             <h5 className="mb-3 text-secondary">DAILY PRODUCTION RECORD</h5> */}
            
//             <div className="row g-3 align-items-end p-3   rounded">
//                 <div className="col-md-2">
//                     <label className="label-color">Plan Date</label>
//                     <input type="date" className="input-field-style" value={formData.planDate} onChange={e => setFormData({...formData, planDate: e.target.value})} />
//                 </div>
//                 <div className="col-md-2">
//                     <label className="label-color">Shift</label>
//                     <select className="select-field-style" value={formData.shift} onChange={e => setFormData({...formData, shift: e.target.value})}>
//                         <option value="">Select</option>
//                         <option value="1ST SHIFT">1ST SHIFT</option>
//                         <option value="2ND SHIFT">2ND SHIFT</option>
//                     </select>
//                 </div>
//                 <div className="col">
//                     <label className="label-color">Batch No (Auto)</label>
//                     <input type="text" className="input-field-style  text-white font-weight-bold" value={formData.batchNo} readOnly />
//                 </div>
//                 <div className="col-md-2">
//                     <label className="label-color">Op Name</label>
//                     <input type="text" className="input-field-style" value={formData.opName} onChange={e => setFormData({...formData, opName: e.target.value.toUpperCase()})} />
//                 </div>
//                 <div className="col-md-1">
//                     <label className="label-color">Qty</label>
//                     <input type="number" className="input-field-style" value={formData.planQty} onChange={e => setFormData({...formData, planQty: e.target.value})} />
//                 </div>
//                 <div className="col-md-2">
//                     <button className="add-btn" onClick={handleAddResult}>ADD </button>
//                 </div>
//             </div>

//             <div className="mt-4">
//                 <table className="table table-bordered table-striped">
//                     <thead className="table-dark">
//                         <tr>
//                             <th>Plan Date</th><th>Shift</th><th>Batch No</th><th>Operator</th><th>Qty</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {tableList.map((item, index) => (
//                             <tr key={index}>
//                                 <td>{item.planDate}</td><td>{item.shift}</td><td>{item.batchNo}</td><td>{item.opName}</td><td>{item.planQty}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             <div className="text-center mt-3">
//                 <button className="btn btn-primary btn-lg px-5" onClick={handleSubmit}>SUBMIT  </button>
//             </div>
//         </div>
//     );
// };

// export default CustomizedFinishPP;




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { API_ENDPOINTS } from '../../config/apiconfig';

// const CustomizedFinishPP = ({ editData, onSuccess }) => {
//     // --- Dropdown States ---
//     const [locations, setLocations] = useState([]);
//     const [machineNames, setMachineNames] = useState([]);
//     const [machineNumbers, setMachineNumbers] = useState([]);
//     const [soNumbers, setSoNumbers] = useState([]);
//     const [itemList, setItemList] = useState([]);
//     const [gradeList, setGradeList] = useState([]);

//     // --- Form State ---
//     const [formData, setFormData] = useState({
//         custFinProdId: 0, // 0 for new, >0 for edit
//         date: '',
//         location: '',
//         machineName: '',
//         machineNo: '',
//         mcCapacity: 0,
//         uom: '',
//         soNumber: '',
//         itemCode: '',
//         itemName: '',
//         grade: '',
//         buyerName: '',
//         soQty: '',
//         balProdQty: '',
//         soDate: '',
//         balMachineCap: 0,
//         // Daily Record Fields
//         planDate: '',
//         shift: '',
//         opName: '',
//         planQty: '',
//         batchNo: ''
//     });

//     const [tableList, setTableList] = useState([]);

//     // --- 1. Edit Functionality Logic ---
//     useEffect(() => {
//         if (editData) {
//             // Populate Header Data
//             setFormData(prev => ({
//                 ...prev,
//                 ...editData,
//                 date: editData.date ? editData.date.split('T')[0] : '', // Format for date input
//                 planDate: '', shift: '', opName: '', planQty: '', batchNo: '' // Clear entry fields
//             }));
//             // Fetch child records for this specific plan
//             fetchPlanDetails(editData.custFinProdId);
//         }
//     }, [editData]);

//     const fetchPlanDetails = async (id) => {
//         try {
//             const res = await axios.get(`${API_ENDPOINTS.GetCustomPlanDetails}?id=${id}`);
//             setTableList(res.data || []);
//         } catch (err) {
//             console.error("Error fetching rows:", err);
//             toast.error("Failed to load existing plan records.");
//         }
//     };

//     // --- 2. Initial Load & Cascading Dropdowns ---
//     useEffect(() => {
//         fetchLocations();
//         fetchItems();
//     }, []);

//     const fetchLocations = async () => {
//         try {
//             const res = await axios.get(API_ENDPOINTS.GetLocation);
//             setLocations(res.data || []);
//         } catch (err) { setLocations([]); }
//     };

//     const fetchItems = async () => {
//         try {
//             const res = await axios.get(API_ENDPOINTS.UniqueItem);
//             setItemList(res.data || []);
//         } catch (err) { setItemList([]); }
//     };

//     const handleLocationChange = async (e) => {
//         const loc = e.target.value;
//         setFormData({ ...formData, location: loc, machineName: '', machineNo: '', mcCapacity: 0, uom: '' });
//         if (loc) {
//             try {
//                 const res = await axios.get(`${API_ENDPOINTS.Machinenames}?location=${loc}`);
//                 setMachineNames(res.data || []);
//             } catch (err) { setMachineNames([]); }
//         }
//     };

//     const handleMachineNameChange = async (e) => {
//         const name = e.target.value;
//         setFormData({ ...formData, machineName: name, machineNo: '', mcCapacity: 0, uom: '' });
//         if (name) {
//             const res = await axios.get(`${API_ENDPOINTS.MachineNumber}?location=${formData.location}&name=${name}`);
//             setMachineNumbers(res.data || []);
//         }
//     };

//     const handleMachineNoChange = async (e) => {
//         const mno = e.target.value;
//         if (mno) {
//             const res = await axios.get(`${API_ENDPOINTS.MachineDetails}?mno=${mno}`);
//             const cap = res.data.capacity12H || 0;
//             setFormData(prev => ({ 
//                 ...prev, 
//                 machineNo: mno,
//                 mcCapacity: cap,
//                 balMachineCap: cap,
//                 uom: res.data.unit_of_Measurement 
//             }));
//         }
//     };

//     const handleItemChange = async (e) => {
//         const item = e.target.value;
//         setFormData({ ...formData, itemName: item, grade: '', soNumber: '' });
//         if (item) {
//             const res = await axios.get(`${API_ENDPOINTS.Grade}?itemName=${item}`);
//             setGradeList(res.data || []);
//         }
//     };

//     const handleGradeChange = async (e) => {
//         const grade = e.target.value;
//         setFormData({ ...formData, grade: grade, soNumber: '' });
//         if (grade) {
//             const res = await axios.get(API_ENDPOINTS.GetSONumber);
//             setSoNumbers(res.data || []);
//         }
//     };

//     const handleSOChange = async (e) => {
//         const selectedSO = e.target.value;
//         if (selectedSO && formData.itemName && formData.grade) {
//             const url = `${API_ENDPOINTS.GetSpecificOrderDetails}?itemName=${encodeURIComponent(formData.itemName)}&grade=${encodeURIComponent(formData.grade)}&soNumber=${encodeURIComponent(selectedSO)}`;
//             const res = await axios.get(url);
//             setFormData(prev => ({
//                 ...prev,
//                 soNumber: selectedSO,
//                 itemCode: res.data.itemCode,
//                 soDate: res.data.soDate,
//                 buyerName: res.data.buyerName,
//                 soQty: res.data.prodPlanQtySO,
//                 balProdQty: res.data.balanceProductionQuantity
//             }));
//         }
//     };

//     // --- 3. Batch Logic & Table Management ---
//     useEffect(() => {
//         if (formData.machineNo && formData.planDate && formData.shift) {
//             const dateParts = formData.planDate.split('-'); 
//             const formattedDate = `${dateParts[2]}${dateParts[1]}${dateParts[0].slice(-2)}`;
//             const shiftDigit = formData.shift === "1ST SHIFT" ? "1" : "2";
//             setFormData(prev => ({ ...prev, batchNo: `${formData.machineNo}/${formattedDate}/${shiftDigit}` }));
//         }
//     }, [formData.machineNo, formData.planDate, formData.shift]);

//     const handleAddResult = () => {
//         if (!formData.planQty || !formData.opName) return toast.warning("Fill mandatory fields");
//         setTableList([...tableList, { ...formData }]);
//         setFormData({ ...formData, opName: '', planQty: '', shift: '', batchNo: '', planDate: '' });
//     };

//     const handleSubmit = async () => {
//         if (tableList.length === 0) return toast.error("Add at least one daily record");
//         try {
//             const payload = { ...formData, PQM_TodaysFinPlanTbl: tableList };
//             if (formData.custFinProdId > 0) {
//                 await axios.put(`${API_ENDPOINTS.AmendPlan}/${formData.custFinProdId}`, payload);
//                 toast.success("Updated Successfully!");
//             } else {
//                 await axios.post(API_ENDPOINTS.SavePlan, payload);
//                 toast.success("Saved Successfully!");
//             }
//             if(onSuccess) onSuccess();
//         } catch (err) { toast.error("Error saving data"); }
//     };

//     return (
//         <div className="container p-2 shadow-sm bg-white border rounded">
//             <ToastContainer />
//             <div className='row'>
//                 <div className="col">
//                     <label className="label-color">Plan Date *</label>
//                     <input type="date" className="input-field-style" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
//                 </div>
//                 <div className="col">
//                     <label className="label-color">Location *</label>
//                     <select className="select-field-style" value={formData.location} onChange={handleLocationChange}>
//                         <option value="">Select Location</option>
//                         {locations.map((loc, i) => <option key={i} value={loc}>{loc}</option>)}
//                     </select>
//                 </div>
//                 <div className="col">
//                     <label className="label-color">Machine Name *</label>
//                     <select className="select-field-style" value={formData.machineName} onChange={handleMachineNameChange} disabled={!formData.location}>
//                         <option value="">Select Machine</option>
//                         {machineNames.map((m, i) => <option key={i} value={m}>{m}</option>)}
//                     </select>
//                 </div>
//                 <div className="col">
//                     <label className="label-color">Machine No *</label>
//                     <select className="select-field-style" value={formData.machineNo} onChange={handleMachineNoChange} disabled={!formData.machineName}>
//                         <option value="">Select No</option>
//                         {machineNumbers.map((n, i) => <option key={i} value={n}>{n}</option>)}
//                     </select>
//                 </div>
//                 <div className="col">
//                     <label className="label-color font-weight-bold text-primary">Item Name *</label>
//                     <select className="select-field-style border-primary" value={formData.itemName} onChange={handleItemChange}>
//                         <option value="">Select Item</option>
//                         {itemList.map((item, i) => <option key={i} value={item}>{item}</option>)}
//                     </select>
//                 </div>
//             </div>

//             <div className="row mt-2">
//                 <div className="col">
//                     <label className="label-color font-weight-bold text-primary">Grade *</label>
//                     <select className="select-field-style border-primary" value={formData.grade} onChange={handleGradeChange} disabled={!formData.itemName}>
//                         <option value="">Select Grade</option>
//                         {gradeList.map((g, i) => <option key={i} value={g}>{g}</option>)}
//                     </select>
//                 </div>
//                 <div className="col">
//                     <label className="label-color font-weight-bold text-primary">SO Number *</label>
//                     <select className="select-field-style border-primary" value={formData.soNumber} onChange={handleSOChange} disabled={!formData.grade}>
//                         <option value="">Select SO</option>
//                         {soNumbers.map((so, i) => <option key={i} value={so}>{so}</option>)}
//                     </select>
//                 </div>
//                 <div className="col"><label className="label-color">Item Code</label><input type="text" className="input-field-style bg-light" value={formData.itemCode} readOnly /></div>
//                 <div className="col"><label className="label-color">SO Date</label><input type="text" className="input-field-style bg-light" value={formData.soDate} readOnly /></div>
//                 <div className="col"><label className="label-color">Buyer Name</label><input type="text" className="input-field-style bg-light" value={formData.buyerName} readOnly /></div>
//             </div>

//             <div className="row g-3 align-items-end p-3 bg-light rounded mt-3">
//                 <div className="col-md-2">
//                     <label className="label-color">Plan Date</label>
//                     <input type="date" className="input-field-style" value={formData.planDate} onChange={e => setFormData({...formData, planDate: e.target.value})} />
//                 </div>
//                 <div className="col-md-2">
//                     <label className="label-color">Shift</label>
//                     <select className="select-field-style" value={formData.shift} onChange={e => setFormData({...formData, shift: e.target.value})}>
//                         <option value="">Select</option>
//                         <option value="1ST SHIFT">1ST SHIFT</option>
//                         <option value="2ND SHIFT">2ND SHIFT</option>
//                     </select>
//                 </div>
//                 <div className="col">
//                     <label className="label-color">Batch No</label>
//                     <input type="text" className="input-field-style bg-dark text-white font-weight-bold" value={formData.batchNo} readOnly />
//                 </div>
//                 <div className="col-md-2">
//                     <label className="label-color">Op Name</label>
//                     <input type="text" className="input-field-style" value={formData.opName} onChange={e => setFormData({...formData, opName: e.target.value.toUpperCase()})} />
//                 </div>
//                 <div className="col-md-1">
//                     <label className="label-color">Qty</label>
//                     <input type="number" className="input-field-style" value={formData.planQty} onChange={e => setFormData({...formData, planQty: e.target.value})} />
//                 </div>
//                 <div className="col-md-2">
//                     <button className="add-btn" onClick={handleAddResult}>ADD</button>
//                 </div>
//             </div>

//             <div className="mt-4">
//                 <table className="table table-bordered table-striped">
//                     <thead className="table-dark">
//                         <tr><th>Plan Date</th><th>Shift</th><th>Batch No</th><th>Operator</th><th>Qty</th><th>Action</th></tr>
//                     </thead>
//                     <tbody>
//                         {tableList.map((item, index) => (
//                             <tr key={index}>
//                                 <td>{item.planDate}</td><td>{item.shift}</td><td>{item.batchNo}</td><td>{item.opName}</td><td>{item.planQty}</td>
//                                 <td>
//                                     <button className="btn btn-sm btn-danger" onClick={() => setTableList(tableList.filter((_, i) => i !== index))}>Delete</button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             <div className="text-center mt-3">
//                 <button className="btn btn-primary btn-lg px-5" onClick={handleSubmit}>
//                     {formData.custFinProdId > 0 ? "UPDATE PLAN" : "SUBMIT PLAN"}
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default CustomizedFinishPP;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { API_ENDPOINTS } from '../../config/apiconfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomizedFinishPP = ({ editData, onSuccess }) => {
    // --- Dropdown States ---
    const [locations, setLocations] = useState([]);
    const [machineNames, setMachineNames] = useState([]);
    const [machineNumbers, setMachineNumbers] = useState([]);
    const [soNumbers, setSoNumbers] = useState([]);
    const [itemList, setItemList] = useState([]);
    const [gradeList, setGradeList] = useState([]);

    // --- Form State ---
    const [formData, setFormData] = useState({
        custFinProdId: 0, 
        date: '',
        location: '',
        machineName: '',
        machineNo: '',
        mcCapacity: 0,
        uom: '', // Field restored
        soNumber: '',
        itemCode: '',
        itemName: '',
        grade: '',
        buyerName: '',
        soQty: '',
        balProdQty: '',
        soDate: '',
        balMachineCap: 0,
        // Daily Entry Fields
        planDate: '',
        shift: '',
        opName: '',
        planQty: '',
        batchNo: ''
    });

    const [tableList, setTableList] = useState([]);

    // --- Edit Mode Logic ---
    useEffect(() => {
        if (editData) {
            setFormData(prev => ({
                ...prev,
                ...editData,
                date: editData.date ? editData.date.split('T')[0] : '', 
            }));
            fetchExistingRows(editData.custFinProdId);
        }
    }, [editData]);

    const fetchExistingRows = async (id) => {
        try {
            const res = await axios.get(`${API_ENDPOINTS.GetCustomPlanDetails}?id=${id}`);
            setTableList(res.data || []);
        } catch (err) {
            console.error("Error fetching details:", err);
        }
    };

    // --- Initial Load ---
    useEffect(() => {
        fetchLocations();
        fetchItems();
    }, []);

    const fetchLocations = async () => {
        try {
            const res = await axios.get(API_ENDPOINTS.GetLocation);
            setLocations(res.data || []);
        } catch (err) { setLocations([]); }
    };

    const fetchItems = async () => {
        try {
            const res = await axios.get(API_ENDPOINTS.UniqueItem);
            setItemList(res.data || []);
        } catch (err) { setItemList([]); }
    };

    // --- Cascading Handlers ---
    const handleLocationChange = async (e) => {
        const loc = e.target.value;
        setFormData({ ...formData, location: loc, machineName: '', machineNo: '', mcCapacity: 0, uom: '' });
        if (loc) {
            const res = await axios.get(`${API_ENDPOINTS.Machinenames}?location=${loc}`);
            setMachineNames(res.data || []);
        }
    };

    const handleMachineNameChange = async (e) => {
        const name = e.target.value;
        setFormData({ ...formData, machineName: name, machineNo: '', mcCapacity: 0, uom: '' });
        if (name) {
            const res = await axios.get(`${API_ENDPOINTS.MachineNumber}?location=${formData.location}&name=${name}`);
            setMachineNumbers(res.data || []);
        }
    };

    const handleMachineNoChange = async (e) => {
        const mno = e.target.value;
        if (mno) {
            const res = await axios.get(`${API_ENDPOINTS.MachineDetails}?mno=${mno}`);
            setFormData(prev => ({ 
                ...prev, 
                machineNo: mno,
                mcCapacity: res.data.capacity12H || 0,
                uom: res.data.unit_of_Measurement || '',
                balMachineCap: res.data.capacity12H || 0
            }));
        }
    };

    const handleItemChange = async (e) => {
        const item = e.target.value;
        setFormData({ ...formData, itemName: item, grade: '', soNumber: '', itemCode: '', buyerName: '', soQty: '', balProdQty: '', soDate: '' });
        if (item) {
            const res = await axios.get(`${API_ENDPOINTS.Grade}?itemName=${item}`);
            setGradeList(res.data || []);
        }
    };

    const handleGradeChange = async (e) => {
        const grade = e.target.value;
        setFormData({ ...formData, grade: grade, soNumber: '' });
        if (grade) {
            const res = await axios.get(API_ENDPOINTS.GetSONumber);
            setSoNumbers(res.data || []);
        }
    };

    const handleSOChange = async (e) => {
        const selectedSO = e.target.value;
        if (selectedSO && formData.itemName && formData.grade) {
            const url = `${API_ENDPOINTS.GetSpecificOrderDetails}?itemName=${encodeURIComponent(formData.itemName)}&grade=${encodeURIComponent(formData.grade)}&soNumber=${encodeURIComponent(selectedSO)}`;
            const res = await axios.get(url);
            setFormData(prev => ({
                ...prev,
                soNumber: selectedSO,
                itemCode: res.data.itemCode,
                soDate: res.data.soDate,
                buyerName: res.data.buyerName,
                soQty: res.data.prodPlanQtySO,
                balProdQty: res.data.balanceProductionQuantity
            }));
        }
    };

    // Auto-Batch Logic
    useEffect(() => {
        if (formData.machineNo && formData.planDate && formData.shift) {
            const dateParts = formData.planDate.split('-'); 
            const formattedDate = `${dateParts[2]}${dateParts[1]}${dateParts[0].slice(-2)}`;
            const shiftDigit = formData.shift === "1ST SHIFT" ? "1" : "2";
            setFormData(prev => ({ ...prev, batchNo: `${formData.machineNo}/${formattedDate}/${shiftDigit}` }));
        }
    }, [formData.machineNo, formData.planDate, formData.shift]);

    // Capacity Logic
    useEffect(() => {
        const totalPlanned = tableList.reduce((sum, item) => sum + Number(item.planQty || 0), 0);
        setFormData(prev => ({
            ...prev,
            balMachineCap: prev.mcCapacity - totalPlanned
        }));
    }, [tableList, formData.mcCapacity]);

    const handleAddResult = () => {
        if (!formData.planQty || !formData.opName) return toast.warning("Please fill mandatory fields");
        setTableList([...tableList, { ...formData }]);
        setFormData(prev => ({ ...prev, opName: '', planQty: '', shift: '', batchNo: '', planDate: '' }));
    };

    const handleSubmit = async () => {
        if (tableList.length === 0) return toast.error("Add at least one result");
        try {
            const payload = { ...formData, PQM_TodaysFinPlanTbl: tableList };
            if (formData.custFinProdId > 0) {
                await axios.put(`${API_ENDPOINTS.UpdatePlan}/${formData.custFinProdId}`, payload);
                toast.success("Plan Updated Successfully!");
            } else {
                await axios.post(API_ENDPOINTS.SavePlan, payload);
                toast.success("Plan Saved Successfully!");
            }
            if (onSuccess) onSuccess();
        } catch (err) { toast.error("Error saving data"); }
    };

    return (
        <div className="container p-2 shadow-sm bg-white border rounded">
            <ToastContainer />
            
            {/* Header Section */}
            <div className='row mb-2'>
                <div className="col"><label className="label-color">Plan Date *</label><input type="date" className="input-field-style" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></div>
                <div className="col"><label className="label-color">Location *</label><select className="select-field-style" value={formData.location} onChange={handleLocationChange}><option value="">Select Location</option>{locations.map((loc, i) => <option key={i} value={loc}>{loc}</option>)}</select></div>
                <div className="col"><label className="label-color">Machine Name *</label><select className="select-field-style" value={formData.machineName} onChange={handleMachineNameChange} disabled={!formData.location}><option value="">Select Machine</option>{machineNames.map((m, i) => <option key={i} value={m}>{m}</option>)}</select></div>
                <div className="col"><label className="label-color">Machine No *</label><select className="select-field-style" value={formData.machineNo} onChange={handleMachineNoChange} disabled={!formData.machineName}><option value="">Select No</option>{machineNumbers.map((n, i) => <option key={i} value={n}>{n}</option>)}</select></div>
                <div className="col"><label className="label-color">UOM</label><input type="text" className="input-field-style bg-light" value={formData.uom} readOnly /></div>
            </div>

            <div className='row mb-2'>
                <div className="col"><label className="label-color font-weight-bold text-primary">Item Name *</label><select className="select-field-style border-primary" value={formData.itemName} onChange={handleItemChange}><option value="">Select Item</option>{itemList.map((item, i) => <option key={i} value={item}>{item}</option>)}</select></div>
                <div className="col"><label className="label-color font-weight-bold text-primary">Grade *</label><select className="select-field-style border-primary" value={formData.grade} onChange={handleGradeChange} disabled={!formData.itemName}><option value="">Select Grade</option>{gradeList.map((g, i) => <option key={i} value={g}>{g}</option>)}</select></div>
                <div className="col"><label className="label-color font-weight-bold text-primary">SO Number *</label><select className="select-field-style border-primary" value={formData.soNumber} onChange={handleSOChange} disabled={!formData.grade}><option value="">Select SO</option>{soNumbers.map((so, i) => <option key={i} value={so}>{so}</option>)}</select></div>
                <div className="col"><label className="label-color">Item Code</label><input type="text" className="input-field-style bg-light" value={formData.itemCode} readOnly /></div>
                <div className="col"><label className="label-color">SO Date</label><input type="text" className="input-field-style bg-light" value={formData.soDate} readOnly /></div>
            </div>

            <div className='row mb-3'>
                <div className="col"><label className="label-color">Buyer Name</label><input type="text" className="input-field-style bg-light" value={formData.buyerName} readOnly /></div>
                <div className="col"><label className="label-color">Prod Plan Qty(SO)</label><input type="text" className="input-field-style bg-light" value={formData.soQty} readOnly /></div>
                <div className="col"><label className="label-color">M/C Capacity</label><input type="text" className="input-field-style bg-light" value={formData.mcCapacity} readOnly /></div>
                <div className="col"><label className="label-color font-weight-bold">Bal Prod Qty</label><input type="text" className="input-field-style bg-light text-danger" value={formData.balProdQty} readOnly /></div>
                <div className="col"><label className="label-color font-weight-bold">Bal Machine Cap</label><input type="text" className="input-field-style bg-light" value={formData.balMachineCap} readOnly /></div>
            </div>

            {/* Daily Production Entry Section */}
            <div className="row g-2 align-items-end p-3 rounded bg-light border mb-3">
                <div className="col"><label className="label-color">Plan Date</label><input type="date" className="input-field-style" value={formData.planDate} onChange={e => setFormData({...formData, planDate: e.target.value})} /></div>
                <div className="col">
                    <label className="label-color">Shift</label>
                    <select className="select-field-style" value={formData.shift} onChange={e => setFormData({...formData, shift: e.target.value})}>
                        <option value="">Select</option><option value="1ST SHIFT">1ST SHIFT</option><option value="2ND SHIFT">2ND SHIFT</option>
                    </select>
                </div>
                <div className="col"><label className="label-color">Batch No</label><input type="text" className="input-field-style bg-light fw-bold" value={formData.batchNo} readOnly /></div>
                <div className="col"><label className="label-color">Op Name</label><input type="text" className="input-field-style" value={formData.opName} onChange={e => setFormData({...formData, opName: e.target.value.toUpperCase()})} /></div>
                <div className="col"><label className="label-color">Qty</label><input type="number" className="input-field-style" value={formData.planQty} onChange={e => setFormData({...formData, planQty: e.target.value})} /></div>
                <div className="col"><button className="add-btn" onClick={handleAddResult}>ADD</button></div>
            </div>

            <div className="mt-2">
                <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                        <tr><th>Plan Date</th><th>Shift</th><th>Batch No</th><th>Operator</th><th>Qty</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                        {tableList.map((item, index) => (
                            <tr key={index}>
                                <td>{item.planDate}</td><td>{item.shift}</td><td>{item.batchNo}</td><td>{item.opName}</td><td>{item.planQty}</td>
                                <td><button className="btn btn-sm btn-danger" onClick={() => setTableList(tableList.filter((_, i) => i !== index))}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="text-center mt-3">
                <button className="btn btn-primary btn-lg px-5 fw-bold" onClick={handleSubmit}>
                    {formData.custFinProdId > 0 ? "UPDATE " : "SUBMIT "}
                </button>
            </div>
        </div>
    );
};

export default CustomizedFinishPP;