import React, { useState, FormEvent } from "react";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await fetch("https://ticketproj.onrender.com/signin", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await result.json();
      console.warn(data);
      if (result.ok) {
        alert(data.message); // Use data.message to show the success/error message
        setEmail("");
        setPassword("");
      } else {
        alert(data.message); // Use data.message to show the success/error message
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <>
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
    </>
  );
};

export default SignIn;
