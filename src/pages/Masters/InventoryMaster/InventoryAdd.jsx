import React, { useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config/apiconfig";
import "./InventoryAdd.css";

export default function InventoryAdd() {
  const [itemOptions, setItemOptions] = useState([]);
  const [grades, setGrades] = useState([]);

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
    closingInventoryValue: ""
  });

  /* 🔹 CHANGE HANDLER */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      const opening = Number(updated.openingBalance || 0);
      const issue = Number(updated.issue || 0);
      const receipt = Number(updated.receipt || 0);

      updated.closingBalance = opening + receipt - issue;
      updated.closingInventoryValue =
        updated.closingBalance * Number(updated.averagePrice || 0);

      return updated;
    });

    if (name === "inventoryType") fetchItemsByInventoryType(value);
  };

  /* 🔹 FETCH ITEMS */
  const fetchItemsByInventoryType = async (type) => {
    if (!type) return setItemOptions([]);

    const res = await axios.get(
      `${API_ENDPOINTS.Inventory}/GetItemsByType?type=${type}`
    );
    setItemOptions(res.data || []);
  };

  /* 🔹 ITEM → GRADES */
  const handleItemSelect = async (e) => {
    const item = e.target.value;
    setForm({ ...form, item, grade: "" });

    const res = await axios.get(
      `${API_ENDPOINTS.Inventory}/GetItemsByGrade?itemname=${item}`
    );
    setGrades(res.data || []);
  };

  /* 🔹 GRADE → DETAILS */
  const handleGradeSelect = async (e) => {
    const grade = e.target.value;
    const res = await axios.get(
      `${API_ENDPOINTS.Inventory}/GetByGrade?itemname=${form.item}&grade=${grade}`
    );

    setForm((prev) => ({
      ...prev,
      grade,
      itemCode: res.data.item_Code,
      uom: res.data.uom,
      currency: res.data.currency,
      averagePrice: res.data.averagePrice
    }));
  };

  /* 🔹 SAVE */
  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(`${API_ENDPOINTS.Inventory}/CreateInv`, {
      Item_Name: form.item,
      Item_Code: form.itemCode,
      Grade: form.grade,
      Unit_Of_Measurement: form.uom,
      Opening_Balance: Number(form.openingBalance),
      Issue: Number(form.issue),
      Receipt: Number(form.receipt),
      Closing_Balance: Number(form.closingBalance),
      Average_Price: Number(form.averagePrice),
      ClosingInvValue: Number(form.closingInventoryValue),
      Currency: form.currency,
      InvCategory: form.inventoryType
    });

    alert("Inventory Created");
  };

  return (
  <div className="inventory-form-container">
  <h2 className="page-title">Create Inventory</h2>

  <form onSubmit={handleSubmit}>
    {/* ROW 1 */}
    <div className="row">
      <div className="col-md-3 form-group">
        <label>Inventory Type</label>
        <select
          className="form-control"
          name="inventoryType"
          onChange={handleChange}
        >
          <option value="">Select Type</option>
          <option value="BUY">RAW</option>
          <option value="SELL">FINISH</option>
        </select>
      </div>

      <div className="col-md-3 form-group">
        <label>Item</label>
        <select
          className="form-control"
          value={form.item}
          onChange={handleItemSelect}
        >
          <option value="">Select Item</option>
          {itemOptions.map((i, idx) => (
            <option key={idx}>{i}</option>
          ))}
        </select>
      </div>

      <div className="col-md-3 form-group">
        <label>Grade</label>
        <select
          className="form-control"
          value={form.grade}
          onChange={handleGradeSelect}
        >
          <option value="">Select Grade</option>
          {grades.map((g, idx) => (
            <option key={idx}>{g.grade}</option>
          ))}
        </select>
      </div>

      <div className="col-md-3 form-group">
        <label>Item Code</label>
        <input className="form-control" value={form.itemCode} disabled />
      </div>
    </div>

    {/* ROW 2 */}
    <div className="row">
      <div className="col-md-3 form-group">
        <label>UOM</label>
        <input className="form-control" value={form.uom} disabled />
      </div>

      <div className="col-md-3 form-group">
        <label>Opening Balance</label>
        <input
          className="form-control"
          name="openingBalance"
          onChange={handleChange}
        />
      </div>

      <div className="col-md-3 form-group">
        <label>Issue</label>
        <input
          className="form-control"
          name="issue"
          onChange={handleChange}
        />
      </div>

      <div className="col-md-3 form-group">
        <label>Receipt</label>
        <input
          className="form-control"
          name="receipt"
          onChange={handleChange}
        />
      </div>
    </div>

    {/* ROW 3 */}
    <div className="row">
      <div className="col-md-3 form-group">
        <label>Closing Balance</label>
        <input className="form-control" value={form.closingBalance} disabled />
      </div>

      <div className="col-md-3 form-group">
        <label>Average Price</label>
        <input className="form-control" value={form.averagePrice} disabled />
      </div>

      <div className="col-md-3 form-group">
        <label>Closing Inventory Value</label>
        <input
          className="form-control"
          value={form.closingInventoryValue}
          disabled
        />
      </div>
    </div>

    <div className="submit-container">
      <button className="btn btn-primary" style={{width:150, fontSize:20 ,fontWeight:"bold"}}>SUBMIT</button>
    </div>
  </form>
</div>

  );
}
