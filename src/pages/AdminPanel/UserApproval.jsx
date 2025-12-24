import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import "./ModuleUserData.css";
import { API_ENDPOINTS } from "../../config/apiconfig";

//const API_URL = "https://msmeerpsyn9-core.azurewebsites.net/api/HRMAdminRegAPI/Login/ModuleUserData";

function ModuleUserData() {
  const [users, setUsers] = useState([]);
const [modalMode, setModalMode] = useState(""); // "approve" or "edit"

  // ===== MODAL STATES =====
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showModuleDashboard, setShowModuleDashboard] = useState(false);

  const [selectedEmpCode, setSelectedEmpCode] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("");
  const [rejectReason, setRejectReason] = useState("");
const [isAllSelected, setIsAllSelected] = useState(false);

  const [viewData, setViewData] = useState(null);

const [moduleData, setModuleData] = useState({
  MaterialManagementModule: false,
  SalesAndMarketingModule: false,
  HRAndAdminModule: false,
  AccountAndFinanceModule: false,
  MastersModule: false,
  DashboardModule: false,
  ProductionAndQualityModule: false,
  External_buyer_seller: false,
});




  // ================= FETCH USERS =================
 const loadData = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.ModuleUserData);
    setUsers(Array.isArray(response.data) ? response.data : []);
  } catch (error) {
    console.error("Error loading users:", error);
  }
};

  useEffect(() => {
    loadData();
  }, []);

 const fetchViewData = async (id, empCode) => {
  try {
    const res = await axios.get(API_ENDPOINTS.GetUserDetails, {
      params: { id, empcode: empCode }
    });

    if (res.data.success) {
      setViewData(res.data.data);
      setShowViewModal(true);
    } else {
      alert("No data found");
    }
  } catch (error) {
    console.error("Error fetching view data:", error);
  }
};


  // ======================================================
  // ⭐⭐ OPEN MODULE DASHBOARD
  // ======================================================
 const handleModuleDashboardOpen = async (id, empCode) => {
  setShowModuleDashboard(true);
  setViewData(null);

  try {
    const res = await axios.get(API_ENDPOINTS.GetUserModules, {
      params: { id, empCode }
    });

    if (res.data.success) {
      const user = res.data.user;
      setViewData(user);

      const updatedModules = {
        MaterialManagementModule: user.materialManagement ?? false,
        SalesAndMarketingModule: user.salesAndMarketing ?? false,
        HRAndAdminModule: user.hrAndAdmin ?? false,
        AccountAndFinanceModule: user.accountAndFinance ?? false,
        MastersModule: user.masters ?? false,
        DashboardModule: user.dashboard ?? false,
        ProductionAndQualityModule: user.productionAndQuality ?? false,
        External_buyer_seller: user.external_buyer_seller ?? false,
      };

      setModuleData(updatedModules);
      setIsAllSelected(Object.values(updatedModules).every(Boolean));
    }
  } catch (err) {
    console.error("Error loading user modules", err);
  }
};


const handleSelectAll = (e) => {
  const checked = e.target.checked;

  setIsAllSelected(checked);

  setModuleData({
    MaterialManagementModule: checked,
    SalesAndMarketingModule: checked,
    HRAndAdminModule: checked,
    AccountAndFinanceModule: checked,
    MastersModule: checked,
    DashboardModule: checked,
    ProductionAndQualityModule: checked,
    External_buyer_seller: checked,
  });
};

  const handleModuleChange = (e) => {
  const { name, checked } = e.target;

  const updatedData = {
    ...moduleData,
    [name]: checked,
  };

  setModuleData(updatedData);

  // 🔥 Auto check/uncheck Select All
  const allChecked = Object.values(updatedData).every(Boolean);
  setIsAllSelected(allChecked);
};


