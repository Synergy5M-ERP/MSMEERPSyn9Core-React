import React, { useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_ENDPOINTS } from "../../config/apiconfig";
import Swal from "sweetalert2";
import "./ApprovedPayable.css";

const ApprovedPayable = () => {
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [grnsData, setGrnsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const GRNS_PER_PAGE = 5;

 const safeJson = async (res) => {
  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    console.error("Non-JSON response:", text);
    throw new Error("Server returned invalid response");
  }
};
const loadAllGrnsWithDetails = useCallback(async () => {
  try {
    setLoading(true);

    const res = await fetch(API_ENDPOINTS.GetGRNsBySeller);
    if (!res.ok) throw new Error("Failed to load GRNs");

    const data = await safeJson(res);

    const mapped = (data.data || []).map((row) => {
      const tax = parseFloat(row.totalTaxValue ?? 0);
      const amount = parseFloat(row.totalAmount ?? 0);

      return {
        grnNumber: row.grnNumber,
        grnDate: row.grnDate,
        invoiceNumber: row.invoiceNo,
        invoiceDate: row.invoiceDate,
        poNumber: row.poNumber,
        poDate: row.poDate,
        transporterName: row.sellerName,

        itemName: row.itemName,
        grade: row.grade,

        totalTaxValue: tax,
        totalItemValue: amount,
        billItemValue: tax + amount,

        billApprove: false
      };
    });

    setGrnsData(mapped);
  } catch (error) {
    toast.error("Error loading data");
  } finally {
    setLoading(false);
  }
}, []);

  // ✅ FIX: LOAD DATA ON PAGE LOAD
  useEffect(() => {
    loadAllGrnsWithDetails();
  }, [loadAllGrnsWithDetails]);

  // ✅ PAGINATION
  const totalPages = Math.ceil(grnsData.length / GRNS_PER_PAGE);
  const pagedGrns = grnsData.slice(
    (currentPage - 1) * GRNS_PER_PAGE,
    currentPage * GRNS_PER_PAGE
  );

  // ✅ APPROVE TOGGLE
  const handleBillApproveToggle = useCallback((grnNumber, itemIndex) => {
    setGrnsData((prev) =>
      prev.map((grn) => {
        if (grn.grnNumber === grnNumber) {
          const newItems = [...grn.items];
          newItems[itemIndex].billApprove =
            !newItems[itemIndex].billApprove;

          return { ...grn, items: newItems };
        }
        return grn;
      })
    );
  }, []);

const handleSingleApprove = async (row) => {
  try {
    const url = `${API_ENDPOINTS.ApproveGrns}?grnNumber=${row.grnNumber}&totalAmount=${row.billItemValue}`;

    const res = await fetch(url, {
      method: "POST"
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    toast.success("Approved successfully");

    // update UI
    setGrnsData(prev =>
      prev.map(item =>
        item.grnNumber === row.grnNumber
          ? { ...item, billApprove: true }
          : item
      )
    );

  } catch (error) {
    toast.error(error.message);
  }
};
  return (
    <>
      <ToastContainer position="top-right" theme="colored" />

      <div className="approved-payable-app">
        <div className="container-fluid">

         

          {/* ✅ TABLE */}
          <div className="table-responsive">
            <table className="table table-bordered table-striped text-center">
              <thead className="table-primary">
                <tr>
                  <th>GRN No<br />Date</th>
                  <th>Invoice No<br />Date</th>
                  <th>PO No<br />Date</th>
                  <th>Seller</th>
                  <th>Item</th>
                  <th>Tax</th>
                  <th>Amount</th>
                  <th>Total</th>
                  <th>Approve</th>
                </tr>
              </thead>

             <tbody>
  {pagedGrns.length === 0 ? (
    <tr>
      <td colSpan="9">No data found</td>
    </tr>
  ) : (
    pagedGrns.map((row, index) => (
      <tr key={index}>
        <td>{row.grnNumber}<br />{row.grnDate}</td>
        <td>{row.invoiceNumber}<br />{row.invoiceDate}</td>
        <td>{row.poNumber}<br />{row.poDate}</td>
        <td>{row.transporterName}</td>

        <td>{row.itemName}<br />{row.grade}</td>

        <td>₹{row.totalTaxValue.toFixed(2)}</td>
        <td>₹{row.totalItemValue.toFixed(2)}</td>
        <td className="fw-bold text-success">
          ₹{row.billItemValue.toFixed(2)}
        </td>

        <td>
          <button
            className={`btn btn-sm ${
              row.billApprove
                ? "btn-success"
                : "btn-outline-secondary"
            }`}
            onClick={() => handleSingleApprove(row)}
          >
            {row.billApprove ? "Approved" : "Approve"}
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>
            </table>
          </div>

        </div>
      </div>
    </>
  );
};

export default ApprovedPayable;