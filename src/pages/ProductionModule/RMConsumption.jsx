import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { API_ENDPOINTS } from '../../config/apiconfig';

const RMConsumption = () => {
  const [planDate, setPlanDate] = useState('');
  const [tableData, setTableData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(false);

  const calculateInventory = async () => {
    if (!planDate) {
      alert("Please select a date.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_ENDPOINTS.RawMaterial}/CalculateMfgInventory`, { 
        selectedDate: planDate 
      });

      if (res.data.length > 0) {
        setTableData(res.data);
        setShowTable(true);
      } else {
        alert("No Bought Out Items found for " + planDate + ".");
        setShowTable(false);
      }
    } catch (err) {
      alert("Error calculating inventory");
      console.error("Calculate error:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveInventory = async () => {
    if (tableData.length === 0) {
      alert("No data to save");
      return;
    }

    setLoading(true);
    try {
      // Extract and merge items like original jQuery logic
      let boughtOutItems = [];
      
      tableData.forEach(mainItem => {
        if (mainItem.BoughtOutItems?.length > 0) {
          mainItem.BoughtOutItems.forEach(child => {
            let totalReqQty = mainItem.TotalActualQty * child.Qty;
            boughtOutItems.push({
              ItemName: child.ItemName,
              ItemCode: child.ItemCode,
              Grade: child.Grade,
              UOM: child.UOM,
              Level: child.Level,
              Qty: parseFloat(child.Qty),
              TotalConsumptionQty: parseFloat(totalReqQty),
              ConsumptionDate: planDate
            });
          });
        }
      });

      // Merge duplicate items by ItemName_Grade key
      let mergedItems = {};
      boughtOutItems.forEach(item => {
        let key = `${item.ItemName}_${item.Grade}`;
        if (!mergedItems[key]) {
          mergedItems[key] = { ...item };
        } else {
          mergedItems[key].TotalConsumptionQty += item.TotalConsumptionQty;
        }
      });

      const dedupedItems = Object.values(mergedItems);

      if (dedupedItems.length === 0) {
        alert("No bought out items to save.");
        return;
      }

      await axios.post(`${API_ENDPOINTS.RawMaterial}/SaveMfgBoughtOutItems`, dedupedItems, {
        headers: { 'Content-Type': 'application/json' }
      });

      alert("Bought out items saved successfully!");
      setShowTable(false);
      setTableData([]);
    } catch (err) {
      alert("Error saving data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container p-2 shadow-sm bg-white border rounded" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <style>{`
        
      `}</style>

      {/* Header */}
      <div className="heading">SEMI FINISHED REQUIREMENT</div>

      {/* Date & Calculate Button */}
      <div className='row align-items-end'>
        <div className="col-md-3">
          <label className="label-color">SEMI FINISHED PLAN DATE</label>
          <input 
            type="date" 
            className="input-field-style " 
            id="PlanDate"
            value={planDate}
            onChange={(e) => setPlanDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <button 
            id="btnCalculateInventory"
            className="add-btn"
            onClick={calculateInventory}
            disabled={loading}
          >
            {loading ? 'Calculating...' : 'CALCULATE'}
          </button>
        </div>
      </div>

      <br />

      {/* Results Table */}
      {showTable && (
        <div className="table-responsive">
          <table id="resultTable" className="table table-bordered">
            <thead className="tblheading">
              <tr>
                <th>ITEM CODE</th>
                <th>ITEM NAME</th>
                <th>GRADE</th>
                <th>UOM</th>
                <th>LEVEL</th>
                <th>QUANTITY</th>
                <th>TOTAL CONSUMPTION QTY</th>
              </tr>
            </thead>
            <tbody className="tblbody">
              {tableData.map((mainItem, mainIndex) => (
                <>
                  {/* Header Row for each main item */}
                  <tr key={`header-${mainIndex}`} className="header-row">
                    <td colSpan="7">
                      <strong>ITEM NAME:</strong> {mainItem.ItemName} &nbsp;&nbsp; 
                      <strong>GRADE:</strong> {mainItem.Grade} &nbsp;&nbsp; 
                      <strong>ACTUAL QTY:</strong> {mainItem.TotalActualQty} &nbsp;&nbsp; 
                      <strong>CONSUMPTION DATE:</strong> {planDate}
                    </td>
                  </tr>

                  {/* Child Items */}
                  {mainItem.BoughtOutItems && mainItem.BoughtOutItems.length > 0 ? (
                    mainItem.BoughtOutItems.map((child, childIndex) => {
                      const totalReqQty = mainItem.TotalActualQty * child.Qty;
                      return (
                        <tr key={`${mainIndex}-${childIndex}`}>
                          <td>{child.ItemCode}</td>
                          <td>{child.ItemName}</td>
                          <td>{child.Grade}</td>
                          <td>{child.UOM}</td>
                          <td>{child.Level}</td>
                          <td>{child.Qty?.toFixed(4)}</td>
                          <td>{totalReqQty.toFixed(4)}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr key={`no-items-${mainIndex}`}>
                      <td colSpan="7" className="no-items">NO BOUGHT OUT ITEMS FOUND</td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Save Button */}
      {showTable && (
        <button 
          id="btnSaveInventory" 
          className="btn btn-success btnheading btn-save" 
          onClick={saveInventory}
          disabled={loading}
        >
          {loading ? 'SAVING...' : 'SAVE CONSUMPTION'}
        </button>
      )}
    </div>
  );
};

export default RMConsumption;
