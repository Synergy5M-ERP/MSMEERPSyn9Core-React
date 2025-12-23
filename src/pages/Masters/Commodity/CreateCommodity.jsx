import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import { Save, X } from 'lucide-react';

const CreateCommodity = ({ onSave }) => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [formData, setFormData] = useState({
        cat1Name: '',
        cat1Dropdown: '',
        cat2Name: '',
        cat1DropdownForCat2: '',
        cat2Dropdown: '',
        cat3Name: ''
    });

    const [cat1Options, setCat1Options] = useState([]);
    const [cat2Options, setCat2Options] = useState([]);

    const API_BASE_URL = 'http://localhost:49980/Commodity';

    // Fetch Cat1 options
    useEffect(() => {
        if (selectedCategory === 'cat2' || selectedCategory === 'cat3') {
            fetchCat1Options();
        }
    }, [selectedCategory]);

    const fetchCat1Options = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/GetAllCat1Api`);
            const result = await response.json();
            if (result.success) {
                setCat1Options(result.data || []);
            }
        } catch (error) {
            console.error('Error fetching Cat1:', error);
        }
    };

    // Fetch Cat2 options when Cat1 is selected (for Cat3)
    const fetchCat2Options = async (cat1Id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/GetCat2ByCat1Api?cat1Id=${cat1Id}`);
            const result = await response.json();
            if (result.success) {
                setCat2Options(result.data || []);
            }
        } catch (error) {
            console.error('Error fetching Cat2:', error);
        }
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        // Reset form data when changing category
        setFormData({
            cat1Name: '',
            cat1Dropdown: '',
            cat2Name: '',
            cat1DropdownForCat2: '',
            cat2Dropdown: '',
            cat3Name: ''
        });
        setCat2Options([]);
    };

    const handleCat1DropdownChange = (value) => {
        setFormData({ ...formData, cat1DropdownForCat2: value });
        if (selectedCategory === 'cat3') {
            fetchCat2Options(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let endpoint = '';
        let dataToSend = new FormData();

        if (selectedCategory === 'cat1') {
            if (!formData.cat1Name) {
                toast.error('Please enter Cat 1 name');
                return;
            }
            endpoint = `${API_BASE_URL}/CreateCat1Api`;
            dataToSend.append('Cat1Name', formData.cat1Name);
        } else if (selectedCategory === 'cat2') {
            if (!formData.cat1Dropdown || !formData.cat2Name) {
                toast.error('Please fill all required fields');
                return;
            }
            endpoint = `${API_BASE_URL}/CreateCat2Api`;
            dataToSend.append('Cat1Id', formData.cat1Dropdown);
            dataToSend.append('Cat2Name', formData.cat2Name);
        } else if (selectedCategory === 'cat3') {
            if (!formData.cat1DropdownForCat2 || !formData.cat2Dropdown || !formData.cat3Name) {
                toast.error('Please fill all required fields');
                return;
            }
            endpoint = `${API_BASE_URL}/CreateCat3Api`;
            dataToSend.append('Cat1Id', formData.cat1DropdownForCat2);
            dataToSend.append('Cat2Id', formData.cat2Dropdown);
            dataToSend.append('Cat3Name', formData.cat3Name);
        } else {
            toast.error('Please select a category type');
            return;
        }

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                body: dataToSend
            });

            const result = await response.json();

            if (result.success) {
                toast.success(`${selectedCategory.toUpperCase()} created successfully!`);
                handleCancel();
                if (onSave) onSave();
            } else {
                toast.error(result.message || 'Failed to create category');
            }
        } catch (error) {
            toast.error('Error creating category: ' + error.message);
        }
    };

    const handleCancel = () => {
        setSelectedCategory('');
        setFormData({
            cat1Name: '',
            cat1Dropdown: '',
            cat2Name: '',
            cat1DropdownForCat2: '',
            cat2Dropdown: '',
            cat3Name: ''
        });
        setCat2Options([]);
    };

    return (
        <div className="card shadow-sm">
            {/* <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Create Commodity</h5>
            </div> */}
            <div className="card-body">
                {/* Category Type Selection */}
                <div className="mb-4">
                    <label className="form-label fw-bold">Select  <span className="text-danger">*</span></label>
                    <div className="btn-group w-100" role="group">
                        <input
                            type="radio"
                            className="btn-check"
                            name="categoryType"
                            id="cat1"
                            autoComplete="off"
                            checked={selectedCategory === 'cat1'}
                            onChange={() => handleCategoryChange('cat1')}
                        />
                        <label className="btn btn-outline-primary" htmlFor="cat1">Cat 1</label>

                        <input
                            type="radio"
                            className="btn-check"
                            name="categoryType"
                            id="cat2"
                            autoComplete="off"
                            checked={selectedCategory === 'cat2'}
                            onChange={() => handleCategoryChange('cat2')}
                        />
                        <label className="btn btn-outline-primary" htmlFor="cat2">Cat 2</label>

                        <input
                            type="radio"
                            className="btn-check"
                            name="categoryType"
                            id="cat3"
                            autoComplete="off"
                            checked={selectedCategory === 'cat3'}
                            onChange={() => handleCategoryChange('cat3')}
                        />
                        <label className="btn btn-outline-primary" htmlFor="cat3">Cat 3</label>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Cat 1 Form */}
                    {selectedCategory === 'cat1' && (
                        <div className="row g-3">
                            <div className="col-md-12">
                                <label className="form-label fw-bold">Cat 1: textbox <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Cat 1 name"
                                    value={formData.cat1Name}
                                    onChange={(e) => setFormData({ ...formData, cat1Name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* Cat 2 Form */}
                    {selectedCategory === 'cat2' && (
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Cat 1: dropdown <span className="text-danger">*</span></label>
                                <select
                                    className="form-select"
                                    value={formData.cat1Dropdown}
                                    onChange={(e) => setFormData({ ...formData, cat1Dropdown: e.target.value })}
                                    required
                                >
                                    <option value="">Select Cat 1</option>
                                    {cat1Options.map((option) => (
                                        <option key={option.Id} value={option.Id}>
                                            {option.Name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Cat 2: textbox <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Cat 2 name"
                                    value={formData.cat2Name}
                                    onChange={(e) => setFormData({ ...formData, cat2Name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* Cat 3 Form */}
                    {selectedCategory === 'cat3' && (
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label fw-bold">Cat 1: dropdown <span className="text-danger">*</span></label>
                                <select
                                    className="form-select"
                                    value={formData.cat1DropdownForCat2}
                                    onChange={(e) => handleCat1DropdownChange(e.target.value)}
                                    required
                                >
                                    <option value="">Select Cat 1</option>
                                    {cat1Options.map((option) => (
                                        <option key={option.Id} value={option.Id}>
                                            {option.Name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold">Cat 2: dropdown <span className="text-danger">*</span></label>
                                <select
                                    className="form-select"
                                    value={formData.cat2Dropdown}
                                    onChange={(e) => setFormData({ ...formData, cat2Dropdown: e.target.value })}
                                    disabled={!formData.cat1DropdownForCat2}
                                    required
                                >
                                    <option value="">Select Cat 2</option>
                                    {cat2Options.map((option) => (
                                        <option key={option.Id} value={option.Id}>
                                            {option.Name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold">Cat 3: textbox <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Cat 3 name"
                                    value={formData.cat3Name}
                                    onChange={(e) => setFormData({ ...formData, cat3Name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* Buttons */}
                    {selectedCategory && (
                        <div className="row mt-4">
                            <div className="col-md-12">
                                <div className="d-flex gap-2">
                                    <button type="submit" className="btn btn-success">
                                        <Save size={18} className="me-2" />
                                        Save
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                                        <X size={18} className="me-2" />
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default CreateCommodity;