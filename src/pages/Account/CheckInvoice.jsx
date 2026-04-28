
import React, { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_ENDPOINTS } from "../../config/apiconfig";
import Pagination from '../../components/Pagination';

const CheckInvoice = () => {
  const [selectedinvoice, setSelectedinvoice] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [invoiceNumbers, setinvoiceNumbers] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [enteredinvoiceNumber, setEnteredinvoiceNumber] = useState("");
  const [checkInvoice, setCheckInvoice] = useState(false);
  const [CheckInvoices, setCheckInvoices] = useState([]);
  const [allInvoices, setAllInvoices] = useState([]);

  const [currentPage,setCurrentPage]=useState(1);
  const recordsPerPage=3;
  const indexOfLast=currentPage*recordsPerPage;
  const indexOfFirst=indexOfLast-recordsPerPage
  const currentRecords=CheckInvoices.slice(indexOfFirst,indexOfLast)

  const [formData, setFormData] = useState({
    buyerId: "",
    buyerName: "",
    poNumber: "",
    poDate: "",
    invoiceNumber: "",
    invoiceDate: "",
    taxtype: "",
    paymentDueDate: "",
    status: "",
    totalAmount: 0,
    taxAmount: 0,
    grandTotal: 0,
    checkedTotalAmount: 0,
  });

  // ✅ SAFE JSON PARSER
  const safeJson = async (res) => {
    try {
      return await res.json();
    } catch {
      return {};
    }
  };

useEffect(() => {
 // fetchInvoiceData();
  fetchAllBuyers();
  }, []);

  const fetchAllBuyers = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_ENDPOINTS.Getbuyers);
      const data = await safeJson(res);
      const buyers = (data.data || []).map(b => ({
          buyerId: b.buyerId,
          buyerName: b.buyerName,
          buyerCode: b.buyerCode
        }));
      setSuppliers(buyers);
    } catch (err) {
      toast.error("Failed to load dropdowns");
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoiceData = async (buyerCode) => {
  try {
    setLoading(true);

    //const res = await fetch(API_ENDPOINTS.GetBuyersInvoiceDetails);
    const res = await fetch(`${API_ENDPOINTS.GetBuyersInvoiceDetails}?buyerCode=${buyerCode}`)
    const data = await safeJson(res); 
    
    if (data.success) {
        const enrichedData = data.data
            //.filter(row => !(row.checkSale === true && row.approveSale === true)) // ❌ remove fully approved
            .map(row => ({
              ...row,
              billCheck: row.checkSale === true,
              approvedInvoice: row.approveSale === true
            }));

      setAllInvoices(enrichedData);   // ✅ store all
      setTableData(enrichedData);     // optional (initial load)
    } else {
      toast.error("Failed to load invoices");
    }
  } catch (error) {
    toast.error("Server error");
  } finally {
    setLoading(false);
  }
};

const handleCheckboxChange = (index, field) => {
  const updatedData = [...tableData];

  // Toggle selected field
  updatedData[index][field] = !updatedData[index][field];

  // If unchecking billCheck → also uncheck approved
  if (field === "billCheck" && !updatedData[index][field]) {
    updatedData[index].approvedInvoice = false;
  }

  setTableData(updatedData);

   // ✅ Calculate total of checked invoices
  const total = updatedData
    .filter(row => row.billCheck === true)
    .reduce((sum, row) => sum + (row.finalAmount || 0), 0);

  // ✅ Update textbox
  setFormData(prev => ({
    ...prev,
    checkedTotalAmount: total.toFixed(2)
  }));
};

const handleSave = async () => {
  try {
    const selectedInvoices = tableData.filter(
      (row) => row.billCheck === true
    );

    const approvedInvoices = tableData.filter(
      (row) => row.approvedInvoice === true && row.checkSale === true
    );

    if (selectedInvoices.length === 0 && approvedInvoices.length === 0) {
      toast.warning("Please select at least one invoice");
      return;
    }

    setSaveLoading(true);

    let actionType = ""; // ✅ track action

    // =========================
    // ✅ 1. APPROVE SALE
    // =========================
    if (approvedInvoices.length > 0) {
      const approvePayload = approvedInvoices.map((row) => ({
        BuyerId: row.buyerId,
        InvoiceNo: row.invoiceNumber,
        UpdatedBy: 1
      }));

      const resApprove = await fetch(API_ENDPOINTS.ApprovedAccountSale, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(approvePayload),
      });

      const approveData = await safeJson(resApprove);

      if (!resApprove.ok || !approveData.success) {
        toast.error(approveData.message || "Failed to approve invoices");
        return;
      }

      actionType = "APPROVED"; // ✅ mark action
    }

    // =========================
    // ✅ 2. CHECK SALE
    // =========================
    else if (selectedInvoices.length > 0) {
      const payload = selectedInvoices.map((row) => {
        let cgstAmount = 0;
        let sgstAmount = 0;
        let igstAmount = 0;

        if (row.taxType === "CGST_SGST") {
          cgstAmount = row.totalTaxAmount / 2;
          sgstAmount = row.totalTaxAmount / 2;
        } else if (row.taxType === "IGST") {
          igstAmount = row.totalTaxAmount;
        }

        return {
          BuyerId: row.buyerId,
          InvoiceNo: row.invoiceNumber,
          PoNumber: row.poNo,
          TotalAmount: row.finalAmount,
          CGSTAmount: cgstAmount,
          SGSTAmount: sgstAmount,
          IGSTAmount: igstAmount,
          CreatedBy: 1
        };
      });

      const res = await fetch(API_ENDPOINTS.AccountSale, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await safeJson(res);

      if (!res.ok || !data.success) {
        toast.error(data.message || "Failed to save invoices");
        return;
      }

      actionType = "CHECKED"; // ✅ mark action
    }

    // =========================
    // ✅ SUCCESS MESSAGE
    // =========================
    if (actionType === "APPROVED") {
      toast.success("Invoices Approved Successfully ✅");
    } else if (actionType === "CHECKED") {
      toast.success("Invoices Checked Successfully ✅");
    }

    await fetchInvoiceData(formData.buyerCode);

  } catch (error) {
    toast.error("Server error while saving");
  } finally {
    setSaveLoading(false);
  }
};

//   const handleSave = async () => {
//   try {
//     // ✅ EXISTING: checked invoices
//     const selectedInvoices = tableData.filter(
//       (row) => row.billCheck === true
//     );

//     // ✅ NEW: approved invoices
//     const approvedInvoices = tableData.filter(
//       (row) => row.approvedInvoice === true && row.checkSale === true
//     );

//     if (selectedInvoices.length === 0 && approvedInvoices.length === 0) {
//       toast.warning("Please select at least one invoice");
//       return;
//     }

//     setSaveLoading(true);

//      // =========================
//     // ✅ 1. APPROVE SALE (NEW)
//     // =========================
//     if (approvedInvoices.length > 0) {
//       const approvePayload = approvedInvoices.map((row) => ({
//         BuyerId: row.buyerId,
//         InvoiceNo: row.invoiceNumber,
//         UpdatedBy: 1
//       }));

//       console.log("part 1")

//       const resApprove = await fetch(API_ENDPOINTS.ApprovedAccountSale, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(approvePayload),
//       });

//       const approveData = await safeJson(resApprove);

//       if (!resApprove.ok || !approveData.success) {
//         toast.error(approveData.message || "Failed to approve invoices");
//         return;
//       }
//     }

//     // =========================
//     // ✅ 2. CHECK SALE (EXISTING)
//     // =========================
//     else if (selectedInvoices.length > 0) {
//       const payload = selectedInvoices.map((row) => {
//         let cgstAmount = 0;
//         let sgstAmount = 0;
//         let igstAmount = 0;

//         if (row.taxType === "CGST_SGST") {
//           cgstAmount = row.totalTaxAmount / 2;
//           sgstAmount = row.totalTaxAmount / 2;
//         } else if (row.taxType === "IGST") {
//           igstAmount = row.totalTaxAmount;
//         }

//         console.log("part 2")

//         return {
//           BuyerId: row.buyerId,
//           InvoiceNo: row.invoiceNumber,
//           PoNumber: row.poNo,
//           TotalAmount: row.finalAmount,
//           CGSTAmount: cgstAmount,
//           SGSTAmount: sgstAmount,
//           IGSTAmount: igstAmount,
//           CreatedBy: 1
//         };
//       });

//       const res = await fetch(API_ENDPOINTS.AccountSale, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await safeJson(res);

//       if (!res.ok || !data.success) {
//         toast.error(data.message || "Failed to save invoices");
//         return;
//       }
//     }  

//     // =========================
//     // ✅ SUCCESS
//     // =========================
//     toast.success("Operation completed successfully ✅");

//     await fetchInvoiceData(formData.buyerCode);

//   } catch (error) {
//     toast.error("Server error while saving");
//   } finally {
//     setSaveLoading(false);
//   }
// };
 
  const handleCancel = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "All data will be reset!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reset!",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        setFormData({
          buyerId: "",
          buyerName: "",
          invoiceNumber: "",
          invoiceDate: "",
          poNumber: "",
          poDate: "",
          taxtype: "",
          paymentDueDate: "",
          status: "",
          totalAmount: 0,
          taxAmount: 0,
          grandTotal: 0,
        });
        setTableData([]);
        toast.info("Form reset successfully");
      }
    });
  };

  const LoadingSpinner = () => (
    <div className="d-flex justify-content-center align-items-center p-2">
      <Loader2 className="animate-spin" size={18} />
      <span className="ms-2">Loading...</span>
    </div>
  );

  return (
    <div>
      <ToastContainer position="top-center" theme="colored" />
      {/* <div style={{ background: "white", padding: "25px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}> */}

      <div style={{ background: "white", padding: "25px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>

        {/* FORM FIELDS */}
        { <div className="row mb-3">
            <div className="col mb-3">
              <label className="form-label text-primary fw-semibold"> Buyer Name</label>
              <select className="form-select" value={formData.buyerId}
                      onChange={(e) => {
                        const buyerId = Number(e.target.value); // ✅ FIX
                        if (buyerId === formData.buyerId) return; // ✅ prevent re-call

                        const buyer = suppliers.find(b => b.buyerId === buyerId);

                        if (!buyer) return;

                        setFormData(prev => ({
                          ...prev,
                          buyerId: buyer.buyerId, // ✅ REQUIRED
                          buyerName: buyer.buyerName,
                          buyerCode: buyer.buyerCode
                        }));

                        fetchInvoiceData(buyer.buyerCode);
                      }}
                    >
                      <option value="">Select buyer</option>
                      {suppliers.map(b => (
                        <option key={b.buyerId} value={b.buyerId} data-buyercode={b.buyerCode}>
                          {b.buyerName}
                        </option>
                      ))}
                    </select>
            </div>
            {/* <div className="col mb-3">
              <label className="form-label text-primary fw-semibold">Total Amount</label>
              <input type="text" name="checkedTotalAmount" className="form-control" value={formData.checkedTotalAmount} required readOnly/>
          </div> */}
          </div>}
          
        {/* ✅ FIXED TABLE WITH WORKING CHECKBOXES */}
        <div className="table-responsive">
          <table className="table table-bordered align-middle mt-3">
            <thead>
              <tr style={{ backgroundColor: "#f0f6ff" }}>
                <th className="text-primary">Buyer Name</th>
                <th className="text-primary">Invoice No</th>
                <th className="text-primary">Invoice Date</th>
                <th className="text-primary">PO No</th>
                <th className="text-primary">PayDue Date</th>
                <th className="text-primary">Tax Type</th>
                <th className="text-primary">Total Tax Amount</th>
                <th className="text-primary">Total Amount</th>
                <th className="text-primary">Check Invoice</th>
                <th className="text-primary">Approved Invoice</th>
                <th className="text-primary">View</th>
              </tr>
            </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="text-center">
                  <LoadingSpinner />
                </td>
              </tr>
            ) : tableData.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center text-muted">
                  No invoices found
                </td>
              </tr>
            ) : (
              tableData.map((row, index) => (
                <tr key={row.supplierId}>
                  <td>{row.buyerName}</td>
                  <td>{row.invoiceNumber}</td>
                  <td>{row.invoiceIssueDate?.split("T")[0]}</td>
                  <td>{row.poNo}</td>
                  <td>{row.dueDate?.split("T")[0]}</td>
                  <td>{row.taxType}</td>
                  <td className="fw-bold text-success">
                    ₹{row.totalTaxAmount?.toFixed(2)}
                  </td>
                  <td className="fw-bold text-primary">
                    ₹{row.finalAmount?.toFixed(2)}
                  </td>
                  <td className="text-center">
                      <input
                        type="checkbox"
                        checked={row.billCheck || false}
                        disabled={row.checkSale === true}
                        onChange={() => handleCheckboxChange(index, "billCheck")}
                      />
                    </td>
                  <td className="text-center">
                      <input
                        type="checkbox"
                        checked={row.approvedInvoice || false}
                        disabled={row.checkSale !== true || row.approveSale === true}
                        // disabled={row.isLocked || !row.billCheck} 
                        // disabled={!(row.billCheck && row.isActive)}   // 👈 only allow if checked
                        onChange={() => handleCheckboxChange(index, "approvedInvoice")}
                      />
                    </td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-info">
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          </table>
           <Pagination
              totalRecords={CheckInvoices.length}
              recordsPerPage={recordsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              />
        </div>

        {/* BUTTONS */}
        <div className="d-flex  gap-3 mt-4 mb-2">
          <button
            onClick={handleSave}
            disabled={saveLoading || tableData.filter(row => row.billCheck === true).length === 0}
            className="save-btn"
            style={{ fontWeight: 600, borderRadius: "8px", minWidth: "140px" }}
          >
            {saveLoading ? (
              <>
                <Loader2 className="animate-spin me-2" size={20} />
                Saving...
              </>
            ) : (
              `Save `
            )}
          </button>
          <button
            className="cancel-btn"
            style={{ borderRadius: "8px" }}
            onClick={handleCancel}
            disabled={saveLoading}
          >
            Reset
          </button>
        </div>
      </div>

      {/* </div> */}
    </div>
  );
};

export default CheckInvoice;

