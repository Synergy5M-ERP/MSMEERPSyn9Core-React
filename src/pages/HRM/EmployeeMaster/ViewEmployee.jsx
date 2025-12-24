// ViewEmployee.jsx
import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../../config/apiconfig";

const ViewEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // useEffect(() => {
  //   const fetchEmployees = async () => {
  //     setLoading(true);
  //     setError("");

  //     try {
  //       const params = new URLSearchParams({
  //         page: page.toString(),
  //         pageSize: pageSize.toString()
  //       });

  //       const res = await fetch(
  //         `${API_ENDPOINTS.ViewEmployees}`
  //       );
  //       console.log(res);
        
  //       if (!res.ok) throw new Error("Failed to load employees");

  //       const data = await res.json(); // { items, totalCount }
  //       setEmployees(data.items || []);
  //       setTotalCount(data.totalCount || 0);
  //     } catch (err) {
  //       console.error(err);
  //       setError("Unable to load employees.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchEmployees();
  // }, [page, pageSize]); // Removed filter dependencies
useEffect(() => {
  const fetchEmployees = async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString()
      });

      const url = `${API_ENDPOINTS.ViewEmployees}?${params.toString()}`;
      console.log("🔍 Fetching from:", url);
      
      const res = await fetch(url);
      console.log("📡 Raw Response:", {
        status: res.status,
        ok: res.ok,
        headers: Object.fromEntries(res.headers.entries()),
        type: res.type
      });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      // 🚨 CRITICAL: Check if response body is accessible
      const contentType = res.headers.get("content-type");
      console.log("📄 Content-Type:", contentType);
      
      if (!contentType?.includes("application/json")) {
        const text = await res.text();
        console.log("❌ Not JSON - Raw text:", text.substring(0, 500));
        throw new Error("API returned non-JSON response");
      }

      const data = await res.json();
      console.log("✅ Parsed Data:", {
        items: data.items?.length || 0,
        totalCount: data.totalCount,
        hasItems: !!data.items
      });
      
      setEmployees(data.items || []);
      setTotalCount(data.totalCount || 0);
      
    } catch (err) {
      console.error("💥 Full Error:", err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  fetchEmployees();
}, [page, pageSize]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startIndex = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, totalCount);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  return (
    <div className="container my-4">
      <div className="card shadow-sm">
        <div className="card-header bg-secondary text-white">
          <h5 className="mb-0">View Employees</h5>
        </div>

        <div className="card-body">
          {/* Error & loading */}
          {error && (
            <div className="alert alert-danger py-2 mb-3" role="alert">
              {error}
            </div>
          )}
          {loading && (
            <div className="alert alert-info py-2 mb-3" role="alert">
              Loading...
            </div>
          )}

          {/* Rows per page selector */}
          <div className="d-flex align-items-center gap-2 mb-2">
            <span>Rows per page:</span>
            <select
              className="form-select form-select-sm"
              style={{ width: "90px" }}
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              {[5, 10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* Employee table */}
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>Emp Code</th>
                  <th>Full Name</th>
                  <th>Gender</th>
                  <th>DOB</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Joining Date</th>
                  <th>Monthly Salary</th>
                  <th>City</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                {employees.length > 0 ? (
                  employees.map((e) => (
                    <tr key={e.id}>
                      <td>{e.emp_Code}</td>
                      <td>{e.fullName}</td>
                      <td>{e.gender}</td>
                      <td>{e.dob}</td>
                      <td>{e.department}</td>
                      <td>{e.joining_Designation}</td>
                      <td>{e.date_Of_Joing}</td>
                      <td>{e.monthly_Salary}</td>
                      <td>{e.city}</td>
                      <td>{e.contact_NO}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center">
                      {loading ? "Loading..." : "No data"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between mt-2 gap-2">
            <nav aria-label="Page navigation" className="order-1 order-md-0">
              <ul className="pagination mb-0">
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(1)}
                  >
                    « First
                  </button>
                </li>
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(page - 1)}
                  >
                    ‹ Prev
                  </button>
                </li>
                <li className="page-item disabled">
                  <span className="page-link">
                    Page {page} of {Math.max(1, Math.ceil(totalCount / pageSize))}
                  </span>
                </li>
                <li
                  className={`page-item ${
                    page >= Math.ceil(totalCount / pageSize) ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(page + 1)}
                  >
                    Next ›
                  </button>
                </li>
                <li
                  className={`page-item ${
                    page >= Math.ceil(totalCount / pageSize) ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      handlePageChange(Math.max(1, Math.ceil(totalCount / pageSize)))
                    }
                  >
                    Last »
                  </button>
                </li>
              </ul>
            </nav>

            <div className="text-muted small ms-md-3 text-md-end">
              Showing {startIndex}–{endIndex} of {totalCount}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployee;
