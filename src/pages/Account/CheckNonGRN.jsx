import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/apiconfig";
import Select, { components } from "react-select";
const CheckNonGRN = () => {
  const navigate = useNavigate();
const [ledgers, setLedgers] = useState([]);
  const [selectedLedgers, setSelectedLedgers] = useState([]);

  const ledgerOptions = ledgers.map(l => ({
    value: l.accountLedgerId,
    label: l.accountLedgerName
  }));
  const [employees, setEmployees] = useState([]);
const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
const [categories, setCategories] = useState([]);
const [selectedCategoryId, setSelectedCategoryId] = useState("");
const [items, setItems] = useState([]);
const [activePage, setActivePage] = useState("");   // ✅ ADD THIS

const [billType, setBillType] = useState("");
  const [vendors, setVendors] = useState([]);
  const [selectedVendorId, setSelectedVendorId] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isRegularParty, setIsRegularParty] = useState(false);
  const [taxType, setTaxType] = useState("");
const [igstRate, setIgstRate] = useState("");
const [sgstRate, setSgstRate] = useState("");
const [cgstRate, setCgstRate] = useState("");

const [masterBillCheck, setMasterBillCheck] = useState(false);
 const [formData, setFormData] = useState({
   employeeName: "",
  employeeCode: "",
  employeeEmail: "",
  employeeMobile: "",
  employeeAddress: "",
  employeeCity: "",

  partyName: "",
  vendorCode: "",
  address: "",
  city: "",
 PayDueDate: "",   // ✅ ADD THIS
  EmailID: "",      // ✅ ADD THIS

  contactPerson: "",
  contactNo: "",
  bankName: "",
  branchName: "",

  accountNo: "",
  ifscCode: "",
  gstNo: "",
  invoiceNo: "",

  invoiceDate: "",
  basicAmount: "",
  taxrate:"",
  taxType: "",
  qtyLot: "",

  igstAmount: "",
  sgstAmount: "",
  cgstAmount: "",

  ledgerCode: "",

  description: "",     // invoice description
  glDescription: ""    // GL description
});

  
const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
};
useEffect(() => {
  if (ledgers.length > 0) {
    const defaultLedgers = ledgers
      .filter(l =>
        l.accountLedgerName.toLowerCase().includes("igst") ||
        l.accountLedgerName.toLowerCase().includes("cgst") ||
        l.accountLedgerName.toLowerCase().includes("sgst")
      )
      .map(l => l.accountLedgerId);

    setSelectedLedgers(defaultLedgers);

    setFormData(prev => ({
      ...prev,
      ledgerId: defaultLedgers.join("|")
    }));
  }
}, [ledgers]);
const vendorOptions = vendors.map((v) => ({
  value: v.id,
  label: v.company_Name || v.companyName
}));
const employeeOptions = employees.map((emp) => ({
  value: emp.employeeId,
  label: emp.fullName?.trim()
}));
useEffect(() => {
  const qty = Number(formData.qtyLot || 0);
  const basic = Number(formData.basicAmount || 0);
  const rate = Number(formData.taxrate || 0);

  const totalBasic = qty * basic;

  let igst = 0;
  let sgst = 0;
  let cgst = 0;

  if (formData.taxType === "IGST") {
    igst = (totalBasic * rate) / 100;
  }

  if (formData.taxType === "SGST_CGST") {
    sgst = (totalBasic * rate) / 200;
    cgst = (totalBasic * rate) / 200;
  }

  setFormData(prev => ({
    ...prev,
    igstAmount: igst.toFixed(2),
    sgstAmount: sgst.toFixed(2),
    cgstAmount: cgst.toFixed(2)
  }));

}, [
  formData.basicAmount,
  formData.qtyLot,
  formData.taxrate,
  formData.taxType
]);
useEffect(() => {

  const qty = Number(formData.qtyLot || 0);
  const basic = Number(formData.basicAmount || 0);

  const totalBasic = qty * basic;

  let igst = 0;
  let sgst = 0;
  let cgst = 0;

  if (formData.taxType === "IGST") {
    igst = (totalBasic * Number(formData.taxrate || 0)) / 100;
  }

  if (formData.taxType === "CGST_SGST") {
    sgst = (totalBasic * Number(sgstRate || 0)) / 100;
    cgst = (totalBasic * Number(cgstRate || 0)) / 100;
  }

  setFormData(prev => ({
    ...prev,
    igstAmount: igst.toFixed(2),
    sgstAmount: sgst.toFixed(2),
    cgstAmount: cgst.toFixed(2)
  }));

}, [
  formData.qtyLot,
  formData.basicAmount,
  formData.taxType,
  formData.taxrate,
  sgstRate,
  cgstRate
]);
const handleMasterBillCheck = (checked) => {
  setMasterBillCheck(checked);

  if (checked) {
    console.log("All items selected");
  } else {
    console.log("All items unselected");
  }
};
useEffect(() => {
  fetchVendors();
  fetchLedgers();
    fetchCategories();
      fetchEmployees();   // ⭐ ADD THIS


}, []);
  // ================= FETCH VENDORS =================
  // useEffect(() => {
  //   fetchVendors();
  // }, []);
