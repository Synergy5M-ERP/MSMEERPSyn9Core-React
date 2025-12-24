// // React version of the given ASP.NET MVC Employee Registration Form
// // NOTE:
// // - This keeps structure & fields same as your Razor view
// // - Uses uncontrolled inputs for simplicity (like MVC helpers)
// // - You can later convert to controlled inputs / validation

// import React, { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";

// const EmployeeRegistration = () => {
//   const [collapsed, setCollapsed] = useState(false);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert("Form submitted (hook API here)");
//   };

//   return (
//     <div className="container" style={{ maxWidth: 1462 }}>
//       <h2 className="text-center text-primary fw-bold">
//         NEW EMPLOYEE REGISTRATION FORM
//       </h2>

//       <form onSubmit={handleSubmit} encType="multipart/form-data">
//         {/* ================= EMPLOYEE INFORMATION ================= */}
//         <div className="accordion" id="employeeAccordion">
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button
//                 className="accordion-button"
//                 type="button"
//                 data-bs-toggle="collapse"
//                 data-bs-target="#employeeInfo"
//               >
//                 EMPLOYEE INFORMATION
//               </button>
//             </h2>

//             <div id="employeeInfo" className="accordion-collapse collapse show">
//               <div className="accordion-body">
//                 <div className="row">
//                   <div className="col-md-3">
//                     <label>Title</label>
//                     <select className="form-control" name="Title">
//                       <option value="">SELECT</option>
//                       <option>MR</option>
//                       <option>MS</option>
//                       <option>MRS</option>
//                     </select>
//                   </div>

//                   <div className="col-md-3">
//                     <label>Name</label>
//                     <input className="form-control" name="Name" />
//                   </div>

//                   <div className="col-md-3">
//                     <label>Middle Name</label>
//                     <input className="form-control" name="Middle_Name" />
//                   </div>

//                   <div className="col-md-3">
//                     <label>Surname</label>
//                     <input className="form-control" name="Surname" />
//                   </div>
//                 </div>

//                 <div className="row mt-3">
//                   <div className="col-md-3">
//                     <label>Gender</label>
//                     <select className="form-control" name="Gender">
//                       <option value="">SELECT</option>
//                       <option>MALE</option>
//                       <option>FEMALE</option>
//                     </select>
//                   </div>

//                   <div className="col-md-3">
//                     <label>DOB</label>
//                     <input type="date" className="form-control" name="DOB" />
//                   </div>

//                   <div className="col-md-3">
//                     <label>Blood Group</label>
//                     <select className="form-control" name="Blood_Group">
//                       <option>SELECT</option>
//                       <option>A+</option><option>A-</option>
//                       <option>B+</option><option>B-</option>
//                       <option>AB+</option><option>AB-</option>
//                       <option>O+</option><option>O-</option>
//                     </select>
//                   </div>

//                   <div className="col-md-3">
//                     <label>Email</label>
//                     <input type="email" className="form-control" name="Email" />
//                   </div>
//                 </div>

//                 <div className="row mt-3">
//                   <div className="col-md-3">
//                     <label>Contact No</label>
//                     <input className="form-control" maxLength="10" name="Contact_NO" />
//                   </div>

//                   <div className="col-md-3">
//                     <label>Married Status</label>
//                     <select className="form-control" name="Married_Status">
//                       <option>SELECT</option>
//                       <option>MARRIED</option>
//                       <option>UNMARRIED</option>
//                     </select>
//                   </div>

//                   <div className="col-md-3">
//                     <label>Address</label>
//                     <textarea className="form-control" name="Address" rows="3" />
//                   </div>

//                   <div className="col-md-3 mt-4">
//                     <input type="checkbox" /> Same as Address
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ================= EMPLOYER INFORMATION ================= */}
//         <div className="accordion mt-3">
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#employerInfo">
//                 EMPLOYER INFORMATION
//               </button>
//             </h2>

//             <div id="employerInfo" className="accordion-collapse collapse">
//               <div className="accordion-body">
//                 <div className="row">
//                   <div className="col-md-3">
//                     <label>Category</label>
//                     <select className="form-control" name="SalaryStatus">
//                       <option>SELECT</option>
//                       <option>STAFF</option>
//                       <option>EMPLOYEE</option>
//                     </select>
//                   </div>

//                   <div className="col-md-3">
//                     <label>Date Of Joining</label>
//                     <input type="date" className="form-control" name="Date_Of_Joining" />
//                   </div>

