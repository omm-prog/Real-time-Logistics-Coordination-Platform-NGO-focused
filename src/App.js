import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "./components/Footer";
import HomePage from "./components/Home";
import AboutPage from "./components/About";
import CommunityPage from "./components/Community";
import Auth from "./Auth/Auth";
import DHome from "./Pages/DHome";
import DNavbar from "./Pages/DNavbar";
import NNavbar from "./Pages/NNavbar";
import Navbar from "./components/Navbar"; // ✅ Default Navbar
import NCommunity from "./components/NCommunity";
import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/Profile";

function App() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // ✅ Track user state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        } else {
          setUserRole(null);
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>; // ✅ Prevent UI flicker

  return (
    <Router>
      {/* ✅ Dynamically show Navbar */}
      {userRole === "donor" ? <DNavbar /> : userRole === "ngo" ? <NNavbar /> : <Navbar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/ncommunity" element={<NCommunity />} />
        <Route path="/profile" element={<Profile />} />
        {/* 🔒 Protected Routes */}
        <Route
          path="/community"
          element={user ? <CommunityPage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/dhome"
          element={user ? <DHome /> : <Navigate to="/auth" />}
        />


        {/* 🔄 Redirect Logged-In Users from Login Page */}
        <Route path="/auth" element={user ? <Navigate to={userRole === "donor" ? "/dhome" : "/community"} /> : <Auth />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
