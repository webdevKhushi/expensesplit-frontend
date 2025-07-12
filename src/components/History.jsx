// src/components/History.js

import React, { useEffect, useState, useCallback } from "react";

function History({ token }) {
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3000/api/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setHistory(data);
        setMessage("");
      } else {
        setMessage(" Failed to fetch history.");
      }
    } catch (err) {
      setMessage(" Server error: " + err.message);
    }
  }, [token]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div>
      <h3 className="topHeading">Expense History</h3>
      {message && <p style={{ color: "red" }}>{message}</p>}

      <li>
        {history.length === 0 ? (
          <li className="Paragraph">No expenses yet.</li>
        ) : (
          history.map((expense) => (
            <li className="Paragraph" key={expense.id}>
              {expense.description || "Unnamed"} — ₹{expense.amount} split among {expense.people} people
            </li>
          ))
        )}
      </li>
    </div>
  );
}

export default History;
