// import React, { useState, useEffect, useRef } from 'react';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import 'bootstrap/dist/css/bootstrap.min.css';

// // 1. Move STATIC_DATA outside the component or ensure it's defined before use
// const STATIC_DATA = {
//     companyName: "SWAMI SAMARTH SYNERGY",
//     reportStartDate: "2023-04-01",
//     reportEndDate: "2024-03-31",
//     totalAssets: 2157606.48,
//     totalLiabilities: 2157606.48,
//     netBalance: 0,
//     assets: [
//         {
//             accountGroupId: 1, accountGroupName: "Fixed Assets", groupCode: "FA", groupTotal: 181409.2,
//             accounts: [
//                 { accountId: 1, accountName: "Computer & Printers", debitAmount: 73974.59, creditAmount: 0, netBalance: 73974.59 },
//                 { accountId: 2, accountName: "Furniture & Fixture", debitAmount: 107434.61, creditAmount: 0, netBalance: 107434.61 }
//             ]
//         },
//         {
//             accountGroupId: 2, accountGroupName: "Investments", groupCode: "INV", groupTotal: 100000,
//             accounts: [{ accountId: 3, accountName: "FD", debitAmount: 100000, creditAmount: 0, netBalance: 100000 }]
//         },
//         {
//             accountGroupId: 3, accountGroupName: "Current Assets", groupCode: "CA", groupTotal: 1876197.28,
//             accounts: [
//                 { accountId: 4, accountName: "Deposits (Asset)", debitAmount: 40000, creditAmount: 0, netBalance: 40000 },
//                 { accountId: 5, accountName: "Sundry Debtors", debitAmount: 233571.52, creditAmount: 0, netBalance: 233571.52 },
//                 { accountId: 6, accountName: "Bank Accounts", debitAmount: 1522813.16, creditAmount: 0, netBalance: 1522813.16 },
//                 { accountId: 8, accountName: "TDS Receivable", debitAmount: 60899.6, creditAmount: 0, netBalance: 60899.6 }
//             ]
//         }
//     ],
//     liabilities: [
//         {
//             accountGroupId: 4, accountGroupName: "Capital Account", groupCode: "CAP", groupTotal: 782174.79,
//             accounts: [{ accountId: 9, accountName: "Capital Account", debitAmount: 0, creditAmount: 782174.79, netBalance: -782174.79 }]
//         },
//         {
//             accountGroupId: 7, accountGroupName: "Current Liabilities", groupCode: "CL", groupTotal: 897580.18,
//             accounts: [
//                 { accountId: 12, accountName: "Duties & Taxes", debitAmount: 0, creditAmount: 80880, netBalance: -80880 },
//                 { accountId: 13, accountName: "Provisions", debitAmount: 0, creditAmount: 744343.87, netBalance: -744343.87 },
//                 { accountId: 14, accountName: "Sundry Creditors", debitAmount: 0, creditAmount: 2186.31, netBalance: -2186.31 }
//             ]
//         },
//         {
//             accountGroupId: 8, accountGroupName: "Profit & Loss A/c", groupCode: "PL", groupTotal: 253731.81,
//             accounts: [{ accountId: 16, accountName: "P&L (Current Period)", debitAmount: 0, creditAmount: 253731.81, netBalance: -253731.81 }]
//         }
//     ]
// };

// const BalanceSheet = () => {
//     const [useApiData, setUseApiData] = useState(false);
//     const [companyId, setCompanyId] = useState('');
//     const [companies, setCompanies] = useState([]);
//     const [startDate, setStartDate] = useState('2023-04-01');
//     const [endDate, setEndDate] = useState('2024-03-31');
//     const [balanceSheetData, setBalanceSheetData] = useState(STATIC_DATA);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const reportRef = useRef();

//     const API_BASE_URL = 'https://localhost:7145/api';

//     // Functions
//     const loadStaticData = () => {
//         setBalanceSheetData(STATIC_DATA);
//         setError(null);
//     };

