import React, { useState, useEffect, useCallback } from "react";
import { Loader2, Eye, Calendar, FileText, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_ENDPOINTS } from "../../config/apiconfig";
import Swal from "sweetalert2";

const Approvedinvoice = () => {
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [Buyers, setBuyers] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState("");
  const [invoicesData, setinvoicesData] = useState([]);
  const [showItemModal, setShowItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const invoiceS_PER_PAGE = 2;

  const safeJson = async (res) => {
    try {
      return await res.json();
    } catch {
      return {};
    }
  };

  const loadBuyers = useCallback(async () => {
    try {
      const res = await fetch(API_ENDPOINTS.GetBuyers);
      if (!res.ok) throw new Error("Failed to load Buyers");
      const data = await safeJson(res);
      
      const BuyersWithIds = (data.data || []).map((name, index) => ({
        id: index + 1,
        name: name || `Supplier ${index + 1}`,
      }));
      setBuyers(BuyersWithIds);
    } catch (error) {
      toast.error(error.message || "Failed to load Buyers");
      setBuyers([
        { id: 1, name: "Vendor A" },
        { id: 2, name: "Vendor B" },
      ]);
    }
  }, []);

  const loadAllinvoicesWithDetails = useCallback(async (BuyerName) => {
    try {
      setLoading(true);
      
      const res = await fetch(`${API_ENDPOINTS.GetinvoiceNumbersByBuyer}?BuyerName=${encodeURIComponent(BuyerName)}`);
      if (!res.ok) throw new Error("Failed to load invoices");
      const data = await safeJson(res);
      
      console.log("invoice List API Response (first item):", data.data?.[0]);
      
      const invoicesList = (data.data || []).map((invoice, index) => ({
        invoiceNumber: invoice.number || invoice.invoiceNumber || invoice.invoice_NO,
        invoiceId: invoice.id || invoice.invoice_ID || invoice.invoiceId || index,
        invoiceDate: invoice.invoiceDate || invoice.date || new Date().toISOString().split('T')[0],
        invoiceNumber: invoice.invoiceNumber || invoice.invoice_NO || 'N/A',
        poNumber: invoice.poNumber || 'N/A',
        poDate: invoice.poDate || 'N/A',
        grandTotal: invoice.grandTotal || 0,
        approvedGrandTotal: 0,
        items: [],
        index: index
      }));

      const invoicesWithDetails = await Promise.all(
        invoicesList.map(async (invoice) => {
          try {
            const detailRes = await fetch(`${API_ENDPOINTS.GetinvoiceDetails}?invoiceId=${invoice.invoiceId}`);
            if (!detailRes.ok) return invoice;
            
            const detailData = await safeJson(detailRes);
            
            if (detailData.success && detailData.data?.items) {
              return {
                ...invoice,
                items: detailData.data.items.map((item, idx) => ({
                  id: `${invoice.invoiceNumber}-${item.itemName}-${idx}`,
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
            return invoice;
          } catch (err) {
            console.error(`Failed to load details for ${invoice.invoiceNumber}:`, err);
            return invoice;
          }
        })
      );

      setinvoicesData(invoicesWithDetails);
      const totalItems = invoicesWithDetails.reduce((sum, invoice) => sum + (invoice.items?.length || 0), 0);
      toast.success(`Loaded ${invoicesWithDetails.length} invoices with ${totalItems} total items`);
    } catch (error) {
      console.error("loadAllinvoicesWithDetails error:", error);
      toast.error(error.message || "Failed to load invoices");
      setinvoicesData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBuyers();
  }, [loadBuyers]);

  useEffect(() => {
    if (selectedBuyer) {
      loadAllinvoicesWithDetails(selectedBuyer);
      setCurrentPage(1);
    } else {
      setinvoicesData([]);
      setCurrentPage(1);
    }
  }, [selectedBuyer, loadAllinvoicesWithDetails]);

  const handleBuyerChange = (e) => {
    const BuyerId = e.target.value;
    const selected = Buyers.find(s => s.id === Number(BuyerId));
    setSelectedBuyer(selected?.name || "");
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
        setSelectedBuyer("");
        setinvoicesData([]);
        setShowItemModal(false);
        setSelectedItem(null);
        toast.info("Form reset successfully");
      }
    });
  };

  const totalPages = Math.ceil(invoicesData.length / invoiceS_PER_PAGE);
  const pagedinvoices = invoicesData.slice(
    (currentPage - 1) * invoiceS_PER_PAGE,
    currentPage * invoiceS_PER_PAGE
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

  const handleBillApproveToggle = useCallback((invoiceNumber, itemIndex) => {
    setinvoicesData(prev => {
      return prev.map(invoice => {
        if (invoice.invoiceNumber === invoiceNumber && invoice.items && invoice.items[itemIndex]) {
          const newItems = [...invoice.items];
          newItems[itemIndex] = {
            ...newItems[itemIndex],
            billApprove: !newItems[itemIndex].billApprove,
          };
          const approvedItems = newItems.filter(item => item.billApprove);
          return {
            ...invoice,
            items: newItems,
            approvedGrandTotal: approvedItems.reduce((sum, item) => sum + (parseFloat(item.billItemValue) || 0), 0),
          };
        }
        return invoice;
      });
    });
  }, []);

  const getApprovedCount = () => {
    return invoicesData.reduce((sum, invoice) => sum + ((invoice.items || []).filter(i => i?.billApprove).length || 0), 0);
  };

  const handleSaveApproved = async () => {
    const TOAST_ID = "save-approved";
    toast.loading("Saving approved invoices...", { toastId: TOAST_ID });
    setSaveLoading(true);

    try {
      const payload = {
        BuyerName: selectedBuyer,
        invoices: invoicesData
          .filter(invoice => invoice.items.some(item => item.billApprove))
          .map(invoice => ({
            invoiceNumber: invoice.invoiceNumber,
            invoiceDate: invoice.invoiceDate,
            invoiceNumber: invoice.invoiceNumber,
            poNumber: invoice.poNumber,
            poDate: invoice.poDate,
            totalAmount: invoice.totalAmount || 0,
            totalTaxAmount: invoice.totalTaxAmount || 0,
            grandTotal: invoice.grandTotal || 0,
            approvedTotalAmount: 0,
            approvedTotalTaxAmount: 0,
            approvedGrandTotal: invoice.approvedGrandTotal || 0,
            Items: invoice.items
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

      const res = await fetch(API_ENDPOINTS.Saveinvoice, {
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

      await loadAllinvoicesWithDetails(selectedBuyer);
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
    <div className="approved-invoice-app">
      <ToastContainer position="top-right" theme="colored" />
      
      <div className="container-fluid">
        {/* Buyer Selection */}
        <div className="Buyer-section mb-4">
          <div className="row align-items-end">
            <div className="col-md-6">
              <label className="form-label fw-semibold mb-2">Select Buyer</label>
              <select 
                className="form-select form-select-lg"
                value={Buyers.find(s => s.name === selectedBuyer)?.id || ""}
                onChange={handleBuyerChange}
              >
                <option value="">Choose Buyer...</option>
                {Buyers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            
            {selectedBuyer && invoicesData.length > 0 && (
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
            <h4>Loading all invoices and their details...</h4>
            <p className="text-muted">This may take a moment</p>
          </div>
        ) : !invoicesData.length ? (
          <div className="empty-state text-center py-5">
            <Package className="empty-icon mb-3" size={64} />
            <h4>No invoices Found</h4>
            <p className="text-muted">Select a Buyer to view their invoices</p>
          </div>
        ) : (
          <>
            {/* 2-COLUMN invoice GRID */}
            <div className="row g-3 mb-4">
              {pagedinvoices.map((invoice, index) => (
                <div key={invoice.invoiceNumber || index} className="col-md-6">
                  <div className="invoice-card h-100 border rounded shadow-sm">
                    {/* invoice Header */}
                    <div className="invoice-header p-4 bg-primary text-white rounded-top">
                      <div className="row">
                        <div className="col-md-6">
                          <strong className="mb-2">invoice: {invoice.invoiceNumber}</strong>
                          <div className="row g-2 small">
                            <div className="col-6">
                              <Calendar size={14} className="me-1" />
                              <strong>invoice Date:</strong> {invoice.invoiceDate}
                            </div>
                            <div className="col-6">
                              <FileText size={14} className="me-1" />
                              <strong>Invoice No:</strong> {invoice.invoiceNumber}
                            </div>
                            <div className="col-6">
                              <strong>PO No:</strong> {invoice.poNumber}
                            </div>
                            <div className="col-6">
                              <strong>PO Date:</strong> {invoice.poDate}
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
                            {(invoice.items || []).length === 0 ? (
                              <tr>
                                <td colSpan="6" className="text-center text-muted py-3">
                                  No items found
                                </td>
                              </tr>
                            ) : (
                              (invoice.items || []).map((item, itemIndex) => (
                                <tr key={`${invoice.invoiceNumber}-${item.id || itemIndex}`} className={item.billApprove ? 'table-success' : ''}>
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
                                        onChange={() => handleBillApproveToggle(invoice.invoiceNumber, itemIndex)}
                                        id={`approve-${invoice.invoiceNumber}-${item.id}`}
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
                    {invoice.approvedGrandTotal > 0 && (
                      <div className="invoice-footer p-3 bg-light border-top">
                        <div className="text-center">
                          <small className="text-muted">Approved Total</small>
                          <div className="fw-bold text-success fs-5">
                            ₹{(invoice.approvedGrandTotal || 0).toLocaleString('en-IN')}
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
                  ({invoicesData.length} invoices total)
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

export default Approvedinvoice;
