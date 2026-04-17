import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config/apiconfig";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function ViewVendor() {
    const [searchTerm, setSearchTerm] = useState("");
    const [vendors, setVendors] = useState([]);
    const [filterStatus, setFilterStatus] = useState("active");
    const [activeCount, setActiveCount] = useState(0);
    const [inactiveCount, setInactiveCount] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState("10");
    const navigate = useNavigate();
    const fetchVendors = async () => {
        try {
            const res = await axios.get(
                `${API_ENDPOINTS.GetVendorList}?page=${page}&pageSize=${pageSize}`
            );
            const data = res.data.data || [];

            setVendors(data);

            setActiveCount(res.data.activeCount || 0);
            setInactiveCount(res.data.inactiveCount || 0);

        } catch (err) {
            console.error("Error fetching vendors:", err);
            alert("Failed to load vendor data");
        }
    };

    // ---------------- Filtered Vendors ----------------
    const filteredVendors = vendors.filter(v => {
        const matchesSearch = v.vendorName?.toLowerCase().includes(searchTerm.toLowerCase());
        if (filterStatus === "active") return matchesSearch && v.isActive === true;
        if (filterStatus === "inactive") return matchesSearch && v.isActive === false;
        return matchesSearch;
    });

    const paginatedVendors =
        pageSize === 0
            ? filteredVendors
            : filteredVendors.slice((page - 1) * pageSize, page * pageSize);

    useEffect(() => {
        fetchVendors();
    }, [page]);

    const [selectedVendor, setSelectedVendor] = useState(null);
    const handleViewAddresses = (vendor) => {
        setSelectedVendor(vendor);
    };

    // ==================Delete Process======================

    const [loadingId, setLoadingId] = useState(null);
    const handleDeleteVendor = async (vendorId) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This will deactivate the vendor",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!"
        });
        if (!confirm.isConfirmed) return;

        const token = localStorage.getItem("token");
        if (!token) {
            return Swal.fire("Error", "Please login again", "error");
        }
        setLoadingId(vendorId);

        try {
            const res = await axios({
                method: "delete",
                url: `${API_ENDPOINTS.DeleteVendor}/${vendorId}`,
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data?.success) {
                await Swal.fire("Deleted!", res.data.message, "success");
                fetchVendors(); // refresh table
            } else {
                Swal.fire("Error", res.data?.message || "Delete failed", "error");
            }

        } catch (err) {
            console.error("Delete Error:", err);

            const msg =
                err.response?.status === 401
                    ? "Unauthorized — login again"
                    : err.response?.data?.message || "Delete failed";

            Swal.fire("Error", msg, "error");
        } finally {
            setLoadingId(null);
        }
    };

    const handleReactivateVendor = async (vendorId) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This will re-activate the vendor",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, re-activate it!"
        });

        if (!confirm.isConfirmed) return;

        const token = localStorage.getItem("token");
        if (!token) return Swal.fire("Error", "Please login again", "error");

        setLoadingId(vendorId);
        try {
            const res = await axios.put(
                `${API_ENDPOINTS.ReactivateVendor}/${vendorId}`,
                {}, // empty body
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data?.success) {
                Swal.fire("Success!", res.data.message, "success");
                fetchVendors(); // refresh table
            } else {
                Swal.fire("Error", res.data?.message || "Re-activate failed", "error");
            }
        } catch (err) {
            console.error("Re-Activate Error:", err);
            Swal.fire(
                "Error",
                err.response?.data?.message || "Something went wrong",
                "error"
            );
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="container-fluid mt-4">
            <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="d-flex gap-2">
                    <button
                        className={`btn-status ${filterStatus === "active" ? "active" : ""}`}
                        onClick={() => setFilterStatus("active")}
                    >
                        Active ({activeCount})
                    </button>
                    <button
                        className={`btn-status ${filterStatus === "inactive" ? "active" : ""}`}
                        onClick={() => setFilterStatus("inactive")}
                    >
                        Inactive ({inactiveCount})
                    </button>
                </div>
                <div className="header">
                    <h4 style={{ fontWeight: "600", color: "#192191" }}>Vendor List</h4>
                    <div className="header-line mb-3"></div>
                </div>
                <div className="d-flex gap-2 align-items-center">
                    <label htmlFor="pageSizeSelect" className="mb-0">Show</label>
                    <select
                        id="pageSizeSelect"
                        className="form-select form-select-sm"
                        value={pageSize}
                        onChange={(e) => setPageSize(e.target.value)}
                        style={{ width: '60px' }}>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="all">All</option>
                    </select>

                    <span>entries</span>
                    <div className="pe-3" style={{ width: '250px' }}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="  🔍 Search vendors..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                </div>
            </div>
            <div className="table-container">
                <table className="table table-bordered mt-3 vendorlist-tbl">
                    <thead>
                        <tr>
                            <th>Vendor Category</th>
                            <th>Vendor Code</th>
                            <th>Manual Vendor Code</th>
                            <th>Company Name</th>
                            <th>GST No</th>
                            <th>Address 1</th>
                            <th>Address 2</th>
                            <th>Pin</th>
                            <th>Contact Person</th>
                            <th>Contact Number</th>
                            <th>Email</th>
                            <th>Industry</th>
                            <th>Category</th>
                            <th>Sub Category</th>
                            <th>Payment Terms</th>
                            <th>Delivery Terms</th>
                            <th className="sticky-action">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedVendors.length > 0 ? (
                            paginatedVendors.map((v) => (
                                <tr key={v.vendorId}>
                                    <td>{v.vendorCategoryName}</td>
                                    <td>{v.vendorCode}</td>
                                    <td>{v.manualVendorCode}</td>
                                    <td>{v.vendorName}</td>
                                    <td>{v.gstNo}</td>
                                    <td>{v.addresses?.[0]?.address1 || "-"}</td>
                                    <td>{v.addresses?.[0]?.address2 || "-"}</td>
                                    <td>{v.addresses?.[0]?.pincode || "-"}</td>
                                    <td>{v.contactPerson}</td>
                                    <td>{v.contactNo}</td>
                                    <td>{v.email}</td>
                                    <td>{v.industryName}</td>
                                    <td>{v.categoryName}</td>
                                    <td>{v.subCategoryName}</td>
                                    <td>{v.paymentTermsName}</td>
                                    <td>{v.deliveryTermsName}</td>
                                    <td className="sticky-action">
                                        {v.isActive ? (
                                            <>
                                                <button
                                                    className="btn btn-sm me-2"
                                                    style={{ backgroundColor: "#fbd3cb", fontWeight: "700" }}
                                                    onClick={() => setSelectedVendor(v)} >
                                                    View Banks / Addressess
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-primary me-2"
                                                    // onClick={() => navigate(`/vendors/createvendor/${v.vendorId}`)}
                                                    onClick={() => navigate("/masters", {
                                                        state: { vendorId: v.vendorId }
                                                    })}>
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger me-2"
                                                    onClick={() => handleDeleteVendor(v.vendorId)}
                                                    disabled={loadingId === v.vendorId}>
                                                    {loadingId === v.vendorId ? "Deleting..." : <FaTrash />}
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                className="btn btn-sm btn-success"
                                                onClick={() => handleReactivateVendor(v.vendorId)}
                                                disabled={loadingId === v.vendorId}>
                                                {loadingId === v.vendorId ? "Processing..." : "Re-Activate"}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="17" className="text-center">
                                    No Data Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-3">
                <button
                    className="btn btn-secondary"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}>
                    &lt;
                </button>
                <span>
                    {page} of {Math.ceil(vendors.length / pageSize)}
                </span>
                <button
                    className="btn btn-secondary"
                    disabled={page * pageSize >= vendors.length}
                    onClick={() => setPage(page + 1)}>
                    &gt;
                </button>
            </div>

            {selectedVendor && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-lg modal-dialog-centered" style={{ maxWidth: "80%" }}>
                            <div className="modal-content">

                                <div className="modal-header" style={{ backgroundColor: "#0e78c0", color: "white" }}>
                                    <h2 className="modal-title" style={{ fontSize: "20px" }}><i className="bi bi-building-fill"></i>{selectedVendor.vendorName} - Details</h2>
                                    <button className="btn-close" onClick={() => setSelectedVendor(null)}></button>
                                </div>
                                <div className="modal-body">
                                    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>

                                        <div style={{ flex: 1, minWidth: "300px" }}>
                                            <h6 style={{ color: "midnightblue", fontWeight: "700", fontSize: "20px" }}>  <i className="bi bi-geo-alt-fill me-2"></i>Address Details</h6>
                                            {selectedVendor.addresses?.length > 0 ? (
                                                selectedVendor.addresses.map((a, i) => (
                                                    <div key={i} className="border p-2 mb-2 rounded">
                                                        <strong>Address {i + 1}</strong>
                                                        <div>{a.address1}</div>
                                                        <div>{a.address2}</div>
                                                        <div>Pincode: {a.pincode}</div>
                                                    </div>
                                                ))
                                            ) : <p>No addresses available</p>}
                                        </div>

                                        <div style={{ flex: 1, minWidth: "300px" }}>
                                            <h6 style={{ color: "midnightblue", fontWeight: "700", fontSize: "20px" }}><i className="bi bi-bank2 me-2"></i>Banks Details</h6>
                                            {selectedVendor.bankList?.length > 0 ? (
                                                selectedVendor.bankList.map((b, i) => (
                                                    <div key={i} className="border p-2 mb-2 rounded">
                                                        <strong>Bank {i + 1}</strong>
                                                        <div>Account No: {b.currentAccountNo}</div>
                                                        <div>Bank Name: {b.bankName}</div>
                                                        <div>Branch: {b.branchName}</div>
                                                        <div>IFSC: {b.ifscCode}</div>
                                                    </div>
                                                ))
                                            ) : <p>No bank details available</p>}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
export default ViewVendor;