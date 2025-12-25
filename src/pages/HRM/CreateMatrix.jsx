import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/apiconfig";
import { toast } from "react-toastify";
import { FaEdit, FaToggleOn, FaToggleOff } from "react-icons/fa";

const CreateMatrix = () => {
  const [selectedPage, setSelectedPage] = useState("viewMatrix"); // main view
  const [statusFilter, setStatusFilter] = useState("active"); // active/inactive filter
  const [employeeList, setEmployeeList] = useState([]);
  const [reportingList, setReportingList] = useState([]);
  const [matrixList, setMatrixList] = useState([]);
  const [editId, setEditId] = useState(null);

  const initialForm = {
    employeeId: "",
    empCode: "",
    empName: "",
    department: "",
    departmentCode: "",
    designation: "",
    designationCode: "",
    authority: "",
    authorityCode: "",
    email: "",
    reportingEmployeeId: "",
    reportingEmpCode: "",
    reportingEmpName: "",
    rpDepartment: "",
    rpDepartmentCode: "",
    rpDesignation: "",
    rpDesignationCode: "",
    rpAuthority: "",
    rpAuthorityCode: "",
    reportingEmail: "",
    matrixCode: "",
    isActive: true,
  };

  const [form, setForm] = useState(initialForm);

  // Load employees and matrix list on mount
  useEffect(() => {
    axios
      .get(API_ENDPOINTS.Emp_Info)
      .then((res) => {
        setEmployeeList(res.data);
        setReportingList(res.data);
      })
      .catch(() => toast.error("Failed to load employees"));

    loadMatrixList();
  }, []);

const loadMatrixList = () => {
  axios
    .get(API_ENDPOINTS.MatrixList)
    .then((res) => {
      console.log("Matrix list:", res.data); // check response in console
      setMatrixList(res.data);
    })
    .catch((err) => {
      console.error(err);
      toast.error("Failed to load matrix list");
    });
};


  // Update matrix code whenever relevant fields change
  useEffect(() => {
    const matrixCode =
      (form.departmentCode || "") +
      (form.designationCode || "") +
      (form.authorityCode || "") +
      (form.rpDepartmentCode || "") +
      (form.rpDesignationCode || "") +
      (form.rpAuthorityCode || "");

    setForm((prev) => ({ ...prev, matrixCode }));
  }, [
    form.departmentCode,
    form.designationCode,
    form.authorityCode,
    form.rpDepartmentCode,
    form.rpDesignationCode,
    form.rpAuthorityCode,
  ]);

  // Employee selection
  const handleEmployeeSelect = (e) => {
    const emp = employeeList.find((x) => x.id.toString() === e.target.value);
    if (!emp) return;

    setForm((prev) => ({
      ...prev,
      employeeId: emp.id,
      empCode: emp.empCode || "",
      empName: emp.name || "",
      department: emp.department || "",
      departmentCode: emp.departmentCode || "",
      designation: emp.designation || "",
      designationCode: emp.designationCode || "",
      authority: emp.authority || emp.authorityName || "",
      authorityCode: emp.authorityCode || emp.authorityCd || "",
      email: emp.email || "",
    }));
  };

  // Reporting employee selection
  const handleReportingSelect = (e) => {
    const emp = reportingList.find((x) => x.id.toString() === e.target.value);
    if (!emp) return;

    setForm((prev) => ({
      ...prev,
      reportingEmployeeId: emp.id,
      reportingEmpCode: emp.empCode || "",
      reportingEmpName: emp.name || "",
      rpDepartment: emp.department || "",
      rpDepartmentCode: emp.departmentCode || "",
      rpDesignation: emp.designation || "",
      rpDesignationCode: emp.designationCode || "",
      rpAuthority: emp.authority || emp.authorityName || "",
      rpAuthorityCode: emp.authorityCode || emp.authorityCd || "",
      reportingEmail: emp.email || "",
    }));
  };

  // Submit handler (create or edit)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.employeeId || !form.reportingEmployeeId) {
      toast.error("Please select employee and reporting employee");
      return;
    }

    const payload = {
      employeeId: form.employeeId,
      reportingEmployeeId: form.reportingEmployeeId,
      emp_Code: form.empCode,
      employee_Name: form.empName,
      department: form.department,
      department_Code: form.departmentCode,
      designation: form.designation,
      designation_Code: form.designationCode,
      authority_Code: form.authorityCode,
      rp_Department: form.rpDepartment,
      rp_DepartmentCode: form.rpDepartmentCode,
      reporting_EmployeeName: form.reportingEmpName,
      rp_Designation: form.rpDesignation,
      rp_DesignationCode: form.rpDesignationCode,
      rp_Authority: form.rpAuthority,
      rp_AuthorityCode: form.rpAuthorityCode,
      email: form.email,
      Report_Email: form.reportingEmail,
      position_Code: form.matrixCode,
      IsActive: form.isActive,
    };

    const apiCall = editId
    ? axios.put(`${API_ENDPOINTS.EditMatrix}/${editId}`, payload)
      : axios.post(API_ENDPOINTS.MatrixSave, payload);

    apiCall
      .then(() => {
        toast.success(editId ? "Matrix updated successfully" : "Matrix created successfully");
        setForm(initialForm);
        setEditId(null);
        loadMatrixList();
      })
      .catch((err) =>
        toast.error(err.response?.data?.message || "Error saving matrix")
      );
  };

