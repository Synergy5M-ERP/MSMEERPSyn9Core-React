
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, Package, Factory, DollarSign,
  Settings, ShoppingCart, TrendingUp, Lock
} from "lucide-react";

const ALL_MODULES = [
  {
    id: "hrm",
    title: "HRM",
    description: "Employees, attendance, payroll and HR operations.",
    path: "/hrm",
    icon: Users,
    color: "#0d6efd",
    permissionKeys: ["hRAndAdmin", "hrAndAdmin", "HRAndAdmin"],
  },
  {
    id: "material",
    title: "Material Management",
    description: "Purchases, stock, GRN, consumables and inventory.",
    path: "/mm",
    icon: Package,
    color: "#198754",
    permissionKeys: ["materialManagement"],
  },
  {
    id: "sales",
    title: "Sales & Distribution",
    description: "Enquiries, quotations, orders, dispatch and invoicing.",
    path: "/salesanddistribution",
    icon: ShoppingCart,
    color: "#fd7e14",
    permissionKeys: ["salesAndMarketing"],
  },
  {
    id: "production",
    title: "Production and Quality",
    description: "Planning, work orders, production tracking and reports.",
    path: "/production",
    icon: Factory,
    color: "#6f42c1",
    permissionKeys: ["production"],
  },
  {
    id: "finance",
    title: "Accounts & Finance",
    description: "Ledgers, vouchers, balance sheet and P&L.",
    path: "/AccFinancedashboard",
    icon: DollarSign,
    color: "#20c997",
    permissionKeys: ["accountAndFinance"],
  },
  {
    id: "masters",
    title: "Masters",
    description: "Item, customer, vendor and configuration masters.",
    path: "/Masters",
    icon: Settings,
    color: "#0dcaf0",
    permissionKeys: ["masters"],
  },
];

const hasPermission = (user, keys) =>
  keys.some((k) => user[k] === true);

const Dashboard = () => {
  const navigate = useNavigate();
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  const user = useMemo(() => {
    try {
      const stored = localStorage.getItem("user");
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      console.log("All user keys:", Object.keys(parsed));
      return parsed;
    } catch {
      return null;
    }
  }, []);

  const allowedModules = useMemo(() => {
    if (!user) return [];
    return ALL_MODULES.filter((m) => hasPermission(user, m.permissionKeys));
  }, [user]);

  // Cards to display: if logged in show only allowed, else show all as preview
  const displayModules = user ? allowedModules : ALL_MODULES;

  const handleCardClick = (path) => {
    if (!user) {
      // Not logged in — show alert, don't navigate
      setShowLoginAlert(true);
      setTimeout(() => setShowLoginAlert(false), 4000);
      return;
    }
    navigate(path);
  };

  return (
    <div className="bg-light" style={{ minHeight: "100vh" }}>

      {/* Header */}
      <header className="bg-white border-bottom shadow-sm">
        <div className="container-fluid px-4 py-3 d-flex justify-content-between align-items-center">
          <h1 className="h4 mb-0 fw-bold text-primary d-flex align-items-center gap-2">
            <TrendingUp size={22} />
            MSME ERP System
          </h1>
          <div className="d-flex align-items-center gap-3">
            {user ? (
              <>
                <div className="text-end d-none d-sm-block">
                  <div className="small fw-semibold">{user.userName}</div>
                  <div className="small text-muted">{user.userRole}</div>
                </div>
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                  style={{ width: 40, height: 40 }}
                >
                  {user.userName?.charAt(0).toUpperCase()}
                </div>
              </>
            ) : (
              <button
                className="btn btn-primary btn-sm px-3"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Login alert banner */}
      {showLoginAlert && (
        <div
          className="alert alert-warning alert-dismissible mb-0 rounded-0 d-flex align-items-center justify-content-between"
          style={{ borderLeft: "4px solid #fd7e14" }}
        >
          <div className="d-flex align-items-center gap-2">
            <Lock size={18} />
            <span>
              Please <strong>login first</strong> to access this module.
            </span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-warning btn-sm"
              onClick={() => navigate("/login")}
            >
              Login Now
            </button>
            <button
              className="btn-close"
              onClick={() => setShowLoginAlert(false)}
            />
          </div>
        </div>
      )}

      {/* Main */}
      <main className="container-fluid px-4 py-4">
        <h2 className="h3 fw-bold mb-1">Select a Module</h2>
        <p className="text-muted mb-4">
          {user ? (
            <>
              Showing <strong>{allowedModules.length}</strong> module
              {allowedModules.length !== 1 ? "s" : ""} for role —{" "}
              <span className="badge bg-secondary">{user.userRole}</span>
            </>
          ) : (
            <>
              <Lock size={14} className="me-1 text-warning" />
              Login to access your assigned modules.
            </>
          )}
        </p>

        <div className="row g-3">
          {displayModules.map((m) => {
            const Icon = m.icon;
            const isLocked = !user;
            return (
              <div key={m.id} className="col-12 col-md-6 col-lg-4">
                <div
                  className="card shadow-sm border-0 h-100"
                  role="button"
                  onClick={() => handleCardClick(m.path)}
                  style={{
                    cursor: "pointer",
                    transition: "transform 0.15s, box-shadow 0.15s",
                    opacity: isLocked ? 0.65 : 1,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  <div className="card-body d-flex">
                    <div
                      className="me-3 d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                      style={{ width: 46, height: 46, backgroundColor: m.color }}
                    >
                      <Icon size={24} color="#fff" />
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="card-title mb-1 fw-semibold d-flex align-items-center gap-2">
                        {m.title}
                        {isLocked && <Lock size={13} className="text-muted" />}
                      </h5>
                      <p className="card-text small text-muted mb-2">
                        {m.description}
                      </p>
                      <span
                        className="small fw-semibold"
                        style={{ color: isLocked ? "#aaa" : m.color }}
                      >
                        {isLocked ? "Login to open →" : "Open module →"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;