const handleModuleSubmit = async () => {
  try {
    const payload = {
      Emp_Code: selectedEmpCode,
      username: viewData.username, // include username
      UserRole: viewData.UserRole ?? "User", // include UserRole or default
      ...moduleData
    };

    const res = await axios.post(API_ENDPOINTS.UpdateUserModules, payload);

    if (res.data.success) {
      alert(
        modalMode === "approve"
          ? "Modules assigned successfully!"
          : "Modules updated successfully!"
      );
      setShowModuleDashboard(false);
      loadData();
    } else {
      alert("Failed to update modules.");
    }
  } catch (error) {
    console.error(error);
    alert("Error while submitting modules.");
  }
};

  // ============ REJECT USER ============
  const rejectUser = () => {
    window.location.href = `/Login/Reject?Id=${selectedEmpCode}&Email=${selectedEmail}&msg=${rejectReason}`;
  };

 const columns = [
  { name: "Emp Code", selector: row => row.emp_Code, sortable: true },

  {
    name: "Employee Name",
    selector: row => `${row.name ?? ""} ${row.surname ?? ""}`.trim(),
    sortable: true,
    className: "employee-name-col",
  },

  { name: "Gender", selector: row => row.gender },
  { name: "Contact No", selector: row => row.contact_NO },

  {
    name: "Email",
    selector: row => row.email,
    className: "employee-email-col",
  },

  { name: "Password", selector: row => row.password },
  { name: "Permanent Address", selector: row => row.permanent_address },
  { name: "Country", selector: row => row.country },
  { name: "State", selector: row => row.state },
  { name: "City", selector: row => row.city },
  { name: "Joining Date", selector: row => row.joiningdate },
  { name: "Department", selector: row => row.department },


    {
    name: "ACTION",
    width: "180px",
    cell: (row) => (
      <div className="action-column">
        <button className="action-btn view" onClick={() => fetchViewData(row.id, row.emp_Code)}>
          <i className="fas fa-eye"></i>
        </button>

     <button
  className="action-btn approve"
  onClick={() => {
    setModalMode("approve"); // <-- approve mode
    setSelectedEmpCode(row.emp_Code);

    // Open modal with all checkboxes unchecked
    setModuleData({
      MaterialManagementModule: false,
      SalesAndMarketingModule: false,
      HRAndAdminModule: false,
      AccountAndFinanceModule: false,
      MastersModule: false,
      DashboardModule: false,
      ProductionAndQualityModule: false,
      External_buyer_seller: false,
    });
    setIsAllSelected(false);
    setShowModuleDashboard(true);
  }}
>
  <i className="fas fa-user-check"></i>
</button>

<button
  className="action-btn edit"
  onClick={() => {
    setModalMode("edit"); // <-- edit mode
    setSelectedEmpCode(row.emp_Code);
    handleModuleDashboardOpen(row.id, row.emp_Code); // load existing modules
  }}
>
  <i className="fas fa-edit"></i>
</button>

        <button
          className="action-btn delete"
          onClick={() => {
            setSelectedEmpCode(row.emp_Code);
            setSelectedEmail(row.email);
            setShowRejectModal(true);
          }}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
    ),
  },
];
  // ======================================================
  //                 RETURN JSXs
  // ======================================================
  return (
    <div className="container mt-4">
<h2 className="text-center user-management-title">
  User Management Panel
</h2>

      <DataTable
        columns={columns}
        data={users}
        keyField="id"
        pagination
        highlightOnHover
        striped
        responsive
      />

  {/* ====================== VIEW MODAL ====================== */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="text-primary">User Details</Modal.Title>
        </Modal.Header>

       <Modal.Body>
  {!viewData ? (
    <h4>Loading...</h4>
  ) : (
<div className="container py-3">
  <div className="row g-3">
    <div className="col-md-3 col-sm-4 col-6">
      <div className="text-center p-3  rounded">
        <div className="fw-bold text-primary mb-1">Username</div>
        <div className="fs-6">{viewData.username || "N/A"}</div>
      </div>
    </div>

    <div className="col-md-3 col-sm-4 col-6">
      <div className="text-center p-3  rounded">
        <div className="fw-bold text-primary mb-1">Full Name</div>
        <div className="fs-6">{`${viewData.name ?? ""} ${viewData.surname ?? ""}`.trim() || "N/A"}</div>
      </div>
    </div>

    <div className="col-md-3 col-sm-4 col-6">
      <div className="text-center p-3  rounded">
        <div className="fw-bold text-primary mb-1">Contact</div>
        <div className="fs-6">{viewData.contact_NO || "N/A"}</div>
      </div>
    </div>

    <div className="col-md-3 col-sm-4 col-6">
      <div className="text-center p-3  rounded">
        <div className="fw-bold text-primary mb-1">Email</div>
        <div className="fs-6">{viewData.email || "N/A"}</div>
      </div>
    </div>

    <div className="col-md-3 col-sm-4 col-6">
      <div className="text-center p-3  rounded">
        <div className="fw-bold text-primary mb-1">Gender</div>
        <div className="fs-6">{viewData.gender || "N/A"}</div>
      </div>
    </div>

    <div className="col-md-3 col-sm-4 col-6">
      <div className="text-center p-3  rounded">
        <div className="fw-bold text-primary mb-1">Department</div>
        <div className="fs-6">{viewData.department || "N/A"}</div>
      </div>
    </div>

    <div className="col-md-3 col-sm-4 col-6">
      <div className="text-center p-3  rounded">
        <div className="fw-bold text-primary mb-1">Designation</div>
        <div className="fs-6">{viewData.joining_Designation || "N/A"}</div>
      </div>
    </div>

    <div className="col-md-3 col-sm-4 col-6">
      <div className="text-center p-3  rounded">
        <div className="fw-bold text-primary mb-1">Emp Code</div>
        <div className="  w-100 p-2">{viewData.emp_Code || "N/A"}</div>
      </div>
    </div>

    <div className="col-md-6 col-12">
      <div className="text-center p-3  rounded">
        <div className="fw-bold text-primary mb-1">Joining Date</div>
        <div className="fs-6">
          {viewData.date_Of_Joing 
            ? new Date(viewData.date_Of_Joing).toLocaleDateString('en-IN')
            : "N/A"}
        </div>
      </div>
    </div>

    <div className="col-md-6 col-12">
      <div className="text-center p-3  rounded">
        <div className="fw-bold text-primary mb-1">Address</div>
        <div className="fs-6">{viewData.permanent_Address || "N/A"}</div>
      </div>
    </div>
  </div>
</div>

  )}
</Modal.Body>


        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>


      {/* ================================================= */}
      {/* -------------- REJECT MODAL --------------------- */}
      {/* ================================================= */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reject User</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <label>Reason for Rejection:</label>
          <textarea
            className="form-control"
            rows="4"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          ></textarea>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Close
          </Button>

          <Button variant="danger" onClick={rejectUser}>
            Reject User
          </Button>
        </Modal.Footer>
      </Modal>

    {/* ===================== MODULE DASHBOARD MODAL ===================== */}
<Modal
  show={showModuleDashboard}
  onHide={() => setShowModuleDashboard(false)}
  size="lg"
  centered
  dialogClassName="module-access-modal"
>

<Modal.Header closeButton>
  <div className="module-header-box mb-3 p-3">
    <h5 className="mb-0">
      {modalMode === "approve" ? "Assign Modules" : "Edit Modules"}
    </h5>
  </div>
</Modal.Header>

  <Modal.Body>
    {!viewData ? (
      <h5>Loading...</h5>
    ) : (
      <>
       

        <Form>
        <Form.Check
  type="checkbox"
  label="Select All Modules"
  name="selectAll"
  checked={isAllSelected}
  onChange={handleSelectAll}
  className="fw-bold mb-3"
/>

          <Row className="gy-3">
            <Col md={6}>
              <Form.Check
                type="checkbox"
                label="Material Management Module"
                name="MaterialManagementModule"
                checked={moduleData.MaterialManagementModule}
                onChange={handleModuleChange}
                className="module-checkbox"
              />

              <Form.Check
                type="checkbox"
                label="Sales & Marketing Module"
                name="SalesAndMarketingModule"
                checked={moduleData.SalesAndMarketingModule}
                onChange={handleModuleChange}
                className="module-checkbox"
              />

              <Form.Check
                type="checkbox"
                label="HR & Admin Module"
                name="HRAndAdminModule"
                checked={moduleData.HRAndAdminModule}
                onChange={handleModuleChange}
                className="module-checkbox"
              />

              <Form.Check
                type="checkbox"
                label="Accounts & Finance Module"
                name="AccountAndFinanceModule"
                checked={moduleData.AccountAndFinanceModule}
                onChange={handleModuleChange}
                className="module-checkbox"
              />
            </Col>

            <Col md={6}>
              <Form.Check
                type="checkbox"
                label="Masters Module"
                name="MastersModule"
                checked={moduleData.MastersModule}
                onChange={handleModuleChange}
                className="module-checkbox"
              />

              <Form.Check
                type="checkbox"
                label="Dashboard Module"
                name="DashboardModule"
                checked={moduleData.DashboardModule}
                onChange={handleModuleChange}
                className="module-checkbox"
              />

              <Form.Check
                type="checkbox"
                label="Production & Quality Module"
                name="ProductionAndQualityModule"
                checked={moduleData.ProductionAndQualityModule}
                onChange={handleModuleChange}
                className="module-checkbox"
              />

              <Form.Check
                type="checkbox"
                label="External Buyer/Seller Module"
                name="External_buyer_seller"
                checked={moduleData.External_buyer_seller}
                onChange={handleModuleChange}
                className="module-checkbox"
              />
            </Col>
          </Row>
        </Form>
      </>
    )}
  </Modal.Body>

  <Modal.Footer>
    <Button variant="success" onClick={handleModuleSubmit}>
      Save Changes
    </Button>
    <Button variant="secondary" onClick={() => setShowModuleDashboard(false)}>
      Cancel
    </Button>
    
  </Modal.Footer>
</Modal>

    </div>
  );
}

export default ModuleUserData;
