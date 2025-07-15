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

      if (!res.ok) {
        setMessage("Failed to fetch history.");
        return;
      }

      const data = await res.json();
      const filtered = (data || []).filter((exp) => parseFloat(exp.amount) > 0);

      if (filtered.length === 0) {
        setMessage("No expenses yet.");
      } else {
        setHistory(filtered);
        setMessage("");
      }
    } catch (err) {
      console.error("Error fetching personal history:", err);
      setMessage("Server error: " + err.message);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchHistory();
  }, [fetchHistory, token]);

  return (
    <div className="centreBox">
      <h3 className="topHeading">Your Expense History</h3>
      {message && <p style={{ color: "red" }}>{message}</p>}

      {history.length > 0 && (
        <ul>
          {history.map((expense, index) => {
            const perPerson = (parseFloat(expense.amount) / expense.people).toFixed(2);
            const dateStr = new Date(expense.created_at).toLocaleString();

            return (
              <li className="Paragraph" key={index}>
                You spent ₹{expense.amount} on <strong>{expense.description}</strong> 
                {expense.room_name ? (
                  <> in room <strong>{expense.room_name}</strong></>
                ) : (
                  <> personally</>
                )}
                , shared with {expense.people} {expense.people === 1 ? "person" : "people"}
                <br />
                on {dateStr}
                <br />
                Each person should pay: ₹{perPerson}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default History;
