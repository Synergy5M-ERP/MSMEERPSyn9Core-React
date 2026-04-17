import React, { useEffect, useMemo, useState } from "react";
import { Eye, Save, Trash2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import axios from "axios";
import Pagination from "../../components/Pagination";
import { API_ENDPOINTS } from "../../config/apiconfig";
import Select from "react-select";

export default function AccountLedger({ view }) {
  const [formType, setFormType] = useState("ledger");

  // form fields
  const [accountGroupOptions, setAccountGroupOptions] = useState([]);
  const [primaryGroupOptions, setPrimaryGroupOptions] = useState([])
  const [accountSubGroupOptions, setAccountSubGroupIptions] = useState([])
  const [accountSubSubGroupOptions, setAccountSubSubGroupIptions] = useState([])
  const [primaryGroup, setPrimaryGroup] = useState(null)
  const [accountGroup, setAccountGroup] = useState("");
  const [accountSubGroup, setAccountSubGroup] = useState("");
  const [accountSubSubGroup, setAccountSubSubGroup] = useState("");
  const [ledgerGroupName, setLedgerGroupName] = useState("");
  const [ledgerSubGroupName, setLedgerSubGroupName] = useState("");
  const [ledgerId, setLedgerId] = useState("");
  const [glCode, setGLCode] = useState("")
  const [assetsCode, setAssetsCode] = useState("")
  const [glPrefix, setGLPrefix] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [emailId, setEmailId] = useState("");
  const [gstNo, setGstNo] = useState("");
  const [address, setAddress] = useState("");
  const [openingBal, setOpeningBal] = useState(0);
  const [closingBal, setClosingBal] = useState(0);
  const [description, setDescription] = useState("");
  const [vendorCategoryId, setVendorCategoryId]= useState("");
  const [vendorCategories, setVendorCategories] = useState([]);
  const [isBank, setIsBank] = useState(false);

  const [vendorName, setVendorName] = useState("");
  const [vendors, setVendors] = useState([]);

  const getAccountGroupName = (id) => {
  const group = accountGroupOptions.find(g => g.id === id);
  return group ? group.name : "—";
};

const selectedCategory = vendorCategories
  .find(v => v.vendorCategoryId === vendorCategoryId)
  ?.vendorCategoryName?.toLowerCase();

const subLedgerLabel =
  selectedCategory === "seller"
    ? "Seller Name"
    : selectedCategory === "buyer"
    ? "Buyer Name"
    : "SubLedger Name";


const getPrimaryGroup = (id) => {
  const primarygroup = primaryGroupOptions.find(
    t => t.primaryGroupid === id
  );
  return primarygroup ? primarygroup.primaryGroupName : "—";
};

const getAccountSubGroupName = (id) => {
  const subgroup = accountSubGroupOptions.find(s => s.id === id)
  return subgroup ? subgroup.accountSubGroupName : "—";
};

const getAccountSubSubGroupName = (id) => {
  const subsubgroup = accountSubSubGroupOptions.find(f => f.id === id)
  return subsubgroup ? subsubgroup.accountSubSubGroupName : "—";
};

  // lists and UI state
  const [ledgers, setLedgers] = useState([]);
  const [subLedgers, setSubLedgers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;

  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

  const activeFilter = view || "active";

  useEffect(() => {
          fetchPrimaryGroup()   
          fetchVendorCategories()  
      }, []);

  // Fetch account types
  const fetchPrimaryGroup = async () => {
  try {
    const res = await fetch(`${API_ENDPOINTS.AccountPrimaryGroup}?isActive=true`);

    if (!res.ok) throw new Error("Failed to fetch Primary Group");

    const data = await res.json();

    const mapped = (Array.isArray(data) ? data : []).map((item) => ({
      primaryGroupid: item.primaryGroupid,
      primaryGroupName: item.primaryGroupName,
      primaryGroupCode: Number(item.primaryGroupcode) // ✅ FIXED HERE
    }));

    setPrimaryGroupOptions(mapped);
  } catch (err) {
    toast.error("Failed to load Primary Groups");
  }
};

 // Fetch account groups
const fetchAccountGroup = async (primarygroupid) => {
  try {
    let url = `${API_ENDPOINTS.AccountGroups}?isActive=true`;

    if (primarygroupid) {
      url += `&primarygroupid=${primarygroupid}`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch Account Groups");

    const data = await res.json();

     const mapped = (Array.isArray(data) ? data : []).map((item) => ({
      accountGroupId: item.accountGroupId,
      accountGroupName: item.accountGroupName,
      accountGroupCode: item.accountGroupCode
    }));

    setAccountGroupOptions(mapped);
  } catch (err) {
    toast.error("Failed to load Account Group");
  }
};

const fetchAccountSubGroup = async (groupid) => {
  try {
    let url = `${API_ENDPOINTS.AccountSubGroup}?isActive=true`;

    if (groupid) {
      url += `&groupid=${groupid}`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch Account Sub Groups");

    const data = await res.json();

      const mapped = (Array.isArray(data) ? data : []).map((item) => ({
      accountSubGroupId: item.accountSubGroupId,
      accountSubGroupName: item.accountSubGroupName,
      subGroupCode: item.subGroupCode
    }));

    setAccountSubGroupIptions(mapped);
  } catch (err) {
    toast.error("Failed to load Account Sub Group");
  }
};

const fetchAccountSubSubGroup = async (subgroupid) => {
  try {
    let url = `${API_ENDPOINTS.AccountSubSubGroup}?isActive=true`;

    if (subgroupid) {
      url += `&subgroupid=${subgroupid}`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch Account Sub Sub Groups");

    const data = await res.json();

    const mapped = (Array.isArray(data) ? data : []).map((item) => ({
      accountSubSubGroupId: item.accountSubSubGroupId,
      accountSubSubGroupName: item.accountSubSubGroupName,
      subSubGroupCode: item.subSubGroupCode
    }));

    setAccountSubSubGroupIptions(mapped);
  } catch (err) {
    toast.error("Failed to load Account Sub Sub Group");
  }
};

//-----Generate the GL code-----
useEffect(() => {

  if (!primaryGroup || !accountGroup || !accountSubGroup) {
    setGLPrefix("");
    if (!editingId) setGLCode("");
    return;
  }

  const primary = primaryGroupOptions.find(
    p => Number(p.primaryGroupid) === Number(primaryGroup)
  );

  const group = accountGroupOptions.find(
    g => Number(g.accountGroupId) === Number(accountGroup)
  );

  const subGroup = accountSubGroupOptions.find(
    s => Number(s.accountSubGroupId) === Number(accountSubGroup)
  );

  const subSubGroup = accountSubSubGroupOptions.find(
    s => Number(s.accountSubSubGroupId) === Number(accountSubSubGroup)
  );

  let prefix = "";

  if (primary?.primaryGroupCode != null)
    prefix += String(primary.primaryGroupCode);

  if (group?.accountGroupCode != null)
    prefix += String(group.accountGroupCode).padStart(2, "0");

  if (subGroup?.subGroupCode != null)
    prefix += String(subGroup.subGroupCode).padStart(2, "0");

  // optional sub-sub group
  let subSubCode = "00";
  if (accountSubSubGroup && subSubGroup?.subSubGroupCode != null) {
    subSubCode = String(subSubGroup.subSubGroupCode).padStart(2, "0");
  }

  prefix += subSubCode;

  setGLPrefix(prefix);

  if (!editingId || !glCode) {

    const filtered = ledgers
      .map(l => {
        let code = String(l.GLCode);

        // ✅ convert old 7 digit codes to new format
        if (code.length === 7) {
          const base = code.slice(0,5);
          const ledger = code.slice(-2);
          code = base + "00" + ledger;
        }

        return code;
      })
      .filter(code => code.startsWith(prefix));

    const numbers = filtered
      .map(code => Number(code.slice(-2)))
      .filter(n => !isNaN(n));

    const nextNumber =
      numbers.length > 0 ? Math.max(...numbers) + 1 : 1;

    setGLCode(prefix + String(nextNumber).padStart(2, "0"));
  }

}, [
  primaryGroup,
  accountGroup,
  accountSubGroup,
  accountSubSubGroup,
  primaryGroupOptions,
  accountGroupOptions,
  accountSubGroupOptions,
  accountSubSubGroupOptions,
  ledgers
]);

const fetchVendorCategories = async () => {
  try {
    const res = await fetch(`${API_ENDPOINTS.VendorCategory}?isActive=true`);

    if (!res.ok) throw new Error("Failed to fetch Vendor Categories");

    const data = await res.json();

    const mapped = (Array.isArray(data) ? data : []).map((item) => ({
      vendorCategoryId: item.vendorCategoryId,
      vendorCategoryName: item.vendorCategoryName
    }));

    setVendorCategories(mapped);
  } catch (err) {
    toast.error("Failed to load Vendor Categories");
  }
};

useEffect(() => {
  if (selectedCategory === "seller" || selectedCategory === "buyer") {
    fetchVendors(selectedCategory);
  } else {
    setVendors([]);
  }
}, [selectedCategory]);

const fetchVendors = async (categoryName) => {
  try {
    const res = await axios.get(API_ENDPOINTS.AllVendors);
    let data = res.data || [];

    // Filter based on category
    if (categoryName === "seller") {
      data = data.filter(v => v.type === "seller");
    } else if (categoryName === "buyer") {
      data = data.filter(v => v.type === "buyer");
    }

    setVendors(data);
  } catch (err) {
    toast.error("Failed to load vendors");
  }
};

useEffect(() => {
    setCurrentPage(1);
    fetchLedgers("active");
    if (formType === "ledger") fetchLedgers(activeFilter);
    else fetchSubLedgers(activeFilter);
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
        PrimaryGroupId: l.primaryGroupId ?? l.PrimaryGroupId ?? l.primaryGroup ?? l.PrimaryGroup,
        AccountGroupId: l.AccountGroupId ?? l.accountGroupId ?? l.AccountGroup ?? l.accountGroup,
        AccountSubGroupId: l.AccountSubGroupId ?? l.accountSubGroupId ?? l.AccountSubGroup ?? l.accountSubGroup,  
        AccountSubSubGroupId: l.AccountSubSubGroupId ?? l.accountSubSubGroupId ?? l.AccountSubSubGroup ?? l.accountSubSubGroup,
        GLCode: l.GLCode ?? l.glCode,
        LedgerGroupName: l.LedgerGroupName ?? l.ledgerGroupName ?? l.accountGroupName,
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
    let url = API_ENDPOINTS.AccountSubLedger; 
    if (status === "active") url += "?isActive=true";
    else if (status === "inactive") url += "?isActive=false";

    const response = await axios.get(url);

    // If API returns { data: [...] } OR [...]
    const raw = Array.isArray(response.data)
      ? response.data
      : Array.isArray(response.data?.data)
        ? response.data.data
        : [];

    const mapped = raw.map((s) => ({
        AccountLedgerSubid: s.AccountLedgerSubid ?? s.accountLedgerSubid,
        AccountLedgerSubName: s.AccountLedgerSubName ?? s.accountLedgerSubName,
        AccountLedgerSubNarration: s.AccountLedgerSubNarration ?? s.accountLedgerSubNarration,
        AccountLedgerid: s.AccountLedgerId ?? s.accountLedgerId ?? s.accountLedgerid,

        // ✅ ADD THESE
        VendorCategoryId: s.VendorCategoryId ?? s.vendorCategoryId,
        VendorId: s.VendorId ?? s.vendorId,

        AssetsCode: s.AssetsCode ?? s.assetsCode ?? null,
        MobileNo: s.mobileNo ? String(s.mobileNo) : "",
        EmailId: s.EmailId ?? s.emailId,
        GstNo: s.GSTNo ?? s.GstNo ?? s.gstNo,
        Address: s.Address ?? s.address,
        OpeningBal: s.OpeningBal ?? s.openingBal ?? 0,
        ClosingBal: s.ClosingBal ?? s.closingBal ?? 0,
        IsBank: s.IsBank ?? s.isBank ?? false,
        IsActive: s.IsActive ?? s.isActive ?? true,
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
    setAccountSubGroup("")
    setAccountSubSubGroup("")
    setPrimaryGroup("")
    setGLCode("")
    setVendorCategoryId("")
    setIsBank(false)
    setAssetsCode("")
  };

  const validateForm = () => {
    if (formType === "ledger") {
      if(!primaryGroup) return "Please select Primary Group";
      if (!accountGroup) return "Please select Account Group";
      if (!ledgerGroupName.trim()) return "Please enter Ledger Name";
      const validateGST = () => {
      if (gstNo.trim() === "") return true; // Optional

      if (!gstRegex.test(gstNo)) {
      toast.error("Invalid GST Number");
      return false;
      }

      return true;
      };
      if (!description.trim()) return "Please enter Description";
    } else {
      if (!ledgerId) return "Please select Ledger for Sub Ledger";
      if (!ledgerSubGroupName.trim()) return "Please enter Sub Ledger name";
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
      const baseUrl = formType === "ledger" ? API_ENDPOINTS.AccountLedger : API_ENDPOINTS.AccountSubLedger;

      let payload;
      if (formType === "ledger") {
        payload = {
          accountLedgerName: ledgerGroupName.trim(),
          accountLedgerNarration: description.trim(),
          primaryGroupId: Number(primaryGroup),
          accountGroupId: Number(accountGroup),
          accountSubGroupId: Number(accountSubGroup),
          accountSubSubGroupId : Number(accountSubSubGroup),
          glCode: glCode,
          ledgerGroupName: ledgerGroupName,
          openingBal: openingBal || 0,
          closingBal: closingBal || 0,
          isActive: true,
        };
      } else {
        payload = {
          VendorCategoryId: vendorCategoryId ? Number(vendorCategoryId) : 0,
          VendorId:
            selectedCategory === "other"
              ? null
              : Number(vendorName) || null,

          AccountLedgerSubName:
            selectedCategory === "other"
              ? vendorName
              : ledgerSubGroupName,

          AccountLedgerSubNarration: description.trim(),
          AccountLedgerid: Number(ledgerId),
          AssetsCode: assetsCode,
          MobileNo: mobileNo || "",
          EmailId: emailId || "",
          GSTNo: gstNo || "",
          Address: address || "",
          IsBank: isBank,
          IsActive: true,
        };

        console.log(payload)
      }

      const method = editingId ? "put" : "post";
      const url = editingId ? `${baseUrl}${editingId}` : baseUrl;
      const response = await axios({ method, url, data: payload, headers: { "Content-Type": "application/json" } });

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

  const handleEdit = async (item) => {
    if (formType === "ledger") {
      setLedgerGroupName(item.AccountLedgerName ?? "");
      setDescription(item.AccountLedgerNarration ?? "");
      setGLCode(item.GLCode);
      setOpeningBal(item.OpeningBal ?? 0);
      setClosingBal(item.ClosingBal ?? 0);
      setEditingId(item.AccountLedgerId ?? null);

      const primaryId = item.PrimaryGroupId;
      const groupId = item.AccountGroupId;
      const subGroupId = item.AccountSubGroupId;
      const subSubGroupId = item.AccountSubSubGroupId;

      console.log(primaryId +"--"+ groupId +"--"+ subGroupId +"--"+ subSubGroupId)

      setPrimaryGroup(primaryId);

      await fetchAccountGroup(primaryId);      // load groups
      setAccountGroup(groupId);

      await fetchAccountSubGroup(groupId);     // load subgroups
      setAccountSubGroup(subGroupId);

      await fetchAccountSubSubGroup(subGroupId); // load subsubgroups
      setAccountSubSubGroup(subSubGroupId);

    } else {
      setFormType("subledger");
      setLedgerSubGroupName(item.AccountLedgerSubName ?? "");
      setVendorCategoryId(item.VendorCategoryId ?? "");

      // Detect category
      const category = vendorCategories.find(
        v => v.vendorCategoryId === item.VendorCategoryId
      )?.vendorCategoryName?.toLowerCase();

      // ✅ HANDLE BASED ON CATEGORY
      if (category === "other") {
        setVendorName(item.AccountLedgerSubName); // ✅ show name in input
      } else {
        setVendorName(item.VendorId ?? ""); // ✅ dropdown case
      }

      setDescription(item.AccountLedgerSubNarration ?? "");
      setLedgerId(item.AccountLedgerid ?? item.accountLedgerId ?? "");
      setAssetsCode(item.AssetsCode ?? item.assetsCode ?? "");
      setMobileNo(item.MobileNo ? String(item.MobileNo) : "");
      setEmailId(item.EmailId ?? "");
      setGstNo(item.GstNo ?? "");
      setAddress(item.Address ?? "");
      setOpeningBal(item.OpeningBal ?? 0);
      setClosingBal(item.ClosingBal ?? 0);
      setIsBank(item.IsBank)
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
      const baseUrl = formType === "ledger" ? API_ENDPOINTS.AccountLedger : API_ENDPOINTS.AccountSubLedger;

      // Soft-delete pattern: set isActive = false
      const response = await axios.delete(`${baseUrl}${id}`);

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
      const baseUrl = formType === "ledger" ? API_ENDPOINTS.AccountLedger : API_ENDPOINTS.AccountSubLedger;
       const response = await axios.patch(`${baseUrl}${id}/activate`);

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
    <div style={{ background: "#f5f5f5", minHeight: "80vh", padding: "20px" }}>
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="container-fluid">
        <div style={{ background: "white", padding: "20px", borderRadius: "8px", marginBottom: "20px" }} className="d-flex justify-content-between align-items-center flex-wrap">
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
                  <>
                  <div className="col-6 mb-3">
                    <label style={{ color: "#0066cc", fontWeight: "600" }}>Ledger Name</label>
                    <select value={ledgerId} onChange={(e) => setLedgerId(Number(e.target.value))} disabled={loading} className="form-control">
                      <option value="">-- Ledger Name --</option>
                      {ledgers.map((l) => (
                        <option key={l.AccountLedgerId} value={l.AccountLedgerId}>{l.AccountLedgerName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-6 mb-3">
                    <label style={{ color: "#0066cc", fontWeight: "600" }}>Vendor Category</label>
                    <select
                      value={vendorCategoryId}
                      onChange={(e) => {
                        const id = Number(e.target.value);
                        setVendorCategoryId(id);
                        setVendorName("");
                      }}
                      disabled={loading}
                      className="form-control">
                    
                      <option value="">-- Vendor Category --</option>

                      {vendorCategories.map((cat) => (
                        <option key={cat.vendorCategoryId} value={cat.vendorCategoryId}>
                          {cat.vendorCategoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                  </>
                )}

                {formType === "subledger" && (
                  <div className="row">
                    {/* <div className="col-6 mb-3">
                      <label style={{ color: "#0066cc", fontWeight: "600" }}>Ledger Sub-Group Name</label>
                      <input type="text" value={ledgerSubGroupName} onChange={(e) => setLedgerSubGroupName(e.target.value)} className="form-control" placeholder="Enter Ledger Sub Group Name" disabled={loading} />
                    </div> */}

                    <div className="col-6 mb-3">
                        <label style={{ color: "#0066cc", fontWeight: "600" }}>
                          {subLedgerLabel}
                        </label>

                        {selectedCategory === "other" ? (
                          // ✅ INPUT for Other
                          <input
                            type="text"
                            value={vendorName}
                            onChange={(e) => setVendorName(e.target.value)}
                            className="form-control"
                            placeholder="Enter SubLedger Name"
                            disabled={loading}
                          />
                        ) : selectedCategory === "seller" || selectedCategory === "buyer" ? (
                          // ✅ DROPDOWN for Seller / Buyer
                          // <select
                          //   value={vendorName || ""}
                          //   onChange={(e) => setVendorName(Number(e.target.value))}
                          //   className="form-control"
                          //   disabled={loading}
                          // >
                          //   <option value="">-- Select Vendor --</option>

                          //   {vendors.map((v) => (
                          //     <option key={v.vendorId} value={v.vendorId}>
                          //       {v.vendorName}
                          //     </option>
                          //   ))}
                          // </select>
                          <Select
                              options={vendors.map((v) => ({
                                value: v.vendorId,
                                label: v.vendorName,
                                vendorCode: v.vendorCode, // 👈 important
                                MobileNo: v.MobileNo ?? v.mobileNo ?? "",
                                EmailId: v.EmailId ?? v.emailId ?? "",
                                GstNo: v.GSTNo ?? v.GstNo ?? v.gstNo ?? "",
                                Address: v.Address ?? v.address ?? "",
                              }))}
                              value={
                                vendors
                                  .map((v) => ({
                                    value: v.vendorId,
                                    label: v.vendorName,
                                    vendorCode: v.vendorCode,
                                    MobileNo: v.MobileNo ?? v.mobileNo ?? "",
                                    EmailId: v.EmailId ?? v.emailId ?? "",
                                    GstNo: v.GSTNo ?? v.GstNo ?? v.gstNo ?? "",
                                    Address: v.Address ?? v.address ?? "",
                                  }))
                                  .find((opt) => opt.value === vendorName) || null
                              }
                              onChange={(selected) => {
                                setVendorName(selected?.value || "");

                                // ✅ Auto-fill Assets Code
                                setLedgerSubGroupName(selected?.label || "");
                                setAssetsCode(selected?.vendorCode || "");
                                setMobileNo(selected?.MobileNo || "");
                                setEmailId(selected?.EmailId || "");
                                setGstNo(selected?.GstNo || "")
                                setAddress(selected?.Address || "");
                              }}
                              isDisabled={loading}
                              placeholder="Search Vendor..."
                            />
                        ) : (
                          // ✅ DEFAULT EMPTY STATE
                          <input
                            type="text"
                            className="form-control"
                            value=""
                            placeholder="Select Vendor Category first"
                            disabled
                          />
                        )}
                      </div>

                    <div className="col-6 mb-3">
                      <label style={{ color: "#0066cc", fontWeight: "600" }}>Assets Code</label>
                      <input type="text" value={assetsCode} 
                       onChange={(e) => {
                        // Remove any non-digit character
                        const onlyNumbers = e.target.value.replace(/\D/g, "");
                        setAssetsCode(onlyNumbers);
                      }} 
                      className="form-control" placeholder="Enter Assets Code" disabled={loading} />
                    </div>
                  </div>
                )}

                 {formType === "subledger" && (
                 <div className="row">
                    <div className="col-6 mb-3">
                      <label style={{ color: "#0066cc", fontWeight: "600" }}>Opening Balance</label>
                      <input type="number" value={openingBal} onChange={(e) => setOpeningBal(Number(e.target.value))} className="form-control" placeholder="Opening Balance" disabled={loading} />
                    </div>

                    <div className="col-6 mb-3">
                      <label style={{ color: "#0066cc", fontWeight: "600" }}>Closing Balance</label>
                      <input type="number" value={closingBal} onChange={(e) => setClosingBal(Number(e.target.value))} className="form-control" placeholder="Closing Balance" disabled={loading} />
                    </div>
                  </div> 
                )}

                {formType === "subledger" && (
                    <div className="row">
                      <div className="col-6 mb-3">
                        <label style={{ color: "#0066cc", fontWeight: "600" }}>Mobile No</label>
                        <input type="text" 
                        value={mobileNo} 
                        onChange={(e) => {
                        // Allow only digits
                          const val = e.target.value.replace(/\D/g, "");

                        // Limit to 10 digits
                        if (val.length <= 10) {
                        setMobileNo(val);}}} 
                        className="form-control" 
                        placeholder="Enter Mobile No"
                        disabled={loading} />
                      </div>

                      <div className="col-6 mb-3">
                        <label style={{ color: "#0066cc", fontWeight: "600" }}>Email ID</label>
                        <input type="email" value={emailId} onChange={(e) => setEmailId(e.target.value)} className="form-control" placeholder="Enter Email ID" disabled={loading} />
                      </div>
                    </div>
                )}

                 {formType === "subledger" && (
                 <div className="row">
                    <div className="col-6 mb-3">
                      <label style={{ color: "#0066cc", fontWeight: "600" }}>GSTNo</label>
                      <input type="text" 
                      value={gstNo} 
                      maxLength={15}
                      onChange={(e) => setGstNo(e.target.value.toUpperCase())} 
                      className="form-control" 
                      placeholder="Enter GST No" 
                      disabled={loading} />
                    </div>

                    <div className="col-6 mb-3">
                      <label style={{ color: "#0066cc", fontWeight: "600" }}>Address</label>
                      <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="form-control" rows={2} placeholder="Enter Address" disabled={loading}></textarea>
                    </div>
                  </div> 
                 )}                  
              </div>

              {formType === "ledger" && (
                <>
                  <div className="row">
                      <div className="col-6 mb-3">
                        <label style={{ color: "#0066cc", fontWeight: "600" }}>Primary Group</label>
                        <select value={primaryGroup || ""} 
                        onChange={(e) => {
                          const primarygroupid = Number(e.target.value);
                          setPrimaryGroup(primarygroupid);
                          setAccountGroup("");    
                          setAccountSubGroup("");
                          setAccountSubSubGroup("");       // reset selected group
                          fetchAccountGroup(primarygroupid);     // fetch filtered groups
                        }}
                        disabled={loading} className="form-control">
                          <option value="">--Select Primary Group--</option>
                          {primaryGroupOptions.map((type) => (
                            <option key={type.primaryGroupid} value={type.primaryGroupid}>{type.primaryGroupName}</option>
                          ))}
                        </select>
                      </div>                 

                      <div className="col-6 mb-3">
                        <label style={{ color: "#0066cc", fontWeight: "600" }}>Account Group</label>
                        <select value={Number(accountGroup)} 
                         onChange={(e) => {
                          const groupid = Number(e.target.value);
                          setAccountGroup(Number(groupid));
                          setAccountSubGroup("");
                          setAccountSubSubGroup("");           // reset selected group
                          fetchAccountSubGroup(groupid);     // fetch filtered groups
                        }}
                        // onChange={(e) => setAccountGroup(Number(e.target.value))} 
                        disabled={loading} className="form-control">
                          <option value="">--Select Group--</option>
                          {accountGroupOptions.map((grp) => (
                            <option key={grp.accountGroupId} value={grp.accountGroupId}>{grp.accountGroupName}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-6 mb-3">
                        <label style={{ color: "#0066cc", fontWeight: "600" }}>Account SubGroup</label>
                        <select value={accountSubGroup} 
                         onChange={(e) => {
                          const subgroupid = Number(e.target.value);
                          setAccountSubGroup(subgroupid);
                          setAccountSubSubGroup("");           // reset selected group
                          fetchAccountSubSubGroup(subgroupid);     // fetch filtered groups
                        }}
                        // onChange={(e) => setAccountSubGroup(Number(e.target.value))} 
                        disabled={loading} className="form-control">
                          <option value="">--Select Sub Group--</option>
                          {accountSubGroupOptions.map((grp) => (
                            <option key={grp.accountSubGroupId} value={grp.accountSubGroupId}>{grp.accountSubGroupName}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-6 mb-3">
                        <label style={{ color: "#0066cc", fontWeight: "600" }}>Account Sub SubGroup</label>
                        <select value={accountSubSubGroup} onChange={(e) => setAccountSubSubGroup(Number(e.target.value))} disabled={loading} className="form-control">
                          <option value="">--Select Group--</option>
                          {accountSubSubGroupOptions.map((grp) => (
                            <option key={grp.accountSubSubGroupId} value={grp.accountSubSubGroupId}>{grp.accountSubSubGroupName}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-6 mb-3">
                        <label style={{ color: "#0066cc", fontWeight: "600" }}>Ledger Name</label>
                        <input type="text" value={ledgerGroupName} onChange={(e) => setLedgerGroupName(e.target.value)} className="form-control" placeholder="Enter Ledger Name" disabled={loading} />
                      </div>

                      <div className="col-6 mb-3">
                        <label style={{ color: "#0066cc", fontWeight: "600" }}>GL Code</label>
                        {/* <input type="text" value={glCode} onChange={(e) => setGLCode(e.target.value)} className="form-control" placeholder="Enter GL Code" disabled={loading} /> */}
                        <input type="text" value={glCode} className="form-control" disabled={loading} readOnly />
                      </div>
                    </div>

                   <div className="row">
                    <div className="col-6 mb-3">
                      <label style={{ color: "#0066cc", fontWeight: "600" }}>Opening Balance</label>
                      <input type="number" value={openingBal} onChange={(e) => setOpeningBal(Number(e.target.value))} className="form-control" placeholder="Opening Balance" disabled={loading} />
                    </div>

                    <div className="col-6 mb-3">
                      <label style={{ color: "#0066cc", fontWeight: "600" }}>Closing Balance</label>
                      <input type="number" value={closingBal} onChange={(e) => setClosingBal(Number(e.target.value))} className="form-control" placeholder="Closing Balance" disabled={loading} />
                    </div>
                  </div>             
                </>
              )}

              <div className="row">
                <div className="col-12 mb-3">
                  <label style={{ color: "#0066cc", fontWeight: "600" }}>Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" placeholder="Enter description" rows={2} disabled={loading}></textarea>
                </div>
              </div>

              <div className="row">
                <div className="col-12 mb-3">
                  <div className="d-flex gap-4 mt-1">
                    <label className="d-flex align-items-center gap-2" style={{ color: "#0066cc", fontWeight: "600" }}>
                      <input
                        type="radio"
                        name="isBank"
                        value="true"                        
                        checked={isBank === true}
                        onChange={() => setIsBank(true)}
                        disabled={loading}/>                      
                      Is Bank
                    </label>         
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={handleSave}
                  className="btn btn-primary save"
                  disabled={loading}>
                
                  <Save size={18} style={{ marginRight: "6px" }} /> Save
                </button>
                <button onClick={handleCancel} className="btn btn-secondary" disabled={loading}>
                  Cancel
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div style={{ background: "white", padding: "20px", borderRadius: "8px" }}>
              <h5 style={{ color: "#0066cc", fontWeight: "600" }}>{formType === "ledger" ? "Ledgers List" : "Sub Ledgers List"}</h5>

              <table className="table table-bordered table-striped mt-3">
                <thead>
                  <tr>                    
                    <th className="text-primary">{formType === "ledger" ? "Ledger Name" : "SubLedger Name"}</th>

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
                      <tr key={item.AccountLedgerSubid ?? item.AccountLedgerId}>
                        <td>
                          {formType === "ledger"
                            ? item.AccountLedgerName
                            : item.AccountLedgerSubName}
                        </td>

                        {activeFilter === "active" ? (
                          <>
                            <td>
                              <button
                                onClick={() => handleEdit(item)}
                                disabled={loading}
                                className="btn btn-link p-0">
                              
                                <Eye size={18} />
                              </button>
                            </td>

                            <td>
                              <button
                                onClick={() =>
                                  handleDelete(item.AccountLedgerId ?? item.AccountLedgerSubid)
                                }
                                disabled={loading}
                                className="btn btn-link text-danger p-0">
                              
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </>
                        ) : (
                          <td>
                            <button
                              onClick={() =>
                                handleActivate(item.AccountLedgerId ?? item.AccountLedgerSubid)
                              }
                              disabled={loading}
                              className="btn btn-link text-success p-0 fw-semibold"
                            >
                              Activate
                            </button>
                          </td>
                        )}
                      </tr>
                      // <tr key={item.AccountLedgerId ?? item.AccountLedgerSubid}>
                      //   {/* LEDGER LIST → Show Account Group Name */}
                       
                      //   {formType === "subledger" && (
                      //     <td>{ledgers.find((l) => Number(l.AccountLedgerId) === Number(item.AccountLedgerid))?.AccountLedgerName ?? "N/A"}</td>
                      //   )}

                      //   <td>{item.AccountLedgerName ?? item.AccountLedgerSubName}</td>

                      //   {activeFilter === "active" ? (
                      //     <>
                      //       <td>
                      //         <button onClick={() => handleEdit(item)} disabled={loading} className="btn btn-link p-0" title="Edit">
                      //           <Eye size={18} />
                      //         </button>
                      //       </td>

                      //       <td>
                      //         <button onClick={() => handleDelete(item.AccountLedgerId ?? item.AccountLedgerSubid)} disabled={loading} className="btn btn-link text-danger p-0" title="Delete">
                      //           <Trash2 size={18} />
                      //         </button>
                      //       </td>
                      //     </>
                      //   ) : (
                      //     <td>
                      //       <button onClick={() => handleActivate(item.AccountLedgerId ?? item.AccountLedgerSubid)} disabled={loading} className="btn btn-link text-success p-0 fw-semibold" title="Activate">
                      //         Activate
                      //       </button>
                      //     </td>
                      //   )}
                      // </tr>
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
