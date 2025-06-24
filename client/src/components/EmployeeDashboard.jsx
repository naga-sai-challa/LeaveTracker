import React, { useEffect, useState } from "react";
import "../Styles/EmployeeDashboard.css";
import axios from "axios";
import BasicDateCalendar from "./BasicDateCalendar";

const EmployeeDashboard = () => {
  const [formData, setFormData] = useState({
    type: "",
    startDate: "",
    endDate: "",
    comment: "",
  });
  const [empData, setEmpData] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function getLeaveData() {
      try {
        const response = await axios.get(
          "http://localhost:5000/auth/current-user-details",
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );
        setEmpData(response.data);
      } catch (error) {
        console.log(error.response?.data);
      }
    }
    getLeaveData();
  }, []);

  function handleInput(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Basic validation
    if (!formData.type || !formData.startDate || !formData.endDate) {
      setMessage("Please fill in all required fields!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/employee/apply-leave",
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      setMessage(response.data.message);

      // Clear form on successful submission
      setFormData({
        type: "",
        startDate: "",
        endDate: "",
        comment: "",
      });
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  }

  const leaveTypes = [
    { value: "casual", label: "Casual Leave" },
    { value: "earned", label: "Earned Leave" },
    { value: "wfh", label: "Work From Home" },
    { value: "unpaid", label: "Unpaid Leave" },
  ];

  return (
    <>
      {/* Header */}
      <header></header>

      {/* Main Dashboard Container */}
      <div className="dashboard-container">
        {/* Top Section - Form and Calendar */}
        <div className="form-calendar-wrapper">
          {/* Leave Application Form */}
          <div className="form-card">
            <h2 className="form-title">Apply for Leave</h2>
            <form onSubmit={handleSubmit} className="leave-form">
              <div className="form-group">
                <label className="form-label">Leave Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInput}
                  className="form-select"
                  required
                >
                  <option value="">Select leave type</option>
                  {leaveTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="date-row">
                <div className="form-group">
                  <label className="form-label">Start Date *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={handleInput}
                    name="startDate"
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date *</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={handleInput}
                    name="endDate"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Reason (Optional)</label>
                <textarea
                  value={formData.comment}
                  onChange={handleInput}
                  name="comment"
                  placeholder="Enter reason for leave..."
                  className="form-textarea"
                  rows={3}
                />
              </div>

              <button type="submit" className="submit-button">
                Submit Application
              </button>

              {message && (
                <div
                  className={`message ${
                    message.includes("success") ? "success" : "error"
                  }`}
                >
                  {message}
                </div>
              )}
            </form>
          </div>

          {/* Right Section - Calendar and Holiday Info */}
          <div className="right-section">
            {/* Calendar Component */}
            <div className="calendar-section">
              <h3 className="section-title">Calendar</h3>
              <div className="calendar-wrapper">
                <BasicDateCalendar />
              </div>
            </div>
          </div>
        </div>

        {/* Leave Balance Table */}
        <div className="leave-balance-section">
          <h2 className="section-title">Leave Balance Summary</h2>
          <div className="leave-balance-table">
            <table className="balance-table">
              <thead>
                <tr>
                  <th>Leave Type</th>
                  <th>Total Allocated</th>
                  <th>Used</th>
                  <th>Available</th>
                  <th className="hide-mobile">Utilization</th>
                </tr>
              </thead>
              <tbody>
                {leaveTypes.map((type) => {
                  const total =
                    empData?.employee?.leaveBalance?.[type.value] || 0;
                  const used = empData?.employee?.leavesUsed?.[type.value] || 0;
                  const available = total - used;
                  const utilization =
                    total > 0 ? Math.round((used / total) * 100) : 0;

                  return (
                    <tr key={type.value} className="table-row">
                      <td className="leave-type-cell">
                        <strong>{type.label}</strong>
                      </td>
                      <td>{total}</td>
                      <td>
                        <span
                          className={`badge ${
                            used > 0 ? "badge-used" : "badge-unused"
                          }`}
                        >
                          {used}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            available > 5 ? "badge-available" : "badge-low"
                          }`}
                        >
                          {available}
                        </span>
                      </td>
                      <td className="hide-mobile">
                        <div className="progress-container">
                          <div
                            className={`progress-bar ${
                              utilization > 80
                                ? "progress-high"
                                : utilization > 60
                                ? "progress-medium"
                                : "progress-low"
                            }`}
                            style={{ width: `${utilization}%` }}
                          ></div>
                          <span className="progress-text">{utilization}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        {/* Holiday Image */}
        <div className="holiday-image-wrapper">
          <img src="/public_holidays.png" alt="Public Holidays" />
        </div>
      </div>
    </>
  );
};

export default EmployeeDashboard;
