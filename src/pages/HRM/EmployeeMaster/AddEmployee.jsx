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
const [expandedSections, setExpandedSections] = useState({
  employee: true,
  employer: true,
  salary: true
});
const location = useLocation();
const navigate = useNavigate();

const { employeeId } = useParams(); // <-- get ID from URL
const isEditMode = Boolean(employeeId);


  const [employeeInfo, setEmployeeInfo] = useState({
    title: '',
         fullName: "",
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
  countryId: "",
  stateId: "",
  cityId: "",
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
  designation: "",
 authorityMatrixId: "",   // ✅ ADD THIS
  joiningAuthorityId: "",  // ✅ ADD THIS
  currentAuthorityId: "", 
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
  pfContributionAmount: "",
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
    annualCtcRs: '',
  });
  



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
 // Fetch Employee Data in Edit Mode
  // ========================
  useEffect(() => {
  if (!isEditMode || !employeeId) return;

  const fetchEmployeeById = async () => {
    try {
      const res = await axios.get(`${API_ENDPOINTS.GetEmployeeById}/${employeeId}`);
      const data = res.data;

      // Map Employee Info
      const emp = data.employee;
      const empEmployer = data.employer;
      const empSalary = data.salary;
// decide authority level based on backend value
// normalize backend value
const backendAuthorityLevel =
  empEmployer.authorityLevel?.toLowerCase() ?? "";


let authorityLevelValue = "";
let joiningAuthorityId = "";
let currentAuthorityId = "";

if (backendAuthorityLevel === "joining") {
  authorityLevelValue = "joining";
  joiningAuthorityId = data.employee.authorityMatrixId;
}

if (backendAuthorityLevel === "current") {
  authorityLevelValue = "current";
  currentAuthorityId = data.employee.authorityMatrixId;
}

// 🔥 this controls which dropdown is visible
setAuthorityLevel(authorityLevelValue);

      setEmployeeInfo({
        fullName: emp.fullName ?? "",
        title: emp.title ?? "",
        middleName: emp.middleName ?? "",
        surname: emp.surname ?? "",
        gender: emp.gender ?? "",
        dob: emp.dob ? emp.dob.split("T")[0] : "",
        bloodGroup: emp.bloodGroup ?? "",
        email: emp.email ?? "",
        contactNo: emp.contactNo ?? "",
        marriedStatus: emp.maritualStatus ?? "",
        address: emp.address ?? "",
        sameAsAddress: false,
        permanentAddress: emp.permanentAddress ?? "",
        qualification: emp.qualification ?? "",
        countryId: emp.countryId ?? "",
        stateId: emp.stateId ?? "",
        cityId: emp.cityId ?? "",
        aadharNo: emp.aadharNo ?? "",
        panNo: emp.panNo ?? "",
        bankAccountNo: emp.bankAccountNo ?? "",
        bankName: emp.bankName ?? "",
        ifscCode: emp.ifscCode ?? "",
        nominee: emp.nominee ?? "",
        relation: emp.relation ?? "",
        uan: emp.uanNo ?? "",
        epfoAcNo: emp.epfoNo ?? "",
        previousExperience: emp.previousExperience ?? "",
        previousIndustry: emp.previousIndustry ?? "",
        department: emp.deptId ?? "",
    authorityLevel: authorityLevelValue,
  joiningAuthorityId,
  currentAuthorityId,
  authorityMatrixId:
    authorityLevelValue === "joining"
      ? joiningAuthorityId
      : currentAuthorityId
      });

      // Map Employer Info
      setEmployerInfo({
        category: empEmployer.category ?? "",
        dateOfJoining: empEmployer.joiningDate ? empEmployer.joiningDate.split("T")[0] : "",
        noticesPeriod: empEmployer.noticePeriod ?? "",
        weeklyOff: empEmployer.weeklyOff ?? "",
        dateOfLeaving: empEmployer.leaveDate ? empEmployer.leaveDate.split("T")[0] : "",
        dateOfReleaving: empEmployer.relievingDate ? empEmployer.relievingDate.split("T")[0] : "",
        shiftHours: empEmployer.shiftHours ?? "",
        department: empEmployer.deptId ?? "",
        otCalculation: empEmployer.oTcalculation ?? "",
        esicPwnNo: empEmployer.esisNo ?? "",
        pfContribution: empEmployer.pfContribution ?? "",
        currency: empEmployer.currency ?? "INR",
        pfNo: empEmployer.pfNo ?? "",
        authorityLevel: empEmployer.authorityLevel ?? "",
        designation: empEmployer.designationId ?? "",
        ctc: empEmployer.ctc ?? "",
        aadharPancard: null
      });

      // Map Salary Structure
      setSalaryStructure({
        monthlyGrossSalary: empSalary.monthlyGrossSalary ?? "",
        monthlyBasicSalary: empSalary.monthlyBasicSalary ?? "",
        da: empSalary.da ?? "",
        dailySalary: empSalary.dailySalary ?? "",
        monthlySalary: empSalary.monthlySalary ?? "",
        leaveTravelAllowance: empSalary.leaveTravelAllowance ?? "",
        additionalBenefits: empSalary.additionalBenefits ?? "",
        performanceIncentive: empSalary.performanceIncentive ?? "",
        pfContributionAmount: empSalary.pfContributionAmount ?? "",
        esic: empSalary.esic ?? "",
        stockOption: empSalary.stockOption ?? "",
        car: empSalary.carAllowance ?? "",
        medicalAllowance: empSalary.medicalAllowance ?? "",
        totalDeduction: empSalary.totalDeduction ?? "",
        houseRentAllowance: empSalary.houseRentAllowance ?? "",
        hourlySalary: empSalary.hourlySalary ?? "",
        annualIncrement: empSalary.annualIncrement ?? "",
        annualIncDate: empSalary.annualIncrementDate ? empSalary.annualIncrementDate.split("T")[0] : "",
        totalMonth: empSalary.totalMonth ?? "",
        professionalTax: empSalary.professionalTax ?? "",
        annualCtcRs: empSalary.annualCTC ?? ""
      });

    } catch (err) {
      console.error("Failed to fetch employee data:", err);
      toast.error("Employee not found");
    }
  };

  fetchEmployeeById();
}, [isEditMode, employeeId]);

