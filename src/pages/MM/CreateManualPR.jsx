// CreateManualPR.jsx
import { useEffect, useState } from "react";
import { Form, Row, Col, Button, Table, Alert, Spinner } from "react-bootstrap";
import { API_ENDPOINTS } from "../../config/apiconfig";

async function getPRMasters() {
  try {
    const [dRes, eRes, iRes, sRes, cRes, uRes] = await Promise.allSettled([
      fetch(API_ENDPOINTS.PR_Departments),
      fetch(API_ENDPOINTS.PR_Employees),
      fetch(API_ENDPOINTS.PR_Items),
      fetch(API_ENDPOINTS.PR_Specifications),
      fetch(API_ENDPOINTS.PR_Currencies),
      fetch(API_ENDPOINTS.PR_UOM)
    ]);

    const departments = await safeJson(dRes);
    const employees = await safeJson(eRes);
    const items = await safeJson(iRes);
    const specs = await safeJson(sRes);
    const currencies = await safeJson(cRes);
    const uoms = await safeJson(uRes);

    return {
      departments: departments || [],
      employees: employees || [],
      items: items || [],
      specs: specs || [],
      currencies: currencies || [],
      uoms: uoms || []
    };
  } catch (error) {
    console.error('getPRMasters failed:', error);
    return {
      departments: [], employees: [], items: [], specs: [], currencies: [], uoms: []
    };
  }
}

async function safeJson(result) {
  if (result.status === 'rejected') {
    console.warn('Fetch rejected:', result.reason);
    return null;
  }
  
  const res = result.value;
  if (!res.ok) {
    console.warn(`API failed (${res.status}): ${res.url}`);
    return null;
  }
  
  const contentType = res.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    console.warn('Non-JSON response:', res.url);
    return null;
  }
  
  try {
    return await res.json();
  } catch (error) {
    console.warn('JSON parse failed:', res.url, error);
    return null;
  }
}

async function getDeptBudget(deptId) {
  try {
    const res = await fetch(API_ENDPOINTS.PR_BudgetByDept(deptId));
    if (!res.ok) return {};
    const contentType = res.headers.get('content-type');
    if (!contentType?.includes('application/json')) return {};
    return await res.json();
  } catch {
    return {};
  }
}

async function getEmployee(empId) {
  try {
    const res = await fetch(API_ENDPOINTS.PR_EmployeeDetails(empId));
    if (!res.ok) return {};
    const contentType = res.headers.get('content-type');
    if (!contentType?.includes('application/json')) return {};
    return await res.json();
  } catch {
    return {};
  }
}

async function getItem(itemId) {
  try {
    const res = await fetch(API_ENDPOINTS.PR_ItemDetails(itemId));
    if (!res.ok) return {};
    const contentType = res.headers.get('content-type');
    if (!contentType?.includes('application/json')) return {};
    return await res.json();
  } catch {
    return {};
  }
}

