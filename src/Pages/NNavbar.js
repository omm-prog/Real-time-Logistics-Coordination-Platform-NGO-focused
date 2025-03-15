import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { signOut } from "firebase/auth"; // ✅ Import signOut function
import { auth } from "../firebase/firebase"; // ✅ Import Firebase auth
import logo from "../assets/food2.png"; 
import "./NNavbar.css";

const NNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // ✅ Initialize navigate function

  const handleLogout = async () => {
    try {
      await signOut(auth); // ✅ Logout user
      navigate("/"); // ✅ Redirect to Home Page after logout
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          {/* Logo */}
          <Link to="/" className="logo">
            <img src={logo} alt="Logo" />
          </Link>

          {/* Desktop Links */}
          <ul className={`nav-links ${isOpen ? "open" : ""}`}>
            <li>
              <Link to="/" className="nav-item">Home</Link>
            </li>
            <li>
              <Link to="/about" className="nav-item">About Us</Link>
            </li>
            <li>
              <Link to="/Ncommunity" className="nav-item">Community</Link> {/* ✅ Fixed */}
            </li>
            <li>
              <Link to="/profile" className="nav-item">Profile</Link>
            </li>
            <li>
              <button onClick={handleLogout} className="nav-item logout-button">Logout</button>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
            ☰
          </button>
        </div>
      </nav>
      {/* Invisible Spacer to Push Content Down */}
      <div className="navbar-spacing"></div>
    </>
  );
};

export default NNavbar;
