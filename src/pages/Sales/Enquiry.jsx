import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import NotCreated from "../../components/NotCreated";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Grid, TextField,Paper  } from "@mui/material";
import Select from "react-select";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_ENDPOINTS } from "../../config/apiconfig";

// const API_BASE_URL ="https://msmeerpsyn9-core.azurewebsites.net/api/SalesEnquiryQuotation";
//  const BASE_URL= "https://localhost:7145/api";

const BASE_URL = "https://localhost:7145/api/SalesEnquiryQuotation";

function Enquiry() {

  const [selectedPage, setSelectedPage] = useState("ExternalEnquiry");

  //---------------- Buyer / Enquiry ----------------
  const [selectedBuyer, setSelectedBuyer] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState("");
  const [buyers] = useState(["Harshada", "Neha", "Mayuri","Shubhangi"]);
  const [enquiries, setEnquiries] = useState([]);
//--------- Peyment Terms
const [paymentTerm, setPaymentTerms] = useState([]);
const [selectedPaymentTerm, setSelectedPaymentTerm] = useState(null);

useEffect(() => {
  axios
    .get(`${BASE_URL}/GetPaymentTerms`)
    .then((res) => {
      console.log("API Response:", res.data);

      const options = res.data.map((item) => ({
        
        value: item.id,          // must match backend JSON
        label: item.paymentTerm, // correct casing
      }));

      setPaymentTerms(options);
    })
    .catch((err) => {
      console.error("Error loading payment terms:", err);
    });
}, []);

//--------- Price Basis
const [priceBasisList, setPriceBasisList] = useState([]);
const [selectedPriceBasis, setSelectedPriceBasis] = useState(null);

useEffect(() => {
  axios.get(`${BASE_URL}/GetPriceList`)
    .then(res => {
      const options = res.data.map(item => ({
        value: item.pId,
        label: item.priceBasis
      }));
      setPriceBasisList(options);
    })
    .catch(err => {
      console.error("Error loading price basis:", err);
    });
}, []);

//--------- UOM
const [uomList, setUomList] = useState([]);
const [selectedUOM, setSelectedUOM] = useState(null);
  useEffect(() => {
    const fetchUOM = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/GetUOMLIST`);
        // Map to { value, label } for react-select
        const options = res.data.map((uom) => ({
          value: uom.uomId,
          label: uom.uomName,
        }));
        setUomList(options);
      } catch (err) {
        console.error("Error loading UOM list:", err);
      }
    };
    fetchUOM();
  }, []);

  //---------------- Get Sales Item List 
    const [itemList, setItemList] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [gradeList, setGradeList] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState(null);

    // Load items
    useEffect(() => {
        axios.get(`${BASE_URL}/GetItemsFromSalesBuyer`)
            .then(res => {
                // Map items to { value, label } format for react-select
                const options = res.data.map(i => ({ value: i.id, label: i.name }));
                setItemList(options);
            })
            .catch(err => console.error("Error loading items:", err));
    }, []);

  //--------- Get Grades by items
  useEffect(() => {
    if (!selectedItem) {
        setGradeList([]);
        setSelectedGrade(null);
        return;
    }

    axios.get(`${BASE_URL}/GetGradeFromItem`, { 
        params: { ItemName: selectedItem.label } 
    })
    .then(res => {
        console.log("Grade API Response:", res.data);

        const grades = res.data.map(g => ({
            value: g.grades,   
            label: g.grades    
        }));

        setGradeList(grades);
    })
    .catch(err => {
        console.error("Error loading grades:", err);
        setGradeList([]);
    });
}, [selectedItem]);

//------------Get item details & buyer details by grade + item 
const [itemDetails, setItemDetails] = useState(null);
const [buyerDetails, setBuyerDetails] = useState(null);

useEffect(() => {
  if (!selectedItem?.label || !selectedGrade?.label) {
    setItemDetails(null);
    setBuyerDetails(null);
    return;
  }

  // 1️ Fetch Item Details
  axios.get(`${BASE_URL}/GetItemDetailsByGrade`, {
    params: {
      ItemName: selectedItem.label,
      Grade: selectedGrade.label
    }
  })
  .then(res => {
    console.log("Item Details API:", res.data);
    setItemDetails(res.data);

    // 2️⃣ Fetch Buyer Details using Company_Name
    if (res.data?.company_Name) {
      return axios.get(`${BASE_URL}/GetBuyerDetailsByGrade`, {
        params: {
          Company_Name: res.data.company_Name
        }
      });
    } else {
      throw new Error("Company_Name not found");
    }
  })
  .then(res => {
    console.log("Buyer Details API:", res.data);
    setBuyerDetails(res.data);
  })
  .catch(err => {
    console.error("Error fetching data:", err);
    setItemDetails(null);
    setBuyerDetails(null);
  });

}, [selectedItem, selectedGrade]);

 const [enquiryMethod, setEnquiryMethod] = useState("");
 const [enquiryNo, setEnquiryNo] = useState("");

 //------------Add Product in table

// Req Qty & Req By
const [reqQty, setReqQty] = useState("");
const [reqBy, setReqBy] = useState("");

// Table rows
const [productList, setProductList] = useState([]);
const handleAddProduct = () => {
  if (!selectedItem || !selectedGrade || !itemDetails || !reqQty || !reqBy) {
    alert("Please fill all fields before adding product.");
    return;
  }

  const newRow = {
    itemName: selectedItem.label,
    grade: selectedGrade.label,
    itemCode: itemDetails.itemCode,
    hsCode: itemDetails.hS_Code,
    uom: itemDetails.uom,
    currency: itemDetails.currencyCode,
    reqQty: reqQty,
    reqBy: reqBy,
  };

  setProductList([...productList, newRow]);

  // Clear fields
  // setSelectedItem(null);
  // setSelectedGrade(null);
  setItemDetails(null);
  setReqQty("");
  setReqBy("");
};

const [contactPerson, setContactPerson] = useState(buyerDetails?.contactPerson || "");
const [contactNo, setContactNo] = useState(buyerDetails?.contact || "");
useEffect(() => {
  if (buyerDetails) {
    setContactPerson(buyerDetails.contactPerson || "");
    setContactNo(buyerDetails.contact || "");
  }
}, [buyerDetails]);

//---------- Add Vendor in table
const [vendorList, setVendorList] = useState([]);
const handleAddVendor = () => {
  // Create new vendor row
  const newVendor = {
    buyerName: buyerDetails?.company_Name || "",
    vendorCode: buyerDetails?.vendor_Codes || "",
    country: buyerDetails?.countryENQ || "",
    state: buyerDetails?.state || "",
    city: buyerDetails?.cityENQ || "",
    email: buyerDetails?.emailENQ || "",
    contactPerson,
    contactNo,
    paymentTerm: selectedPaymentTerm?.label || "",
    priceBasis: selectedPriceBasis?.label || "",
    enquiryMethod,
    enquiryNo
  };
  setVendorList([...vendorList, newVendor]);

  // ✅ Clear fields 
  setBuyerDetails({
    vendor_Codes: "",
    countryENQ: "",
    state: "",
    cityENQ: "",
    emailENQ: ""
  });
  setContactPerson("");
  setContactNo("");
  setSelectedPaymentTerm(null);
  setSelectedPriceBasis(null);
  setEnquiryMethod("");
  setEnquiryNo("");
};

//--------------------------- SUBMIT -----------------------


  //---------------- On Call Enquiry ----------------
  const [formData, setFormData] = useState({
    companyName: "",
    gstNo: "",
    contactPerson: "",
    contactNo: "",
    email: "",
    itemDetail: "",
    uom: "",
    requiredQty: "",
    enqValidTill: "",
});

  const [items, setItems] = useState([]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addItem = () => {
    if (!formData.itemDetail || !formData.uom || !formData.requiredQty) {
      alert("Please fill item details");
      return;
    }

    setItems([...items, formData]);
    setFormData({
      ...formData,
      itemDetail: "",
      uom: "",
      requiredQty: "",
      enqValidTill: "",
    });
  };

  const handleSubmit = () => {
    if (items.length === 0) {
      alert("Add at least one item");
      return;
    }
    console.log("Submitting:", items);
    alert("On Call Enquiry Submitted");
    setItems([]);
    setFormData({
      companyName: "",
      gstNo: "",
      contactPerson: "",
      contactNo: "",
      email: "",
      itemDetail: "",
      uom: "",
      requiredQty: "",
      enqValidTill: "",
    });
  };

  //---------------- Standard Report ----------------
  const [reportData, setReportData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (selectedBuyer) {
      setEnquiries(["ENQ001", "ENQ002", "ENQ003"]);
      setSelectedEnquiry("");
    } else {
      setEnquiries([]);
      setSelectedEnquiry("");
    }
  }, [selectedBuyer]);

  const handleStandardReportSearch = () => {
    if (selectedBuyer && selectedEnquiry) {
      const data = [
        {
          itemName: "Demo 4",
          itemCode: "I001",
          grade: "A",
          uom: "KG",
          reqQty: 100,
          currency: "INR",
          reqBy: "2026-03-15",
        },
        {
          itemName: "Demo 3",
          itemCode: "I002",
          grade: "B",
          uom: "KG",
          reqQty: 200,
          currency: "INR",
          reqBy: "2026-03-20",
        },
         {
          itemName: "Demo 2",
          itemCode: "I002",
          grade: "B",
          uom: "KG",
          reqQty: 200,
          currency: "INR",
          reqBy: "2026-03-20",
        },
         {
          itemName: "Demo 1",
          itemCode: "I002",
          grade: "B",
          uom: "KG",
          reqQty: 200,
          currency: "INR",
          reqBy: "2026-03-20",
        },
      ];
      setReportData(data);
      setShowTable(true);
      return;
    }

    if (startDate && endDate) {
      const data = [
        {
          itemName: "Item C",
          itemCode: "I003",
          grade: "A",
          uom: "KG",
          reqQty: 150,
          currency: "INR",
          reqBy: "2026-03-16",
        },
      ];
      setReportData(data);
      setShowTable(true);
      return;
    }
    alert("Select Buyer + Enquiry OR Date Range");
  };

  // Edit mode states
const [editData, setEditData] = useState(null);
const [isEditMode, setIsEditMode] = useState(false);
const [activeTab, setActiveTab] = useState("active"); 

const handleEdit = (row) => {
  setEditData(row);
  setIsEditMode(true);
  setSelectedPage("ExternalEnquiry");
};

const handleDelete = (id) => {
  const updatedData = reportData.map((item) =>
    item.id === id
      ? { ...item, status: "inactive" }
      : item
  );
  setReportData(updatedData);
};

const handleRestore = (id) => {
  const updatedData = reportData.map((item) =>
    item.id === id
      ? { ...item, status: "active" }
      : item
  );

  setReportData(updatedData);
};

  //---------------- Excel Export ----------------
  const handleExport = () => {
    if (reportData.length === 0) {
      alert("No data to export");
      return;
    }
    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Standard Report");

    XLSX.writeFile(
      wb,
      `Standard_Report_${selectedBuyer || "Date"}_${selectedEnquiry || "Range"}.xlsx`
    );
  };

const [searchTerm, setSearchTerm] = useState("");
const [rowsPerPage, setRowsPerPage] = useState(5);
const [currentPage, setCurrentPage] = useState(1);

const filteredData = reportData.filter((row) =>
  Object.values(row).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
);

const indexOfLast = rowsPerPage === "All" ? filteredData.length : currentPage * rowsPerPage;
const indexOfFirst = rowsPerPage === "All" ? 0 : indexOfLast - rowsPerPage;

const currentRows =
  rowsPerPage === "All"
    ? filteredData
    : filteredData.slice(indexOfFirst, indexOfLast);

const totalPages =
  rowsPerPage === "All" ? 1 : Math.ceil(filteredData.length / rowsPerPage);

//top section - company details
const disabledFieldStyle = {
  "& .MuiInputBase-input.Mui-disabled": {
    WebkitTextFillColor: "#333232",
    fontWeight: 600
  }
};
const fields = [
  { label: "Company Name", value: "SWAMI SAMARTH POLYFILM INDUSTRIES PVT LTD", md: 6 },
  { label: "Company Address", value: "GAT NO 226, AT POST CHIMBALI, TAL KHED", md: 4 },
  { label: "Emp Code", value: " ", md: 1 },
  { label: "Email", value: " ", md: 1 }
];

  return (
    <div className="container-fluid py-4" style={{ minHeight: "80vh" }}>
      {/* Page Selector */}
      <div className="d-flex flex-wrap gap-3 mb-4">
        {["ExternalEnquiry","onCallEnquiry","StandardReport","ExternalEnqStatus"
            ].map((page) => {
                const labels = {
                    onCallEnquiry: "On Call Enquiry",
                    ExternalEnquiry: "Create Enquiry",
                    StandardReport: " View / Standard Report",
                    ExternalEnqStatus: "Enquiry Status"
        };

  return (
    <div
        key={page}
        className={`form-check form-check-inline p-3  shadow-sm transition-all ${
            selectedPage === page ? "border-primary bg-white shadow-lg" : "border-secondary bg-light"
        }`}
        style={{
            cursor: "pointer",
            minWidth: "180px",
            transition: "all 0.3s ease",
            borderRadius:"30px"
        }}
        onClick={() => setSelectedPage(page)}
        >
        <input
            className="form-check-input"
            type="radio"
            name="configTab"
            value={page}
            checked={selectedPage === page}
            onChange={() => setSelectedPage(page)}
            id={page}
        />
        <label
            className="form-check-label fw-bold"
            htmlFor={page}
            style={{ marginLeft: "8px" }}
        >
            {labels[page] || "Unknown"}
        </label>
        </div>
    );
  })}
</div>

  {/* Page Content */}
<div>
  {/* ---------- External Enquiry ---------- */}
  {selectedPage === "ExternalEnquiry" ? (
    <div className="card p-4 shadow-lg mb-4 w-100 rounded-4" style={{ textTransform: "uppercase" }}>
      <h2 className="text-center mb-4">EXTERNAL ENQUIRY</h2>

      <Paper
        elevation={2}
        sx={{
          fontSize: "16px",
          color:"darkviolet",
          p: 3,
          borderRadius: "12px",
          mb: 2,
          backgroundColor: "ghostwhite"
        }}>

        <Grid container spacing={2} alignItems="center">
          {fields.map((field, index) => (
            <Grid item xs={12} md={field.md} key={index}>
              <TextField
                label={field.label}
                value={field.value}
                fullWidth
                disabled
                size="small"
                sx={disabledFieldStyle}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>
<br/>

      {/* MAIN ACCORDION */}
      <div className="accordion" id="enquiryAccordion">

        {/* ---------- ITEM DETAILS ---------- */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingItem">
            <button
              className="accordion-button collapsed"
              style={{backgroundColor:"lightblue"}}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseItems"
            >
              <b style={{ textTransform: "uppercase" }}>Item Details</b>
            </button>
          </h2>

          <div
            id="collapseItems"
            className="accordion-collapse collapse"
            data-bs-parent="#enquiryAccordion"
          >
      <div className="accordion-body">
        <div className="row g-3 mb-3">
            <div className="col-md-3 mb-3">
                  <label className="form-label">Item Name</label>
                  <Select
                    options={itemList}
                    value={selectedItem}
                    onChange={setSelectedItem}
                    placeholder="Select Item"
                    classNamePrefix="react-select"
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <label className="form-label">Grade</label>
                  <Select
                    options={gradeList}
                    value={selectedGrade}
                    onChange={setSelectedGrade}
                    placeholder="Select Grade"
                    isDisabled={!selectedItem}
                    classNamePrefix="react-select"
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 })   }}
                  />
                </div>

                 <div className="col-md-3">
                    <label>Item Code</label>
                    <input
                    style={{ backgroundColor:"whitesmoke"}}
                      className="form-control"
                      value={itemDetails?.itemCode || ""}
                      readOnly
                    />
                  </div>

                  <div className="col-md-3">
                    <label>HS Code</label>
                    <input
                    style={{ backgroundColor:"whitesmoke"}}
                      className="form-control"
                      value={itemDetails?.hS_Code || ""}  
                      readOnly
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">UOM</label>
                    <input
                    style={{ backgroundColor:"whitesmoke"}}
                      className="form-control"
                      value={itemDetails?.uom || ""}
                      readOnly
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Currency</label>
                    <input
                    style={{ backgroundColor:"whitesmoke"}}
                      className="form-control"
                      value={itemDetails?.currencyCode || ""}
                      readOnly
                    />
                  </div>
                 <div className="col-md-3">
                    <label>Req Qty</label>
                    <input
                      type="number"
                      className="form-control"
                      value={reqQty}
                      onChange={(e) => setReqQty(e.target.value)}
                    />
                  </div>

                  <div className="col-md-3">
                    <label>Req By</label>
                    <input
                      type="date"
                      className="form-control"
                      value={reqBy}
                      onChange={(e) => setReqBy(e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <button
                      className="btn btn-primary mt-2"
                      style={{ marginLeft: "178%", width: "56%", height: "38px", borderRadius: "8px" }}
                      onClick={handleAddProduct}
                    >
                      ADD PRODUCT
                    </button>
                  </div>
              </div>

                <div className="table-responsive mt-4" style={{ maxHeight:"300px", overflowY:"auto",display: "block"}}>
                  <table className="table table-bordered">
                    <thead className="table-primary" 
                    style={{
                            position: "sticky",
                            top: 0,
                            backgroundColor: "#cfe2ff", 
                            zIndex: 1
                          }}>
                      <tr>
                        <th>Item Name</th>
                        <th>Grade</th>
                        <th>Item Code</th>
                        <th>HS Code</th>
                        <th>UOM</th>
                        <th>Currency</th>
                        <th>Req Qty</th>
                        <th>Req By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productList.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="text-center">
                            No Products Added
                          </td>
                        </tr>
                      ) : (
                        productList.map((row, index) => (
                          <tr key={index}>
                            <td>{row.itemName}</td>
                            <td>{row.grade}</td>
                            <td>{row.itemCode}</td>
                            <td>{row.hsCode}</td>
                            <td>{row.uom}</td>
                            <td>{row.currency}</td>
                            <td>{row.reqQty}</td>
                            <td>{row.reqBy}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
            </div>
          </div>
        </div>
      </div>
 <br />
        {/* ---------- BUYER DETAILS ---------- */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingBuyer">
            <button
              className="accordion-button collapsed"
               style={{backgroundColor:"lightblue"}}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseBuyer"
            >
              <b style={{ textTransform: "uppercase" }}>Buyer Details</b>
            </button>
          </h2>

          <div id="collapseBuyer" className="accordion-collapse collapse" data-bs-parent="#enquiryAccordion">
            <div className="accordion-body" style={{overflowY:"auto"}}>
              <div className="row g-3 mb-3">
                                <div className="col-md-3">
                                  <label>Buyer Name</label>
                                  <input
                                  style={{ backgroundColor:"whitesmoke"}}
                                    className="form-control"
                                    value={buyerDetails?.company_Name || ""}
                                    readOnly
                                  />
                                </div>
                                <div className="col-md-3">
                                  <label>Vendor Code</label>
                                  <input
                                  style={{ backgroundColor:"whitesmoke"}}
                                    className="form-control"
                                    value={buyerDetails?.vendor_Codes || ""}
                                    readOnly
                                  />
                                </div>
                                <div className="col-md-3">
                                  <label>Country</label>
                                  <input
                                  style={{ backgroundColor:"whitesmoke"}}
                                    className="form-control"
                                    value={buyerDetails?.countryENQ || ""}
                                    readOnly
                                  />
                                </div>

                                <div className="col-md-3">
                                  <label>State</label>
                                  <input
                                  style={{ backgroundColor:"whitesmoke"}}
                                    className="form-control"
                                    value={buyerDetails?.state || ""}
                                    readOnly
                                  />
                                </div>
                               <div className="col-md-3">
                                  <label>City</label>
                                  <input
                                  style={{ backgroundColor:"whitesmoke"}}
                                    className="form-control"
                                    value={buyerDetails?.cityENQ || ""}
                                    readOnly
                                  />
                                </div>
                                <div className="col-md-3">
                                  <label>Email</label>
                                  <input
                                   style={{ backgroundColor:"whitesmoke"}}
                                    className="form-control"
                                    value={buyerDetails?.emailENQ || ""}
                                    readOnly
                                  />
                                </div>
                                <div className="col-md-3">
                                  <label>Contact Person</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={contactPerson}
                                    onChange={(e) => setContactPerson(e.target.value)}
                                  />
                                </div>

                                <div className="col-md-3">
                                  <label>Contact No</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={contactNo}
                                    onChange={(e) => setContactNo(e.target.value)}
                                  />
                                </div>
                                <div className="col-md-3">
                                  <label>Payment Terms</label>
                                  <Select
                                      options={paymentTerm}
                                      value={selectedPaymentTerm}
                                      onChange={setSelectedPaymentTerm}
                                      placeholder="Select Payment Term"
                                      isSearchable
                                      classNamePrefix="react-select"
                                       menuPortalTarget={document.body}
                                      menuPosition="fixed"
                                      styles={{
                                        menuPortal: (base) => ({ ...base, zIndex: 9999 })
                                      }}
                                    />
                                  </div>
                                <div className="col-md-3">
                                  <label className="form-label">Price Basis</label>
                                  <Select
                                    options={priceBasisList}
                                    value={selectedPriceBasis}
                                    onChange={(selected) => setSelectedPriceBasis(selected)}
                                    placeholder="Select Price Basis"
                                    isSearchable
                                    classNamePrefix="react-select"
                                    menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                    styles={{
                                      menuPortal: (base) => ({ ...base, zIndex: 9999 })
                                    }}
                                  />
                                </div>
                                <div className="col-md-3">
                                  <label>Enquiry Method</label>
                                  <select
                                    className="form-control"
                                    value={enquiryMethod}
                                    onChange={(e) => setEnquiryMethod(e.target.value)}
                                  >
                                    <option value="">Select Method</option>
                                    <option value="phone">BY PHONE</option>
                                    <option value="email">BY EMAIL</option>
                                    <option value="fill">FILL ENQUIRY NO.</option>
                                  </select>

                                  {enquiryMethod === "fill" && (
                                    <div
                                      className="mt-2 p-2"
                                      style={{
                                        backgroundColor: "#5fe8a8",
                                        border: "1px solid #7667e6",
                                        borderRadius: "6px",
                                      }}
                                    >
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Enquiry No"
                                        value={enquiryNo}
                                        onChange={(e) => setEnquiryNo(e.target.value)}
                                        style={{ backgroundColor: "ghostwhite" }}
                                      />
                                    </div>
                                  )}
                                </div>
                                <div className="col-md-3">
                                    <label>Enquiry Validity</label>
                                    <input type="date" className="form-control" />
                                </div>
                                <div className="p-3 col-md-3">
                                  <button
                                    className="btn btn-primary"
                                    style={{ marginLeft:"178%", width: "56%", height:"38px", borderRadius:"8px" }}
                                    onClick={ handleAddVendor } >
                                    ADD VENDOR
                                  </button>
                                </div>           
              </div>           

                <div className="table-responsive mt-4" style={{ maxHeight:"300px", overflowY:"auto"}}>
                  <table className="table table-bordered">
                    <thead className="table-primary">
                      <tr>
                        <th>Buyer Name</th>
                        <th>Vendor Code</th>
                        <th>Country</th>
                        <th>State</th>
                        <th>City</th>
                        <th>Email</th>
                        <th>Contact Person</th>
                        <th>Contact No</th>
                        <th>Payment Term</th>
                        <th>Price Basis</th>
                        <th>Enquiry Method</th>
                        <th>Enquiry No</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendorList.map((v, idx) => (
                        <tr key={idx}>
                          <td>{v.buyerName}</td>
                          <td>{v.vendorCode}</td>
                          <td>{v.country}</td>
                          <td>{v.state}</td>
                          <td>{v.city}</td>
                          <td>{v.email}</td>
                          <td>{v.contactPerson}</td>
                          <td>{v.contactNo}</td>
                          <td>{v.paymentTerm}</td>
                          <td>{v.priceBasis}</td>
                          <td>{v.enquiryMethod}</td>
                          <td>{v.enquiryNo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>      
            </div>
        </div>
    </div>
    <br/>
    <div className="text-center mt-3">
                <button className="btn btn-primary px-4">
                  Submit Enquiry
                </button>
              </div>
          </div>
      </div>

  ) : selectedPage === "onCallEnquiry" ? (

        <div className="card p-4 shadow-lg border-0 rounded-4" style={{ background: "#f8f9fa" }}>
      <h4 className="text-center mb-4" style={{ color: "black", fontWeight: 700 ,fontSize:"20px"}}>
        ON CALL ENQUIRY
      </h4>



{/* Company Info */}
<div className="row g-3 mb-4">
  {/* Enquiry No */}
<div className="col-md-3 mb-3">
  <label className="form-label text-primary fw-semibold">Enquiry No</label>
  <input
    className="form-control shadow-sm"
    style={{ backgroundColor: "whitesmoke", borderColor: "#0d6efd" }}
    name="enquiryNo"
    value={formData.enquiryNo || "TELEPHONE ENQUIRY"}
    readOnly
  />
</div>
  <div className="col-md-3">
    <label className="form-label text-primary fw-semibold">Company Name</label>
    <input
      className="form-control shadow-sm"
      style={{ borderColor: "#0d6efd" }}
      name="companyName"
      value={formData.companyName || ""}
      onChange={handleChange}
    />
  </div>

  <div className="col-md-3">
    <label className="form-label text-primary fw-semibold">GST No</label>
    <input
      className="form-control shadow-sm"
      style={{ borderColor: "#0d6efd" }}
      name="gstNo"
      value={formData.gstNo || ""}
      onChange={handleChange}
    />
  </div>

  <div className="col-md-3">
    <label className="form-label text-primary fw-semibold">Contact Person</label>
    <input
      className="form-control shadow-sm"
      style={{ borderColor: "#0d6efd" }}
      name="contactPerson"
      value={formData.contactPerson || ""}
      onChange={handleChange}
    />
  </div>

  <div className="col-md-3">
    <label className="form-label text-primary fw-semibold">Contact No</label>
    <input
      className="form-control shadow-sm"
      style={{ borderColor: "#0d6efd" }}
      name="contactNo"
      value={formData.contactNo || ""}
      onChange={handleChange}
    />
  </div>
  <div className="col-md-3">
    <label className="form-label text-primary fw-semibold">Email</label>
    <input
      className="form-control shadow-sm"
      style={{ borderColor: "#0d6efd" }}
      name="email"
      value={formData.email || ""}
      onChange={handleChange}
    />
  </div>

  <div className="col-md-3">
    <label className="form-label text-primary fw-semibold">Item Detail</label>
    <input
      className="form-control shadow-sm"
      style={{ borderColor: "#0d6efd" }}
      name="itemDetail"
      value={formData.itemDetail || ""}
      onChange={handleChange}
    />
  </div>

    <div className="col-md-3">
      <label className="form-label text-primary fw-semibold">Unit Of Measurement</label>
      <Select
        options={uomList}
        value={selectedUOM}
        onChange={setSelectedUOM} // selected option
        placeholder="Select UOM"
        isSearchable={true} // makes it searchable
      />
    </div>

  <div className="col-md-3">
    <label className="form-label text-primary fw-semibold">Required Qty</label>
    <input
      className="form-control shadow-sm"
      style={{ borderColor: "#0d6efd" }}
      name="reqQty"
      value={formData.reqQty || ""}
      onChange={handleChange}
      type="number"
    />
  </div>
  <div className="col-md-3 d-flex align-items-end">
          <button
            className="btn btn-primary d-flex align-items-center shadow-sm"
            onClick={addItem}
          >
            <i className="bi bi-plus-circle me-2"></i> Add Item
          </button>
        </div>
</div>
        

      {/* Items Table */}
      {items.length > 0 && (
        <div className="table-responsive mb-4">
          <table className="table table-bordered table-striped table-hover align-middle shadow-sm">
            <thead className="table-primary">
              <tr>
                <th>Item Detail</th>
                <th>UOM</th>
                <th>Required Qty</th>
                <th>Enquiry Valid Till</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{item.itemDetail}</td>
                  <td>{item.uom}</td>
                  <td>{item.requiredQty}</td>
                  <td>{item.enqValidTill}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Submit */}
      <div className="text-center">
        <button
          className="btn btn-primary px-5 py-2 shadow-sm"
          style={{ fontWeight: 600 }}
          onClick={handleSubmit}
        >
          Submit Enquiry
        </button>
      </div>
    </div>
/* ------------------ Amend Enquiry / Standard Report ------------------ */
) : selectedPage === "StandardReport" ? (

<div className="container-fluid shadow-lg border-0 rounded-4 p-5" style={{ background: "#f1f8ff" }}>

  {/* Filters Section */}
  <div
    className="card shadow-sm border-0 mb-4"
    style={{ borderRadius: "14px", background: "#f8fbff" }}
  >
    <div className="card-body">
      <div className="row g-3 align-items-end">

        {/* Buyer */}
        <div className="col-lg-3 col-md-6">
          <label className="fw-semibold text-primary mb-1">
            <i className="fa fa-user me-1"></i> Buyer Name
          </label>
          <select
            className="form-control shadow-sm"
            value={selectedBuyer}
            onChange={(e) => setSelectedBuyer(e.target.value)}
            style={{ borderRadius: "10px", borderColor: "#0d6efd" }}
          >
            <option value="">Select Buyer</option>
            {buyers.map((b, idx) => (
              <option key={idx} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Enquiry */}
        <div className="col-lg-3 col-md-6">
          <label className="fw-semibold text-primary mb-1">
            <i className="fa fa-file-text me-1"></i> Enquiry No
          </label>
          <select
            className="form-control shadow-sm"
            value={selectedEnquiry}
            onChange={(e) => setSelectedEnquiry(e.target.value)}
            disabled={!selectedBuyer}
            style={{ borderRadius: "10px", borderColor: "#0d6efd" }}
          >
            <option value="">Select Enquiry</option>
            {enquiries.map((enq, idx) => (
              <option key={idx} value={enq}>{enq}</option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div className="col-lg-2 col-md-6">
          <label className="fw-semibold text-primary mb-1">
            <i className="fa fa-calendar me-1"></i> Start Date
          </label>
          <input
            type="date"
            className="form-control shadow-sm"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ borderRadius: "10px", borderColor: "#0d6efd" }}
          />
        </div>

        {/* End Date */}
        <div className="col-lg-2 col-md-6">
          <label className="fw-semibold text-primary mb-1">
            <i className="fa fa-calendar me-1"></i> End Date
          </label>
          <input
            type="date"
            className="form-control shadow-sm"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ borderRadius: "10px", borderColor: "#0d6efd" }}
          />
        </div>

        {/* Search Button */}
        <div className="col-lg-2 col-md-12">
          <button
            className="btn btn-primary w-100 shadow-sm"
            style={{
              height: "42px",
              borderRadius: "10px",
              fontWeight: "600",
              letterSpacing: "0.5px"
            }}
            onClick={handleStandardReportSearch}
          >
            <i className="fa fa-search me-2"></i>Search
          </button>
        </div>

      </div>
    </div>
  </div>

  <div className="table-section mt-4">

<div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
 <div className="d-flex align-items-center gap-3 mb-2 mb-md-0">
  <div className="form-check">
    <input
      className="form-check-input"
      type="radio"
      name="statusFilter"
      id="activeRadio"
      value="active"
      checked={activeTab === "active"}
      onChange={() => setActiveTab("active")}
    />
    <label className="form-check-label fw-semibold" htmlFor="activeRadio">
      Active
    </label>
  </div>

  <div className="form-check">
    <input
      className="form-check-input"
      type="radio"
      name="statusFilter"
      id="inactiveRadio"
      value="inactive"
      checked={activeTab === "inactive"}
      onChange={() => setActiveTab("inactive")}
    />
    <label className="form-check-label fw-semibold " htmlFor="inactiveRadio">
      Inactive
    </label>
  </div>
</div>

  {/* Right Section */}
  <div className="d-flex align-items-center gap-2">

    <input
      type="text"
      className="form-control form-control-sm"
      placeholder="Search..."
      style={{ width: "200px" }}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />

    <select
      className="form-select form-select-sm"
      style={{ width: "140px" }}
      value={rowsPerPage}
      onChange={(e) => {
        setRowsPerPage(e.target.value === "All" ? "All" : Number(e.target.value));
        setCurrentPage(1);
      }}
    >
      <option value="5">Show 5</option>
      <option value="10">Show 10</option>
      <option value="20">Show 20</option>
      <option value="All">Show All</option>
    </select>

  </div>

</div>

{/* Table */}

<div
className="table-responsive shadow-sm rounded"
style={{ maxHeight: "400px", overflowY: "auto" }}
>
<table className="table table-striped table-hover align-middle">
<thead className="table-primary text-white">
<tr>
<th>Item Name</th>
<th>Item Code</th>
<th>Grade</th>
<th>UOM</th>
<th>Req Qty</th>
<th>Currency</th>
<th>Req By</th>
<th>Action</th>

</tr>

</thead>

<tbody>

{currentRows.length > 0 ? (

currentRows.map((item, idx) => (

<tr key={idx}>

<td className="fw-bold text-primary">{item.itemName}</td>
<td>{item.itemCode}</td>
<td>{item.grade}</td>
<td>{item.uom}</td>
<td>{item.reqQty}</td>
<td>{item.currency}</td>
<td>{item.reqBy}</td>

<td>

<button
className="btn btn-sm btn-primary me-2"
onClick={()=>handleEdit(item)}
>
<i className="bi bi-pencil-square"></i>
</button>

{activeTab === "active" ? (

<button
className="btn btn-sm btn-danger"
onClick={()=>handleDelete(item.id)}
>
<i className="bi bi-trash"></i>
</button>

) : (

<button
className="btn btn-sm btn-success"
onClick={()=>handleRestore(item.id)}
>
<i className="bi bi-arrow-counterclockwise"></i>
</button>

)}

</td>

</tr>

))

) : (

<tr>

<td colSpan="8" className="text-center text-muted">
No Data Found
</td>

</tr>

)}

</tbody>

</table>

</div>


{/* Pagination */}

{rowsPerPage !== "All" && totalPages > 1 && (

<div className="d-flex justify-content-center mt-3 gap-2">

<button
className="btn btn-outline-primary btn-sm"
disabled={currentPage === 1}
onClick={()=>setCurrentPage(currentPage-1)}
>
Prev
</button>

{[...Array(totalPages)].map((_,i)=>(

<button
key={i}
className={`btn btn-sm ${
currentPage === i+1 ? "btn-primary":"btn-outline-primary"
}`}
onClick={()=>setCurrentPage(i+1)}
>
{i+1}
</button>

))}

<button
className="btn btn-outline-primary btn-sm"
disabled={currentPage === totalPages}
onClick={()=>setCurrentPage(currentPage+1)}
>
Next
</button>

</div>

)}

</div>

</div>

) : selectedPage === "ExternalEnqStatus" ? (

  <NotCreated />

) : null}

    </div>
  </div> 
);
}

export default Enquiry;