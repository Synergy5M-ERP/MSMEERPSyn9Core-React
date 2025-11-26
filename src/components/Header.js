



import React from "react";
import { NavLink } from "react-router-dom";
import { RiAccountCircleFill } from "react-icons/ri";

const activeStyle = {
  backgroundColor: "#2176bd",
  borderRadius: "24px",
  color: "#fff",
  fontWeight: "bold",
  padding: "7px 22px",
};

function Header() {
  return (
    <>
      {/* Header with two rows */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          minHeight: "47px",
          zIndex: 1500,
          background: "linear-gradient(90deg, #083967 0%, #0a4684 50%, #0e5ca7 100%)",
        }}
        className="shadow-sm"
      >
        {/* 1st Row: Logo, Title, My Account */}
        <div className="d-flex align-items-center justify-content-between"
             style={{ padding: "0 32px", minHeight: "56px" }}>
          {/* Logo left */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src="./SwamiSamarthlogo.png"
              alt="Logo"
              height={30}
              style={{ marginRight: 10, marginTop: 4 }}
            />
            {/* <span className="text-muted" style={{ fontSize: "13px", fontWeight: 400, marginLeft: "-6px", userSelect: "none" }}>Logo</span> */}
          </div>
          {/* Centered Title */}
          <div style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <h2 style={{ color: "#e6f0fa", fontWeight: "bold", margin: 0, letterSpacing: 1 }}>
              MSME ERP SYN 9
            </h2>
          </div>
          {/* My Account Right */}
          <div>
            <button
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "16px",
                outline: "none",
                padding: "8px 19px",
                borderRadius: "11px",
                marginTop: 2,
                marginBottom: 2,
                float: "right",
              }}
              className="shadow-sm"
            >
              <RiAccountCircleFill className="me-2" size={17} />
              MY ACCOUNT
            </button>
          </div>
        </div>

        {/* Nav Row */}
        <div className="d-flex justify-content-center"
             style={{
               background: "rgba(6,56,113,1)",
               margin: 0,
               padding: "10px 0 10px 0",
               minHeight: "41px"
             }}>
          <NavLink
            to="/dashboar"
            className="nav-link text-white fw-bold"
            style={({ isActive }) => (isActive ? activeStyle : {
              borderRadius: "24px",
              color: "#e6f0fa",
              fontWeight: "bold",
              fontSize: "16px",
              margin: "0 8px",
              padding: "7px 22px",
              letterSpacing: "normal",
              background: "rgba(33, 118, 189, 0.23)",
              border: "none",
              textAlign: "center",
              display: "inline-block",
              transition: "background 0.18s",
              textDecoration: "none"
            })}
          >
            DASHBOARD
          </NavLink>
          <NavLink
            to="/hrm"
            className="nav-link text-white fw-bold"
            style={({ isActive }) => (isActive ? activeStyle : {
              ...activeStyle,
              backgroundColor: "rgba(33, 118, 189, 0.23)",
              color: "#e6f0fa",
            })}
          >
            HRM MODULE
          </NavLink>
          <NavLink
            to="/masters"
            className="nav-link text-white fw-bold"
            style={({ isActive }) => (isActive ? activeStyle : {
              ...activeStyle,
              backgroundColor: "rgba(33, 118, 189, 0.23)",
              color: "#e6f0fa",
            })}
          >
            MASTERS
          </NavLink>
          <NavLink
            to="/materialmanagement"
            className="nav-link text-white fw-bold"
            style={({ isActive }) => (isActive ? activeStyle : {
              ...activeStyle,
              backgroundColor: "rgba(33, 118, 189, 0.23)",
              color: "#e6f0fa",
            })}
          >
            MATERIAL MANAGEMENT
          </NavLink>
          <NavLink
            to="/productionandquality"
            className="nav-link text-white fw-bold"
            style={({ isActive }) => (isActive ? activeStyle : {
              ...activeStyle,
              backgroundColor: "rgba(33, 118, 189, 0.23)",
              color: "#e6f0fa",
            })}
          >
            PRODUCTION & QUALITY
          </NavLink>
          <NavLink
            to="/salesanddistribution"
            className="nav-link text-white fw-bold"
            style={({ isActive }) => (isActive ? activeStyle : {
              ...activeStyle,
              backgroundColor: "rgba(33, 118, 189, 0.23)",
              color: "#e6f0fa",
            })}
          >
            SALES & DISTRIBUTION
          </NavLink>
          <NavLink
            to="/AccFinancedashboard"
            className="nav-link text-white fw-bold"
            style={({ isActive }) => (isActive ? activeStyle : {
              ...activeStyle,
              backgroundColor: "rgba(33, 118, 189, 0.23)",
              color: "#e6f0fa",
            })}
          >
            ACCOUNT & FINANCE
          </NavLink>
        </div>
      </header>
      {/* Spacer to avoid content under header */}
      <div style={{ marginTop: "105px" }}></div>
      <style>{`
        .nav-link {
          display: inline-block;
        }
        .nav-link:hover {
          background-color: #2176bd !important;
          color: #fff !important;
        }
      `}</style>
    </>
  );
}

export default Header;
