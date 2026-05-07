import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import { API_ENDPOINTS } from "../../config/apiconfig";

function EmployeeAttendence() {
  const [employees, setEmployees] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [weekOffDates, setWeekOffDates] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================================
        AUTO FORMAT TIME
  ================================= */

  const formatTimeInput = (value) => {
    if (!value) return "";

    let clean = value.replace(/[^0-9]/g, "");

    if (clean.length > 4) {
      clean = clean.slice(0, 4);
    }

    if (clean.length >= 3) {
      return clean.slice(0, 2) + ":" + clean.slice(2);
    }

    return clean;
  };

  /* ================================
        CONVERT TO 24 HOUR
  ================================= */

  const convertTo24Hour = (time, period) => {
    if (!time) return null;

    const parts = time.split(":");

    if (parts.length !== 2) return null;

    let hours = parseInt(parts[0]);
    let minutes = parseInt(parts[1]);

    if (isNaN(hours) || isNaN(minutes)) return null;

    if (period === "PM" && hours !== 12) {
      hours += 12;
    }

    if (period === "AM" && hours === 12) {
      hours = 0;
    }

    return new Date(1970, 0, 1, hours, minutes);
  };

  /* ================================
        CALCULATE HOURS
  ================================= */

  const calculateHours = (emp) => {
    if (!emp.timeIn || !emp.timeOut) {
      return {
        totalHours: "",
        overtimeHours: "",
      };
    }

    const timeInDate = convertTo24Hour(
      emp.timeIn,
      emp.timeInPeriod
    );

    const timeOutDate = convertTo24Hour(
      emp.timeOut,
      emp.timeOutPeriod
    );

    if (!timeInDate || !timeOutDate) {
      return {
        totalHours: "",
        overtimeHours: "",
      };
    }

    if (timeOutDate <= timeInDate) {
      timeOutDate.setDate(timeOutDate.getDate() + 1);
    }

    const totalMinutes =
      (timeOutDate - timeInDate) / (1000 * 60);

    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = Math.floor(totalMinutes % 60);

    const totalText =
      totalHours + " hr " + remainingMinutes + " min";

    /* ======================
          OVERTIME
    ====================== */

    let overtimeMinutes = totalMinutes - 12 * 60;

    if (overtimeMinutes < 0) {
      overtimeMinutes = 0;
    }

    /* ======================
          MANUAL OT
    ====================== */

    let manualMinutes = 0;

    if (emp.manualOT && emp.manualOT.trim() !== "") {
      const manual = emp.manualOT.trim();

      if (manual.includes(":")) {
        const parts = manual.split(":");

        const h = parseInt(parts[0]) || 0;
        const m = parseInt(parts[1]) || 0;

        manualMinutes = h * 60 + m;
      } else {
        const h = parseInt(manual);

        if (!isNaN(h)) {
          manualMinutes = h * 60;
        }
      }
    }

    const finalOT = overtimeMinutes + manualMinutes;

    const otHours = Math.floor(finalOT / 60);
    const otMinutes = Math.floor(finalOT % 60);

    const overtimeText =
      otHours + " hr " + otMinutes + " min";

    return {
      totalHours: totalText,
      overtimeHours: overtimeText,
    };
  };

  /* ================================
        LOAD EMPLOYEES
  ================================= */

  const loadEmployeesByDateRange = async () => {
    if (!fromDate || !toDate) {
      toast.error("Please select From Date and To Date");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
  API_ENDPOINTS.GetEmployeesByDateRange,
  {
    fromDate,
    toDate,
  }
);
      if (!Array.isArray(res.data)) {
        toast.error("Invalid data received");
        return;
      }

      const weekOffArray = weekOffDates
        ? weekOffDates
            .split(",")
            .map((x) => parseInt(x.trim()))
        : [];

      const data = res.data.map((item, index) => {
        const dateObj = new Date(item.selectedDate);

        const day = dateObj.getDate();

        const isWeekOff = weekOffArray.includes(day);

        return {
          id: index,

          employeeId: item.employeeId,
          empCode: item.emp_Code,
          fullName: item.fullName,
          department: item.department || item.deptName,

          selectedDate: item.selectedDate,

          timeIn: "",
          timeOut: "",

          timeInPeriod: "AM",
          timeOutPeriod: "PM",

          totalHours: "",
          overtimeHours: "",

          manualOT: "",

          isWeekOff,

          rowError: false,
        };
      });

      setEmployees(data);

      toast.success("Attendance loaded");
    } catch (err) {
      console.error(err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  /* ================================
        HANDLE CHANGE
  ================================= */

  const handleChange = (index, field, value) => {
    const updated = [...employees];

    if (field === "timeIn" || field === "timeOut") {
      value = formatTimeInput(value);
    }

    if (field === "manualOT") {
      const regex = /^\d{0,2}(:\d{0,2})?$/;

      if (!regex.test(value) && value !== "") {
        return;
      }
    }

    updated[index][field] = value;

    const calc = calculateHours(updated[index]);

    updated[index].totalHours = calc.totalHours;
    updated[index].overtimeHours = calc.overtimeHours;

    updated[index].rowError = false;

    setEmployees(updated);
  };

  /* ================================
        DECIMAL HOURS
  ================================= */

  const toDecimalHours = (text) => {
    if (!text) return 0;

    const match = text.match(
      /(\d+)\s*hr\s*(\d+)\s*min/
    );

    if (!match) return 0;

    const hrs = parseInt(match[1]);
    const mins = parseInt(match[2]);

    return +(hrs + mins / 60).toFixed(2);
  };

  /* ================================
        SAVE ATTENDANCE
  ================================= */

  const saveAttendance = async () => {
    const payload = [];

    let hasError = false;

    const updated = [...employees];

    for (let i = 0; i < employees.length; i++) {
      const emp = employees[i];

      /* ==========================
            PARTIAL ENTRY
      ========================== */

      if (
        (emp.timeIn && !emp.timeOut) ||
        (!emp.timeIn && emp.timeOut)
      ) {
        updated[i].rowError = true;
        hasError = true;
      }
    }

    setEmployees(updated);

    if (hasError) {
      toast.error(
        "Please fill both Time In and Time Out"
      );
      return;
    }

    /* ==========================
          CREATE PAYLOAD
    ========================== */

    employees.forEach((emp) => {
      /* ======================
            ABSENT
      ====================== */

      if (!emp.timeIn && !emp.timeOut) {
        payload.push({
          employeeId: emp.employeeId,
          empCode: emp.empCode,

          attendanceDate: emp.selectedDate,

          timeIn: "Absent",
          timeOut: "Absent",

          totalWorkHours: 0,
          overTimeHours: 0,
        });
      }

      /* ======================
            PRESENT
      ====================== */

      else {
        payload.push({
          employeeId: emp.employeeId,

          empCode: emp.empCode,

          attendanceDate: emp.selectedDate,

          timeIn:
            emp.timeIn +
            " " +
            emp.timeInPeriod,

          timeOut:
            emp.timeOut +
            " " +
            emp.timeOutPeriod,

          totalWorkHours: toDecimalHours(
            emp.totalHours
          ),

          overTimeHours: toDecimalHours(
            emp.overtimeHours
          ),
        });
      }
    });

    try {
      setLoading(true);

      await axios.post(
        `${API_ENDPOINTS}/SaveEmployeeAttendance`,
        payload
      );

      toast.success(
        "Attendance saved successfully"
      );

      setEmployees([]);
      setFromDate("");
      setToDate("");
      setWeekOffDates("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save attendance");
    } finally {
      setLoading(false);
    }
  };

  /* ================================
        UI
  ================================= */

  return (
    <div className="container-fluid mt-3">

      {/* =========================
            LOADER
      ========================= */}

      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <div
              className="spinner-border text-success"
              role="status"
              style={{
                width: "50px",
                height: "50px",
              }}
            ></div>

            <p className="mt-3 fw-bold text-primary">
              Please Wait...
            </p>
          </div>
        </div>
      )}

      {/* =========================
            HEADER
      ========================= */}

      <h2
        className="text-center mb-4"
        style={{
          color: "navy",
          fontWeight: "bold",
        }}
      >
        TIME IN ATTENDANCE
      </h2>

      {/* =========================
            FILTERS
      ========================= */}

      <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">

        <label className="fw-bold">
          FROM DATE:
        </label>

        <input
          type="date"
          className="form-control"
          style={{ width: "170px" }}
          value={fromDate}
          onChange={(e) =>
            setFromDate(e.target.value)
          }
        />

        <label className="fw-bold">
          TO DATE:
        </label>

        <input
          type="date"
          className="form-control"
          style={{ width: "170px" }}
          value={toDate}
          onChange={(e) =>
            setToDate(e.target.value)
          }
        />

        <label className="fw-bold">
          WEEK OFF:
        </label>

        <input
          type="text"
          className="form-control"
          style={{ width: "170px" }}
          placeholder="15,24,26"
          value={weekOffDates}
          onChange={(e) =>
            setWeekOffDates(e.target.value)
          }
        />

        <button
          className="btn btn-success"
          onClick={loadEmployeesByDateRange}
        >
          LOAD DATA
        </button>
      </div>

      {/* =========================
            TABLE
      ========================= */}

      <div className="table-responsive">

        <table className="table table-bordered text-center">

          <thead
            style={{
              backgroundColor: "#6d91e3",
              color: "white",
            }}
          >
            <tr>
              <th>Date</th>
              <th>Employee Name</th>
              <th>Employee Code</th>
              <th>Department</th>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Total Work Hours</th>
              <th>OT Input</th>
              <th>Total OT Hours</th>
            </tr>
          </thead>

          <tbody>

            {employees.length === 0 && (
              <tr>
                <td colSpan="9">
                  No Data Found
                </td>
              </tr>
            )}

            {employees.map((emp, index) => (
              <tr
                key={index}
                style={{
                  backgroundColor: emp.rowError
                    ? "#ffcccc"
                    : "",
                }}
              >
                <td>
                  {emp.selectedDate}
                </td>

                <td>{emp.fullName}</td>

                <td>{emp.empCode}</td>

                <td>{emp.department}</td>

                {/* ======================
                        TIME IN
                ====================== */}
<td>
  <div className="d-flex align-items-center gap-1">

    <input
      type="text"
      className="form-control form-control-sm"
      style={{ width: "90px" }}
      placeholder="HH:MM"
      maxLength={5}
      value={emp.timeIn}
      onChange={(e) =>
        handleChange(
          index,
          "timeIn",
          formatTimeInput(e.target.value)
        )
      }
    />

    <select
      className="form-select form-select-sm"
      style={{ width: "75px" }}
      value={emp.timeInPeriod}
      onChange={(e) =>
        handleChange(
          index,
          "timeInPeriod",
          e.target.value
        )
      }
    >
      <option value="AM">AM</option>
      <option value="PM">PM</option>
    </select>

  </div>

  {emp.isWeekOff && (
    <small className="text-danger fw-bold">
      Weekly Off
    </small>
  )}
</td>
                {/* ======================
                        TIME OUT
                ====================== */}

                <td>
  <div className="d-flex align-items-center gap-1">

    <input
      type="text"
      className="form-control form-control-sm"
      style={{ width: "90px" }}
      placeholder="HH:MM"
      maxLength={5}
      value={emp.timeOut}
      onChange={(e) =>
        handleChange(
          index,
          "timeOut",
          formatTimeInput(e.target.value)
        )
      }
    />

    <select
      className="form-select form-select-sm"
      style={{ width: "75px" }}
      value={emp.timeOutPeriod}
      onChange={(e) =>
        handleChange(
          index,
          "timeOutPeriod",
          e.target.value
        )
      }
    >
      <option value="AM">AM</option>
      <option value="PM">PM</option>
    </select>

  </div>

  {emp.isWeekOff && (
    <small className="text-danger fw-bold">
      Weekly Off
    </small>
  )}
</td>

                {/* ======================
                      TOTAL HOURS
                ====================== */}

                <td>
                  <input
                    className="form-control"
                    readOnly
                    value={emp.totalHours}
                  />
                </td>

                {/* ======================
                      MANUAL OT
                ====================== */}

                <td>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="HH:MM"
                    value={emp.manualOT}
                    onChange={(e) =>
                      handleChange(
                        index,
                        "manualOT",
                        e.target.value
                      )
                    }
                  />
                </td>

                {/* ======================
                      OT HOURS
                ====================== */}

                <td>
                  <input
                    className="form-control"
                    readOnly
                    value={emp.overtimeHours}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =========================
            SAVE BUTTON
      ========================= */}

      <button
        className="btn btn-primary mt-3"
        onClick={saveAttendance}
      >
        SAVE ATTENDANCE DATA
      </button>
    </div>
  );
}

export default EmployeeAttendence;