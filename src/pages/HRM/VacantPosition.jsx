import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import { API_ENDPOINTS } from "../../config/apiconfig";

const VacantPosition = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await axiosInstance.get(API_ENDPOINTS.vacantpositions);

      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="container-fluid mt-3">

      {/* ✅ TITLE FIXED */}
      <div className="text-center text-primary h2 mb-3">
        VACANT POSITION
      </div>

      <div className="table-responsive">
        <table className="table table-bordered text-center">
          <thead style={{ backgroundColor: "#6d91e3", color: "white" }}>
            <tr>
              <th>DEPARTMENT</th>
              <th>POSITION</th>
              <th>LEVEL</th>
              <th>EXPERIENCE</th>
              <th>QUALIFICATION</th>
              <th>INDUSTRY</th>
              <th>COUNTRY</th>
              <th>STATE</th>
              <th>CITY</th>
              <th>CURRENCY</th>
              <th>MAX BUDGET</th>
              <th>MIN BUDGET</th>
              <th>JOINING DATE</th>
              
              <th>STATUS</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, i) => (
              <tr key={i}>
                {/* ✅ MATCH API FIELD NAMES */}
                <td>{item.department}</td>
                <td>{item.position}</td>
                <td>{item.level}</td>
                <td>{item.experience}</td>
                <td>{item.qualification}</td>
                <td>{item.industry}</td>
                <td>{item.country}</td>
                <td>{item.state}</td>
                <td>{item.city}</td>
                <td>{item.currencyName}</td>
                <td>{item.maximum_Budget}</td>
                <td>{item.minimum_Budget}</td>

                <td>
                  {item.onboard_Date
                    ? new Date(item.onboard_Date).toLocaleDateString()
                    : "N/A"}
                </td>

                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VacantPosition;