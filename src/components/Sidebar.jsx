import React, { useState } from 'react';
import {
  AccountBalance,
  AccountBalanceOutlined,
  AccountBalanceTwoTone,
  AccountCircle,
  CurrencyRupeeOutlined,
  Dashboard,
  GppGoodSharp,
  GroupAddRounded,
  LocalPostOffice,
  SdCardAlert,
  VolunteerActivismSharp,
} from '@mui/icons-material';
import { CreditCardIcon, SheetIcon } from 'lucide-react';
import { RiMastercardFill } from 'react-icons/ri';

const Sidebar = ({ selected, onSelect }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);

  const menuItems = [
    { label: 'Dashboard', icon: <Dashboard />, key: 'Dashboard' },
    //  { label: 'Master', icon: <RiMastercardFill />, key: 'Masters' },
    { label: 'Group Configuration', icon: <GroupAddRounded />, key: 'Group' },
   
    // { label: 'AccountVoucher Type', icon: <AccountBalanceTwoTone />, key: 'AccountVoucherType' },
    { label: 'Account Configuration', icon: <AccountCircle />, key: 'Account' },
    { label: 'Financial Configuration', icon: <CurrencyRupeeOutlined />, key: 'FinancialConfiguration' },
    { label: 'Account Voucher', icon: <VolunteerActivismSharp />, key: 'AccountVoucher' },
    { label: 'Credit Debit Note', icon: <CreditCardIcon />, key: 'CreditDebitNote' },
    { label: 'Account GRN', icon: <GppGoodSharp />, key: 'AccountGRN' },
      { label: 'Account Sale', icon: <SdCardAlert />, key: 'AccountSale' },
    {
      label: 'Report',
      icon: <SheetIcon />,
      key: 'Report',
      subItems: [
        { label: 'Balance Sheet', key: 'BalanceSheet' ,icon:<AccountBalanceOutlined/>},
        { label: 'Profit/Loss', key: 'ProfitLoss' },
        { label: 'Trial Balance', key: 'TrialBalance' },
      ],
    },
  ];

  // Toggle submenu open/close on click
  const handleItemClick = (key, hasSubItems) => {
    if (hasSubItems) {
      setExpandedMenu(expandedMenu === key ? null : key);
    } else {
      onSelect(key);
      setExpandedMenu(null);
    }
  };

  // Close flyout submenu if sidebar collapses
  const handleToggleCollapse = () => {
    if (!collapsed) {
      setExpandedMenu(null);
    }
    setCollapsed(!collapsed);
  };

  return (
    <nav
      style={{
        width: collapsed ? 60 : 250,
        backgroundColor: '#f5f5f5',
        borderRight: '1px solid #ccc',
        padding: '20px 10px',
        boxSizing: 'border-box',
        transition: 'width 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        height: '120vh',
        overflowY: 'auto',
        position: 'relative',
        userSelect: 'none',
      }}
    >
      <button
        onClick={handleToggleCollapse}
        style={{
          marginBottom: 20,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#0066cc',
          fontWeight: 'bold',
          fontSize: 18,
          alignSelf: collapsed ? 'center' : 'flex-end',
          outline: 'none',
        }}
        aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      > 
      {/* Account And Finance */}
        {collapsed ? '▶' : '◀'}
      </button>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1 }}>
        {menuItems.map((item) => {
          const isSelected =
            selected === item.key || (item.subItems && item.subItems.some((sub) => sub.key === selected));
          const isExpanded = expandedMenu === item.key;

          return (
            <li key={item.key} style={{ position: 'relative' }}>
              {/* Main menu item */}
              <div
                onClick={() => handleItemClick(item.key, !!item.subItems)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px',
                  cursor: 'pointer',
                  fontWeight: isSelected ? 'bold' : 'normal',
                  backgroundColor: isSelected ? '#ddeeff' : 'transparent',
                  borderRadius: 4,
                  color: isSelected ? '#0066cc' : '#333',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                }}
                title={item.label}
              >
                <div
                  style={{
                    marginRight: collapsed ? 0 : 15,
                    display: 'flex',
                    justifyContent: 'center',
                    width: 24,
                  }}
                >
                  {item.icon}
                </div>

                {!collapsed && <span>{item.label}</span>}

                {!collapsed && item.subItems && (
                  <span style={{ marginLeft: 'auto', userSelect: 'none' }}>{isExpanded ? '▾' : '▸'}</span>
                )}
              </div>

              {/* Submenu: Expanded & sidebar expanded */}
              {item.subItems && isExpanded && !collapsed && (
                <ul style={{ listStyle: 'none', paddingLeft: 30, marginTop: 8 }}>
                  {item.subItems.map((sub) => {
                    const subSelected = selected === sub.key;
                    return (
                      <li
                        key={sub.key}
                        onClick={() => onSelect(sub.key)}
                        style={{
                          padding: '6px 10px',
                          cursor: 'pointer',
                          fontWeight: subSelected ? 'bold' : 'normal',
                          backgroundColor: subSelected ? '#cce4ff' : 'transparent',
                          borderRadius: 4,
                          color: subSelected ? '#0050b3' : '#555',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        title={sub.label}
                      >
                        {sub.label}
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* Flyout Submenu: visible when collapsed & expanded */}
              {item.subItems && isExpanded && collapsed && (
                <ul
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '100%',
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    borderRadius: 4,
                    padding: 10,
                    minWidth: 160,
                    whiteSpace: 'nowrap',
                    zIndex: 1000,
                  }}
                >
                  {item.subItems.map((sub) => {
                    const subSelected = selected === sub.key;
                    return (
                      <li
                        key={sub.key}
                        onClick={() => onSelect(sub.key)}
                        style={{
                          padding: '6px 10px',
                          cursor: 'pointer',
                          fontWeight: subSelected ? 'bold' : 'normal',
                          backgroundColor: subSelected ? '#cce4ff' : 'transparent',
                          borderRadius: 4,
                          color: subSelected ? '#0050b3' : '#555',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        title={sub.label}
                      >
                        {sub.label}
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Sidebar;
