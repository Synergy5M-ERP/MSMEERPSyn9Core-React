import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { Save, Edit, Trash2 } from "lucide-react";
import { API_ENDPOINTS } from "../../config/apiconfig";
import Pagination from "../../components/Pagination"; // ✅ Your custom Pagination

function AccountGroupSubgroup() {
  const [formType, setFormType] = useState("primaryGroup");
  const [accountTypes, setAccountTypes] = useState([]);
  const [accountGroups, setAccountGroups] = useState([]);
  const [subGroups, setSubGroups] = useState([]);
  const [tableData, setTableData] = useState([]);
 // ✅ CODE STATES
  
const [primaryGroupType, setPrimaryGroupType] = useState("");
  const [PrimaryGroupId, setPrimaryGroupId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [subGroupId, setSubGroupId] = useState("");
  const [name, setName] = useState("");
  const [narration, setNarration] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("active");

  // ✅ PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 4;

  // --------------------------------------------------------------------------------------------------
  // 🔗 API Endpoints (declared once)
  // --------------------------------------------------------------------------------------------------
  const ENDPOINTS = {
  primaryGroup: `${API_ENDPOINTS.Account}PrimaryGroup`,
    accountGroup: `${API_ENDPOINTS.Account}AccountGroups`,
    subGroup: `${API_ENDPOINTS.Account}Subgroups`,
    subSubGroup: `${API_ENDPOINTS.Account}SubSubgroups`,
  };

  // --------------------------------------------------------------------------------------------------
  // 📌 Fetch Table Data
  // --------------------------------------------------------------------------------------------------
  const fetchTableData = useCallback(
    async (type = formType, status = activeFilter) => {
      try {
        const url = ENDPOINTS[type];
        const res = await axios.get(url);
        let data = res.data || [];

        if (status === "active") data = data.filter((x) => x.isActive === true);
        else if (status === "inactive") data = data.filter((x) => x.isActive === false);

        setTableData(data);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
        toast.error("Failed to load data");
      }
    },
    [formType, activeFilter]
  );

  // --------------------------------------------------------------------------------------------------
  // 📌 Load Dropdown Data
  const loadDropdowns = useCallback(async () => {
  try {
    const [primaryRes, groupsRes, subsRes] = await Promise.allSettled([
      axios.get(ENDPOINTS.primaryGroup),
      axios.get(ENDPOINTS.accountGroup),
      axios.get(ENDPOINTS.subGroup),
    ]);

    if (primaryRes.status === "fulfilled")
      setAccountTypes(primaryRes.value.data);

    if (groupsRes.status === "fulfilled")
      setAccountGroups(groupsRes.value.data);

    if (subsRes.status === "fulfilled")
      setSubGroups(subsRes.value.data);

  } catch {
    toast.error("Failed to load dropdown data");
  }
}, []);

  // --------------------------------------------------------------------------------------------------
  // 📌 Effects
  // --------------------------------------------------------------------------------------------------
  useEffect(() => {
    loadDropdowns();
  }, [loadDropdowns]);

  useEffect(() => {
    fetchTableData(formType, activeFilter);
    setCurrentPage(1); // ✅ Reset to page 1 on filter change
  }, [formType, activeFilter, fetchTableData]);



  // --------------------------------------------------------------------------------------------------
  // 📌 Reset Form
  // --------------------------------------------------------------------------------------------------
  const resetForm = () => {
    setPrimaryGroupId("");
    setGroupId("");
    setSubGroupId("");
    setName("");
    setNarration("");
    setGroupCode("");
    setIsActive(true);
    setEditingId(null);
   
  };

  // --------------------------------------------------------------------------------------------------
  // 📌 SAVE / UPDATE (UNCHANGED)
  // --------------------------------------------------------------------------------------------------
  const handleSave = async () => {
    try {
      let payload = {};
      let url = "";
      const method = editingId ? "put" : "post";

      // ==============================
      // ACCOUNT TYPE
      // ==============================
  if (formType === "primaryGroup") {
  if (!name.trim()) return toast.warning("Enter Primary Group Name!");
  if (!primaryGroupType) return toast.warning("Select Type (BL / PL)!");

 payload = {
  AccountPrimaryGroupName: name,
  Type: primaryGroupType,
  Description: narration,
  IsActive: isActive
};

  url = editingId
    ? `${API_ENDPOINTS.Account}PrimaryGroup/${editingId}`
    : `${API_ENDPOINTS.Account}PrimaryGroup`;
}
      // ==============================
      // ACCOUNT GROUP
      // ==============================
      else if (formType === "accountGroup") {
       if (!PrimaryGroupId ||  !name.trim())
  return toast.warning("Select Account PrimaryGroup, Code, and Name!");

      payload = {
  AccountGroupName: name,
  AccountGroupNarration: narration,
  PrimaryGroupId: Number(PrimaryGroupId),
  IsActive: isActive
};

        url = editingId
          ? `${ENDPOINTS.accountGroup}/${editingId}`
          : ENDPOINTS.accountGroup;
      }

      // ==============================
      // SUB GROUP
      // ==============================
      else if (formType === "subGroup") {
        if (!groupId || !name.trim())
          return toast.warning("Select Group and enter Sub Group name!");

        payload = {
  AccountSubGroupName: name,
  AccountSubGroupNarration: narration,
  AccountGroupid: Number(groupId),
  IsActive: isActive,
};
        url = editingId
          ? `${ENDPOINTS.subGroup}/${editingId}`
          : ENDPOINTS.subGroup;
      }

      // ==============================
      // SUB - SUB GROUP
      // ==============================
    else if (formType === "subSubGroup") {
    // ✅ Validation
    if (!groupId || !subGroupId || !name?.trim()) {
        return toast.warning("Select Group, Sub Group, and enter name!");
    }

  payload = {
  AccountSubSubGroupName: name.trim(),
  AccountSubSubGroupNarration: narration?.trim() || "",
  AccountGroupid: Number(groupId),
  AccountSubGroupid: Number(subGroupId),
  IsActive: Boolean(isActive),
};

url = editingId
  ? `${ENDPOINTS.subSubGroup}/${editingId}`
  : ENDPOINTS.subSubGroup;

    // You can now use `url` and `payload` for your API call
}


      // ==============================
      // API CALL
      // ==============================
      await axios({ method, url, data: payload });

      toast.success(editingId ? "Updated successfully!" : "Saved successfully!");

      resetForm();
      fetchTableData(formType, activeFilter);
    } catch (err) {
      console.error("❌ Save error:", err);
      toast.error("Failed to save record");
    }
  };

const handleEdit = (item) => {
  resetForm();
  setIsActive(item.isActive ?? true);

  // ================= PRIMARY GROUP =================
  if (formType === "primaryGroup") {
    setEditingId(item.primaryGroupId);
    setName(item.accountPrimaryGroupName || "");
    setNarration(item.description || "");
    setPrimaryGroupType(item.type || "");
  }

  // ================= ACCOUNT GROUP =================
  else if (formType === "accountGroup") {
    setEditingId(item.accountGroupid);
    setPrimaryGroupId(String(item.primaryGroupId || ""));
    setName(item.accountGroupName || "");
    setNarration(item.accountGroupNarration || "");
  }

  // ================= SUB GROUP =================
  else if (formType === "subGroup") {
    setEditingId(item.accountSubGroupid);

    setPrimaryGroupId(String(item.primaryGroupId || ""));
    setGroupId(String(item.accountGroupid || ""));

    setName(item.accountSubGroupName || "");
    setNarration(item.accountSubGroupNarration || "");
  }

  // ================= SUB SUB GROUP =================
  else if (formType === "subSubGroup") {
    setEditingId(item.accountSubSubGroupid);

    setPrimaryGroupId(String(item.primaryGroupId || ""));
    setGroupId(String(item.accountGroupid || ""));
    setSubGroupId(String(item.accountSubGroupid || ""));

    setName(item.accountSubSubGroupName || "");
    setNarration(item.accountSubSubGroupNarration || "");
  }
};
 const handleDelete = async (id) => {
  const confirm = await Swal.fire({
    title: "Mark as Inactive?",
    text: "This record will be set inactive.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, deactivate",
  });

  if (!confirm.isConfirmed) return;

  try {
    const endpoints = {
      primaryGroup: `${API_ENDPOINTS.Account}PrimaryGroup`,
      accountGroup: `${API_ENDPOINTS.Account}AccountGroups`,
      subGroup: `${API_ENDPOINTS.Account}Subgroups`,
      subSubGroup: `${API_ENDPOINTS.Account}SubSubgroups`,
    };

    const url = endpoints[formType];

    console.log("Calling:", `${url}/${id}`); // 👈 VERY IMPORTANT DEBUG

    await axios.put(`${url}/${id}`, {
      isActive: false
    });

    toast.success("Marked inactive!");
    fetchTableData(formType, "active");

  } catch (error) {
    console.log(error.response?.data);
    toast.error("Failed to deactivate record");
  }
};

  // ✅ Activate (UNCHANGED)
  const handleActivate = async (id) => {
    try {
     const endpoints = {
  primaryGroup: `${API_ENDPOINTS.Account}PrimaryGroup`,
  accountGroup: `${API_ENDPOINTS.Account}AccountGroups`,
  subGroup: `${API_ENDPOINTS.Account}Subgroups`,
  subSubGroup: `${API_ENDPOINTS.Account}SubSubgroups`,
};
      await axios.put(`${endpoints[formType]}/${id}`, { isActive: true });
      toast.success("Activated!");
      fetchTableData(formType, activeFilter);
    } catch {
      toast.error("Failed to activate record");
    }
  };

  // --------------------------------------------------------------------------------------------------
  // ✅ PAGINATION LOGIC (for your custom component)
  // --------------------------------------------------------------------------------------------------
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentTableData = tableData.slice(indexOfFirstRecord, indexOfLastRecord);
return (
  <div style={{ minHeight: "85vh" }}>
    <ToastContainer position="top-right" autoClose={2000} />

    <div className="container-fluid">
      <h2 style={{ textAlign: "left", color: "#0066cc" }}>
        Account Group Master
      </h2>

      {/* ================= TOGGLE ================= */}
      <div className="d-flex justify-content-between align-items-center bg-white p-3 rounded mb-3 shadow-sm">
        <div>
          {["primaryGroup", "accountGroup", "subGroup", "subSubGroup"].map((type) => (
            <label key={type} style={{ marginRight: 20 }}>
              <input
                type="radio"
                checked={formType === type}
                onChange={() => {
                  setFormType(type);
                  resetForm();
                }}
                style={{ marginRight: 5 }}
              />
              {type === "primaryGroup"
                ? "Primary Group"
                : type === "accountGroup"
                ? "Account Group"
                : type === "subGroup"
                ? "Sub Group"
                : "Sub-Sub Group"}
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

        {/* ================= LEFT FORM ================= */}
        <div className="col-lg-5">
          <div className="p-3 bg-white rounded shadow-sm">

            {/* PRIMARY DROPDOWN (For Account/Sub/SubSub) */}
            {(formType === "accountGroup" ||
              formType === "subGroup" ||
              formType === "subSubGroup") && (
              <>
                <label>Account Primary Name</label>
                <select
                  value={PrimaryGroupId}
                  onChange={(e) => setPrimaryGroupId(e.target.value)}
                  className="form-select mb-2"
                >
                  <option value="">Select Primary Group</option>
                  {accountTypes.map((t) => (
                    <option key={t.primaryGroupId} value={t.primaryGroupId}>
                      {t.accountPrimaryGroupName}
                    </option>
                  ))}
                </select>
              </>
            )}

            {/* GROUP DROPDOWN */}
            {(formType === "subGroup" || formType === "subSubGroup") && (
              <>
                <label>Account Group Name</label>
                <select
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                  className="form-select mb-2"
                >
                  <option value="">Select Group</option>
                  {accountGroups.map((g) => (
                    <option key={g.accountGroupid} value={g.accountGroupid}>
                      {g.accountGroupName}
                    </option>
                  ))}
                </select>
              </>
            )}

            {/* SUB GROUP DROPDOWN */}
            {formType === "subSubGroup" && (
              <>
                <label>Sub Group Name</label>
                <select
                  value={subGroupId}
                  onChange={(e) => setSubGroupId(e.target.value)}
                  className="form-select mb-2"
                >
                  <option value="">Select Sub Group</option>
                  {subGroups
                    .filter((s) => Number(s.accountGroupid) === Number(groupId))
                    .map((s) => (
                      <option key={s.accountSubGroupid} value={s.accountSubGroupid}>
                        {s.accountSubGroupName}
                      </option>
                    ))}
                </select>
              </>
            )}

            {/* NAME */}
            <label>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control mb-2"
            />

            {/* TYPE ONLY FOR PRIMARY */}
            {formType === "primaryGroup" && (
              <>
                <label>Type</label>
                <select
                  value={primaryGroupType}
                  onChange={(e) => setPrimaryGroupType(e.target.value)}
                  className="form-select mb-2"
                >
                  <option value="">Select Type</option>
                  <option value="BS">BS</option>
                  <option value="P&L">P&L</option>
                </select>
              </>
            )}

            {/* NARRATION */}
            <label>Narration</label>
            <textarea
              rows={3}
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              className="form-control mb-3"
            />

            <div className="d-flex gap-2">
              <button className="btn btn-primary" onClick={handleSave}>
                <Save size={16} /> {editingId ? "Update" : "Save"}
              </button>
              <button className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>

          </div>
        </div>

        {/* ================= RIGHT TABLE ================= */}
        <div className="col-lg-7">
          <div className="p-3 bg-white rounded shadow-sm">
            <div className="table-responsive">
              <table className="table table-bordered text-center">
                <thead className="table-light">
                  <tr>
                    {formType === "primaryGroup" && (
                      <>
                                              <th>Name</th>

                        <th>Type</th>
                        <th>Narration</th>
                      </>
                    )}

                    {formType === "accountGroup" && (
                      <>
                        <th>Primary Group</th>
                        <th>Group Name</th>
                        <th>Narration</th>
                      </>
                    )}

                    {formType === "subGroup" && (
                      <>
                        <th>Group Name</th>
                        <th>Sub Group Name</th>
                        <th>Narration</th>
                      </>
                    )}

                    {formType === "subSubGroup" && (
                      <>
                        <th>Primary Group</th>
                        <th>Group Name</th>
                        <th>Sub Group Name</th>
                        <th>Sub Sub Group Name</th>
                        <th>Narration</th>
                      </>
                    )}

                    <th>Edit</th>
                    <th>{activeFilter === "active" ? "Deactivate" : "Activate"}</th>
                  </tr>
                </thead>

                <tbody>
                  {currentTableData.length > 0 ? (
                    currentTableData.map((item) => {
                           let id;

      if (formType === "primaryGroup") {
        id = item.primaryGroupId;
      } 
      else if (formType === "accountGroup") {
        id = item.accountGroupid;
      } 
      else if (formType === "subGroup") {
        id = item.accountSubGroupid;
      } 
      else if (formType === "subSubGroup") {
        id = item.accountSubSubGroupid;
      }
                      return (
                        <tr key={id}>
                          {formType === "primaryGroup" && (
                            <>                              <td>{item.accountPrimaryGroupName}</td>

                              <td>{item.type}</td>
                              <td>{item.description}</td>
                            </>
                          )}

                          {formType === "accountGroup" && (
                            <>
                              <td>{item.accountPrimaryGroupName}</td>
                              <td>{item.accountGroupName}</td>
                              <td>{item.accountGroupNarration}</td>
                            </>
                          )}

                          {formType === "subGroup" && (
                            <>
                              <td>{item.accountGroupName}</td>
                              <td>{item.accountSubGroupName}</td>
                              <td>{item.accountSubGroupNarration}</td>
                            </>
                          )}

                          {formType === "subSubGroup" && (
                            <>
                              <td>{item.accountPrimaryGroupName}</td>
                              <td>{item.accountGroupName}</td>
                              <td>{item.accountSubGroupName}</td>
                              <td>{item.accountSubSubGroupName}</td>
                              <td>{item.accountSubSubGroupNarration}</td>
                            </>
                          )}

                          <td>
                            <Edit
                              className="text-primary"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleEdit(item)}
                              size={18}
                            />
                          </td>

                          <td>
                            {activeFilter === "active" ? (
                              <Trash2
                                className="text-danger"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleDelete(id)}
                                size={18}
                              />
                            ) : (
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => handleActivate(id)}
                              >
                                Activate
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7">No records found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              totalRecords={tableData.length}
              recordsPerPage={recordsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

      </div>
    </div>
  </div>
);
}

export default AccountGroupSubgroup;
