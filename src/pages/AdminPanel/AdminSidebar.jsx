import React, { useState } from 'react';
import { RiUserAddLine, RiUserSettingsLine, RiEyeLine, RiEditLine } from 'react-icons/ri';

const AdminSidebar = ({ selected, onSelect }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [expandedMenu, setExpandedMenu] = useState(null);

  const menuItems = [
    { label: 'Admin Register', icon: <RiUserAddLine />, key: 'RegisterPage' },
    { label: 'User Approval', icon: <RiUserSettingsLine />, key: 'userApproval' },
  
];

    const handleItemClick = (key, hasSubItems) => {
        if (hasSubItems) {
            setExpandedMenu(expandedMenu === key ? null : key);
        } else {
            onSelect(key);
            setExpandedMenu(null);
        }
    };

    const handleToggleCollapse = () => {
        if (!collapsed) setExpandedMenu(null);
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
                height: '100vh',
                overflowY: 'auto',
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
                {collapsed ? '▶' : '◀'}
            </button>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1 }}>
                {menuItems.map((item) => {
                    const isSelected = selected === item.key;
                    return (
                        <li key={item.key}>
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
                            </div>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default AdminSidebar;
