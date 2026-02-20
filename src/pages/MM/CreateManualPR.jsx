

import { useEffect, useState } from "react";
import { Form, Row, Col, Button, Table, Alert, Spinner, Badge } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_ENDPOINTS } from "../../config/apiconfig";
import { Edit, Save, X, Trash2 } from "lucide-react";

// ---------- API Helper Functions ----------
async function fetchDepartments() {
  const res = await fetch(API_ENDPOINTS.Departments);
  if (!res.ok) throw new Error("Failed to fetch departments");
  return await res.json();
}

async function fetchEmployees() {
  const res = await fetch(API_ENDPOINTS.PR_Employees);
  if (!res.ok) throw new Error("Failed to fetch employees");
  return await res.json();
}

async function fetchItems() {
  const res = await fetch(API_ENDPOINTS.ItemList);
  if (!res.ok) throw new Error("Failed to fetch items");
  return await res.json();
}

async function fetchRequisitionTypes() {
  const res = await fetch(API_ENDPOINTS.ReqTypes);
  if (!res.ok) throw new Error("Failed to fetch requisition types");
  return await res.json();
}

async function fetchDeptBudget(deptCode) {
  const res = await fetch(API_ENDPOINTS.PR_BudgetByDept(deptCode));
  if (!res.ok) throw new Error("Failed to fetch budget");
  return await res.json();
}

async function fetchGradesForItem(itemName) {
  const res = await fetch(API_ENDPOINTS.PR_GradesForItem(itemName));
  if (!res.ok) throw new Error("Failed to fetch grades");
  return await res.json();
}

async function fetchItemDetails(itemName, grade) {
  const res = await fetch(API_ENDPOINTS.PR_ItemDetails(itemName, grade));
  if (!res.ok) throw new Error("Failed to fetch item details");
  return await res.json();
}

