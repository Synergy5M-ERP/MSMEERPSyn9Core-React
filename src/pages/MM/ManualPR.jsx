

import React, { useState } from "react";
import CreateManualPR from "./CreateManualPR";
import ViewManualPR from "./ViewManualPR";

import CreateReport from "./CreateReport";

function ManualPR() {
  const [selectedPage, setSelectedPage] = useState("view");
  const [editData, setEditData] = useState(null);

  // Handler to switch to edit mode
  const handleEditRecord = (record) => {
    setEditData(record);
    setSelectedPage("view");
  };

  // Handler to clear edit mode after save/cancel
  const handleClearEdit = () => {
    setEditData(null);
  };

  return (
    <div style={{ minHeight: "80vh" }}>
      <h2 style={{ textAlign: "left", color: "#0066cc", marginBottom: 0 }}>
        Manual PR
      </h2>

      {/* Page Selector */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '30px',
          // marginTop: '22px',
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
              value="view"
              checked={selectedPage === 'view'}
              onChange={() => {
                setSelectedPage('view');
                setEditData(null);
              }}
              style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
            />
            View
          </label>
          <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
            <input
              type="radio"
              name="configTab"
              value="create"
              checked={selectedPage === 'create'}
              onChange={() => {
                setSelectedPage('create');
                setEditData(null); // Clear edit when manually switching
              }}
              style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
            />
            {editData ? 'Edit Manual PR' : 'Create Manual PR'}
          </label>
          
      
          
          <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
            <input
              type="radio"
              name="configTab"
              value="crystalReport"
              checked={selectedPage === 'crystalReport'}
              onChange={() => setSelectedPage('crystalReport')}
              style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
            />
            Crystal Report
          </label>
        </div>
      </div>

      {/* Render selected page */}
      <div>
        {selectedPage === 'create' ? (
          <CreateManualPR editData={editData} onClearEdit={handleClearEdit} />
        ) : selectedPage === 'view' ? (
          <ViewManualPR onEdit={handleEditRecord} />
        ) : (
          <CreateReport />
        )}
      </div>
    </div>
  );
}

export default ManualPR;