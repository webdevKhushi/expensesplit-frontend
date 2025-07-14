import React, { useEffect, useState } from "react";

const API = "https://expense-split-backend-1.onrender.com";

function RoomHistory({ token, roomId, reload }) {
  const [expenses, setExpenses] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchRoomExpenses = async () => {
      try {
        const res = await fetch(`${API}/api/room/${roomId}/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          // 🔍 Filter out dummy 0₹ entries like "joined the room"
          const filtered = (data.expenses || []).filter(
            (exp) => parseFloat(exp.amount) > 0
          );
          setExpenses(filtered);
          setMessage("");
        } else {
          setMessage(data.message || "Failed to fetch room history.");
        }
      } catch (err) {
        setMessage("Server error: " + err.message);
      }
    };

    if (roomId) fetchRoomExpenses();
  }, [token, roomId, reload]);

  return (
    <div className="centreBox">
      <h3 className="topHeading">Room Expense History</h3>
      {message && <p style={{ color: "red" }}>{message}</p>}

      <ul>
        {expenses.length === 0 && !message ? (
          <li className="Paragraph">No expenses yet. Creator will add them soon.</li>
        ) : (
          expenses.map((exp, index) => (
            <li key={index} className="Paragraph">
              <strong>{exp.username}</strong> added:{" "}
              <em>{exp.description}</em> — ₹{exp.amount}
              <br />
              Shared by {exp.people} people on{" "}
              {new Date(exp.created_at).toLocaleString()}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default RoomHistory;

