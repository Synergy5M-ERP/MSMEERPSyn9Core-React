// import React, { useState, useRef, useEffect } from "react";
// import { NavLink } from "react-router-dom";
// import { RiAccountCircleFill } from "react-icons/ri";
// //import
// const activeStyle = {
//   backgroundColor: "#2176bd",
//   borderRadius: "24px",
//   color: "#fff",
//   fontWeight: "bold",
//   padding: "7px 22px",
// };

// const linkStyle = {
//   padding: "10px 18px",
//   fontSize: "14px",
//   display: "flex",
//   alignItems: "center",
//   gap: "10px",
//   color: "#333",
//   textDecoration: "none",
// };

// function Header() {
//   const [pqOpen, setPqOpen] = useState(false);
//   const [openDropdown, setOpenDropdown] = useState(false);
  
//   const accountDropdownRef = useRef(null);
//   const pqDropdownRef = useRef(null);

//   // Account dropdown outside click handler
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
//         setOpenDropdown(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // PQ dropdown outside click handler
//   useEffect(() => {
//     const handler = (e) => {
//       if (!pqDropdownRef.current) return;
//       if (!pqDropdownRef.current.contains(e.target)) {
//         setPqOpen(false);
//       }
//     };
//     document.addEventListener("click", handler);
//     return () => document.removeEventListener("click", handler);
//   }, []);

//   return (
//     <>
//       <header
//         style={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           width: "100%",
//           zIndex: 1500,
//           background:
//             "linear-gradient(90deg, #083967 0%, #0a4684 50%, #0e5ca7 100%)",
//         }}
//         className="shadow-sm"
//       >
//         {/* 1st Row */}
//         <div
//           className="d-flex align-items-center justify-content-between"
//           style={{ padding: "0 32px", minHeight: "56px" }}
//         >
//           <div style={{ display: "flex", alignItems: "center" }}>
//             <img
//               src="./SwamiSamarthlogo.png"
//               alt="Logo"
//               height={30}
//               style={{ marginRight: 10, marginTop: 4 }}
//             />
//           </div>

//           <div
//             style={{
//               flex: 1,
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             {/* Title Center */}
//             <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
//               <h2
//                 style={{
//                   color: "#e6f0fa",
//                   fontWeight: "bold",
//                   margin: 0,
//                   letterSpacing: 1,
//                 }}
//               >
//                 MSME ERP SYN 9
//               </h2>
//             </div>

//             {/* My Account Dropdown */}
//             <div style={{ position: "relative" }} ref={accountDropdownRef}>
//               <button
//                 onClick={() => setOpenDropdown(!openDropdown)}
//                 style={{
//                   background: "transparent",
//                   border: "none",
//                   color: "#fff",
//                   fontWeight: "bold",
//                   fontSize: "16px",
//                   padding: "8px 19px",
//                   borderRadius: "11px",
//                   cursor: "pointer",
//                 }}
//               >
//                 <RiAccountCircleFill className="me-2" size={17} />
//                 MY ACCOUNT 
//                 {/* MyAccount */}
//               </button>

//               {openDropdown && (
//                 <div
//                   className="dropdown-menu shadow"
//                   style={{
//                     display: "block",
//                     position: "absolute",
//                     right: 0,
//                     marginTop: "5px",
//                     background: "white",
//                     borderRadius: "10px",
//                     width: "220px",
//                     padding: "10px 0",
//                     zIndex: 2000,
//                   }}
//                 >
                  
//                   <a className="dropdown-item" href="/signup" style={linkStyle}>
//                     <i className="fa fa-user-plus text-primary"></i> Signup
//                   </a>

//                   <a className="dropdown-item" href="/login" style={linkStyle}>
//                     <i className="fa fa-sign-in-alt text-success"></i> Login
//                   </a>

//                   <a className="dropdown-item" href="/logout" style={linkStyle}>
//                     <i className="fa fa-sign-out-alt text-danger"></i> Signout
//                   </a>

//                   <div className="dropdown-divider"></div>

//                   <a className="dropdown-item" href="/admin" style={linkStyle}>
//                     <i className="fa fa-check-circle text-success"></i> User Approval
//                   </a>

//                   <a className="dropdown-item" href="/profile" style={linkStyle}>
//                     <i className="fa fa-id-badge text-info"></i> User Profile
//                   </a>

