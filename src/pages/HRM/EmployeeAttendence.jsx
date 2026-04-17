import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
 const API_BASE = "https://msmeerpsyn9-core.azurewebsites.net/api/HrmOrgInfo";

//const API_BASE = "https://localhost:7145/api/HrmOrgInfo"; 
// change to your real API

function EmployeeAttendence() {
  const [employees, setEmployees] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [weekOffDates, setWeekOffDates] = useState("");
const loadEmployees = () => {
  if (!fromDate) {
    toast.error("Please select From Date");
    return;
  }

  const updated = employees.map(emp => ({
    ...emp,
    selectedDate: fromDate
  }));

  setEmployees(updated);
};
const toDecimalHours = (text) => {
  if (!text) return 0;
  const match = text.match(/(\d+)\s*hr\s*(\d+)\s*min/);
  if (!match) return 0;

  const hrs = parseInt(match[1]);
  const mins = parseInt(match[2]);
  return +(hrs + mins / 60).toFixed(2);
};

const resetForm = () => {
  setFromDate("");
  setToDate("");
  setWeekOffDates("");
  setEmployees([]);
};

  /* ------------------ helpers ------------------ */
useEffect(() => {
  loadEmployeesByDateRange();
}, []);
  const convertTo24Hour = (time, period) => {
    if (!time) return null;
    const [h, m] = time.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return null;

    let hours = h;
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    return new Date(1970, 0, 1, hours, m);
  };

  const calculateHours = (emp) => {
    if (!emp.timeIn || !emp.timeOut) {
      return { total: "", overtime: "" };
    }

    const inDate = convertTo24Hour(emp.timeIn, emp.timeInPeriod);
    const outDate = convertTo24Hour(emp.timeOut, emp.timeOutPeriod);

    if (!inDate || !outDate) return { total: "", overtime: "" };

    if (outDate <= inDate) outDate.setDate(outDate.getDate() + 1);

    const minutes = (outDate - inDate) / 60000;
    const hrs = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);

    let overtime = "0 hr 0 min";
    if (minutes > 12 * 60) {
      const ot = minutes - 12 * 60;
      overtime = `${Math.floor(ot / 60)} hr ${ot % 60} min`;
    }

    return {
      total: `${hrs} hr ${mins} min`,
      overtime
    };
  };
const formatTimeInput = (value) => {
  if (!value) return "";

  // remove non-numeric characters
  const clean = value.replace(/[^0-9]/g, "");

  // when exactly 2 digits → auto add :
  if (clean.length === 2 && !value.includes(":")) {
    return clean + ":";
  }

  return value;
};


  /* ------------------ fetch employees ------------------ */

 const loadEmployeesByDateRange = async () => {
  if (!fromDate || !toDate) {
    toast.error("Please select From Date and To Date");
    return;
  }

  try {
    const res = await axios.post(
      `${API_BASE}/GetEmployeesByDateRange`,
      { fromDate, toDate }
    );

    // ✅ VERY IMPORTANT CHECK
    if (!Array.isArray(res.data)) {
      toast.error("Invalid data from server");
      return;
    }

    const data = res.data.map(item => ({
      employeeId: item.employeeId,
      empCode: item.emp_Code,
      fullName: item.fullName,
      department: item.deptName,
      deptId: item.deptId,
      selectedDate: fromDate,   // ✅ USE SELECTED DATE

      timeIn: "",
      timeOut: "",
      timeInPeriod: "AM",
      timeOutPeriod: "PM",
      totalHours: "",
      overtimeHours: ""
    }));

    setEmployees(data);
  } catch (err) {
    console.error(err);
    toast.error("Failed to load attendance data");
  }
};


  /* ------------------ change handlers ------------------ */
