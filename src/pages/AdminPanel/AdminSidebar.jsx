import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { RiUserAddLine, RiUserSettingsLine } from "react-icons/ri";

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Admin Register", icon: <RiUserAddLine />, path: "RegisterPage" },
    { label: "User Approval", icon: <RiUserSettingsLine />, path: "userApproval" },
  ];

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <nav
      style={{
        width: collapsed ? 60 : 250,
        backgroundColor: "#f5f5f5",
        borderRight: "1px solid #ccc",
        padding: "20px 10px",
        transition: "width 0.3s ease",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <button
        onClick={handleToggleCollapse}
        style={{
          marginBottom: 20,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#0066cc",
          fontWeight: "bold",
          fontSize: 18,
          alignSelf: collapsed ? "center" : "flex-end",
        }}
      >
        {collapsed ? "▶" : "◀"}
      </button>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname.includes(item.path);

          return (
            <li key={item.path}>
              <div
                onClick={() => navigate(`/admin/${item.path}`)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px",
                  cursor: "pointer",
                  fontWeight: isSelected ? "bold" : "normal",
                  backgroundColor: isSelected ? "#ddeeff" : "transparent",
                  borderRadius: 4,
                  color: isSelected ? "#0066cc" : "#333",
                  justifyContent: collapsed ? "center" : "flex-start",
                }}
              >
                <div
                  style={{
                    marginRight: collapsed ? 0 : 15,
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