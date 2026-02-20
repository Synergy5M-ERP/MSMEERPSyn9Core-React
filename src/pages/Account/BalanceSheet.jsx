

// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import { API_ENDPOINTS } from "../../config/apiconfig";
// import 'bootstrap/dist/css/bootstrap.min.css';

// const BalanceSheet = () => {
//     const [reportData, setReportData] = useState({ 
//         assets: [], 
//         liabilities: [], 
//         totalAssets: 0, 
//         totalLiabilities: 0 
//     });
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const reportRef = useRef();

//   const [currentDateTime, setCurrentDateTime] = useState(new Date());

//   useEffect(() => {
//     const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);
//     useEffect(() => {
//         fetchData();
//     }, []);

//     const fetchData = async () => {
//         setLoading(true);
//         try {
//             // 1. Fetch Groups and Ledgers
//             const [groupsRes, ledgersRes] = await Promise.all([
//                 axios.get(API_ENDPOINTS.Group),
//                 axios.get(API_ENDPOINTS.Ledger)
//             ]);

//             console.log("📥 Raw Ledgers from Log:", ledgersRes.data);
//             console.log("📥 Raw Groups from API:", groupsRes.data);

//             // 2. Transform the data using your specific backend keys
//             const transformed = transformToTree(groupsRes.data, ledgersRes.data);
            
//             console.log("🌳 Transformed Tree:", transformed);
//             setReportData(transformed);
//             setLoading(false);
//         } catch (err) {
//             console.error("❌ API Error:", err);
//             setError("Failed to load balance sheet data. Please check backend connectivity.");
//             setLoading(false);
//         }
//     };

//     const transformToTree = (groups, ledgers) => {
//         const groupMap = groups.map(g => {
//             // Match ledgers using 'accountGroupId' from your log
//             const groupLedgers = ledgers.filter(l => l.accountGroupId === g.id);
            
//             // Calculate total using 'closingBal' from your log
//             const groupTotal = groupLedgers.reduce((sum, l) => sum + (parseFloat(l.closingBal) || 0), 0);
            
//             return {
//                 ...g,
//                 groupName: g.name || g.accountGroupName || "Unnamed Group",
//                 groupTotal: groupTotal,
//                 ledgers: groupLedgers
//             };
//         });

//         // Separation Logic: Check for nature/type. 
//         // If your backend doesn't have 'nature', we check group names as fallback.
//         const liabilities = groupMap.filter(g => 
//             g.nature === 'Liability' || g.type === 'Liability' || 
//             ['Capital Account', 'Current Liabilitie', 'Fixed Liabilities'].includes(g.groupName)
//         );

//         const assets = groupMap.filter(g => 
//             g.nature === 'Asset' || g.type === 'Asset' || 
//             ['Fixed Assets', 'Current Assets', 'Investments', 'Bank Accounts'].includes(g.groupName)
//         );

//         return {
//             liabilities,
//             assets,
//             totalLiabilities: liabilities.reduce((sum, g) => sum + g.groupTotal, 0),
//             totalAssets: assets.reduce((sum, g) => sum + g.groupTotal, 0)
//         };
//     };

//     const formatINR = (val) => {
//         const number = parseFloat(val) || 0;
//         return new Intl.NumberFormat('en-IN', {
//             minimumFractionDigits: 2,
//             maximumFractionDigits: 2
//         }).format(Math.abs(number));
//     };

//     const downloadPDF = () => {
//         const element = reportRef.current;
//         html2canvas(element, { scale: 2 }).then((canvas) => {
//             const imgData = canvas.toDataURL('image/png');
//             const pdf = new jsPDF('p', 'mm', 'a4');
//             const imgWidth = 210;
//             const imgHeight = (canvas.height * imgWidth) / canvas.width;
//             pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
//             pdf.save(`BalanceSheet_Export.pdf`);
//         });
//     };

