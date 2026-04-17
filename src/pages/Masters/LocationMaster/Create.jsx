
import React, { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../../../config/apiconfig";

/* 🔹 Section Component OUTSIDE Create */
const Section = ({ title, children }) => (
  <div style={styles.card}>
    <h3 style={styles.sectionTitle}>{title}</h3>
    <div style={styles.row}>{children}</div>
  </div>
);

// 🔹 Determine which level is being edited based on row data
const getEditableField = (data) => {
  if (!data) return null;
  if (data.city_name) return "city";
  if (data.state_name) return "state";
  if (data.country_name) return "country";
  if (data.conti_name) return "continent";
  return "source";
};

function Create({ editData = null, onEditDone = null }) {

  const isEditMode = !!editData; // 🔹 true when opened from View edit button
  const editableField = getEditableField(editData);

  // ─── Create mode state ───────────────────────────────────────────────────
  const [source, setSource] = useState("");
  const [continent, setContinent] = useState("");
  const [country, setCountry] = useState("");
  const [stateName, setStateName] = useState("");
  const [city, setCity] = useState("");

  const [sourceList, setSourceList] = useState([]);
  const [selectedSource, setSelectedSource] = useState("");
  const [continentList, setContinentList] = useState([]);
  const [selectedContinent, setSelectedContinent] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [stateList, setStateList] = useState([]);
  const [selectedState, setSelectedState] = useState("");

  // ─── Edit mode state ──────────────────────────────────────────────────────
  const [editFormData, setEditFormData] = useState({});

  // 🔹 When editData changes, pre-fill the edit form
  useEffect(() => {
    if (editData) {
      setEditFormData({ ...editData });
    } else {
      setEditFormData({});
    }
  }, [editData]);

  useEffect(() => {
    fetchSources();
    fetchContinents();
    fetchCountries();
    fetchStates();
  }, []);

  /* ─── Fetch helpers ──────────────────────────────────────────────────── */
  const fetchSources = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_SOURCES);
      if (!response.ok) throw new Error("Failed to fetch sources");
      setSourceList(await response.json());
    } catch (error) { console.error("Error loading sources:", error); }
  };

  const fetchContinents = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_CONTINENTS);
      if (!response.ok) throw new Error("Failed to fetch continents");
      setContinentList(await response.json());
    } catch (error) { console.error("Error loading continents:", error); }
  };

  const fetchCountries = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_COUNTRIES);
      if (!response.ok) throw new Error("Failed to fetch countries");
      setCountryList(await response.json());
    } catch (error) { console.error("Error loading countries:", error); }
  };

  const fetchStates = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_STATES);
      if (!response.ok) throw new Error("Failed to fetch states");
      setStateList(await response.json());
    } catch (error) { console.error("Error loading states:", error); }
  };

  /* ─── Create handlers ────────────────────────────────────────────────── */
  const handleAddSource = async () => {
    if (!source.trim()) { alert("Please enter source"); return; }
    try {
      const response = await fetch(API_ENDPOINTS.CREATE_SOURCE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ src_name: source })
      });
      if (!response.ok) throw new Error("Failed to save source");
      await response.json();
      alert("Source Added Successfully");
      setSource("");
      fetchSources();
    } catch (error) { console.error("Error saving source:", error); alert("Error saving source"); }
  };

  const handleAddContinent = async () => {
    if (!selectedSource) { alert("Please select source"); return; }
    if (!continent.trim()) { alert("Please enter continent"); return; }
    try {
      const response = await fetch(API_ENDPOINTS.CREATE_CONTINENT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conti_name: continent, src_id: selectedSource })
      });
      if (!response.ok) throw new Error("Failed to save continent");
      await response.json();
      alert("Continent Added Successfully");
      setContinent("");
      setSelectedSource("");
      fetchSources();
    } catch (error) { console.error("Error saving continent:", error); alert("Error saving continent"); }
  };

  const handleAddCountry = async () => {
    if (!selectedContinent) { alert("Please select continent"); return; }
    if (!country.trim()) { alert("Please enter country"); return; }
    try {
      const response = await fetch(API_ENDPOINTS.CREATE_COUNTRY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country_name: country, conti_id: selectedContinent })
      });
      if (!response.ok) throw new Error("Failed to save country");
      await response.json();
      alert("Country Added Successfully");
      setCountry("");
      setSelectedContinent("");
      await fetchContinents();
    } catch (error) { console.error("Error saving country:", error); alert("Error saving country"); }
  };

  const handleAddState = async () => {
    if (!selectedCountry) { alert("Please select country"); return; }
    if (!stateName.trim()) { alert("Please enter state"); return; }
    try {
      const response = await fetch(API_ENDPOINTS.ADD_STATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state_name: stateName, country_id: selectedCountry })
      });
      if (!response.ok) throw new Error("Failed to save state");
      await response.json();
      alert("State Added Successfully");
      setStateName("");
      setSelectedCountry("");
      await fetchCountries();
    } catch (error) { console.error("Error saving state:", error); alert("Error saving state"); }
  };

  const handleAddCity = async () => {
    if (!selectedState) { alert("Please select state"); return; }
    if (!city.trim()) { alert("Please enter city"); return; }
    try {
      const response = await fetch(API_ENDPOINTS.ADD_CITY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city_name: city, state_id: selectedState })
      });
      if (!response.ok) throw new Error("Failed to save city");
      await response.json();
      alert("City Added Successfully");
      setCity("");
      setSelectedState("");
      await fetchStates();
    } catch (error) { console.error("Error saving city:", error); alert("Error saving city"); }
  };

  /* ─── Edit handler ───────────────────────────────────────────────────── */
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value.toUpperCase() }));
  };

  const handleUpdate = async () => {
    let fieldName = "";
    let fieldValue = "";
    let recordId = 0;

    if (editableField === "city") {
      fieldName = "city"; fieldValue = editFormData.city_name; recordId = editFormData.city_id;
    } else if (editableField === "state") {
      fieldName = "state"; fieldValue = editFormData.state_name; recordId = editFormData.state_id;
    } else if (editableField === "country") {
      fieldName = "country"; fieldValue = editFormData.country_name; recordId = editFormData.country_id;
    } else if (editableField === "continent") {
      fieldName = "continent"; fieldValue = editFormData.conti_name; recordId = editFormData.conti_id;
    } else if (editableField === "source") {
      fieldName = "source"; fieldValue = editFormData.src_name; recordId = editFormData.src_id;
    }

    try {
      const response = await fetch(API_ENDPOINTS.UPDATE_LOCATION, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recordId, fieldName, fieldValue })
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        if (onEditDone) onEditDone(); // 🔹 go back to view
      } else {
        alert(result.message || "Update Failed");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  /* ─── EDIT MODE UI ───────────────────────────────────────────────────── */
  if (isEditMode) {
    return (
      <div style={styles.wrapper}>

        {/* 🔹 Edit Mode banner */}
        <div style={styles.editBanner}>
          ✏️ Edit Mode — Only the highlighted field is editable
        </div>

        <div style={styles.grid}>

          {/* Source */}
          <Section title={<span className="text-primary">Edit Source</span>}>
            <input
              className="input-field-style"
              name="src_name"
              value={editFormData.src_name || ""}
              onChange={handleEditChange}
              disabled={editableField !== "source"}
              style={editableField !== "source" ? styles.disabledInput : styles.activeInput}
              placeholder="Source"
            />
          </Section>

          {/* Continent */}
          <Section title={<span className="text-primary">Edit Continent</span>}>
            <input
              className="input-field-style"
              name="conti_name"
              value={editFormData.conti_name || ""}
              onChange={handleEditChange}
              disabled={editableField !== "continent"}
              style={editableField !== "continent" ? styles.disabledInput : styles.activeInput}
              placeholder="Continent"
            />
          </Section>

          {/* Country */}
          <Section title={<span className="text-primary">Edit Country</span>}>
            <input
              className="input-field-style"
              name="country_name"
              value={editFormData.country_name || ""}
              onChange={handleEditChange}
              disabled={editableField !== "country"}
              style={editableField !== "country" ? styles.disabledInput : styles.activeInput}
              placeholder="Country"
            />
          </Section>

          {/* State */}
          <Section title={<span className="text-primary">Edit State</span>}>
            <input
              className="input-field-style"
              name="state_name"
              value={editFormData.state_name || ""}
              onChange={handleEditChange}
              disabled={editableField !== "state"}
              style={editableField !== "state" ? styles.disabledInput : styles.activeInput}
              placeholder="State"
            />
          </Section>

          {/* City */}
          <Section title={<span className="text-primary">Edit City</span>}>
            <input
              className="input-field-style"
              name="city_name"
              value={editFormData.city_name || ""}
              onChange={handleEditChange}
              disabled={editableField !== "city"}
              style={editableField !== "city" ? styles.disabledInput : styles.activeInput}
              placeholder="City"
            />
          </Section>

        </div>

        {/* Action Buttons */}
        <div style={styles.editActions}>
          <button className="save-btn" onClick={handleUpdate}>
            Update
          </button>
          <button
            className="cancel-btn"
            onClick={() => { if (onEditDone) onEditDone(); }}
          >
            Cancel
          </button>
        </div>

      </div>
    );
  }

  /* ─── CREATE MODE UI (unchanged) ────────────────────────────────────── */
  return (
    <div style={styles.wrapper}>
      <div style={styles.grid}>

        {/* 🔹 Create Source */}
        <Section title={<span className="text-primary">Create Source</span>}>
          <input
            className="input-field-style"
            type="text"
            placeholder="Enter Source"
            value={source}
            onChange={(e) => setSource(e.target.value.toUpperCase())}
          />
          <button className="add-btn" onClick={handleAddSource}>
            Add Source
          </button>
        </Section>

        {/* 🔹 Create Continent */}
        <Section title={<span className="text-primary">Create Continent</span>}>
          <select
            className="select-field-style"
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
          >
            <option value="">Select Source</option>
            {sourceList.map((src) => (
              <option key={src.src_id} value={src.src_id}>{src.src_name}</option>
            ))}
          </select>
          <input
            className="input-field-style"
            type="text"
            placeholder="Enter Continent"
            value={continent}
            onChange={(e) => setContinent(e.target.value.toUpperCase())}
          />
          <button className="add-btn" onClick={handleAddContinent}>
            Add Continent
          </button>
        </Section>

        {/* 🔹 Create Country */}
        <Section title={<span className="text-primary">Create Country</span>}>
          <select
            className="select-field-style"
            value={selectedContinent}
            onChange={(e) => setSelectedContinent(e.target.value)}
          >
            <option value="">Select Continent</option>
            {continentList.map((cont) => (
              <option key={cont.conti_id} value={cont.conti_id}>{cont.conti_name}</option>
            ))}
          </select>
          <input
            className="input-field-style"
            type="text"
            placeholder="Enter Country"
            value={country}
            onChange={(e) => setCountry(e.target.value.toUpperCase())}
          />
          <button className="add-btn" onClick={handleAddCountry}>
            Add Country
          </button>
        </Section>

        {/* 🔹 Create State */}
        <Section title={<span className="text-primary">Create State</span>}>
          <select
            className="select-field-style"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="">Select Country</option>
            {countryList.map((country) => (
              <option key={country.country_id} value={country.country_id}>{country.country_name}</option>
            ))}
          </select>
          <input
            className="input-field-style"
            type="text"
            placeholder="Enter State"
            value={stateName}
            onChange={(e) => setStateName(e.target.value.toUpperCase())}
          />
          <button
            className="add-btn"
            onClick={async () => { await handleAddState(); await fetchCountries(); }}
          >
            Add State
          </button>
        </Section>

        {/* 🔹 Create City */}
        <Section title={<span className="text-primary">Create City</span>}>
          <select
            className="select-field-style"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="">Select State</option>
            {stateList.map((state) => (
              <option key={state.state_id} value={state.state_id}>{state.state_name}</option>
            ))}
          </select>
          <input
            className="input-field-style"
            type="text"
            placeholder="Enter City"
            value={city}
            onChange={(e) => setCity(e.target.value.toUpperCase())}
          />
          <button className="add-btn" onClick={handleAddCity}>
            Add City
          </button>
        </Section>

      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    width: "95%",
    margin: "30px auto",
    fontFamily: "Segoe UI, sans-serif",
    background: "#f4f6fb",
    padding: "25px",
    borderRadius: "10px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px"
  },
  card: {
    background: "#ffffff",
    padding: "25px",
    borderRadius: "10px",
    borderTop: "5px solid #6366F1",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
  },
  sectionTitle: {
    marginBottom: "15px",
    fontSize: "18px",
    fontWeight: "600"
  },
  row: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  // 🔹 Edit mode styles
  editBanner: {
    background: "#fff3cd",
    border: "1px solid #ffc107",
    color: "#856404",
    padding: "10px 16px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontWeight: "500",
    fontSize: "14px"
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
    color: "#999",
    cursor: "not-allowed"
  },
  activeInput: {
    backgroundColor: "#fff9e6",
    border: "2px solid #ffc107",
    fontWeight: "600"
  },
  editActions: {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    marginTop: "24px"
  }
};

export default Create;