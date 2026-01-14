// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "./Register.css";
// import { Eye, EyeOff } from "lucide-react";
// //import
// function Register() {
//   const [formData, setFormData] = useState({
//     company_name: "",
//     contact_person: "",
//     email_id: "",
//     contact_no: "",
//     gst_no: "",
//     source: "",
//     continent: "",
//     country: "",
//     state: "",
//     city: "",
//     authority: "",
//     designation: "",
//     password: "",
//     confirm_password  : "",
//   });

//   const [errors, setErrors] = useState({});
//   const [sources, setSources] = useState([]);
//   const [continents, setContinents] = useState([]);
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [authorities, setAuthorities] = useState([]);
//   const [designations, setDesignations] = useState([]);
//   const [showPassword, setShowPassword] = useState(false);
// const [showConfirmPassword, setShowConfirmPassword] = useState(false);


//   const apiBase = "https://msmeerpsyn9-core.azurewebsites.net/api/HRMAdminRegAPI";

//   // -------------------- VALIDATION --------------------
//   const validateForm = () => {
//     let newErrors = {};
//     let isValid = true;

//     const password = formData.password;
//     const confirmPassword = formData.confirm_password;

//     const strongPasswordRegex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

//     if (!password) {
//       isValid = false;
//       newErrors.password = "Password is required";
//     } else if (!strongPasswordRegex.test(password)) {
//       isValid = false;
//       newErrors.password =
//         "Password must be at least 8 characters and include upper-case, lower-case, number and special character.";
//     }

//     if (!confirmPassword) {
//       isValid = false;
//       newErrors.confirm_password = "Confirm Password is required";
//     } else if (password !== confirmPassword) {
//       isValid = false;
//       newErrors.confirm_password = "Passwords do not match";
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   // -------------------- FETCH DROPDOWNS --------------------
//   useEffect(() => {
//     const fetchDropdowns = async () => {
//       try {
//         const [sourcesRes, authoritiesRes, designationsRes] =
//           await Promise.all([
//             axios.get(`${apiBase}/GetSource`),
//             axios.get("https://msmeerpsyn9-core.azurewebsites.net/api/HrmMaster/AuthorityMatrix"),
//             axios.get("https://msmeerpsyn9-core.azurewebsites.net/api/HrmMaster/Designation"),
//           ]);

//         setSources(sourcesRes.data);
//         setAuthorities(authoritiesRes.data);
//         setDesignations(designationsRes.data);
//       } catch (err) {
//         console.error("Dropdown fetch error:", err);
//         toast.error("Failed to load dropdowns");
//       }
//     };

//     fetchDropdowns();
//   }, []);

//   // CONTINENT
//   useEffect(() => {
//     if (formData.source) {
//       axios
//         .get(`${apiBase}/GetContinent`, {
//           params: { source: formData.source },
//         })
//         .then((res) => setContinents(res.data))
//         .catch((err) => console.error("Continent error:", err));
//     } else setContinents([]);
//   }, [formData.source]);

//   // COUNTRY
//   useEffect(() => {
//     if (formData.continent) {
//       axios
//         .get(`${apiBase}/GetCountry`, {
//           params: { source: formData.source, continent: formData.continent },
//         })
//         .then((res) => setCountries(res.data))
//         .catch((err) => console.error("Country error:", err));
//     } else setCountries([]);
//   }, [formData.continent]);

//   // STATE
//   useEffect(() => {
//     if (formData.country) {
//       axios
//         .get(`${apiBase}/GetState`, {
//           params: {
//             source: formData.source,
//             continent: formData.continent,
//             country: formData.country,
//           },
//         })
//         .then((res) => setStates(res.data))
//         .catch((err) => console.error("State error:", err));
//     } else setStates([]);
//   }, [formData.country]);

