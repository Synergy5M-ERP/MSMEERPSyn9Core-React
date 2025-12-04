import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { RiAccountCircleFill } from "react-icons/ri";

const activeStyle = {
  backgroundColor: "#2176bd",
  borderRadius: "24px",
  color: "#fff",
  fontWeight: "bold",
  padding: "7px 22px",
};

const linkStyle = {
  padding: "10px 18px",
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  color: "#333",
  textDecoration: "none",
};

function Header() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1500,
          background: "linear-gradient(90deg, #083967 0%, #0a4684 50%, #0e5ca7 100%)",
        }}
        className="shadow-sm"
      >
        {/* Row 1 */}
        <div
          className="d-flex align-items-center justify-content-between"
          style={{ padding: "0 32px", minHeight: "56px" }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src="./SwamiSamarthlogo.png"
              alt="Logo"
              height={30}
              style={{ marginRight: 10, marginTop: 4 }}
            />
          </div>

          {/* Title Center */}
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <h2
              style={{
                color: "#e6f0fa",
                fontWeight: "bold",
                margin: 0,
                letterSpacing: 1,
              }}
            >
              MSME ERP SYN 9
            </h2>
          </div>

          {/* My Account Dropdown */}
          <div style={{ position: "relative" }} ref={dropdownRef}>
            <button
              onClick={() => setOpenDropdown(!openDropdown)}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "16px",
                padding: "8px 19px",
                borderRadius: "11px",
                cursor: "pointer",
              }}
            >
              <RiAccountCircleFill className="me-2" size={17} />
              MY ACCOUNT
            </button>

            {openDropdown && (
              <div
                className="dropdown-menu shadow"
                style={{
                  display: "block",
                  position: "absolute",
                  right: 0,
                  marginTop: "5px",
                  background: "white",
                  borderRadius: "10px",
                  width: "220px",
                  padding: "10px 0",
                  zIndex: 2000,
                }}
              >
                <a className="dropdown-item" href="/signup" style={linkStyle}>
                  <i className="fa fa-user-plus text-primary"></i> Signup
                </a>

                <a className="dropdown-item" href="/login" style={linkStyle}>
                  <i className="fa fa-sign-in-alt text-success"></i> Login
                </a>

                <a className="dropdown-item" href="/logout" style={linkStyle}>
                  <i className="fa fa-sign-out-alt text-danger"></i> Signout
                </a>

                <div className="dropdown-divider"></div>

                <a className="dropdown-item" href="/admin" style={linkStyle}>
                  <i className="fa fa-check-circle text-success"></i> User Approval
                </a>

                <a className="dropdown-item" href="/profile" style={linkStyle}>
                  <i className="fa fa-id-badge text-info"></i> User Profile
                </a>

                <a className="dropdown-item" href="/contact-us" style={linkStyle}>
                  <i className="fa fa-envelope text-warning"></i> Contact Us
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Row */}
        <div
          className="d-flex justify-content-center"
          style={{
            background: "rgba(6,56,113,1)",
            padding: "10px 0",
            minHeight: "41px",
          }}
        >
          <NavLink
            to="/dashboar"
            className="nav-link text-white fw-bold"
            style={({ isActive }) =>
              isActive
                ? activeStyle
                : {
                    ...activeStyle,
                    backgroundColor: "rgba(33,118,189,0.23)",
                    color: "#e6f0fa",
                  }
            }
          >
            DASHBOARD
          </NavLink>

          <NavLink
            to="/hrm"
            className="nav-link text-white fw-bold"
            style={({ isActive }) =>
              isActive
                ? activeStyle
                : {
                    ...activeStyle,
                    backgroundColor: "rgba(33,118,189,0.23)",
                    color: "#e6f0fa",
                  }
            }
          >
            HRM MODULE
          </NavLink>

          <NavLink
            to="/masters"
            className="nav-link text-white fw-bold"
            style={({ isActive }) =>
              isActive
                ? activeStyle
                : {
                    ...activeStyle,
                    backgroundColor: "rgba(33,118,189,0.23)",
                    color: "#e6f0fa",
                  }
            }
          >
            MASTERS
          </NavLink>

          <NavLink
            to="/materialmanagement"
            className="nav-link text-white fw-bold"
            style={({ isActive }) =>
              isActive
                ? activeStyle
                : {
                    ...activeStyle,
                    backgroundColor: "rgba(33,118,189,0.23)",
                    color: "#e6f0fa",
                  }
            }
          >
            MATERIAL MANAGEMENT
          </NavLink>

          <NavLink
            to="/productionandquality"
            className="nav-link text-white fw-bold"
            style={({ isActive }) =>
              isActive
                ? activeStyle
                : {
                    ...activeStyle,
                    backgroundColor: "rgba(33,118,189,0.23)",
                    color: "#e6f0fa",
                  }
            }
          >
            PRODUCTION & QUALITY
          </NavLink>

          <NavLink
            to="/salesanddistribution"
            className="nav-link text-white fw-bold"
            style={({ isActive }) =>
              isActive
                ? activeStyle
                : {
                    ...activeStyle,
                    backgroundColor: "rgba(33,118,189,0.23)",
                    color: "#e6f0fa",
                  }
            }
          >
            SALES & DISTRIBUTION
          </NavLink>

          <NavLink
            to="/AccFinancedashboard"
            className="nav-link text-white fw-bold"
            style={({ isActive }) =>
              isActive
                ? activeStyle
                : {
                    ...activeStyle,
                    backgroundColor: "rgba(33,118,189,0.23)",
                    color: "#e6f0fa",
                  }
            }
          >
            ACCOUNT & FINANCE
          </NavLink>
        </div>
      </header>

      {/* space below fixed header */}
      <div style={{ marginTop: "105px" }}></div>

      <style>{`
        .nav-link:hover {
          background-color: #2176bd !important;
          color: white !important;
        }
      `}</style>
    </>
  );
}

export default Header;
