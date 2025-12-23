import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { Save, Edit, Trash2 } from "lucide-react";
import { API_ENDPOINTS } from "../../config/apiconfig";
import Pagination from "../../components/Pagination"; // ✅ Your custom Pagination

function AccountGroupSubgroup() {
  const [formType, setFormType] = useState("accountType");
  const [accountTypes, setAccountTypes] = useState([]);
  const [accountGroups, setAccountGroups] = useState([]);
  const [subGroups, setSubGroups] = useState([]);
  const [tableData, setTableData] = useState([]);

  const [accountTypeId, setAccountTypeId] = useState("");
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
    accountType: `${API_ENDPOINTS.Account}AccountType`,
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
  // --------------------------------------------------------------------------------------------------
  const loadDropdowns = useCallback(async () => {
    try {
      const [typesRes, groupsRes, subsRes] = await Promise.allSettled([
        axios.get(ENDPOINTS.accountType),
        axios.get(ENDPOINTS.accountGroup),
        axios.get(ENDPOINTS.subGroup),
      ]);

      if (typesRes.status === "fulfilled") setAccountTypes(typesRes.value.data);
      if (groupsRes.status === "fulfilled") setAccountGroups(groupsRes.value.data);
      if (subsRes.status === "fulfilled") setSubGroups(subsRes.value.data);
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

  useEffect(() => setSubGroupId(""), [groupId]);

  // --------------------------------------------------------------------------------------------------
  // 📌 Reset Form
  // --------------------------------------------------------------------------------------------------
  const resetForm = () => {
    setAccountTypeId("");
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
      if (formType === "accountType") {
        if (!name.trim()) return toast.warning("Enter Account Type Name!");

        payload = {
          AccountTypeName: name,
          AccountTypeNarration: narration,
          IsActive: isActive,
          AccountGroups: [], // works but unnecessary
        };

        url = editingId
          ? `${ENDPOINTS.accountType}/${editingId}`
          : ENDPOINTS.accountType;
      }

      // ==============================
      // ACCOUNT GROUP
      // ==============================
      else if (formType === "accountGroup") {
        if (!accountTypeId || !groupCode.trim() || !name.trim())
          return toast.warning("Select Account Type, Code, and Name!");
        payload = {
          AccountGroupName: name,
          AccountGroupNarration: narration,
          GroupCode: groupCode,
          AccountTypeid: Number(accountTypeId),
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
        if (!groupId || !subGroupId || !name.trim())
          return toast.warning("Select Group, Sub Group, and enter name!");
        payload = {
          AccountSubSubGroupName: name,
          AccountSubSubGroupNarration: narration,
          AccountGroupid: Number(groupId),
          AccountSubGroupid: Number(subGroupId),
          IsActive: isActive,
        };

        url = editingId
          ? `${ENDPOINTS.subSubGroup}/${editingId}`
          : ENDPOINTS.subSubGroup;
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

  // ✅ Edit (UNCHANGED)
  const handleEdit = (item) => {
    resetForm();
    setIsActive(item.isActive ?? true);
    if (formType === "accountType") {
      setEditingId(item.accountTypeId);
      setName(item.accountTypeName);
      setNarration(item.accountTypeNarration);
    } else if (formType === "accountGroup") {
      setEditingId(item.accountGroupid);
      setName(item.accountGroupName);
      setNarration(item.accountGroupNarration);
      setGroupCode(item.groupCode);
      setAccountTypeId(item.accountTypeid);
    } else if (formType === "subGroup") {
      setEditingId(item.accountSubGroupid);
      setName(item.accountSubGroupName);
      setNarration(item.accountSubGroupNarration);
      setGroupId(item.accountGroupid);
    } else if (formType === "subSubGroup") {
      setEditingId(item.accountSubSubGroupid);
      setName(item.accountSubSubGroupName);
      setNarration(item.accountSubSubGroupNarration);
      setGroupId(item.accountGroupid);
      setSubGroupId(item.accountSubGroupid);
    }
  };

  // ✅ Deactivate (UNCHANGED)
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
        accountType: `${API_ENDPOINTS.Account}AccountType`,
        accountGroup: `${API_ENDPOINTS.Account}AccountGroups`,
        subGroup: `${API_ENDPOINTS.Account}Subgroups`,
        subSubGroup: `${API_ENDPOINTS.Account}SubSubgroups`,
      };

      await axios.put(`${endpoints[formType]}/${id}`, { isActive: false });
      toast.success("Marked inactive!");
      fetchTableData(formType, activeFilter);
    } catch {
      toast.error("Failed to deactivate record");
    }
  };

  // ✅ Activate (UNCHANGED)
  const handleActivate = async (id) => {
    try {
      const endpoints = {
        accountType: `${API_ENDPOINTS.Account}AccountType`,
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
    <div style={{ background: "#f5f5f5", minHeight: "85vh", padding: "20px" }}>
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="container-fluid">
        <h4 style={{ color: "#0066cc", fontWeight: "600", marginBottom: "20px" }}>
          Account Group
        </h4>

        {/* Toggle Buttons */}
        <div className="d-flex justify-content-between align-items-center flex-wrap bg-white p-3 rounded mb-3 shadow-sm">
          <div>
            {["accountType", "accountGroup", "subGroup", "subSubGroup"].map((type) => (
              <label key={type} style={{ marginRight: "20px" }}>
                <input
                  type="radio"
                  name="formType"
                  value={type}
                  checked={formType === type}
                  onChange={() => {
                    setFormType(type);
                    resetForm();
                  }}
                  style={{ marginRight: "8px" }}
                />
                {type === "accountType"
                  ? "Account Type"
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
              <label key={status} style={{ marginRight: "15px" }}>
                <input
                  type="radio"
                  value={status}
                  checked={activeFilter === status}
                  onChange={(e) => setActiveFilter(e.target.value)}
                  style={{ marginRight: "5px" }}
                />
                {status === "active" ? "Active" : "Inactive"}
              </label>
            ))}
          </div>
        </div>

        <div className="row">
          {/* LEFT FORM (UNCHANGED) */}
          <div className="col-lg-5">
            <div className="p-3 bg-white rounded shadow-sm">
              {formType === "accountGroup" && (
                <>
                  <label>Account Type:</label>
                  <select
                    value={accountTypeId}
                    onChange={(e) => setAccountTypeId(e.target.value)}
                    className="form-select mb-2"
                  >
                    <option value="">Select Type</option>
                    {accountTypes.map((t) => (
                      <option key={t.accountTypeId} value={t.accountTypeId}>
                        {t.accountTypeName}
                      </option>
                    ))}
                  </select>

                  <label>Group Code:</label>
                  <input
                    value={groupCode}
                    onChange={(e) => setGroupCode(e.target.value)}
                    className="form-control mb-2"
                  />
                </>
              )}

              {(formType === "subGroup" || formType === "subSubGroup") && (
                <>
                  <label>Account Group:</label>
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

              {formType === "subSubGroup" && (
                <>
                  <label>Sub Group:</label>
                  <select
                    value={subGroupId}
                    onChange={(e) => setSubGroupId(e.target.value)}
                    className="form-select mb-2"
                  >
                    <option value="">Select Sub Group</option>
                    {subGroups
                      .filter((s) => s.accountGroupid === Number(groupId))
                      .map((s) => (
                        <option key={s.accountSubGroupid} value={s.accountSubGroupid}>
                          {s.accountSubGroupName}
                        </option>
                      ))}
                  </select>
                </>
              )}

              <label>Name:</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control mb-2"
              />

              <label>Narration:</label>
              <textarea
                rows={3}
                value={narration}
                onChange={(e) => setNarration(e.target.value)}
                className="form-control mb-2"
              />

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

          {/* RIGHT TABLE WITH YOUR CUSTOM PAGINATION */}
          <div className="col-lg-7">
            <div className="p-3 bg-white rounded shadow-sm">
              <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <table className="table table-bordered align-middle text-center mb-3">
                  <thead className="table-light sticky-top">
                    <tr>
                      {/* Dynamic header based on form type */}
                      {formType === "accountType" && <th className="text-primary">Account Name</th>}

                      {formType === "accountGroup" && (
                        <>
                          <th className="text-primary">Account Name</th>
                          <th className="text-primary">Group Name</th>
                          <th className="text-primary">Group Code</th>
                        </>
                      )}

                      {formType === "subGroup" && (
                        <>
                          <th className="text-primary">Group Name</th>
                          <th className="text-primary">Sub Group Name</th>
                        </>
                      )}

                      {formType === "subSubGroup" && (
                        <>
                          <th className="text-primary">Group Name</th>
                          <th className="text-primary">Sub Group Name</th>
                          <th className="text-primary">Sub Sub Group Name</th>
                        </>
                      )}

                      {/* Action columns */}
                      <th className="text-primary">Edit</th>
                      <th className="text-primary">{activeFilter === "active" ? "Deactivate" : "Activate"}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentTableData.length > 0 ? (
                      currentTableData.map((item) => {
                        const id =
                          formType === "accountType"
                            ? item.accountTypeId
                            : formType === "accountGroup"
                            ? item.accountGroupid
                            : formType === "subGroup"
                            ? item.accountSubGroupid
                            : item.accountSubSubGroupid;

                        return (
                          <tr key={id}>
                            {/* ACCOUNT TYPE ROW */}
                            {formType === "accountType" && (
                              <td>{item.accountTypeName || "-"}</td>
                            )}

                            {/* ACCOUNT GROUP ROW */}
                            {formType === "accountGroup" && (
                              <>
                                <td>{item.accountTypeName || "-"}</td>
                                <td>{item.accountGroupName || "-"}</td>
                                <td>{item.groupCode || "-"}</td>
                              </>
                            )}

                            {/* SUB GROUP ROW */}
                            {formType === "subGroup" && (
                              <>
                                <td>{item.accountGroupName || "-"}</td>
                                <td>{item.accountSubGroupName || "-"}</td>
                              </>
                            )}

                            {/* SUB SUB GROUP ROW */}
                            {formType === "subSubGroup" && (
                              <>
                                <td>{item.accountGroupName || "-"}</td>
                                <td>{item.accountSubGroupName || "-"}</td>
                                <td>{item.accountSubSubGroupName || "-"}</td>
                              </>
                            )}

                            {/* Action columns */}
                            <td>
                              <Edit
                                className="text-primary"
                                role="button"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleEdit(item)}
                                size={18}
                              />
                            </td>
                            <td>
                              {activeFilter === "active" ? (
                                <Trash2
                                  className="text-danger"
                                  role="button"
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => handleDelete(id)}
                                  size={18}
                                />
                              ) : (
                                <button
                                  className="btn btn-sm btn-success"
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
                        <td
                          colSpan={
                            formType === "accountGroup"
                              ? 6
                              : formType === "subSubGroup"
                              ? 6
                              : formType === "subGroup"
                              ? 5
                              : 4
                          }
                          className="text-center py-4 text-muted"
                        >
                          No records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* ✅ YOUR CUSTOM PAGINATION COMPONENT */}
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
