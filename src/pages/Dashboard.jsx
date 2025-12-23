// src/pages/Dashboard.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, Package, Factory, DollarSign, Settings, ShoppingCart, TrendingUp } from "lucide-react";

const modules = [
  {
    id: "hrm",
    title: "HRM",
    description: "Employees, attendance, payroll and HR operations.",
    path: "/hrm",
    icon: Users,
    color: "#0d6efd"
  },
  {
    id: "material",
    title: "Material Management",
    description: "Purchases, stock, GRN, consumables and inventory.",
    path: "/mm",
    icon: Package,
    color: "#198754"
  },
  {
    id: "sales",
    title: "Sales & Distribution",
    description: "Enquiries, quotations, orders, dispatch and invoicing.",
    path: "/salesanddistribution",
    icon: ShoppingCart,
    color: "#fd7e14"
  },
  {
    id: "production",
    title: "Production and Quality",
    description: "Planning, work orders, production tracking and reports.",
    path: "/production",
    icon: Factory,
    color: "#6f42c1"
  },
  {
    id: "finance",
    title: "Accounts & Finance",
    description: "Ledgers, vouchers, balance sheet and P&L.",
    path: "/AccFinancedashboard",
    icon: DollarSign,
    color: "#20c997"
  },
  {
    id: "masters",
    title: "Masters",
    description: "Item, customer, vendor and configuration masters.",
    path: "/Masters",
    icon: Settings,
    color: "#0dcaf0"
  }
];

const Dashboard = () => {
  const navigate = useNavigate();

  const handleCardClick = (path) => {
    navigate(path); // navigate to that module page [web:36][web:39]
  };

  return (
    <div className="bg-light" style={{ minHeight: "100vh" }}>
      {/* Top header – reuse same style as your app */}
      <header className="bg-white border-bottom shadow-sm">
        <div className="container-fluid px-4 py-3 d-flex justify-content-between align-items-center">
          <h1 className="h4 mb-0 fw-bold text-primary d-flex align-items-center gap-2">
            <TrendingUp size={22} />
            MSME ERP System
          </h1>
          <div className="d-flex align-items-center gap-3">
            <div className="text-end d-none d-sm-block">
              <div className="small fw-semibold">Welcome</div>
              {/* <div className="small text-muted">Last login: Today, 4:32 PM</div> */}
            </div>
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
              style={{ width: 40, height: 40 }}
            >
              A
            </div>
          </div>
        </div>
      </header>

      {/* Only cards */}
      <main className="container-fluid px-4 py-4">
        <h2 className="h3 fw-bold mb-3">Select a Module</h2>
        <p className="text-muted mb-4">
          Click a module card to open its detailed dashboard and transactions.
        </p>

        <div className="row g-3">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.id} className="col-12 col-md-6 col-lg-4">
                <div
                  className="card shadow-sm border-0 h-100 module-card"
                  role="button"
                  onClick={() => handleCardClick(m.path)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card-body d-flex">
                    <div
                      className="me-3 d-flex align-items-center justify-content-center rounded-3"
                      style={{
                        width: 46,
                        height: 46,
                        backgroundColor: m.color,
                      }}
                    >
                      <Icon size={24} className="text-white" />
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="card-title mb-1 fw-semibold">{m.title}</h5>
                      <p className="card-text small text-muted mb-2">
                        {m.description}
                      </p>
                      <span className="small text-primary fw-semibold">
                        Open module →
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
