import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/MyLeaves.css";

const MyLeaves = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [editLeave, setEditLeave] = useState(null);
  const [editMode, setEditMode] = useState(""); // "edit", "extend", "shorten"
  const [updatedLeave, setUpdatedLeave] = useState({
    type: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    async function fetchLeaves() {
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
        alert(error.response?.data.message || error.message);
      }
    }
    fetchLeaves();
  }, []);

  const openModal = (leave, mode) => {
    setEditLeave(leave);
    setEditMode(mode);
    setUpdatedLeave({
      type: leave.type,
      startDate: leave.startDate.slice(0, 10),
      endDate: leave.endDate.slice(0, 10),
    });
  };

  const handleEditUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/employee/edit-leave`,
        {
          leaveID: editLeave._id,
          ...updatedLeave,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      closeModalAndRefresh();
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert(error.response?.data.message || error.message);
    }
  };

  const handleExtendUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/employee/extend-leave`,
        {
          leaveID: editLeave._id,
          endDate: updatedLeave.endDate,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      closeModalAndRefresh();
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert(error.response?.data.message || error.message);
    }
  };

  const handleShortenUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/employee/shorten-leave`,
        {
          leaveID: editLeave._id,
          endDate: updatedLeave.endDate,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      closeModalAndRefresh();
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert(error.response?.data.message || error.message);
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
      alert(error.response?.data.message || error.message);
    }
  };

  const closeModalAndRefresh = () => {
    setEditLeave(null);
    setEditMode("");
    window.location.reload();
  };

  const renderModal = () => {
    if (!editLeave) return null;

    const isEdit = editMode === "edit";
    const isExtend = editMode === "extend";
    const isShorten = editMode === "shorten";

    let title = "";
    let onSubmit;
    if (isEdit) {
      title = "Edit Leave";
      onSubmit = handleEditUpdate;
    } else if (isExtend) {
      title = "Extend Leave";
      onSubmit = handleExtendUpdate;
    } else if (isShorten) {
      title = "Shorten Leave";
      onSubmit = handleShortenUpdate;
    }

    return (
      <div className="modal">
        <div className="modal-content">
          <h3>{title}</h3>
          <label>
            Type:
            <select
              value={updatedLeave.type}
              onChange={(e) =>
                setUpdatedLeave({ ...updatedLeave, type: e.target.value })
              }
              disabled={!isEdit}
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
                setUpdatedLeave({ ...updatedLeave, startDate: e.target.value })
              }
              disabled={!isEdit}
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
          <button className="save-btn" onClick={onSubmit}>
            Save
          </button>
          <button className="cancel-btn" onClick={closeModalAndRefresh}>
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const canEdit = (status) => status === "pending";
  const canDelete = (status) => status === "pending";
  const canExtendOrShorten = (status) =>
    ["approved", "shorten_approved", "extended_approved"].includes(status);

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
                      {canEdit(leave.status) && (
                        <button
                          className="edit-button"
                          onClick={() => openModal(leave, "edit")}
                        >
                          Edit
                        </button>
                      )}
                      {canDelete(leave.status) && (
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(leave._id)}
                        >
                          Delete
                        </button>
                      )}
                      {canExtendOrShorten(leave.status) && (
                        <>
                          <button
                            className="extend-btn"
                            onClick={() => openModal(leave, "extend")}
                          >
                            Extend Leave
                          </button>
                          <button
                            className="shorten-btn"
                            onClick={() => openModal(leave, "shorten")}
                          >
                            Shorten Leave
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
      {renderModal()}
    </div>
  );
};

export default MyLeaves;
