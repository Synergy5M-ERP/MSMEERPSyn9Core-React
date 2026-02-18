
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { API_ENDPOINTS } from "../../config/apiconfig";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaEdit, FaToggleOn, FaToggleOff, FaTrash } from "react-icons/fa";

// const CreateMatrix = () => {
//   const [selectedPage, setSelectedPage] = useState("viewMatrix");
//   const [statusFilter, setStatusFilter] = useState("active");
//   const [employeeList, setEmployeeList] = useState([]);
//   const [reportingList, setReportingList] = useState([]);
//   const [matrixList, setMatrixList] = useState([]);
//   const [editId, setEditId] = useState(null);
//   const [departments, setDepartments] = useState([]);
//   const [designations, setDesignations] = useState([]);
//   const [authorities, setAuthorities] = useState([]);

//   useEffect(() => {
//     Promise.all([
//       axios.get(API_ENDPOINTS.Emp_Info),
//       axios.get(API_ENDPOINTS.DEPARTMENT),
//       axios.get(API_ENDPOINTS.DESIGNATION),
//       axios.get(API_ENDPOINTS.AUTHORITY_MATRIX),
//       axios.get(API_ENDPOINTS.MatrixList),
//     ])
//       .then(([emp, dept, desig, auth, matrix]) => {
//         setEmployeeList(emp.data);
//         setReportingList(emp.data);
//         setDepartments(dept.data);
//         setDesignations(desig.data);
//         setAuthorities(auth.data);
//         setMatrixList(matrix.data);
//           toast.success("✅ All data loaded successfully!"); 
//       })
//       .catch(() => toast.error("Failed to load data"));
//   }, []);

//   const initialForm = {
//     employeeId: "",
//     empCode: "",
//     empName: "",
//     department: "",
//     departmentCode: "",
//     designation: "",
//     designationCode: "",
//     reportingEmployeeId: "",
//     reportingEmpCode: "",
//     reportingEmpName: "",
//     rpDepartment: "",
//     rpDepartmentCode: "",
//     rpDesignation: "",
//     rpDesignationCode: "",
//     matrixCode: "",
//     isActive: true,
//   };

//   const [form, setForm] = useState(initialForm);

//   useEffect(() => {
//     axios
//       .get(API_ENDPOINTS.Emp_Info)
//       .then((res) => {
//         setEmployeeList(res.data);
//         setReportingList(res.data);
//       })
//       .catch(() => toast.error("Failed to load employees"));

//     loadMatrixList();
//   }, []);

//   const loadMatrixList = () => {
//     axios
//       .get(API_ENDPOINTS.MatrixList)
//       .then((res) => {
//         console.log("Matrix list:", res.data);
//         setMatrixList(res.data);
//       })
//       .catch((err) => {
//         console.error(err);
//         toast.error("Failed to load matrix list");
//       });
//   };

//   useEffect(() => {
//     if (!form.reportingEmpCode) return;
//     const matrixCode = `MC-${form.reportingEmpCode}`;
//     setForm(prev => ({
//       ...prev,
//       matrixCode,
//     }));
//   }, [form.reportingEmpCode]);

//   const handleEmployeeSelect = (e) => {
//     const empId = Number(e.target.value);
//     const emp = employeeList.find(x => x.employeeId === empId);
//     if (!emp) return;
//     setForm(prev => ({
//       ...prev,
//       employeeId: emp.employeeId,
//       empCode: emp.empCode,
//       empName: emp.fullName,
//       department: emp.department || "",
//       departmentCode: emp.departmentCode || "",
//       designation: emp.designation || "",
//       designationCode: emp.designationCode || "",
//     }));
//   };

