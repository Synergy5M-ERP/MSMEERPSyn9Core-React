import React, { useState } from "react";
import NotCreated from "../../components/NotCreated";
import "./Sales.css";

function QuotationMaster() {
  // Page action: create / view
  const [selectedAction, setSelectedAction] = useState("create");
  const [selectedType, setSelectedType] = useState("ExternalQuotation");

  // Toggle collapse sections
  const [showBuyer, setShowBuyer] = useState(true);
  const [showItem, setShowItem] = useState(false);

  // Buyer details state
  const [buyer, setBuyer] = useState({
    companyName: "SWAMI SAMARTH POLYFILM INDUSTRIES PVT LTD",
    companyAddress: "GAT NO 226, AT POST CHIMBALI, TAL KHED",
    empCode: "",
    email: "",
    selectedBuyer: "",
    selectedEnquiry: "",
    vendorCode: "",
    country: "",
    state: "",
    city: "",
    contactEmail: "",
    contactPerson: "",
    contactNo: "",
    paymentTerms: "",
    priceBasis: "",
    offerValidity: "",
    shippedBy: "",
  });

  // Item details state
  const [item, setItem] = useState({
    itemName: "",
    grade: "",
    itemCode: "",
    hsCode: "",
    uom: "",
    currencyCode: "",
    offeredQty: "",
    moq: "",
    offeredPrice: "",
    discountPercent: "",
    discountValue: "",
    discountPrice: "",
    taxType: "",
    igst: "",
    cgst: "",
    sgst: "",
    totalTax: "",
    totalCost: "",
  });

  // List of added items
  const [itemsList, setItemsList] = useState([]);

  const handleAddProduct = () => {
    setItemsList([...itemsList, item]);
    setItem({
      itemName: "",
      grade: "",
      itemCode: "",
      hsCode: "",
      uom: "",
      currencyCode: "",
      offeredQty: "",
      moq: "",
      offeredPrice: "",
      discountPercent: "",
      discountValue: "",
      discountPrice: "",
      taxType: "",
      igst: "",
      cgst: "",
      sgst: "",
      totalTax: "",
      totalCost: "",
    });
  };

  const handleAddVendor = () => {
    alert("Add Vendor functionality");
  };

  //--------------- View Quotation ---------------
  const [filters, setFilters] = useState({
    buyer: "",
    enquiryNo: "",
    quotationNo: "",
  });

  const [showTables, setShowTables] = useState(false);

  const [buyerDetails, setBuyerDetails] = useState([
    {
      buyerName: "BAJAJ AUTO LIMITED",
      vendorCode: "V001",
      country: "India",
      state: "Maharashtra",
      city: "Pune",
      email: "contact@bajajauto.com",
      contactPerson: "Rajesh Kumar",
      contactNumber: "9876543210",
      paymentTerms: "30 Days",
      priceBasis: "FOB",
      offerValidity: "2026-03-31",
      shippedBy: "Air",
      enquiryNo: "ENQ123",
      enquiryDate: "2026-03-01",
      deleted: false,
    },
  ]);

  const [itemDetails, setItemDetails] = useState([
    {
      itemName: "Brake Pad",
      itemCode: "BP001",
      grade: "A",
      uom: "Piece",
      currency: "INR",
      offeredPrice: 500,
      offeredQty: 100,
      moq: 50,
      hsCode: "87083010",
      discountPercent: 5,
      discountValue: 25,
      discountPrice: 475,
      taxApp: "GST",
      taxRate: 18,
      igst: 85.5,
      cgst: 42.75,
      sgst: 42.75,
      totalTax: 171,
      totalItemCode: "BP001-A",
      deleted: false,
    },
  ]);

  const handleSoftDeleteBuyer = (index) => {
    const newData = [...buyerDetails];
    newData[index].deleted = !newData[index].deleted;
    setBuyerDetails(newData);
  };

  const handleSoftDeleteItem = (index) => {
    const newData = [...itemDetails];
    newData[index].deleted = !newData[index].deleted;
    setItemDetails(newData);
  };

  const handleSearch = () => {
    setShowTables(true);
  };

  // Page content switch
  const getPageContent = () => {
    if (selectedType === "ExternalQuotation") {
      switch (selectedAction) {
        case "create":
          return (
            <div className="container-fluid py-4" style={{ minHeight: "80vh" }}>

      {/* Collapsible Sections */}
      <div className="container-fluid">
        {/* Buyer Section */}
        <div className="card mb-3 shadow-sm">
          <div
            className="card-header fw-bold  d-flex justify-content-between align-items-center" 
            style={{ cursor: "pointer",backgroundColor:"darkcyan",color:"white" }}
            onClick={() => setShowBuyer(!showBuyer)}
          >
            <span>BUYER DETAILS</span>
            <span>{showBuyer ? "▲" : "▼"}</span>
          </div>
          {showBuyer && (
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Company Name</label>
                  <input type="text" className="form-control" value={buyer.companyName} readOnly />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Company Address</label>
                  <input type="text" className="form-control" value={buyer.companyAddress} readOnly />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Emp Code</label>
                  <input
                    type="text"
                    className="form-control"
                    value={buyer.empCode}
                    onChange={(e) => setBuyer({ ...buyer, empCode: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={buyer.email}
                    onChange={(e) => setBuyer({ ...buyer, email: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Select Buyer</label>
                  <select
                    className="form-select form-control"
                    value={buyer.selectedBuyer}
                    onChange={(e) => setBuyer({ ...buyer, selectedBuyer: e.target.value })}
                  >
                    <option>--Select Buyer--</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Select Enquiry</label>
                  <select
                    className="form-select form-control"
                    value={buyer.selectedEnquiry}
                    onChange={(e) => setBuyer({ ...buyer, selectedEnquiry: e.target.value })}
                  >
                    <option>--Select Enquiry--</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Vendor Code</label>
                  <input
                    type="text"
                    className="form-control"
                    value={buyer.vendorCode}
                    onChange={(e) => setBuyer({ ...buyer, vendorCode: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    className="form-control"
                    value={buyer.country}
                    onChange={(e) => setBuyer({ ...buyer, country: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    className="form-control"
                    value={buyer.state}
                    onChange={(e) => setBuyer({ ...buyer, state: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-control"
                    value={buyer.city}
                    onChange={(e) => setBuyer({ ...buyer, city: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={buyer.contactEmail}
                    onChange={(e) => setBuyer({ ...buyer, contactEmail: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Contact Person</label>
                  <input
                    type="text"
                    className="form-control"
                    value={buyer.contactPerson}
                    onChange={(e) => setBuyer({ ...buyer, contactPerson: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Contact No.</label>
                  <input
                    type="text"
                    className="form-control"
                    value={buyer.contactNo}
                    onChange={(e) => setBuyer({ ...buyer, contactNo: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Payment Terms</label>
                  <select
                    className="form-select form-control"
                    value={buyer.paymentTerms}
                    onChange={(e) => setBuyer({ ...buyer, paymentTerms: e.target.value })}
                  >
                    <option>--Select Payment Terms--</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Price Basis</label>
                  <select
                    className="form-select form-control"
                    value={buyer.priceBasis}
                    onChange={(e) => setBuyer({ ...buyer, priceBasis: e.target.value })}
                  >
                    <option>--Select Price Basis--</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Offer Validity</label>
                  <input
                    type="date"
                    className="form-control"
                    value={buyer.offerValidity}
                    onChange={(e) => setBuyer({ ...buyer, offerValidity: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Shipped By</label>
                  <input
                    type="date"
                    className="form-control"
                    value={buyer.shippedBy}
                    onChange={(e) => setBuyer({ ...buyer, shippedBy: e.target.value })}
                  />
                </div>
                <div className="col-md-3 mt-4">
                  <button className="btn btn-primary w-90" onClick={handleAddVendor}>
                    Add Vendor
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Item Section */}
        <div className="card mb-3 shadow-sm">
          <div
            className="card-header fw-bold text-white d-flex justify-content-between align-items-center"
            style={{ cursor: "pointer",backgroundColor:"darkcyan" }}
            onClick={() => setShowItem(!showItem)}
          >
            <span>ITEM DETAILS</span>
            <span>{showItem ? "▲" : "▼"}</span>
          </div>
          {showItem && (
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Item Name</label>
                  <select
                    className="form-select form-control"
                    value={item.itemName}
                    onChange={(e) => setItem({ ...item, itemName: e.target.value })}
                  >
                    <option>--Select Item--</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Grade</label>
                  <select
                    className="form-select form-control"
                    value={item.grade}
                    onChange={(e) => setItem({ ...item, grade: e.target.value })}
                  >
                    <option>--Select Grade--</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Item Code</label>
                  <input
                    type="text"
                    className="form-control"
                    value={item.itemCode}
                    onChange={(e) => setItem({ ...item, itemCode: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">HS Code</label>
                  <input
                    type="text"
                    className="form-control"
                    value={item.hsCode}
                    onChange={(e) => setItem({ ...item, hsCode: e.target.value })}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">UOM</label>
                  <input
                    type="text"
                    className="form-control"
                    value={item.uom}
                    onChange={(e) => setItem({ ...item, uom: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Currency Code</label>
                  <input
                    type="text"
                    className="form-control"
                    value={item.currencyCode}
                    onChange={(e) => setItem({ ...item, currencyCode: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Offered Qty</label>
                  <input
                    type="number"
                    className="form-control"
                    value={item.offeredQty}
                    onChange={(e) => setItem({ ...item, offeredQty: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">MOQ</label>
                  <input
                    type="number"
                    className="form-control"
                    value={item.moq}
                    onChange={(e) => setItem({ ...item, moq: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Offered Price</label>
                  <input
                    type="number"
                    className="form-control"
                    value={item.offeredPrice}
                    onChange={(e) => setItem({ ...item, offeredPrice: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Discount %</label>
                  <input
                    type="number"
                    className="form-control"
                    value={item.discountPercent}
                    onChange={(e) => setItem({ ...item, discountPercent: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Discount Value</label>
                  <input
                    type="number"
                    className="form-control"
                    value={item.discountValue}
                    onChange={(e) => setItem({ ...item, discountValue: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Discount Price</label>
                  <input
                    type="number"
                    className="form-control"
                    value={item.discountPrice}
                    onChange={(e) => setItem({ ...item, discountPrice: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Tax Type</label>
                  <select
                    className="form-select form-control"
                    value={item.taxType}
                    onChange={(e) => setItem({ ...item, taxType: e.target.value })}
                  >
                    <option>--Select Tax Type--</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">IGST</label>
                  <input
                    type="number"
                    className="form-control"
                    value={item.igst}
                    onChange={(e) => setItem({ ...item, igst: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">CGST</label>
                  <input
                    type="number"
                    className="form-control"
                    value={item.cgst}
                    onChange={(e) => setItem({ ...item, cgst: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">SGST</label>
                  <input
                    type="number"
                    className="form-control"
                    value={item.sgst}
                    onChange={(e) => setItem({ ...item, sgst: e.target.value })}
                  />
                </div>
                <div className="col-md-3 mt-4">
                  <button className="btn btn-primary w-90" onClick={handleAddProduct}>
                    Add Product
                  </button>
                </div>
              </div>

              {/* Items Table */}
              {itemsList.length > 0 && (
                <div className="table-responsive mt-3">
                  <table className="table table-bordered table-striped text-center">
                    <thead className="table-dark">
                      <tr>
                        <th>Item Name</th>
                        <th>Grade</th>
                        <th>Item Code</th>
                        <th>HS Code</th>
                        <th>UOM</th>
                        <th>Currency</th>
                        <th>Offered Qty</th>
                        <th>MOQ</th>
                        <th>Offered Price</th>
                        <th>Discount %</th>
                        <th>Discount Value</th>
                        <th>Discount Price</th>
                        <th>Tax App</th>
                        <th>IGST</th>
                        <th>CGST</th>
                        <th>SGST</th>
                        <th>Total Tax</th>
                        <th>Total Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemsList.map((itm, idx) => (
                        <tr key={idx}>
                          <td>{itm.itemName}</td>
                          <td>{itm.grade}</td>
                          <td>{itm.itemCode}</td>
                          <td>{itm.hsCode}</td>
                          <td>{itm.uom}</td>
                          <td>{itm.currencyCode}</td>
                          <td>{itm.offeredQty}</td>
                          <td>{itm.moq}</td>
                          <td>{itm.offeredPrice}</td>
                          <td>{itm.discountPercent}</td>
                          <td>{itm.discountValue}</td>
                          <td>{itm.discountPrice}</td>
                          <td>{itm.taxType}</td>
                          <td>{itm.igst}</td>
                          <td>{itm.cgst}</td>
                          <td>{itm.sgst}</td>
                          <td>{itm.totalTax}</td>
                          <td>{itm.totalCost}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="text-center mt-4">
          <button className="btn btn-primary btn-lg">Submit Quotation</button>
        </div>
      </div>
    </div>
          );

        case "view":
          return (
            <div className="container-fluid py-4">
              <h2 className="headerTitle">View Quotation</h2>

              {/* Filters */}
              <div className="row g-3 mb-3">
                <div className="col-md-3">
                  <label className="labelStyle">Select Buyer</label>
                  <select
                    className="inputField"
                    value={filters.buyer}
                    onChange={(e) =>
                      setFilters({ ...filters, buyer: e.target.value })
                    }
                  >
                    <option value="">--Select Buyer--</option>
                    <option value="BAJAJ AUTO LIMITED">BAJAJ AUTO LIMITED</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="labelStyle">Enquiry Number</label>
                  <input
                    type="text"
                    className="inputField"
                    value={filters.enquiryNo}
                    onChange={(e) =>
                      setFilters({ ...filters, enquiryNo: e.target.value })
                    }
                    placeholder="Enter Enquiry No"
                  />
                </div>
                <div className="col-md-3">
                  <label className="labelStyle">Quotation Number</label>
                  <input
                    type="text"
                    className="inputField"
                    value={filters.quotationNo}
                    onChange={(e) =>
                      setFilters({ ...filters, quotationNo: e.target.value })
                    }
                    placeholder="Enter Quotation No"
                  />
                </div>
                <div className="col-md-3 d-flex align-items-end">
                  <button
                    className="btn btn-primary btnCustom w-100"
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                </div>
              </div>

              {/* Tables */}
              {showTables && (
                <>
                  {/* Buyer Details Table */}
                  <div className="cardCustom">
                    <h5 className="mb-3">Buyer Details</h5>
                    <div className="tableContainer">
                      <table className="table table-bordered table-hover table-striped text-center align-middle">
                        <thead>
                          <tr>
                            <th>Buyer Name</th>
                            <th>Vendor Code</th>
                            <th>Country</th>
                            <th>State</th>
                            <th>City</th>
                            <th>Email</th>
                            <th>Contact Person</th>
                            <th>Contact Number</th>
                            <th>Payment Terms</th>
                            <th>Price Basis</th>
                            <th>Offer Validity</th>
                            <th>Shipped By</th>
                            <th>Enquiry No</th>
                            <th>Enquiry Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {buyerDetails.map((buyer, idx) => (
                            <tr
                              key={idx}
                              className={buyer.deleted ? "softDeleted" : ""}
                            >
                              <td>{buyer.buyerName}</td>
                              <td>{buyer.vendorCode}</td>
                              <td>{buyer.country}</td>
                              <td>{buyer.state}</td>
                              <td>{buyer.city}</td>
                              <td>{buyer.email}</td>
                              <td>{buyer.contactPerson}</td>
                              <td>{buyer.contactNumber}</td>
                              <td>{buyer.paymentTerms}</td>
                              <td>{buyer.priceBasis}</td>
                              <td>{buyer.offerValidity}</td>
                              <td>{buyer.shippedBy}</td>
                              <td>{buyer.enquiryNo}</td>
                              <td>{buyer.enquiryDate}</td>
                              <td>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleSoftDeleteBuyer(idx)}
                                >
                                  {buyer.deleted ? "Restore" : "Delete"}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Item Details Table */}
                  <div className="cardCustom">
                    <h5 className="mb-3">Item Details</h5>
                    <div className="tableContainer">
                      <table className="table table-bordered table-hover table-striped text-center align-middle">
                        <thead>
                          <tr>
                            <th>Item Name</th>
                            <th>Item Code</th>
                            <th>Grade</th>
                            <th>UOM</th>
                            <th>Currency</th>
                            <th>Offered Price</th>
                            <th>Offered Qty</th>
                            <th>MOQ</th>
                            <th>HS Code</th>
                            <th>Discount(%)</th>
                            <th>Discount Value</th>
                            <th>Discount Price</th>
                            <th>Tax App</th>
                            <th>Tax Rate</th>
                            <th>IGST Value</th>
                            <th>CGST Value</th>
                            <th>SGST Value</th>
                            <th>Total Tax Value</th>
                            <th>Total Item Code</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {itemDetails.map((item, idx) => (
                            <tr
                              key={idx}
                              className={item.deleted ? "softDeleted" : ""}
                            >
                              <td>{item.itemName}</td>
                              <td>{item.itemCode}</td>
                              <td>{item.grade}</td>
                              <td>{item.uom}</td>
                              <td>{item.currency}</td>
                              <td>{item.offeredPrice}</td>
                              <td>{item.offeredQty}</td>
                              <td>{item.moq}</td>
                              <td>{item.hsCode}</td>
                              <td>{item.discountPercent}</td>
                              <td>{item.discountValue}</td>
                              <td>{item.discountPrice}</td>
                              <td>{item.taxApp}</td>
                              <td>{item.taxRate}</td>
                              <td>{item.igst}</td>
                              <td>{item.cgst}</td>
                              <td>{item.sgst}</td>
                              <td>{item.totalTax}</td>
                              <td>{item.totalItemCode}</td>
                              <td>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleSoftDeleteItem(idx)}
                                >
                                  {item.deleted ? "Restore" : "Delete"}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          );

        default:
          return <NotCreated />;
      }
    }
    return <NotCreated />;
  };

  return (
    <div className="container-fluid py-4">
      <h4 className="mb-3 text-primary fw-700">QUOTATION</h4>

      {/* Action Selector */}
      <div className="d-flex gap-3 flex-wrap mb-4">
        {["create", "view"].map((action) => {
          const labels = { create: "Create Quotation", view: "View" };
          const isSelected = selectedAction === action;
          return (
            <div
              key={action}
              className={`form-check form-check-inline p-3 border-white shadow-sm transition-all ${
                isSelected
                  ? "border-primary bg-white shadow-lg"
                  : "border-secondary bg-light"
              }`}
              style={{
                cursor: "pointer",
                minWidth: "150px",
                borderRadius: "25px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
              }}
              onClick={() => setSelectedAction(action)}
            >
              <input
                className="form-check-input"
                type="radio"
                name="action"
                value={action}
                checked={isSelected}
                onChange={() => setSelectedAction(action)}
                id={action}
              />
              <label
                className="form-check-label fw-bold"
                htmlFor={action}
                style={{ marginLeft: "8px", cursor: "pointer" }}
              >
                {labels[action]}
              </label>
            </div>
          );
        })}
      </div>

      {/* Page Content */}
      {getPageContent()}
    </div>
  );
}

export default QuotationMaster;