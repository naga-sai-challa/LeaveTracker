import axios from "axios";
import { useEffect, useState } from "react";
import "../Styles/GetPendingLeaves.css";

const GetPendingLeaves = () => {
  const [leaves, setLeaves] = useState([]);

  const getLeaves = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/admin/pending-leaves",
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      setLeaves(response.data.pendingLeaves);
      console.log(response.data.pendingLeaves);
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  useEffect(() => {
    getLeaves();
  }, []);

  const approveLeave = async (leaveId) => {
    try {
      await axios.post(
        "http://localhost:5000/admin/approve-leave",
        { leaveId },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      getLeaves();
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const rejectLeave = async (leaveId) => {
    try {
      await axios.post(
        "http://localhost:5000/admin/reject-leave",
        { leaveId },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      getLeaves();
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  return (
    <div className="leave-container">
      <h2 className="leave-title">Pending Leave Requests</h2>
      <div className="leave-grid">
        {leaves.map((leave) => (
          <div className="leave-card" key={leave._id}>
            <p>Name : {leave.name}</p>
            <p>Email : {leave.email}</p>
            <p>{leave.type} Leave</p>
            <p>From: {leave.startDate.slice(0, 10)}</p>
            <p>To: {leave.endDate.slice(0, 10)}</p>
            <p>Status: {leave.status}</p>
            <p>Comment: {leave.comment || "None"}</p>
            <div className="leave-actions">
              <button
                className="approve-button"
                onClick={() => approveLeave(leave._id)}
              >
                Approve
              </button>
              <button
                className="reject-button"
                onClick={() => rejectLeave(leave._id)}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetPendingLeaves;
