import React, { useState } from "react";

const EmployeeLetter = () => {
  const [employee, setEmployee] = useState("");
  const [empCode, setEmpCode] = useState("");
  const [letterType, setLetterType] = useState("");

  const employees = [
    { name: "Rahul Patil", code: "EMP001" },
    { name: "Sneha Jadhav", code: "EMP002" },
  ];

  const generateLetter = () => {
    if (!empCode || !letterType) {
      alert("Please select employee and letter type");
      return;
    }

    let content = "";

    if (letterType === "offer") {
      content = `
        <h3 style="text-align:center">Offer Letter</h3>
        <p>Dear <b>${employee}</b>,</p>
        <p>We are pleased to offer you a position in our company.</p>
        <p><b>Employee Code:</b> ${empCode}</p>
        <p>Sincerely,<br/>HR Department</p>
      `;
    }

    if (letterType === "increment") {
      content = `
        <h3 style="text-align:center">Increment Letter</h3>
        <p>Dear <b>${employee}</b>,</p>
        <p>Your salary has been revised.</p>
        <p><b>Employee Code:</b> ${empCode}</p>
        <p>Sincerely,<br/>HR Department</p>
      `;
    }

    if (letterType === "experience") {
      content = `
        <h3 style="text-align:center">Experience Letter</h3>
        <p>This is to certify that <b>${employee}</b> worked with us.</p>
        <p><b>Employee Code:</b> ${empCode}</p>
        <p>We wish all the best.</p>
      `;
    }

    downloadDoc(content);
  };

  const downloadDoc = (content) => {
    const html = `
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial; padding: 40px; }
          p { font-size: 14px; line-height: 1.6; }
        </style>
      </head>
      <body>${content}</body>
      </html>
    `;

    const blob = new Blob(["\ufeff", html], {
      type: "application/msword",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${letterType}_letter.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
      <h2 style={{ textAlign: "center", color: "navy" }}>
        Generate Employee Letters
      </h2>

      <div style={{ display: "flex", gap: 20, marginTop: 30 }}>
        {/* Employee */}
        <select
          className="form-control"
          onChange={(e) => {
            const emp = employees.find(x => x.code === e.target.value);
            setEmployee(emp?.name);
            setEmpCode(emp?.code);
          }}
        >
          <option value="">Select Employee</option>
          {employees.map(emp => (
            <option key={emp.code} value={emp.code}>
              {emp.name}
            </option>
          ))}
        </select>

        {/* Letter */}
        <select
          className="form-control"
          onChange={(e) => setLetterType(e.target.value)}
        >
          <option value="">Select Letter Type</option>
          <option value="offer">Offer Letter</option>
          <option value="increment">Increment Letter</option>
          <option value="experience">Experience Letter</option>
        </select>

        <input
          className="form-control"
          value={empCode}
          readOnly
          placeholder="Employee Code"
        />
      </div>

      <div style={{ textAlign: "center", marginTop: 30 }}>
        <button className="btn btn-primary" onClick={generateLetter}>
          Generate Letter
        </button>
      </div>
    </div>
  );
};

export default EmployeeLetter;
