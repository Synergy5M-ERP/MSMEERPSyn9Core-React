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
              <th>EMPLOYEE NAME</th>
              <th>STATUS</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, i) => (
              <tr key={i}>
                {/* ✅ MATCH API FIELD NAMES */}
                <td>{item.deptName}</td>
                <td>{item.designationName}</td>
                <td>{item.level}</td>
                <td>{item.experience}</td>
                <td>{item.qualification}</td>
                <td>{item.industryName}</td>
                <td>{item.countryName}</td>
                <td>{item.stateName}</td>
                <td>{item.cityName}</td>
                <td>{item.currencyName}</td>
                <td>{item.maxBudget}</td>
                <td>{item.minBudget}</td>

                <td>
                  {item.onBoardDate
                    ? new Date(item.onBoardDate).toLocaleDateString()
                    : "N/A"}
                </td>

                <td>{item.employee_Name || "-"}</td>
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