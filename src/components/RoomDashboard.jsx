import React, { useEffect, useState, useRef } from "react";

function RoomDashboard({ token }) {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [users, setUsers] = useState([]);
  const descRef = useRef(null);

  const API = "https://expense-split-backend-1.onrender.com";
  const roomId = window.location.pathname.split("/")[2];

  useEffect(() => {
    descRef.current?.focus();

    // Fetch room expense history
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API}/api/room/${roomId}/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        setMessage("Failed to load history.");
      }
    };

    // Fetch room users
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API}/api/room/${roomId}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUsers(data); // assuming it's an array of users
      } catch (err) {
        setMessage("Failed to load users.");
      }
    };

    fetchHistory();
    fetchUsers();
  }, [roomId, token]);

  const numberOfPeople = users.length;
  const splitAmount =
    parseFloat(amount) > 0 && numberOfPeople > 0
      ? (parseFloat(amount) / numberOfPeople).toFixed(2)
      : null;

  const handleAddExpense = async () => {
    const trimmedDesc = desc.trim();
    const parsedAmount = parseFloat(amount);

    if (!trimmedDesc || isNaN(parsedAmount) || parsedAmount <= 0 || numberOfPeople <= 0) {
      setMessage("Please enter a valid description and amount.");
      return;
    }

    try {
      const response = await fetch(`${API}/api/room/${roomId}/expense`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          desc: trimmedDesc,
          amount: parsedAmount
        }),
      });

      if (response.ok) {
        setMessage("Expense added successfully!");
        setDesc("");
        setAmount("");

        // Refresh history and users
        const res = await fetch(`${API}/api/room/${roomId}/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setHistory(data);
      } else {
        setMessage("Failed to add expense.");
      }
    } catch (err) {
      setMessage("Server error: " + err.message);
    }
  };

  return (
    <div className="centreBox">
      <h2 className="topHeading">Room Dashboard</h2>
      <p className="Paragraph"><strong>Room ID:</strong> {roomId}</p>

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
      <button className="button" onClick={handleAddExpense}>Add Expense</button>

      {message && <p>{message}</p>}

      {/* Split Result */}
      {splitAmount && (
        <p className="Paragraph">
          <strong>Each person should pay:</strong> Rs.{splitAmount}
        </p>
      )}

      {/* Expense History */}
      <h3 className="yellowHeading">Expense History</h3>
      {history.length === 0 ? (
        <p className="Paragraph">No expenses yet.</p>
      ) : (
        <ul>
          {history.map((item, idx) => (
            <li key={idx}>
              <strong>{item.description}</strong> – Rs.{item.amount} split among {item.people} people
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RoomDashboard;
