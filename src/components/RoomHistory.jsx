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
          setExpenses(data.expenses || []);
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
    <div>
      <h3 className="topHeading">Room Expense History</h3>
      {message && <p style={{ color: "red" }}>{message}</p>}

      <ul>
        {expenses.length === 0 && !message ? (
          <li className="Paragraph">No expenses recorded yet.</li>
        ) : (
          expenses.map((exp, index) => (
            <li key={index} className="Paragraph">
              <strong>{exp.username}</strong> added:{" "}
              <em>{exp.description}</em> — Rs.{exp.amount}
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
