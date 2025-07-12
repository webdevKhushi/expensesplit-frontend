// src/components/RoomDashboard.js

import React, { useEffect, useState, useRef } from "react";

function RoomDashboard({ token }) {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [people, setPeople] = useState("");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const descRef = useRef(null);

  const API = import.meta.env.VITE_API_URL;
  const roomId = window.location.pathname.split("/")[2]; // extract :roomId

  useEffect(() => {
    descRef.current?.focus();

    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API}/api/room/${roomId}/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        setMessage(" Failed to load history.");
      }
    };

    fetchHistory();
  }, [roomId, token]);

  const handleAddExpense = async () => {
    const trimmedDesc = desc.trim();
    const parsedAmount = parseFloat(amount);
    const parsedPeople = parseInt(people);

    if (!trimmedDesc || isNaN(parsedAmount) || isNaN(parsedPeople) || parsedAmount <= 0 || parsedPeople <= 0) {
      setMessage("Please enter valid values.");
      return;
    }

    try {
      const response = await fetch(`${API}/api/room/${roomId}/expense`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ desc: trimmedDesc, amount: parsedAmount, people: parsedPeople }),
      });

      if (response.ok) {
        setMessage(" Expense added successfully!");
        setDesc("");
        setAmount("");
        setPeople("");

        // ✅ Re-fetch updated history
        const res = await fetch(`${API}/api/room/${roomId}/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setHistory(data);
      } else {
        setMessage(" Failed to add expense.");
      }
    } catch (err) {
      setMessage("Server error: " + err.message);
    }
  };

  const splitAmount =
    parseFloat(amount) > 0 && parseInt(people) > 0
      ? (parseFloat(amount) / parseInt(people)).toFixed(2)
      : null;

  return (
    <div className="centreBox">
      <h2 className="topHeading">Room Dashboard</h2>
      <p className="Paragraph"><strong>Room ID:</strong> {roomId}</p>

      {/* Expense Input */}
      <input
        ref={descRef}
        className="input"
        type="text"
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
      <input
        type="number"
        className="input"
        placeholder="Number of people"
        value={people}
        onChange={(e) => setPeople(e.target.value)}
      />
      <button className="button" onClick={handleAddExpense}>Add Expense</button>

      {message && <p>{message}</p>}

      {/* Split Result */}
      {splitAmount && (
        <p className="Paragraph"><strong>Each person should pay:</strong> ₹{splitAmount}</p>
      )}

      {/* History */}
      <h3 className="yellowHeading">Expense History</h3>
      {history.length === 0 ? (
        <p className="Paragraph">No expenses yet.</p>
      ) : (
        <ul>
          {history.map((item, idx) => (
            <li key={idx}>
              <strong>{item.description}</strong> – ₹{item.amount} for {item.people} people
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RoomDashboard;
