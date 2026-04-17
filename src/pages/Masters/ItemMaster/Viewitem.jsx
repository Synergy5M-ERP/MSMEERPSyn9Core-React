import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { RefreshCcw, Save, X } from 'lucide-react';
import { RiDeleteBin3Fill } from 'react-icons/ri';
import { FiEdit } from 'react-icons/fi';

// Validation schema for edit form
const amendSchema = yup.object({
  Company_Name: yup.string().required("Company is required"),
  Industry: yup.string().required("Industry is required"),
  ItemCategory: yup.string().required("Category is required"),
  Sub_Category: yup.string().required("Sub-Category is required"),
  Item_Name: yup.string().required("Item Name is required"),
  Grade: yup.string().required("Grade is required"),
  Unit_Of_Measurement: yup.string().required("UOM is required"),
  HS_Code: yup.string().matches(/^\d{8}$/, "HS Code must be exactly 8 digits").required("HS Code is required"),
  Currency: yup.string().required("Currency is required"),
  Average_Price: yup.number().typeError("Price must be a number").positive("Price must be positive").nullable().transform((v, o) => o === '' ? null : v),
  Safe_Stock: yup.number().typeError("Stock must be a number").min(0, "Cannot be negative").nullable().transform((v, o) => o === '' ? null : v),
  MOQ: yup.number().typeError("MOQ must be a number").min(1, "MOQ must be at least 1").nullable().transform((v, o) => o === '' ? null : v),
  Primary_Alternate: yup.string().required("Primary/Alternate selection is required"),
  TC_COA: yup.string().required("TC/COA selection is required"),
});

