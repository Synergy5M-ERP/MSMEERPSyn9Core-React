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
  const [selectedBuyer, setSelectedBuyer] = useState(""); // keep ID
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
      setLoading(true);
      const res = await fetch(API_ENDPOINTS.Getbuyers);
      const data = await safeJson(res);
      const buyers = (data.data || []).map(b => ({
            buyerId: b.buyerId,
            buyerName: b.buyerName
      }));
      setBuyers(buyers);
    } catch (error) {
      toast.error(error.message || "Failed to load Buyers");
    }
  }, []);

const loadAllinvoicesWithDetails = useCallback(async (buyerId) => {
  try {
    setLoading(true);

    const res = await fetch(`${API_ENDPOINTS.CheckedSaleDetails}?buyerId=${buyerId}`);
    if (!res.ok) throw new Error("Failed to load invoices");
    const data = await safeJson(res);

    console.log("invoice List API Response (first item):", data.data?.checkSale);

    const invoicesList = data.data?.checkSale
      ? [{
          invoiceNumber: data.data.checkSale.invoiceNo || "N/A",
          invoiceId: data.data.checkSale.accountSaleId || 0,
          invoiceDate: data.data.checkSale.invoiceDate
            ? new Date(data.data.checkSale.invoiceDate).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          poNumber: data.data.checkSale.poNumber || "N/A",
          poDate: data.data.checkSale.poDate || "N/A",
          grandTotal: 0, // will compute after items
          approvedGrandTotal: 0,
          items: [],
        }]
      : [];

    const invoicesWithDetails = await Promise.all(
      invoicesList.map(async (invoice) => {
        try {
          // Backend already sends items in CheckedSaleDetails response
          const itemsData = data.data.items || [];

          const items = itemsData.map((item, idx) => ({
            id: `${invoice.invoiceNumber}-${item.itemName}-${idx}`,
            itemName: item.itemName || "",
            itemCode: item.itemCode || "",
            approvedQty: item.approvedQty || 0,
            damagedQty: item.rejectedQty || 0,
            cgst: item.cgst || 0,
            sgst: item.sgst || 0,
            igst: item.igst || 0,
            totalTaxValue: parseFloat(item.totalTax) || 0,
            totalItemValue: parseFloat(item.totalAmount) || 0,
            billItemValue: parseFloat(item.grandAmount) || 0,
            billCheck: false,
            approvedSale: false,
            rate: parseFloat(item.ratePerUnit) || 0,
          }));
          
          const grandTotal = items.reduce((sum, i) => sum + i.totalItemValue, 0);
          const approvedGrandTotal = items
            .filter(i => i.approvedSale)
            .reduce((sum, i) => sum + (parseFloat(i.billItemValue) || 0), 0);

          return {
            ...invoice,
            items,
            grandTotal,
            approvedGrandTotal,
          };
        } catch (err) {
          console.error(`Failed to process details for ${invoice.invoiceNumber}:`, err);
          return invoice;
        }
      })
    );

    setinvoicesData(invoicesWithDetails);

    const totalItems = invoicesWithDetails.reduce(
      (sum, invoice) => sum + (invoice.items?.length || 0),
      0
    );

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
    const BuyerId = Number(e.target.value);
    const selected = Buyers.find(s => s.BuyerId  === Number(BuyerId));
    //setSelectedBuyer(selected?.name || "");
    setSelectedBuyer(BuyerId)
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

  const handleapprovedSaleToggle = useCallback((invoiceNumber, itemIndex) => {
    setinvoicesData(prev => {
      return prev.map(invoice => {
        if (invoice.invoiceNumber === invoiceNumber && invoice.items && invoice.items[itemIndex]) {
          const newItems = [...invoice.items];
          newItems[itemIndex] = {
            ...newItems[itemIndex],
            approvedSale: !newItems[itemIndex].approvedSale,
          };
          const approvedItems = newItems.filter(item => item.approvedSale);
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
    return invoicesData.reduce((sum, invoice) => sum + ((invoice.items || []).filter(i => i?.approvedSale).length || 0), 0);
  };

const handleSaveApproved = async () => {
  const TOAST_ID = "save-approved";
  toast.loading("Approving items...", { toastId: TOAST_ID });
  setSaveLoading(true);

  try {
    for (const invoice of invoicesData) {
      // Get only approved items and convert IDs to numbers
      const itemIds = invoice.items
        .filter(item => item.approvedSale)
        .map(item => Number(item.accountSaleDetailedId))
        .filter(id => !isNaN(id)); // remove invalid numbers

      if (itemIds.length === 0) continue; // skip if nothing approved

      const url = `${API_ENDPOINTS.ApprovedAccountSale}?accountSaleId=${Number(invoice.accountSaleId)}`;

      console.log("Approving invoice:", invoice.accountSaleId, "ItemIds:", itemIds);

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ItemIds: itemIds })
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Approval failed for invoice", invoice.accountSaleId, errorText);
        throw new Error(`Approval failed for invoice ${invoice.accountSaleId}`);
      }
    }

    toast.update(TOAST_ID, {
      render: "✅ Approved Successfully!",
      type: "success",
      isLoading: false,
      autoClose: 3000
    });

    // Reload invoices after approval
    await loadAllinvoicesWithDetails(selectedBuyer);
  } catch (error) {
    console.error(error);
    toast.update(TOAST_ID, {
      render: `❌ Approval failed: ${error.message}`,
      type: "error",
      isLoading: false,
      autoClose: 4000
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
              <select className="form-select form-select-lg"
                value={selectedBuyer}
                onChange={handleBuyerChange}>
                <option value="">Choose Buyer...</option>
                {Buyers.map(s => (
                  <option key={s.buyerId} value={s.buyerId}>{s.buyerName}</option>
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
                          <strong className="mb-2">Invoice No: {invoice.invoiceNumber}</strong>
                          <div className="row g-2 small">
                            <div className="col-6">
                              <Calendar size={14} className="me-1" />
                              <strong>Invoice Date:</strong> {invoice.invoiceDate}
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
                                <tr key={`${invoice.invoiceNumber}-${item.id || itemIndex}`} className={item.approvedSale ? 'table-success' : ''}>
                                  <td className="fw-semibold">{item.itemName}</td>
                                  <td>₹{(item.totalTaxValue || 0).toLocaleString('en-IN')}</td>
                                  <td>₹{(item.totalItemValue || 0).toLocaleString('en-IN')}</td>
                                  <td className="fw-bold">₹{(item.billItemValue || 0).toLocaleString('en-IN')}</td>
                                  <td>
                                    <div className="form-check form-switch">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={item.approvedSale || false}
                                        onChange={() => handleapprovedSaleToggle(invoice.invoiceNumber, itemIndex)}
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
                        <span className={`badge fs-6 ${selectedItem.approvedSale ? 'bg-success' : 'bg-warning'}`}>
                          {selectedItem.approvedSale ? '✅ Approved' : '⏳ Pending'}
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
