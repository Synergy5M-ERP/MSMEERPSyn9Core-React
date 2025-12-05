import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Upload, X, CheckCircle, Loader } from 'lucide-react';

function CreateItem() {
  const [formData, setFormData] = useState({
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
    TC_COA: '',
    File: '',
  });

  const [dropdownData, setDropdownData] = useState({
    companies: [],
    industries: [],
    categories: [],
    subcategories: [],
    currencies: [],
    uoms: []
  });

  const [loading, setLoading] = useState(false);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const API_BASE_URL = 'http://localhost:49980/Item';

  useEffect(() => {
    loadDropdownData();
  }, []);

  const loadDropdownData = async () => {
    setLoadingDropdowns(true);
    try {
      const [companiesRes, industriesRes, currenciesRes, uomsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/GetCompanyListApi`),
        fetch(`${API_BASE_URL}/GetIndustriesApi`),
        fetch(`${API_BASE_URL}/GetCurrencyListApi`),
        fetch(`${API_BASE_URL}/GetUOMListApi`)
      ]);

      const [companies, industries, currencies, uoms] = await Promise.all([
        companiesRes.json(),
        industriesRes.json(),
        currenciesRes.json(),
        uomsRes.json()
      ]);

      setDropdownData({
        companies: companies.success ? companies.data : [],
        industries: industries.success ? industries.data : [],
        categories: [],
        subcategories: [],
        currencies: currencies.success ? currencies.data : [],
        uoms: uoms.success ? uoms.data : []
      });
    } catch (error) {
      toast.error('Failed to load dropdown data: ' + error.message);
    } finally {
      setLoadingDropdowns(false);
    }
  };

  // Enhanced number input handler with validation
  const handleNumberInputChange = (name, value) => {
    // Allow empty string for clearing
    if (value === '' || value === null) {
      setFormData(prev => ({
        ...prev,
        [name]: ''
      }));
      return;
    }

    // Convert to number and validate
    const numValue = parseFloat(value);
    
    // Prevent negative values and NaN
    if (isNaN(numValue) || numValue < 0) {
      toast.error(`${name.replace('_', ' ')} cannot be less than 0`);
      return;
    }

    // Specific validations
    if (name === 'HS_Code' && (!Number.isInteger(numValue) || numValue < 1000)) {
      toast.error('HS Code must be a valid integer >= 1000');
      return;
    }

    if ((name === 'Average_Price' || name === 'Safe_Stock' || name === 'MOQ') && numValue === 0) {
      toast.error(`${name.replace('_', ' ')} cannot be 0`);
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: numValue.toString()
    }));
  };

  // Handle image file input change
  const handleImageChange = (e) => {
    const image = e.target.files[0];
    if (image) {
      if (image.size > 5000000) {
        toast.error('File size should be less than 5MB');
        return;
      }
      if (!image.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      setImageFile(image);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(image);
    }
  };

  // Handle document file input change
  const handleFileChange = (e) => {
    const fileDoc = e.target.files[0];
    if (fileDoc) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ];
      if (!allowedTypes.includes(fileDoc.type)) {
        toast.error("Please upload a PDF or Word document");
        return;
      }
      if (fileDoc.size > 10 * 1024 * 1024) {
        toast.error("File size should be less than 10MB");
        return;
      }
      setFile(fileDoc);
      setFilePreview(fileDoc.name);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
  };

  // Fetch company details and update fields
  const fetchCompanyDetails = async (companyName) => {
    try {
      const res = await fetch(`${API_BASE_URL}/GetCompanyDetails?search=${encodeURIComponent(companyName)}`);
      const data = await res.json();
      if (data && data.Source !== undefined) {
        setFormData(prev => ({
          ...prev,
          Source: data.Source || '',
          Continent: data.Continent || '',
          Country: data.Country || '',
          State: data.State || '',
          City: data.City || ''
        }));
        toast.info(`Company details loaded`, { autoClose: 2000 });
      }
    } catch (error) {
      console.error('Error fetching company details:', error);
    }
  };

  const handleCompanyChange = async (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      Company_Name: value,
      Source: '',
      Continent: '',
      Country: '',
      State: '',
      City: ''
    }));

    if (value) {
      await fetchCompanyDetails(value);
    }
  };

  const handleSubCategoryChange = (e) => {
    const value = e.target.value;
    const selected = dropdownData.subcategories.find(sub => sub.value === value);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        Sub_Category: value,
        Item_Name: selected.label
      }));
    }
  };

  useEffect(() => {
    if (formData.Industry) {
      loadCategories(formData.Industry);
    } else {
      setDropdownData(prev => ({ ...prev, categories: [], subcategories: [] }));
    }
  }, [formData.Industry]);

  useEffect(() => {
    if (formData.Industry && formData.ItemCategory) {
      loadSubcategories(formData.Industry, formData.ItemCategory);
    } else {
      setDropdownData(prev => ({ ...prev, subcategories: [] }));
    }
  }, [formData.Industry, formData.ItemCategory]);

  const loadCategories = async (industry) => {
    try {
      const response = await fetch(`${API_BASE_URL}/GetCategoriesApi?industry=${encodeURIComponent(industry)}`);
      const result = await response.json();
      if (result.success) {
        setDropdownData(prev => ({
          ...prev,
          categories: result.data,
          subcategories: []
        }));
        setFormData(prev => ({ ...prev, ItemCategory: '', Sub_Category: '', Item_Name: '' }));
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadSubcategories = async (industry, category) => {
    try {
      const response = await fetch(`${API_BASE_URL}/GetSubcategoriesApi?industry=${encodeURIComponent(industry)}&category=${encodeURIComponent(category)}`);
      const result = await response.json();
      if (result.success) {
        setDropdownData(prev => ({
          ...prev,
          subcategories: result.data
        }));
        setFormData(prev => ({ ...prev, Sub_Category: '', Item_Name: '' }));
      }
    } catch (error) {
      console.error('Failed to load subcategories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle number fields with validation
    if (['HS_Code', 'Average_Price', 'Safe_Stock', 'MOQ'].includes(name)) {
      handleNumberInputChange(name, value);
      return;
    }

    // Handle text fields
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRadioChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancel = () => {
    setFormData({
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
      TC_COA: ''
    });
    removeImage();
    removeFile();
    toast.info('Form cleared!');
  };

  // Enhanced validation with number checks
  const validateForm = () => {
    // Required fields
    if (!formData.Company_Name?.trim()) {
      toast.error('Please select a company name.');
      return false;
    }
    
    if (!formData.Grade?.trim()) {
      toast.error('Grade is required.');
      return false;
    }

    if (!formData.HS_Code || formData.HS_Code.trim() === '') {
      toast.error('HS CODE is required.');
      return false;
    }

    // Number field validations
    const hsCode = parseFloat(formData.HS_Code);
    if (isNaN(hsCode) || hsCode < 1000 || !Number.isInteger(hsCode)) {
      toast.error('HS Code must be a valid integer >= 1000');
      return false;
    }

    const avgPrice = parseFloat(formData.Average_Price);
    if (formData.Average_Price && (isNaN(avgPrice) || avgPrice <= 0)) {
      toast.error('Average Price must be greater than 0');
      return false;
    }

    const safeStock = parseFloat(formData.Safe_Stock);
    if (formData.Safe_Stock && (isNaN(safeStock) || safeStock < 0)) {
      toast.error('Safe Stock cannot be less than 0');
      return false;
    }

    const moq = parseFloat(formData.MOQ);
    if (formData.MOQ && (isNaN(moq) || moq <= 0)) {
      toast.error('MOQ must be greater than 0');
      return false;
    }

    // Required radio buttons
    if (!formData.Primary_Alternate) {
      toast.error('Please select Primary or Alternate.');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key] || "");
      });

      if (imageFile) {
        formDataToSend.append("Image", imageFile);
      }

      if (file) {
        formDataToSend.append("Document", file);
      }

      const response = await fetch(`${API_BASE_URL}/CreateItemApi`, {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        const itemInfo = result.data;
        toast.success(
          `Item Created! Code: ${itemInfo?.itemCode || 'N/A'}`,
          { autoClose: 5000 }
        );
        handleCancel();
      } else {
        toast.error(`Failed: ${result.message}`);
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingDropdowns) {
    return (
      <div className="loading-container" style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <Loader className="spinner" size={48} />
        <p>Loading form data...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .form-label {
          text-align: left !important;
          font-size: 16px !important;
        }
        .form-control:focus {
          border-color: #100670;
          box-shadow: 0 0 0 0.2rem rgba(16, 6, 112, 0.25);
        }
        .required {
          color: #dc3545;
        }
        .upload-area {
          border: 2px dashed #ddd;
          border-radius: 12px;
          padding: 40px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #f8f9fa;
        }
        .upload-area:hover {
          border-color: #100670;
          background-color: #f0f4ff;
        }
        .upload-icon {
          color: #100670;
        }
        .upload-text {
          font-weight: 600;
          margin: 0;
        }
        .upload-subtext {
          margin: 0;
          color: #6c757d;
        }
        .image-preview-container {
          position: relative;
          display: inline-block;
        }
        .image-preview {
          max-height: 200px;
          object-fit: cover;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        /* Number input styling */
        input[type="number"] {
          -moz-appearance: textfield;
        }
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>

      <div className="app-container" style={{ backgroundColor: 'white', minHeight: '120vh', padding: '20px 0' }}>
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-11">
              <div className="card border-0 shadow-lg">
                <div className="card-body p-4 p-lg-5">
                  
                  {/* ROW 1: Company Name, Source, Continent, Country, State */}
                  <div className="row mb-4">
                    <div className="col">
                      <label className="form-label text-primary fw-bold fs-6">
                        Company Name <span className="required">*</span>
                      </label>
                      <select
                        name="Company_Name"
                        value={formData.Company_Name}
                        onChange={handleCompanyChange}
                        className="form-control form-input"
                      >
                        <option value="">Select Company</option>
                        {dropdownData.companies.map((company, index) => (
                          <option key={index} value={company.value}>{company.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col">
                      <label className="form-label text-primary fw-bold fs-6">Source</label>
                      <input
                        type="text"
                        name="Source"
                        value={formData.Source}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                    <div className="col">
                      <label className="form-label text-primary fw-bold fs-6">Continent</label>
                      <input
                        type="text"
                        name="Continent"
                        value={formData.Continent}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                    <div className="col">
                      <label className="form-label text-primary fw-bold fs-6">Country</label>
                      <input
                        type="text"
                        name="Country"
                        value={formData.Country}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                    <div className="col">
                      <label className="form-label text-primary fw-bold fs-6">State</label>
                      <input
                        type="text"
                        name="State"
                        value={formData.State}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                  </div>

                  {/* ROW 2: City, Industry, Category, Sub Category, Item Name */}
                  <div className="row mb-4">
                    <div className="col">
                      <label className="form-label text-primary fw-bold fs-6">City</label>
                      <input
                        type="text"
                        name="City"
                        value={formData.City}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                    <div className="col">
                      <label className="form-label text-primary fw-bold fs-6">Industry</label>
                      <select
                        name="Industry"
                        value={formData.Industry}
                        onChange={handleInputChange}
                        className="form-control"
                      >
                        <option value="">Select Industry</option>
                        {dropdownData.industries.map((industry, index) => (
                          <option key={index} value={industry.value}>{industry.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col">
                      <label className="form-label text-primary fw-bold fs-6">Category</label>
                      <select
                        name="ItemCategory"
                        value={formData.ItemCategory}
                        onChange={handleInputChange}
                        disabled={!formData.Industry}
                        className="form-control"
                      >
                        <option value="">Select Category</option>
                        {dropdownData.categories.map((category, index) => (
                          <option key={index} value={category.value}>{category.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col">
                      <label className="form-label text-primary fw-bold fs-6">Sub Category</label>
                      <select
                        name="Sub_Category"
                        value={formData.Sub_Category}
                        onChange={handleSubCategoryChange}
                        disabled={!formData.ItemCategory}
                        className="form-control"
                      >
                        <option value="">Select Sub Category</option>
                        {dropdownData.subcategories.map((subCategory, index) => (
                          <option key={index} value={subCategory.value}>{subCategory.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col">
                      <label className="form-label text-primary fw-bold fs-6">Item Name</label>
                      <input
                        type="text"
                        name="Item_Name"
                        value={formData.Item_Name}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                  </div>

                  {/* ROW 3: Grade, UOM, HS Code, Currency, Average Price */}
                  <div className="row mb-4">
                    <div className="col">
                      <label className="form-label text-primary fw-bold fs-6">
                        Grade <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="Grade"
                        value={formData.Grade}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                    <div className="col">
                      <label className="form-label text-primary fw-bold fs-6">UOM</label>
                      <select
                        name="Unit_Of_Measurement"
                        value={formData.Unit_Of_Measurement}
                        onChange={handleInputChange}
                        className="form-control"
                      >
                        <option value="">Select UOM</option>
                        {dropdownData.uoms.map((uom, index) => (
                          <option key={index} value={uom.value}>{uom.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col">
                      <label className="form-label text-primary fw-bold fs-6">
                        HS Code <span className="required">*</span>
                      </label>
                      <input
                        type="number"
                        name="HS_Code"
                        value={formData.HS_Code}
                        onChange={handleInputChange}
                        className="form-control"
                        min="1000"
                        step="1"
                      />
                    </div>
                    <div className="col">
                      <label className="form-label text-primary fw-bold fs-6">Currency</label>
                      <select
                        name="Currency"
                        value={formData.Currency}
                        onChange={handleInputChange}
                        className="form-control"
                      >
                        {dropdownData.currencies.map((currency, index) => (
                          <option key={index} value={currency.value}>{currency.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col">
                      <label className="form-label text-primary fw-bold fs-6">Avg Price</label>
                      <input
                        type="number"
                        name="Average_Price"
                        value={formData.Average_Price}
                        onChange={handleInputChange}
                        className="form-control"
                        min="0.01"
                        step="0.01"
                      />
                    </div>
                  </div>

                  {/* ROW 4: Safe Stock, MOQ, Primary/Alternate, TC/COA */}
                  <div className="row mb-4">
                    <div className="col">
                      <label className="form-label text-primary fw-bold fs-6">Safe Stock</label>
                      <input
                        type="number"
                        name="Safe_Stock"
                        value={formData.Safe_Stock}
                        onChange={handleInputChange}
                        className="form-control"
                        min="0"
                        step="1"
                      />
                    </div>
                    <div className="col">
                      <label className="form-label text-primary fw-bold fs-6">MOQ</label>
                      <input
                        type="number"
                        name="MOQ"
                        value={formData.MOQ}
                        onChange={handleInputChange}
                        className="form-control"
                        min="1"
                        step="1"
                      />
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-6 mb-3">
                      <label className="form-label text-primary fw-bold fs-6">
                        Primary or Alternate <span className="required">*</span>
                      </label>
                      <div className="d-flex gap-4 mt-2 pt-1">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="Primary_Alternate"
                            id="primary"
                            value="PRIMARY"
                            checked={formData.Primary_Alternate === 'PRIMARY'}
                            onChange={(e) => handleRadioChange('Primary_Alternate', e.target.value)}
                          />
                          <label className="form-check-label fw-semibold" htmlFor="primary">
                            Primary
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="Primary_Alternate"
                            id="alternate"
                            value="ALTERNATE"
                            checked={formData.Primary_Alternate === 'ALTERNATE'}
                            onChange={(e) => handleRadioChange('Primary_Alternate', e.target.value)}
                          />
                          <label className="form-check-label fw-semibold" htmlFor="alternate">
                            Alternate
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-6 mb-3">
                      <label className="form-label text-primary fw-bold fs-6">TC / COA</label>
                      <div className="d-flex gap-4 mt-2 pt-1">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="TC_COA"
                            id="tc-required"
                            value="Required"
                            checked={formData.TC_COA === 'Required'}
                            onChange={(e) => handleRadioChange('TC_COA', e.target.value)}
                          />
                          <label className="form-check-label fw-semibold" htmlFor="tc-required">
                            Required
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="TC_COA"
                            id="tc-not-required"
                            value="Not Required"
                            checked={formData.TC_COA === 'Not Required'}
                            onChange={(e) => handleRadioChange('TC_COA', e.target.value)}
                          />
                          <label className="form-check-label fw-semibold" htmlFor="tc-not-required">
                            Not Required
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ROW 5: Image Upload (Full Width) */}
                  <div className="row mb-5">
                    <div className="col-12">
                      <div className="col-lg-6 col-md-8 mx-auto">
                        {!imagePreview ? (
                          <label className="upload-area p-4">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="d-none"
                            />
                            <Upload size={32} className="upload-icon mx-auto d-block mb-3" />
                            <div>
                              <p className="upload-text mb-1">Click to upload item image</p>
                              <p className="upload-subtext">PNG, JPG (Max 5MB)</p>
                            </div>
                          </label>
                        ) : (
                          <div className="image-preview-container text-center">
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="img-fluid rounded shadow-lg mb-3" 
                              style={{maxHeight: '250px', objectFit: 'cover', maxWidth: '100%'}}
                            />
                            <button
                              type="button"
                              onClick={removeImage}
                              className="btn btn-danger btn-sm px-3"
                            >
                              <X size={16} className="me-1" /> Remove Image
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="row">
                    <div className="col-12 text-center">
                      <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="btn btn-primary save"
                        // style={{backgroundColor: '#100670', borderColor: '#100670'}}
                      >
                        {loading ? (
                          <>
                            <Loader className="spinner-border spinner-border-sm me-2" role="status" />
                            Creating Item...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="me-2" size={20} />
                            Create Item
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={loading}
                        className="btn btn-outline-secondary btn-lg px-5 py-2 shadow"
                      >
                        <X className="me-2" size={20} />
                        Reset Form
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={4000} theme="colored" />
    </>
  );
}

export default CreateItem;
