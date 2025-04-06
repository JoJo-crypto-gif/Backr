import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

function Navbar({ user }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    fetch("http://localhost:5000/logout", {
      method: "GET",
      credentials: "include",
    })
      .then(() => {
        window.location.reload(); // Refresh to update navbar state
      })
      .catch((err) => console.log("Logout Error:", err));
  };

  return (
    <nav className="navbar">
      <h1 className="logo">CrowdFund</h1>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/campaigns">Campaigns</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>

      <div className="nav-right">
        {user ? (
          <div className="user-menu">
            <button className="user-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
              {user.name} ⌄
            </button>

            {dropdownOpen && (
              <div className="dropdown">
                <Link to="/dashboard">Dashboard</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <a href="/signin">
            <button className="nav-btn">Sign In / Sign Up</button>
          </a>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
