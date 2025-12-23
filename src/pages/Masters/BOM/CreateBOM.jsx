import React, { useEffect, useState } from "react";
import Select from "react-select";
import { FaPlus, FaTimes, FaPaperPlane, FaPlusCircle } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CreateBOM() {
  const [options, setOptions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [grades, setGrades] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [itemDetails, setItemDetails] = useState({
    itemCode: "",
    uom: "",
    currency: "",
    avgPrice: "",
    buyerName: "",
  });
  const [level] = useState(1);
  const [assemblyCode, setAssemblyCode] = useState("");
  const [productList, setProductList] = useState([]);
  const [showBomForm, setShowBomForm] = useState(false);
  const [hideMainForm, setHideMainForm] = useState(false);
  const [finquantity, setQuantity] = useState(null);
  const [procureType, setProcureType] = useState("Manufacture");
  const [selectedParent, setSelectedParent] = useState(null);
  const [bomItems, setBomItems] = useState([]);
  const [rmSearchInput, setRmSearchInput] = useState("");
  const [rmOptionsOriginal, setRmOptionsOriginal] = useState([]);
  const [rmOptions, setRmOptions] = useState([]);
  const [selectedRmItem, setSelectedRmItem] = useState(null);
  const [rmGrades, setRmGrades] = useState([]);
  const [selectedRmGrade, setSelectedRmGrade] = useState("");
  const [rmDetails, setRmDetails] = useState({
    itemCode: "",
    uom: "",
    currency: "",
    avgPrice: "",
  });
  const [rmQuantity, setRmQuantity] = useState("");
  const [rmProcureType, setRmProcureType] = useState("Manufacture");
  const [currentRmLevel, setCurrentRmLevel] = useState(2);
  const [disabledSubBOM, setDisabledSubBOM] = useState([]);
  const [rmAssemblyCode, setRmAssemblyCode] = useState("");
  const [qtyGrams, setQtyGrams] = useState("");
  const [isBOMExists, setIsBOMExists] = useState(false);
  const [creatingSubBOM, setCreatingSubBOM] = useState([]);

  // ======= FETCH ITEMS =======
  useEffect(() => {
    fetch("https://msmeerpsyn9-core.azurewebsites.net/api/BOM/GetBOMData?category=SELL")
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "ItemNames") {
          const formatted = data.data.map((name) => ({ value: name, label: name }));
          setOptions(formatted);
        }
      })
      .catch((err) => console.error(err));

    fetch("https://msmeerpsyn9-core.azurewebsites.net/api/BOM/GetBOMData?category=BUY")
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "ItemNames") {
          const formatted = data.data.map((name) => ({ value: name, label: name }));
          setRmOptionsOriginal(formatted);
          setRmOptions(formatted);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // ======= HANDLE FINISH ITEM =======
  const handleItemChange = (item) => {
    setSelectedItem(item);
    setSelectedGrade("");
    setGrades([]);
    setItemDetails({ itemCode: "", uom: "", currency: "", avgPrice: "", buyerName: "" });

    if (!item) return;
    fetch(
      `https://msmeerpsyn9-core.azurewebsites.net/api/BOM/GetBOMData?category=SELL&itemName=${encodeURIComponent(
        item.value
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "Grades") setGrades(data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleGradeChange = async (grade) => {
    setSelectedGrade(grade);
    setIsBOMExists(false);

    if (!selectedItem) return;
    try {

      const checkRes = await fetch(
        `https://msmeerpsyn9-core.azurewebsites.net/api/BOM/GetBOMData?category=SELL&itemName=${encodeURIComponent(
          selectedItem.value
        )}&grade=${encodeURIComponent(grade)}&checkBOMExists=true`
      );
      const checkData = await checkRes.json();

      if (checkData.type === "CheckBOM" && checkData.exists) {
        toast.error("ALREADY BOM IS CREATED FOR THIS FINISH ITEM");
        setIsBOMExists(true);
        setItemDetails({ itemCode: "", uom: "", currency: "", avgPrice: "", buyerName: "" });
        setQuantity("");
        return;
      }
      setIsBOMExists(false);
      const res = await fetch(
        `https://msmeerpsyn9-core.azurewebsites.net/api/BOM/GetBOMData?category=SELL&itemName=${encodeURIComponent(
          selectedItem.value
        )}&grade=${encodeURIComponent(grade)}`
      );
      const data = await res.json();
      if (data.type === "ItemDetails") {
        const payload = data.data || data;
        setItemDetails({
          itemCode: payload.itemcode || payload.Item_Code || "",
          uom: payload.uom || payload.Unit_Of_Measurement || "",
          currency: payload.currency || payload.Currency || "",
          avgPrice: payload.averagep || payload.Average_Price || "",
          buyerName: payload.buyerName || payload.Company_Name || "",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    setAssemblyCode(itemDetails.itemCode ? itemDetails.itemCode + level : "");
  }, [itemDetails.itemCode, level]);

  //================Add FInish product to List=========================

  const addProductToList = () => {
    if (!selectedItem) {
      toast.error("Please select Item Name");
      return;
    }
    if (!selectedGrade) {
      toast.error("Please select Grade");
      return;
    }
    if (!finquantity || Number(finquantity) <= 0) {
      toast.error("Please enter valid Quantity");
      return;
    }
    const newProduct = {
      itemName: selectedItem.value,
      grade: selectedGrade,
      itemCode: itemDetails.itemCode,
      uom: itemDetails.uom,
      currency: itemDetails.currency,
      avgPrice: itemDetails.avgPrice,
      finquantity: Number(finquantity),
      procureType,
      assemblyCode,
      level,
      buyerName: itemDetails.buyerName,
    };
    setProductList(prev => [...prev, newProduct]);
  };

  const removeProduct = (index) => setProductList((prev) => prev.filter((_, i) => i !== index));

  const openBomForm = (product) => {
    setSelectedParent(product);
    setHideMainForm(true);
    setShowBomForm(true);
    setBomItems([]);
    setSelectedRmItem(null);
    setSelectedRmGrade("");
    setRmDetails({ itemCode: "", uom: "", currency: "", avgPrice: "" });
    setRmQuantity("");
    setRmProcureType("Manufacture");
    setRmAssemblyCode("");
    setQtyGrams("");
  };

  // ======= RM SELECTION LOGIC =======

  useEffect(() => {
    if (!rmSearchInput) setRmOptions(rmOptionsOriginal);
    else {
      const q = rmSearchInput.toLowerCase();
      setRmOptions(rmOptionsOriginal.filter((o) => o.label.toLowerCase().includes(q)));
    }
  }, [rmSearchInput, rmOptionsOriginal]);

  const handleRmSelect = (rm) => {
    setSelectedRmItem(rm);
    setSelectedRmGrade("");
    setRmGrades([]);
    setRmDetails({ itemCode: "", uom: "", currency: "", avgPrice: "" });
    if (!rm) return;

    fetch(
      `https://msmeerpsyn9-core.azurewebsites.net/api/BOM/GetBOMData?category=BUY&itemName=${encodeURIComponent(rm.value)}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "Grades") setRmGrades(data.data);
      })
      .catch((err) => console.error(err));
  };
  const handleRmGradeChange = (grade) => {
    setSelectedRmGrade(grade);
    if (!selectedRmItem) return;
    fetch(
      `https://msmeerpsyn9-core.azurewebsites.net/api/BOM/GetBOMData?category=BUY&itemName=${encodeURIComponent(
        selectedRmItem.value
      )}&grade=${encodeURIComponent(grade)}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "ItemDetails") {
          const payload = data.data || data;
          setRmDetails({
            itemCode: payload.itemcode || payload.Item_Code || "",
            uom: payload.uom || payload.Unit_Of_Measurement || "",
            currency: payload.currency || payload.Currency || "",
            avgPrice: payload.averagep || payload.Average_Price || "",
          });
        }
      })
      .catch((err) => console.error(err));
  };

  // RM Assembly Code
  useEffect(() => {
    setRmAssemblyCode(rmDetails.itemCode ? rmDetails.itemCode + String(currentRmLevel) : "");
  }, [rmDetails.itemCode, currentRmLevel]);

  // Qty in grams
  useEffect(() => {
    if (!rmQuantity) setQtyGrams("");
    else {
      const q = parseFloat(rmQuantity);
      if (Number.isNaN(q)) setQtyGrams("");
      else setQtyGrams(rmDetails.uom?.toLowerCase().includes("kg") ? String(q * 1000) : String(q));
    }
  }, [rmQuantity, rmDetails.uom]);

  // ==================Add RM to BOM===================================

  const addRmToBom = () => {
    if (!selectedRmItem) {
      toast.error("Please select Item Name");
      return;
    }
    if (!selectedRmGrade) {
      toast.error("Please select Item Grade");
      return;
    }
    if (!rmDetails?.itemCode) {
      toast.error("Please select Item Code");
      return;
    }
    const qtyValue = Number(rmQuantity);
    if (!rmQuantity || isNaN(qtyValue) || qtyValue <= 0) {
      toast.error("Please enter valid Quantity");
      return;
    }
    const rmRow = {
      id: crypto.randomUUID(),
      ItemName: selectedRmItem.value,
      grade: selectedRmGrade,
      itemCode: rmDetails.itemCode,
      uom: rmDetails.uom,
      currency: rmDetails.currency,
      avgPrice: rmDetails.avgPrice,
      assemblyCode: rmAssemblyCode,
      quantity: qtyValue,
      procureType: rmProcureType,
      qtyGrams,
      currentRmLevel,
      parentId: selectedParent?.id,
      isTemp: true
    };
    setBomItems(prev => [...prev, rmRow]);
    if (selectedParent?.id) {
      setCreatingSubBOM(prev =>
        prev.filter(id => id !== selectedParent.id)
      );
      setDisabledSubBOM(prev =>
        prev.includes(selectedParent.id)
          ? prev
          : [...prev, selectedParent.id]
      );
    }
    setSelectedRmItem(null);
    setSelectedRmGrade("");
    setRmDetails({ itemCode: "", uom: "", currency: "", avgPrice: "" });
    setRmQuantity("");
    setRmProcureType("Manufacture");
    setQtyGrams("");
  };
  const removeBomRow = (idx) => {
    setBomItems(prev => {
      const removedRow = prev[idx];
      if (!removedRow) return prev;

      if (removedRow.parentId) {
        setDisabledSubBOM(d =>
          d.filter(id => id !== removedRow.parentId)
        );
        setCreatingSubBOM(c =>
          c.filter(id => id !== removedRow.parentId)
        );
      }
      return prev.filter((_, i) => i !== idx);
    });
  };

  const closeBomForm = () => {
    setShowBomForm(false);
    setHideMainForm(false);

    if (selectedParent?.id) {
      setCreatingSubBOM(prev =>
        prev.filter(id => id !== selectedParent.id)
      );
    }
    setSelectedParent(null);
    setCurrentRmLevel(2);
  };

  // create sub bom==============================

  const createSubBOM = (parentRm) => {
    if (!parentRm || parentRm.procureType !== "Manufacture") return;

    setCreatingSubBOM(prev =>
      prev.includes(parentRm.id) ? prev : [...prev, parentRm.id]
    );
    const parentLevel = parentRm.currentRmLevel || parentRm.level || 1;
    setCurrentRmLevel(parentLevel + 1);
    setSelectedParent(parentRm);
    setShowBomForm(true);
    setHideMainForm(true);
  };

  // ======= SUBMIT BOM =======================================

  const submitbom = async () => {
    if (!selectedParent) {
      toast.error("No Finish Item Selected for BOM.");
      return;
    }
    if (bomItems.length === 0) {
      toast.error("Add at least one RM item to save BOM.");
      return;
    }
    try {
      const totalRmQty = bomItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

      const enrichedRMItems = bomItems.map((rm) => ({
        ...rm,
        Level: String(rm.currentRmLevel ?? currentRmLevel),
        AveragePrice: Number(rm.avgPrice || 0),
        QtyInGrms: Number(rm.qtyGrams || 0),
        quantity: Number(rm.quantity || 0),
        IsActive: true,
      }));
      if (finquantity === null || finquantity <= 0) {
        toast.error("Finish Item Quantity must be greater than 0");
        return;
      }
      const payload = {
        FinishItem: {
          ItemName: selectedItem.value,
          Grade: selectedGrade || "",
          ItemCode: itemDetails.itemCode,
          UOM: itemDetails.uom,
          Currency: itemDetails.currency,
          Quantity: Number(finquantity),
          ProcureType: selectedParent.procureType || "",
          AssemblyCode: assemblyCode,
          AveragePrice: itemDetails.avgPrice,
          Buyer_Name: itemDetails.buyerName,
          Level: String(level),
          TotalRmQty: totalRmQty,
          QtyInGrms: itemDetails.qtyGrams,
          IsActive: true,
        },
        RMItems: enrichedRMItems,
      };

      console.log("Payload being sent:", JSON.stringify(payload, null, 2));

      const response = await fetch("https://msmeerpsyn9-core.azurewebsites.net/api/BOM/SaveBOMItem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await response.json();

      if (response.ok) {
        toast.success("BOM Saved Successfully!");
        setQuantity(null);
        closeBomForm();
      } else {
        toast.error("Error Saving BOM: " + (json?.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error occurred while saving BOM.");
    }
  };

  //=================================Form View ================================

  return (
    <div className="p-2" style={{ paddingBottom: "100px" }}>

      <ToastContainer position="top-right" autoClose={3000} />
      {!hideMainForm && (
        <div className="card shadow-sm m-2" style={{ borderRadius: 10 }}>
          <h3 className="mb-3 bom-headers ps-3">
            Create BOM <span style={{ fontSize: "17px", color: "black" }}>(Finish Item Details)</span>
          </h3>
          <div className="row g-3 p-3">
            <div className="col-md-3">
              <label className="form-label label-dark">Select Finish Item Item</label>
              <Select
                options={options}
                placeholder="Search item..."
                onChange={handleItemChange}
                value={selectedItem}
                isClearable />
            </div>
            <div className="col-md-3">
              <label className="form-label label-dark">Grade</label>
              <select
                className="form-select"
                value={selectedGrade}
                onChange={(e) => handleGradeChange(e.target.value)}>
                <option value="">Select Grade</option>
                {grades.map((g, i) => (
                  <option key={i} value={g}> {g} </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label label-dark">Item Code</label>
              <input type="text" className="form-control" value={itemDetails.itemCode} disabled />
            </div>
            <div className="col-md-3">
              <label className="form-label label-dark">UOM</label>
              <input type="text" className="form-control" value={itemDetails.uom} disabled />
            </div>
            <div className="col-md-3">
              <label className="form-label label-dark">Currency</label>
              <input type="text" className="form-control" value={itemDetails.currency} disabled />
            </div>
            <div className="col-md-3">
              <label className="form-label label-dark">Average Price</label>
              <input type="text" className="form-control" value={itemDetails.avgPrice} disabled />
            </div>
            <div className="col-md-3">
              <label className="form-label label-dark">Assembly Code</label>
              <input type="text" className="form-control" value={assemblyCode} readOnly />
            </div>

            <div className="col-md-3">
              <label className="form-label label-dark">
                Quantity <span className="text-danger">*</span>
              </label>
              <input
                className="form-control" type="text" inputMode="numeric" value={finquantity ?? ""}
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-", ".", ","].includes(e.key)) { e.preventDefault(); }
                }}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setQuantity(value);
                  }
                }}
                onPaste={(e) => {
                  const pasted = e.clipboardData.getData("text");
                  if (!/^\d+$/.test(pasted)) {
                    e.preventDefault();
                  }
                }} />
            </div>
            <div className="col-md-3">
              <label className="form-label label-dark">Procure Type</label>
              <select id="ProcureType"
                className="form-select"
                value={procureType}
                onChange={(e) => setProcureType(e.target.value)}
                disabled >
                <option value="Manufacture">Manufacture</option>
                <option value="BoughtOut">BoughtOut</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label label-dark">Level</label>
              <input type="text" className="form-control" value={level} disabled />
            </div>

            <div className="col-md-3">
              <label className="form-label label-dark">Buyer Name</label>
              <input type="text" className="form-control" value={itemDetails.buyerName} readOnly />
            </div>

            <div className="col-md-3 d-flex align-items-end">
              <button
                onClick={addProductToList}
                className="blue-button"
                disabled={isBOMExists} >
                <FaPlus />  ADD ITEM
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======= ADDED PRODUCTS TABLE (always visible when items exist) ======= */}
      {productList.length > 0 && (
        <div className="mt-4 p-3">
          <h4 className="">Finish Item List</h4>
          <div
            style={{ maxHeight: "400px", overflowY: "auto", maxWidth: "1234px", overflowX: "auto", border: "1px solid #ccc" }}>
            <table className="table table-bordered table-striped" style={{ width: "1700px" }}>
              <thead className="table-primary" style={{ fontWeight: 600, fontSize: 17 }}>
                <tr>
                  <th>Item Name</th>
                  <th>Grade</th>
                  <th>Item Code</th>
                  <th>UOM</th>
                  <th>Currency</th>
                  <th>Average Price</th>
                  <th>Assembly Code</th>
                  <th>Quantity</th>
                  <th>Level</th>
                  <th>Buyer Name</th>
                  <th>Procure Type</th>
                  <th className="sticky-header-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {productList.map((p, idx) => (
                  <tr key={idx}>
                    <td style={{ width: "200px" }}>{p.itemName}</td>
                    <td style={{ width: "200px" }}>{p.grade}</td>
                    <td>{p.itemCode}</td>
                    <td>{p.uom}</td>
                    <td>{p.currency}</td>
                    <td style={{ width: "150px" }}>{p.avgPrice}</td>
                    <td style={{ width: "150px" }}>{p.assemblyCode}</td>
                    <td>{p.finquantity}</td>
                    <td>{p.level}</td>
                    <td style={{ width: "200px" }}>{p.buyerName}</td>
                    <td style={{ width: "150px" }}>{p.procureType}</td>
                    <td className="text-center sticky-header-right" style={{ display: "flex", gap: "10px" }}>
                      {p.procureType?.toLowerCase() === "manufacture" && (
                        <button
                          className="create-sub-bom-btn"
                          onClick={() => openBomForm(p)}>
                          <FaPlusCircle /> Create Sub BOM
                        </button>
                      )}
                      <button
                        className="btn-sm list-btns"
                        style={{ border: "none", fontSize: "20px" }}
                        title="Cancel BOM"
                        onClick={() => removeProduct(idx)} > ❌
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======= CREATE BOM FORM (Form 2) ======= */}
      {showBomForm && (
        <div className="card shadow-sm m-2" style={{ borderRadius: 10 }}>
          <div
            className="d-flex justify-content-between align-items-center ps-3 bom-headers">
            <h4 className="mb-0 bom-headers">
              Create BOM for: {selectedParent?.itemName}
            </h4>
            <button
              className="list-btns"
              style={{ color: "black", border: "none", borderRadius: "4px", fontSize: "25px" }}
              onClick={closeBomForm}>
              <FaTimes />
            </button>
          </div>
          <div className="row g-3 p-3">
            <div className="col-md-3">
              <label className="form-label label-dark">Select RM Item</label>
              <Select
                options={rmOptions}
                placeholder="Select RM item"
                value={selectedRmItem}
                onChange={handleRmSelect}
                isClearable
                isSearchable={true}
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: "#007bff",
                    boxShadow: "none",
                  }),
                }} />
            </div>
            <div className="col-md-3">
              <label className="form-label label-dark">Grade</label>
              <select
                className="form-select"
                value={selectedRmGrade}
                onChange={(e) => handleRmGradeChange(e.target.value)}>
                <option value="">Select Grade</option>
                {rmGrades.map((g, i) => (
                  <option key={i} value={g}> {g}   </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label label-dark">Item Code</label>
              <input type="text" className="form-control" value={rmDetails.itemCode} disabled />
            </div>

            <div className="col-md-3">
              <label className="form-label label-dark">UOM</label>
              <input type="text" className="form-control" value={rmDetails.uom} disabled />
            </div>

            <div className="col-md-3">
              <label className="form-label label-dark">Currency</label>
              <input type="text" className="form-control" value={rmDetails.currency} disabled />
            </div>

            <div className="col-md-3">
              <label className="form-label label-dark">Average Price</label>
              <input type="text" className="form-control" value={rmDetails.avgPrice} disabled />
            </div>

            <div className="col-md-3">
              <label className="form-label label-dark">Assembly Code</label>
              <input type="text" className="form-control" value={rmAssemblyCode} readOnly />
            </div>

            <div className="col-md-3">
              <label className="form-label label-dark">Level</label>
              <input type="text" className="form-control" value={currentRmLevel} disabled />
            </div>

            <div className="col-md-3">
              <label className="form-label label-dark">Quantity</label>
              <input type="number" className="form-control"
                value={rmQuantity}
                onChange={(e) => setRmQuantity(e.target.value)} />
            </div>

            <div className="col-md-3">
              <label className="form-label label-dark">Procure Type</label>
              <select
                className="form-select" value={rmProcureType}
                onChange={(e) => setRmProcureType(e.target.value)}>
                <option value="Manufacture">Manufacture</option>
                <option value="BoughtOut">BoughtOut</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label label-dark">Quantity in Grams</label>
              <input type="text" className="form-control" value={qtyGrams} readOnly />
            </div>

            <div className="col-md-3 d-flex align-items-end">
              <button onClick={addRmToBom} className="blue-button">
                <FaPlus /> Add RM to BOM
              </button>
            </div>
          </div>
          <div className="mt-4 p-3" style={{ marginBottom: "30px" }}>
            <h4 className="fw-semibold"><span>Bought Item List-</span>({bomItems.length})</h4>
            {bomItems.length === 0 ? (
              <div className="text-muted">No RM items added yet.</div>
            ) : (
              <div
                style={{ maxHeight: "350px", overflowY: "auto", maxWidth: "1200px", overflowX: "auto", border: "1px solid #ccc", marginTop: "10px" }} >
                <table className="table table-bordered table-sm table-striped" style={{ width: "1590px" }}>
                  <thead className="table-primary" style={{ fontWeight: 600, fontSize: 18, height: "40px" }}>
                    <tr>
                      <th>RM Item</th>
                      <th>Grade</th>
                      <th>Item Code</th>
                      <th>UOM</th>
                      <th>Currency</th>
                      <th>Average Price</th>
                      <th>Assembly Code</th>
                      <th>Level</th>
                      <th>Procure Type</th>
                      <th>Qty</th>
                      <th>Qty (g)</th>
                      <th>Create Sub BOM</th>
                      <th>Cancel</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bomItems.map((r, i) => (
                      <tr key={i}>
                        <td style={{ width: "200px" }}>{r.ItemName}</td>
                        <td style={{ width: "200px" }}>{r.grade}</td>
                        <td>{r.itemCode}</td>
                        <td>{r.uom}</td>
                        <td>{r.currency}</td>
                        <td style={{ width: "150px" }}>{r.avgPrice}</td>
                        <td style={{ width: "150px" }}>{r.assemblyCode}</td>
                        <td>{r.currentRmLevel}</td>
                        <td style={{ width: "150px" }}>{r.procureType}</td>
                        <td>{r.quantity}</td>
                        <td>{r.qtyGrams}</td>
                        <td className="text-center">
                          {r.procureType === "Manufacture" && (
                            <>
                              {!creatingSubBOM.includes(r.id) &&
                                !disabledSubBOM.includes(r.id) && (
                                  <button
                                    className="btn-sm create-sub-bom-btn"
                                    onClick={() => createSubBOM(r)}>
                                    <FaPlusCircle /> Create Sub BOM
                                  </button>
                                )}
                              {creatingSubBOM.includes(r.id) && (
                                <span className="btn-badge">
                                  Creating…
                                </span>
                              )}
                              {disabledSubBOM.includes(r.id) && (
                                <span className="btn-badge">
                                  ✓ Created
                                </span>
                              )}
                            </>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn-sm list-btns"
                            style={{ border: "none", fontSize: "20px" }}
                            onClick={() => removeBomRow(i)} >
                            ❌
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="9" style={{ textAlign: "right", fontWeight: "bold" }}> Total</td>
                      <td style={{ fontWeight: "bold" }}>
                        {bomItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0)}
                      </td>
                      <td style={{ fontWeight: "bold" }}>
                        {bomItems.reduce((sum, item) => sum + Number(item.qtyGrams || 0), 0)}
                      </td>
                      <td colSpan="2"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
          {bomItems.length > 0 && (
            <div className="mt-3 d-flex justify-content-center mb-4 gap-3">
              <button onClick={submitbom} className="submit-button">
                <FaPaperPlane /> Submit
              </button>
              <button onClick={closeBomForm} className="cancel-button">
                <FaTimes /> Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CreateBOM;