//   // CITY
//   useEffect(() => {
//     if (formData.state) {
//       axios
//         .get(`${apiBase}/GetCity`, {
//           params: {
//             source: formData.source,
//             continent: formData.continent,
//             country: formData.country,
//             state: formData.state,
//           },
//         })
//         .then((res) => setCities(res.data))
//         .catch((err) => console.error("City error:", err));
//     } else setCities([]);
//   }, [formData.state]);

//   // ---------------------- HANDLE CHANGE ----------------------
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,

//       ...(name === "source"
//         ? { continent: "", country: "", state: "", city: "" }
//         : {}),
//       ...(name === "continent"
//         ? { country: "", state: "", city: "" }
//         : {}),
//       ...(name === "country" ? { state: "", city: "" } : {}),
//       ...(name === "state" ? { city: "" } : {}),
//     }));
//   };

//   // ---------------------- SUBMIT ----------------------
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       toast.error("Please fix validation errors!");
//       return;
//     }

//     try {
//       const res = await axios.post(`${apiBase}/Register`, formData, {
//         headers: { "Content-Type": "application/json" },
//       });

//       if (res.data.success) {
//         toast.success("Registration Successful!");

//         setFormData({
//           company_name: "",
//           contact_person: "",
//           email_id: "",
//           contact_no: "",
//           gst_no: "",
//           source: "",
//           continent: "",
//           country: "",
//           state: "",
//           city: "",
//           authority: "",
//           designation: "",
//           password: "",
//           confirm_password: "",
//         });
//       } else {
//         toast.warning(res.data.message);
//       }
//     } catch (err) {
//       console.error("Registration error:", err);
//       toast.error("Registration failed!");
//     }
//   };

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
//   };

//   // ⭐ LABEL Component for cleaner code
//   const RequiredLabel = ({ text }) => (
//     <label>
//       {text}
//       <span className="required-star">*</span>
//     </label>
//   );

//   return (
//     <div className="register-container">
//       <ToastContainer position="top-right" autoClose={3000} />

// <h3 className="form-title-box">Registration Form</h3>

//       <form onSubmit={handleSubmit} className="row g-3">

//         {/* COMPANY NAME */}
//         <div className="col-md-4">
//           <RequiredLabel text="Company Name" />
//           <input
//             type="text"
//             name="company_name"
//             value={formData.company_name}
//             onChange={handleChange}
//             className="form-control"
//           />
//         </div>

//         {/* CONTACT PERSON */}
//         <div className="col-md-4">
//           <RequiredLabel text="Contact Person" />
//           <input
//             type="text"
//             name="contact_person"
//             value={formData.contact_person}
//             onChange={handleChange}
//             className="form-control"
//           />
//         </div>

//         {/* EMAIL */}
//         <div className="col-md-4">
//           <RequiredLabel text="Email ID" />
//           <input
//             type="email"
//             name="email_id"
//             value={formData.email_id}
//             onChange={handleChange}
//             className="form-control"
//           />
//         </div>

//         {/* CONTACT NUMBER */}
//         <div className="col-md-4">
//           <RequiredLabel text="Contact Number" />
//           <input
//             type="text"
//             name="contact_no"
//             value={formData.contact_no}
//             onChange={handleChange}
//             className="form-control"
//           />
//         </div>

//         {/* GST */}
//         <div className="col-md-4">
//           <RequiredLabel text="GST Number" />
//           <input
//             type="text"
//             name="gst_no"
//             value={formData.gst_no}
//             onChange={handleChange}
//             className="form-control"
//           />
//         </div>

