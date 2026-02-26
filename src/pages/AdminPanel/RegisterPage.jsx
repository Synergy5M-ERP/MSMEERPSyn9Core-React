
// // export default Register;
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Eye, EyeOff } from "lucide-react";
// import "./Register.css";

// function Register() {
//  const [formData, setFormData] = useState({
//   company_name: "",
//   contact_person: "",
//   email_id: "",
//   contact_no: "",
//   gst_no: "",

//   source: "",
//   continent: "",

//   CountryId: "",
//   StateId: "",
//   CityId: "",

//   authority: "",
//   designation: "",

//   password: "",          // ✅ lowercase
//   confirm_password: "",
// });





//   const [errors, setErrors] = useState({});
//   const [touched, setTouched] = useState({});
//   const [sources, setSources] = useState([]);
//   const [continents, setContinents] = useState([]);
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [authorities, setAuthorities] = useState([]);
//   const [designations, setDesignations] = useState([]);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const apiBase = "https://msmeerpsyn9-core.azurewebsites.net/api/HRMAdminRegAPI";

//  // const apiBase =
//     //"https://localhost:7145/api/HRMAdminRegAPI";

//   // ---------- VALIDATION ----------
//   const validateField = (name, value) => {
//     let error = "";

//     switch (name) {
//       case "company_name":
//       case "contact_person":
//         if (!value?.trim()) error = "This field is required";
//         else if (value.trim().length < 2) error = "Minimum 2 characters";
//         break;

//       case "email_id":
//         if (!value?.trim()) error = "Email is required";
//         else {
//           const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//           if (!emailRegex.test(value.trim()))
//             error = "Enter a valid email";
//         }
//         break;

//       case "contact_no": {
//         const digits = (value || "").replace(/\D/g, "");
//         if (!digits) error = "Contact number is required";
//         else if (digits.length !== 10)
//           error = "Enter 10‑digit mobile number";
//         break;
//       }

//       case "gst_no": {
//         const v = (value || "").trim().toUpperCase();
//         if (!v) error = "GST number is required";
//         else {
//           const gstRegex =
//             /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
//           if (!gstRegex.test(v))
//             error = "Enter valid GST format (12ABCDE3456F1Z5)";
//         }
//         break;
//       }

//       case "source":
//       case "continent":
//       case "country":
//       case "state":
//       case "city":
//       case "authority":
//       case "designation":
//         if (!value) error = "Please select an option";
//         break;

//       case "password":
//         if (!value) error = "Password is required";
//         else {
//           const strong =
//             /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
//           if (!strong.test(value))
//             error =
//               "Password must be 8+ chars with upper, lower, number & special char";
//         }
//         break;

//       case "confirm_password":
//         if (!value) error = "Confirm password is required";
//         else if (value !== formData.password)
//           error = "Passwords do not match";
//         break;

//       default:
//         break;
//     }

//     return error;
//   };

//   const validateForm = () => {
//   const fields = [
//   "company_name",
//   "contact_person",
//   "email_id",
//   "contact_no",
//   "gst_no",
//   "source",
//   "continent",
//   "CountryId",
//   "StateId",
//   "CityId",
//   "authority",
//   "designation",
//   "password",
//   "confirm_password",
// ];


//     const newErrors = {};
//     fields.forEach((f) => {
//       const err = validateField(f, formData[f]);
//       if (err) newErrors[f] = err;
//     });
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };


//   // ---------- DROPDOWNS ----------
  
//   useEffect(() => {
//     const load = async () => {
//       try {
//         const [srcRes, authRes, desRes] = await Promise.all([
//           axios.get(`${apiBase}/GetSource`),
//           axios.get(
//             "https://msmeerpsyn9-core.azurewebsites.net/api/HrmMaster/AuthorityMatrix"
//           ),
//           axios.get(
//             "https://msmeerpsyn9-core.azurewebsites.net/api/HrmMaster/Designation"
//           ),
//         ]);
// const srcData = Array.isArray(srcRes.data)
//   ? srcRes.data
//   : Object.values(srcRes.data);

// setSources(srcData);

