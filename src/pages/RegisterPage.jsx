import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  });

  const [sources, setSources] = useState([]);
  const [continents, setContinents] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [authorities, setAuthorities] = useState([]);
  const [designations, setDesignations] = useState([]);

  // ❗ Correct API Base URL
  const apiBase = "https://localhost:7145/api/HRMAdminRegAPI";

  // 🔹 Fetch static dropdowns (source, authority, designation)
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [sourcesRes, authoritiesRes, designationsRes] = await Promise.all([
          axios.get(`${apiBase}/GetSource`),
          axios.get(`${apiBase}/GetAuthorities`),
          axios.get(`${apiBase}/GetDesignations`),
        ]);

        setSources(sourcesRes.data);
        setAuthorities(authoritiesRes.data);
        setDesignations(designationsRes.data);

      } catch (err) {
        console.error("Dropdown fetch error:", err);
      }
    };

    fetchDropdowns();
  }, []);

  // 🔹 Fetch Continents
  useEffect(() => {
    if (formData.source) {
      axios
        .get(`${apiBase}/GetContinent`, {
          params: { source: formData.source }
        })
        .then((res) => setContinents(res.data))
        .catch((err) => console.error("Continent fetch error:", err));
    } else setContinents([]);
  }, [formData.source]);

  // 🔹 Fetch Countries
  useEffect(() => {
    if (formData.continent) {
      axios
        .get(`${apiBase}/GetCountry`, {
          params: {
            source: formData.source,
            continent: formData.continent
          }
        })
        .then((res) => setCountries(res.data))
        .catch((err) => console.error("Country fetch error:", err));
    } else setCountries([]);
  }, [formData.continent]);

  // 🔹 Fetch States
  useEffect(() => {
    if (formData.country) {
      axios
        .get(`${apiBase}/GetState`, {
          params: {
            source: formData.source,
            continent: formData.continent,
            country: formData.country
          }
        })
        .then((res) => setStates(res.data))
        .catch((err) => console.error("State fetch error:", err));
    } else setStates([]);
  }, [formData.country]);

  // 🔹 Fetch Cities
  useEffect(() => {
    if (formData.state) {
      axios
        .get(`${apiBase}/GetCity`, {
          params: {
            source: formData.source,
            continent: formData.continent,
            country: formData.country,
            state: formData.state
          }
        })
        .then((res) => setCities(res.data))
        .catch((err) => console.error("City fetch error:", err));
    } else setCities([]);
  }, [formData.state]);

  // ---------------------- handle change ----------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "source" ? { continent: "", country: "", state: "", city: "" } : {}),
      ...(name === "continent" ? { country: "", state: "", city: "" } : {}),
      ...(name === "country" ? { state: "", city: "" } : {}),
      ...(name === "state" ? { city: "" } : {}),
    }));
  };

  // ---------------------- handle submit ----------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiBase}/Register`, formData);

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
    });
  };

  return (
    <div className="register-container">
      <ToastContainer position="top-right" autoClose={3000} />

      <h3>Registration Form</h3>

      <form onSubmit={handleSubmit} className="row g-3">

        {/* company name */}
        <div className="col-md-4">
          <input type="text" name="company_name" placeholder="Company Name"
            value={formData.company_name} onChange={handleChange}
            className="form-control" />
        </div>

        {/* contact person */}
        <div className="col-md-4">
          <input type="text" name="contact_person" placeholder="Contact Person"
            value={formData.contact_person} onChange={handleChange}
            className="form-control" />
        </div>

        {/* email */}
        <div className="col-md-4">
          <input type="email" name="email_id" placeholder="Email ID"
            value={formData.email_id} onChange={handleChange}
            className="form-control" />
        </div>

        {/* password */}
        <div className="col-md-4">
          <input type="password" name="password" placeholder="Password"
            value={formData.password} onChange={handleChange}
            className="form-control" />
        </div>

        {/* contact number */}
        <div className="col-md-4">
          <input type="text" name="contact_no" placeholder="Contact Number"
            value={formData.contact_no} onChange={handleChange}
            className="form-control" />
        </div>

        {/* gst */}
        <div className="col-md-4">
          <input type="text" name="gst_no" placeholder="GST No"
            value={formData.gst_no} onChange={handleChange}
            className="form-control" />
        </div>

        {/* source */}
        <div className="col-md-4">
          <select name="source" value={formData.source} onChange={handleChange}
            className="form-control">
            <option value="">Select Source</option>
            {sources.map((src) => (
              <option key={src} value={src}>{src}</option>
            ))}
          </select>
        </div>

        {/* continent */}
        <div className="col-md-4">
          <select name="continent" value={formData.continent} onChange={handleChange}
            className="form-control">
            <option value="">Select Continent</option>
            {continents.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* country */}
        <div className="col-md-4">
          <select name="country" value={formData.country} onChange={handleChange}
            className="form-control">
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* state */}
        <div className="col-md-4">
          <select name="state" value={formData.state} onChange={handleChange}
            className="form-control">
            <option value="">Select State</option>
            {states.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* city */}
        <div className="col-md-4">
          <select name="city" value={formData.city} onChange={handleChange}
            className="form-control">
            <option value="">Select City</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* authority */}
        <div className="col-md-4">
          <select name="authority" value={formData.authority} onChange={handleChange}
            className="form-control">
            <option value="">Select Authority</option>
            {authorities.map((a) => (
              <option key={a.Authority_code} value={a.Authority_code}>
                {a.AuthorityName}
              </option>
            ))}
          </select>
        </div>

        {/* designation */}
        <div className="col-md-4">
          <select name="designation" value={formData.designation} onChange={handleChange}
            className="form-control">
            <option value="">Select Designation</option>
            {designations.map((d) => (
              <option key={d.Designation_code} value={d.Designation_code}>
                {d.DesignationName}
              </option>
            ))}
          </select>
        </div>

        {/* submit + cancel */}
        <div className="col-12 d-flex gap-2">
          <button type="submit" className="btn btn-primary w-50">Register</button>
          <button type="button" onClick={handleCancel} className="btn btn-danger w-50">
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
}

export default Register;
