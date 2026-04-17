import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Select from "react-select";
import 'react-toastify/dist/ReactToastify.css';
import { Upload, X, CheckCircle, Loader } from 'lucide-react';
import { FaPlus, FaTimes, FaPaperPlane, FaPlusCircle } from "react-icons/fa";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config/apiconfig";

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
    Packaging: '',
    MOQ: '',
    Primary_Alternate: 'PRIMARY',
    TC_COA: '',
    File: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);


  const handleNumberInputChange = (name, value) => {
    if (value === '' || value === null) {
      setFormData(prev => ({
        ...prev,
        [name]: ''
      }));
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) {
      toast.error(`${name.replace('_', ' ')} cannot be less than 0`);
      return;
    }

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (['HS_Code', 'Average_Price', 'Safe_Stock', 'MOQ'].includes(name)) {
      handleNumberInputChange(name, value);
      return;
    }

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

      const response = await fetch(``, {
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

  // ================New Code ===========================================
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.GetVendorItemCategories);
        setCategoryList(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);
  return (
    <>

      <div className="Item-container">
        <div className="header">
          <h4 style={{ fontWeight: "600", color: "#192191" }}>Add Item Details</h4>
          <div className="header-line mb-2"></div>
        </div>
        <div className="row mb-2">
          <div className="col">
            <label>
              Item Category <span className="required">*</span>
            </label>
            <Select
              name="ItemCategory"
              value={categoryList.find(cat => cat.itemCategoryId === formData.ItemCategory) || null}
              onChange={(selectedOption) =>
                setFormData({ ...formData, ItemCategory: selectedOption.itemCategoryId })
              }
              options={categoryList}
              getOptionLabel={(option) => option.itemCategory}
              getOptionValue={(option) => option.itemCategoryId}
              placeholder="Select Category"
              isSearchable={true}
              noOptionsMessage={() => "No categories found"}
            />
          </div>
          <div className="col">
            <label>
              Company Name <span className="required">*</span>
            </label>
            <select
              name="Company_Name"
              value={formData.Company_Name}
              className="form-control"
            >
              <option value="">Select Company</option>
            </select>
          </div>
          <div className="col">
            <label>City</label>
            <input
              type="text"
              name="City"
              value={formData.City}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="col">
            <label>Industry</label>
            <select
              name="Industry"
              value={formData.Industry}
              onChange={handleInputChange}
              className="form-control"
            >
              <option value="">Select Industry</option>
            </select>
          </div>
          <div className="col">
            <label>Category</label>
            <select
              name="ItemCategory"
              value={formData.ItemCategory}
              onChange={handleInputChange}
              disabled={!formData.Industry}
              className="form-control"
            >
              <option value="">Select Category</option>
            </select>
          </div>
        </div>

        <div className="row mb-2">
          <div className="col">
            <label>Sub Category</label>
            <select
              name="Sub_Category"
              value={formData.Sub_Category}
              disabled={!formData.ItemCategory}
              className="form-control"
            >
              <option value="">Select Sub Category</option>
            </select>
          </div>
          <div className="col">
            <label>Item Name</label>
            <input
              type="text"
              name="Item_Name"
              value={formData.Item_Name}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>

          <div className="col">
            <label>
              Specification <span className="required">*</span>
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
            <label>UOM</label>
            <select
              name="Unit_Of_Measurement"
              value={formData.Unit_Of_Measurement}
              onChange={handleInputChange}
              className="form-control"
            >
              <option value="">Select UOM</option>
            </select>
          </div>
          <div className="col">
            <label>
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
        </div>

        {/* ROW 3: Grade, UOM, HS Code, Currency, Average Price */}
        <div className="row mb-2">
          <div className="col">
            <label>Currency</label>
            <select
              name="Currency"
              value={formData.Currency}
              onChange={handleInputChange}
              className="form-control"
            >
            </select>
          </div>
          <div className="col">
            <label>Avg Price</label>
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

          <div className="col">
            <label>Safe Stock</label>
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
            <label>MOQ</label>
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
          <div className="col">
            <label>Packaging</label>
            <input
              type="text"
              name="Item_Name"
              value={formData.Packaging}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
        </div>

        <div className="row mb-2">
          <div className="col">
            <label>Location Code</label>
            <input
              name="MOQ"
              value={formData.MOQ}
              onChange={handleInputChange}
              className="form-control"
              min="1"
              step="1"
            />
          </div>
          <div className="col">
            <label>GL Code</label>
            <input
              name="MOQ"
              value={formData.MOQ}
              onChange={handleInputChange}
              className="form-control"
              min="1"
              step="1"
            />
          </div>

          <div className="col">
            <label>Primary / Alternate </label>
            <div>
              {["Primary", "Alternate "].map((type) => (
                <div className="form-check" key={type}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="PrimaryandAlternate"
                    value={type}
                    checked={formData.PrimaryandAlternate === type}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label text-black" style={{ fontSize: "14px", fontWeight: "500" }}>
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="col">
            <label className="mb-2">Check Semi Finish</label>

            <div>
              {["YES", "NO"].map((option) => (
                <div className="form-check" key={option}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="CheckSemiFinish"
                    value={option}
                    checked={formData.CheckSemiFinish === option}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label text-black" style={{ fontSize: "14px", fontWeight: "500" }}>
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="col">
            <label>TC / COA</label>
            <div>
              {["Required", "Not Required"].map((option) => (
                <div className="form-check" key={option}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="TC_COA"
                    value={option}
                    checked={formData.TC_COA === option}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label text-black" style={{ fontSize: "14px", fontWeight: "500" }}>
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="row mb-3 align-items-center">
          <div className="col-lg-5 col-md-5">
            <div className="compact-upload d-flex align-items-center">

              {!imagePreview ? (
                <>
                  <label className="btn btn-outline-primary btn-sm me-3 mb-0 d-flex align-items-center gap-2">
                    <Upload size={16} />
                    Choose Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      hidden
                    />
                  </label>

                  <small className="text-muted">
                    Click to upload item image (PNG, JPG Max 5MB)
                  </small>
                </>
              ) : (
                <div className="d-flex align-items-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="preview-thumb me-3"
                  />

                  <button
                    type="button"
                    onClick={removeImage}
                    className="btn btn-sm btn-danger d-flex align-items-center gap-1"
                  >
                    <X size={14} />
                    Remove
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="mt-3 d-flex justify-content-center mb-4 gap-3">
          <button className="submit-button">
            <FaPaperPlane /> Submit
          </button>
          <button className="cancel-button">
            <FaTimes /> Cancel
          </button>
        </div>
      </div>



      <ToastContainer position="top-right" autoClose={4000} theme="colored" />
    </>
  );
}

export default CreateItem;
