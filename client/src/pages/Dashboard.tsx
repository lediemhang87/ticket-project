import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  date: string;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get<{ user: User }>(
          "https://ticketproj.onrender.com/user",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setUser(response.data.user);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/logout");
      localStorage.removeItem("accessToken");
      setUser(null); // Clear the user information on logout
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome to the Dashboard, {user.firstName}!</h1>
          <p>Email: {user.email}</p>
          <p>Phone Number: {user.phoneNumber}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <div> Please log in </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
