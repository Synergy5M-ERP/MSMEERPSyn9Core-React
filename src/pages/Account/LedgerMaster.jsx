import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/apiconfig";

/* ─────────────────────────────────────────────
   Reusable Mapping Form
   ───────────────────────────────────────────── */
const MappingForm = ({ title, color, fetchColumnsEndpoint, saveEndpoint, ledgers }) => {
  const [columns, setColumns]   = useState([]);
  const [ledgerId, setLedgerId] = useState("");
  const [type, setType]         = useState("");
  const [column, setColumn]     = useState("");
  const [crdr, setCrdr]         = useState("Credit");

  const handleTypeChange = async (value) => {
    setType(value);
    setColumn("");
    if (!value) { setColumns([]); return; }
    try {
      const res = await axios.get(fetchColumnsEndpoint, { params: { type: value } });
      setColumns(res.data);
    } catch (error) {
      console.error("Error fetching columns:", error);
    }
  };

  const handleSubmit = async () => {
    if (!ledgerId || !type || !column) {
      alert("Please select all fields");
      return;
    }
    const payload = {
      LedgerId: Number(ledgerId),
      GRNInvColumnName: column,
      CrDr: crdr,
    };
    console.log(`[${title}] Payload:`, payload);
    try {
      await axios.post(saveEndpoint, payload, {
        headers: { "Content-Type": "application/json" },
      });
      alert("Mapping Saved Successfully");
      setLedgerId(""); setType(""); setColumn(""); setColumns([]); setCrdr("Credit");
    } catch (error) {
      console.error("Error saving mapping:", error.response?.data);
    }
  };

  const isCredit = crdr === "Credit";

  return (
    <div className={`lm-card lm-card--${color}`}>

      {/* Card Header */}
      <div className="lm-card-header">
        <div className={`lm-header-icon lm-header-icon--${color}`}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="white">
            <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
        </div>
        <div>
          <p className="lm-title">{title}</p>
          <p className="lm-subtitle">Map ledger account to column</p>
        </div>
      </div>

      {/* Step 1 */}
      <div className="lm-field">
        <label className="lm-label">
          Ledger Name
        </label>
        <select className="lm-select" value={ledgerId} onChange={(e) => setLedgerId(e.target.value)}>
          <option value="">— Select Ledger Name —</option>
          {Array.isArray(ledgers) && ledgers.map((item) => (
            <option
              key={item.AccountLedgerId || item.accountLedgerId}
              value={item.AccountLedgerId || item.accountLedgerId}
            >
              {item.AccountLedgerName || item.accountLedgerName}
            </option>
          ))}
        </select>
      </div>

      {/* Step 2 */}
      <div className="lm-field">
        <label className="lm-label">
         Type
        </label>
        <select className="lm-select" value={type} onChange={(e) => handleTypeChange(e.target.value)}>
          <option value="">— Select Type —</option>
          <option value="GRN">GRN</option>
          <option value="Invoice">Invoice</option>
        </select>
      </div>

      {/* Step 3 */}
      <div className="lm-field">
        <label className="lm-label">
          Column Name
        </label>
        <select
          className="lm-select"
          value={column}
          onChange={(e) => setColumn(e.target.value)}
          disabled={!type}
        >
          <option value="">— Select Column Name —</option>
          {columns.map((col, index) => (
            <option key={index} value={col}>{col}</option>
          ))}
        </select>
      </div>

      <hr className="lm-divider" />

      {/* Step 4 */}
      <div className="lm-field">
        <label className="lm-label">
          Credit / Debit
        </label>
        <div className="lm-crdr-group">
          <div
            className={`lm-crdr-option ${isCredit ? "active-credit" : ""}`}
            onClick={() => setCrdr("Credit")}
          >
            <span className="lm-crdr-dot" />
            Credit
          </div>
          <div
            className={`lm-crdr-option ${!isCredit ? "active-debit" : ""}`}
            onClick={() => setCrdr("Debit")}
          >
            <span className="lm-crdr-dot" />
            Debit
          </div>
        </div>
      </div>

      {/* Submit */}
      <button className={`lm-submit-btn lm-submit-btn--${color}`} onClick={handleSubmit}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Save Mapping
      </button>

    </div>
  );
};

/* ─────────────────────────────────────────────
   Main Page
   ───────────────────────────────────────────── */
