import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

/* AUTH */
import RegisterPage from "./pages/RegisterPage";
import Login from "./pages/Login";

/* ACCOUNT */
import AccountTypePage from "./pages/AccountTypePage";
import AccountPage from "./pages/AccountPage";
import AccoutVoucherType from "./pages/AccountVoucherType";
import AccountLedger from "./pages/AccountLedger";
import AccountCompany from "./pages/AccountCompany";
import AccountConfiguration from "./pages/AccountConfiguration";
import AccountGroupSubgroup from "./pages/AccountGroupSubgroup";
import AccountAndFinanceDashboard from "./pages/AccountAndFinanceDashboard";

/* OTHER */
import CreditDebitNote from "./pages/CreditDebitNote";
import Nullify from "./pages/Nullify";
import Masters from "./pages/Masters";
import CreateVendor from "./pages/CreateVendor";

/* INVENTORY */
import InventoryAdd from "./pages/InventoryAdd";
import InventoryEdit from "./pages/InventoryEdit";

/* LAYOUT */
import Header from "./components/Header";
import Footer from "./components/Footer";

/* CSS */
import "bootstrap-icons/font/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        {/* AUTH */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<Login />} />

        {/* ACCOUNT */}
        <Route path="/accounttype" element={<AccountTypePage />} />
        <Route path="/accountpage" element={<AccountPage />} />
        <Route path="/accountvouchertype" element={<AccoutVoucherType />} />
        <Route path="/accountledger" element={<AccountLedger />} />
        <Route path="/accountcompany" element={<AccountCompany />} />
        <Route path="/accountconfiguration" element={<AccountConfiguration />} />
        <Route path="/accfinancedashboard" element={<AccountAndFinanceDashboard />} />
        <Route path="/accountgroupsubgroup" element={<AccountGroupSubgroup />} />

        {/* OTHER */}
        <Route path="/creditdebitnote" element={<CreditDebitNote />} />
        <Route path="/nullify" element={<Nullify />} />
        <Route path="/masters" element={<Masters />} />
        <Route path="/createvendor" element={<CreateVendor />} />

        {/* INVENTORY */}
        <Route path="/inventory" element={<InventoryAdd />} />
        <Route path="/inventory/add" element={<InventoryAdd />} />

        {/* ✅ THIS WAS MISSING */}
        <Route path="/inventory/edit/:id" element={<InventoryEdit />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
