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
  const [pqOpen, setPqOpen] = React.useState(false);

  // close dropdown on outside click
  const dropdownRef = React.useRef(null);
  React.useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) {
        setPqOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          minHeight: "47px",
          zIndex: 1500,
          background:
            "linear-gradient(90deg, #083967 0%, #0a4684 50%, #0e5ca7 100%)",
        }}
        className="shadow-sm"
      >
        {/* 1st Row */}
        <div
          className="d-flex align-items-center justify-content-between"
          style={{ padding: "0 32px", minHeight: "56px" }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src="./SwamiSamarthlogo.png"
              alt="Logo"
              height={30}
              style={{ marginRight: 10, marginTop: 4 }}
            />
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
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
        <div
          className="d-flex justify-content-center"
          style={{
            background: "rgba(6,56,113,1)",
            margin: 0,
            padding: "10px 0 10px 0",
            minHeight: "41px",
            gap: "4px",
          }}
        >
          <NavLink
            to="/dashboard"
            className="nav-link text-white fw-bold"
            style={({ isActive }) =>
              isActive
                ? activeStyle
                : {
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
                    textDecoration: "none",
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
                    backgroundColor: "rgba(33, 118, 189, 0.23)",
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
                    backgroundColor: "rgba(33, 118, 189, 0.23)",
                    color: "#e6f0fa",
                  }
            }
          >
            MASTERS
          </NavLink>

          <NavLink
            to="/mm"
            className="nav-link text-white fw-bold"
            style={({ isActive }) =>
              isActive
                ? activeStyle
                : {
                    ...activeStyle,
                    backgroundColor: "rgba(33, 118, 189, 0.23)",
                    color: "#e6f0fa",
                  }
            }
          >
            MATERIAL MANAGEMENT
          </NavLink>

          {/* PRODUCTION & QUALITY DROPDOWN */}
          <div
            className="position-relative"
            style={{ margin: "0 8px" }}
            ref={dropdownRef}
          >
            <button
              type="button"
              onClick={() => setPqOpen((o) => !o)}
              style={{
                ...activeStyle,
                backgroundColor: "rgba(33, 118, 189, 0.23)",
                color: "#e6f0fa",
                fontSize: "16px",
                border: "none",
              }}
            >
              PRODUCTION &amp; QUALITY ▾
            </button>

            {pqOpen && (
              <div
                className="shadow-sm"
                style={{
                  position: "absolute",
                  top: "110%",
                  left: 0,
                  minWidth: "220px",
                  background: "#fff",
                  borderRadius: "6px",
                  zIndex: 2000,
                }}
              >
                <NavLink
                  to="/production"
                  className="d-block px-3 py-2 text-decoration-none"
                  onClick={() => setPqOpen(false)}
                  style={({ isActive }) => ({
                    color: isActive ? "#e8ebeeff" : "#333",
                    fontWeight: isActive ? "bold" : 500,
                    backgroundColor: isActive ? "#1d7ad8ff" : "transparent",
                  })}
                >
                  Production Module
                </NavLink>
                <NavLink
                  to="/quality"
                  className="d-block px-3 py-2 text-decoration-none"
                  onClick={() => setPqOpen(false)}
                  style={({ isActive }) => ({
                    color: isActive ? "#e8ebeeff" : "#333",
                    fontWeight: isActive ? "bold" : 500,
                    backgroundColor: isActive ? "#1d7ad8ff" : "transparent",
                  })}
                >
                  Quality
                </NavLink>
              </div>
            )}
          </div>

          <NavLink
            to="/salesanddistribution"
            className="nav-link text-white fw-bold"
            style={({ isActive }) =>
              isActive
                ? activeStyle
                : {
                    ...activeStyle,
                    backgroundColor: "rgba(33, 118, 189, 0.23)",
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
                    backgroundColor: "rgba(33, 118, 189, 0.23)",
                    color: "#e6f0fa",
                  }
            }
          >
            ACCOUNT & FINANCE
          </NavLink>
        </div>
      </header>

      {/* Spacer */}
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
