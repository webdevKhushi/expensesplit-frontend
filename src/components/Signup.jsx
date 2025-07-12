import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import signUpAnimation from "../animations/signup.json";

const API = import.meta.env.VITE_API_URL;

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch(`${API}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Signup successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage(data.message || "Signup failed");
      }
    } catch {
      setMessage("Signup failed due to network error");
    }
  };

  return (
    <div>
      <div style={{ width: 300, margin: "auto" }}>
        <Lottie animationData={signUpAnimation} loop={true} />
      </div>
      <h2 className="topHeading">Signup</h2>
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
        <button className="button" type="submit">Signup</button>
      </form>
      <p>{message}</p>
      <p className="Paragraph">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Signup;
