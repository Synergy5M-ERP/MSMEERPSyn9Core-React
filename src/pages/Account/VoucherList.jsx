import React, { useState, useEffect } from "react";
import { Loader2, FileText, Calendar, DollarSign, AlertCircle } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_ENDPOINTS } from "../../config/apiconfig";

function VoucherList() {
  // Dropdown states
  const [vendors, setVendors] = useState([]);
  const [voucherTypes, setVoucherTypes] = useState([]);
  const [referenceList, setReferenceList] = useState([]);

  // Selected values
  const [selectedVendorId, setSelectedVendorId] = useState("");
  const [selectedVoucherTypeId, setSelectedVoucherTypeId] = useState("");
  const [selectedReferenceId, setSelectedReferenceId] = useState("");

  // Voucher data
  const [voucherHeader, setVoucherHeader] = useState(null);
  const [ledgerRecords, setLedgerRecords] = useState([]);

  // Loading states
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);
  const [loadingReferences, setLoadingReferences] = useState(false);
  const [loadingVoucher, setLoadingVoucher] = useState(false);

  // Helper function to normalize API responses
  const normalize = (json) =>
    Array.isArray(json) ? json : Array.isArray(json.data) ? json.data : [];

  const safeJson = async (res) => {
    try {
      return await res.json();
    } catch {
      return {};
    }
  };

  // Load initial dropdowns (Vendors and Voucher Types)
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoadingDropdowns(true);

        const [vendorRes, voucherTypeRes] = await Promise.all([
          fetch(API_ENDPOINTS.Vendors),
          fetch(API_ENDPOINTS.VoucherType),
        ]);

        const vendorData = await safeJson(vendorRes);
        const voucherTypeData = await safeJson(voucherTypeRes);

        setVendors(normalize(vendorData));
        setVoucherTypes(Array.isArray(voucherTypeData) ? voucherTypeData : []);
      } catch (err) {
        toast.error("Failed to load vendors and voucher types");
        console.error(err);
      } finally {
        setLoadingDropdowns(false);
      }
    };

    loadInitialData();
  }, []);

  // Load reference list when voucher type changes
  useEffect(() => {
    if (!selectedVoucherTypeId) {
      setReferenceList([]);
      setSelectedReferenceId("");
      setVoucherHeader(null);
      setLedgerRecords([]);
      return;
    }

    const voucherTypeObj = voucherTypes.find(
      (v) => v.accountVoucherTypeId.toString() === selectedVoucherTypeId.toString()
    );

    if (!voucherTypeObj) return;

    const loadReferenceData = async () => {
      setLoadingReferences(true);
      setReferenceList([]);
      setSelectedReferenceId("");
      setVoucherHeader(null);
      setLedgerRecords([]);

      try {
        if (voucherTypeObj.voucherType === "Payment") {
          // Load GRN/Purchase Orders
          const res = await fetch(API_ENDPOINTS.PurchaseOrders);
          const data = await safeJson(res);
          setReferenceList(normalize(data));
        } else if (voucherTypeObj.voucherType === "Receipt") {
          // Load Sales Invoices
          const res = await fetch(API_ENDPOINTS.SalesInvoices);
          const data = await safeJson(res);
          setReferenceList(normalize(data));
        } else {
          // For Journal or other types, you might have a different endpoint
          setReferenceList([]);
        }
      } catch (err) {
        toast.error("Failed to load reference list");
        console.error(err);
      } finally {
        setLoadingReferences(false);
      }
    };

    loadReferenceData();
  }, [selectedVoucherTypeId, voucherTypes]);

  // Load voucher details when all three dropdowns are selected
  useEffect(() => {
    if (!selectedVendorId || !selectedVoucherTypeId || !selectedReferenceId) {
      setVoucherHeader(null);
      setLedgerRecords([]);
      return;
    }

    loadVoucherDetails();
  }, [selectedVendorId, selectedVoucherTypeId, selectedReferenceId]);

  const loadVoucherDetails = async () => {
    setLoadingVoucher(true);
    setVoucherHeader(null);
    setLedgerRecords([]);

    try {
      const url = `${API_ENDPOINTS.GetVoucherDetails}?vendorId=${selectedVendorId}&voucherTypeId=${selectedVoucherTypeId}&referenceId=${selectedReferenceId}`;
      const res = await fetch(url);
      const data = await safeJson(res);

      if (!data || !data.success) {
        toast.error(data?.message || "No voucher data found");
        return;
      }

      const header = data.data?.header || data.header || {};
      const ledgers = data.data?.ledger || data.ledger || [];

      setVoucherHeader(header);
      setLedgerRecords(Array.isArray(ledgers) ? ledgers : []);

      toast.success("Voucher loaded successfully");
    } catch (err) {
      toast.error("Failed to load voucher details");
      console.error(err);
    } finally {
      setLoadingVoucher(false);
    }
  };

  const handleVendorChange = (e) => {
    setSelectedVendorId(e.target.value);
    setVoucherHeader(null);
    setLedgerRecords([]);
  };

  const handleVoucherTypeChange = (e) => {
    setSelectedVoucherTypeId(e.target.value);
    setSelectedReferenceId("");
    setVoucherHeader(null);
    setLedgerRecords([]);
  };

  const handleReferenceChange = (e) => {
    setSelectedReferenceId(e.target.value);
  };

  const selectedVoucherType = voucherTypes.find(
    (v) => v.accountVoucherTypeId.toString() === selectedVoucherTypeId.toString()
  );

  const calculateTotals = () => {
    const totalCredit = ledgerRecords.reduce(
      (sum, record) => sum + (parseFloat(record.creditAmount) || 0),
      0
    );
    const totalDebit = ledgerRecords.reduce(
      (sum, record) => sum + (parseFloat(record.debitAmount) || 0),
      0
    );
    return { totalCredit, totalDebit };
  };

  const { totalCredit, totalDebit } = calculateTotals();

  if (loadingDropdowns) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="text-center">
          <Loader2 className="animate-spin text-primary mb-3" size={48} />
          <h5 className="text-muted">Loading...</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-3" style={{ background: "#f8f9fa", minHeight: "100vh" }}>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="bg-white rounded-3 shadow-sm p-4">
        {/* Page Header */}
        <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
          <FileText className="text-primary me-3" size={32} />
          <div>
            <h3 className="mb-1 fw-bold text-primary">View Account Voucher</h3>
            <p className="mb-0 text-muted small">Select criteria to view voucher details and ledger records</p>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="row g-3 mb-4">
          {/* Vendor Dropdown */}
          <div className="col-md-4">
            <label className="form-label fw-semibold text-secondary mb-2">
              <DollarSign size={16} className="me-1" />
              Vendor Name
            </label>
            <select
              className="form-select form-select-lg"
              value={selectedVendorId}
              onChange={handleVendorChange}
              disabled={loadingDropdowns}
            >
              <option value="">-- Select Vendor --</option>
              {vendors.map((vendor) => (
                <option key={vendor.vendorId} value={vendor.vendorId}>
                  {vendor.companyName || vendor.vendorName || `Vendor ${vendor.vendorId}`}
                </option>
              ))}
            </select>
          </div>

          {/* Voucher Type Dropdown */}
          <div className="col-md-4">
            <label className="form-label fw-semibold text-secondary mb-2">
              <FileText size={16} className="me-1" />
              Voucher Type
            </label>
            <select
              className="form-select form-select-lg"
              value={selectedVoucherTypeId}
              onChange={handleVoucherTypeChange}
              disabled={loadingDropdowns}
            >
              <option value="">-- Select Voucher Type --</option>
              {voucherTypes.map((type) => (
                <option key={type.accountVoucherTypeId} value={type.accountVoucherTypeId}>
                  {type.voucherType}
                </option>
              ))}
            </select>
          </div>

          {/* Reference Number Dropdown */}
          <div className="col-md-4">
            <label className="form-label fw-semibold text-secondary mb-2">
              <Calendar size={16} className="me-1" />
              Reference No
            </label>
            {loadingReferences ? (
              <div className="form-select form-select-lg d-flex align-items-center">
                <Loader2 className="animate-spin me-2" size={20} />
                Loading references...
              </div>
            ) : selectedVoucherType?.voucherType === "Payment" ? (
              <select
                className="form-select form-select-lg"
                value={selectedReferenceId}
                onChange={handleReferenceChange}
                disabled={!selectedVoucherTypeId}
              >
                <option value="">-- Select GRN --</option>
                {referenceList.map((ref) => (
                  <option key={ref.id} value={ref.id}>
                    {ref.purchaseOrderNo || ref.grnNumber || `GRN ${ref.id}`}
                  </option>
                ))}
              </select>
            ) : selectedVoucherType?.voucherType === "Receipt" ? (
              <select
                className="form-select form-select-lg"
                value={selectedReferenceId}
                onChange={handleReferenceChange}
                disabled={!selectedVoucherTypeId}
              >
                <option value="">-- Select Invoice --</option>
                {referenceList.map((ref) => (
                  <option key={ref.id} value={ref.id}>
                    {ref.invoiceNo || `Invoice ${ref.id}`}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                className="form-control form-control-lg"
                value={selectedReferenceId}
                onChange={(e) => setSelectedReferenceId(e.target.value)}
                placeholder="Enter reference number"
                disabled={!selectedVoucherTypeId}
              />
            )}
          </div>
        </div>

        {/* Loading Indicator */}
        {loadingVoucher && (
          <div className="text-center py-5">
            <Loader2 className="animate-spin text-primary mb-3" size={40} />
            <p className="text-muted">Loading voucher details...</p>
          </div>
        )}

        {/* Voucher Header Section */}
        {voucherHeader && !loadingVoucher && (
          <>
            <div className="border rounded-3 p-4 mb-4" style={{ background: "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)" }}>
              <h5 className="fw-bold mb-3 text-primary pb-2 border-bottom">
                <FileText size={20} className="me-2" />
                Voucher Information
              </h5>
              
              <div className="row g-3">
                <div className="col-md-3">
                  <div className="d-flex flex-column">
                    <small className="text-muted mb-1">Voucher No</small>
                    <strong className="text-dark">{voucherHeader.voucherNo || "N/A"}</strong>
                  </div>
                </div>
                
                <div className="col-md-3">
                  <div className="d-flex flex-column">
                    <small className="text-muted mb-1">Vendor Name</small>
                    <strong className="text-dark">{voucherHeader.vendorName || "N/A"}</strong>
                  </div>
                </div>
                
                <div className="col-md-3">
                  <div className="d-flex flex-column">
                    <small className="text-muted mb-1">Voucher Type</small>
                    <span className="badge bg-primary fs-6 text-start">
                      {voucherHeader.voucherType || "N/A"}
                    </span>
                  </div>
                </div>
                
                <div className="col-md-3">
                  <div className="d-flex flex-column">
                    <small className="text-muted mb-1">Voucher Date</small>
                    <strong className="text-dark">
                      {voucherHeader.voucherDate
                        ? new Date(voucherHeader.voucherDate).toLocaleDateString('en-IN')
                        : "N/A"}
                    </strong>
                  </div>
                </div>
                
                <div className="col-md-3">
                  <div className="d-flex flex-column">
                    <small className="text-muted mb-1">Reference No</small>
                    <strong className="text-dark">{voucherHeader.referenceNo || "N/A"}</strong>
                  </div>
                </div>
                
                <div className="col-md-3">
                  <div className="d-flex flex-column">
                    <small className="text-muted mb-1">Total Amount</small>
                    <strong className="text-success fs-5">
                      ₹{(parseFloat(voucherHeader.totalAmount) || 0).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </strong>
                  </div>
                </div>
                
                <div className="col-md-3">
                  <div className="d-flex flex-column">
                    <small className="text-muted mb-1">Payment Due Date</small>
                    <strong className="text-dark">
                      {voucherHeader.paymentDueDate
                        ? new Date(voucherHeader.paymentDueDate).toLocaleDateString('en-IN')
                        : "N/A"}
                    </strong>
                  </div>
                </div>
                
                <div className="col-md-3">
                  <div className="d-flex flex-column">
                    <small className="text-muted mb-1">Payment Mode</small>
                    <strong className="text-dark">{voucherHeader.paymentMode || "N/A"}</strong>
                  </div>
                </div>
                
                <div className="col-md-3">
                  <div className="d-flex flex-column">
                    <small className="text-muted mb-1">Status</small>
                    <span
                      className={`badge fs-6 ${
                        voucherHeader.status === "Paid"
                          ? "bg-success"
                          : voucherHeader.status === "Cancelled"
                          ? "bg-danger"
                          : voucherHeader.status === "Pending"
                          ? "bg-warning text-dark"
                          : "bg-secondary"
                      }`}
                    >
                      {voucherHeader.status || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ledger Records Table */}
            <div className="border rounded-3 overflow-hidden">
              <div className="bg-primary text-white p-3">
                <h5 className="mb-0 fw-bold">
                  <FileText size={20} className="me-2" />
                  Ledger Records
                </h5>
              </div>
              
              <div className="table-responsive">
                <table className="table table-hover table-striped mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="fw-semibold" style={{ width: "35%" }}>Ledger Name</th>
                      <th className="fw-semibold text-end" style={{ width: "20%" }}>Credit Amount</th>
                      <th className="fw-semibold text-end" style={{ width: "20%" }}>Debit Amount</th>
                      <th className="fw-semibold" style={{ width: "25%" }}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledgerRecords.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-5 text-muted">
                          <AlertCircle size={32} className="mb-2" />
                          <p className="mb-0">No ledger records found for this voucher</p>
                        </td>
                      </tr>
                    ) : (
                      ledgerRecords.map((record, index) => (
                        <tr key={index}>
                          <td className="fw-semibold">{record.ledgerName || "N/A"}</td>
                          <td className="text-end text-success fw-semibold">
                            {record.creditAmount != null && parseFloat(record.creditAmount) > 0
                              ? `₹${parseFloat(record.creditAmount).toLocaleString('en-IN', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                                })}`
                              : "-"}
                          </td>
                          <td className="text-end text-danger fw-semibold">
                            {record.debitAmount != null && parseFloat(record.debitAmount) > 0
                              ? `₹${parseFloat(record.debitAmount).toLocaleString('en-IN', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                                })}`
                              : "-"}
                          </td>
                          <td className="text-muted">{record.description || "-"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  {ledgerRecords.length > 0 && (
                    <tfoot className="table-secondary">
                      <tr className="fw-bold">
                        <td>TOTAL</td>
                        <td className="text-end text-success fs-5">
                          ₹{totalCredit.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </td>
                        <td className="text-end text-danger fs-5">
                          ₹{totalDebit.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!voucherHeader && !loadingVoucher && (selectedVendorId || selectedVoucherTypeId || selectedReferenceId) && (
          <div className="text-center py-5">
            <AlertCircle size={48} className="text-muted mb-3" />
            <h5 className="text-muted">Select all filters to view voucher details</h5>
            <p className="text-muted small">Please select Vendor, Voucher Type, and Reference Number</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default VoucherList;