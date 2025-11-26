import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function VendorBankList() {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [bankList, setBankList] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Load all vendors in dropdown on page load
  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await fetch("http://localhost:49980/api/vendors"); // ✅ Get all vendors
      const data = await res.json();

      if (data.success) {
        setVendors(data.vendorList);
      } else {
        toast.error("No vendors found!");
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      toast.error("Error fetching vendors.");
    }
  };

  // 🔹 When a vendor is selected, fetch their bank accounts
  const handleVendorChange = async (vendorCode) => {
    setSelectedVendor(vendorCode);
    setBankList([]);
    if (!vendorCode) return;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:49980/api/vendorBanks?vendorCode=${vendorCode}`);
      const data = await res.json();

      if (data.success) {
        setBankList(data.bankAccounts);
        toast.success("Bank details loaded successfully!");
      } else {
        toast.error("No bank details found for this vendor.");
      }
    } catch (error) {
      console.error("Error fetching bank details:", error);
      toast.error("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
      <h3 className="text-primary text-center fw-bold mb-4">
        Vendor Bank Details
      </h3>

      {/* 🔹 Vendor Dropdown */}
      <div className="card shadow-sm p-3 mb-4">
        <div className="row align-items-center">
          <div className="col-md-8">
            <select
              className="form-select"
              value={selectedVendor}
              onChange={(e) => handleVendorChange(e.target.value)}
            >
              <option value="">Select Vendor</option>
              {vendors.map((v, i) => (
                <option key={i} value={v.vendorCode}>
                  {v.vendorName} ({v.vendorCode})
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4 text-end">
            {loading && <span className="text-muted">Loading...</span>}
          </div>
        </div>
      </div>

      {/* 🔹 Show Bank Accounts */}
      {bankList.length > 0 && (
        <div className="card shadow-sm p-3">
          <h5 className="fw-bold text-success mb-3">
            Bank Accounts for {vendors.find(v => v.vendorCode === selectedVendor)?.vendorName}
          </h5>
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Id</th>
                <th>Bank Name</th>
                <th>Account No.</th>
                <th>Branch Name</th>
                <th>IFSC Code</th>
              </tr>
            </thead>
            <tbody>
              {bankList.map((bank, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{bank.bankName}</td>
                  <td>{bank.accountNo}</td>
                  <td>{bank.branchName}</td>
                  <td>{bank.ifscCode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