const handleTimeChange = (index, field, value) => {
  const updated = [...employees];

  // 🔥 AUTO FORMAT TIME
  if (field === "timeIn" || field === "timeOut") {
    value = formatTimeInput(value);
  }

  updated[index][field] = value;

  const calc = calculateHours(updated[index]);
  updated[index].totalHours = calc.total;
  updated[index].overtimeHours = calc.overtime;

  setEmployees(updated);
};



  /* ------------------ save ------------------ */

  const saveAttendance = async () => {
  const payload = [];

  for (let emp of employees) {
    // ❌ partial entry
    if ((emp.timeIn && !emp.timeOut) || (!emp.timeIn && emp.timeOut)) {
      toast.error("Please fill both Time In and Time Out");
      return;
    }

    payload.push({
      employeeId: emp.employeeId ?? 0,   // ✅ REQUIRED
      empCode: emp.empCode,
      attendanceDate: emp.selectedDate,  // yyyy-MM-dd
     timeIn: emp.timeIn
    ? `${emp.timeIn} ${emp.timeInPeriod}`   // ✅ "7:00 AM"
    : null,

  timeOut: emp.timeOut
    ? `${emp.timeOut} ${emp.timeOutPeriod}` // ✅ "8:00 PM"
    : null,
    totalWorkHours: toDecimalHours(emp.totalHours),   // ✅ decimal
  overTimeHours: toDecimalHours(emp.overtimeHours)  // ✅ decimal
    });
  }

  try {
    await axios.post(
      `${API_BASE}/SaveEmployeeAttendance`,
      payload
    );
    toast.success("Attendance saved successfully");
      resetForm();   // ✅ RESET EVERYTHING

  } catch (err) {
    toast.error("Failed to save attendance");
  }
};


  /* ------------------ UI ------------------ */

  return (
    <div className="container-fluid">

      {/* Heading */}
      <div className="text-center text-primary h2 mb-3">
        Daily Employee Attendance
      </div>

      {/* Filters */}
      <div className="d-flex gap-2 mb-3">
        <input type="date" className="form-control"
          onChange={e => setFromDate(e.target.value)} />

        <input type="date" className="form-control"
          onChange={e => setToDate(e.target.value)} />

        <input type="text" className="form-control"
          placeholder="Week off (15,24)"
          onChange={e => setWeekOffDates(e.target.value)} />

<button className="btn btn-success" onClick={loadEmployeesByDateRange}>
  LOAD DATA
</button>
      </div>

      {/* Table */}
      <table className="table table-bordered text-center">
        <thead className="table-primary">
          <tr>
            <th>Date</th>
            <th>Employee Name</th>
            <th>Code</th>
            <th>Department</th>
            <th>Time In</th>
            <th>Time Out</th>
            <th>Total Hours</th>
            <th>Overtime</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((e, i) => (
            <tr key={i}>
              <td>{e.selectedDate}</td>
              <td>{e.fullName}</td>
              <td>{e.empCode}</td>
              <td>{e.department}</td>

              <td>
  <div className="d-flex align-items-center gap-1">
    <input
      className="form-control form-control-sm"
      style={{ width: "70px" }}
      value={e.timeIn}
      placeholder="HH:MM"
      onChange={ev =>
        handleTimeChange(i, "timeIn", ev.target.value)
      }
    />
    <select
      className="form-select form-select-sm"
      style={{ width: "60px" }}
      value={e.timeInPeriod}
      onChange={ev =>
        handleTimeChange(i, "timeInPeriod", ev.target.value)
      }
    >
      <option>AM</option>
      <option>PM</option>
    </select>
  </div>
</td>


           <td>
  <div className="d-flex align-items-center gap-1">
    <input
      className="form-control form-control-sm"
      style={{ width: "70px" }}
      value={e.timeOut}
      placeholder="HH:MM"
      onChange={ev =>
        handleTimeChange(i, "timeOut", ev.target.value)
      }
    />
    <select
      className="form-select form-select-sm"
      style={{ width: "60px" }}
      value={e.timeOutPeriod}
      onChange={ev =>
        handleTimeChange(i, "timeOutPeriod", ev.target.value)
      }
    >
      <option>AM</option>
      <option>PM</option>
    </select>
  </div>
</td>


              <td>{e.totalHours}</td>
              <td>{e.overtimeHours}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="btn btn-primary mt-3" onClick={saveAttendance}>
        SAVE ATTENDANCE
      </button>
    </div>
  );
}

export default EmployeeAttendence;
