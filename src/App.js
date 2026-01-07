import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import AddEmployee from "./pages/HRM/EmployeeMaster/AddEmployee";

/* AUTH */
import RegisterPage from "./pages/RegisterPage";
import Login from "./pages/Login";

/* ACCOUNT */
import AccountTypePage from "./pages/Account/AccountTypePage";
import AccountPage from "./pages/Account/AccountPage";
import AccoutVoucherType from "./pages/Account/AccountVoucherType";
import AccountLedger from "./pages/Account/AccountLedger";
import AccountCompany from "./pages/Account/AccountCompany";
import AccountConfiguration from "./pages/Account/AccountConfiguration";
import AccountGroupSubgroup from "./pages/Account/AccountGroupSubgroup";
import AccountAndFinanceDashboard from "./pages/Account/AccountAndFinanceDashboard";

/* OTHER */
import CreditDebitNote from "./pages/Account/CreditDebitNote";
import Dashboard from "./pages/Dashboard";

/* MASTERS */
import MasterDashboard from "./pages/Masters/MasterConfiguration";
import CreateVendor from "./pages/Masters/vendorMaster/CreateVendor";
import ViewVendor from "./pages/Masters/vendorMaster/ViewVendor";
import CreateCommodity from "./pages/Masters/Commodity/CreateCommodity";
import ViewCommodity from "./pages/Masters/Commodity/ViewCommodity";
import ViewBOM from "./pages/Masters/BOM/ViewBOM";

/* HRM / SALES */
import HrmConfiguration from "./pages/HRM/HRMConfiguration";
import SalesDistribution from "./pages/Sales/SalesDistribution";
import WareHouse from "./pages/Sales/WareHouse";

/* MM */
import MMModule from "./pages/MM/MMModule";
import CreateEnquiryPage from "./pages/MM/StepWise";

/* PRODUCTION / QUALITY */
import ProductionModule from "./pages/ProductionModule/ProductionModule";
import QualityModule from "./pages/QualityModule/QualityModule";

/* ADMIN */
import AdminConfiguration from "./pages/AdminPanel/AdminConfiguration";

/* INVENTORY */
import InventoryAdd from "./pages/Masters/InventoryMaster/InventoryAdd";
import InventoryEdit from "./pages/Masters/InventoryMaster/InventoryEdit";

/* LAYOUT */
import Header from "./components/Header";
import Footer from "./components/Footer";

/* CSS */
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        {/* AUTH */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<Login />} />

        {/* DASHBOARD */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* ACCOUNT */}
        <Route path="/accounttype" element={<AccountTypePage />} />
        <Route path="/accountpage" element={<AccountPage />} />
        <Route path="/accountvouchertype" element={<AccoutVoucherType />} />
        <Route path="/accountledger" element={<AccountLedger />} />
        <Route path="/accountcompany" element={<AccountCompany />} />
        <Route path="/accountconfiguration" element={<AccountConfiguration />} />
        <Route path="/accfinancedashboard" element={<AccountAndFinanceDashboard />} />
        <Route path="/accountgroupsubgroup" element={<AccountGroupSubgroup />} />

        {/* INVENTORY */}
        <Route path="/inventory" element={<InventoryAdd />} />
        <Route path="/inventory/add" element={<InventoryAdd />} />
        <Route path="/inventory/edit/:id" element={<InventoryEdit />} />

        {/* MASTERS */}
        <Route path="/masters" element={<MasterDashboard />} />
        <Route path="/createvendor" element={<CreateVendor />} />
        <Route path="/viewvendor" element={<ViewVendor />} />
        <Route path="/commodity" element={<CreateCommodity />} />
        <Route path="/viewcommodity" element={<ViewCommodity />} />
        <Route path="/viewbom" element={<ViewBOM />} />

        {/* HRM / SALES */}
<Route path="/hrm/*" element={<HrmConfiguration />} />
        
        <Route path="/salesanddistribution" element={<SalesDistribution />} />
        <Route path="/warehouse" element={<WareHouse />} />

        {/* MM */}
        <Route path="/mm" element={<MMModule />} />
        <Route path="/indicator" element={<CreateEnquiryPage />} />

        {/* PRODUCTION / QUALITY */}
        <Route path="/production" element={<ProductionModule />} />
        <Route path="/quality" element={<QualityModule />} />

        {/* ADMIN */}
        <Route path="/admin/*" element={<AdminConfiguration />} />

        {/* OTHER */}
        <Route path="/creditdebitnote" element={<CreditDebitNote />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
