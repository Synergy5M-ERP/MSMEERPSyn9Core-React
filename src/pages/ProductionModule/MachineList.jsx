import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/apiconfig';
import { toast, ToastContainer } from 'react-toastify';
import { Edit3, Trash2, ChevronLeft, ChevronRight, Search, Download, FileText, AlertTriangle, RefreshCw } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const MachineList = ({ onEdit }) => {
    const [machines, setMachines] = useState([]);
    const [filteredMachines, setFilteredMachines] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, targetId: null, targetName: '' });

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        const results = machines.filter(m =>
            m.machine_Code_No?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.machine_Description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.location?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMachines(results);
        setCurrentPage(1);
    }, [searchTerm, machines]);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_ENDPOINTS.GetAllMachines);
            const data = res.data.$values || res.data || [];
            setMachines(data);
            setFilteredMachines(data);
        } catch (err) {
            toast.error("Error loading machines");
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`${API_ENDPOINTS.DeleteMachine}/${deleteModal.targetId}`);
            toast.success(`Machine "${deleteModal.targetName}" deleted successfully!`);
            setDeleteModal({ isOpen: false, targetId: null, targetName: '' });
            loadData();
        } catch (err) {
            toast.error("Delete failed. This machine might be in use elsewhere.");
        }
    };

    const exportPDF = () => {
        const doc = new jsPDF('l', 'mm', 'a4');
        doc.setFillColor(0, 102, 204);
        doc.rect(0, 0, 297, 20, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.text("MACHINE INVENTORY REPORT", 14, 13);

        const tableColumn = ["Code", "Description", "Location", "Model", "Mfg Date", "Comm Date", "Capacity"];
        const tableRows = filteredMachines.map(m => [
            m.machine_Code_No,
            m.machine_Description,
            m.location,
            m.model_Name,
            m.year_of_Manufacturing?.split('T')[0],
            m.year_of_Commissionring?.split('T')[0],
            m.machine_Name_Plate_Capacity
        ]);

        autoTable(doc, {
            startY: 30,
            head: [tableColumn],
            body: tableRows,
            theme: 'striped',
            headStyles: { fillColor: [0, 102, 204] }
        });

        doc.save(`Machine_Report_${new Date().getTime()}.pdf`);
        toast.info("PDF Report Generated");
    };

    const exportExcel = () => {
        const headers = "Code,Description,Location,Model,Mfg Date,Capacity\n";
        const csvContent = filteredMachines.map(m => 
            `${m.machine_Code_No},${m.machine_Description},${m.location},${m.model_Name},${m.year_of_Manufacturing?.split('T')[0]},${m.machine_Name_Plate_Capacity}`
        ).join("\n");
        const blob = new Blob([headers + csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "Machine_Inventory.csv";
        a.click();
        toast.success("Excel Exported");
    };

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredMachines.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredMachines.length / recordsPerPage);

    const tableContainerStyle = {
        maxHeight: machines.length > 10 ? '500px' : 'auto',
        overflowY: machines.length > 10 ? 'auto' : 'visible',
        border: '1px solid #e2e8f0',
        borderRadius: '8px'
    };

    // --- Pagination Logic Helpers ---
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div style={{ background: '#fff', borderRadius: '12px' }}>
            <ToastContainer autoClose={2000} />

            {deleteModal.isOpen && (
                <div style={overlayStyle}>
                    <div style={modalStyle}>
                        <div style={{ color: '#dc2626', marginBottom: '15px' }}><AlertTriangle size={48} style={{margin:'0 auto'}} /></div>
                        <h3>Are you sure?</h3>
                        <p style={{fontSize:'14px', color:'#64748b'}}>Do you really want to delete <b>{deleteModal.targetName}</b>?</p>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button onClick={() => setDeleteModal({ isOpen: false })} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer' }}>Cancel</button>
                            <button onClick={confirmDelete} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', background: '#dc2626', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={16} />
                    <input 
                        type="text" 
                        placeholder="Search machine..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        style={{ width: '100%', padding: '8px 8px 8px 35px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }} 
                    />
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#64748b' }}>Count: <b>{filteredMachines.length}</b></span>
                    <button onClick={exportExcel} style={{ background: '#059669', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}><Download size={14}/> </button>
                    <button onClick={exportPDF} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}><FileText size={14}/> </button>
                    <select value={recordsPerPage} onChange={(e) => setRecordsPerPage(Number(e.target.value))} style={{ padding: '7px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        {[5, 10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                </div>
            </div>

            <div style={tableContainerStyle}>
                <table className="table table-bordered table-hover" style={{ marginBottom: 0 }}>
                    <thead style={{ backgroundColor: '#f8f9fa', position: 'sticky', top: 0, zIndex: 1 }}>
                        <tr>
                            <th>Code</th>
                            <th>Machine Name</th>
                            <th>ModelName</th>
                            {/* <th><span className='text-primary'>UOM</span> <br/> */}
                            
                            {/* </th> */}
                            {/* <th>Machine Name Plate Capacity <br/>
                            <span className='text-primary'>Machine MFG Contact Detail</span></th> */}
                            {/* <th>Cost Of Machine</th> */}
                            {/* <th>Location</th> */}
                            <th>manufacturing Date</th>
                            {/* <th>Company Name/Location</th> */}
                            <th> Model Number<br/></th>
                            <th>Working Day Per Year</th>
                            <th>Annual Capacity</th>
                            <th style={{ textAlign: 'center' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody style={{ fontSize: '13px' }}>
                        {currentRecords.map((m) => (
                            <tr key={m.id}>
                                <td className='text-secondary' >{m.machine_Code_No}</td>
                                <td className='text-secondary'>{m.machine_Description}<br/></td>
                                <td className='text-secondary'>{m.model_Name}</td>
                                {/* <td>{m.unit_of_Measurement}</td> */}
                                {/* <td>
                              
                                {m.machine_Name_Plate_Capacity}
                                <br/>
                              <span className='text-primary'>  {m.machine_Mfg_Contact_Details}</span>
                                </td> */}
                                {/* <th>{m.cost_of_Machine}</th> */}
                                {/* <td>{m.location}</td> */}
                                <td className='text-secondary'>
                                    <div>{m.year_of_Manufacturing?.split('T')[0]}</div>
                                    {/* <div>Comm:{m.year_of_Commissionring?.split('T')[0]}</div> */}
                                </td>
                                {/* <td>{m.company_Name}<br/><span className='text-primary'>{m.location}</span></td> */}
                                <td className='text-secondary'>
                                    {m.model_Number}<br/>
                                 
                                </td>
                                <td className='text-secondary'>  {m.workingDaysPerYear}</td>
                                <td className='text-secondary'>{m.annualCapacity}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                        <button onClick={() => onEdit(m)} style={{ background: '#dbeafe', color: '#1e40af', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}><Edit3 size={14} /></button>
                                        <button onClick={() => setDeleteModal({ isOpen: true, targetId: m.id, targetName: m.machine_Description })} style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- UPDATED NUMBERED PAGINATION --- */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', gap: '5px' }}>
                <button 
                    disabled={currentPage === 1} 
                    onClick={() => paginate(currentPage - 1)} 
                    style={{...pageBtnStyle, opacity: currentPage === 1 ? 0.5 : 1}}
                >
                    <ChevronLeft size={16}/>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                        key={number}
                        onClick={() => paginate(number)}
                        style={{
                            ...pageBtnStyle,
                            background: currentPage === number ? '#0066cc' : '#fff',
                            color: currentPage === number ? '#fff' : '#333',
                            borderColor: currentPage === number ? '#0066cc' : '#cbd5e1',
                            fontWeight: currentPage === number ? 'bold' : 'normal',
                            minWidth: '35px'
                        }}
                    >
                        {number}
                    </button>
                ))}

                <button 
                    disabled={currentPage === totalPages} 
                    onClick={() => paginate(currentPage + 1)} 
                    style={{...pageBtnStyle, opacity: currentPage === totalPages ? 0.5 : 1}}
                >
                    <ChevronRight size={16}/>
                </button>
            </div>
        </div>
    );
};

const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(3px)' };
const modalStyle = { backgroundColor: '#fff', padding: '30px', borderRadius: '12px', width: '350px', textAlign: 'center' };
const pageBtnStyle = { 
    padding: '8px', 
    borderRadius: '4px', 
    border: '1px solid #cbd5e1', 
    background: '#fff', 
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s'
};

export default MachineList;