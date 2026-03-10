import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../../config/apiconfig";
import { Eye, Trash2 } from "lucide-react";

// 🔹 Now accepts onEdit prop from LocationMaster
function LocationList({ onEdit }) {

  const [locationList, setLocationList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_LOCATION_DATA);
      const data = await response.json();
      setLocationList(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteRow = (index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this row?");
    if (!confirmDelete) return;
    const updatedList = [...locationList];
    updatedList.splice(index, 1);
    setLocationList(updatedList);
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

  return (
    <div style={{ padding: "20px" }}>

      <div style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}>

        {/* Rows per page */}
        <div style={{
          marginBottom: "10px",
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px"
        }}>
          <span>Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(parseInt(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
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
                <th style={thStyle}>EDIT</th>
                <th style={thStyle}>DELETE</th>
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

                  <td style={tdStyle}>
                    {/* 🔹 Clicking edit navigates to Create page in edit mode */}
                    <button style={editBtn} onClick={() => editRow(item)}>
                      <Eye size={18} />
                    </button>
                  </td>

                  <td style={tdStyle}>
                    <button style={deleteBtn} onClick={() => deleteRow(index)}>
                      <Trash2 size={18} />
                    </button>
                  </td>
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