//                   <div className="col-md-3">
//                     <label>Notice Period</label>
//                     <input className="form-control" name="Notices_Period" />
//                   </div>

//                   <div className="col-md-3">
//                     <label>Weekly Off</label>
//                     <select className="form-control" name="Weekly_Off">
//                       <option>YES</option>
//                       <option>NO</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ================= SALARY STRUCTURE ================= */}
//         <div className="accordion mt-3">
//           <div className="accordion-item">
//             <h2 className="accordion-header">
//               <button className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#salaryInfo">
//                 SALARY STRUCTURE
//               </button>
//             </h2>

//             <div id="salaryInfo" className="accordion-collapse collapse">
//               <div className="accordion-body">
//                 <div className="row">
//                   <div className="col-md-3">
//                     <label>Monthly Gross Salary</label>
//                     <input className="form-control" name="Monthly_Gross_Salary" />
//                   </div>

//                   <div className="col-md-3">
//                     <label>Basic Salary</label>
//                     <input className="form-control" name="Basic_Salary" />
//                   </div>

//                   <div className="col-md-3">
//                     <label>DA</label>
//                     <input className="form-control" name="DA" />
//                   </div>

//                   <div className="col-md-3">
//                     <label>Daily Salary</label>
//                     <input className="form-control" name="Daily_Salary" />
//                   </div>
//                 </div>

//                 <div className="text-center mt-4">
//                   <button className="btn btn-success" type="submit">SUBMIT</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EmployeeRegistration;

