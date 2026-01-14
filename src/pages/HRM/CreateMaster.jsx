import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Save, Edit, Trash2 } from "lucide-react";
import { API_ENDPOINTS } from "../../config/apiconfig";


const API_BASE_URL ="https://msmeerpsyn9-core.azurewebsites.net/api/HrmMaster";

//const API_BASE_URL= "https://localhost:7145/api/HrmMaster";

/* ================= DROPDOWN OPTIONS ================= */
const LEVEL_OPTIONS = [
  { label: "Select Level", value: "" },
  ...Array.from({ length: 9 }, (_, i) => ({
    label: `${i + 1}`,
    value: `${i + 1}`,
  })),
];

const QUALIFICATION_OPTIONS = [
  { label: "Select Qualification", value: "" },
  { label: "B PHARM", value: "B PHARM" },
  { label: "M PHARM", value: "M PHARM" },
  { label: "BSC MBA", value: "BSC MBA" },
  { label: "CA/CS", value: "CA/CS" },
  { label: "BCOM MBA", value: "BCOM MBA" },
  { label: "GRADUATE (SCIENCE)", value: "GRADUATE (SCIENCE)" },
  { label: "GRADUATE (COMMERCE)", value: "GRADUATE (COMMERCE)" },
  { label: "ENG PG (IT)", value: "ENG_PG_IT" },
  { label: "BE (MECH)", value: "BE (MECH)" },
  { label: "BE (ELE)", value: "BE (ELE)" },
  { label: "BE (IT)", value: "BE (IT)" },
  { label: "BE (CHEM)", value: "BE (CHEM)" },
  { label: "ENGINEERING DIPLOMA", value: "ENG_DIPLOMA" },
  { label: "ITI TRAINED", value: "ITI" },
  { label: "12TH STANDARD", value: "12TH_STANDARD" },
];

const EXPERIENCE_OPTIONS = [
  { label: "Select Experience", value: "" },
  { label: "0-2 YEAR", value: "0-2 YEAR" },
  { label: "2-4 YEAR", value: "2-4 YEAR" },
  { label: "5-10 YEAR", value: "5-10 YEAR" },
  { label: "10-20 YEAR", value: "10-20 YEAR" },
  { label: "20 YEAR AND ABOVE", value: "20 YEAR AND ABOVE" },
];