const fetchLedgers = async () => {
  try {
const res = await axios.get(
  `${API_ENDPOINTS.Ledger}?isActive=true`
);
    setLedgers(res.data);
  } catch (error) {
    Swal.fire("Error fetching ledgers");
  }
};
  const handleLedgerChange = (e) => {
  const ledgerId = e.target.value;

  const selectedLedger = ledgers.find(
    (l) => l.accountLedgerId === Number(ledgerId)
  );

  if (selectedLedger) {
    setFormData((prev) => ({
      ...prev,
      ledgerId: ledgerId,
      ledgerName: selectedLedger.accountLedgerName,
      ledgerCode: selectedLedger.glCode,
      glDescription: selectedLedger.accountLedgerNarration
    }));
  }
};
const fetchVendors = async () => {
  try {
    const res = await axios.get(API_ENDPOINTS.Vendors);

    if (res.data.success) {
      setVendors(res.data.data);
      return res.data.data;
    }

  } catch (error) {
    console.log("Vendor API error", error); // ❌ No popup
    return [];
  }
};
const fetchCategories = async () => {
  try {
    const res = await axios.get(API_ENDPOINTS.Vendorcategories);

    if (res.data.success) {
      setCategories(res.data.data);
    }

  } catch (error) {
    console.log("Category API error", error);
  }
};
const fetchSalesBuyers = async () => {
  try {

    const res = await axios.get(API_ENDPOINTS.SalesBuyers);

    if (res.data.success) {
      setVendors(res.data.data); // reuse same dropdown
    }

  } catch (error) {
    console.log("Buyer API error", error);
  }
};
const fetchEmployees = async () => {
  try {

    const res = await axios.get(API_ENDPOINTS.GetAll_Employee);

    setEmployees(res.data);

  } catch (error) {
    console.log("Employee API error", error);
  }
};
const handleBillTypeChange = async (type) => {

  setBillType(type);

  setSelectedVendorId("");
  setVendors([]);

  if (type === "NonGRN") {
    // Vendor API
    fetchVendors();
  }

  if (type === "NonInvoice") {
    // Buyer API
    fetchSalesBuyers();
  }
};
const handleCategoryChange = async (categoryId) => {

  setSelectedCategoryId(categoryId);

  const selectedCategory = categories.find(
    (c) => c.id === Number(categoryId)
  );

  if (!selectedCategory) return;

  // reset vendor
  setSelectedVendorId("");
  setVendors([]);
  if (!selectedCategory) return;

  if (selectedCategory.name === "Seller") {
    fetchVendors();
  }

  if (selectedCategory.name === "Buyer") {
    fetchSalesBuyers();
  }
};
 const handleVendorChange = (e) => {
  const vendorId = e.target.value;
  setSelectedVendorId(vendorId);
  setSelectedEmployeeId(""); // hide employee

  const vendor = vendors.find(v => v.id === Number(vendorId));

  if (vendor) {
    setFormData(prev => ({
      ...prev,
      partyName: vendor.company_Name || "",
      vendorCode: vendor.vendorCode || "",
      address: vendor.address || "",
      city: vendor.city || "",
      contactPerson: vendor.contact_Person || "",
      contactNo: vendor.contact_Number || "",
      bankName: vendor.bank_Name || "",
      branchName: vendor.branch || "",
      gstNo: vendor.gst_Number || "",
  EmailID: vendor.email || ""   // ✅ FIX

    }));

    setShowForm(true); // ⭐ SHOW FORM
  }
};
const handleEmployeeChange = (e) => {
  const empId = e.target.value;

  setSelectedEmployeeId(empId);
  setSelectedVendorId(""); // hide vendor

  const emp = employees.find(
    (x) => x.employeeId === Number(empId)
  );

  if (emp) {
    setFormData((prev) => ({
      ...prev,
      employeeName: emp.fullName || "",
      employeeCode: emp.empCode || "",
      employeeEmail: "",
      employeeMobile: emp.contactNo || "",
      employeeAddress: "",
      employeeCity: emp.city || ""
    }));

    setShowForm(true); // ⭐ ADD THIS LINE
  }
};
const handleAddProduct = () => {

  const totalBasic =
    Number(formData.basicAmount || 0) *
    Number(formData.qtyLot || 0);

  const totalTax =
    Number(formData.igstAmount || 0) +
    Number(formData.sgstAmount || 0) +
    Number(formData.cgstAmount || 0);

  const totalItemValue = totalBasic + totalTax;
const newItem = {
  description: formData.description,
  qty: Number(formData.qtyLot || 0),
  basicAmount: Number(formData.basicAmount || 0),
  taxType: formData.taxType,

  igst: Number(formData.igstAmount || 0),
  sgst: Number(formData.sgstAmount || 0),
  cgst: Number(formData.cgstAmount || 0),

  taxRate: Number(formData.taxrate || 0),

  totalTax: totalTax,
  totalItemValue: totalItemValue,

  ledgerName: formData.glDescription,
  ledgerId: Number(formData.ledgerId || 0)
};
  setItems([...items, newItem]);

  setFormData(prev => ({
    ...prev,
    description: "",
    basicAmount: "",
    taxrate: "",
    qtyLot: "",
    igstAmount: "",
    sgstAmount: "",
    cgstAmount: ""
  }));
};
const totalBasic = items.reduce(
  (sum, i) =>
    sum +
    Number(i.basicAmount || 0) * Number(i.qty || 0),
  0
);

