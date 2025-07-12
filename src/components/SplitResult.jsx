// src/components/SplitResult.js

import React from "react";

function SplitResult({ amount, people, desc }) {
  const amt = parseFloat(amount);
  const ppl = parseInt(people);

  const isValid = !isNaN(amt) && amt > 0 && !isNaN(ppl) && ppl > 0;

  if (!isValid) return <p>⚠️ Please enter a valid amount and number of people to see the split.</p>;

  const split = (amt / ppl).toFixed(2);

  return (
    <div style={{ marginTop: "1rem" }}>
      <h2>Split Summary</h2>
      <p><strong>Description:</strong> {desc?.trim() || "N/A"}</p>
      <p><strong>Total Amount:</strong> ₹{amt}</p>
      <p><strong>Number of People:</strong> {ppl}</p>
      <p><strong>Each person should pay:</strong> ₹{split}</p>
    </div>
  );
}

export default SplitResult;