//      setAuthorities(authRes.data || []);
//         setDesignations(desRes.data || []);
//       } catch {
//         toast.error("Failed to load dropdowns");
//       }
//     };
//     load();
//   }, []);

//   useEffect(() => {
//     if (!formData.source) {
//       setContinents([]);
//       return;
//     }
//     axios.get(`${apiBase}/GetContinent`, {
//   params: { sourceId: formData.source }
// })

//       .then((r) => setContinents(r.data || []))
//       .catch(() => setContinents([]));
//   }, [formData.source]);

//   useEffect(() => {
//     if (!formData.continent) {
//       setCountries([]);
//       return;
//     }
//     axios.get(`${apiBase}/GetCountry`, {
//   params: { continentId: formData.continent }
// })

//       .then((r) => setCountries(r.data || []))
//       .catch(() => setCountries([]));
//   }, [formData.continent, formData.source]);
// useEffect(() => {
//   if (!formData.CountryId) {
//     setStates([]);
//     return;
//   }

//   axios.get(`${apiBase}/GetState`, {
//     params: { countryId: formData.CountryId }
//   })
//   .then(res => setStates(res.data || []))
//   .catch(() => setStates([]));
// }, [formData.CountryId]);



// useEffect(() => {
//   if (!formData.StateId) {
//     setCities([]);
//     return;
//   }

//   axios.get(`${apiBase}/GetCity`, {
//     params: {
//       stateId: formData.StateId
//     }
//   })
//   .then(res => setCities(res.data || []))
//   .catch(() => setCities([]));
// }, [formData.StateId]);


//   // ---------- CHANGE / SUBMIT ----------
//  const handleChange = (e) => {
//   const { name, value, selectedOptions } = e.target;

//   setFormData(prev => {
//     const updated = { ...prev, [name]: value };

//     if (name === "CountryId") {
//       updated.CountryName = selectedOptions[0].text;
//       updated.StateId = "";
//       updated.StateName = "";
//       updated.CityId = "";
//       updated.CityName = "";
//     }

//     if (name === "StateId") {
//       updated.StateName = selectedOptions[0].text;
//       updated.CityId = "";
//       updated.CityName = "";
//     }

//     if (name === "CityId") {
//       updated.CityName = selectedOptions[0].text;
//     }

//     return updated;
//   });
// };


// const handleSubmit = async (e) => {
//   e.preventDefault();
//   if (!validateForm()) return;

//  const payload = {
//   ...formData,
//   CountryId: parseInt(formData.CountryId),
//   StateId: parseInt(formData.StateId),
//   CityId: parseInt(formData.CityId),
// };

//   await axios.post(`${apiBase}/Register`, payload);
// };


//   const handleCancel = () => {
//     setFormData({
//       company_name: "",
//       contact_person: "",
//       email_id: "",
//       contact_no: "",
//       gst_no: "",
//       source: "",
//       continent: "",
//       country: "",
//       state: "",
//       city: "",
//       authority: "",
//       designation: "",
//       password: "",
//       confirm_password: "",
//     });
//     setErrors({});
//     setTouched({});
//     setContinents([]);
//     setCountries([]);
//     setStates([]);
//     setCities([]);
//     toast.info("Form reset");
//   };

//   const inputClass = (name) =>
//     `form-control ${touched[name] && errors[name] ? "is-invalid" : ""
//     }`;

//   return (
//     <div className="register-container">
//       <ToastContainer />

//       <h3 className="form-title-box">Vendor Registration</h3>

//       <form onSubmit={handleSubmit} >
//         <div className="row">
//           {/* Company Name */}
//           <div className="col">
//             <label>
//               Company Name<span className="required-star">*</span>
//             </label>
//             <input
//               type="text"
//               name="company_name"
//               value={formData.company_name}
//               onChange={handleChange}
//               className={inputClass("company_name")}
//             />
//             {touched.company_name && errors.company_name && (
//               <small className="text-danger">{errors.company_name}</small>
//             )}
//           </div>

//           {/* Contact Person */}
//           <div className="col">
//             <label>
//               Contact Person<span className="required-star">*</span>
//             </label>
//             <input
//               type="text"
//               name="contact_person"
//               value={formData.contact_person}
//               onChange={handleChange}
//               className={inputClass("contact_person")}
//             />
//             {touched.contact_person && errors.contact_person && (
//               <small className="text-danger">{errors.contact_person}</small>
//             )}
//           </div>

