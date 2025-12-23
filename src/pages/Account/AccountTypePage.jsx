import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AccountTypePage.css";
import { API_ENDPOINTS } from "../../config/apiconfig";

function AccountTypePage() {
  const [accountTypes, setAccountTypes] = useState([]);
  const [accountTypeId, setAccountTypeId] = useState(null);
  const [newName, setNewName] = useState("");
  const [newNarration, setNewNarration] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  useEffect(() => {
    fetchAccountTypes();
  }, []);

  const fetchAccountTypes = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.AccountType);
      console.log("Fetched data:", res.data);
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
        await axios.put(`${API_ENDPOINTS.AccountType}/${accountTypeId}`, payload);
        toast.success("Account type updated successfully!");
      } else {
        await axios.post(API_ENDPOINTS.AccountType, payload);
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
      await axios.delete(`${API_ENDPOINTS.AccountType}/${id}`);
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

  // Filter account types
  const filteredAccountTypes = accountTypes.filter(
    (type) =>
      type.accountTypeName.toLowerCase().includes(searchText.toLowerCase()) ||
      type.accountTypeNarration.toLowerCase().includes(searchText.toLowerCase())
  );

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredAccountTypes.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredAccountTypes.length / recordsPerPage);

  // Reset to page 1 when search changes
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };

  // Reset to page 1 after data refresh
  useEffect(() => {
    setCurrentPage(1);
  }, [accountTypes]);

  // ✅ BUILT-IN PAGINATION FUNCTIONS
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

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
          onChange={handleSearchChange}
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
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    {filteredAccountTypes.length === 0 ? "No account types found" : "No records on this page"}
                  </td>
                </tr>
              ) : (
                currentRecords.map((type) => (
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
                ))
              )}
            </tbody>
          </table>

          {/* ✅ BUILT-IN PAGINATION COMPONENT */}
          {totalPages > 1 && (
            <div className="pagination-wrapper mt-4">
              <div className="d-flex justify-content-between align-items-center">
                <div className="text-muted small">
                  Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredAccountTypes.length)} of {filteredAccountTypes.length} entries
                </div>
                <nav aria-label="Page navigation">
                  <ul className="pagination mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>

                    {getPageNumbers().map(number => (
                      <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => paginate(number)}
                        >
                          {number}
                        </button>
                      </li>
                    ))}

                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default AccountTypePage;
