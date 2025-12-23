import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE = "https://localhost:7145/api/OrgnizationMatrix"; 
// change to your real API

function EmployeeAttendence() {
  const [employees, setEmployees] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [weekOffDates, setWeekOffDates] = useState("");

  /* ------------------ helpers ------------------ */

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

  /* ------------------ fetch employees ------------------ */

  const loadEmployees = async () => {
    if (!fromDate || !toDate) {
      toast.warn("Please select FROM and TO dates");
      return;
    }

    const res = await axios.post(
      `${API_BASE}/GetEmployeesByDateRange`,
      { fromDate, toDate }
    );

    const weekOffArr = weekOffDates
      ? weekOffDates.split(",").map(d => parseInt(d.trim()))
      : [];

    const data = res.data.map(e => {
      const day = new Date(e.selectedDate).getDate();
      return {
        ...e,
        timeIn: "",
        timeOut: "",
        timeInPeriod: "AM",
        timeOutPeriod: "PM",
        totalHours: "",
        overtimeHours: "",
        isWeekOff: weekOffArr.includes(day)
      };
    });

    setEmployees(data);
  };

  /* ------------------ change handlers ------------------ */

  const handleTimeChange = (index, field, value) => {
    const updated = [...employees];
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
      // ❌ Partial entry
      if ((emp.timeIn && !emp.timeOut) || (!emp.timeIn && emp.timeOut)) {
        toast.error("Please fill both Time In and Time Out");
        return;
      }

      // ✅ Absent
      if (!emp.timeIn && !emp.timeOut) {
        payload.push({
          Employee_Name: emp.fullName,
          Emp_Code: emp.emp_Code,
          Department: emp.department,
          Time_In: "Absent",
          Time_Out: "Absent",
          TotalHours: "0 hr 0 min",
          OvertimeHours: "0 hr 0 min",
          Date: emp.selectedDate
        });
      } 
      // ✅ Present
      else {
        payload.push({
          Employee_Name: emp.fullName,
          Emp_Code: emp.emp_Code,
          Department: emp.department,
          Time_In: emp.timeIn,
          Time_Out: emp.timeOut,
          TotalHours: emp.totalHours,
          OvertimeHours: emp.overtimeHours,
          Date: emp.selectedDate
        });
      }
    }

    await axios.post(`${API_BASE}/SaveEmployeeData`, payload);
    toast.success("Attendance saved successfully");
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

        <button className="btn btn-success" onClick={loadEmployees}>
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
              <td>{e.emp_Code}</td>
              <td>{e.department}</td>

              <td>
                <input
                  className="form-control mb-1"
                  value={e.timeIn}
                  placeholder="HH:MM"
                  onChange={ev =>
                    handleTimeChange(i, "timeIn", ev.target.value)
                  }
                />
                <select
                  className="form-control"
                  value={e.timeInPeriod}
                  onChange={ev =>
                    handleTimeChange(i, "timeInPeriod", ev.target.value)
                  }
                >
                  <option>AM</option>
                  <option>PM</option>
                </select>
                {e.isWeekOff && (
                  <div className="text-danger fw-bold">Weekly Off</div>
                )}
              </td>

              <td>
                <input
                  className="form-control mb-1"
                  value={e.timeOut}
                  placeholder="HH:MM"
                  onChange={ev =>
                    handleTimeChange(i, "timeOut", ev.target.value)
                  }
                />
                <select
                  className="form-control"
                  value={e.timeOutPeriod}
                  onChange={ev =>
                    handleTimeChange(i, "timeOutPeriod", ev.target.value)
                  }
                >
                  <option>AM</option>
                  <option>PM</option>
                </select>
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
