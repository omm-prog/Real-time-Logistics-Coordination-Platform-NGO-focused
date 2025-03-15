import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/food2.png";
import "./Navbar.css";

const Navbar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);

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
              <Link to="/community" className="nav-item">Community</Link>
            </li>
            {/* {user === "donor" && (
              <li>
                <Link to="/donor-dashboard" className="nav-item">Donor Dashboard</Link>
              </li>
            )}
            {user === "ngo" && (
              <li>
                <Link to="/ngo-dashboard" className="nav-item">NGO Dashboard</Link>
              </li>
            )} */}
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

export default Navbar;
