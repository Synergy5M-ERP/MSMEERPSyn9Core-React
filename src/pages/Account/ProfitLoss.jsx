import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'bootstrap/dist/css/bootstrap.min.css';

// --- STATIC DATA (Based on your uploaded images) ---
const STATIC_PL_DATA = {
    companyName: "SWAMI SAMARTH SYNERGY",
    reportStartDate: "2023-04-01",
    reportEndDate: "2024-03-31",
    trading: {
        purchases: {
            total: 186347.22,
            items: [
                { name: "DELL 7480 I7 8GB Laptop 4", amount: 20000 },
                { name: "DELL 7480 I7 8GB Laptop 5", amount: 20000 },
                { name: "PURCHASE", amount: 146347.22 }
            ]
        },
        sales: {
            total: 2951055.00,
            items: [
                { name: "SALES", amount: 858816.93 },
                { name: "Service Charges (LUT)", amount: 43719.70 },
                { name: "SERVICES TO CONNECT BUYER & SELLER", amount: 2048518.37 }
            ]
        },
        grossProfit: 2764707.78
    },
    plAccount: {
        indirectExpenses: {
            total: 2543230.97,
            items: [
                { name: "Salary", amount: 650000 },
                { name: "Director Remuneration", amount: 550000 },
                { name: "Rent", amount: 201000 },
                { name: "Consultancy Services", amount: 170000 },
                { name: "Business Promotion Expenses", amount: 52022.21 },
                { name: "Travelling Exp", amount: 54000 }
            ]
        },
        indirectIncomes: {
            total: 32255.00,
            items: [
                { name: "Interest on FD", amount: 32255 }
            ]
        },
        nettProfit: 253731.81
    }
};

