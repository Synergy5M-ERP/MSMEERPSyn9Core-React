import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Trash2 } from "lucide-react";
import { API_ENDPOINTS } from "../../config/apiconfig";

export default function ViewBank({ view }) {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [bankList, setBankList] = useState([]);
  const [loading, setLoading] = useState(false);

  const activeFilter = view; // active / inactive

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    if (selectedVendor) handleVendorChange(selectedVendor);
  }, [activeFilter]);

  // Fetch Vendors
  const fetchVendors = async () => {
    try {
      const res = await fetch(`${API_ENDPOINTS.BankDetails}AccountBankDetail`);
      const data = await res.json();

      if (data.success && data.data) {
        const uniqueVendors = Array.from(
          new Map(data.data.map((item) => [item.vendorId, item])).values()
        );

        setVendors(uniqueVendors);
      } else {
        toast.error("No vendors found!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching vendors.");
    }
  };

  // Fetch Bank List
  const handleVendorChange = async (vendorId) => {
    setSelectedVendor(vendorId);
    setBankList([]);
    if (!vendorId) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${API_ENDPOINTS.BankDetails}BankDetails?vendorId=${vendorId}&isActive=${
          activeFilter === "active"
        }`
      );

      const result = await res.json();

      if (result.success) setBankList(result.data || []);
      else toast.error("No bank details found.");
    } catch (error) {
      console.error(error);
      toast.error("Server error.");
    } finally {
      setLoading(false);
    }
  };

  // Deactivate
  const handleDeactivate = async (id) => {
    if (!window.confirm("Do you want to deactivate this bank record?")) return;

    try {
      const res = await fetch(
        `${API_ENDPOINTS.BankDetails}AccountBankDetails/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: false }),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Record deactivated!");
        handleVendorChange(selectedVendor);
      } else toast.error("Failed to deactivate.");
    } catch (error) {
      console.error(error);
      toast.error("Error deactivating record.");
    }
  };

  // Activate
  const handleActivate = async (id) => {
    try {
      const res = await fetch(
        `${API_ENDPOINTS.BankDetails}AccountBankDetails/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: true }),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Activated successfully!");
        handleVendorChange(selectedVendor);
      } else toast.error("Failed to activate.");
    } catch (error) {
      console.error(error);
      toast.error("Error activating record.");
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer />

      <h3 className="text-primary text-center fw-bold mb-4">
        Vendor Bank Details
      </h3>

      {/* Vendor Dropdown */}
      <div className="card shadow-sm p-3 mb-4">
        <div className="row align-items-center">
          <div className="col-md-8">
            <select
              className="form-select"
              value={selectedVendor}
              onChange={(e) => handleVendorChange(e.target.value)}
            >
              <option value="">Select Vendor</option>
              {vendors.map((v) => (
                <option key={v.vendorId} value={v.vendorId}>
                  {v.vendorName}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4 text-end">{loading && "Loading..."}</div>
        </div>
      </div>

      {/* Bank Table */}
      {bankList.length > 0 && (
        <div className="card shadow-sm p-3">
          <h5 className="fw-bold text-success mb-3">
            Bank Accounts for{" "}
            {vendors.find((v) => v.vendorId == selectedVendor)?.vendorName}
          </h5>

          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Bank Name</th>
                <th>Account No</th>
                <th>Branch</th>
                <th>IFSC</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {bankList.map((bank, index) => (
                <tr key={bank.accountBankDetailId}>
                  <td>{index + 1}</td>
                  <td>{bank.bankName}</td>
                  <td>{bank.accountNo}</td>
                  <td>{bank.branchName}</td>
                  <td>{bank.ifscCode}</td>
                  <td>
                    {activeFilter === "active" ? (
                      <Trash2
                        className="text-danger"
                        role="button"
                        onClick={() =>
                          handleDeactivate(bank.accountBankDetailId)
                        }
                      />
                    ) : (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() =>
                          handleActivate(bank.accountBankDetailId)
                        }
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
      )}
    </div>
  );
}
