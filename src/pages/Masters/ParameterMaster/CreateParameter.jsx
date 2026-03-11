import React, { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../../../config/apiconfig";

function CreateParameter({ view }) {

    const [parameter, setParameter] = useState("");
    const [uomId, setUomId] = useState("");
    const [editId, setEditId] = useState(null);

    const [uomList, setUomList] = useState([]);
    const [parameterList, setParameterList] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 4;

    const indexOfLast = currentPage * rowsPerPage;
    const indexOfFirst = indexOfLast - rowsPerPage;
    const currentData = parameterList.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(parameterList.length / rowsPerPage);

    // =============================
    // FETCH UOM
    // =============================
    const fetchUOM = async () => {
        try {
            setLoading(true);

            const res = await fetch(API_ENDPOINTS.GET_UOM);

            if (!res.ok) throw new Error("Failed to fetch UOM");

            const data = await res.json();

            setUomList(data);

            setLoading(false);

        } catch (err) {
            console.error(err);
            setError("Failed to load UOM");
            setLoading(false);
        }
    };

    // =============================
    // FETCH PARAMETERS
    // =============================
   const fetchParameters = async () => {
    try {

        const isActive = view === "active";

        const res = await fetch(
            `${API_ENDPOINTS.GET_PARAMETERS}?isActive=${isActive}`
        );

        if (!res.ok) throw new Error("Failed to fetch parameters");

        const data = await res.json();

        setParameterList(data);

    } catch (err) {
        console.error("Error loading parameters", err);
    }
};

useEffect(() => {

    fetchUOM();
    fetchParameters();
    setCurrentPage(1);  

}, [view]);
    
    // =============================
    // GET UOM NAME
    // =============================
    const getUomName = (id) => {

        const u = uomList.find(x => x.uomId === parseInt(id));

        return u ? u.uomName : "";

    };

    // =============================
    // SAVE PARAMETER
    // =============================
    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!parameter || !uomId) {
            alert("Please fill all fields");
            return;
        }

        const userId = localStorage.getItem("userId") || 1;

        const payload = {
            id: editId || 0,
            parameter: parameter,
            uomId: parseInt(uomId),
            userId: parseInt(userId)
        };

        try {

            const response = await fetch(API_ENDPOINTS.CREATE_PARAMETER, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Failed to save");

            const result = await response.json();

            alert(result.message || "Saved Successfully");

            setParameter("");
            setUomId("");
            setEditId(null);

            // Reload list
            fetchParameters();

        } catch (error) {

            console.error(error);
            alert("Error saving data");

        }
    };

    // =============================
    // EDIT
    // =============================
    const handleEdit = (item) => {

        setParameter(item.parameter);
        setUomId(item.uomId);
        setEditId(item.id);

    };

    // =============================
    // DELETE UI ONLY
    // =============================
   const handleDelete = async (id) => {

    if (!window.confirm("Deactivate this parameter?")) return;

    try {

        const res = await fetch(
            `${API_ENDPOINTS.UPDATE_PARAMETER_STATUS}?id=${id}&isActive=false`,
            { method: "PUT" }
        );

        if (!res.ok) throw new Error("Failed");

        const data = await res.json();

        alert(data.message);

        fetchParameters();

    } catch (err) {

        console.error(err);
        alert("Error updating");

    }
};
const handleActivate = async (id) => {

    if (!window.confirm("Activate this parameter?")) return;

    try {

        const res = await fetch(
            `${API_ENDPOINTS.UPDATE_PARAMETER_STATUS}?id=${id}&isActive=true`,
            { method: "PUT" }
        );

        if (!res.ok) throw new Error("Failed");

        const data = await res.json();

        alert(data.message);

        fetchParameters();

    } catch (err) {

        console.error(err);
        alert("Error activating");

    }
};
    return (
        <div style={styles.page}>
            <div style={styles.container}>

                {/* CREATE FORM */}
                <div style={styles.card}>

                    <h3 style={styles.heading}>Create Parameter</h3>

                    {loading && <p>Loading UOM...</p>}
                    {error && <p style={{ color: "red" }}>{error}</p>}

                    <form onSubmit={handleSubmit}>

                        <div style={styles.formGroup}>
                            <label className="label-color">Parameter</label>
                            <input className="input-field-style"
                                type="text"
                                value={parameter}
                                onChange={(e) => setParameter(e.target.value)}
                                style={styles.input}
                                required
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label className="label-color">UOM</label>

                            <select 
                            className="select-field-style"
                                value={uomId}
                                onChange={(e) => setUomId(e.target.value)}
                                style={styles.input}
                                required
                            >

                                <option value="">Select UOM</option>

                                {uomList.map(u => (

                                    <option key={u.uomId} value={u.uomId}>
                                        {u.uomName}
                                    </option>

                                ))}

                            </select>

                        </div>

                        <div style={{ display: "flex", gap: "10px" }}>

                            <button type="submit" className="save-btn">
                                {editId ? "Update" : "Save"}
                                
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setParameter("");
                                    setUomId("");
                                    setEditId(null);
                                }}
                                className="cancel-btn"
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>

                {/* PARAMETER LIST */}
                <div style={styles.cardlist}>

                    <h3 style={styles.heading}>Parameter List</h3>

                    <table style={styles.table}>

                    <thead>
        {view === "active" ? (
            <tr>
                <th>Parameter</th>
                <th>UOM</th>
                <th>Edit</th>
                <th>Delete</th>
            </tr>
        ) : (
            <tr>
                <th>Parameter</th>
                <th>UOM</th>
                <th>Activate</th>
            </tr>
        )}
                    </thead>

                    <tbody>

                        {currentData.map(item => (

                            <tr key={item.id}>

                                <td>{item.parameter}</td>

                                <td>{getUomName(item.uomId)}</td>

                                {view === "active" ? (
                                    <>
                                        <td>
                                            <button
                                                style={styles.editBtn}
                                                onClick={() => handleEdit(item)}
                                            >
                                                ✏
                                            </button>
                                        </td>

                                        <td>
                                            <button
                                                style={styles.deleteBtn}
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                🗑
                                            </button>
                                        </td>
                                    </>
                                ) : (
                                    <td>
                                        <a
                                            href="#"
                                            style={styles.activateLink}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleActivate(item.id);
                                            }}
                                        >
                                            Activate
                                        </a>
                                    </td>
                                )}

                            </tr>

                        ))}

                    </tbody>

                </table>

                    {/* PAGINATION */}

                    <div style={styles.pagination}>

                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            ⏮
                        </button>

                        {[...Array(totalPages)].map((_, i) => (

                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                style={currentPage === i + 1 ? styles.activePage : {}}
                            >
                                {i + 1}
                            </button>

                        ))}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            ⏭
                        </button>

                    </div>

                </div>

            </div>
        </div>
    );
}