//     // Sub-component for each side of the T-Balance Sheet
//     const RenderSide = ({ title, groups, total }) => (
//         <div className="col-md-6 border-end border-dark p-0 d-flex flex-column">
//             <div className="bg-light border-bottom border-dark p-2 text-center fw-bold text-uppercase small">
//                 {title}
//             </div>
//             <div className="p-3 flex-grow-1" style={{ minHeight: '450px' }}>
//                 {groups.length === 0 && <p className="text-muted text-center small mt-4">No {title} found</p>}
//                 {groups.map((group) => (
//                     <div key={group.id} className="mb-3">
//                         <div className="d-flex justify-content-between border-bottom border-secondary mb-1 fw-bold small">
//                             <span>{group.groupName}</span>
//                             <span>{formatINR(group.groupTotal)}</span>
//                         </div>
//                         {group.ledgers.map((ledger) => (
//                             <div key={ledger.accountLedgerId} className="d-flex justify-content-between ps-3 text-muted fst-italic" style={{ fontSize: '0.85rem' }}>
//                                 <span>{ledger.accountLedgerName}</span>
//                                 <span>{formatINR(ledger.closingBal)}</span>
//                             </div>
//                         ))}
//                     </div>
//                 ))}
//             </div>
//             <div className="border-top border-dark border-2 bg-light p-2 d-flex justify-content-between fw-bold">
//                 <span>TOTAL {title}</span>
//                 <span style={{ borderBottom: '3px double black' }}>{formatINR(total)}</span>
//             </div>
//         </div>
//     );

//     if (loading) return (
//         <div className="d-flex justify-content-center align-items-center vh-100">
//             <div className="spinner-border text-primary" role="status"></div>
//             <span className="ms-3">Fetching Financial Data...</span>
//         </div>
//     );

//     return (
//         <div className="bg-light py-4 min-vh-100">
//             <div className="container" style={{ maxWidth: '1100px' }}>
                
//                 {/* Top Action Bar */}
//                 <div className="d-flex justify-content-between align-items-center mb-4 card p-2 shadow-sm flex-row">
//                     <h5 className="mb-0 ms-2">Financial Report</h5>
//                     <div>
//                         <button onClick={fetchData} className="btn btn-sm btn-outline-secondary me-2">Refresh</button>
//                         <button onClick={downloadPDF} className="btn btn-sm btn-primary">Download PDF</button>
//                     </div>
//                 </div>

//                 {error && <div className="alert alert-danger">{error}</div>}

//                 {/* Report Document */}
//                 <div ref={reportRef} className="bg-white shadow-lg mx-auto p-5" style={{ width: '1000px' }}>
//                     <div className="text-center mb-4">
//                         <h2 className="fw-bold text-uppercase mb-1">SWAMI SAMARTH SYNERGY</h2>
//                         <p className="text-muted small mb-0">Balance Sheet as on {currentDateTime.toLocaleString()}</p>
//                         <hr className="w-25 mx-auto border-dark border-2" />
//                     </div>

//                     <div className="row g-0 border border-dark border-2">
//                         <RenderSide 
//                             title="Liabilities" 
//                             groups={reportData.liabilities} 
//                             total={reportData.totalLiabilities} 
//                         />
//                         <RenderSide 
//                             title="Assets" 
//                             groups={reportData.assets} 
//                             total={reportData.totalAssets} 
//                         />
//                     </div>

//                     {/* Footer / Signatures */}
//                     <div className="row mt-5 pt-4 text-center small fw-bold">
//                         <div className="col-4"><div className="border-top border-dark pt-2 mx-3">Director / Partner</div></div>
//                         <div className="col-4"><div className="border-top border-dark pt-2 mx-3">Accountant</div></div>
//                         <div className="col-4"><div className="border-top border-dark pt-2 mx-3">Statutory Auditor</div></div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default BalanceSheet;

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { API_ENDPOINTS } from "../../config/apiconfig";
import 'bootstrap/dist/css/bootstrap.min.css';


