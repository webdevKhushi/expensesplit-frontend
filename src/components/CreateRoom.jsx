// src/components/CreateRoom.js

import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";  

const API = import.meta.env.VITE_API_URL;

function getUsernameFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.username;
  } catch {
    return null;
  }
}

function CreateRoom({ token }) {
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState(null);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!roomName.trim()) {
      setError("Room name cannot be empty.");
      return;
    }

    const createdBy = getUsernameFromToken(token);
    if (!createdBy) {
      setError("Invalid token. Cannot extract username.");
      return;
    }

    try {
      const res = await fetch(`${API}/api/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ room_name: roomName, created_by: createdBy }),
      });

      const data = await res.json();
      if (res.ok && data.roomId) {
        setRoomId(data.roomId);
        setError("");
      } else {
        setError(data.message || "Failed to create room.");
      }
    } catch (err) {
      setError("Server error: " + err.message);
    }
  };

  const joinLink = roomId ? `${window.location.origin}/join/${roomId}` : "";

  return (
    <div className="centreBox">
      <h2 className="topHeading">Create a Room</h2>
      <input
        type="text"
        className="input"
        placeholder="Room Name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <button className="button" onClick={handleCreate}>Create Room</button>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {roomId && (
        <div style={{ marginTop: 20 }}>
          <h3 className="yellowHeading">Room Created!</h3>
          <p className="Paragraph"><strong>Room ID:</strong> {roomId}</p>
          <p className="Paragraph"><strong>Join Link:</strong> <a href={joinLink}>{joinLink}</a></p>
          <p className="Paragraph"><strong>Qr-Code:</strong> 
          <div className="QrCode">
            <QRCodeCanvas value={joinLink} size={200} />
          </div>
          </p>
        </div>
      )}
    </div>
  );
}

export default CreateRoom;
