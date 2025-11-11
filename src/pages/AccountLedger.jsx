import React, { useState, useEffect } from "react";
import { Eye, Save, Trash2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import axios from "axios";
import { API_ENDPOINTS } from "../config/apiconfig";
import Pagination from "../components/Pagination";

function AccountLedger({ view }) {
  const [formType, setFormType] = useState("ledger");
  const [ledger, setLedger] = useState("");
  const [ledgerGroupName, setLedgerGroupName] = useState("");
  const [accountGroupOptions, setAccountGroupOptions] = useState([]);
  const [accountGroup, setAccountGroup] = useState(""); // Only the selected value
const [ledgerSubGroupName, setLedgerSubGroupName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [emailId, setEmailId] = useState("");
  const [gstNo, setGstNo] = useState("");
  const [address, setAddress] = useState("");
  const [openingBal, setOpeningBal] = useState(0);
  const [closingBal, setClosingBal] = useState(0);
  const [description, setDescription] = useState("");
  const [ledgerId, setLedgerId] = useState([]);
  const [ledgers, setLedgers] = useState([]);
  const [subLedgers, setSubLedgers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 4;

  const activeFilter = view;

  useEffect(() => {
    if (formType === "ledger") {
      fetchLedgers(activeFilter);
    } else {
      fetchSubLedgers(activeFilter);
    }
    setCurrentPage(1);
  }, [formType, activeFilter]);
  useEffect(() => {
    const fetchAccountGroups = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.AccountGroups); // Set this endpoint in your apiconfig
        // Adjust data mapping as per your API response
        setAccountGroupOptions(response.data.data || response.data || []);
      } catch (error) {
        toast.error("Failed to fetch account groups");
        setAccountGroupOptions([]);
      }
    };
    fetchAccountGroups();
  }, []);

  const fetchLedgers = async (status = "active") => {
    setFetchLoading(true);
    try {
      let url = API_ENDPOINTS.Ledger;
      if (status === "active") url += "?isActive=true";
      else if (status === "inactive") url += "?isActive=false";

      const response = await axios.get(url);
      const raw = response.data.data || response.data || [];
      const mappedLedgers = raw.map((l) => ({
        AccountLedgerId: l.accountLedgerId,
        AccountLedgerName: l.accountLedgerName,
        AccountLedgerNarration: l.accountLedgerNarration,
        AccountGroup: l.accountGroup,
        LedgerGroupName: l.ledgerGroupName,
        MobileNo: l.mobileNo,
        EmailId: l.emailId,
        GstNo: l.gstNo,
        Address: l.address,
        OpeningBal: l.openingBal,
        ClosingBal: l.closingBal,
        IsActive: l.isActive,
      }));

      setLedgers(mappedLedgers);
    } catch (error) {
      toast.error(`Fetch Error: ${error.message}`);
      setLedgers([]);
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchSubLedgers = async (status = "active") => {
    setFetchLoading(true);
    try {
      let url = API_ENDPOINTS.SubLedger;
      if (status === "active") url += "?isActive=true";
      else if (status === "inactive") url += "?isActive=false";

      const response = await axios.get(url);
      const raw = response.data.data || response.data || [];
      const mappedSubLedgers = raw.map((s) => ({
        AccountLedgerSubid: s.accountLedgerSubid,
        AccountLedgerSubName: s.accountLedgerSubName,
        AccountLedgerSubNarration: s.accountLedgerSubNarration,
        AccountLedgerid: s.accountLedgerid,
        IsActive: s.isActive,
      }));

      setSubLedgers(mappedSubLedgers);
    } catch (error) {
      toast.error(`Fetch Error: ${error.message}`);
      setSubLedgers([]);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSave = async () => {
    if (
      !accountGroup ||
      !ledgerGroupName ||
      !mobileNo ||
      !emailId ||
      !gstNo ||
      !address ||
      !ledger.trim() ||
      !description.trim()
    ) {
      toast.warning("Please fill all required fields!");
      return;
    }
    if (formType === "subledger" && !ledgerId) {
      toast.error("Please select a Ledger first.");
      return;
    }

    setLoading(true);
    try {
      const baseUrl = formType === "ledger" ? API_ENDPOINTS.Ledger : API_ENDPOINTS.SubLedger;

      let payload = {};
      if (formType === "ledger") {
        payload = {
          accountLedgerName: ledger.trim(),
          accountLedgerNarration: description.trim(),
          accountGroup: accountGroup,
          ledgerGroupName: ledgerGroupName,
          mobileNo: mobileNo,
          emailId: emailId,
          gstNo: gstNo,
          address: address,
          openingBal: openingBal,
          closingBal: closingBal,
          isActive: true,
        };
      } else {
        payload = {
          accountLedgerSubName: ledger.trim(),
          accountLedgerSubNarration: description.trim(),
          accountLedgerId: Number(ledgerId),
          isActive: true,
        };
      }

      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${baseUrl}${editingId}` : baseUrl;

      const response = await axios({
        method,
        url,
        headers: { "Content-Type": "application/json" },
        data: payload,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(editingId ? "Updated successfully!" : "Added successfully!");
        if (formType === "ledger") {
          await fetchLedgers(activeFilter);
        } else {
          await fetchSubLedgers(activeFilter);
        }
        handleCancel();
      } else {
        toast.error("Failed to save record!");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(`Server Error: ${error.response.data?.message || error.response.status}`);
        } else if (error.request) {
          toast.error("No response from server. Check API URL or server.");
        } else {
          toast.error(`Request Error: ${error.message}`);
        }
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setLedger("");
    setLedgerGroupName("");
    setAccountGroup("");
    setMobileNo("");
    setEmailId("");
    setGstNo("");
    setAddress("");
    setOpeningBal(0);
    setClosingBal(0);
    setDescription("");
    setLedgerId("");
    setEditingId(null);
  };

  const handleEdit = (item) => {
    if (formType === "ledger") {
      setLedger(item.AccountLedgerName || "");
      setDescription(item.AccountLedgerNarration || "");
      setLedgerGroupName(item.LedgerGroupName || "");
      setAccountGroup(item.AccountGroup || "");
      setMobileNo(item.MobileNo || "");
      setEmailId(item.EmailId || "");
      setGstNo(item.GstNo || "");
      setAddress(item.Address || "");
      setOpeningBal(item.OpeningBal || 0);
      setClosingBal(item.ClosingBal || 0);
      setEditingId(item.AccountLedgerId || null);
    } else {
      setLedger(item.AccountLedgerSubName || "");
      setDescription(item.AccountLedgerSubNarration || "");
      setLedgerId(item.AccountLedgerid || "");
      setEditingId(item.AccountLedgerSubid || null);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: `Delete this ${formType === "ledger" ? "Account Ledger" : "Account Sub Ledger"}?`,
      html: '<small class="text-danger">This action cannot be undone.</small>',
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);
    try {
      const baseUrl = formType === "ledger" ? API_ENDPOINTS.Ledger : API_ENDPOINTS.SubLedger;

      const record =
        formType === "ledger"
          ? ledgers.find((l) => l.AccountLedgerId === id)
          : subLedgers.find((s) => s.AccountLedgerSubid === id);

      if (!record) {
        toast.error("Record not found in state.");
        setLoading(false);
        return;
      }

      let payload = {};
      if (formType === "ledger") {
        payload = {
          accountLedgerId: record.AccountLedgerId,
          accountLedgerName: record.AccountLedgerName,
          accountLedgerNarration: record.AccountLedgerNarration,
          accountGroup: record.AccountGroup,
          ledgerGroupName: record.LedgerGroupName,
          mobileNo: record.MobileNo,
          emailId: record.EmailId,
          gstNo: record.GstNo,
          address: record.Address,
          openingBal: record.OpeningBal,
          closingBal: record.ClosingBal,
          isActive: false,
        };
      } else {
        payload = {
          AccountLedgerSubid: record.AccountLedgerSubid,
          AccountLedgerSubName: record.AccountLedgerSubName,
          AccountLedgerSubNarration: record.AccountLedgerSubNarration,
          AccountLedgerId: record.AccountLedgerid,
          IsActive: false,
        };
      }

      const response = await axios.put(`${baseUrl}${id}`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        toast.success("Deleted successfully!");
        if (formType === "ledger") {
          await fetchLedgers(activeFilter);
        } else {
          await fetchSubLedgers(activeFilter);
        }
      } else {
        toast.error("Delete failed!");
      }
    } catch (error) {
      toast.error(`Delete Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (id) => {
    setLoading(true);
    try {
      const baseUrl = formType === "ledger" ? API_ENDPOINTS.Ledger : API_ENDPOINTS.SubLedger;

      const record =
        formType === "ledger"
          ? ledgers.find((l) => l.AccountLedgerId === id)
          : subLedgers.find((s) => s.AccountLedgerSubid === id);

      const payload = { ...record, isActive: true };

      await axios.put(`${baseUrl}${id}`, payload);

      toast.success("Activated!");
      if (formType === "ledger") {
        await fetchLedgers(activeFilter);
      } else {
        await fetchSubLedgers(activeFilter);
      }
    } finally {
      setLoading(false);
    }
  };

  const displayData = formType === "ledger" ? ledgers : subLedgers;

  const filteredData = displayData.filter((item) =>
    activeFilter === "active" ? item.IsActive !== false : item.IsActive === false
  );

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;

  const currentRecords = filteredData.slice(indexOfFirst, indexOfLast);

  const LoadingSpinner = () => (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "rgba(255,255,255,0.8)",
        zIndex: 2000,
      }}
    >
      <div className="text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 fw-semibold text-dark">Loading...</p>
      </div>
    </div>
  );

  if (fetchLoading) return <LoadingSpinner />;

  return (
    <div style={{ background: "#f5f5f5", minHeight: "80vh", padding: "20px" }}>
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="container-fluid">
        {/* Toggle Ledger/SubLedger */}
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
          className="d-flex justify-content-between align-items-center flex-wrap"
        >
          <div>
            <label style={{ marginRight: "20px" }}>
              <input
                type="radio"
                name="formType"
                value="ledger"
                checked={formType === "ledger"}
                onChange={() => {
                  setFormType("ledger");
                  handleCancel();
                }}
                style={{ marginRight: "8px" }}
              />
              Account Ledger
            </label>
            <label>
              <input
                type="radio"
                name="formType"
                value="subledger"
                checked={formType === "subledger"}
                onChange={() => {
                  setFormType("subledger");
                  handleCancel();
                }}
                style={{ marginRight: "8px" }}
              />
              Account Sub Ledger
            </label>
          </div>
        </div>

        <div className="row">
          {/* Form Section */}
          <div className="col-lg-7">
            <div style={{ background: "white", padding: "25px", borderRadius: "8px" }}>
        <div className="row">
                {formType === "subledger" && (
                <div className=" col-6 mb-3">
                  <label style={{ color: "#0066cc", fontWeight: "600" }}>Ledger Group Name</label>
                  <select
                    value={ledgerId}
                    onChange={(e) => setLedgerId(Number(e.target.value))}
                    disabled={loading}
                    className="form-control"
                  >
                    <option value="">-- Ledger Group Name --</option>
                    {ledgers.map((l) => (
                      <option key={l.AccountLedgerId} value={l.AccountLedgerId}>
                        {l.AccountLedgerName}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {formType === "subledger" && (
                <div className=" col-6 mb-3">
                  <label style={{ color: "#0066cc", fontWeight: "600" }}>Ledger Sub-Group Name</label>
                    <input
                        type="text"
                        value={ledgerSubGroupName}
                        onChange={e => setLedgerSubGroupName(e.target.value)}
                        className="form-control"
                        placeholder="Enter Ledger Sub Group Name"
                        disabled={loading}
                      />
                </div>
              )}
        </div>
              {formType === "ledger" && (
                <>
                  <div className="row">
                    <div className=" col-6  mb-3">
                      <label style={{ color: "#0066cc", fontWeight: "600" }}>Account Group</label>
                      <select
                        value={accountGroup}
                        onChange={e => setAccountGroup(e.target.value)}
                        disabled={loading}
                        className="form-control"
                      >
                        <option value="">--Select Group--</option>
                        {accountGroupOptions.map((grp) => (
                          <option key={grp.id || grp.accountGroupId} value={grp.name || grp.accountGroup}>
                            {grp.name || grp.accountGroup}
                          </option>
                        ))}
                      </select>

                    </div>
                    <div className=" col-6  mb-3">
                      <label style={{ color: "#0066cc", fontWeight: "600" }}>Ledger Group Name</label>
                      <input
                        type="text"
                        value={ledgerGroupName}
                        onChange={e => setLedgerGroupName(e.target.value)}
                        className="form-control"
                        placeholder="Enter Ledger Group Name"
                        disabled={loading}
                      />
                    </div>

                  </div>
                  <div className="row">
                    <div className="col-6  mb-3">
                      <label style={{ color: "#0066cc", fontWeight: "600" }}>Mobile No</label>
                      <input
                        type="text"
                        value={mobileNo}
                        onChange={e => setMobileNo(e.target.value)}
                        className="form-control"
                        placeholder="Enter Mobile No"
                        disabled={loading}
                      />
                    </div>
                    <div className=" col-6  mb-3">
                      <label style={{ color: "#0066cc", fontWeight: "600" }}>Email ID</label>
                      <input
                        type="email"
                        value={emailId}
                        onChange={e => setEmailId(e.target.value)}
                        className="form-control"
                        placeholder="Enter Email ID"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="row">     <div className="col-6 mb-3">
                    <label style={{ color: "#0066cc", fontWeight: "600" }}>GSTNo</label>
                    <input
                      type="text"
                      value={gstNo}
                      onChange={e => setGstNo(e.target.value)}
                      className="form-control"
                      placeholder="Enter GST No"
                      disabled={loading}
                    />
                  </div>
                    <div className="col-6 mb-3">
                      <label style={{ color: "#0066cc", fontWeight: "600" }}>Address</label>
                      <textarea
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        className="form-control"
                        rows={2}
                        placeholder="Enter Address"
                        disabled={loading}
                      />
                    </div></div>
                  <div className="row">  <div className="col-6 mb-3">
                    <label style={{ color: "#0066cc", fontWeight: "600" }}>Opening Balance</label>
                    <input
                      type="number"
                      value={openingBal}
                      onChange={e => setOpeningBal(Number(e.target.value))}
                      className="form-control"
                      placeholder="Opening Balance"
                      disabled={loading}
                    />
                  </div>
                    <div className="col-6 mb-3">
                      <label style={{ color: "#0066cc", fontWeight: "600" }}>Closing Balance</label>
                      <input
                        type="number"
                        value={closingBal}
                        onChange={e => setClosingBal(Number(e.target.value))}
                        className="form-control"
                        placeholder="Closing Balance"
                        disabled={loading}
                      />
                    </div></div>
                </>
              )}
              <div className="row">
                {/* <div className="col-6 mb-3">
                  <label style={{ color: "#0066cc", fontWeight: "600" }}>
                    {formType === "ledger" ? "Ledger Name" : "Sub Ledger Name"}
                  </label>
                  <input
                    type="text"
                    value={ledger}
                    onChange={e => setLedger(e.target.value)}
                    className="form-control"
                    placeholder={`Enter ${formType === "ledger" ? "Ledger" : "Sub Ledger"} name`}
                    disabled={loading}
                  />
                </div> */}

                <div className="col-12 mb-3">
                  <label style={{ color: "#0066cc", fontWeight: "600" }}>Description</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="form-control"
                    placeholder="Enter description"
                    rows={2}
                    disabled={loading}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={handleSave}
                  className="btn btn-primary"
                  disabled={loading || !ledger.trim() || (formType === "subledger" && !ledgerId)}
                >
                  <Save size={18} style={{ marginRight: "6px" }} />
                  Save
                </button>
                <button onClick={handleCancel} className="btn btn-secondary" disabled={loading}>
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="col-lg-5">
            <div style={{ background: "white", padding: "20px", borderRadius: "8px" }}>
              <h5 style={{ color: "#0066cc", fontWeight: "600" }}>
                {formType === "ledger" ? "Ledgers List" : "Sub Ledgers List"}
              </h5>
              <table className="table table-bordered table-striped mt-3">
                <thead>
                  <tr>
                    <th className="text-primary">{formType === "ledger" ? "Account Type" : "ledger Group"}</th>
                    {/* {formType === "subledger" && <th className="text-primary">Ledger</th>} */}
                    <th className="text-primary">{formType === "ledger" ? "Ledger Name" : "Ledger Sub-Group"}</th>
                    {activeFilter === "active" ? (
                      <>
                        <th className="text-primary">Edit</th>
                        <th className="text-primary">Delete</th>
                      </>
                    ) : (
                      <th className="text-primary">Activate</th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {currentRecords.length === 0 ? (
                    <tr>
                      <td colSpan={formType === "subledger" ? 3 : 2} className="text-center text-muted">
                        No data found
                      </td>
                    </tr>
                  ) : (
                    currentRecords.map((item) => (
                      <tr key={item.AccountLedgerId || item.AccountLedgerSubid}>
                        {formType === "subledger" && (
                          <td>
                            {ledgers.find((l) => l.AccountLedgerId === item.AccountLedgerid)?.AccountLedgerName || "N/A"}
                          </td>
                        )}
                        <td>{item.AccountLedgerName || item.AccountLedgerSubName}</td>

                        {activeFilter === "active" ? (
                          <>
                            <td>
                              <button
                                onClick={() => handleEdit(item)}
                                disabled={loading}
                                className="btn btn-link p-0"
                                title="Edit"
                              >
                                <Eye size={18} />
                              </button>
                            </td>
                            <td>
                              <button
                                onClick={() => handleDelete(item.AccountLedgerId || item.AccountLedgerSubid)}
                                disabled={loading}
                                className="btn btn-link text-danger p-0"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </>
                        ) : (
                          <td>
                            <button
                              onClick={() => handleActivate(item.AccountLedgerId || item.AccountLedgerSubid)}
                              disabled={loading}
                              className="btn btn-link text-success p-0 fw-semibold"
                              title="Activate"
                            >
                              Activate
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {filteredData.length > recordsPerPage && (
                <Pagination
                  totalRecords={filteredData.length}
                  recordsPerPage={recordsPerPage}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
              )}

              {filteredData.length === 0 && !loading && (
                <div style={{ textAlign: "left", padding: "20px", color: "#999", fontSize: "18px" }}>
                  No {formType === "ledger" ? "Ledgers" : "Sub Ledgers"} found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner />}
    </div>
  );
}

export default AccountLedger;
