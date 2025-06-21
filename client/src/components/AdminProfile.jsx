import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/Profile.css";

const AdminProfile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    profilePicture: "",
  });

  async function fetchProfile() {
    try {
      const res = await axios.get(
        "http://localhost:5000/auth/current-user-details",
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      setUser(res.data.employee);
      setFormData({
        name: res.data.employee.name,
        phone: res.data.employee.phone || "",
        address: res.data.employee.address || "",
        profilePicture: res.data.employee.profilePicture || "",
      });
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        "http://localhost:5000/auth/edit-user-details",
        formData,
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>{user.name}</h2>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Phone:</strong> {user.phone || "N/A"}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
        <p>
          <strong>Address:</strong> {user.address || "N/A"}
        </p>
        <button className="edit-btn" onClick={() => setEditMode(true)}>
          Edit Info
        </button>
      </div>

      {editMode && (
        <div className="popup-form">
          <form onSubmit={handleSubmit} className="edit-form">
            <input
              name="name"
              value={formData.name}
              onChange={handleInput}
              placeholder="Name"
            />
            <input
              name="phone"
              value={formData.phone}
              onChange={handleInput}
              placeholder="Phone"
            />
            <input
              name="address"
              value={formData.address}
              onChange={handleInput}
              placeholder="Address"
            />
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditMode(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
