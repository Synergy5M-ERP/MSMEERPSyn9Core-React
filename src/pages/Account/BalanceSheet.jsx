import React, { useState } from "react";


const companies = [
  { id: 1, name: "Company A" },
  { id: 2, name: "Company B" },
];

function BalanceSheet() {
  const [companyId, setCompanyId] = useState(companies[0]?.id ?? "");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleView = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const body = {
        companyId: Number(companyId),
        fromDate,
        toDate,
      };

      const res = await fetch("https://localhost:5001/api/balancesheet/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // fixed
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to load balance sheet");

      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (url, fileName) => {
    const body = {
      companyId: Number(companyId),
      fromDate,
      toDate,
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // fixed
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error("Download failed");

    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = fileName;
    document.body.appendChild(a); // fixed
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);
  };

  const handleExportCsv = async () => {
    try {
      await downloadFile(
        "https://localhost:5001/api/balancesheet/export/csv",
        "BalanceSheet.csv"
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleExportPdf = async () => {
    try {
      await downloadFile(
        "https://localhost:5001/api/balancesheet/export/pdf",
        "BalanceSheet.pdf"
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bs-page">
      <div className="bs-card">
        <div className="bs-header">
          <h2>Balance Sheet</h2>
          <p>Select company and period to generate report.</p>
        </div>

        <form className="bs-filters" onSubmit={handleView}>
          <div className="bs-field">
            <label>Company</label>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              required
            >
              <option value="">Select</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bs-field">
            <label>From</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              required
            />
          </div>

          <div className="bs-field">
            <label>To</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              required
            />
          </div>

          <button className="bs-btn primary" type="submit" disabled={loading}>
            {loading ? "Loading..." : "View"}
          </button>
        </form>

        {error && <div className="bs-error">{error}</div>}

        {data && (
          <>
            <div className="bs-toolbar">
              <div className="bs-meta">
                <span className="bs-company">{data.companyName}</span>
                <span className="bs-date">
                  As on {new Date(data.asOn).toLocaleDateString()}
                </span>
              </div>
              <div className="bs-actions">
                <button
                  type="button"
                  className="bs-btn outline"
                  onClick={handleExportCsv}
                >
                  Export CSV
                </button>
                <button
                  type="button"
                  className="bs-btn"
                  onClick={handleExportPdf}
                >
                  Export PDF
                </button>
              </div>
            </div>

            <div className="bs-table-wrapper">
              <table className="bs-table">
                <thead>
                  <tr>
                    <th>Group</th>
                    <th>Sub Group</th>
                    <th>Ledger</th>
                    <th className="amount">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.group}</td>
                      <td>{row.subGroup}</td>
                      <td>{row.ledgerName}</td>
                      <td className="amount">
                        {row.amount.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BalanceSheet;
