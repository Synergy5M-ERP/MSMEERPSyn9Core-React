
import React, { useState, useEffect, useCallback } from "react";
import {
  Loader2,
  Eye,
  Calendar,
  FileText,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_ENDPOINTS } from "../../config/apiconfig";
import Swal from "sweetalert2";

const ApprovedPayable = () => {
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState("");
  const [grnsData, setGrnsData] = useState([]);
  const [showItemModal, setShowItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const GRNS_PER_PAGE = 2;

  const safeJson = async (res) => {
    try {
      return await res.json();
    } catch {
      return {};
    }
  };

  // -------------------- LOAD SELLERS --------------------
  const loadSellers = useCallback(async () => {
    try {
      const res = await fetch(API_ENDPOINTS.GetgrnSellers);

      if (!res.ok) throw new Error("Failed to load sellers");

      const data = await safeJson(res);

      setSuppliers(data.data || []);
    } catch (error) {
      toast.error(error.message || "Failed to load sellers");
    }
  }, []);



  // -------------------- LOAD GRN + DETAILS --------------------
  const loadAllGrnsWithDetails = useCallback(async (sellerId) => {
    try {
      setLoading(true);

      console.log("🔍 FETCHING GRNs for sellerId:", sellerId);
      const res = await fetch(`${API_ENDPOINTS.GetGRNsBySeller}?sellerId=${sellerId}`);
      if (!res.ok) throw new Error("Failed to load GRNs");

      const data = await safeJson(res);
      console.log("🔍 FULL API RESPONSE:", JSON.stringify(data.data, null, 2));

      const grnsWithDetails = (data.data || []).map((row, index) => {
        const header = row.header || {};
        const items = row.items || [];

        console.log(`🔍 PROCESSING GRN ${header.grnNumber || header.GRNNumber}: ${items.length} items`);

        // ✅ COMPLETE MAPPING with ALL field variations
        const mappedItems = items.map((it, idx) => {
          // 🔍 DEBUG: Log ALL possible BillApprove fields
          console.log("🔍 RAW ITEM DEBUG:", {
            itemName: it.itemName,
            accountGRNDetailsId: it.accountGRNDetailsId || it.AccountGRNDetailsId,
            allKeys: Object.keys(it),
            billApprove: it.billApprove,
            BillApprove: it.BillApprove,
            bill_approve: it.bill_approve
          });

          // ✅ TRY ALL POSSIBLE FIELD NAMES
          const rawBillApprove =
            it.billApprove ??      // lowercase (JSON you showed)
            it.BillApprove ??      // PascalCase
            it.bill_approve ??     // snake_case  
            it.RawBillApprove_DB ?? // debug field
            0;                     // default fallback

          console.log(`🔍 MAPPING "${it.itemName}": rawBillApprove=${rawBillApprove} (type: ${typeof rawBillApprove})`);

          // ✅ Convert ANY format → boolean
          const billApproveBool =
            rawBillApprove === true ||
            rawBillApprove === 1 ||
            rawBillApprove === "1";

          console.log(`🔍 RESULT "${it.itemName}": toggle=${billApproveBool}`);

          return {
            // ✅ IDs (handle both cases)
            id: it.accountGRNDetailsId || it.AccountGRNDetailsId || `${header.accountGRNId || header.AccountGRNId}-${idx}`,

            // ✅ Header fields
            itemId: it.itemId || it.ItemId,
            itemName: it.itemName || "",
            itemCode: it.item_Code || it.Item_Code || "",
            grade: it.item_Grade || it.Item_Grade || "",

            // ✅ Quantities
            receivedQty: Number(it.receivedQty || it.ReceivedQty || 0),
            approvedQty: Number(it.approvedQty || it.ApprovedQty || 0),
            damagedQty: Number(it.damagedQty || it.DamagedQty || 0),
            unit: it.unit || it.Unit || "",

            // ✅ Taxes
            taxType: it.taxType || it.TaxType || "",
            cgst: Number(it.cgst || it.CGST || 0),
            sgst: Number(it.sgst || it.SGST || 0),
            igst: Number(it.igst || it.IGST || 0),

            // ✅ Amounts
            totalTaxValue: Number(it.totalTaxValue || it.totalTaxAmount || it.TotalTaxAmount || 0),
            totalItemValue: Number(it.totalItemValue || it.totalAmount || it.TotalAmount || 0),
            billItemValue: Number(it.totalItemValue || it.totalAmount || it.TotalAmount || 0) +
              Number(it.totalTaxValue || it.totalTaxAmount || it.TotalTaxAmount || 0),

            // ✅ TOGGLE STATE - SINGLE SOURCE OF TRUTH
            billApprove: billApproveBool
          };
        });

        // ✅ Calculate approved total
        const approvedGrandTotal = mappedItems
          .filter((i) => i.billApprove)
          .reduce((sum, i) => sum + (parseFloat(i.billItemValue) || 0), 0);

        console.log(`🔍 GRN ${header.grnNumber}: ${mappedItems.filter(i => i.billApprove).length} approved items, total=₹${approvedGrandTotal}`);

        return {
          index,
          grnId: header.accountGRNId || header.AccountGRNId,
          grnNumber: header.grnNumber || header.GRNNumber,
          grnDate: header.grnDate || header.GRNDate,
          invoiceNumber: header.invoiceNumber || header.InvoiceNumber,
          invoiceDate: header.invoiceDate || header.InvoiceDate,
          poNumber: header.poNumber || header.PONumber,
          poDate: header.poDate || header.PODate,
          transporterName: header.transporterName || header.TransporterName,
          totalAmount: Number(header.totalAmount || header.TotalAmount || 0),
          totalTaxAmount: Number(header.totalTaxAmount || header.TotalTaxAmount || 0),
          grandAmount: Number(header.grandAmount || header.GrandAmount || 0),
          items: mappedItems,
          approvedGrandTotal
        };
      });

      console.log("🔍 FINAL grnsData:", grnsData.length, "GRNs loaded");
      setGrnsData(grnsWithDetails);
    } catch (error) {
      console.error("🔍 ERROR loading GRNs:", error);
      toast.error("Error loading GRN details");
    } finally {
      setLoading(false);
    }
  }, []);


  // -------------------- EFFECTS --------------------
  useEffect(() => {
    loadSellers();
  }, [loadSellers]);

  useEffect(() => {
    if (selectedSeller) {
      loadAllGrnsWithDetails(selectedSeller);
      setCurrentPage(1);
    } else {
      setGrnsData([]);
      setCurrentPage(1);
    }
  }, [selectedSeller, loadAllGrnsWithDetails]);

  // -------------------- HANDLERS --------------------
  const handleSellerChange = (e) => {
    const id = Number(e.target.value);
    setSelectedSeller(id || "");
  };

  const handleCancel = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "All unsaved data will be lost!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reset",
      cancelButtonText: "No, keep editing",
    }).then((result) => {
      if (result.isConfirmed) {
        setSaveLoading(false);
        setSelectedSeller("");
        setGrnsData([]);
        setShowItemModal(false);
        setSelectedItem(null);
        toast.info("Form reset successfully");
      }
    });
  };

  const totalPages = Math.ceil(grnsData.length / GRNS_PER_PAGE);
  const pagedGrns = grnsData.slice(
    (currentPage - 1) * GRNS_PER_PAGE,
    currentPage * GRNS_PER_PAGE
  );

  const goToPrevPage = () => {
    setCurrentPage((page) => Math.max(1, page - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(totalPages, page + 1));
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowItemModal(true);
  };

  const handleBillApproveToggle = useCallback((grnNumber, itemIndex) => {
    setGrnsData((prev) =>
      prev.map((grn) => {
        if (grn.grnNumber === grnNumber && grn.items && grn.items[itemIndex]) {
          const newItems = [...grn.items];
          const oldItem = newItems[itemIndex];

          const toggled = !oldItem.billApprove;

          newItems[itemIndex] = {
            ...oldItem,
            billApprove: toggled,
          };

          const approvedItems = newItems.filter((i) => i.billApprove);

          return {
            ...grn,
            items: newItems,
            approvedGrandTotal: approvedItems.reduce(
              (sum, i) => sum + (parseFloat(i.billItemValue) || 0),
              0
            ),
          };
        }
        return grn;
      })
    );
  }, []);

  const getApprovedCount = () => {
    return grnsData.reduce(
      (sum, grn) =>
        sum + (grn.items || []).filter((i) => i?.billApprove).length,
      0
    );
  };

  const handleSaveApproved = async () => {
    const TOAST_ID = "save-approved";
    toast.loading("Saving approved payables...", { toastId: TOAST_ID });
    setSaveLoading(true);

    try {

      const payload = grnsData
        .filter((grn) => grn.items.some((item) => item.billApprove))
        .map((grn) => ({
          AccountGRNId: grn.grnId,
          BillStatus: "Approved",
          Items: grn.items
            .filter((item) => item.billApprove)
            .map((item) => ({
              AccountGRNDetailsId: item.id,
              BillApprove: 1  // ✅ Sends INT 1
            })),
        }));


      console.log("Payload:", payload);

      const res = await fetch(API_ENDPOINTS.SaveMultipleGRN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Save failed");

      toast.update(TOAST_ID, {
        render: `✅ Saved ${payload.length} approved GRNs!`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      await loadAllGrnsWithDetails(selectedSeller);
    } catch (error) {
      toast.update(TOAST_ID, {
        render: error.message || "Network error",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" theme="colored" />
      <div className="approved-payable-app">
        <div className="container-fluid">
          {/* Seller Selection */}
       {/* Container Div using Flexbox */}
<div className="row align-items-end mb-4">
    
    {/* Select Section - Takes up half the row on medium screens (col-md-6) */}
    <div className="col-md-6">
        <label className="label-color">
            Select Seller
        </label>
        <select
            className="select-field-style"
            value={selectedSeller}
            onChange={handleSellerChange}
        >
            <option value="">Choose Seller...</option>
            {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                    {s.name}
                </option>
            ))}
        </select>
    </div>

    {/* Buttons Section - Takes up the other half (col-md-6) */}
    <div className="col-md-6">
        {selectedSeller && grnsData.length > 0 && (
            <div className="d-flex gap-2">
                <button
                    className="save-btn"
                    style={{ height: "48px", minWidth: "120px" }} // Matches standard 'lg' input height
                    onClick={handleSaveApproved}
                    disabled={saveLoading || getApprovedCount() === 0}
                >
                    {saveLoading ? (
                        <div className="d-flex align-items-center justify-content-center">
                            <Loader2 className="me-2 animate-spin" size={20} />
                            <span>Saving...</span>
                        </div>
                    ) : (
                        "Save"
                    )}
                </button>
                <button
                    className="cancel-btn btn-lg"
                    style={{ height: "48px", minWidth: "120px" }}
                    onClick={handleCancel}
                    disabled={saveLoading}
                >
                    Cancel
                </button>
            </div>
        )}
    </div>
</div>

          {/* Loading/Empty States */}
          {loading ? (
            <div className="loading-container text-center py-5">
              <Loader2 className="animate-spin text-primary mb-3" size={48} />
              <h4>Loading all GRNs and their details...</h4>
              <p className="text-muted">This may take a moment</p>
            </div>
          ) : !grnsData.length ? (
            <div className="empty-state text-center py-5">
              <Package className="empty-icon mb-3" size={64} />
              <h4>No GRNs Found</h4>
              <p className="text-muted">Select a seller to view their GRNs</p>
            </div>
          ) : (
            <>
              {/* 2-COLUMN GRN GRID */}
              <div className="row g-3 mb-4">
                {pagedGrns.map((grn, index) => (
                  <div key={grn.grnNumber || index} className="col-md-6">
                    <div className="grn-card h-100 border rounded shadow-sm">
                      {/* GRN Header */}
                      <div className="grn-header p-4 bg-primary text-white rounded-top">
                        <div className="row small">
                          <strong className="col-6">
                            GRN: {grn.grnNumber}
                          </strong>
                          <div className="col-6">
                            <Calendar size={14} className="me-1" />
                            <strong>GRN Date:</strong> {grn.grnDate}
                          </div>
                          <div className="col-6">
                            <FileText size={14} className="me-1" />
                            <strong>Invoice No:</strong> {grn.invoiceNumber}
                          </div>
                          <div className="col-6">
                            <strong>Invoice Date:</strong> {grn.invoiceDate}
                          </div>
                          <div className="col-6">
                            <strong>PO No:</strong> {grn.poNumber}
                          </div>
                          <div className="col-6">
                            <strong>PO Date:</strong> {grn.poDate}
                          </div>
                        </div>
                      </div>

                      {/* Items Table */}
                      <div
                        className="p-3"
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                      >
                        <div className="table-responsive">
                          <table className="table table-sm table-hover mb-0">
                            <thead className="table-light sticky-top">
                              <tr>
                                <th style={{ width: "30%" }}>Item Name</th>
                                <th style={{ width: "15%" }}>
                                  Total Tax Value
                                </th>
                                <th style={{ width: "15%" }}>Total Amount</th>
                                <th style={{ width: "15%" }}>Grand Total</th>
                                <th style={{ width: "12%" }}>Bill Approve</th>
                                <th style={{ width: "8%" }}>View</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(grn.items || []).length === 0 ? (
                                <tr>
                                  <td
                                    colSpan="6"
                                    className="text-center text-muted py-3"
                                  >
                                    No items found
                                  </td>
                                </tr>
                              ) : (
                                (grn.items || []).map((item, itemIndex) => (
                                  <tr
                                    key={`${grn.grnNumber}-${item.id || itemIndex
                                      }`}
                                    className={
                                      item.billApprove ? "table-success" : ""
                                    }
                                  >
                                    <td className="fw-semibold">
                                      {item.itemName}
                                    </td>
                                    <td>
                                      ₹
                                      {(item.totalTaxValue || 0).toLocaleString(
                                        "en-IN"
                                      )}
                                    </td>
                                    <td>
                                      ₹
                                      {(item.totalItemValue || 0).toLocaleString(
                                        "en-IN"
                                      )}
                                    </td>
                                    <td className="fw-bold">
                                      ₹
                                      {(item.billItemValue || 0).toLocaleString(
                                        "en-IN"
                                      )}
                                    </td>
                                    <td>
                                      <div className="form-check form-switch">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          checked={item.billApprove}  // ✅ true = ON, false = OFF
                                          onChange={() => handleBillApproveToggle(grn.grnNumber, itemIndex)}
                                          id={`approve-${grn.grnNumber}-${item.id}`}
                                        />
                                      </div>
                                    </td>

                                    <td>
                                      <button
                                        className="btn btn-sm btn-outline-primary p-1"
                                        onClick={() =>
                                          handleViewDetails(item)
                                        }
                                        title="View Details"
                                      >
                                        <Eye size={14} />
                                      </button>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Approved Total Footer */}
                      {grn.approvedGrandTotal > 0 && (
                        <div className="grn-footer p-3 bg-light border-top">
                          <div className="text-center">
                            <small className="text-muted">
                              Approved Total
                            </small>
                            <div className="fw-bold text-success fs-5">
                              ₹
                              {(grn.approvedGrandTotal || 0).toLocaleString(
                                "en-IN"
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination-controls d-flex justify-content-center align-items-center gap-3 my-4 p-3 bg-light rounded border">
                  <button
                    className="btn btn-outline-primary btn-sm px-3 py-2"
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={18} className="me-1" />
                    Previous
                  </button>

                  <div className="pagination-info fw-semibold">
                    Page{" "}
                    <span className="badge bg-primary">{currentPage}</span> of{" "}
                    <span className="badge bg-primary">{totalPages}</span> (
                    {grnsData.length} GRNs total)
                  </div>

                  <button
                    className="btn btn-outline-primary btn-sm px-3 py-2"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight size={18} className="ms-1" />
                  </button>
                </div>
              )}
            </>
          )}

          {/* ITEM DETAIL MODAL */}
          {showItemModal && selectedItem && (
            <>
              <div
                className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center p-3"
                style={{ zIndex: 1060 }}
                onClick={() => setShowItemModal(false)}
              >
                <div
                  className="bg-white rounded-4 shadow-lg border-0 animate__animated animate__fadeInUp"
                  style={{
                    width: "min(90vw, 700px)",
                    maxHeight: "90vh",
                    maxWidth: "700px",
                    overflow: "hidden",
                    marginTop: "65px",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className="p-4 border-bottom d-flex justify-content-between align-items-center bg-gradient"
                    style={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                    }}
                  >
                    <div className="d-flex align-items-center text-primary">
                      <Eye className="me-3" size={24} />
                      <div>
                        <h5 className="mb-0">
                          {selectedItem.itemName || "Item Details"}
                        </h5>
                        <small>Complete item information</small>
                      </div>
                    </div>
                    <button
                      className="btn-close btn-close-dark"
                      onClick={() => setShowItemModal(false)}
                      style={{ fontSize: "1.5rem" }}
                    />
                  </div>

                  <div
                    className="p-0"
                    style={{ maxHeight: "70vh", overflowY: "auto" }}
                  >
                    <div className="row g-0">
                      <div className="col-md-6 p-4 border-end">
                        <h6 className="fw-bold text-primary mb-4 text-center pb-2 border-bottom">
                          💰 Financial Details
                        </h6>

                        <div className="metric-card mb-3 p-3 bg-light rounded-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted small">
                              Total Tax Value{" "}
                            </span>
                            <span className="fw-bold text-danger">
                              ₹
                              {(
                                selectedItem.totalTaxValue || 0
                              ).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                        <div className="metric-card mb-3 p-3 bg-light rounded-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted small">
                              Total Net Value{" "}
                            </span>
                            <span className="fw-bold text-info">
                              ₹
                              {(
                                selectedItem.totalItemValue || 0
                              ).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6 p-4">
                        <div className="table-responsive">
                          <table className="table table-borderless table-sm">
                            <tbody>
                              <tr>
                                <th className="text-muted small w-50">
                                  Item Name
                                </th>
                                <td className="fw-semibold">
                                  {selectedItem.itemName || "N/A"}
                                </td>
                              </tr>
                              <tr>
                                <th className="text-muted small w-50">
                                  Grade
                                </th>
                                <td className="fw-semibold">
                                  {selectedItem.grade || "N/A"}
                                </td>
                              </tr>
                              <tr>
                                <th className="text-muted small w-50">
                                  Item Code
                                </th>
                                <td className="fw-semibold">
                                  {selectedItem.itemCode || "N/A"}
                                </td>
                              </tr>
                              <tr>
                                <th className="text-muted small">
                                  Received Qty
                                </th>
                                <td className="text-secondary">
                                  {selectedItem.receivedQty || 0}
                                </td>
                              </tr>
                              <tr className="border-top border-bottom border-2">
                                <th className="text-muted small py-2">
                                  ✅ Approved Qty
                                </th>
                                <td className="text-success fw-bold fs-6 py-2">
                                  {selectedItem.approvedQty || 0}
                                </td>
                              </tr>
                              <tr>
                                <th className="text-muted small">
                                  ❌ Damaged Qty
                                </th>
                                <td className="text-danger">
                                  {selectedItem.damagedQty || 0}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="mt-4 pt-3 border-top">
                          <h6 className="fw-bold text-warning mb-3">
                            Tax Breakdown
                          </h6>
                          <div className="row g-2 text-center">
                            <div className="col-4">
                              <small className="text-muted">CGST</small>
                              <div className="fw-semibold text-success">
                                {(selectedItem.cgst || 0).toFixed(2)}%
                              </div>
                            </div>
                            <div className="col-4">
                              <small className="text-muted">SGST</small>
                              <div className="fw-semibold text-success">
                                {(selectedItem.sgst || 0).toFixed(2)}%
                              </div>
                            </div>
                            <div className="col-4">
                              <small className="text-muted">IGST</small>
                              <div className="fw-semibold text-success">
                                {(selectedItem.igst || 0).toFixed(2)}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className="p-4 bg-gradient border-top"
                      style={{
                        background:
                          "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="text-muted small">
                          Total Value:{" "}
                          <strong>
                            ₹
                            {(
                              selectedItem.billItemValue || 0
                            ).toLocaleString("en-IN")}
                          </strong>
                        </div>

                        <span
                          className={`badge fs-5 px-4 py-3 fw-bold ${selectedItem.billApprove
                            ? "bg-success shadow-lg"
                            : "bg-warning shadow-lg border"
                            }`}
                        >
                          {selectedItem.billApprove
                            ? "✅ APPROVED"
                            : "⏳ PENDING APPROVAL"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ApprovedPayable;