//                   <a className="dropdown-item" href="/contact-us" style={linkStyle}>
//                     <i className="fa fa-envelope text-warning"></i> Contact Us
//                   </a>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Navigation Row */}
//         <div
//           className="d-flex justify-content-center"
//           style={{
//             background: "rgba(6,56,113,1)",
//             margin: 0,
//             padding: "10px 0",
//             minHeight: "41px",
//             gap: "4px",
//           }}
//         >
//           <NavLink
//             to="/dashboard"
//             className="nav-link text-white fw-bold"
//             style={({ isActive }) =>
//               isActive
//                 ? activeStyle
//                 : {
//                     borderRadius: "24px",
//                     color: "#e6f0fa",
//                     fontWeight: "bold",
//                     fontSize: "16px",
//                     margin: "0 8px",
//                     padding: "7px 22px",
//                     letterSpacing: "normal",
//                     background: "rgba(33, 118, 189, 0.23)",
//                     border: "none",
//                     textAlign: "center",
//                     display: "inline-block",
//                     transition: "background 0.18s",
//                     textDecoration: "none",
//                   }
//             }
//           >
//             DASHBOARD
//           </NavLink>

//           <NavLink
//             to="/hrm"
//             className="nav-link text-white fw-bold"
//             style={({ isActive }) =>
//               isActive
//                 ? activeStyle
//                 : {
//                     ...activeStyle,
//                     backgroundColor: "rgba(33, 118, 189, 0.23)",
//                     color: "#e6f0fa",
//                   }
//             }
//           >
//             HRM MODULE
//           </NavLink>

//           <NavLink
//             to="/masters"
//             className="nav-link text-white fw-bold"
//             style={({ isActive }) =>
//               isActive
//                 ? activeStyle
//                 : {
//                     ...activeStyle,
//                     backgroundColor: "rgba(33, 118, 189, 0.23)",
//                     color: "#e6f0fa",
//                   }
//             }
//           >
//             MASTERS
//           </NavLink>

//           <NavLink
//             to="/mm"
//             className="nav-link text-white fw-bold"
//             style={({ isActive }) =>
//               isActive
//                 ? activeStyle
//                 : {
//                     ...activeStyle,
//                     backgroundColor: "rgba(33, 118, 189, 0.23)",
//                     color: "#e6f0fa",
//                   }
//             }
//           >
//             MATERIAL MANAGEMENT
//           </NavLink>

//           {/* PRODUCTION & QUALITY DROPDOWN */}
//           <div
//             className="position-relative"
//             style={{ margin: "0 8px" }}
//             ref={pqDropdownRef}
//           >
//             <button
//               type="button"
//               onClick={() => setPqOpen((o) => !o)}
//               style={{
//                 ...activeStyle,
//                 backgroundColor: "rgba(33, 118, 189, 0.23)",
//                 color: "#e6f0fa",
//                 fontSize: "16px",
//                 border: "none",
//               }}
//             >
//               PRODUCTION & QUALITY ▾
//             </button>

//             {pqOpen && (
//               <div
//                 className="shadow-sm"
//                 style={{
//                   position: "absolute",
//                   top: "110%",
//                   left: 0,
//                   minWidth: "220px",
//                   background: "#fff",
//                   borderRadius: "6px",
//                   zIndex: 2000,
//                 }}
//               >
//                 <NavLink
//                   to="/production"
//                   className="d-block px-3 py-2 text-decoration-none"
//                   onClick={() => setPqOpen(false)}
//                   style={({ isActive }) => ({
//                     color: isActive ? "#e8ebeeff" : "#333",
//                     fontWeight: isActive ? "bold" : 500,
//                     backgroundColor: isActive ? "#1d7ad8ff" : "transparent",
//                   })}
//                 >
//                   Production Module
//                 </NavLink>
//                 <NavLink
//                   to="/quality"
//                   className="d-block px-3 py-2 text-decoration-none"
//                   onClick={() => setPqOpen(false)}
//                   style={({ isActive }) => ({
//                     color: isActive ? "#e8ebeeff" : "#333",
//                     fontWeight: isActive ? "bold" : 500,
//                     backgroundColor: isActive ? "#1d7ad8ff" : "transparent",
//                   })}
//                 >
//                   Quality
//                 </NavLink>
//               </div>
//             )}
//           </div>

//           <NavLink
//             to="/salesanddistribution"
//             className="nav-link text-white fw-bold"
//             style={({ isActive }) =>
//               isActive
//                 ? activeStyle
//                 : {
//                     ...activeStyle,
//                     backgroundColor: "rgba(33, 118, 189, 0.23)",
//                     color: "#e6f0fa",
//                   }
//             }
//           >
//             SALES & DISTRIBUTION
//           </NavLink>

//           <NavLink
//             to="/AccFinancedashboard"
//             className="nav-link text-white fw-bold"
//             style={({ isActive }) =>
//               isActive
//                 ? activeStyle
//                 : {
//                     ...activeStyle,
//                     backgroundColor: "rgba(33, 118, 189, 0.23)",
//                     color: "#e6f0fa",
//                   }
//             }
//           >
//             ACCOUNT & FINANCE
//           </NavLink>
//         </div>
//       </header>

