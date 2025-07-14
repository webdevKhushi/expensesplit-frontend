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
        const filtered = (data || []).filter((exp) => parseFloat(exp.amount) > 0);
        setHistory(filtered);
        setMessage(filtered.length === 0 ? "No expenses yet." : "");
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
        {history.map((expense, index) => {
          const perPerson = (parseFloat(expense.amount) / expense.people).toFixed(2);
          const dateStr = new Date(expense.created_at).toLocaleString();

          return (
            <ol>
            <li className="Paragraph" key={index}>
               You spent ₹{expense.amount} on <strong>{expense.description}</strong>, shared with {expense.people} people<br />
               on {dateStr} <br />
               Each person should pay: ₹{perPerson}
            </li>
            </ol>
          );
        })}
      </ul>
    </div>
  );
}

export default History;
