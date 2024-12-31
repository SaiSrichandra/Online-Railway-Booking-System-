// import React, { useState } from "react"; // Import React and useState for state management
// import axios from "axios"; // Import axios for API calls
// import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

// const Login = () => {
//   const [username, setUsername] = useState(""); // State for username
//   const [password, setPassword] = useState(""); // State for password
//   const [error, setError] = useState(""); // State for error messages
//   const navigate = useNavigate(); // Hook for navigation

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("http://localhost:3000/api/login", {
//         username,
//         password,
//       });

//       const { token, role, id } = response.data;

//       // Store token and role in localStorage
//       localStorage.setItem("token", token);
//       localStorage.setItem("role", role.toLowerCase());

//       // Redirect based on role
//       if (role.toLowerCase() === "admin") {
//         navigate("/admin-dashboard");
//       } else if (role.toLowerCase() === "staff") {
//         navigate("/representative-dashboard");
//       } else if (role.toLowerCase() === "customer") {
//         localStorage.setItem('customerId', id);
//         navigate("/customer-dashboard");
//       } else {
//         setError("Unknown role. Please contact support.");
//       }
//     } catch (err) {
//       setError(err.response?.data?.error || "Login failed. Try again.");
//     }
//   };

//   return (
//     <div className="login-container">
//       <h2>Login</h2>
//       <form onSubmit={handleLogin}>
//         <input
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button type="submit">Login</button>
//         {error && <p className="error">{error}</p>}
//       </form>
//     </div>
//   );
// };

// export default Login;

// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "../styles/Login.css"; // Import the CSS file here

// const Login = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("http://localhost:3000/api/login", {
//         username,
//         password,
//       });

//       const { token, role, id } = response.data;

//       localStorage.setItem("token", token);
//       localStorage.setItem("role", role.toLowerCase());

//       if (role.toLowerCase() === "admin") {
//         navigate("/admin-dashboard");
//       } else if (role.toLowerCase() === "staff") {
//         navigate("/representative-dashboard");
//       } else if (role.toLowerCase() === "customer") {
//         localStorage.setItem('customerId', id);
//         navigate("/customer-dashboard");
//       } else {
//         setError("Unknown role. Please contact support.");
//       }
//     } catch (err) {
//       setError(err.response?.data?.error || "Login failed. Try again.");
//     }
//   };

//   return (
//     <div className="login-container">
//       <h2>Login</h2>
//       <form onSubmit={handleLogin}>
//         <input
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button type="submit">Login</button>
//         {error && <p className="error">{error}</p>}
//       </form>
//     </div>
//   );
// };

// export default Login;

// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "../styles/Login.css"; // Import CSS file
// import backgroundImage from "../assets/Railway-Reservation-System.jpg"; // Import the image

// const Login = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("http://localhost:3000/api/login", {
//         username,
//         password,
//       });

//       const { token, role, id } = response.data;

//       localStorage.setItem("token", token);
//       localStorage.setItem("role", role.toLowerCase());

//       if (role.toLowerCase() === "admin") {
//         navigate("/admin-dashboard");
//       } else if (role.toLowerCase() === "staff") {
//         navigate("/representative-dashboard");
//       } else if (role.toLowerCase() === "customer") {
//         localStorage.setItem("customerId", id);
//         navigate("/customer-dashboard");
//       } else {
//         setError("Unknown role. Please contact support.");
//       }
//     } catch (err) {
//       setError(err.response?.data?.error || "Login failed. Try again.");
//     }
//   };

//   return (
//     <div
//       className="login-container"
//       style={{ backgroundImage: `url(${backgroundImage})` }}
//     >
//       <form onSubmit={handleLogin}>
//         <h2>Login</h2>
//         <input
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button type="submit">Login</button>
//         {error && <p className="error">{error}</p>}
//       </form>
//     </div>
//   );
// };

// export default Login;

// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// // import "../styles/Login.css"; // Import CSS file
// import backgroundImage from "../assets/Railway-Reservation-System.jpg"; // Import the image

// const Login = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("http://localhost:3000/api/login", {
//         username,
//         password,
//       });

//       const { token, role, id } = response.data;

//       localStorage.setItem("token", token);
//       localStorage.setItem("role", role.toLowerCase());

//       if (role.toLowerCase() === "admin") {
//         navigate("/admin-dashboard");
//       } else if (role.toLowerCase() === "staff") {
//         navigate("/representative-dashboard");
//       } else if (role.toLowerCase() === "customer") {
//         localStorage.setItem("customerId", id);
//         navigate("/customer-dashboard");
//       } else {
//         setError("Unknown role. Please contact support.");
//       }
//     } catch (err) {
//       setError(err.response?.data?.error || "Login failed. Try again.");
//     }
//   };

//   return (
//     <div
//       className="login-container"
//       // style={{ backgroundImage: `url(${backgroundImage})` }}
//     >
//       {/* Heading */}
//       <h1 className="page-title">Railway Reservation System</h1>

//       <form onSubmit={handleLogin}>
//         <h2>Login</h2>
//         <input
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button type="submit">Login</button>
//         {error && <p className="error">{error}</p>}
//       </form>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css"; // Import CSS file

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/login", {
        username,
        password,
      });

      const { token, role, id } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role.toLowerCase());

      if (role.toLowerCase() === "admin") {
        navigate("/admin-dashboard");
      } else if (role.toLowerCase() === "staff") {
        navigate("/representative-dashboard");
      } else if (role.toLowerCase() === "customer") {
        localStorage.setItem("customerId", id);
        navigate("/customer-dashboard");
      } else {
        setError("Unknown role. Please contact support.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Try again.");
    }
  };

  return (
    <div className="login-container">
      {/* Heading */}
      <h1 className="page-title">Railway Reservation System</h1>

      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
        <Link to="/" className="home-link">
          Go to Homepage
        </Link>
        <Link to="/signup" className="signup-link">
          Don't have an account? Sign up
        </Link>
      </form>
    </div>
  );
};

export default Login;
