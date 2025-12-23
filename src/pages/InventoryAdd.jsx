import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import "./InventoryAdd.css";
import { API_ENDPOINTS } from "../config/apiconfig";
import { Modal, Button } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";

export default function InventoryAdd() {
  const [showList, setShowList] = useState(false);
const [modalShow, setModalShow] = useState(false);
const [itemOptions, setItemOptions] = useState([]);   // dropdown
const [inventoryList, setInventoryList] = useState([]); // table

  const [items, setItems] = useState([]);
const [grades, setGrades] = useState([]);
  const [list, setList] = useState([]);
const [search, setSearch] = useState("");
const [pageSize, setPageSize] = useState(10);
const [currentPage, setCurrentPage] = useState(1);
const navigate = useNavigate();
 const [editData, setEditData] = useState(null); // friendly keys
  const [editItems, setEditItems] = useState([]);
  const [editGrades, setEditGrades] = useState([]);
  const [form, setForm] = useState({
    inventoryType: "",
    item: "",
    grade: "",
    itemCode: "",
    uom: "",
    safeStock: "",
    leadTime: "",
    moq: "",
    openingBalance: "",
    issue: "",
    receipt: "",
    closingBalance: "",
    quantityRequired: "",
    currency: "",
    averagePrice: "",
    closingInventoryValue: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      let updated = { ...prev, [name]: value };

      // Auto Closing Balance
      if (["openingBalance", "issue", "receipt"].includes(name)) {
        const opening =
          name === "openingBalance" ? Number(value) : Number(prev.openingBalance || 0);
        const issue = name === "issue" ? Number(value) : Number(prev.issue || 0);
        const receipt = name === "receipt" ? Number(value) : Number(prev.receipt || 0);

        updated.closingBalance = opening + receipt - issue;
      }

      // Auto Closing Inventory Value
      if (["averagePrice", "openingBalance", "issue", "receipt"].includes(name)) {
        const closing =
          updated.closingBalance !== "" ? Number(updated.closingBalance) : Number(prev.closingBalance || 0);

        const avgPrice =
          name === "averagePrice" ? Number(value) : Number(prev.averagePrice || 0);

        updated.closingInventoryValue = closing * avgPrice;
      }

      return updated;
    });

    if (name === "inventoryType") {
      fetchItemsByInventoryType(value);
    }
  };



  // --- Helper: map table row -> editData friendly fields (defensive)
  const toFriendlyEdit = (row) => {
    return {
      // try a few common key variants with nullish coalescing
      id: row.id ?? row.Id ?? row.ID,
      invCategory:
        row.invCategory ??
        row.InvCategory ??
        row.Inv_Category ??
        row.inv_Category ??
        row.InvCategoryName ??
        "",
      item: row.item_Name ?? row.Item_Name ?? row.itemName ?? "",
      grade: row.grade ?? row.Grade ?? "",
      itemCode: row.item_Code ?? row.Item_Code ?? row.itemCode ?? "",
      uom:
        row.unit_Of_Measurement ??
        row.unit_Of_Measurement ??
        row.uom ??
        row.Unit ??
        "",
      safeStock:
        row.Safe_Stock ?? row.safeStock ?? row.safe_stock ?? row.safe_stock_val ?? "",
      leadTime: row.Lead_Time ?? row.leadTime ?? "",
      moq: row.MOQ ?? row.moq ?? "",
      openingBalance:
        row.opening_Balance ?? row.openingBalance ?? row.OpeningBalance ?? 0,
      issue: row.issue_Qty ?? row.issueQty ?? row.issue ?? 0,
      receipt: row.receipt_Qty ?? row.receiptQty ?? row.receipt ?? 0,
      closingBalance:
        row.closing_Balance ?? row.closingBalance ?? row.ClosingBalance ?? 0,
      quantityRequired:
        row.Quantity_Required ?? row.quantityRequired ?? row.quantity_required ?? 0,
      currency: row.currency ?? row.Currency ?? "",
      averagePrice:
        row.averagePrice ?? row.Average_Price ?? row.avgPrice ?? 0,
      closingInventoryValue:
        row.closingInvValue ??
        row.ClosingInvValue ??
        row.closingInventoryValue ??
        0,
    };
  };
  // 🔹 Fetch Items by Inventory Type
 const fetchItemsByInventoryType = async (type) => {
  if (!type) {
    setItemOptions([]);
    return;
  }

  try {
    const res = await axios.get(
      `${API_ENDPOINTS.Inventory}/GetItemsByType?type=${type}`
    );

    setItemOptions(res.data || []); // ✅ STRING ARRAY
    setGrades([]);

    setForm((prev) => ({
      ...prev,
      item: "",
      grade: "",
      itemCode: "",
      uom: "",
      currency: "",
      averagePrice: "",
    }));
  } catch (err) {
    console.error(err);
  }
};


  // 🔹 On Item Select → Load Grades
  const handleItemSelect = async (e) => {
    const itemname = e.target.value;
debugger;
    setForm((prev) => ({
      ...prev,
      item: itemname,
      grade: "",
      itemCode: "",
      uom: "",
      currency: "",
      averagePrice: "",
    }));

    if (!itemname) return;

    try {
      const response = await axios.get(
        `${API_ENDPOINTS.Inventory}/GetItemsByGrade?itemname=${itemname}`
      );

      setGrades(response.data);
    } catch (error) {
      console.error("Error fetching grade list", error);
    }
  };

  // 🔹 On Grade Select → Load Details
  const handleGradeSelect = async (e) => {
    const selectedGrade = e.target.value;
    const selectedItem = form.item;

    setForm((prev) => ({ ...prev, grade: selectedGrade }));

    if (!selectedGrade || !selectedItem) return;

    try {
      const response = await axios.get(
        `${API_ENDPOINTS.Inventory}/GetByGrade?itemname=${selectedItem}&grade=${selectedGrade}`
      );

      const data = response.data;

      if (data) {
        setForm((prev) => ({
          ...prev,
          itemCode: data.item_Code,
          uom: data.uom,
          currency: data.currency,
          averagePrice: data.averagePrice,
        }));
      }
    } catch (error) {
      console.error("Error fetching grade details", error);
    }
  };

  // 🔹 Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      Date: new Date().toISOString(), // Auto Date
      Item_Code: form.itemCode,
      Item_Name: form.item,
      Unit_Of_Measurement: form.uom,

      Safe_Stock: Number(form.safeStock || 0),
      Lead_Time: Number(form.leadTime || 0),

      Opening_Balance: Number(form.openingBalance || 0),
      Pending_PO: 0,
      Receipt: Number(form.receipt || 0),
      Issue: Number(form.issue || 0),
      Closing_Balance: Number(form.closingBalance || 0),

      Requirement_Month: 0,
      PO_Placed: 0,
      MOQ: Number(form.moq || 0),
      PR_Pending: 0,
      Pending_PO_Rate: 0,

      Average_Price: Number(form.averagePrice || 0),
      Quantity_Required: Number(form.quantityRequired || 0),

      Grade: form.grade,
      Currency: form.currency,

      ClosingInvValue: Number(form.closingInventoryValue || 0),
      InvCategory: form.inventoryType,
    };

    try {
      await axios.post(`${API_ENDPOINTS.Inventory}/CreateInv`, payload);

      alert("Inventory Saved Successfully!");
      resetForm();
    } catch (error) {
      console.error("Save Error:", error);
      alert("Error saving data.");
    }
  };

  const resetForm = () => {
    setForm({
      inventoryType: "",
      item: "",
      grade: "",
      itemCode: "",
      uom: "",
      safeStock: "",
      leadTime: "",
      moq: "",
      openingBalance: "",
      issue: "",
      receipt: "",
      closingBalance: "",
      quantityRequired: "",
      currency: "",
      averagePrice: "",
      closingInventoryValue: "",
    });
  };

  // 🔹 Fetch List
