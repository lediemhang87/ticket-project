import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://ticketproj.onrender.com/signin", {
        email,
        password,
      });
      if (response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        setIsLoggedIn(true);
        navigate("/dashboard");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
  };

  const checkAuthStatus = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      try {
        const response = await axios.get("http://localhost:5000/check-auth", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setIsLoggedIn(true);
        console.log("User:", response.data.user);
      } catch (error) {
        console.error("Error:", error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  };

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <h1>Welcome! You are logged in.</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h1>Sign In</h1>
          <form onSubmit={handleSignIn}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Sign In</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SignIn;
