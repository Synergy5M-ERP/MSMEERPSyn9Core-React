import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CheckCircle, X, Loader } from "lucide-react";

export default function CreateVendor() {
  const [formData, setFormData] = useState({
    Vendor_Categories: "",
    industry: "",
    Category: "",
    Sub_Category: "",
    Source: "",
    Continent: "",
    Country: "",
    State_Province: "",
    Zone: "",
    City: "",
    Company_Name: "",
    addresses: [],
    tempAddress1: "",
    tempAddress2: "",
    tempPin: "",
    Contact_Person: "",
    Contact_Number: "",
    Email: "",
    Landline: "",
    Bank_Name: "",
    Branch: "",
    IFSC_No: "",
    CurrentAcNo: "",
    PAN_No: "",
    GST_Number: "",
    MSME_No: "",
    State_Code: "",
    CIN_No: "",
    Nature_Of_Business: "",
    Std_Payment_Days: "",
    Website: ""
  });

  const [industries, setIndustries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  const [dropdownData, setDropdownData] = useState({
    sources: [],
    continents: [],
    countries: [],
    states: [],
    cities: []
  });

  const [dropdowns] = useState({
    vendorCategories: [
      "SELLER",
      "BUYER",
      "TRADER",
      "SERVICE PROVIDER",
      "JOB WORK",
      "FOREIGNSUP",
      "FOREIGNBUY"
    ],
    zones: ["EAST", "WEST", "NORTH", "SOUTH", "CENTRAL"],
    natureOfBusinessList: [
      "MANUFACTURER",
      "TRADER",
      "DEALER",
      "DISTRIBUTOR",
      "SERVICE PROVIDER"
    ]
  });

  const [loading, setLoading] = useState(false);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);

  const API_BASE_URL = "http://localhost:49980/Vendor";

  // Initial load: industries + sources
  useEffect(() => {
    loadInitialDropdowns();
  }, []);

  const loadInitialDropdowns = async () => {
    setLoadingDropdowns(true);
    try {
      const [industriesRes, sourcesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/GetIndustries`),
        fetch(`${API_BASE_URL}/GetSource`)
      ]);

      const [industriesData, sources] = await Promise.all([
        industriesRes.json(),
        sourcesRes.json()
      ]);

      setIndustries(Array.isArray(industriesData) ? industriesData : []);
      setDropdownData((prev) => ({
        ...prev,
        sources: Array.isArray(sources) ? sources : []
      }));

      if (industriesData.length > 0) {
        setSelectedIndustry(industriesData[0].Id);
      }
    } catch (err) {
      console.error("loadInitialDropdowns error:", err);
      toast.error("Failed to load dropdown data: " + (err.message || ""));
    } finally {
      setLoadingDropdowns(false);
    }
  };

  // Load categories when industry changes
  useEffect(() => {
    if (selectedIndustry) {
      fetch(`${API_BASE_URL}/GetCategories?industryId=${selectedIndustry}`)
        .then((res) => res.json())
        .then((data) => {
          setCategories(Array.isArray(data) ? data : []);
          if (data.length > 0) {
            setSelectedCategory(data[0].Id);
          } else {
            setSelectedCategory('');
            setSubcategories([]);
            setSelectedSubcategory('');
          }
        })
        .catch((error) => {
          console.error('Error fetching categories:', error);
          setCategories([]);
          setSelectedCategory('');
        });
    } else {
      setCategories([]);
      setSelectedCategory('');
      setSubcategories([]);
      setSelectedSubcategory('');
    }
  }, [selectedIndustry]);

  // Load subcategories when category changes
  useEffect(() => {
    if (selectedCategory) {
      fetch(`${API_BASE_URL}/GetSubcategories?CategoryId=${selectedCategory}`)
        .then((res) => res.json())
        .then((data) => {
          setSubcategories(Array.isArray(data) ? data : []);
          if (data.length > 0) {
            setSelectedSubcategory(data[0].Id);
          } else {
            setSelectedSubcategory('');
          }
        })
        .catch((error) => {
          console.error('Error fetching subcategories:', error);
          setSubcategories([]);
          setSelectedSubcategory('');
        });
    } else {
      setSubcategories([]);
      setSelectedSubcategory('');
    }
  }, [selectedCategory]);

  // Location flows (source -> continent -> country -> state -> city)
  useEffect(() => {
    if (formData.Source) {
      loadContinents(formData.Source);
    } else {
      setDropdownData((p) => ({
        ...p,
        continents: [],
        countries: [],
        states: [],
        cities: []
      }));
      setFormData((p) => ({
        ...p,
        Continent: "",
        Country: "",
        State_Province: "",
        City: ""
      }));
    }
  }, [formData.Source]);

  useEffect(() => {
    if (formData.Source && formData.Continent) {
      loadCountries(formData.Source, formData.Continent);
    } else {
      setDropdownData((p) => ({ ...p, countries: [], states: [], cities: [] }));
      setFormData((p) => ({ ...p, Country: "", State_Province: "", City: "" }));
    }
  }, [formData.Source, formData.Continent]);

  useEffect(() => {
    if (formData.Source && formData.Continent && formData.Country) {
      loadStates(formData.Source, formData.Continent, formData.Country);
    } else {
      setDropdownData((p) => ({ ...p, states: [], cities: [] }));
      setFormData((p) => ({ ...p, State_Province: "", City: "" }));
    }
  }, [formData.Source, formData.Continent, formData.Country]);

  useEffect(() => {
    if (
      formData.Source &&
      formData.Continent &&
      formData.Country &&
      formData.State_Province
    ) {
      loadCities(
        formData.Source,
        formData.Continent,
        formData.Country,
        formData.State_Province
      );
    } else {
      setDropdownData((p) => ({ ...p, cities: [] }));
      setFormData((p) => ({ ...p, City: "" }));
    }
  }, [formData.Source, formData.Continent, formData.Country, formData.State_Province]);

  async function loadContinents(source) {
    try {
      const res = await fetch(`${API_BASE_URL}/GetContinent?source=${encodeURIComponent(source)}`);
      const data = await res.json();
      setDropdownData((prev) => ({
        ...prev,
        continents: Array.isArray(data) ? data : [],
        countries: [],
        states: [],
        cities: []
      }));
      setFormData((p) => ({ ...p, Continent: "", Country: "", State_Province: "", City: "" }));
    } catch (err) {
      console.error("loadContinents:", err);
      setDropdownData((p) => ({ ...p, continents: [], countries: [], states: [], cities: [] }));
    }
  }

  async function loadCountries(source, continent) {
    try {
      const res = await fetch(
        `${API_BASE_URL}/GetCountry?source=${encodeURIComponent(source)}&continent=${encodeURIComponent(continent)}`
      );
      const data = await res.json();
      setDropdownData((prev) => ({ ...prev, countries: Array.isArray(data) ? data : [], states: [], cities: [] }));
      setFormData((p) => ({ ...p, Country: "", State_Province: "", City: "" }));
    } catch (err) {
      console.error("loadCountries:", err);
      setDropdownData((p) => ({ ...p, countries: [], states: [], cities: [] }));
    }
  }

  async function loadStates(source, continent, country) {
    try {
      const res = await fetch(
        `${API_BASE_URL}/GetState?source=${encodeURIComponent(source)}&continent=${encodeURIComponent(continent)}&country=${encodeURIComponent(country)}`
      );
      const data = await res.json();
      setDropdownData((prev) => ({ ...prev, states: Array.isArray(data) ? data : [], cities: [] }));
      setFormData((p) => ({ ...p, State_Province: "", City: "" }));
    } catch (err) {
      console.error("loadStates:", err);
      setDropdownData((p) => ({ ...p, states: [], cities: [] }));
    }
  }

  async function loadCities(source, continent, country, state) {
    try {
      const res = await fetch(
        `${API_BASE_URL}/GetCity?source=${encodeURIComponent(source)}&continent=${encodeURIComponent(continent)}&country=${encodeURIComponent(country)}&state=${encodeURIComponent(state)}`
      );
      const data = await res.json();
      setDropdownData((prev) => ({ ...prev, cities: Array.isArray(data) ? data : [] }));
      setFormData((p) => ({ ...p, City: "" }));
    } catch (err) {
      console.error("loadCities:", err);
      setDropdownData((p) => ({ ...p, cities: [] }));
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAddress = () => {
    const { tempAddress1, tempAddress2, tempPin, addresses } = formData;
    if (!tempAddress1?.trim() || !tempAddress2?.trim() || !tempPin?.trim()) {
      toast.error("Please fill all address fields before adding.");
      return;
    }
    const address = `${tempAddress1.toUpperCase()} | ${tempAddress2.toUpperCase()} | ${tempPin}`;
    if (addresses.includes(address)) {
      toast.error("This address already added.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      addresses: [...prev.addresses, address],
      tempAddress1: "",
      tempAddress2: "",
      tempPin: ""
    }));
    toast.success("Address added");
  };

  const handleRemoveAddress = (idx) => {
    setFormData((prev) => ({ ...prev, addresses: prev.addresses.filter((_, i) => i !== idx) }));
    toast.info("Address removed");
  };

  const handleCancel = () => {
    setFormData({
      Vendor_Categories: "",
      industry: "",
      Category: "",
      Sub_Category: "",
      Source: "",
      Continent: "",
      Country: "",
      State_Province: "",
      Zone: "",
      City: "",
      Company_Name: "",
      addresses: [],
      tempAddress1: "",
      tempAddress2: "",
      tempPin: "",
      Contact_Person: "",
      Contact_Number: "",
      Email: "",
      Landline: "",
      Bank_Name: "",
      Branch: "",
      IFSC_No: "",
      CurrentAcNo: "",
      PAN_No: "",
      GST_Number: "",
      MSME_No: "",
      State_Code: "",
      CIN_No: "",
      Nature_Of_Business: "",
      Std_Payment_Days: "",
      Website: ""
    });
    setSelectedIndustry('');
    setSelectedCategory('');
    setSelectedSubcategory('');
    toast.info("Form cleared!");
  };

  const validateForm = () => {
    if (!formData.Company_Name || formData.Company_Name.trim() === "") {
      toast.error("Company Name is required.");
      return false;
    }
    if (!formData.GST_Number || formData.GST_Number.trim() === "") {
      toast.error("GST Number is required.");
      return false;
    }
    if (!formData.Contact_Number || formData.Contact_Number.trim() === "") {
      toast.error("Contact Number is required.");
      return false;
    }
    if (!formData.addresses || formData.addresses.length === 0) {
      toast.error("Please add at least one address.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Get the selected names from IDs
      const selectedIndustryName = industries.find(i => i.Id === parseInt(selectedIndustry))?.IndustryName || "";
      const selectedCategoryName = categories.find(c => c.Id === parseInt(selectedCategory))?.CategoryName || "";
      const selectedSubcategoryName = subcategories.find(s => s.Id === parseInt(selectedSubcategory))?.SubcategoryName || "";

      const payload = {
        ...formData,
        industry: selectedIndustryName,
        Category: selectedCategoryName,
        Sub_Category: selectedSubcategoryName,
        Address: Array.isArray(formData.addresses) ? formData.addresses.join(" | ") : formData.addresses
      };

      // Remove temporary fields
      delete payload.addresses;
      delete payload.tempAddress1;
      delete payload.tempAddress2;
      delete payload.tempPin;

      const res = await fetch(`${API_BASE_URL}/Create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (result && (result.success === true || res.status === 200 || res.status === 201)) {
        toast.success(`Vendor Created Successfully! ${result.message || ""}`, { autoClose: 4000 });
        handleCancel();
      } else {
        toast.error(`Failed: ${result?.message || "Server returned error"}`);
      }
    } catch (err) {
      console.error("submit error:", err);
      toast.error("Error: " + (err.message || "Submission failed"));
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
      <div className="app-container" style={{ backgroundColor: "white", minHeight: "100vh" }}>
        <div className="form-card scrollbar" style={{ marginTop: "1rem", borderRadius: 12, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}>
          <div className="form-content" style={{ padding: "1.8rem" }}>
            {/* Vendor Classification */}
            <div className="header">
        <h4 className='fw-500 text-primary'>Add Vendor Details</h4>
        <div className="header-line"></div>
      </div>
            {/* <div className="section"> */}
              <div className="row">
                {/* Vendor Category */}
                <div className="form-group col-3">
                  <label className="form-label">Vendor Category</label>
                  <select name="Vendor_Categories" value={formData.Vendor_Categories} onChange={handleInputChange} className="form-input">
                    <option value="">Select Vendor Category</option>
                    {dropdowns.vendorCategories.map((vc) => (<option key={vc} value={vc}>{vc}</option>))}
                  </select>
                </div>

                {/* Industry */}
                <div className="form-group col-3">
                  <label htmlFor="industrySelect" className="form-label">Industry</label>
                  <select
                    id="industrySelect"
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="form-input"
                  >
                    <option value="">Select Industry</option>
                    {industries.map((industry) => (
                      <option key={industry.Id} value={industry.Id}>
                        {industry.IndustryName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div className="form-group col-3">
                  <label htmlFor="categorySelect" className="form-label">Category</label>
                  <select
                    id="categorySelect"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="form-input"
                    disabled={!selectedIndustry || categories.length === 0}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.Id} value={category.Id}>
                        {category.CategoryName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sub Category */}
                <div className="form-group col-3">
                  <label htmlFor="subcategorySelect" className="form-label">Subcategory</label>
                  <select
                    id="subcategorySelect"
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                    className="form-input"
                    disabled={!selectedCategory || subcategories.length === 0}
                  >
                    <option value="">Select Subcategory</option>
                    {subcategories.map((subcategory) => (
                      <option key={subcategory.Id} value={subcategory.Id}>
                        {subcategory.SubcategoryName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            {/* </div> */}

            {/* Location Section Row 1 */}
            <div className='row'>
              <div className="form-group col-3">
                <label className="form-label">Source</label>
                <select name="Source" value={formData.Source} onChange={handleInputChange} className="form-input">
                  <option value="">Select Source</option>
                  {(dropdownData.sources || []).map((s, idx) => (<option key={idx} value={s}>{s}</option>))}
                </select>
              </div>

              <div className="form-group col-3">
                <label className="form-label">Continent</label>
                <select name="Continent" value={formData.Continent} onChange={handleInputChange} disabled={!formData.Source} className="form-input">
                  <option value="">Select Continent</option>
                  {(dropdownData.continents || []).map((c, idx) => (<option key={idx} value={c}>{c}</option>))}
                </select>
              </div>

              <div className="form-group col-3">
                <label className="form-label">Country</label>
                <select name="Country" value={formData.Country} onChange={handleInputChange} disabled={!formData.Continent} className="form-input">
                  <option value="">Select Country</option>
                  {(dropdownData.countries || []).map((c, idx) => (<option key={idx} value={c}>{c}</option>))}
                </select>
              </div>

              <div className="form-group col-3">
                <label className="form-label">State/Province</label>
                <select name="State_Province" value={formData.State_Province} onChange={handleInputChange} disabled={!formData.Country} className="form-input">
                  <option value="">Select State</option>
                  {(dropdownData.states || []).map((s, idx) => (<option key={idx} value={s}>{s}</option>))}
                </select>
              </div>
            </div>

            {/* Location Section Row 2 */}
            <div className="row">
              <div className="form-group col-3">
                <label className="form-label">City</label>
                <select name="City" value={formData.City} onChange={handleInputChange} disabled={!formData.State_Province} className="form-input">
                  <option value="">Select City</option>
                  {(dropdownData.cities || []).map((c, idx) => (<option key={idx} value={c}>{c}</option>))}
                </select>
              </div>

              <div className="form-group col-3">
                <label className="form-label">Zone</label>
                <select name="Zone" value={formData.Zone} onChange={handleInputChange} className="form-input">
                  <option value="">Select Zone</option>
                  {dropdowns.zones.map((z) => (<option key={z} value={z}>{z}</option>))}
                </select>
              </div>

              <div className="form-group col-3">
                <label className="form-label">Company Name <span className="required">*</span></label>
                <input type="text" name="Company_Name" value={formData.Company_Name} onChange={handleInputChange} className="form-input" placeholder="Company name" />
              </div>

              <div className="form-group col-3">
                <label className="form-label">Nature of Business</label>
                <select name="Nature_Of_Business" value={formData.Nature_Of_Business} onChange={handleInputChange} className="form-input">
                  <option value="">Select Nature</option>
                  {dropdowns.natureOfBusinessList.map((n) => (<option key={n} value={n}>{n}</option>))}
                </select>
              </div>
            </div>

            {/* Address Section */}
            <div className="row">
              <div className="form-group col-3">
                <label className="form-label">Address 1</label>
                <input type="text" name="tempAddress1" value={formData.tempAddress1} onChange={handleInputChange} className="form-input" placeholder="Address line 1" />
              </div>

              <div className="form-group col-3">
                <label className="form-label">Address 2</label>
                <input type="text" name="tempAddress2" value={formData.tempAddress2} onChange={handleInputChange} className="form-input" placeholder="Address line 2" />
              </div>

              <div className="form-group col-3">
                <label className="form-label">PIN</label>
                <input type="text" name="tempPin" value={formData.tempPin} onChange={handleInputChange} className="form-input" placeholder="PIN code" />
              </div>

              <div className="form-group col-3">
                <button type="button" onClick={handleAddAddress} className="btn btn-success mt-4">Add Address</button>
              </div>
            </div>

            {/* Contact Information */}
            <div className="section" style={{ marginBottom: "1rem" }}>
              <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Contact Person</label>
                  <input type="text" name="Contact_Person" value={formData.Contact_Person} onChange={handleInputChange} className="form-input" placeholder="Contact person name" />
                </div>

                <div className="form-group">
                  <label className="form-label">Email ID</label>
                  <input type="email" name="Email" value={formData.Email} onChange={handleInputChange} className="form-input" placeholder="Enter email" />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Number <span className="required">*</span></label>
                  <input type="text" name="Contact_Number" value={formData.Contact_Number} onChange={handleInputChange} className="form-input" placeholder="Contact number" />
                </div>

                <div className="form-group">
                  <label className="form-label">Landline</label>
                  <input type="text" name="Landline" value={formData.Landline} onChange={handleInputChange} className="form-input" placeholder="Landline" />
                </div>
              </div>
            </div>

         

            {/* Bank & Tax */}
            <div className="section" style={{ marginBottom: "1rem" }}>
              <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">PAN No</label>
                  <input type="text" name="PAN_No" value={formData.PAN_No} onChange={handleInputChange} className="form-input" />
                </div>

                <div className="form-group">
                  <label className="form-label">GST No <span className="required">*</span></label>
                  <input type="text" name="GST_Number" value={formData.GST_Number} onChange={handleInputChange} className="form-input" />
                </div>

                <div className="form-group">
                  <label className="form-label">MSME No</label>
                  <input type="text" name="MSME_No" value={formData.MSME_No} onChange={handleInputChange} className="form-input" />
                </div>

                <div className="form-group">
                  <label className="form-label">State Code</label>
                  <input type="text" name="State_Code" value={formData.State_Code} onChange={handleInputChange} className="form-input" />
                </div>

                <div className="form-group">
                  <label className="form-label">STD Payment Days</label>
                  <input type="number" name="Std_Payment_Days" value={formData.Std_Payment_Days} onChange={handleInputChange} className="form-input" />
                </div>

                <div className="form-group">
                  <label className="form-label">Website</label>
                  <input type="text" name="Website" value={formData.Website} onChange={handleInputChange} className="form-input" placeholder="Website URL" />
                </div>
              </div>
            </div>
   {/* Address Table */}
            {formData.addresses.length > 0 && (
              <div className="section" style={{ marginBottom: "1rem" }}>
                <h5 style={{ marginBottom: "1rem", color: "#428bca" }}>Added Addresses</h5>
                <div style={{ overflowX: "auto" }}>
                  <table className="address-table" style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#428bca", color: "white" }}>
                        <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Sr. No.</th>
                        <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Address Line 1</th>
                        <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Address Line 2</th>
                        <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>PIN Code</th>
                        <th style={{ padding: "12px", textAlign: "center", border: "1px solid #ddd" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.addresses.map((address, idx) => {
                        const parts = address.split(" | ");
                        return (
                          <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "white" }}>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>{idx + 1}</td>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>{parts[0] || ""}</td>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>{parts[1] || ""}</td>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>{parts[2] || ""}</td>
                            <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center" }}>
                              <button 
                                type="button" 
                                className="btn btn-sm btn-danger" 
                                onClick={() => handleRemoveAddress(idx)}
                                style={{ padding: "6px 12px", fontSize: "12px" }}
                              >
                                <X size={14} style={{ marginRight: "4px" }} />
                                Remove
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {/* Actions */}
            <div className="action-buttons" style={{ display: "flex", justifyContent: "center", gap: 12 }}>
              <button type="button" onClick={handleSubmit} className="btn btn-primary" disabled={loading} style={{ width: "140px", fontSize: "14px" }}>
                {loading ? (<><Loader className="btn-spinner" size={16} /> Submitting...</>) : (<>Submit</>)}
              </button>
              <button type="button" onClick={handleCancel} className="btn btn-danger" disabled={loading} style={{ width: "140px", fontSize: "14px" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
      <style jsx>{`
        body { font-size: 14px; }
        .form-input { padding: 10px; border-radius: 8px; border: 1.5px solid #ddd; width: 100%; box-sizing: border-box; }
        .form-label { margin-bottom: 6px; color: #428bca; font-size: 14px; display: block; font-weight: 500; }
        .btn { padding: 10px 20px; border-radius: 6px; border: none; cursor: pointer; font-weight: 500; transition: all 0.3s; }
        .btn-primary { background: #428bca; color: white; }
        .btn-primary:hover { background: #3071a9; }
        .btn-danger { background: #d9534f; color: white; }
        .btn-danger:hover { background: #c9302c; }
        .btn-success { background: #5cb85c; color: white; }
        .btn-success:hover { background: #4cae4c; }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .required { color: #e11d48; }
        .btn-spinner { animation: spin 1s linear infinite; display: inline-block; }
       
        .row { display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; }
        .col-3 { flex: 1; min-width: 200px; }
        .form-group { display: flex; flex-direction: column; }
        .mt-4 { margin-top: 1.5rem; }
        .address-table th { font-weight: 600; }
        .address-table td { font-size: 13px; }
        .btn-sm { padding: 6px 12px; font-size: 12px; }
        @keyframes spin { 
          from { transform: rotate(0deg); } 
          to { transform: rotate(360deg); } 
        }
      `}</style>
    </>
  );
}