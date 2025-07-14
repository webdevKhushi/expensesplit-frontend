import React, { useEffect, useState, useCallback } from "react";

const API = "https://expense-split-backend-1.onrender.com";

function History({ token }) {
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/expense/personal`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setHistory(data); // Assuming your backend sends an array directly
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
              <strong>{expense.description}</strong> — ₹{expense.amount} split among {expense.people} people <br />
              <span style={{ fontSize: "0.8em" }}>
                on {new Date(expense.created_at).toLocaleString()}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default History;