function CreateMaster() {
  const [formType, setFormType] = useState("Department");
  const [tableData, setTableData] = useState([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [activeFilter, setActiveFilter] = useState("active");
const [departments, setDepartments] = useState([]);
const [designations, setDesignations] = useState([]);
const [currencies, setCurrencies] = useState([]);
const [countries, setCountries] = useState([]);
const [states, setStates] = useState([]);
const [cities, setCities] = useState([]);
const [industries, setIndustries] = useState([]);
const [organizationTable, setOrganizationTable] = useState([]);

useEffect(() => {
  fetchIndustries();
}, []);

useEffect(() => {
  fetchCurrencies();
}, []);


useEffect(() => {
  if (formType === "ViewOrganization") {
    const fetchOrganizationData = async () => {
      try {
        // ✅ Correct URL here
        const res = await axios.get(`${API_BASE_URL}/Organization`);
        let data = res.data || [];
        data = data.filter((x) =>
          activeFilter === "active" ? x.isActive !== false : x.isActive === false
        );
        setOrganizationTable(data);
      } catch (err) {
        toast.error("Failed to load organization data");
        console.error(err);
      }
    };
    fetchOrganizationData();
  }
}, [formType, activeFilter]);

const deleteOrgRow = (index) => {
  setOrgTable((prev) => prev.filter((_, i) => i !== index));
};
const editOrgRow = (row, index) => {
  setOrgForm({ ...row });        // put data back into form
  setOrgTable((prev) => prev.filter((_, i) => i !== index)); // remove temp row
};

const toggleOrganizationActive = async (id, activate) => {
  try {
    await axios.put(`${API_BASE_URL}/Organization/${id}`, { isActive: activate });
    toast.success(activate ? "Activated" : "Deactivated");

    // Refresh
    const res = await axios.get(`${API_BASE_URL}/Organization`);
    let data = res.data || [];
    data = data.filter((x) =>
      activeFilter === "active" ? x.isActive !== false : x.isActive === false
    );
    setOrganizationTable(data);
  } catch (err) {
    toast.error("Status update failed");
    console.error(err);
  }
};




const fetchIndustries = async () => {
  const res = await axios.get(API_ENDPOINTS.GET_INDUSTRY);
  setIndustries(res.data);
};

const fetchCountries = async () => {
  const res = await axios.get(API_ENDPOINTS.GET_COUNTRY);
  setCountries(res.data);
  setStates([]);
  setCities([]);
};

const fetchStates = async (countryId) => {
  const res = await axios.get(API_ENDPOINTS.GET_STATE, {
    params: { countryId },   // ✅ MATCH API
  });
  setStates(res.data);
  setCities([]);
};


const fetchCities = async (country, state) => {
  const res = await axios.get(API_ENDPOINTS.GET_CITY, {
    params: { country, state },
  });
  setCities(res.data);
};

  /* ================= BUILD ORGANIZATION ================= */
  const [orgForm, setOrgForm] = useState({
    department: "",
    position: "",
    level: "",
    qualification: "",
    experience: "",
    industry: "",
    country: "",
    state: "",
    city: "",
    currency: "",
    budgetMin: "",
    budgetMax: "",
    onboardDate: "",
  });

  const [orgTable, setOrgTable] = useState([]);

 const handleOrgChange = (e) => {
  const { name, value } = e.target;
  setOrgForm((prev) => ({ ...prev, [name]: value }));
};

  // ================= ADD ROW =================
  const addOrgRow = () => {
    if (Object.values(orgForm).some((v) => !v)) {
      toast.warning("Please fill all fields");
      return;
    }
    setOrgTable((prev) => [...prev, { ...orgForm, isActive: true }]);
    setOrgForm({
      department: "",
      position: "",
      level: "",
      qualification: "",
      experience: "",
      industry: "",
      country: "",
      state: "",
      city: "",
      currency: "",
      budgetMin: "",
      budgetMax: "",
      onboardDate: ""
    });
  };
  // COUNTRY → STATE
useEffect(() => {
  if (orgForm.country) {
    fetchStates(orgForm.country); // countryId
  }
}, [orgForm.country]);

// STATE → CITY
useEffect(() => {
  if (orgForm.country && orgForm.state) {
    fetchCities(orgForm.country, orgForm.state);
  }
}, [orgForm.state]);

useEffect(() => {
  fetchDepartments();
  fetchDesignations();
}, []);
const fetchCurrencies = async () => {
  try {
    const res = await axios.get(API_ENDPOINTS.GET_CURRENCY);
    setCurrencies(res.data); // assuming API returns [{ Id, Currency_Code }]
  } catch (err) {
    toast.error("Failed to load currencies");
  }
};

const fetchDepartments = async () => {
  try {
      const res = await axios.get(API_ENDPOINTS.DEPARTMENT);

    setDepartments(res.data);
  } catch (err) {
    console.error("Department load failed");
  }
};

const fetchDesignations = async () => {
  try {
       const res = await axios.get(API_ENDPOINTS.DESIGNATION);

    setDesignations(res.data);
  } catch (err) {
    console.error("Designation load failed");
  }
};
//
// COUNTRY → STATE
// LOAD COUNTRIES ON PAGE LOAD
useEffect(() => {
  fetchCountries();
}, []);

useEffect(() => {
  if (orgForm.country) {
    fetchStates(orgForm.country);
  }
}, [orgForm.country]); // ✅ correct

// STATE → CITY
useEffect(() => {
  if (orgForm.country && orgForm.state) {
    fetchCities(orgForm.country, orgForm.state);
  }
}, [orgForm.state]);



 const submitOrganization = async () => {
  if (orgTable.length === 0) {
    toast.warning("No data to submit");
    return;
  }

  try {
    await axios.post(
      API_ENDPOINTS.ORG_CHART_WITH_BUDGET,
      orgTable,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    toast.success("Organization submitted successfully!");
    setOrgTable([]);
  } catch (err) {
    console.error(err);
    toast.error("Submission failed");
  }
};



 const fetchTableData = useCallback(async () => {
  if (formType === "BuildOrganization" || formType === "ViewOrganization") return;

  try {
    const res = await axios.get(`${API_BASE_URL}/${formType}`);
    let data = res.data || [];

    data = data.filter((x) =>
      activeFilter === "active" ? x.isActive !== false : x.isActive === false
    );

    setTableData(data);
  } catch {
    toast.error("Failed to load data");
  }
}, [formType, activeFilter]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

  /* ================= MASTER SAVE ================= */
  const resetForm = () => {
    setName("");
    setCode("");
    setEditingId(null);
    setIsActive(true);
  };

const handleSave = async () => {
  if (!name.trim()) {
    toast.warning("Enter name");
    return;
  }
  // 🔹 EDIT MODE → PUT
  if (editingId) {
    updateMaster(editingId);
    return;
  }
  let payload = { IsActive: isActive };

  if (formType === "Department") {
    payload.DeptName = name;
  }

  if (formType === "Designation") {
    payload.DesignationName = name;
  }

  if (formType === "AuthorityMatrix") {
    payload.AuthorityMatrixName = name; // ✅ FIXED
  }

  try {
    await axios.post(`${API_BASE_URL}/${formType}`, payload);

    toast.success("Saved successfully");
    fetchTableData();
    resetForm();
  } catch (err) {
    console.error(err.response?.data);
    toast.error("Save failed");
  }
};

  const handleEdit = (item) => {
  setEditingId(
    formType === "Department"
      ? item.deptId
      : formType === "Designation"
      ? item.designationId
      : item.authorityMatrixId
  );

  setIsActive(item.isActive ?? true);

  setName(
    item.deptName ||
    item.designationName ||
    item.authorityMatrixName
  );

  setCode(
    item.deptCode ||
    item.designationCode ||
    item.authorityMatrixCode
  );
};
const updateMaster = async (id, extraPayload = {}) => {
  let payload = {
    IsActive: isActive,
    ...extraPayload,
  };

  if (formType === "Department") {
    payload.DeptName = name;
  }

  if (formType === "Designation") {
    payload.DesignationName = name;
  }

  if (formType === "AuthorityMatrix") {
    payload.AuthorityMatrixName = name;
  }

  try {
    await axios.put(
      `${API_BASE_URL}/${formType}/${id}`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    toast.success("Updated successfully");
    fetchTableData();
    resetForm();
  } catch (err) {
    console.error(err.response?.data);
    toast.error("Update failed");
  }
};


 const toggleActive = async (id, activate) => {
  try {
    await axios.put(`${API_BASE_URL}/${formType}/${id}`, {
      IsActive: activate,   // ✅ FIXED
    });

    toast.success(activate ? "Activated" : "Deactivated");
    fetchTableData();
  } catch (err) {
    console.error(err);
    toast.error("Status update failed");
  }
};
  /* ================= JSX ================= */
  return (
    <div className="container py-4">
      <h2 className="text-center text-primary mb-4">CREATE MASTER</h2>
<div className="mb-3 bg-white p-3 rounded shadow-sm d-flex justify-content-between align-items-center">

        <div>
    {["Department", "Designation", "AuthorityMatrix", "BuildOrganization", "ViewOrganization"].map((type) => (
      <label key={type} className="me-4">
        <input
          type="radio"
          name="formType"
          checked={formType === type}
          onChange={() => setFormType(type)}
        />{" "}
        {type === "BuildOrganization"
          ? "Build Organization"
          : type === "ViewOrganization"
          ? "View Organization"
          : type}
      </label>
    ))}
  </div>
 {/* ===== RIGHT: ACTIVE / INACTIVE RADIO ===== */}
  <div>
    <label className="me-3">
      <input
        type="radio"
        name="activeFilter"
        checked={activeFilter === "active"}
        onChange={() => setActiveFilter("active")}
      />{" "}
      Active
    </label>

    <label>
      <input
        type="radio"
        name="activeFilter"
        checked={activeFilter === "inactive"}
        onChange={() => setActiveFilter("inactive")}
      />{" "}
      Inactive
    </label>
  </div>
  </div>
     {/* ================= BUILD ORGANIZATION ================= */}
     {formType === "BuildOrganization" && (
        <div className="bg-white p-4 rounded shadow-sm">
          <h4 className="text-center text-primary mb-4">Build Organization</h4>

          <div className="row g-3">

           <div className="col-md-3">
  <label className="fw-bold">Department</label>
  <select
    className="form-control"
    name="department"
    value={orgForm.department}
    onChange={handleOrgChange}
  >
    <option value="">Select Department</option>
   {departments.map((d) => (
  <option key={d.deptId} value={d.deptName}>
    {d.deptName}
  </option>
))}

  </select>
</div>


            {/* POSITION */}
           <div className="col-md-3">
  <label className="fw-bold">Position</label>
  <select
    className="form-control"
    name="position"
    value={orgForm.position}
    onChange={handleOrgChange}
  >
    <option value="">Select Position</option>
  {designations.map((d) => (
  <option key={d.designationId} value={d.designationName}>
    {d.designationName}
  </option>
))}

  </select>
</div>


            {/* LEVEL */}
            <div className="col-md-3">
              <label className="fw-bold">Level</label>
              <select className="form-control" name="level"
                value={orgForm.level} onChange={handleOrgChange}>
                {LEVEL_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* QUALIFICATION */}
            <div className="col-md-3">
              <label className="fw-bold">Qualification</label>
              <select className="form-control" name="qualification"
                value={orgForm.qualification} onChange={handleOrgChange}>
                {QUALIFICATION_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* EXPERIENCE */}
            <div className="col-md-3">
              <label className="fw-bold">Experience</label>
              <select className="form-control" name="experience"
                value={orgForm.experience} onChange={handleOrgChange}>
                {EXPERIENCE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
{/* INDUSTRY */}
<div className="col-md-3">
  <label className="fw-bold">Industry</label>
  <select
    className="form-control"
    name="industry"
    value={orgForm.industry}
    onChange={handleOrgChange}
  >
    <option value="">Select Industry</option>
   {industries.map((ind) => (
  <option key={ind.industryId} value={ind.industryName}>
    {ind.industryName}
  </option>
))}

  </select>
</div>


         {/* COUNTRY */}
<div className="col-md-3">
  <label className="fw-bold">Country</label>
  <select
  name="country"
  value={orgForm.country}
  onChange={handleOrgChange}
  className="form-control"
>
  <option value="">Select Country</option>

  {countries.map((c) => (
  <option key={c.country_id} value={c.country_id}>
    {c.country_name}
  </option>
))}


</select>

</div>

{/* STATE */}
<div className="col-md-3">
  <label className="fw-bold">State</label>
  <select
    className="form-control"
    name="state"
    value={orgForm.state}
    onChange={handleOrgChange}
  >
    <option value="">Select State</option>
    {states.map((s) => (
<option key={s.state_id} value={s.state_id}>
  {s.state_name}
</option>
    ))}
  </select>
</div>

{/* CITY */}
<div className="col-md-3">
  <label className="fw-bold">City</label>
  <select
    className="form-control"
    name="city"
    value={orgForm.city}
    onChange={handleOrgChange}
  >
    <option value="">Select City</option>
   {cities.map((ci) => (
  <option key={ci.city_id} value={ci.city_id}>
    {ci.city_name}
  </option>
))}

  
  </select>
</div>
<div className="col-md-3">
  <label className="fw-bold">Currency</label>
  <select
    className="form-control"
    name="currency"
    value={orgForm.currency}
    onChange={handleOrgChange}
  >
    <option value="">Select Currency</option>
    {currencies.map((c) => (
  <option key={c.currencyId} value={c.currency_Code}>
    {c.currency_Code}
  </option>
))}

  </select>
</div>


            <div className="col-md-3">
              <label className="fw-bold">Budget Min</label>
              <input type="number" className="form-control"
                name="budgetMin" value={orgForm.budgetMin} onChange={handleOrgChange} />
            </div>

            <div className="col-md-3">
              <label className="fw-bold">Budget Max</label>
              <input type="number" className="form-control"
                name="budgetMax" value={orgForm.budgetMax} onChange={handleOrgChange} />
            </div>

            <div className="col-md-3">
              <label className="fw-bold">Onboard Date</label>
              <input type="date" className="form-control"
                name="onboardDate" value={orgForm.onboardDate} onChange={handleOrgChange} />
            </div>

            <div className="col-md-3 d-flex align-items-end">
              <button className="btn btn-success w-100" onClick={addOrgRow}>
                ADD
              </button>
                <button
    className="btn btn-secondary w-50"
    onClick={() =>
      setOrgForm({
        department: "",
        position: "",
        level: "",
        qualification: "",
        experience: "",
        industry: "",
        country: "",
        state: "",
        city: "",
        currency: "",
        budgetMin: "",
        budgetMax: "",
        onboardDate: "",
      })
    }
  >
    CANCEL
  </button>
            </div>

          </div>
        </div>
      )}

{/* ================= MASTER FORM ================= */}
{formType !== "BuildOrganization" && formType !== "ViewOrganization" && (
  <div className="row mt-3">

    {/* ===== LEFT FORM ===== */}
    <div className="col-lg-5">
      <div className="bg-white p-3 rounded shadow-sm">

        <label className="fw-bold">Name</label>
        <input
          className="form-control mb-2"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />



        <button className="btn btn-success me-2" onClick={handleSave}>
          <Save size={16} /> Save
        </button>
        <button className="btn btn-secondary" onClick={resetForm}>
          Cancel
        </button>
      </div>
    </div>


{/* ===== RIGHT TABLE (ACTIVE / INACTIVE) ===== */}
<div className="col-lg-7">
  <div className="p-3 bg-white rounded shadow-sm table-responsive">

    

    <table className="table table-bordered text-center align-middle">
      <thead className="table-light">
        <tr>
          <th>Name</th>
          <th>Code</th>
          <th>Edit</th>
          <th>{activeFilter === "active" ? "Deactivate" : "Activate"}</th>
        </tr>
      </thead>

   <tbody>
  {tableData.length > 0 ? (
    tableData.map((item) => (
      <tr
        key={
          formType === "Department"
            ? item.deptId
            : formType === "Designation"
            ? item.designationId
            : item.authorityMatrixId
        }
      >
        <td>
          {formType === "Department"
            ? item.deptName
            : formType === "Designation"
            ? item.designationName
            : item.authorityMatrixName}
        </td>

        <td>
          {formType === "Department"
            ? item.deptCode
            : formType === "Designation"
            ? item.designationCode
            : item.authorityMatrixCode}
        </td>

        <td>
          <Edit
            role="button"
            className="text-primary"
            onClick={() => handleEdit(item)}
          />
        </td>

        <td>
          {activeFilter === "active" ? (
            <Trash2
              role="button"
              className="text-danger"
              onClick={() =>
                toggleActive(
                  formType === "Department"
                    ? item.deptId
                    : formType === "Designation"
                    ? item.designationId
                    : item.authorityMatrixId,
                  false
                )
              }
            />
          ) : (
            <button
              className="btn btn-sm btn-success"
              onClick={() =>
                toggleActive(
                  formType === "Department"
                    ? item.deptId
                    : formType === "Designation"
                    ? item.designationId
                    : item.authorityMatrixId,
                  true
                )
              }
            >
              Activate
            </button>
          )}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="4">No Records Found</td>
    </tr>
  )}
</tbody>

    </table>
  </div>
</div>
</div>
)}

{/* ================= ADDED ORGANIZATION TABLE ================= */}
{formType === "BuildOrganization" && orgTable.length > 0 && (
  <div className="mt-4 bg-white p-3 rounded shadow-sm">
    <h5 className="text-center text-primary mb-3">
      Added Organization Details
    </h5>

    <div className="table-responsive">
      <table className="table table-bordered text-center">
        <thead className="table-light">
          <tr>
            <th>Department</th>
            <th>Position</th>
            <th>Level</th>
            <th>Qualification</th>
            <th>Experience</th>
            <th>Industry</th>
            <th>Country</th>
            <th>State</th>
            <th>City</th>
            <th>Currency</th>
            <th>Budget Min</th>
            <th>Budget Max</th>
            <th>Onboard Date</th>
            <th>Edit</th>
    <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {orgTable.map((row, index) => (
            <tr key={index}>
              <td>{row.department}</td>
              <td>{row.position}</td>
              <td>{row.level}</td>
              <td>{row.qualification}</td>
              <td>{row.experience}</td>
              <td>{row.industry}</td>
              <td>{row.country}</td>
              <td>{row.state}</td>
              <td>{row.city}</td>
              <td>{row.currency}</td>
              <td>{row.budgetMin}</td>
              <td>{row.budgetMax}</td>
              <td>{row.onboardDate}</td>
                {/* EDIT TEMP */}
      <td>
        <Edit
          size={18}
          role="button"
          className="text-primary"
          onClick={() => editOrgRow(row, index)}
        />
      </td>

      {/* DELETE TEMP */}
      <td>
        <Trash2
          size={18}
          role="button"
          className="text-danger"
          onClick={() => deleteOrgRow(index)}
        />
      </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="text-center mt-3">
      <button
        className="btn btn-success px-5"
        onClick={submitOrganization}
      >
        SUBMIT
      </button>
    </div>
  </div>
)}
    {/* ================= VIEW ORGANIZATION ================= */}
{formType === "ViewOrganization" && (
  <div className="bg-white p-3 rounded shadow-sm">
    <h4 className="text-center text-primary mb-4">View Organization</h4>

    <div className="mb-2 text-end">
      <label className="me-3">
        <input
          type="radio"
          checked={activeFilter === "active"}
          onChange={() => setActiveFilter("active")}
        />{" "}
        Active
      </label>
      <label>
        <input
          type="radio"
          checked={activeFilter === "inactive"}
          onChange={() => setActiveFilter("inactive")}
        />{" "}
        Inactive
      </label>
    </div>

    <div className="table-responsive">
      <table className="table table-bordered text-center">
        <thead className="table-light">
          <tr>
            <th>Department</th>
            <th>Position</th>
            <th>Level</th>
            <th>Qualification</th>
            <th>Experience</th>
            <th>Industry</th>
            <th>Country</th>
            <th>State</th>
            <th>City</th>
            <th>Currency</th>
            <th>Budget Min</th>
            <th>Budget Max</th>
            <th>Onboard Date</th>
<th>Deactivate</th>
          </tr>
        </thead>
        <tbody>
          {organizationTable.length > 0 ? (
            organizationTable.map((row) => (
              <tr key={row.id}>
                <td>{row.department || "-"}</td>
                <td>{row.position || "-"}</td>
                <td>{row.level || "-"}</td>
                <td>{row.qualification || "-"}</td>
                <td>{row.experience || "-"}</td>
                <td>{row.industry || "-"}</td>
                <td>{row.country || "-"}</td>
                <td>{row.state || "-"}</td>
                <td>{row.city || "-"}</td>
                <td>{row.currency || "-"}</td>
                <td>{row.budgetMin || "-"}</td>
                <td>{row.budgetMax || "-"}</td>
                <td>{row.onboardDate || "-"}</td>
                 
<td>
  <Trash2
    size={20}
    role="button"
    className="text-danger"
    title="Delete"
    onClick={() => toggleOrganizationActive(row.id, false)}
  />
</td>


              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="14">No Records Found</td>
            </tr>
          )}
        </tbody>
      


            </table>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default CreateMaster;
