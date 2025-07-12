import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Lottie from "lottie-react";
import loginAnimation from "../animations/login.json"; 

function Login({ saveToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (data.success) {
        saveToken(data.token);
        navigate("/");
      } else {
        setMessage(data.message || "Invalid username or password");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setMessage("Login failed due to network error");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ width: 400, margin: "auto" }}>
        <Lottie animationData={loginAnimation} loop={true} />
      </div>
      <h2 className="topHeading">Login</h2>
      <form className="centreBox" onSubmit={handleSubmit}>
        <input
          type="text"
          className="input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          className="input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button className="button" type="submit">Login</button>
      </form>
      <p>{message}</p>
      <p className="Paragraph">
        Don't have an account? <Link to="/signup">Signup here</Link>
      </p>
    </div>
  );
}

export default Login;