// Helper function to safely fetch and parse JSON
const safeFetchJson = async (url, options) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Network request failed with status ${response.status}`);
  }
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch (e) {
    console.error("Failed to parse JSON response:", text);
    throw new Error("Received an invalid response from the server.");
  }
};

function View_items() {
  // State management
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Dropdown data for edit form
  const [dropdownData, setDropdownData] = useState({
    companies: [],
    industries: [],
    categories: [],
    subcategories: [],
    currencies: [],
    uoms: [],
  });

  // Base URL for your ASP.NET API
  const API_BASE_URL = 'http://localhost:49980/Item';

  // React Hook Form for edit modal
  const {
    register: registerAmend,
    handleSubmit: handleAmendSubmit,
    reset: resetAmendForm,
    watch: watchAmend,
    setValue: setAmendValue,
    formState: { errors: amendErrors }
  } = useForm({
    resolver: yupResolver(amendSchema),
    defaultValues: {
      Company_Name: '',
      Source: '',
      Continent: '',
      Country: '',
      State: '',
      City: '',
      Industry: '',
      ItemCategory: '',
      Sub_Category: '',
      Item_Name: '',
      Grade: '',
      Unit_Of_Measurement: '',
      HS_Code: '',
      Currency: 'INR',
      Average_Price: '',
      Safe_Stock: '',
      MOQ: '',
      Primary_Alternate: 'PRIMARY',
      TC_COA: 'Required'
    }
  });

  const amend_Industry = watchAmend("Industry");
  const amend_ItemCategory = watchAmend("ItemCategory");
  const amend_SubCategory = watchAmend("Sub_Category");
  const amend_CompanyName = watchAmend("Company_Name");

  // Load items on component mount
  useEffect(() => {
    fetchAllItems();
    loadDropdownData();
  }, []);

  // Filter items based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item =>
        item.Item_Code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Item_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Grade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Company_Name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, items]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  // Fetch company details when company name changes in edit form
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const data = await safeFetchJson(`${API_BASE_URL}/GetCompanyDetails?search=${encodeURIComponent(amend_CompanyName)}`);
        if (data && data.Source !== undefined) {
          setAmendValue("Source", data.Source || '');
          setAmendValue("Continent", data.Continent || '');
          setAmendValue("Country", data.Country || '');
          setAmendValue("State", data.State || '');
          setAmendValue("City", data.City || '');
        }
      } catch (error) {
        // Silently fail for optional data
      }
    };

    if (amend_CompanyName && showEditModal) {
      fetchCompanyDetails();
    }
  }, [amend_CompanyName, setAmendValue, showEditModal]);

  // Fetch categories when industry changes in edit form
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await safeFetchJson(`${API_BASE_URL}/GetCategoriesApi?industry=${encodeURIComponent(amend_Industry)}`);
        if (result?.success) {
          setDropdownData(prev => ({ ...prev, categories: result.data }));
        } else {
          setDropdownData(prev => ({ ...prev, categories: [] }));
        }
      } catch (error) {
        setDropdownData(prev => ({ ...prev, categories: [] }));
      }
    };

    if (amend_Industry && showEditModal) {
      fetchCategories();
    } else if (!amend_Industry) {
      setDropdownData(prev => ({ ...prev, categories: [], subcategories: [] }));
    }
  }, [amend_Industry, showEditModal]);

  // Fetch sub-categories when category changes in edit form
  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const result = await safeFetchJson(`${API_BASE_URL}/GetSubcategoriesApi?industry=${encodeURIComponent(amend_Industry)}&category=${encodeURIComponent(amend_ItemCategory)}`);
        if (result?.success) {
          setDropdownData(prev => ({ ...prev, subcategories: result.data }));
        } else {
          setDropdownData(prev => ({ ...prev, subcategories: [] }));
        }
      } catch (error) {
        setDropdownData(prev => ({ ...prev, subcategories: [] }));
      }
    };

    if (amend_Industry && amend_ItemCategory && showEditModal) {
      fetchSubCategories();
    } else if (!amend_ItemCategory) {
      setDropdownData(prev => ({ ...prev, subcategories: [] }));
    }
  }, [amend_Industry, amend_ItemCategory, showEditModal]);

  // Auto-fill Item Name from Sub-Category
  useEffect(() => {
    if (amend_SubCategory && showEditModal) {
      const selectedSub = dropdownData.subcategories.find(s => s.value === amend_SubCategory);
      if (selectedSub) {
        setAmendValue("Item_Name", selectedSub.label);
      }
    }
  }, [amend_SubCategory, dropdownData.subcategories, setAmendValue, showEditModal]);

  // Load dropdown data for edit form
  const loadDropdownData = async () => {
    try {
      const [companies, industries, currencies, uoms] = await Promise.all([
        safeFetchJson(`${API_BASE_URL}/GetCompanyListApi`),
        safeFetchJson(`${API_BASE_URL}/GetIndustriesApi`),
        safeFetchJson(`${API_BASE_URL}/GetCurrencyListApi`),
        safeFetchJson(`${API_BASE_URL}/GetUOMListApi`),
      ]);

      setDropdownData({
        companies: companies?.success ? companies.data : [],
        industries: industries?.success ? industries.data : [],
        currencies: currencies?.success ? currencies.data : [],
        uoms: uoms?.success ? uoms.data : [],
        categories: [],
        subcategories: [],
      });
    } catch (error) {
      console.error('Failed to load dropdown data:', error);
      toast.error('Failed to load form data');
    }
  };

  const handleItemsPerPageChange = (e) => {
    const newSize = parseInt(e.target.value);
    setItemsPerPage(newSize);
  };

  // Fetch all items from API
  const fetchAllItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/GetAllItemsApi`);
      const result = await response.json();
      
      if (result.success) {
        setItems(result.data || []);
        toast.success('Items loaded successfully!');
      } else {
        toast.error(result.message || 'Failed to load items');
      }
    } catch (error) {
      toast.error('Error fetching items: ' + error.message);
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete item
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Delete this item?',
      html: '<small class="text-danger">This action cannot be undone.</small>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      reverseButtons: true,
      focusCancel: true,
      backdrop: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await fetch(`${API_BASE_URL}/DeleteItemApi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `id=${id}`,
      });
      const result = await response.json();

      if (result.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Item removed from list.',
          timer: 1500,
          showConfirmButton: false,
        });
        fetchAllItems();
      } else {
        Swal.fire('Oops…', result.message || 'Failed to delete item.', 'error');
      }
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  // Handle edit button click - Load categories and subcategories before opening modal
  const handleEdit = async (item) => {
    try {
      // 1. First load categories based on the item's industry
      if (item.Industry) {
        const catData = await safeFetchJson(`${API_BASE_URL}/GetCategoriesApi?industry=${encodeURIComponent(item.Industry)}`);
        const newCategories = catData?.success ? catData.data : [];
        setDropdownData(prev => ({ ...prev, categories: newCategories }));

        // 2. Then load sub-categories based on the item's industry and category
        if (item.ItemCategory) {
          const subCatData = await safeFetchJson(`${API_BASE_URL}/GetSubcategoriesApi?industry=${encodeURIComponent(item.Industry)}&category=${encodeURIComponent(item.ItemCategory)}`);
          const newSubCategories = subCatData?.success ? subCatData.data : [];
          setDropdownData(prev => ({ ...prev, subcategories: newSubCategories }));
        }
      }

      // 3. Now reset the form with all the data
      resetAmendForm({
        ...item,
        Primary_Alternate: item.Prime_For_BOM || 'PRIMARY' // Map backend field to form field
      });

      // 4. Finally show the modal
      setShowEditModal(true);
    } catch (error) {
      toast.error(error.message || "Could not prepare the edit form.");
    }
  };

  // Handle update submission
  const onAmendSubmit = async (formData) => {
    setIsUpdating(true);
    try {
      // Map form field back to backend field
      const dataToSend = {
        ...formData,
        Prime_For_BOM: formData.Primary_Alternate
      };
      delete dataToSend.Primary_Alternate; // remove redundant key

      const result = await safeFetchJson(`${API_BASE_URL}/AmendItemApi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      if (result?.success) {
        toast.success(`Item updated! ${result.newItemCode ? `New Code: ${result.newItemCode}` : ''}`);
        setShowEditModal(false);
        resetAmendForm();
        fetchAllItems();
      } else {
        toast.error(result?.message || 'Failed to update item');
      }
    } catch (error) {
      toast.error('Error updating item: ' + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <style>{`
        .form-control,
        .form-select {
          height: 30px;
          font-size: 13px;
          line-height: 1.5;
        }
        .form-label {
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        .modal-body {
          max-height: 70vh;
          overflow-y: auto;
        }
      `}</style>

      <div className="d-flex flex-column" style={{ minHeight: "80vh" }}>
        <div className="container-fluid m-3">
          {/* Search and Actions */}
          <div className="row p-3 m-2 flex-nowrap d-flex align-items-center" style={{ overflowX: 'auto' }}>
            <div className="col-auto px-2">
              <div className="input-group shadow-sm" style={{ minWidth: '250px' }}>
                <input
                  type="text"
                  className="form-control border-0 rounded-start"
                  style={{ fontSize: '14px' }}
                  placeholder="Search by Item Code, Name, Grade, or Company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-outline-secondary rounded-end" type="button">
                  🔍
                </button>
              </div>
            </div>

            <div className="col-auto px-2 flex-grow-1">
              <h4 className="text-primary h2 mb-0 text-truncate">VIEW ITEM DETAILS</h4>
            </div>

            <div className="col-auto px-2">
              <button
                className="btn btn-success shadow-sm me-2"
                onClick={fetchAllItems}
                disabled={loading}
                style={{ backgroundColor: "#100670" }}
              >
                <RefreshCcw />
              </button>
            </div>

            <div className="col-auto px-2">
              <div className="d-flex align-items-center">
                <label className="me-2 fw-bold text-muted small mb-0">Show:</label>
                <select
                  className="form-select form-select-sm shadow-sm"
                  style={{ width: '80px' }}
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                >
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
                Total Items: {filteredItems.length}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                <table className="table table-striped table-hover align-middle">
                  <thead className="table-primary border">
                    <tr>
                      <th style={{ width: '1%', fontSize: '13px' }}>Sr.No</th>
                      <th style={{ width: '12%', fontSize: '13px' }}>Item Code</th>
                      <th style={{ width: '18%', fontSize: '13px' }}>Item Name</th>
                      <th style={{ width: '10%', fontSize: '13px' }}>Grade</th>
                      <th style={{ width: '15%', fontSize: '13px' }}>Company Name</th>
                      <th style={{ width: '15%', fontSize: '13px' }}>Industry Name</th>
                      <th style={{ width: '15%', fontSize: '13px' }}>Category Name</th>
                      <th style={{ width: '8%', fontSize: '13px' }}>UOM</th>
                      <th style={{ width: '8%', fontSize: '13px' }}>Currency</th>
                      <th style={{ width: '10%', fontSize: '13px' }}>Avg Price</th>
                      <th style={{ width: '8%', fontSize: '13px' }}>Safe Stock</th>
                      <th style={{ width: '8%', fontSize: '13px' }}>MOQ</th>
                      <th style={{ width: '8%', fontSize: '13px' }}>TC/COA</th>
                      <th style={{ width: '10%', fontSize: '13px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? (
                      currentItems.map((item, index) => (
                        <tr key={item.Id} className="table-row">
                          <td>{indexOfFirstItem + index + 1}</td>
                          <td><strong className="text-primary">{item.Item_Code}</strong></td>
                          <td>{item.Item_Name}</td>
                          <td>{item.Grade}</td>
                          <td>{item.Company_Name}</td>
                          <td>{item.Industry}</td>
                          <td>{item.ItemCategory}</td>
                          <td>{item.Unit_Of_Measurement}</td>
                          <td>{item.Currency}</td>
                          <td>
                            {item.Average_Price 
                              ? `${item.Currency} ${parseFloat(item.Average_Price).toFixed(2)}` 
                              : '-'}
                          </td>
                          <td>{item.Safe_Stock || '-'}</td>
                          <td>{item.MOQ || '-'}</td>
                          <td>{item.TC_COA || '-'}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <button
                                className="btn btn-sm shadow-sm"
                                onClick={() => handleEdit(item)}
                                title="Edit"
                              >
                                <FiEdit style={{ fontSize: "16px", color: "#0d6efd" }} />
                              </button>
                              <button
                                className="btn btn-sm shadow-sm"
                                onClick={() => handleDelete(item.Id)}
                                title="Delete"
                              >
                                <RiDeleteBin3Fill style={{ fontSize: "16px", color: "red" }} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="14" className="text-center py-4">
                          <div className="text-muted h4">
                            {searchTerm ? 'No items found matching your search.' : 'No items available.'}
                          </div>
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
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="text-muted">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredItems.length)} of {filteredItems.length} entries
              </div>
              <nav aria-label="Page navigation">
                <ul className="pagination mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>
                  
                  {getPageNumbers().map(number => (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => paginate(number)}
                      >
                        {number}
                      </button>
                    </li>
                  ))}
                  
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal with ALL fields and same logic as AmendItem */}
      {showEditModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl modal-dialog-scrollable">
            <div className="modal-content" style={{margin: "120px"}}>
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Edit Item</h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowEditModal(false)}
                  disabled={isUpdating}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAmendSubmit(onAmendSubmit)} id="editForm">
                  <div className="row g-3">
                    {/* Company Name */}
                    <div className="col-md-3">
                      <label className="form-label text-primary">Company Name <span className="text-danger">*</span></label>
                      <select
                        {...registerAmend("Company_Name")}
                        className={`form-select form-select-sm ${amendErrors.Company_Name ? 'is-invalid' : ''}`}
                      >
                        <option value="">---Select---</option>
                        {dropdownData.companies.map(c => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                      <div className="invalid-feedback">{amendErrors.Company_Name?.message}</div>
                    </div>

                    {/* Source */}
                    <div className="col-md-3">
                      <label className="form-label text-primary">Source</label>
                      <input
                        {...registerAmend("Source")}
                        className="form-control form-control-sm"
                        readOnly
                      />
                    </div>

                    {/* Continent */}
                    <div className="col-md-3">
                      <label className="form-label text-primary">Continent</label>
                      <input
                        {...registerAmend("Continent")}
                        className="form-control form-control-sm"
                        readOnly
                      />
                    </div>

                    {/* Country */}
                    <div className="col-md-3">
                      <label className="form-label text-primary">Country</label>
                      <input
                        {...registerAmend("Country")}
                        className="form-control form-control-sm"
                        readOnly
                      />
                    </div>

                    {/* State */}
                    <div className="col-md-3">
                      <label className="form-label text-primary">State</label>
                      <input
                        {...registerAmend("State")}
                        className="form-control form-control-sm"
                        readOnly
                      />
                    </div>

                    {/* City */}
                    <div className="col-md-3">
                      <label className="form-label text-primary">City</label>
                      <input
                        {...registerAmend("City")}
                        className="form-control form-control-sm"
                        readOnly
                      />
                    </div>

                    {/* Industry */}
                    <div className="col-md-3">
                      <label className="form-label text-primary">Industry <span className="text-danger">*</span></label>
                      <select
                        {...registerAmend("Industry")}
                        className={`form-select form-select-sm ${amendErrors.Industry ? 'is-invalid' : ''}`}
                      >
                        <option value="">---Select---</option>
                        {dropdownData.industries.map(i => (
                          <option key={i.value} value={i.value}>{i.label}</option>
                        ))}
                      </select>
                      <div className="invalid-feedback">{amendErrors.Industry?.message}</div>
                    </div>

                    {/* Category */}
                    <div className="col-md-3">
                      <label className="form-label text-primary">Category <span className="text-danger">*</span></label>
                      <select
                        {...registerAmend("ItemCategory")}
                        className={`form-select form-select-sm ${amendErrors.ItemCategory ? 'is-invalid' : ''}`}
                        disabled={!amend_Industry}
                      >
                        <option value="">---Select---</option>
                        {dropdownData.categories.map(c => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                      <div className="invalid-feedback">{amendErrors.ItemCategory?.message}</div>
                    </div>

                    {/* Sub-Category */}
                    <div className="col-md-3">
                      <label className="form-label text-primary">Sub-Category <span className="text-danger">*</span></label>
                      <select
                        {...registerAmend("Sub_Category")}
                        className={`form-select form-select-sm ${amendErrors.Sub_Category ? 'is-invalid' : ''}`}
                        disabled={!amend_ItemCategory}
                      >
                        <option value="">---Select---</option>
                        {dropdownData.subcategories.map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                      <div className="invalid-feedback">{amendErrors.Sub_Category?.message}</div>
                    </div>

                    {/* Item Name */}
                    <div className="col-md-3">
                      <label className="form-label text-primary">Item Name <span className="text-danger">*</span></label>
                      <input
                        {...registerAmend("Item_Name")}
                        className={`form-control form-control-sm ${amendErrors.Item_Name ? 'is-invalid' : ''}`}
                        readOnly
                      />
                      <div className="invalid-feedback">{amendErrors.Item_Name?.message}</div>
                    </div>

                    {/* Grade */}
                    <div className="col-md-3">
                      <label className="form-label text-primary">Grade <span className="text-danger">*</span></label>
                      <input
                        {...registerAmend("Grade")}
                        className={`form-control form-control-sm ${amendErrors.Grade ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{amendErrors.Grade?.message}</div>
                    </div>

                    {/* UOM */}
                    <div className="col-md-3">
                      <label className="form-label text-primary">UOM <span className="text-danger">*</span></label>
                      <select
                        {...registerAmend("Unit_Of_Measurement")}
                        className={`form-select form-select-sm ${amendErrors.Unit_Of_Measurement ? 'is-invalid' : ''}`}
                      >
                        <option value="">---Select---</option>
                        {dropdownData.uoms.map(u => (
                          <option key={u.value} value={u.value}>{u.label}</option>
                        ))}
                      </select>
                      <div className="invalid-feedback">{amendErrors.Unit_Of_Measurement?.message}</div>
                    </div>

                    {/* HS Code */}
                    <div className="col-md-3">
                      <label className="form-label text-primary">HS Code <span className="text-danger">*</span></label>
                      <input
                        {...registerAmend("HS_Code")}
                        className={`form-control form-control-sm ${amendErrors.HS_Code ? 'is-invalid' : ''}`}
                        maxLength={8}
                      />
                      <div className="invalid-feedback">{amendErrors.HS_Code?.message}</div>
                    </div>

                    {/* Currency */}
                    <div className="col-md-3">
                      <label className="form-label text-primary">Currency <span className="text-danger">*</span></label>
                      <select
                        {...registerAmend("Currency")}
                        className={`form-select form-select-sm ${amendErrors.Currency ? 'is-invalid' : ''}`}
                      >
                        {dropdownData.currencies.map(c => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                      <div className="invalid-feedback">{amendErrors.Currency?.message}</div>
                    </div>

                    {/* Average Price */}
                    <div className="col-md-3">
                      <label className="form-label text-primary">Average Price</label>
                      <input
                        type="number"
                        {...registerAmend("Average_Price")}
                        className={`form-control form-control-sm ${amendErrors.Average_Price ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{amendErrors.Average_Price?.message}</div>
                    </div>

                    {/* Safe Stock */}
                    <div className="col-md-3">
                      <label className="form-label text-primary">Safe Stock</label>
                      <input
                        type="number"
                        {...registerAmend("Safe_Stock")}
                        className={`form-control form-control-sm ${amendErrors.Safe_Stock ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{amendErrors.Safe_Stock?.message}</div>
                    </div>

                    {/* MOQ */}
                    <div className="col-md-3">
                      <label className="form-label text-primary">MOQ</label>
                      <input
                        type="number"
                        {...registerAmend("MOQ")}
                        className={`form-control form-control-sm ${amendErrors.MOQ ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{amendErrors.MOQ?.message}</div>
                    </div>

                    {/* Primary/Alternate */}
                    <div className="col-md-3">
                      <label className="form-label text-primary">Primary/Alternate <span className="text-danger">*</span></label>
                      <div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            {...registerAmend("Primary_Alternate")}
                            value="PRIMARY"
                            id="primaryRadio"
                          />
                          <label className="form-check-label" htmlFor="primaryRadio" style={{fontSize: '13px'}}>Primary</label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            {...registerAmend("Primary_Alternate")}
                            value="ALTERNATE"
                            id="alternateRadio"
                          />
                          <label className="form-check-label" htmlFor="alternateRadio" style={{fontSize: '13px'}}>Alternate</label>
                        </div>
                      </div>
                      <div className="invalid-feedback d-block">{amendErrors.Primary_Alternate?.message}</div>
                    </div>

                    {/* TC/COA */}
                    <div className="col-md-3">
                      <label className="form-label text-primary">TC/COA <span className="text-danger">*</span></label>
                      <div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            {...registerAmend("TC_COA")}
                            value="Required"
                            id="tcRequired"
                          />
                          <label className="form-check-label" htmlFor="tcRequired" style={{fontSize: '13px'}}>Required</label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            {...registerAmend("TC_COA")}
                            value="Not Required"
                            id="tcNotRequired"
                          />
                          <label className="form-check-label" htmlFor="tcNotRequired" style={{fontSize: '13px'}}>Not Required</label>
                        </div>
                      </div>
                      <div className="invalid-feedback d-block">{amendErrors.TC_COA?.message}</div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => setShowEditModal(false)}
                  disabled={isUpdating}
                >
                  <X className="me-1" size={16} /> Cancel
                </button>
                <button 
                  type="submit"
                  form="editForm"
                  className="btn btn-success" 
                  disabled={isUpdating}
                  style={{ width: "130px", fontSize: "14px" }}
                >
                  {isUpdating ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="me-1" size={16} /> Update
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default View_items;