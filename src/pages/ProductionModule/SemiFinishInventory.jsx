import React, { useState } from "react";
import NotCreated from "../../components/NotCreated";
import SemiFinishInventoryIssuePass from "./SemiFinishInventoryIssuePass";
import CreateInventory from "./CreateInventory";
import SemiFinishReceivedQty from "./SemiFinishReceivedQty";

function SemiFinishInventory() {
  const [selectedPage, setSelectedPage] = useState("inventoryIssuePass");
  const [view, setView] = useState("active"); // active or inactive

  return (
    <div style={{ minHeight: "80vh" }}>
      {/* Page Selector */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '30px',
          marginTop: '22px',
          marginBottom: '12px',
          padding: '14px 0 14px 5px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.07)',
          background: '#fff',
        }}
      >
        <div style={{ display: 'flex', gap: '30px' }}>
          <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
            <input
              type="radio"
              name="configTab"
              value="inventoryIssuePass"
              checked={selectedPage === 'inventoryIssuePass'}
              onChange={() => setSelectedPage('inventoryIssuePass')}
              style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
            />
            Inventory Issue Pass
          </label>
          
          <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
            <input
              type="radio"
              name="configTab"
              value="createInventory"
              checked={selectedPage === 'createInventory'}
              onChange={() => setSelectedPage('createInventory')}
              style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
            />
            Create Inventory
          </label>

          <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
            <input
              type="radio"
              name="configTab"
              value="inventoryList"
              checked={selectedPage === 'inventoryList'}
              onChange={() => setSelectedPage('inventoryList')}
              style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
            />
            Inventory List
          </label>

          <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
            <input
              type="radio"
              name="configTab"
              value="receivedByProd"
              checked={selectedPage === 'receivedByProd'}
              onChange={() => setSelectedPage('receivedByProd')}
              style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
            />
            Received By Prod
          </label>
        </div>
      </div>

      {/* Render selected page with COMPLETE ternary operator chain */}
      <div>
        {selectedPage === 'inventoryIssuePass' ? (
          <SemiFinishInventoryIssuePass />
        ) : selectedPage === 'createInventory' ? (
          <CreateInventory />
        ) : selectedPage === 'inventoryList' ? (
          <NotCreated />
        ) : selectedPage === 'receivedByProd' ? (
          <SemiFinishReceivedQty />
        ) : null}
      </div>
    </div>
  );
}

export default SemiFinishInventory;
