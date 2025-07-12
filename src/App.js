import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import History from "./components/History";
import CreateRoom from "./components/CreateRoom";
import JoinRoom from "./components/JoinRoom";
import RoomDashboard from "./components/RoomDashboard";
import Home from "./components/Home";
import Header from "./Addition/header";
import Footer from "./Addition/footer";
import "./App.css";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  useEffect(() => {
    console.log("🔑 Current token:", token);
  }, [token]);

  const saveToken = (tok) => {
    if (tok) {
      localStorage.setItem("token", tok);
      setToken(tok);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  return (
    <Router>
      <Header logout={logout} />

      <Routes>
        {/* Always show Home */}
        <Route path="/" element={<Home token={token} />} />

        {/* Public Routes */}
        <Route
          path="/login"
          element={token ? <Navigate to="/" /> : <Login saveToken={saveToken} />}
        />
        <Route
          path="/signup"
          element={token ? <Navigate to="/" /> : <Signup />}
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={token ? <Dashboard token={token} /> : <Navigate to="/login" />}
        />
        <Route
          path="/history"
          element={token ? <History token={token} /> : <Navigate to="/login" />}
        />
        <Route
          path="/createroom"
          element={token ? <CreateRoom token={token} /> : <Navigate to="/login" />}
        />
        <Route
          path="/join"
          element={token ? <JoinRoom token={token} /> : <Navigate to="/login" />}
        />
        <Route
          path="/join/:roomId"
          element={token ? <JoinRoom token={token} /> : <Navigate to="/login" />}
        />
        <Route
          path="/room/:roomId/dashboard"
          element={token ? <RoomDashboard token={token} /> : <Navigate to="/login" />}
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
