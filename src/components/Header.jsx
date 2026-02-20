
import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { RiAccountCircleFill } from "react-icons/ri";
import axios from "axios";
import { API_ENDPOINTS } from "../config/apiconfig"; // adjust path if needed
const Header = () => {
  const [user, setUser] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const accountDropdownRef = useRef(null);
  const navigate = useNavigate();
const role = (user?.UserRole || user?.userRole || "").trim().toLowerCase();
 useEffect(() => {
  const handleStorageChange = () => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  };

  // Trigger on mount
  handleStorageChange();

  // Listen for localStorage changes
  window.addEventListener("storage", handleStorageChange);

  return () => window.removeEventListener("storage", handleStorageChange);
}, []);
  // Load user from localStorage
  // =========================
  useEffect(() => {
  const loadUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  };

  loadUser();

  window.addEventListener("storage", loadUser);

  return () => {
    window.removeEventListener("storage", loadUser);
  };
}, []);

  // =========================
  // Close dropdown on outside click
  // =========================
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // =========================
  // LOGOUT FUNCTION
  // =========================
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        API_ENDPOINTS.Logout,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.log("Logout error:", error);
    }

    // Clear storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setOpenDropdown(false);

    navigate("/login");
  };

  // =========================
  const activeStyle = {
    backgroundColor: "#2176bd",
    borderRadius: "24px",
    color: "#fff",
    fontWeight: "bold",
    padding: "7px 22px",
    textDecoration: "none",
  };

  const inactiveStyle = {
    borderRadius: "24px",
    color: "#e6f0fa",
    fontWeight: "bold",
    margin: "0 8px",
    padding: "7px 22px",
    background: "rgba(33, 118, 189, 0.23)",
    textDecoration: "none",
  };

  const linkStyle = {
    padding: "8px 15px",
    display: "block",
    color: "#333",
    textDecoration: "none",
    cursor: "pointer",
  };

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1500,
          background:
            "linear-gradient(90deg, rgba(237,239,241,1) 0%, #eaeef1 50%, #eff2f4 100%)",
        }}
      >
        {/* ===== FIRST ROW ===== */}
        <div
          className="d-flex align-items-center justify-content-between"
          style={{ padding: "0 32px", minHeight: "70px" }}
        >
          <img
            src="/logo (1).png"
            alt="Logo"
            style={{ width: 200, height: 70 }}
            onError={(e) => (e.target.style.display = "none")}
          />

          <h2 style={{ color: "#115293", fontWeight: "bold", margin: 0 }}>
            MSME ERP SYN 9
          </h2>

             {/* ================= ACCOUNT DROPDOWN ================= */}
          <div style={{ position: "relative" }} ref={accountDropdownRef}>
            <button
              onClick={() => setOpenDropdown(!openDropdown)}
              style={{
                background: "transparent",
                border: "none",
                color: "#282298",
                fontWeight: "bold",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              <RiAccountCircleFill size={18} /> MY ACCOUNT
            </button>

            {openDropdown && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  marginTop: 5,
                  background: "#fff",
                  borderRadius: 10,
                  width: 240,
                  padding: "10px 0",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                }}
              >
                {/* ================= NOT LOGGED IN ================= */}
{!user && (
                  <>
                  <NavLink
  to="/admin/RegisterPage"
  style={linkStyle}
  onClick={() => setOpenDropdown(false)}
>
  Signup
</NavLink>

                    <NavLink
                      to="/login"
                      style={linkStyle}
                      onClick={() => setOpenDropdown(false)}
                    >
                      Login
                    </NavLink>
                  </>
                )}

                {/* ================= LOGGED IN ================= */}
                {user && (
  <>
    <div
      style={linkStyle}
      onClick={handleLogout}
    >
      Signout
    </div>



    {/* ✅ SHOW ONLY FOR CHIEF ADMIN */}
   {/* Only Chief Admin */}
{role === "chief admin" && (
          <NavLink
            to="/admin/userApproval"
            style={linkStyle}
            onClick={() => setOpenDropdown(false)}
          >
            User Approval
          </NavLink>
        )}
    <NavLink
      to="/profile"
      style={linkStyle}
      onClick={() => setOpenDropdown(false)}
    >
      User Profile
    </NavLink>

    <NavLink
      to="/contact-us"
      style={linkStyle}
      onClick={() => setOpenDropdown(false)}
    >
      Contact Us
    </NavLink>
  </>
)}
              </div>
            )}
          </div>
        </div>

        {/* ===== NAVIGATION ROW ===== */}

        <div
          className="d-flex justify-content-center"
          style={{ background: "rgba(6,56,113,1)", padding: "10px 0" }}
        >
          {!user && (
            <>
              <NavLink to="#" style={inactiveStyle}>HRM MODULE</NavLink>
              <NavLink to="#" style={inactiveStyle}>MASTERS</NavLink>
              <NavLink to="#" style={inactiveStyle}>              MATERIAL MANAGEMENT
</NavLink>
              <NavLink to="#" style={inactiveStyle}>PRODUCTION</NavLink>
              <NavLink to="#" style={inactiveStyle}>QUALITY</NavLink>
              <NavLink to="#" style={inactiveStyle}>              SALES & DISTRIBUTION
</NavLink>
<NavLink to="#" style={inactiveStyle}>ACCOUNT & FINANCE

</NavLink>
            </>
          )}


          {/* Permission Based (Logged In) */}
          {user?.dashboard && (
            <NavLink to="/dashboard" style={({ isActive }) =>
              isActive ? activeStyle : inactiveStyle
            }>
              DASHBOARD
            </NavLink>
          )}

          {user?.hrAndAdmin && (
            <NavLink to="/hrm" style={({ isActive }) =>
              isActive ? activeStyle : inactiveStyle
            }>
              HRM MODULE
            </NavLink>
          )}

          {user?.masters && (
            <NavLink to="/masters" style={({ isActive }) =>
              isActive ? activeStyle : inactiveStyle
            }>
              MASTERS
            </NavLink>
          )}

          {user?.materialManagement && (
            <NavLink to="/mm" style={({ isActive }) =>
              isActive ? activeStyle : inactiveStyle
            }>
              MATERIAL MANAGEMENT
            </NavLink>
          )}

          {user?.production && (
            <NavLink to="/production" style={({ isActive }) =>
              isActive ? activeStyle : inactiveStyle
            }>
              PRODUCTION
            </NavLink>
          )}

          {user?.quality && (
            <NavLink to="/quality" style={({ isActive }) =>
              isActive ? activeStyle : inactiveStyle
            }>
              QUALITY
            </NavLink>
          )}

          {user?.salesAndMarketing && (
            <NavLink to="/salesanddistribution" style={({ isActive }) =>
              isActive ? activeStyle : inactiveStyle
            }>
              SALES & DISTRIBUTION
            </NavLink>
          )}

          {user?.accountAndFinance && (
            <NavLink to="/accfinancedashboard" style={({ isActive }) =>
              isActive ? activeStyle : inactiveStyle
            }>
              ACCOUNT & FINANCE
            </NavLink>
          )}
        </div>
      </header>

      {/* Spacer */}
      <div style={{ marginTop: "105px" }}></div>

      {/* Critical CSS for hover effects */}
      <style>{`
        .dropdown-item {
          color: #333 !important;
          text-decoration: none !important;
          display: block !important;
          transition: background 0.2s;
        }
        .dropdown-item:hover {
          background-color: #f8f9fa !important;
        }
        .nav-link:hover {
          background-color: #2176bd !important;
          color: white !important;
        }
        .dropdown-menu {
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        .text-primary { color: #007bff !important; }
        .text-success { color: #28a745 !important; }
        .text-danger { color: #dc3545 !important; }
        .text-info { color: #17a2b8 !important; }
        .text-warning { color: #ffc107 !important; }
        hr { 
          margin: 8px 0 !important; 
          border: none !important; 
          border-top: 1px solid #eee !important; 
        }
      `}</style>
    </>
  );
}

export default Header;
