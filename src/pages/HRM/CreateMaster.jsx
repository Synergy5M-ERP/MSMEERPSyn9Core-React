import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Save, Edit, Trash2 } from "lucide-react";

//const API_BASE_URL = "https://localhost:7145/api/HrmMaster";
const API_BASE_URL="https://msmeerpsyn9-core.azurewebsites.net/api/HrmMaster"

function CreateMaster() {
  const [formType, setFormType] = useState("Department");
  const [tableData, setTableData] = useState([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("active");

  // Fetch table data
  const fetchTableData = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/${formType}`);

      let data = res.data || [];
      data = data.filter((x) =>
        activeFilter === "active" ? x.isActive !== false : x.isActive === false
      );

      setTableData(data);
    } catch (err) {
      toast.error("Failed to fetch data");
    }
  }, [formType, activeFilter]);

  useEffect(() => {
    fetchTableData();
    resetForm();
  }, [fetchTableData]);

  // Reset form
  const resetForm = () => {
    setName("");
    setCode("");
    setEditingId(null);
    setIsActive(true);
  };

  // Save / Update
  const handleSave = async () => {
  if (!name.trim()) return toast.warning("Enter name!");

  let mainPayload = { isActive };

if (formType === "Department") mainPayload.DepartmentName = name;
if (formType === "Designation") mainPayload.DesignationName = name;
if (formType === "AuthorityMatrix") mainPayload.AuthorityName = name;

try {
  let res;

  if (editingId) {
    res = await axios.put(`${API_BASE_URL}/${formType}/${editingId}`, mainPayload);
  } else {
    res = await axios.post(`${API_BASE_URL}/${formType}`, mainPayload);
  }

  toast.success("Saved successfully!");
  fetchTableData();
  resetForm();

} catch (err) {
  toast.error(err.response?.data?.message || "Failed to save");
}

};

  // Edit record
  const handleEdit = (item) => {
    setEditingId(item.id);
    setIsActive(item.isActive ?? true);

    if (formType === "AuthorityMatrix") {
      setName(item.authorityName);
      setCode(item.authority_code);
    }
    if (formType === "Department") {
      setName(item.departmentName);
      setCode(item.department_code);
    }
    if (formType === "Designation") {
      setName(item.designationName);
      setCode(item.designation_code);
    }
  };

  // Toggle Active/Inactive
  const toggleActive = async (id, activate) => {
    try {
      await axios.put(`${API_BASE_URL}/${formType}/${id}`, { isActive: activate });
      toast.success(activate ? "Activated!" : "Deactivated!");
      fetchTableData();
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div style={{ padding: 20, background: "#f5f5f5", minHeight: "85vh" }}>
      <div className="text-center text-primary h2 mb-4">CREATE MASTER</div>

      {/* Master Type Filter */}
      <div className="d-flex justify-content-between flex-wrap mb-3 bg-white p-3 rounded shadow-sm">
        <div>
          {["Department", "Designation", "AuthorityMatrix"].map((type) => (
            <label key={type} style={{ marginRight: 20 }}>
              <input
                type="radio"
                name="formType"
                value={type}
                checked={formType === type}
                onChange={() => setFormType(type)}
                style={{ marginRight: 5 }}
              />
              {type}
            </label>
          ))}
        </div>

        <div>
          {["active", "inactive"].map((status) => (
            <label key={status} style={{ marginRight: 15 }}>
              <input
                type="radio"
                value={status}
                checked={activeFilter === status}
                onChange={(e) => setActiveFilter(e.target.value)}
                style={{ marginRight: 5 }}
              />
              {status === "active" ? "Active" : "Inactive"}
            </label>
          ))}
        </div>
      </div>

      <div className="row">
        {/* Form */}
        <div className="col-lg-5">
          <div className="p-3 bg-white rounded shadow-sm">
            <label>Name:</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control mb-2"
            />

            {editingId && (
              <>
                <label>Code:</label>
                <input className="form-control mb-2" value={code} readOnly />
              </>
            )}

            <div className="d-flex gap-2">
              <button className="btn btn-success" onClick={handleSave}>
                <Save size={16} /> {editingId ? "Update" : "Save"}
              </button>
              <button className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="col-lg-7">
          <div className="p-3 bg-white rounded shadow-sm table-responsive">
            <table className="table table-bordered text-center align-middle">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  {(formType === "Department" || formType === "Designation") && <th>Code</th>}
                  <th>Edit</th>
                  <th>{activeFilter === "active" ? "Deactivate" : "Activate"}</th>
                </tr>
              </thead>

              <tbody>
                {tableData.length > 0 ? (
                  tableData.map((item) => (
                    <tr key={item.id}>
                      <td>
                        {formType === "AuthorityMatrix"
                          ? item.authorityName
                          : formType === "Department"
                          ? item.departmentName
                          : item.designationName}
                      </td>

                      {(formType === "Department" || formType === "Designation" || formType === "AuthorityMatrix") && (
  <td>
    {formType === "Department"
      ? item.department_code
      : formType === "Designation"
      ? item.designation_code
      : item.authority_code}
  </td>
)}


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
                            onClick={() => toggleActive(item.id, false)}
                          />
                        ) : (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => toggleActive(item.id, true)}
                          >
                            Activate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={formType === "AuthorityMatrix" ? 3 : 4}>
                      No Records Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default CreateMaster;
