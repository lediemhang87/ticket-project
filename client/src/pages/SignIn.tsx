import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
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

export default App;


// import React, { useState, FormEvent } from "react";

// const SignIn: React.FC = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       const result = await fetch("https://ticketproj.onrender.com/signin", {
//         method: "POST",
//         body: JSON.stringify({ email, password }),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       const data = await result.json();
//       console.warn(data);
//       if (result.ok) {
//         alert(data.message); 
//         setEmail("");
//         setPassword("");
//       } else {
//         alert(data.message); 
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Something went wrong");
//     }
//   };

//   return (
//     <>
//       <h1>Sign In</h1>
//       <form onSubmit={handleSignIn}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <button type="submit">Sign In</button>
//       </form>
//     </>
//   );
// };

// export default SignIn;


