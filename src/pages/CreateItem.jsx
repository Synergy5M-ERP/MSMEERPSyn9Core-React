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
    File:'',
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

  const validateForm = () => {
    if (!formData.Company_Name) {
      toast.error('Please select a company name.');
      return false;
    }
    if (!formData.HS_Code || formData.HS_Code.trim() === '') {
      toast.error('HS CODE is required.');
      return false;
    }
    if (!formData.Grade || formData.Grade.trim() === '') {
      toast.error('Grade is required.');
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
     <div className="loading-container" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
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
   font-size: 16px; !important
}

      `}</style>
    <div className="app-container" style={{ backgroundColor: 'white', minHeight: '100vh' }}>
{/* <h3>Add item Details</h3> */}
      {/* <div className="header">
        <h4 className='fw-500 text-primary'>Add Item Details</h4>
        <div className="header-line"></div>
      </div> */}

      <div className="form-card scrollbar ">
        <div className="form-content">

          {/* Company & Location Section */}
          <div className="section">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label  text-primary d-block" style={{fontSize:'18px'}}>Company Name <span className="required">*</span></label>
                <select
                  name="Company_Name"
                  value={formData.Company_Name}
                  onChange={handleCompanyChange}
                  className="form-input"
                >
                  <option value="">Select Company</option>
                  {dropdownData.companies.map((company, index) => (
                    <option key={index} value={company.value}>{company.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label  h3 text-primary d-block" style={{fontSize:'18px'}}>Source</label>
                <input
                  type="text"
                  name="Source"
                  value={formData.Source}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label  h3 text-primary d-block" style={{fontSize:'18px'}}>Continent</label>
                <input
                  type="text"
                  name="Continent"
                  value={formData.Continent}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label  h3 text-primary d-block" style={{fontSize:'18px'}}>Country</label>
                <input
                  type="text"
                  name="Country"
                  value={formData.Country}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Item Classification Section */}
          <div className="section">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label  h3 text-primary d-block" style={{fontSize:'18px'}}>State</label>
                <input
                  type="text"
                  name="State"
                  value={formData.State}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label  h3 text-primary d-block" style={{fontSize:'18px'}}>City</label>
                <input
                  type="text"
                  name="City"
                  value={formData.City}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label  h3 text-primary d-block" style={{fontSize:'18px'}}>Industry</label>
                <select
                  name="Industry"
                  value={formData.Industry}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">Select Industry</option>
                  {dropdownData.industries.map((industry, index) => (
                    <option key={index} value={industry.value}>{industry.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label  h3 text-primary d-block" style={{fontSize:'18px'}}>Category</label>
                <select
                  name="ItemCategory"
                  value={formData.ItemCategory}
                  onChange={handleInputChange}
                  disabled={!formData.Industry}
                  className="form-input"
                >
                  <option value="">Select Category</option>
                  {dropdownData.categories.map((category, index) => (
                    <option key={index} value={category.value}>{category.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label  h3 text-primary d-block" style={{fontSize:'18px'}}>Sub Category</label>
                <select
                  name="Sub_Category"
                  value={formData.Sub_Category}
                  onChange={handleSubCategoryChange}
                  disabled={!formData.ItemCategory}
                  className="form-input"
                >
                  <option value="">Select Sub Category</option>
                  {dropdownData.subcategories.map((subCategory, index) => (
                    <option key={index} value={subCategory.value}>{subCategory.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label  h3 text-primary d-block" style={{fontSize:'18px'}}>Item Name</label>
                <input
                  type="text"
                  name="Item_Name"
                  value={formData.Item_Name}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label  h3 text-primary d-block" style={{fontSize:'18px'}}>Grade <span className="required">*</span></label>
                <input
                  type="text"
                  name="Grade"
                  value={formData.Grade}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label  h3 text-primary d-block" style={{fontSize:'18px'}}>Unit of Measurement</label>
                <select
                  name="Unit_Of_Measurement"
                  value={formData.Unit_Of_Measurement}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">Select UOM</option>
                  {dropdownData.uoms.map((uom, index) => (
                    <option key={index} value={uom.value}>{uom.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing & Stock Section */}
          <div className="section">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label  h3 text-primary d-block" style={{fontSize:'18px'}}>HS Code <span className="required">*</span></label>
                <input
                  type="number"
                  name="HS_Code"
                  value={formData.HS_Code}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label  h3 text-primary d-block" style={{fontSize:'18px'}}>Currency</label>
                <select
                  name="Currency"
                  value={formData.Currency}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  {dropdownData.currencies.map((currency, index) => (
                    <option key={index} value={currency.value}>{currency.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label  h3 text-primary d-block" style={{fontSize:'18px'}}>Average Price</label>
                <input
                  type="number"
                  name="Average_Price"
                  value={formData.Average_Price}
                  onChange={handleInputChange}
                  className="form-input"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label className="form-label  h3 text-primary d-block" style={{fontSize:'18px'}}>Safe Stock Level</label>
                <input
                  type="number"
                  name="Safe_Stock"
                  value={formData.Safe_Stock}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Additional Options Section */}
          <div className="section">
            <div className="options-grid">
              <div className="form-group">
                <label className="form-label  h3 text-primary d-block" style={{fontSize:'18px'}}>MOQ</label>
                <input
                  type="number"
                  name="MOQ"
                  value={formData.MOQ}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label  h3 text-primary d-block" style={{fontSize:'18px'}}>Primary or Alternate <span className="required">*</span></label>
                <div className="radio-group">
                  <label className="form-label  h3 text-primary d-block radio-label">
                    <input
                      type="radio"
                      value="PRIMARY"
                      checked={formData.Primary_Alternate === 'PRIMARY'}
                      onChange={(e) => handleRadioChange('Primary_Alternate', e.target.value)}
                    />
                    <span>Primary</span>
                  </label>
                  <label className="form-label  h3 text-primary d-block radio-label">
                    <input
                      type="radio"
                      value="ALTERNATE"
                      checked={formData.Primary_Alternate === 'ALTERNATE'}
                      onChange={(e) => handleRadioChange('Primary_Alternate', e.target.value)}
                    />
                    <span>Alternate</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label  h3 text-primary d-block" style={{fontSize:'18px'}}>TC / COA</label>
                <div className="radio-group">
                  <label className="form-label  h3 text-primary d-block radio-label">
                    <input
                      type="radio"
                      value="Required"
                      checked={formData.TC_COA === 'Required'}
                      onChange={(e) => handleRadioChange('TC_COA', e.target.value)}
                    />
                    <span>Required</span>
                  </label>
                  <label className="form-label  h3 text-primary d-block radio-label">
                    <input
                      type="radio"
                      value="Not Required"
                      checked={formData.TC_COA === 'Not Required'}
                      onChange={(e) => handleRadioChange('TC_COA', e.target.value)}
                    />
                    <span>Not Required</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Image & Document Upload Section */}
          <div className="row">
            <div className="col-5 ">
              {/* Image Upload */}
              <label className="form-label   text-primary d-block"> Upload item Image</label>
              {!imagePreview ? (
                <label className="form-label  text-primary d-block upload-area">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                  />
                  <Upload size={16} className="upload-icon" />
                  <div className='flex'>
                    <p className="upload-text">Click to upload image</p>
                    <p className="upload-subtext">PNG, JPG up to 5MB</p>
                  </div>
                </label>
              ) : (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="remove-image-btn"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>

           
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <Loader className="btn-spinner" size={18} />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Submit
                </>
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="btn btn-secondary"
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />

      <style jsx>{`
      :root {
        --primary: #5546c6;
        --primary-gradient: linear-gradient(135deg, #667eea 0%, #5546c6 100%);
        --accent: #764ba2;
        --background: #f5f7fa;
        --header-bg: #fff;
        --white: #fff;
        --text-main: #23263B;
        --text-muted: #697089;
        --border: #e5e7eb;
        --danger: #ef4444;
        --input-bg: #f7f8fa;
        --card-shadow: 0 12px 40px rgba(60, 72, 104, 0.12);
      }

      html, body {
        font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
        color: var(--text-main);
        font-size: 14px;
        letter-spacing: 0.01em;
        line-height: 1.54;
      }

      .app-container {
        min-height: 100vh;
     
      }

      .form-wrapper {
        max-width: 960px;
        margin: 1.5rem auto;
        background: var(--white);
        border-radius: 16px;
        box-shadow: var(--card-shadow);
        overflow: hidden;
      }

      .header {
        position: relative;
        text-align: center;
      }

      .header h2 {
        font-size: 2.3rem;
        color: var(--primary);
        font-weight: 800;
        letter-spacing: 0.01em;
        margin-bottom: 0.25rem;
        text-shadow: 0 1px 0 #f3f3fa;
      }

      .header-line {
        width: 90px;
        height: 3.4px;
        background: var(--primary);
        border-radius: 3px;
        margin: 0.3rem auto 0.2rem auto;
        opacity: 0.16;
      }

      .form-card {
        background: white;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        overflow: hidden;
      }

      .scrollbar {
        height: 400px;
        overflow-y: auto;
        scroll-behavior: smooth;
        padding-right: 8px;
      }

      .form-content {
        padding: 2.5rem 3rem 2rem 3rem;
        background: var(--white);
      }

      .section {
        margin-bottom: 2.35rem;
        border-radius: 12px;
        padding-bottom: 0.5rem;
      }

      .form-grid, .options-grid {
        display: grid;
        grid-gap: 1.3rem;
        margin-bottom: 0.3rem;
      }

      .form-grid {
        grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
      }

      .options-grid {
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        margin-bottom: 0.3rem;
      } 

      .form-group {
        display: flex;
        flex-direction: column;
        margin-bottom: 0.5rem;
      }

      .form-group label {
        margin-bottom: 0.45rem;
        font-size: 0.98rem;
        font-weight: 600;
        color: var(--text-main);
        letter-spacing: 0.001em;
      }

      .required { color: var(--danger); }

      .form-input,
      select.form-input {
        background: var(--input-bg);
        border: 1.8px solid var(--border);
        border-radius: 8.8px;
        padding: 0.62rem 1.1rem;
        font-size: 1rem;
        font-family: inherit;
        color: var(--text-main);
        transition: border 0.2s, box-shadow 0.2s;
        font-weight: 500;
        margin-top: 0.05rem;
      }

      .form-input:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.08);
        background: #f2f4fd;
      }

      .form-input:disabled {
        background: #ebecf0;
        color: var(--text-muted);
        opacity: 1;
        cursor: not-allowed;
      }

      .radio-group {
        display: flex;
        gap: 1.6rem;
        align-items: center;
        margin-top: 0.2rem;
      }

      .radio-label {
        font-size: 1rem;
        color: var(--text-muted);
        display: flex;
        align-items: center;
        cursor: pointer;
      }

      .radio-label input[type="radio"] {
        width: 18px;
        height: 18px;
        margin-right: 0.65rem;
        accent-color: var(--primary);
        cursor: pointer;
        transition: box-shadow 0.2s;
      }

      .radio-label input[type="radio"]:focus {
        outline: 2px solid var(--primary);
      }

      .image-upload-container {
        margin-top: 0.5rem;
        margin-bottom: 0.8rem;
      }

      .upload-area {
        background: #f8f9fc;
        border: 2px dashed var(--border);
        border-radius: 13px;
        flex-direction: column;
        align-items: center;
          padding: 2.45rem 1.75rem;
        
      cursor: pointer;
        transition: border 0.2s, background 0.2s;
      }

      .upload-area:hover, .upload-area:focus {
        border-color: var(--primary);
        background: #f3f4fd;
      }

      .file-input { display: none; }

      .upload-icon {
        color: var(--primary);
        margin-bottom: 0.6rem;
      }

      .upload-text {
        font-size: 1.07rem;
        font-weight: 600;
        color: var(--text-main);
        margin-bottom: 0.1rem;
      }

      .upload-subtext {
        font-size: 0.92rem;
        color: var(--text-muted);
      }

      .image-preview-container {
        position: relative;
        display: inline-block;
      }
      .image-preview {
        max-width: 220px;
        max-height: 220px;
        border-radius: 9px;
        box-shadow: 0 4px 14px rgba(0,0,0,0.09);
      }
      .file-preview {
        font-size: 1rem;
        color: var(--text-main);
        padding: 0.7rem 1rem;
        background: #f2f4fd;
        border-radius: 8px;
        max-width: 220px;
        display: inline-block;
        box-shadow: 0 4px 14px rgba(0,0,0,0.09);
      }
      .remove-image-btn {
        position: absolute;
        top: -11px;
        right: -11px;
        background: var(--danger);
        border: none;
        color: #fff;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 18px rgba(255,0,0,0.11);
        opacity: 0.92;
        transition: background 0.13s, transform 0.13s;
      }
      .remove-image-btn:hover { background: #c0251e; transform: scale(1.05); }

      .action-buttons {
        display: flex;
        gap: 1.3rem;
        justify-content: center;
        margin-top: 2.1rem;
        padding-top: 1.9rem;
        border-top: 1.5px solid #f3f3fa;
        background: none;
      }

      .btn {
        display: flex;
        align-items: center;
        gap: 0.55rem;
        padding: 0.85rem 2.15rem;
        font-size: 1.06rem;
        border: none;
        border-radius: 11px;
        cursor: pointer;
        transition: 
          background 0.23s, 
          transform 0.13s, 
          box-shadow 0.25s;
        font-weight: 700;
        background: var(--primary-gradient);
        color: #fff;
        letter-spacing: 0.02em;
        min-width: 140px;
        justify-content: center;
        box-shadow: 0 3px 12px rgba(102, 126, 234, 0.13);
      }
      .btn:disabled {
        background: #e2e3e5;
        color: #98a6bd;
        cursor: not-allowed;
        opacity: 0.66;
        box-shadow: none;
      }
      .btn-primary:hover:not(:disabled) {
        background: linear-gradient(135deg,#5546c6 30%, #764ba2 100%);
        transform: translateY(-1.2px) scale(1.02);
        box-shadow: 0 6px 21px rgba(102, 126, 234, 0.18);
      }
      .btn-secondary {
        background: #697089;
        color: #fff;
        font-weight: 600;
        margin-left: 0.3rem;
        box-shadow: 0 2px 11px rgba(160,160,180,0.15);
      }
      .btn-secondary:hover:not(:disabled) { background: #545773; }
      .btn-spinner { animation: spin 1s linear infinite; }
      @keyframes spin { from {transform: rotate(0);} to{transform: rotate(360deg);} }

      .loading-container {
        min-height: 100vh;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        background: var(--primary-gradient);
        color: #fff;
      }
      .spinner { animation: spin 0.9s linear infinite; margin-bottom: 0.8rem; }

      @media (max-width: 900px) {
        .form-content { padding: 1.55rem 0.8rem 1.2rem 0.8rem; }
        .header h2 { font-size: 1.6rem; }
      }

      @media (max-width: 700px) {
        .form-grid, .options-grid { grid-template-columns: 1fr; }
        .form-content { padding: 0.85rem 0.1rem 1.1rem 0.1rem; }
        .form-wrapper { margin: 0.6rem auto; }
        .action-buttons { flex-direction: column; }
        .btn { width: 100%; }
      }
      `}</style>

    </div>
  </>
  );
}

export default CreateItem;
