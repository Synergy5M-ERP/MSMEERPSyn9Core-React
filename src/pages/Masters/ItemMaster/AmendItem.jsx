


import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Search, Edit2, Save, Eye, Delete } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';


// API base URL
const API_BASE_URL = "http://localhost:49980/Item";

// Schema for the initial search
const searchSchema = yup.object({
  searchTerm: yup.string().required("Item Code or Name is required"),
  itemName: yup.string().required("Please select an item name"),
  grade: yup.string().required("Please select a grade")
});

// Expanded schema for the detailed amendment form
const amendSchema = yup.object({
  Company_Name: yup.string().required("Company is required"),
  Industry: yup.string().required("Industry is required"),
  ItemCategory: yup.string().required("Category is required"),
  Sub_Category: yup.string().required("Sub-Category is required"),
  Item_Name: yup.string().required("Item Name is required"),
  Grade: yup.string().required("Grade is required"),
  Unit_Of_Measurement: yup.string().required("UOM is required"),
  HS_Code: yup.string().matches(/^\d{8}$/, "HS Code must be exactly 8 digits").required("HS Code is required"),
  Currency: yup.string().required("Currency is required"),
  Average_Price: yup.number().typeError("Price must be a number").positive("Price must be positive").nullable(),
  Safe_Stock: yup.number().typeError("Stock must be a number").min(0, "Cannot be negative").nullable(),
  MOQ: yup.number().typeError("MOQ must be a number").min(1, "MOQ must be at least 1").nullable(),
  Primary_Alternate: yup.string().required("Primary/Alternate selection is required"),
  TC_COA: yup.string().required("TC/COA selection is required"),
});