import React, { useState, useEffect } from 'react';
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
    previousIndustry: ''
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

  const [expandedSections, setExpandedSections] = useState({
    employee: true,
    employer: true,
    salary: true
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


  // const handleEmployeeChange = (e) => {
  //   const { name, value, type, checked } = e.target;


  //   setEmployeeInfo((prev) => {
  //     // When "Same as Address" is checked
  //     if (name === "sameAsAddress") {
  //       if (name === "country") {
  //         return { ...prev, country: value, state: "", city: "" };
  //       }

  //       if (name === "state") {
  //         return { ...prev, state: value, city: "" };
  //       }

  //       return {
  //         ...prev,
  //         sameAsAddress: checked,
  //         permanentAddress: checked ? prev.address : ""
  //       };
  //     }

  //     // When Address changes & checkbox is checked
  //     if (name === "address" && prev.sameAsAddress) {
  //       return {
  //         ...prev,
  //         address: value,
  //         permanentAddress: value
  //       };
  //     }

  //     return {
  //       ...prev,
  //       [name]: type === "checkbox" ? checked : value
  //     };
  //   });
  // };
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
    if (employeeInfo.state) {
      fetch(
        `${API_ENDPOINTS.GET_CITY}?state=${encodeURIComponent(employeeInfo.state)}`
      )
        .then(res => res.json())
        .then(res => {
          // ✅ normalize response to array
          if (Array.isArray(res)) {
            setCities(res);
          } else if (res?.data && Array.isArray(res.data)) {
            setCities(res.data);
          } else if (res?.cities && Array.isArray(res.cities)) {
            setCities(res.cities);
          } else {
            setCities([]); // fallback
          }
        })
        .catch(err => {
          console.error("City API Error:", err);
          setCities([]);
        });
    } else {
      setCities([]);
    }
  }, [employeeInfo.state]);



  const handleEmployerChange = (e) => {
    const { name, value, files } = e.target;
    setEmployerInfo(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSalaryChange = (e) => {
    const { name, value } = e.target;
    setSalaryStructure(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      Object.keys(employeeInfo).forEach(key => {
        formData.append(`employeeInfo.${key}`, employeeInfo[key]);
      });

      Object.keys(employerInfo).forEach(key => {
        if (key === 'aadharPancard' && employerInfo[key]) {
          formData.append('aadharPancard', employerInfo[key]);
        } else {
          formData.append(`employerInfo.${key}`, employerInfo[key]);
        }
      });

      Object.keys(salaryStructure).forEach(key => {
        formData.append(`salaryStructure.${key}`, salaryStructure[key]);
      });

      const response = await fetch('https://your-api-url.com/api/employee', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('Employee data saved successfully!');
      } else {
        alert('Failed to save employee data');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data');
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

  // const getFormTitle = () => {
  //   switch (currentForm) {
  //     case 'employee':
  //       return 'Employee Information (AY 2025-2026)';
  //     case 'employer':
  //       return 'Employer Information (AY 2025-2026)';
  //     case 'salary':
  //       return 'Salary Structure (AY 2025-2026)';
  //     default:
  //       return 'Employee Management';
  //   }
  // };

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
                      <label style={labelStyle}>TITLE</label>
                      <select
                        style={inputStyle}
                        name="title"
                        value={employeeInfo.title}
                        onChange={handleEmployeeChange}
                      >
                        <option value="">SELECT</option>
                        <option value="Mr">Mr</option>
                        <option value="Ms">Ms</option>
                        <option value="Mrs">Mrs</option>
                      </select>
                    </div>
                    <div className='col'>
                      <label style={labelStyle}>NAME</label>
                      <input
                        type="text"
                        style={inputStyle}
                        name="name"
                        value={employeeInfo.name}
                        onChange={handleEmployeeChange}
                      />
                    </div>
                    <div className='col'>
                      <label style={labelStyle}>MIDDLE NAME</label>
                      <input
                        type="text"
                        style={inputStyle}
                        name="middleName"
                        value={employeeInfo.middleName}
                        onChange={handleEmployeeChange}
                      />
                    </div>
                    <div className='col'>
                      <label style={labelStyle}>SURNAME</label>
                      <input
                        type="text"
                        style={inputStyle}
                        name="surname"
                        value={employeeInfo.surname}
                        onChange={handleEmployeeChange}
                      />
                    </div>
                    <div className='col'>
                      <label style={labelStyle}>GENDER</label>
                      <select
                        style={inputStyle}
                        name="gender"
                        value={employeeInfo.gender}
                        onChange={handleEmployeeChange}
                      >
                        <option value="">SELECT</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                  </div>

                  <div className='row'>
                    <div className='col'>
                      <label style={labelStyle}>DOB</label>
                      <input
                        type="date"
                        style={inputStyle}
                        name="dob"
                        value={employeeInfo.dob}
                        onChange={handleEmployeeChange}
                      />
                    </div>
                    <div className='col'>
                      <label style={labelStyle}>BLOOD GROUP</label>
                      <input
                        type="text"
                        style={inputStyle}
                        placeholder="AB+"
                        name="bloodGroup"
                        value={employeeInfo.bloodGroup}
                        onChange={handleEmployeeChange}
                      />
                    </div>
                    <div className='col'>
                      <label style={labelStyle}>EMAIL</label>
                      <input
                        type="email"
                        style={inputStyle}
                        name="email"
                        value={employeeInfo.email}
                        onChange={handleEmployeeChange}
                      />
                    </div>
                    <div className='col'>
                      <label style={labelStyle}>CONTACT NO</label>
                      <input
                        type="tel"
                        style={inputStyle}
                        name="contactNo"
                        value={employeeInfo.contactNo}
                        onChange={handleEmployeeChange}
                      />
                    </div>
                    <div className='col'>
                      <label style={labelStyle}>MARRIED STATUS</label>
                      <select
                        style={inputStyle}
                        name="marriedStatus"
                        value={employeeInfo.marriedStatus}
                        onChange={handleEmployeeChange}
                      >
                        <option value="">SELECT STATUS</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                      </select>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-5'>
                      <label style={labelStyle}>ADDRESS</label>
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
                        SAME AS ADDRESS
                      </label>
                    </div >
                    <div className='col-5'>
                      <label style={labelStyle}>PERMANENT ADDRESS</label>
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
                      <label style={labelStyle}>QUALIFICATION</label>
                      <input
                        type="text"
                        style={inputStyle}
                        name="qualification"
                        value={employeeInfo.qualification}
                        onChange={handleEmployeeChange}
                      />
                    </div>
                    <div className='col'>
                      <label style={labelStyle}>COUNTRY</label>
                      <select
                        name="country"
                        value={employeeInfo.country}
                        onChange={handleEmployeeChange}
                        style={inputStyle}
                      >
                        <option value="">SELECT COUNTRY</option>
                        {countries.map(country => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>


                    </div>

                    <div className='col'>
                      <label style={labelStyle}>STATE</label>
                      <select
                        style={inputStyle}
                        name="state"
                        value={employeeInfo.state}
                        onChange={handleEmployeeChange}
                        disabled={!states.length}
                      >
                        <option value="">SELECT STATE</option>
                        {states.map(state => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>

                    </div>
                    <div className='col'>
                      <label style={labelStyle}>CITY</label>
                      <select
                        style={inputStyle}
                        name="city"
                        value={employeeInfo.city}
                        onChange={handleEmployeeChange}
                        disabled={!Array.isArray(cities) || cities.length === 0}
                      >
                        <option value="">SELECT CITY</option>
                        {Array.isArray(cities) &&
                          cities.map(city => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                      </select>


                    </div>
                    <div className='col'>
                      <label style={labelStyle}>AADHAR NO</label>
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
                      <label style={labelStyle}>PAN NO</label>
                      <input
                        type="text"
                        style={inputStyle}
                        name="panNo"
                        value={employeeInfo.panNo}
                        onChange={handleEmployeeChange}
                      />
                    </div>
                    <div className='col'>
                      <label style={labelStyle}>BANK ACCOUNT NO</label>
                      <input
                        type="text"
                        style={inputStyle}
                        name="bankAccountNo"
                        value={employeeInfo.bankAccountNo}
                        onChange={handleEmployeeChange}
                      />
                    </div>
                    <div className='col'>
                      <label style={labelStyle}>BANK NAME</label>
                      <input
                        type="text"
                        style={inputStyle}
                        name="bankName"
                        value={employeeInfo.bankName}
                        onChange={handleEmployeeChange}
                      />
                    </div>
                    <div className='col'>
                      <label style={labelStyle}>IFSC CODE</label>
                      <input
                        type="text"
                        style={inputStyle}
                        name="ifscCode"
                        value={employeeInfo.ifscCode}
                        onChange={handleEmployeeChange}
                      />
                    </div>
                    <div className='col'>
                      <label style={labelStyle}>NOMINEE</label>
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
                      <label style={labelStyle}>RELATION</label>
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
                      <label style={labelStyle}>PREVIOUS EXPERIENCE</label>
                      <input
                        type="text"
                        style={inputStyle}
                        name="previousExperience"
                        value={employeeInfo.previousExperience}
                        onChange={handleEmployeeChange}
                      />
                    </div>
                    <div className='col'>
                      <label style={labelStyle}>PREVIOUS INDUSTRY</label>
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
                    <label style={labelStyle}>CATEGORY</label>
                    <select
                      style={inputStyle}
                      name="category"
                      value={employerInfo.category}
                      onChange={handleEmployerChange}
                    >
                      <option value="">SELECT CATEGORY</option>
                      <option value="Staff">Staff</option>
                      <option value="Employee">Employee</option>
                    </select>
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>DATE OF JOINING</label>
                    <input
                      type="date"
                      style={inputStyle}
                      name="dateOfJoining"
                      value={employerInfo.dateOfJoining}
                      onChange={handleEmployerChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>NOTICE PERIOD</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="noticesPeriod"
                      value={employerInfo.noticesPeriod}
                      onChange={handleEmployerChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>WEEKLY OFF</label>
                    <select
                      style={inputStyle}
                      name="weeklyOff"
                      value={employerInfo.weeklyOff}
                      onChange={handleEmployerChange}
                    >
                      <option value="">SELECT</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>DATE OF LEAVING</label>
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
                    <label style={labelStyle}>DATE OF RELEAVING</label>
                    <input
                      type="date"
                      style={inputStyle}
                      name="dateOfReleaving"
                      value={employerInfo.dateOfReleaving}
                      onChange={handleEmployerChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>SHIFT HOURS</label>
                    <select
                      style={inputStyle}
                      name="shiftHours"
                      value={employerInfo.shiftHours}
                      onChange={handleEmployerChange}
                    >
                      <option value="">SELECT HOURS</option>
                      <option value="8">8 Hours</option>
                      <option value="12">12 Hours</option>
                    </select>
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>DEPARTMENT</label>
                    <select
                      style={inputStyle}
                      name="department"
                      value={employeeInfo.department}
                      onChange={handleEmployeeChange}
                    >
                      <option value="">SELECT DEPARTMENT</option>

                      {Array.isArray(departments) &&
                        departments.map(dep => (
                          <option key={dep.id} value={dep.id}>
                            {dep.departmentName}
                          </option>
                        ))}
                    </select>


                  </div>
                  <div className='col'>
                    <label style={labelStyle}>OT CALCULATION</label>
                    <select
                      style={inputStyle}
                      name="otCalculation"
                      value={employerInfo.otCalculation}
                      onChange={handleEmployerChange}
                    >
                      <option value="">SELECT OT CALCULATION</option>
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
                      <option value="">SELECT</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                </div>


                <div className='row'>

                  <div className='col'>
                    <label style={labelStyle}>PF CONTRIBUTION</label>
                    <select
                      style={inputStyle}
                      name="pfContribution"
                      value={employerInfo.pfContribution}
                      onChange={handleEmployerChange}
                    >
                      <option value="">SELECT</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>CURRENCY</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="currency"
                      value={employerInfo.currency}
                      onChange={handleEmployerChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>PF NO</label>
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
                  <div className='col'>
                    <label style={labelStyle}>AUTHORITY LEVEL</label>
                    <select
                      style={inputStyle}
                      name="authorityLevel"
                      value={employerInfo.authorityLevel}
                      onChange={handleEmployerChange}
                    >
                      <option value="">SELECT AUTHORITY LEVEL</option>
                      <option value="Joining">JOINING AUTHORITY LEVEL</option>
                      <option value="Current"> CURRENT AUTHORITY LEVEL</option>
                    </select>
                  </div>

                </div>

                <div
                  className='row'
                >





                  <div className='col'>
                    <label style={labelStyle}>DESIGNATION</label>
                    <select
                      style={inputStyle}
                      name="designation"
                      value={employeeInfo.designation}
                      onChange={handleEmployeeChange}
                    >
                      <option value="">SELECT DESIGNATION</option>

                      {Array.isArray(designations) &&
                        designations.map(des => (
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
                      <option value="">SELECT CTC</option>
                      <option value="Joinning">Joinning</option>
                      <option value="Current">Current</option>
                    </select>
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>AADHAR/PANCARD</label>
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
                    <label style={labelStyle}>MONTHLY GROSS SALARY</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="monthlyGrossSalary"
                      value={salaryStructure.monthlyGrossSalary}
                      onChange={handleSalaryChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>MONTHLY BASIC SALARY</label>
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
                    <label style={labelStyle}>DAILY SALARY</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="dailySalary"
                      value={salaryStructure.dailySalary}
                      onChange={handleSalaryChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>MONTHLY SALARY</label>
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
                    <label style={labelStyle}>LEAVE TRAVEL ALLOWANCE</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="leaveTravelAllowance"
                      value={salaryStructure.leaveTravelAllowance}
                      onChange={handleSalaryChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>ADDITIONAL BENEFITS</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="additionalBenefits"
                      value={salaryStructure.additionalBenefits}
                      onChange={handleSalaryChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>PERFORMANCE INCENTIVE</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="performanceIncentive"
                      value={salaryStructure.performanceIncentive}
                      onChange={handleSalaryChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>PF CONTRIBUTION</label>
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
                    <label style={labelStyle}>STOCK OPTION</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="stockOption"
                      value={salaryStructure.stockOption}
                      onChange={handleSalaryChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>CAR</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="car"
                      value={salaryStructure.car}
                      onChange={handleSalaryChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>TELEPHONE</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="telephone"
                      value={salaryStructure.telephone}
                      onChange={handleSalaryChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>MEDICAL ALLOWANCE</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="medicalAllowance"
                      value={salaryStructure.medicalAllowance}
                      onChange={handleSalaryChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>TOTAL DEDUCTION</label>
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
                    <label style={labelStyle}>HOUSE RENT ALLOWANCE</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="houseRentAllowance"
                      value={salaryStructure.houseRentAllowance}
                      onChange={handleSalaryChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>HOURLY SALARY</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="hourlySalary"
                      value={salaryStructure.hourlySalary}
                      onChange={handleSalaryChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>ANNUAL INCREMENT</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="annualIncrement"
                      value={salaryStructure.annualIncrement}
                      onChange={handleSalaryChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>ANNUAL INC DATE</label>
                    <input
                      type="date"
                      style={inputStyle}
                      name="annualIncDate"
                      value={salaryStructure.annualIncDate}
                      onChange={handleSalaryChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>TOTAL MONTH</label>
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
                    <label style={labelStyle}>PROFESSIONAL TAX</label>
                    <input
                      type="text"
                      style={inputStyle}
                      name="professionalTax"
                      value={salaryStructure.professionalTax}
                      onChange={handleSalaryChange}
                    />
                  </div>
                  <div className='col'>
                    <label style={labelStyle}>ANNUAL CTC RS</label>
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
    onClick={handleSave}
    style={{
      padding: '10px 30px',
      backgroundColor: '#2196F3',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500'
    }}
  >
    Save
  </button>
</div>

      </div>
    </div>
  );
};

const labelStyle = {
  color: "#0066cc", fontWeight: "600"
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  border: '1px solid #ddd',
  fontSize: '13px',
  backgroundColor: 'white'
};

export default AddEmployee;
