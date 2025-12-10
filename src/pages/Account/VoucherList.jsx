import React, { useState, useEffect, useCallback } from "react";
import {
  Loader2,
  Package,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { API_ENDPOINTS } from "../../config/apiconfig";

const VoucherList = () => {
  const [loading, setLoading] = useState(false);

  const [suppliers, setSuppliers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState("");

  const [vouchers, setVouchers] = useState([]);          // dropdown: vouchers for vendor
  const [selectedVoucherId, setSelectedVoucherId] = useState("");

  const [voucherData, setVoucherData] = useState([]);    // vouchers with ledger rows

  const safeJson = async (res) => {
    try {
      return await res.json();
    } catch {
      return {};
    }
  };

  // LOAD VENDORS
  const loadSellers = useCallback(async () => {
    try {
      const res = await fetch(API_ENDPOINTS.GetSellers);
      if (!res.ok) throw new Error("Failed to load vendors");
      const data = await safeJson(res);

      // assume backend: { success, data: [ "Vendor A", "Vendor B", ... ] }
      const suppliersWithIds = (data.data || []).map((name, index) => ({
        id: index + 1,
        name: name || `Vendor ${index + 1}`,
      }));
      setSuppliers(suppliersWithIds);
    } catch (err) {
      toast.error(err.message || "Failed to load vendors");
      setSuppliers([]);
    }
  }, []);

  // LOAD VOUCHER LIST FOR SELECTED VENDOR
  const loadVouchersByVendor = useCallback(async (sellerName) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_ENDPOINTS.GetVouchersBySeller}?sellerName=${encodeURIComponent(
          sellerName
        )}`
      );
      if (!res.ok) throw new Error("Failed to load vouchers");
      const data = await safeJson(res);

      // expect: { success, data: [ { id, voucherNo, voucherType, ... }, ... ] }
      setVouchers(data.data || []);
      setSelectedVoucherId("");
      setVoucherData([]);
    } catch (err) {
      toast.error(err.message || "Failed to load vouchers");
      setVouchers([]);
      setVoucherData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // LOAD VOUCHER DETAILS (HEADER + LEDGERS)
  const loadVoucherDetails = useCallback(
    async (sellerName, voucherId) => {
      try {
        setLoading(true);

        // if voucherId is empty → backend should return ALL vouchers for that vendor
        const res = await fetch(
          `${API_ENDPOINTS.GetVoucherDetails}?sellerName=${encodeURIComponent(
            sellerName
          )}${voucherId ? `&voucherId=${voucherId}` : ""}`
        );
        if (!res.ok) throw new Error("Failed to load voucher details");
        const data = await safeJson(res);

        // expected backend shape (example):
        // {
        //   success: true,
        //   data: [
        //     {
        //       header: {
        //         id, voucherNo, vendorName, voucherType, voucherDate,
        //         referenceNo, totalAmount, paymentDate, paymentMode, status
        //       },
        //       ledgers: [
        //         { id, ledgerName, creditAmount, debitAmount, description },
        //         ...
        //       ]
        //     },
        //     ...
        //   ]
        // }

        const mapped = (data.data || []).map((v, index) => {
          const h = v.header || v;

          return {
            id: h.id || h.voucherId || index,
            voucherNo: h.voucherNo || h.voucherNumber || "",
            vendorName: h.vendorName || sellerName,
            voucherType: h.voucherType || "",
            voucherDate: h.voucherDate || h.date || "",
            referenceNo: h.referenceNo || h.refNo || "",
            totalAmount: Number(h.totalAmount) || 0,
            paymentDate: h.paymentDate || "",
            paymentMode: h.paymentMode || "",
            status: h.status || "",
            ledgers: (v.ledgers || []).map((l, idx) => ({
              id: l.id || idx,
              ledgerName: l.ledgerName || l.ledger || "",
              credit: Number(l.creditAmount ?? l.credit ?? 0),
              debit: Number(l.debitAmount ?? l.debit ?? 0),
              description: l.description || "",
            })),
          };
        });

        setVoucherData(mapped);
      } catch (err) {
        toast.error(err.message || "Failed to load voucher details");
        setVoucherData([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // INITIAL LOAD: VENDORS
  useEffect(() => {
    loadSellers();
  }, [loadSellers]);

  // DROPDOWN HANDLERS
  const handleSellerChange = (e) => {
    const sellerId = e.target.value;
    const selected = suppliers.find((s) => s.id === Number(sellerId));
    const name = selected?.name || "";
    setSelectedSeller(name);

    if (name) {
      loadVouchersByVendor(name);
    } else {
      setVouchers([]);
      setVoucherData([]);
      setSelectedVoucherId("");
    }
  };

  const handleVoucherChange = (e) => {
    const vId = e.target.value;
    setSelectedVoucherId(vId);

    if (selectedSeller) {
      // vId === "" → all vouchers for that vendor
      loadVoucherDetails(selectedSeller, vId);
    }
  };

  const handleCancel = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "All selected data will be cleared!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reset",
      cancelButtonText: "No, keep",
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedSeller("");
        setVouchers([]);
        setSelectedVoucherId("");
        setVoucherData([]);
        toast.info("Form reset successfully");
      }
    });
  };

  return (
    <>
      <ToastContainer position="top-right" theme="colored" />
      <div className="approved-payable-app">
        <div className="container-fluid py-3">
          {/* Vendor + Voucher selection */}
          <div className="seller-section mb-4">
            <div className="row align-items-end">
              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold mb-2">
                  Select Vendor
                </label>
                <select
                  className="form-select form-select-lg"
                  value={
                    suppliers.find((s) => s.name === selectedSeller)?.id || ""
                  }
                  onChange={handleSellerChange}
                >
                  <option value="">Choose Vendor...</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold mb-2">
                  Select Voucher
                </label>
                <select
                  className="form-select form-select-lg"
                  value={selectedVoucherId}
                  onChange={handleVoucherChange}
                  disabled={!selectedSeller || vouchers.length === 0}
                >
                  <option value="">
                    {selectedSeller
                      ? "All vouchers for vendor"
                      : "Select vendor first"}
                  </option>
                  {vouchers.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.voucherNo ||
                        v.voucherNumber ||
                        v.referenceNo ||
                        `Voucher ${v.id}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4 mb-3 text-md-end">
                {selectedSeller && (
                  <button
                    className="btn btn-secondary btn-lg mt-3 mt-md-0"
                    onClick={handleCancel}
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main content: loading / empty / vouchers */}
          {loading ? (
            <div className="text-center py-5">
              <Loader2 className="animate-spin text-primary mb-3" size={48} />
              <h4>Loading vouchers...</h4>
              <p className="text-muted">Please wait</p>
            </div>
          ) : !selectedSeller ? (
            <div className="empty-state text-center py-5">
              <Package className="empty-icon mb-3" size={64} />
              <h4>No Vendor Selected</h4>
              <p className="text-muted">Select a vendor to view vouchers</p>
            </div>
          ) : voucherData.length === 0 ? (
            <div className="empty-state text-center py-5">
              <Package className="empty-icon mb-3" size={64} />
              <h4>No Vouchers Found</h4>
              <p className="text-muted">
                {selectedVoucherId
                  ? "No data for this voucher"
                  : "No vouchers available for this vendor"}
              </p>
            </div>
          ) : (
            <div className="row g-3 mb-4">
              {voucherData.map((v) => (
                <div key={v.id} className="col-12">
                  <div className="border rounded shadow-sm mb-3">
                    {/* Voucher header */}
                    <div className="p-3 bg-primary text-white rounded-top">
                      <div className="row small">
                        <div className="col-md-3">
                          <strong>Voucher:</strong> {v.voucherNo}
                        </div>
                        <div className="col-md-3">
                          <strong>Vendor:</strong> {v.vendorName}
                        </div>
                        <div className="col-md-3">
                          <strong>Type:</strong> {v.voucherType}
                        </div>
                        <div className="col-md-3">
                          <strong>Voucher Date:</strong> {v.voucherDate}
                        </div>
                        <div className="col-md-3 mt-1">
                          <strong>Reference No:</strong> {v.referenceNo}
                        </div>
                        <div className="col-md-3 mt-1">
                          <strong>Total:</strong>{" "}
                          ₹{v.totalAmount.toLocaleString("en-IN")}
                        </div>
                        <div className="col-md-3 mt-1">
                          <strong>Payment Date:</strong>{" "}
                          {v.paymentDate || "N/A"}
                        </div>
                        <div className="col-md-3 mt-1">
                          <strong>Mode:</strong> {v.paymentMode || "N/A"}
                        </div>
                        <div className="col-md-3 mt-2">
                          <strong>Status:</strong>{" "}
                          <span
                            className={`badge ${
                              v.status === "PAID"
                                ? "bg-success"
                                : v.status === "CANCELLED"
                                ? "bg-danger"
                                : "bg-warning text-dark"
                            }`}
                          >
                            {v.status || "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Ledger table */}
                    <div className="p-3">
                      <div className="table-responsive">
                        <table className="table table-sm table-hover mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>Ledger</th>
                              <th className="text-end">Credit Amount</th>
                              <th className="text-end">Debit Amount</th>
                              <th>Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {v.ledgers.length === 0 ? (
                              <tr>
                                <td
                                  colSpan="4"
                                  className="text-center text-muted py-3"
                                >
                                  No ledgers for this voucher
                                </td>
                              </tr>
                            ) : (
                              v.ledgers.map((l) => (
                                <tr key={l.id}>
                                  <td>{l.ledgerName}</td>
                                  <td className="text-end">
                                    {l.credit
                                      ? `₹${l.credit.toLocaleString("en-IN")}`
                                      : "-"}
                                  </td>
                                  <td className="text-end">
                                    {l.debit
                                      ? `₹${l.debit.toLocaleString("en-IN")}`
                                      : "-"}
                                  </td>
                                  <td>{l.description}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VoucherList;
