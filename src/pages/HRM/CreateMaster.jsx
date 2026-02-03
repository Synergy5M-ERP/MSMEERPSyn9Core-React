// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Save, Edit, Trash2 } from "lucide-react";
// import { API_ENDPOINTS } from "../../config/apiconfig";


// const API_BASE_URL = "https://msmeerpsyn9-core.azurewebsites.net/api/HrmMaster";

// //const API_BASE_URL= "https://localhost:7145/api/HrmMaster";

// /* ================= DROPDOWN OPTIONS ================= */
// const LEVEL_OPTIONS = [
//   { label: "Select Level", value: "" },
//   ...Array.from({ length: 9 }, (_, i) => ({
//     label: `${i + 1}`,
//     value: i + 1,   // ✅ NUMBER
//   })),
// ];


// const QUALIFICATION_OPTIONS = [
//   { label: "Select Qualification", value: "" },
//   { label: "B PHARM", value: "B PHARM" },
//   { label: "M PHARM", value: "M PHARM" },
//   { label: "BSC MBA", value: "BSC MBA" },
//   { label: "CA/CS", value: "CA/CS" },
//   { label: "BCOM MBA", value: "BCOM MBA" },
//   { label: "GRADUATE (SCIENCE)", value: "GRADUATE (SCIENCE)" },
//   { label: "GRADUATE (COMMERCE)", value: "GRADUATE (COMMERCE)" },
//   { label: "ENG PG (IT)", value: "ENG_PG_IT" },
//   { label: "BE (MECH)", value: "BE (MECH)" },
//   { label: "BE (ELE)", value: "BE (ELE)" },
//   { label: "BE (IT)", value: "BE (IT)" },
//   { label: "BE (CHEM)", value: "BE (CHEM)" },
//   { label: "ENGINEERING DIPLOMA", value: "ENG_DIPLOMA" },
//   { label: "ITI TRAINED", value: "ITI" },
//   { label: "12TH STANDARD", value: "12TH_STANDARD" },
// ];

// const EXPERIENCE_OPTIONS = [
//   { label: "Select Experience", value: "" },
//   { label: "0-2 YEAR", value: "0-2 YEAR" },
//   { label: "2-4 YEAR", value: "2-4 YEAR" },
//   { label: "5-10 YEAR", value: "5-10 YEAR" },
//   { label: "10-20 YEAR", value: "10-20 YEAR" },
//   { label: "20 YEAR AND ABOVE", value: "20 YEAR AND ABOVE" },
// ];
// function CreateMaster() {
//   const [formType, setFormType] = useState("Department");
//   const [tableData, setTableData] = useState([]);
//   const [name, setName] = useState("");
//   const [code, setCode] = useState("");
//   const [editingId, setEditingId] = useState(null);
//   const [isActive, setIsActive] = useState(true);
//   const [activeFilter, setActiveFilter] = useState("active");

//   // const [departments, setDepartments] = useState([]);
//   // const [designations, setDesignations] = useState([]);
//   // const [currencies, setCurrencies] = useState([]);
//   // const [countries, setCountries] = useState([]);
//   // const [states, setStates] = useState([]);
//   // const [cities, setCities] = useState([]);
//   // const [industries, setIndustries] = useState([]);
//   // const [organizationTable, setOrganizationTable] = useState([]);

// const [departments, setDepartments] = useState([]);
// const [designations, setDesignations] = useState([]);
// const [currencies, setCurrencies] = useState([]);
// const [countries, setCountries] = useState([]);
// const [states, setStates] = useState([]);
// const [cities, setCities] = useState([]);
// const [industries, setIndustries] = useState([]);
// const [organizationTable, setOrganizationTable] = useState([]);
// const [editingOrgId, setEditingOrgId] = useState(null);
// const [editingOrgIndex, setEditingOrgIndex] = useState(null);

// // ------------------ BUILD ORGANIZATION FORM STATE ------------------
// const [orgForm, setOrgForm] = useState({
//   department: "",
//   position: "",
//   level: "",

//   qualification: "",
//   experience: "",
//   industry: "",
//   country: "",
//   state: "",
//   city: "",
//   currency: "",
//   budgetMin: "",
//   budgetMax: "",
//   onboardDate: "",
// });

// // ORGANIZATION TABLE
// const [orgTable, setOrgTable] = useState([]);



//   useEffect(() => {
//     fetchIndustries();
//   }, []);

//   useEffect(() => {
//     fetchCurrencies();
//   }, []);



//   useEffect(() => {
//     if (formType === "ViewOrganization") {
//       const fetchOrganizationData = async () => {
//         try {
//           // ✅ Correct URL here
//           const res = await axios.get(`${API_BASE_URL}/Organization`);
//           let data = res.data || [];
//           data = data.filter((x) =>
//             activeFilter === "active" ? x.isActive !== false : x.isActive === false
//           );
//           setOrganizationTable(data);
//         } catch (err) {
//           toast.error("Failed to load organization data");
//           console.error(err);
//         }
//       };
//       fetchOrganizationData();
//     }
//   }, [formType, activeFilter]);

//   const deleteOrgRow = (index) => {
//     setOrgTable((prev) => prev.filter((_, i) => i !== index));
//   };
//   const editOrgRow = (row, index) => {
//     setOrgForm({ ...row });        // put data back into form
//     setOrgTable((prev) => prev.filter((_, i) => i !== index)); // remove temp row
//   };

//   const toggleOrganizationActive = async (id, activate) => {
//     try {
//       await axios.put(`${API_BASE_URL}/Organization/${id}`, { isActive: activate });
//       toast.success(activate ? "Activated" : "Deactivated");

