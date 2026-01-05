import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaTimes, FaPlus, FaPlusCircle, FaPaperPlane, FaUndo } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Select from "react-select";

const ViewBOM = () => {
  const [bomList, setBomList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [activeView, setActiveView] = useState("buyer");
  const [showRmForm, setShowRmForm] = useState(false);
  const [formParentBOMId, setFormParentBOMId] = useState(null);
  const [rmFilter, setRmFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [selectedBuyer, setSelectedBuyer] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [showBOMList, setShowBOMList] = useState(true);
  const [editingParentRowId, setEditingParentRowId] = useState(null);
  const [selectedRmItem, setSelectedRmItem] = useState(null);
  const [rmOptions, setRmOptions] = useState([]);
  const [originalBomList, setOriginalBomList] = useState([]);
  const [rmGrades, setRmGrades] = useState([]);
  const [selectedRmGrade, setSelectedRmGrade] = useState("");
  const [rmDetails, setRmDetails] = useState({
    itemCode: "",
    uom: "",
    currency: "",
    avgPrice: ""
  });
  const [rmQuantity, setRmQuantity] = useState("");
  const [rmProcureType, setRmProcureType] = useState("Manufacture");
  const [currentRmLevel, setCurrentRmLevel] = useState(2);
  const [rmAssemblyCode, setRmAssemblyCode] = useState("");
  const [qtyGrams, setQtyGrams] = useState("");
  const [tempSubBOMRowId, setTempSubBOMRowId] = useState(null);
  const [subBOMStatus, setSubBOMStatus] = useState({});
  const [creatingSubBOM, setCreatingSubBOM] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);

  //=====================Fetch Finish Item List and related RM List========================
  const fetchBOMList = async () => {
    try {
      const res = await fetch("https://msmeerpsyn9-core.azurewebsites.net/api/BOM/GetBOMList");
      const data = await res.json();
      const fixed = data.map(b => ({
        ...b,
        finishItem: {
          FPBID: b.finishItem.fpbid,
          itemCode: b.finishItem.itemCode,
          quantity: b.finishItem.quantity,
          procureType: b.finishItem.procureType,
          ...b.finishItem
        },
        rmItems: b.rmItems.map(rm => ({
          ...rm,
          RMID: rm.rmid,
          tempId: rm.rmid > 0 ? null : (rm.tempId ?? Date.now() + Math.random())
        }))
      }));
      setBomList(fixed);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching BOM list");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBOMList();
  }, []);


  //==========================Delete Main BOM (Finish Item )======================
  const deleteBOM = async (bomId) => {
    if (!window.confirm("Are you sure you want to delete this BOM?")) return;
    try {
      const res = await fetch(`https://msmeerpsyn9-core.azurewebsites.net/api/BOM/DeleteBOM/${bomId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("BOM deleted successfully!");
        setBomList(prev => prev.filter(b => b.id !== bomId));
      } else {
        let errorMessage = "Error deleting BOM";
        try {
          const data = await res.json();
          if (data?.message) errorMessage = data.message;
        } catch (err) {
          errorMessage = res.statusText || errorMessage;
        }
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error");
    }
  };

  //=================================================================
  const toggleRawMaterials = (id) => {
    setExpandedId(expandedId === id ? null : id);
    if (expandedId !== id) {
      handleCancelRmForm();
    }
  };

  const handleViewTypeChange = (_, type) => {
    const viewType = type.toLowerCase().trim();

    setActiveView(viewType);
    console.log("Changing activeView to:", viewType);

    if (viewType !== "buyerbom") {
      setSelectedBuyer("");
    }
    setExpandedId(null);
    setIsTableEditMode(false);
    setEditingParentRowId(null);
    setShowRmForm(false);
  };

  //=======================Edit functionality for Manufacture  ====================
  const [isTableEditMode, setIsTableEditMode] = useState(false);
  const [editedRows, setEditedRows] = useState({});

  const UpdateBOM = async ({ bomId, mode }) => {
    const resolvedBomId =
      bomId ??
      editingParentRowId ??
      expandedId ??
      null;
    const currentBOM = bomList.find(b => b.id === resolvedBomId);

    if (!currentBOM || !currentBOM.finishItem) {
      toast.error("No BOM selected for update.");
      return;
    }
    const finishItem = currentBOM.finishItem;
    const editedFinish = editedRows[resolvedBomId] || {};
    const isBoughtOut = mode === "boughtout";

    const payload = {
      FinishItem: {
        FPBID: finishItem.FPBID,
        Quantity: Number(editedFinish.finishQty ?? finishItem.quantity) || 0,
        ProcureType: isBoughtOut ? "BoughtOut" : "Manufacture"
      },
      RMItems: []
    };
    if (Array.isArray(currentBOM.rmItems)) {
      payload.RMItems = currentBOM.rmItems.map(rm => {
        const rowId = rm.RMID
          ? String(rm.RMID)
          : `${finishItem.itemCode}-${rm.itemCode}-${rm.tempId}`;

        const editedRM = editedRows[rowId] || {};
        const updatedQty =
          Number(editedRM.rmQty ?? editedRM.quantity ?? rm.quantity) || 0;

        const perUnitGrams = rm.uom?.toLowerCase().includes("kg")
          ? 1000
          : rm.qtyInGrmsPerUnit ?? 1;

        return {
          RMID: rm.RMID || 0,
          FPBID: finishItem.FPBID,
          ItemName: rm.itemName || "",
          ItemCode: rm.itemCode || "",
          Quantity: updatedQty,
          UOM: rm.uom || "",
          ProcureType:
            rm.procureType === "BoughtOut"
              ? editedRM.procureType ?? rm.procureType
              : rm.procureType,
          Grade: rm.grade || "",
          Currency: rm.currency || "INR",
          AssemblyCode: rm.assemblyCode || "",
          AveragePrice: Number(rm.avgPrice) || 0,
          Level: rm.level ? String(rm.level) : "",
          QtyInGrms: updatedQty * perUnitGrams,
          IsActive: !rm.toDelete,
          qtyInGrmsPerUnit: perUnitGrams
        };
      });
    }
    try {
      const res = await fetch("https://msmeerpsyn9-core.azurewebsites.net/api/BOM/UpdateBOM", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Failed to update BOM");
      }
      setBomList(prev =>
        prev.map(b =>
          b.id !== currentBOM.id ? b : {
            ...b,
            finishItem: {
              ...b.finishItem,
              quantity: payload.FinishItem.Quantity,
              procureType: payload.FinishItem.ProcureType
            },
            rmItems: b.rmItems.map(rm => {
              const rowId = rm.RMID
                ? String(rm.RMID)
                : `${finishItem.itemCode}-${rm.itemCode}-${rm.tempId}`;

              const editedRM = editedRows[rowId] || {};
              const updatedQty =
                Number(
                  editedRM.rmQty ?? editedRM.quantity ?? rm.quantity
                ) || 0;
              const perUnitGrams = rm.uom?.toLowerCase().includes("kg")
                ? 1000
                : rm.qtyInGrmsPerUnit ?? 1;
              return {
                ...rm,
                quantity: updatedQty,
                QtyInGrms: updatedQty * perUnitGrams,
                procureType:
                  rm.procureType === "BoughtOut"
                    ? editedRM.procureType ?? rm.procureType
                    : rm.procureType,
                qtyInGrmsPerUnit: perUnitGrams
              };
            })
          }
        )
      );
      setSubBOMStatus(prev => {
        const updatedStatus = { ...prev };

        currentBOM.rmItems.forEach(rm => {
          if (rm.rmItems && rm.rmItems.length > 0) {
            const rowId = rm.RMID
              ? String(rm.RMID)
              : rm.rowId ?? rm.tempId;
            if (rowId) {
              updatedStatus[rowId] = "created";
            }
          } else {
            const rowId = rm.RMID
              ? String(rm.RMID)
              : rm.rowId ?? rm.tempId;
            if (rowId && updatedStatus[rowId] === "created") {
              delete updatedStatus[rowId];
            }
          }
        });
        return updatedStatus;
      });
      setIsTableEditMode(false);
      setEditedRows({});
      setEditingParentRowId(null);
      setShowRmForm(false);
      setTempSubBOMRowId(null);
      fetchBOMList();
      toast.success("BOM updated successfully!");
    } catch (err) {
      console.error("UpdateBOM error:", err);
      toast.error(err.message || "Network error updating BOM");
    }
  };


  useEffect(() => {
    const resetStatus = {};
    bomList.forEach(row => {
      if (!row.rmItems || row.rmItems.length === 0) {
        resetStatus[row.rowId] = undefined;
      }
    });
    setSubBOMStatus(prev => ({ ...prev, ...resetStatus }));
  }, [bomList]);

  const handleDelete = (rm) => {
    if (!window.confirm(`Are you sure you want to delete RM item: ${rm.itemName}?`)) return;

    let parentRowId = null;

    setBomList(prev =>
      prev.map(bom => {
        if (bom.id !== expandedId) return bom;

        let updatedRmItems;

        // 🔴 EXISTING → SOFT DELETE
        if (rm.RMID) {
          updatedRmItems = bom.rmItems.map(item => {
            if (item.RMID === rm.RMID) {
              parentRowId = item.parentRowId; // ✅ capture parent safely
              return { ...item, toDelete: true };
            }
            return item;
          });
        }
        // 🟢 TEMP → HARD REMOVE
        else {
          parentRowId = rm.parentRowId;
          updatedRmItems = bom.rmItems.filter(
            item => item.tempId !== rm.tempId
          );
        }

        return {
          ...bom,
          rmItems: updatedRmItems
        };
      })
    );

    // 🔁 RESET parent Sub-BOM status (same behavior as Cancel)
    if (parentRowId) {
      setSubBOMStatus(prev => {
        const copy = { ...prev };
        delete copy[parentRowId];
        return copy;
      });

      setCreatingSubBOM(prev =>
        prev.filter(id => id !== parentRowId)
      );
    }
  };

  const handleUndoDelete = (rm) => {
    if (!rm.RMID) return;

    setBomList(prev =>
      prev.map(bom => {
        if (bom.id !== expandedId) return bom;
        return {
          ...bom,
          rmItems: bom.rmItems.map(item =>
            item.RMID === rm.RMID
              ? { ...item, toDelete: false }
              : item
          )
        };
      })
    );
  };

  // ====================== FETCH RM ITEMS ======================
  useEffect(() => {
    const fetchRmItems = async () => {
      try {
        const res = await fetch(`https://msmeerpsyn9-core.azurewebsites.net/api/BOM/GetBOMData?category=BUY`);
        const data = await res.json();

        if (data.type === "ItemNames" && Array.isArray(data.data)) {
          const formattedOptions = data.data.map((name) => ({ value: name, label: name }));
          setRmOptions(formattedOptions);
        }
      } catch (err) {
        console.error("Failed to fetch RM items:", err);
      }
    };
    fetchRmItems();
  }, []);

  // ====================== Handle RM Item Select ======================
  const handleRmSelect = async (item) => {
    setSelectedRmItem(item);
    setSelectedRmGrade("");
    setRmGrades([]);
    setRmDetails({ itemCode: "", uom: "", currency: "", avgPrice: "" });

    if (!item) return;
    try {
      const res = await fetch(
        `https://msmeerpsyn9-core.azurewebsites.net/api/BOM/GetBOMData?category=BUY&itemName=${encodeURIComponent(item.value)}`
      );
      const data = await res.json();
      if (data.type === "Grades") {
        setRmGrades(data.data);
      } else if (data.type === "ItemDetails" && data.data) {
        setRmDetails({
          itemCode: data.data.itemcode || "",
          uom: data.data.uom || "",
          currency: data.data.currency || "",
          avgPrice: data.data.averagep || "",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ====================== Handle RM Grade Change ======================
  const handleRmGradeChange = async (grade) => {
    setSelectedRmGrade(grade);

    if (!selectedRmItem || !grade) return;
    try {
      const res = await fetch(
        `https://msmeerpsyn9-core.azurewebsites.net/api/BOM/GetBOMData?category=BUY&itemName=${encodeURIComponent(
          selectedRmItem.value
        )}&grade=${encodeURIComponent(grade)}`
      );
      const data = await res.json();
      if (data.type === "ItemDetails" && data.data) {
        setRmDetails({
          itemCode: data.data.itemcode || "",
          uom: data.data.uom || "",
          currency: data.data.currency || "",
          avgPrice: data.data.averagep || "",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ====================== Compute Quantity in Grams  ======================
  useEffect(() => {
    if (!rmQuantity) setQtyGrams("");
    else {
      const q = parseFloat(rmQuantity);
      if (Number.isNaN(q)) setQtyGrams("");
      else setQtyGrams(rmDetails.uom?.toLowerCase().includes("kg") ? String(q * 1000) : String(q));
    }
  }, [rmQuantity, rmDetails.uom]);

  //===================ADD NEW /SUB RM TO LIST============================

  const addRmToBom = () => {
    if (!expandedId) {
      toast.error("Please expand a BOM before adding a Raw Material.");
      return;
    }
    if (
      !selectedRmItem ||
      !selectedRmGrade ||
      !rmQuantity ||
      isNaN(Number(rmQuantity)) ||
      Number(rmQuantity) <= 0
    ) {
      toast.error("Please select RM Item, Grade, and enter a valid Quantity.");
      return;
    }
    const parentBOM = bomList.find(b => b.id === expandedId);
    if (!parentBOM) return;

    const newRm = {
      tempId: Date.now() + Math.random(),
      RMID: 0,
      itemName: selectedRmItem.value,
      grade: selectedRmGrade,
      itemCode: rmDetails.itemCode,
      uom: rmDetails.uom,
      quantity: Number(rmQuantity),
      procureType: rmProcureType,
      assemblyCode: rmAssemblyCode,
      level: currentRmLevel,
      currency: rmDetails.currency,
      avgPrice: rmDetails.avgPrice,
      qtyGrams,
      hasSubBOM: false,
    };
    if (editingParentRowId) {
      setSubBOMStatus(prev => ({
        ...prev,
        [editingParentRowId]: "created",
      }));
    }
    setBomList(prevList =>
      prevList.map(b => {
        if (b.id === expandedId) {
          const updatedRmItems = (b.rmItems || []).map(item =>
            item.rowId === editingParentRowId || item.tempId === editingParentRowId
              ? { ...item, hasSubBOM: true }
              : item
          );
          return {
            ...b,
            rmItems: [...updatedRmItems, newRm],
          };
        }
        return b;
      })
    );
    setShowRmForm(false);
    setEditingParentRowId(null);
    setTempSubBOMRowId(null);
    toast.success(`'${newRm.itemName}' added locally. Parent updated.`);
    handleClearRmForm();
    setTimeout(() => {
      document.getElementById("rmTableTop")?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  //================CREATE SUB BOM BUTTON SHOW AND HIDE ============================

  const handleCreateBOM = (rm, rowId) => {
    if (!expandedId) return;
    setSubBOMStatus(prev => ({ ...prev, [rowId]: "creating" }));
    setEditingParentRowId(rowId);
    setTempSubBOMRowId(rowId);
    handleClearRmForm();
    setCurrentRmLevel(rm.level ? Number(rm.level) + 1 : 2);
    setRmAssemblyCode(rm.itemCode || "");
    setFormParentBOMId(expandedId);
    setShowRmForm(true);
  };
  const handleClearRmForm = () => {
    setSelectedRmItem(null);
    setSelectedRmGrade("");
    setRmGrades([]);
    setRmDetails({ itemCode: "", uom: "", currency: "", avgPrice: "" });
    setRmQuantity("");
    setRmProcureType("Manufacture");
    setQtyGrams("");
  };

  const handleCancelRmForm = () => {
    setShowRmForm(false);
    setFormParentBOMId(null);
    handleClearRmForm();
    setEditingParentRowId(null);
    setCurrentRmLevel(2);
    setRmAssemblyCode("");
    if (editingParentRowId) {
      setSubBOMStatus(prev => {
        const copy = { ...prev };
        delete copy[editingParentRowId];
        return copy;
      });

      setCreatingSubBOM(prev =>
        prev.filter(id => id !== editingParentRowId)
      );
    }
    setEditingParentRowId(null);
    setSelectedParent(null);
  };

  //==============SET ORIGINAL LIST AFTER SAVE /EDIT/RELOAD =================

  useEffect(() => {
    setOriginalBomList(JSON.parse(JSON.stringify(bomList)));
  }, [bomList]);

  useEffect(() => {
    if (showRmForm && rmDetails.itemCode) {
      setRmAssemblyCode(rmDetails.itemCode + String(currentRmLevel));
    } else if (showRmForm) {
      const parentBOM = bomList.find(b => b.id === expandedId);
      setRmAssemblyCode(parentBOM?.finishItem?.itemCode || "");
    }
  }, [rmDetails.itemCode, currentRmLevel, showRmForm, expandedId]);
  useEffect(() => {
    setRmAssemblyCode(rmDetails.itemCode ? rmDetails.itemCode + String(currentRmLevel) : "");
  }, [rmDetails.itemCode, currentRmLevel]);

  const normalize = (value) =>
    (value || "")
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[-_]/g, "")
      .replace(/\s+/g, "");
  const normalizedView = (activeView || "buyer").toLowerCase().trim();
  if (loading) return <div>Loading...</div>;

  //  Normalize function  FILTER BOM LIST based on search text================

  const filteredBomList = bomList.filter((b) => {
    if (!searchText) return true;

    const q = searchText.toLowerCase();
    const parentMatch =
      b.finishItem?.itemName?.toLowerCase().includes(q) ||
      b.finishItem?.itemCode?.toLowerCase().includes(q) ||
      b.finishItem?.grade?.toLowerCase().includes(q) ||
      b.finishItem?.buyer_Name?.toLowerCase().includes(q) ||
      b.finishItem?.procureType?.toLowerCase().includes(q);
    const rmMatch = b.rmItems?.some((rm) =>
      [
        rm.itemName,
        rm.itemCode,
        rm.grade,
        rm.uom,
        rm.procureType,
        rm.assemblyCode,
        rm.quantity?.toString(),
      ].some((val) => val?.toString().toLowerCase().includes(q))
    );
    return parentMatch || rmMatch;
  });

  //==================FILTER BUYER WISE LIST =====================================

  const selectedBom = filteredBomList.find(x => x.id === expandedId);
  const buyerFilteredList = filteredBomList.filter((b) => {
    if (activeView !== "buyerbom") return true;

    const buyerMatch = selectedBuyer
      ? normalize(b.finishItem?.buyer_Name) === normalize(selectedBuyer) : true;
    const itemMatch = selectedItem
      ? normalize(b.finishItem?.itemName) === normalize(selectedItem) : true;
    const gradeMatch = selectedGrade
      ? normalize(b.finishItem?.grade) === normalize(selectedGrade) : true;
    return buyerMatch && itemMatch && gradeMatch;
  });
  const buyerList = [
    ...new Map(
      filteredBomList
        .map(b => b.finishItem?.buyer_Name)
        .filter(Boolean)
        .map(name => [normalize(name), name])
    ).values()
  ].sort();

  const itemList = [
    ...new Map(
      filteredBomList
        .filter(b =>
          selectedBuyer
            ? normalize(b.finishItem?.buyer_Name) === normalize(selectedBuyer)
            : false
        )
        .map(b => b.finishItem?.itemName)
        .filter(Boolean)
        .map(name => [normalize(name), name])
    ).values()
  ].sort();

  const gradeList = [
    ...new Map(
      filteredBomList
        .filter(b =>
          selectedBuyer &&
          selectedItem &&
          normalize(b.finishItem?.buyer_Name) === normalize(selectedBuyer) &&
          normalize(b.finishItem?.itemName) === normalize(selectedItem)
        )
        .map(b => b.finishItem?.grade)
        .filter(Boolean)
        .map(name => [normalize(name), name])
    ).values()
  ].sort();

  const enterEditMode = () => {
    setOriginalBomList(JSON.parse(JSON.stringify(bomList)));
    setIsTableEditMode(true);
  };

  //========================================MAIN FORM VIEW ==============================================

  return (

    <div className="p-3">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="d-flex gap-3 m-3">
        {["buyer", "bom", "bought"].map((type) => (
          <button
            key={type}
            className="btn btn-sm"
            style={{
              background: type === "buyer" ? "#ece8e4ff"
                : type === "bom" ? "#dcecdcff" : "#f8f3e4ff",
              fontWeight: "700",
              width: type === "buyer" ? "100px" : "300px",
              fontSize: "17px", color: "black", height: "33px",
              border: activeView === type || (!activeView && type === "buyer") ? "2px solid #000" : "none",
              boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
            }}
            onClick={() => handleViewTypeChange(null, type)}>
            {type === "buyer" ? "Show All"
              : type === "bom" ? "View Manufacture List" : "View BoughtOut List"}
          </button>
        ))}

        <button
          className="btn btn-sm"
          style={{
            background: "#e4f0f8ff", fontWeight: "700", width: "250px", fontSize: "17px", color: "black", height: "33px",
            border: activeView === "buyerbom" ? "2px solid #000" : "none",
            boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
          }}
          onClick={() => handleViewTypeChange(null, "buyerbom")} >
          Buyer Wise BOM
        </button>

        <input
          type="text"
          placeholder="Search..."
          className="form-control mb-2"
          style={{ width: "500px", marginLeft: "100px" }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)} />
      </div>

      {activeView === "buyerbom" && (
        <div className="m-3 p-3 d-flex gap-3 align-items-center justify-content-center">
          <select
            className="form-select"
            style={{ width: "250px" }}
            value={selectedBuyer}
            onChange={(e) => {
              setSelectedBuyer(e.target.value);
              setSelectedItem("");
              setSelectedGrade("");
            }}>
            <option value="">Select Buyer</option>
            {buyerList.map((b, i) => (
              <option key={i} value={b}>{b}</option>
            ))}
          </select>

          <select
            className="form-select"
            style={{ width: "250px" }}
            value={selectedItem}
            disabled={!selectedBuyer}
            onChange={(e) => {
              setSelectedItem(e.target.value);
              setSelectedGrade("");
            }}>
            <option value="">Select Item</option>
            {itemList.map((i, idx) => (
              <option key={idx} value={i}>{i}</option>
            ))}
          </select>

          <select
            className="form-select"
            style={{ width: "200px" }}
            value={selectedGrade}
            disabled={!selectedItem}
            onChange={(e) => setSelectedGrade(e.target.value)} >
            <option value="">Select Grade</option>
            {gradeList.map((g, idx) => (
              <option key={idx} value={g}>{g}</option>
            ))}
          </select>
        </div>
      )}

      {bomList.length === 0 ? (
        <div className="bom-headers">No BOMs found.</div>
      ) : (

        <div className="container">
          <div className="scroll-wrapper">
            <table className="table table-bordered scroll-container" style={{ minWidth: "1500px" }}>
              <thead className="table-primary">
                <tr style={{ fontSize: "25px" }}>
                  <th className="sticky-left-header">Sr No</th>
                  <th style={{ width: "200px" }}>Finish Item</th>
                  <th style={{ width: "200px" }}>Specification</th>
                  <th>Item Code</th>
                  <th>UOM</th>
                  <th style={{ width: "100px" }}>Quantity</th>
                  <th>Assembly Code</th>
                  <th style={{ width: "150px" }}>Buyer Name</th>
                  <th>Procure Type</th>
                  <th>Level</th>
                  <th className="sticky-header-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {buyerFilteredList
                  .filter((b) => {
                    const type = activeView || "buyer";
                    const procure = normalize(b.finishItem?.procureType);
                    if (type === "bom") return procure === "manufacture";
                    if (type === "bought") return procure === "boughtout";
                    return true;
                  })
                  .map((b, index) => {
                    const isManufacture =
                      (b.finishItem?.procureType || "").toLowerCase() === "manufacture";
                    const hasSubBOM =
                      Array.isArray(b.rmItems) && b.rmItems.length > 0;
                    const isCollapsed = expandedId !== b.id;
                    if (expandedId !== null && expandedId !== b.id) return null;
                    return (
                      <React.Fragment key={b.id}>
                        <tr>
                          <td className="sticky-left">{index + 1}</td>
                          <td>{b.finishItem?.itemName}</td>
                          <td>{b.finishItem?.grade}</td>
                          <td>{b.finishItem?.itemCode}</td>
                          <td>{b.finishItem?.uom}</td>
                          <td>
                            {editedRows[b.id] ? (
                              <input
                                type="number"
                                className="form-control"
                                value={editedRows[b.id]?.finishQty ?? b.finishItem.quantity}
                                onChange={(e) =>
                                  setEditedRows(prev => ({
                                    ...prev,
                                    [b.id]: {
                                      ...prev[b.id],
                                      finishQty: e.target.value,
                                      FPBID: b.finishItem.FPBID
                                    }
                                  }))
                                } />
                            ) : (
                              b.finishItem?.quantity
                            )}
                          </td>
                          <td>{b.finishItem?.assemblyCode}</td>
                          <td>{b.finishItem?.buyer_Name}</td>
                          <td>{b.finishItem?.procureType}</td>
                          <td>{b.finishItem?.level}</td>
                          <td className="d-flex gap-2 justify-content-center sticky-header-right">

                            {isManufacture && !hasSubBOM && isCollapsed && (
                              <button
                                className="btn-view-hide create-sub-bom-btn"
                                onClick={() => {
                                  toggleRawMaterials(b.id);
                                  setIsTableEditMode(true);
                                  setEditingParentRowId(b.id);
                                  setShowRmForm(true);
                                  setFormParentBOMId(b.id);
                                }} >
                                <FaPlusCircle /> Create Sub BOM
                              </button>
                            )}
                            {isManufacture && hasSubBOM && isCollapsed && (
                              <button
                                className="btn-view-hide view-sub-bom"
                                onClick={() => toggleRawMaterials(b.id)}>
                                View Sub BOM / Edit
                              </button>
                            )}
                            {expandedId === b.id && (b.finishItem?.procureType || "").toLowerCase() === "manufacture" && (
                              <div className="d-flex gap-2 align-items-center">
                                <button
                                  className="btn-view-hide btn-hide-rm"
                                  onClick={() => {
                                    toggleRawMaterials(b.id);
                                    setIsTableEditMode(false);
                                    setShowRmForm(false);
                                    setEditingParentRowId(null);
                                  }}>
                                  Hide RM
                                </button>
                                {!isTableEditMode || editingParentRowId !== b.id ? (
                                  <button className="btn-faedit"
                                    onClick={() => {
                                      setEditedRows(prev => ({
                                        ...prev,
                                        [b.id]: {
                                          finishQty: b.finishItem.quantity,
                                          procureType: "manufacture"
                                        }
                                      }));
                                      setIsTableEditMode(true);
                                      setEditingParentRowId(b.id);
                                    }} title="Edit BOM">
                                    <FaEdit />
                                  </button>
                                ) : (
                                  <span className="btn-badge"> Editing... </span>
                                )}
                              </div>
                            )}
                            {(b.finishItem?.procureType || "").toLowerCase() === "boughtout" && !editedRows[b.id] && (
                              <button className="btn-faedit"
                                onClick={() => {
                                  setEditedRows({
                                    ...editedRows,
                                    [b.id]: {
                                      quantity: b.finishItem.quantity,
                                      procureType: "bought",
                                    },
                                  });
                                }} title="Edit BOM" >
                                <FaEdit />
                              </button>
                            )}
                            {editedRows[b.id] && (b.finishItem?.procureType || "").toLowerCase() === "boughtout" && (
                              <div className="d-flex gap-2 align-items-center">
                                <button className="btn-boughtout-save"
                                  onClick={() =>
                                    UpdateBOM({ bomId: b.id, mode: "boughtout" })
                                  }>
                                  Save
                                </button>
                                <button className="btn-boughtout-cancel"
                                  onClick={() => {
                                    const copy = { ...editedRows };
                                    delete copy[b.id];
                                    setEditedRows(copy);
                                  }}>
                                  Cancel
                                </button>
                              </div>
                            )}
                            <button
                              className="p-1 text-danger btn-trash"
                              onClick={() => deleteBOM(b.id)}
                              title="Delete Main BOM">
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
              </tbody>
            </table>
          </div>
          {showBOMList && selectedBom && (
            <div>
              <div className="mt-3 p-2">
                <div className="raw-header d-flex justify-content-between align-items-center">
                  <span>
                    RAW MATERIALS FOR: {selectedBom.finishItem?.itemName} ({selectedBom.finishItem?.itemCode})
                  </span>
                  <div className="d-flex align-items-center gap-4 ps-3">
                    {["all", "manufacture", "boughtout"].map((type) => (
                      <label key={type} style={{ fontWeight: 700, fontSize: "15px", marginBottom: 0 }}>
                        <input
                          type="radio"
                          name="rmFilter"
                          value={type}
                          checked={rmFilter === type}
                          onChange={() => setRmFilter(type)}
                          style={{ marginRight: "5px" }} />
                        {type === "all"
                          ? "All"
                          : type === "manufacture" ? "Manufacture" : "BoughtOut"}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="d-flex gap-2">
                  {isTableEditMode && (
                    <button className="add-newRm-l2"
                      onClick={() => {
                        setShowRmForm(true);
                        setFormParentBOMId(selectedBom.id);
                        setCurrentRmLevel(2);
                        setRmAssemblyCode(selectedBom.finishItem?.itemCode || "");
                        handleClearRmForm();
                      }} >
                      If you wish to add item at only level 2 then click here <FaPlus />
                    </button>
                  )}
                </div>
              </div>

              {/* ============================RAW MATERIAL TABLE ============================ */}

              <div className="scroll-wrapper">
                <table className="table table-sm table-bordered mb-0" style={{ width: "1500px" }}>
                  <thead className="table-secondary">
                    <tr>
                      <th className="sticky-left-header">Sr No</th>
                      <th>RM Item Name</th>
                      <th>Specification</th>
                      <th>Item Code</th>
                      <th>UOM</th>
                      <th>Assembly Code</th>
                      <th>Procure Type</th>
                      <th>Level</th>
                      <th>Quantity</th>
                      <th>Quantity In Grams</th>
                      {isTableEditMode && <th style={{ width: "200px" }} className="sticky-header-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBom.rmItems
                      ?.filter((rm) => {
                        const procure = normalize(rm.procureType);
                        const q = normalize(searchText);
                        if (rmFilter === "manufacture") return procure === "manufacture";
                        if (rmFilter === "boughtout") return procure === "boughtout";
                        if (searchText) {
                          return [
                            rm.itemName,
                            rm.itemCode,
                            rm.grade,
                            rm.uom,
                            rm.procureType,
                            rm.assemblyCode,
                            rm.quantity?.toString(),
                          ].some((v) => normalize(v).includes(q));
                        }
                        return true;
                      })
                      .map((rm, idx) => {
                        const rowId = rm.RMID
                          ? String(rm.RMID)
                          : `${selectedBom.finishItem?.itemCode}-${rm.itemCode}-${idx}`;

                        const stored = editedRows[rowId] || rm;
                        const isMarkedForDeletion = rm.toDelete;
                        const hasSubBOM = selectedBom.rmItems?.some(
                          (sub) => sub.assemblyCode === rm.itemCode
                        );
                        if (showRmForm && rowId !== editingParentRowId) return null;
                        const q = parseFloat(stored.quantity) || 0;
                        const qtyInGrams = rm.uom?.toLowerCase().includes("kg") ? q * 1000 : q;
                        const effectiveProcureType =
                          editedRows[rowId]?.procureType ?? rm.procureType;
                        return (
                          <tr
                            key={rowId}
                            style={{
                              backgroundColor: isMarkedForDeletion ? "#f8d7da" : "",
                              textDecoration: isMarkedForDeletion ? "line-through" : "",
                              opacity: isMarkedForDeletion ? 0.7 : 1,
                            }}>
                            <td className="sticky-left">{idx + 1}</td>
                            <td>{rm.itemName}</td>
                            <td>{rm.grade}</td>
                            <td>{rm.itemCode}</td>
                            <td>{rm.uom}</td>
                            <td>{rm.assemblyCode}</td>
                            <td>
                              {isTableEditMode && !isMarkedForDeletion ? (
                                rm.procureType === "BoughtOut" ? (
                                  <select
                                    className="form-select form-select-sm"
                                    value={editedRows[rowId]?.procureType ?? rm.procureType}
                                    onChange={(e) =>
                                      setEditedRows(prev => ({
                                        ...prev,
                                        [rowId]: {
                                          ...prev[rowId],
                                          procureType: e.target.value,
                                          rmQty: prev[rowId]?.rmQty ?? rm.quantity,
                                        }
                                      }))
                                    }>
                                    <option value="Manufacture">Manufacture</option>
                                    <option value="BoughtOut">BoughtOut</option>
                                  </select>
                                ) : (
                                  rm.procureType
                                )
                              ) : (
                                rm.procureType
                              )}
                            </td>
                            <td>{rm.level}</td>
                            <td>
                              {isTableEditMode && !isMarkedForDeletion ? (
                                <input
                                  type="number"
                                  value={editedRows[rowId]?.rmQty ?? rm.quantity}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setEditedRows(prev => ({
                                      ...prev,
                                      [rowId]: {
                                        ...prev[rowId],
                                        rmQty: val === "" ? "" : Number(val),
                                        procureType: prev[rowId]?.procureType ?? rm.procureType
                                      }
                                    }));
                                  }}
                                  className="form-control" style={{ width: "100px" }} />
                              ) : (
                                rm.quantity
                              )}
                            </td>
                            <td>
                              {(() => {
                                const qty = editedRows[rowId]?.rmQty ?? rm.quantity;
                                if (rm.uom?.toLowerCase() === "kg") return qty * 1000;
                                return qty * (rm.qtyInGrmsPerUnit ?? 1);
                              })()}
                            </td>
                            <td className="sticky-header-right">
                              <div style={{
                                display: "flex", gap: "10px", alignItems: "center", justifyContent: "center",
                              }}>
                                {isTableEditMode && rm.RMID && rm.toDelete ? (
                                  <span className="badge bg-danger text-white">
                                    Pending Delete
                                  </span>
                                ) : (
                                  <>
                                    {isTableEditMode && effectiveProcureType?.toLowerCase() === "manufacture" && (
                                      subBOMStatus[rowId] === "creating" ? (
                                        <span className="btn-badge">Creating Sub-BOM...</span>
                                      ) : subBOMStatus[rowId] === "created" ? (
                                        <span className="btn-badge"> ✓ Created</span>
                                      ) : (
                                        <button
                                          className="btn-sm create-sub-bom-btn"
                                          onClick={() => handleCreateBOM(rm, rowId)}>
                                          <FaPlusCircle /> Add Sub-BOM
                                        </button>
                                      )
                                    )}
                                  </>
                                )}
                                {isTableEditMode && (
                                  <button
                                    className="btn-sm p-1"
                                    style={{
                                      border: "none", background: "none", fontSize: "20px", color: isMarkedForDeletion ? "#388e3c" : "#d83434ff",
                                    }}
                                    title="Delete Sub BOM"
                                    onClick={() =>
                                      isMarkedForDeletion ? handleUndoDelete(rm) : handleDelete(rm)
                                    }>
                                    {isMarkedForDeletion ? <FaUndo /> : <FaTrash />}
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="11" style={{ textAlign: "center", fontWeight: "bold", fontSize: "16px", padding: "15px" }}>
                        <span style={{ color: "#4384b9ff" }}>Total - Quantity:{" "}</span>
                        {selectedBom.rmItems?.reduce((sum, rm, idx) => {
                          const rowId = rm.RMID
                            ? String(rm.RMID)
                            : `${selectedBom.finishItem?.itemCode}-${rm.itemCode}-${idx}`;
                          const storedQty = editedRows[rowId]?.quantity ?? rm.quantity ?? 0;
                          return sum + Number(storedQty);
                        }, 0)}{" "}
                        | <span style={{ color: "#4384b9ff" }}>Quantity in Grams</span>:{" "}
                        {selectedBom.rmItems?.reduce((sum, rm, idx) => {
                          const rowId =
                            rm.RMID ||
                            `${selectedBom.finishItem?.itemCode}-${rm.itemCode}-${idx}`;
                          const storedQty = editedRows[rowId]?.quantity ?? rm.quantity ?? 0;
                          const qty = parseFloat(storedQty) || 0;
                          return sum + (rm.uom?.toLowerCase().includes("kg") ? qty * 1000 : qty);
                        }, 0)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              {isTableEditMode && (
                <div className="d-flex justify-content-center mt-3" style={{ gap: "10px" }}>
                  <button
                    className="submit-button"
                    onClick={() =>
                      UpdateBOM({ bomId: editingParentRowId, mode: "manufacture" })
                    }>
                    <FaPaperPlane /> Submit
                  </button>
                  <button
                    className="cancel-button"
                    onClick={() => {
                      setBomList(prev =>
                        prev.map(bom => {
                          if (!bom.rmItems || bom.rmItems.length === 0) return bom;
                          const cleanedRmItems = bom.rmItems
                            .filter(item => !item.tempId)
                            .map(item => ({
                              ...item,
                              toDelete: false,
                              hasSubBOM: false,
                            }));
                          const recalculatedRmItems = cleanedRmItems.map(item => ({
                            ...item,
                            hasSubBOM: cleanedRmItems.some(
                              i => i.parentRowId === item.rowId
                            ),
                          }));
                          return {
                            ...bom,
                            rmItems: recalculatedRmItems,
                          };
                        })
                      );
                      setEditedRows({});
                      setIsTableEditMode(false);
                      setShowRmForm(false);
                      setEditingParentRowId(null);
                      setTempSubBOMRowId(null);
                      setSubBOMStatus({});
                      toast.info("All changes discarded.");
                    }}>
                    <FaTimes /> Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 🚀 MODIFIED: Conditional RM Add Form */}
      {showRmForm && expandedId === formParentBOMId && (
        <div className="card shadow-sm  m-4" style={{ borderRadius: 10 }}>
          <div className="d-flex justify-content-between align-items-center bom-headers">
            <h5 className="mb-0">Add Raw Material to: **{bomList.find(b => b.id === expandedId)?.finishItem?.itemName}** (Level {currentRmLevel})</h5>
            <button
              className="list-btns"
              onClick={handleCancelRmForm}
              style={{ color: "black", border: "none", borderRadius: "4px", padding: "6px 12px", fontSize: "25px" }} >
              <FaTimes />
            </button>
          </div>
          <div className="row g-3 p-3">
            <div className="col-md-3">
              <label className="form-label label-dark">Select RM Item</label>
              <div id="rm-select-container">
                <Select
                  options={rmOptions}
                  placeholder="Select RM item"
                  value={selectedRmItem}
                  onChange={handleRmSelect}
                  isClearable
                  isSearchable={true} />
              </div>
            </div>
            <div className="col-md-3">
              <label className="form-label label-dark">Grade</label>
              <select
                className="form-select"
                value={selectedRmGrade}
                onChange={(e) => handleRmGradeChange(e.target.value)}>
                <option value="">Select Grade</option>
                {rmGrades.map((g, i) => (<option key={i} value={g}>{g}</option>))}
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
              <input type="number" className="form-control" value={rmQuantity} onChange={(e) => setRmQuantity(e.target.value)} min="0.01" />
            </div>
            <div className="col-md-3">
              <label className="form-label label-dark">Procure Type</label>
              <select className="form-select" value={rmProcureType} onChange={(e) => setRmProcureType(e.target.value)}>
                <option value="Manufacture">Manufacture</option>
                <option value="BoughtOut">BoughtOut</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label label-dark">Quantity in Grams</label>
              <input type="text" className="form-control" value={qtyGrams} readOnly />
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button onClick={addRmToBom} className="blue-button" style={{ fontWeight: 700 }}>
                <FaPlus /> Add RM to List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewBOM;