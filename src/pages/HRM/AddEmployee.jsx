// React version of the given ASP.NET MVC Employee Registration Form
// NOTE:
// - This keeps structure & fields same as your Razor view
// - Uses uncontrolled inputs for simplicity (like MVC helpers)
// - You can later convert to controlled inputs / validation

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const EmployeeRegistration = () => {
  const [collapsed, setCollapsed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form submitted (hook API here)");
  };

  return (
    <div className="container" style={{ maxWidth: 1462 }}>
      <h2 className="text-center text-primary fw-bold">
        NEW EMPLOYEE REGISTRATION FORM
      </h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* ================= EMPLOYEE INFORMATION ================= */}
        <div className="accordion" id="employeeAccordion">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#employeeInfo"
              >
                EMPLOYEE INFORMATION
              </button>
            </h2>

            <div id="employeeInfo" className="accordion-collapse collapse show">
              <div className="accordion-body">
                <div className="row">
                  <div className="col-md-3">
                    <label>Title</label>
                    <select className="form-control" name="Title">
                      <option value="">SELECT</option>
                      <option>MR</option>
                      <option>MS</option>
                      <option>MRS</option>
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label>Name</label>
                    <input className="form-control" name="Name" />
                  </div>

                  <div className="col-md-3">
                    <label>Middle Name</label>
                    <input className="form-control" name="Middle_Name" />
                  </div>

                  <div className="col-md-3">
                    <label>Surname</label>
                    <input className="form-control" name="Surname" />
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-3">
                    <label>Gender</label>
                    <select className="form-control" name="Gender">
                      <option value="">SELECT</option>
                      <option>MALE</option>
                      <option>FEMALE</option>
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label>DOB</label>
                    <input type="date" className="form-control" name="DOB" />
                  </div>

                  <div className="col-md-3">
                    <label>Blood Group</label>
                    <select className="form-control" name="Blood_Group">
                      <option>SELECT</option>
                      <option>A+</option><option>A-</option>
                      <option>B+</option><option>B-</option>
                      <option>AB+</option><option>AB-</option>
                      <option>O+</option><option>O-</option>
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label>Email</label>
                    <input type="email" className="form-control" name="Email" />
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-3">
                    <label>Contact No</label>
                    <input className="form-control" maxLength="10" name="Contact_NO" />
                  </div>

                  <div className="col-md-3">
                    <label>Married Status</label>
                    <select className="form-control" name="Married_Status">
                      <option>SELECT</option>
                      <option>MARRIED</option>
                      <option>UNMARRIED</option>
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label>Address</label>
                    <textarea className="form-control" name="Address" rows="3" />
                  </div>

                  <div className="col-md-3 mt-4">
                    <input type="checkbox" /> Same as Address
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= EMPLOYER INFORMATION ================= */}
        <div className="accordion mt-3">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#employerInfo">
                EMPLOYER INFORMATION
              </button>
            </h2>

            <div id="employerInfo" className="accordion-collapse collapse">
              <div className="accordion-body">
                <div className="row">
                  <div className="col-md-3">
                    <label>Category</label>
                    <select className="form-control" name="SalaryStatus">
                      <option>SELECT</option>
                      <option>STAFF</option>
                      <option>EMPLOYEE</option>
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label>Date Of Joining</label>
                    <input type="date" className="form-control" name="Date_Of_Joining" />
                  </div>

                  <div className="col-md-3">
                    <label>Notice Period</label>
                    <input className="form-control" name="Notices_Period" />
                  </div>

                  <div className="col-md-3">
                    <label>Weekly Off</label>
                    <select className="form-control" name="Weekly_Off">
                      <option>YES</option>
                      <option>NO</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SALARY STRUCTURE ================= */}
        <div className="accordion mt-3">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#salaryInfo">
                SALARY STRUCTURE
              </button>
            </h2>

            <div id="salaryInfo" className="accordion-collapse collapse">
              <div className="accordion-body">
                <div className="row">
                  <div className="col-md-3">
                    <label>Monthly Gross Salary</label>
                    <input className="form-control" name="Monthly_Gross_Salary" />
                  </div>

                  <div className="col-md-3">
                    <label>Basic Salary</label>
                    <input className="form-control" name="Basic_Salary" />
                  </div>

                  <div className="col-md-3">
                    <label>DA</label>
                    <input className="form-control" name="DA" />
                  </div>

                  <div className="col-md-3">
                    <label>Daily Salary</label>
                    <input className="form-control" name="Daily_Salary" />
                  </div>
                </div>

                <div className="text-center mt-4">
                  <button className="btn btn-success" type="submit">SUBMIT</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EmployeeRegistration;
