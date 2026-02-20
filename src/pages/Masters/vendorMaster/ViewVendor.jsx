// ============================================
// FILE 1: ViewVendor.jsx (COMPLETE - All ESLint Errors Fixed)
// ============================================
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { RefreshCcw } from 'lucide-react'; // ✅ Fixed: Removed unused Edit2, Save, Eye, X
import { RiDeleteBin3Fill, RiEdit2Fill } from 'react-icons/ri';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { API_ENDPOINTS } from '../../../config/apiconfig';

const API_BASE_URL = 'http://localhost:49980/Vendor';

const vendorSchema = yup.object({
  Company_Name: yup.string().required("Company Name is required"),
  Vendor_Categories: yup.string().required("Vendor Category is required"),
  Email: yup.string().email("Invalid email format").nullable(),
  Contact_Number: yup.string().matches(/^[0-9]{10}$/, "Contact number must be 10 digits").nullable(),
  PAN_No: yup.string().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format").nullable(),
  GST_Number: yup.string().matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST format").nullable(),
});

function ViewVendor() {
    // Main table state
    const [Vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [VendorsPerPage, setVendorsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredVendors, setFilteredVendors] = useState([]);

    // Edit modal state
    const [editingVendor, setEditingVendor] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    // ALL Dropdown states from EditVendor
    const [industries, setIndustries] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedIndustry, setSelectedIndustry] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');

    const [dropdownData, setDropdownData] = useState({
        sources: [],
        continents: [],
        countries: [],
        states: [],
        cities: []
    });

    const [dropdowns] = useState({
        vendorCategories: [
            "SELLER", "BUYER", "TRADER", "SERVICE PROVIDER", "JOB WORK",
            "FOREIGNSUP", "FOREIGNBUY"
        ],
        zones: ["EAST", "WEST", "NORTH", "SOUTH", "CENTRAL"],
        natureOfBusinessList: [
            "MANUFACTURER", "TRADER", "DEALER", "DISTRIBUTOR", "SERVICE PROVIDER"
        ]
    });

    // React Hook Form with ALL fields
    const {
        register: registerEdit,
        handleSubmit: handleEditSubmit,
        reset: resetEditForm,
        watch,
        setValue,
        formState: { errors: editErrors }
    } = useForm({
        resolver: yupResolver(vendorSchema),
        defaultValues: {
            Vendor_Categories: '', Source: '', Continent: '', Country: '',
            State_Province: '', Zone: '', City: '', Company_Name: '',
            Contact_Person: '', Email: '', Contact_Number: '', Landline: '',
            Website: '', Address: '', Address2: '', Bank_Name: '',
            Branch: '', IFSC_No: '', CurrentAcNo: '', PAN_No: '',
            GST_Number: '', MSME_No: '', State_Code: '', CIN_No: '',
            Nature_Of_Business: '', Std_Payment_Days: ''
        }
    });

    const watchSource = watch("Source");
    const watchContinent = watch("Continent");
    const watchCountry = watch("Country");
    const watchStateProvince = watch("State_Province");

    // Load Vendors + Dropdowns on mount
    useEffect(() => {
        fetchAllVendors();
        loadInitialDropdowns();
    }, []);

    // Filter logic
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredVendors(Vendors);
        } else {
            const filtered = Vendors.filter(Vendor =>
                Vendor.Vendor_Code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                Vendor.Company_Name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredVendors(filtered);
        }
        setCurrentPage(1);
    }, [searchTerm, Vendors]);

    useEffect(() => {
        setCurrentPage(1);
    }, [VendorsPerPage]);

    // ALL Dropdown loading functions from EditVendor
    const loadInitialDropdowns = async () => {
        try {
            const [industriesRes, sourcesRes] = await Promise.all([
                fetch(`${API_BASE_URL}/GetIndustries`),
                fetch(`${API_BASE_URL}/GetSource`)
            ]);
            const [industriesData, sources] = await Promise.all([
                industriesRes.json(),
                sourcesRes.json()
            ]);
            setIndustries(Array.isArray(industriesData) ? industriesData : []);
            setDropdownData((prev) => ({
                ...prev,
                sources: Array.isArray(sources) ? sources : []
            }));
        } catch (err) {
            console.error("loadInitialDropdowns error:", err);
        }
    };

    // Industry/Category cascading
    useEffect(() => {
        if (selectedIndustry) {
            fetch(`${API_BASE_URL}/GetCategories?industryId=${selectedIndustry}`)
                .then(res => res.json())
                .then(data => setCategories(Array.isArray(data) ? data : []))
                .catch(() => setCategories([]));
        } else {
            setCategories([]);
            setSelectedCategory('');
            setSubcategories([]);
            setSelectedSubcategory('');
        }
    }, [selectedIndustry]);

    useEffect(() => {
        if (selectedCategory) {
            fetch(`${API_BASE_URL}/GetSubcategories?CategoryId=${selectedCategory}`)
                .then(res => res.json())
                .then(data => setSubcategories(Array.isArray(data) ? data : []))
                .catch(() => setSubcategories([]));
        } else {
            setSubcategories([]);
            setSelectedSubcategory('');
        }
    }, [selectedCategory]);

    // Location cascading
    useEffect(() => {
        if (watchSource) loadContinents(watchSource);
        else setDropdownData(p => ({ ...p, continents: [], countries: [], states: [], cities: [] }));
    }, [watchSource]);

    useEffect(() => {
        if (watchSource && watchContinent) loadCountries(watchSource, watchContinent);
        else setDropdownData(p => ({ ...p, countries: [], states: [], cities: [] }));
    }, [watchSource, watchContinent]);

    useEffect(() => {
        if (watchSource && watchContinent && watchCountry) loadStates(watchSource, watchContinent, watchCountry);
        else setDropdownData(p => ({ ...p, states: [], cities: [] }));
    }, [watchSource, watchContinent, watchCountry]);

    useEffect(() => {
        if (watchSource && watchContinent && watchCountry && watchStateProvince) 
            loadCities(watchSource, watchContinent, watchCountry, watchStateProvince);
        else setDropdownData(p => ({ ...p, cities: [] }));
    }, [watchSource, watchContinent, watchCountry, watchStateProvince]);

    // Location functions
    const loadContinents = async (source) => {
        try {
            const res = await fetch(`${API_BASE_URL}/GetContinent?source=${encodeURIComponent(source)}`);
            const data = await res.json();
            setDropdownData(prev => ({
                ...prev,
                continents: Array.isArray(data) ? data : [],
                countries: [], states: [], cities: []
            }));
        } catch (err) {
            console.error("loadContinents:", err);
        }
    };

    const loadCountries = async (source, continent) => {
        try {
            const res = await fetch(
                `${API_BASE_URL}/GetCountry?source=${encodeURIComponent(source)}&continent=${encodeURIComponent(continent)}`
            );
            const data = await res.json();
            setDropdownData(prev => ({ 
                ...prev, 
                countries: Array.isArray(data) ? data : [], 
                states: [], cities: [] 
            }));
        } catch (err) {
            console.error("loadCountries:", err);
        }
    };

    const loadStates = async (source, continent, country) => {
        try {
            const res = await fetch(
                `${API_BASE_URL}/GetState?source=${encodeURIComponent(source)}&continent=${encodeURIComponent(continent)}&country=${encodeURIComponent(country)}`
            );
            const data = await res.json();
            setDropdownData(prev => ({ 
                ...prev, 
                states: Array.isArray(data) ? data : [], 
                cities: [] 
            }));
        } catch (err) {
            console.error("loadStates:", err);
        }
    };

    const loadCities = async (source, continent, country, state) => {
        try {
            const res = await fetch(
                `${API_BASE_URL}/GetCity?source=${encodeURIComponent(source)}&continent=${encodeURIComponent(continent)}&country=${encodeURIComponent(country)}&state=${encodeURIComponent(state)}`
            );
            const data = await res.json();
            setDropdownData(prev => ({ ...prev, cities: Array.isArray(data) ? data : [] }));
        } catch (err) {
            console.error("loadCities:", err);
        }
    };

    // Table functions
    const handleVendorsPerPageChange = (e) => {
        setVendorsPerPage(parseInt(e.target.value));
    };

    const fetchAllVendors = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_ENDPOINTS.AllVendor);
            const result = await response.json();
            if (result.success) {
                setVendors(result.data || []);
                toast.success('Vendors loaded successfully!');
            } else {
                toast.error(result.message || 'Failed to load Vendors');
            }
        } catch (error) {
            toast.error('Error fetching Vendors: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: 'Delete this Vendor?',
            html: '<small class="text-danger">This action cannot be undone.</small>',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            reverseButtons: true,
        });

        if (confirm.isConfirmed) {
            try {
                const response = await fetch(API_ENDPOINTS.DeleteItem, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `id=${id}`,
                });
                const result = await response.json();
                if (result.success) {
                    Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Vendor removed.', timer: 1500, showConfirmButton: false });
                    fetchAllVendors();
                } else {
                    Swal.fire('Oops…', result.message || 'Failed to delete Vendor.', 'error');
                }
            } catch (error) {
                Swal.fire('Error', error.message, 'error');
            }
        }
    };

    // COMPLETE Edit functionality with ALL fields
    const handleEdit = (Vendor) => {
        setEditingVendor(Vendor);
        resetEditForm(Vendor);
        
        // Set dropdown values
        const industryMatch = industries.find(i => i.IndustryName === Vendor.industry);
        if (industryMatch) setSelectedIndustry(industryMatch.Id);
        
        setValue('Vendor_Categories', Vendor.Vendor_Categories || '');
        setShowEditModal(true);
    };

    const onEditSubmit = async (formData) => {
        if (!editingVendor) return;
        setIsUpdating(true);
        try {
            const selectedIndustryName = industries.find(i => i.Id === parseInt(selectedIndustry))?.IndustryName || "";
            const selectedCategoryName = categories.find(c => c.Id === parseInt(selectedCategory))?.CategoryName || "";
            const selectedSubcategoryName = subcategories.find(s => s.Id === parseInt(selectedSubcategory))?.SubcategoryName || "";

            const dataToSend = {
                ...formData,
                Id: editingVendor.Id,
                industry: selectedIndustryName,
                Category: selectedCategoryName,
                Sub_Category: selectedSubcategoryName
            };

            const response = await fetch(`${API_BASE_URL}/EditVendorData`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });
            const result = await response.json();

            if (result.success) {
                toast.success(`${result.message} Vendor Code: ${result.vendorCode || editingVendor.Vendor_Code}`);
                setShowEditModal(false);
                setEditingVendor(null);
                fetchAllVendors();
                // ✅ FIXED: Removed vendorData and setShowEditForm references
            } else {
                toast.error(result.message || "Failed to update vendor.");
            }
        } catch (error) {
            toast.error("Error updating vendor: " + error.message);
        } finally {
            setIsUpdating(false);
        }
    };

    // Pagination
    const indexOfLastVendor = currentPage * VendorsPerPage;
    const indexOfFirstVendor = indexOfLastVendor - VendorsPerPage;
    const currentVendors = filteredVendors.slice(indexOfFirstVendor, indexOfLastVendor);
    const totalPages = Math.ceil(filteredVendors.length / VendorsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }
        for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
        return pageNumbers;
    };

    if (loading) {
        return <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>;
    }

    return (
        <>
            <div className="vendor-container">
                <div className="container-fluid m-3">
                    {/* Search & Actions Row */}
                    <div className="row p-3 m-2 flex-nowrap d-flex align-items-center" style={{ overflowX: 'auto' }}>
                        <div className="col-auto px-2">
                            <div className="input-group shadow-sm" style={{ minWidth: '220px' }}>
                                <input
                                    type="text"
                                    className="form-control border-0 rounded-start"
                                    style={{ fontSize: '14px' }}
                                    placeholder="Search by Vendor Code or Company..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button className="btn btn-outline-secondary rounded-end">🔍</button>
                            </div>
                        </div>
                        <div className="col-auto flex-grow-1">
                            <h4 className="text-primary h2 mb-0 text-truncate">VIEW VENDOR DETAILS</h4>
                        </div>
                        <div className="col-auto px-2">
                            <button className="btn btn-success shadow-sm" onClick={fetchAllVendors} disabled={loading} style={{ backgroundColor: "#100670" }}>
                                <RefreshCcw />
                            </button>
                        </div>
                        <div className="col-auto px-2">
                            <div className="d-flex align-items-center">
                                <label className="me-2 fw-bold text-muted small mb-0">Show:</label>
                                <select className="form-select form-select-sm shadow-sm" style={{ width: '80px' }} value={VendorsPerPage} onChange={handleVendorsPerPageChange}>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                                <span className="ms-2 text-muted small">entries</span>
                            </div>
                        </div>
                        <div className="col-auto">
                            <span className="badge bg-info p-2" style={{ fontSize: "14px", height: "30px" }}>
                                Total Vendors: {filteredVendors.length}
                            </span>
                        </div>
                    </div>

                    {/* Vendors Table */}
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-0">
                            <div className="table-responsive table-container" style={{ maxHeight: '600px', overflowY: 'auto', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                <table className="table table-striped table-hover align-middle" style={{ minWidth: '1600px' }}>
                                    <thead className="table-primary border">
                                        <tr>
                                            <th style={{ width: '1%' }}>Sr.No</th>
                                            <th style={{ width: '18%' }}>Vendor Code</th>
                                            <th style={{ width: '8%' }}>Company Name</th>
                                            <th style={{ width: '12%' }}>Vendor Category</th>
                                            <th style={{ width: '10%' }}>Industry Name</th>
                                            <th style={{ width: '15%' }}>Category Name</th>
                                            <th style={{ width: '15%' }}>Subcategory Name</th>
                                            <th style={{ width: '15%' }}>Source</th>
                                            <th style={{ width: '15%' }}>Continent</th>
                                            <th style={{ width: '8%' }}>Country</th>
                                            <th style={{ width: '8%' }}>State/Province</th>
                                            <th style={{ width: '10%' }}>Zone</th>
                                            <th style={{ width: '8%' }}>City</th>
                                            <th style={{ width: '8%' }}>Address</th>
                                            <th style={{ width: '10%' }}>Contact Person</th>
                                            <th style={{ width: '1%' }}>Email</th>
                                            <th style={{ width: '1%' }}>Contact Number</th>
                                            <th style={{ width: '1%' }}>Landline</th>
                                            <th style={{ width: '12%' }}>GST No</th>
                                            <th style={{ width: '18%' }}>Website</th>
                                            <th style={{ width: '10%' }}>Current Account</th>
                                            <th style={{ width: '15%' }}>Bank Name</th>
                                            <th style={{ width: '15%' }}>Branch</th>
                                            <th style={{ width: '15%' }}>IFSC No</th>
                                            <th style={{ width: '8%' }}>CIN No</th>
                                            <th style={{ width: '8%' }}>PAN No</th>
                                            <th style={{ width: '10%' }}>MSME No</th>
                                            <th style={{ width: '8%' }}>Std Payment Days</th>
                                            <th style={{ width: '10%' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentVendors.length > 0 ? (
                                            currentVendors.map((Vendor, index) => (
                                                <tr key={Vendor.Id}>
                                                    <td>{indexOfFirstVendor + index + 1}</td>
                                                    <td><strong className="text-primary">{Vendor.Vendor_Code}</strong></td>
                                                    <td>{Vendor.Company_Name}</td>
                                                    <td>{Vendor.Vendor_Categories}</td>
                                                    <td>{Vendor.industry}</td>
                                                    <td>{Vendor.Category}</td>
                                                    <td>{Vendor.Sub_Category}</td>
                                                    <td>{Vendor.Source}</td>
                                                    <td>{Vendor.Continent}</td>
                                                    <td>{Vendor.Country}</td>
                                                    <td>{Vendor.State_Province}</td>
                                                    <td>{Vendor.Zone}</td>
                                                    <td>{Vendor.City}</td>
                                                    <td>{Vendor.Address}</td>
                                                    <td>{Vendor.Contact_Person}</td>
                                                    <td>{Vendor.Email}</td>
                                                    <td>{Vendor.Contact_Number}</td>
                                                    <td>{Vendor.Landline}</td>
                                                    <td>{Vendor.GST_Number}</td>
                                                    <td>{Vendor.Website}</td>
                                                    <td>{Vendor.CurrentAcNo}</td>
                                                    <td>{Vendor.Bank_Name}</td>
                                                    <td>{Vendor.Branch}</td>
                                                    <td>{Vendor.IFSC_No}</td>
                                                    <td>{Vendor.CIN_No}</td>
                                                    <td>{Vendor.PAN_No}</td>
                                                    <td>{Vendor.MSME_No}</td>
                                                    <td>{Vendor.Std_Payment_Days}</td>
                                                    <td>
                                                        <div className="d-flex justify-content-center gap-1">
                                                            <button className="btn btn-sm shadow-sm" onClick={() => handleEdit(Vendor)} title="Edit">
                                                                <RiEdit2Fill style={{ fontSize: "16px", color: "#28a745" }} />
                                                            </button>
                                                            <button className="btn btn-sm shadow-sm" onClick={() => handleDelete(Vendor.Id)} title="Delete">
                                                                <RiDeleteBin3Fill style={{ fontSize: "16px", color: "red" }} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="29" className="text-center py-4">
                                                    <div className="text-muted h4">{searchTerm ? 'No Vendors found matching your search.' : 'No Vendors available.'}</div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="pagination-wrapper mt-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="text-muted">
                                    Showing {indexOfFirstVendor + 1} to {Math.min(indexOfLastVendor, filteredVendors.length)} of {filteredVendors.length} entries
                                </div>
                                <nav aria-label="Page navigation">
                                    <ul className="pagination mb-0">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                                        </li>
                                        {getPageNumbers().map(number => (
                                            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                                                <button className="page-link" onClick={() => paginate(number)}>{number}</button>
                                            </li>
                                        ))}
                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ✅ COMPLETE EDIT MODAL WITH ALL FIELDS */}
            {showEditModal && editingVendor && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-xl" style={{ 
                        margin: 'auto', 
                        maxWidth: '95vw',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        position: 'relative'
                    }}>
                        <div className="modal-content border-0 shadow-lg" style={{ maxHeight: '70vh', maxWidth:'1200px', overflowY: 'auto',marginLeft:"200px",marginTop:'30px' ,alignItems:'center'}}>
                          <div className="modal-header bg-primary text-white p-3" style={{ 
    borderBottom: 'none',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
}}>
    <div className="d-flex align-items-center flex-grow-1">
        <RiEdit2Fill className="me-2" size={24} style={{ color: 'white' }} />
        <h5 className="modal-title mb-0 flex-grow-1">Editing Vendor: <span className="fw-bold">{editingVendor.Vendor_Code}</span></h5>
    </div>
    <button 
        type="button" 
        className="btn-close btn-close-white ms-2" 
        onClick={() => {setShowEditModal(false); setEditingVendor(null);}}
        style={{ flexShrink: 0 }}
    />
</div>


                            <div className="modal-body p-4">
                                <style>{`.form-control, .form-select { height: 38px; font-size: 14px; } .form-label { font-size: 14px; font-weight: 500; margin-bottom: 0.25rem; }`}</style>
                                
                                <form onSubmit={handleEditSubmit(onEditSubmit)}>
                                    {/* ROW 1: Vendor Categories + Industry Chain */}
                                    <div className="row g-3 mb-4">
                                        <div className="col">
                                            <label className="form-label">Vendor Categories <span className="text-danger">*</span></label>
                                            <select {...registerEdit("Vendor_Categories")} className={`form-control ${editErrors.Vendor_Categories ? 'is-invalid' : ''}`}>
                                                <option value="">Select Vendor Category</option>
                                                {dropdowns.vendorCategories.map(vc => <option key={vc} value={vc}>{vc}</option>)}
                                            </select>
                                            <div className="invalid-feedback">{editErrors.Vendor_Categories?.message}</div>
                                        </div>
                                        <div className="col">
                                            <label className="form-label">Industry</label>
                                            <select value={selectedIndustry} onChange={e => setSelectedIndustry(e.target.value)} className="form-control">
                                                <option value="">Select Industry</option>
                                                {industries.map(i => <option key={i.Id} value={i.Id}>{i.IndustryName}</option>)}
                                            </select>
                                        </div>
                                        <div className="col">
                                            <label className="form-label">Category</label>
                                            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="form-control" disabled={!selectedIndustry || !categories.length}>
                                                <option value="">Select Category</option>
                                                {categories.map(c => <option key={c.Id} value={c.Id}>{c.CategoryName}</option>)}
                                            </select>
                                        </div>
                                        <div className="col">
                                            <label className="form-label">Sub Category</label>
                                            <select value={selectedSubcategory} onChange={e => setSelectedSubcategory(e.target.value)} className="form-control" disabled={!selectedCategory || !subcategories.length}>
                                                <option value="">Select Subcategory</option>
                                                {subcategories.map(s => <option key={s.Id} value={s.Id}>{s.SubcategoryName}</option>)}
                                            </select>
                                        </div>
                                            <div className="col">
                                            <label className="form-label">Source</label>
                                            <select {...registerEdit("Source")} className="form-control">
                                                <option value="">Select Source</option>
                                                {dropdownData.sources.map((s, idx) => <option key={idx} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    {/* ROW 2: Source + Nature + Zone */}
                                    <div className="row g-3 mb-4">
                                    
                                        <div className="col">
                                            <label className="form-label">Nature of Business</label>
                                            <select {...registerEdit("Nature_Of_Business")} className="form-control">
                                                <option value="">Select Nature</option>
                                                {dropdowns.natureOfBusinessList.map(nob => <option key={nob} value={nob}>{nob}</option>)}
                                            </select>
                                        </div>
                                        <div className="col">
                                            <label className="form-label">Zone</label>
                                            <select {...registerEdit("Zone")} className="form-control">
                                                <option value="">Select Zone</option>
                                                {dropdowns.zones.map(z => <option key={z} value={z}>{z}</option>)}
                                            </select>
                                        </div>
                                          <div className="col">
                                            <label className="form-label">Continent</label>
                                            <select {...registerEdit("Continent")} disabled={!watchSource} className="form-control">
                                                <option value="">Select Continent</option>
                                                {dropdownData.continents.map((c, idx) => <option key={idx} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div className="col">
                                            <label className="form-label">Country</label>
                                            <select {...registerEdit("Country")} disabled={!watchContinent} className="form-control">
                                                <option value="">Select Country</option>
                                                {dropdownData.countries.map((c, idx) => <option key={idx} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div className="col">
                                            <label className="form-label">State/Province</label>
                                            <select {...registerEdit("State_Province")} disabled={!watchCountry} className="form-control">
                                                <option value="">Select State</option>
                                                {dropdownData.states.map((s, idx) => <option key={idx} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    {/* ROW 3: Location Cascading */}
                                    <div className="row g-3 mb-4">
                                      
                                        <div className="col">
                                            <label className="form-label">City</label>
                                            <select {...registerEdit("City")} disabled={!watchStateProvince} className="form-control">
                                                <option value="">Select City</option>
                                                {dropdownData.cities.map((c, idx) => <option key={idx} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                          <div className="col">
                                            <label className="form-label">Company Name <span className="text-danger">*</span></label>
                                            <input {...registerEdit("Company_Name")} className={`form-control ${editErrors.Company_Name ? 'is-invalid' : ''}`} />
                                            <div className="invalid-feedback">{editErrors.Company_Name?.message}</div>
                                        </div>
                                        <div className="col">
                                            <label className="form-label">Contact Person</label>
                                            <input {...registerEdit("Contact_Person")} className="form-control" />
                                        </div>
                                        <div className="col">
                                            <label className="form-label">Email</label>
                                            <input type="email" {...registerEdit("Email")} className={`form-control ${editErrors.Email ? 'is-invalid' : ''}`} />
                                            <div className="invalid-feedback">{editErrors.Email?.message}</div>
                                        </div>
                                        <div className="col">
                                            <label className="form-label">Contact Number</label>
                                            <input {...registerEdit("Contact_Number")} className={`form-control ${editErrors.Contact_Number ? 'is-invalid' : ''}`} />
                                            <div className="invalid-feedback">{editErrors.Contact_Number?.message}</div>
                                        </div>
                                    </div>

                               
                                    {/* ROW 5: Contact + Address */}
                                    <div className="row g-3 mb-4">
                                        <div className="col">
                                            <label className="form-label">Landline</label>
                                            <input {...registerEdit("Landline")} className="form-control" />
                                        </div>
                                        <div className="col">
                                            <label className="form-label">Website</label>
                                            <input {...registerEdit("Website")} className="form-control" />
                                        </div>
                                        <div className="col">
                                            <label className="form-label">State Code</label>
                                            <input {...registerEdit("State_Code")} className="form-control" />
                                        </div>
                                        <div className="col">
                                            <label className="form-label">Address (Use | to separate)</label>
                                            <textarea {...registerEdit("Address")} className="form-control" rows="2" placeholder="Line 1 | Line 2" />
                                        </div>
                                        <div className="col">
                                            <label className="form-label">Address 2 (Use | to separate)</label>
                                            <textarea {...registerEdit("Address2")} className="form-control" rows="2" placeholder="Line 1 | Line 2" />
                                        </div>
                                    </div>

                                    {/* ROW 6: Bank Details */}
                                    <div className="row g-3 mb-4">
                                        <div className="col">
                                            <label className="form-label">Bank Name</label>
                                            <input {...registerEdit("Bank_Name")} className="form-control" />
                                        </div>
                                        <div className="col">
                                            <label className="form-label">Branch</label>
                                            <input {...registerEdit("Branch")} className="form-control" />
                                        </div>
                                        <div className="col">
                                            <label className="form-label">IFSC Number</label>
                                            <input {...registerEdit("IFSC_No")} className="form-control" />
                                        </div>
                                        <div className="col">
                                            <label className="form-label">Account Number</label>
                                            <input {...registerEdit("CurrentAcNo")} className="form-control" />
                                        </div>
                                         <div className="col">
                                            <label className="form-label">PAN Number</label>
                                            <input {...registerEdit("PAN_No")} className={`form-control ${editErrors.PAN_No ? 'is-invalid' : ''}`} />
                                            <div className="invalid-feedback">{editErrors.PAN_No?.message}</div>
                                        </div>
                                    </div>

                                    {/* ROW 7: Legal Numbers */}
                                    <div className="row g-3 mb-4">
                                       
                                        <div className="col">
                                            <label className="form-label">GST Number</label>
                                            <input {...registerEdit("GST_Number")} className={`form-control ${editErrors.GST_Number ? 'is-invalid' : ''}`} />
                                            <div className="invalid-feedback">{editErrors.GST_Number?.message}</div>
                                        </div>
                                        <div className="col">
                                            <label className="form-label">CIN Number</label>
                                            <input {...registerEdit("CIN_No")} className="form-control" />
                                        </div>
                                        <div className="col">
                                            <label className="form-label">MSME Number</label>
                                            <input {...registerEdit("MSME_No")} className="form-control" />
                                        </div>
                                        <div className="col">
                                            <label className="form-label">Standard Payment Days</label>
                                            <input type="number" {...registerEdit("Std_Payment_Days")} className="form-control" />
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className="modal-footer bg-light">
                                <button type="button" className="cancel-btn shadow-sm" onClick={() => {setShowEditModal(false); setEditingVendor(null);}}>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-success shadow-sm px-4" onClick={handleEditSubmit(onEditSubmit)} disabled={isUpdating}>
                                    {isUpdating ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>Update</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
}

export default ViewVendor;
