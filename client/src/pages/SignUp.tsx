import React, { useState, FormEvent } from "react";

const SignUp: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await fetch("https://ticketproj.onrender.com/register", {
        method: "POST",
        body: JSON.stringify({ name, email }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await result.json();
      console.warn(data);
      if (result.ok) {
        alert("Data saved successfully");
        setEmail("");
        setName("");
      } else {
        alert("Failed to save data");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <>
      <h1>This is React WebApp</h1>
      <form onSubmit={handleOnSubmit}>
        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">submit</button>
      </form>
    </>
  );
};

export default SignUp;
