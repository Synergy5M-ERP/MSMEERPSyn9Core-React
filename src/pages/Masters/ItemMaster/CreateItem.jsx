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
   font-size: 16px; !important
}

      `}</style>
    <div className="app-container" style={{ backgroundColor: 'white', minHeight: '120vh' }}>
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


    </div>
  </>
  );
}

export default CreateItem;
