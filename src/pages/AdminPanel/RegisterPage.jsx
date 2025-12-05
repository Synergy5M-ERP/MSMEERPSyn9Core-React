import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css";
import { Eye, EyeOff } from "lucide-react";

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
    confirm_password  : "",
  });

  const [errors, setErrors] = useState({});
  const [sources, setSources] = useState([]);
  const [continents, setContinents] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [authorities, setAuthorities] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const apiBase = "https://msmeerpsyn9-core.azurewebsites.net/api/HRMAdminRegAPI";

  // -------------------- VALIDATION --------------------
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    const password = formData.password;
    const confirmPassword = formData.confirm_password;

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

    if (!password) {
      isValid = false;
      newErrors.password = "Password is required";
    } else if (!strongPasswordRegex.test(password)) {
      isValid = false;
      newErrors.password =
        "Password must be at least 8 characters and include upper-case, lower-case, number and special character.";
    }

    if (!confirmPassword) {
      isValid = false;
      newErrors.confirm_password = "Confirm Password is required";
    } else if (password !== confirmPassword) {
      isValid = false;
      newErrors.confirm_password = "Passwords do not match";
    }

    setErrors(newErrors);
    return isValid;
  };

  // -------------------- FETCH DROPDOWNS --------------------
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [sourcesRes, authoritiesRes, designationsRes] =
          await Promise.all([
            axios.get(`${apiBase}/GetSource`),
            axios.get("https://msmeerpsyn9-core.azurewebsites.net/api/HrmMaster/AuthorityMatrix"),
            axios.get("https://msmeerpsyn9-core.azurewebsites.net/api/HrmMaster/Designation"),
          ]);

        setSources(sourcesRes.data);
        setAuthorities(authoritiesRes.data);
        setDesignations(designationsRes.data);
      } catch (err) {
        console.error("Dropdown fetch error:", err);
        toast.error("Failed to load dropdowns");
      }
    };

    fetchDropdowns();
  }, []);

  // CONTINENT
  useEffect(() => {
    if (formData.source) {
      axios
        .get(`${apiBase}/GetContinent`, {
          params: { source: formData.source },
        })
        .then((res) => setContinents(res.data))
        .catch((err) => console.error("Continent error:", err));
    } else setContinents([]);
  }, [formData.source]);

  // COUNTRY
  useEffect(() => {
    if (formData.continent) {
      axios
        .get(`${apiBase}/GetCountry`, {
          params: { source: formData.source, continent: formData.continent },
        })
        .then((res) => setCountries(res.data))
        .catch((err) => console.error("Country error:", err));
    } else setCountries([]);
  }, [formData.continent]);

  // STATE
  useEffect(() => {
    if (formData.country) {
      axios
        .get(`${apiBase}/GetState`, {
          params: {
            source: formData.source,
            continent: formData.continent,
            country: formData.country,
          },
        })
        .then((res) => setStates(res.data))
        .catch((err) => console.error("State error:", err));
    } else setStates([]);
  }, [formData.country]);

  // CITY
  useEffect(() => {
    if (formData.state) {
      axios
        .get(`${apiBase}/GetCity`, {
          params: {
            source: formData.source,
            continent: formData.continent,
            country: formData.country,
            state: formData.state,
          },
        })
        .then((res) => setCities(res.data))
        .catch((err) => console.error("City error:", err));
    } else setCities([]);
  }, [formData.state]);

  // ---------------------- HANDLE CHANGE ----------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,

      ...(name === "source"
        ? { continent: "", country: "", state: "", city: "" }
        : {}),
      ...(name === "continent"
        ? { country: "", state: "", city: "" }
        : {}),
      ...(name === "country" ? { state: "", city: "" } : {}),
      ...(name === "state" ? { city: "" } : {}),
    }));
  };

  // ---------------------- SUBMIT ----------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix validation errors!");
      return;
    }

    try {
      const res = await axios.post(`${apiBase}/Register`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data.success) {
        toast.success("Registration Successful!");

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
      } else {
        toast.warning(res.data.message);
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Registration failed!");
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
  };

  // ⭐ LABEL Component for cleaner code
  const RequiredLabel = ({ text }) => (
    <label>
      {text}
      <span className="required-star">*</span>
    </label>
  );

  return (
    <div className="register-container">
      <ToastContainer position="top-right" autoClose={3000} />

      <h3>Registration Form</h3>

      <form onSubmit={handleSubmit} className="row g-3">

        {/* COMPANY NAME */}
        <div className="col-md-4">
          <RequiredLabel text="Company Name" />
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {/* CONTACT PERSON */}
        <div className="col-md-4">
          <RequiredLabel text="Contact Person" />
          <input
            type="text"
            name="contact_person"
            value={formData.contact_person}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {/* EMAIL */}
        <div className="col-md-4">
          <RequiredLabel text="Email ID" />
          <input
            type="email"
            name="email_id"
            value={formData.email_id}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {/* CONTACT NUMBER */}
        <div className="col-md-4">
          <RequiredLabel text="Contact Number" />
          <input
            type="text"
            name="contact_no"
            value={formData.contact_no}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {/* GST */}
        <div className="col-md-4">
          <RequiredLabel text="GST Number" />
          <input
            type="text"
            name="gst_no"
            value={formData.gst_no}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {/* SOURCE */}
        <div className="col-md-4">
          <RequiredLabel text="Source" />
          <select
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select Source</option>
            {sources.map((src) => (
              <option key={src} value={src}>
                {src}
              </option>
            ))}
          </select>
        </div>

        {/* CONTINENT */}
        <div className="col-md-4">
          <RequiredLabel text="Continent" />
          <select
            name="continent"
            value={formData.continent}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select Continent</option>
            {continents.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* COUNTRY */}
        <div className="col-md-4">
          <RequiredLabel text="Country" />
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* STATE */}
        <div className="col-md-4">
          <RequiredLabel text="State" />
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select State</option>
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* CITY */}
        <div className="col-md-4">
          <RequiredLabel text="City" />
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select City</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* AUTHORITY */}
        <div className="col-md-4">
          <RequiredLabel text="Authority" />
          <select
            name="authority"
            value={formData.authority}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select Authority</option>
            {authorities.map((a) => (
              <option key={a.authority_code} value={a.authority_code}>
                {a.authorityName}
              </option>
            ))}
          </select>
        </div>

        {/* DESIGNATION */}
        <div className="col-md-4">
          <RequiredLabel text="Designation" />
          <select
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select Designation</option>
            {designations.map((d) => (
              <option key={d.designation_code} value={d.designation_code}>
                {d.designationName}
              </option>
            ))}
          </select>
        </div>
{/* PASSWORD */}
<div className="col-md-4">
  <RequiredLabel text="Password" />

  <div className="position-relative">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      value={formData.password}
      onChange={handleChange}
      className="form-control"
      style={{ paddingRight: "40px" }}
    />

    <span
      onClick={() => setShowPassword(!showPassword)}
      style={{
        position: "absolute",
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        cursor: "pointer"
      }}
    >
      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </span>
  </div>
</div>

{/* CONFIRM PASSWORD */}
<div className="col-md-4">
  <RequiredLabel text="Confirm Password" />

  <div className="position-relative">
    <input
      type={showConfirmPassword ? "text" : "password"}
      name="confirm_password"
      value={formData.confirm_password}
      onChange={handleChange}
      className="form-control"
      style={{ paddingRight: "40px" }}
    />

    <span
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      style={{
        position: "absolute",
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        cursor: "pointer"
      }}
    >
      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </span>
  </div>
</div>

{/* BUTTONS */}
        <div className="btn-group mt-3">
          <button type="submit" className="btn btn-primary">
            Register
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-danger"
          >
            Cancel
          </button>
          </div>
      </form>
    </div>
  );
}

export default Register;
