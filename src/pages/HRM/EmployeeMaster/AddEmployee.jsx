import React, { useState, useEffect } from 'react';
import axios from "axios";   // ✅ REQUIRED
import { useLocation, useNavigate,useParams  } from "react-router-dom";
import { toast } from "react-toastify";

import {
  User,
  FileText,
  DollarSign,
  Home,
  PlusCircle,
  Info,
  FileCheck,
  GraduationCap,
  ShoppingCart,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { API_ENDPOINTS } from "../../../config/apiconfig";
const AddEmployee = () => {
  const [activeSection, setActiveSection] = useState('employee');
  const [currentForm, setCurrentForm] = useState('employee'); // 'employee', 'employer', 'salary'
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
const [authorityLevel, setAuthorityLevel] = useState("");
const [authorities, setAuthorities] = useState([]);

const location = useLocation();
const navigate = useNavigate();

// 👇 if data exists → edit mode
const { empCode } = useParams();
const isEditMode = Boolean(empCode);

  const [employeeInfo, setEmployeeInfo] = useState({
    title: '',
    name: '',
    middleName: '',
    surname: '',
    gender: '',
    dob: '',
    bloodGroup: '',
    email: '',
    contactNo: '',
    marriedStatus: '',
    address: '',
    sameAsAddress: false,
    permanentAddress: '',
    qualification: '',
    country: '',
    state: '',
    city: '',
    aadharNo: '',
    panNo: '',
    bankAccountNo: '',
    bankName: '',
    ifscCode: '',
    nominee: '',
    relation: '',
    uan: '',
    epfoAcNo: '',
    previousExperience: '',
    previousIndustry: '',
    department: "",
  designation: ""
  });

  const [employerInfo, setEmployerInfo] = useState({
    category: '',
    dateOfJoining: '',
    noticesPeriod: '',
    weeklyOff: '',
    dateOfLeaving: '',
    dateOfReleaving: '',
    shiftHours: '',
    department: '',
    otCalculation: '',
    esicPwnNo: '',
    pfContribution: '',
    currency: 'INR',
    pfNo: '',
    esicNoPwnNo: '',
    authorityLevel: '',
    designation: '',
    ctc: '',
    aadharPancard: null
  });

  const [salaryStructure, setSalaryStructure] = useState({
    monthlyGrossSalary: '',
    monthlyBasicSalary: '',
    da: '',
    dailySalary: '',
    monthlySalary: '',
    leaveTravelAllowance: '',
    additionalBenefits: '',
    performanceIncentive: '',
    pfContribution: '',
    esic: '',
    stockOption: '',
    car: '',
    telephone: '',
    medicalAllowance: '',
    totalDeduction: '',
    houseRentAllowance: '',
    hourlySalary: '',
    annualIncrement: '',
    annualIncDate: '',
    totalMonth: '',
    professionalTax: '',
    annualCtcRs: ''
  });
  const decodedEmpCode = decodeURIComponent(empCode); // "25/00001"
  console.log(decodedEmpCode);
  const [expandedSections, setExpandedSections] = useState({
    employee: true,
    employer: true,
    salary: true
  });
useEffect(() => {
  if (isEditMode) {
    fetchEmployeeData();
  }
}, [empCode]);
const fetchEmployeeData = async () => {
  try {
   const res = await axios.get(
  `${API_ENDPOINTS.GetEmployeeByEmpCode}/${encodeURIComponent(decodedEmpCode)}`
);

    const data = res.data;

    // ✅ Employee Info
    setEmployeeInfo({
      title: data.title ?? "",
      name: data.name ?? "",
      middleName: data.middleName ?? "",
      surname: data.surname ?? "",
      gender: data.gender ?? "",
      dob: data.dob ? data.dob.split("T")[0] : "",
      bloodGroup: data.bloodGroup ?? "",
      email: data.email ?? "",
      contactNo: data.contact_NO ?? "",
      marriedStatus: data.marriedStatus ?? "",
      address: data.address ?? "",
      sameAsAddress: false,
      permanentAddress: data.permanentAddress ?? "",
      qualification: data.qualification ?? "",
      country: data.country ?? "",
      state: data.state ?? "",
      city: data.city ?? "",
      aadharNo: data.aadharNo ?? "",
      panNo: data.panNo ?? "",
      bankAccountNo: data.bankAccountNo ?? "",
      bankName: data.bankName ?? "",
      ifscCode: data.ifscCode ?? "",
      nominee: data.nominee ?? "",
      relation: data.relation ?? "",
      uan: data.uan ?? "",
      epfoAcNo: data.epfoAcNo ?? "",
      previousExperience: data.previousExperience ?? "",
      previousIndustry: data.previousIndustry ?? "",
      department: data.department ?? "",
      designation: data.designation ?? ""
    });

    // ✅ Employer Info
    setEmployerInfo({
      category: data.category ?? "",
      dateOfJoining: data.dateOfJoining?.split("T")[0] ?? "",
      noticesPeriod: data.noticesPeriod ?? "",
      weeklyOff: data.weeklyOff ?? "",
      dateOfLeaving: data.dateOfLeaving?.split("T")[0] ?? "",
      dateOfReleaving: data.dateOfReleaving?.split("T")[0] ?? "",
      shiftHours: data.shiftHours ?? "",
      department: data.department ?? "",
      otCalculation: data.otCalculation ?? "",
      esicPwnNo: data.esicPwnNo ?? "",
      pfContribution: data.pfContribution ?? "",
      currency: data.currency ?? "INR",
      pfNo: data.pfNo ?? "",
      esicNoPwnNo: data.esicNoPwnNo ?? "",
      authorityLevel: data.authorityLevel ?? "",
      designation: data.joining_Designation ?? "",
      ctc: data.ctc ?? "",
      aadharPancard: null
    });

    // ✅ Salary Structure
    setSalaryStructure({
      monthlyGrossSalary: data.monthlyGrossSalary ?? "",
      monthlyBasicSalary: data.monthlyBasicSalary ?? "",
      da: data.da ?? "",
      dailySalary: data.dailySalary ?? "",
      monthlySalary: data.monthlySalary ?? "",
      leaveTravelAllowance: data.leaveTravelAllowance ?? "",
      additionalBenefits: data.additionalBenefits ?? "",
      performanceIncentive: data.performanceIncentive ?? "",
      pfContribution: data.pfContribution ?? "",
      esic: data.esic ?? "",
      stockOption: data.stockOption ?? "",
      car: data.car ?? "",
      telephone: data.telephone ?? "",
      medicalAllowance: data.medicalAllowance ?? "",
      totalDeduction: data.totalDeduction ?? "",
      houseRentAllowance: data.houseRentAllowance ?? "",
      hourlySalary: data.hourlySalary ?? "",
      annualIncrement: data.annualIncrement ?? "",
      annualIncDate: data.annualIncDate?.split("T")[0] ?? "",
      totalMonth: data.totalMonth ?? "",
      professionalTax: data.professionalTax ?? "",
      annualCtcRs: data.annualCtcRs ?? ""
    });

  } catch (err) {
    console.error("Failed to fetch employee:", err);
    toast.error("Employee not found");
  }
};


  // --- Profile completeness helpers ---
  const getFilledPercentage = (obj, keys) => {
    const required = keys || Object.keys(obj);
    if (required.length === 0) return 0;
    const filled = required.filter(k => {
      const v = obj[k];
      if (typeof v === 'boolean') return v;
      return v !== null && v !== undefined && String(v).trim() !== '';
    }).length;
    return Math.round((filled / required.length) * 100);
  };

  const employeePercent = getFilledPercentage(employeeInfo);
  const employerPercent = getFilledPercentage(employerInfo);
  const salaryPercent = getFilledPercentage(salaryStructure);

  const getCurrentPercent = () => {
    if (currentForm === 'employee') return employeePercent;
    if (currentForm === 'employer') return employerPercent;
    if (currentForm === 'salary') return salaryPercent;
    return 0;
  };
  useEffect(() => {
    fetch(`${API_ENDPOINTS.GET_COUNTRY}`)
      .then(res => res.json())
      .then(res => setCountries(res))
      .catch(err => console.error("Country API Error:", err));
  }, []);


  useEffect(() => {
    fetch(API_ENDPOINTS.DEPARTMENT)
      .then(res => res.json())
      .then(res => {
        if (Array.isArray(res)) {
          setDepartments(res);
        } else if (res?.data && Array.isArray(res.data)) {
          setDepartments(res.data);
        } else {
          setDepartments([]);
        }
      })
      .catch(err => {
        console.error("Department API Error:", err);
        setDepartments([]);
      });
  }, []);


  useEffect(() => {
    fetch(API_ENDPOINTS.DESIGNATION)
      .then(res => res.json())
      .then(res => {
        if (Array.isArray(res)) {
          setDesignations(res);
        } else if (res?.data && Array.isArray(res.data)) {
          setDesignations(res.data);
        } else {
          setDesignations([]);
        }
      })
      .catch(err => {
        console.error("Designation API Error:", err);
        setDesignations([]);
      });
  }, []);
useEffect(() => {
  fetchCurrency();
}, []);
useEffect(() => {
  axios
    .get(API_ENDPOINTS.AUTHORITY_MATRIX)
    .then(res => {
      setAuthorities(Array.isArray(res.data) ? res.data : []);
    })
    .catch(err => {
      console.error("Authority API error:", err);
      setAuthorities([]);
    });
}, []);


const fetchCurrency = async () => {
  try {
    const res = await axios.get(API_ENDPOINTS.GET_CURRENCY);
    setCurrencyList(res.data);
  } catch (error) {
    console.error("Error fetching currency", error);
  }
};

  // --- Previous / Next navigation ---
  const formOrder = ['employee', 'employer', 'salary'];

  const goNext = () => {
    const idx = formOrder.indexOf(currentForm);
    if (idx < formOrder.length - 1) {
      const next = formOrder[idx + 1];
      setCurrentForm(next);
      setActiveSection(next);
    }
  };

  const goPrevious = () => {
    const idx = formOrder.indexOf(currentForm);
    if (idx > 0) {
      const prev = formOrder[idx - 1];
      setCurrentForm(prev);
      setActiveSection(prev);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
const fetchEmployeeByEmpCode = async (code) => {
  try {
    const res = await axios.get(
      `${API_ENDPOINTS.GetEmployeeByEmpCode}/${code}`
    );

    const data = res.data;

    // ✅ map backend → frontend fields
    setEmployeeInfo(prev => ({
      ...prev,
      name: data.name,
      surname: data.surname,
      gender: data.gender,
      dob: data.dob?.split("T")[0],
      email: data.email,
      contactNo: data.contact_NO,
      department: data.department,
      city: data.city
    }));

    setEmployerInfo(prev => ({
      ...prev,
      designation: data.joining_Designation,
      dateOfJoining: data.date_Of_Joing?.split("T")[0]
    }));

    setSalaryStructure(prev => ({
      ...prev,
      monthlySalary: data.monthly_Salary
    }));

  } catch (error) {
    console.error("Employee fetch failed", error);
    toast.error("Employee not found");
  }
};
useEffect(() => {
  if (empCode) {
    fetchEmployeeByEmpCode(empCode);
  }
}, [empCode]);

  const handleEmployeeChange = (e) => {
    const { name, value, type, checked } = e.target;

    setEmployeeInfo((prev) => {

      // ✅ Same as Address checkbox
      if (name === "sameAsAddress") {
        return {
          ...prev,
          sameAsAddress: checked,
          permanentAddress: checked ? prev.address : ""
        };
      }

      // ✅ Country change → reset state & city
      if (name === "country") {
        return {
          ...prev,
          country: value,
          state: "",
          city: ""
        };
      }

      // ✅ State change → reset city
      if (name === "state") {
        return {
          ...prev,
          state: value,
          city: ""
        };
      }

      // ✅ Address sync when checkbox is checked
      if (name === "address" && prev.sameAsAddress) {
        return {
          ...prev,
          address: value,
          permanentAddress: value
        };
      }

      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value
      };
    });
  };


 
  useEffect(() => {
  if (employeeInfo.department) {
    fetch(
      `${API_ENDPOINTS.DESIGNATION_BY_DEPARTMENT}?department=${encodeURIComponent(
        employeeInfo.department
      )}`
    )
      .then(res => res.json())
      .then(data => {
        setDesignations(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error("Designation API Error:", err);
        setDesignations([]);
      });
  } else {
    setDesignations([]);
  }
}, [employeeInfo.department]);
const handleDepartmentChange = async (e) => {
  const departmentName = e.target.value;

  setEmployeeInfo(prev => ({
    ...prev,
    department: departmentName,
    designation: ""
  }));

  if (!departmentName) {
    setDesignations([]);
    return;
  }

  try {
    const res = await axios.get(
      `https://localhost:7145/api/HrmOrgInfo/vacant-designations`,
      { params: { department: departmentName } }
    );

    setDesignations(res.data);
  } catch (err) {
    console.error(err);
    setDesignations([]);
  }
};

  useEffect(() => {
    if (employeeInfo.country) {
      fetch(
        `${API_ENDPOINTS.GET_STATE}?country=${encodeURIComponent(employeeInfo.country)}`
      )
        .then(res => res.json())
        .then(data => setStates(data))
        .catch(err => console.error("State API Error:", err));
    } else {
      setStates([]);
      setCities([]);
    }
  }, [employeeInfo.country]);


 useEffect(() => {
  if (employeeInfo.country && employeeInfo.state) {
    fetch(
      `${API_ENDPOINTS.GET_CITY}?country=${encodeURIComponent(
        employeeInfo.country
      )}&state=${encodeURIComponent(employeeInfo.state)}`
    )
      .then(res => res.json())
      .then(data => setCities(data))
      .catch(err => {
        console.error("City API Error:", err);
        setCities([]);
      });
  } else {
    setCities([]);
  }
}, [employeeInfo.country, employeeInfo.state]);

  const handleEmployerChange = (e) => {
    const { name, value, files } = e.target;
    setEmployerInfo(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

const handleSalaryChange = (e) => {
  const { name, value, type } = e.target;

  // Allow only numbers for numeric fields
  if (type === "text" || type === "number") {
    if (!/^\d*\.?\d*$/.test(value)) {
      return; // block non-numeric characters
    }
  }

  // For date or other types, accept the value
  setSalaryStructure(prev => ({
    ...prev,
    [name]: value
  }));
};

const handleSave = async () => {
  try {
    const formData = new FormData();

    // Employee info
    Object.keys(employeeInfo).forEach(key => {
      formData.append(key, employeeInfo[key]);
    });

    // Employer info (file handling)
    Object.keys(employerInfo).forEach(key => {
      if (key === "aadharPancard" && employerInfo[key]) {
        formData.append("AdhaarFile", employerInfo[key]); // must match API param
      } else {
        formData.append(key, employerInfo[key]);
      }
    });

    // Salary structure
    Object.keys(salaryStructure).forEach(key => {
      formData.append(key, salaryStructure[key]);
    });

    const response = await fetch(API_ENDPOINTS.SaveEmployee, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const result = await response.json();

    alert("Employee saved successfully!");
    console.log("API response:", result);

  } catch (error) {
    console.error("Save employee failed:", error);
    alert("Failed to save employee");
  }
};


  const handleReset = () => {
    if (currentForm === 'employee') {
      setEmployeeInfo({
        title: '',
        name: '',
        middleName: '',
        surname: '',
        gender: '',
        dob: '',
        bloodGroup: '',
        email: '',
        contactNo: '',
        marriedStatus: '',
        address: '',
        sameAsAddress: false,
        permanentAddress: '',
        qualification: '',
        country: '',
        state: '',
        city: '',
        aadharNo: '',
        panNo: '',
        bankAccountNo: '',
        bankName: '',
        ifscCode: '',
        nominee: '',
        relation: '',
        uan: '',
        epfoAcNo: '',
        previousExperience: '',
        previousIndustry: ''
      });
    } else if (currentForm === 'employer') {
      setEmployerInfo({
        category: '',
        dateOfJoining: '',
        noticesPeriod: '',
        weeklyOff: '',
        dateOfLeaving: '',
        dateOfReleaving: '',
        shiftHours: '',
        department: '',
        otCalculation: '',
        esicPwnNo: '',
        pfContribution: '',
        currency: 'INR',
        pfNo: '',
        esicNoPwnNo: '',
        authorityLevel: '',
        designation: '',
        ctc: '',
        aadharPancard: null
      });
    } else if (currentForm === 'salary') {
      setSalaryStructure({
        monthlyGrossSalary: '',
        monthlyBasicSalary: '',
        da: '',
        dailySalary: '',
        monthlySalary: '',
        leaveTravelAllowance: '',
        additionalBenefits: '',
        performanceIncentive: '',
        pfContribution: '',
        esic: '',
        stockOption: '',
        car: '',
        telephone: '',
        medicalAllowance: '',
        totalDeduction: '',
        houseRentAllowance: '',
        hourlySalary: '',
        annualIncrement: '',
        annualIncDate: '',
        totalMonth: '',
        professionalTax: '',
        annualCtcRs: ''
      });
    }
  };

  const navigationItems = [
    { id: 'employee', icon: User, label: 'Employee Information' },
    { id: 'employer', icon: FileText, label: 'Employer Information' },
    { id: 'salary', icon: DollarSign, label: 'Salary Structure' }
  ];


const handleSubmit = async () => {
  try {
    const formData = new FormData();

    Object.entries(employeeInfo).forEach(([k, v]) => formData.append(k, v ?? ""));
    Object.entries(employerInfo).forEach(([k, v]) => {
      if (k === "aadharPancard" && v) formData.append("AdhaarFile", v);
      else formData.append(k, v ?? "");
    });
    Object.entries(salaryStructure).forEach(([k, v]) => formData.append(k, v ?? ""));

    if (isEditMode) {
      formData.append("id", empCode); // Pass empCode to update
      await axios.put(API_ENDPOINTS.UPDATE_EMPLOYEE, formData);
      toast.success("Employee updated successfully");
    } else {
      await axios.post(API_ENDPOINTS.SaveEmployee, formData);
      toast.success("Employee added successfully");
    }

    navigate("/employee-list");
  } catch (err) {
    console.error(err);
    toast.error("Operation failed");
  }
};

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '80vh', marginBottom:'100px'}}>
      {/* Header Section */}
      <div style={{ backgroundColor: 'white', borderBottom: '3px solid #4CAF50' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          {/* Progress Bar */}
          <div style={{ display: 'flex', alignItems: 'center', paddingTop: '10px' }}>
            <div
              style={{
                backgroundColor: '#FF8C42',
                color: 'white',
                padding: '8px 16px',
                fontWeight: 'bold',
                fontSize: '12px',
                position: 'relative',
                zIndex: 2
              }}
            >
              {currentForm === 'employee' && 'Employee Info'}
              {currentForm === 'employer' && 'Employer Info'}
              {currentForm === 'salary' && 'Salary Structure'}
            </div>
            <div
              style={{
                flex: 1,
                height: '4px',
                backgroundColor: '#4CAF50',
                position: 'relative',
                top: '0'
              }}
            />
            <div
              style={{
                backgroundColor: 'white',
                padding: '4px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '12px', color: '#666' }}>Profile Completeness</span>
              <span
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '3px',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}
              >
                {getCurrentPercent()}%
              </span>
            </div>
          </div>

          {/* Navigation Icons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              // padding: '20px 0',
              // gap: '10px'
            }}
          >
            {navigationItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  opacity: ['employee', 'employer', 'salary'].includes(item.id) ? 1 : 0.6
                }}
                onClick={() => {
                  if (['employee', 'employer', 'salary'].includes(item.id)) {
                    setCurrentForm(item.id);
                    setActiveSection(item.id);
                  }
                }}
              >
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: '#4CAF50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '8px',
                    transition: 'all 0.3s',
                    transform: currentForm === item.id ? 'scale(1.1)' : 'scale(1)',
                    boxShadow:
                      currentForm === item.id ? '0 4px 8px rgba(76, 175, 80, 0.4)' : 'none'
                  }}
                >
                  <item.icon size={24} color="white" />
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    color: currentForm === item.id ? '#4CAF50' : '#333',
                    textAlign: 'center',
                    maxWidth: '80px',
                    fontWeight: currentForm === item.id ? 'bold' : 'normal'
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px' }}>
        {/* Title */}
        <h4
          style={{
            color: '#1976d2',
            marginBottom: '20px',
            fontSize: '18px',
            fontWeight: '600'
          }}
        >
          {/* {getFormTitle()} */}
        </h4>

        {/* Employee Information Form */}
        {currentForm === 'employee' && (
          <div
            style={{
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginBottom: '20px',
              overflow: 'hidden'
            }} className=''
          >
            <div
              onClick={() => toggleSection('employee')}
              style={{
                backgroundColor: '#d3d3d3',
                padding: '12px 20px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
                EMPLOYEE INFORMATION
              </h5>
              {expandedSections.employee ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
            {expandedSections.employee && (
              <div style={{ padding: '20px' }}>
                <div
                // style={{
                //   display: 'grid',
                //   gridTemplateColumns: 'repeat(4, 1fr)',
                //   gap: '15px'
                // }}
                >
                  <div className='row'>

                    <div className='col'>
                      <label style={labelStyle}>Title</label>
                      <select
                        style={inputStyle}
                        name="title"
                        value={employeeInfo.title}
                        onChange={handleEmployeeChange}
                      >
                        <option value="">Select</option>
                        <option value="Mr">Mr</option>
                        <option value="Ms">Ms</option>
                        <option value="Mrs">Mrs</option>
                      </select>
                    </div>
                    <div className='col'>
                      <label style={labelStyle}>Name</label>
                      <input
                        type="text"
                        style={inputStyle}
                        name="name"
                        value={employeeInfo.name}
                        onChange={handleEmployeeChange}
                      />
                    </div>
                    <div className='col'>
                      <label style={labelStyle}>Middle Name</label>
                      <input
                        type="text"
                        style={inputStyle}
                        name="middleName"
                        value={employeeInfo.middleName}
                        onChange={handleEmployeeChange}
                      />
                    </div>
                    <div className='col'>
                      <label style={labelStyle}>Surname</label>
                      <input
                        type="text"
                        style={inputStyle}
                        name="surname"
                        value={employeeInfo.surname}
                        onChange={handleEmployeeChange}
                      />
                    </div>
                    <div className='col'>
                      <label style={labelStyle}>Gender</label>
                      <select
                        style={inputStyle}
                        name="gender"
                        value={employeeInfo.gender}
                        onChange={handleEmployeeChange}
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                  </div>

                  <div className='row'>
                    <div className='col'>
                      <label style={labelStyle}>Dob</label>
                      <input
                        type="date"
                        style={inputStyle}
                        name="dob"
                        value={employeeInfo.dob}
                        onChange={handleEmployeeChange}
                      />
                    </div>
                   <div className="col">
  <label style={labelStyle}>Blood Group</label>
  <select
    style={inputStyle}
    name="bloodGroup"
    value={employeeInfo.bloodGroup}
    onChange={handleEmployeeChange}
  >
    <option value="">Select Blood Group</option>
    <option value="A+">A+</option>
    <option value="A-">A-</option>
    <option value="B+">B+</option>
    <option value="B-">B-</option>
    <option value="AB+">AB+</option>
    <option value="AB-">AB-</option>
    <option value="O+">O+</option>
    <option value="O-">O-</option>
  </select>
</div>

              
                    <div className='col'>
                      <label style={labelStyle}>Email</label>
                      <input
                        type="email"
                        style={inputStyle}
                        name="email"
                        value={employeeInfo.email}
                        onChange={handleEmployeeChange}
                      />
                    </div>
                    <div className='col'>
                      <label style={labelStyle}>Contact No</label>
                      <input
                        type="tel"
                        style={inputStyle}
                        name="contactNo"
                        value={employeeInfo.contactNo}
                        onChange={handleEmployeeChange}
                      />
                    </div>
                    <div className='col'>
                      <label style={labelStyle}>Married Status</label>
                      <select
                        style={inputStyle}
                        name="marriedStatus"
                        value={employeeInfo.marriedStatus}
                        onChange={handleEmployeeChange}
                      >
                        <option value="">Select Status</option>
                        <option value="Single">Married</option>
                        <option value="Married">UnMarried</option>
                      </select>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-5'>
                      <label style={labelStyle}>Address</label>
                      <textarea
                        style={{ ...inputStyle, minHeight: '40px', resize: 'vertical' }}
                        name="address"
                        value={employeeInfo.address}
                        onChange={handleEmployeeChange}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'end', paddingBottom: '8px' }} className='col-2'>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        <input
                          type="checkbox"
                          style={{ marginRight: '6px' }}
                          name="sameAsAddress"
                          checked={employeeInfo.sameAsAddress}
                          onChange={handleEmployeeChange}
                        />
                        Same As Address
                      </label>
                    </div >
                    <div className='col-5'>
                      <label style={labelStyle}> Permanent Address</label>
                      <textarea
                        style={{ ...inputStyle, minHeight: '40px', resize: 'vertical' }}
                        name="permanentAddress"
                        value={employeeInfo.permanentAddress}
                        onChange={handleEmployeeChange}
                      />
                    </div>

                  </div>

                  <div className='row'>
                    <div className='col'>
                      <label style={labelStyle}>Qualifiaction</label>
                      <input
                        type="text"
                        style={inputStyle}
                        name="qualification"
                        value={employeeInfo.qualification}
                        onChange={handleEmployeeChange}
                      />
                    </div>
                    <div className='col'>
                      <label style={labelStyle}>Country</label>
                      <select
                        name="country"
                        value={employeeInfo.country}
                        onChange={handleEmployeeChange}
                        style={inputStyle}
                      >
                        <option value="">Select Country</option>
                        {countries.map(country => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>


                    </div>

                    <div className='col'>
                      <label style={labelStyle}>State</label>
                      <select
                        style={inputStyle}
                        name="state"
                        value={employeeInfo.state}
                        onChange={handleEmployeeChange}
                        disabled={!states.length}
                      >
                        <option value="">Select State</option>
                        {states.map(state => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>

                    </div>
                    <div className='col'>
                      <label style={labelStyle}>City</label>
                      <select
                        style={inputStyle}
                        name="city"
                        value={employeeInfo.city}
                        onChange={handleEmployeeChange}
                        disabled={!Array.isArray(cities) || cities.length === 0}
                      >
                        <option value="">Select City</option>
                        {Array.isArray(cities) &&
                          cities.map(city => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                      </select>


                    </div>
                    <div className='col'>
                      <label style={labelStyle}>Aadhar No</label>
                      <input
                        type="text"
                        style={inputStyle}
                        name="aadharNo"
                        value={employeeInfo.aadharNo}
                        onChange={handleEmployeeChange}
                      />
                    </div>

                  </div>

                  <div className='row'>
                    <div className='col'>
                      <label style={labelStyle}>Pan No</label>
                      <input
                        type="text"
                        style={inputStyle}
                        name="panNo"
                        value={employeeInfo.panNo}
                        onChange={handleEmployeeChange}
                      />
                    </div>
                    <div className='col'>
                      <label style={labelStyle}>Bank Account No</label>
                      <input
                        type="text"
                        style={inputStyle}
                        name="bankAccountNo"
                        value={employeeInfo.bankAccountNo}
                        onChange={handleEmployeeChange}
                      />
                    </div>
                    <div className='col'>
                      <label style={labelStyle}>Bank Name</label>
                      <input
                        type="text"
                        style={inputStyle}
                        name="bankName"
                        value={employeeInfo.bankName}
                        onChange={handleEmployeeChange}
                      />
                    </div>
                    <div className='col'>
                      <label style={labelStyle}>IFSC Code</label>
                      <input
                        type="text"
                        style={inputStyle}
                        name="ifscCode"
                        value={employeeInfo.ifscCode}
                        onChange={handleEmployeeChange}
                      />
                    </div>
                    <div className='col'>
                      <label style={labelStyle}>Nominee</label>
                      <input
                        type="text"
                        style={inputStyle}
                        name="nominee"
                        value={employeeInfo.nominee}
                        onChange={handleEmployeeChange}
                      />
                    </div>

                  </div>

                  <div className='row'>
                    <div className='col'>
                      <label style={labelStyle}>Relation</label>
                      <input
                        type="text"
                        style={inputStyle}
                        name="relation"
                        value={employeeInfo.relation}
                        onChange={handleEmployeeChange}
                      />
                    </div>
                    <div className='col'>
                      <label style={labelStyle}>UAN</label>
                      <input
                        type="text"
                        style={inputStyle}
                        name="uan"
                        value={employeeInfo.uan}
                        onChange={handleEmployeeChange}
                      />
                    </div>
                    <div className='col'>
                      <label style={labelStyle}>EPFO A/C NO</label>
                      <input
                        type="text"
                        style={inputStyle}
                        name="epfoAcNo"
                        value={employeeInfo.epfoAcNo}
                        onChange={handleEmployeeChange}
                      />
                    </div>
                    <div className='col'>
                      <label style={labelStyle}>Previous Experience</label>
                      <input
                        type="text"
                        style={inputStyle}
                        name="previousExperience"
                        value={employeeInfo.previousExperience}
                        onChange={handleEmployeeChange}
                      />
                    </div>
                    <div className='col'>
                      <label style={labelStyle}>Previous Industry</label>
                      <input
                        type="text"
                        style={inputStyle}
                        name="previousIndustry"
                        value={employeeInfo.previousIndustry}
                        onChange={handleEmployeeChange}
                      />
                    </div>
                  </div>



                </div>
              </div>
            )}
          </div>
        )}

        {/* Employer Information Form */}
        {currentForm === 'employer' && (
          <div
            style={{
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginBottom: '20px',
              overflow: 'hidden'
            }}
          >
            <div
              onClick={() => toggleSection('employer')}
              style={{
                backgroundColor: '#d3d3d3',
                padding: '12px 20px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
                EMPLOYER INFORMATION
              </h5>
              {expandedSections.employer ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
            {expandedSections.employer && (
              <div style={{ padding: '20px' }}>


                <div className='row'>

                  <div className='col'>
                    <label style={labelStyle}>Category</label>
                    <select
                      style={inputStyle}
                      name="category"
                      value={employerInfo.category}
                      onChange={handleEmployerChange}
                    >
                      <option value="">Select Category</option>
                      <option value="Staff">Staff</option>
                      <option value="Employee">Employee</option>
                    </select>
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>Date Of Joining</label>
                    <input
                      type="date"
                      style={inputStyle}
                      name="dateOfJoining"
                      value={employerInfo.dateOfJoining}
                      onChange={handleEmployerChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>Notice Period</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="noticesPeriod"
                      value={employerInfo.noticesPeriod}
                      onChange={handleEmployerChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>Weekly Off</label>
                    <select
                      style={inputStyle}
                      name="weeklyOff"
                      value={employerInfo.weeklyOff}
                      onChange={handleEmployerChange}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>Date Of Leaving</label>
                    <input
                      type="date"
                      style={inputStyle}
                      name="dateOfLeaving"
                      value={employerInfo.dateOfLeaving}
                      onChange={handleEmployerChange}
                    />
                  </div>

                </div>


                <div className='row'>


                  <div className='col'>
                    <label style={labelStyle}>Date Of Releaving</label>
                    <input
                      type="date"
                      style={inputStyle}
                      name="dateOfReleaving"
                      value={employerInfo.dateOfReleaving}
                      onChange={handleEmployerChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>Shift Hours</label>
                    <select
                      style={inputStyle}
                      name="shiftHours"
                      value={employerInfo.shiftHours}
                      onChange={handleEmployerChange}
                    >
                      <option value="">Select Hours</option>
                      <option value="8">8 Hours</option>
                      <option value="12">12 Hours</option>
                    </select>
                  </div>
                  <div className='col'>
  <label style={labelStyle}>Department</label>
  <select
    style={inputStyle}
    name="department"
value={employerInfo.department}
    onChange={handleDepartmentChange}
  >
    <option value="">Select Department</option>

    {Array.isArray(departments) &&
      departments.map(dep => (
        <option
          key={dep.departmentName}
          value={dep.departmentName}   // ✅ IMPORTANT FIX
        >
          {dep.departmentName}
        </option>
      ))}
  </select>
</div>

                  <div className='col'>
                    <label style={labelStyle}>OT Calculation</label>
                    <select
                      style={inputStyle}
                      name="otCalculation"
                      value={employerInfo.otCalculation}
                      onChange={handleEmployerChange}
                    >
                      <option value="">Select OT Calculation</option>
                      <option value="Hourly">Hourly</option>
                      <option value="Daily">Daily</option>
                    </select>
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>ESIC/PWN NO</label>
                    <select
                      style={inputStyle}
                      name="esicPwnNo"
                      value={employerInfo.esicPwnNo}
                      onChange={handleEmployerChange}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                </div>


                <div className='row'>

                  <div className='col'>
                    <label style={labelStyle}>PF Contribution</label>
                    <select
                      style={inputStyle}
                      name="pfContribution"
                      value={employerInfo.pfContribution}
                      onChange={handleEmployerChange}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
               <div className="col">
  <label style={labelStyle}>Currency</label>

  <select
    style={inputStyle}
    name="currency"
    value={employerInfo.currency}
    onChange={handleEmployerChange}
  >
    <option value="">Select Currency</option>

    {currencyList.map(cur => (
      <option key={cur.id} value={cur.currency_Code}>
        {cur.currency_Code}
      </option>
    ))}
  </select>
</div>

                  <div className='col'>
                    <label style={labelStyle}>PF No</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="pfNo"
                      value={employerInfo.pfNo}
                      onChange={handleEmployerChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>ESIC NO/PWN NO</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="esicNoPwnNo"
                      value={employerInfo.esicNoPwnNo}
                      onChange={handleEmployerChange}
                    />
                  </div>
                 <div className="col">
  <label style={labelStyle}>Authority Level</label>
  <select
    style={inputStyle}
    name="authorityLevel"
    value={authorityLevel}
    onChange={(e) => setAuthorityLevel(e.target.value)}
  >
    <option value="">Select Authority Level</option>
    <option value="joining">Joining Authority Level</option>
    <option value="current">Current Authority Level</option>
  </select>
</div>
{authorityLevel === "joining" && (
  <div className="col">
    <label style={labelStyle}>
      Joining Authority Level <span className="text-danger">*</span>
    </label>
    <select
      style={inputStyle}
      name="joiningAuthorityId"
      value={employerInfo.joiningAuthorityId || ""}
      onChange={handleEmployerChange}
    >
      <option value="">Select Joining Authority Level</option>
      {authorities.map(auth => (
        <option key={auth.id} value={auth.id}>
          {auth.authorityName}
        </option>
      ))}
    </select>
  </div>
)}
{authorityLevel === "current" && (
  <div className="col">
    <label style={labelStyle}>
      Current Authority Level <span className="text-danger">*</span>
    </label>
    <select
      style={inputStyle}
      name="currentAuthorityId"
      value={employerInfo.currentAuthorityId || ""}
      onChange={handleEmployerChange}
    >
      <option value="">Select Current Authority Level</option>
      {authorities.map(auth => (
        <option key={auth.id} value={auth.id}>
          {auth.authorityName}
        </option>
      ))}
    </select>
  </div>
)}


                </div>

                <div
                  className='row'
                >
<div className='col'>
  <label style={labelStyle}>Designation</label>
  <select
    style={inputStyle}
   name="designation"
value={employerInfo.designation}
onChange={handleEmployerChange}

  >
    <option value="">Select Designation</option>

    {Array.isArray(designations) && designations.length === 0 && (
      <option disabled>No Vacant Position</option>
    )}

    {Array.isArray(designations) &&
      designations.map(des => (
        <option
          key={des.id}
          value={des.id}
        >
          {des.designationName}
        </option>
      ))}
  </select>
</div>

                  <div className='col'>
                    <label style={labelStyle}>CTC</label>
                    <select
                      style={inputStyle}
                      name="ctc"
                      value={employerInfo.ctc}
                      onChange={handleEmployerChange}
                    >
                      <option value="">Select CTC</option>
                      <option value="Joinning">Joinning</option>
                      <option value="Current">Current</option>
                    </select>
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>Aadhar/Pancard</label>
                    <input
                      type="file"
                      style={inputStyle}
                      name="aadharPancard"
                      onChange={handleEmployerChange}
                    />
                  </div>





                </div>
              </div>
            )}
          </div>
        )}

        {/* Salary Structure Form */}
        {currentForm === 'salary' && (
          <div
            style={{
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginBottom: '20px',
              overflow: 'hidden'
            }}
          >
            <div
              onClick={() => toggleSection('salary')}
              style={{
                backgroundColor: '#d3d3d3',
                padding: '12px 20px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
                SALARY STRUCTURE
              </h5>
              {expandedSections.salary ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
            {expandedSections.salary && (
              <div style={{ padding: '20px' }}>

<div className='row'>
 <div className='col'>
                    <label style={labelStyle}>Monthly Gross Salary</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="monthlyGrossSalary"
                      value={salaryStructure.monthlyGrossSalary}
                      onChange={handleSalaryChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>Monthly Basic Salary</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="monthlyBasicSalary"
                      value={salaryStructure.monthlyBasicSalary}
                      onChange={handleSalaryChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>DA</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="da"
                      value={salaryStructure.da}
                      onChange={handleSalaryChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>Daliy Salary</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="dailySalary"
                      value={salaryStructure.dailySalary}
                      onChange={handleSalaryChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>Monthly Salary</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="monthlySalary"
                      value={salaryStructure.monthlySalary}
                      onChange={handleSalaryChange}
                    />
                  </div>

</div>


<div className='row'>
  <div className='col'>
                    <label style={labelStyle}>Leave Travel Allowance</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="leaveTravelAllowance"
                      value={salaryStructure.leaveTravelAllowance}
                      onChange={handleSalaryChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>Addidtion Benefits</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="additionalBenefits"
                      value={salaryStructure.additionalBenefits}
                      onChange={handleSalaryChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>Performance Incentive</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="performanceIncentive"
                      value={salaryStructure.performanceIncentive}
                      onChange={handleSalaryChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>PF Contribution</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="pfContribution"
                      value={salaryStructure.pfContribution}
                      onChange={handleSalaryChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>ESIC</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="esic"
                      value={salaryStructure.esic}
                      onChange={handleSalaryChange}
                    />
                  </div>
                  

</div>

<div className='row'>
     <div className='col'>
                    <label style={labelStyle}>Stock Option</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="stockOption"
                      value={salaryStructure.stockOption}
                      onChange={handleSalaryChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>Car</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="car"
                      value={salaryStructure.car}
                      onChange={handleSalaryChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>Telephone</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="telephone"
                      value={salaryStructure.telephone}
                      onChange={handleSalaryChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>Medical Allowance</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="medicalAllowance"
                      value={salaryStructure.medicalAllowance}
                      onChange={handleSalaryChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>Total Deduction</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="totalDeduction"
                      value={salaryStructure.totalDeduction}
                      onChange={handleSalaryChange}
                    />
                  </div>
</div>

<div className='row'>
  <div className='col'>
                    <label style={labelStyle}>House Rent Allowance</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="houseRentAllowance"
                      value={salaryStructure.houseRentAllowance}
                      onChange={handleSalaryChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>Hourly Salary</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="hourlySalary"
                      value={salaryStructure.hourlySalary}
                      onChange={handleSalaryChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>Annual Increment</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="annualIncrement"
                      value={salaryStructure.annualIncrement}
                      onChange={handleSalaryChange}
                    />
                  </div>
               <div className='col'>
  <label style={labelStyle}>Annual Inc Date</label>
  <input
    type="date"
    style={inputStyle}
    name="annualIncDate"
    value={salaryStructure.annualIncDate}
    onChange={handleSalaryChange}
  />
</div>


                  <div className='col'>
                    <label style={labelStyle}>Total Months</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="totalMonth"
                      value={salaryStructure.totalMonth}
                      onChange={handleSalaryChange}
                    />
                  </div>
</div>

                <div
                  className='row'
                >




                 

                
             
                
                  <div className='col'>
                    <label style={labelStyle}>Professional Tax</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="professionalTax"
                      value={salaryStructure.professionalTax}
                      onChange={handleSalaryChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>Annual CTC Rs</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="annualCtcRs"
                      value={salaryStructure.annualCtcRs}
                      onChange={handleSalaryChange}
                    />
                  </div>



                </div>
              </div>
            )}
          </div>
        )}



        {/* Previous / Next Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
            marginTop: '10px'
          }}
        >
          <button
            onClick={goPrevious}
            disabled={currentForm === 'employee'}
            style={{
              padding: '8px 20px',
              backgroundColor: currentForm === 'employee' ? '#e0e0e0' : 'white',
              color: '#666',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: currentForm === 'employee' ? 'default' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Previous
          </button>
          <button
            onClick={goNext}
            disabled={currentForm === 'salary'}
            style={{
              padding: '8px 20px',
              backgroundColor: currentForm === 'salary' ? '#e0e0e0' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: currentForm === 'salary' ? 'default' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Next
          </button>
        </div>

        {/* Action Buttons */}
       <div
  style={{
    margin: '20px',
    display: 'flex',
    justifyContent: 'center',
    gap: '20px'   // 👈 space between buttons
  }}
>
  <button
    onClick={handleReset}
    style={{
      padding: '10px 30px',
      backgroundColor: 'white',
      color: '#666',
      border: '1px solid #ccc',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500'
    }}
  >
    Reset
  </button>

  <button
  onClick={handleSubmit}
  style={{
    padding: '10px 30px',
    backgroundColor: isEditMode ? '#4CAF50' : '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  }}
>
  {isEditMode ? "Update" : "Save"}
</button>

</div>

      </div>
    </div>
  );
};

const labelStyle = {
  color: "#0066cc",
  fontWeight: "600",

};

const inputStyle = {
  width: '100%',
  padding: '8px',
  border: '1px solid #ddd',
  fontSize: '13px',
  backgroundColor: 'white'
};
export default AddEmployee;