//           {/* Email */}
//           <div className="col">
//             <label>
//               Email<span className="required-star">*</span>
//             </label>
//             <input
//               type="email"
//               name="email_id"
//               value={formData.email_id}
//               onChange={handleChange}
//               className={inputClass("email_id")}
//             />
//             {touched.email_id && errors.email_id && (
//               <small className="text-danger">{errors.email_id}</small>
//             )}
//           </div>

//           {/* Contact Number */}
//           <div className="col">
//             <label>
//               Contact Number<span className="required-star">*</span>
//             </label>
//             <input
//               type="text"
//               name="contact_no"
//               value={formData.contact_no}
//               onChange={handleChange}
//               className={inputClass("contact_no")}
//             />
//             {touched.contact_no && errors.contact_no && (
//               <small className="text-danger">{errors.contact_no}</small>
//             )}
//           </div>

//           {/* GST */}
//           <div className="col">
//             <label>
//               GST Number<span className="required-star">*</span>
//             </label>
//             <input
//               type="text"
//               name="gst_no"
//               value={formData.gst_no}
//               onChange={handleChange}
//               className={inputClass("gst_no")}
//             />
//             {touched.gst_no && errors.gst_no && (
//               <small className="text-danger">{errors.gst_no}</small>
//             )}
//           </div>


//         </div>

//         <div className="row">

//           {/* Source */}
//           <div className="col">
//             <label>
//               Source<span className="required-star">*</span>
//             </label>
//            <select name="source" value={formData.source} onChange={handleChange} className="form-control">
//   <option value="">Select Source</option>
//   {sources.map((src) => (
//     <option key={src.id} value={src.id}>
//       {src.name}
//     </option>
//   ))}
// </select>


//             {touched.source && errors.source && (
//               <small className="text-danger">{errors.source}</small>
//             )}
//           </div>

//           {/* Continent */}
//           <div className="col">
//             <label>
//               Continent<span className="required-star">*</span>
//             </label>
//            <select name="continent" value={formData.continent} onChange={handleChange} className="form-control" disabled={!formData.source}>
//   <option value="">Select Continent</option>
//   {continents.map((c) => (
//     <option key={c.id} value={c.id}>
//       {c.name}
//     </option>
//   ))}
// </select>

//             {touched.continent && errors.continent && (
//               <small className="text-danger">{errors.continent}</small>
//             )}
//           </div>

//           <div className="col">
//   <label>
//     Country<span className="required-star">*</span>
//   </label>

// <select name="CountryId" value={formData.CountryId} onChange={handleChange} className="form-control">
//   <option value="">Select Country</option>
//   {countries.map((c) => (
//     <option key={c.id} value={c.id}>
//       {c.name}
//     </option>
//   ))}
// </select>







//   {touched.CountryId && errors.CountryId && (
//     <small className="text-danger">{errors.CountryId}</small>
//   )}
// </div>

// <div className="col">
//   <label>
//     State<span className="required-star">*</span>
//   </label>

//  <select name="StateId" value={formData.StateId} onChange={handleChange} className="form-control">
//   <option value="">Select State</option>
//   {states.map((s) => (
//     <option key={s.id} value={s.id}>
//       {s.name}
//     </option>
//   ))}
// </select>



//   {touched.StateId && errors.StateId && (
//     <small className="text-danger">{errors.StateId}</small>
//   )}
// </div>

// <div className="col">
//   <label>
//     City<span className="required-star">*</span>
//   </label>

//  <select name="CityId" value={formData.CityId} onChange={handleChange} className="form-control">
//   <option value="">Select City</option>
//   {cities.map((c) => (
//     <option key={c.id} value={c.id}>
//       {c.name}
//     </option>
//   ))}
// </select>




//   {touched.CityId && errors.CityId && (
//     <small className="text-danger">{errors.CityId}</small>
//   )}
// </div>


//         </div>

//         <div className="row">