//   const handleReportingSelect = (e) => {
//     const empId = Number(e.target.value);
//     const emp = reportingList.find(x => x.employeeId === empId);
//     if (!emp) return;
//     setForm(prev => ({
//       ...prev,
//       reportingEmployeeId: emp.employeeId,
//       reportingEmpCode: emp.empCode,
//       reportingEmpName: emp.fullName,
//       rpDepartment: emp.department || "",
//       rpDepartmentCode: emp.departmentCode || "",
//       rpDesignation: emp.designation || "",
//       rpDesignationCode: emp.designationCode || "",
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!form.employeeId || !form.reportingEmployeeId) {
//       toast.error("Please select employee and reporting employee");
//       return;
//     }
//     const payload = {
//       employeeId: form.employeeId,
//       reportingEmployeeId: form.reportingEmployeeId,
//       emp_Code: form.empCode,
//       reporting_EmpCode: form.reportingEmpCode,
//       employee_Name: form.empName,
//       department: form.department,
//       department_Code: form.departmentCode,
//       designation: form.designation,
//       designation_Code: form.designationCode,
//       rp_Department: form.rpDepartment,
//       rp_DepartmentCode: form.rpDepartmentCode,
//       reporting_EmployeeName: form.reportingEmpName,
//       rp_Designation: form.rpDesignation,
//       rp_DesignationCode: form.rpDesignationCode,
//       MatrixCode: form.matrixCode,
//       IsActive: form.isActive,
//     };

//     const apiCall = editId
//       ? axios.put(`${API_ENDPOINTS.EditMatrix}/${editId}`, payload)
//       : axios.post(API_ENDPOINTS.MatrixSave, payload);

//     apiCall
//       .then(() => {
//         toast.success(editId ? "Matrix updated successfully" : "Matrix created successfully");
//         setForm(initialForm);
//         setEditId(null);
//         loadMatrixList();
//       })
//       .catch((err) =>
//         toast.error(err.response?.data?.message || "Error saving matrix")
//       );
//   };

//   const handleEdit = (m) => {
//     const emp = employeeList.find(e => e.employeeId === m.employeeId);
//     const rep = employeeList.find(e => e.employeeId === m.reportingEmployeeId);
//     setEditId(m.id);
//     setForm({
//       employeeId: m.employeeId,
//       empCode: m.empCode,
//       empName: m.employeeName,
//       department: emp?.department || "",
//       departmentCode: emp?.departmentCode || "",
//       designation: emp?.designation || "",
//       designationCode: emp?.designationCode || "",
//       reportingEmployeeId: m.reportingEmployeeId,
//       reportingEmpCode: m.reportingEmpCode,
//       reportingEmpName: m.reportingEmployeeName,
//       rpDepartment: rep?.department || "",
//       rpDepartmentCode: rep?.departmentCode || "",
//       rpDesignation: rep?.designation || "",
//       rpDesignationCode: rep?.designationCode || "",
//       matrixCode: m.matrixCode,
//       isActive: m.isActive
//     });
//     setSelectedPage("createMatrix");
//   };

//   const handleCancel = () => {
//     setForm(initialForm);
//       toast.info("🔄 Form cancelled & reset"); 
//     setEditId(null);
//   };

//   const handleStatusChange = (id, status) => {
//      toast.info(status ? "🟢 Activating..." : "🔴 Deactivating...");  
//     axios.put(
//       `${API_ENDPOINTS.UpdateMatrixStatus}/${id}`,
//       JSON.stringify(status),
//       { headers: { "Content-Type": "application/json" } }
//     )
//       .then(() => {
//         toast.success("Status updated successfully");
//         loadMatrixList();
//       })
//       .catch(() => toast.error("Failed to update status"));
//   };

//   const filteredMatrixList = matrixList.filter((m) =>
//     statusFilter === "active" ? m.isActive : !m.isActive
//   );

//   return (
//     <>
//       <div className="container mt-4 p-4 bg-light rounded shadow">
//         <h2 className="text-primary mb-4">Organization Matrix Management</h2>

//         {/* Top controls */}
//         <div className="mb-3 bg-white p-3 rounded shadow-sm d-flex justify-content-between align-items-center">
//           <div className="d-flex gap-3">
//             <label className="label-color">
//               <input
//                 type="radio"
//                 name="mainView"
//                 checked={selectedPage === "viewMatrix"}
//                 onChange={() => setSelectedPage("viewMatrix")}
//               />{" "}
//               View Matrix
//             </label>

//             <label className="label-color">
//               <input
//                 type="radio"
//                 name="mainView"
//                 checked={selectedPage === "createMatrix"}
//                 onChange={() => setSelectedPage("createMatrix")}
//               />{" "}
//               Create Matrix
//             </label>
//           </div>

//           <div className="d-flex gap-3">
//             <label className="label-color">
//               <input
//                 type="radio"
//                 name="statusFilter"
//                 checked={statusFilter === "active"}
//                 onChange={() => setStatusFilter("active")}
//               />{" "}
//               Active
//             </label>

//             <label className="label-color">
//               <input
//                 type="radio"
//                 name="statusFilter"
//                 checked={statusFilter === "inactive"}
//                 onChange={() => setStatusFilter("inactive")}
//               />{" "}
//               Inactive
//             </label>
//           </div>
//         </div>

//         {/* CREATE MATRIX FORM */}
//         {selectedPage === "createMatrix" && (
//           <form onSubmit={handleSubmit}>
//             <h5 className="bg-warning p-2 mb-3">Authority Matrix Of</h5>
//             <div className="row mb-3">
//               <div className="col-md-3">
//                 <label className="label-color">Select Employee</label>
//                 <select
//                   className="input-field-style"
//                   onChange={handleEmployeeSelect}
//                   value={form.employeeId}
//                 >
//                   <option value="">Select Employee</option>
//                   {employeeList.map((emp) => (
//                     <option key={emp.employeeId} value={emp.employeeId}>
//                       {emp.fullName}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="col-md-3">
//                 <label className="label-color">Employee Code</label>
//                 <input className="input-field-style" value={form.empCode} readOnly disabled />
//               </div>
//               <div className="col-md-3">
//                 <label className="label-color">Department</label>
//                 <input className="input-field-style" value={form.department} readOnly disabled />
//               </div>
//               <div className="col-md-3">
//                 <label className="label-color">Department Code</label>
//                 <input className="input-field-style" value={form.departmentCode} readOnly disabled />
//               </div>
//             </div>

//             <div className="row mb-3">
//               <div className="col-md-3">
//                 <label className="label-color">Designation</label>
//                 <input className="input-field-style" value={form.designation} readOnly disabled />
//               </div>
//               <div className="col-md-3">
//                 <label className="label-color">Designation Code</label>
//                 <input className="input-field-style" value={form.designationCode} readOnly disabled />
//               </div>
//             </div>

//             <h5 className="bg-warning p-2 mt-4 mb-3">Reporting To</h5>
//             <div className="row mb-3">
//               <div className="col-md-3">
//                 <label className="label-color">Reporting Employee</label>
//                 <select className="input-field-style" onChange={handleReportingSelect} value={form.reportingEmployeeId}>
//                   <option value="">Select Employee</option>
//                   {reportingList.map((emp) => (
//                     <option key={emp.employeeId} value={emp.employeeId}>
//                       {emp.fullName}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="col-md-3">
//                 <label className="label-color">Employee Code</label>
//                 <input className="input-field-style" value={form.reportingEmpCode} readOnly disabled />
//               </div>
//               <div className="col-md-3">
//                 <label className="label-color">Rp Department</label>
//                 <input className="input-field-style" value={form.rpDepartment} readOnly disabled />
//               </div>
//               <div className="col-md-3">
//                 <label className="label-color">Rp Department Code</label>
//                 <input className="input-field-style" value={form.rpDepartmentCode} readOnly disabled />
//               </div>
//             </div>

//             <div className="row mb-3">
//               <div className="col-md-3">
//                 <label className="label-color">Rp Designation</label>
//                 <input className="input-field-style" value={form.rpDesignation} readOnly disabled />
//               </div>
//               <div className="col-md-3">
//                 <label className="label-color">Rp Designation Code</label>
//                 <input className="input-field-style" value={form.rpDesignationCode} readOnly disabled />
//               </div>
//               <div className="col-md-3">
//                 <label className="label-color">Matrix Code</label>
//                 <input className="input-field-style" value={form.matrixCode} readOnly disabled />
//               </div>
//             </div>

//             <div style={{ display: "flex", gap: "10px" }}>
//               <button type="submit" className="save-btn">
//                 {editId ? "Update" : "Create"}
//               </button>
//               <button type="button" className="cancel-btn" onClick={handleCancel}>
//                 Cancel
//               </button>
//             </div>
//           </form>
//         )}

//         {/* VIEW MATRIX LIST */}
//         {selectedPage === "viewMatrix" && (
//           <>
//             <div className="table-responsive">
//               <table className="table table-bordered table-sm">
//                 <thead>
//                   <tr>
//                     <th>Employee</th>
//                     <th>Emp Code</th>
//                     <th>Reporting Employee</th>
//                     <th>Reporting Emp code</th>
//                     <th>Matrix Code</th>
//                     <th style={{ width: "120px", textAlign: "center" }}>Edit</th>
//                     <th style={{ width: "120px", textAlign: "center" }}>
//                       {statusFilter === "active" ? "Deactivate" : "Activate"}
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredMatrixList.length === 0 ? (
//                     <tr>
//                       <td colSpan={7} className="text-center">
//                         No records found for status "{statusFilter}"
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredMatrixList.map((m) => (
//                       <tr key={m.id}>
//                         <td>{m.employeeName}</td>
//                         <td>{m.empCode}</td>
//                         <td>{m.reportingEmployeeName}</td>
//                         <td>{m.reportingEmpCode}</td>
//                         <td>{m.matrixCode}</td>
//                         <td className="text-center">
//                           <span
//                             title="Edit"
//                             onClick={() => handleEdit(m)}
//                             style={{
//                               cursor: "pointer",
//                               color: "#0d6efd",
//                               fontSize: "18px",
//                               marginRight: "15px"
//                             }}
//                           >
//                             <FaEdit />
//                           </span>
//                         </td>
//                         <td className="text-center">
//                           {m.isActive ? (
//                             <FaTrash
//                               title="Deactivate"
//                               className="text-danger"
//                               style={{ cursor: "pointer" }}
//                               onClick={() => handleStatusChange(m.id, false)}
//                             />
//                           ) : (
//                             <button
//                               title="Activate"
//                               onClick={() => handleStatusChange(m.id, true)}
//                               style={{
//                                 cursor: "pointer",
//                                 backgroundColor: "#28a745",
//                                 color: "#fff",
//                                 border: "none",
//                                 padding: "6px 14px",
//                                 borderRadius: "4px",
//                                 fontSize: "14px",
//                                 fontWeight: "600"
//                               }}
//                             >
//                               Activate
//                             </button>
//                           )}
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </>
//         )}
//       </div>
//  <ToastContainer 
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={true}
//         closeOnClick={true}
//         rtl={false}
//         pauseOnFocusLoss={false}
//         draggable={true}
//         pauseOnHover={true}
//         theme="light"
//         closeButton={true}
//         limit={5}
//       />
//       {/* Toast Container Styling */}
//       <style jsx global>{`
//         /* Toast Container */
//         .Toastify__toast-container {
//           z-index: 9999;
//           top: 20px;
//           right: 20px;
//           width: 400px;
//         }

//         .Toastify__toast {
//           border-radius: 12px !important;
//           padding: 16px 20px !important;
//           margin-bottom: 12px !important;
//           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
//           box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
//           backdrop-filter: blur(10px) !important;
//           border: 1px solid rgba(255, 255, 255, 0.2) !important;
//           min-height: 64px !important;
//           animation: slideInRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
//         }

//         .Toastify__toast--success {
//           background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
//           color: white !important;
//           border-left: 4px solid #34d399 !important;
//         }

//         .Toastify__toast--error {
//           background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
//           color: white !important;
//           border-left: 4px solid #f87171 !important;
//         }

//         .Toastify__toast-body {
//           margin: 0 !important;
//           font-size: 15px !important;
//           font-weight: 500 !important;
//           line-height: 1.5 !important;
//         }

//         .Toastify__toast--success .Toastify__toast-body {
//           font-weight: 600 !important;
//         }

//         .Toastify__toast--error .Toastify__toast-body {
//           font-weight: 600 !important;
//         }

//         /* Toast Close Button */
//         .Toastify__close-button {
//           color: rgba(255, 255, 255, 0.8) !important;
//           font-size: 20px !important;
//           opacity: 0.7 !important;
//           transition: all 0.3s ease !important;
//         }

//         .Toastify__close-button:hover,
//         .Toastify__close-button:focus {
//           opacity: 1 !important;
//           transform: scale(1.1) !important;
//           color: white !important;
//         }

//         /* Toast Progress Bar */
//         .Toastify__progress-bar {
//           height: 4px !important;
//           border-radius: 0 0 12px 12px !important;
//         }

//         .Toastify__toast--success .Toastify__progress-bar {
//           background: rgba(255, 255, 255, 0.4) !important;
//         }

//         .Toastify__toast--error .Toastify__progress-bar {
//           background: rgba(255, 255, 255, 0.4) !important;
//         }

//         /* Animations */
//         @keyframes slideInRight {
//           from {
//             transform: translateX(100%);
//             opacity: 0;
//           }
//           to {
//             transform: translateX(0);
//             opacity: 1;
//           }
//         }

//         @keyframes slideOutRight {
//           from {
//             transform: translateX(0);
//             opacity: 1;
//           }
//           to {
//             transform: translateX(100%);
//             opacity: 0;
//           }
//         }

//         /* Responsive */
//         @media (max-width: 480px) {
//           .Toastify__toast-container {
//             right: 10px !important;
//             left: 10px !important;
//             width: auto !important;
//             top: 10px !important;
//           }
          
//           .Toastify__toast {
//             margin-bottom: 8px !important;
//             padding: 14px 16px !important;
//             font-size: 14px !important;
//           }
//         }

//         /* Ensure global override */
//         .Toastify__toast-container--top-right {
//           top: 20px !important;
//           right: 20px !important;
//         }
//       `}</style>
       
//     </>
//   );
// };

// export default CreateMatrix;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/apiconfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash } from "react-icons/fa";

const CreateMatrix = () => {
  const [selectedPage, setSelectedPage] = useState("viewMatrix");
  const [statusFilter, setStatusFilter] = useState("active");
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
    reportingEmployeeId: "",
    reportingEmpCode: "",
    reportingEmpName: "",
    rpDepartment: "",
    rpDepartmentCode: "",
    rpDesignation: "",
    rpDesignationCode: "",
    matrixCode: "",
    isActive: true,
  };

  const [form, setForm] = useState(initialForm);

  // Initial data load
  useEffect(() => {
    Promise.all([
      axios.get(API_ENDPOINTS.Emp_Info),
      axios.get(API_ENDPOINTS.MatrixList),
    ])
      .then(([emp, matrix]) => {
        setEmployeeList(emp.data);
        setReportingList(emp.data);
        setMatrixList(matrix.data);
        toast.success("✅ All data loaded successfully!");
      })
      .catch(() => toast.error("❌ Failed to load data"));
  }, []);

  // Auto-generate matrix code
  useEffect(() => {
    if (!form.reportingEmpCode) return;
    const matrixCode = `MC-${form.reportingEmpCode}`;
    setForm((prev) => ({
      ...prev,
      matrixCode,
    }));
  }, [form.reportingEmpCode]);

  const loadMatrixList = () => {
    axios
      .get(API_ENDPOINTS.MatrixList)
      .then((res) => {
        setMatrixList(res.data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("❌ Failed to load matrix list");
      });
  };

  const handleEmployeeSelect = (e) => {
    const empId = Number(e.target.value);
    const emp = employeeList.find((x) => x.employeeId === empId);
    if (!emp) return;
    setForm((prev) => ({
      ...prev,
      employeeId: emp.employeeId,
      empCode: emp.empCode,
      empName: emp.fullName,
      department: emp.department || "",
      departmentCode: emp.departmentCode || "",
      designation: emp.designation || "",
      designationCode: emp.designationCode || "",
    }));
  };

  const handleReportingSelect = (e) => {
    const empId = Number(e.target.value);
    const emp = reportingList.find((x) => x.employeeId === empId);
    if (!emp) return;
    setForm((prev) => ({
      ...prev,
      reportingEmployeeId: emp.employeeId,
      reportingEmpCode: emp.empCode,
      reportingEmpName: emp.fullName,
      rpDepartment: emp.department || "",
      rpDepartmentCode: emp.departmentCode || "",
      rpDesignation: emp.designation || "",
      rpDesignationCode: emp.designationCode || "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!form.employeeId || !form.reportingEmployeeId) {
      toast.error("⚠️ Please select employee and reporting employee");
      return;
    }

    const payload = {
      employeeId: form.employeeId,
      reportingEmployeeId: form.reportingEmployeeId,
      emp_Code: form.empCode,
      reporting_EmpCode: form.reportingEmpCode,
      employee_Name: form.empName,
      department: form.department,
      department_Code: form.departmentCode,
      designation: form.designation,
      designation_Code: form.designationCode,
      rp_Department: form.rpDepartment,
      rp_DepartmentCode: form.rpDepartmentCode,
      reporting_EmployeeName: form.reportingEmpName,
      rp_Designation: form.rpDesignation,
      rp_DesignationCode: form.rpDesignationCode,
      MatrixCode: form.matrixCode,
      IsActive: form.isActive,
    };

    const apiCall = editId
      ? axios.put(`${API_ENDPOINTS.EditMatrix}/${editId}`, payload)
      : axios.post(API_ENDPOINTS.MatrixSave, payload);

    apiCall
      .then(() => {
        toast.success(
          editId ? "✅ Matrix updated successfully!" : "✅ Matrix created successfully!"
        );
        setForm(initialForm);
        setEditId(null);
        loadMatrixList();
        setSelectedPage("viewMatrix");
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.message || "Error saving matrix";
        toast.error(`❌ ${errorMsg}`);
      });
  };

  const handleEdit = (m) => {
    const emp = employeeList.find((e) => e.employeeId === m.employeeId);
    const rep = employeeList.find((e) => e.employeeId === m.reportingEmployeeId);
    
    setEditId(m.id);
    setForm({
      employeeId: m.employeeId,
      empCode: m.empCode,
      empName: m.employeeName,
      department: emp?.department || "",
      departmentCode: emp?.departmentCode || "",
      designation: emp?.designation || "",
      designationCode: emp?.designationCode || "",
      reportingEmployeeId: m.reportingEmployeeId,
      reportingEmpCode: m.reportingEmpCode,
      reportingEmpName: m.reportingEmployeeName,
      rpDepartment: rep?.department || "",
      rpDepartmentCode: rep?.departmentCode || "",
      rpDesignation: rep?.designation || "",
      rpDesignationCode: rep?.designationCode || "",
      matrixCode: m.matrixCode,
      isActive: m.isActive,
    });
    setSelectedPage("createMatrix");
    toast.info("📝 Editing matrix record");
  };

  const handleCancel = () => {
    setForm(initialForm);
    setEditId(null);
    toast.info("🔄 Form reset");
  };

  const handleStatusChange = (id, status) => {
    const message = status ? "🟢 Activating..." : "🔴 Deactivating...";
    toast.info(message);

    axios
      .put(
        `${API_ENDPOINTS.UpdateMatrixStatus}/${id}`,
        JSON.stringify(status),
        { headers: { "Content-Type": "application/json" } }
      )
      .then(() => {
        toast.success(
          status ? "✅ Activated successfully!" : "✅ Deactivated successfully!"
        );
        loadMatrixList();
      })
      .catch(() => toast.error("❌ Failed to update status"));
  };

  const filteredMatrixList = matrixList.filter((m) =>
    statusFilter === "active" ? m.isActive : !m.isActive
  );

  return (
    <>
      <div className="container mt-4 p-4 bg-light rounded shadow">
        <h2 className="text-primary mb-4">Organization Matrix Management</h2>

        {/* Top controls */}
        <div className="mb-3 bg-white p-3 rounded shadow-sm d-flex justify-content-between align-items-center">
          <div className="d-flex gap-3">
            <label className="label-color">
              <input
                type="radio"
                name="mainView"
                checked={selectedPage === "viewMatrix"}
                onChange={() => setSelectedPage("viewMatrix")}
              />{" "}
              View Matrix
            </label>

            <label className="label-color">
              <input
                type="radio"
                name="mainView"
                checked={selectedPage === "createMatrix"}
                onChange={() => setSelectedPage("createMatrix")}
              />{" "}
              Create Matrix
            </label>
          </div>

          <div className="d-flex gap-3">
            <label className="label-color">
              <input
                type="radio"
                name="statusFilter"
                checked={statusFilter === "active"}
                onChange={() => setStatusFilter("active")}
              />{" "}
              Active
            </label>

            <label className="label-color">
              <input
                type="radio"
                name="statusFilter"
                checked={statusFilter === "inactive"}
                onChange={() => setStatusFilter("inactive")}
              />{" "}
              Inactive
            </label>
          </div>
        </div>

        {/* CREATE MATRIX FORM */}
        {selectedPage === "createMatrix" && (
          <form onSubmit={handleSubmit}>
            <h5 className="bg-warning p-2 mb-3">Authority Matrix Of</h5>
            <div className="row mb-3">
              <div className="col-md-3">
                <label className="label-color">Select Employee</label>
                <select
                  className="input-field-style"
                  onChange={handleEmployeeSelect}
                  value={form.employeeId}
                  required
                >
                  <option value="">Select Employee</option>
                  {employeeList.map((emp) => (
                    <option key={emp.employeeId} value={emp.employeeId}>
                      {emp.fullName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label className="label-color">Employee Code</label>
                <input
                  className="input-field-style"
                  value={form.empCode}
                  readOnly
                  disabled
                />
              </div>
              <div className="col-md-3">
                <label className="label-color">Department</label>
                <input
                  className="input-field-style"
                  value={form.department}
                  readOnly
                  disabled
                />
              </div>
              <div className="col-md-3">
                <label className="label-color">Department Code</label>
                <input
                  className="input-field-style"
                  value={form.departmentCode}
                  readOnly
                  disabled
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-3">
                <label className="label-color">Designation</label>
                <input
                  className="input-field-style"
                  value={form.designation}
                  readOnly
                  disabled
                />
              </div>
              <div className="col-md-3">
                <label className="label-color">Designation Code</label>
                <input
                  className="input-field-style"
                  value={form.designationCode}
                  readOnly
                  disabled
                />
              </div>
            </div>

            <h5 className="bg-warning p-2 mt-4 mb-3">Reporting To</h5>
            <div className="row mb-3">
              <div className="col-md-3">
                <label className="label-color">Reporting Employee</label>
                <select
                  className="input-field-style"
                  onChange={handleReportingSelect}
                  value={form.reportingEmployeeId}
                  required
                >
                  <option value="">Select Employee</option>
                  {reportingList.map((emp) => (
                    <option key={emp.employeeId} value={emp.employeeId}>
                      {emp.fullName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label className="label-color">Employee Code</label>
                <input
                  className="input-field-style"
                  value={form.reportingEmpCode}
                  readOnly
                  disabled
                />
              </div>
              <div className="col-md-3">
                <label className="label-color">Rp Department</label>
                <input
                  className="input-field-style"
                  value={form.rpDepartment}
                  readOnly
                  disabled
                />
              </div>
              <div className="col-md-3">
                <label className="label-color">Rp Department Code</label>
                <input
                  className="input-field-style"
                  value={form.rpDepartmentCode}
                  readOnly
                  disabled
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-3">
                <label className="label-color">Rp Designation</label>
                <input
                  className="input-field-style"
                  value={form.rpDesignation}
                  readOnly
                  disabled
                />
              </div>
              <div className="col-md-3">
                <label className="label-color">Rp Designation Code</label>
                <input
                  className="input-field-style"
                  value={form.rpDesignationCode}
                  readOnly
                  disabled
                />
              </div>
              <div className="col-md-3">
                <label className="label-color">Matrix Code</label>
                <input
                  className="input-field-style"
                  value={form.matrixCode}
                  readOnly
                  disabled
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" className="save-btn">
                {editId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* VIEW MATRIX LIST */}
        {selectedPage === "viewMatrix" && (
          <>
            <div className="table-responsive">
              <table className="table table-bordered table-sm">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Emp Code</th>
                    <th>Reporting Employee</th>
                    <th>Reporting Emp code</th>
                    <th>Matrix Code</th>
                    <th style={{ width: "120px", textAlign: "center" }}>
                      Edit
                    </th>
                    <th style={{ width: "120px", textAlign: "center" }}>
                      {statusFilter === "active" ? "Deactivate" : "Activate"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMatrixList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center">
                        No records found for status "{statusFilter}"
                      </td>
                    </tr>
                  ) : (
                    filteredMatrixList.map((m) => (
                      <tr key={m.id}>
                        <td>{m.employeeName}</td>
                        <td>{m.empCode}</td>
                        <td>{m.reportingEmployeeName}</td>
                        <td>{m.reportingEmpCode}</td>
                        <td>{m.matrixCode}</td>
                        <td className="text-center">
                          <span
                            title="Edit"
                            onClick={() => handleEdit(m)}
                            style={{
                              cursor: "pointer",
                              color: "#0d6efd",
                              fontSize: "18px",
                              marginRight: "15px",
                            }}
                          >
                            <FaEdit />
                          </span>
                        </td>
                        <td className="text-center">
                          {m.isActive ? (
                            <FaTrash
                              title="Deactivate"
                              className="text-danger"
                              style={{ cursor: "pointer", fontSize: "18px" }}
                              onClick={() => handleStatusChange(m.id, false)}
                            />
                          ) : (
                            <button
                              title="Activate"
                              onClick={() => handleStatusChange(m.id, true)}
                              style={{
                                cursor: "pointer",
                                backgroundColor: "#28a745",
                                color: "#fff",
                                border: "none",
                                padding: "6px 14px",
                                borderRadius: "4px",
                                fontSize: "14px",
                                fontWeight: "600",
                              }}
                            >
                              Activate
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={true}
        pauseOnHover={true}
        theme="light"
        closeButton={true}
        limit={5}
      /> */}
    </>
  );
};

export default CreateMatrix;