const handleEmployeeChange = (e) => {
  const { name, value, type, checked } = e.target;

  setEmployeeInfo((prev) => {

    if (name === "sameAsAddress") {
      return {
        ...prev,
        sameAsAddress: checked,
        permanentAddress: checked ? prev.address : ""
      };
    }

    if (name === "countryId") {
      return {
        ...prev,
        countryId: value,
        stateId: "",
        cityId: ""
      };
    }

    if (name === "stateId") {
      return {
        ...prev,
        stateId: value,
        cityId: ""
      };
    }

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
  const deptId = e.target.value;   // ✅ DEFINE HERE

  setEmployerInfo(prev => ({
    ...prev,
    department: deptId,
    designation: ""
  }));

  if (!deptId) {
    setDesignations([]);
    return;
  }

  try {
    const res = await axios.get(
      "https://msmeerpsyn9-core.azurewebsites.net/api/HrmOrgInfo/vacant-designations",
      {
        params: { deptId }   // ✅ SAFE TO USE
      }
    );

    setDesignations(res.data);
  } catch (err) {
    console.error(err);
    setDesignations([]);
  }
};


  useEffect(() => {
  if (!employeeInfo.countryId) {
    setStates([]);
    setCities([]);
    return;
  }

  fetch(`${API_ENDPOINTS.GET_STATE}?countryId=${employeeInfo.countryId}`)
    .then(res => res.json())
    .then(data => setStates(data))
    .catch(err => {
      console.error("State API Error:", err);
      setStates([]);
    });
}, [employeeInfo.countryId]);

useEffect(() => {
  if (!employeeInfo.stateId) {
    setCities([]);
    return;
  }

  fetch(`${API_ENDPOINTS.GET_CITY}?stateId=${employeeInfo.stateId}`)
    .then(res => res.json())
    .then(data => setCities(data))
    .catch(err => {
      console.error("City API Error:", err);
      setCities([]);
    });
}, [employeeInfo.stateId]);


 const handleEmployerChange = (e) => {
  const { name, value } = e.target;

  if (name === "joiningAuthorityId") {
    setEmployerInfo(prev => ({
      ...prev,
      joiningAuthorityId: value,
      authorityMatrixId: value
    }));
    return;
  }

  if (name === "currentAuthorityId") {
    setEmployerInfo(prev => ({
      ...prev,
      currentAuthorityId: value,
      authorityMatrixId: value
    }));
    return;
  }

  setEmployerInfo(prev => ({ ...prev, [name]: value }));
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
  debugger;
  try {
    const formData = new FormData();

    // ===============================
    // 1️⃣ Resolve AuthorityMatrixId
 


    // ===============================
    // 2️⃣ Employee Info
    // ===============================
    Object.entries(employeeInfo).forEach(([k, v]) =>
      formData.append(k, v ?? "")
    );
  formData.append("EmployeeId", employeeId);

    formData.append("MaritualStatus", employeeInfo.marriedStatus ?? "");
    formData.append("UANNo", employeeInfo.uan ?? "");
    formData.append("EPFONo", employeeInfo.epfoAcNo ?? "");

    // ===============================
    // 3️⃣ Employer Info
    // ===============================
    Object.entries(employerInfo).forEach(([k, v]) => {
      if (k === "AadharCardFile" && v) {
        formData.append("AadharCardFile", v);
      } else if (k === "PancardNoFile" && v) {
        formData.append("PancardNoFile", v);
      } else {
        formData.append(k, v ?? "");
      }
    });

    formData.append("DeptId", employerInfo.department ?? "");
    formData.append("JoiningDate", employerInfo.dateOfJoining ?? "");
    formData.append("NoticePeriod", employerInfo.noticesPeriod ?? "");
    formData.append("LeaveDate", employerInfo.dateOfLeaving ?? "");
    formData.append("RelievingDate", employerInfo.dateOfReleaving ?? "");
    formData.append("ESISNo", employerInfo.esicPwnNo ?? "");
        formData.append("DesinationId", employerInfo.designationId ?? "");

    formData.append(
      "PFContributionAuthorityLevel",
      employerInfo.authorityLevel ?? ""
    );

    formData.append("AuthorityLevel", authorityLevel?? "");
formData.append(
  "DesignationId",
  employerInfo.designation ?? ""
);

formData.append(
  "AuthorityMatrixId",
  employerInfo.authorityMatrixId ?? ""
);


    // ===============================
    // 4️⃣ Salary Structure
    // ===============================
    Object.entries(salaryStructure).forEach(([k, v]) =>
      formData.append(k, v ?? "")
    );

    formData.append("CarAllowance", salaryStructure.car ?? "");
    formData.append(
      "AnnualIncrementDate",
      salaryStructure.annualIncDate ?? ""
    );
    formData.append("AnnualCTC", salaryStructure.annualCtcRs ?? "");

    // ===============================
    // 5️⃣ Default Password
    // ===============================
    formData.append("Password", "Temp@123");
    formData.append("ConfirmPassword", "Temp@123");

    // ===============================
    // 6️⃣ API Call
    // ===============================
   if (isEditMode) {
  await axios.put(
    `${API_ENDPOINTS.UpdateEmployee}/${employeeId}`,
    formData,
   
  );

  toast.success("Employee updated successfully ✅");

    } else {
      await axios.post(API_ENDPOINTS.SaveEmployee, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Employee added successfully 🎉");
    }

    navigate("/employee-list");
  } catch (err) {
    console.error(err);

    const errorMessage =
      err?.response?.data?.message ||
      err?.response?.data ||
      "Failed to save employee";

    toast.error(errorMessage);
  }
};



  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '80vh', marginBottom:'100px'}}>
      {/* Header Section */}
            <h2>{isEditMode ? "Edit Employee" : "Add Employee"}</h2>

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
  <label style={labelStyle}>Full Name</label>
  <input
    type="text"
    style={inputStyle}
    name="fullName"
    value={employeeInfo.fullName}
    onChange={handleEmployeeChange}
    placeholder="Enter full name"
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
  name="countryId"
  value={employeeInfo.countryId || ""}
  onChange={handleEmployeeChange}
  style={inputStyle}
>
  <option value="">Select Country</option>

  {countries.map((country) => (
    <option
      key={country.country_id}
      value={country.country_id}
    >
      {country.country_name}
    </option>
  ))}
</select>



                    </div>
<div className="col">
  <label style={labelStyle}>State</label>
  <select
    name="stateId"
    value={employeeInfo.stateId}
    onChange={handleEmployeeChange}
    style={inputStyle}
  >
    <option value="">Select State</option>
    {states.map((s) => (
      <option key={s.state_id} value={s.state_id}>
        {s.state_name}
      </option>
    ))}
  </select>
</div>
<div className="col">
  <label style={labelStyle}>City</label>
  <select
    name="cityId"
    value={employeeInfo.cityId}
    onChange={handleEmployeeChange}
    style={inputStyle}
    disabled={!cities || cities.length === 0}
  >
    <option value="">Select City</option>
    {cities.map((c) => (
      <option key={c.city_id} value={c.city_id}>
        {c.city_name}
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
                 <div className="col">
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
          key={dep.deptId}          // ✅ unique key
          value={dep.deptId}        // ✅ save ID (BEST PRACTICE)
        >
          {dep.deptName}          
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

      {Array.isArray(authorities) &&
        authorities
          .filter(a => a.isActive)
          .map(auth => (
            <option
              key={auth.authorityMatrixId}
              value={auth.authorityMatrixId}
            >
              {auth.authorityMatrixName}
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

      {Array.isArray(authorities) &&
        authorities
          .filter(a => a.isActive)
          .map(auth => (
            <option
              key={auth.authorityMatrixId}
              value={auth.authorityMatrixId}
            >
              {auth.authorityMatrixName}
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
  name="designationId"
  value={employerInfo.designationId || ""}
  onChange={(e) => {
    const selectedId = e.target.value;
    const selectedObj = designations.find(d => d.id == selectedId);

    setEmployerInfo(prev => ({
      ...prev,
      designationId: selectedId,
      designationName: selectedObj ? selectedObj.designationName : ""
    }));
  }}
>
  <option value="">Select Designation</option>

  {designations.length === 0 && (
    <option disabled>No Vacant Position</option>
  )}

  {designations.map(des => (
    <option key={des.id} value={des.id}>
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
  <label style={labelStyle}>PF Contribution Amount</label>
  <input
    type="text"
    style={inputStyle}
    name="pfContributionAmount"          // ✅ CHANGED
    value={salaryStructure.pfContributionAmount || ""}
    onChange={handleSalaryChange}
  />
</div>

<div className='col'>
  <label style={labelStyle}>ESIC</label>
  <input
    type="text"
    style={inputStyle}
    name="esic"
    value={salaryStructure.esic || ""}
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
      type="button" // keeps page from refreshing
      onClick={handleSubmit}
      style={{
        padding: "10px 30px",
        backgroundColor: isEditMode ? "#4CAF50" : "#2196F3",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "500",
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