//           {/* Authority */}
//           <div className="col">
//             <label>
//               Authority<span className="required-star">*</span>
//             </label>
//            <select
//   name="authority"
//   value={formData.authority}
//   onChange={handleChange}
//   className={inputClass("authority")}
// >
//   <option value="">Select Authority</option>

//   {authorities
//     .filter(a => a.isActive)   // optional but recommended
//     .map(a => (
//       <option
//         key={a.authorityMatrixId}
//         value={a.authorityMatrixId}
//       >
//         {a.authorityMatrixName}
//       </option>
//     ))}
// </select>

//             {touched.authority && errors.authority && (
//               <small className="text-danger">{errors.authority}</small>
//             )}
//           </div>

//           {/* Designation */}
//           <div className="col">
//             <label>
//               Designation<span className="required-star">*</span>
//             </label>
//             <select
//               name="designation"
//               value={formData.designation}
//               onChange={handleChange}
//               className={inputClass("designation")}
//             >
//               <option value="">Select Designation</option>
//               {designations.map((d) => (
//                 <option value={d.designationId}>
//   {d.designationName}
// </option>

//               ))}
//             </select>
//             {touched.designation && errors.designation && (
//               <small className="text-danger">{errors.designation}</small>
//             )}
//           </div>

//           {/* Password */}
//           <div className="col">
//             <label>
//               Password<span className="required-star">*</span>
//             </label>
//             <div style={{ position: "relative" }}>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className={inputClass("password")}
//                 style={{ paddingRight: "40px" }}
//               />
//               <span
//                 onClick={() => setShowPassword((s) => !s)}
//                 style={{
//                   position: "absolute",
//                   right: "10px",
//                   top: "50%",
//                   transform: "translateY(-50%)",
//                   cursor: "pointer",
//                 }}
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </span>
//             </div>
//             {touched.password && errors.password && (
//               <small className="text-danger">{errors.password}</small>
//             )}
//           </div>

//           {/* Confirm Password */}
//           <div className="col">
//             <label>
//               Confirm Password<span className="required-star">*</span>
//             </label>
//             <div style={{ position: "relative" }}>
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 name="confirm_password"
//                 value={formData.confirm_password}
//                 onChange={handleChange}
//                 className={inputClass("confirm_password")}
//                 style={{ paddingRight: "40px" }}
//               />
//               <span
//                 onClick={() => setShowConfirmPassword((s) => !s)}
//                 style={{
//                   position: "absolute",
//                   right: "10px",
//                   top: "50%",
//                   transform: "translateY(-50%)",
//                   cursor: "pointer",
//                 }}
//               >
//                 {showConfirmPassword ? (
//                   <EyeOff size={18} />
//                 ) : (
//                   <Eye size={18} />
//                 )}
//               </span>
//             </div>
//             {touched.confirm_password && errors.confirm_password && (
//               <small className="text-danger">
//                 {errors.confirm_password}
//               </small>
//             )}
//           </div>

//         </div>