const LedgerMaster = () => {
  const [ledgers, setLedgers] = useState([]);

  useEffect(() => {
    fetchLedgers();
  }, []);

  const fetchLedgers = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.GetLedger);
      const ledgerList = Array.isArray(res.data) ? res.data : res.data.data;
      setLedgers(ledgerList || []);
    } catch (error) {
      console.error("Error fetching ledger:", error);
      setLedgers([]);
    }
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .lm-page {
          min-height: 100vh;
          background: #f0f4f8;
          padding: 40px 24px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .lm-page-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .lm-page-title {
          font-size: 1.7rem;
          font-weight: 800;
          color: #1e293b;
          letter-spacing: -0.5px;
        }

        .lm-page-desc {
          font-size: 0.88rem;
          color: #94a3b8;
          margin-top: 6px;
        }

        /* Two-column grid */
        .lm-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          max-width: 1000px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .lm-grid { grid-template-columns: 1fr; }
        }

        /* Card */
        .lm-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          padding: 32px 28px;
          border-top: 4px solid transparent;
        }

        .lm-card--blue   { border-top-color: #3b82f6; }
        .lm-card--violet { border-top-color: #8b5cf6; }

        .lm-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 28px;
          padding-bottom: 18px;
          border-bottom: 1.5px solid #f1f5f9;
        }

        .lm-header-icon {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .lm-header-icon--blue   { background: linear-gradient(135deg, #1d4ed8, #3b82f6); }
        .lm-header-icon--violet { background: linear-gradient(135deg, #6d28d9, #8b5cf6); }

        .lm-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #1e293b;
        }

        .lm-subtitle {
          font-size: 0.77rem;
          color: #94a3b8;
          margin-top: 2px;
        }

        .lm-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 18px;
        }

        .lm-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .lm-step-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          font-size: 0.65rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .lm-step-badge--blue   { background: #dbeafe; color: #1d4ed8; }
        .lm-step-badge--violet { background: #ede9fe; color: #6d28d9; }

        .lm-select {
          appearance: none;
          -webkit-appearance: none;
          background-color: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          padding: 10px 38px 10px 13px;
          font-size: 0.9rem;
          color: #1e293b;
          width: 100%;
          cursor: pointer;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 11px center;
        }

        .lm-select:focus {
          border-color: #3b82f6;
          background-color: #fff;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
        }

        .lm-card--violet .lm-select:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139,92,246,0.12);
        }

        .lm-select:disabled { opacity: 0.45; cursor: not-allowed; }

        .lm-divider {
          border: none;
          border-top: 1.5px dashed #e2e8f0;
          margin: 4px 0 18px 0;
        }

        .lm-crdr-group { display: flex; gap: 10px; }

        .lm-crdr-option {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 10px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          cursor: pointer;
          font-size: 0.88rem;
          font-weight: 600;
          transition: all 0.2s;
          background: #f8fafc;
          color: #64748b;
          user-select: none;
        }

        .lm-crdr-option:hover { border-color: #94a3b8; }

        .lm-crdr-option.active-credit {
          background: #eff6ff;
          border-color: #3b82f6;
          color: #1d4ed8;
        }

        .lm-crdr-option.active-debit {
          background: #fff1f2;
          border-color: #f43f5e;
          color: #be123c;
        }

        .lm-crdr-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: currentColor;
        }

        .lm-submit-btn {
          width: 100%;
          padding: 12px;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 0.93rem;
          font-weight: 700;
          cursor: pointer;
          margin-top: 6px;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .lm-submit-btn--blue {
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          box-shadow: 0 4px 14px rgba(59,130,246,0.35);
        }

        .lm-submit-btn--violet {
          background: linear-gradient(135deg, #6d28d9, #8b5cf6);
          box-shadow: 0 4px 14px rgba(139,92,246,0.35);
        }

        .lm-submit-btn:hover {
          opacity: 0.92;
          transform: translateY(-1px);
        }

        .lm-submit-btn:active { transform: translateY(0); }
      `}</style>

      <div className="lm-page">

        <div className="lm-page-header">
          <h2 className="lm-page-title">Ledger Master</h2>
          <p className="lm-page-desc">Configure ledger mappings for GRN Invoice and Non-GRN Invoice</p>
        </div>

        <div className="lm-grid">

          {/* GRN Invoice Form — Blue */}
          <MappingForm
            title="GRN Invoice"
            color="blue"
            fetchColumnsEndpoint={API_ENDPOINTS.GetGRNInvoiceNames}
            saveEndpoint={API_ENDPOINTS.SaveLedgerMapping}
            ledgers={ledgers}
          />

          {/* Non-GRN Invoice Form — Violet */}
          <MappingForm
            title="Non-GRN Invoice"
            color="violet"
            fetchColumnsEndpoint={API_ENDPOINTS.GetNonGRNInvoiceNames}
            saveEndpoint={API_ENDPOINTS.SaveNonGRNLedgerMapping}
            ledgers={ledgers}
          />

        </div>
      </div>
    </>
  );
};

export default LedgerMaster;