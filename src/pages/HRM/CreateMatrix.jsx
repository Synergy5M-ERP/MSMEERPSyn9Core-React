import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/apiconfig";
import { toast } from "react-toastify";

const CreateMatrix = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [reportingList, setReportingList] = useState([]);

  const [form, setForm] = useState({
    employeeId: "",
    empCode: "",
    department: "",
    departmentCode: "",
    designation: "",
    designationCode: "",
    authority: "",
    authorityCode: "",
    email: "",

    reportingEmployeeId: "",
    reportingEmpCode: "",
    rpDepartment: "",
    rpDepartmentCode: "",
    rpDesignation: "",
    rpDesignationCode: "",
    rpAuthority: "",
    rpAuthorityCode: "",
    reportingEmail: "",
    matrixCode: "",
  });

  // ================= LOAD EMPLOYEE LIST =================
  useEffect(() => {
    axios
      .get(API_ENDPOINTS.AUTHORITY_MATRIX)
      .then((res) => {
        setEmployeeList(res.data);
        setReportingList(res.data);
      })
      .catch(() => toast.error("Failed to load employees"));
  }, []);

  // ================= EMPLOYEE SELECT =================
  const handleEmployeeSelect = (e) => {
    const empId = e.target.value;
    const emp = employeeList.find((x) => x.id.toString() === empId);

    if (!emp) return;

    setForm((prev) => ({
      ...prev,
      employeeId: emp.id,
      empCode: emp.empCode,
      department: emp.department,
      departmentCode: emp.departmentCode,
      designation: emp.designation,
      designationCode: emp.designationCode,
      authority: emp.authority,
      authorityCode: emp.authorityCode,
      email: emp.email,
    }));
  };

  // ================= REPORTING EMPLOYEE SELECT =================
  const handleReportingSelect = (e) => {
    const empId = e.target.value;
    const emp = reportingList.find((x) => x.id.toString() === empId);

    if (!emp) return;

    setForm((prev) => ({
      ...prev,
      reportingEmployeeId: emp.id,
      reportingEmpCode: emp.empCode,
      rpDepartment: emp.department,
      rpDepartmentCode: emp.departmentCode,
      rpDesignation: emp.designation,
      rpDesignationCode: emp.designationCode,
      rpAuthority: emp.authority,
      rpAuthorityCode: emp.authorityCode,
      reportingEmail: emp.email,
      matrixCode: `${prev.empCode}-${emp.empCode}`,
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(API_ENDPOINTS.AUTHORITY_MATRIX, form)
      .then(() => toast.success("Authority Matrix Created Successfully"))
      .catch(() => toast.error("Error saving matrix"));
  };

  return (
    <div className="container mt-4 p-4 bg-light rounded shadow">
      <h3 className="text-center text-primary mb-4">
        CREATE AUTHORITY MATRIX
      </h3>

      <form onSubmit={handleSubmit}>

        {/* ================= AUTHORITY MATRIX OF ================= */}
        <h6 className="bg-warning p-2 mb-3">AUTHORITY MATRIX OF</h6>

        <div className="row mb-3">
          <div className="col-md-3">
            <label>SELECT EMPLOYEE</label>
            <select className="form-control" onChange={handleEmployeeSelect}>
              <option value="">SELECT EMPLOYEE</option>
              {employeeList.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label>EMPLOYEE CODE</label>
            <input className="form-control" value={form.empCode} readOnly />
          </div>

          <div className="col-md-3">
            <label>DEPARTMENT</label>
            <input className="form-control" value={form.department} readOnly />
          </div>

          <div className="col-md-3">
            <label>DEPARTMENT CODE</label>
            <input className="form-control" value={form.departmentCode} readOnly />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-3">
            <label>DESIGNATION</label>
            <input className="form-control" value={form.designation} readOnly />
          </div>

          <div className="col-md-3">
            <label>DESIGNATION CODE</label>
            <input className="form-control" value={form.designationCode} readOnly />
          </div>

          <div className="col-md-3">
            <label>AUTHORITY</label>
            <input className="form-control" value={form.authority} readOnly />
          </div>

          <div className="col-md-3">
            <label>AUTHORITY CODE</label>
            <input className="form-control" value={form.authorityCode} readOnly />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-3">
            <label>EMAIL</label>
            <input className="form-control" value={form.email} readOnly />
          </div>
        </div>

        {/* ================= REPORTING TO ================= */}
        <h6 className="bg-warning p-2 mt-4 mb-3">REPORTING TO</h6>

        <div className="row mb-3">
          <div className="col-md-3">
            <label>REPORTING EMPLOYEE</label>
            <select className="form-control" onChange={handleReportingSelect}>
              <option value="">SELECT EMPLOYEE</option>
              {reportingList.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label>EMPLOYEE CODE</label>
            <input className="form-control" value={form.reportingEmpCode} readOnly />
          </div>

          <div className="col-md-3">
            <label>RP DEPARTMENT</label>
            <input className="form-control" value={form.rpDepartment} readOnly />
          </div>

          <div className="col-md-3">
            <label>RP DEPARTMENT CODE</label>
            <input className="form-control" value={form.rpDepartmentCode} readOnly />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-3">
            <label>RP DESIGNATION</label>
            <input className="form-control" value={form.rpDesignation} readOnly />
          </div>

          <div className="col-md-3">
            <label>RP DESIGNATION CODE</label>
            <input className="form-control" value={form.rpDesignationCode} readOnly />
          </div>

          <div className="col-md-3">
            <label>RP AUTHORITY</label>
            <input className="form-control" value={form.rpAuthority} readOnly />
          </div>

          <div className="col-md-3">
            <label>RP AUTHORITY CODE</label>
            <input className="form-control" value={form.rpAuthorityCode} readOnly />
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-3">
            <label>EMAIL</label>
            <input className="form-control" value={form.reportingEmail} readOnly />
          </div>

          <div className="col-md-3">
            <label>MATRIX CODE</label>
            <input className="form-control" value={form.matrixCode} readOnly />
          </div>
        </div>

        <div className="text-center">
          <button className="btn btn-success px-5">
            SUBMIT
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMatrix;
