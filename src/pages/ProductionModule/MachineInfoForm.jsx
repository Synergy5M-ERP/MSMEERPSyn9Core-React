

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/apiconfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../App.css'
const MachineInfoForm = ({ editData, onClearEdit }) => {
    const [uomOptions, setUomOptions] = useState([]);
    const [vendorList, setVendorList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const initialFormState = {
        id: '',
        companyName: '', location: '', machineName: '',
        modelName: '', modelNumber: '', machineMfgName: '',
        mfgDate: '', commissionDate: '', uom: '',
        commissionPlace: '', mnpCapacity: '', workingDays: '',
        annualCapacity: '', mfgContactDetails: '',
        contact_person: '', contact_Number: '', email: '', address: '',
        cost: '', serviceManual: 'NO', serviceCopyType: '',
        sparePartList: 'NO', spareCopyType: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    // 1. Load Initial Data (UOM and Vendors)
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [uomRes, vendorRes] = await Promise.all([
                    axios.get(API_ENDPOINTS.GetUOM),
                    axios.get(API_ENDPOINTS.Vendors)
                ]);

                const uomData = uomRes.data?.data || uomRes.data?.$values || (Array.isArray(uomRes.data) ? uomRes.data : []);
                const vendorData = vendorRes.data?.data || vendorRes.data?.$values || (Array.isArray(vendorRes.data) ? vendorRes.data : []);

                setUomOptions(uomData);
                setVendorList(vendorData);
            } catch (error) {
                toast.error("Failed to load initial data from server");
            }
        };
        loadInitialData();
    }, []);

    // 2. Calculation Logic for Annual Capacity
    useEffect(() => {
        const capacity = parseFloat(formData.mnpCapacity) || 0;
        const days = parseFloat(formData.workingDays) || 0;
        setFormData(prev => ({
            ...prev,
            annualCapacity: (capacity * days).toFixed(2)
        }));
    }, [formData.mnpCapacity, formData.workingDays]);

    // 3. Handle Edit Data Population
    useEffect(() => {
        if (editData) {
            setFormData({
                id: editData.id,
                companyName: editData.company_Name || '',
                location: editData.location || '',
                machineName: editData.machine_Description || '',
                modelName: editData.model_Name || '',
                modelNumber: editData.model_Number || '',
                machineMfgName: editData.machine_Manufacturing_Name || '',
                mfgDate: editData.year_of_Manufacturing?.split('T')[0] || '',
                commissionDate: editData.year_of_Commissionring?.split('T')[0] || '',
                uom: editData.unit_of_Measurement || '',
                commissionPlace: editData.place_of_Commissionring || '',
                mnpCapacity: editData.machine_Name_Plate_Capacity || '',
                workingDays: editData.workingDaysPerYear || '',
                annualCapacity: editData.annualCapacity || '',
                mfgContactDetails: editData.machine_Mfg_Contact_Details || '',
                contact_person: editData.contact_Person || '',
                contact_Number: editData.contact_Number || '',
                email: editData.email || '',
                address: editData.address || '',
                cost: editData.cost_of_Machine || '',
                serviceManual: editData.service_Manual?.includes("YES") ? "YES" : "NO",
                serviceCopyType: editData.service_Manual?.split('-')[1] || '',
                sparePartList: editData.spare_Part_List?.includes("YES") ? "YES" : "NO",
                spareCopyType: editData.spare_Part_List?.split('-')[1] || '',
            });
        } else {
            setFormData(initialFormState);
        }
    }, [editData]);

    const handleVendorChange = (e) => {
        const selectedId = e.target.value;
        const vendor = vendorList.find(v => v.vendorId?.toString() === selectedId);

        if (vendor) {
            setFormData(prev => ({
                ...prev,
                mfgContactDetails: selectedId,
                contact_person: vendor.contact_person || 'N/A',
                contact_Number: vendor.contact_Number || 'N/A',
                email: vendor.email || 'N/A',
                address: vendor.address || 'N/A'
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                mfgContactDetails: '',
                contact_person: '', contact_Number: '', email: '', address: ''
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const confirmCancel = () => {
        setFormData(initialFormState);
        setIsModalOpen(false);
        if (editData) onClearEdit();
        toast.warn("Form reset successfully");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.id) {
                await axios.put(`${API_ENDPOINTS.UpdateMachine}/${formData.id}`, formData);
                toast.success('Machine Information Updated Successfully!');
            } else {
                await axios.post(API_ENDPOINTS.SaveMachine, formData);
                toast.success('Machine Information Saved Successfully!');
            }
            onClearEdit(); // Clears edit state in parent and switches back/resets
        } catch (err) {
            toast.error('Error saving data to server');
        }
    };

    // --- Styling Objects (from your commented code) ---

    // const inputStyle = { width: '100%', border: '1px solid', borderRadius: '6px', fontSize: '16px', outlineColor: '#0066cc', boxSizing: 'border-box' };
    const disabledStyle = { backgroundColor: '#edeff1', cursor: 'not-allowed', color: '#9ca4af', border: '1px solid #e2e8f0' };
    const btnSubmit = { backgroundColor: '#059669', color: 'white', padding: '10px 30px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' };
    const btnCancel = { backgroundColor: '#dc2626', color: 'white', padding: '10px 30px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', marginRight: '11px' };
    const modalOverlay = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
    const modalContent = { backgroundColor: '#fff', padding: '25px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '350px' };

    return (
        <div style={{ maxWidth: '1200px', margin: '5px auto', padding: '15px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', fontFamily: '"Inter", sans-serif' }}>
            <ToastContainer position="top-right" autoClose={3000} />

            {isModalOpen && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <h4 style={{ color: '#dc2626', marginBottom: '15px' }}>Confirmation</h4>
                        <p style={{ marginBottom: '20px', fontSize: '14px' }}>Are you sure you want to clear all form data?</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                            <button onClick={confirmCancel} style={{ ...btnSubmit, backgroundColor: '#dc2626' }}>Yes, Reset</button>
                            <button onClick={() => setIsModalOpen(false)} style={{ ...btnCancel, backgroundColor: '#64748b', marginRight: 0 }}>No, Keep</button>
                        </div>
                    </div>
                </div>
            )}

            {/* <h4 style={{ color: "#0066cc", fontWeight: "600", marginBottom: "10px" }}>
                {formData.id ? 'Edit Machine Information' : 'Add Machine Information'}
            </h4> */}

            <form onSubmit={handleSubmit}>
                <div className='row'>
                    <div className='col'>
                        <label className='label-color' >Company Name <span style={{ color: 'red' }}>*</span></label>
                        <input className='input-field-style border ' name="companyName" value={formData.companyName} onChange={handleChange} required />
                    </div>
                    <div className='col'>
                        <label className='label-color' >Location <span style={{ color: 'red' }}>*</span></label>
                        <input className='input-field-style border' name="location" value={formData.location} onChange={handleChange} required />
                    </div>
                    <div className='col'>
                        <label className='label-color' >Machine Name <span style={{ color: 'red' }}>*</span></label>
                        <input className='input-field-style border' name="machineName" value={formData.machineName} onChange={handleChange} required />
                    </div>
                    <div className='col'>
                        <label className='label-color' >Model Name <span style={{ color: 'red' }}>*</span></label>
                        <input className='input-field-style border' name="modelName" value={formData.modelName} onChange={handleChange} required />
                    </div>
                    <div className="col">
                        <label className='label-color' >Model Number <span style={{ color: 'red' }}>*</span></label>
                        <input className='input-field-style border' name="modelNumber" value={formData.modelNumber} onChange={handleChange} required />
                    </div>

                </div>
                <div className='row'>
                    <div className="col">
                        <label className='label-color' >Machine Mfg Name <span style={{ color: 'red' }}>*</span></label>
                        <input className='input-field-style border' name="machineMfgName" value={formData.machineMfgName} onChange={handleChange} required />
                    </div>
                    <div className="col">
                        <label className='label-color' >Year of Mfg <span style={{ color: 'red' }}>*</span></label>
                        <input className='input-field-style border' type="date" name="mfgDate" value={formData.mfgDate} onChange={handleChange} required />
                    </div>
                    <div className="col">
                        <label className='label-color' >Year of Commission <span style={{ color: 'red' }}>*</span></label>
                        <input className='input-field-style border' type="date" name="commissionDate" value={formData.commissionDate} onChange={handleChange} required />
                    </div>
                    <div className="col">
                        <label className='label-color' >Unit of Measurement <span style={{ color: 'red' }}>*</span></label>
                        <select className='select-field-style border' name="uom" value={formData.uom} onChange={handleChange} required>
                            <option value="">Select UOM</option>
                            {uomOptions.map((opt, index) => (
                                <option key={index} value={opt.unit_Of_Measurement}>{opt.unit_Of_Measurement}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col">
                        <label className='label-color' >Place of Commission <span style={{ color: 'red' }}>*</span></label>
                        <input className='input-field-style border' name="commissionPlace" value={formData.commissionPlace} onChange={handleChange} required />
                    </div>
                </div>
                <div className='row'>
                    <div className="col">
                        <label className='label-color' >MNP Capacity/24h <span style={{ color: 'red' }}>*</span></label>
                        <input className='input-field-style border' type="number" name="mnpCapacity" value={formData.mnpCapacity} onChange={handleChange} required />
                    </div>
                    <div className="col">
                        <label className='label-color' >Working Days/Year </label>
                        <input className='input-field-style border' type="number" name="workingDays" value={formData.workingDays} onChange={handleChange} required />
                    </div>
                    <div className="col">
                        <label className='label-color ' >Annual Capacity</label>
                        <input className='input-field-style border border ' value={formData.annualCapacity} style={disabledStyle} readOnly />
                    </div>
                    <div className="col-4" >
                        <label className='label-color ' >Machine Mfg Contact Details <span style={{ color: 'red' }}>*</span></label>
                        <select className='select-field-style border' name="mfgContactDetails" value={formData.mfgContactDetails} onChange={handleVendorChange} required>
                            <option value="">Select Contact Details</option>
                            {vendorList.map((v) => (
                                <option key={v.vendorId} value={v.vendorId}>{v.companyName}</option>
                            ))}
                        </select>
                    </div>

                </div>
                <div className='row'>
                    <div className="col">
                        <label className='label-color' >Name of Person</label>
                        <input className='input-field-style border' value={formData.contact_person} style={disabledStyle} readOnly />
                    </div>
                    <div className="col">
                        <label className='label-color' >Contact No</label>
                        <input className='input-field-style border' value={formData.contact_Number} style={disabledStyle} readOnly />
                    </div>
                    <div className="col">
                        <label className='label-color' >Email Address</label>
                        <input className='input-field-style border' value={formData.email} style={disabledStyle} readOnly />
                    </div>
                    <div className="col-4">
                        <label className='label-color'  >Address</label>
                        <input className='input-field-style border' value={formData.address} style={disabledStyle} readOnly />
                    </div>


                </div>
                <div className='row'>


                    <div className="col">
                        <label className='label-color' >Cost (Rs/Lacs) <span style={{ color: 'red' }}>*</span></label>
                        <input className='input-field-style border' type="number" name="cost" value={formData.cost} onChange={handleChange} required />
                    </div>
                    <div className="col">
                        <label className='label-color' >Service Manual <span style={{ color: 'red' }}>*</span></label>
                        <select className='select-field-style border' name="serviceManual" value={formData.serviceManual} onChange={handleChange}>
                            <option value="NO">NO</option>
                            <option value="YES">YES</option>
                        </select>
                    </div>

                    <div className="col">
                        <label className='label-color' >Spare Part List <span style={{ color: 'red' }}>*</span></label>
                        <select className='select-field-style border' name="sparePartList" value={formData.sparePartList} onChange={handleChange}>
                            <option value="NO">NO</option>
                            <option value="YES">YES</option>
                        </select>
                    </div>
                    {formData.sparePartList === 'YES' && (
                        <div>
                            <label className='label-color' >Spare Part Copy</label>
                            <select className='form-select border' name="spareCopyType" value={formData.spareCopyType} onChange={handleChange}>
                                <option value="">SELECT</option>
                                <option value="HARDCOPY">HARDCOPY</option>
                                <option value="SOFTCOPY">SOFTCOPY</option>
                                <option value="BOTH">BOTH</option>
                            </select>
                        </div>
                    )}
                    {formData.serviceManual === 'YES' && (
                        <div className="col">
                            <label className='label-color' >Service Manual Copy</label>
                            <select className='form-select border' name="serviceCopyType" value={formData.serviceCopyType} onChange={handleChange}>
                                <option value="">SELECT</option>
                                <option value="HARDCOPY">HARDCOPY</option>
                                <option value="SOFTCOPY">SOFTCOPY</option>
                                <option value="BOTH">BOTH</option>
                            </select>
                        </div>
                    )}
                </div>

              <div className="d-flex gap-2"  style={{  marginTop: '25px', borderTop: '2px solid #f1f5f9', paddingTop: '15px' }}>
                    <button className='save-btn' type="submit" style={btnSubmit}>
                        {formData.id ? 'UPDATE' : 'SUBMIT'}
                    </button>
                    <button className='cancel-btn' type="button" onClick={() => setIsModalOpen(true)} style={btnCancel}>CANCEL</button>

                </div>
            </form>
        </div>
    );
};

export default MachineInfoForm;