const handleEdit = (matrix) => {
  // find employee by name
  const emp = employeeList.find(
    (e) => e.name === matrix.employee_Name
  );

  // find reporting employee by name
  const rep = reportingList.find(
    (e) => e.name === matrix.reporting_EmployeeName
  );

  setEditId(matrix.id);

  setForm({
    employeeId: emp?.id || "",
    empCode: matrix.emp_Code || "",
    empName: matrix.employee_Name || "",
    department: matrix.department || "",
    departmentCode: matrix.department_Code || "",
    designation: matrix.designation || "",
    designationCode: matrix.designation_Code || "",
    authority: emp?.authority || "",
    authorityCode: matrix.authority_Code || "",
    email: matrix.email_Id || "",

    reportingEmployeeId: rep?.id || "",
    reportingEmpCode: rep?.empCode || "",
    reportingEmpName: matrix.reporting_EmployeeName || "",
    rpDepartment: matrix.rP_Department || "",
    rpDepartmentCode: matrix.rP_DepartmentCode || "",
    rpDesignation: matrix.rP_Designation || "",
    rpDesignationCode: matrix.rP_DesignationCode || "",
    rpAuthority: matrix.rP_Authority || "",
    rpAuthorityCode: matrix.rP_AuthorityCode || "",
    reportingEmail: matrix.report_Email || "",

    matrixCode: matrix.position_Code || "",
    isActive: matrix.isActive,
  });

  setSelectedPage("createMatrix");
};

  // Cancel form
  const handleCancel = () => {
    setForm(initialForm);
    setEditId(null);
  };

  const handleStatusChange = (id, status) => {
  axios.put(
    `${API_ENDPOINTS.UpdateMatrixStatus}/${id}`,
    JSON.stringify(status),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
  .then(() => {
    toast.success("Status updated successfully");
    loadMatrixList();
  })
  .catch((err) => {
    console.error(err);
    toast.error("Failed to update status");
  });
};


  // Filtered matrix list based on status
  const filteredMatrixList = matrixList.filter((m) =>
    statusFilter === "active" ? m.isActive : !m.isActive
  );

  return (
    <div className="container mt-4 p-4 bg-light rounded shadow">
      <h3 className="text-center text-primary mb-4">Organization Matrix Management</h3>

      {/* Top controls */}
      <div className="d-flex justify-content-between align-items-center mb-3 p-2 bg-white rounded shadow-sm">
        <div className="d-flex gap-3">
         
          <label className="custom-radio-label">
            <input
              type="radio"
              name="mainView"
              checked={selectedPage === "viewMatrix"}
              onChange={() => setSelectedPage("viewMatrix")}
            />
            <span className="custom-radio"></span>
            View Matrix
          </label>
           <label className="custom-radio-label">
            <input
              type="radio"
              name="mainView"
              checked={selectedPage === "createMatrix"}
              onChange={() => setSelectedPage("createMatrix")}
            />
            <span className="custom-radio"></span>
            Create Matrix
          </label>
        </div>

        <div className="d-flex gap-3">
          <label className="custom-radio-label">
            <input
              type="radio"
              name="statusFilter"
              checked={statusFilter === "active"}
              onChange={() => setStatusFilter("active")}
            />
            <span className="custom-radio"></span>
            Active
          </label>
          <label className="custom-radio-label">
            <input
              type="radio"
              name="statusFilter"
              checked={statusFilter === "inactive"}
              onChange={() => setStatusFilter("inactive")}
            />
            <span className="custom-radio"></span>
            Inactive
          </label>
        </div>
      </div>

      {/* ================= CREATE MATRIX FORM ================= */}
      {selectedPage === "createMatrix" && (
        <form onSubmit={handleSubmit}>
          {/* Authority Matrix Of */}
          <h6 className="bg-warning p-2 mb-3">Authority Matrix Of</h6>
          <div className="row mb-3">
            <div className="col-md-3">
              <label>Select Employee</label>
              <select className="form-control" onChange={handleEmployeeSelect} value={form.employeeId}>
                <option value="">Select Employee</option>
                {employeeList.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3"><label>Employee Code</label><input className="form-control" value={form.empCode} readOnly /></div>
            <div className="col-md-3"><label>Department</label><input className="form-control" value={form.department} readOnly /></div>
            <div className="col-md-3"><label>Department Code</label><input className="form-control" value={form.departmentCode} readOnly /></div>
          </div>

          <div className="row mb-3">
            <div className="col-md-3"><label>Designation</label><input className="form-control" value={form.designation} readOnly /></div>
            <div className="col-md-3"><label>Designation Code</label><input className="form-control" value={form.designationCode} readOnly /></div>
            <div className="col-md-3"><label>Authority</label><input className="form-control" value={form.authority} readOnly /></div>
            <div className="col-md-3"><label>Authority Code</label><input className="form-control" value={form.authorityCode} readOnly /></div>
          </div>

          <div className="row mb-3"><div className="col-md-3"><label>Email</label><input className="form-control" value={form.email} readOnly /></div></div>

          {/* Reporting To */}
          <h6 className="bg-warning p-2 mt-4 mb-3">Reporting To</h6>
          <div className="row mb-3">
            <div className="col-md-3">
              <label>Reporting Employee</label>
              <select className="form-control" onChange={handleReportingSelect} value={form.reportingEmployeeId}>
                <option value="">Select Employee</option>
                {reportingList.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3"><label>Employee Code</label><input className="form-control" value={form.reportingEmpCode} readOnly /></div>
            <div className="col-md-3"><label>Rp Department</label><input className="form-control" value={form.rpDepartment} readOnly /></div>
            <div className="col-md-3"><label>Rp Department Code</label><input className="form-control" value={form.rpDepartmentCode} readOnly /></div>
          </div>

          <div className="row mb-3">
            <div className="col-md-3"><label>Rp Designation</label><input className="form-control" value={form.rpDesignation} readOnly /></div>
            <div className="col-md-3"><label>Rp Designation Code</label><input className="form-control" value={form.rpDesignationCode} readOnly /></div>
            <div className="col-md-3"><label>Rp Authority</label><input className="form-control" value={form.rpAuthority} readOnly /></div>
            <div className="col-md-3"><label>Rp Authority Code</label><input className="form-control" value={form.rpAuthorityCode} readOnly /></div>
          </div>

          <div className="row mb-4">
            <div className="col-md-3"><label>Email</label><input className="form-control" value={form.reportingEmail} readOnly /></div>
            <div className="col-md-3"><label>Matrix Code</label><input className="form-control" value={form.matrixCode} readOnly /></div>
          </div>

          <div className="text-center mb-4">
            <button type="submit" className="btn btn-success px-5 mr-2">{editId ? "Update" : "Create"}</button>
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      )}

      {/* ================= VIEW MATRIX LIST ================= */}
    {selectedPage === "viewMatrix" && (
  <>
    <div className="table-responsive">
      <table className="table table-bordered table-sm">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Emp Code</th>
            <th>Department</th>
            <th>Dept Code</th>
            <th>Designation</th>
            <th>Desig Code</th>
            <th>Authority Code</th>
            <th>Email</th>
            <th>Reporting Employee</th>
            <th>Rep Dept</th>
            <th>Rep Dept Code</th>
            <th>Rep Designation</th>
            <th>Rep Desig Code</th>
            <th>Rep Authority</th>
            <th>Rep Authority Code</th>
            <th>Rep Email</th>
            <th>Matrix Code</th>
            <th>Status</th>
            <th style={{ width: "120px", textAlign: "center" }}>Action</th>
                        <th style={{ width: "120px", textAlign: "center" }}>Action</th>

          </tr>
        </thead>
        <tbody>
          {filteredMatrixList.length === 0 ? (
            <tr>
              <td colSpan={19} className="text-center">
                No records found for status "{statusFilter}"
              </td>
            </tr>
          ) : (
            filteredMatrixList.map((m) => (
             <tr key={m.id}>
  <td>{m.employee_Name}</td>
  <td>{m.emp_Code}</td>
  <td>{m.department}</td>
  <td>{m.department_Code}</td>
  <td>{m.designation}</td>
  <td>{m.designation_Code}</td>
  <td>{m.authority_Code}</td>
  <td>{m.email_Id}</td>
  <td>{m.reporting_EmployeeName}</td>
  <td>{m.rP_Department}</td>
  <td>{m.rP_DepartmentCode}</td>
  <td>{m.rP_Designation}</td>
  <td>{m.rP_DesignationCode}</td>
  <td>{m.rP_Authority}</td>
  <td>{m.rP_AuthorityCode}</td>
  <td>{m.report_Email}</td>
  <td>{m.position_Code}</td>
  <td>{m.isActive ? "Active" : "Inactive"}</td>

  {/* ACTION COLUMN */}
  <td className="text-center">
    <button
      className="btn btn-sm btn-outline-primary mr-2"
      title="Edit Matrix"
      onClick={() => handleEdit(m)}
    >
      <FaEdit />
    </button>
    </td>
  <td className="text-center">

    <button
      className={`btn btn-sm ${
        m.isActive ? "btn-outline-danger" : "btn-outline-success"
      }`}
      title={m.isActive ? "Deactivate" : "Activate"}
      onClick={() => handleStatusChange(m.id, !m.isActive)}
    >
      {m.isActive ? <FaToggleOff /> : <FaToggleOn />}
    </button>
  </td>
</tr>

            ))
          )}
        </tbody>
      </table>
    </div>
  </>
)}


      {/* --- Styles for custom radio --- */}
      <style>{`
        .custom-radio-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          gap: 6px;
          position: relative;
        }
        .custom-radio-label input[type="radio"] {
          opacity: 0;
          position: absolute;
        }
        .custom-radio {
          width: 18px; height: 18px;
          border: 2.5px solid #1a5dd9;
          border-radius: 50%;
          position: relative;
        }
        .custom-radio-label input[type="radio"]:checked + .custom-radio::after {
          content: '';
          position: absolute;
          top: 4px; left: 4px;
          width: 8px; height: 8px;
          background-color: #1a5dd9;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default CreateMatrix;