//       // Refresh
//       const res = await axios.get(`${API_BASE_URL}/Organization`);
//       let data = res.data || [];
//       data = data.filter((x) =>
//         activeFilter === "active" ? x.isActive !== false : x.isActive === false
//       );
//       setOrganizationTable(data);
//     } catch (err) {
//       toast.error("Status update failed");
//       console.error(err);
//     }
//   };
// =======
// const fetchOrganizations = async () => {
//   try {
//     const res = await axios.get(
//       `${API_BASE_URL}/Organization`,
//       {
//         params: {
//           status: activeFilter   // ✅ SEND active / inactive
//         }
//       }
//     );

//     setOrganizationTable(res.data || []);
//   } catch (err) {
//     console.error(err);
//     toast.error("Failed to load organization data");
//   }
// };


// useEffect(() => {
//   if (formType === "ViewOrganization") {
//     fetchOrganizations();
//   }
// }, [formType, activeFilter]);

// const deleteOrgRow = (index) => {
//   setOrgTable((prev) => prev.filter((_, i) => i !== index));
// };
// const editOrgRow = (row, index) => {
//   setEditingOrgIndex(index);
//   setEditingOrgId(row.organizationId);

//   // Map the row values to match dropdown IDs
//   setOrgForm({
//     department: row.deptId ?? "",           // should match departments.deptId
//     position: row.designationId ?? "",      // should match designations.designationId
//     level: row.level ?? "",
//     qualification: row.qualification ?? "",
//     experience: row.experience ?? "",
//     industry: row.industryId ?? "",         // industries.industryId
//     country: row.countryId ?? "",           // countries.country_id
//     state: row.stateId ?? "",               // states.state_id
//     city: row.cityId ?? "",                 // cities.city_id
//     currency: row.currencyId ?? "",         // currencies.currencyId
//     budgetMin: row.minBudget ?? "",
//     budgetMax: row.maxBudget ?? "",
//     onboardDate: row.onBoardDate?.split("T")[0] ?? "",
//   });

//   // fetch dependent dropdowns
//   if (row.countryId) fetchStates(Number(row.countryId));
//   if (row.stateId) fetchCities(Number(row.stateId));
// };


// const toggleOrganizationActive = async (id, activate) => {
//   try {
//     await axios.put(
//       `${API_BASE_URL}/Organization/${id}`,
//       { isActive: activate }   // ✅ MUST be isActive
//     );

//     toast.success(
//       activate ? "Organization activated" : "Organization deactivated"
//     );

//     fetchOrganizations();
//   } catch (err) {
//     console.error(err);
//     toast.error("Failed to update status");
//   }
// };





//   const fetchIndustries = async () => {
//     const res = await axios.get(API_ENDPOINTS.GET_INDUSTRY);
//     setIndustries(res.data);
//   };




// // const fetchIndustries = async () => {
// //   const res = await axios.get(API_ENDPOINTS.GET_INDUSTRY);
// //   setIndustries(res.data);
// // };


//   const fetchCountries = async () => {
//     const res = await axios.get(API_ENDPOINTS.GET_COUNTRY);
//     setCountries(res.data);
//     setStates([]);
//     setCities([]);
//   };

//   const fetchStates = async (country) => {
//     const res = await axios.get(API_ENDPOINTS.GET_STATE, {
//       params: { country },
//     });
//     setStates(res.data);
//     setCities([]);
//   };

//   const fetchCities = async (country, state) => {
//     const res = await axios.get(API_ENDPOINTS.GET_CITY, {
//       params: { country, state },
//     });
//     setCities(res.data);
//   };

// const fetchStates = async (countryId) => {
//   const res = await axios.get(API_ENDPOINTS.GET_STATE, {
//     params: { countryId },   // ✅ MATCH API
//   });
//   setStates(res.data);
//   setCities([]);
// };

// useEffect(() => {
//   if (orgForm.state) {
//     fetchCities(Number(orgForm.state)); // ✅ convert to number
//   }
// }, [orgForm.state]);

// const fetchCities = async (stateId) => {
//   if (!stateId) return;
//   try {
//     const res = await axios.get(API_ENDPOINTS.GET_CITY, {
//       params: { stateId }  // ✅ match API
//     });
//     setCities(res.data);
//   } catch (err) {
//     console.error(err);
//     toast.error("Failed to load cities");
//   }
// };




//   /* ================= BUILD ORGANIZATION ================= */



//   const handleOrgChange = (e) => {
//     const { name, value } = e.target;
//     setOrgForm((prev) => ({ ...prev, [name]: value }));
//   };

// const handleOrgChange = (e) => {
//   const { name, value } = e.target;

//   setOrgForm((prev) => ({
//     ...prev,
//     [name]: name === "level" ? Number(value) : value,
//   }));
// };


// const addOrgRow = () => {
//   if (Object.values(orgForm).some((v) => !v)) {
//     toast.warning("Please fill all fields");
//     return;
//   }

//   if (editingOrgIndex !== null) {
//     // update row
//     setOrgTable((prev) =>
//       prev.map((row, idx) =>
//         idx === editingOrgIndex ? { ...orgForm, isActive: true } : row
//       )
//     );
//     setEditingOrgIndex(null);
//   } else {
//     // add new row
//     setOrgTable((prev) => [...prev, { ...orgForm, isActive: true }]);
//   }

//   // ✅ CLEAR FORM ONLY WHEN NOT UPDATING
//   if (!editingOrgId) {
//     setOrgForm({
//       department: "",
//       position: "",
//       level: "",
//       qualification: "",
//       experience: "",
//       industry: "",
//       country: "",
//       state: "",
//       city: "",
//       currency: "",
//       budgetMin: "",
//       budgetMax: "",
//       onboardDate: "",
//     });

