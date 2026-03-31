import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import CreateItem from "../Masters/ItemMaster/CreateItem";
import CreateVendor from "../Masters/vendorMaster/CreateVendor";
import InventoryAdd from "../Masters/InventoryMaster/InventoryAdd";
import MasterDashboard from "../Masters/MasterDashboard";

function Masters() {

  const location = useLocation();

  const [selectedPage, setSelectedPage] = useState("Dashboard");

  useEffect(() => {
    if (location.state?.page) {
      setSelectedPage(location.state.page);
    }
  }, [location]);

  return (
    <div style={{ display: "flex", minHeight: "90vh" }}>

      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          background: "#003d80",
          color: "white",
          padding: "25px 20px"
        }}
      >
        <h2>Masters</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

          <span onClick={() => setSelectedPage("Dashboard")}>
            Dashboard
          </span>

          <span onClick={() => setSelectedPage("itemMaster")}>
            Item Master
          </span>

          <span onClick={() => setSelectedPage("vendorMaster")}>
            Vendor Master
          </span>

          <span onClick={() => setSelectedPage("inventoryMaster")}>
            Inventory Master
          </span>

        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "30px" }}>

        {selectedPage === "Dashboard" && <MasterDashboard />}

        {selectedPage === "itemMaster" && <CreateItem />}

        {selectedPage === "vendorMaster" && <CreateVendor />}

        {selectedPage === "inventoryMaster" && <InventoryAdd />}

      </div>

    </div>
  );
}

export default Masters;