const totalTax = items.reduce(
  (sum, i) => sum + Number(i.totalTax || 0),
  0
);

const grandTotal = items.reduce(
  (sum, i) => sum + Number(i.totalItemValue || 0),
  0
);
const handleSubmit = async () => {
  if (!selectedVendorId && !selectedEmployeeId && !formData.partyName) {
  Swal.fire("Error", "Please select Vendor or Employee", "error");
  return;
}

  if (!items || items.length === 0) {
    Swal.fire("Error", "Please add at least one item", "error");
    return;
  }

  // Prepare Invoice totals
  const totalAmount = items.reduce((sum, i) => sum + Number(i.totalItemValue || 0), 0);
  const totalTaxAmount = items.reduce((sum, i) => sum + Number(i.totalTax || 0), 0);
  const sgstAmount = items.reduce((sum, i) => sum + Number(i.sgst || 0), 0);
  const cgstAmount = items.reduce((sum, i) => sum + Number(i.cgst || 0), 0);
  const igstAmount = items.reduce((sum, i) => sum + Number(i.igst || 0), 0);

  // Prepare payload matching NonGRNSaveRequest
   const payload = {
  Vendor: {
  AccountVendorId: selectedVendorId || 0,
  VendorName: formData.partyName || "",
  VendorCode: formData.vendorCode || "",
  Address: formData.address || "",
  City: formData.city || "",
  GSTNo: formData.gstNo || "",
  EmailID: (formData.EmailID || "").substring(0, 50),
  ContactPerson: formData.contactPerson || "",
  ContactNo: String(formData.contactNo || ""),
  BanckName: formData.bankName || "",
  BranchName: formData.branchName || "",
  AccountNo: formData.accountNo || "",
  IFSCCode: (formData.ifscCode || "").substring(0, 10)
},
   Invoice: {
  EmployeeId: selectedEmployeeId || 0,
  VendorId: selectedVendorId || 0,
  VendorCode: selectedVendorId
    ? formData.vendorCode
    : formData.employeeCode,

  InvoiceNo: formData.invoiceNo || "",
  InvoiceDate: formData.invoiceDate || null,
  PayDueDate: formData.PayDueDate || null,

  NonGrnInvoice: billType === "NonGRN" ? "NonGRN" : "NonSO",

  CheckNonGRNInvoice: "Pending",

  TotalAmount: totalAmount,
  TotalTaxAmount: totalTaxAmount,
  SGSTAmount: sgstAmount,
  CGSTAmount: cgstAmount,
  IGSTAmount: igstAmount
},
    Details: items.map(i => ({
Itemname: i.description || "",      // optional
  Description: i.description || "",       // ✅ required
      Qty: Number(i.qty || 0),
      BasicAmount: Number(i.basicAmount || 0),
      TaxType: i.taxType || "",
      TaxAmount: Number(i.totalTax || 0),
      TotalValue: Number(i.totalItemValue || 0),
LedgerId: i.ledgerId  , // string "9|37|38"      IGST: Number(i.igst || 0),
      CGST: Number(i.cgst || 0),
      SGST: Number(i.sgst || 0),
      TaxRate: Number(i.taxRate || 0)
    }))
  };

  try {
    const res = await axios.post(API_ENDPOINTS.SaveNonGRN, payload);
    if (res.data && res.data.success) {
      Swal.fire("Success", "Non-GRN invoice saved successfully!", "success");
      setFormData({});       // reset form
      setItems([]);          // clear items
      setSelectedVendorId("");
      setSelectedEmployeeId("");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Error", "Failed to save Non-GRN invoice", "error");
  }
};

// Tax calculation helper
const calculateTax = (basic, percent) => {
  const tax = (parseFloat(basic) || 0) * (parseFloat(percent) || 0) / 100;
  const total = (parseFloat(basic) || 0) + tax;
  return { tax, total };
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...formData, [name]: value };

    if (name === "basicAmount" || name === "taxPercent") {
      const calc = calculateTax(
        name === "basicAmount" ? value : updated.basicAmount,
        name === "taxPercent" ? value : updated.taxPercent
      );
      updated.taxAmount = calc.tax.toFixed(2);
      updated.totalAmount = calc.total.toFixed(2);
    }

    setFormData(updated);
  };

  
  