async function saveCreateManualPR(payload) {
  try {
    const res = await fetch(API_ENDPOINTS.CreateManualPR, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Save failed:', error);
    throw error;
  }
}

const emptyHeader = {
  plantName: "",
  plantLocation: "",
  departmentId: "",
  departmentCode: "",
  budgetAllocated: "",
  budgetBalance: "",
  searchEmployee: "",
  employeeId: "",
  employeeName: "",
  employeeCode: "",
  typeOfRequisition: "RAW MATERIAL"
};

const emptyItem = {
  id: "",
  itemId: "",
  itemName: "",
  specificationId: "",
  specificationName: "",
  itemCode: "",
  uom: "",
  currency: "",
  avgPrice: "",
  requiredBy: "",
  hsnCode: "",
  qty: "",
  value: "",
  budgetAvailable: ""
};

// ---------- main component ----------
export default function CreateManualPR() {
  const [header, setHeader] = useState(emptyHeader);
  const [currentItem, setCurrentItem] = useState(emptyItem);
  const [items, setItems] = useState([]);

  // ✅ Loading & error states
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [masterItems, setMasterItems] = useState([]);
  const [specs, setSpecs] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [uoms, setUoms] = useState([]);

  // ✅ Load masters with error handling
  useEffect(() => {
    getPRMasters()
      .then((masters) => {
        setDepartments(masters.departments || []);
        setEmployees(masters.employees || []);
        setMasterItems(masters.items || []);
        setSpecs(masters.specs || []);
        setCurrencies(masters.currencies || []);
        setUoms(masters.uoms || []);
        setError('');
      })
      .catch((err) => {
        console.error('Masters load failed:', err);
        setError('Failed to load master data. Some dropdowns may be empty.');
      })
      .finally(() => setLoading(false));
  }, []);

  const onHeaderChange = async (e) => {
    const { name, value } = e.target;
    let updated = { ...header, [name]: value };

    try {
      if (name === "departmentId" && value) {
        const data = await getDeptBudget(value);
        updated = {
          ...updated,
          departmentCode: data.departmentCode || "",
          budgetAllocated: data.budgetAllocated || "",
          budgetBalance: data.budgetBalance || ""
        };
      }

      if (name === "employeeId" && value) {
        const data = await getEmployee(value);
        updated = {
          ...updated,
          employeeName: data.employeeName || "",
          employeeCode: data.employeeCode || ""
        };
      }
    } catch (error) {
      console.error('Header fetch failed:', error);
    }

    setHeader(updated);
  };

  const onItemChange = async (e) => {
    const { name, value } = e.target;
    let updated = { ...currentItem, [name]: value };

    try {
      if (name === "itemId" && value) {
        const data = await getItem(value);
        updated = {
          ...updated,
          itemName: data.itemName || "",
          itemCode: data.itemCode || "",
          hsnCode: data.hsnCode || "",
          uom: data.uom || updated.uom,
          avgPrice: data.avgPrice || updated.avgPrice
        };
      }
    } catch (error) {
      console.error('Item fetch failed:', error);
    }

    if (name === "qty" || name === "avgPrice") {
      const qty = name === "qty" ? Number(value) || 0 : Number(currentItem.qty || 0);
      const price = name === "avgPrice" ? Number(value) || 0 : Number(currentItem.avgPrice || 0);
      updated.value = (qty * price).toFixed(2);
    }

    setCurrentItem(updated);
  };

  const addItem = () => {
    if (!currentItem.itemId || !currentItem.qty) {
      alert('Please select item and enter quantity');
      return;
    }
    setItems((prev) => [...prev, { ...currentItem, id: Date.now() }]);
    setCurrentItem(emptyItem);
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((r) => r.id !== id));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!header.departmentId || items.length === 0) {
      alert('Please fill required fields and add at least one item');
      return;
    }

    try {
      setSubmitLoading(true);
      const payload = { ...header, items };
      await saveCreateManualPR(payload);
      alert('PR created successfully!');
      onCancel();
    } catch (error) {
      alert('Failed to create PR: ' + error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const onCancel = () => {
    setHeader(emptyHeader);
    setCurrentItem(emptyItem);
    setItems([]);
    setError('');
  };

  // ✅ Loading screen
  if (loading) {
    return (
      <div className="p-5 text-center">
        <Spinner animation="border" role="status" className="me-2" />
        <strong>Loading  data...</strong>
      </div>
    );
  }

  return (
    <div className="p-3">
      {error && (
        <Alert variant="warning" className="mb-3">
          {error}
        </Alert>
      )}
      
      <Form onSubmit={onSubmit}>
        <Row className="mb-3">
          <Col >
            <Form.Group>
              <Form.Label>Plant Name/No</Form.Label>
              <Form.Control
                name="plantName"
                value={header.plantName}
                onChange={onHeaderChange}
                required
              />
            </Form.Group>
          </Col>
          <Col >
            <Form.Group>
              <Form.Label>Plant Location</Form.Label>
              <Form.Control
                name="plantLocation"
                value={header.plantLocation}
                onChange={onHeaderChange}
              />
            </Form.Group>
          </Col>
          <Col >
            <Form.Group>
              <Form.Label>Department Name</Form.Label>
              <Form.Select
                name="departmentId"
                value={header.departmentId}
                onChange={onHeaderChange}
                required
              >
                <option value="">SELECT DEPARTMENT</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col >
            <Form.Group>
              <Form.Label>Department Code</Form.Label>
              <Form.Control
                name="departmentCode"
                value={header.departmentCode}
                disabled
              />
            </Form.Group>
          </Col>
          <Col >
            <Form.Group>
              <Form.Label>Budget Allocated</Form.Label>
              <Form.Control
                name="budgetAllocated"
                value={header.budgetAllocated}
                disabled
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          
          <Col >
            <Form.Group>
              <Form.Label>Budget Balance</Form.Label>
              <Form.Control
                name="budgetBalance"
                value={header.budgetBalance}
                disabled
              />
            </Form.Group>
          </Col>
          <Col >
            <Form.Group>
              <Form.Label>Search Employee</Form.Label>
              <Form.Control
                name="searchEmployee"
                value={header.searchEmployee}
                onChange={onHeaderChange}
                placeholder="Search..."
              />
            </Form.Group>
          </Col>
          <Col >
            <Form.Group>
              <Form.Label>Employee Name</Form.Label>
              <Form.Select
                name="employeeId"
                value={header.employeeId}
                onChange={onHeaderChange}
              >
                <option value="">SELECT EMPLOYEE</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
                 <Col >
            <Form.Group>
              <Form.Label>Employee Code</Form.Label>
              <Form.Control
                name="employeeCode"
                value={header.employeeCode}
                disabled
              />
            </Form.Group>
          </Col>
          <Col >
            <Form.Group>
              <Form.Label>Type Of Requisition</Form.Label>
              <Form.Control
                name="typeOfRequisition"
                value={header.typeOfRequisition}
                disabled
              />
            </Form.Group>
          </Col>
        </Row>


        {/* Item details */}
        <div className="mb-3">
          <h5>ITEM DETAILS</h5>
        </div>

        <Row className="mb-3">
          <Col >
            <Form.Group>
              <Form.Label>Item Name</Form.Label>
              <Form.Select
                name="itemId"
                value={currentItem.itemId}
                onChange={onItemChange}
              >
                <option value="">SELECT ITEM NAME</option>
                {masterItems.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col >
            <Form.Group>
              <Form.Label>Specification</Form.Label>
              <Form.Select
                name="specificationId"
                value={currentItem.specificationId}
                onChange={onItemChange}
              >
                <option value="">SELECT SPECIFICATION</option>
                {specs.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col >
            <Form.Group>
              <Form.Label>Item Code</Form.Label>
              <Form.Control
                name="itemCode"
                value={currentItem.itemCode}
                onChange={onItemChange}
              />
            </Form.Group>
          </Col>
          <Col >
            <Form.Group>
              <Form.Label>UOM</Form.Label>
              <Form.Select name="uom" value={currentItem.uom} onChange={onItemChange}>
                <option value="">SELECT UOM</option>
                {uoms.map((u) => (
                  <option key={u.id} value={u.code}>
                    {u.code}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
              <Col >
            <Form.Group>
              <Form.Label>Currency</Form.Label>
              <Form.Select
                name="currency"
                value={currentItem.currency}
                onChange={onItemChange}
              >
                <option value="">SELECT CURRENCY</option>
                {currencies.map((c) => (
                  <option key={c.id} value={c.code}>
                    {c.code}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
      
          <Col >
            <Form.Group>
              <Form.Label>Average Price</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="avgPrice"
                value={currentItem.avgPrice}
                onChange={onItemChange}
              />
            </Form.Group>
          </Col>
          <Col >
            <Form.Group>
              <Form.Label>Required By</Form.Label>
              <Form.Control
                type="date"
                name="requiredBy"
                value={currentItem.requiredBy}
                onChange={onItemChange}
              />
            </Form.Group>
          </Col>
          <Col >
            <Form.Group>
              <Form.Label>HSN Code</Form.Label>
              <Form.Control
                name="hsnCode"
                value={currentItem.hsnCode}
                onChange={onItemChange}
              />
            </Form.Group>
          </Col>
            <Col >
            <Form.Group>
              <Form.Label>Require Qty</Form.Label>
              <Form.Control
                type="number"
                name="qty"
                value={currentItem.qty}
                onChange={onItemChange}
              />
            </Form.Group>
          </Col>
          <Col >
            <Form.Group>
              <Form.Label>Value</Form.Label>
              <Form.Control
                name="value"
                value={currentItem.value}
                disabled
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
        
          <Col >
            <Form.Group>
              <Form.Label>Budget Available</Form.Label>
              <Form.Control
                name="budgetAvailable"
                value={currentItem.budgetAvailable}
                disabled
              />
            </Form.Group>
          </Col>
          <Col  className="d-flex align-items-end">
            <Button variant="success" onClick={addItem} className="w-100">
              Add Item
            </Button>
          </Col>
              <Col>
            <Form.Group>
              <Form.Label>Created By</Form.Label>
              <Form.Control name="createdBy" />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Checked By</Form.Label>
              <Form.Control name="checkedBy" />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Approved By</Form.Label>
              <Form.Control name="approvedBy" />
            </Form.Group>
          </Col>   
        </Row>

        {/* Items table */}
        {items.length > 0 && (
          <Table striped bordered hover size="sm" className="mb-3">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Item Code</th>
                <th>Specification</th>
                <th>UOM</th>
                <th>Currency</th>
                <th>Avg Price</th>
                <th>HSN Code</th>
                <th>Qty</th>
                <th>Value</th>
                <th>Budget</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id}>
                  <td>{r.itemName}</td>
                  <td>{r.itemCode}</td>
                  <td>{r.specificationName}</td>
                  <td>{r.uom}</td>
                  <td>{r.currency}</td>
                  <td>{r.avgPrice}</td>
                  <td>{r.hsnCode}</td>
                  <td>{r.qty}</td>
                  <td>{r.value}</td>
                  <td>{r.budgetAvailable}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => removeItem(r.id)}
                    >
                      ×
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {/* Footer fields */}
       

        <div className="text-center">
          <Button 
            type="submit" 
            variant="success" 
            className="mx-2 px-4"
            disabled={submitLoading}
          >
            {submitLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                Saving...
              </>
            ) : (
              'Submit'
            )}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="mx-2 px-4"
            onClick={onCancel}
            disabled={submitLoading}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
}
