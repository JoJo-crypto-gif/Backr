import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import './App.css';


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/current_user', {
      credentials: 'include' // This allows cookies/sessions to be sent
    })
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
      })
      .catch(err => console.log("Error fetching user:", err));
  }, []);

  return (
    <Router>
      <Navbar user={user} />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </div>
    </Router>
  );
}

// Home Page Component
function Home({ user }) {
  return (
    <div className="home">
      <h1>Welcome to CrowdFund</h1>
      <p>Your platform to fund great ideas and campaigns.</p>
      {user ? (
        <p>Welcome back, {user.name}!</p>
      ) : (
        <a href="/signin">
          <button className="home-btn">Get Started - Sign In / Sign Up</button>
        </a>
      )}
    </div>
  );
}

// Sample Campaigns Page
function Campaigns() {
  return (
    <div>
      <h2>Campaigns</h2>
      <p>Explore current campaigns here...</p>
    </div>
  );
}

// Sample About Page
function About() {
  return (
    <div>
      <h2>About Us</h2>
      <p>Learn more about our mission.</p>
    </div>
  );
}

// Sample Contact Page
function Contact() {
  return (
    <div>
      <h2>Contact</h2>
      <p>Get in touch with us!</p>
    </div>
  );
}

// Sign In Page Component
function SignIn() {
  const handleSignIn = () => {
    window.location.href = "http://localhost:5000/auth/google";
    setTimeout(() => {
      window.location.reload(); // Ensures the user state updates after redirect
    }, 2000);
  };

  return (
    <div>
      <h2>Sign In / Sign Up</h2>
      <p>Click the button below to authenticate with Google.</p>
      <button className="nav-btn" onClick={handleSignIn}>Sign In with Google</button>
    </div>
  );
}


export default App;
