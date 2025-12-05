import React, { useState, useEffect, useCallback } from "react";
import { Loader2, Eye, Calendar, FileText, Package, ChevronLeft, ChevronRight } from "lucide-react";
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

  const loadSellers = useCallback(async () => {
    try {
      const res = await fetch(API_ENDPOINTS.GetSellers);
      if (!res.ok) throw new Error("Failed to load sellers");
      const data = await safeJson(res);
      
      const suppliersWithIds = (data.data || []).map((name, index) => ({
        id: index + 1,
        name: name || `Supplier ${index + 1}`,
      }));
      setSuppliers(suppliersWithIds);
    } catch (error) {
      toast.error(error.message || "Failed to load sellers");
      setSuppliers([
        { id: 1, name: "Vendor A" },
        { id: 2, name: "Vendor B" },
      ]);
    }
  }, []);

  const loadAllGrnsWithDetails = useCallback(async (sellerName) => {
    try {
      setLoading(true);
      
      const res = await fetch(`${API_ENDPOINTS.GetGRNNumbersBySeller}?sellerName=${encodeURIComponent(sellerName)}`);
      if (!res.ok) throw new Error("Failed to load GRNs");
      const data = await safeJson(res);
      
      console.log("GRN List API Response (first item):", data.data?.[0]);
      
      const grnsList = (data.data || []).map((grn, index) => ({
        grnNumber: grn.number || grn.grnNumber || grn.GRN_NO,
        grnId: grn.id || grn.GRN_ID || grn.grnId || index,
        grnDate: grn.grnDate || grn.date || new Date().toISOString().split('T')[0],
        invoiceNumber: grn.invoiceNumber || grn.invoice_NO || 'N/A',
        poNumber: grn.poNumber || 'N/A',
        poDate: grn.poDate || 'N/A',
        grandTotal: grn.grandTotal || 0,
        approvedGrandTotal: 0,
        items: [],
        index: index
      }));

      const grnsWithDetails = await Promise.all(
        grnsList.map(async (grn) => {
          try {
            const detailRes = await fetch(`${API_ENDPOINTS.GetGRNDetails}?grnId=${grn.grnId}`);
            if (!detailRes.ok) return grn;
            
            const detailData = await safeJson(detailRes);
            
            if (detailData.success && detailData.data?.items) {
              return {
                ...grn,
                items: detailData.data.items.map((item, idx) => ({
                  id: `${grn.grnNumber}-${item.itemName}-${idx}`,
                  itemName: item.itemName || "",
                  TotalTaxValue: item.TotalTaxValue || "",
                  itemCode: item.itemCode || "",
                  receivedQty: item.receivedQty || 0,
                  approvedQty: item.acceptedQty || 0,
                  damagedQty: item.rejectedQty || 0,
                  cgst: item.taxType === "CGST" ? (item.taxRate || 0) : 0,
                  sgst: item.taxType === "SGST" ? (item.taxRate || 0) : 0,
                  igst: item.taxType === "IGST" ? (item.taxRate || 0) : 0,
                  totalTaxValue: parseFloat(item.totalTaxValue) || 0,
                  totalItemValue: parseFloat(item.totalItemValue) || 0,
                  billItemValue: parseFloat(item.billItemValue) || 0,
                  billCheck: item.billCheck || false,
                  billApprove: item.billApprove || false,
                  taxType: item.taxType || "",
                  rate: parseFloat(item.rate) || 0,
                }))
              };
            }
            return grn;
          } catch (err) {
            console.error(`Failed to load details for ${grn.grnNumber}:`, err);
            return grn;
          }
        })
      );

      setGrnsData(grnsWithDetails);
      const totalItems = grnsWithDetails.reduce((sum, grn) => sum + (grn.items?.length || 0), 0);
      toast.success(`Loaded ${grnsWithDetails.length} GRNs with ${totalItems} total items`);
    } catch (error) {
      console.error("loadAllGrnsWithDetails error:", error);
      toast.error(error.message || "Failed to load GRNs");
      setGrnsData([]);
    } finally {
      setLoading(false);
    }
  }, []);

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

  const handleSellerChange = (e) => {
    const sellerId = e.target.value;
    const selected = suppliers.find(s => s.id === Number(sellerId));
    setSelectedSeller(selected?.name || "");
  };

  const handleCancel = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "All unsaved data will be lost!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reset",
      cancelButtonText: "No, keep editing"
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
    setCurrentPage(page => Math.max(1, page - 1));
  };

  const goToNextPage = () => {
    setCurrentPage(page => Math.min(totalPages, page + 1));
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowItemModal(true);
  };

  const handleBillApproveToggle = useCallback((grnNumber, itemIndex) => {
    setGrnsData(prev => {
      return prev.map(grn => {
        if (grn.grnNumber === grnNumber && grn.items && grn.items[itemIndex]) {
          const newItems = [...grn.items];
          newItems[itemIndex] = {
            ...newItems[itemIndex],
            billApprove: !newItems[itemIndex].billApprove,
          };
          const approvedItems = newItems.filter(item => item.billApprove);
          return {
            ...grn,
            items: newItems,
            approvedGrandTotal: approvedItems.reduce((sum, item) => sum + (parseFloat(item.billItemValue) || 0), 0),
          };
        }
        return grn;
      });
    });
  }, []);

  const getApprovedCount = () => {
    return grnsData.reduce((sum, grn) => sum + ((grn.items || []).filter(i => i?.billApprove).length || 0), 0);
  };

  const handleSaveApproved = async () => {
    const TOAST_ID = "save-approved";
    toast.loading("Saving approved payables...", { toastId: TOAST_ID });
    setSaveLoading(true);

    try {
      const payload = {
        SellerName: selectedSeller,
        Grns: grnsData
          .filter(grn => grn.items.some(item => item.billApprove))
          .map(grn => ({
            grnNumber: grn.grnNumber,
            grnDate: grn.grnDate,
            invoiceNumber: grn.invoiceNumber,
            poNumber: grn.poNumber,
            poDate: grn.poDate,
            totalAmount: grn.totalAmount || 0,
            totalTaxAmount: grn.totalTaxAmount || 0,
            grandTotal: grn.grandTotal || 0,
            approvedTotalAmount: 0,
            approvedTotalTaxAmount: 0,
            approvedGrandTotal: grn.approvedGrandTotal || 0,
            Items: grn.items
              .filter(item => item.billApprove)
              .map(item => ({
                Description: `${item.itemName} - ${item.TotalTaxValue}`,
                itemName: item.itemName,
                TotalTaxValue: item.TotalTaxValue,
                itemCode: item.itemCode,
                totalTaxValue: parseFloat(item.totalTaxValue) || 0,
                totalItemValue: parseFloat(item.totalItemValue) || 0,
                billItemValue: parseFloat(item.billItemValue) || 0,
                billCheck: item.billCheck || false,
                billApprove: true,
                TransporterName: item.TransporterName || ""
              })),
          })),
      };

      const res = await fetch(API_ENDPOINTS.SaveGRN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await safeJson(res);
      if (!res.ok) {
        toast.update(TOAST_ID, {
          render: `Error: ${result.message || 'Save failed'}`,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        return;
      }

      toast.update(TOAST_ID, {
        render: `✅ Saved ${getApprovedCount()} approved items!`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      await loadAllGrnsWithDetails(selectedSeller);
    } catch (error) {
      toast.update(TOAST_ID, {
        render: "Network error! Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="approved-payable-app">
      <ToastContainer position="top-right" theme="colored" />
      
      <div className="container-fluid">
        {/* Seller Selection */}
        <div className="seller-section mb-4">
          <div className="row align-items-end">
            <div className="col-md-6">
              <label className="form-label fw-semibold mb-2">Select Seller</label>
              <select 
                className="form-select form-select-lg"
                value={suppliers.find(s => s.name === selectedSeller)?.id || ""}
                onChange={handleSellerChange}
              >
                <option value="">Choose Seller...</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            
            {selectedSeller && grnsData.length > 0 && (
              <div className="col-md-6 text-end">
                <button
                  className="btn btn-success btn-lg me-2"
                  onClick={handleSaveApproved}
                  disabled={saveLoading || getApprovedCount() === 0}
                >
                  {saveLoading ? (
                    <>
                      <Loader2 className="me-2 animate-spin" size={20} />
                      Saving...
                    </>
                  ) : (
                    <>Save</>
                  )}
                </button>
                <button
                  className="btn btn-secondary btn-lg"
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
                      <div className="row">
                        <div className="col-md-6">
                          <strong className="mb-2">GRN: {grn.grnNumber}</strong>
                          <div className="row g-2 small">
                            <div className="col-6">
                              <Calendar size={14} className="me-1" />
                              <strong>GRN Date:</strong> {grn.grnDate}
                            </div>
                            <div className="col-6">
                              <FileText size={14} className="me-1" />
                              <strong>Invoice No:</strong> {grn.invoiceNumber}
                            </div>
                            <div className="col-6">
                              <strong>PO No:</strong> {grn.poNumber}
                            </div>
                            <div className="col-6">
                              <strong>PO Date:</strong> {grn.poDate}
                            </div>
                          </div>
                        </div>
                  
                      </div>
                    </div>

                    {/* Items Table */}
                    <div className="p-3" style={{ maxHeight: "400px", overflowY: "auto" }}>
                      <div className="table-responsive">
                        <table className="table table-sm table-hover mb-0">
                          <thead className="table-light sticky-top">
                            <tr>
                              <th style={{ width: "30%" }}>Item Name</th>
                              <th style={{ width: "15%" }}>Total Tax Value</th>
                              <th style={{ width: "15%" }}>Total Amount</th>
                              <th style={{ width: "15%" }}>Grand Total</th>
                              <th style={{ width: "12%" }}>Bill Approve</th>
                              <th style={{ width: "8%" }}>View</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(grn.items || []).length === 0 ? (
                              <tr>
                                <td colSpan="6" className="text-center text-muted py-3">
                                  No items found
                                </td>
                              </tr>
                            ) : (
                              (grn.items || []).map((item, itemIndex) => (
                                <tr key={`${grn.grnNumber}-${item.id || itemIndex}`} className={item.billApprove ? 'table-success' : ''}>
                                  <td className="fw-semibold">{item.itemName}</td>
                                  <td>₹{(item.totalTaxValue || 0).toLocaleString('en-IN')}</td>
                                  <td>₹{(item.totalItemValue || 0).toLocaleString('en-IN')}</td>
                                  <td className="fw-bold">₹{(item.billItemValue || 0).toLocaleString('en-IN')}</td>
                                  <td>
                                    <div className="form-check form-switch">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={item.billApprove || false}
                                        onChange={() => handleBillApproveToggle(grn.grnNumber, itemIndex)}
                                        id={`approve-${grn.grnNumber}-${item.id}`}
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <button
                                      className="btn btn-sm btn-outline-primary p-1"
                                      onClick={() => handleViewDetails(item)}
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
                          <small className="text-muted">Approved Total</small>
                          <div className="fw-bold text-success fs-5">
                            ₹{(grn.approvedGrandTotal || 0).toLocaleString('en-IN')}
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
                  Page <span className="badge bg-primary">{currentPage}</span> 
                  of <span className="badge bg-primary">{totalPages}</span> 
                  ({grnsData.length} GRNs total)
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

        {/* Item Detail Modal */}
        {showItemModal && selectedItem && (
          <div className="position-fixed top-0 end-0 bottom-0 start-0 bg-dark bg-opacity-50 d-flex justify-content-end" style={{ zIndex: 1050 }} onClick={() => setShowItemModal(false)}>
            <div className="bg-white shadow-lg h-100 overflow-auto" style={{ width: "500px", maxWidth: "90vw" }} onClick={e => e.stopPropagation()}>
              <div className="modal-header border-bottom sticky-top bg-white">
                <div className="d-flex align-items-center">
                  <Eye className="me-2" size={20} />
                  <span className="fw-bold">Item Details</span>
                </div>
                <button className="btn-close" onClick={() => setShowItemModal(false)} />
              </div>
              
              <div className="modal-body p-4">
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <th className="bg-light" style={{ width: "40%" }}>Item Name</th>
                      <td className="fw-semibold">{selectedItem.itemName || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th className="bg-light">Total Tax Value</th>
                      <td>{selectedItem.TotalTaxValue || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th className="bg-light">Item Code</th>
                      <td>{selectedItem.itemCode || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th className="bg-light">Received Qty</th>
                      <td>{selectedItem.receivedQty || 0}</td>
                    </tr>
                    <tr>
                      <th className="bg-light">Approved Qty</th>
                      <td className="text-success fw-bold">{selectedItem.approvedQty || 0}</td>
                    </tr>
                    <tr>
                      <th className="bg-light">Damaged Qty</th>
                      <td className="text-danger">{selectedItem.damagedQty || 0}</td>
                    </tr>
                    <tr>
                      <th className="bg-light">CGST</th>
                      <td>{(selectedItem.cgst || 0).toFixed(2)}%</td>
                    </tr>
                    <tr>
                      <th className="bg-light">SGST</th>
                      <td>{(selectedItem.sgst || 0).toFixed(2)}%</td>
                    </tr>
                    <tr>
                      <th className="bg-light">IGST</th>
                      <td>{(selectedItem.igst || 0).toFixed(2)}%</td>
                    </tr>
                    <tr>
                      <th className="bg-light">Tax Type</th>
                      <td><span className="badge bg-info">{selectedItem.taxType || 'N/A'}</span></td>
                    </tr>
                    <tr>
                      <th className="bg-light">Total Tax</th>
                      <td className="fw-bold text-success">₹{(selectedItem.totalTaxValue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                    <tr>
                      <th className="bg-light">Item Value</th>
                      <td className="fw-bold text-primary">₹{(selectedItem.totalItemValue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                    <tr className="table-success">
                      <th className="bg-success text-white">Grand Total</th>
                      <td className="fw-bold fs-5 text-success">₹{(selectedItem.billItemValue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                    <tr>
                      <th className="bg-light">Approval Status</th>
                      <td>
                        <span className={`badge fs-6 ${selectedItem.billApprove ? 'bg-success' : 'bg-warning'}`}>
                          {selectedItem.billApprove ? '✅ Approved' : '⏳ Pending'}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovedPayable;