//       {/* Spacer */}
//       <div style={{ marginTop: "105px" }}></div>

//       <style>{`
//         .nav-link:hover {
//           background-color: #2176bd !important;
//           color: white !important;
//         }
//       `}</style>
//     </>
//   );
// }

// export default Header;
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
  const [pqOpen, setPqOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  
  const accountDropdownRef = useRef(null);
  const pqDropdownRef = useRef(null);

  // Account dropdown outside click handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // PQ dropdown outside click handler
  useEffect(() => {
    const handler = (e) => {
      if (!pqDropdownRef.current) return;
      if (!pqDropdownRef.current.contains(e.target)) {
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
          zIndex: 1500,
          background: "linear-gradient(90deg, #083967 0%, #0a4684 50%, #0e5ca7 100%)",
        }}
        className="shadow-sm"
      >
        {/* 1st Row */}
        <div
          className="d-flex align-items-center justify-content-between"
          style={{ padding: "0 32px", minHeight: "56px" }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* ✅ AZURE READY: Logo from PUBLIC folder */}
            <img
              src="/SwamiSamarthlogo.png"
              alt="Logo"
              height={30}
              style={{ marginRight: 10, marginTop: 4 }}
              onError={(e) => {
                e.target.style.display = 'none';
                console.log('Logo not found - using fallback');
              }}
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
            <div style={{ position: "relative" }} ref={accountDropdownRef}>
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
                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                    border: "1px solid #e0e0e0"
                  }}
                >
                  <NavLink 
                    to="/register" 
                    className="dropdown-item"
                    style={linkStyle}
                    onClick={() => setOpenDropdown(false)}
                  >
                    <i className="fas fa-user-plus text-primary me-2" style={{fontSize: '14px'}}></i>
                    Signup
                  </NavLink>

                  <NavLink 
                    to="/login" 
                    className="dropdown-item"
                    style={linkStyle}
                    onClick={() => setOpenDropdown(false)}
                  >
                    <i className="fas fa-sign-in-alt text-success me-2" style={{fontSize: '14px'}}></i>
                    Login
                  </NavLink>

                  <NavLink 
                    to="/logout" 
                    className="dropdown-item"
                    style={linkStyle}
                    onClick={() => setOpenDropdown(false)}
                  >
                    <i className="fas fa-sign-out-alt text-danger me-2" style={{fontSize: '14px'}}></i>
                    Signout
                  </NavLink>

                  <hr style={{margin: '8px 0', border: 'none', borderTop: '1px solid #eee'}} />

                  <NavLink 
                    to="/admin" 
                    className="dropdown-item"
                    style={linkStyle}
                    onClick={() => setOpenDropdown(false)}
                  >
                    <i className="fas fa-check-circle text-success me-2" style={{fontSize: '14px'}}></i>
                    User Approval
                  </NavLink>

                  <NavLink 
                    to="/profile" 
                    className="dropdown-item"
                    style={linkStyle}
                    onClick={() => setOpenDropdown(false)}
                  >
                    <i className="fas fa-id-badge text-info me-2" style={{fontSize: '14px'}}></i>
                    User Profile
                  </NavLink>

                  <NavLink 
                    to="/contact-us" 
                    className="dropdown-item"
                    style={linkStyle}
                    onClick={() => setOpenDropdown(false)}
                  >
                    <i className="fas fa-envelope text-warning me-2" style={{fontSize: '14px'}}></i>
                    Contact Us
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Row */}
        <div
          className="d-flex justify-content-center"
          style={{
            background: "rgba(6,56,113,1)",
            margin: 0,
            padding: "10px 0",
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
   <NavLink
                  to="/production"
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
                 PRODUCTION 
                </NavLink>
                <NavLink
                  to="/quality"
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
                  QUALITY
                </NavLink>
          {/* PRODUCTION & QUALITY DROPDOWN */}
          {/* <div
            className="position-relative"
            style={{ margin: "0 8px" }}
            ref={pqDropdownRef}
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
              PRODUCTION & QUALITY ▾
            </button>

            {pqOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "110%",
                  left: 0,
                  minWidth: "220px",
                  background: "#fff",
                  borderRadius: "6px",
                  zIndex: 2000,
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                  border: "1px solid #e0e0e0"
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
                    padding: "10px 15px",
                    display: "block"
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
                    padding: "10px 15px",
                    display: "block"
                  })}
                >
                  Quality
                </NavLink>
              </div>
            )}
          </div> */}

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
            to="/accfinancedashboard"
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