const BalanceSheet = () => {
    const [reportData, setReportData] = useState({ 
        assets: [], liabilities: [], totalAssets: 0, totalLiabilities: 0 
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const reportRef = useRef();
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [groupsRes, ledgersRes] = await Promise.all([
                axios.get(API_ENDPOINTS.Group),
                axios.get(API_ENDPOINTS.Ledger)
            ]);
            const transformed = transformToTree(groupsRes.data, ledgersRes.data);
            setReportData(transformed);
            setLoading(false);
        } catch (err) {
            setError("Connectivity issue. Please check backend.");
            setLoading(false);
        }
    };

    const transformToTree = (groups, ledgers) => {
        const groupMap = groups.map(g => {
            const groupLedgers = ledgers.filter(l => l.accountGroupId === g.id);
            const groupTotal = groupLedgers.reduce((sum, l) => sum + (parseFloat(l.closingBal) || 0), 0);
            return {
                ...g,
                groupName: g.name || g.accountGroupName || "Unnamed Group",
                groupTotal: groupTotal,
                ledgers: groupLedgers
            };
        });

        const liabilities = groupMap.filter(g => 
            g.nature === 'Liability' || g.type === 'Liability' || 
            ['Capital Account', 'Current Liabilitie', 'Fixed Liabilities'].includes(g.groupName)
        );

        const assets = groupMap.filter(g => 
            g.nature === 'Asset' || g.type === 'Asset' || 
            ['Fixed Assets', 'Current Assets', 'Investments', 'Bank Accounts'].includes(g.groupName)
        );

        return {
            liabilities,
            assets,
            totalLiabilities: liabilities.reduce((sum, g) => sum + g.groupTotal, 0),
            totalAssets: assets.reduce((sum, g) => sum + g.groupTotal, 0)
        };
    };

    const formatINR = (val) => new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2, maximumFractionDigits: 2
    }).format(Math.abs(val || 0));

    const downloadPDF = () => {
        const element = reportRef.current;
        html2canvas(element, { scale: 2, useCORS: true }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const width = pdf.internal.pageSize.getWidth();
            const height = (canvas.height * width) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, width, height);
            pdf.save(`BalanceSheet_${currentDateTime.toLocaleDateString()}.pdf`);
        });
    };

    const RenderSide = ({ title, groups, total }) => (
        <div className="col-lg-6 col-md-12 border-side p-0 d-flex flex-column">
            <div className="side-header">{title}</div>
            <div className="side-content p-3 flex-grow-1">
                {groups.length === 0 && <p className="text-muted text-center small mt-4">No data found</p>}
                {groups.map((group) => (
                    <div key={group.id} className="group-wrapper mb-3">
                        <div className="group-title-row">
                            <span className="group-label">{group.groupName}</span>
                            <span className="group-amount">{formatINR(group.groupTotal)}</span>
                        </div>
                        {group.ledgers.map((ledger) => (
                            <div key={ledger.accountLedgerId} className="ledger-row">
                                <span>{ledger.accountLedgerName}</span>
                                <span>{formatINR(ledger.closingBal)}</span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="side-footer">
                <span>TOTAL {title}</span>
                <span className="double-underline">{formatINR(total)}</span>
            </div>
        </div>
    );

    if (loading) return (
        <div className="loader-container">
            <div className="spinner-grow text-primary" role="status"></div>
            <h5 className="mt-3 text-secondary">Preparing Financial Statements...</h5>
        </div>
    );

    return (
        <div className="app-bg py-4">
            <div className="container-fluid container-lg">
                
                {/* Modern Action Bar */}
                <div className="action-bar shadow-sm mb-4 animate__animated animate__fadeIn">
                    <div className="d-flex justify-content-between align-items-center w-100 flex-wrap gap-3">
                        <div className="brand-section">
                            <h4 className="m-0 gradient-text">Balance Sheet Report</h4>
                            <small className="text-muted">{currentDateTime.toLocaleTimeString()}</small>
                        </div>
                        <div className="button-group">
                            <button onClick={fetchData} className="btn btn-light-custom me-2">
                                <i className="bi bi-arrow-clockwise"></i> Refresh
                            </button>
                            <button onClick={downloadPDF} className="btn btn-primary-custom">
                                <i className="bi bi-file-earmark-pdf"></i> Download PDF
                            </button>
                        </div>
                    </div>
                </div>

                {error && <div className="alert alert-custom animate__animated animate__shakeX">{error}</div>}

                {/* Main Document */}
                <div ref={reportRef} className="document-paper shadow-lg mx-auto animate__animated animate__fadeInUp">
                    <div className="document-header text-center">
                        <h1 className="company-name">SWAMI SAMARTH SYNERGY</h1>
                        <div className="report-meta">
                            <span className="badge bg-soft-primary mb-2">Internal Audit Report</span>
                            <p className="mb-0">Statement of Financial Position</p>
                            <p className="date-text">As on: <strong>{currentDateTime.toLocaleString()}</strong></p>
                        </div>
                        <div className="header-divider"></div>
                    </div>

                    <div className="row g-0 document-body border-outline">
                        <RenderSide title="Liabilities" groups={reportData.liabilities} total={reportData.totalLiabilities} />
                        <RenderSide title="Assets" groups={reportData.assets} total={reportData.totalAssets} />
                    </div>

                    <div className="document-signature row text-center mt-5">
                        <div className="col-4"><div className="sig-line">Director</div></div>
                        <div className="col-4"><div className="sig-line">Accountant</div></div>
                        <div className="col-4"><div className="sig-line">Auditor</div></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BalanceSheet;