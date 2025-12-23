import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Header from '../../components/Header';

// Your account configuration component
import AccountConfiguration from '../Account/AccountConfiguration';
import AccountGroupSubGroup from '../Account/AccountGroupSubgroup'
import Dashboard from '../../pages/Account/Dashboard'
import AccountVoucherType from './AccountVoucherType';
import AccountLedger from './AccountLedger';
import AccountVoucher from './AccountVoucher';
import AccountJournal from './AccountJournal';
import AccountGRN from './AccountGRN';
import Masters from '../Masters/Masters';
import VoucherConfiguration from './VoucherConfiguration';
import CreditDebitNote from './CreditDebitNote';
import Nullify from './Nullify';
import AccountSale from './AccountSale';
import BalanceSheet from './BalanceSheet';
import FinancialConfiguration from './FinancialConfiguration';
const AccountAndFinanceDashboard = () => {
const [activePage, setActivePage] = useState('Dashboard');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      
      {/* Full-width Header */}
      {/* <Header /> */}

      {/* Main layout with sidebar and content */}
      <div style={{ flex: 1, display: 'flex' }}>
        <Sidebar selected={activePage} onSelect={setActivePage} />

        {/* Main Content area */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          {activePage==='Dashboard' && <Dashboard/>}
          {activePage === 'Masters' && <Masters />}
          {activePage === 'Group' &&  <AccountGroupSubGroup/> }
          {activePage === 'Account' && <AccountConfiguration/>}
          {activePage==='AccountVoucherType' && <AccountVoucherType/>}
          {activePage ==='AccountLedger' && <AccountLedger/>}
          {activePage ==='AccountVoucher' && <VoucherConfiguration/>}
          {activePage ==='AccountJournal' && <AccountJournal/>}
           {activePage ==='AccountGRN' && <AccountGRN/>}
               {activePage ==='AccountSale' && <AccountSale/>}
           {activePage ==='CreditDebitNote' && <CreditDebitNote/>}
           {activePage ==='nullify' && <Nullify/>}
            {activePage ==='BalanceSheet' && <BalanceSheet/>}
            {activePage==='FinancialConfiguration' && <FinancialConfiguration/>}
          {/* Add more conditions for other pages */}
        </div>
      </div>

      {/* Full-width Footer */}
      <Footer />
    </div>
  );
};

export default AccountAndFinanceDashboard;