//   };
//   useEffect(() => {
//     fetchDepartments();
//     fetchDesignations();
//   }, []);
//   const fetchCurrencies = async () => {
//     try {
//       const res = await axios.get(API_ENDPOINTS.GET_CURRENCY);
//       setCurrencies(res.data); // assuming API returns [{ Id, Currency_Code }]
//     } catch (err) {
//       toast.error("Failed to load currencies");
//     }
//   };

//   }
// };




// useEffect(() => {
//   fetchDepartments();
//   fetchDesignations();
// }, []);
// const fetchCurrencies = async () => {
//   try {
//     const res = await axios.get(API_ENDPOINTS.GET_CURRENCY);
//     setCurrencies(res.data); // assuming API returns [{ Id, Currency_Code }]
//   } catch (err) {
//     toast.error("Failed to load currencies");
//   }
// };


//   const fetchDepartments = async () => {
//     try {
//       const res = await axios.get(API_ENDPOINTS.DEPARTMENT);

//       setDepartments(res.data);
//     } catch (err) {
//       console.error("Department load failed");
//     }
//   };

//   const fetchDesignations = async () => {
//     try {
//       const res = await axios.get(API_ENDPOINTS.DESIGNATION);

//       setDesignations(res.data);
//     } catch (err) {
//       console.error("Designation load failed");
//     }
//   };
//   //
//   // COUNTRY → STATE
//   // LOAD COUNTRIES ON PAGE LOAD
//   useEffect(() => {
//     fetchCountries();
//   }, []);

//   useEffect(() => {
//     if (orgForm.country) {
//       fetchStates(orgForm.country);
//     }
//   }, [orgForm.country]); // ✅ correct


//   // STATE → CITY
//   useEffect(() => {
//     if (orgForm.country && orgForm.state) {
//       fetchCities(orgForm.country, orgForm.state);
//     }
//   }, [orgForm.state]);



//   const submitOrganization = async () => {
//     if (orgTable.length === 0) {
//       toast.warning("No data to submit");
//       return;
//     }

//     try {
//       await axios.post(
//         API_ENDPOINTS.ORG_CHART_WITH_BUDGET,
//         orgTable,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       toast.success("Organization submitted successfully!");
//       setOrgTable([]);
//     } catch (err) {
//       console.error(err);
//       toast.error("Submission failed");
//     }
//   };

// // STATE → CITY

// useEffect(() => {
//   if (orgForm.state) {
//     fetchCities(Number(orgForm.state));
//   }
// }, [orgForm.state]);

// const submitOrganization = async () => {
//   try {
//     if (orgTable.length === 0) {
//       toast.error("Please add at least one organization row");
//       return;
//     }

//     const payload = orgTable.map(row => {
//       const dept = departments.find(d => d.deptId == row.department);
//       const desig = designations.find(d => d.designationId == row.position);
//       const ind = industries.find(i => i.industryId == row.industry);
//       const country = countries.find(c => c.country_id == row.country);
//       const state = states.find(s => s.state_id == row.state);
//       const city = cities.find(c => c.city_id == row.city);
//       const currency = currencies.find(c => c.currencyId == row.currency);

//       if (!dept || !desig || !ind || !country || !state || !city || !currency) {
//         throw new Error("Invalid dropdown mapping");
//       }

//       return {
//         Department: dept.deptName,
//         Position: desig.designationName,
//         Industry: ind.industryName,
//         Country: country.country_name,
//         State: state.state_name,
//         City: city.city_name,
//         Currency: currency.currency_Code,
//         Level: Number(row.level),
//         Qualification: row.qualification,
//         Experience: row.experience,
//         BudgetMin: Number(row.budgetMin),
//         BudgetMax: Number(row.budgetMax),
//         OnboardDate: row.onboardDate
//       };
//     });

//     await axios.post(`${API_BASE_URL}/OrgChartWithBudget`, payload);

//     toast.success("Organization created successfully");
//     setOrgTable([]);
//     setFormType("ViewOrganization");

//   } catch (err) {
//     console.error(err);
//     toast.error("Save failed: " + err.message);
//   }
// };
// const updateOrganization = async () => {
//   try {
//     if (!editingOrgId) {
//       toast.warning("No organization selected");
//       return;
//     }

//     if (!orgForm.onboardDate) {
//       toast.error("Onboard Date is required");
//       return;
//     }
//     if (!orgForm.qualification || !orgForm.experience) {
//   toast.error("Qualification and Experience are required");
//   return;
// }


//   const payload = {
//   DeptId: Number(orgForm.department),
//   DesignationId: Number(orgForm.position),
//   IndustryId: Number(orgForm.industry),
//   CountryId: Number(orgForm.country),
//   StateId: Number(orgForm.state),
//   CityId: Number(orgForm.city),
//   CurrencyId: Number(orgForm.currency),
//   Level: Number(orgForm.level),
//   Qualification: orgForm.qualification,
//   Experience: orgForm.experience,
//   MinBudget: Number(orgForm.budgetMin),
//   MaxBudget: Number(orgForm.budgetMax),
//   OnBoardDate: orgForm.onboardDate // yyyy-MM-dd is OK
// };

//     await axios.put(
//       `${API_BASE_URL}/OrganizationUpdate/${editingOrgId}`,
//       payload
//     );

//     toast.success("Organization updated successfully");

//     setEditingOrgId(null);
//     setEditingOrgIndex(null);
//     setFormType("ViewOrganization");

//     const res = await axios.get(`${API_BASE_URL}/Organization`);
//     setOrganizationTable(res.data || []);
//   } catch (err) {
//     console.error(err);
//     toast.error("Update failed");
//   }
// };






//   const fetchTableData = useCallback(async () => {
//     if (formType === "BuildOrganization" || formType === "ViewOrganization") return;

//     try {
//       const res = await axios.get(`${API_BASE_URL}/${formType}`);
//       let data = res.data || [];

//       data = data.filter((x) =>
//         activeFilter === "active" ? x.isActive !== false : x.isActive === false
//       );

