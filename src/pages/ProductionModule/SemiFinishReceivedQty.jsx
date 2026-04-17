import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';


const SemiFinishReceivedQty = () => {
  // Form state
  const [formData, setFormData] = useState({
    orderType: '',
    buyerName: '',
    salesOrderNumber: '',
    finishGrade: '',
    itemName: '',
    grade: '',
    planCode: '',
    planDate: ''
  });

  // Dropdown options state
  const [dropdownOptions, setDropdownOptions] = useState({
    buyerNames: [],
    salesOrderNumbers: [],
    finishGrades: [],
    itemNames: [],
    grades: [],
    planCodes: []
  });

  // Table data state
  const [tableData, setTableData] = useState({ plan: null, products: [] });
  const [showTable, setShowTable] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Product details state for calculations
  const [productDetails, setProductDetails] = useState([]);

  const API_BASE = '/Product';
  const submitButtonRef = useRef(null);

  // Format date helper
  const formatDate = (jsonDate) => {
    if (!jsonDate) return '';
    try {
      const timestamp = parseInt(jsonDate.replace(/\/Date\((\d+)\)\//, '$1'));
      const date = new Date(timestamp);
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  // Fetch functions
  const fetchBuyerNames = useCallback(async (orderType) => {
    if (!orderType) {
      setDropdownOptions(prev => ({ ...prev, buyerNames: [] }));
      setFormData(prev => ({ ...prev, buyerName: '', salesOrderNumber: '', finishGrade: '', itemName: '', grade: '', planCode: '' }));
      return;
    }
    try {
      const response = await axios.get(`${API_BASE}/GetCustomGenericNo`, { params: { orderType } });
      setDropdownOptions(prev => ({ ...prev, buyerNames: response.data.quotations || [] }));
    } catch (error) {
      console.error('Error fetching buyer names:', error);
    }
  }, []);

  const fetchSalesOrderNumbers = useCallback(async (buyerName, orderType) => {
    if (!buyerName || !orderType) {
      setDropdownOptions(prev => ({ ...prev, salesOrderNumbers: [] }));
      setFormData(prev => ({ ...prev, salesOrderNumber: '', finishGrade: '', itemName: '', grade: '', planCode: '' }));
      return;
    }
    try {
      const response = await axios.get(`${API_BASE}/GetSONo`, { params: { BuyerName: buyerName, orderType } });
      setDropdownOptions(prev => ({ ...prev, salesOrderNumbers: response.data || [] }));
    } catch (error) {
      console.error('Error fetching SO numbers:', error);
    }
  }, []);

  const fetchFinishGrades = useCallback(async (salesOrderNumber, buyerName) => {
    if (!salesOrderNumber || !buyerName) {
      setDropdownOptions(prev => ({ ...prev, finishGrades: [] }));
      setFormData(prev => ({ ...prev, finishGrade: '', itemName: '', grade: '', planCode: '' }));
      return;
    }
    try {
      const response = await axios.get(`${API_BASE}/GetFinGrades`, { params: { salesOrderNumber, BuyerName: buyerName } });
      setDropdownOptions(prev => ({ ...prev, finishGrades: response.data || [] }));
    } catch (error) {
      console.error('Error fetching finish grades:', error);
    }
  }, []);

  const fetchItemNames = useCallback(async (salesOrderNumber, buyerName, finishGrade) => {
    if (!salesOrderNumber || !buyerName || !finishGrade) {
      setDropdownOptions(prev => ({ ...prev, itemNames: [] }));
      setFormData(prev => ({ ...prev, itemName: '', grade: '', planCode: '' }));
      return;
    }
    try {
      const response = await axios.get(`${API_BASE}/GetSemiFinNames`, {
        params: { salesOrderNumber, BuyerName: buyerName, finishgrade: finishGrade }
      });
      setDropdownOptions(prev => ({ ...prev, itemNames: response.data || [] }));
    } catch (error) {
      console.error('Error fetching item names:', error);
    }
  }, []);

  const fetchSemiFinGrades = useCallback(async (salesOrderNumber, buyerName, itemName, finishGrade) => {
    if (!salesOrderNumber || !buyerName || !itemName || !finishGrade) {
      setDropdownOptions(prev => ({ ...prev, grades: [] }));
      setFormData(prev => ({ ...prev, grade: '', planCode: '' }));
      return;
    }
    try {
      const response = await axios.get(`${API_BASE}/GetSemiFinGrades`, {
        params: { salesOrderNumber, BuyerName: buyerName, itemname: itemName, finishgrade: finishGrade }
      });
      setDropdownOptions(prev => ({ ...prev, grades: response.data || [] }));
    } catch (error) {
      console.error('Error fetching semi finish grades:', error);
    }
  }, []);

  const fetchPlanCodes = useCallback(async (salesOrderNumber, buyerName, itemName, grade, finishGrade) => {
    if (!salesOrderNumber || !buyerName || !itemName || !grade || !finishGrade) {
      setDropdownOptions(prev => ({ ...prev, planCodes: [] }));
      setFormData(prev => ({ ...prev, planCode: '' }));
      return;
    }
    try {
      const response = await axios.get(`${API_BASE}/GetSemiFinPlanCode`, {
        params: { salesOrderNumber, BuyerName: buyerName, itemname: itemName, grade, finishgrade: finishGrade }
      });
      setDropdownOptions(prev => ({ ...prev, planCodes: response.data || [] }));
    } catch (error) {
      console.error('Error fetching plan codes:', error);
    }
  }, []);

  // Handle dropdown changes
  const handleDropdownChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Reset dependent fields
    const resetMap = {
      orderType: ['buyerName', 'salesOrderNumber', 'finishGrade', 'itemName', 'grade', 'planCode'],
      buyerName: ['salesOrderNumber', 'finishGrade', 'itemName', 'grade', 'planCode'],
      salesOrderNumber: ['finishGrade', 'itemName', 'grade', 'planCode'],
      finishGrade: ['itemName', 'grade', 'planCode'],
      itemName: ['grade', 'planCode'],
      grade: ['planCode']
    };

    Object.entries(resetMap).forEach(([key, fields]) => {
      if (fields.includes(field)) {
        const newFormData = { ...formData, [key]: '' };
        fields.forEach(f => newFormData[f] = '');
        setFormData(newFormData);
        
        const optionKey = key === 'buyerName' ? 'buyerNames' :
                         key === 'salesOrderNumber' ? 'salesOrderNumbers' :
                         key === 'finishGrade' ? 'finishGrades' :
                         key === 'itemName' ? 'itemNames' :
                         key === 'grade' ? 'grades' : 'planCodes';
        setDropdownOptions(prev => ({ ...prev, [optionKey]: [] }));
      }
    });

    // Trigger next fetch
    const currentForm = { ...formData, [field]: value };
    switch (field) {
      case 'orderType':
        fetchBuyerNames(value);
        break;
      case 'buyerName':
        fetchSalesOrderNumbers(value, currentForm.orderType);
        break;
      case 'salesOrderNumber':
        fetchFinishGrades(value, currentForm.buyerName);
        break;
      case 'finishGrade':
        fetchItemNames(currentForm.salesOrderNumber, currentForm.buyerName, value);
        break;
      case 'itemName':
        fetchSemiFinGrades(currentForm.salesOrderNumber, currentForm.buyerName, value, currentForm.finishGrade);
        break;
      case 'grade':
        fetchPlanCodes(currentForm.salesOrderNumber, currentForm.buyerName, currentForm.itemName, value, currentForm.finishGrade);
        break;
    }
  };

  // Search function
  const handleSearch = async () => {
    const { salesOrderNumber, buyerName, itemName, grade, planCode, finishGrade } = formData;
    
    if (!salesOrderNumber || !buyerName || !itemName || !grade || !planCode || !finishGrade) {
      alert('Please select all fields.');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const response = await axios.get(`${API_BASE}/SearchSemiFinData`, {
        params: {
          salesOrderNumber,
          BuyerName: buyerName,
          itemname: itemName,
          grade,
          plancode: planCode,
          finishgrade: finishGrade
        }
      });

      if (response.data && response.data.products && response.data.products.length > 0) {
        setTableData(response.data);
        setProductDetails(response.data.products);
        setShowTable(true);
        setMessage('');
      } else {
        setMessage('THIS LOT IS ALREADY CHECKED.');
        setShowTable(false);
      }
    } catch (error) {
      setMessage('No data found for the given criteria.');
      setShowTable(false);
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate row values
  const calculateRowValues = (index) => {
    const updatedProducts = [...productDetails];
    const whqty = parseFloat(updatedProducts[index]?.qtygiventowh) || 0;
    const receivedqty = parseFloat(updatedProducts[index]?.receivedqty) || 0;
    const total = whqty - receivedqty;
    
    updatedProducts[index] = {
      ...updatedProducts[index],
      shortqty: total.toFixed(2)
    };
    
    setProductDetails(updatedProducts);
  };

  // Calculate totals
  const calculateTotals = () => {
    const totalReceivedQty = productDetails.reduce((sum, product) => sum + (parseFloat(product.receivedqty) || 0), 0);
    const totalShortQty = productDetails.reduce((sum, product) => sum + (parseFloat(product.shortqty) || 0), 0);
    
    // Update totals in state if needed
  };

  // Handle received qty change
  const handleReceivedQtyChange = (index, value) => {
    const updatedProducts = productDetails.map((product, i) => 
      i === index 
        ? { ...product, receivedqty: value }
        : product
    );
    setProductDetails(updatedProducts);
    calculateRowValues(index);
    calculateTotals();
  };

  // Submit function
  const handleSubmit = async () => {
    const validData = productDetails.filter(product => {
      const receivedQty = product.receivedqty?.toString().trim();
      return receivedQty !== '' && !isNaN(receivedQty);
    });

    if (validData.length === 0) {
      alert('Please enter received qty.');
      return;
    }

    const productionData = validData.map(product => ({
      PlanId: product.PlanId,
      CustProdId: product.CustProdId,
      shift: product.shift,
      PlanDate: formatDate(product.plandate),
      ReceivedQty: product.receivedqty,
      ShortQty: product.shortqty
    }));

    const planDateToSend = formatDate(productionData[0]?.PlanDate);

    setSubmitLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/SemiFinReceivedQty`, {
        productionData,
        planDate: planDateToSend
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data.success) {
        alert('Data saved successfully!');
        setShowTable(false);
        setProductDetails([]);
        setFormData({
          orderType: '',
          buyerName: '',
          salesOrderNumber: '',
          finishGrade: '',
          itemName: '',
          grade: '',
          planCode: ''
        });
        setDropdownOptions({
          buyerNames: [],
          salesOrderNumbers: [],
          finishGrades: [],
          itemNames: [],
          grades: [],
          planCodes: []
        });
      } else {
        alert('Failed to update data: ' + response.data.message);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Redirect to create label
  const redirectToCreateLabel = () => {
    if (tableData.plan && productDetails.length > 0) {
      const planRow = tableData.plan;
      const firstProduct = productDetails[0];
      
      const queryParams = new URLSearchParams({
        itemName: planRow.itemname || '',
        grade: planRow.grade || '',
        Sono: planRow.sonumber || '',
        uom: planRow.uom || '',
        buyerName: planRow.buyername || '',
        machineNumber: firstProduct.machinenumber || '',
        date: formatDate(planRow.date) || '',
        soqty: planRow.soqty || '',
        aqty: firstProduct.aqty || '',
        batchNo: firstProduct.batchno || '',
        rollNo: `${firstProduct.batchno || ''}/01`
      });

      window.location.href = `/Product/SemiFinLable?${queryParams.toString()}`;
    }
  };

  return (
  <>
   <style>{`
      /* RESET & CONTAINER */
      * { box-sizing: border-box; }
      
      /* LABELS - FIXED */
      .label-color {
        display: block !important;
        font-size: 16px !important;
        font-weight: 600 !important;
        color: #0066cc !important;
        margin-bottom: 8px !important;
        font-family: 'Segoe UI', sans-serif !important;
      }

      /* SELECT FIELDS - FIXED (NO COMMA, NO DUPLICATE) */
      .select-field-style {
        width: 100% !important;
        height: 40px !important;
       
        font-size: 16px !important;
        color: #333 !important;
        background-color: #ffffff !important;
        border: 1px solid #cbd5e1 !important;
        border-radius: 8px !important;
        transition: all 0.2s ease-in-out !important;
        font-family: 'Segoe UI', sans-serif !important;
        font-weight: 400 !important;
        cursor: pointer !important;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23334155'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E") !important;
        background-repeat: no-repeat !important;
        background-position: right 12px center !important;
        background-size: 16px !important;
        appearance: none !important;
      }
      .select-field-style:focus {
        border-color: #0066cc !important;
        box-shadow: 0 0 0 3px rgba(0,102,204,0.1) !important;
        outline: none !important;
      }
      .select-field-style:disabled {
        background-color: #f8f9fa !important;
        color: #6c757d !important;
      }

      /* LAYOUT - MISSING CLASSES */
      .row {
        display: flex !important;
        flex-wrap: wrap !important;
        margin: 0 -10px !important;
        gap: 20px !important;
      }
      .col {
        flex: 1 !important;
        min-width: 250px !important;
        padding: 0 10px !important;
      }
      @media (max-width: 768px) {
        .col { flex: 100% !important; min-width: auto !important; }
      }

      .form-group {
        margin-bottom: 20px !important;
      }

      .filter-form {
        margin-bottom: 30px !important;
      }

      /* BUTTONS */
      .search-btn, .submit-btn {
       width: 120px;        /* ✅ Fixed width */
  height: 48px;        /* ✅ Fixed height */
  background: linear-gradient(145deg, #40e40f, #218838);
  color: white;
  border: none;
  padding: 0;          /* ✅ Reset padding for exact size control */
  font-size: 18px;
  font-weight: 600;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center; 
      }
      .search-btn:hover:not(:disabled) {
        transform: translateY(-2px) !important;
        box-shadow: 0 4px 12px rgba(40,167,69,0.4) !important;
      }

      /* TABLES & OTHER CLASSES */
      .table { width: 100% !important; border-collapse: collapse !important; }
      .table-responsive { overflow-x: auto !important; }
      .tblheading th { 
        background: #495057 !important; 
        color: white !important; 
        padding: 12px !important; 
        text-align: center !important;
      }
      .tblbody td { 
        padding: 12px !important; 
        border: 1px solid #dee2e6 !important;
      }
      .msg-div {
        color: #dc3545 !important;
        text-align: center !important;
        font-size: 20px !important;
        font-weight: bold !important;
        padding: 20px !important;
        background: #f8d7da !important;
        border-radius: 8px !important;
      }
      hr {
        border: none !important;
        height: 2px !important;
        background: #dee2e6 !important;
        margin: 30px 0 !important;
      }
    `}</style>

    <div>
      <div className="row">
        {/* <div className="text-center">
          <h2 className="page-title">SEMI FINISHED RECEIVED QTY</h2>
        </div> */}

        {/* Filter Form */}
        <div className="filter-form row">
          <div className="col">
            <div className="form-group">
              <label className="label-color">Order Type</label>
              <select 
                className="select-field-style"
                value={formData.orderType}
                onChange={(e) => handleDropdownChange('orderType', e.target.value)}
              >
                <option value="">Select Type</option>
                <option value="CUSTOM">CUSTOM</option>
                <option value="GENERIC">GENERIC</option>
              </select>
            </div>
          </div>

          <div className="col">
            <div className="form-group">
              <label className="label-color">Buyer Name</label>
              <select 
                className="select-field-style"
                value={formData.buyerName}
                onChange={(e) => handleDropdownChange('buyerName', e.target.value)}
              >
                <option value="">SELECT BUYER</option>
                {dropdownOptions.buyerNames.map((buyer, index) => (
                  <option key={index} value={buyer}>{buyer}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="col">
            <div className="form-group">
              <label className="label-color">SO Number</label>
              <select 
                className="select-field-style"
                value={formData.salesOrderNumber}
                onChange={(e) => handleDropdownChange('salesOrderNumber', e.target.value)}
              >
                <option value="">SELECT NUMBER</option>
                {dropdownOptions.salesOrderNumbers.map((so, index) => (
                  <option key={index} value={so.sono}>{so.sono}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="col">
            <div className="form-group">
              <label className="label-color">Finish Grade</label>
              <select 
                className="select-field-style"
                value={formData.finishGrade}
                onChange={(e) => handleDropdownChange('finishGrade', e.target.value)}
              >
                <option value="">Select Finish Grade</option>
                {dropdownOptions.finishGrades.map((grade, index) => (
                  <option key={index} value={grade.Grade}>{grade.Grade}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="col">
            <div className="form-group">
              <label className="label-color">Semi Finish Item Name</label>
              <select 
                className="select-field-style"
                value={formData.itemName}
                onChange={(e) => handleDropdownChange('itemName', e.target.value)}
              >
                <option value="">Select Item Name</option>
                {dropdownOptions.itemNames.map((item, index) => (
                  <option key={index} value={item.Name}>{item.Name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="col">
            <div className="form-group">
              <label className="label-color">Semi Finish Grade</label>
              <select 
                className="select-field-style"
                value={formData.grade}
                onChange={(e) => handleDropdownChange('grade', e.target.value)}
              >
                <option value="">Select Grade</option>
                {dropdownOptions.grades.map((gradeItem, index) => (
                  <option key={index} value={gradeItem.grade}>{gradeItem.grade}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="col">
            <div className="form-group">
              <label className="label-color">Plan Code</label>
              <select 
                className="select-field-style"
                value={formData.planCode}
                onChange={(e) => handleDropdownChange('planCode', e.target.value)}
              >
                <option value="">Select Plan Code</option>
                {dropdownOptions.planCodes.map((plan, index) => (
                  <option key={index} value={plan.plancode}>{plan.plancode}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="col d-none">
            <div className="form-group">
              <label className="label-color">Plan Date</label>
              <input 
                type="text" 
                className="select-field-style" 
                value={formData.planDate}
                readOnly 
              />
            </div>
          </div>

          <div className="col">
            <div className="form-group">
              <button 
                className="btn btn-success search-btn"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? 'Searching...' : 'SEARCH'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <hr />

      {/* Message */}
      {message && (
        <div className="msg-div">
          {message}
        </div>
      )}

      {/* Results Table */}
      {showTable && tableData && (
        <div className="product-table">
          <div className="section-title">SO Detail</div>
          
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="tblheading">
                <tr>
                  <th>Prod Plan Date</th>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>Grade</th>
                  <th>UOM</th>
                  <th>Buyer Name</th>
                  <th>SO Number</th>
                  <th>SO Qty</th>
                </tr>
              </thead>
              <tbody className="tblbody">
                {tableData.plan && (
                  <tr>
                    <td>{formatDate(tableData.plan.date)}</td>
                    <td>{tableData.plan.itemcode || ''}</td>
                    <td>{tableData.plan.itemname || ''}</td>
                    <td>{tableData.plan.grade || ''}</td>
                    <td>{tableData.plan.uom || ''}</td>
                    <td>{tableData.plan.buyername || ''}</td>
                    <td>{tableData.plan.sonumber || ''}</td>
                    <td>{tableData.plan.soqty || ''}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="section-title">Shift Details</div>
          
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="tblheading">
                <tr>
                  <th>Location</th>
                  <th>Machine Name</th>
                  <th>Machine Number</th>
                  <th>Capacity</th>
                  <th>Plan Date</th>
                  <th>Shift</th>
                  <th>Op Name</th>
                  <th>Batch No</th>
                  <th>Plan Qty</th>
                  <th>Actual Qty</th>
                  <th>Rejection/Sample Qty</th>
                  <th>QtyToWH</th>
                  <th>Received Qty</th>
                  <th>Short Qty</th>
                </tr>
              </thead>
              <tbody className="tblbody">
                {productDetails.map((product, index) => (
                  <tr key={index}>
                    <td>{product.location || ''}</td>
                    <td>{product.machinename || ''}</td>
                    <td>{product.machinenumber || ''}</td>
                    <td>{product.capacity || ''}</td>
                    <td>{formatDate(product.plandate)}</td>
                    <td>{product.shift || ''}</td>
                    <td>{product.opname || ''}</td>
                    <td>{product.batchno || ''}</td>
                    <td>{product.planqty || ''}</td>
                    <td>
                      <input 
                        type="number" 
                        className="select-field-style actualqty"
                        value={product.aqty || ''}
                        disabled
                      />
                    </td>
                    <td>{product.rejeqty || ''}</td>
                    <td>
                      <input 
                        type="number" 
                        className="select-field-style qtygiventowh"
                        value={product.qtygiventowh || ''}
                        disabled
                      />
                    </td>
                    <td>
                      <input 
                        type="number" 
                        className="select-field-style receivedqty"
                        value={product.receivedqty || ''}
                        onChange={(e) => handleReceivedQtyChange(index, e.target.value)}
                      />
                    </td>
                    <td>
                      <input 
                        type="number" 
                        className="select-field-style shortqty"
                        value={product.shortqty || ''}
                        disabled
                      />
                    </td>
                    <input type="hidden" value={product.PlanId} />
                    <input type="hidden" value={product.CustProdId} />
                  </tr>
                ))}
                <tr className="total-row">
                  <td colSpan="12" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total:</td>
                  <td style={{ fontWeight: 'bold' }}>
                    {productDetails.reduce((sum, p) => sum + (parseFloat(p.receivedqty) || 0), 0).toFixed(2)}
                  </td>
                  <td style={{ fontWeight: 'bold' }}>
                    {productDetails.reduce((sum, p) => sum + (parseFloat(p.shortqty) || 0), 0).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="form-submit">
            <button 
              ref={submitButtonRef}
              className="btn btn-success submit-btn"
              onClick={handleSubmit}
              disabled={submitLoading}
            >
              {submitLoading ? 'Processing...' : 'SUBMIT'}
            </button>
            <button 
              className="btn btn-primary ml-2"
              onClick={redirectToCreateLabel}
            >
              CREATE LABEL
            </button>
          </div>
        </div>
      )}
    </div>
  </>
  );
};

export default SemiFinishReceivedQty;
