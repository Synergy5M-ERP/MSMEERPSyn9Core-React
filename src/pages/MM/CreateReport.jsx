import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { FileText, Download, Eye, CheckSquare, Square, RefreshCcw, Search } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';
import { API_ENDPOINTS } from '../../config/apiconfig';
const DynamicReport = () => {
    const columns = [
        "DepartmentName", "EmpCode", "EmpName", "TypeOfRequision", "PlantLocation",
        "PlantNo", "PurchaseReqNo", "Date", "TotalValue", "ItemName", "ItemCode",
        "Grade", "UOM", "RequireQty"
    ];
    const [selected, setSelected] = useState([]);
    const [preview, setPreview] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAction = async (type) => {
        if (selected.length === 0) return toast.error("Please select at least one column!");
        setLoading(true);
        try {
            const isPrev = type === 'preview';
            const res = await axios.post(API_ENDPOINTS.ManualPRReport,
                { selectedColumns: selected, exportType: type },
                { responseType: isPrev ? 'json' : 'blob' }
            );

            if (isPrev) {
                setPreview(res.data.previewList || []);
                toast.success("Preview Loaded");
            } else {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.download = `Report_${new Date().getTime()}.${type === 'excel' ? 'xlsx' : 'pdf'}`;
                link.click();
            }
        } catch (e) { toast.error("Action failed"); }
        finally { setLoading(false); }
    };

    return (
        <div style={{ padding: '15px', background: '#f0f2f5', minHeight: '80vh' }}>
            <ToastContainer />
            <div style={{ maxWidth: '1200px', margin: '0 auto', background: '#fff', padding: '15px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              

                <div style={{
                    display: 'grid',
                    // This forces exactly 7 columns in every row
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '10px',
                    // marginBottom: '10px'
                }}>
                    {columns.filter(c => c.toLowerCase().includes(search.toLowerCase())).map(col => (
                        <div
                            key={col}
                            onClick={() => setSelected(s => s.includes(col) ? s.filter(x => x !== col) : [...s, col])}
                            style={{
                                padding: '10px 5px', // Reduced horizontal padding to fit 7 cols
                                border: '1px solid #e2e8f0',
                                cursor: 'pointer',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center', // Centering content for tight spaces
                                gap: '8px',
                                background: selected.includes(col) ? '#eff6ff' : '#fff',
                                transition: '0.2s',
                                textAlign: 'center'
                            }}
                        >
                            {selected.includes(col) ?
                                <CheckSquare size={16} color="#3b82f6" style={{ flexShrink: 0 }} /> :
                                <Square size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
                            }
                            <span style={{
                                fontSize: '11px', 
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {col}
                            </span>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '10px', display: 'flex', gap: '12px' }}>
                    <button onClick={() => handleAction('preview')} style={{ ...btnStyle, background: '#6366f1' }}><Eye size={18} /> Preview</button>
                    <button onClick={() => handleAction('excel')} style={{ ...btnStyle, background: '#10b981' }}><Download size={18} /> Excel</button>
                    <button onClick={() => handleAction('pdf')} style={{ ...btnStyle, background: '#ef4444' }}><Download size={18} /> PDF</button>
                    <button onClick={() => { setSelected([]); setPreview([]) }} style={{ ...btnStyle, background: '#94a3b8' }}><RefreshCcw size={18} /> Reset</button>
                </div>

                {preview.length > 0 && (
                    <div style={{ marginTop: '20px' }}>
                        {/* <h3 style={{ marginBottom: '15px' }}>Data Preview ({preview.length} Records)</h3> */}
                        <div style={{ maxHeight: '310px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '10px' }} className="custom-scroll">
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                                <thead style={{ position: 'sticky', top: 0, zIndex: 5, background: '#3b82f6', color: '#fff' }}>
                                    <tr>
                                        {selected.map(c => <th key={c} style={{ padding: '12px', textAlign: 'left', textTransform: 'uppercase', fontSize: '12px', borderBottom: '2px solid #2563eb' }}>{c}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {preview.map((row, i) => (
                                        <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                                            {selected.map(c => <td key={c} style={{ padding: '12px', borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>{row[c] || '-'}</td>)}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
     
        </div>
    );
};

const btnStyle = {
    color: '#fff', padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '14px'
};

export default DynamicReport;