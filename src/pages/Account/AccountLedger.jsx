import React, { useEffect, useMemo, useState } from "react";
import { Eye, Save, Trash2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import axios from "axios";
import Pagination from "../../components/Pagination";
import { API_ENDPOINTS } from "../../config/apiconfig";
import '../../App.css'
export default function AccountLedger({ view }) {
  const [formType, setFormType] = useState("ledger");

  // form fields
  const [accountGroupOptions, setAccountGroupOptions] = useState([]);
  const [accountGroup, setAccountGroup] = useState("");
  const [ledgerGroupName, setLedgerGroupName] = useState("");
  const [ledgerSubGroupName, setLedgerSubGroupName] = useState("");
  const [ledger, setLedger] = useState("");
  const [ledgerId, setLedgerId] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [emailId, setEmailId] = useState("");
  const [gstNo, setGstNo] = useState("");
  const [address, setAddress] = useState("");
  const [openingBal, setOpeningBal] = useState(0);
  const [closingBal, setClosingBal] = useState(0);
  const [description, setDescription] = useState("");

  const getAccountGroupName = (id) => {
  const group = accountGroupOptions.find(g => g.id === id);
  return group ? group.name : "—";
};

  // lists and UI state
  const [ledgers, setLedgers] = useState([]);
  const [subLedgers, setSubLedgers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 4;

  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

  const activeFilter = view || "active";

  useEffect(() => {
          fetchAccountGroup();
          
      }, []);

  // Fetch account groups
 const fetchAccountGroup = async () => {
    try {
        const res = await fetch(API_ENDPOINTS.Group);
        if (!res.ok) {
            throw new Error("Failed to fetch");
        }

        const json = await res.json();

        // Always store clean array
        setAccountGroupOptions(Array.isArray(json) ? json : []);
    } catch (err) {
        toast.error("Failed to load Account Group");
    }
};

  // Fetch ledgers / subledgers based on formType and view
  useEffect(() => {
    setCurrentPage(1);
    if (formType === "ledger") fetchLedgers(activeFilter);
    else fetchSubLedgers(activeFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formType, activeFilter]);

  const fetchLedgers = async (status = "active") => {
    setFetchLoading(true);
    try {
      let url = API_ENDPOINTS.Ledger; 
      if (status === "active") url += "?isActive=true";
      else if (status === "inactive") url += "?isActive=false";

      const response = await axios.get(url);
      const raw = response?.data?.data ?? response?.data ?? [];

      const mapped = (Array.isArray(raw) ? raw : []).map((l) => ({
        
        AccountLedgerId: l.AccountLedgerId ?? l.accountLedgerId,
        AccountLedgerName: l.AccountLedgerName ?? l.accountLedgerName,
        AccountLedgerNarration: l.AccountLedgerNarration ?? l.accountLedgerNarration,
        AccountGroupId: l.AccountGroupId ?? l.accountGroupId ?? l.AccountGroup ?? l.accountGroup,  
        LedgerGroupName: l.LedgerGroupName ?? l.ledgerGroupName ?? l.accountGroupName,
        // MobileNo: l.MobileNo ?? l.mobileNo,
        MobileNo: l.mobileNo ? String(l.mobileNo) : "",
        EmailId: l.EmailId ?? l.emailId,
        GstNo: l.GSTNo ?? l.GstNo ?? l.gstNo,
        Address: l.Address ?? l.address,
        OpeningBal: l.OpeningBal ?? l.openingBal ?? 0,
        ClosingBal: l.ClosingBal ?? l.closingBal ?? 0,
        IsActive: Object.prototype.hasOwnProperty.call(l, "IsActive") ? l.IsActive : l.isActive,
      }));

      setLedgers(mapped);
    } catch (err) {
      toast.error(`Fetch Error: ${err.message}`);
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
      const raw = response?.data?.data ?? response?.data ?? [];

      const mapped = (Array.isArray(raw) ? raw : []).map((s) => ({
        AccountLedgerSubid: s.AccountLedgerSubid ?? s.accountLedgerSubid,
        AccountLedgerSubName: s.AccountLedgerSubName ?? s.accountLedgerSubName,
        AccountLedgerSubNarration: s.AccountLedgerSubNarration ?? s.accountLedgerSubNarration,
        AccountLedgerid: s.AccountLedgerid ?? s.accountLedgerId ?? s.accountLedgerID,
        IsActive: Object.prototype.hasOwnProperty.call(s, "IsActive") ? s.IsActive : s.isActive,
      }));

      setSubLedgers(mapped);
    } catch (err) {
      toast.error(`Fetch Error: ${err.message}`);
      setSubLedgers([]);
    } finally {
      setFetchLoading(false);
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
    setLedgerSubGroupName("");
  };

  // const validateForm = () => {
  //   if (formType === "ledger") {
  //     if (!accountGroup) return "Please select Account Group";
  //     if (!ledgerGroupName.trim()) return "Please enter Ledger Name";

  //     const validateGST = () => {
  //     if (gstNo.trim() === "") return true; // Optional

  //     if (!gstRegex.test(gstNo)) {
  //     toast.error("Invalid GST Number");
  //     return false;
  //     }

  //     return true;
  //     };
  //     // if (!address.trim()) return "Please enter Address";
  //     if (!description.trim()) return "Please enter Description";
  //   } else {
  //     if (!ledgerId) return "Please select Ledger for Sub Ledger";
  //      if (!ledgerSubGroupName.trim()) return "Please enter Sub Ledger name"; 
  //     if (!ledger.trim()) return "Please enter Sub Ledger name";
  //     if (!description.trim()) return "Please enter Description";
  //   }
  //   return null;
  // };
const validateForm = () => {
  if (formType === "ledger") {
    if (!accountGroup) return "Please select Account Group";
    if (!ledgerGroupName.trim()) return "Please enter Ledger Name";
    if (!description.trim()) return "Please enter Description";
  } else {
    if (!ledgerId) return "Please select Ledger for Sub Ledger";
    if (!ledgerSubGroupName.trim()) return "Please enter Sub Ledger name";  // ✅ ONLY THIS
    if (!description.trim()) return "Please enter Description";
  }
  return null;
};

  const handleSave = async () => {
    const validationError = validateForm();
    if (validationError) {
      toast.warning(validationError);
      return;
    }

    setLoading(true);
    try {
      const baseUrl = formType === "ledger" ? API_ENDPOINTS.Ledger : API_ENDPOINTS.SubLedger;

      let payload;
      if (formType === "ledger") {
        payload = {
          accountLedgerName: ledgerGroupName.trim(),
          accountLedgerNarration: description.trim(),
          accountGroupId: Number(accountGroup),
          ledgerGroupName: ledgerGroupName,
          mobileNo,
          emailId,
          gstNo,
          address,
          openingBal,
          closingBal,
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

      console.log(payload)

      const method = editingId ? "put" : "post";
      const url = editingId ? `${baseUrl}${editingId}` : baseUrl;

      console.log(url)

      const response = await axios({ method, url, data: payload, headers: { "Content-Type": "application/json" } });

      console.log(response)

      if (response.status === 200 || response.status === 201) {
        toast.success(editingId ? "Updated successfully!" : "Added successfully!");
        if (formType === "ledger") await fetchLedgers(activeFilter);
        else await fetchSubLedgers(activeFilter);
        handleCancel();
      } else {
        toast.error("Failed to save record!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message ?? err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    if (formType === "ledger") {
      setLedgerGroupName(item.AccountLedgerName ?? "");
      setDescription(item.AccountLedgerNarration ?? "");
      setAccountGroup(item.AccountGroup ?? "");
      setAccountGroup(item.AccountGroupId ?? "");
      // setMobileNo(item.MobileNo ?? "");
      setMobileNo(item.MobileNo ? String(item.MobileNo) : "");
      setEmailId(item.EmailId ?? "");
      setGstNo(item.GstNo ?? "");
      setAddress(item.Address ?? "");
      setOpeningBal(item.OpeningBal ?? 0);
      setClosingBal(item.ClosingBal ?? 0);
      setEditingId(item.AccountLedgerId ?? null);
    } else {
      setLedgerSubGroupName(item.AccountLedgerSubName ?? "");  
      setLedger(item.AccountLedgerSubName ?? "");
      setDescription(item.AccountLedgerSubNarration ?? "");
      setLedgerId(item.AccountLedgerid ?? "");
      setEditingId(item.AccountLedgerSubid ?? null);
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

      // Soft-delete pattern: set isActive = false
      const response = await axios.put(`${baseUrl}${id}`, { isActive: false });

      if (response.status === 200) {
        toast.success("Deleted successfully!");
        if (formType === "ledger") await fetchLedgers(activeFilter);
        else await fetchSubLedgers(activeFilter);
      } else {
        toast.error("Delete failed!");
      }
    } catch (err) {
      toast.error(`Delete Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (id) => {
    setLoading(true);
    try {
      const baseUrl = formType === "ledger" ? API_ENDPOINTS.Ledger : API_ENDPOINTS.SubLedger;
      const response = await axios.put(`${baseUrl}${id}`, { isActive: true });
      if (response.status === 200) {
        toast.success("Activated!");
        if (formType === "ledger") await fetchLedgers(activeFilter);
        else await fetchSubLedgers(activeFilter);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const displayData = formType === "ledger" ? ledgers : subLedgers;

  const filteredData = useMemo(() => displayData.filter((item) => (activeFilter === "active" ? item.IsActive !== false : item.IsActive === false)), [displayData, activeFilter]);

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredData.slice(indexOfFirst, indexOfLast);

  const LoadingSpinner = () => (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh", width: "100vw", position: "fixed", top: 0, left: 0, backgroundColor: "rgba(255,255,255,0.8)", zIndex: 2000 }}
    >
      <div className="text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 fw-semibold text-dark">Loading...</p>
      </div>
    </div>
  );

  if (fetchLoading) return <LoadingSpinner />;

  return (
    <div style={{ background: "#f5f5f5", minHeight: "80vh", padding: "10px" }}>
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="container-fluid">
        <div style={{ background: "white", fontSize:"18px", paddingTop: "15px", padding:"15px", borderRadius: "8px", marginBottom: "10px" }}>
          <div>
            <label style={{ marginRight: "20px" }}>
              <input type="radio" name="formType" value="ledger" checked={formType === "ledger"} onChange={() => { setFormType("ledger"); handleCancel(); }} style={{ marginRight: "8px" }} />
              Account Ledger
            </label>
            <label>
              <input type="radio" name="formType" value="subledger" checked={formType === "subledger"} onChange={() => { setFormType("subledger"); handleCancel(); }} style={{ marginRight: "8px" }} />
              Account Sub Ledger
            </label>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-7">
            <div style={{ background: "white", padding: "25px", borderRadius: "8px" }}>
              <div className="row">
                {formType === "subledger" && (
                  <div className="col-6 mb-3">
                    <label className="label-color">Ledger Name</label>
                    <select value={ledgerId} onChange={(e) => setLedgerId(Number(e.target.value))} disabled={loading} className="form-control">
                      <option value="">-- Ledger Name --</option>
                      {ledgers.map((l) => (
                        <option key={l.AccountLedgerId} value={l.AccountLedgerId}>{l.AccountLedgerName}</option>
                      ))}
                    </select>
                  </div>
                )}

                {formType === "subledger" && (
                  <div className="col-6 mb-3">
                    <label className="label-color">Ledger Sub-Group Name</label>
                    <input type="text" value={ledgerSubGroupName} onChange={(e) => setLedgerSubGroupName(e.target.value)} className="form-control" placeholder="Enter Ledger Sub Group Name" disabled={loading} />
                  </div>
                )}
              </div>

              {formType === "ledger" && (
                <>
                  <div className="row">
                    <div className="col-6 mb-3">
                      <label className="label-color">Account Group</label>
                      <select value={accountGroup} onChange={(e) => setAccountGroup(Number(e.target.value))} disabled={loading} className="form-control">
                        <option value="">--Select Group--</option>
                        {accountGroupOptions.map((grp) => (
                          <option key={grp.id} value={grp.id}>{grp.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-6 mb-3">
                      <label className="label-color">Ledger Name</label>
                      <input type="text" value={ledgerGroupName} onChange={(e) => setLedgerGroupName(e.target.value)} className="form-control" placeholder="Enter Ledger Name" disabled={loading} />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-6 mb-3">
                      <label className="label-color">Mobile No</label>
                      <input  type="text" 
                      value={mobileNo} 
                      // onChange={(e) => setMobileNo(e.target.value)}
                      onChange={(e) => {
                      // Allow only digits
                        const val = e.target.value.replace(/\D/g, "");

                      // Limit to 10 digits
                      if (val.length <= 10) {
                      setMobileNo(val);}}} 
                      className=" form-control" 
                      placeholder="Enter Mobile No"
                      disabled={loading} />
                    </div>

                    <div className="col-6 mb-3">
                      <label className="label-color">Email ID</label>
                      <input type="email" value={emailId} onChange={(e) => setEmailId(e.target.value)} className="form-control" placeholder="Enter Email ID" disabled={loading} />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-6 mb-3">
                      <label className="label-color">GSTNo</label>
                      <input type="text" 
                      value={gstNo} 
                      maxLength={15}
                      onChange={(e) => setGstNo(e.target.value.toUpperCase())} 
                      className="form-control" 
                      placeholder="Enter GST No" 
                      disabled={loading} />
                    </div>

                    <div className="col-6 mb-3">
                      <label className="label-color">Address</label>
                      <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="form-control" rows={2} placeholder="Enter Address" disabled={loading}></textarea>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-6 mb-3">
                      <label className="label-color">Opening Balance</label>
                      <input type="number" value={openingBal} onChange={(e) => setOpeningBal(Number(e.target.value))} className="form-control" placeholder="Opening Balance" disabled={loading} />
                    </div>

                    <div className="col-6 mb-3">
                      <label className="label-color">Closing Balance</label>
                      <input type="number" value={closingBal} onChange={(e) => setClosingBal(Number(e.target.value))} className="form-control" placeholder="Closing Balance" disabled={loading} />
                    </div>
                  </div>
                </>
              )}

              <div className="row">
                <div className="col-12 mb-3">
                  <label className="label-color">Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" placeholder="Enter description" rows={2} disabled={loading}></textarea>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={handleSave} className="save-btn" >
                  <Save size={18} style={{ marginRight: "6px" }} /> Save
                </button>
                <button onClick={handleCancel} className="cancel-btn" disabled={loading}>
                  Cancel
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div style={{ background: "white", padding: "20px", borderRadius: "8px" }}>
              <h5 className="label-color">{formType === "ledger" ? "Ledgers List" : "Sub Ledgers List"}</h5>

              <table className="table table-bordered table-striped mt-3">
                <thead>
                  <tr>
                    <th className="text-primary">{formType === "ledger" ? "Account Group" : " "}</th>
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
                      <td colSpan={formType === "subledger" ? 3 : 2} className="text-center text-muted">No data found</td>
                    </tr>
                  ) : (
                    currentRecords.map((item) => (
                      <tr key={item.AccountLedgerId ?? item.AccountLedgerSubid}>
                        {/* LEDGER LIST → Show Account Group Name */}
                        {formType === "ledger" && (
                          <td>{getAccountGroupName(item.AccountGroupId)}</td>
                        )}

                        {formType === "subledger" && (
                          <td>{ledgers.find((l) => l.AccountLedgerId === item.AccountLedgerid)?.AccountLedgerName ?? "N/A"}</td>
                        )}

                        <td>{item.AccountLedgerName ?? item.AccountLedgerSubName}</td>

                        {activeFilter === "active" ? (
                          <>
                            <td>
                              <button onClick={() => handleEdit(item)} disabled={loading} className="btn btn-link p-0" title="Edit">
                                <Eye size={18} />
                              </button>
                            </td>

                            <td>
                              <button onClick={() => handleDelete(item.AccountLedgerId ?? item.AccountLedgerSubid)} disabled={loading} className="btn btn-link text-danger p-0" title="Delete">
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </>
                        ) : (
                          <td>
                            <button onClick={() => handleActivate(item.AccountLedgerId ?? item.AccountLedgerSubid)} disabled={loading} className="btn btn-link text-success p-0 fw-semibold" title="Activate">
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
                <Pagination totalRecords={filteredData.length} recordsPerPage={recordsPerPage} currentPage={currentPage} onPageChange={setCurrentPage} />
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