//       setTableData(data);
//     } catch {
//       toast.error("Failed to load data");
//     }
//   }, [formType, activeFilter]);

//   useEffect(() => {
//     fetchTableData();
//   }, [fetchTableData]);

//   /* ================= MASTER SAVE ================= */
//   const resetForm = () => {
//     setName("");
//     setCode("");
//     setEditingId(null);
//     setIsActive(true);
//   };

// const handleSave = async () => {
//   if (!name.trim()) {
//     toast.warning("Enter name");
//     return;
//   }
//   // 🔹 EDIT MODE → PUT
//   if (editingId) {
//     updateMaster(editingId);
//     return;
//   }
//   let payload = { IsActive: isActive };

//   if (formType === "Department") {
//     payload.DeptName = name;
//   }

//   if (formType === "Designation") {
//     payload.DesignationName = name;
//   }

//   if (formType === "AuthorityMatrix") {
//     payload.AuthorityMatrixName = name; // ✅ FIXED
//   }

//   try {
//     await axios.post(`${API_BASE_URL}/${formType}`, payload);

//     toast.success("Saved successfully");
//     fetchTableData();
//     resetForm();
//   } catch (err) {
//     console.error(err.response?.data);
//     toast.error("Save failed");
//   }
// };

//   const handleEdit = (item) => {
//   setEditingId(
//     formType === "Department"
//       ? item.deptId
//       : formType === "Designation"
//       ? item.designationId
//       : item.authorityMatrixId
//   );


//     setName(
//       item.departmentName ||
//       item.designationName ||
//       item.authorityName
//     );

//     setCode(
//       item.department_code ||
//       item.designation_code ||
//       item.authority_code
//     );

//   setIsActive(item.isActive ?? true);

//   setName(
//     item.deptName ||
//     item.designationName ||
//     item.authorityMatrixName
//   );

//   setCode(
//     item.deptCode ||
//     item.designationCode ||
//     item.authorityMatrixCode
//   );
// };
// const updateMaster = async (id, extraPayload = {}) => {
//   let payload = {
//     IsActive: isActive,
//     ...extraPayload,

//   };

//   if (formType === "Department") {
//     payload.DeptName = name;
//   }

//   if (formType === "Designation") {
//     payload.DesignationName = name;
//   }

//   if (formType === "AuthorityMatrix") {
//     payload.AuthorityMatrixName = name;
//   }

//   try {
//     await axios.put(
//       `${API_BASE_URL}/${formType}/${id}`,
//       payload,
//       { headers: { "Content-Type": "application/json" } }
//     );

//     toast.success("Updated successfully");
//     fetchTableData();
//     resetForm();
//   } catch (err) {
//     console.error(err.response?.data);
//     toast.error("Update failed");
//   }
// };


//  const toggleActive = async (id, activate) => {
//   try {
//     await axios.put(`${API_BASE_URL}/${formType}/${id}`, {
//       IsActive: activate,   // ✅ FIXED
//     });

//     toast.success(activate ? "Activated" : "Deactivated");
//     fetchTableData();
//   } catch (err) {
//     console.error(err);
//     toast.error("Status update failed");
//   }
// };
// const handleEditOrganization = (row) => {
//   setEditingOrgId(row.organizationId);

//   const dept = departments.find(d => d.deptName === row.deptName);
//   const desig = designations.find(d => d.designationName === row.designationName);
//   const ind = industries.find(i => i.industryName === row.industryName);
//   const country = countries.find(c => c.country_name === row.countryName);
//   const currency = currencies.find(c => c.currency_Code === row.currencyName);

//   // fetch states AFTER country resolved
//   if (country) {
//     fetchStates(country.country_id);
//   }

//   setTimeout(() => {
//     const state = states.find(s => s.state_name === row.stateName);
//     if (state) {
//       fetchCities(state.state_id);
//     }

//     setTimeout(() => {
//       const city = cities.find(c => c.city_name === row.cityName);

//       setOrgForm({
//        department: row.deptId ?? "",
//   position: row.designationId ?? "",
//   level: row.level ?? "",
//   qualification: row.qualification ?? "",
//   experience: row.experience ?? "",
//   industry: row.industryId ?? "",
//   country: row.countryId ?? "",
//   state: row.stateId ?? "",
//   city: row.cityId ?? "",
//   currency: row.currencyId ?? "",
//   budgetMin: row.minBudget ?? "",
//   budgetMax: row.maxBudget ?? "",
//  onboardDate: row.onBoardDate
//       ? row.onBoardDate.split("T")[0]
//       : "",      });
//     }, 300);
//   }, 300);

//   setFormType("BuildOrganization");
// };

//   /* ================= JSX ================= */
//   return (
//     <div className="container py-4">
//       <h2 className="text-center text-primary mb-4">CREATE MASTER</h2>
//       <div className="mb-3 bg-white p-3 rounded shadow-sm d-flex justify-content-between align-items-center">

//         <div>
//           {["Department", "Designation", "AuthorityMatrix", "BuildOrganization", "ViewOrganization"].map((type) => (
//             <label key={type} className="me-4">
//               <input
//                 type="radio"
//                 name="formType"
//                 checked={formType === type}
//                 onChange={() => setFormType(type)}
//               />{" "}
//               {type === "BuildOrganization"
//                 ? "Build Organization"
//                 : type === "ViewOrganization"
//                   ? "View Organization"
//                   : type}
//             </label>
//           ))}
//         </div>
//         {/* ===== RIGHT: ACTIVE / INACTIVE RADIO ===== */}
//         <div>
//           <label className="me-3">
//             <input
//               type="radio"
//               name="activeFilter"
//               checked={activeFilter === "active"}
//               onChange={() => setActiveFilter("active")}
//             />{" "}
//             Active
//           </label>