// A helper function to safely fetch and parse JSON, preventing crashes on empty responses.
const safeFetchJson = async (url, options) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Network request failed with status ${response.status}`);
  }
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : null; // Return null if body is empty
  } catch (e) {
    console.error("Failed to parse JSON response:", text);
    throw new Error("Received an invalid response from the server.");
  }
};


function AmendItem() {
  // --- STATE MANAGEMENT ---
  const [itemNames, setItemNames] = useState([]);
  const [grades, setGrades] = useState([]);
  const [itemData, setItemData] = useState(null);
  const [showAmendForm, setShowAmendForm] = useState(false);
  const [companyName, setCompanyName] = useState('');

  // States for loading indicators
  const [isLoading, setIsLoading] = useState(false);
  const [isAmending, setIsAmending] = useState(false);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  // State for all dropdown options
  const [dropdownData, setDropdownData] = useState({
    companies: [],
    industries: [],
    categories: [],
    subcategories: [],
    currencies: [],
    uoms: [],
    items: []
  });

  // --- REACT HOOK FORM INSTANCES ---

  // Form for the initial search
  const {
    register: registerSearch,
    handleSubmit: handleSearchSubmit,
    watch: watchSearch,
    setValue: setSearchValue,
    formState: { errors: searchErrors }
  } = useForm({
    resolver: yupResolver(searchSchema)
  });

  // Form for the detailed amendment modal
  const {
    register: registerAmend,
    handleSubmit: handleAmendSubmit,
    reset: resetAmendForm,
    watch: watchAmend,
    setValue: setAmendValue,
    formState: { errors: amendErrors }
  } = useForm({
    resolver: yupResolver(amendSchema),
    defaultValues: {
      Company_Name: '',
      Source: '',
      Continent: '',
      Country: '',
      State: '',
      City: '',
      Industry: '',
      ItemCategory: '',
      Sub_Category: '',
      Item_Name: '',
      Grade: '',
      Unit_Of_Measurement: '',
      HS_Code: '',
      Currency: 'INR',
      Average_Price: '',
      Safe_Stock: '',
      MOQ: '',
      Primary_Alternate: 'PRIMARY',
      TC_COA: 'Required'
    }
  });

  const search_Term = watchSearch("searchTerm");
  const search_ItemName = watchSearch("itemName");

  const amend_Industry = watchAmend("Industry");
  const amend_ItemCategory = watchAmend("ItemCategory");
  const amend_SubCategory = watchAmend("Sub_Category");
  const amend_CompanyName = watchAmend("Company_Name");

  // --- DATA FETCHING & SIDE EFFECTS ---

  // Load initial dropdown data on component mount
  useEffect(() => {
    const loadInitialDropdowns = async () => {
      setLoadingDropdowns(true);
      try {
        const [companies, industries, currencies, uoms, items] = await Promise.all([
          safeFetchJson(`${API_BASE_URL}/GetCompanyListApi`),
          safeFetchJson(`${API_BASE_URL}/GetIndustriesApi`),
          safeFetchJson(`${API_BASE_URL}/GetCurrencyListApi`),
          safeFetchJson(`${API_BASE_URL}/GetUOMListApi`),
          safeFetchJson(`${API_BASE_URL}/GetItemName`)
        ]);

        setDropdownData(prev => ({
          ...prev,
          companies: companies?.success ? companies.data : [],
          industries: industries?.success ? industries.data : [],
          currencies: currencies?.success ? currencies.data : [],
          uoms: uoms?.success ? uoms.data : [],
          items: items?.success ? items.data : []

        }));
      } catch (error) {
        toast.error(error.message || 'Failed to load initial form data.');
      } finally {
        setLoadingDropdowns(false);
      }
    };
    loadInitialDropdowns();
  }, []);

  // Fetch item names for search dropdown
  useEffect(() => {
    if (search_Term && search_Term.trim().length >= 1) {
      const debounceTimer = setTimeout(async () => {
        setIsLoading(true);
        try {
          const data = await safeFetchJson(`${API_BASE_URL}/GetItemNamesByTerm?term=${encodeURIComponent(search_Term)}`);
          if (data?.success && data.itemNames) {
            setItemNames(data.itemNames);
            if (data.itemNames.length === 1) setSearchValue("itemName", data.itemNames[0].value);
          } else {
            setItemNames([]);
          }
        } catch (error) {
          toast.error(error.message || "Failed to fetch item names.");
        } finally {
          setIsLoading(false);
        }
      }, 300);
      return () => clearTimeout(debounceTimer);
    } else {
      setItemNames([]);
    }
  }, [search_Term, setSearchValue]);

  // Fetch grades for search dropdown
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const data = await safeFetchJson(`${API_BASE_URL}/GetGradesByItemName?itemName=${encodeURIComponent(search_ItemName)}`);
        if (data?.success && data.grades) {
          setGrades(data.grades);
          if (data.grades.length === 1) setSearchValue("grade", data.grades[0].value);
        } else {
          setGrades([]);
        }
      } catch (error) {
        setGrades([]);
      }
    };

    if (search_ItemName) {
      fetchGrades();
    } else {
      setGrades([]);
    }
  }, [search_ItemName, setSearchValue]);

  // --- CASCADING DROPDOWN LOGIC FOR AMEND FORM ---

  // Fetch company details when company name changes in amend form
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const data = await safeFetchJson(`${API_BASE_URL}/GetCompanyDetails?search=${encodeURIComponent(amend_CompanyName)}`);
        if (data && data.Source !== undefined) {
          setAmendValue("Source", data.Source || '');
          setAmendValue("Continent", data.Continent || '');
          setAmendValue("Country", data.Country || '');
          setAmendValue("State", data.State || '');
          setAmendValue("City", data.City || '');
        }
      } catch (error) {
        // Silently fail is ok for this optional data
      }
    };

    if (amend_CompanyName) {
      fetchCompanyDetails();
    }
  }, [amend_CompanyName, setAmendValue]);

  // Fetch categories when industry changes in amend form
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await safeFetchJson(`${API_BASE_URL}/GetCategoriesApi?industry=${encodeURIComponent(amend_Industry)}`);
        if (result?.success) {
          setDropdownData(prev => ({ ...prev, categories: result.data }));
        } else {
          setDropdownData(prev => ({ ...prev, categories: [] }));
        }
      } catch (error) {
        setDropdownData(prev => ({ ...prev, categories: [] }));
      }
    };

    if (amend_Industry) {
      fetchCategories();
    } else {
      setDropdownData(prev => ({ ...prev, categories: [], subcategories: [] }));
    }
  }, [amend_Industry]);

  // Fetch sub-categories when category changes in amend form
  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const result = await safeFetchJson(`${API_BASE_URL}/GetSubcategoriesApi?industry=${encodeURIComponent(amend_Industry)}&category=${encodeURIComponent(amend_ItemCategory)}`);
        if (result?.success) {
          setDropdownData(prev => ({ ...prev, subcategories: result.data }));
        } else {
          setDropdownData(prev => ({ ...prev, subcategories: [] }));
        }
      } catch (error) {
        setDropdownData(prev => ({ ...prev, subcategories: [] }));
      }
    };

    if (amend_Industry && amend_ItemCategory) {
      fetchSubCategories();
    } else {
      setDropdownData(prev => ({ ...prev, subcategories: [] }));
    }
  }, [amend_Industry, amend_ItemCategory]);

  // Auto-fill Item Name from Sub-Category
  useEffect(() => {
    if (amend_SubCategory) {
      const selectedSub = dropdownData.subcategories.find(s => s.value === amend_SubCategory);
      if (selectedSub) {
        setAmendValue("Item_Name", selectedSub.label);
      }
    }
  }, [amend_SubCategory, dropdownData.subcategories, setAmendValue]);


  // --- EVENT HANDLERS ---

  // Handle search submission
  const onSearchSubmit = async (formData) => {
    setIsLoading(true);
    setShowAmendForm(false);
    const params = new URLSearchParams({ itemName: formData.itemName, grade: formData.grade });
    try {
      const data = await safeFetchJson(`${API_BASE_URL}/GetItemByNameAndGrade?${params.toString()}`);
      if (data?.success && data.item) {
        setItemData(data.item);
        toast.success("Item found successfully!");
      } else {
        setItemData(null);
        toast.error(data?.message || "No records found.");
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch item details.");
      setItemData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle clicking the 'Amend' button with correct async logic
  const handleAmendClick = async () => {
    if (!itemData) return;

    try {
      // 1. Fetch Categories based on the item's industry
      if (itemData.Industry) {
        const catData = await safeFetchJson(`${API_BASE_URL}/GetCategoriesApi?industry=${encodeURIComponent(itemData.Industry)}`);
        const newCategories = catData?.success ? catData.data : [];
        setDropdownData(prev => ({ ...prev, categories: newCategories }));

        // 2. Fetch Sub-Categories based on the item's industry and category
        if (itemData.ItemCategory) {
          const subCatData = await safeFetchJson(`${API_BASE_URL}/GetSubcategoriesApi?industry=${encodeURIComponent(itemData.Industry)}&category=${encodeURIComponent(itemData.ItemCategory)}`);
          const newSubCategories = subCatData?.success ? subCatData.data : [];
          setDropdownData(prev => ({ ...prev, subcategories: newSubCategories }));
        }
      }

      // 3. NOW that dropdowns are loaded, reset the form with all the data
      resetAmendForm({
        ...itemData,
        Primary_Alternate: itemData.Prime_For_BOM // Map backend field to form field
      });

      // 4. Finally, show the form
      setShowAmendForm(true);

    } catch (error) {
      toast.error(error.message || "Could not prepare the amendment form.");
    }
  };

  // Handle final submission of the amendment form
  const onAmendSubmit = async (formData) => {
    setIsAmending(true);
    try {
      // Map form field back to backend field
      const dataToSend = {
        ...formData,
        Id: itemData.Id,
        Prime_For_BOM: formData.Primary_Alternate
      };
      delete dataToSend.Primary_Alternate; // remove redundant key

      const result = await safeFetchJson(`${API_BASE_URL}/AmendItemApi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (result?.success) {
        toast.success(`Item updated! ${result.newItemCode ? `New Code: ${result.newItemCode}` : ''}`);
        setShowAmendForm(false);
        // Refresh the search to show updated data
        onSearchSubmit(watchSearch());
      } else {
        toast.error(result?.message || "Failed to update item.");
      }
    } catch (err) {
      toast.error("Error updating item: " + err.message);
    } finally {
      setIsAmending(false);
    }
  };

  // --- RENDER LOGIC ---

  if (loadingDropdowns) {
    return (

      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Form...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} theme="colored" />
      <div className="container-fluid py-4" style={{
        background: '#f8f9fa', minHeight: '100vh', fontSize: '14px',
      }}>
        <style>{`
        .form-control,
        .form-select {
          height: 30px;
          font-size: 1rem;
          line-height: 1.5;
        }
          p{
          font-size:14px;
          }
          body{
           font-size: 16px;
        letter-spacing: 0.01em;
          }
        .form-label {
  text-align: left !important;
}

      `}</style>

        <div className="container">
          <div className="text-center mb-4">
            <h4 className="text-primary m-2 fw-bold p-2" style={{fontSize:'20px'}}>AMEND ITEM DETAILS</h4>
          </div>

          {/* Stage 1 & 2: Search and Preview */}
          {!showAmendForm && (
            <>
              {/* --- SEARCH FORM --- */}
              <div className="card shadow-sm mb-4">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <Search className="text-primary me-2" size={24} />
                    <h2 className="card-title mb-0">Search for an Item</h2>
                  </div>
                  <form onSubmit={handleSearchSubmit(onSearchSubmit)}>


                    <div className="row g-2 align-items-end">
                      {/* Item Code / Name */}
                      <div className="col-md-4">
                        <p htmlFor="searchTerm" className="form-label h3" >Item Code/Name</p>
                        <input
                          {...registerSearch("searchTerm")}
                          id="searchTerm"
                          className={`form-control ${searchErrors.searchTerm ? 'is-invalid' : ''}`}
                          placeholder="Type to search..."
                        />
                        <div className="invalid-feedback">{searchErrors.searchTerm?.message}</div>
                      </div>

                      {/* Item Name */}
                      <div className="col-md-4">
                        <p htmlFor="itemName" className="form-label h3">Select Item Name</p>

                        <select
                          {...registerSearch("itemName")}
                          id="itemName"
                          className={`form-select ${searchErrors.itemName ? 'is-invalid' : ''}`}
                        // disabled={!itemNames.length}
                        >
                          <option value="">Select item...</option>
                          {itemNames.map((item) => (
                            <option key={item.id} value={item.value}>
                              {item.label} ({item.itemCode})
                            </option>
                          ))}
                        </select>

                        <div className="invalid-feedback">{searchErrors.itemName?.message}</div>
                      </div>
                      {/* <div className="col-md-3"><label className="form-label  h3 text-primary">Item_Name*</label><select {...registerAmend("Item_Name")} className={`form-select form-select-sm ${amendErrors.Item_Name ? 'is-invalid' : ''}`}><option value="">---Select---</option>{dropdownData.items.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}</select><div className="invalid-feedback">{amendErrors.Item_Name?.message}</div></div> */}

                      {/* Grade */}
                      <div className="col-md-4">
                        <p htmlFor="grade" className="form-label h3">Select Grade</p>
                        <select
                          {...registerSearch("grade")}
                          id="grade"
                          className={`form-select ${searchErrors.grade ? 'is-invalid' : ''}`}
                          disabled={!grades.length}
                        >
                          <option value="">Select grade...</option>
                          {grades.map((grade) => (
                            <option key={grade.id} value={grade.value}>
                              {grade.label}
                            </option>
                          ))}
                        </select>
                        <div className="invalid-feedback">{searchErrors.grade?.message}</div>
                      </div>



                    </div>




                    {/* Submit Button Centered */}
                    <div className="text-center mt-4">
                      <button type="submit" disabled={isLoading} className="btn btn-primary save px-5">
                        {isLoading ? (
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        ) : (
                          <Search className="me-2" size={18} />
                        )}
                        {isLoading ? 'Searching...' : 'Search'}
                      </button>
                    </div>
                  </form>

                </div>
              </div>
              {/* --- ITEM PREVIEW --- */}
              {itemData && (
                <div className="card shadow-sm">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center">
                        <Eye className="text-success me-2" size={24} />
                        <h5 className="card-title mb-0">Item Details Preview</h5>
                      </div>
                      <button onClick={handleAmendClick} className="btn btn-warning">
                        <Edit2 className="me-2" size={18} /> Amend Record
                      </button>
                    </div>
                    <div className="table-responsive">
                      <table className="table table-hover table-bordered table-sm">
                        <tbody>
                          {[
                            { label1: "Item Code", value1: itemData.Item_Code, label2: "Item Name", value2: itemData.Item_Name },
                            { label1: "Grade", value1: itemData.Grade, label2: "Company", value2: itemData.Company_Name },
                            { label1: "Industry", value1: itemData.Industry, label2: "Category", value2: itemData.ItemCategory },
                            { label1: "Sub-Category", value1: itemData.Sub_Category, label2: "UOM", value2: itemData.Unit_Of_Measurement },
                            { label1: "HS Code", value1: itemData.HS_Code, label2: "Currency", value2: itemData.Currency },
                            { label1: "Average Price", value1: itemData.Average_Price, label2: "Safe Stock", value2: itemData.Safe_Stock },
                            { label1: "MOQ", value1: itemData.MOQ, label2: "Primary/Alternate", value2: itemData.Prime_For_BOM },
                            { label1: "TC/COA", value1: itemData.TC_COA, label2: "Source", value2: itemData.Source },
                            { label1: "Country", value1: itemData.Country, label2: "City", value2: itemData.City },
                          ].map((row, index) => (
                            <tr key={index}>
                              <td className=" bg-light w-25" style={{ fontSize: "14px" }}>{row.label1}</td>
                              <td className="w-25" style={{ fontSize: "14px" }}>{row.value1 ?? 'N/A'}</td>
                              <td className=" bg-light w-25" style={{ fontSize: "14px" }}>{row.label2}</td>
                              <td className="w-25" style={{ fontSize: "14px" }}>{row.value2 ?? 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Stage 3: Amendment Form */}
          {showAmendForm && itemData && (
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title mb-0">Editing Item: <span className="text-primary">{itemData.Item_Code}</span></h5>
                  <button onClick={() => setShowAmendForm(false)} className="btn bg-danger btn-outline-secondary "><Delete /></button>
                </div>
                <form onSubmit={handleAmendSubmit(onAmendSubmit)}>
                  <div className="row g-3">
                    <div className="col-md-3"><label className="form-label  h3 text-primary text-primary d-block" >Company Name <sapn className="text-danger">*</sapn></label>
                      <select
                        {...registerAmend("Company_Name")}
                        className={`form-select form-select-sm ${amendErrors.Company_Name ? 'is-invalid' : ''}`}
                      >
                        <option value="">---Select---</option>
                        {dropdownData.companies.map(c => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                      <div className="invalid-feedback" style={{ fontSize: "13px" }}>{amendErrors.Company_Name?.message}</div></div>
                    <div className="col-md-3">
                      <label className="form-label h3 text-primary text-primary d-block">Source</label>
                      <input
                        {...registerAmend("Source")}
                        className="form-control"
                        style={{ fontSize: "13px" }}
                        readOnly
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label h3 text-primary text-primary d-block">Continent</label>
                      <input
                        {...registerAmend("Continent")}
                        className="form-control"
                        style={{ fontSize: "13px" }}
                        readOnly
                      />
                    </div>
                    <div className="col-md-3"><label className="form-label  h3 text-primary d-block">Country</label><input style={{ fontSize: "13px" }} {...registerAmend("Country")} className="form-control form-control-sm" readOnly /></div>
                    <div className="col-md-3"><label className="form-label  h3 text-primary d-block">State</label><input style={{ fontSize: "13px" }} {...registerAmend("State")} className="form-control form-control-sm" readOnly /></div>
                    <div className="col-md-3"><label className="form-label  h3 text-primary  d-block">City</label><input style={{ fontSize: "13px" }} {...registerAmend("City")} className="form-control form-control-sm" readOnly /></div>
                    <div className="col-md-3"><label className="form-label  h3 text-primary  d-block">Industry<sapn className="text-danger">*</sapn></label><select style={{ fontSize: "13px" }} {...registerAmend("Industry")} className={`form-select form-select-sm ${amendErrors.Industry ? 'is-invalid' : ''}`}><option value="">---Select---</option>{dropdownData.industries.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}</select><div className="invalid-feedback">{amendErrors.Industry?.message}</div></div>
                    <div className="col-md-3"><label className="form-label  h3 text-primary  d-block">Category<sapn className="text-danger">*</sapn></label><select style={{ fontSize: "13px" }} {...registerAmend("ItemCategory")} className={`form-select form-select-sm ${amendErrors.ItemCategory ? 'is-invalid' : ''}`} disabled={!amend_Industry}><option value="">---Select---</option>{dropdownData.categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}</select><div className="invalid-feedback">{amendErrors.ItemCategory?.message}</div></div>
                    <div className="col-md-3"><label className="form-label  h3 text-primary  d-block">Sub-Category*</label><select style={{ fontSize: "13px" }}{...registerAmend("Sub_Category")} className={`form-select form-select-sm ${amendErrors.Sub_Category ? 'is-invalid' : ''}`} disabled={!amend_ItemCategory}><option value="">---Select---</option>{dropdownData.subcategories.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}</select><div className="invalid-feedback">{amendErrors.Sub_Category?.message}</div></div>
                    <div className="col-md-3"><label className="form-label  h3 text-primary  d-block">Item Name<sapn className="text-danger">*</sapn></label><input style={{ fontSize: "13px" }} {...registerAmend("Item_Name")} className={`form-control form-control-sm ${amendErrors.Item_Name ? 'is-invalid' : ''}`} readOnly /><div className="invalid-feedback">{amendErrors.Item_Name?.message}</div></div>
                    <div className="col-md-3"><label className="form-label  h3 text-primary  d-block">Grade<sapn className="text-danger">*</sapn></label><input style={{ fontSize: "13px" }}{...registerAmend("Grade")} className={`form-control form-control-sm ${amendErrors.Grade ? 'is-invalid' : ''}`} /><div className="invalid-feedback">{amendErrors.Grade?.message}</div></div>
                    <div className="col-md-3"><label className="form-label  h3 text-primary  d-block">UOM<sapn className="text-danger">*</sapn></label><select style={{ fontSize: "13px" }}{...registerAmend("Unit_Of_Measurement")} className={`form-select form-select-sm ${amendErrors.Unit_Of_Measurement ? 'is-invalid' : ''}`}><option value="">---Select---</option>{dropdownData.uoms.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}</select><div className="invalid-feedback">{amendErrors.Unit_Of_Measurement?.message}</div></div>
                    <div className="col-md-3"><label className="form-label  h3 text-primary  d-block">HS Code<sapn className="text-danger">*</sapn></label><input style={{ fontSize: "13px" }}{...registerAmend("HS_Code")} className={`form-control form-control-sm ${amendErrors.HS_Code ? 'is-invalid' : ''}`} /><div className="invalid-feedback">{amendErrors.HS_Code?.message}</div></div>
                    <div className="col-md-3"><label className="form-label  h3 text-primary  d-block">Currency<sapn className="text-danger">*</sapn></label><select style={{ fontSize: "13px" }}{...registerAmend("Currency")} className={`form-select form-select-sm ${amendErrors.Currency ? 'is-invalid' : ''}`}>{dropdownData.currencies.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}</select><div className="invalid-feedback">{amendErrors.Currency?.message}</div></div>
                    <div className="col-md-3"><label className="form-label  h3 text-primary  d-block">Average Price</label><input style={{ fontSize: "13px" }} type="number" {...registerAmend("Average_Price")} className={`form-control form-control-sm ${amendErrors.Average_Price ? 'is-invalid' : ''}`} /><div className="invalid-feedback">{amendErrors.Average_Price?.message}</div></div>
                    <div className="col-md-3"><label className="form-label  h3 text-primary  d-block">Safe Stock</label><input style={{ fontSize: "13px" }} type="number" {...registerAmend("Safe_Stock")} className={`form-control form-control-sm ${amendErrors.Safe_Stock ? 'is-invalid' : ''}`} /><div className="invalid-feedback">{amendErrors.Safe_Stock?.message}</div></div>
                    <div className="col-md-3"><label className="form-label  h3 text-primary  d-block">MOQ</label><input style={{ fontSize: "13px" }} type="number" {...registerAmend("MOQ")} className={`form-control form-control-sm ${amendErrors.MOQ ? 'is-invalid' : ''}`} /><div className="invalid-feedback">{amendErrors.MOQ?.message}</div></div>
                    <div className="col-md-3"><label className="form-label  h3 text-primary d-block">Primary/Alternate<sapn className="text-danger">*</sapn></label><div className="form-check form-check-inline"><input className="form-check-input" type="radio" {...registerAmend("Primary_Alternate")} value="PRIMARY" id="primaryRadio" /><label className="form-check-label  h3 text-dark" htmlFor="primaryRadio">Primary</label></div><div className="form-check form-check-inline"><input className="form-check-input" type="radio" {...registerAmend("Primary_Alternate")} value="ALTERNATE" id="alternateRadio" /><label className="form-check-label  h3 text-dark" htmlFor="alternateRadio">Alternate</label></div></div>
                    <div className="col-md-3"><label className="form-label  h3 text-primary d-block">TC/COA<sapn className="text-danger">*</sapn></label><div className="form-check form-check-inline"><input className="form-check-input" type="radio" {...registerAmend("TC_COA")} value="Required" id="tcRequired" /><label className="form-check-label  h3 text-dark" htmlFor="tcRequired">Required</label></div><div className="form-check form-check-inline"><input className="form-check-input" type="radio" {...registerAmend("TC_COA")} value="Not Required" id="tcNotRequired" /><label className="form-check-label  h3 text-dark" htmlFor="tcNotRequired">Not Required</label></div></div>
                  </div>
                  <div className="text-center mt-4">
                    <button type="submit" disabled={isAmending} className="btn btn-success " style={{
                      width: "130px",
                      fontSize: "14px"
                    }}>
                      {isAmending ? <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> : <Save className="me-2" size={18} />}
                      {isAmending ? 'Updating...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AmendItem;