//         {/* SOURCE */}
//         <div className="col-md-4">
//           <RequiredLabel text="Source" />
//           <select
//             name="source"
//             value={formData.source}
//             onChange={handleChange}
//             className="form-control"
//           >
//             <option value="">Select Source</option>
//             {sources.map((src) => (
//               <option key={src} value={src}>
//                 {src}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* CONTINENT */}
//         <div className="col-md-4">
//           <RequiredLabel text="Continent" />
//           <select
//             name="continent"
//             value={formData.continent}
//             onChange={handleChange}
//             className="form-control"
//           >
//             <option value="">Select Continent</option>
//             {continents.map((c) => (
//               <option key={c} value={c}>
//                 {c}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* COUNTRY */}
//         <div className="col-md-4">
//           <RequiredLabel text="Country" />
//           <select
//             name="country"
//             value={formData.country}
//             onChange={handleChange}
//             className="form-control"
//           >
//             <option value="">Select Country</option>
//             {countries.map((c) => (
//               <option key={c} value={c}>
//                 {c}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* STATE */}
//         <div className="col-md-4">
//           <RequiredLabel text="State" />
//           <select
//             name="state"
//             value={formData.state}
//             onChange={handleChange}
//             className="form-control"
//           >
//             <option value="">Select State</option>
//             {states.map((s) => (
//               <option key={s} value={s}>
//                 {s}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* CITY */}
//         <div className="col-md-4">
//           <RequiredLabel text="City" />
//           <select
//             name="city"
//             value={formData.city}
//             onChange={handleChange}
//             className="form-control"
//           >
//             <option value="">Select City</option>
//             {cities.map((c) => (
//               <option key={c} value={c}>
//                 {c}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* AUTHORITY */}
//         <div className="col-md-4">
//           <RequiredLabel text="Authority" />
//           <select
//             name="authority"
//             value={formData.authority}
//             onChange={handleChange}
//             className="form-control"
//           >
//             <option value="">Select Authority</option>
//             {authorities.map((a) => (
//               <option key={a.authority_code} value={a.authority_code}>
//                 {a.authorityName}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* DESIGNATION */}
//         <div className="col-md-4">
//           <RequiredLabel text="Designation" />
//           <select
//             name="designation"
//             value={formData.designation}
//             onChange={handleChange}
//             className="form-control"
//           >
//             <option value="">Select Designation</option>
//             {designations.map((d) => (
//               <option key={d.designation_code} value={d.designation_code}>
//                 {d.designationName}
//               </option>
//             ))}
//           </select>
//         </div>
// {/* PASSWORD */}
// <div className="col-md-4">
//   <RequiredLabel text="Password" />

//   <div className="position-relative">
//     <input
//       type={showPassword ? "text" : "password"}
//       name="password"
//       value={formData.password}
//       onChange={handleChange}
//       className="form-control"
//       style={{ paddingRight: "40px" }}
//     />

//     <span
//       onClick={() => setShowPassword(!showPassword)}
//       style={{
//         position: "absolute",
//         right: "10px",
//         top: "50%",
//         transform: "translateY(-50%)",
//         cursor: "pointer"
//       }}
//     >
//       {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//     </span>
//   </div>
// </div>

// {/* CONFIRM PASSWORD */}
// <div className="col-md-4">
//   <RequiredLabel text="Confirm Password" />

//   <div className="position-relative">
//     <input
//       type={showConfirmPassword ? "text" : "password"}
//       name="confirm_password"
//       value={formData.confirm_password}
//       onChange={handleChange}
//       className="form-control"
//       style={{ paddingRight: "40px" }}
//     />

//     <span
//       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//       style={{
//         position: "absolute",
//         right: "10px",
//         top: "50%",
//         transform: "translateY(-50%)",
//         cursor: "pointer"
//       }}
//     >
//       {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//     </span>
//   </div>
// </div>

// {/* BUTTONS */}
//         <div className="btn-group mt-3">
//  <div className="btn-group">
//   <button type="submit" className="btn btn-primary">
//     Register
//   </button>

//   <button type="button" className="btn btn-cancel">
//     Cancel
//   </button>
// </div>

