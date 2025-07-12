import React from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import walletAnimation from "../animations/wallet.json";

import homeIcon from "../Images/home.svg";
import historyIcon from "../Images/history.svg";
import createIcon from "../Images/create.svg";
import enterIcon from "../Images/enter.svg";
import logoutIcon from "../Images/logout.svg";

function Header({ logout }) {
  return (
    <header>
      {/* Centered logo + title */}
      <div className="TitleBar">
        <div className="Wallet">
            <Lottie animationData={walletAnimation} loop={true} />
        </div>
        <h1 className="Heading">Expense Split</h1>
    </div>

      {/* Navigation icons */}
      <nav className="Links" style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "10px" }}>
        <Link to="/"><img className="icon-white" src={homeIcon} alt="Home" width="20" height="20" /></Link>
        <Link to="/history"><img className="icon-white" src={historyIcon} alt="History" width="20" height="20" /></Link>
        <Link to="/createroom"><img className="icon-white" src={createIcon} alt="Create Room" width="20" height="20" /></Link>
        <Link to="/join"><img className="icon-white" src={enterIcon} alt="Enter Room" width="20" height="20" /></Link>
        <button className="logOut" onClick={logout}>
          <img src={logoutIcon} alt="Log Out" width="20" height="20" />
        </button>
      </nav>
    </header>
  );
}

export default Header;

