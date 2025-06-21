import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/MyLeaves.css";

const AdminLeaves = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [editLeave, setEditLeave] = useState(null);
  const [updatedLeave, setUpdatedLeave] = useState({
    type: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    async function myLeaves() {
      try {
        const response = await axios.get(
          "http://localhost:5000/employee/my-leaves",
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );
        setLeaveData(response.data.data);
      } catch (error) {
        console.log(error.response?.data || error.message);
      }
    }
    myLeaves();
  }, []);

  const handleEditClick = (leave) => {
    setEditLeave(leave);
    setUpdatedLeave({
      type: leave.type,
      startDate: leave.startDate.slice(0, 10),
      endDate: leave.endDate.slice(0, 10),
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/employee/edit-leave`,
        { leaveID: editLeave._id, ...editLeave, ...updatedLeave },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      setEditLeave(null); // close modal
      window.location.reload(); // or re-fetch the data
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/employee/delete-leave/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setLeaveData(leaveData.filter((leave) => leave._id !== id));
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  return (
    <div>
      <div className="leaves-page-content">
        {leaveData.length === 0 ? (
          <h1>Data Loading...</h1>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaveData.map((leave, index) => (
                  <tr key={index}>
                    <td>{leave.type}</td>
                    <td>{leave.startDate.slice(0, 10)}</td>
                    <td>{leave.endDate.slice(0, 10)}</td>
                    <td>{leave.status}</td>
                    <td>
                      {leave.status === "pending" && (
                        <>
                          <button
                            className="edit-button"
                            onClick={() => handleEditClick(leave)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(leave._id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {editLeave && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Leave</h3>
            <label>
              Type:
              <select
                value={updatedLeave.type}
                onChange={(e) =>
                  setUpdatedLeave({ ...updatedLeave, type: e.target.value })
                }
              >
                <option value="casual">Casual</option>
                <option value="earned">Earned</option>
                <option value="wfh">WFH</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </label>
            <label>
              Start Date:
              <input
                type="date"
                value={updatedLeave.startDate}
                onChange={(e) =>
                  setUpdatedLeave({
                    ...updatedLeave,
                    startDate: e.target.value,
                  })
                }
              />
            </label>
            <label>
              End Date:
              <input
                type="date"
                value={updatedLeave.endDate}
                onChange={(e) =>
                  setUpdatedLeave({ ...updatedLeave, endDate: e.target.value })
                }
              />
            </label>
            <button className="save-btn" onClick={handleUpdate}>
              Save
            </button>
            <button className="cancel-btn" onClick={() => setEditLeave(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLeaves;
