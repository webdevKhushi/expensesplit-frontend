// src/components/JoinRoom.js

import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function JoinRoom({ token }) {
  const [roomIdInput, setRoomIdInput] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { roomId: routeRoomId } = useParams();

  // ✅ Hardcoded backend API URL instead of using import.meta.env
  const API = "https://expense-split-backend-1.onrender.com";
  const roomId = (routeRoomId || roomIdInput).trim();

  const handleJoin = async () => {
    if (!roomId) {
      setMessage("Please enter a valid Room ID.");
      return;
    }

    try {
      const res = await fetch(`${API}/api/join-room`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ room_id: roomId }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Successfully joined the room!");

        // Optional: Fetch participants
        try {
          const usersRes = await fetch(`${API}/api/room/${roomId}/participants`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const usersData = await usersRes.json();
          if (usersData.success) {
            console.log("Users in room:", usersData.users);
          }
        } catch (userFetchErr) {
          console.warn("Failed to fetch participants", userFetchErr);
        }

        setTimeout(() => {
          navigate(`/room/${roomId}/dashboard`);
        }, 800);
      } else {
        setMessage(data.message || "Failed to join room.");
      }
    } catch (error) {
      console.error("Join Room Error:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="centreBox">
      <h2 className="topHeading">Join a Room</h2>
      <input
        type="text"
        className="input"
        placeholder="Enter Room ID"
        value={roomIdInput}
        onChange={(e) => setRoomIdInput(e.target.value)}
        disabled={!!routeRoomId}
      />
      <button className="button" onClick={handleJoin}>Join Room</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default JoinRoom;
 
