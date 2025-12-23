import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../../../config/apiconfig";
import "./InventoryAdd.css";

export default function InventoryEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    item_Name: "",
    grade: "",
    unit_Of_Measurement: "",

    opening_Balance: 0,
    issue_Qty: 0,
    receipt_Qty: 0,

    closing_Balance: 0,
    averagePrice: 0,
    closingInvValue: 0
  });

  /* 🔹 LOAD INVENTORY */
  useEffect(() => {
    axios
      .get(`${API_ENDPOINTS.Inventory}/GetInventoryById?id=${id}`)
      .then((res) => {
        setForm(res.data);
      })
      .catch(() => alert("Failed to load inventory"));
  }, [id]);

  /* 🔹 HANDLE CHANGE + AUTO CALC */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updated = { ...prev, [name]: Number(value) };

      updated.closing_Balance =
        Number(updated.opening_Balance || 0) +
        Number(updated.receipt_Qty || 0) -
        Number(updated.issue_Qty || 0);

      updated.closingInvValue =
        updated.closing_Balance * Number(updated.averagePrice || 0);

      return updated;
    });
  };

  /* 🔹 SAVE */
  const handleSave = async () => {
    const payload = {
      Id: id,
      Opening_Balance: form.opening_Balance,
      Issue: form.issue_Qty,
      Receipt: form.receipt_Qty,
      Closing_Balance: form.closing_Balance,
      Average_Price: form.averagePrice,
      ClosingInvValue: form.closingInvValue
    };

    try {
      await axios.put(`${API_ENDPOINTS.Inventory}/UpdateInv`, payload);
      alert("Inventory Updated Successfully");
      navigate("/inventory");
    } catch {
      alert("Update failed");
    }
  };

  return (
    <div className="inventory-form-container">
      <h2>Edit Inventory</h2>

      {/* READ ONLY */}
      <div className="form-row">
        <div className="form-group">
          <label>Item Name</label>
          <input value={form.item_Name} disabled />
        </div>

        <div className="form-group">
          <label>Grade</label>
          <input value={form.grade} disabled />
        </div>

        <div className="form-group">
          <label>UOM</label>
          <input value={form.unit_Of_Measurement} disabled />
        </div>
      </div>

      {/* EDITABLE */}
      <div className="form-row">
        <div className="form-group">
          <label>Opening Balance</label>
          <input
            type="number"
            name="opening_Balance"
            value={form.opening_Balance}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Issue</label>
          <input
            type="number"
            name="issue_Qty"
            value={form.issue_Qty}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Receipt</label>
          <input
            type="number"
            name="receipt_Qty"
            value={form.receipt_Qty}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* AUTO */}
      <div className="form-row">
        <div className="form-group">
          <label>Closing Balance</label>
          <input value={form.closing_Balance} disabled />
        </div>

        <div className="form-group">
          <label>Average Price</label>
          <input value={form.averagePrice} disabled />
        </div>

        <div className="form-group">
          <label>Closing Inventory Value</label>
          <input value={form.closingInvValue} disabled />
        </div>
      </div>

      {/* ACTION */}
      <div className="submit-container">
        <button className="submit-btn" onClick={handleSave}>
          UPDATE
        </button>
        <button className="cancel-btn" onClick={() => navigate("/inventory")}>
          CANCEL
        </button>
      </div>
    </div>
  );
}