// Fetch list only when showList = true
useEffect(() => {
  if (showList) {
    fetchInventoryList();
  }
}, [showList]);

// Fetch inventory items
const fetchInventoryList = async () => {
  try {
    const res = await axios.get(
      `${API_ENDPOINTS.Inventory}/GetItemList`
    );
    setInventoryList(res.data || []);
  } catch (err) {
    console.error(err);
  }
};


const handleEditClick = async (row) => {
  debugger;
  try {
    const res = await axios.get(
      `${API_ENDPOINTS.Inventory}/GetInventoryById?id=${row.id}`
    );

    const d = res.data; // single object

    setEditData({
      id: d.id,
      invCategory: d.invCategory,
      item: d.item_Name,
      grade: d.grade,
      itemCode: d.item_Code,
      uom: d.unit_Of_Measurement,
      currency: d.currency,
      openingBalance: d.opening_Balance,
      issue: d.Issue,
      receipt: d.Receipt,
      closingBalance: d.closing_Balance,
      averagePrice: d.averagePrice,
      closingInvValue: d.closingInvValue
    });

    setModalShow(true);
  } catch (err) {
    console.error("Error loading record by ID:", err);
  }
};

const handleEditSave = async () => {
  const payload = {
    Id: editData.id,
    Item_Name: editData.item,
    Grade: editData.grade,
    Item_Code: editData.itemCode,
    Unit_Of_Measurement: editData.uom,
    Opening_Balance: Number(editData.openingBalance),
    Issue_Qty: Number(editData.issue),
    Receipt_Qty: Number(editData.receipt),
    Closing_Balance: Number(editData.closingBalance),
    AveragePrice: Number(editData.averagePrice),
    ClosingInvValue: Number(editData.closingInventoryValue)
  };

  try {
    await axios.put(`${API_ENDPOINTS.Inventory}/UpdateInv`, payload);
    alert("Updated successfully");
    setModalShow(false);
    fetchInventoryList();
  } catch (err) {
    console.error("Update error", err);
    alert("Error updating");
  }
};

