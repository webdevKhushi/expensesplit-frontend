// import React, { useEffect, useState, useRef } from "react";

// function RoomDashboard({ token }) {
//   const [desc, setDesc] = useState("");
//   const [amount, setAmount] = useState("");
//   const [message, setMessage] = useState("");
//   const [participants, setParticipants] = useState([]);
//   const descRef = useRef(null);

//   const API = "https://expense-split-backend-1.onrender.com";
//   const roomId = window.location.pathname.split("/")[2];

//   useEffect(() => {
//     descRef.current?.focus();

//     const fetchRoomData = async () => {
//       try {
//         const res = await fetch(`${API}/api/room/${roomId}/details`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!res.ok) {
//           const errorText = await res.text();
//           console.error("Error fetching room details:", errorText);
//           setMessage("Failed to load room data.");
//           return;
//         }

//         const data = await res.json();
//         setParticipants(data.participants || []);
//       } catch (err) {
//         console.error("Room data fetch error:", err);
//         setMessage("Server error while loading room data.");
//       }
//     };

//     fetchRoomData();
//   }, [roomId, token]);

//   const handleAddExpense = async () => {
//     const trimmedDesc = desc.trim();
//     const parsedAmount = parseFloat(amount);

//     if (!trimmedDesc || isNaN(parsedAmount) || parsedAmount <= 0) {
//       setMessage("Please enter a valid description and amount.");
//       return;
//     }

//     if (participants.length === 0) {
//       setMessage("No users found in the room to split with.");
//       return;
//     }

//     try {
//       const response = await fetch(`${API}/api/room/${roomId}/expense`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ desc: trimmedDesc, amount: parsedAmount }),
//       });

//       if (response.ok) {
//         setMessage("Expense added successfully!");
//         setDesc("");
//         setAmount("");
//       } else {
//         const errorText = await response.text();
//         console.error("Add expense failed:", errorText);
//         setMessage("Failed to add expense.");
//       }
//     } catch (err) {
//       console.error("Add expense error:", err);
//       setMessage("Server error while adding expense.");
//     }
//   };

//   const splitAmount =
//     parseFloat(amount) > 0 && participants.length > 0
//       ? (parseFloat(amount) / participants.length).toFixed(2)
//       : null;

//   return (
//     <div className="centreBox">
//       <h2 className="topHeading">Room Dashboard</h2>
//       <p className="Paragraph">
//         <strong>Room ID:</strong> {roomId}
//       </p>
//       <p className="Paragraph">
//         <strong>Participants:</strong>{" "}
//         {participants.length > 0
//           ? participants.map((p) => p.name || p.email || "User").join(", ")
//           : "No participants yet"}
//       </p>

//       <input
//         ref={descRef}
//         className="input"
//         type="text"
//         placeholder="Description"
//         value={desc}
//         onChange={(e) => setDesc(e.target.value)}
//       />
//       <input
//         type="number"
//         className="input"
//         placeholder="Amount"
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//       />
//       <button className="button" onClick={handleAddExpense}>
//         Add Expense
//       </button>

//       {message && <p>{message}</p>}

//       {splitAmount && (
//         <p className="Paragraph">
//           <strong>Each person should pay:</strong> Rs.{splitAmount}
//         </p>
//       )}
//     </div>
//   );
// }

// export default RoomDashboard;

import React, { useEffect, useState, useRef } from "react";

function RoomDashboard({ token }) {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [participants, setParticipants] = useState([]);
  const [creator, setCreator] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const descRef = useRef(null);

  const API = "https://expense-split-backend-1.onrender.com";
  const roomId = window.location.pathname.split("/")[2];

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

        // Normalize creator value
        const creatorValue = data.created_by?.trim().toLowerCase() || "";
        setCreator(creatorValue);

        // Decode JWT token and normalize current user
        const payloadBase64 = token.split(".")[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        const userValue = decodedPayload.username?.trim().toLowerCase() || "";
        setCurrentUser(userValue);

      } catch (err) {
        console.error("Room data fetch error:", err);
        setMessage("Server error while loading room data.");
      }
    };

    fetchRoomData();
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

  const isCreator = currentUser && creator && currentUser === creator;

  return (
    <div className="centreBox">
      <h2 className="topHeading">Room Dashboard</h2>
      <p className="Paragraph">
        <strong>Room ID:</strong> {roomId}
      </p>
      <p className="Paragraph">
        <strong>Participants:</strong>{" "}
        {participants.length > 0
          ? participants.map((p) => p.name || "User").join(", ")
          : "No participants yet"}
      </p>

      {isCreator ? (
        <>
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
        </>
      ) : (
        <p className="Paragraph" style={{ color: "gray" }}>
          Only the room creator can add expenses.
        </p>
      )}

      {message && <p>{message}</p>}

      {splitAmount && (
        <p className="Paragraph">
          <strong>Each person should pay:</strong> Rs.{splitAmount}
        </p>
      )}
    </div>
  );
}

export default RoomDashboard;

