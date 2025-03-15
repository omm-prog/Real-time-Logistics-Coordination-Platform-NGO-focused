// import { useState } from "react";
// import { Link } from "react-router-dom";
// import logo from "../assets/food2.png"; 
// import "./DNavbar.css";

// const DNavbar = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <>
//       <nav className="navbar">
//         <div className="nav-container">
//           {/* Logo */}
//           <Link to="/" className="logo">
//             <img src={logo} alt="Logo" />
//           </Link>

//           {/* Desktop Links */}
//           <ul className={`nav-links ${isOpen ? "open" : ""}`}>
//             <li>
//               <Link to="/" className="nav-item">Home</Link>
//             </li>
//             <li>
//               <Link to="/about" className="nav-item">About Us</Link>
//             </li>
//             <li>
//               <Link to="/community" className="nav-item">Community</Link>
//             </li>
//             <li>
//               <Link to="/dashboard" className="nav-item">Dashboard</Link>
//             </li>
//           </ul>

//           {/* Mobile Menu Button */}
//           <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
//             ☰
//           </button>
//         </div>
//       </nav>
//       {/* Invisible Spacer to Push Content Down */}
//       <div className="navbar-spacing"></div>
//     </>
//   );
// };

// export default DNavbar;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase"; 
import logo from "../assets/food2.png"; 
import "./DNavbar.css";

const DNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); 
    } catch (error) {
      console.error("Logout Error:", error);
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

          <ul className={`nav-links ${isOpen ? "open" : ""}`}>
            <li><Link to="/" className="nav-item">Home</Link></li>
            <li><Link to="/about" className="nav-item">About Us</Link></li>
            <li><Link to="/community" className="nav-item">Community</Link></li>
            <li><Link to="/dashboard" className="nav-item">Dashboard</Link></li>
            <li><button className="logout-button" onClick={handleLogout}>Logout</button></li> 
          </ul>

          <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
            ☰
          </button>
        </div>
      </nav>
      <div className="navbar-spacing"></div>
    </>
  );
};

export default DNavbar;
