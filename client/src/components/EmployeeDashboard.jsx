import React, { useEffect, useState } from "react";
import "../Styles/EmployeeDashboard.css";
import axios from "axios";
import BasicDateCalendar from "./BasicDateCalendar";
import { 
  Checkbox, 
  FormControlLabel, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Box,
  Paper,
  Snackbar,
  Alert
} from "@mui/material";
import { styled } from '@mui/material/styles';

const EmployeeDashboard = () => {
  const [formData, setFormData] = useState({
    type: "",
    startDate: "",
    endDate: "",
    comment: "",
    isHalfDay: false,
  });
  const [empData, setEmpData] = useState({});
  const [openDialog, setOpenDialog] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

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
    setFormData((prev) => {
      if (e.target.name == "endDate" || e.target.name == "startDate") {
        if (prev.isHalfDay) {
          prev.endDate = e.target.value;
          prev.startDate = e.target.value;
        }
      }
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Basic validation
    if (!formData.type || !formData.startDate || !formData.endDate) {
      showSnackbar("Please fill in all required fields!", "error");
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
      showSnackbar(response.data.message, "success");

      // Clear form on successful submission
      setFormData({
        type: "",
        startDate: "",
        endDate: "",
        comment: "",
        isHalfDay: false
      });
    } catch (error) {
      showSnackbar(error.response?.data?.message || "Something went wrong", "error");
    }
  }

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({...prev, open: false}));
  };

  const leaveTypes = [
    { value: "casual", label: "Casual Leave" },
    { value: "earned", label: "Earned Leave" },
    { value: "wfh", label: "Work From Home" },
    { value: "unpaid", label: "Unpaid Leave" },
  ];

  const handleOpenDialog = (dialogType) => {
    setOpenDialog(dialogType);
  };

  const handleCloseDialog = () => {
    setOpenDialog(null);
  };

  const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#4ade80',
    color: '#065f46',
    fontWeight: 'bold',
    padding: '10px 20px',
    borderRadius: '8px',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#22c55e',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    transition: 'all 0.3s ease',
  }));

  const DialogButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#4ade80',
    color: '#065f46',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#22c55e',
    },
  }));

  return (
    <>
      {/* Header */}
      <header></header>

      {/* Main Dashboard Container */}
      <div className="dashboard-container">
        {/* Action Buttons */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          justifyContent: 'center',
          mb: 4,
          flexWrap: 'wrap'
        }}>
          <StyledButton 
            variant="contained" 
            onClick={() => handleOpenDialog('balance')}
            sx={{ minWidth: 200 }}
          >
            View Leave Balance
          </StyledButton>
          <StyledButton 
            variant="contained" 
            onClick={() => handleOpenDialog('holidays')}
            sx={{ minWidth: 200 }}
          >
            View Holiday List
          </StyledButton>
        </Box>

        {/* Form and Calendar Layout */}
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
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isHalfDay}
                      onChange={(e) => {
                        const checked = e.target.checked;

                        setFormData((prev) => {
                          let updated = { ...prev, isHalfDay: checked };

                          if (checked) {
                            const today = new Date()
                              .toISOString()
                              .split("T")[0];

                            if (!prev.startDate) {
                              updated.startDate = today;
                              updated.endDate = today;
                            } else {
                              updated.endDate = prev.startDate;
                            }
                          }

                          return updated;
                        });
                      }}
                      name="isHalfDay"
                      color="primary"
                    />
                  }
                  label="Apply for Half Day"
                />
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
            </form>
          </div>

          {/* Calendar Section */}
          <div className="right-section">
            <div className="calendar-section">
              <h3 className="section-title">Calendar</h3>
              <div className="calendar-wrapper">
                <BasicDateCalendar />
              </div>
            </div>
          </div>
        </div>

        {/* Dialogs */}
        {/* Leave Balance Dialog */}
        <Dialog
          open={openDialog === 'balance'}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ 
            backgroundColor: '#d1fae5', 
            color: '#065f46',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <span>Your Leave Balance</span>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
              <table className="balance-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Leave Type</th>
                    <th>Total Allocated</th>
                    <th>Used</th>
                    <th>Available</th>
                    <th>Utilization</th>
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
                        <td>
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
            </Paper>
          </DialogContent>
          <DialogActions>
            <DialogButton onClick={handleCloseDialog}>Close</DialogButton>
          </DialogActions>
        </Dialog>

        {/* Holidays Dialog */}
        <Dialog
          open={openDialog === 'holidays'}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ 
            backgroundColor: '#d1fae5', 
            color: '#065f46',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <span>Public Holidays</span>
          </DialogTitle>
          <DialogContent sx={{ 
            p: 3,
            display: 'flex',
            justifyContent: 'center'
          }}>
            <Box sx={{ 
              width: '100%',
              p: 2,
              borderRadius: 2,
              display: 'flex',
              justifyContent: 'center'
            }}>
              <img 
                src="/public_holidays.png" 
                alt="Public Holidays" 
                style={{ 
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }} 
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <DialogButton onClick={handleCloseDialog}>Close</DialogButton>
          </DialogActions>
        </Dialog>

        {/* Snackbar for messages */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

export default EmployeeDashboard;