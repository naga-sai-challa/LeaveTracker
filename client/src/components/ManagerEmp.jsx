import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/ManagerEmp.css"; // Import the CSS file

const ManagerEmp = () => {
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [activeEmployees, setActiveEmployees] = useState([]);

  async function getPendingEmployeeApprovals() {
    try {
      const response = await axios.get(
        "http://localhost:5000/admin/pending-employee-approvals",
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      setPendingApprovals(response.data.data);
    } catch (error) {
      console.log(error.response.data);
    }
  }

  async function getAllActiveEmployees() {
    try {
      const response = await axios.get(
        "http://localhost:5000/admin/get-all-active-employees",
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      setActiveEmployees(response.data.allEmployees);
    } catch (error) {
      console.log(error.response.data);
    }
  }

  useEffect(() => {
    getPendingEmployeeApprovals();
    getAllActiveEmployees();
  }, []);

  async function approveEmployee(empId, action) {
    try {
      await axios.post(
        "http://localhost:5000/admin/approve-or-reject-employee",
        { empId, action },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      getPendingEmployeeApprovals();
      getAllActiveEmployees();
    } catch (error) {
      console.log(error.response.data);
    }
  }

  async function makeAdmin(empId, action) {
    try {
      await axios.post(
        "http://localhost:5000/admin/make-or-remove-admin",
        { empId, action },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      getAllActiveEmployees();
    } catch (error) {
      console.log(error.response.data);
    }
  }

  return (
    <div className="manager-container">
      <div className="pending-section">
        <h2>Pending Employee Approvals</h2>
        {pendingApprovals.length === 0 ? (
          <p>No pending approvals</p>
        ) : (
          pendingApprovals.map((emp) => (
            <div className="pending-card" key={emp._id}>
              <p>
                <strong>Name:</strong> {emp.name}
              </p>
              <p>
                <strong>Email:</strong> {emp.email}
              </p>
              <p>
                <strong>Role:</strong> {emp.role}
              </p>
              <p>
                <strong>Phone:</strong> {emp?.phone}
              </p>
              <div className="button-group">
                <button onClick={() => approveEmployee(emp._id, "approve")}>
                  Approve
                </button>
                <button onClick={() => approveEmployee(emp._id, "reject")}>
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="active-section">
        <h2>Active Employees</h2>
        <table className="employee-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeEmployees.map((emp) => (
              <tr key={emp._id}>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.role}</td>
                <td>{emp?.phone}</td>
                <td>
                  <div className="button-group">
                    <button onClick={() => makeAdmin(emp._id, "emp")}>
                      Remove Admin
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerEmp;
