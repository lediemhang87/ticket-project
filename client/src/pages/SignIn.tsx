import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://ticketproj.onrender.com/signin", {
        email,
        password,
      });
      alert(response.data.message);
      setEmail("");
      setPassword("");
      checkAuthStatus();
      navigate("/dashboard");

    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get("https://ticketproj.onrender.com/logout");
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get("https://ticketproj.onrender.com/check-auth");
      setIsLoggedIn(true);
      console.log("User:", response.data.user);
    } catch (error) {
      console.error("Error:", error);
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

