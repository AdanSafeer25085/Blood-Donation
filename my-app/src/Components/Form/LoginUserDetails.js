import { useState } from 'react';
import Dashboard from '../Dashboard/Dashboard';
import { updateProfile } from '../../services/auth.service';

function UserDetails({ user, onLogout }) {
  const [location, setLocation] = useState(user.location);
  const [mobileNumber, setMobileNumber] = useState(user.mobileNumber);
  const [message, setMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  const handleUpdate = async () => {
    if (!location.trim() || !mobileNumber.trim()) {
      setMessage("Location and mobile number cannot be empty.");
      setMessageType("error");
      return;
    }

    if (!/^(\+92|0)?3[0-9]{9}$/.test(mobileNumber.replace(/\s/g, ""))) {
      setMessage("Please enter a valid Pakistani mobile number (e.g., 03001234567)");
      setMessageType("error");
      return;
    }

    setIsUpdating(true);
    setMessage("");

    try {
      await updateProfile(user.id, { location, mobileNumber });
      setMessage("User details updated successfully!");
      setMessageType("success");
    } catch (error) {
      setMessage(error.message || "Failed to update user details.");
      setMessageType("error");
    } finally {
      setIsUpdating(false);
    }
  };

  return <Dashboard user={user} onLogout={onLogout} />;
}

export default UserDetails;