async function savePurchaseRequest(payload) {
  const res = await fetch(API_ENDPOINTS.CreateManualPR, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to save: ${errorText}`);
  }
  return await res.json();
}

async function updatePurchaseRequest(prNumber, payload) {
  const res = await fetch(`${API_ENDPOINTS.GetPRForEdit}?prNumber=${prNumber}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to update: ${errorText}`);
  }
  return await res.json();
}

// ---------- Initial State ----------
const emptyHeader = {
  plantName: "",
  plantLocation: "",
  departmentId: "",
  department_code: "",
  budgetAllocated: "0.00",
  budgetBalance: "0.00",
  employeeId: "",
  employeeName: "",
  employeeCode: "",
  typeOfRequisition: "",
  createdBy: "",
  checkedBy: "",
  approvedBy: "",
};

const emptyItem = {
  id: "",
  itemId: "",
  itemName: "",
  specificationId: "",
  specificationName: "",
  itemCode: "",
  uom: "",
  currency: "INR",
  avgPrice: "0.00",
  requiredBy: "",
  hsnCode: "",
  qty: "",
  value: "0.00",
  budgetAvailable: "0.00",
};

export default function CreateManualPR({ editData, onClearEdit }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [header, setHeader] = useState(emptyHeader);
  const [currentItem, setCurrentItem] = useState(emptyItem);
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [gradeLoading, setGradeLoading] = useState(false);
  const [itemDetailsLoading, setItemDetailsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Master Data
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [masterItems, setMasterItems] = useState([]);
  const [grades, setGrades] = useState([]);
  const [requisitionTypes, setRequisitionTypes] = useState([]);
const [editingItemId, setEditingItemId] = useState(null);

// Update single field in editing item
const updateEditingItem = (itemId, field, value) => {
  setItems(prev => prev.map(item => 
    item.id === itemId 
      ? { ...item, [field]: value }
      : item
  ));
  
  // Auto-recalculate value if qty changed
  if (field === 'qty') {
    const item = items.find(i => i.id === itemId);
    if (item) {
      const qty = parseFloat(value) || 0;
      const price = parseFloat(item.avgPrice) || 0;
      const totalValue = (qty * price).toFixed(2);
      setItems(prev => prev.map(i => 
        i.id === itemId 
          ? { ...i, value: totalValue }
          : i
      ));
      // Update header budgetBalance
      setHeader(prev => ({
        ...prev,
        budgetBalance: (parseFloat(prev.budgetBalance) + parseFloat(item.value || 0) - parseFloat(totalValue)).toFixed(2)
      }));
    }
  }
};

// Start editing row
const startItemEdit = (itemId) => {
  setEditingItemId(itemId);
  setItems(prevItems => prevItems.map(item => 
    item.id === itemId 
      ? { ...item, isEditing: true }
      : { ...item, isEditing: false }
  ));
};

// Save edited row
const saveItemEdit = (itemId) => {
  setItems(prevItems => prevItems.map(item => 
    item.id === itemId 
      ? { ...item, isEditing: false }
      : item
  ));
  setEditingItemId(null);
  toast.success("Item updated!");
};

// Cancel editing
const cancelItemEdit = (itemId) => {
  setItems(prevItems => prevItems.map(item => 
    item.id === itemId 
      ? { ...item, isEditing: false }
      : item
  ));
  setEditingItemId(null);
  toast.info("Edit cancelled");
};

  // Load master data
  useEffect(() => {
    Promise.all([
      fetchDepartments(),
      fetchEmployees(),
      fetchItems(),
      fetchRequisitionTypes(),
    ])
      .then(([depts, emps, itms, reqTypes]) => {
        setDepartments(depts);
        setEmployees(emps);
        setMasterItems(itms);
        setRequisitionTypes(reqTypes);
      })
      .catch((err) => {
        toast.error("Failed to load master data.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Populate form when editData is provided
  useEffect(() => {
    if (editData) {
      setIsEditMode(true);
      
      // Fetch the complete PR data for editing
      const fetchPRData = async () => {
        try {
          const response = await fetch(`${API_ENDPOINTS.GetPRForEdit}?prNumber=${editData.prNo || editData.id}`);
          if (!response.ok) throw new Error("Failed to fetch PR data");
          
          const prData = await response.json();
          
          // Populate header with complete data
          setHeader({
            plantName: prData.header.plantName || "",
            plantLocation: prData.header.plantLocation || "",
            departmentId: prData.header.departmentId || "",
            department_code: prData.header.department_code || "",
            budgetAllocated: prData.header.budgetAllocated || "0.00",
            budgetBalance: prData.header.budgetBalance || "0.00",
            employeeId: prData.header.employeeName || "",
            employeeName: prData.header.employeeName || "",
            employeeCode: prData.header.employeeCode || "",
            typeOfRequisition: prData.header.typeOfRequisition || "",
            createdBy: prData.header.createdBy || "",
            checkedBy: prData.header.checkedBy || "",
            approvedBy: prData.header.approvedBy || "",
          });

          // Populate items if available
          if (prData.items && prData.items.length > 0) {
            const mappedItems = prData.items.map((item, index) => ({
              id: Date.now() + index,
              itemId: item.itemName,
              itemName: item.itemName,
              specificationId: item.specificationName,
              specificationName: item.specificationName,
              itemCode: item.itemCode || "",
              uom: item.uom || "",
              currency: item.currency || "INR",
              avgPrice: item.avgPrice || "0.00",
              requiredBy: item.requiredBy || "",
              hsnCode: item.hsnCode || "",
              qty: item.qty || "",
              value: item.value || "0.00",
              budgetAvailable: item.budgetAvailable || "0.00",
            }));
            setItems(mappedItems);
          }

          toast.info("Edit mode activated - Modify and update the record");
        } catch (err) {
          toast.error("Failed to load PR data: " + err.message);
        }
      };

      fetchPRData();
    } else {
      setIsEditMode(false);
    }
  }, [editData]);

  const onHeaderChange = async (e) => {
    const { name, value } = e.target;
    let updated = { ...header, [name]: value };

    try {
      if (name === "departmentId") {
        const selectedDept = departments.find((d) => d.departmentName === value);
        if (selectedDept) {
          updated.department_code = selectedDept.department_code || "";
          if (selectedDept.department_code) {
            const budgetData = await fetchDeptBudget(selectedDept.department_code);
            updated.budgetAllocated = budgetData.budgetAllocated || "0.00";
            updated.budgetBalance = budgetData.budgetBalance || "0.00";
          }
        } else {
          updated.department_code = "";
          updated.budgetAllocated = "0.00";
          updated.budgetBalance = "0.00";
        }
      }

      if (name === "employeeId") {
        const selectedEmp = employees.find((e) => e.name === value);
        if (selectedEmp) {
          updated.employeeName = selectedEmp.name || "";
          updated.employeeCode = selectedEmp.emp_Code || "";
        } else {
          updated.employeeName = "";
          updated.employeeCode = "";
        }
      }
    } catch (err) {
      toast.error("Budget fetch failed: " + err.message);
    }
    setHeader(updated);
  };

  const onItemChange = async (e) => {
    const { name, value } = e.target;
    let updated = { ...currentItem, [name]: value };

    try {
      if (name === "itemId") {
        const selectedItem = masterItems.find((i) => i.name === value);
        if (selectedItem) {
          updated.itemName = selectedItem.name;
          updated.itemId = selectedItem.name;
          setGradeLoading(true);
          try {
            const gradesData = await fetchGradesForItem(selectedItem.name);
            setGrades(gradesData || []);
          } catch (err) {
            toast.error("Failed to load grades");
          } finally {
            setGradeLoading(false);
          }
        }
      }

      if (name === "specificationId") {
        const selectedGrade = grades.find((g) => g.name === value);
        if (selectedGrade && updated.itemName) {
          updated.specificationName = selectedGrade.name;
          setItemDetailsLoading(true);
          try {
            const details = await fetchItemDetails(updated.itemName, selectedGrade.name);
            updated.itemCode = details.itemCode || "";
            updated.uom = details.uom || "";
            updated.currency = details.currency || "INR";
            updated.avgPrice = details.avgPrice?.toString() || "0.00";
            updated.hsnCode = details.hsnCode || "";
            updated.budgetAvailable = header.budgetBalance;
          } catch (err) {
            toast.error("Failed to load details");
          } finally {
            setItemDetailsLoading(false);
          }
        }
      }

      if (name === "qty") {
        const qty = parseFloat(value) || 0;
        const price = parseFloat(updated.avgPrice) || 0;
        const totalValue = qty * price;
        const currentBalance = parseFloat(header.budgetBalance) || 0;

        if (value !== "" && qty <= 0) {
          toast.error("Quantity must be greater than 0");
          updated.qty = "";
          updated.value = "0.00";
          updated.budgetAvailable = header.budgetBalance;
        } else if (totalValue > currentBalance) {
          toast.error("Insufficient Budget! Total exceeds department balance.");
          updated.qty = ""; 
          updated.value = "0.00";
          updated.budgetAvailable = header.budgetBalance;
        } else {
          updated.value = totalValue.toFixed(2);
          updated.budgetAvailable = (currentBalance - totalValue).toFixed(2);
        }
      }
    } catch (err) {
      console.error(err);
    }
    setCurrentItem(updated);
  };

  const addItem = () => {
    if (!currentItem.itemName || !currentItem.specificationName || !currentItem.qty) {
      toast.error("Please select item, grade, and valid quantity");
      return;
    }
    setItems((prev) => [...prev, { ...currentItem, id: Date.now() }]);
    
    setHeader(prev => ({
        ...prev,
        budgetBalance: currentItem.budgetAvailable
    }));

    setCurrentItem(emptyItem);
    setGrades([]);
    toast.success("Item added to list");
  };

  const removeItem = (itemToRemove) => {
    setHeader(prev => ({
        ...prev,
        budgetBalance: (parseFloat(prev.budgetBalance) + parseFloat(itemToRemove.value)).toFixed(2)
    }));
    setItems((prev) => prev.filter((item) => item.id !== itemToRemove.id));
    toast.info("Item removed");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!header.departmentId || !header.plantName) {
      toast.error("Please fill Plant Name and Department");
      return;
    }
    if (items.length === 0) {
      toast.error("Please add at least one item");
      return;
    }

    try {
      setSubmitLoading(true);
      
      // Prepare payload matching backend UpdatePurchaseRequestViewModel
      const payload = {
        purchaseReqNo: editData?.prNo || editData?.id,
        plantName: header.plantName,
        plantLocation: header.plantLocation,
        departmentId: header.departmentId,
        department_code: header.department_code,
        budgetAllocated: header.budgetAllocated,
        budgetBalance: header.budgetBalance,
        employeeId: header.employeeId,
        employeeName: header.employeeName,
        employeeCode: header.employeeCode,
        typeOfRequisition: header.typeOfRequisition,
        createdBy: header.createdBy,
        checkedBy: header.checkedBy,
        approvedBy: header.approvedBy,
        items: items.map(i => ({
          itemId: i.itemId,
          itemName: i.itemName,
          specificationId: i.specificationId,
          specificationName: i.specificationName,
          itemCode: i.itemCode,
          uom: i.uom,
          currency: i.currency,
          avgPrice: i.avgPrice,
          requiredBy: i.requiredBy,
          hsnCode: i.hsnCode,
          qty: i.qty,
          value: i.value,
          budgetAvailable: i.budgetAvailable
        }))
      };
      
      if (isEditMode && editData) {
        // Update existing PR using the Update endpoint
        const response = await fetch(`${API_ENDPOINTS.UpdateManualPR}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Update failed: ${errorText}`);
        }
        
        const result = await response.json();
        toast.success(`PR Updated Successfully! PR No: ${result.purchaseReqNo || payload.purchaseReqNo}`);
      } else {
        // Create new PR
        const createPayload = {
          plantName: header.plantName,
          plantLocation: header.plantLocation,
          departmentId: header.departmentId,
          department_code: header.department_code,
          budgetAllocated: header.budgetAllocated,
          budgetBalance: header.budgetBalance,
          employeeId: header.employeeId,
          employeeName: header.employeeName,
          employeeCode: header.employeeCode,
          typeOfRequisition: header.typeOfRequisition,
          createdBy: header.createdBy,
          checkedBy: header.checkedBy,
          approvedBy: header.approvedBy,
          items: items.map(i => ({
            itemId: i.itemId,
            itemName: i.itemName,
            specificationId: i.specificationId,
            specificationName: i.specificationName,
            itemCode: i.itemCode,
            uom: i.uom,
            currency: i.currency,
            avgPrice: i.avgPrice,
            requiredBy: i.requiredBy,
            hsnCode: i.hsnCode,
            qty: i.qty,
            value: i.value,
            budgetAvailable: i.budgetAvailable
          }))
        };
        
        const result = await savePurchaseRequest(createPayload);
        toast.success(`Success! PR No: ${result.purchaseReqNo || 'Created'}`);
      }
      
      onCancel();
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const onCancel = () => {
    setHeader(emptyHeader);
    setCurrentItem(emptyItem);
    setItems([]);
    setGrades([]);
    setIsEditMode(false);
    if (onClearEdit) onClearEdit();
    toast.info("Form reset");
  };

  if (loading) {
    return (
      <div className="p-5 text-center">
        <Spinner animation="border" variant="primary" />
        <h6 className="mt-2">Initializing...</h6>
      </div>
    );
  }

  return (
    <div className="p-4" style={{ background: '#f8fafc', borderRadius: '12px' }}>
      {isEditMode && (
        <Alert variant="info" className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-2">
            <Badge bg="primary">EDIT MODE</Badge>
            <span>You are editing PR: <strong>{editData?.prNo || editData?.id}</strong></span>
          </div>
          <Button size="sm" variant="outline-secondary" onClick={onCancel}>
            Exit Edit Mode
          </Button>
        </Alert>
      )}

      <Form onSubmit={onSubmit}>
        {/* Header Section - Plant & Department */}
        <div className="form-section">
          {/* <h5 className="section-title">Plant & Department Information</h5> */}
          <Row className="mb-3">
            <Col >
             
                <label className="label-color">Plant Name/No *</label>
                <input 
                  name="plantName" 
                  value={header.plantName} 
                  onChange={onHeaderChange} 
                  required 
                  className="input-field-style border"
                />
              
            </Col>
            <Col >
              <Form.Group>
                <label className="label-color">Plant Location</label>
                <input 
                  name="plantLocation" 
                  value={header.plantLocation} 
                  onChange={onHeaderChange}
                 className="input-field-style border"
                />
              </Form.Group>
            </Col>
            <Col >
              <Form.Group>
                <label className="label-color">Department Name *</label>
                <select 
                  name="departmentId" 
                  value={header.departmentId} 
                  onChange={onHeaderChange} 
                  required
                 className="input-field-style border"
                >
                  <option value="">SELECT DEPARTMENT</option>
                  {departments.map((d) => <option key={d.id} value={d.departmentName}>{d.departmentName}</option>)}
                </select>
              </Form.Group>
            </Col>
            <Col >
              <Form.Group>
                <label className="label-color">Department Code</label>
                <input 
                  value={header.department_code} 
                  disabled 
                  className="input-field-style   input-disabled"
                />
              </Form.Group>
            </Col>
             <Col >
              <Form.Group>
                <label className="label-color">Budget Allocated</label>
                <input 
                  value={header.budgetAllocated} 
                  disabled 
                  className="input-field-style input-disabled"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
           
            <Col >
              <Form.Group>
                <label className="label-color">Budget Balance</label>
                <input 
                  value={header.budgetBalance} 
                  disabled 
                  className="input-field-style input-disabled "
                />
              </Form.Group>
            </Col>
            <Col >
              <Form.Group>
                <label className="label-color">Employee Name</label>
                <select 
                  name="employeeId" 
                  value={header.employeeId} 
                  onChange={onHeaderChange}
                 className="input-field-style border"
                >
                  <option value="">SELECT EMPLOYEE</option>
                  {employees.map((e) => <option key={e.id} value={e.name}>{e.name}</option>)}
                </select>
              </Form.Group>
            </Col>
            <Col >
              <Form.Group>
                <label className="label-color">Employee Code</label>
                <input 
                  value={header.employeeCode} 
                  disabled 
                  className="input-field-style input-disabled"
                />
              </Form.Group>
            </Col>
             <Col >
              <Form.Group>
                <label className="label-color">Type Of Requisition</label>
                <select 
                  name="typeOfRequisition" 
                  value={header.typeOfRequisition} 
                  onChange={onHeaderChange}
                 className="input-field-style border"
                >
                  <option value="">SELECT TYPE</option>
                  {requisitionTypes.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </Form.Group>
            </Col>
      
          </Row>

          <Row className="mb-4">
                 <Col >
              <Form.Group>
                <label className="label-color">Created By</label>
                <input 
                  name="createdBy" 
                  value={header.createdBy} 
                  onChange={onHeaderChange}
                 className="input-field-style border"
                />
              </Form.Group>
            </Col>
            <Col >
              <Form.Group>
                <label className="label-color">Checked By</label>
                <input 
                  name="checkedBy" 
                  value={header.checkedBy} 
                  onChange={onHeaderChange}
                 className="input-field-style border"
                />
              </Form.Group>
            </Col>
            <Col >
              <Form.Group>
                <label className="label-color">Approved By</label>
                <input 
                  name="approvedBy" 
                  value={header.approvedBy} 
                  onChange={onHeaderChange}
                 className="input-field-style border"
                />
              </Form.Group>
            </Col>
          </Row>
        </div>

        {/* Item Details Section */}
        <div className="form-section">
          <h5 className="section-title">Item Details</h5>
          <Row className="mb-3">
            <Col >
              <Form.Group>
                <label className="label-color">Item Name *</label>
                <select 
                  name="itemId" 
                  value={currentItem.itemId} 
                  onChange={onItemChange}
                 className="input-field-style border"
                >
                  <option value="">SELECT ITEM</option>
                  {masterItems.map((i) => <option key={i.id} value={i.name}>{i.name}</option>)}
                </select>
              </Form.Group>
            </Col>
            <Col >
              <Form.Group>
                <label className="label-color">
                  Grade * {gradeLoading && <Spinner animation="border" size="sm" className="ms-1" />}
                </label>
                <select 
                  name="specificationId" 
                  value={currentItem.specificationId} 
                  onChange={onItemChange} 
                  disabled={!currentItem.itemId || grades.length === 0}
                 className="input-field-style border"
                >
                  <option value="">{grades.length === 0 ? "No Grades" : "SELECT GRADE"}</option>
                  {grades.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </Form.Group>
            </Col>
            <Col >
              <Form.Group>
                <label className="label-color">Item Code</label>
                <input 
                  value={currentItem.itemCode} 
                  disabled 
                  className="input-field-style input-disabled"
                />
              </Form.Group>
            </Col>
                <Col >
              <Form.Group>
                <label className="label-color">UOM</label>
                <input 
                  value={currentItem.uom} 
                  disabled 
                  className="input-field-style input-disabled"
                />
              </Form.Group>
            </Col>
            <Col >
              <Form.Group>
                <label className="label-color">Currency</label>
                <input 
                  value={currentItem.currency} 
                  disabled 
                  className="input-field-style input-disabled"
                />
              </Form.Group>
            </Col>
            
            <Col >
              <Form.Group>
                <label className="label-color">Avg Price</label>
                <input 
                  value={currentItem.avgPrice} 
                  disabled 
                  className="input-field-style input-disabled"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
        
            <Col >
              <Form.Group>
                <label className="label-color">HSN Code</label>
                <input 
                  value={currentItem.hsnCode} 
                  disabled 
                  className="input-field-style input-disabled"
                />
              </Form.Group>
            </Col>
            <Col >
              <Form.Group>
                <label className="label-color">Required By</label>
                <input 
                  type="date" 
                  name="requiredBy" 
                  value={currentItem.requiredBy} 
                  onChange={onItemChange}
                 className="input-field-style border"
                />
              </Form.Group>
            </Col>
            <Col >
              <Form.Group>
                <label className="label-color">Required Qty *</label>
                <input 
                  type="number" 
                  name="qty" 
                  value={currentItem.qty} 
                  onChange={onItemChange} 
                  placeholder="0.00" 
                  step="0.01"
                 className="input-field-style border"
                />
              </Form.Group>
            </Col>
              <Col >
              <Form.Group>
                <label className="label-color">Budget Available</label>
                <input 
                  value={currentItem.budgetAvailable} 
                  disabled 
                  className="input-field-style input-disabled fw-bold"
                  style={{ color: '#0ea5e9' }}
                />
              </Form.Group>
            </Col>
               <Col >
              <Form.Group>
                <label className="label-color">Total Value</label>
                <input 
                  value={currentItem.value} 
                  disabled 
                  className="input-field-style input-disabled fw-bold text-success"
                />
              </Form.Group>
            </Col>
            <Col  className="d-flex align-items-end">
              <Button 
                variant="success" 
                onClick={addItem} 
                className="add-btn" 
                disabled={itemDetailsLoading}
              >
                Add
              </Button>
              <small className="text-muted ms-3 mb-2">*Add multiple </small>
            </Col>
          </Row>

          <Row className="mb-4">
          
         
          </Row>
          {items.length > 0 && (
  <div className="form-section">
    <h5 className="section-title">Added Items</h5>
    <Table striped bordered hover size="sm" className="items-table">
      <thead className="table-dark">
        <tr>
          <th>Item Name</th>
          <th>Grade</th>
          <th>Code</th>
          <th>UOM</th>
          <th>Price</th>
          <th>Qty</th>
          <th>Value</th>
          <th className="text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            {item.isEditing ? (
              <>
                {/* EDITABLE FIELDS */}
                <td>
                  <select 
                    size="sm"
                    value={item.itemId} 
                    onChange={(e) => updateEditingItem(item.id, 'itemId', e.target.value)}
                    className="item-edit-select"
                  >
                    <option>SELECT ITEM</option>
                    {masterItems.map((i) => (
                      <option key={i.id} value={i.name}>{i.name}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <select 
                    size="sm"
                    value={item.specificationId} 
                    onChange={(e) => updateEditingItem(item.id, 'specificationId', e.target.value)}
                    className="item-edit-select"
                  >
                    <option>SELECT GRADE</option>
                    {grades.map((g) => (
                      <option key={g.id} value={g.name}>{g.name}</option>
                    ))}
                  </select>
                </td>
                <td>{item.itemCode}</td>
                <td>{item.uom}</td>
                <td>{item.avgPrice}</td>
                <td>
                  <input 
                    type="number" 
                    size="sm"
                    value={item.qty} 
                    onChange={(e) => updateEditingItem(item.id, 'qty', e.target.value)}
                    className="item-qty-input"
                  />
                </td>
                <td className="fw-bold text-success">{item.value}</td>
              </>
            ) : (
              <>
                {/* VIEW MODE */}
                <td>{item.itemName}</td>
                <td>{item.specificationName}</td>
                <td>{item.itemCode}</td>
                <td>{item.uom}</td>
                <td>{item.avgPrice}</td>
                <td>{item.qty}</td>
                <td className="fw-bold text-success">{item.value}</td>
              </>
            )}
            <td className="text-center">
              {item.isEditing ? (
                <>
                  <Button 
                    size="sm" 
                    variant="success" 
                    className="me-1"
                    onClick={() => saveItemEdit(item.id)}
                  >
                    <Save size={14} />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={() => cancelItemEdit(item.id)}
                  >
                    <X size={14} />
                  </Button>
                </>
              ) : (
                <>
                  {isEditMode && (
                    <Button 
                      size="sm" 
                      variant="outline-primary" 
                      className="me-1"
                      onClick={() => startItemEdit(item.id)}
                      title="Edit Item"
                    >
                      <Edit size={14} />
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline-danger"
                    onClick={() => removeItem(item)}
                    title="Remove Item"
                  >
                    <Trash2 size={14} />
                  </Button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="table-secondary fw-bold">
          <td colSpan="6" className="text-end">Total:</td>
          <td className="text-success">
            {items.reduce((sum, i) => sum + parseFloat(i.value || 0), 0).toFixed(2)}
          </td>
          <td></td>
        </tr>
      </tfoot>
    </Table>
  </div>
)}

            {/* {items.length > 0 && (
          <div className="form-section">
            <h5 className="section-title">Added Items</h5>
            <Table striped bordered hover size="sm" className="items-table">
              <thead className="table-dark">
                <tr>
                  <th>Item Name</th>
                  <th>Grade</th>
                  <th>Code</th>
                  <th>UOM</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Value</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.itemName}</td>
                    <td>{item.specificationName}</td>
                    <td>{item.itemCode}</td>
                    <td>{item.uom}</td>
                    <td>{item.avgPrice}</td>
                    <td>{item.qty}</td>
                    <td className="fw-bold text-success">{item.value}</td>
                    <td className="text-center">
                      <Button size="sm" variant="outline-danger" onClick={() => removeItem(item)}>
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="table-secondary fw-bold">
                  <td colSpan="6" className="text-end">Total :</td>
                  <td className="text-success">
                    {items.reduce((sum, i) => sum + parseFloat(i.value), 0).toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </Table>
          </div>
        )} */}
        </div>

        {/* Items List */}
      

        {/* Action Buttons */}
        <div className="text-center mt-5 mb-5 d-flex gap-2">
          <Button 
            type="submit" 
        
            className="save-btn" 
            disabled={submitLoading}
          >
            {submitLoading ? (
              <>
                <Spinner size="sm" className="me-2"/> Processing...
              </>
            ) : isEditMode ? (
              "Update"
            ) : (
              "Submit "
            )}
          </Button>
          <Button 
         
            className="cancel-btn" 
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </Form>

      <ToastContainer theme="colored" position="top-right" />

   
    </div>
  );
}