//           <label className="me-3">
//             <input
//               type="radio"
//               name="activeFilter"
//               checked={activeFilter === "inactive"}
//               onChange={() => setActiveFilter("inactive")}
//             />{" "}
//             Inactive
//           </label>
//         </div>
//       </div>
//       {/* ================= BUILD ORGANIZATION ================= */}
//       {formType === "BuildOrganization" && (
//         <div className="bg-white p-4 rounded shadow-sm">
//           <h4 className="text-center text-primary mb-4">Build Organization</h4>

//           <div className="row g-3">


//             <div className="col-md-3">
//               <label className="label-color">Department</label>
//               <select
//                 className="form-control"
//                 name="department"
//                 value={orgForm.department}
//                 onChange={handleOrgChange}
//               >
//                 <option value="">Select Department</option>
//                 {departments.map((d) => (
//                   <option key={d.id} value={d.departmentName}>
//                     {d.departmentName}
//                   </option>
//                 ))}
//               </select>
//             </div>


//             {/* POSITION */}
//             <div className="col-md-3">
//               <label className="label-color">Position</label>
//               <select
//                 className="form-control"
//                 name="position"
//                 value={orgForm.position}
//                 onChange={handleOrgChange}
//               >
//                 <option value="">Select Position</option>
//                 {designations.map((d) => (
//                   <option key={d.id} value={d.designationName}>
//                     {d.designationName}
//                   </option>
//                 ))}
//               </select>
//             </div>

//            <div className="col-md-3">
//   <label className="fw-bold">Department</label>
//   <select
//     className="form-control"
//     name="department"
//     value={orgForm.department}
//     onChange={handleOrgChange}
//   >
//     <option value="">Select Department</option>
//    {departments.map((d) => (
//   <option key={d.deptId} value={d.deptId}>
//     {d.deptName}
//   </option>
// ))}

//   </select>
// </div>


//             {/* POSITION */}
//            <div className="col-md-3">
//   <label className="fw-bold">Position</label>
//   <select
//     className="form-control"
//     name="position"
//     value={orgForm.position}
//     onChange={handleOrgChange}
//   >
//     <option value="">Select Position</option>
//   {designations.map((d) => (
//   <option key={d.designationId} value={d.designationId}>
//     {d.designationName}
//   </option>
// ))}

//   </select>
// </div>



//             {/* LEVEL */}
//             <div className="col-md-3">
//               <label className="label-color">Level</label>
//               <select className="form-control" name="level"
//                 value={orgForm.level} onChange={handleOrgChange}>
//                 {LEVEL_OPTIONS.map(opt => (
//                   <option key={opt.value} value={opt.value}>{opt.label}</option>
//                 ))}
//               </select>
//             </div>

//             {/* QUALIFICATION */}
//             <div className="col-md-3">
//               <label className="label-color">Qualification</label>
//               <select className="form-control" name="qualification"
//                 value={orgForm.qualification} onChange={handleOrgChange}>
//                 {QUALIFICATION_OPTIONS.map(opt => (
//                   <option key={opt.value} value={opt.value}>{opt.label}</option>
//                 ))}
//               </select>
//             </div>

//             {/* EXPERIENCE */}
//             <div className="col-md-3">
//               <label className="label-color">Experience</label>
//               <select className="form-control" name="experience"
//                 value={orgForm.experience} onChange={handleOrgChange}>
//                 {EXPERIENCE_OPTIONS.map(opt => (
//                   <option key={opt.value} value={opt.value}>{opt.label}</option>
//                 ))}
//               </select>
//             </div>

//             {/* INDUSTRY */}
//             <div className="col-md-3">
//               <label className="label-color">Industry</label>
//               <select
//                 className="form-control"
//                 name="industry"
//                 value={orgForm.industry}
//                 onChange={handleOrgChange}
//               >
//                 <option value="">Select Industry</option>
//                 {industries.map((ind) => (
//                   <option key={ind.industryId} value={ind.industryName}>
//                     {ind.industryName}
//                   </option>
//                 ))}
//               </select>
//             </div>


//             {/* COUNTRY */}
//             <div className="col-md-3">
//               <label className="label-color">Country</label>
//               <select
//                 className="form-control"
//                 name="country"
//                 value={orgForm.country}
//                 onChange={handleOrgChange}
//               >
//                 <option value="">Select Country</option>
//                 {countries.map((c) => (
//                   <option key={c} value={c}>{c}</option>
//                 ))}
//               </select>
//             </div>

//             {/* STATE */}
//             <div className="col-md-3">
//               <label className="label-color">State</label>
//               <select
//                 className="form-control"
//                 name="state"
//                 value={orgForm.state}
//                 onChange={handleOrgChange}
//               >
//                 <option value="">Select State</option>
//                 {states.map((s) => (
//                   <option key={s} value={s}>{s}</option>
//                 ))}
//               </select>
//             </div>

//             {/* CITY */}
//             <div className="col-md-3">
//               <label className="label-color">City</label>
//               <select
//                 className="form-control"
//                 name="city"
//                 value={orgForm.city}
//                 onChange={handleOrgChange}
//               >
//                 <option value="">Select City</option>
//                 {cities.map((ci) => (
//                   <option key={ci} value={ci}>{ci}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="col-md-3">
//               <label className="label-color">Currency</label>
//               <select
//                 className="form-control"
//                 name="currency"
//                 value={orgForm.currency}
//                 onChange={handleOrgChange}
//               >
//                 <option value="">Select Currency</option>
//                 {currencies.map((c) => (
//                   <option key={c.id} value={c.currency_Code}>
//                     {c.currency_Code}
//                   </option>
//                 ))}
//               </select>
//             </div>

