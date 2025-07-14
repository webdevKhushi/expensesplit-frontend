import React, { useEffect, useState, useCallback } from "react";

const API = "https://expense-split-backend-1.onrender.com";

function History({ token }) {
  const [roomHistory, setRoomHistory] = useState([]);
  const [personalHistory, setPersonalHistory] = useState([]);
  const [message, setMessage] = useState("");

  const fetchHistory = useCallback(async () => {
    try {
      const [roomRes, personalRes] = await Promise.all([
        fetch(`${API}/api/history`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API}/api/expense/personal`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const roomData = roomRes.ok ? await roomRes.json() : [];
      const personalData = personalRes.ok ? await personalRes.json() : [];

      setRoomHistory(roomData || []);
      setPersonalHistory(personalData || []);
      setMessage("");
    } catch (err) {
      setMessage("Server error: " + err.message);
    }
  }, [token]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="centreBox">
      <h3 className="topHeading">Your Expense History</h3>
      {message && <p style={{ color: "red" }}>{message}</p>}

      <h4>Room-Based History</h4>
      <ul>
        {roomHistory.length === 0 ? (
          <li className="Paragraph">No room expenses yet.</li>
        ) : (
          roomHistory.map((expense, index) => (
            <li className="Paragraph" key={index}>
              {expense.room_name} — ₹{expense.total_spent} split among {expense.participant_count} people
            </li>
          ))
        )}
      </ul>

      <h4>Personal Expenses</h4>
      <ul>
        {personalHistory.length === 0 ? (
          <li className="Paragraph">No personal expenses yet.</li>
        ) : (
          personalHistory.map((exp, index) => (
            <li key={index} className="Paragraph">
              {exp.description} — ₹{exp.amount} shared with {exp.people} people on{" "}
              {new Date(exp.created_at).toLocaleString()}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default History;