const  ProfitLoss = () => {
    const [isApiMode, setIsApiMode] = useState(false);
    const [reportData, setReportData] = useState(STATIC_PL_DATA);
    const [loading, setLoading] = useState(false);
    const reportRef = useRef();

    const formatINR = (val) => new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2 }).format(val || 0);

    const downloadPDF = () => {
        const element = reportRef.current;
        html2canvas(element, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = 210;
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`ProfitAndLoss_${reportData.reportEndDate}.pdf`);
        });
    };

    return (
        <div className="bg-light py-4 min-vh-100">
            <div className="container" style={{ maxWidth: '1100px' }}>
                
                {/* Control Bar */}
                <div className="card shadow-sm border-0 mb-4 p-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <span className="badge bg-primary me-2">{isApiMode ? 'Live API' : 'Static Demo'}</span>
                            <h5 className="d-inline mb-0">Profit & Loss Management</h5>
                        </div>
                        <div>
                            <button onClick={downloadPDF} className="btn btn-sm btn-outline-dark me-2">Download PDF</button>
                            <button className="btn btn-sm btn-primary px-4" onClick={() => setReportData(STATIC_PL_DATA)}>Refresh Report</button>
                        </div>
                    </div>
                </div>

                {/* Report Area */}
                <div ref={reportRef} className="bg-white shadow border mx-auto p-5" style={{ width: '1000px' }}>
                    
                    {/* Header */}
                    <div className="text-center mb-5">
                        <h2 className="fw-bold text-uppercase mb-1">{reportData.companyName}</h2>
                        <h5 className="text-decoration-underline fw-bold mb-1">Profit & Loss A/c</h5>
                        <p className="small text-muted">{reportData.reportStartDate} to {reportData.reportEndDate}</p>
                    </div>

                    <div className="border border-dark border-2">
                        {/* 1. TRADING SECTION */}
                        <div className="row g-0">
                            {/* Dr - Expenses (Purchases) */}
                            <div className="col-6 border-end border-dark">
                                <div className="bg-light p-2 border-bottom border-dark fw-bold small text-uppercase">Particulars</div>
                                <div className="p-3" style={{ minHeight: '200px' }}>
                                    <div className="d-flex justify-content-between fw-bold border-bottom mb-1">
                                        <span>Purchase Accounts</span>
                                        <span>{formatINR(reportData.trading.purchases.total)}</span>
                                    </div>
                                    {reportData.trading.purchases.items.map((item, i) => (
                                        <div key={i} className="d-flex justify-content-between ps-3 small fst-italic text-muted">
                                            <span>{item.name}</span><span>{formatINR(item.amount)}</span>
                                        </div>
                                    ))}
                                    <div className="d-flex justify-content-between fw-bold mt-5 pt-2 border-top border-dark">
                                        <span>Gross Profit c/o</span>
                                        <span>{formatINR(reportData.trading.grossProfit)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Cr - Income (Sales) */}
                            <div className="col-6">
                                <div className="bg-light p-2 border-bottom border-dark fw-bold small text-uppercase">Particulars</div>
                                <div className="p-3">
                                    <div className="d-flex justify-content-between fw-bold border-bottom mb-1">
                                        <span>Sales Accounts</span>
                                        <span>{formatINR(reportData.trading.sales.total)}</span>
                                    </div>
                                    {reportData.trading.sales.items.map((item, i) => (
                                        <div key={i} className="d-flex justify-content-between ps-3 small fst-italic text-muted">
                                            <span>{item.name}</span><span>{formatINR(item.amount)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Trading Totals */}
                        <div className="row g-0 border-top border-bottom border-dark bg-light fw-bold">
                            <div className="col-6 border-end border-dark p-2 d-flex justify-content-between">
                                <span>Total</span><span>{formatINR(reportData.trading.sales.total)}</span>
                            </div>
                            <div className="col-6 p-2 d-flex justify-content-between">
                                <span>Total</span><span>{formatINR(reportData.trading.sales.total)}</span>
                            </div>
                        </div>

                        {/* 2. PROFIT & LOSS SECTION */}
                        <div className="row g-0">
                            {/* Dr - Indirect Expenses */}
                            <div className="col-6 border-end border-dark">
                                <div className="p-3" style={{ minHeight: '300px' }}>
                                    <div className="d-flex justify-content-between fw-bold border-bottom mb-1">
                                        <span>Indirect Expenses</span>
                                        <span>{formatINR(reportData.plAccount.indirectExpenses.total)}</span>
                                    </div>
                                    {reportData.plAccount.indirectExpenses.items.map((item, i) => (
                                        <div key={i} className="d-flex justify-content-between ps-3 small py-1 text-muted">
                                            <span>{item.name}</span><span>{formatINR(item.amount)}</span>
                                        </div>
                                    ))}
                                    <div className="d-flex justify-content-between fw-bold mt-4 pt-2 border-top border-dark border-1">
                                        <span>Nett Profit</span>
                                        <span>{formatINR(reportData.plAccount.nettProfit)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Cr - Indirect Income */}
                            <div className="col-6">
                                <div className="p-3">
                                    <div className="d-flex justify-content-between fw-bold border-bottom mb-1">
                                        <span>Gross Profit b/f</span>
                                        <span>{formatINR(reportData.trading.grossProfit)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between fw-bold border-bottom mt-3 mb-1">
                                        <span>Indirect Incomes</span>
                                        <span>{formatINR(reportData.plAccount.indirectIncomes.total)}</span>
                                    </div>
                                    {reportData.plAccount.indirectIncomes.items.map((item, i) => (
                                        <div key={i} className="d-flex justify-content-between ps-3 small py-1 text-muted">
                                            <span>{item.name}</span><span>{formatINR(item.amount)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Final Totals */}
                        <div className="row g-0 bg-dark text-white fw-bold">
                            <div className="col-6 border-end border-white p-2 d-flex justify-content-between">
                                <span>Total</span><span>{formatINR(reportData.trading.grossProfit + reportData.plAccount.indirectIncomes.total)}</span>
                            </div>
                            <div className="col-6 p-2 d-flex justify-content-between">
                                <span>Total</span><span>{formatINR(reportData.trading.grossProfit + reportData.plAccount.indirectIncomes.total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Signatures */}
                    <div className="row mt-5 pt-5 text-center small fw-bold">
                        <div className="col-6 mt-5"><div className="border-top border-dark pt-2 mx-5">Proprietor</div></div>
                        <div className="col-6 mt-5"><div className="border-top border-dark pt-2 mx-5">Authorized Auditor</div></div>
                    </div>
                    
                    <div className="text-center mt-5 text-muted x-small">
                        Generated on {new Date().toLocaleString()} | Computer Generated Report
                    </div>
                </div>
            </div>
        </div>
    );
};

export default  ProfitLoss;