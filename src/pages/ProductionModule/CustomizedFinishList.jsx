import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/apiconfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomizedFinishList = ({ onEdit }) => {
    const [allPlans, setAllPlans] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchAllPlans();
    }, []);

    const fetchAllPlans = async () => {
        try {
            const res = await axios.get(API_ENDPOINTS.GetAllCustomPlans); // Ensure this endpoint exists
            setAllPlans(res.data || []);
        } catch (err) {
            toast.error("Failed to load production plans");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this plan? This will revert quantities.")) {
            try {
                await axios.delete(`${API_ENDPOINTS.DeleteCustomPlan}/${id}`);
                toast.success("Plan deleted successfully");
                fetchAllPlans(); // Refresh list
            } catch (err) {
                toast.error("Error deleting plan");
            }
        }
    };

    const filteredPlans = allPlans.filter(p => 
        p.buyerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.soNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container-fluid">
            <ToastContainer />
            <div className="row mb-3">
                <div className="col-md-4">
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search by Buyer or SO Number..." 
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="table-responsive">
                <table className="table table-hover border">
                    <thead className="table-light">
                        <tr>
                            <th>Buyer Name</th>
                            <th>SO Number</th>
                            <th>Item Name</th>
                            <th>Grade</th>
                            <th>Machine No</th>
                            <th>Plan Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPlans.map((plan, index) => (
                            <tr key={index}>
                                <td>{plan.buyerName}</td>
                                <td>{plan.soNumber}</td>
                                <td>{plan.itemName}</td>
                                <td>{plan.grade}</td>
                                <td>{plan.machineNo}</td>
                                <td>{plan.date}</td>
                                <td>
                                    <button className="btn btn-sm btn-info me-2" onClick={() => onEdit(plan)}>Edit</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(plan.custFinProdId)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CustomizedFinishList;