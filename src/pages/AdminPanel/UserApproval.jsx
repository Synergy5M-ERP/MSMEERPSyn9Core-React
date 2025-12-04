import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import "./ModuleUserData.css";

const API_URL = "https://msmeerpsyn9-core.azurewebsites.net/api/HRMAdminRegAPI/Login/ModuleUserData";

function ModuleUserData() {
  const [users, setUsers] = useState([]);

  // ===== MODAL STATES =====
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showModuleDashboard, setShowModuleDashboard] = useState(false);

  const [selectedEmpCode, setSelectedEmpCode] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const [viewData, setViewData] = useState(null);

  // ===== USER MODULE STATE =====
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
      const response = await axios.get(API_URL);
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ================ VIEW MODAL =================
  const fetchViewData = async (id, empCode) => {
    try {
      const res = await axios.get(
        `https://msmeerpsyn9-core.azurewebsites.net/api/HRMAdminRegAPI/GetUserDetails?id=${id}&empcode=${empCode}`
      );

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
      const res = await axios.get(
        "https://msmeerpsyn9-core.azurewebsites.net/api/HRMAdminRegAPI/GetUserModules",
        { params: { id, empCode } }
      );

      if (res.data) {
        setViewData(res.data);

        setModuleData({
          MaterialManagementModule: res.data.materialManagementModule,
          SalesAndMarketingModule: res.data.salesAndMarketingModule,
          HRAndAdminModule: res.data.hrAndAdminModule,
          AccountAndFinanceModule: res.data.accountAndFinanceModule,
          MastersModule: res.data.mastersModule,
          DashboardModule: res.data.dashboardModule,
          ProductionAndQualityModule: res.data.productionAndQualityModule,
          External_buyer_seller: res.data.external_buyer_seller,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ============ MODULE CHANGE HANDLER ============
  const handleModuleChange = (e) => {
    const { name, checked } = e.target;
    setModuleData((prev) => ({ ...prev, [name]: checked }));
  };

  // ============ MODULE SUBMIT ============
  const handleModuleSubmit = async () => {
    try {
      const payload = {
        Emp_Code: selectedEmpCode,
        ...moduleData,
      };

      const res = await axios.post(
        "https://msmeerpsyn9-core.azurewebsites.net/api/HRMAdminRegAPI/UpdateUserModules",
        payload
      );

      if (res.data.success) {
        alert("Modules updated successfully!");
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
  { name: "EMP_CODE", selector: row => row.emp_Code, sortable: true },

  {
  name: "EMPLOYEE NAME",
  selector: row => `${row.name ?? ""} ${row.surname ?? ""}`.trim(),
  sortable: true,
  className: "employee-name-col",
},



  { name: "GENDER", selector: row => row.gender },
  { name: "CONTACT_NO", selector: row => row.contact_NO },
{
  name: "EMAIL",
  selector: row => row.email,
  className: "employee-email-col",
},
  { name: "PASSWORD", selector: row => row.password },
  { name: "PERMANENT_ADDRESS", selector: row => row.permanent_address },
  { name: "COUNTRY", selector: row => row.country },
  { name: "STATE", selector: row => row.state },
  { name: "CITY", selector: row => row.city },
  { name: "JOINING_DATE", selector: row => row.joiningdate },
  { name: "DEPARTMENT", selector: row => row.department },


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
            setSelectedEmpCode(row.emp_Code);
            handleModuleDashboardOpen(row.id, row.emp_Code);
          }}
        >
          <i className="fas fa-user-check"></i>
        </button>

        <button
          className="action-btn edit"
          onClick={() =>
            (window.location.href = `/Login/UpdateModuleDashborad?Id=${row.id}&empcode=${row.emp_Code}`)
          }
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
  //                 RETURN JSX
  // ======================================================
  return (
    <div className="container mt-4">
      <h2 className="text-center user-management-title">USER MANAGEMENT PANEL</h2>

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
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>

       <Modal.Body>
  {!viewData ? (
    <h4>Loading...</h4>
  ) : (
    <div className="container">

      <div className="row mb-2">
        <div className="col-md-4 fw-bold">USERNAME:</div>
        <div className="col-md-8">{viewData.username}</div>
      </div>

      <div className="row mb-2">
        <div className="col-md-4 fw-bold">PASSWORD:</div>
        <div className="col-md-8">{viewData.password}</div>
      </div>

      <div className="row mb-2">
        <div className="col-md-4 fw-bold">NAME:</div>
        <div className="col-md-8">{viewData.name}</div>
      </div>

      <div className="row mb-2">
        <div className="col-md-4 fw-bold">SURNAME:</div>
        <div className="col-md-8">{viewData.surname}</div>
      </div>

      <div className="row mb-2">
        <div className="col-md-4 fw-bold">CONTACT:</div>
        <div className="col-md-8">{viewData.contact_NO}</div>
      </div>

      <div className="row mb-2">
        <div className="col-md-4 fw-bold">EMAIL:</div>
        <div className="col-md-8">{viewData.email}</div>
      </div>

      <div className="row mb-2">
        <div className="col-md-4 fw-bold">GENDER:</div>
        <div className="col-md-8">{viewData.gender}</div>
      </div>

      <div className="row mb-2">
        <div className="col-md-4 fw-bold">ADDRESS:</div>
        <div className="col-md-8">{viewData.permanent_Address}</div>
      </div>

      <div className="row mb-2">
        <div className="col-md-4 fw-bold">DEPARTMENT:</div>
        <div className="col-md-8">{viewData.department}</div>
      </div>

      <div className="row mb-2">
        <div className="col-md-4 fw-bold">DESIGNATION:</div>
        <div className="col-md-8">{viewData.joining_Designation}</div>
      </div>

      <div className="row mb-2">
        <div className="col-md-4 fw-bold">AUTHORITY:</div>
        <div className="col-md-8">{viewData.joining_AuthorityLevel}</div>
      </div>

      <div className="row mb-2">
        <div className="col-md-4 fw-bold">DATE OF JOINING:</div>
        <div className="col-md-8">
          {viewData.date_Of_Joing 
            ? new Date(viewData.date_Of_Joing).toLocaleDateString()
            : ""}
        </div>
      </div>

      <div className="row mb-2">
        <div className="col-md-4 fw-bold">EMP CODE:</div>
        <div className="col-md-8">{viewData.emp_Code}</div>
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
    <Modal.Title>User Module Access</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    {!viewData ? (
      <h5>Loading...</h5>
    ) : (
      <>
        <div className="module-header-box mb-3 p-3">
          <h5 className="mb-0">Select Modules to Assign</h5>
        </div>

        <Form>
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
    <Button variant="secondary" onClick={() => setShowModuleDashboard(false)}>
      Cancel
    </Button>
    <Button variant="success" onClick={handleModuleSubmit}>
      Save Changes
    </Button>
  </Modal.Footer>
</Modal>

    </div>
  );
}

export default ModuleUserData;
