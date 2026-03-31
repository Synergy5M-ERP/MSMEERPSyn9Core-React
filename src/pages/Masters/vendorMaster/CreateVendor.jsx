import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select, { components } from "react-select";
import { FaTimes, FaPaperPlane } from "react-icons/fa";
import '../../../App.css'
import axios from "axios";
import { API_ENDPOINTS } from "../../../config/apiconfig";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

export default function CreateVendor({ vendorId }) {

  const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (vendorId) {
      console.log("Edit Mode:", vendorId);
    }
  }, [vendorId]);

  const [formData, setFormData] = useState({
    ItemVendorCategory: "",
    VendorCode: "",
    industry: "",
    Category: "",
    Sub_Category: "",
    Source: "",
    Continent: "",
    Country: "",
    State_Province: "",
    Zone: "",
    City: "",
    VendorName: "",
    addresses: [],
    tempAddress1: "",
    tempAddress2: "",
    tempPin: "",
    ContactPerson: "",
    ContactNo: "",
    Email: "",
    LandlineNo: "",
    BankName: "",
    BranchName: "",
    IFSCCode: "",
    CurrentAccountNo: "",
    PanNo: "",
    GSTNo: "",
    MSMENo: "",
    StateCode: "",
    CINNo: "",
    STDPaymentDays: "",
    Website: "",
    ManualVendorCode: "",
    GLCode: "",
    BajajVendor: "",
    LedgerId: "",
    CreatedBy: "",
    PaymentTermsId: null,
    PriceBasisId: null,
  });


  const [errors, setErrors] = useState({});
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;
    if (name === "ContactPerson") {
      newValue = value.replace(/[^a-zA-Z\s]/g, "");
    }
    if (name === "ContactNo" || name === "LandlineNo") {
      newValue = value.replace(/\D/g, "");
    }
    if (name === "tempPin") {
      newValue = value.replace(/\D/g, "");
    }
    if (name === "CurrentAccountNo") {
      newValue = value.replace(/\D/g, "");
    }
    setFormData({ ...formData, [name]: newValue });
    const errorMsg = validateField(name, newValue);
    setErrors({ ...errors, [name]: errorMsg });
  };


  // ===============Fetching Item / vendor Categories ====================

  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    try {
      navigate('/masters', { replace: true, state: {} });

      setIsEditMode(false);
      setIsLocationLocked(false);
      setIsInitialLoadDone(false);
      setEditIds({ industryId: null, categoryId: null, subCategoryId: null });
      setEditLedgerIds([]);
      setEditingIndex(null);
      setEditingBankIndex(null);
      setAddressList([]);
      setBankList([]);
      setErrors({});
      setSelectedIndustry(null);
      setSelectedCategory(null);
      setSelectedSubCategory(null);
      setSelectedSource(null);
      setSelectedContinent(null);
      setSelectedCountry(null);
      setSelectedState(null);
      setSelectedCity(null);

      const defaultReselected = ledgerList.filter(l =>
        defaultCheckedLedgers.some(d => d.toLowerCase().trim() === l.label.toLowerCase().trim())
      );
      setSelectedLedgers(defaultReselected);
      const cleanState = {
        VendorCode: "", VendorName: "", ItemVendorCategory: "", industry: "",
        Category: "", Sub_Category: "", Zone: "", tempAddress1: "",
        tempAddress2: "", tempPin: "", ContactPerson: "", ContactNo: "",
        Email: "", LandlineNo: "", BankName: "", Branch: "",
        BranchName: "", IFSCCode: "", CurrentAccountNo: "", PanNo: "",
        GSTNo: "", MSME_No: "", StateCode: "", CIN_No: "",
        CINNo: "", STDPaymentDays: "", Website: "", ManualVendorCode: "",
        BajajVendor: "", PaymentTermsId: null, PriceBasisId: null,
        addresses: [],
        LedgerId: defaultReselected.map(o => o.value).join("|"),
        GLCode: defaultReselected.map(o => o.glCode).join(" | "),
        SourceId: null, ContinentId: null, CountryId: null,
        StateId: null, CityId: null, Source: "", Continent: "",
        Country: "", State: "", City: ""
      };

      setFormData(cleanState);
      restoreRegionalDefaults(cleanState);
      toast.info("Form reset to new entry mode.");

    } catch (err) {
      console.error("Cancel Error:", err);
      toast.error("Failed to reset form.");
    }
  };

  const restoreRegionalDefaults = async (baseState) => {
    try {
      const sourceRes = await axios.get(API_ENDPOINTS.GET_SOURCE);
      const domestic = sourceRes.data.find(x => x.name.toUpperCase() === "DOMESTIC");

      if (domestic) {
        const contRes = await axios.get(`${API_ENDPOINTS.GET_CONTINENT}?sourceId=${domestic.id}`);
        const asia = contRes.data.find(x => x.name.toUpperCase() === "ASIA");

        if (asia) {
          const countryRes = await axios.get(`${API_ENDPOINTS.GET_COUNTRY}?continentId=${asia.id}`);
          const india = countryRes.data.find(x => x.country_name.toUpperCase() === "INDIA");

          if (india) {
            const indiaObj = { value: india.country_id, label: india.country_name };

            setSelectedSource({ value: domestic.id, label: domestic.name });
            setContinentList(contRes.data);
            setSelectedContinent({ value: asia.id, label: asia.name });
            setCountryList(countryRes.data);
            setSelectedCountry(indiaObj);
            setFormData(prev => ({
              ...prev,
              SourceId: domestic.id,
              Source: domestic.name,
              ContinentId: asia.id,
              Continent: asia.name,
              CountryId: india.country_id,
              Country: india.country_name
            }));

            if (handleCountryChange) handleCountryChange(indiaObj);
          }
        }
      }
    } catch (e) {
      console.error("Regional restore failed:", e);
    }
  };

  const [itemvendorCategoryList, setItemVendorCategoryList] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.GetVendorCategories);
        setItemVendorCategoryList(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // =================Fetching Indsustry Category Subcategory==================

  const [industryList, setIndustryList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.GetIndusCatSubcat);
        setIndustryList(response.data);
      } catch (err) {
        console.error("Error fetching industries:", err);
      }
    };

    fetchIndustries();
  }, []);

  // ===========For Searchable Dropdwons=================
  const handleIndustryChange = async (selectedOption) => {
    setSelectedIndustry(selectedOption);

    setFormData(prev => ({
      ...prev,
      industry: selectedOption?.label || "",
      Category: "",
      Sub_Category: ""
    }));
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setCategoryList([]);
    setSubCategoryList([]);

    try {
      const response = await axios.get(
        `${API_ENDPOINTS.GetIndusCatSubcat}?industryId=${selectedOption.value}`
      );
      setCategoryList(response.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleCategoryChange = async (selectedOption) => {
    setSelectedCategory(selectedOption);
    setFormData(prev => ({
      ...prev,
      Category: selectedOption?.label || "",
      Sub_Category: ""
    }));
    setSelectedSubCategory(null);
    setSubCategoryList([]);

    try {
      const response = await axios.get(
        `${API_ENDPOINTS.GetIndusCatSubcat}?industryId=${selectedIndustry.value}&categoryId=${selectedOption.value}`
      );
      setSubCategoryList(response.data);
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  };

  const handleSubCategoryChange = (selectedOption) => {
    setSelectedSubCategory(selectedOption);
    setFormData(prev => ({
      ...prev,
      Sub_Category: selectedOption?.label || ""
    }));
  };
  const industryOptions = industryList.map((item) => ({
    value: item.industryId,
    label: item.industryName
  }));
  const categoryOptions = categoryList.map((item) => ({
    value: item.categoryId,
    label: item.categoryName
  }));

  const subCategoryOptions = subCategoryList.map((item) => ({
    value: item.subcategoryId,
    label: item.subcategoryName
  }));

  // ======================Address FIelds ==================================
  const [sourceList, setSourceList] = useState([]);
  const [continentList, setContinentList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedContinent, setSelectedContinent] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);


  useEffect(() => {
    const fetchSource = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.GET_SOURCE);

        const mappedSource = res.data.map(item => ({
          value: item.id,
          label: item.name
        }));

        setSourceList(mappedSource);

      } catch (err) {
        console.error("Error fetching source", err);
      }
    };

    fetchSource();
  }, []);
  // ===================Address Dropdwons  ===========================

  const handleSourceChange = async (selected) => {
    setSelectedSource(selected);
    setFormData(prev => ({
      ...prev,
      Source: selected?.label || "",
      Continent: "",
      Country: "",
      State_Province: "",
      City: ""
    }));
    setSelectedContinent(null);
    setSelectedCountry(null);
    setSelectedState(null);
    setSelectedCity(null);
    setContinentList([]);
    setCountryList([]);
    setStateList([]);
    setCityList([]);

    try {
      const res = await axios.get(`${API_ENDPOINTS.GET_CONTINENT}?sourceId=${selected.value}`);
      setContinentList(res.data);
    } catch (err) {
      console.error("Error fetching continent", err);
    }
  };

  const handleContinentChange = async (selected) => {
    setSelectedContinent(selected);
    setFormData(prev => ({
      ...prev,
      Continent: selected?.label || "",
      Country: "",
      State_Province: "",
      City: ""
    }));
    setSelectedCountry(null);
    setSelectedState(null);
    setSelectedCity(null);
    setCountryList([]);
    setStateList([]);
    setCityList([]);

    try {
      const res = await axios.get(`${API_ENDPOINTS.GET_COUNTRY}?continentId=${selected.value}`);
      setCountryList(res.data);
    } catch (err) {
      console.error("Error fetching country", err);
    }
  };
  const handleCountryChange = async (selected) => {
    setSelectedCountry(selected);
    setFormData(prev => ({
      ...prev,
      Country: selected?.label || "",
      State_Province: "",
      City: ""
    }));
    setSelectedState(null);
    setSelectedCity(null);
    setStateList([]);
    setCityList([]);

    try {
      const res = await axios.get(`${API_ENDPOINTS.GET_STATE}?countryId=${selected.value}`);
      setStateList(res.data);
    } catch (err) {
      console.error("Error fetching state", err);
    }
  };
  const handleStateChange = async (selected) => {
    setSelectedState(selected);
    setFormData(prev => ({
      ...prev,
      State_Province: selected?.label || "",
      City: ""
    }));
    setSelectedCity(null);
    setCityList([]);

    try {
      const res = await axios.get(`${API_ENDPOINTS.GET_CITY}?stateId=${selected.value}`);
      setCityList(res.data);
    } catch (err) {
      console.error("Error fetching city", err);
    }
  };
  const handleCityChange = (selected) => {
    setSelectedCity(selected);
    setFormData(prev => ({
      ...prev,
      City: selected?.label || ""
    }));
  };

  useEffect(() => {
    const setDefaults = async () => {
      try {
        const sourceRes = await axios.get(API_ENDPOINTS.GET_SOURCE);

        const mappedSource = sourceRes.data.map(item => ({
          value: item.id,
          label: item.name
        }));

        setSourceList(mappedSource);
        if (!vendorId) {
          const defaultSource = mappedSource.find(
            x => x.label.toUpperCase() === "DOMESTIC"
          );
          if (!defaultSource) return;
          setSelectedSource(defaultSource);
          setFormData(prev => ({
            ...prev,
            Source: defaultSource.label,
            SourceId: defaultSource.value
          }));

          const continentRes = await axios.get(
            `${API_ENDPOINTS.GET_CONTINENT}?sourceId=${defaultSource.value}`
          );
          setContinentList(continentRes.data);

          const defaultContinent = continentRes.data.find(
            x => x.name.toUpperCase() === "ASIA"
          );
          if (!defaultContinent) return;
          const selectedContinentObj = {
            value: defaultContinent.id,
            label: defaultContinent.name
          };
          setSelectedContinent(selectedContinentObj);

          setFormData(prev => ({
            ...prev,
            Continent: selectedContinentObj.label
          }));
          const countryRes = await axios.get(
            `${API_ENDPOINTS.GET_COUNTRY}?continentId=${defaultContinent.id}`
          );
          setCountryList(countryRes.data);

          const defaultCountry = countryRes.data.find(
            x => x.country_name.toUpperCase() === "INDIA"
          );
          if (defaultCountry) {
            handleCountryChange({
              value: defaultCountry.country_id,
              label: defaultCountry.country_name
            });
          }
        }

      } catch (err) {
        console.error("Error setting defaults", err);
      }
    };
    setDefaults();
  }, [vendorId]);

  // ==================Multiple Ledgers =====================

  const [ledgerList, setLedgerList] = useState([]);
  const [selectedLedgers, setSelectedLedgers] = useState([]);

  const customValueContainer = ({ children, ...props }) => {
    const selected = props.getValue();
    const labels = selected.map(x => x.label).join(" | ");

    return (
      <components.ValueContainer {...props}>
        {selected.length > 0 && (
          <div
            style={{
              position: "absolute",
              left: "10px",
              right: "30px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            {labels}
          </div>
        )}
        {children}
      </components.ValueContainer>
    );
  };
  const defaultCheckedLedgers = [
    "Raw Materials",
    "Trade Payables – Domestic",
    "Trade Payables – Imports",
    "Trade Payables – MSME",
    "SGST Input",
    "IGST Input",
    "CGST Input"
  ];
  useEffect(() => {
    const fetchLedgers = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.Ledger);

        const ledgerOptions = response.data.map(item => ({
          value: item.accountLedgerId,
          label: item.accountLedgerName,
          glCode: item.glCode
        }));
        setLedgerList(ledgerOptions);
        const preSelected = ledgerOptions.filter(l =>
          defaultCheckedLedgers.some(
            d => d.toLowerCase().trim() === l.label.toLowerCase().trim()
          )
        );
        setSelectedLedgers(preSelected);
        setFormData(prev => ({
          ...prev,
          LedgerId: preSelected.map(o => o.value).join(","),
          GLCode: preSelected.map(o => o.glCode).join(" | ")
        }));
      } catch (err) {
        console.error("Error fetching ledgers:", err);
      }
    };
    fetchLedgers();
  }, []);

  const handleLedgerChange = (options) => {
    const selected = options || [];
    setSelectedLedgers(selected);

    const ledgerIdsString = selected.map(o => o.value).join("|");
    const glCodesString = selected.map(o => o.glCode).join(" | ");
    setFormData(prev => ({
      ...prev,
      LedgerId: ledgerIdsString || "",
      GLCode: glCodesString || ""
    }));
  };

  const OptionWithCheckbox = (props) => {
    return (
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          readOnly
          style={{ marginRight: 8 }}
        />
        {props.label}
      </components.Option>
    );
  };

  // ===============Hard Coded Dropdwon===================
  const [dropdowns] = useState({
    zones: ["EAST", "WEST", "NORTH", "SOUTH", "CENTRAL"]
  });
  // ===============Multiple Address Fileds==========================
  const [addressList, setAddressList] = useState([]);
  const [showAddressTable, setShowAddressTable] = useState(false);
  const [isLocationLocked, setIsLocationLocked] = useState(false);

  const handleAddAddress = () => {
    if (!formData.tempAddress1 || !formData.tempAddress2 || !formData.tempPin) {
      toast.error("Please fill all address fields");
      return;
    }
    const newAddress = {
      sources: selectedSource?.label,
      sourceId: selectedSource?.value,
      address1: formData.tempAddress1,
      address2: formData.tempAddress2,
      pincode: formData.tempPin,
      continentId: selectedContinent?.value,
      continent: selectedContinent?.label,
      countryId: selectedCountry?.value,
      country: selectedCountry?.label,
      stateId: selectedState?.value,
      state: selectedState?.label,
      cityId: selectedCity?.value,
      city: selectedCity?.label,
      zoneId: formData.Zone
    };
    if (editIndex !== null) {
      const updatedList = [...addressList];
      updatedList[editIndex] = newAddress;

      setAddressList(updatedList);
      setEditIndex(null);
      toast.success("Address updated");
    } else {

      setAddressList([...addressList, newAddress]);
    }
    setFormData({
      ...formData,
      tempAddress1: "",
      tempAddress2: "",
      tempPin: "",
      Zone: ""
    });
    if (!isLocationLocked) {
      setIsLocationLocked(true);
    }
  };

  const removeAddress = (index) => {
    const updated = [...addressList];
    updated.splice(index, 1);
    setAddressList(updated);

    if (updated.length === 0) {
      setIsLocationLocked(false);
    }
  };

  const [paymentTermsList, setPaymentTermsList] = useState([]);

  useEffect(() => {
    fetchPaymentTerms();
  }, []);

  const fetchPaymentTerms = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GetPaymentTerms);

      if (!response.ok) {
        throw new Error("Failed to fetch payment terms");
      }
      const data = await response.json();
      console.log("Payment Terms API Data:", data);
      setPaymentTermsList(data);

    } catch (error) {
      console.error("Error fetching payment terms:", error);
    }
  };

  const [deliveryTermsList, setDeliveryTermsList] = useState([]);

  useEffect(() => {
    fetchDeliveryTerms();
  }, []);

  const fetchDeliveryTerms = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GetDeliveryTerms);
      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      const formattedData = data.map(item => ({
        value: item.priceBasisId || item.PriceBasisId,
        label: item.priceBasis || item.PriceBasis,
        ...item
      }));

      setDeliveryTermsList(formattedData);
    } catch (error) {
      console.error("Error fetching delivery terms:", error);
    }
  };

  const validateForm = () => {

    if (!formData.ItemVendorCategory) {
      return "Please select a Vendor Category.";
    }
    if (!selectedIndustry) {
      return "Please select an Industry.";
    }
    if (!selectedCategory) {
      return "Please select a Category.";
    }
    if (!selectedSubCategory) {
      return "Please select a Subcategory.";
    }
    if (!formData.VendorName?.trim()) return "Company Name is required.";
    if (!formData.GSTNo?.trim()) return "GST Number is required.";
    if (!formData.ContactNo?.trim()) return "Contact Number is required.";

    if (!addressList || addressList.length === 0) {
      return "Please add at least one address.";
    }
    if (!formData.PaymentTermsId) {
      return "Please select Payment Terms.";
    }
    if (!formData.PriceBasisId) {
      return "Please select Delivery Terms";
    }
    if (!formData.PriceBasisId) {
      return "Please Enter Standard Payment Days";
    }
    return null;
  };

  const handleSubmitClick = async () => {
    toast.dismiss();

    const errorMessage = validateForm();
    if (errorMessage) {
      toast.error(errorMessage, { autoClose: 3000 });
      return;
    }
    const fieldNames = [
      "GSTNo", "ContactNo", "Email", "LandlineNo", "PanNo",
      "tempPin", "CurrentAccountNo", "IFSCCode", "CINNo", "STDPaymentDays",
    ];

    for (let field of fieldNames) {
      const err = validateField(field, formData[field]);
      if (err) {
        setErrors(prev => ({ ...prev, [field]: err }));
        toast.error(err, { autoClose: 3000 });
        return;
      }
    }
    if (!bankList.length) {
      toast.error("Please add at least one bank detail", { autoClose: 3000 });
      return;
    }
    const result = await Swal.fire({
      title: "Is this Bajaj Vendor?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No"
    });
    const bajajVendorValue = result.isConfirmed ? "Yes" : "No";

    const payload = {
      vendor: {
        vendorCategoryId: parseInt(formData.ItemVendorCategory) || 0,
        industryId: selectedIndustry?.value || 0,
        categoryId: selectedCategory?.value || 0,
        subCategoryId: selectedSubCategory?.value || 0,
        sourceId: selectedSource?.value || 0,
        vendorCode: formData.VendorCode || "",
        manualVendorCode: formData.ManualVendorCode || "",
        vendorName: formData.VendorName || "",
        contactPerson: formData.ContactPerson || "",
        email: formData.Email || "",
        contactNo: formData.ContactNo || "",
        landlineNo: formData.LandlineNo || "",
        gstNo: formData.GSTNo || "",
        panNo: formData.PanNo || "",
        msmeNo: formData.MSME_No || "",
        cinNo: formData.CINNo || formData.CIN_No || "",
        stateCode: formData.StateCode || "",
        website: formData.Website || "",
        glCode: selectedLedgers?.map(o => o.glCode).join(" | ") || "",
        ledgerId: selectedLedgers?.map(o => o.value).join("|") || "",
        bajajVendor: bajajVendorValue,
        stdPaymentDays: String(formData.STDPaymentDays || ""),
        deliveryTermsid: parseInt(formData.PriceBasisId) || 0,
        paymentTermsId: parseInt(formData.PaymentTermsId) || 0,
        vendorId: isEditMode ? parseInt(vendorId) : 0,
        isActive: true
      },
      bankDetails: (bankList || []).map(bank => ({
        vendorbankDetailsId: bank.vendorbankDetailsId || 0,
        currentAccountNo: bank.currentAccountNo,
        bankName: bank.bankName,
        branchName: bank.branchName,
        ifscCode: bank.ifscCode,
        isActive: true
      })),

      addresses: (addressList || []).map(addr => ({
        vendorAddressId: addr.vendorAddressId || 0,
        address1: addr.address1,
        address2: addr.address2,
        pincode: parseInt(addr.pincode) || 0,
        continentId: addr.continentId,
        countryId: addr.countryId,
        stateId: addr.stateId,
        cityId: addr.cityId,
        zone: addr.zoneId,
        isActive: true
      }))
    };
    await submitForm(payload);
  };

  const submitForm = async (payload) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(API_ENDPOINTS.SaveOrUpdateVendor, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const resData = await response.json();
      if (response.ok) {

        Swal.fire({
          icon: "success",
          title: "Success",
          text: resData.message
        }).then(() => {
          handleCancel();
        });

      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: resData.message || "Server rejected the data"
        });
      }
    } catch (err) {
      console.error("Network error:", err);
      Swal.fire("Error", "Network error occurred", "error");
    }
  };

  const getVendorCode = async () => {
    try {
      const params = new URLSearchParams({
        industry: selectedIndustry?.label || "",
        category: selectedCategory?.label || "",
        subCategory: selectedSubCategory?.label || "",
        source: selectedSource?.label || "",
        continent: selectedContinent?.label || "",
        country: selectedCountry?.label || "",
        state: selectedState?.label || "",
        city: selectedCity?.label || ""
      });

      const url = `${API_ENDPOINTS.GenerateVendorCode}?${params}`;
      const response = await fetch(url);
      const data = await response.json();
      const code = data.vendorCode || data.VendorCode;

      if (code) {
        setFormData(prev => ({
          ...prev,
          VendorCode: code
        }));
      }
    } catch (error) {
      console.error("Vendor code error:", error);
    }
  };

  useEffect(() => {
    if (
      !selectedIndustry ||
      !selectedCategory ||
      !selectedSubCategory ||
      !selectedSource ||
      !selectedContinent ||
      !selectedCountry ||
      !selectedState ||
      !selectedCity
    ) return;

    if (isEditMode && !isInitialLoadDone) return;
    getVendorCode();
  }, [
    selectedIndustry,
    selectedCategory,
    selectedSubCategory,
    selectedSource,
    selectedContinent,
    selectedCountry,
    selectedState,
    selectedCity,
    isInitialLoadDone
  ]);

  //  ======================== Multiple Bank Details ======================

  const [bankList, setBankList] = useState([]);
  const [showBankTable, setShowBankTable] = useState(false);

  const handleAddBank = () => {
    if (!formData.CurrentAccountNo || !formData.BankName || !formData.IFSCCode) {
      alert("Please fill required bank details");
      return;
    }
    const newBank = {
      currentAccountNo: formData.CurrentAccountNo,
      bankName: formData.BankName,
      branchName: formData.BranchName,
      ifscCode: formData.IFSCCode
    };
    setBankList(prev => [...prev, newBank]);
    setFormData(prev => ({
      ...prev,
      CurrentAccountNo: "",
      BankName: "",
      BranchName: "",
      IFSCCode: ""
    }));
  };

  const handleDeleteBank = (index) => {
    const updatedList = bankList.filter((_, i) => i !== index);
    setBankList(updatedList);
  };

  const validateField = (name, value) => {
    switch (name) {
      case "GSTNo":
        if (!value) return "GST No is required.";
        if (!/^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1})$/.test(value))
          return "Enter valid GST No (Ex: 22AAAAA0000A1Z5)";
        break;

      case "ContactNo":
        if (!value) return "Contact No is required.";
        if (!/^\d{10,12}$/.test(value))
          return "Enter valid Mobile No (10 or 12 digits)";
        break;

      case "Email":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Enter valid Email ID (Ex: abc@gmail.com";
        break;

      case "LandlineNo":
        if (value && !/^\d{6,15}$/.test(value))
          return "Enter valid Landline No (6-15 digits)";
        break;

      case "PanNo":
        if (value && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value))
          return "Enter valid PAN No (Ex: ABCDE1234F)";
        break;

      case "tempPin":
        if (value && !/^\d{6}$/.test(value))
          return "Enter valid PIN code (6 digits only)";
        break;

      case "CurrentAccountNo":
        if (value && !/^\d{9,18}$/.test(value))
          return "Enter valid Account No (9 to 18 digits)";
        break;

      case "IFSCCode":
        if (value && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value))
          return "Enter valid IFSC Code (Ex: SBIN0001234)";
        break;

      case "CINNo":
        if (value && !/^[A-Z]{1}[0-9]{5}[A-Z0-9]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/.test(value))
          return "Enter valid CIN No (Ex:U12345MH2010PTC123456)";
        break;

      case "STDPaymentDays":
        if (!value) return "STD Payment Days is required.";
        if (value <= 0) return "Payment days should be greater than 0";
        break;

      default:
        return "";
    }
    return "";
  };

  const [isEditMode, setIsEditMode] = useState(false);
  const [editLedgerIds, setEditLedgerIds] = useState([]);
  const headerText = vendorId ? "Update Vendor Details" : "Add Vendor Details";

  const loadEditAddressDropdowns = async (addr, disableDropdowns = false) => {
    try {
      const continentRes = await axios.get(`${API_ENDPOINTS.GET_CONTINENT}?sourceId=${addr.sourceId}`);
      setContinentList(continentRes.data);
      const selectedCont = continentRes.data.find(c => c.id === addr.continentId);
      if (selectedCont) setSelectedContinent({ value: selectedCont.id, label: selectedCont.name });

      const countryRes = await axios.get(`${API_ENDPOINTS.GET_COUNTRY}?continentId=${addr.continentId}`);
      setCountryList(countryRes.data);
      const selectedCountry = countryRes.data.find(c => c.country_id === addr.countryId);
      if (selectedCountry) setSelectedCountry({ value: selectedCountry.country_id, label: selectedCountry.country_name });

      const stateRes = await axios.get(`${API_ENDPOINTS.GET_STATE}?countryId=${addr.countryId}`);
      setStateList(stateRes.data);
      const selectedState = stateRes.data.find(s => s.state_id === addr.stateId);
      if (selectedState) setSelectedState({ value: selectedState.state_id, label: selectedState.state_name });

      const cityRes = await axios.get(`${API_ENDPOINTS.GET_CITY}?stateId=${addr.stateId}`);
      setCityList(cityRes.data);
      const selectedCity = cityRes.data.find(c => c.city_id === addr.cityId);
      if (selectedCity) setSelectedCity({ value: selectedCity.city_id, label: selectedCity.city_name });

      if (disableDropdowns) {
        setIsLocationLocked(true);
      }
    } catch (err) {
      console.error("Error loading edit address dropdowns", err);
    }
  };

  const [editIds, setEditIds] = useState({
    industryId: null,
    categoryId: null,
    subCategoryId: null
  });


  useEffect(() => {
    if (!vendorId || !sourceList.length) {
      setIsEditMode(false);
      return;
    }
    let isCancelled = false;
    setIsEditMode(true);

    const fetchVendor = async () => {
      try {
        const res = await axios.get(`${API_ENDPOINTS.GetVendorById}/${vendorId}`);
        if (isCancelled) return;
        const vendor = res.data.vendor;
        const vendorSource = res.data.source;
        const addresses = res.data.addresses || [];
        const bankDetails = res.data.bankDetails || [];
        if (!vendor) return;

        setFormData(prev => ({
          ...prev,
          VendorCode: vendor.vendorCode || "",
          VendorName: vendor.vendorName || "",
          ItemVendorCategory: vendor.vendorCategoryId || "",
          GSTNo: vendor.gstNo || "",
          StateCode: vendor.stateCode || "",
          ContactPerson: vendor.contactPerson || "",
          ContactNo: vendor.contactNo || "",
          PanNo: vendor.panNo || "",
          Email: vendor.email || "",
          LandlineNo: vendor.landlineNo || "",
          ManualVendorCode: vendor.manualVendorCode || "",
          CINNo: vendor.cinNo || "",
          MSME_No: vendor.msmeNo || "",
          STDPaymentDays: vendor.stdPaymentDays || "",
          Website: vendor.website || "",
          SourceId: vendorSource?.sourceId || null,
          PaymentTermsId: vendor.paymentTermsId || null,
          PriceBasisId: vendor.deliveryTermsid || null,
          LedgerId: vendor.ledgerId || "",
        }));

        const mappedAddresses = addresses.map(a => ({
          vendorAddressId: a.vendorAddressId,
          address1: a.address1,
          address2: a.address2,
          pincode: a.pincode,
          zoneId: a.zone,
          continentId: a.continentId,
          continent: a.continentName,
          countryId: a.countryId,
          country: a.countryName,
          stateId: a.stateId,
          state: a.stateName,
          cityId: a.cityId,
          city: a.cityName,
          sourceId: vendorSource?.sourceId || null,
          sources: vendorSource?.sourceName || "",
        }));
        setAddressList(mappedAddresses);

        const mappedBanks = bankDetails.map(b => ({
          vendorbankDetailsId: b.vendorbankDetailsId,
          currentAccountNo: b.currentAccountNo,
          bankName: b.bankName,
          branchName: b.branchName,
          ifscCode: b.ifscCode
        }));
        setBankList(mappedBanks);

        if (mappedAddresses.length > 0) {
          const firstAddr = mappedAddresses[0];
          setIsLocationLocked(true);

          setSelectedSource({ value: firstAddr.sourceId, label: firstAddr.sources });
          setSelectedContinent({ value: firstAddr.continentId, label: firstAddr.continent });
          setSelectedCountry({ value: firstAddr.countryId, label: firstAddr.country });
          setSelectedState({ value: firstAddr.stateId, label: firstAddr.state });
          setSelectedCity({ value: firstAddr.cityId, label: firstAddr.city });

          setFormData(prev => ({
            ...prev,
            SourceId: firstAddr.sourceId,
            ContinentId: firstAddr.continentId,
            CountryId: firstAddr.countryId,
            StateId: firstAddr.stateId,
            CityId: firstAddr.cityId,
            Zone: firstAddr.zoneId
          }));

          const [contRes, countryRes, stateRes, cityRes] = await Promise.all([
            axios.get(`${API_ENDPOINTS.GET_CONTINENT}?sourceId=${firstAddr.sourceId}`),
            axios.get(`${API_ENDPOINTS.GET_COUNTRY}?continentId=${firstAddr.continentId}`),
            axios.get(`${API_ENDPOINTS.GET_STATE}?countryId=${firstAddr.countryId}`),
            axios.get(`${API_ENDPOINTS.GET_CITY}?stateId=${firstAddr.stateId}`)
          ]);
          if (!isCancelled) {
            setContinentList(contRes.data);
            setCountryList(countryRes.data);
            setStateList(stateRes.data);
            setCityList(cityRes.data);
          }
        }
        setEditIds({
          industryId: vendor.industryId || null,
          categoryId: vendor.categoryId || null,
          subCategoryId: vendor.subCategoryId || null,
        });
        const ledgerIds = vendor.ledgerId
          ? vendor.ledgerId.split("|").map(Number)
          : [];
        setEditLedgerIds(ledgerIds);

      } catch (err) {
        if (!isCancelled) console.error("Fetch Vendor Error:", err);
      }
    };
    fetchVendor();
    return () => {
      isCancelled = true;
    };
  }, [vendorId, sourceList]);


  useEffect(() => {
    if (!editIds.industryId || industryOptions.length === 0 || isInitialLoadDone) return;

    const selectedInd = industryOptions.find(
      i => i.value === editIds.industryId
    );
    setSelectedIndustry(selectedInd);
    setIsInitialLoadDone(true);

  }, [editIds.industryId, industryOptions, isInitialLoadDone]);

  useEffect(() => {
    if (!editIds.industryId || isInitialLoadDone) return;

    const loadCategories = async () => {
      try {
        const res = await axios.get(
          `${API_ENDPOINTS.GetIndusCatSubcat}?industryId=${editIds.industryId}`
        );
        setCategoryList(res.data);
        const selectedCat = res.data.find(
          c => c.categoryId === editIds.categoryId
        );
        if (selectedCat) {
          setSelectedCategory({
            value: selectedCat.categoryId,
            label: selectedCat.categoryName
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadCategories();
  }, [editIds.industryId, isInitialLoadDone]);


  useEffect(() => {
    const fetchLedgers = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.Ledger);
        const ledgerOptions = response.data.map(item => ({
          value: item.accountLedgerId,
          label: item.accountLedgerName,
          glCode: item.glCode
        }));

        setLedgerList(ledgerOptions);

        if (editLedgerIds.length > 0) {
          const selected = ledgerOptions.filter(l =>
            editLedgerIds.includes(l.value)
          );
          setSelectedLedgers(selected);
          setFormData(prev => ({
            ...prev,
            LedgerId: selected.map(o => o.value).join("|"),
            GLCode: selected.map(o => o.glCode).join(" | ")
          }));
          return;
        }
        const preSelected = ledgerOptions.filter(l =>
          defaultCheckedLedgers.some(
            d => d.toLowerCase().trim() === l.label.toLowerCase().trim()
          )
        );

        setSelectedLedgers(preSelected);
        setFormData(prev => ({
          ...prev,
          LedgerId: preSelected.map(o => o.value).join("|"),
          GLCode: preSelected.map(o => o.glCode).join(" | ")
        }));

      } catch (err) {
        console.error("Error fetching ledgers:", err);
      }
    };
    fetchLedgers();
  }, [editLedgerIds]);

  useEffect(() => {
    if (!editIds.categoryId || isInitialLoadDone) return;

    const loadSubCategories = async () => {
      try {
        const res = await axios.get(
          `${API_ENDPOINTS.GetIndusCatSubcat}?industryId=${editIds.industryId}&categoryId=${editIds.categoryId}`
        );
        setSubCategoryList(res.data);
        const selectedSub = res.data.find(
          s => s.subcategoryId === editIds.subCategoryId
        );
        if (selectedSub) {
          setSelectedSubCategory({
            value: selectedSub.subcategoryId,
            label: selectedSub.subcategoryName
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadSubCategories();

  }, [editIds.categoryId, isInitialLoadDone]);

  useEffect(() => {
    if (!sourceList.length || !formData.SourceId) return;

    const selectedSrc = sourceList.find(
      s => s.value === formData.SourceId
    );
    if (selectedSrc) {
      setSelectedSource(selectedSrc);
    }
  }, [sourceList, formData.SourceId]);


  const [editIndex, setEditIndex] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const isEditingAddress = editingIndex !== null;

  const handleEditAddress = (index) => {
    const addr = addressList[index];

    setFormData(prev => ({
      ...prev,
      tempAddress1: addr.address1,
      tempAddress2: addr.address2,
      tempPin: addr.pincode,
      Zone: addr.zoneId,
    }));

    setIsLocationLocked(true);
    setSelectedContinent({ value: addr.continentId, label: addr.continent });
    setSelectedCountry({ value: addr.countryId, label: addr.country });
    setSelectedState({ value: addr.stateId, label: addr.state });
    setSelectedCity({ value: addr.cityId, label: addr.city });
    setEditingIndex(index);
  };

  const handleUpdateAddress = () => {
    if (editingIndex === null || !addressList[editingIndex]) return;
    const oldAddress = addressList[editingIndex];

    const updatedAddr = {
      ...oldAddress,
      address1: formData.tempAddress1,
      address2: formData.tempAddress2,
      pincode: formData.tempPin,
      zoneId: formData.Zone,
      sourceId: selectedSource?.value,
      sources: selectedSource?.label,
      continentId: selectedContinent?.value,
      continent: selectedContinent?.label,
      countryId: selectedCountry?.value,
      country: selectedCountry?.label,
      stateId: selectedState?.value,
      state: selectedState?.label,
      cityId: selectedCity?.value,
      city: selectedCity?.label,
    };
    setAddressList(prev =>
      prev.map((addr, idx) =>
        idx === editingIndex ? updatedAddr : addr
      )
    );

    setEditingIndex(null);
    setFormData(prev => ({
      ...prev,
      tempAddress1: "",
      tempAddress2: "",
      tempPin: "",
      Zone: "",
    }));
  };

  const [editingBankIndex, setEditingBankIndex] = useState(null);
  const isEditingBank = editingBankIndex !== null;
  const handleEditBank = (index) => {
    const bank = bankList[index];

    setFormData(prev => ({
      ...prev,
      CurrentAccountNo: bank.currentAccountNo,
      BankName: bank.bankName,
      BranchName: bank.branchName,
      IFSCCode: bank.ifscCode
    }));
    setEditingBankIndex(index);
  };

  const handleUpdateBank = () => {
    if (editingBankIndex === null || !bankList[editingBankIndex]) return;
    if (!formData.CurrentAccountNo || !formData.BankName || !formData.IFSCCode) {
      alert("Please fill required bank details");
      return;
    }
    const oldBank = bankList[editingBankIndex];
    const updatedBank = {
      ...oldBank,
      currentAccountNo: formData.CurrentAccountNo.trim(),
      bankName: formData.BankName.trim(),
      branchName: formData.BranchName.trim(),
      ifscCode: formData.IFSCCode.trim()
    };

    setBankList(prev =>
      prev.map((bank, idx) =>
        idx === editingBankIndex ? updatedBank : bank
      )
    );
    setEditingBankIndex(null);
    setFormData(prev => ({
      ...prev,
      CurrentAccountNo: "",
      BankName: "",
      BranchName: "",
      IFSCCode: ""
    }));
  };
  return (
    <>

      <div className="Item-container">
        <div className="header">
          <h4 style={{ fontWeight: "600", color: "#192191" }}>{isEditMode ? "Edit Vendor" : "Create Vendor"}</h4>
          <div className="header-line mb-2"></div>
        </div>
        <div className="accordion" id="vendorAccordion">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#basicDetails">
                <i className="bi bi-person-vcard me-2"></i>
                Vendor Basic Details
                <div style={{ display: "flex", gap: "10px", marginLeft: "57%", justifyContent: "center", alignItems: "center" }}>
                  <label>Vendor Code</label>
                  <input
                    type="text"
                    name="VendorCode"
                    value={formData.VendorCode || ""}
                    className="form-control"
                    readOnly />
                </div>
              </button>
            </h2>

            <div id="basicDetails" className="accordion-collapse collapse show" data-bs-parent="#vendorAccordion">
              <div className="accordion-body">
                <div className="row mb-4">
                  <div className="col">
                    <label>Vendor Category <span className="required">*</span></label>
                    <Select
                      name="ItemVendorCategory"
                      classNamePrefix="react-select"
                      value={
                        itemvendorCategoryList.find(
                          (cat) => cat.itemVendorCategoryId === formData.ItemVendorCategory
                        ) || null
                      }
                      onChange={(selectedOption) =>
                        setFormData({
                          ...formData,
                          ItemVendorCategory: selectedOption.itemVendorCategoryId
                        })
                      }
                      options={itemvendorCategoryList}
                      getOptionLabel={(option) =>
                        option.itemVendorCategory?.toUpperCase()
                      }
                      getOptionValue={(option) =>
                        option.itemVendorCategoryId
                      }
                      placeholder="Select Vendor Category"
                      isSearchable
                      noOptionsMessage={() => "No categories found"} />
                  </div>

                  <div className="col">
                    <label>Industry</label>
                    <Select
                      options={industryOptions}
                      classNamePrefix="react-select"
                      value={selectedIndustry}
                      onChange={handleIndustryChange}
                      placeholder="Select Industry"
                      isSearchable />
                  </div>

                  <div className="col">
                    <label>Category</label>
                    <Select
                      options={categoryOptions}
                      value={selectedCategory}
                      classNamePrefix="react-select"
                      onChange={handleCategoryChange}
                      placeholder="Select Category"
                      isSearchable
                      isDisabled={!selectedIndustry}
                    />
                  </div>

                  <div className="col">
                    <label>Subcategory</label>
                    <Select
                      options={subCategoryOptions}
                      value={selectedSubCategory}
                      classNamePrefix="react-select"
                      onChange={handleSubCategoryChange}
                      placeholder="Select Subcategory"
                      isSearchable
                      isDisabled={!selectedCategory} />
                  </div>

                  <div className="col">
                    <label>Company Name <span className="required">*</span></label>
                    <input type="text" name="VendorName" value={formData.VendorName} onChange={handleInputChange} className="form-control" placeholder="Company name" />
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col">
                    <label>GST No <span className="required">*</span></label>
                    <input
                      type="text"
                      name="GSTNo"
                      value={formData.GSTNo}
                      onChange={handleInputChange}
                      className={`form-control ${errors.GSTNo ? "is-invalid" : ""}`}
                      placeholder="Enter GST No" />
                    {errors.GSTNo && <div className="invalid-feedback">{errors.GSTNo}</div>}
                  </div>

                  <div className="col">
                    <label>Contact Person</label>
                    <input
                      type="text"
                      name="ContactPerson"
                      value={formData.ContactPerson}
                      onChange={handleInputChange}
                      className={`form-control ${errors.ContactPerson ? "is-invalid" : ""}`}
                      placeholder="Enter Contact Person" />
                    {errors.ContactPerson && (
                      <div className="invalid-feedback">{errors.ContactPerson}</div>
                    )}
                  </div>

                  <div className="col">
                    <label>Contact Number <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      name="ContactNo"
                      value={formData.ContactNo}
                      onChange={handleInputChange}
                      maxLength="12"
                      inputMode="numeric"
                      className={`form-control ${errors.ContactNo ? "is-invalid" : ""}`}
                      placeholder="Enter Contact Number" />
                    {errors.ContactNo && <div className="invalid-feedback">{errors.ContactNo}</div>}
                  </div>

                  <div className="col">
                    <label>Email ID</label>
                    <input
                      type="email"
                      name="Email"
                      value={formData.Email}
                      onChange={handleInputChange}
                      className={`form-control ${errors.Email ? "is-invalid" : ""}`}
                      placeholder="Enter Email ID" />
                    {errors.Email && <div className="invalid-feedback">{errors.Email}</div>}
                  </div>

                  <div className="col">
                    <label>Landline</label>
                    <input
                      type="text"
                      name="LandlineNo"
                      value={formData.LandlineNo}
                      onChange={handleInputChange}
                      maxLength="15"
                      inputMode="numeric"
                      className={`form-control ${errors.LandlineNo ? "is-invalid" : ""}`}
                      placeholder="Enter Landline No" />
                    {errors.LandlineNo && <div className="invalid-feedback">{errors.LandlineNo}</div>}
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col-md-3" style={{ width: "20%" }}>
                    <label>PAN No</label>
                    <input
                      type="text"
                      name="PanNo"
                      value={formData.PanNo}
                      onChange={handleInputChange}
                      className={`form-control ${errors.PanNo ? "is-invalid" : ""}`}
                      placeholder="Enter PAN No" />
                    {errors.PanNo && <div className="invalid-feedback">{errors.PanNo}</div>}
                  </div>

                  <div className="col-md-3" style={{ width: "20%" }}>
                    <label>Vendor Code</label>
                    <input type="text" name="ManualVendorCode" value={formData.ManualVendorCode} onChange={handleInputChange} className="form-control" placeholder="Enter Vendor Code" />
                  </div>

                  <div className="col-md-3" style={{ width: "20%" }}>
                    <label>Account Ledger</label>
                    <Select
                      options={ledgerList}
                      value={selectedLedgers}
                      onChange={handleLedgerChange}
                      placeholder="Select Ledger"
                      isMulti
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                      classNamePrefix="react-select"
                      blurInputOnSelect={false}
                      menuShouldCloseOnBlur={true}
                      menuPlacement="auto"
                      components={{
                        Option: OptionWithCheckbox,
                        ValueContainer: customValueContainer
                      }}
                      styles={{
                        multiValue: () => ({ display: "none" }),
                        option: (provided) => ({
                          ...provided,
                          backgroundColor: "white",
                          color: "black"
                        }),
                        control: (provided) => ({
                          ...provided,
                          minHeight: 38
                        })
                      }} />
                  </div>

                  <div className="col-md-3" style={{ width: "40%" }}>
                    <label>GL Code</label>
                    <input
                      type="text"
                      name="GLCode"
                      value={formData.GLCode || ""}
                      className="form-control"
                      readOnly />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#locationDetails">
                <i className="bi bi-geo-alt me-2"></i>Location Details
              </button>
            </h2>

            <div id="locationDetails" className="accordion-collapse collapse" data-bs-parent="#vendorAccordion">
              <div className="accordion-body">
                <div className="row mb-4">
                  <div className="col">
                    <label>Source</label>
                    <Select
                      options={sourceList}
                      value={selectedSource}
                      classNamePrefix="react-select"
                      onChange={handleSourceChange}
                      placeholder="Select Source"
                      isSearchable
                      isDisabled={isLocationLocked} />
                  </div>

                  <div className="col">
                    <label>Continent</label>
                    <Select
                      options={continentList.map(x => ({ value: x.id, label: x.name }))}
                      value={selectedContinent}
                      onChange={handleContinentChange}
                      classNamePrefix="react-select"
                      placeholder="Select Continent"
                      isSearchable
                      isDisabled={isLocationLocked || !selectedSource} />
                  </div>

                  <div className="col">
                    <label>Country</label>
                    <Select
                      options={countryList.map(x => ({ value: x.country_id, label: x.country_name }))}
                      value={selectedCountry}
                      onChange={handleCountryChange}
                      classNamePrefix="react-select"
                      placeholder="Select Country"
                      isSearchable
                      isDisabled={isLocationLocked || !selectedContinent} />
                  </div>

                  <div className="col">
                    <label>State/Province</label>
                    <Select
                      options={stateList.map(x => ({ value: x.state_id, label: x.state_name }))}
                      value={selectedState}
                      onChange={handleStateChange}
                      classNamePrefix="react-select"
                      placeholder="Select State"
                      isSearchable
                      isDisabled={isLocationLocked || !selectedCountry} />
                  </div>

                  <div className="col">
                    <label>Zone</label>
                    <select name="Zone" value={formData.Zone} onChange={handleInputChange} className="form-control">
                      <option value="">Select Zone</option>
                      {dropdowns.zones.map((z) => (<option key={z} value={z}>{z}</option>))}
                    </select>
                  </div>

                </div>
                <div className="row mt-4 mb-2">
                  <div className="col">
                    <label>City</label>
                    <Select
                      options={cityList.map(x => ({ value: x.city_id, label: x.city_name }))}
                      value={selectedCity}
                      classNamePrefix="react-select"
                      onChange={handleCityChange}
                      placeholder="Select City"
                      isDisabled={isLocationLocked || !selectedState} />
                  </div>
                  <div className="col">
                    <label>State Code</label>
                    <input type="text" name="StateCode" value={formData.StateCode} onChange={handleInputChange} className="form-control" placeholder="Enter State code" />
                  </div>
                  <div className="col">
                    <label>Address 1</label>
                    <input type="text" name="tempAddress1" value={formData.tempAddress1} onChange={handleInputChange} className="form-control" placeholder="Address line 1" />
                  </div>

                  <div className="col">
                    <label>Address 2</label>
                    <input type="text" name="tempAddress2" value={formData.tempAddress2} onChange={handleInputChange} className="form-control" placeholder="Address line 2" />
                  </div>

                  <div className="col">
                    <label>PIN</label>
                    <input
                      type="text"
                      name="tempPin"
                      value={formData.tempPin}
                      onChange={handleInputChange}
                      maxLength="6"
                      className={`form-control ${errors.tempPin ? "is-invalid" : ""}`}
                      placeholder="Enter PIN code" />
                    {errors.tempPin && <div className="invalid-feedback">{errors.tempPin}</div>}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 mb-3">
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        flexWrap: "nowrap",
                        overflowX: "auto"
                      }}>
                      <button
                        type="button"
                        className="btn-address"
                        onClick={isEditingAddress ? handleUpdateAddress : handleAddAddress}>
                        <i className={`bi ${isEditingAddress ? "bi-pencil-square" : "bi-plus-circle"} me-2`}></i>
                        {isEditingAddress ? "Update Address" : "Add Address"}
                      </button>


                      {isEditingAddress && (
                        <button
                          type="button"
                          className="btn-address"
                          style={{ backgroundColor: "#6c757d", color: "white" }}
                          onClick={() => {

                            setEditingIndex(null);
                            setFormData(prev => ({
                              ...prev,
                              tempAddress1: "",
                              tempAddress2: "",
                              tempPin: "",
                              Zone: null
                            }));
                            setIsLocationLocked(true);
                          }}>
                          Cancel Edit
                        </button>
                      )}

                      {addressList.length > 0 && (
                        <button
                          type="button"
                          className="btn-address"
                          style={{ backgroundColor: "#929292", color: "white" }}
                          onClick={() => setShowAddressTable(prev => !prev)}>
                          {showAddressTable ? "Hide Address Details" : "View Address Details"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {showAddressTable && addressList.length > 0 && (
                  <table className="table table-bordered address-table" style={{ marginTop: "30px", marginBottom: "30px" }}>
                    <thead>
                      <tr>
                        <th>Source</th>
                        <th>Address 1</th>
                        <th>Address 2</th>
                        <th>Pin</th>
                        <th>City</th>
                        <th>State</th>
                        <th>Country</th>
                        <th>Zone</th>
                        {isEditMode && <th>Edit</th>}
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {addressList.map((addr, index) => (
                        <tr key={index}>
                          <td>{addr.sources}</td>
                          <td>{addr.address1}</td>
                          <td>{addr.address2}</td>
                          <td>{addr.pincode}</td>
                          <td>{addr.city}</td>
                          <td>{addr.state}</td>
                          <td>{addr.country}</td>
                          <td>{addr.zoneId}</td>
                          {isEditMode && (
                            <td>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleEditAddress(index)}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                            </td>
                          )}
                          <td>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => removeAddress(index)}
                            >
                              <i className="bi bi-x-lg"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#BankDetails">
                <i className="bi bi-bank me-2"></i>Bank Details
              </button>
            </h2>
            <div id="BankDetails" className="accordion-collapse collapse" data-bs-parent="#vendorAccordion">
              <div className="accordion-body">
                <div className="row">
                  <div className="col">
                    <label>Current A/C No</label>
                    <input
                      type="text"
                      name="CurrentAccountNo"
                      value={formData.CurrentAccountNo}
                      onChange={handleInputChange}
                      maxLength="18"
                      className={`form-control ${errors.CurrentAccountNo ? "is-invalid" : ""}`}
                      placeholder="Enter Your Account No" />
                    {errors.CurrentAccountNo && (
                      <div className="invalid-feedback">{errors.CurrentAccountNo}</div>
                    )}
                  </div>
                  <div className="col">
                    <label>Bank Name</label>
                    <input type="email" name="BankName" value={formData.BankName} onChange={handleInputChange} className="form-control" placeholder="Enter Bank Name" />
                  </div>

                  <div className="col">
                    <label>Branch <span className="required">*</span></label>
                    <input type="text" name="BranchName" value={formData.BranchName} onChange={handleInputChange} className="form-control" placeholder="Enter Branch" />
                  </div>
                  <div className="col">
                    <label>IFSC Code</label>
                    <input
                      type="text"
                      name="IFSCCode"
                      value={formData.IFSCCode}
                      onChange={handleInputChange}
                      className={`form-control ${errors.IFSCCode ? "is-invalid" : ""}`}
                      placeholder="Enter IFSC Code" />
                    {errors.IFSCCode && <div className="invalid-feedback">{errors.IFSCCode}</div>}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12 mb-3">

                    <div style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      flexWrap: "nowrap",
                      overflowX: "auto"
                    }}>

                      <button
                        type="button"
                        className="btn-address"
                        onClick={() => {
                          if (editingBankIndex !== null) {
                            handleUpdateBank();
                          } else {
                            handleAddBank();
                          }
                        }} >
                        <i className={`bi ${editingBankIndex !== null ? "bi-pencil-square" : "bi-plus-circle"} me-2`}></i>
                        {editingBankIndex !== null ? "Update Bank Details" : "Add Bank Details"}
                      </button>

                      {editingBankIndex !== null && (
                        <button
                          type="button"
                          className="btn-address"
                          style={{ backgroundColor: "#6c757d", color: "white" }}
                          onClick={() => {
                            setEditingBankIndex(null);
                            setFormData(prev => ({
                              ...prev,
                              CurrentAccountNo: "",
                              BankName: "",
                              BranchName: "",
                              IFSCCode: ""
                            }));
                          }}>
                          Cancel Edit
                        </button>
                      )}

                      {bankList.length > 0 && (
                        <button
                          type="button"
                          className="btn-address"
                          style={{ backgroundColor: "#929292", color: "white" }}
                          onClick={() => setShowBankTable(prev => !prev)}>
                          {showBankTable ? "Hide Bank Details" : "View Bank Details"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                {showBankTable && bankList.length > 0 && (
                  <div className="table-responsive">
                    <table className="table table-bordered bank-table">
                      <thead>
                        <tr>
                          <th>Account No</th>
                          <th>Bank Name</th>
                          <th>Branch</th>
                          <th>IFSC</th>
                          {isEditMode && <th>Edit</th>}
                          <th>Remove</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bankList.map((bank, index) => (
                          <tr key={index}>
                            <td>{bank.currentAccountNo}</td>
                            <td>{bank.bankName}</td>
                            <td>{bank.branchName}</td>
                            <td>{bank.ifscCode}</td>

                            {isEditMode && (
                              <td>
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => handleEditBank(index)}
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                              </td>
                            )}

                            <td>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteBank(index)}
                              >
                                <i className="bi bi-x-lg"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#OtherDetails">
                <i className="bi bi-list-check me-2"></i>Other Details
              </button>
            </h2>

            <div id="OtherDetails" className="accordion-collapse collapse" data-bs-parent="#vendorAccordion">
              <div className="accordion-body">
                <div className="row mb-4">
                  <div className="col">
                    <label> Payment Terms <span className="required">*</span></label>
                    <Select
                      options={paymentTermsList}
                      classNamePrefix="react-select"
                      value={
                        paymentTermsList.find(
                          (x) => x.paymentTermsId === formData.PaymentTermsId
                        ) || null
                      }
                      onChange={(selectedOption) =>
                        setFormData({
                          ...formData,
                          PaymentTermsId: selectedOption?.paymentTermsId
                        })
                      }
                      getOptionLabel={(option) => option.paymentTerms}
                      getOptionValue={(option) => option.paymentTermsId}
                      placeholder="Select Payment Terms"
                      isSearchable />

                  </div>
                  <div className="col">
                    <label> Delivery Terms <span className="required">*</span></label>
                    <Select
                      options={deliveryTermsList}
                      classNamePrefix="react-select"
                      value={deliveryTermsList.find(opt => opt.value === formData.PriceBasisId) || null}
                      onChange={(selectedOption) =>
                        setFormData({
                          ...formData,
                          PriceBasisId: selectedOption ? selectedOption.value : ""
                        })
                      }
                      placeholder="Select Delivery Terms"
                      isSearchable />
                  </div>

                  <div className="col">
                    <label>CIN No</label>
                    <input
                      type="text"
                      name="CINNo"
                      value={formData.CINNo}
                      onChange={handleInputChange}
                      className={`form-control ${errors.CINNo ? "is-invalid" : ""}`}
                      placeholder="Enter CIN No" />
                    {errors.CINNo && <div className="invalid-feedback">{errors.CINNo}</div>}
                  </div>

                  <div className="col">
                    <label>MSME No</label>
                    <input type="text" name="MSME_No" value={formData.MSME_No} onChange={handleInputChange} className="form-control" placeholder="Enter MSME No" />
                  </div>
                  <div className="col">
                    <label>STD Payment Days <span className="text-danger">*</span></label>
                    <input
                      type="number"
                      name="STDPaymentDays"
                      value={formData.STDPaymentDays}
                      onChange={handleInputChange}
                      className={`form-control ${errors.STDPaymentDays ? "is-invalid" : ""}`}
                      placeholder="Enter Payment Days" />
                    {errors.STDPaymentDays && (
                      <div className="invalid-feedback">{errors.STDPaymentDays}</div>
                    )}
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col">
                    <label>Website</label>
                    <input type="text" name="Website" value={formData.Website} onChange={handleInputChange} className="form-control" placeholder="Enter Website URL" />
                  </div>
                  <div className="col"></div>
                  <div className="col"></div>
                  <div className="col"></div>
                  <div className="col"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 d-flex justify-content-center mb-4 gap-3">
          <button
            type="button"
            className="submit-button"
            onClick={handleSubmitClick}>
            <FaPaperPlane /> Submit
          </button>
          <button className="cancel-button"
            onClick={handleCancel}>
            <FaTimes /> Cancel
          </button>
        </div>
      </div >
    </>
  );
}