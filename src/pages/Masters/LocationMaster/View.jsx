import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../../config/apiconfig";
import { Eye, Trash2 } from "lucide-react";

// 🔹 Now accepts onEdit prop from LocationMaster
function LocationList({ onEdit }) {

  const [locationList, setLocationList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
const [view, setView] = useState("active");

  useEffect(() => {
  fetchLocations();
}, [view]);

  const fetchLocations = async () => {
  try {

    const response = await fetch(
      `${API_ENDPOINTS.GET_LOCATION_DATA}?status=${view}`
    );

    const data = await response.json();

    setLocationList(data);

  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

 const deleteRow = async (item) => {

  const confirmDelete = window.confirm("Are you sure you want to delete?");
  if (!confirmDelete) return;

  let deleteType = "";

  if (item.city_name) {
    deleteType = "city";
  } 
  else if (item.state_name) {
    deleteType = "state";
  } 
  else if (item.country_name) {
    deleteType = "country";
  } 
  else if (item.conti_name) {
    deleteType = "continent";
  } 
  else if (item.src_name) {
    deleteType = "source";
  }

  try {

    const response = await fetch(API_ENDPOINTS.DELETE_LOCATION, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        deleteType: deleteType,
        sourceId: item.src_id,
        continentId: item.conti_id,
        countryId: item.country_id,
        stateId: item.state_id,
        cityId: item.city_id
      })
    });

    const result = await response.json();

    if (result.success) {
      alert("Deleted Successfully");
        setCurrentPage(1);   // 🔹 reset page
      fetchLocations();  // reload list
    }

  } catch (error) {
    console.error("Delete Error:", error);
  }
};

  // 🔹 Instead of opening a local modal, call the parent's onEdit handler
  const editRow = (item) => {
    if (onEdit) onEdit(item);
  };

  // Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = locationList.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(locationList.length / rowsPerPage);

  const nextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const prevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
const activateRow = async (item) => {

  let type = "";

  if (item.city_name) type = "city";
  else if (item.state_name) type = "state";
  else if (item.country_name) type = "country";
  else if (item.conti_name) type = "continent";
  else if (item.src_name) type = "source";

  try {

    const response = await fetch(API_ENDPOINTS.ACTIVATE_LOCATION, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type: type,
        sourceId: item.src_id,
        continentId: item.conti_id,
        countryId: item.country_id,
        stateId: item.state_id,
        cityId: item.city_id
      })
    });

    const result = await response.json();

    if (result.success) {
      alert("Activated Successfully");
      fetchLocations();   // refresh list
    }

  } catch (error) {
    console.error("Activate Error:", error);
  }
};
  return (
    <div style={{ padding: "20px" }}>

      <div style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}>
<div
  style={{
    marginBottom: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Cambria",
    fontSize: "17px"
  }}
>

  {/* Active / Inactive */}
  <div style={{ display: "flex", gap: "30px" }}>
    <label style={{ fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center" }}>
      <input
        type="radio"
        name="viewStatus"
        value="active"
        checked={view === "active"}
        onChange={() => setView("active")}
        style={{ width: 18, height: 18, marginRight: "8px" }}
      />
      Active
    </label>

    <label style={{ fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center" }}>
      <input
        type="radio"
        name="viewStatus"
        value="inactive"
        checked={view === "inactive"}
        onChange={() => setView("inactive")}
        style={{ width: 18, height: 18, marginRight: "8px" }}
      />
      Inactive
    </label>
  </div>

  {/* Rows per page */}
  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    <span style={{ fontWeight: 600 }}>Rows per page:</span>
    <select
      value={rowsPerPage}
      onChange={(e) => {
        setRowsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
      }}
      style={{
        padding: "4px 8px",
        fontFamily: "Cambria",
        fontSize: "16px"
      }}
    >
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={25}>25</option>
      <option value={50}>50</option>
    </select>
  </div>

</div>

        {/* TABLE */}
       <div style={{ overflowX: "auto" }}>
  <table style={{ width: "100%", borderCollapse: "collapse" }}>

    <thead>
      <tr style={{ background: "#0066cc", color: "#fff" }}>
        <th style={thStyle}>LOCATION CODE</th>
        <th style={thStyle}>SOURCE NAME</th>
        <th style={thStyle}>CONTINENT NAME</th>
        <th style={thStyle}>COUNTRY NAME</th>
        <th style={thStyle}>STATE NAME</th>
        <th style={thStyle}>CITY NAME</th>

        {view === "active" ? (
          <>
            <th style={thStyle}>EDIT</th>
            <th style={thStyle}>DELETE</th>
          </>
        ) : (
          <th style={thStyle}>ACTIVATE</th>
        )}
      </tr>
    </thead>

    <tbody>
      {currentRows.map((item, index) => (
        <tr key={index}>
          <td style={tdStyle}>{item.locationCode}</td>
          <td style={tdStyle}>{item.src_name}</td>
          <td style={tdStyle}>{item.conti_name}</td>
          <td style={tdStyle}>{item.country_name}</td>
          <td style={tdStyle}>{item.state_name}</td>
          <td style={tdStyle}>{item.city_name}</td>

          {/* ACTIVE VIEW */}
          {view === "active" ? (
            <>
              <td style={tdStyle}>
                <button style={editBtn} onClick={() => editRow(item)}>
                  <Eye size={18} />
                </button>
              </td>

              <td style={tdStyle}>
              <button style={deleteBtn} onClick={() => deleteRow(item)}>                  <Trash2 size={18} />
                </button>
              </td>
            </>
          ) : (
            /* INACTIVE VIEW */
            <td style={tdStyle}>
              <button
                style={{
                  background: "green",
                  color: "#fff",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
                onClick={() => activateRow(item)}
              >
                Activate
              </button>
            </td>
          )}
        </tr>
      ))}
    </tbody>

  </table>
</div>

        {/* Pagination */}
        <div style={{
          marginTop: "15px",
          display: "flex",
          justifyContent: "center",
          gap: "10px"
        }}>
          <button onClick={prevPage} disabled={currentPage === 1} style={pageBtn}>
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={nextPage} disabled={currentPage === totalPages} style={pageBtn}>
            Next
          </button>
        </div>

      </div>
    </div>
  );
}

/* STYLES */
const thStyle = { padding: "10px", borderBottom: "2px solid #ddd" };
const tdStyle = { padding: "10px", borderBottom: "1px solid #eee" };

const editBtn = {
  padding: "6px 12px",
  background: "#0066cc",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "4px"
};

const deleteBtn = {
  background: "#dc3545",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: "5px",
  cursor: "pointer"
};

const pageBtn = {
  background: "#0066cc",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: "5px",
  cursor: "pointer"
};

export default LocationList;