import React, { useState } from "react";
import axios from "axios";

function GrossSalary() {
  const [month, setMonth] = useState("");
  const [monthDays, setMonthDays] = useState(0);
  const [weeklyHoliday, setWeeklyHoliday] = useState(0);
  const [companyHoliday, setCompanyHoliday] = useState(0);
  const [workingDays, setWorkingDays] = useState(0);
  const [welfareFund, setWelfareFund] = useState(0);

  const [employees, setEmployees] = useState([]);

  /* ================= Month Change ================= */
  const handleMonthChange = (value) => {
    setMonth(value);

    if (!value) return;

    const [year, mon] = value.split("-");
    const daysInMonth = new Date(year, mon, 0).getDate();
    setMonthDays(daysInMonth);

    calculateWorkingDays(daysInMonth, weeklyHoliday, companyHoliday);
  };

  const calculateWorkingDays = (days, weekly, company) => {
    const result = days - weekly - company;
    setWorkingDays(result > 0 ? result : 0);
  };

  /* ================= Load Employees ================= */
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        "/OrgnizationMatrix/GetStaffSalaryList"
      );

      const mapped = res.data.map((e) => ({
        ...e,
        attendanceDays: 0,
        paidLeave: 0,
        overtimeHours: 0,
        paidDays: 0,
        overtimePay: 0,
        grossSalary: 0,
        esic: 0,
        payableSalary: 0,
      }));

      setEmployees(mapped);
    } catch (error) {
      alert("Failed to load employee list");
    }
  };

  /* ================= Calculate Salary ================= */
  const calculateSalary = () => {
    const updated = employees.map((emp) => {
      const dailyPay = Number(emp.DailyPay || 0);

      const paidDays =
        Number(emp.attendanceDays) +
        Number(emp.paidLeave) +
        Number(weeklyHoliday) +
        Number(companyHoliday);

      const grossSalary = dailyPay * paidDays;
      const overtimePay = Number(emp.overtimeHours) * dailyPay;

      const esic =
        emp.YNFESIC === "YES"
          ? (grossSalary + overtimePay) * 0.0075
          : 0;

      const payableSalary =
        grossSalary +
        overtimePay -
        (esic +
          Number(emp.PF_Conrtibution || 0) +
          Number(emp.Professional_Tax || 0) +
          Number(welfareFund));

      return {
        ...emp,
        paidDays,
        grossSalary: grossSalary.toFixed(2),
        overtimePay: overtimePay.toFixed(2),
        esic: esic.toFixed(2),
        payableSalary: payableSalary.toFixed(2),
      };
    });

    setEmployees(updated);
  };

  /* ================= Save Salary ================= */
  const saveSalary = async () => {
    try {
      await axios.post(
        "/OrgnizationMatrix/SaveStaffSalaryData",
        employees
      );
      alert("Salary saved successfully");
    } catch (error) {
      alert("Error while saving salary");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="container-fluid p-4">
      <h2 className="text-center text-primary mb-4">
        STAFF GROSS SALARY
      </h2>

      {/* ---------- TOP FORM ---------- */}
      <div className="row mb-3">
        <div className="col-md-3">
          <label>Month</label>
          <input
            type="month"
            className="form-control"
            onChange={(e) => handleMonthChange(e.target.value)}
          />
        </div>

        <div className="col-md-2">
          <label>Month Days</label>
          <input value={monthDays} className="form-control" readOnly />
        </div>

        <div className="col-md-2">
          <label>Weekly Holiday</label>
          <input
            type="number"
            className="form-control"
            onChange={(e) => {
              const val = Number(e.target.value);
              setWeeklyHoliday(val);
              calculateWorkingDays(monthDays, val, companyHoliday);
            }}
          />
        </div>

        <div className="col-md-2">
          <label>Company Holiday</label>
          <input
            type="number"
            className="form-control"
            onChange={(e) => {
              const val = Number(e.target.value);
              setCompanyHoliday(val);
              calculateWorkingDays(monthDays, weeklyHoliday, val);
            }}
          />
        </div>

        <div className="col-md-2">
          <label>Working Days</label>
          <input value={workingDays} className="form-control" readOnly />
        </div>
      </div>

      {/* ---------- BUTTONS ---------- */}
      <div className="mb-3">
        <button className="btn btn-success me-2" onClick={fetchEmployees}>
          ADD DATA
        </button>
        <button className="btn btn-primary me-2" onClick={calculateSalary}>
          PROCESS SALARY
        </button>
      </div>

      {/* ---------- TABLE ---------- */}
      <div className="table-responsive">
        <table className="table table-bordered text-center">
          <thead className="table-primary">
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Attendance</th>
              <th>Paid Leave</th>
              <th>Paid Days</th>
              <th>Overtime (hrs)</th>
              <th>Gross Salary</th>
              <th>ESIC</th>
              <th>Net Payable</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp, i) => (
              <tr key={i}>
                <td>{emp.FullName}</td>
                <td>{emp.Emp_Code}</td>

                <td>
                  <input
                    type="number"
                    value={emp.attendanceDays}
                    onChange={(e) => {
                      const list = [...employees];
                      list[i].attendanceDays = e.target.value;
                      setEmployees(list);
                    }}
                  />
                </td>

                <td>
                  <input
                    type="number"
                    value={emp.paidLeave}
                    onChange={(e) => {
                      const list = [...employees];
                      list[i].paidLeave = e.target.value;
                      setEmployees(list);
                    }}
                  />
                </td>

                <td>{emp.paidDays}</td>

                <td>
                  <input
                    type="number"
                    value={emp.overtimeHours}
                    onChange={(e) => {
                      const list = [...employees];
                      list[i].overtimeHours = e.target.value;
                      setEmployees(list);
                    }}
                  />
                </td>

                <td>{emp.grossSalary}</td>
                <td>{emp.esic}</td>

                <td className="fw-bold text-success">
                  {emp.payableSalary}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="btn btn-dark mt-3" onClick={saveSalary}>
        SAVE EMPLOYEE DATA
      </button>
    </div>
  );
}

export default GrossSalary;
