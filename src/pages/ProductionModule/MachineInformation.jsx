import React, { useState } from "react";
import MachineInfoForm from "./MachineInfoForm";
import MachineList from "./MachineList";
import '../../App.css'

function MachineInformation() {
  const [selectedPage, setSelectedPage] = useState("view");
  const [editData, setEditData] = useState(null);

  // Handler to switch to edit mode from the list
  const handleEditRecord = (record) => {
    setEditData(record);
    setSelectedPage("create");
  };

  // Handler to clear edit mode
  const handleClearEdit = () => {
    setEditData(null);
  };

  return (
    <div style={{ minHeight: "80vh" }}>
      <h2 style={{ textAlign: "left", color: "#0066cc"}}>
        Machine Management
      </h2>

      {/* Navigation Tab Selector */}
      <div
       className="radio-btn-header"
      >
        <div style={{ display: 'flex', gap: '30px' }}>
       
               <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
            <input
              type="radio"
              name="machineTab"
              value="view"
              checked={selectedPage === 'view'}
              onChange={() => {
                setSelectedPage('view');
                handleClearEdit();
              }}
              style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
            />
            View Machines
          </label>
             <label style={{ fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
            <input
              type="radio"
              name="machineTab"
              value="create"
              checked={selectedPage === 'create'}
              onChange={() => {
                setSelectedPage('create');
                handleClearEdit();
              }}
              style={{ width: 18, height: 18, cursor: 'pointer', marginRight: '8px' }}
            />
            {editData ? 'Edit Machine Info' : 'Create Machine Info'}
          </label>
               

        </div>
      </div>

      {/* Component Rendering */}
      <div style={{ background: '#fff', borderRadius: '8px' }}>
        {selectedPage === 'create' ? (
          <MachineInfoForm editData={editData} onClearEdit={handleClearEdit} />
        ) : (
          <MachineList onEdit={handleEditRecord} />
        )}
      </div>
    </div>
  );
}

export default MachineInformation;