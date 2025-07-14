// import React, { useEffect, useState, useCallback } from "react";

// const API = "https://expense-split-backend-1.onrender.com";

// function History({ token }) {
//   const [history, setHistory] = useState([]);
//   const [message, setMessage] = useState("");

//   const fetchHistory = useCallback(async () => {
//     try {
//       const res = await fetch(`${API}/api/history`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (res.ok) {
//         const data = await res.json();
//         setHistory(data);
//         setMessage("");
//       } else {
//         setMessage(" Failed to fetch history.");
//       }
//     } catch (err) {
//       setMessage(" Server error: " + err.message);
//     }
//   }, [token]);

//   useEffect(() => {
//     fetchHistory();
//   }, [fetchHistory]);

//   return (
//     <div>
//       <h3 className="topHeading">Expense History</h3>
//       {message && <p style={{ color: "red" }}>{message}</p>}

//       <li>
//         {history.length === 0 ? (
//           <li className="Paragraph">No expenses yet.</li>
//         ) : (
//           history.map((expense) => (
//             <li className="Paragraph" key={expense.id}>
//               {expense.description || "Unnamed"} — ₹{expense.amount} split among {expense.people} people
//             </li>
//           ))
//         )}
//       </li>
//     </div>
//   );
// }

// export default History;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API = "https://expense-split-backend-1.onrender.com";

function RoomHistory({ token }) {
  const { roomId } = useParams(); // ⬅️ Extract roomId from URL
  const [expenses, setExpenses] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!roomId) {
      setMessage("Room ID is missing.");
      return;
    }

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

    fetchRoomExpenses();
  }, [roomId, token]);

  return (
    <div className="centreBox">
      <h3 className="topHeading">Room Expense History</h3>
      {message && <p style={{ color: "red" }}>{message}</p>}

      <ul>
        {expenses.length === 0 && !message ? (
          <li className="Paragraph">No expenses recorded yet.</li>
        ) : (
          expenses.map((exp, index) => (
            <li key={index} className="Paragraph">
              <strong>{exp.username}</strong> added: <em>{exp.description}</em> — Rs.{exp.amount}
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