// {/* INDUSTRY */}
// <div className="col-md-3">
//   <label className="fw-bold">Industry</label>
//   <select
//     className="form-control"
//     name="industry"
//     value={orgForm.industry}
//     onChange={handleOrgChange}
//   >
//     <option value="">Select Industry</option>
//    {industries.map((ind) => (
//   <option key={ind.industryId} value={ind.industryId}>
//     {ind.industryName}
//   </option>
// ))}

//   </select>
// </div>


//          {/* COUNTRY */}
// <div className="col-md-3">
//   <label className="fw-bold">Country</label>
//   <select
//   name="country"
//   value={orgForm.country}
//   onChange={handleOrgChange}
//   className="form-control"
// >
//   <option value="">Select Country</option>

//   {countries.map((c) => (
//   <option key={c.country_id} value={c.country_id}>
//     {c.country_name}
//   </option>
// ))}


// </select>

// </div>

// {/* STATE */}
// <div className="col-md-3">
//   <label className="fw-bold">State</label>
//   <select
//     className="form-control"
//     name="state"
//     value={orgForm.state}
//     onChange={handleOrgChange}
//   >
//     <option value="">Select State</option>
//     {states.map((s) => (
// <option key={s.state_id} value={s.state_id}>
//   {s.state_name}
// </option>
//     ))}
//   </select>
// </div>

// {/* CITY */}
// <div className="col-md-3">
//   <label className="fw-bold">City</label>
//   <select
//     className="form-control"
//     name="city"
//     value={orgForm.city}
//     onChange={handleOrgChange}
//   >
//     <option value="">Select City</option>
//   {cities.map((ci) => (
//   <option key={ci.city_id} value={ci.city_id}>
//     {ci.city_name}
//   </option>
// ))}

  
//   </select>
// </div>
// <div className="col-md-3">
//   <label className="fw-bold">Currency</label>
//   <select
//     className="form-control"
//     name="currency"
//     value={orgForm.currency}
//     onChange={handleOrgChange}
//   >
//     <option value="">Select Currency</option>
//     {currencies.map((c) => (
//   <option key={c.currencyId} value={c.currencyId}>
//     {c.currency_Code}
//   </option>
// ))}

//   </select>
// </div>



//             <div className="col-md-3">
//               <label className="label-color">Budget Min</label>
//               <input type="number" className="form-control"
//                 name="budgetMin" value={orgForm.budgetMin} onChange={handleOrgChange} />
//             </div>

//             <div className="col-md-3">
//               <label className="label-color">Budget Max</label>
//               <input type="number" className="form-control"
//                 name="budgetMax" value={orgForm.budgetMax} onChange={handleOrgChange} />
//             </div>

//             <div className="col-md-3">

//               <label className="label-color">Onboard Date</label>
//               <input type="date" className="form-control"
//                 name="onboardDate" value={orgForm.onboardDate} onChange={handleOrgChange} />

//               <label className="fw-bold">Onboard Date</label>
//              <input
//   type="date"
//   name="onboardDate"
//   value={orgForm.onboardDate}
//   onChange={handleOrgChange}
//   className="form-control"
// />


//             </div>

//             <div className="col-md-3 d-flex align-items-end">
//               <button className="btn btn-success w-100" onClick={addOrgRow}>
//                 ADD
//               </button>
//               <button
//                 className="cancel-btn w-50"
//                 onClick={() =>
//                   setOrgForm({
//                     department: "",
//                     position: "",
//                     level: "",
//                     qualification: "",
//                     experience: "",
//                     industry: "",
//                     country: "",
//                     state: "",
//                     city: "",
//                     currency: "",
//                     budgetMin: "",
//                     budgetMax: "",
//                     onboardDate: "",
//                   })
//                 }
//               >
//                 CANCEL
//               </button>
//             </div>

//           </div>
//         </div>
//       )}

//       {/* ================= MASTER FORM ================= */}
//       {formType !== "BuildOrganization" && formType !== "ViewOrganization" && (
//         <div className="row mt-3">

//           {/* ===== LEFT FORM ===== */}
//           <div className="col-lg-5">
//             <div className="bg-white p-3 rounded shadow-sm">

//               <label className="label-color">Name</label>
//               <input
//                 className="form-control mb-2"
//                 placeholder="Enter Name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />


//               <label className="label-color">Code</label>
//               <input
//                 className="form-control mb-3"
//                 value={code || "Auto Generated"}
//                 readOnly
//               />



//               <div className="d-flex gap-2">
//                 <button className="save-btn" onClick={handleSave}>
//                   <Save size={16} /> Save
//                 </button>
//                 <button className="cancel-btn" onClick={resetForm}>
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>


//           {/* ===== RIGHT TABLE (ACTIVE / INACTIVE) ===== */}
//           <div className="col-lg-7">
//             <div className="p-3 bg-white rounded shadow-sm table-responsive">



//               <table className="table table-bordered text-center align-middle">
//                 <thead className="table-light">
//                   <tr>
//                     <th>Name</th>
//                     <th>Code</th>
//                     <th>Edit</th>
//                     <th>{activeFilter === "active" ? "Deactivate" : "Activate"}</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {tableData.length > 0 ? (
//                     tableData.map((item) => (
//                       <tr key={item.id}>
//                         <td>
//                           {formType === "Department"
//                             ? item.departmentName
//                             : formType === "Designation"
//                               ? item.designationName
//                               : item.authorityName}
//                         </td>

//                         <td>
//                           {formType === "Department"
//                             ? item.department_code
//                             : formType === "Designation"
//                               ? item.designation_code
//                               : item.authority_code}
//                         </td>

//                         <td>
//                           <Edit
//                             role="button"
//                             className="text-primary"
//                             onClick={() => handleEdit(item)}
//                           />
//                         </td>

