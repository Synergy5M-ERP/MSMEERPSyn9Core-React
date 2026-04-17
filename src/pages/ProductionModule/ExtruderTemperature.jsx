

import React, { useState, useRef } from 'react';
import { Container, Row, Col, Form, Button, Table, Card, Badge } from 'react-bootstrap';
import { Plus, Download, Printer, Trash2, XCircle, ArrowLeft, RotateCcw, Calendar } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import html2pdf from 'html2pdf.js';
import 'react-toastify/dist/ReactToastify.css';
import { API_ENDPOINTS } from '../../config/apiconfig';

const ExtruderTemperature = () => {
    // --- Configuration Constants ---
    const zoneOptions = {
        "barrel_zone": ["B1", "B2", "B3", "B4", "B5"],
        "screen_changer": ["S1"],
        "ad1": ["A1"],
        "melt_pump": ["M1"],
        "ad2": ["A2"],
        "die_head": ["D1", "D2", "D3", "D4", "D5"],
        "actual_temp": ["AT1"],
        "water_temp": ["W1"],
        "oven_temp": ["O1"]
    };

    const tempTypePriority = {
        "barrel_zone": 1, "screen_changer": 2, "ad1": 3, "melt_pump": 4,
        "ad2": 5, "die_head": 6, "actual_temp": 7, "water_temp": 8, "oven_temp": 9
    };

    // --- State Management ---
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        tempType: "",
        zone: "",
        tempValue: ""
    });

    const [addedData, setAddedData] = useState([]);
    const [showReport, setShowReport] = useState(false);
    const [isResetting, setIsResetting] = useState(false); 
    const reportRef = useRef();

    // --- Handlers ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "tempType") {
            setFormData({ ...formData, tempType: value, zone: "", tempValue: "" });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const addRow = () => {
        const { date, tempType, zone, tempValue } = formData;
        if (!date || !tempType || !zone || !tempValue) return toast.warning("Missing Fields!");
        const numericTemp = parseFloat(tempValue);
        if (numericTemp < 0) return toast.error("Negative temperatures not allowed!");

        setAddedData([...addedData, {
            id: Date.now(),
            date,
            temperatureType: tempType,
            zone,
            temperature: numericTemp
        }]);
        setFormData({ ...formData, zone: "", tempValue: "" });
        toast.success("Added to list.");
    };

    const handleResetTable = () => {
        if (addedData.length === 0) return;
        if (window.confirm("Are you sure you want to clear all data?")) {
            setIsResetting(true);
            setTimeout(() => {
                setAddedData([]);
                setIsResetting(false);
                toast.info("Data reset successfully.");
            }, 500);
        }
    };

    const handleSubmit = async () => {
        if (addedData.length === 0) return toast.error("No data to submit.");
        const submitToast = toast.loading("Saving data to server...");
        try {
            const res = await fetch(API_ENDPOINTS.SaveExtruderTemp, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(addedData)
            });
            if (res.ok) {
                toast.update(submitToast, { render: "Saved successfully!", type: "success", isLoading: false, autoClose: 3000 });
                setAddedData([]);
                setShowReport(false);
            } else throw new Error();
        } catch (err) {
            toast.update(submitToast, { render: "Submission Error.", type: "error", isLoading: false, autoClose: 4000 });
        }
    };

    const getReportStructure = () => {
        const uniqueDates = [...new Set(addedData.map(d => d.date))].sort((a,b) => new Date(b) - new Date(a));
        return uniqueDates.map(date => {
            const dayData = addedData.filter(d => d.date === date);
            const activeTypes = Object.keys(tempTypePriority)
                .filter(type => dayData.some(d => d.temperatureType === type))
                .sort((a, b) => tempTypePriority[a] - tempTypePriority[b]);
            return {
                date,
                types: activeTypes.map(type => ({
                    typeName: type,
                    readings: dayData.filter(d => d.temperatureType === type).sort((a,b) => a.zone.localeCompare(b.zone))
                }))
            };
        });
    };

    const dailyReportData = getReportStructure();

    const handleDownloadPDF = () => {
        const element = reportRef.current;
        const opt = {
            margin: 15,
            filename: `Extruder_Report.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'pt', format: 'a4', orientation: 'landscape' }
        };
        html2pdf().from(element).set(opt).save();
    };

    return (
        <Container fluid className={`p-4 bg-white ${isResetting ? 'reset-animation' : ''}`} style={{ fontFamily: 'Cambria, serif' }}>
            <ToastContainer position="top-right" theme="colored" />
            
        

            {!showReport ? (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="fw-bold text-primary mb-0">EXTRUDER TEMPERATURE ENTRY</h4>
                        {addedData.length > 0 && (
                            <Button className='cancel-btn' onClick={handleResetTable}>
                                <RotateCcw size={16} className={`me-1 ${isResetting ? 'animate-spin' : ''}`} /> RESET 
                            </Button>
                        )}
                    </div>

                    <Card className="p-4 shadow-sm border-0 bg-light mb-4">
                        <Row className="align-items-end g-3">
                            <Col md={3}><Form.Group><Form.Label className="label-color">Date</Form.Label><Form.Control className="select-field-style" type="date" name="date" value={formData.date} onChange={handleInputChange} /></Form.Group></Col>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label className="label-color">Type</Form.Label>
                                    <Form.Select className="select-field-style" name="tempType" value={formData.tempType} onChange={handleInputChange}>
                                        <option value="">-- Select Type --</option>
                                        {Object.keys(zoneOptions).map(opt => <option key={opt} value={opt}>{opt.replace(/_/g, ' ').toUpperCase()}</option>)}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label className="label-color">Zone</Form.Label>
                                    <Form.Select className="select-field-style" name="zone" value={formData.zone} onChange={handleInputChange} disabled={!formData.tempType}>
                                        <option value="">-- Zone --</option>
                                        {(zoneOptions[formData.tempType] || []).map(z => <option key={z} value={z}>{z}</option>)}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={2}><Form.Group><Form.Label className="label-color">Value (°C)</Form.Label><Form.Control className="select-field-style" type="number" name="tempValue" value={formData.tempValue} onChange={handleInputChange} /></Form.Group></Col>
                            <Col md={2}><Button variant="success" className="add-btn" onClick={addRow}> ADD</Button></Col>
                        </Row>

                        {addedData.length > 0 && (
                            <div className="table-responsive mt-4">
                                <Table bordered hover size="sm" className="bg-white text-center shadow-sm">
                                    <thead className="table-primary">
                                        <tr><th>Date</th><th>Type</th><th>Zone</th><th>Value</th><th>Action</th></tr>
                                    </thead>
                                    <tbody>
                                        {addedData.map((item, index) => (
                                            <tr key={index}>
                                                <td className='text-secondary'>{item.date}</td>
                                                <td className='text-secondary'>{item.temperatureType.replace(/_/g, ' ').toUpperCase()}</td>
                                                <td className='text-secondary'>{item.zone}</td>
                                                <td className="fw-bold text-primary">{item.temperature}°C</td>
                                                <td><Trash2 size={18} className="text-danger pointer" onClick={() => setAddedData(addedData.filter((_, i) => i !== index))} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                    </Card>

                    <div className="text-center mb-5 d-flex  gap-2">
                        <Button variant="success" className="save-btn" onClick={handleSubmit}>SUBMIT</Button>
                        <Button className="report-btn" onClick={() => setShowReport(true)} disabled={addedData.length === 0}> REPORT</Button>
                    </div>
                </>
            ) : (
                /* REPORT VIEW WITH 2-COLUMN DATE LOGIC AND LABELS */
                <div className="mt-2">
                    <div className="d-flex justify-content-between align-items-center mb-3 no-print">
                        <Button variant="link" className="text-decoration-none p-0 text-secondary" onClick={() => setShowReport(false)}><ArrowLeft size={18} className="me-1" /> Back</Button>
                        <XCircle size={24} className="text-danger pointer" onClick={() => setShowReport(false)} />
                    </div>

                    <div ref={reportRef} className="p-4 bg-white border rounded shadow-sm">
                        <div className="text-center border-bottom pb-1 mb-1 ">
                            <h2 className="text-primary fw-bold">EXTRUDER TEMPERATURE REPORT</h2>
                    
                        </div>

                        <Row className="g-5"> 
                            {dailyReportData.map((day, dIdx) => (
                                <Col md={6} key={day.date} className="mb-1">
                                    <div className={`h-100 ${dIdx % 2 !== 0 ? 'border-start ps-4' : 'pe-2'}`}>
                                        
                                        <div className="d-flex align-items-center mb-4">
                                            <div className="bg-primary text-white p-2 rounded me-3"><Calendar size={20} /></div>
                                            <h5 className="mb-0 fw-bold">{day.date}</h5>
                                        </div>

                                        <Row className="g-3">
                                            {day.types.map(typeGroup => (
                                                <Col xs={12} key={typeGroup.typeName}>
                                                    {/* <div className="report-label mb-1">Type</div> */}
                                                    <Card className="border-0 shadow-sm overflow-hidden mb-3">
                                                        <div className="bg-primary text-white p-1 text-center " style={{ fontSize: '15px' }}>
                                                   Type:  {typeGroup.typeName.replace(/_/g, ' ')}
                                                        </div>
                                                        <Table hover size="sm" className="mb-0 border-0">
                                                            <thead className="table-light">
                                                                <tr>
                                                                    <th className="ps-3 report-label">Zone</th>
                                                                    <th className="text-end pe-3 report-label">Value (°C)</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {typeGroup.readings.map(r => (
                                                                    <tr key={r.zone} style={{ fontSize: '11px' }}>
                                                                        <td className="ps-3 text-secondary fw-bold">{r.zone}</td>
                                                                        <td className="text-end pe-3 text-primary fw-bold">
                                                                            {r.temperature}°C
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </Table>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    </div>
                                </Col>
                            ))}
                        </Row>

                        <div className="mt-5 pt-3 d-flex justify-content-between text-muted border-top" style={{ fontSize: '10px' }}>
                            <span>Printed: {new Date().toLocaleString()}</span>
                            <span>Authorized Signature: ____________________</span>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center gap-3 mt-4 mb-5 no-print">
                        <Button  className="download-btn" onClick={handleDownloadPDF}> PDF</Button>
                        <Button  className="print-btn" onClick={() => window.print()}>PRINT</Button>
                        <Button className="cancel-btn" onClick={() => setShowReport(false)}>CLOSE</Button>
                    </div>
                </div>
            )}
        </Container>
    );
};

export default ExtruderTemperature;