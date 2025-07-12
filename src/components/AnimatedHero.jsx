import React from "react";
import Lottie from "lottie-react";
import animationData from "../animations/splitwise.json";

function AnimatedHero() {
  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
}

export default AnimatedHero;