//                         <td>
//                           {activeFilter === "active" ? (
//                             <Trash2
//                               role="button"
//                               className="text-danger"
//                               onClick={() => toggleActive(item.id, false)}
//                             />
//                           ) : (
//                             <button
//                               className="btn btn-sm btn-success"
//                               onClick={() => toggleActive(item.id, true)}
//                             >
//                               Activate
//                             </button>
//                           )}
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="4">No Records Found</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ================= ADDED ORGANIZATION TABLE ================= */}
//       {formType === "BuildOrganization" && orgTable.length > 0 && (
//         <div className="mt-4 bg-white p-3 rounded shadow-sm">
//           <h5 className="text-center text-primary mb-3">
//             Added Organization Details
//           </h5>

//           <div className="table-responsive">
//             <table className="table table-bordered text-center">
//               <thead className="table-light">
//                 <tr>
//                   <th>Department</th>
//                   <th>Position</th>
//                   <th>Level</th>
//                   <th>Qualification</th>
//                   <th>Experience</th>
//                   <th>Industry</th>
//                   <th>Country</th>
//                   <th>State</th>
//                   <th>City</th>
//                   <th>Currency</th>
//                   <th>Budget Min</th>
//                   <th>Budget Max</th>
//                   <th>Onboard Date</th>
//                   <th>Edit</th>
//                   <th>Delete</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {orgTable.map((row, index) => (
//                   <tr key={index}>
//                     <td>{row.department}</td>
//                     <td>{row.position}</td>
//                     <td>{row.level}</td>
//                     <td>{row.qualification}</td>
//                     <td>{row.experience}</td>
//                     <td>{row.industry}</td>
//                     <td>{row.country}</td>
//                     <td>{row.state}</td>
//                     <td>{row.city}</td>
//                     <td>{row.currency}</td>
//                     <td>{row.budgetMin}</td>
//                     <td>{row.budgetMax}</td>
//                     <td>{row.onboardDate}</td>
//                     {/* EDIT TEMP */}
//                     <td>
//                       <Edit
//                         size={18}
//                         role="button"
//                         className="text-primary"
//                         onClick={() => editOrgRow(row, index)}
//                       />
//                     </td>

//                     {/* DELETE TEMP */}
//                     <td>
//                       <Trash2
//                         size={18}
//                         role="button"
//                         className="text-danger"
//                         onClick={() => deleteOrgRow(index)}
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="text-center mt-3">
//             <button
//               className="btn btn-success px-5"
//               onClick={submitOrganization}
//             >
//               SUBMIT
//             </button>
//           </div>
//         </div>
//       )}
//       {/* ================= VIEW ORGANIZATION ================= */}
//       {formType === "ViewOrganization" && (
//         <div className="bg-white p-3 rounded shadow-sm">
//           <h4 className="text-center text-primary mb-4">View Organization</h4>

//           <div className="mb-2 text-end">
//             <label className="me-3">
//               <input
//                 type="radio"
//                 checked={activeFilter === "active"}
//                 onChange={() => setActiveFilter("active")}
//               />{" "}
//               Active
//             </label>
//             <label className="label-color">
//               <input
//                 type="radio"
//                 checked={activeFilter === "inactive"}
//                 onChange={() => setActiveFilter("inactive")}
//               />{" "}
//               Inactive
//             </label>
//           </div>

//           <div className="table-responsive">
//             <table className="table table-bordered text-center">
//               <thead className="table-light">
//                 <tr>
//                   <th>Department</th>
//                   <th>Position</th>
//                   <th>Level</th>
//                   <th>Qualification</th>
//                   <th>Experience</th>
//                   <th>Industry</th>
//                   <th>Country</th>
//                   <th>State</th>
//                   <th>City</th>
//                   <th>Currency</th>
//                   <th>Budget Min</th>
//                   <th>Budget Max</th>
//                   <th>Onboard Date</th>
//                   <th>Deactivate</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {organizationTable.length > 0 ? (
//                   organizationTable.map((row) => (
//                     <tr key={row.id}>
//                       <td>{row.department || "-"}</td>
//                       <td>{row.position || "-"}</td>
//                       <td>{row.level || "-"}</td>
//                       <td>{row.qualification || "-"}</td>
//                       <td>{row.experience || "-"}</td>
//                       <td>{row.industry || "-"}</td>
//                       <td>{row.country || "-"}</td>
//                       <td>{row.state || "-"}</td>
//                       <td>{row.city || "-"}</td>
//                       <td>{row.currency || "-"}</td>
//                       <td>{row.budgetMin || "-"}</td>
//                       <td>{row.budgetMax || "-"}</td>
//                       <td>{row.onboardDate || "-"}</td>

//                       <td>
//                         <Trash2
//                           size={20}
//                           role="button"
//                           className="text-danger"
//                           title="Delete"
//                           onClick={() => toggleOrganizationActive(row.id, false)}
//                         />
//                       </td>


//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="14">No Records Found</td>
//                   </tr>
//                 )}
//               </tbody>

// =======
//    <tbody>
//   {tableData.length > 0 ? (
//     tableData.map((item) => (
//       <tr
//         key={
//           formType === "Department"
//             ? item.deptId
//             : formType === "Designation"
//             ? item.designationId
//             : item.authorityMatrixId
//         }
//       >
//         <td>
//           {formType === "Department"
//             ? item.deptName
//             : formType === "Designation"
//             ? item.designationName
//             : item.authorityMatrixName}
//         </td>

//         <td>
//           {formType === "Department"
//             ? item.deptCode
//             : formType === "Designation"
//             ? item.designationCode
//             : item.authorityMatrixCode}
//         </td>

//         <td>
//           <Edit
//             role="button"
//             className="text-primary"
//             onClick={() => handleEdit(item)}
//           />
//         </td>

