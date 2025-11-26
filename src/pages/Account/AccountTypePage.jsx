import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AccountTypePage.css";

function AccountTypePage() {
  const [accountTypes, setAccountTypes] = useState([]);
  const [accountTypeId, setAccountTypeId] = useState(null);
  const [newName, setNewName] = useState("");
  const [newNarration, setNewNarration] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [searchText, setSearchText] = useState("");

  // Replace with your actual API URL
  const apiBase = "https://localhost:7145/api/Account/AccountType";

  // Fetch account types on mount
  useEffect(() => {
    fetchAccountTypes();
  }, []);

  const fetchAccountTypes = async () => {
    try {
const res = await axios.get(apiBase);
      console.log("Fetched data:", res.data); // Debug API response
      setAccountTypes(res.data);
    } catch (err) {
      console.error("Error fetching account types:", err);
      toast.error("Failed to fetch account types.");
    }
  };

  const handleSave = async () => {
    if (!newName.trim()) {
      toast.warning("Please enter an account type name!");
      return;
    }

    const payload = { accountTypeName: newName, accountTypeNarration: newNarration, isActive };

    try {
      if (accountTypeId) {
        await axios.put(`${apiBase}/${accountTypeId}`, payload);
        toast.success("Account type updated successfully!");
      } else {
        await axios.post(apiBase, payload);
        toast.success("Account type added successfully!");
      }
      handleCancel();
      fetchAccountTypes();
    } catch (err) {
      console.error("Error saving account type:", err);
      toast.error("Failed to save account type.");
    }
  };

  const handleEdit = (type) => {
    setAccountTypeId(type.accountTypeId);
    setNewName(type.accountTypeName);
    setNewNarration(type.accountTypeNarration);
    setIsActive(type.isActive);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await axios.delete(`${apiBase}/${id}`);
      toast.success("Deleted successfully!");
      fetchAccountTypes();
    } catch (err) {
      console.error("Error deleting account type:", err);
      toast.error("Failed to delete account type.");
    }
  };

  const handleCancel = () => {
    setAccountTypeId(null);
    setNewName("");
    setNewNarration("");
    setIsActive(true);
  };

  const filteredAccountTypes = accountTypes.filter(
    (type) =>
      type.accountTypeName.toLowerCase().includes(searchText.toLowerCase()) ||
      type.accountTypeNarration.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="accounttype-container">
      <div className="left-panel">
        <h3 className="form-title">{accountTypeId ? "Edit Account Type" : "Add Account Type"}</h3>

        <div className="form-row">
          <input
            type="text"
            placeholder="Account Type Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="form-control"
          />
          <input
            type="text"
            placeholder="Narration"
            value={newNarration}
            onChange={(e) => setNewNarration(e.target.value)}
            className="form-control"
          />
          <div className="form-check">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="form-check-input"
              id="isActiveCheck"
            />
            <label className="form-check-label" htmlFor="isActiveCheck">
              Is Active
            </label>
          </div>
        </div>

        <div className="form-buttons">
          <button className="btn-save" onClick={handleSave}>
            {accountTypeId ? "Update" : "Save"}
          </button>
          <button className="btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>

      <div className="right-panel">
        <h3>Account Type List</h3>
        <input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="form-control search-input"
        />
        <div className="data-table-wrapper">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th className="text-primary">ID</th>
                <th>Name</th>
                <th>Narration</th>
                <th>Active</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccountTypes.map((type) => (
                <tr key={type.accountTypeId}>
                  <td>{type.accountTypeId}</td>
                  <td>{type.accountTypeName}</td>
                  <td>{type.accountTypeNarration}</td>
                  <td>{type.isActive ? "Yes" : "No"}</td>
                  <td>
                    <button className="btn-icon edit" onClick={() => handleEdit(type)}>
                      ✏️
                    </button>
                  </td>
                  <td>
                    <button className="btn-icon delete" onClick={() => handleDelete(type.accountTypeId)}>
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default AccountTypePage;
