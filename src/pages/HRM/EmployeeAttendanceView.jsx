import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://msmeerpsyn9-core.azurewebsites.net/api/HrmOrgInfo";

function EmployeeAttendanceView() {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

 useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      const res = await axios.get(`${API_BASE}/GetEmployeeAttendance`);
      setEmployees(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      toast.error("Failed to load attendance list");
    }
  };
 

  const handleEdit = (attendanceId) => {
  navigate(`/hrm/attendance/edit/${attendanceId}`);
  };

  const handleDeactivate = async (attendanceId) => {
    if (!window.confirm("Are you sure you want to deactivate this record?")) return;

    try {
      await axios.put(`${API_BASE}/DeactivateAttendance/${attendanceId}`);
      toast.success("Attendance deactivated");
      loadAttendance();
    } catch (err) {
      toast.error("Failed to deactivate attendance");
    }
  };


  return (
    <div className="container-fluid">
      <h4 className="text-primary mb-3">Attendance List</h4>

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
            <th>Actions</th> 
          </tr>
        </thead>

        <tbody>
          {employees.length === 0 && (
            <tr>
              <td colSpan="9">No records found</td>
            </tr>
          )}

          {employees.map((e) => (
            <tr key={e.empDailyAttendanceId}>
              <td>{e.selectedDate}</td>
              <td>{e.fullName}</td>
              <td>{e.empCode}</td>
              <td>{e.department}</td>
              <td>{e.timeIn}</td>
              <td>{e.timeOut}</td>
              <td>{e.totalHours}</td>
              <td>{e.overtimeHours}</td>

              
               <td>
      <button
        className="btn btn-sm btn-warning me-2"
        onClick={() => handleEdit(e.empDailyAttendanceId)}
      >
        Edit
      </button>

      <button
        className="btn btn-sm btn-danger"
        onClick={() => handleDeactivate(e.empDailyAttendanceId)}
      >
        Deactivate
      </button>
    </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeAttendanceView;
