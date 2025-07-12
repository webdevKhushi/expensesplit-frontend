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
      <h3 className="topHeading">Your Room-wise Expenses</h3>
      {message && <p style={{ color: "red" }}>{message}</p>}

      <ol>
        {history.length === 0 ? (
          <li className="Paragraph">No room expenses yet.</li>
        ) : (
          history.map((entry) => (
            <li className="Paragraph" key={entry.room_id}>
               You spent <strong>Rs.{entry.total_spent}</strong> in room "<strong>{entry.room_name}</strong>"
            </li>
          ))
        )}
      </ol>
    </div>
  );
}

export default History;
