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

import React, { useEffect, useState, useRef } from "react";

function RoomDashboard({ token }) {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [participants, setParticipants] = useState([]);
  const descRef = useRef(null);

  const API = "https://expense-split-backend-1.onrender.com";
  const roomId = window.location.pathname.split("/")[2];

  // Fetch participants and history on load
  useEffect(() => {
    descRef.current?.focus();

    const fetchRoomData = async () => {
      try {
        const res = await fetch(`${API}/api/room/${roomId}/details`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Error fetching room details:", errorText);
          setMessage("Failed to load room data.");
          return;
        }

        const data = await res.json();
        setParticipants(data.participants || []);

      } catch (err) {
        console.error("Room data fetch error:", err);
        setMessage("Server error while loading room data.");
      }
    };

    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API}/api/room/${roomId}/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Failed history response:", errorText);
          setMessage("Failed to load history.");
          return;
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error("Unexpected history format:", data);
          setMessage("Unexpected response from server.");
          return;
        }

        setHistory(data);
      } catch (err) {
        console.error("History fetch error:", err);
        setMessage("Server error while loading history.");
      }
    };

    fetchRoomData();
    fetchHistory();
  }, [roomId, token]);

  const handleAddExpense = async () => {
    const trimmedDesc = desc.trim();
    const parsedAmount = parseFloat(amount);

    if (!trimmedDesc || isNaN(parsedAmount) || parsedAmount <= 0) {
      setMessage("Please enter a valid description and amount.");
      return;
    }

    if (participants.length === 0) {
      setMessage("No users found in the room to split with.");
      return;
    }

    try {
      const response = await fetch(`${API}/api/room/${roomId}/expense`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ desc: trimmedDesc, amount: parsedAmount }),
      });

      if (response.ok) {
        setMessage("Expense added successfully!");
        setDesc("");
        setAmount("");

        // Re-fetch history
        const res = await fetch(`${API}/api/room/${roomId}/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setHistory(data);
      } else {
        const errorText = await response.text();
        console.error("Add expense failed:", errorText);
        setMessage("Failed to add expense.");
      }
    } catch (err) {
      console.error("Add expense error:", err);
      setMessage("Server error while adding expense.");
    }
  };

  const splitAmount =
    parseFloat(amount) > 0 && participants.length > 0
      ? (parseFloat(amount) / participants.length).toFixed(2)
      : null;

  return (
    <div className="centreBox">
      <h2 className="topHeading">Room Dashboard</h2>
      <p className="Paragraph">
        <strong>Room ID:</strong> {roomId}
      </p>
      <p className="Paragraph">
        <strong>Participants:</strong>{" "}
        {participants.length > 0
          ? participants.map((p) => p.name || p.email || "User").join(", ")
          : "No participants yet"}
      </p>

      {/* Expense Inputs */}
      <input
        ref={descRef}
        className="input"
        type="text"
        placeholder="Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <input
        type="number"
        className="input"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button className="button" onClick={handleAddExpense}>
        Add Expense
      </button>

      {message && <p>{message}</p>}

      {/* Split Info */}
      {splitAmount && (
        <p className="Paragraph">
          <strong>Each person should pay:</strong> Rs.{splitAmount}
        </p>
      )}

      {/* History */}
      <h3 className="yellowHeading">Expense History</h3>
      {history.length === 0 ? (
        <p className="Paragraph">No expenses yet.</p>
      ) : (
        <ul>
          {history.map((item, idx) => (
            <li key={idx}>
              <strong>{item.description || "No description"}</strong> – Rs.
              {item.amount} split among {item.people || participants.length}{" "}
              people
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RoomDashboard;
