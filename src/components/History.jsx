import React, { useEffect, useState, useCallback } from "react";

const API = "https://expense-split-backend-1.onrender.com";

function History({ token }) {
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setHistory(data);
        setMessage("");
      } else {
        setMessage("Failed to fetch history.");
      }
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

      <ul>
        {history.length === 0 ? (
          <li className="Paragraph">No expenses yet.</li>
        ) : (
          history.map((expense, index) => (
            <li className="Paragraph" key={index}>
              🧾 {expense.room_name || "Personal"} — ₹{expense.total_spent} split among {expense.participant_count} people
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default History;


