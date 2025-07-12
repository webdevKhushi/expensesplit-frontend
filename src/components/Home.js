// import React from "react";
// import AnimatedHero from "./AnimatedHero";
// function Home(){
//     return(
//         <div>
//             <h1 className="Welcome">Welcome to Expense Split.</h1>
//             <AnimatedHero />
//             <p className="Paragraph">Easily split bills and track group expenses with friends, family, or roommates.
//             Create rooms, add expenses, and see who owes what — all in one place.
//             No more awkward money talks — we’ve got your calculations covered! 
//             </p>
//         </div>
//     );
// }

import React from "react";
import { useNavigate } from "react-router-dom";
import AnimatedHero from "./AnimatedHero";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "80px", padding: "0 20px" }}>
      <h1 className="topHeading">Welcome to ExpenseSplit</h1>

      <AnimatedHero />

      <p className="Paragraph">
        Split bills, track expenses, and stay stress-free.
      </p>
      <p className="Paragraph">
        Easily split bills and track group expenses with friends, family, or roommates.
        Create rooms, add expenses, and see who owes what — all in one place.
        No more awkward money talks — we’ve got your calculations covered!
      </p>

      <div style={{ marginTop: "30px" }}>
        <button
          className="button"
          style={{ marginRight: "10px" }}
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button className="button" onClick={() => navigate("/signup")}>
          Signup
        </button>
      </div>
    </div>
  );
}

export default Home;