//         {/* BUTTONS – full row via external .btn-group */}
//         <div >
//           <button
//             type="button"
//             className="cancel-btn m-2 p-2 "
//             onClick={handleCancel}
//             disabled={isSubmitting}
//           >
//             Reset Form
//           </button>
//           <button
//             type="submit"
//             className="btn btn-success m-2 p-2"
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? "Saving..." : "Register Vendor"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default Register;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .reg-page {
    min-height: 100vh;
    background: #0f0f13;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 40px 16px 60px;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  .reg-page::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 10% 0%, rgba(255,180,60,0.08) 0%, transparent 60%),
      radial-gradient(ellipse 50% 40% at 90% 100%, rgba(255,100,60,0.07) 0%, transparent 60%);
    pointer-events: none;
  }

  .reg-card {
    width: 100%;
    max-width: 1100px;
    background: rgba(20, 20, 26, 0.95);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 24px;
    padding: 48px 52px;
    position: relative;
    backdrop-filter: blur(20px);
    box-shadow:
      0 0 0 1px rgba(255,180,60,0.08),
      0 32px 80px rgba(0,0,0,0.6),
      0 2px 0 rgba(255,180,60,0.15) inset;
    animation: slideUp 0.5s ease;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .reg-header {
    margin-bottom: 40px;
    padding-bottom: 28px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .reg-badge {
    display: inline-block;
    background: linear-gradient(135deg, rgba(255,180,60,0.15), rgba(255,100,60,0.1));
    border: 1px solid rgba(255,180,60,0.25);
    color: #ffb83c;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    padding: 5px 14px;
    border-radius: 100px;
    margin-bottom: 14px;
  }

  .reg-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(26px, 3vw, 36px);
    font-weight: 600;
    color: #f5f5f0;
    line-height: 1.15;
    letter-spacing: -0.5px;
  }

  .reg-title span {
    background: linear-gradient(135deg, #ffb83c, #ff6c3c);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .reg-subtitle {
    margin-top: 8px;
    font-size: 14px;
    color: rgba(255,255,255,0.38);
    font-weight: 300;
  }

  /* Section */
  .reg-section {
    margin-bottom: 36px;
  }

  .reg-section-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: rgba(255,180,60,0.7);
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .reg-section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.05);
  }

  /* Grid */
  .reg-grid {
    display: grid;
    gap: 16px;
  }

  .reg-grid-5 { grid-template-columns: repeat(5, 1fr); }
  .reg-grid-5-geo { grid-template-columns: 1fr 1fr 1fr 1fr 1fr; }
  .reg-grid-4 { grid-template-columns: repeat(4, 1fr); }
  .reg-grid-2 { grid-template-columns: repeat(2, 1fr); }

  @media (max-width: 900px) {
    .reg-grid-5, .reg-grid-5-geo, .reg-grid-4 { grid-template-columns: repeat(2, 1fr); }
    .reg-card { padding: 28px 20px; }
  }

  @media (max-width: 540px) {
    .reg-grid-5, .reg-grid-5-geo, .reg-grid-4, .reg-grid-2 { grid-template-columns: 1fr; }
  }

  /* Field */
  .reg-field { display: flex; flex-direction: column; gap: 6px; }

  .reg-label {
    font-size: 11.5px;
    font-weight: 500;
    color: rgba(255,255,255,0.45);
    letter-spacing: 0.3px;
  }

  .reg-star { color: #ff6c3c; margin-left: 2px; }

  .reg-input,
  .reg-select {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 10px;
    padding: 11px 14px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: #f0f0ea;
    outline: none;
    transition: all 0.2s ease;
    width: 100%;
    -webkit-appearance: none;
  }

  .reg-input::placeholder { color: rgba(255,255,255,0.18); }

  .reg-input:focus,
  .reg-select:focus {
    border-color: rgba(255,180,60,0.5);
    background: rgba(255,180,60,0.04);
    box-shadow: 0 0 0 3px rgba(255,180,60,0.08);
  }

  .reg-input.error,
  .reg-select.error {
    border-color: rgba(255,90,80,0.5);
    background: rgba(255,90,80,0.04);
  }

  .reg-select option {
    background: #1a1a22;
    color: #f0f0ea;
  }

  .reg-select:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .reg-error {
    font-size: 11px;
    color: #ff6060;
    margin-top: 2px;
  }

  /* Password wrapper */
  .pw-wrap { position: relative; }

  .pw-wrap .reg-input { padding-right: 42px; }

  .pw-eye {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: rgba(255,255,255,0.3);
    display: flex;
    align-items: center;
    padding: 0;
    transition: color 0.15s;
  }

  .pw-eye:hover { color: #ffb83c; }

  /* Select arrow */
  .select-wrap { position: relative; }

  .select-wrap::after {
    content: '▾';
    position: absolute;
    right: 13px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255,255,255,0.25);
    pointer-events: none;
    font-size: 12px;
  }

  /* Divider */
  .reg-divider {
    height: 1px;
    background: rgba(255,255,255,0.05);
    margin: 8px 0 32px;
  }

  /* Buttons */
  .reg-actions {
    display: flex;
    gap: 12px;
    align-items: center;
    padding-top: 28px;
    border-top: 1px solid rgba(255,255,255,0.05);
    margin-top: 8px;
  }

  .btn-register {
    flex: 1;
    background: linear-gradient(135deg, #ffb83c, #ff6c3c);
    border: none;
    border-radius: 12px;
    padding: 14px 32px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #0f0f13;
    cursor: pointer;
    transition: all 0.25s ease;
    position: relative;
    overflow: hidden;
    letter-spacing: 0.3px;
  }

  .btn-register::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .btn-register:hover::after { opacity: 1; }
  .btn-register:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(255,120,60,0.3); }
  .btn-register:active { transform: translateY(0); }
  .btn-register:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .btn-reset {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 14px 24px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: rgba(255,255,255,0.5);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-reset:hover {
    background: rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.75);
    border-color: rgba(255,255,255,0.15);
  }

  .btn-reset:disabled { opacity: 0.4; cursor: not-allowed; }

  /* Toast override */
  .Toastify__toast {
    font-family: 'DM Sans', sans-serif !important;
    border-radius: 12px !important;
    font-size: 13px !important;
  }
`;

function Register() {
  const [formData, setFormData] = useState({
    company_name: "", contact_person: "", email_id: "", contact_no: "", gst_no: "",
    source: "", continent: "", CountryId: "", StateId: "", CityId: "",
    authority: "", designation: "", password: "", confirm_password: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [sources, setSources] = useState([]);
  const [continents, setContinents] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [authorities, setAuthorities] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiBase = "https://msmeerpsyn9-core.azurewebsites.net/api/HRMAdminRegAPI";

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "company_name":
      case "contact_person":
        if (!value?.trim()) error = "This field is required";
        else if (value.trim().length < 2) error = "Minimum 2 characters";
        break;
      case "email_id":
        if (!value?.trim()) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) error = "Enter a valid email";
        break;
      case "contact_no": {
        const digits = (value || "").replace(/\D/g, "");
        if (!digits) error = "Contact number is required";
        else if (digits.length !== 10) error = "Enter 10-digit mobile number";
        break;
      }
      case "gst_no": {
        const v = (value || "").trim().toUpperCase();
        if (!v) error = "GST number is required";
        else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v))
          error = "Enter valid GST format (12ABCDE3456F1Z5)";
        break;
      }
      case "source": case "continent": case "country": case "state": case "city":
      case "authority": case "designation": case "CountryId": case "StateId": case "CityId":
        if (!value) error = "Please select an option";
        break;
      case "password":
        if (!value) error = "Password is required";
        else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(value))
          error = "8+ chars with upper, lower, number & special char";
        break;
      case "confirm_password":
        if (!value) error = "Confirm password is required";
        else if (value !== formData.password) error = "Passwords do not match";
        break;
      default: break;
    }
    return error;
  };

  const validateForm = () => {
    const fields = ["company_name","contact_person","email_id","contact_no","gst_no",
      "source","continent","CountryId","StateId","CityId","authority","designation",
      "password","confirm_password"];
    const newErrors = {};
    fields.forEach(f => { const err = validateField(f, formData[f]); if (err) newErrors[f] = err; });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [srcRes, authRes, desRes] = await Promise.all([
          axios.get(`${apiBase}/GetSource`),
          axios.get("https://msmeerpsyn9-core.azurewebsites.net/api/HrmMaster/AuthorityMatrix"),
          axios.get("https://msmeerpsyn9-core.azurewebsites.net/api/HrmMaster/Designation"),
        ]);
        setSources(Array.isArray(srcRes.data) ? srcRes.data : Object.values(srcRes.data));
        setAuthorities(authRes.data || []);
        setDesignations(desRes.data || []);
      } catch { toast.error("Failed to load dropdowns"); }
    };
    load();
  }, []);

  useEffect(() => {
    if (!formData.source) { setContinents([]); return; }
    axios.get(`${apiBase}/GetContinent`, { params: { sourceId: formData.source } })
      .then(r => setContinents(r.data || [])).catch(() => setContinents([]));
  }, [formData.source]);

  useEffect(() => {
    if (!formData.continent) { setCountries([]); return; }
    axios.get(`${apiBase}/GetCountry`, { params: { continentId: formData.continent } })
      .then(r => setCountries(r.data || [])).catch(() => setCountries([]));
  }, [formData.continent]);

  useEffect(() => {
    if (!formData.CountryId) { setStates([]); return; }
    axios.get(`${apiBase}/GetState`, { params: { countryId: formData.CountryId } })
      .then(r => setStates(r.data || [])).catch(() => setStates([]));
  }, [formData.CountryId]);

  useEffect(() => {
    if (!formData.StateId) { setCities([]); return; }
    axios.get(`${apiBase}/GetCity`, { params: { stateId: formData.StateId } })
      .then(r => setCities(r.data || [])).catch(() => setCities([]));
  }, [formData.StateId]);

  const handleChange = (e) => {
    const { name, value, selectedOptions } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === "CountryId") { updated.CountryName = selectedOptions[0].text; updated.StateId = ""; updated.StateName = ""; updated.CityId = ""; updated.CityName = ""; }
      if (name === "StateId") { updated.StateName = selectedOptions[0].text; updated.CityId = ""; updated.CityName = ""; }
      if (name === "CityId") { updated.CityName = selectedOptions[0].text; }
      return updated;
    });
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(
      ["company_name","contact_person","email_id","contact_no","gst_no","source","continent",
       "CountryId","StateId","CityId","authority","designation","password","confirm_password"]
        .map(k => [k, true])
    );
    setTouched(allTouched);
    if (!validateForm()) { toast.error("Please fix all errors before submitting."); return; }
    setIsSubmitting(true);
    try {
      const payload = { ...formData, CountryId: parseInt(formData.CountryId), StateId: parseInt(formData.StateId), CityId: parseInt(formData.CityId) };
      await axios.post(`${apiBase}/Register`, payload);
      toast.success("Vendor registered successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({ company_name:"",contact_person:"",email_id:"",contact_no:"",gst_no:"",
      source:"",continent:"",CountryId:"",StateId:"",CityId:"",authority:"",designation:"",
      password:"",confirm_password:"" });
    setErrors({}); setTouched({});
    setContinents([]); setCountries([]); setStates([]); setCities([]);
  };

  const inputCls = (name) => `reg-input${touched[name] && errors[name] ? " error" : ""}`;
  const selectCls = (name) => `reg-select${touched[name] && errors[name] ? " error" : ""}`;

  const Field = ({ name, label, children, error }) => (
    <div className="reg-field">
      <label className="reg-label">{label}<span className="reg-star">*</span></label>
      {children}
      {touched[name] && errors[name] && <span className="reg-error">{errors[name]}</span>}
    </div>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="reg-page">
        <div className="reg-card">

          <div className="reg-header">
            <div className="reg-badge">New Registration</div>
            <h1 className="reg-title">Vendor <span>Registration</span></h1>
            <p className="reg-subtitle">Fill in the details below to register as an approved vendor</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>

            {/* Company Info */}
            <div className="reg-section">
              <div className="reg-section-label">Company Information</div>
              <div className="reg-grid reg-grid-5">
                <Field name="company_name" label="Company Name">
                  <input type="text" name="company_name" value={formData.company_name}
                    onChange={handleChange} onBlur={handleBlur} className={inputCls("company_name")}
                    placeholder="Acme Corp Ltd." />
                </Field>
                <Field name="contact_person" label="Contact Person">
                  <input type="text" name="contact_person" value={formData.contact_person}
                    onChange={handleChange} onBlur={handleBlur} className={inputCls("contact_person")}
                    placeholder="John Doe" />
                </Field>
                <Field name="email_id" label="Email Address">
                  <input type="email" name="email_id" value={formData.email_id}
                    onChange={handleChange} onBlur={handleBlur} className={inputCls("email_id")}
                    placeholder="john@company.com" />
                </Field>
                <Field name="contact_no" label="Contact Number">
                  <input type="text" name="contact_no" value={formData.contact_no}
                    onChange={handleChange} onBlur={handleBlur} className={inputCls("contact_no")}
                    placeholder="9876543210" />
                </Field>
                <Field name="gst_no" label="GST Number">
                  <input type="text" name="gst_no" value={formData.gst_no}
                    onChange={handleChange} onBlur={handleBlur} className={inputCls("gst_no")}
                    placeholder="12ABCDE3456F1Z5" />
                </Field>
              </div>
            </div>

            {/* Geography */}
            <div className="reg-section">
              <div className="reg-section-label">Geographic Details</div>
              <div className="reg-grid reg-grid-5">
                <Field name="source" label="Source">
                  <div className="select-wrap">
                    <select name="source" value={formData.source} onChange={handleChange}
                      onBlur={handleBlur} className={selectCls("source")}>
                      <option value="">Select Source</option>
                      {sources.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                </Field>
                <Field name="continent" label="Continent">
                  <div className="select-wrap">
                    <select name="continent" value={formData.continent} onChange={handleChange}
                      onBlur={handleBlur} className={selectCls("continent")} disabled={!formData.source}>
                      <option value="">Select Continent</option>
                      {continents.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </Field>
                <Field name="CountryId" label="Country">
                  <div className="select-wrap">
                    <select name="CountryId" value={formData.CountryId} onChange={handleChange}
                      onBlur={handleBlur} className={selectCls("CountryId")} disabled={!formData.continent}>
                      <option value="">Select Country</option>
                      {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </Field>
                <Field name="StateId" label="State">
                  <div className="select-wrap">
                    <select name="StateId" value={formData.StateId} onChange={handleChange}
                      onBlur={handleBlur} className={selectCls("StateId")} disabled={!formData.CountryId}>
                      <option value="">Select State</option>
                      {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                </Field>
                <Field name="CityId" label="City">
                  <div className="select-wrap">
                    <select name="CityId" value={formData.CityId} onChange={handleChange}
                      onBlur={handleBlur} className={selectCls("CityId")} disabled={!formData.StateId}>
                      <option value="">Select City</option>
                      {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </Field>
              </div>
            </div>

            {/* Role & Security */}
            <div className="reg-section">
              <div className="reg-section-label">Role & Security</div>
              <div className="reg-grid reg-grid-4">
                <Field name="authority" label="Authority">
                  <div className="select-wrap">
                    <select name="authority" value={formData.authority} onChange={handleChange}
                      onBlur={handleBlur} className={selectCls("authority")}>
                      <option value="">Select Authority</option>
                      {authorities.filter(a => a.isActive).map(a =>
                        <option key={a.authorityMatrixId} value={a.authorityMatrixId}>{a.authorityMatrixName}</option>)}
                    </select>
                  </div>
                </Field>
                <Field name="designation" label="Designation">
                  <div className="select-wrap">
                    <select name="designation" value={formData.designation} onChange={handleChange}
                      onBlur={handleBlur} className={selectCls("designation")}>
                      <option value="">Select Designation</option>
                      {designations.map(d =>
                        <option key={d.designationId} value={d.designationId}>{d.designationName}</option>)}
                    </select>
                  </div>
                </Field>
                <Field name="password" label="Password">
                  <div className="pw-wrap">
                    <input type={showPassword ? "text" : "password"} name="password"
                      value={formData.password} onChange={handleChange} onBlur={handleBlur}
                      className={inputCls("password")} placeholder="Min. 8 characters" />
                    <button type="button" className="pw-eye" onClick={() => setShowPassword(s => !s)}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </Field>
                <Field name="confirm_password" label="Confirm Password">
                  <div className="pw-wrap">
                    <input type={showConfirmPassword ? "text" : "password"} name="confirm_password"
                      value={formData.confirm_password} onChange={handleChange} onBlur={handleBlur}
                      className={inputCls("confirm_password")} placeholder="Re-enter password" />
                    <button type="button" className="pw-eye" onClick={() => setShowConfirmPassword(s => !s)}>
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </Field>
              </div>
            </div>

            <div className="reg-actions">
              <button type="button" className="btn-reset" onClick={handleCancel} disabled={isSubmitting}>
                Reset Form
              </button>
              <button type="submit" className="btn-register" disabled={isSubmitting}>
                {isSubmitting ? "Registering…" : "Register Vendor →"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover={false}
        draggable={false}
        limit={1}
        toastStyle={{ background: "#1e1e28", color: "#f0f0ea", border: "1px solid rgba(255,255,255,0.1)" }}
      />
    </>
  );
}

export default Register;