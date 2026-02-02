import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config/apiconfig";
import "./InventoryAdd.css";

export default function InventoryEdit() {
  const [showList, setShowList] = useState(true);
  const [inventoryList, setInventoryList] = useState([]);
  const [editId, setEditId] = useState(null);

  /* SEARCH + PAGINATION */
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [form, setForm] = useState({
    item_Name: "",
    grade: "",
    unit_Of_Measurement: "",
    opening_Balance: 0,
    issue: 0,
    receipt: 0,
    closing_Balance: 0,
    averagePrice: 0,
    closingInvValue: 0
  });

  /* ================= FETCH LIST ================= */
  const fetchList = async () => {
    const res = await axios.get(`${API_ENDPOINTS.Inventory}/GetItemList`);
    setInventoryList(res.data || []);
  };

  useEffect(() => {
    fetchList();
  }, []);

  /* ================= SEARCH ================= */
  const filteredList = inventoryList.filter(x =>
    x.item_Name?.toLowerCase().includes(search.toLowerCase()) ||
    x.item_Code?.toLowerCase().includes(search.toLowerCase()) ||
    x.grade?.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredList.length / pageSize);

  const paginatedData = filteredList.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const goToPage = page => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  /* ================= EDIT ================= */
  const handleEditClick = async id => {
    const res = await axios.get(
      `${API_ENDPOINTS.Inventory}/GetInventoryById?id=${id}`
    );

    setForm({
      item_Name: res.data.item_Name,
      grade: res.data.grade,
      unit_Of_Measurement: res.data.unit_Of_Measurement,
      opening_Balance: res.data.opening_Balance || 0,
      issue: res.data.issue || 0,
      receipt: res.data.receipt || 0,
      closing_Balance: res.data.closing_Balance || 0,
      averagePrice: res.data.averagePrice || 0,
      closingInvValue: res.data.closingInvValue || 0
    });

    setEditId(id);
    setShowList(false);
  };

  const handleChange = e => {
    const { name, value } = e.target;

    setForm(prev => {
      const updated = { ...prev, [name]: Number(value) };

      updated.closing_Balance =
        Number(updated.opening_Balance) +
        Number(updated.receipt) -
        Number(updated.issue);

      updated.closingInvValue =
        updated.closing_Balance * Number(updated.averagePrice);

      return updated;
    });
  };

  const handleUpdate = async () => {
    await axios.put(`${API_ENDPOINTS.Inventory}/UpdateInv`, {
      Id: editId,
      Opening_Balance: form.opening_Balance,
      Issue: form.issue,
      Receipt: form.receipt,
      Closing_Balance: form.closing_Balance,
      ClosingInvValue: form.closingInvValue
    });

    alert("Inventory Updated Successfully");
    setShowList(true);
    setEditId(null);
    fetchList();
  };

  /* ================= UI ================= */
  return (
    <div className="main-content">

      {/* ================= LIST VIEW ================= */}
      {showList && (
        <div className="inventory-list-container">

          <div className="row mb-3">
            <div className="col-md-6">
              <h2>Inventory List</h2>
            </div>

            <div className="col-md-6 text-end">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="border p-2 me-2"
              />

              <select
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border p-2"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <table className="inventory-table">
            <thead>
              <tr>
                <th>ITEM</th>
                <th>GRADE</th>
                <th>UOM</th>
                <th>OPENING</th>
                <th>ISSUE</th>
                <th>RECEIPT</th>
                <th>CLOSING</th>
                <th>AVG PRICE</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center">No records found</td>
                </tr>
              ) : (
                paginatedData.map(item => (
                  <tr key={item.id}>
                    <td>{item.item_Name}</td>
                    <td>{item.grade}</td>
                    <td>{item.unit_Of_Measurement}</td>
                    <td>{item.opening_Balance}</td>
                    <td>{item.issue}</td>
                    <td>{item.receipt}</td>
                    <td>{item.closing_Balance}</td>
                    <td>{item.averagePrice}</td>
                    <td>
                      <button
                        className="edit-btn" style={{backgroundColor:"yellow"}}
                        onClick={() => handleEditClick(item.id)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="mt-3">
            <button
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
            >
              Prev
            </button>

            <span className="mx-2">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ================= EDIT VIEW ================= */}
     {!showList && ( <div className="inventory-form-container"> <h2>Edit Inventory</h2> {/* READ ONLY */} <div className="form-row"> <div className="form-group"> <label>Item Name</label> <input value={form.item_Name} disabled /> </div> <div className="form-group"> <label>Grade</label> <input value={form.grade} disabled /> </div> <div className="form-group"> <label>UOM</label> <input value={form.unit_Of_Measurement} disabled /> </div> </div> {/* EDITABLE */} <div className="form-row"> <div className="form-group"> <label>Opening Balance</label> <input type="number" name="opening_Balance" value={form.opening_Balance} onChange={handleChange} /> </div> <div className="form-group"> <label>Issue</label> <input type="number" name="issue_Qty" value={form.issue_Qty} onChange={handleChange} /> </div> <div className="form-group"> <label>Receipt</label> <input type="number" name="receipt_Qty" value={form.receipt_Qty} onChange={handleChange} /> </div> </div> {/* AUTO */} <div className="form-row"> <div className="form-group"> <label>Closing Balance</label> <input value={form.closing_Balance} disabled /> </div> <div className="form-group"> <label>Average Price</label> <input value={form.averagePrice} disabled /> </div> <div className="form-group"> <label>Closing Inventory Value</label> <input value={form.closingInvValue} disabled /> </div> </div> {/* ACTION */} <div className="submit-container"> <button className="btn btn-success" onClick={handleUpdate}> UPDATE </button> <button className="cancel-btn" onClick={() => setShowList(true)} > GO TO LIST </button> </div> </div>
      )}
    </div>
  );
}
