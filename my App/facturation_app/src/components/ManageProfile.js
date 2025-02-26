import React, { useState } from "react";
import axios from "axios";

const ManageProfile = ({ user }) => {
  const [oldEmail, setOldEmail] = useState(user.email); // Old email for identification
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.put("http://localhost:5000/api/admin", {
        oldEmail, // Old email to identify the user
        newEmail: newEmail || oldEmail, // Use new email if provided, otherwise keep the old one
        newPassword, // New password
      });

      if (response.data.message) {
        setMessage("Profile updated successfully!");
      }
    } catch (error) {
      setMessage(error.response?.data?.error || "Error updating profile.");
      console.error("Error updating profile:", error.response?.data || error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Manage Profile</h2>
      <form onSubmit={handleSubmit}>
        {/* Old Email Input */}
        <div className="mb-3">
          <label htmlFor="oldEmail" className="form-label">Old Email</label>
          <input
            type="email"
            className="form-control"
            id="oldEmail"
            value={oldEmail}
            onChange={(e) => setOldEmail(e.target.value)}
            required
          />
        </div>

        {/* New Email Input */}
        <div className="mb-3">
          <label htmlFor="newEmail" className="form-label">New Email (optional)</label>
          <input
            type="email"
            className="form-control"
            id="newEmail"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </div>

        {/* New Password Input */}
        <div className="mb-3">
          <label htmlFor="newPassword" className="form-label">New Password</label>
          <input
            type="password"
            className="form-control"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        {/* Confirm Password Input */}
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {/* Message Display */}
        {message && <div className="alert alert-warning">{message}</div>}

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary">Update Profile</button>
      </form>
    </div>
  );
};

export default ManageProfile;