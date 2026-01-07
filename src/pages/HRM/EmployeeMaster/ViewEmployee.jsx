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
const handleEdit = async (emp) => {
  try {
    const encodedEmpCode = encodeURIComponent(emp.emp_Code);
    const url = `${API_ENDPOINTS.GetEmployeeByEmpCode}/${encodedEmpCode}`;
    console.log("Calling API:", url); // should print full correct URL

    const res = await fetch(url);

    if (!res.ok) {
      const text = await res.text();
      console.error("API returned error:", text);
      throw new Error(`Failed to fetch employee. Status: ${res.status}`);
    }

    const empData = await res.json();
// For editing an employee
  navigate(`/hrm/employee/edit/${encodedEmpCode}`);
  } catch (err) {
    console.error(err);
    alert("Failed to load employee details for edit");
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

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "-";

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
                    <tr key={e.emp_Code}>
                      <td>{e.emp_Code}</td>
                      <td>{e.fullName}</td>
                      <td>{e.gender}</td>
                      <td>{formatDate(e.dob)}</td>
                      <td>{e.department}</td>
                      <td>{e.joining_Designation}</td>
                      <td>{formatDate(e.date_Of_Joing)}</td>
                      <td>{e.monthly_Salary}</td>
                      <td>{e.city}</td>
                      <td>{e.contact_NO}</td>
                     <td className="text-center">
  {/* EDIT */}
 <button
  className="btn btn-sm me-2"
  onClick={() => handleEdit(e)}
  title="Edit Employee"
  style={{
    padding: "4px 8px",
    background: "none",   // removes background color
    border: "none",       // removes border
    color: "#0066cc",     // optional: set icon color
    cursor: "pointer",    // pointer on hover
  }}
>
  <FaEdit />
</button>

</td><td>
  {/* DELETE / DEACTIVATE */}
  <span
    title="Delete Employee"
    onClick={() => handleDeactivate(e.emp_Code)}
    style={{
      cursor: "pointer",
      fontSize: "18px",
      color: "#dc3545",
      verticalAlign: "middle"
    }}
  >
    <FaTrash />
  </span>
</td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center">
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
