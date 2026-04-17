import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config/apiconfig";
import { FiSave, FiTrash2, FiList, FiEdit, } from "react-icons/fi";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const CreateItemCat = () => {
    const [formData, setFormData] = useState({
        categoryType: "",
        itemVendorCategory: "",
        isActive: true
    });

    const [errors, setErrors] = useState({});
    const [categoryList, setCategoryList] = useState([]);
    const [showList, setShowList] = useState(false);
    const [statusFilter, setStatusFilter] = useState("Active");


    const filteredCategories = categoryList.filter(cat =>
        statusFilter === "Active"
            ? cat.isActive === true
            : cat.isActive === false
    );
    // Fetch Categories
    const fetchCategories = async () => {
        try {
            const response = await axios.get(API_ENDPOINTS.GetVendorItemCategories);

            if (response && response.data) {
                setCategoryList(response.data);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    // Call API on component load
    useEffect(() => {
        fetchCategories();
    }, []);

    // Handle form input change
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const validate = () => {
        let newErrors = {};

        if (!formData.categoryType) {
            newErrors.categoryType = "Please select category type";
        }

        if (!formData.itemVendorCategory.trim()) {
            newErrors.itemVendorCategory = "Please enter category name";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            const res = await axios.post(API_ENDPOINTS.SaveCategory, {
                itemVendorCategoryId: editId || 0,
                itemVendorCategory: formData.itemVendorCategory,
                categoryType: formData.categoryType
            });

            Swal.fire({
                title: "Success!",
                text: "Category saved successfully.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });
            fetchCategories();
            setEditId(null);
            setFormData({ categoryType: "", itemVendorCategory: "" });

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                error?.response?.data ||
                "Something went wrong ❌",
                {
                    icon: "⚠️",
                    autoClose: 3000
                }
            );
        }
    };
    const handleDelete = async (id) => {

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this category!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel"
        });

        if (!result.isConfirmed) return;

        try {

            const res = await axios.delete(`${API_ENDPOINTS.DeleteCategory}/${id}`);

            // Update UI instantly
            setCategoryList(prev =>
                prev.map(cat =>
                    cat.itemVendorCategoryId === id
                        ? { ...cat, isActive: false }
                        : cat
                )
            );

            Swal.fire({
                title: "Deleted!",
                text: "Category has been deleted.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                "Error deleting category",
                { toastId: "delete-error", autoClose: 3000, }
            );
        }
    };

    const [editId, setEditId] = useState(null);

    const handleEdit = (cat) => {

        setFormData({
            categoryType: cat.itemVendorCatCode === 1 ? "Item" : "Vendor",
            itemVendorCategory: cat.itemVendorCategory
        });

        setEditId(cat.itemVendorCategoryId);

        // Scroll to form
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleActivate = async (id) => {
        try {
            const res = await axios.put(`${API_ENDPOINTS.ActivateCategory}/${id}`);

            setCategoryList(prev =>
                prev.map(cat =>
                    cat.itemVendorCategoryId === id
                        ? { ...cat, isActive: true }
                        : cat
                )
            );

            toast.success(res.data.message || "Category activated successfully");

        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Error activating category"
            );
        }
    };
    return (
        <>
            <div className="container mt-5">
                <div
                    className="card mx-auto"
                    style={{
                        maxWidth: "700px",
                        borderRadius: "15px",
                        border: "none",
                        boxShadow: "0 1px 5px 1px rgba(33, 32, 32, 0.3)"
                    }}
                >
                    <h4
                        className="text-center mb-2 p-3"
                        style={{ fontWeight: "700", color: "#252454", backgroundColor: "aliceblue", borderTopLeftRadius: "15px", borderTopRightRadius: "15px" }}
                    >
                        Create Item / Vendor Category
                    </h4>
                    <form onSubmit={handleSubmit} className="p-4 pb-0">

                        <div className="mb-3 d-flex align-items-center gap-4">

                            <label
                                className="form-label mb-0"
                                style={{ fontWeight: "700", fontSize: "15px" }}
                            >
                                Select Category Type
                            </label>

                            <div className="d-flex gap-4">
                                <div>
                                    <input
                                        type="radio"
                                        name="categoryType"
                                        value="Item"
                                        checked={formData.categoryType === "Item"}
                                        onChange={handleChange}
                                    />{" "}
                                    Item Category
                                </div>

                                <div>
                                    <input
                                        type="radio"
                                        name="categoryType"
                                        value="Vendor"
                                        checked={formData.categoryType === "Vendor"}
                                        onChange={handleChange}
                                    />{" "}
                                    Vendor Category
                                </div>
                            </div>

                        </div>

                        {errors.categoryType && (
                            <small className="text-danger">{errors.categoryType}</small>
                        )}
                        <div className="mb-3 mt-4">
                            <label
                                className="form-label"
                                style={{ fontWeight: "700", fontSize: "15px" }}>
                                Enter Category Name
                            </label>

                            <div className="d-flex">
                                <input
                                    type="text"
                                    name="itemVendorCategory"
                                    value={formData.itemVendorCategory}
                                    onChange={handleChange}
                                    className="form-control no-focus"
                                    placeholder="Enter Item / Vendor Category"
                                    style={{
                                        borderTopRightRadius: 0,
                                        borderBottomRightRadius: 0,
                                        padding: "10px",
                                        fontSize: "14px"
                                    }}
                                />
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{
                                        borderTopLeftRadius: 0,
                                        borderBottomLeftRadius: 0,
                                        padding: "10px 25px",
                                        fontWeight: 700,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "5px"
                                    }}
                                >
                                    <FiSave /> {editId ? "Update" : "Save"}
                                </button>
                            </div>

                            {errors.itemVendorCategory && (
                                <small className="text-danger">{errors.itemVendorCategory}</small>
                            )}
                        </div>

                    </form>

                    <div className="d-flex justify-content-end p-4">
                        <button
                            className={`view-list-btn ${showList ? "hide" : "view"}`}
                            onClick={() => setShowList(!showList)}
                        >
                            <FiList /> {showList ? "Hide List" : "View List"}
                        </button>
                    </div>


                    {showList && (
                        <div className="p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">

                                <h5 style={{ fontWeight: 600, color: "#17173f" }}>
                                    Item/Vendor Category List
                                </h5>

                                <div className="d-flex gap-4 align-items-center">

                                    <label>
                                        <input
                                            type="radio"
                                            name="statusFilter"
                                            value="Active"
                                            checked={statusFilter === "Active"}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                        />{" "}
                                        Active
                                    </label>

                                    <label>
                                        <input
                                            type="radio"
                                            name="statusFilter"
                                            value="Inactive"
                                            checked={statusFilter === "Inactive"}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                        />{" "}
                                        Inactive
                                    </label>

                                </div>
                            </div>

                            {/* Table */}
                            {filteredCategories.length > 0 ? (

                                <div className="table-responsive category-list-container">
                                    <table className="table table-bordered">

                                        <thead style={{ background: "#f2f2f2", position: "sticky", top: 0 }}>
                                            <tr>
                                                <th style={{ width: "35%", fontWeight: "700", color: "#000" }}>
                                                    Category Name
                                                </th>

                                                <th style={{ width: "35%", fontWeight: "700", color: "#000" }}>
                                                    Category Type
                                                </th>

                                                <th style={{ width: "20%", textAlign: "center", fontWeight: "700", color: "#000" }}>
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {filteredCategories.map((cat) => (
                                                <tr key={cat.itemVendorCategoryId}>
                                                    <td>{cat.itemVendorCategory}</td>

                                                    <td>
                                                        {cat.itemVendorCatCode === 1 ? "Item Category" : "Vendor Category"}
                                                    </td>

                                                    <td style={{ textAlign: "center" }}>
                                                        {cat.isActive ? (
                                                            <>
                                                                <button
                                                                    className="btn btn-sm btn-primary me-2"
                                                                    onClick={() => handleEdit(cat)}
                                                                >
                                                                    <FiEdit />
                                                                </button>

                                                                <button
                                                                    className="btn btn-sm btn-danger"
                                                                    onClick={() => handleDelete(cat.itemVendorCategoryId)}
                                                                >
                                                                    <FiTrash2 />
                                                                </button>
                                                            </>
                                                        ) : null}

                                                        {/* Show "Activate" button only if currently inactive */}
                                                        {!cat.isActive && (
                                                            <button
                                                                className="btn btn-sm btn-success"
                                                                onClick={() => handleActivate(cat.itemVendorCategoryId)}
                                                            >
                                                                Activate
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                            ) : (

                                <p className="text-muted">No categories found.</p>

                            )}

                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default CreateItemCat