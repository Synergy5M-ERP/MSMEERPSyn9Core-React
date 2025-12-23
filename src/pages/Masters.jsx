import React, { useState } from "react";
import CreateItem from "./CreateItem";
import CreateVendor from "./CreateVendor";
import InventoryAdd from "./InventoryAdd";

function Masters() {
  const [selectedPage, setSelectedPage] = useState("itemMaster");

  return (
    <div style={{ display: "flex", minHeight: "90vh" }}>

      {/* ================= Sidebar ================= */}
      <div
        style={{
          width: "250px",
          background: "#003d80",
          color: "white",
          padding: "25px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "25px",
          boxShadow: "2px 0 10px rgba(0,0,0,0.1)"
        }}
      >
        <h2 style={{ fontSize: "22px", marginBottom: "10px" }}>Masters</h2>

        {/* Sidebar Options */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            fontSize: "18px",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          <span
            onClick={() => setSelectedPage("itemMaster")}
            style={{
              padding: "10px 12px",
              borderRadius: "6px",
              background: selectedPage === "itemMaster" ? "#0059b3" : "transparent"
            }}
          >
            Item Master
          </span>

          <span
            onClick={() => setSelectedPage("vendorMaster")}
            style={{
              padding: "10px 12px",
              borderRadius: "6px",
              background: selectedPage === "vendorMaster" ? "#0059b3" : "transparent"
            }}
          >
            Vendor Master
          </span>

          <span
            onClick={() => setSelectedPage("inventoryMaster")}
            style={{
              padding: "10px 12px",
              borderRadius: "6px",
              background: selectedPage === "inventoryMaster" ? "#0059b3" : "transparent"
            }}
          >
            Inventory Master
          </span>
        </div>
      </div>

      {/* ================= Main Content ================= */}
      <div style={{ flex: 1, padding: "30px 40px" }}>
        {selectedPage === "itemMaster" && <CreateItem />}
        {selectedPage === "vendorMaster" && <CreateVendor />}
        {selectedPage === "inventoryMaster" && <InventoryAdd />}
      </div>
    </div>
  );
}

export default Masters;