//         <td>
//           {activeFilter === "active" ? (
//             <Trash2
//               role="button"
//               className="text-danger"
//               onClick={() =>
//                 toggleActive(
//                   formType === "Department"
//                     ? item.deptId
//                     : formType === "Designation"
//                     ? item.designationId
//                     : item.authorityMatrixId,
//                   false
//                 )
//               }
//             />
//           ) : (
//             <button
//               className="btn btn-sm btn-success"
//               onClick={() =>
//                 toggleActive(
//                   formType === "Department"
//                     ? item.deptId
//                     : formType === "Designation"
//                     ? item.designationId
//                     : item.authorityMatrixId,
//                   true
//                 )
//               }
//             >
//               Activate
//             </button>
//           )}
//         </td>
//       </tr>
//     ))
//   ) : (
//     <tr>
//       <td colSpan="4">No Records Found</td>
//     </tr>
//   )}
// </tbody>

//     </table>
//   </div>
// </div>
// </div>
// )}

// {/* ================= ADDED ORGANIZATION TABLE ================= */}
// {formType === "BuildOrganization" && orgTable.length > 0 && (
//   <div className="mt-4 bg-white p-3 rounded shadow-sm">
//     <h5 className="text-center text-primary mb-3">
//       Added Organization Details
//     </h5>

//     <div className="table-responsive">
//       <table className="table table-bordered text-center">
//         <thead className="table-light">
//           <tr>
//             <th>Department</th>
//             <th>Position</th>
//             <th>Level</th>
//             <th>Qualification</th>
//             <th>Experience</th>
//             <th>Industry</th>
//             <th>Country</th>
//             <th>State</th>
//             <th>City</th>
//             <th>Currency</th>
//             <th>Budget Min</th>
//             <th>Budget Max</th>
//             <th>Onboard Date</th>
//             <th>Edit</th>
//     <th>Delete</th>
//           </tr>
//         </thead>
//         <tbody>
//           {orgTable.map((row, index) => (
//             <tr key={index}>
//              <td>{departments.find(d => d.deptId == row.department)?.deptName}</td>
// <td>{designations.find(d => d.designationId == row.position)?.designationName}</td>
// <td>{row.level}</td>
// <td>{row.qualification}</td>
// <td>{row.experience}</td>
// <td>{industries.find(i => i.industryId == row.industry)?.industryName}</td>
// <td>{countries.find(c => c.country_id == row.country)?.country_name}</td>
// <td>{states.find(s => s.state_id == row.state)?.state_name}</td>
// <td>{cities.find(c => c.city_id == row.city)?.city_name}</td>
// <td>{currencies.find(c => c.currencyId == row.currency)?.currency_Code}</td>
// <td>{row.budgetMin}</td>
// <td>{row.budgetMax}</td>
// <td>{row.onboardDate}</td>

//                 {/* EDIT TEMP */}
//       <td>
//         <Edit
//           size={18}
//           role="button"
//           className="text-primary"
//           onClick={() => editOrgRow(row, index)}
//         />
//       </td>

//       {/* DELETE TEMP */}
//       <td>
//         <Trash2
//           size={18}
//           role="button"
//           className="text-danger"
//           onClick={() => deleteOrgRow(index)}
//         />
//       </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>

//     <div className="text-center mt-3">
//        <button
//     className="btn btn-success px-5"
//   onClick={editingOrgId ? updateOrganization : submitOrganization}
//     disabled={orgTable.length === 0} // disable until a row is added
//   >
//     {editingOrgId ? "UPDATE" : "SUBMIT"}
//   </button>

//     </div>
//   </div>
// )}
//     {/* ================= VIEW ORGANIZATION ================= */}
// {formType === "ViewOrganization" && (
//   <div className="bg-white p-3 rounded shadow-sm">
//     <h4 className="text-center text-primary mb-4">View Organization</h4>

   
//     <div className="table-responsive">
//       <table className="table table-bordered text-center">
//         <thead className="table-light">
//           <tr>
//             <th>Department</th>
//             <th>Position</th>
//             <th>Level</th>
//             <th>Qualification</th>
//             <th>Experience</th>
//             <th>Industry</th>
//             <th>Country</th>
//             <th>State</th>
//             <th>City</th>
//             <th>Currency</th>
//             <th>Budget Min</th>
//             <th>Budget Max</th>
//             <th>Onboard Date</th>
// <th>Edit</th>

// <th>{activeFilter === "active" ? "Deactivate" : "Activate"}</th>
//           </tr>
//         </thead>
//         <tbody>
//           {organizationTable.length > 0 ? (
//             organizationTable.map((row) => (
// <tr key={row.organizationId}>
//   <td>{row.deptName}</td>
//   <td>{row.designationName}</td>
//   <td>{row.level}</td>
//   <td>{row.qualification}</td>
//   <td>{row.experience}</td>
//   <td>{row.industryName}</td>
//  <td>{row.countryName}</td>
// <td>{row.stateName}</td>
// <td>{row.cityName}</td>
// <td>{row.currencyName}</td>

//   <td>{row.minBudget}</td>
//   <td>{row.maxBudget}</td>
//   <td>{row.onBoardDate}</td>
// <td>
//   <Edit
//     size={20}
//     role="button"
//     className="text-primary"
//     onClick={() => handleEditOrganization(row)}
//   />
// </td>

//   <td>
//     <Trash2
//       size={20}
//       role="button"
//       className="text-danger"
//       title="Deactivate"
//   onClick={() => toggleOrganizationActive(row.organizationId, false)}

//     />
//   </td>
// </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="14">No Records Found</td>
//             </tr>
//           )}
//         </tbody>
      



//             </table>
//           </div>
//         </div>
//       )}
//       <ToastContainer />
//     </div>
//   );
// }

// export default CreateMaster;
import React from 'react'

function CreateMaster() {
  return (
    <div>CreateMaster</div>
  )
}

export default CreateMaster