// </div>

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
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    company_name: "",
    contact_person: "",
    email_id: "",
    contact_no: "",
    gst_no: "",
    source: "",
    continent: "",
    country: "",
    state: "",
    city: "",
    authority: "",
    designation: "",
    password: "",
    confirm_password: "",
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

  //const apiBase = "https://msmeerpsyn9-core.azurewebsites.net/api/HRMAdminRegAPI";

  const apiBase =
    "https://localhost:7145/api/HRMAdminRegAPI";

  // ---------- VALIDATION ----------
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
        else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value.trim()))
            error = "Enter a valid email";
        }
        break;

      case "contact_no": {
        const digits = (value || "").replace(/\D/g, "");
        if (!digits) error = "Contact number is required";
        else if (digits.length !== 10)
          error = "Enter 10‑digit mobile number";
        break;
      }

      case "gst_no": {
        const v = (value || "").trim().toUpperCase();
        if (!v) error = "GST number is required";
        else {
          const gstRegex =
            /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
          if (!gstRegex.test(v))
            error = "Enter valid GST format (12ABCDE3456F1Z5)";
        }
        break;
      }

      case "source":
      case "continent":
      case "country":
      case "state":
      case "city":
      case "authority":
      case "designation":
        if (!value) error = "Please select an option";
        break;

      case "password":
        if (!value) error = "Password is required";
        else {
          const strong =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
          if (!strong.test(value))
            error =
              "Password must be 8+ chars with upper, lower, number & special char";
        }
        break;

      case "confirm_password":
        if (!value) error = "Confirm password is required";
        else if (value !== formData.password)
          error = "Passwords do not match";
        break;

      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const fields = [
      "company_name",
      "contact_person",
      "email_id",
      "contact_no",
      "gst_no",
      "source",
      "continent",
      "country",
      "state",
      "city",
      "authority",
      "designation",
      "password",
      "confirm_password",
    ];

    const newErrors = {};
    fields.forEach((f) => {
      const err = validateField(f, formData[f]);
      if (err) newErrors[f] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------- DROPDOWNS ----------
  useEffect(() => {
    const load = async () => {
      try {
        const [srcRes, authRes, desRes] = await Promise.all([
          axios.get(`${apiBase}/GetSource`),
          axios.get(
            "https://msmeerpsyn9-core.azurewebsites.net/api/HrmMaster/AuthorityMatrix"
          ),
          axios.get(
            "https://msmeerpsyn9-core.azurewebsites.net/api/HrmMaster/Designation"
          ),
        ]);
const srcData = Array.isArray(srcRes.data)
  ? srcRes.data
  : Object.values(srcRes.data);

setSources(srcData);

     setAuthorities(authRes.data || []);
        setDesignations(desRes.data || []);
      } catch {
        toast.error("Failed to load dropdowns");
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!formData.source) {
      setContinents([]);
      return;
    }
    axios
      .get(`${apiBase}/GetContinent`, { params: { source: formData.source } })
      .then((r) => setContinents(r.data || []))
      .catch(() => setContinents([]));
  }, [formData.source]);

  useEffect(() => {
    if (!formData.continent) {
      setCountries([]);
      return;
    }
    axios
      .get(`${apiBase}/GetCountry`, {
        params: {
          source: formData.source,
          continent: formData.continent,
        },
      })
      .then((r) => setCountries(r.data || []))
      .catch(() => setCountries([]));
  }, [formData.continent, formData.source]);

  useEffect(() => {
    if (!formData.country) {
      setStates([]);
      return;
    }
    axios
      .get(`${apiBase}/GetState`, {
        params: {
          source: formData.source,
          continent: formData.continent,
          country: formData.country,
        },
      })
      .then((r) => setStates(r.data || []))
      .catch(() => setStates([]));
  }, [formData.country, formData.continent, formData.source]);

  useEffect(() => {
    if (!formData.state) {
      setCities([]);
      return;
    }
    axios
      .get(`${apiBase}/GetCity`, {
        params: {
          source: formData.source,
          continent: formData.continent,
          country: formData.country,
          state: formData.state,
        },
      })
      .then((r) => setCities(r.data || []))
      .catch(() => setCities([]));
  }, [
    formData.state,
    formData.country,
    formData.continent,
    formData.source,
  ]);

  // ---------- CHANGE / SUBMIT ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "source") {
        updated.continent = "";
        updated.country = "";
        updated.state = "";
        updated.city = "";
      }
      if (name === "continent") {
        updated.country = "";
        updated.state = "";
        updated.city = "";
      }
      if (name === "country") {
        updated.state = "";
        updated.city = "";
      }
      if (name === "state") {
        updated.city = "";
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix all highlighted errors");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(`${apiBase}/Register`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.data?.success) {
        toast.success("Registration successfull");
        setFormData({
          company_name: "",
          contact_person: "",
          email_id: "",
          contact_no: "",
          gst_no: "",
          source: "",
          continent: "",
          country: "",
          state: "",
          city: "",
          authority: "",
          designation: "",
          password: "",
          confirm_password: "",
        });
        setErrors({});
        setTouched({});
        setContinents([]);
        setCountries([]);
        setStates([]);
        setCities([]);
      } else {
        toast.warning(res.data?.message || "Registration failed");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      company_name: "",
      contact_person: "",
      email_id: "",
      contact_no: "",
      gst_no: "",
      source: "",
      continent: "",
      country: "",
      state: "",
      city: "",
      authority: "",
      designation: "",
      password: "",
      confirm_password: "",
    });
    setErrors({});
    setTouched({});
    setContinents([]);
    setCountries([]);
    setStates([]);
    setCities([]);
    toast.info("Form reset");
  };

  const inputClass = (name) =>
    `form-control ${touched[name] && errors[name] ? "is-invalid" : ""
    }`;

  return (
    <div className="register-container">
      <ToastContainer />

      <h3 className="form-title-box">Vendor Registration</h3>

      <form onSubmit={handleSubmit} >
        <div className="row">
          {/* Company Name */}
          <div className="col">
            <label>
              Company Name<span className="required-star">*</span>
            </label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              className={inputClass("company_name")}
            />
            {touched.company_name && errors.company_name && (
              <small className="text-danger">{errors.company_name}</small>
            )}
          </div>

          {/* Contact Person */}
          <div className="col">
            <label>
              Contact Person<span className="required-star">*</span>
            </label>
            <input
              type="text"
              name="contact_person"
              value={formData.contact_person}
              onChange={handleChange}
              className={inputClass("contact_person")}
            />
            {touched.contact_person && errors.contact_person && (
              <small className="text-danger">{errors.contact_person}</small>
            )}
          </div>

          {/* Email */}
          <div className="col">
            <label>
              Email<span className="required-star">*</span>
            </label>
            <input
              type="email"
              name="email_id"
              value={formData.email_id}
              onChange={handleChange}
              className={inputClass("email_id")}
            />
            {touched.email_id && errors.email_id && (
              <small className="text-danger">{errors.email_id}</small>
            )}
          </div>

          {/* Contact Number */}
          <div className="col">
            <label>
              Contact Number<span className="required-star">*</span>
            </label>
            <input
              type="text"
              name="contact_no"
              value={formData.contact_no}
              onChange={handleChange}
              className={inputClass("contact_no")}
            />
            {touched.contact_no && errors.contact_no && (
              <small className="text-danger">{errors.contact_no}</small>
            )}
          </div>

          {/* GST */}
          <div className="col">
            <label>
              GST Number<span className="required-star">*</span>
            </label>
            <input
              type="text"
              name="gst_no"
              value={formData.gst_no}
              onChange={handleChange}
              className={inputClass("gst_no")}
            />
            {touched.gst_no && errors.gst_no && (
              <small className="text-danger">{errors.gst_no}</small>
            )}
          </div>


        </div>

        <div className="row">

          {/* Source */}
          <div className="col">
            <label>
              Source<span className="required-star">*</span>
            </label>
            <select
  name="source"
  value={formData.source}
  onChange={handleChange}
  className="form-control"
>
  <option value="">Select Source</option>
  {sources.length > 0 &&
    sources.map((src, index) => (
      <option key={index} value={src}>
        {src}
      </option>
    ))}
</select>

            {touched.source && errors.source && (
              <small className="text-danger">{errors.source}</small>
            )}
          </div>

          {/* Continent */}
          <div className="col">
            <label>
              Continent<span className="required-star">*</span>
            </label>
            <select
              name="continent"
              value={formData.continent}
              onChange={handleChange}
              className={inputClass("continent")}
              disabled={!formData.source}
            >
              <option value="">Select Continent</option>
              {continents.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {touched.continent && errors.continent && (
              <small className="text-danger">{errors.continent}</small>
            )}
          </div>

          {/* Country */}
          <div className="col">
            <label>
              Country<span className="required-star">*</span>
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={inputClass("country")}
              disabled={!formData.continent}
            >
              <option value="">Select Country</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {touched.country && errors.country && (
              <small className="text-danger">{errors.country}</small>
            )}
          </div>

          {/* State */}
          <div className="col">
            <label>
              State<span className="required-star">*</span>
            </label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={inputClass("state")}
              disabled={!formData.country}
            >
              <option value="">Select State</option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {touched.state && errors.state && (
              <small className="text-danger">{errors.state}</small>
            )}
          </div>

          {/* City */}
          <div className="col">
            <label>
              City<span className="required-star">*</span>
            </label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={inputClass("city")}
              disabled={!formData.state}
            >
              <option value="">Select City</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {touched.city && errors.city && (
              <small className="text-danger">{errors.city}</small>
            )}
          </div>

        </div>

        <div className="row">

          {/* Authority */}
          <div className="col">
            <label>
              Authority<span className="required-star">*</span>
            </label>
            <select
              name="authority"
              value={formData.authority}
              onChange={handleChange}
              className={inputClass("authority")}
            >
              <option value="">Select Authority</option>
              {authorities.map((a) => (
                <option key={a.authority_code} value={a.authority_code}>
                  {a.authorityName}
                </option>
              ))}
            </select>
            {touched.authority && errors.authority && (
              <small className="text-danger">{errors.authority}</small>
            )}
          </div>

          {/* Designation */}
          <div className="col">
            <label>
              Designation<span className="required-star">*</span>
            </label>
            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className={inputClass("designation")}
            >
              <option value="">Select Designation</option>
              {designations.map((d) => (
                <option
                  key={d.designation_code}
                  value={d.designation_code}
                >
                  {d.designationName}
                </option>
              ))}
            </select>
            {touched.designation && errors.designation && (
              <small className="text-danger">{errors.designation}</small>
            )}
          </div>

          {/* Password */}
          <div className="col">
            <label>
              Password<span className="required-star">*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={inputClass("password")}
                style={{ paddingRight: "40px" }}
              />
              <span
                onClick={() => setShowPassword((s) => !s)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
            {touched.password && errors.password && (
              <small className="text-danger">{errors.password}</small>
            )}
          </div>

          {/* Confirm Password */}
          <div className="col">
            <label>
              Confirm Password<span className="required-star">*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className={inputClass("confirm_password")}
                style={{ paddingRight: "40px" }}
              />
              <span
                onClick={() => setShowConfirmPassword((s) => !s)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </span>
            </div>
            {touched.confirm_password && errors.confirm_password && (
              <small className="text-danger">
                {errors.confirm_password}
              </small>
            )}
          </div>

        </div>


        {/* BUTTONS – full row via external .btn-group */}
        <div >
          <button
            type="button"
            className="btn btn-danger m-2 p-2 "
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Reset Form
          </button>
          <button
            type="submit"
            className="btn btn-success m-2 p-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Register Vendor"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
