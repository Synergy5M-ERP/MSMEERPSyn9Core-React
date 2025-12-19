import React, { useState } from 'react';
import {
  DashboardCustomize,
  Engineering,
  Inventory,
  Label,
  PaidSharp,
  PhotoSizeSelectActual,
  PrecisionManufacturing,
  ProductionQuantityLimits,
  Settings,
  Thermostat,
  Build,
} from '@mui/icons-material';
import { ShoppingCart } from 'lucide-react';

const ProductionSidebar = ({ selected, onSelect }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);

  const menuItems = [
    { label: 'Dashboard', icon: <DashboardCustomize />, key: 'Dashboard' },

    {
      label: 'Machine',
      icon: <Engineering />,
      key: 'Machine',
      subItems: [
        { label: 'Machine Information', icon: <Build />, key: 'Machineinfo' },
        { label: 'Setting Parameter', icon: <Settings />, key: 'settingPara' },
        { label: 'Extruder Temperature', icon: <Thermostat />, key: 'ExtruderTemp' },
      ],
    },

    {
      label: 'Production Plan',
      icon: <ProductionQuantityLimits />,
      key: 'ProductionPlan',
      subItems: [
        { label: 'Finish', icon: <PrecisionManufacturing />, key: 'finishProduction' },
        { label: 'Semifinish', icon: <PhotoSizeSelectActual />, key: 'SemifinishProduction' },
      ],
    },

    { label: 'SemiFinish Inventory', icon: <Inventory />, key: 'SemiFinishInventory' },

    { label: 'Bought Out Requirement', icon: <ShoppingCart />, key: 'BougthOut' },

    { label: 'RM Consumption', icon: <PrecisionManufacturing />, key: 'RMConsumption' },

    {
      label: 'Actual Production',
      icon: <PhotoSizeSelectActual />,
      key: 'ActualProduction',
      subItems: [
        { label: 'Finish', icon: <PrecisionManufacturing />, key: 'ActualFinish' },
        { label: 'SemiFinish', icon: <PhotoSizeSelectActual />, key: 'ActualSemiFinish' },
      ],
    },

    { label: 'Manual Issue Pass', icon: <PaidSharp />, key: 'ManualIssuePass' },

    { label: 'Label', icon: <Label />, key: 'label' },

    // ✅ ONLY ONE Crystal Report entry
    {
      label: 'Crystal Report',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          viewBox="0 0 16 16"
          style={{ color: '#0dcaf0' }}
        >
          <path d="M3.1.8 4.8 3H11.2l1.7-2.2A1 1 0 0 0 11.7 0H4.3a1 1 0 0 0-.8.8z" />
          <path d="M1.1 3.5 4 8l-2 4a1 1 0 0 0 .9 1.5h9.9a1 1 0 0 0 .9-1.5l-2.1-4 2.9-4.5a.5.5 0 0 0-.4-.8H1.5a.5.5 0 0 0-.4.3z" />
        </svg>
      ),
      key: 'crystalReport',
    },

    // ✅ ONLY ONE Standard Report entry
    {
      label: 'Standard Report',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          viewBox="0 0 16 16"
          style={{ color: '#198754' }}
        >
          <path d="M0 0h1v15h15v1H0V0z" />
          <path d="M2 9h1v6H2v-6zm3-4h1v10H5V5zm3 1h1v9H8V6zm3-3h1v12h-1V3z" />
        </svg>
      ),
      key: 'standardReport',
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

  // Close flyout submenu if ProductionSidebar collapses
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
        aria-label={collapsed ? 'Expand ProductionSidebar' : 'Collapse ProductionSidebar'}
      >
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

              {/* Submenu: Expanded & Sidebar expanded */}
              {item.subItems && isExpanded && !collapsed && (
                <ul style={{ listStyle: 'none', paddingLeft: 30, marginTop: 8 }}>
                  {item.subItems.map((sub) => {
                    const subSelected = selected === sub.key;
                    return (
                      <li
                        key={sub.key}
                        onClick={() => onSelect(sub.key)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
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
                        {sub.icon && (
                          <div style={{ marginRight: 12, width: 20 }}>
                            {sub.icon}
                          </div>
                        )}
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

export default ProductionSidebar;
