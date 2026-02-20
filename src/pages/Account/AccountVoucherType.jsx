import React, { useState, useEffect } from "react";
import { Eye, Save, Trash2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/apiconfig";
import Pagination from "../../components/Pagination"; // Adjust path as needed

function AccountVoucherType({ view }) {
  const [formType, setFormType] = useState("vouchertype");
  const [vouchertype, setVoucherType] = useState("");
  const [description, setDescription] = useState("");
  const [vouchertypeId, setVoucherTypeId] = useState("");
  const [vouchertypes, setVoucherTypes] = useState([]);
  const [subVoucherTypes, setSubVoucherTypes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 4;

  const activeFilter = view;

  useEffect(() => {
    if (formType === "vouchertype") {
      fetchVoucherTypes(activeFilter);
    } else {
      fetchSubVoucherTypes(activeFilter);
    }
  }, [formType, activeFilter]);

  // Reset pagination when data or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [formType, activeFilter, vouchertypes, subVoucherTypes]);

  const fetchVoucherTypes = async (status = "active") => {
    setFetchLoading(true);
    try {
      let url = API_ENDPOINTS.VoucherType;
      if (status === "active") url += "?isActive=true";
      else if (status === "inactive") url += "?isActive=false";

      const response = await axios.get(url);
      const raw = response.data.data || response.data || [];
      const mappedVoucherTypes = raw.map((l) => ({
        AccountVoucherTypeId: l.accountVoucherTypeId,
        VoucherType: l.voucherType,
        VoucherNarration: l.voucherNarration,
        IsActive: l.isActive,
      }));

      setVoucherTypes(mappedVoucherTypes);
    } catch (error) {
      toast.error(`Fetch Error: ${error.message}`);
      setVoucherTypes([]);
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchSubVoucherTypes = async (status = "active") => {
    setFetchLoading(true);
    try {
      let url = API_ENDPOINTS.SubVoucherType;
      if (status === "active") url += "?isActive=true";
      else if (status === "inactive") url += "?isActive=false";

      const response = await axios.get(url);
      const raw = response.data.data || response.data || [];
      const mappedSubVoucherTypes = raw.map((s) => ({
        AccountSubVoucherTypeId: s.accountSubVoucherTypeId,
        SubVoucherType: s.subVoucherType,
        SubVoucherNarration: s.subVoucherNarration,
        AccountVoucherTypeId: s.accountVoucherTypeId,
        IsActive: s.isActive,
      }));

      setSubVoucherTypes(mappedSubVoucherTypes);
    } catch (error) {
      toast.error(`Fetch Error: ${error.message}`);
      setSubVoucherTypes([]);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSave = async () => {
    if (!vouchertype.trim() || !description.trim()) {
      toast.warning("Please fill all required fields!");
      return;
    }

    if (formType === "subvouchertype" && !vouchertypeId) {
      toast.error("Please select a Voucher Type first.");
      return;
    }

    setLoading(true);
    try {
      const baseUrl = formType === "vouchertype" ? API_ENDPOINTS.VoucherType : API_ENDPOINTS.SubVoucherType;

      let payload = {};
      if (formType === "vouchertype") {
        payload = {
          VoucherType: vouchertype.trim(),
          VoucherNarration: description.trim(),
          isActive: true,
        };
      } else {
        payload = {
          SubVoucherType: vouchertype.trim(),
          SubVoucherNarration: description.trim(),
          AccountVoucherTypeId: Number(vouchertypeId),
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
        if (formType === "vouchertype") {
          await fetchVoucherTypes(activeFilter);
        } else {
          await fetchSubVoucherTypes(activeFilter);
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
    setVoucherType("");
    setDescription("");
    setVoucherTypeId("");
    setEditingId(null);
  };

  const handleEdit = (item) => {
    if (formType === "vouchertype") {
      setVoucherType(item.VoucherType || "");
      setDescription(item.VoucherNarration || "");
      setEditingId(item.AccountVoucherTypeId || null);
    } else {
      setVoucherType(item.SubVoucherType || "");
      setDescription(item.SubVoucherNarration || "");
      setVoucherTypeId(item.AccountVoucherTypeId || "");
      setEditingId(item.AccountSubVoucherTypeId || null);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: `Delete this ${formType === "vouchertype" ? "Account Voucher Type" : "Account Sub Voucher Type"}?`,
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
      const baseUrl = formType === "vouchertype" ? API_ENDPOINTS.VoucherType : API_ENDPOINTS.SubVoucherType;

      const record =
        formType === "vouchertype"
          ? vouchertypes.find((l) => l.AccountVoucherTypeId === id)
          : subVoucherTypes.find((s) => s.AccountSubVoucherTypeId === id);

      if (!record) {
        toast.error("Record not found in state.");
        setLoading(false);
        return;
      }

      let payload = {};
      if (formType === "vouchertype") {
        payload = {
          AccountVoucherTypeId: record.AccountVoucherTypeId,
          VoucherType: record.VoucherType,
          VoucherNarration: record.VoucherNarration,
          isActive: false,
        };
      } else {
        payload = {
          AccountSubVoucherTypeId: record.AccountSubVoucherTypeId,
          SubVoucherType: record.SubVoucherType,
          SubVoucherNarration: record.SubVoucherNarration,
          AccountVoucherTypeId: record.AccountVoucherTypeId,
          IsActive: false,
        };
      }

      const response = await axios.put(`${baseUrl}${id}`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        toast.success("Deleted successfully!");
        if (formType === "vouchertype") {
          await fetchVoucherTypes(activeFilter);
        } else {
          await fetchSubVoucherTypes(activeFilter);
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
      const baseUrl = formType === "vouchertype" ? API_ENDPOINTS.VoucherType : API_ENDPOINTS.SubVoucherType;

      const record =
        formType === "vouchertype"
          ? vouchertypes.find((l) => l.AccountVoucherTypeId === id)
          : subVoucherTypes.find((s) => s.AccountSubVoucherTypeId === id);

      const payload = { ...record, isActive: true };

      await axios.put(`${baseUrl}${id}`, payload);

      toast.success("Activated!");
      if (formType === "vouchertype") {
        await fetchVoucherTypes(activeFilter);
      } else {
        await fetchSubVoucherTypes(activeFilter);
      }
    } finally {
      setLoading(false);
    }
  };

  const displayData = formType === "vouchertype" ? vouchertypes : subVoucherTypes;

  const filteredData = displayData.filter((item) =>
    activeFilter === "active" ? item.IsActive !== false : item.IsActive === false
  );

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);

  // Loading Spinner component
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
        {/* Toggle Voucher Type / Sub Voucher Type */}
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
            <label style={{ marginRight: "20px" ,fontSize:'18px' }}>
              <input
                type="radio"
                name="formType"
                value="vouchertype"
                checked={formType === "vouchertype"}
                onChange={() => {
                  setFormType("vouchertype");
                  handleCancel();
                }}
                style={{ marginRight: "8px"}}
              />
              Account Voucher Type
            </label>

            <label style={{fontSize:'18px'}}>
              <input
                type="radio"
                name="formType"
                value="subvouchertype"
                checked={formType === "subvouchertype"}
                onChange={() => {
                  setFormType("subvouchertype");
                  handleCancel();
                }}
                style={{ marginRight: "8px" }}
              />
              Account Sub Voucher Type
            </label>
          </div>
        </div>

        <div className="row">
          {/* Form Section */}
          <div className="col-lg-5">
            <div style={{ background: "white", padding: "25px", borderRadius: "8px" }}>
              {formType === "subvouchertype" && (
                <div className="mb-3">
                  <label style={{ color: "#0066cc", fontWeight: "600" }}>Select Voucher Type</label>
                  <select
                    value={vouchertypeId}
                    onChange={(e) => setVoucherTypeId(Number(e.target.value))}
                    disabled={loading}
                    className="form-control"
                  >
                    <option value="">-- Select Voucher Type --</option>
                    {vouchertypes.map((l) => (
                      <option key={l.AccountVoucherTypeId} value={l.AccountVoucherTypeId}>
                        {l.VoucherType}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mb-3">
                <label style={{ color: "#0066cc", fontWeight: "600" }}>
                  {formType === "vouchertype" ? "Voucher Type" : "Sub Voucher Type"}
                </label>
                <input
                  type="text"
                  value={vouchertype}
                  onChange={(e) => setVoucherType(e.target.value)}
                  className="form-control"
                  placeholder={`Enter ${formType === "vouchertype" ? "Voucher Type" : "Sub Voucher Type"}`}
                  disabled={loading}
                />
              </div>

              <div className="mb-3">
                <label style={{ color: "#0066cc", fontWeight: "600" }}>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-control"
                  placeholder="Enter description"
                  rows={3}
                  disabled={loading}
                />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={handleSave}
                  className="save-btn"
                  disabled={
                    loading ||
                    !vouchertype.trim() ||
                    (formType === "subvouchertype" && !vouchertypeId)
                  }
                >
                  <Save size={18} style={{ marginRight: "6px" }} />
                  Save
                </button>
                <button onClick={handleCancel} className="cancel-btn" disabled={loading}>
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="col-lg-7">
            <div style={{ background: "white", padding: "20px", borderRadius: "8px" }}>
              <h5 style={{ color: "#0066cc", fontWeight: "600" }}>
                {formType === "vouchertype" ? "Voucher Type List" : "Sub Voucher Type List"}
              </h5>

              <div className="table-responsive">
                <table className="table table-bordered table-striped mt-3">
                  <thead>
                    <tr>
                      {formType === "subvouchertype" && <th>Voucher Type</th>}
                      <th>{formType === "vouchertype" ? "Voucher Type" : "Sub Voucher Type"}</th>
                      {activeFilter === "active" ? (
                        <>
                          <th>Edit</th>
                          <th>Delete</th>
                        </>
                      ) : (
                        <th>Activate</th>
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {currentRecords.length === 0 ? (
                      <tr>
                        <td
                          colSpan={formType === "subvouchertype" ? (activeFilter === "active" ? 4 : 3) : (activeFilter === "active" ? 3 : 2)}
                          className="text-center text-muted py-4"
                        >
                          {filteredData.length === 0 ? "No data found" : "No records on this page"}
                        </td>
                      </tr>
                    ) : (
                      currentRecords.map((item) => (
                        <tr key={item.AccountVoucherTypeId || item.AccountSubVoucherTypeId}>
                          {formType === "subvouchertype" && (
                            <td>
                              {vouchertypes.find((l) => l.AccountVoucherTypeId === item.AccountVoucherTypeId)?.VoucherType || "N/A"}
                            </td>
                          )}

                          <td>{item.VoucherType || item.SubVoucherType}</td>

                          {activeFilter === "active" ? (
                            <>
                              <td>
                                <button onClick={() => handleEdit(item)} className="btn btn-link p-0" title="Edit">
                                  <Eye size={18} />
                                </button>
                              </td>
                              <td>
                                <button
                                  onClick={() => handleDelete(item.AccountVoucherTypeId || item.AccountSubVoucherTypeId)}
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
                                onClick={() => handleActivate(item.AccountVoucherTypeId || item.AccountSubVoucherTypeId)}
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

                {/* Pagination Component */}
                <Pagination
                  totalRecords={filteredData.length}
                  recordsPerPage={recordsPerPage}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && (
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
      )}
    </div>
  );
}

export default AccountVoucherType;
