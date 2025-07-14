import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RoomHistory from "./RoomHistory";

const API = "https://expense-split-backend-1.onrender.com";

function RoomDashboard({ token }) {
  const { roomId } = useParams();
  const [participants, setParticipants] = useState([]);
  const [creator, setCreator] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [reload, setReload] = useState(false);

  // Decode current user from token
  useEffect(() => {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setCurrentUser(payload.username);
    }
  }, [token]);

  // Fetch room details
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const res = await fetch(`${API}/api/room/${roomId}/details`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          setParticipants(data.participants);
          setCreator(data.created_by);
        } else {
          setMessage("Failed to load room details.");
        }
      } catch (err) {
        setMessage("Server error: " + err.message);
      }
    };

    fetchRoomDetails();
  }, [roomId, token]);

  // Handle expense submission (creator only)
  const handleAddExpense = async () => {
    if (!desc || !amount) {
      setMessage("Please enter description and amount.");
      return;
    }

    try {
      const res = await fetch(`${API}/api/room/${roomId}/expense`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ desc, amount }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Expense added successfully!");
        setDesc("");
        setAmount("");
        setReload(prev => !prev); // Refresh RoomHistory
      } else {
        setMessage(data.message || "Failed to add expense.");
      }
    } catch (err) {
      setMessage("Server error: " + err.message);
    }
  };

  return (
    <div className="centreBox">
      <h2 className="topHeading">Room Dashboard (ID: {roomId})</h2>

      <p><strong>Created By:</strong> {creator}</p>
      <p><strong>Total Participants:</strong> {participants.length}</p>

      <ul>
        {participants.map((p, idx) => (
          <li key={idx} className="Paragraph">{p.name}</li>
        ))}
      </ul>

      {creator === currentUser ? (
        <div className="add-expense">
          <h3>Add Expense (Only Creator)</h3>
          <input
            type="text"
            className="input"
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <input
            type="number"
            className="input"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button className="button" onClick={handleAddExpense}>
            Add Expense
          </button>
        </div>
      ) : (
        <p><strong>Only the room creator can add expenses.</strong></p>
      )}

      {message && (
        <p style={{ color: message.includes("success") ? "green" : "red" }}>
          {message}
        </p>
      )}

      {/* Shared Room Expense History for all participants */}
      <RoomHistory token={token} roomId={roomId} reload={reload} />
    </div>
  );
}

export default RoomDashboard;
