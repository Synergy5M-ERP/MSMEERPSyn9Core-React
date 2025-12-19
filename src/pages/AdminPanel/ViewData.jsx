import React, { useEffect, useState } from "react";
import axios from "axios";

function ViewData() {
  const [data, setData] = useState(null);

  const queryParams = new URLSearchParams(window.location.search);
  const id = queryParams.get("Id");
  const empcode = queryParams.get("empcode");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `https://localhost:7145/Login/GetUserDetails?Id=${id}&empcode=${empcode}`
      );

      if (res.data.success) {
        setData(res.data.data);
      } else {
        console.log("No data found");
      }
    } catch (e) {
      console.error(e.message);
    }
  };

  if (!data) return <h3>Loading...</h3>;

  return (
    <div className="container">
      <h2 style={{ textAlign: "center", color: "navy" }}>USER DETAILS</h2>

      <div className="row">
        <div className="col-md-3">USERNAME:</div>
        <div className="col-md-3">{data.username}</div>

        <div className="col-md-3">PASSWORD:</div>
        <div className="col-md-3">{data.password}</div>
      </div>

      <div className="row">
        <div className="col-md-3">NAME:</div>
        <div className="col-md-3">{data.Name}</div>

        <div className="col-md-3">SURNAME:</div>
        <div className="col-md-3">{data.Surname}</div>
      </div>

      <div className="row">
        <div className="col-md-3">CONTACT:</div>
        <div className="col-md-3">{data.Contact_NO}</div>

        <div className="col-md-3">EMAIL:</div>
        <div className="col-md-3">{data.Email}</div>
      </div>

      <div className="row">
        <div className="col-md-3">GENDER:</div>
        <div className="col-md-3">{data.Gender}</div>

        <div className="col-md-3">ADDRESS:</div>
        <div className="col-md-3">{data.permanent_Address}</div>
      </div>

      <div className="row">
        <div className="col-md-3">DEPARTMENT:</div>
        <div className="col-md-3">{data.Department}</div>

        <div className="col-md-3">DESIGNATION:</div>
        <div className="col-md-3">{data.Joining_Designation}</div>
      </div>

      <div className="row">
        <div className="col-md-3">AUTHORITY:</div>
        <div className="col-md-3">{data.Joining_AuthorityLevel}</div>

        <div className="col-md-3">DATE OF JOINING:</div>
        <div className="col-md-3">
          {data.Date_Of_Joing
            ? new Date(data.Date_Of_Joing).toLocaleDateString()
            : ""}
        </div>
      </div>

      <div className="row">
        <div className="col-md-3">EMP CODE:</div>
        <div className="col-md-3">{data.Emp_Code}</div>
      </div>

      <div className="text-center mt-4">
        <button
          onClick={() => (window.location.href = "/moduleuserdata")}
          className="btn btn-primary"
        >
          PROCEED
        </button>
      </div>
    </div>
  );
}

export default ViewData;
