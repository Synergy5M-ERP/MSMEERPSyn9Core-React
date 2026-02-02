import React, { useState } from "react";
import { FaPlus, FaTimes, FaPaperPlane, FaPlusCircle } from "react-icons/fa";
import {
  Box, Card, CardContent, Typography, Grid, TextField, Accordion, AccordionSummary, AccordionDetails, Divider
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { API_ENDPOINTS } from "../../config/apiconfig";
import axios from "axios";



function Domestic() {

  // ==============================
  // STATE
  // ==============================
  const [prType, setPrType] = useState("");
  const [prNumber, setPrNumber] = useState("");
  const [prList, setPrList] = useState([]);

  const [prError, setPrError] = useState("");

  const [itemList, setItemList] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [itemError, setItemError] = useState("");

  const [specificationList, setSpecificationList] = useState([]);
  const [selectedSpecification, setSelectedSpecification] = useState("");

  const [itemDetails, setItemDetails] = useState(null);

  // ==============================
  // FETCH PR NUMBERS
  // ==============================
  const fetchPRNumbers = async (prType) => {
    try {
      const res = await axios.get(API_ENDPOINTS.GetPRNumbers, {
        params: { prType }
      });
      return res.data;
    } catch (err) {
      console.error("PR number fetch error", err);
      return [];
    }
  };

  // ==============================
  // COMMON FETCH METHOD
  // ==============================
  const fetchPRData = async (params) => {
    try {
      const res = await axios.get(API_ENDPOINTS.GetPRItemDetails, {
        params
      });
      return res.data;
    } catch (err) {
      console.error("PR data fetch error", err);
      return null;
    }
  };

  // ==============================
  // PR TYPE CHANGE
  // ==============================
  const handlePRTypeChange = async (e) => {
    const type = e.target.value;

    setPrType(type);
    setPrNumber("");
    setPrList([]);
    setItemList([]);
    setSpecificationList([]);
    setSelectedItem("");
    setSelectedSpecification("");
    setItemDetails(null);

    if (!type) return;

    const data = await fetchPRNumbers(type);

    if (!data || data.length === 0) {
      setPrError("No PR numbers found");
      return;
    }

    setPrList(data); // {value,text}[]
  };


  // ==============================
  // PR NUMBER CHANGE → FETCH ITEMS
  // ==============================
  const handlePRNumberChange = async (e) => {
    const prNo = e.target.value;
    setPrNumber(prNo);
    setItemList([]);
    setSpecificationList([]);
    setSelectedItem("");
    setSelectedSpecification("");
    setItemDetails(null);
    setItemError("");

    if (!prNo || !prType) return;

    const items = await fetchPRData({ prNo, prType });

    if (!items || items.length === 0) {
      setItemError("No items found");
      return;
    }

    // items is string[]
    setItemList(items);
  };

  // ==============================
  // ITEM CHANGE → FETCH SPECIFICATIONS
  // ==============================
  const handleItemChange = async (e) => {
    const itemName = e.target.value;
    setSelectedItem(itemName);
    setSelectedSpecification("");
    setSpecificationList([]);
    setItemDetails(null);

    if (!itemName) return;

    const specs = await fetchPRData({
      prNo: prNumber,
      prType,
      itemName
    });

    // specs is string[]
    setSpecificationList(specs || []);
  };

  // ==============================
  // SPEC CHANGE → FETCH FULL DETAILS
  // ==============================
  const handleSpecificationChange = async (e) => {
    const spec = e.target.value;
    setSelectedSpecification(spec);

    if (!spec) return;

    const details = await fetchPRData({
      prNo: prNumber,
      prType,
      itemName: selectedItem,
      specification: spec
    });

    if (!details) {
      console.error("No details returned for this specification");
      setItemDetails(null);
      return;
    }

    // ✅ copy all returned fields directly
    setItemDetails(details);

    console.log("Selected item details:", details);
  };




  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", mt: 4, mb: 4 }}>
      <Card elevation={4}>
        <CardContent>

          {/* ================= HEADER ================= */}
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Buying Enquiry – Domestic
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField
                label="Company Name"
                value="SWAMI SAMARTH POLYFILM INDUSTRIES PVT LTD"
                fullWidth
                disabled
                size="small"
                InputLabelProps={{
                  sx: {
                    fontSize: "1rem",
                    fontWeight: 600,
                    "&.MuiInputLabel-shrink": {
                      fontSize: "0.95rem",
                      fontWeight: 600
                    }
                  }
                }}
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "#000",
                    fontWeight: 600
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField
                label="Employee Code"
                fullWidth
                size="small"
                InputLabelProps={{
                  sx: {
                    fontSize: "1rem",
                    fontWeight: 600,
                    "&.MuiInputLabel-shrink": {
                      fontSize: "0.95rem",
                      fontWeight: 600
                    }
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField
                label="Email"
                fullWidth
                size="small"
                InputLabelProps={{
                  sx: {
                    fontSize: "1rem",
                    fontWeight: 600,
                    "&.MuiInputLabel-shrink": {
                      fontSize: "0.95rem",
                      fontWeight: 600
                    }
                  }
                }}
              />
            </Grid>
          </Grid>


          {/* ================= ITEM DETAILS ================= */}
          <Accordion defaultExpanded sx={{ mt: 4 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              className="item-details-header"
            >
              <Typography fontWeight="bold">Item Details</Typography>
            </AccordionSummary>

            <AccordionDetails>

              <div className="row g-3">

                {/* PR TYPE */}
                <div className="col-12 col-md-3">
                  <label className="label-dark">PR Type</label>
                  <select
                    className="form-select"
                    value={prType}
                    onChange={handlePRTypeChange}
                  >
                    <option value="">-- Select PR Type --</option>
                    <option value="Manual">Manual PR</option>
                    <option value="Auto">Auto PR</option>
                  </select>
                </div>

                {/* PR NUMBER */}
                {prType && (
                  <div className="col-12 col-md-3">
                    <label className="label-dark">{prType} PR Number</label>
                    <select
                      className="form-select"
                      value={prNumber}
                      onChange={handlePRNumberChange}
                    >
                      <option value="">Select PR Number</option>
                      {prList.map(pr => (
                        <option key={pr.value} value={pr.value}>
                          {pr.text}
                        </option>
                      ))}
                    </select>

                    {prError && <span className="text-danger small">{prError}</span>}
                  </div>
                )}

                {/* ITEM NAME */}
                {prNumber && (
                  <div className="col-12 col-md-3">
                    <label className="label-dark">Item Name</label>
                    <select
                      className="form-select"
                      value={selectedItem}
                      onChange={handleItemChange}
                    >
                      <option value="">Select Item</option>

                      {/* itemList is string[] */}
                      {itemList.map(item => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>

                    {itemError && <span className="text-danger small">{itemError}</span>}
                  </div>
                )}

                {/* SPECIFICATION */}
                {selectedItem && (
                  <div className="col-12 col-md-3">
                    <label className="label-dark">Specification</label>
                    <select
                      className="form-select"
                      value={selectedSpecification}
                      onChange={handleSpecificationChange}
                    >
                      <option value="">Select Specification</option>

                      {/* specificationList is string[] */}
                      {specificationList.map(spec => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

              </div>
              <hr />
              <div className="row g-3 mt-3">

                <div className="col-12 col-md-3">
                  <label className="label-dark">Item Code</label>
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={itemDetails?.itemCode || ""}
                  />
                </div>

                <div className="col-12 col-md-3">
                  <label className="label-dark">UOM</label>
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={itemDetails?.uom || ""}
                  />
                </div>

                <div className="col-12 col-md-3">
                  <label className="label-dark">Currency Code</label>
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={itemDetails?.currencyCode || ""}
                  />
                </div>

                <div className="col-12 col-md-3">
                  <label className="label-dark">Required Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    value={itemDetails?.reqQty || ""}
                    readOnly
                  />
                </div>
              </div>

              <div className="row g-3 mt-2">
                <div className="col-12 col-md-3">
                  <label className="label-dark">Target Price</label>
                  <input
                    type="number"
                    className="form-control"
                    value={itemDetails?.targetPrice || ""}
                    readOnly
                  />
                </div>



                <div className="col-12 col-md-3">
                  <label className="label-dark">Tax Applicable</label>
                  <select className="form-select">
                    <option>IGST</option>
                    <option>CGST + SGST</option>
                  </select>
                </div>

                <div className="col-12 col-md-3">
                  <label className="label-dark">Required By</label>
                  <input type="date" className="form-control" />
                </div>

                <div className="col-12 col-md-3">
                  <label className="label-dark">Payment Terms</label>
                  <input type="text" className="form-control" />
                </div>
              </div>
              <div className="row g-3 mt-2">

                <div className="col-12 col-md-3">
                  <label className="label-dark">Price Basis</label>
                  <input type="text" className="form-control" />
                </div>

                <div className="col-12 col-md-3">
                  <label className="label-dark">MOQ</label>
                  <input type="text" className="form-control" />
                </div>

                <div className="col-12 col-md-3">
                  <label className="label-dark">Enquiry Validity</label>
                  <input type="date" className="form-control" />
                </div>

              </div>

              <div className="mt-3" style={{ width: "130px" }}>
                <button variant="outlined" className="blue-button">ADD PRODUCT</button>
              </div>

            </AccordionDetails>

          </Accordion>


          {/* ================= SELLER DETAILS ================= */}
          <Accordion sx={{ mt: 3 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              className="item-details-header"
            >
              <Typography fontWeight="bold">Seller Details</Typography>
            </AccordionSummary>

            <AccordionDetails>
              <div className="row g-3">

                <div className="col-12 col-md-3">
                  <label className="form-label fw-semibold">Seller Name</label>
                  <input type="text" className="form-control" />
                </div>

                <div className="col-12 col-md-3">
                  <label className="form-label fw-semibold">Vendor Code</label>
                  <input type="text" className="form-control" disabled />
                </div>

                <div className="col-12 col-md-3">
                  <label className="form-label fw-semibold">Country</label>
                  <input type="text" className="form-control" disabled />
                </div>

                <div className="col-12 col-md-3">
                  <label className="form-label fw-semibold">State</label>
                  <input type="text" className="form-control" disabled />
                </div>

                <div className="col-12 col-md-3">
                  <label className="form-label fw-semibold">City</label>
                  <input type="text" className="form-control" disabled />
                </div>

                <div className="col-12 col-md-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input type="email" className="form-control" />
                </div>

                <div className="col-12 col-md-3">
                  <label className="form-label fw-semibold">Contact Person</label>
                  <input type="text" className="form-control" />
                </div>

                <div className="col-12 col-md-3">
                  <label className="form-label fw-semibold">Contact Number</label>
                  <input type="text" className="form-control" />
                </div>

              </div>

              <div className="mt-3" style={{ width: "130px" }}>
                <button variant="outlined" className="blue-button">ADD SELLER</button>
              </div>
            </AccordionDetails>
          </Accordion>

          {/* ================= SUBMIT ================= */}
          <div className="mt-3 d-flex justify-content-center mb-4 gap-3">
            <button className="submit-button">
              <FaPaperPlane /> Submit
            </button>
            <button className="cancel-button">
              <FaTimes /> Cancel
            </button>
          </div>

        </CardContent>
      </Card>
    </Box>
  );
}

export default Domestic;
