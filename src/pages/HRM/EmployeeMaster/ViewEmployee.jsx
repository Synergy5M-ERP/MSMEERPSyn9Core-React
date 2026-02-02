// ViewEmployee.jsx
import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../../config/apiconfig";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const ViewEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  /* ---------------- FETCH EMPLOYEES ---------------- */
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(API_ENDPOINTS.GetAll_Employee);
      if (!res.ok) throw new Error("Failed to load");

      const data = await res.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Unable to load employees");
    } finally {
      setLoading(false);
    }
  };
  const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB"); // dd/mm/yyyy
};




const handleEdit = async (emp) => {
  try {
    // ✅ 1. Check that the employee object has employeeId
    if (!emp || !emp.employeeId) {
      console.error("employeeId missing:", emp);
      alert("Employee ID not found");
      return;
    }

    const employeeId = emp.employeeId;
    console.log("Editing EmployeeId:", employeeId);

    // ✅ 2. Call the API to fetch employee details
    const url = `${API_ENDPOINTS.GetEmployeeById}/${employeeId}`;
    console.log("Calling API:", url);

    const res = await fetch(url);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }

    const empData = await res.json();
    console.log("Employee Data:", empData);

    // ✅ 3. Optionally, you can populate your form directly here
    // setEmployeeInfo({ ...empData }); 
    // setEmployerInfo({ ...empData }); 
    // setSalaryStructure({ ...empData });

    // ✅ 4. Navigate to Edit page with correct ID
  navigate(`/hrm/employee/edit/${emp.employeeId}`); // ✅ use employeeId

  } catch (error) {
    console.error("Failed to load employee:", error);
    alert("Failed to load employee");
  }
};










 const handleDeactivate = async (empCode) => {
  if (!window.confirm("Are you sure you want to deactivate this employee?"))
    return;

  try {
    const encodedEmpCode = encodeURIComponent(empCode);

    const url = `${API_ENDPOINTS.DeactivateEmployee}/${encodedEmpCode}`;
    console.log("Calling API:", url);

    const res = await fetch(url, {
      method: "PUT",
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }

    alert("Employee deactivated successfully");
    fetchEmployees(); // reload list
  } catch (err) {
    console.error(err);
    alert("Failed to deactivate employee");
  }
};


  /* ---------------- PAGINATION ---------------- */
  const totalCount = employees.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const pagedEmployees = employees.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handlePageChange = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  
  return (
    <div className="container my-4">
      <div className="card shadow">
        <div className="card-header bg-secondary text-white">
          <h5 className="mb-0">View Employees</h5>
        </div>

        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {loading && <div className="alert alert-info">Loading...</div>}

          {/* Rows per page */}
          <div className="d-flex align-items-center gap-2 mb-3">
            <span>Rows per page:</span>
            <select
              className="form-select form-select-sm"
              style={{ width: 100 }}
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              {[5, 10, 25, 50].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-light">
                <tr>
                  <th>Emp Code</th>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>DOB</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Authority</th>
                  <th>Joining Date</th>
                  <th>Salary</th>
                  <th>City</th>
                  <th>Contact</th>
                  <th>Edit</th>
                  <th>Deactive</th>
                </tr>
              </thead>
             <tbody>
  {pagedEmployees.length ? (
    pagedEmployees.map((e) => (
      <tr key={e.empCode}>
        <td>{e.empCode}</td>
        <td>{e.fullName}</td>
        <td>{e.gender}</td>
<td>{formatDate(e.dob)}</td>
<td>{e.departmentName}</td>
<td>{e.designationName}</td>
<td>{e.authorityName}</td>

<td>{formatDate(e.joiningDate)}</td>
        <td>{e.monthlySalary}</td>
        <td>{e.city}</td>
        <td>{e.contactNo}</td>

        <td className="text-center">
          <button
            className="btn btn-sm"
            onClick={() => handleEdit(e)}
            style={{ background: "none", border: "none", color: "#0066cc" }}
          >
            <FaEdit />
          </button>
        </td>

        <td>
          <span
            onClick={() => handleDeactivate(e.empCode)}
            style={{ cursor: "pointer", color: "#dc3545" }}
          >
            <FaTrash />
          </span>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="12" className="text-center">
        No data found
      </td>
    </tr>
  )}
</tbody>

            </table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <span>
              Page {page} of {totalPages}
            </span>
            <div>
              <button
                className="btn btn-sm btn-outline-secondary me-1"
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
              >
                Prev
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                disabled={page === totalPages}
                onClick={() => handlePageChange(page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployee;