const styles = {
 activateLink: {
        color: "#007bff",
        cursor: "pointer",
        textDecoration: "underline",
        fontWeight: "800"
    },
    page: {
        padding: "30px",
        background: "#f4f6f9",
        minHeight: "100vh"
    },

    container: {
        display: "flex",
        gap: "20px"
    },
activateBtn: {
    background: "green",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer"
},
    card: {
        background: "#fff",
        padding: "25px",
        borderRadius: "10px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        width: "600px"
    },

    cardlist: {
        background: "#fff",
        padding: "25px",
        borderRadius: "10px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        width: "900px"
    },

    heading: {
        marginBottom: "20px",
        color: "#2c3e50"
    },

    formGroup: {
        marginBottom: "15px"
    },

    input: {
        width: "100%",
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #ccc"
    },

    saveBtn: {
        flex: 1,
        padding: "10px",
        background: "green",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
    },

    cancelBtn: {
        flex: 1,
        padding: "10px",
        background: "red",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
    },

    table: {//
        width: "100%",
        borderCollapse: "collapse"
    },

    editBtn: {
        color: "blue",
        background: "none",
        border: "none",
        cursor: "pointer"
    },

    deleteBtn: {
        color: "red",
        background: "none",
        border: "none",
        cursor: "pointer"
    },

    pagination: {
        marginTop: "15px",
        display: "flex",
        gap: "5px",
        justifyContent: "center"
    },

    activePage: {
        background: "#007bff",
        color: "#fff"
    }

};

export default CreateParameter;