import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import RegisterPage from "./pages/RegisterPage";
import Login from "./pages/Login";
import AccountTypePage from "./pages/AccountTypePage";
import AccountPage from "./pages/AccountPage";
//import AccountBankDetailsPage from "./pages/AccountBankDetailsPage";
import AccoutVoucherType from "./pages/AccountVoucherType";
import AccountLedger from "./pages/AccountLedger";
import AccountCompany from "./pages/AccountCompany";
import AccountConfiguration from "./pages/AccountConfiguration";
import AccountGroupSubgroup from "./pages/AccountGroupSubgroup";

import AccountAndFinanceDashboard from "./pages/AccountAndFinanceDashboard";

import Header from "./components/Header"; // ✅ default import
import Footer from "./components/Footer"; // ✅ default import

import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Masters from "./pages/Masters";
import CreateVendor from "./pages/CreateVendor";

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
          <Route path="/Masters" element={<Masters/>}/>

<Route path="/createvendor" element={<CreateVendor/>}/>
        {/* AccountGroupSubgroup */}
      </Routes>

      <Footer /> {/* Always visible */}
    </Router>
  );
}

export default App;
