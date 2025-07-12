import React, { useState, useRef, useEffect } from "react";
import SplitResult from "./SplitResult";

const API = import.meta.env.VITE_API_URL;

function Dashboard({ token }) {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [people, setPeople] = useState("");
  const [message, setMessage] = useState("");
  const descRef = useRef(null);

  useEffect(() => {
    descRef.current?.focus();
  }, []);

  const handleAddExpense = async () => {
    const trimmedDesc = desc.trim();
    const parsedAmount = parseFloat(amount);
    const parsedPeople = parseInt(people);

    if (!trimmedDesc || isNaN(parsedAmount) || isNaN(parsedPeople) || parsedAmount <= 0 || parsedPeople <= 0) {
      setMessage(" Please enter valid values.");
      return;
    }

    try {
      const response = await fetch(`${API}/api/expense`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ desc: trimmedDesc, amount: parsedAmount, people: parsedPeople }),
      });

      if (response.ok) {
        setMessage(" Expense added successfully!");
        setDesc("");
        setAmount("");
        setPeople("");
        descRef.current?.focus();
      } else {
        setMessage("Failed to add expense.");
      }
    } catch (err) {
      setMessage("Server error: " + err.message);
    }
  };

  return (
    <div className="centreBox">
      <h1 className="topHeading">Dashboard</h1>

      <input
        ref={descRef}
        type="text"
        className="input"
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
      <input
        type="number"
        className="input"
        placeholder="Number of people"
        value={people}
        onChange={(e) => setPeople(e.target.value)}
      />

      <button className="button" onClick={handleAddExpense}>Add Expense</button>

      {message && <p>{message}</p>}

      <SplitResult amount={amount} people={people} desc={desc} />
    </div>
  );
}

export default Dashboard;