return (
  <div className="container-fluid px-4 py-3">
    <div
      style={{
        background: "#f1f3f6",
        padding: "25px",
        borderRadius: "10px"
      }}
    >
{/* ================= BILL TYPE ================= */}
<div className="row g-4 mb-4">

  {/* Radio Buttons */}
  <div className="col-md-4">
    <label className="form-label fw-bold text-primary">
      Bill Type
    </label>

    <div className="d-flex gap-4">

      <div className="form-check">
        <input
  className="form-check-input"
  type="radio"
  name="billType"
  value="NonGRN"
  checked={billType === "NonGRN"}
  onChange={(e) => handleBillTypeChange(e.target.value)}
/>
<label className="form-check-label">
  Non GRN
</label>
      </div>

      <div className="form-check">
       <input
  className="form-check-input"
  type="radio"
  name="billType"
  value="NonInvoice"
  checked={billType === "NonInvoice"}
  onChange={(e) => handleBillTypeChange(e.target.value)}
/>
<label className="form-check-label">
  Non SO
</label>
      </div>

    </div>
  </div>

  {/* Select Category
 <div className="col-md-3">
  <label className="form-label fw-bold text-primary">
    Select Category
  </label>

 <select
  className="form-select"
  value={selectedCategoryId}
  onChange={(e) => handleCategoryChange(e.target.value)}
>
  <option value="">-- Select Category --</option>

  {categories.map((c) => (
    <option key={c.id} value={c.id}>
      {c.name}
    </option>
  ))}
</select>
</div>
 */}
  {/* Select Vendor */}
  <div className="col-md-3">
          <label className="form-label fw-bold text-primary">
            Select Vendor
          </label>
<Select
  options={vendorOptions}
  value={vendorOptions.find(v => v.value === selectedVendorId) || null}
  isDisabled={!billType}
  placeholder="Search a seller"
  isSearchable={true}

  noOptionsMessage={({ inputValue }) => {

    if (inputValue) {

      setTimeout(() => {

        Swal.fire({
          title: "Vendor Not Found",
          text: `Is this your regular party '${inputValue}'? Do you want to create Vendor Master?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, Create",
          cancelButtonText: "No"
        }).then((result) => {

          if (result.isConfirmed) {

            // Navigate to VendorMaster page
   navigate("/masters", { state: { page: "vendorMaster" } });

          } else {

            setSelectedVendorId(null);
            setShowForm(true);

            setFormData(prev => ({
              ...prev,
              partyName: "",
              vendorCode: "",
              address: "",
              city: "",
              contactPerson: "",
              contactNo: "",
              bankName: "",
              branchName: "",
              gstNo: ""
            }));

          }

        });

      }, 200);
    }

    return "No vendor found";
  }}

  styles={{
    menu: (provided) => ({
      ...provided,
      zIndex: 9999
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "200px"
    })
  }}

  onChange={(selected) => {

  if (!selected) {
    setSelectedVendorId(null);
    setShowForm(true);
    return;
  }

  const vendorId = Number(selected.value);

  setSelectedVendorId(vendorId);
  setSelectedEmployeeId(false); // hide employee form
  setShowForm(false); // hide employee form also

  const vendor = vendors.find(v => v.id === vendorId);

  if (vendor) {

    setFormData(prev => ({
      ...prev,
      partyName: vendor.company_Name || "",
      vendorCode: vendor.vendorCode || "",
      address: vendor.address || "",
      city: vendor.city || "",
      contactPerson: vendor.contact_Person || "",
      contactNo: vendor.contact_Number || "",
      bankName: vendor.bank_Name || "",
      branchName: vendor.branch || "",
      gstNo: vendor.gst_Number || "",
      EmailID: vendor.email || ""
    }));

  }

}}
   
/>
        </div>


  {/* Select Employee */}
  <div className="col-md-2">
    <label className="form-label fw-bold text-primary">
      Select Employee
    </label>
  <Select
  options={employeeOptions}
  value={employeeOptions.find(e => e.value === selectedEmployeeId) || null}
  placeholder="Search Employee"
  isSearchable={true}

  styles={{
    menu: (provided) => ({
      ...provided,
      zIndex: 9999
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "200px"
    })
  }}

  onChange={(selected) => {

    if (!selected) {
      setSelectedEmployeeId("");
      return;
    }

    const empId = selected.value;

    setSelectedEmployeeId(empId);
    setSelectedVendorId(""); // clear vendor

    const emp = employees.find(x => x.employeeId === empId);

    if (emp) {
      setFormData(prev => ({
        ...prev,
       employeeName: emp.fullName || "",
  employeeCode: emp.empCode || "",
  employeeEmail: emp.email || "",      // ✅ correct
  employeeMobile: emp.contactNo || "",
  employeeAddress: emp.address || "",  // ✅ correct
  employeeCity: emp.city || ""
      }));
    }

  }}
/>
  </div>

</div>
      

      

      {/* ================= MAIN FORM ================= */}

{/* ================= VENDOR CUSTOM CARD ================= */}
{(selectedVendorId || showForm) && ( <div
  className="custm-card"
  style={{
    background: "#fff",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    marginBottom: "20px"
  }}
>


{/* Vendor Basic Details */}
<div className="row g-4 mb-4">

  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">
      Vendor Name
    </label>
    <input
  className="form-control"
  name="partyName"
  value={formData.partyName}
  onChange={handleChange}
  readOnly={selectedVendorId} 
/>
  </div>

  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">
      Vendor Code
    </label>
    <input

      className="form-control"
      value={formData.vendorCode}
        readOnly={selectedVendorId} 

    />
  </div>

  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">
      Address
    </label>
    <input
          name="address"

      className="form-control"
      value={formData.address}
        onChange={handleChange}

        readOnly={selectedVendorId} 

    />
  </div>

  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">
      City
    </label>
    <input
  className="form-control"
  name="city"
  value={formData.city}
  onChange={handleChange}
  readOnly={selectedVendorId}
/>
  </div>

</div>

{/* Contact Details */}
<div className="row g-4 mb-4">

  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">
      GST No
    </label>
    <input
      name="gstNo"
      className="form-control"
      value={formData.gstNo}
      onChange={handleChange}
    />
  </div>

  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">
      Contact Person
    </label>
    <input
      name="contactPerson"
      className="form-control"
      value={formData.contactPerson}
      onChange={handleChange}
    />
  </div>

  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">
      Contact No
    </label>
    <input
      name="contactNo"
      className="form-control"
      value={formData.contactNo}
      onChange={handleChange}
    />
  </div>
<div className="col-md-3">
    <label className="form-label fw-bold text-primary">
Email    </label>
  <input
  name="EmailID"
  className="form-control"
  value={formData.EmailID}
  onChange={handleChange}
/>
  </div>
  

</div>

{/* Bank Details */}
<div className="row g-4 mb-4">
<div className="col-md-3">
    <label className="form-label fw-bold text-primary">
      Bank Name
    </label>
    <input
      name="bankName"
      className="form-control"
      value={formData.bankName}
      onChange={handleChange}
    />
  </div>
  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">
      Branch Name
    </label>
    <input
      name="branchName"
      className="form-control"
      value={formData.branchName}
      onChange={handleChange}
    />
  </div>

  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">
      Account No
    </label>
    <input
      name="accountNo"
      className="form-control"
      value={formData.accountNo}
      onChange={handleChange}
    />
  </div>

  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">
      IFSC Code
    </label>
    <input
      name="ifscCode"
      className="form-control"
      value={formData.ifscCode}
      onChange={handleChange}
    />
  </div>

  

</div>

{/* Invoice Details */}
<div className="row g-4">
<div className="col-md-3">
    <label className="form-label fw-bold text-primary">
      Invoice No
    </label>
    <input
      name="invoiceNo"
      className="form-control"
      onChange={handleChange}
    />
  </div>
  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">
      Invoice Date
    </label>
    <input
      type="date"
      name="invoiceDate"
      className="form-control"
      value={formData.invoiceDate}
      onChange={handleChange}
    />
  </div>

  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">
      PayDueDate
    </label>
    <input
      type="date"
      name="PayDueDate"
      className="form-control"
      value={formData.PayDueDate}
      onChange={handleChange}
    />
  </div>
</div>

</div>

)}
{(selectedEmployeeId || showForm) && (
<div
  className="custm-card"
  style={{
    background: "#fff",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    marginBottom: "20px"
  }}
>


{/* ROW 1 */}
<div className="row g-4 mb-4">

  {/* Employee Name */}
  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">Employee Name</label>
    <input className="form-control" value={formData.employeeName} readOnly />
  </div>

  {/* Address */}
  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">Address</label>
    <input className="form-control" value={formData.employeeAddress} readOnly />
  </div>

  {/* City */}
  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">City</label>
    <input className="form-control" value={formData.employeeCity} readOnly />
  </div>

  {/* Employee Code */}
  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">Employee Code</label>
    <input className="form-control" value={formData.employeeCode} readOnly />
  </div>

</div>

{/* ROW 2 */}
<div className="row g-4 mb-4">

  {/* Email */}
  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">Email</label>
    <input className="form-control" value={formData.employeeEmail} readOnly />
  </div>

  {/* Contact No */}
  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">Contact No</label>
    <input className="form-control" value={formData.employeeMobile} readOnly />
  </div>

  {/* Bank Name */}
  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">Bank Name</label>
    <input
      name="bankName"
      className="form-control"
      value={formData.bankName}
      onChange={handleChange}
    />
  </div>

  {/* Branch Name */}
  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">Branch Name</label>
    <input
      name="branchName"
      className="form-control"
      value={formData.branchName}
      onChange={handleChange}
    />
  </div>

</div>

{/* ROW 3 */}
<div className="row g-4 mb-4">

  {/* Account No */}
  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">Account No</label>
    <input
      name="accountNo"
      className="form-control"
      value={formData.accountNo}
      onChange={handleChange}
    />
  </div>

  {/* IFSC Code */}
  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">IFSC Code</label>
    <input
      name="ifscCode"
      className="form-control"
      value={formData.ifscCode}
      onChange={handleChange}
    />
  </div>

  {/* Invoice No */}
  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">Invoice No</label>
    <input
      name="invoiceNo"
      className="form-control"
      value={formData.invoiceNo}
      onChange={handleChange}
    />
  </div>

  {/* Invoice Date */}
  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">Invoice Date</label>
    <input
      type="date"
      name="invoiceDate"
      className="form-control"
      value={formData.invoiceDate}
      onChange={handleChange}
    />
  </div>
<div className="col-md-3">
    <label className="form-label fw-bold text-primary">
      PayDueDate
    </label>
    <input
      type="date"
      name="PayDueDate"
      className="form-control"
      value={formData.PayDueDate}
      onChange={handleChange}
    />
  </div>
</div>

</div>
)}
{(selectedVendorId || selectedEmployeeId || showForm) && (
        <>
{/* ================= CUSTOM CARD ================= */}
<div
  className="custm-card"
  style={{
    background: "#fff",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    marginBottom: "20px"
  }}
>

{/* ================= ROW 1 ================= */}
<div className="row g-4 mb-4">

  {/* Description */}
  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">Description</label>
    <input
      type="text"
      name="description"
      className="form-control"
      value={formData.description}
      onChange={handleChange}
    />
  </div>

  {/* Qty */}
  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">Qty / Lot</label>
    <input
      type="number"
      name="qtyLot"
      className="form-control"
      value={formData.qtyLot}
      onChange={handleChange}
    />
  </div>

  {/* Amount */}
  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">Amount</label>
    <input
      type="number"
      name="basicAmount"
      className="form-control"
      value={formData.basicAmount}
      onChange={handleChange}
    />
  </div>

  {/* Tax Type */}
  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">Tax Type</label>

    <select
      name="taxType"
      className="form-select"
      value={formData.taxType}
      onChange={(e) => {
        setFormData({
          ...formData,
          taxType: e.target.value,
          taxrate: "",
          igstAmount: "",
          sgstAmount: "",
          cgstAmount: ""
        });
      }}
    >
      <option value="">Select</option>
      <option value="IGST">IGST</option>
      <option value="CGST_SGST">CGST & SGST</option>
    </select>
  </div>

</div>

{/* ================= ROW 2 ================= */}
<div className="row g-4 mb-4">

{/* IGST Dropdown */}
{formData.taxType === "IGST" && (
  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">IGST %</label>

    <select
      name="taxrate"
      className="form-select"
      value={formData.taxrate}
      onChange={handleChange}
    >
      <option value="">Select</option>
      <option value="5">5%</option>
      <option value="18">18%</option>
    </select>
  </div>
)}

{/* CGST SGST */}
{formData.taxType === "CGST_SGST" && (
<>
  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">SGST %</label>

    <select
      name="sgstRate"
      className="form-select"
      value={sgstRate}
      onChange={(e) => setSgstRate(e.target.value)}
    >
      <option value="">Select</option>
      <option value="2.5">2.5%</option>
      <option value="9">9%</option>
    </select>
  </div>

  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">CGST %</label>

    <select
      name="cgstRate"
      className="form-select"
      value={cgstRate}
      onChange={(e) => setCgstRate(e.target.value)}
    >
      <option value="">Select</option>
      <option value="2.5">2.5%</option>
      <option value="9">9%</option>
    </select>
  </div>
</>
)}

  {/* IGST Amount */}
  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">IGST Amount</label>
    <input
      type="number"
      name="igstAmount"
      className="form-control"
      value={formData.igstAmount}
      onChange={handleChange}
    />
  </div>

  {/* SGST Amount */}
  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">SGST Amount</label>
    <input
      type="number"
      name="sgstAmount"
      className="form-control"
      value={formData.sgstAmount}
      onChange={handleChange}
    />
  </div>

</div>

{/* ================= ROW 3 ================= */}
<div className="row g-4 mb-4">

  {/* CGST Amount */}
  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">CGST Amount</label>
    <input
      type="number"
      name="cgstAmount"
      className="form-control"
      value={formData.cgstAmount}
      onChange={handleChange}
    />
  </div>

  {/* Total Tax */}
  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">Total Tax Value</label>
    <input
      className="form-control"
      readOnly
      value={
        Number(formData.igstAmount || 0) +
        Number(formData.sgstAmount || 0) +
        Number(formData.cgstAmount || 0)
      }
    />
  </div>

  {/* Total Item */}
  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">Total Item Value</label>
    <input
      className="form-control"
      readOnly
      value={
        Number(formData.basicAmount || 0) +
        Number(formData.igstAmount || 0) +
        Number(formData.sgstAmount || 0) +
        Number(formData.cgstAmount || 0)
      }
    />
  </div>

  {/* Ledger */}
  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">Ledger</label>

    <Select
  options={ledgerOptions}
  isMulti
  closeMenuOnSelect={false}
  hideSelectedOptions={false}
  placeholder="Select Ledger"
  value={ledgerOptions.filter(l =>
    selectedLedgers.includes(l.value)
  )}
  onChange={(selected) => {
    const values = selected ? selected.map(s => s.value) : [];

    setSelectedLedgers(values);

    setFormData(prev => ({
      ...prev,
      ledgerId: values.join("|")   // ✅ store like your DB format
    }));
  }}
  styles={{
    menu: (provided) => ({
      ...provided,
      zIndex: 9999
    })
  }}
/>
  </div>

</div>

{/* ================= ROW 4 ================= */}
<div className="row g-4 align-items-end">

  <div className="col-md-3">
    <label className="form-label fw-bold text-primary">Ledger Code</label>
    <input
      className="form-control"
      value={formData.ledgerCode}
      readOnly
    />
  </div>

  <div className="col-md-5">
    <label className="form-label fw-bold text-primary">GL Description</label>
    <input
      className="form-control"
      value={formData.glDescription}
      readOnly
    />
  </div>

  <div className="col-md-4">
    <button
      type="button"
      className="btn btn-primary w-100"
      onClick={handleAddProduct}
    >
      Add
    </button>
  </div>

</div>

</div>

{/* ================= COMMON PRODUCT TABLE ================= */}

{items.length > 0 && (

<>
<div className="table-responsive mt-4">

<table className="table table-bordered">

<thead style={{ background: "#34495e", color: "white" }}>
<tr>
<th>Description</th>
<th>Basic Amount</th>
<th>Tax Type</th>
<th>Total Tax</th>
<th>Total Item Value</th>
<th>Ledger Name</th>
</tr>
</thead>

<tbody>

{items.map((item, index) => (

<tr key={index}>

<td>{item.description}</td>
<td>{item.basicAmount}</td>
<td>{item.taxType}</td>
<td>{item.totalTax}</td>
<td>{item.totalItemValue}</td>
<td>{item.ledgerName}</td>

</tr>

))}

</tbody>
</table>

{/* ================= TOTAL ================= */}

<div className="row mt-3">

<div className="col-md-3">

<label>Total Amount</label>
<input className="form-control" value={totalBasic}/>

</div>

<div className="col-md-3">

<label>Total Tax</label>
<input className="form-control" value={totalTax}/>

</div>

<div className="col-md-3">

<label>Grand Total</label>
<input className="form-control" value={grandTotal}/>

</div>

</div>

</div>


{/* ================= APPROVE BILL ================= */}

<div className="row mt-4">

<div className="col-md-12 text-center">

<div className="form-check d-inline-block">

<input
type="checkbox"
className="form-check-input"
id="masterBillCheck"
checked={masterBillCheck}
onChange={(e) => handleMasterBillCheck(e.target.checked)}
/>

<label
className="form-check-label fw-bold ms-2"
htmlFor="masterBillCheck"
>
Approve Bill
</label>

</div>

</div>

</div>


{/* ================= SAVE / CANCEL ================= */}

<div className="row mt-3">

<div className="col-md-12 text-end">

<button
className="btn btn-success me-3 fw-bold px-4"
onClick={handleSubmit}
disabled={!masterBillCheck}
>
Save
</button>

<button
className="btn btn-danger fw-bold px-4"
onClick={() => navigate(-1)}
>
Cancel
</button>

</div>

</div>

</>

)}

        </>
      )}
    </div>
  </div>
);
};

export default CheckNonGRN;