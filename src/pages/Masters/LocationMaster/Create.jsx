import React, { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../../../config/apiconfig";

/* 🔹 Section Component OUTSIDE Create */
const Section = ({ title, children }) => (
  <div style={styles.card}>
    <h3 style={styles.sectionTitle}>{title}</h3>
    <div style={styles.row}>{children}</div>
  </div>
);

function Create() {

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


  /* 🔹 Fetch Sources */
  const fetchSources = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_SOURCES);

      if (!response.ok) {
        throw new Error("Failed to fetch sources");
      }

      const data = await response.json();
      setSourceList(data);

    } catch (error) {
      console.error("Error loading sources:", error);
    }
  };

  useEffect(() => {
    fetchSources();
      fetchContinents();
    fetchCountries();
  fetchStates();

  }, []);

  /* 🔹 Add Source */
  const handleAddSource = async () => {

    if (!source.trim()) {
      alert("Please enter source");
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.CREATE_SOURCE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          src_name: source
        })
      });

      if (!response.ok) {
        throw new Error("Failed to save source");
      }

      await response.json();

      alert("Source Added Successfully");

      setSource("");

      /* Refresh dropdown */
      fetchSources();

    } catch (error) {
      console.error("Error saving source:", error);
      alert("Error saving source");
    }
  };
const handleAddContinent = async () => {

  if (!selectedSource) {
    alert("Please select source");
    return;
  }

  if (!continent.trim()) {
    alert("Please enter continent");
    return;
  }

  try {

    const response = await fetch(API_ENDPOINTS.CREATE_CONTINENT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        conti_name: continent,
        src_id: selectedSource
      })
    });

    if (!response.ok) {
      throw new Error("Failed to save continent");
    }

    await response.json();

    alert("Continent Added Successfully");

    // 🔹 Reset fields
    setContinent("");
    setSelectedSource("");

    // 🔹 Reload dropdown data if needed
    fetchSources();

  } catch (error) {

    console.error("Error saving continent:", error);
    alert("Error saving continent");

  }
};

const fetchContinents = async () => {

  try {

    const response = await fetch(API_ENDPOINTS.GET_CONTINENTS);

    if (!response.ok) {
      throw new Error("Failed to fetch continents");
    }

    const data = await response.json();

    setContinentList(data);

  } catch (error) {

    console.error("Error loading continents:", error);

  }

};
const handleAddCountry = async () => {

  if (!selectedContinent) {
    alert("Please select continent");
    return;
  }

  if (!country.trim()) {
    alert("Please enter country");
    return;
  }

  try {

    const response = await fetch(API_ENDPOINTS.CREATE_COUNTRY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        country_name: country,
        conti_id: selectedContinent
      })
    });

    if (!response.ok) {
      throw new Error("Failed to save country");
    }

    await response.json();

    alert("Country Added Successfully");

    // clear input
    setCountry("");

    // reset continent dropdown
    setSelectedContinent("");

    // reload continents
    await fetchContinents();

  } catch (error) {

    console.error("Error saving country:", error);
    alert("Error saving country");

  }

};

const fetchCountries = async () => {

  try {

    const response = await fetch(API_ENDPOINTS.GET_COUNTRIES);

    if (!response.ok) {
      throw new Error("Failed to fetch countries");
    }

    const data = await response.json();

    setCountryList(data);

  } catch (error) {

    console.error("Error loading countries:", error);

  }

};

const handleAddState = async () => {

  if (!selectedCountry) {
    alert("Please select country");
    return;
  }

  if (!stateName.trim()) {
    alert("Please enter state");
    return;
  }

  try {

    const response = await fetch(API_ENDPOINTS.ADD_STATE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        state_name: stateName,
        country_id: selectedCountry
      })
    });

    if (!response.ok) {
      throw new Error("Failed to save state");
    }

    await response.json();

    alert("State Added Successfully");

    // clear state input
    setStateName("");

    // reset country dropdown
    setSelectedCountry("");

    // reload country dropdown
    await fetchCountries();

  } catch (error) {

    console.error("Error saving state:", error);
    alert("Error saving state");

  }

};
const fetchStates = async () => {

  try {

    const response = await fetch(API_ENDPOINTS.GET_STATES);

    if (!response.ok) {
      throw new Error("Failed to fetch states");
    }

    const data = await response.json();

    setStateList(data);

  } catch (error) {

    console.error("Error loading states:", error);

  }

};

const handleAddCity = async () => {

  if (!selectedState) {
    alert("Please select state");
    return;
  }

  if (!city.trim()) {
    alert("Please enter city");
    return;
  }

  try {

    const response = await fetch(API_ENDPOINTS.ADD_CITY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        city_name: city,
        state_id: selectedState
      })
    });

    if (!response.ok) {
      throw new Error("Failed to save city");
    }

    await response.json();

    alert("City Added Successfully");

    // clear input
    setCity("");

    // reset state dropdown
    setSelectedState("");

    // refresh state dropdown
    await fetchStates();

  } catch (error) {

    console.error("Error saving city:", error);
    alert("Error saving city");

  }

};
  return (
    <div style={styles.wrapper}>

      <div style={styles.grid}>

        {/* 🔹 Create Source */}
      <Section
        title={<span className="text-primary">Create Source</span>}
      >        
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
          <Section
            title={<span className="text-primary">Create Continent</span>}
          >
          <select
            className="select-field-style "
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
          >
            <option value="">Select Source</option>

            {sourceList.map((src) => (
              <option key={src.src_id} value={src.src_id}>
                {src.src_name}
              </option>
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
          className="select-field-style "
          value={selectedContinent}
          onChange={(e) => setSelectedContinent(e.target.value)}
        >

          <option value="">Select Continent</option>

          {continentList.map((cont) => (
            <option key={cont.conti_id} value={cont.conti_id}>
              {cont.conti_name}
            </option>
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
          className="select-field-style "
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          <option value="">Select Country</option>

          {countryList.map((country) => (
            <option key={country.country_id} value={country.country_id}>
              {country.country_name}
            </option>
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
          onClick={async () => {
            await handleAddState();
            await fetchCountries();   // ✅ refresh country dropdown
          }}
        >
          Add State
        </button>

      </Section>
        {/* 🔹 Create City */}
  <Section title={<span className="text-primary">Create City</span>}>

        <select
          className="select-field-style "
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
        >
          <option value="">Select State</option>

          {stateList.map((state) => (
            <option key={state.state_id} value={state.state_id}>
              {state.state_name}
            </option>
          ))}

        </select>

        <input
          className="input-field-style"
          type="text"
          placeholder="Enter City"
          value={city}
          onChange={(e) => setCity(e.target.value.toUpperCase())}
        />

        <button
          className="add-btn"
          onClick={handleAddCity}
        >
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
  }

};

export default Create;