//     const fetchBalanceSheet = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await fetch(`${API_BASE_URL}/BalanceSheet/generate`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ companyId: companyId ? parseInt(companyId) : null, startDate, endDate })
//             });
//             if (!response.ok) throw new Error('Failed to fetch from API');
//             const result = await response.json();
//             setBalanceSheetData(result);
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const downloadPDF = () => {
//         const element = reportRef.current;
//         html2canvas(element, { scale: 2 }).then((canvas) => {
//             const imgData = canvas.toDataURL('image/png');
//             const pdf = new jsPDF('p', 'mm', 'a4');
//             pdf.addImage(imgData, 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
//             pdf.save(`BalanceSheet_${endDate}.pdf`);
//         });
//     };

//     const formatCurrency = (val) => new Intl.NumberFormat('en-IN').format(Math.abs(val));

//     // Sub-component for rendering a ledger side
//     const RenderSide = ({ title, groups, total }) => (
//         <div className="col-md-6 border-end border-dark p-0 d-flex flex-column">
//             <div className="bg-light border-bottom border-dark p-2 text-center fw-bold text-uppercase small">
//                 {title}
//             </div>
//             <div className="p-3 flex-grow-1">
//                 {groups.map((group) => (
//                     <div key={group.accountGroupId} className="mb-3">
//                         <div className="d-flex justify-content-between border-bottom border-secondary mb-1 fw-bold small">
//                             <span>{group.accountGroupName}</span>
//                             <span>{formatCurrency(group.groupTotal)}</span>
//                         </div>
//                         {group.accounts.map((acc) => (
//                             <div key={acc.accountId} className="d-flex justify-content-between ps-3 x-small text-muted fst-italic" style={{ fontSize: '0.85rem' }}>
//                                 <span>{acc.accountName}</span>
//                                 <span>{formatCurrency(acc.netBalance)}</span>
//                             </div>
//                         ))}
//                     </div>
//                 ))}
//             </div>
//             <div className="border-top border-dark border-2 bg-light p-2 d-flex justify-content-between fw-bold">
//                 <span>TOTAL {title}</span>
//                 <span style={{ borderBottom: '3px double black' }}>{formatCurrency(total)}</span>
//             </div>
//         </div>
//     );

//     return (
//         <div className="bg-light py-4 min-vh-100">
//             <div className="container" style={{ maxWidth: '1100px' }}>
//                 {/* Control Panel */}
//                 <div className="card shadow-sm border-0 mb-4 p-3">
//                     <div className="row g-3 align-items-end">
//                         <div className="col-md-3">
//                             <label className="small fw-bold mb-1">Source</label>
//                             <select className="form-select form-select-sm" onChange={(e) => setUseApiData(e.target.value === 'true')}>
//                                 <option value="false">Demo Mode</option>
//                                 <option value="true">Live API</option>
//                             </select>
//                         </div>
//                         <div className="col-md-3">
//                             <label className="small fw-bold mb-1">To Date</label>
//                             <input type="date" className="form-control form-control-sm" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
//                         </div>
//                         <div className="col-md-6 text-end">
//                             <button onClick={downloadPDF} className="btn btn-sm btn-outline-dark me-2">Download PDF</button>
//                             <button onClick={useApiData ? fetchBalanceSheet : loadStaticData} className="btn btn-sm btn-primary px-4">
//                                 {loading ? 'Processing...' : 'Generate Report'}
//                             </button>
//                         </div>
//                     </div>
//                     {error && <div className="text-danger small mt-2">Error: {error}</div>}
//                 </div>

//                 {/* Report Area */}
//                 <div ref={reportRef} className="bg-white shadow border mx-auto p-5" style={{ width: '1000px', minHeight: '1300px' }}>
//                     <div className="text-center mb-4">
//                         <h2 className="fw-bold text-uppercase mb-1">{balanceSheetData?.companyName}</h2>
//                         <p className="text-muted small mb-0">Balance Sheet as on {endDate}</p>
//                         <hr className="w-25 mx-auto border-dark" />
//                     </div>

//                     <div className="row g-0 border border-dark border-2">
//                         <RenderSide 
//                             title="Liabilities" 
//                             groups={balanceSheetData?.liabilities || []} 
//                             total={balanceSheetData?.totalLiabilities || 0} 
//                         />
//                         <RenderSide 
//                             title="Assets" 
//                             groups={balanceSheetData?.assets || []} 
//                             total={balanceSheetData?.totalAssets || 0} 
//                         />
//                     </div>

//                     {/* Footer Signatures */}
//                     <div className="row mt-5 pt-5 text-center small fw-bold">
//                         <div className="col-4 mt-5"><div className="border-top border-dark pt-2 mx-3">Director</div></div>
//                         <div className="col-4 mt-5"><div className="border-top border-dark pt-2 mx-3">Accountant</div></div>
//                         <div className="col-4 mt-5"><div className="border-top border-dark pt-2 mx-3">Auditor</div></div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default BalanceSheet;

import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'bootstrap/dist/css/bootstrap.min.css';

// --- STATIC DEMO DATA ---
const STATIC_DATA = {
    companyName: "SWAMI SAMARTH SYNERGY (DEMO)",
    reportEndDate: "2024-03-31",
    totalAssets: 2157606.48,
    totalLiabilities: 2157606.48,
    assets: [
        {
            accountGroupId: 1, accountGroupName: "Fixed Assets", groupTotal: 181409.2,
            accounts: [
                { accountId: 1, accountName: "Computer & Printers", netBalance: 73974.59 },
                { accountId: 2, accountName: "Furniture & Fixture", netBalance: 107434.61 }
            ]
        },
        {
            accountGroupId: 3, accountGroupName: "Current Assets", groupTotal: 1976197.28,
            accounts: [
                { accountId: 4, accountName: "Bank Accounts", netBalance: 1522813.16 },
                { accountId: 5, accountName: "Sundry Debtors", netBalance: 453384.12 }
            ]
        }
    ],
    liabilities: [
        {
            accountGroupId: 4, accountGroupName: "Capital Account", groupTotal: 782174.79,
            accounts: [{ accountId: 9, accountName: "Proprietor Capital", netBalance: 782174.79 }]
        },
        {
            accountGroupId: 7, accountGroupName: "Current Liabilities", groupTotal: 1375431.69,
            accounts: [
                { accountId: 12, accountName: "Duties & Taxes", netBalance: 80880.00 },
                { accountId: 13, accountName: "Sundry Creditors", netBalance: 1294551.69 }
            ]
        }
    ]
};

const BalanceSheet = () => {
    // --- States ---
    const [isApiMode, setIsApiMode] = useState(false);
    const [companies, setCompanies] = useState([]); // Loaded from Backend
    const [selectedCompanyId, setSelectedCompanyId] = useState('');
    const [displayCompanyName, setDisplayCompanyName] = useState(STATIC_DATA.companyName);
    const [endDate, setEndDate] = useState('2024-03-31');
    const [reportData, setReportData] = useState(STATIC_DATA);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const reportRef = useRef();
    const API_BASE_URL = 'https://localhost:7145/api';

    // --- 1. Fetch Company List (Mount Only) ---
    useEffect(() => {
        const loadCompanies = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/Companies`);
                if (response.ok) {
                    const data = await response.json();
                    setCompanies(data);
                }
            } catch (err) {
                console.warn("API Offline: Falling back to Static Mode dropdown.");
                setCompanies([{ id: 'static', companyName: "SWAMI SAMARTH SYNERGY" }]);
            }
        };
        loadCompanies();
    }, []);

    // --- 2. Handle Logic ---
    const handleGenerate = async () => {
        if (!isApiMode) {
            setReportData(STATIC_DATA);
            setDisplayCompanyName(STATIC_DATA.companyName);
            return;
        }

        if (!selectedCompanyId) {
            alert("Please select a company");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/BalanceSheet/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ companyId: parseInt(selectedCompanyId), endDate })
            });
            if (!response.ok) throw new Error('Failed to fetch report');
            const data = await response.json();
            
            // Update UI
            setReportData(data);
            const comp = companies.find(c => c.id.toString() === selectedCompanyId);
            setDisplayCompanyName(comp ? comp.companyName : "Company Report");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = () => {
        const element = reportRef.current;
        html2canvas(element, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = 210;
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${displayCompanyName}_BS.pdf`);
        });
    };

    const formatINR = (val) => new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2 }).format(Math.abs(val));

    // --- 3. UI Helpers ---
    const RenderLedgerSide = ({ title, groups, totalAmount }) => (
        <div className="col-md-6 border-end border-dark d-flex flex-column p-0">
            <div className="bg-light p-2 border-bottom border-dark text-center fw-bold small uppercase">{title}</div>
            <div className="p-3 flex-grow-1" style={{ minHeight: '350px' }}>
                {groups.map(group => (
                    <div key={group.accountGroupId} className="mb-3">
                        <div className="d-flex justify-content-between border-bottom border-secondary mb-1">
                            <span className="fw-bold small">{group.accountGroupName}</span>
                            <span className="fw-bold small">{formatINR(group.groupTotal)}</span>
                        </div>
                        {group.accounts.map(acc => (
                            <div key={acc.accountId} className="d-flex justify-content-between ps-3 text-muted fst-italic" style={{ fontSize: '0.8rem' }}>
                                <span>{acc.accountName}</span>
                                <span>{formatINR(acc.netBalance)}</span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="border-top border-dark border-2 bg-light p-2 d-flex justify-content-between fw-bold">
                <span>TOTAL {title}</span>
                <span style={{ borderBottom: '3px double black' }}>{formatINR(totalAmount)}</span>
            </div>
        </div>
    );

    return (
        <div className="bg-light py-4 min-vh-100">
            <div className="container" style={{ maxWidth: '1100px' }}>
                
                {/* SETTINGS CARD */}
                <div className="card shadow-sm border-0 mb-4 p-3">
                    <div className="row g-3 align-items-end">
                        <div className="col-md-2">
                            <label className="small fw-bold mb-1">Mode</label>
                            <select className="form-select form-select-sm" onChange={(e) => setIsApiMode(e.target.value === 'true')}>
                                <option value="false">Demo (Static)</option>
                                <option value="true">Live (API)</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="small fw-bold mb-1">Company</label>
                            <select 
                                className="form-select form-select-sm" 
                                disabled={!isApiMode}
                                value={selectedCompanyId}
                                onChange={(e) => setSelectedCompanyId(e.target.value)}
                            >
                                <option value="">-- Select Company --</option>
                                {companies.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                            </select>
                        </div>
                        <div className="col-md-2">
                            <label className="small fw-bold mb-1">As On Date</label>
                            <input type="date" className="form-control form-control-sm" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                        <div className="col-md-4 text-end">
                            <button onClick={downloadPDF} className="btn btn-sm btn-outline-dark me-2">PDF</button>
                            <button onClick={handleGenerate} className="btn btn-sm btn-primary px-4" disabled={loading}>
                                {loading ? 'Loading...' : 'Generate'}
                            </button>
                        </div>
                    </div>
                    {error && <div className="text-danger x-small mt-2">{error}</div>}
                </div>

                {/* BALANCE SHEET REPORT */}
                <div ref={reportRef} className="bg-white shadow-lg mx-auto p-5" style={{ width: '1000px', minHeight: '1200px' }}>
                    <div className="text-center mb-5">
                        <h2 className="fw-bold text-uppercase mb-1">{displayCompanyName}</h2>
                        <p className="text-muted small">Balance Sheet as at {endDate}</p>
                        <hr className="w-25 mx-auto border-dark border-2" />
                    </div>

                    <div className="row g-0 border border-dark border-2">
                        <RenderLedgerSide 
                            title="LIABILITIES" 
                            groups={reportData.liabilities} 
                            totalAmount={reportData.totalLiabilities} 
                        />
                        <RenderLedgerSide 
                            title="ASSETS" 
                            groups={reportData.assets} 
                            totalAmount={reportData.totalAssets} 
                        />
                    </div>

                    {/* SIGNATURE SECTION */}
                    <div className="row mt-5 pt-5 text-center small fw-bold">
                        <div className="col-4 mt-5"><div className="border-top border-dark pt-2 mx-3">Director</div></div>
                        <div className="col-4 mt-5"><div className="border-top border-dark pt-2 mx-3">Accountant</div></div>
                        <div className="col-4 mt-5"><div className="border-top border-dark pt-2 mx-3">Auditor / CA</div></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BalanceSheet;