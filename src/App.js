import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import RegisterPage from "./pages/RegisterPage";
import Login from "./pages/Login";
import AccountTypePage from "./pages/Account/AccountTypePage";
import AccountPage from "./pages/Account/AccountPage";
//import AccountBankDetailsPage from "./pages/AccountBankDetailsPage";
import AccoutVoucherType from "./pages/Account/AccountVoucherType";
import AccountLedger from "./pages/Account/AccountLedger";
import AccountCompany from "./pages/Account/AccountCompany";
import AccountConfiguration from "./pages/Account/AccountConfiguration";
import AccountGroupSubgroup from "./pages/Account/AccountGroupSubgroup";
import Nullify from "./pages/Account/Nullify";
import CreditDebitNote from "./pages/Account/CreditDebitNote";

import AccountAndFinanceDashboard from "./pages/Account/AccountAndFinanceDashboard";

import Header from "./components/Header"; // ✅ default import
import Footer from "./components/Footer"; // ✅ default import

import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Masters from "./pages/Masters/Masters";
import CreateVendor from "./pages/Masters/vendorMaster/CreateVendor";
import MasterDashboard from "./pages/Masters/MasterConfiguration";
import ViewVendor from "./pages/Masters/vendorMaster/ViewVendor";
import CreateCommodity from "./pages/Masters/Commodity/CreateCommodity";
import ViewCommodity from "./pages/Masters/Commodity/ViewCommodity";
import HrmDashboard from "./pages/HRM/HrmDashboard";
import HrmConfiguration from "./pages/HRM/HRMConfiguration";
import SalesDistribution from "./pages/Sales/SalesDistribution";
import ViewBOM from "./pages/Masters/BOM/ViewBOM";


function App() {
  return (
    <Router>
      
      <Header />
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/accounttype" element={<AccountTypePage />} />
        <Route path="/AccountPage" element={<AccountPage />} />
        <Route path="/AccountVoucherType" element={<AccoutVoucherType/>}/>
        <Route path="/AccountLedger" element={<AccountLedger/>}/>
        <Route path="/AccountCompany" element={<AccountCompany/>}/>
        <Route path="/AccountConfiguration" element={<AccountConfiguration/>}/>
        <Route path="/AccFinancedashboard" element={<AccountAndFinanceDashboard/>}/>
         <Route path="/AccountGroupSubgroup" element={<AccountGroupSubgroup/>}/>
         <Route path="/CreditDebitNote" element={<CreditDebitNote/>}/>
         <Route path="/Nullify" element={<Nullify/>}/>

          <Route path="/Masters" element={<MasterDashboard/>}/>
          <Route path="/commodity" element={<CreateCommodity/>}/>
<Route path="/viewcommodity" element={<ViewCommodity/>}/>
<Route path="/viewvendor" element={<ViewVendor/>}/>
<Route  path="/hrm" element={<HrmConfiguration/>}/>
<Route path="/salesanddistribution" element={<SalesDistribution/>}/>
<Route path="/ViewBOM" element={<ViewBOM/>}/>



        {/* AccountGroupSubgroup */}
      </Routes>

      <Footer /> {/* Always visible */}
    </Router>
  );
}

export default App;
