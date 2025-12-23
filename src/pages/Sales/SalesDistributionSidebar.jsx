import React, { useState } from "react";
import {
    DashboardCustomize,
    Inventory,
    HelpCenter,
    TaxiAlert,
    Recommend,
} from "@mui/icons-material";

import {
    ListOrdered,
    FileSpreadsheet,
    FileSymlink,
    Warehouse,
    DessertIcon
} from "lucide-react";

import { RiBillFill } from "react-icons/ri";
import { FaFileInvoice, FaGoodreads, FaSalesforce } from "react-icons/fa";

const SalesDistributionSidebar = ({ selected, onSelect }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [expandedMenu, setExpandedMenu] = useState(null);

    const menuItems = [
        { label: "Dashboard", icon: <DashboardCustomize />, key: "Dashboard" },
        { label: "Inventory Master", icon: <Inventory />, key: "inventoryMaster" },
        { label: "BOM", icon: <RiBillFill />, key: "BOM" },
        { label: "Sales Invoice", icon: <FaSalesforce />, key: "SalesInvoice" },

        {
            label: "Enquiry To Sales Order",
            icon: <ListOrdered />,
            key: "EnquiryToSales",
            subItems: [
                { label: "Enquiry", icon: <HelpCenter />, key: "Enquiry" },
                { label: "Quotation Master", icon: <FaFileInvoice />, key: "Quotation" },
                { label: "Direct/External SO", icon: <FileSpreadsheet />, key: "DirectExternalSO" },
                { label: "Generic/Repeate SO", icon: <FileSymlink />, key: "GenericRepeateSO" }
            ]
        },
        {label:"Tax Invoice",icon:<TaxiAlert/>,key:"taxInvoice"},
        {label:"SO Reconciliation",icon:<Recommend/>,key:"SOReconciliation"},
        {label:"WareHouse",icon:<Warehouse/>,key:"WareHouse"},
          {label:"Dispach Advise",icon:<DessertIcon/>,key:"dispachAdvise"},
          {label:"Sales Return GRN",icon:<FaGoodreads/>,key:"SalesReturnGRN"}
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
        if (!collapsed) {
            setExpandedMenu(null);
        }
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
                height: "120vh",
                overflowY: "auto",
                userSelect: "none",
                boxSizing: "border-box"
            }}
        >
            {/* Collapse Button */}
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

            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {menuItems.map((item) => {
                    const isSelected =
                        selected === item.key ||
                        (item.subItems && item.subItems.some((s) => s.key === selected));
                    const isExpanded = expandedMenu === item.key;

                    return (
                        <li key={item.key} style={{ position: "relative" }}>
                            {/* MAIN ITEM WITH ICON */}
                            <div
                                onClick={() => handleItemClick(item.key, !!item.subItems)}
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
                                <div style={{ marginRight: collapsed ? 0 : 15 }}>
                                    {item.icon}
                                </div>

                                {!collapsed && <span>{item.label}</span>}

                                {!collapsed && item.subItems && (
                                    <span style={{ marginLeft: "auto" }}>
                                        {isExpanded ? "▾" : "▸"}
                                    </span>
                                )}
                            </div>

                            {/* SUB-ITEMS WITH ICONS */}
                            {item.subItems && isExpanded && !collapsed && (
                                <ul style={{ listStyle: "none", paddingLeft: 30, marginTop: 6 }}>
                                    {item.subItems.map((sub) => {
                                        const subSelected = selected === sub.key;

                                        return (
                                            <li
                                                key={sub.key}
                                                onClick={() => onSelect(sub.key)}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    padding: "8px 10px",
                                                    cursor: "pointer",
                                                    fontWeight: subSelected ? "bold" : "normal",
                                                    backgroundColor: subSelected ? "#cce4ff" : "transparent",
                                                    borderRadius: 4,
                                                    color: subSelected ? "#0050b3" : "#444",
                                                }}
                                            >
                                                {/* Submenu Icon */}
                                                <span style={{ marginRight: 10 }}>{sub.icon}</span>
                                                <span>{sub.label}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}

                            {/* FLYOUT when collapsed */}
                            {item.subItems && isExpanded && collapsed && (
                                <ul
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: "100%",
                                        backgroundColor: "#fff",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                        borderRadius: 4,
                                        padding: 10,
                                        minWidth: 180,
                                        zIndex: 10,
                                    }}
                                >
                                    {item.subItems.map((sub) => {
                                        const subSelected = selected === sub.key;

                                        return (
                                            <li
                                                key={sub.key}
                                                onClick={() => onSelect(sub.key)}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    padding: "8px 10px",
                                                    cursor: "pointer",
                                                    fontWeight: subSelected ? "bold" : "normal",
                                                    backgroundColor: subSelected ? "#cce4ff" : "transparent",
                                                    borderRadius: 4,
                                                    color: subSelected ? "#0050b3" : "#444",
                                                }}
                                            >
                                                <span style={{ marginRight: 10 }}>{sub.icon}</span>
                                                <span>{sub.label}</span>
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

export default SalesDistributionSidebar;
