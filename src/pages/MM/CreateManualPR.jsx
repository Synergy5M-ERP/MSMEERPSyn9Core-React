// CreateManualPR.jsx
import { useEffect, useState } from "react";
import { Form, Row, Col, Button, Table } from "react-bootstrap";
import { API_ENDPOINTS } from "../../config/apiconfig";

// ---------- small service helpers in same file ----------
async function getPRMasters() {
  const [dRes, eRes, iRes, sRes, cRes, uRes] = await Promise.all([
    fetch(API_ENDPOINTS.PR_Departments),
    fetch(API_ENDPOINTS.PR_Employees),
    fetch(API_ENDPOINTS.PR_Items),
    fetch(API_ENDPOINTS.PR_Specifications),
    fetch(API_ENDPOINTS.PR_Currencies),
    fetch(API_ENDPOINTS.PR_UOM)
  ]);

  return {
    departments: await dRes.json(),
    employees: await eRes.json(),
    items: await iRes.json(),
    specs: await sRes.json(),
    currencies: await cRes.json(),
    uoms: await uRes.json()
  };
}

async function getDeptBudget(deptId) {
  const res = await fetch(API_ENDPOINTS.PR_BudgetByDept(deptId));
  return res.json();
}

async function getEmployee(empId) {
  const res = await fetch(API_ENDPOINTS.PR_EmployeeDetails(empId));
  return res.json();
}

async function getItem(itemId) {
  const res = await fetch(API_ENDPOINTS.PR_ItemDetails(itemId));
  return res.json();
}

async function saveCreateManualPR(payload) {
  const res = await fetch(API_ENDPOINTS.CreateManualPR, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
}

// ---------- component state templates ----------
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

  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [masterItems, setMasterItems] = useState([]);
  const [specs, setSpecs] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [uoms, setUoms] = useState([]);

  // load all dropdown masters once
  useEffect(() => {
    getPRMasters().then((m) => {
      setDepartments(m.departments);
      setEmployees(m.employees);
      setMasterItems(m.items);
      setSpecs(m.specs);
      setCurrencies(m.currencies);
      setUoms(m.uoms);
    });
  }, []);

  const onHeaderChange = async (e) => {
    const { name, value } = e.target;
    let updated = { ...header, [name]: value };

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

    setHeader(updated);
  };

  const onItemChange = async (e) => {
    const { name, value } = e.target;
    let updated = { ...currentItem, [name]: value };

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

    if (name === "qty" || name === "avgPrice") {
      const qty = name === "qty" ? Number(value) : Number(updated.qty || 0);
      const price =
        name === "avgPrice" ? Number(value) : Number(updated.avgPrice || 0);
      updated.value = qty && price ? (qty * price).toFixed(2) : "";
    }

    setCurrentItem(updated);
  };

  const addItem = () => {
    if (!currentItem.itemId || !currentItem.qty) return;
    setItems((p) => [...p, { ...currentItem, id: Date.now() }]);
    setCurrentItem(emptyItem);
  };

  const removeItem = (id) => {
    setItems((p) => p.filter((r) => r.id !== id));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...header, items };
    await saveCreateManualPR(payload);
  };

  const onCancel = () => {
    setHeader(emptyHeader);
    setCurrentItem(emptyItem);
    setItems([]);
  };

  // JSX for form (same structure you already have)
  return (
    <Form onSubmit={onSubmit} className="p-3">
     
      <Row className="mb-2">
        <Col>
          <Form.Group>
            <Form.Label>Plant Name/No</Form.Label>
            <Form.Control
              name="plantName"
              value={header.plantName}
              onChange={onHeaderChange}
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
            >
              <option value="">SELECT DEPARTMENT</option>
              {departments.map(d => (
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
         <Col>
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

      <Row className="mb-2">
       
        <Col md={3}>
          <Form.Group>
            <Form.Label>Budget Balance</Form.Label>
            <Form.Control
              name="budgetBalance"
              value={header.budgetBalance}
              disabled
            />
          </Form.Group>
        </Col>
        <Col md={3}>
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
        <Col md={3}>
          <Form.Group>
            <Form.Label>Employee Name</Form.Label>
            <Form.Select
              name="employeeId"
              value={header.employeeId}
              onChange={onHeaderChange}
            >
              <option value="">SELECT EMPLOYEE</option>
              {employees.map(e => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-2">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Employee Code</Form.Label>
            <Form.Control
              name="employeeCode"
              value={header.employeeCode}
              disabled
            />
          </Form.Group>
        </Col>
        <Col md={3}>
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
      <div className="mt-3 mb-2">
        <h5>ITEM DETAILS</h5>
      </div>

      <Row className="mb-2">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Item Name</Form.Label>
            <Form.Select
              name="itemId"
              value={currentItem.itemId}
              onChange={onItemChange}
            >
              <option value="">SELECT ITEM NAME</option>
              {masterItems.map(i => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Specification</Form.Label>
            <Form.Select
              name="specificationId"
              value={currentItem.specificationId}
              onChange={onItemChange}
            >
              <option value="">SELECT SPECIFICATION</option>
              {specs.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Item Code</Form.Label>
            <Form.Control
              name="itemCode"
              value={currentItem.itemCode}
              onChange={onItemChange}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>UOM</Form.Label>
            <Form.Control
              name="uom"
              value={currentItem.uom}
              onChange={onItemChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-2">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Currency</Form.Label>
            <Form.Control
              name="currency"
              value={currentItem.currency}
              onChange={onItemChange}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Average Price</Form.Label>
            <Form.Control
              type="number"
              name="avgPrice"
              value={currentItem.avgPrice}
              onChange={onItemChange}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
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
        <Col md={3}>
          <Form.Group>
            <Form.Label>HSN Code</Form.Label>
            <Form.Control
              name="hsnCode"
              value={currentItem.hsnCode}
              onChange={onItemChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-2">
        <Col md={3}>
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
        <Col md={3}>
          <Form.Group>
            <Form.Label>Value</Form.Label>
            <Form.Control
              name="value"
              value={currentItem.value}
              disabled
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Budget Available</Form.Label>
            <Form.Control
              name="budgetAvailable"
              value={currentItem.budgetAvailable}
              disabled
            />
          </Form.Group>
        </Col>
        <Col
          md={3}
          className="d-flex align-items-end justify-content-start"
        >
          <Button variant="success" onClick={addItem}>
            Add More
          </Button>
        </Col>
      </Row>

      {/* Items table */}
      <Table striped bordered size="sm" className="mt-3">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Item Code</th>
            <th>Specification</th>
            <th>UOM</th>
            <th>Currency</th>
            <th>Average Price</th>
            <th>HSN Code</th>
            <th>Require Qty</th>
            <th>Value</th>
            <th>Budget Available</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map(r => (
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
                  X
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Footer fields */}
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Created By</Form.Label>
            <Form.Control name="createdBy"  />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Checked By</Form.Label>
            <Form.Control name="checkedBy"  />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Approved By</Form.Label>
            <Form.Control name="approvedBy"  />
          </Form.Group>
        </Col>
      </Row>

      <div className="text-center">
        <Button type="submit" variant="success" className="mx-2">
          Submit
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="mx-2"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </Form>
  );
}