// Search filter
const filteredData = inventoryList.filter((x) =>
  x.item_Name?.toLowerCase().includes(search.toLowerCase()) ||
  x.item_Code?.toLowerCase().includes(search.toLowerCase())
);


// Pagination
const totalPages = Math.ceil(filteredData.length / pageSize);

const paginatedData = filteredData.slice(
  (currentPage - 1) * pageSize,
  currentPage * pageSize
);

// Pagination handler
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages) {
    setCurrentPage(page);
  }
};

  return (
    <div className="inventory-wrapper">
      {!showList && (
        <div className="inventory-form-container">
          <div className="toggle-buttons">
            <h2 className="form-title">Create Inventory</h2>
            <button onClick={() => setShowList(true)}>📋 List</button>
          </div>

          <form className="inventory-form" onSubmit={handleSubmit}>
            {/* ROW 1 */}
            <div className="form-row">
              <div className="form-group">
                <label>Select Inventory Type</label>
                <select
          name="inventoryType"
          value={form.inventoryType}
          onChange={handleChange}
        >
          <option value="">--Select--</option>
          <option value="BUY">RAW</option>
          <option value="SELL">FINISH</option>
          <option value="SEMI FINISH">SEMI FINISH</option>
        </select>
              </div>

              <div className="form-group">
                <label>Select Item</label>
                <select name="item" value={form.item} onChange={handleItemSelect}>
  <option value="">--Select Item--</option>

  {itemOptions.map((itm, index) => (
    <option key={index} value={itm}>
      {itm}
    </option>
  ))}
</select>

              </div>

              <div className="form-group">
                <label>Select Grade</label>
                <select
                  name="grade"
                  value={form.grade}
                  onChange={handleGradeSelect}
                >
                  <option value="">--Select Grade--</option>

                  {grades.map((g, i) => (
                    <option key={i} value={g.grade}>
                      {g.grade}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Item Code</label>
                <input name="itemCode" value={form.itemCode} disabled />
              </div>
            </div>

            {/* ROW 2 */}
            <div className="form-row">
              <div className="form-group">
                <label>UOM</label>
                <input name="uom" value={form.uom} disabled />
              </div>

              <div className="form-group">
                <label>Safe Stock</label>
                <input name="safeStock" onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Lead Time</label>
                <input name="leadTime" onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>MOQ</label>
                <input name="moq" onChange={handleChange} />
              </div>
            </div>

            {/* ROW 3 */}
            <div className="form-row">
              <div className="form-group">
                <label>Opening Balance</label>
                <input name="openingBalance" onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Issue</label>
                <input name="issue" onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Receipt</label>
                <input name="receipt" onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Closing Balance</label>
                <input name="closingBalance" value={form.closingBalance} disabled />
              </div>
            </div>

            {/* ROW 4 */}
            <div className="form-row">
              <div className="form-group">
                <label>Quantity Required</label>
                <input name="quantityRequired" onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Currency</label>
                <input name="currency" value={form.currency} disabled />
              </div>

              <div className="form-group">
                <label>Average Price</label>
                <input name="averagePrice" value={form.averagePrice} disabled />
              </div>

              <div className="form-group full-width">
                <label>Closing Inventory Value</label>
                <input
                  name="closingInventoryValue"
                  value={form.closingInventoryValue}
                  disabled
                />
              </div>
            </div>

            <div className="submit-container">
              <button type="submit" className="submit-btn">
                SUBMIT
              </button>
            </div>
          </form>
        </div>
      )}

      {/* LIST VIEW */}
  {showList && (
  <div className="inventory-list-container">
<div className="row">
  <div className="col-md-6">
      <div className="toggle-buttons">
      <h2 className="list-title">Inventory List</h2>
      <button onClick={() => setShowList(false)}>➕ Add Inventory</button>
    </div>
  </div>
  <div className="col-md-6">
     {/* Search */}
    <input
      type="text"
      className="border p-2 mb-3 w-60"
      placeholder="Search item..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

    {/* Page Size */}
    <select
      className="border p-2 ml-3"
      value={pageSize}
      onChange={(e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
      }}
    >
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={20}>20</option>
      <option value={50}>50</option>
    </select>
  </div>
</div>
 
    {/* TABLE */}
    <table className="inventory-table">
      <thead>
        <tr>
          <th>ITEM NAME</th>
          <th>GRADE</th>
          <th>UOM</th>
          <th>O/B BAL</th>
          <th>ISSUE</th>
          <th>RECEIPT</th>
          <th>C/B</th>
          <th>AVG PRICE</th>
          <th>EDIT</th>
          <th>ACTION</th>
<th style={{display: "none"}}>ID</th>
        </tr>
      </thead>

      <tbody>
        {paginatedData.length === 0 ? (
          <tr>
            <td colSpan="10" className="text-center p-3">
              No records found
            </td>
          </tr>
        ) : (
          paginatedData.map((item, index) => (
            <tr key={index}>
              <td>{item.item_Name}</td>
              <td>{item.grade}</td>
              <td>{item.unit_Of_Measurement}</td>
              <td>{item.opening_Balance}</td>
              <td>{item.issue_Qty}</td>
              <td>{item.receipt_Qty}</td>
              <td>{item.closing_Balance}</td>
              <td>{item.averagePrice}</td>
             <td>
            <button
  className="edit-btn"
  onClick={() => navigate(`/inventory/edit/${item.id}`)}
>
  EDIT
</button>

            </td>
              <td>
                <button>Deactivate</button>
              </td>
              <td style={{display:"none"}}>{item.id}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>

    {/* Pagination */}
    <div className="flex mt-3 gap-2">
      <button
        className="border px-3 py-1"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      <span className="px-2 py-1">
        Page {currentPage} of {totalPages}
      </span>

      <button
        className="border px-3 py-1"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>

  </div>
)}
 {/* EDIT MODAL */}
 

    </div>
    
  );
}
