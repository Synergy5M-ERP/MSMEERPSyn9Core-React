import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../config/apiconfig';
import { toast } from 'react-toastify';
import { Table, Form, Button, Row, Col, Card, Spinner } from 'react-bootstrap';
import { Trash2, Send, RotateCcw, XCircle } from 'lucide-react';

const PlantSettingParameter = () => {
    // --- Helpers ---
    const getTodayDate = () => new Date().toISOString().split('T')[0];
    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours() % 12 || 12;
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
        return { time: `${hours}:${minutes}`, ampm };
    };

    // --- State Management ---
    const [itemList, setItemList] = useState([]);
    const [gradeList, setGradeList] = useState([]);
    const [uomList, setUomList] = useState([]);
    const [machineList, setMachineList] = useState([]); 
    const [locationList, setLocationList] = useState([]);
    const [machineNoList, setMachineNoList] = useState([]);

    const [addedItems, setAddedItems] = useState([]);
    const [addedMachines, setAddedMachines] = useState([]);
    const [processParams, setProcessParams] = useState([]);

    const [itemForm, setItemForm] = useState({ ItemName: "", Grade: "", UOM: "", Quantity: "" });
    const [machineForm, setMachineForm] = useState({ MachineName: "", Location: "", MachineNo: "" });
    const [processForm, setProcessForm] = useState({ 
        Date: getTodayDate(),
        Time: getCurrentTime().time,
        AM_PM: getCurrentTime().ampm,
        Parameter: "", 
        RPM: "", CurrentValue: "", Ratio: "", P1: "", P3: "" 
    });

    const [loading, setLoading] = useState({ items: false, machines: false, grades: false });

    const isNegative = (value) => value !== "" && parseFloat(value) < 0;

    // 1. Initial Load
    useEffect(() => {
        const fetchBaseData = async () => {
            setLoading(prev => ({ ...prev, items: true, machines: true }));
            try {
                const [itemRes, machinesRes] = await Promise.all([
                    fetch(API_ENDPOINTS.ItemList),
                    fetch(API_ENDPOINTS.GetAllMachines)
                ]);
                const items = await itemRes.json();
                const machines = await machinesRes.json();
                setItemList(items.$values || items);
                setMachineList(machines.$values || machines);
            } catch (err) { 
                toast.error("Error loading master data"); 
            } finally { 
                setLoading(prev => ({ ...prev, items: false, machines: false })); 
            }
        };
        fetchBaseData();
    }, []);

    // 2. Cascading Selectors logic
    const handleItemSelect = async (name) => {
        setItemForm({ ...itemForm, ItemName: name, Grade: "", UOM: "" });
        setGradeList([]); setUomList([]);
        if (!name) return;
        setLoading(prev => ({ ...prev, grades: true }));
        try {
            const res = await fetch(`${API_ENDPOINTS.GetGrade}?itemName=${encodeURIComponent(name)}`);
            const data = await res.json();
            setGradeList(data.$values || data);
        } catch (e) { toast.error("Error fetching grades"); }
        finally { setLoading(prev => ({ ...prev, grades: false })); }
    };

    const handleGradeSelect = async (grade) => {
        setItemForm({ ...itemForm, Grade: grade, UOM: "" });
        setUomList([]);
        if (!grade) return;
        try {
            const res = await fetch(`${API_ENDPOINTS.GetUOM}?itemName=${encodeURIComponent(itemForm.ItemName)}&grade=${encodeURIComponent(grade)}`);
            const data = await res.json();
            setUomList(data.$values || data);
        } catch (err) { toast.error("Error fetching UOM"); }
    };

    const handleMachineSelect = (description) => {
        setMachineForm({ ...machineForm, MachineName: description, Location: "", MachineNo: "" });
        const filteredLocations = [...new Set(machineList.filter(m => m.machine_Description === description).map(m => m.location))];
        setLocationList(filteredLocations);
        setMachineNoList([]);
    };

    const handleLocationSelect = (loc) => {
        setMachineForm({ ...machineForm, Location: loc, MachineNo: "" });
        const filteredMachineNos = machineList.filter(m => m.machine_Description === machineForm.MachineName && m.location === loc).map(m => m.machine_Code_No);
        setMachineNoList(filteredMachineNos);
    };

    // --- Add Functions ---
    const addItemRow = () => {
        const { ItemName, Grade, UOM, Quantity } = itemForm;
        if (!ItemName || !Grade || !UOM || !Quantity) return toast.warning("All Item fields required!");
        if (isNegative(Quantity)) return toast.error("Quantity cannot be negative!");
        setAddedItems([...addedItems, { ...itemForm, id: Date.now() }]);
        setItemForm({ ItemName: "", Grade: "", UOM: "", Quantity: "" });
    };

    const addMachineRow = () => {
        const { MachineName, Location, MachineNo } = machineForm;
        if (!MachineName || !Location || !MachineNo) return toast.warning("All Machine fields required!");
        setAddedMachines([...addedMachines, { ...machineForm, id: Date.now() }]);
        setMachineForm({ MachineName: "", Location: "", MachineNo: "" });
    };

    const addProcessRow = () => {
        const { Date: procDate, Time, Parameter } = processForm; 
        if (!procDate || !Time || !Parameter) return toast.warning("Date, Time and Parameter are required!");

        const row = {
            ...processForm,
            id: Date.now(),
            Time: `${processForm.Time} ${processForm.AM_PM}`,
            RPM: processForm.RPM || "NA", 
            CurrentValue: processForm.CurrentValue || "NA",
            Ratio: processForm.Ratio || "NA", 
            P1: processForm.P1 || "NA", 
            P3: processForm.P3 || "NA"
        };
        setProcessParams([...processParams, row]);
        resetProcessForm();
    };

    // --- CANCEL / RESET LOGIC ---
    const resetProcessForm = () => {
        setProcessForm({ 
            Date: getTodayDate(), 
            Time: getCurrentTime().time, 
            AM_PM: getCurrentTime().ampm,
            Parameter: "", RPM: "", CurrentValue: "", Ratio: "", P1: "", P3: "" 
        });
    };

    const handleCancelAll = () => {
        if (window.confirm("Are you sure you want to clear all tables and reset the form?")) {
            setAddedItems([]);
            setAddedMachines([]);
            setProcessParams([]);
            setItemForm({ ItemName: "", Grade: "", UOM: "", Quantity: "" });
            setMachineForm({ MachineName: "", Location: "", MachineNo: "" });
            resetProcessForm();
            toast.info("All entries cleared.");
        }
    };

    // --- FINAL SUBMIT LOGIC ---
    const handleSubmit = async () => {
        if (!addedItems.length || !addedMachines.length || !processParams.length) {
            return toast.error("Please add entries to all three tables first!");
        }

        const finalPayload = processParams.flatMap(proc => 
            addedItems.flatMap(itm => 
                addedMachines.map(mach => ({
                    parameterDate: proc.Date,
                    parameterTime: proc.Time,
                    parameterName: proc.Parameter,
                    rpm: proc.RPM,
                    currentValue: proc.CurrentValue,
                    ratio: proc.Ratio,
                    p1: proc.P1,
                    p3: proc.P3,
                    itemName: itm.ItemName,
                    grade: itm.Grade,
                    uom: itm.UOM,
                    quantity: itm.Quantity,
                    location: mach.Location,
                    machineName: mach.MachineName,
                    machineNo: mach.MachineNo
                }))
            )
        );

        try {
            const res = await fetch(API_ENDPOINTS.SavePlantParameters, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(finalPayload)
            });
            if (res.ok) {
                toast.success("Submitted successfully!");
                setAddedItems([]); setAddedMachines([]); setProcessParams([]);
            } else {
                toast.error("Server error during submission");
            }
        } catch (err) { 
            toast.error("Network error"); 
        }
    };

    return (
        <div className="p-4 bg-white" style={{ fontFamily: 'Cambria, serif', minHeight: '100vh' }}>
            <h3 className="text-primary fw-bold mb-4 border-bottom pb-2">PLANT SETTING PARAMETER</h3>

            {/* SECTION 1: ITEMS */}
            <Card className="p-3 mb-4 shadow-sm border-0 bg-light">
                <Row className="align-items-end g-2">
                    <Col md={3}>
                        <Form.Label className="label-color">Item Name</Form.Label>
                        <Form.Select className="input-field-style" value={itemForm.ItemName} onChange={e => handleItemSelect(e.target.value)}>
                            <option value="">Select Item</option>
                            {itemList.map((i, k) => <option key={k} value={i.Name}>{i.Name}</option>)}
                        </Form.Select>
                    </Col>
                    <Col md={3}>
                        <Form.Label className="label-color">Grade {loading.grades && <Spinner size="sm" animation="border" />}</Form.Label>
                        <Form.Select className="input-field-style" value={itemForm.Grade} onChange={e => handleGradeSelect(e.target.value)} disabled={!itemForm.ItemName}>
                            <option value="">Select Grade</option>
                            {gradeList.map((g, k) => <option key={k} value={g.grade}>{g.grade}</option>)}
                        </Form.Select>
                    </Col>
                    <Col md={2}>
                        <Form.Label className="label-color">UOM</Form.Label>
                        <Form.Select className="input-field-style" value={itemForm.UOM} onChange={e => setItemForm({...itemForm, UOM: e.target.value})} disabled={!itemForm.Grade}>
                            <option value="">Select UOM</option>
                            {uomList.map((u, k) => <option key={k} value={u.UOM}>{u.UOM}</option>)}
                        </Form.Select>
                    </Col>
                    <Col md={2}>
                        <Form.Label className="label-color">Qty</Form.Label>
                        <Form.Control className="input-field-style" type="number" value={itemForm.Quantity} onChange={e => setItemForm({...itemForm, Quantity: e.target.value})} />
                    </Col>
                    <Col md={2} className="d-flex gap-1">
                        <Button variant="success" className="add-btn" onClick={addItemRow}>ADD</Button>
                       
                    </Col>
                </Row>
                {addedItems.length > 0 && (
                    <Table bordered hover size="sm" className="mt-3 text-center bg-white shadow-sm rounded">
                        <thead className="table-primary">
                            <tr><th>Item</th><th>Grade</th><th>UOM</th><th>Qty</th><th>Action</th></tr>
                        </thead>
                        <tbody>
                            {addedItems.map(i => (
                                <tr key={i.id}>
                                    <td className="text-secondary">{i.ItemName}</td><td className="text-secondary">{i.Grade}</td><td className="text-secondary">{i.UOM}</td><td className="text-secondary">{i.Quantity}</td>
                                    <td className="text-secondary"><Trash2 size={18} className="text-danger pointer" onClick={() => setAddedItems(addedItems.filter(x => x.id !== i.id))}/></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Card>

            {/* SECTION 2: MACHINES */}
            <Card className="p-3 mb-4 shadow-sm border-0 bg-light">
                <Row className="align-items-end g-2">
                    <Col md={3}>
                        <Form.Label className="label-color">Description</Form.Label>
                        <Form.Select className="input-field-style" value={machineForm.MachineName} onChange={e => handleMachineSelect(e.target.value)}>
                            <option value="">Select Machine</option>
                            {[...new Set(machineList.map(m => m.machine_Description))].map((desc, k) => <option key={k} value={desc}>{desc}</option>)}
                        </Form.Select>
                    </Col>
                    <Col md={3}>
                        <Form.Label className="label-color">Location</Form.Label>
                        <Form.Select className="input-field-style" value={machineForm.Location} onChange={e => handleLocationSelect(e.target.value)} disabled={!machineForm.MachineName}>
                            <option value="">Select Location</option>
                            {locationList.map((l, k) => <option key={k} value={l}>{l}</option>)}
                        </Form.Select>
                    </Col>
                    <Col md={3}>
                        <Form.Label className="label-color">Machine No</Form.Label>
                        <Form.Select className="input-field-style" value={machineForm.MachineNo} onChange={e => setMachineForm({...machineForm, MachineNo: e.target.value})} disabled={!machineForm.Location}>
                            <option value="">Select No</option>
                            {machineNoList.map((no, k) => <option key={k} value={no}>{no}</option>)}
                        </Form.Select>
                    </Col>
                    <Col md={3} className="d-flex gap-1">
                        <Button variant="success" className="add-btn" onClick={addMachineRow}>ADD</Button>
                      
                    </Col>
                </Row>
                {addedMachines.length > 0 && (
                    <Table bordered hover size="sm" className="mt-3 text-center bg-white shadow-sm rounded">
                        <thead className="table-primary">
                            <tr><th>Location</th><th>Machine</th><th>No</th><th>Action</th></tr>
                        </thead>
                        <tbody>
                            {addedMachines.map(m => (
                                <tr key={m.id}>
                                    <td className="text-secondary">{m.Location}</td><td className="text-secondary">{m.MachineName}</td><td className="text-secondary">{m.MachineNo}</td>
                                    <td className="text-secondary"><Trash2 size={18} className="text-danger pointer" onClick={() => setAddedMachines(addedMachines.filter(x => x.id !== m.id))}/></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Card>

            {/* SECTION 3: PROCESS */}
            <Card className="p-3 mb-4 shadow-sm border-0 bg-light">
                <Row className="align-items-end g-2">
                    <Col md={2}>
                        <Form.Label className="label-color">Date</Form.Label>
                        <Form.Control className="input-field-style" type="date" value={processForm.Date} onChange={e => setProcessForm({...processForm, Date: e.target.value})}/>
                    </Col>
                    <Col md={2}>
                        <Form.Label className="label-color">Time</Form.Label>
                        <div className="d-flex gap-1">
                            <Form.Control className="input-field-style" type="time" value={processForm.Time} onChange={e => setProcessForm({...processForm, Time: e.target.value})}/>
                            <Form.Select className="input-field-style" style={{width: '75px'}} value={processForm.AM_PM} onChange={e => setProcessForm({...processForm, AM_PM: e.target.value})}>
                                <option>AM</option><option>PM</option>
                            </Form.Select>
                        </div>
                    </Col>
                    <Col md={3}>
                        <Form.Label className="label-color">Parameter</Form.Label>
                        <Form.Select className="input-field-style" value={processForm.Parameter} onChange={e => setProcessForm({...processForm, Parameter: e.target.value, RPM: "", CurrentValue: "", Ratio: "", P1: "", P3: ""})}>
                            <option value="">Select Parameter</option>
                            <option value="Melt Pump Speed">Melt Pump Speed</option>
                            <option value="Screw">Screw</option>
                            <option value="Streaching">Streaching</option>
                            <option value="Melt Pressure">Melt Pressure</option>
                        </Form.Select>
                    </Col>
                    
                    {(["Melt Pump Speed", "Screw"].includes(processForm.Parameter)) && (
                        <>
                            <Col md={1}>
                                <Form.Label className="label-color">RPM</Form.Label>
                                <Form.Control className="input-field-style" type="number" value={processForm.RPM} onChange={e => setProcessForm({...processForm, RPM: e.target.value})}/>
                            </Col>
                            <Col md={1}>
                                <Form.Label className="label-color">Curr</Form.Label>
                                <Form.Control className="input-field-style" type="number" value={processForm.CurrentValue} onChange={e => setProcessForm({...processForm, CurrentValue: e.target.value})}/>
                            </Col>
                        </>
                    )}
                    {processForm.Parameter === "Streaching" && (
                        <Col md={2}>
                            <Form.Label className="label-color">Ratio</Form.Label>
                            <Form.Control className="input-field-style" type="number" value={processForm.Ratio} onChange={e => setProcessForm({...processForm, Ratio: e.target.value})}/>
                        </Col>
                    )}
                    {processForm.Parameter === "Melt Pressure" && (
                        <>
                            <Col md={1}>
                                <Form.Label className="label-color">P1</Form.Label>
                                <Form.Control className="input-field-style" type="number" value={processForm.P1} onChange={e => setProcessForm({...processForm, P1: e.target.value})}/>
                            </Col>
                            <Col md={1}>
                                <Form.Label className="label-color">P3</Form.Label>
                                <Form.Control className="input-field-style" type="number" value={processForm.P3} onChange={e => setProcessForm({...processForm, P3: e.target.value})}/>
                            </Col>
                        </>
                    )}
                    <Col md={processForm.Parameter ? 1 : 3} className="d-flex gap-1">
                        <Button variant="success" className="add-btn" onClick={addProcessRow}>ADD</Button>
                      
                    </Col>
                </Row>
                {processParams.length > 0 && (
                    <Table bordered hover size="sm" className="mt-3 text-center bg-white shadow-sm rounded">
                        <thead className="table-primary">
                            <tr><th>Date</th><th>Time</th><th>Parameter</th><th>RPM</th><th>Curr</th><th>Ratio</th><th>P1</th><th>P3</th><th>Action</th></tr>
                        </thead>
                        <tbody>
                            {processParams.map(p => (
                                <tr key={p.id}>
                                    <td className="text-secondary">{p.Date}</td><td className="text-secondary">{p.Time}</td><td className="text-secondary">{p.Parameter}</td><td className="text-secondary">{p.RPM}</td><td className="text-secondary">{p.CurrentValue}</td><td className="text-secondary">{p.Ratio}</td><td className="text-secondary">{p.P1}</td><td className="text-secondary">{p.P3}</td>
                                    <td className="text-secondary"><Trash2 size={18} className="text-danger pointer" onClick={() => setProcessParams(processParams.filter(x => x.id !== p.id))}/></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Card>

            <div className="d-flex  gap-3 mt-5">
                 <Button className="save-btn" onClick={handleSubmit}>
                 SUBMIT 
                </Button>
                <Button   className="cancel-btn" onClick={handleCancelAll}>
                    CANCEL 
                </Button>
               
            </div>
        </div>
    );
};

export default PlantSettingParameter;