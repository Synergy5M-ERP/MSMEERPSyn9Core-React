import React, { useState, useCallback } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { API_ENDPOINTS } from '../../config/apiconfig'; // Your API config

const BrougthOutRequirement = () => {
  // 1st Form State (Sales Order)
  const [salesForm, setSalesForm] = useState({
    orderType: '',
    buyerName: '',
    soNumber: '',
    itemName: '',
    grade: ''
  });

  // 2nd Form State (Level 1)
  const [level1Form, setLevel1Form] = useState({
    level1Item: '',
    itemCode: '',
    grade: ''
  });

  // UI States
  const [salesDetails, setSalesDetails] = useState({});
  const [showSalesDetails, setShowSalesDetails] = useState(false);
  const [boughtOutTable, setBoughtOutTable] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(false);

  // Dropdown States
  const [dropdowns, setDropdowns] = useState({
    buyerNames: [],
    soNumbers: [],
    itemNames: [],
    grades: [],
    level1Items: [], // You'll populate this from props or API
    level1ItemCodes: [],
    level1Grades: []
  });

  // 1st Form - Cascading Dropdowns
  const handleSalesChange = useCallback(async (field, value) => {
    setSalesForm(prev => ({ ...prev, [field]: value }));

    switch (field) {
      case 'orderType':
        setSalesForm(prev => ({ ...prev, buyerName: '', soNumber: '', itemName: '', grade: '' }));
        setDropdowns(prev => ({ ...prev, buyerNames: [], soNumbers: [], itemNames: [], grades: [] }));
        if (value) fetchBuyers(value);
        break;
      case 'buyerName':
        setSalesForm(prev => ({ ...prev, soNumber: '', itemName: '', grade: '' }));
        setDropdowns(prev => ({ ...prev, soNumbers: [], itemNames: [], grades: [] }));
        if (value) fetchSONumbers(value, salesForm.orderType);
        break;
      case 'soNumber':
        setSalesForm(prev => ({ ...prev, itemName: '', grade: '' }));
        setDropdowns(prev => ({ ...prev, itemNames: [], grades: [] }));
        if (value) fetchItemNames(value);
        break;
      case 'itemName':
        setSalesForm(prev => ({ ...prev, grade: '' }));
        setDropdowns(prev => ({ ...prev, grades: [] }));
        if (value) fetchSalesGrades(value);
        break;
    }
  }, []);

  // API Calls - Replace with your actual endpoints
  const fetchBuyers = async (orderType) => {
    try {
      const res = await axios.get(`${API_ENDPOINTS.RawMaterial}/GetCustomGenericNo?orderType=${orderType}`);
      setDropdowns(prev => ({ ...prev, buyerNames: res.data.quotations || [] }));
    } catch (err) {
      console.error("Buyers fetch error:", err);
    }
  };

  const fetchSONumbers = async (buyerName, orderType) => {
    try {
      const res = await axios.get(`${API_ENDPOINTS.RawMaterial}/GetSONo?BuyerName=${buyerName}&orderType=${orderType}`);
      setDropdowns(prev => ({ ...prev, soNumbers: res.data || [] }));
    } catch (err) {
      console.error("SO Numbers fetch error:", err);
    }
  };

  const fetchItemNames = async (soNumber) => {
    try {
      const res = await axios.get(`${API_ENDPOINTS.RawMaterial}/GetItemNameBySONO?salesOrderNumber=${soNumber}`);
      setDropdowns(prev => ({ ...prev, itemNames: res.data || [] }));
    } catch (err) {
      console.error("Item names fetch error:", err);
    }
  };

  const fetchSalesGrades = async (itemName) => {
    try {
      const res = await axios.get(`${API_ENDPOINTS.RawMaterial}/GetGradeBySONO?salesOrderNumber=${salesForm.soNumber}&salesOrderItemName=${itemName}`);
      setDropdowns(prev => ({ ...prev, grades: res.data || [] }));
    } catch (err) {
      console.error("Grades fetch error:", err);
    }
  };

  // 1st Search Button
  const searchSalesOrder = async () => {
    const { soNumber, itemName, grade } = salesForm;
    if (!soNumber || !itemName || !grade) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const encodedItem = encodeURIComponent(itemName);
      const encodedGrade = encodeURIComponent(grade);
      const encodedSO = encodeURIComponent(soNumber);
      
      const res = await axios.get(`${API_ENDPOINTS.RawMaterial}/FetchSalesOrderDetails?salesOrderGrade=${encodedGrade}&salesono=${encodedSO}&itemname=${encodedItem}`);
      
      if (res.data) {
        setSalesDetails(res.data);
        setShowSalesDetails(true);
      } else {
        alert('No sales order found');
      }
    } catch (err) {
      alert("Order details not found");
    } finally {
      setLoading(false);
    }
  };

  // 2nd Form Handlers
  const handleLevel1Change = async (field, value) => {
    setLevel1Form(prev => ({ ...prev, [field]: value }));

    if (field === 'level1Item' && value) {
      setLevel1Form(prev => ({ ...prev, itemCode: '', grade: '' }));
      setDropdowns(prev => ({ ...prev, level1ItemCodes: [], level1Grades: [] }));
      try {
        const res = await axios.get(`${API_ENDPOINTS.RawMaterial}/GetItemCodesByLevel1Item?level1ItemCode=${value}`);
        setDropdowns(prev => ({ ...prev, level1ItemCodes: res.data }));
      } catch (err) {
        console.error("Level 1 items error:", err);
      }
    }

    if (field === 'itemCode' && value) {
      setLevel1Form(prev => ({ ...prev, grade: '' }));
      setDropdowns(prev => ({ ...prev, level1Grades: [] }));
      try {
        const res = await axios.get(`${API_ENDPOINTS.RawMaterial}/GetGradesByItemCode?itemCode=${value}`);
        setDropdowns(prev => ({ ...prev, level1Grades: res.data }));
      } catch (err) {
        console.error("Level 1 grades error:", err);
      }
    }
  };

  // 2nd Search Button
  const searchBoughtOut = async () => {
    const salesItemCode = salesDetails.Itemcode;
    const level1ItemCode = level1Form.itemCode;
    
    if (!salesItemCode || !level1ItemCode) {
      alert('Please complete first search');
      return;
    }
    
    if (salesItemCode !== level1ItemCode) {
      alert('Item Code Not Matching!');
      return;
    }

    setLoading(true);
    try {
      const gradeElement = document.querySelector('#level1-grade');
      const fpbid = gradeElement?.dataset.fpbid;
      
      if (!fpbid) {
        alert('Please select grade');
        return;
      }

      const res = await axios.get(`${API_ENDPOINTS.RawMaterial}/SearchBoughtItems?fpbid=${fpbid}`);
      
      if (res.data.Items?.length > 0) {
        const totalOrderQty = parseFloat(salesDetails.Plan_Production) || 0;
        const buyerName = salesForm.buyerName;
        const soNumber = salesForm.soNumber;

        const groupedItems = res.data.Items.reduce((acc, item) => {
          const key = `${item.ItemName}_${item.ItemCode}_${item.Grade}`;
          if (!acc[key]) {
            acc[key] = { ...item, Total: 0, BuyerName: buyerName, SONumber: soNumber };
          }
          acc[key].Total += parseFloat(item.Total) || 0;
          acc[key].TotalRequiredQty = (totalOrderQty * acc[key].Total).toFixed(2);
          return acc;
        }, {});

        setBoughtOutTable(Object.values(groupedItems));
        setShowTable(true);
      } else {
        alert("No bought-out items found");
      }
    } catch (err) {
      alert("Error fetching bought-out items");
    } finally {
      setLoading(false);
    }
  };

  // Submit
  const handleSubmit = async () => {
    if (boughtOutTable.length === 0) {
      alert("No items to save");
      return;
    }

    try {
      const payload = {
        salesOrderNumber: salesForm.soNumber,
        buyerName: salesForm.buyerName,
        BoughtOutItems: boughtOutTable
      };
      
      await axios.post(`${API_ENDPOINTS.RawMaterial}/SaveBoughtOutItems`, payload);
      alert("Saved Successfully!");
      window.location.reload();
    } catch (err) {
      alert("Error saving data");
    }
  };

  return (
    <div className="container p-2 shadow-sm bg-white border rounded">
      <h4 className="mb-4  text-primary p-2">BOUGHTOUT REQUIREMENT</h4>
      
      {/* 1st Form Row */}
      <div className='row'>
        <div className="col">
          <label className="label-color">Order Type *</label>
          <select 
            className="select-field-style" 
            value={salesForm.orderType} 
            onChange={(e) => handleSalesChange('orderType', e.target.value)}
          >
            <option value="">SELECT TYPE</option>
            <option value="CUSTOM">CUSTOM</option>
            <option value="GENERIC">GENERIC</option>
          </select>
        </div>
        <div className="col">
          <label className="label-color">Buyer Name *</label>
          <select 
            className="select-field-style" 
            value={salesForm.buyerName} 
            onChange={(e) => handleSalesChange('buyerName', e.target.value)}
            disabled={!salesForm.orderType}
          >
            <option value="">SELECT BUYER</option>
            {dropdowns.buyerNames.map((buyer, i) => (
              <option key={i} value={buyer}>{buyer}</option>
            ))}
          </select>
        </div>
        <div className="col">
          <label className="label-color">SO Number *</label>
          <select 
            className="select-field-style" 
            value={salesForm.soNumber} 
            onChange={(e) => handleSalesChange('soNumber', e.target.value)}
            disabled={!salesForm.buyerName}
          >
            <option value="">SELECT NUMBER</option>
            {dropdowns.soNumbers.map((so, i) => (
              <option key={i} value={so.sono}>{so.sono}</option>
            ))}
          </select>
        </div>
        <div className="col">
          <label className="label-color">Item Name *</label>
          <select 
            className="select-field-style " 
            value={salesForm.itemName} 
            onChange={(e) => handleSalesChange('itemName', e.target.value)}
            disabled={!salesForm.soNumber}
          >
            <option value="">SELECT NAME</option>
            {dropdowns.itemNames.map((item, i) => (
              <option key={i} value={item.ItemName}>{item.ItemName}</option>
            ))}
          </select>
        </div>
        <div className="col">
          <label className="label-color font-weight-bold text-primary">Grade *</label>
          <select 
            className="select-field-style " 
            value={salesForm.grade} 
            onChange={(e) => handleSalesChange('grade', e.target.value)}
            disabled={!salesForm.itemName}
          >
            <option value="">SELECT GRADE</option>
            {dropdowns.grades.map((grade, i) => (
              <option key={i} value={grade.grade}>{grade.grade}</option>
            ))}
          </select>
        </div>
        <div className="col" style={{alignItems: 'flex-end'}}>
          <label className="label-color">&nbsp;</label>
          <button 
            className="add-btn" 
            onClick={searchSalesOrder} 
            disabled={loading}
            style={{width: '100%', height: '45px'}}
          >
            {loading ? 'Searching...' : 'SEARCH'}
          </button>
        </div>
      </div>

      {/* Sales Order Details - Shows after 1st SEARCH */}
      {showSalesDetails && (
        <div className="row mt-4">
          <div className="col">
            <label className="label-color">Item Code</label>
            <input className="input-field-style bg-light" value={salesDetails.Itemcode || ''} readOnly />
          </div>
          <div className="col">
            <label className="label-color">Item Name</label>
            <input className="input-field-style bg-light" value={salesDetails.ItemName || ''} readOnly />
          </div>
          <div className="col">
            <label className="label-color">Grade</label>
            <input className="input-field-style bg-light" value={salesDetails.Grade || ''} readOnly />
          </div>
          <div className="col">
            <label className="label-color">UOM</label>
            <input className="input-field-style bg-light" value={salesDetails.UOM || ''} readOnly />
          </div>
          <div className="col">
            <label className="label-color">Quantity</label>
            <input className="input-field-style bg-light" value={salesDetails.Plan_Production || ''} readOnly />
          </div>
        </div>
      )}

      {/* 2nd Form Row */}
      <div className='row mt-4'>
        <div className="col">
          <label className="label-color">Level 1 Item</label>
          <select 
            className="select-field-style" 
            value={level1Form.level1Item} 
            onChange={(e) => handleLevel1Change('level1Item', e.target.value)}
          >
            <option value="">SELECT LEVEL 1 ITEM</option>
            {/* Populate from your level1Items prop or API */}
            {dropdowns.level1Items.map((item, i) => (
              <option key={i} value={item.Value}>{item.Text}</option>
            ))}
          </select>
        </div>
        <div className="col">
          <label className="label-color">Item Code</label>
          <select 
            className="select-field-style" 
            value={level1Form.itemCode} 
            onChange={(e) => handleLevel1Change('itemCode', e.target.value)}
            id="level1-itemcode"
          >
            <option value="">SELECT CODE</option>
            {dropdowns.level1ItemCodes.map((item, i) => (
              <option key={i} value={item.ItemCode}>{item.ItemCode}</option>
            ))}
          </select>
        </div>
        <div className="col">
          <label className="label-color">Grade</label>
          <select 
            className="select-field-style" 
            value={level1Form.grade} 
            onChange={(e) => handleLevel1Change('grade', e.target.value)}
            id="level1-grade"
          >
            <option value="">SELECT GRADE</option>
            {dropdowns.level1Grades.map((grade, i) => (
              <option key={i} value={grade.Grade} data-fpbid={grade.FPBID}>{grade.Grade}</option>
            ))}
          </select>
        </div>
        <div className="col" style={{alignItems: 'flex-end'}}>
          <label className="label-color">&nbsp;</label>
          <button 
            className="add-btn" 
            onClick={searchBoughtOut} 
            disabled={loading || !showSalesDetails}
            style={{width: '100%', height: '45px'}}
          >
            {loading ? 'Searching...' : 'SEARCH'}
          </button>
        </div>
      </div>

      {/* Bought Out Table - Shows after 2nd SEARCH */}
      {showTable && (
        <div className="mt-4">
          <div className="text-center mb-3" style={{fontSize: '20px', fontWeight: 'bold', fontFamily: 'Cambria'}}>
            BOUGHTOUT PARTS LIST
          </div>
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-dark tblheading">
                <tr>
                  <th>Item Name RM</th>
                  <th>Item Code RM</th>
                  <th>Grade</th>
                  <th>Buyer Name</th>
                  <th>SO Number</th>
                  <th>UOM</th>
                  <th>Procure Type</th>
                  <th>Quantity</th>
                  <th>Total Required Qty</th>
                </tr>
              </thead>
              <tbody>
                {boughtOutTable.map((item, index) => (
                  <tr key={index}>
                    <td>{item.ItemName}</td>
                    <td>{item.ItemCode}</td>
                    <td>{item.Grade}</td>
                    <td>{item.BuyerName}</td>
                    <td>{item.SONumber}</td>
                    <td>{item.UnitOfMeasurement}</td>
                    <td>{item.ProcureType}</td>
                    <td>{item.Total?.toFixed(2)}</td>
                    <td>{item.TotalRequiredQty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="text-center mt-3">
            <button 
              className="btn btn-success btn-lg px-5" 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'SUBMIT'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrougthOutRequirement;
