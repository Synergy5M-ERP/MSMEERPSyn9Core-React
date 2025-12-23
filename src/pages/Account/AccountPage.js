import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AccountPage() {
  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState(null);
  const [accountName, setAccountName] = useState("");
  const [accountCode, setAccountCode] = useState("");
  const [accountTypeId, setAccountTypeId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  const apiBase = "https://msmeerpsyn9-core.azurewebsites.net/api/Account";

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(apiBase);
      const data = Array.isArray(res.data) ? res.data : [];
      setAccounts(data);

      if (data.length === 0) {
        toast.info("No accounts found. Please add a record first.");
      }
    } catch (err) {
      console.error("Error fetching accounts:", err);
      toast.error("Failed to fetch accounts.");
      setAccounts([]);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!accountName.trim() || !accountCode.trim()) {
      toast.warning("Please fill all required fields!");
      return;
    }

    const payload = { accountName, accountCode, accountTypeId, isActive };

    try {
      if (accountId) {
        await axios.put(`${apiBase}/${accountId}`, payload);
        toast.success("Account updated successfully!");
      } else {
        await axios.post(apiBase, payload);
        toast.success("Account added successfully!");
      }
      handleCancel();
      fetchAccounts();
    } catch (err) {
      console.error("Error saving account:", err);
      toast.error("Failed to save account.");
    }
  };

  const handleEdit = (acc) => {
    setAccountId(acc.accountId);
    setAccountName(acc.accountName);
    setAccountCode(acc.accountCode);
    setAccountTypeId(acc.accountTypeId);
    setIsActive(acc.isActive);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this account?")) return;
    try {
      await axios.delete(`${apiBase}/${id}`);
      toast.success("Account deleted successfully!");
      fetchAccounts();
    } catch (err) {
      console.error("Error deleting account:", err);
      toast.error("Failed to delete account.");
    }
  };

  const handleCancel = () => {
    setAccountId(null);
    setAccountName("");
    setAccountCode("");
    setAccountTypeId("");
    setIsActive(true);
  };

  const filteredAccounts = accounts.filter(
    (acc) =>
      acc.accountName.toLowerCase().includes(searchText.toLowerCase()) ||
      acc.accountCode.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="account-container">
      {/* Left Panel: Form */}
      <div className="left-panel">
        <h3>{accountId ? "UPDATE ACCOUNT" : "ADD ACCOUNT"}</h3>
        <input
          type="text"
          placeholder="Account Name"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          className="form-control"
        />
        <input
          type="text"
          placeholder="Account Code"
          value={accountCode}
          onChange={(e) => setAccountCode(e.target.value)}
          className="form-control"
        />
        <input
          type="number"
          placeholder="Account Type ID"
          value={accountTypeId}
          onChange={(e) => setAccountTypeId(e.target.value)}
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

        <div className="form-buttons">
          <button className="btn-save" onClick={handleSave}>
            {accountId ? "Update" : "Save"}
          </button>
          <button className="btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>

      {/* Right Panel: Table */}
      <div className="right-panel">
        <h3>ACCOUNT LIST</h3>
        <input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="form-control search-input"
        />
        {loading ? (
          <p>Loading accounts...</p>
        ) : (
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Code</th>
                <th>Type ID</th>
                <th>Active</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map((acc) => (
                  <tr key={acc.accountId}>
                    <td>{acc.accountId}</td>
                    <td>{acc.accountName}</td>
                    <td>{acc.accountCode}</td>
                    <td>{acc.accountTypeId}</td>
                    <td>{acc.isActive ? "Yes" : "No"}</td>
                    <td>
                      <button className="btn-edit" onClick={() => handleEdit(acc)}>✏️</button>
                    </td>
                    <td>
                      <button className="btn-delete" onClick={() => handleDelete(acc.accountId)}>🗑️</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No accounts available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default AccountPage;
