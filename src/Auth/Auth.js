import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"; 
import { setDoc, doc, getDoc } from "firebase/firestore";
import "./Auth.css"

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("donor");
  const [loading, setLoading] = useState(false); // New state for loading

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const redirectTo = queryParams.get("redirect") || "/";

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user data in Firestore
        await setDoc(doc(db, "users", user.uid), {
          username: username,
          email: email,
          role: role
        });

        alert("Signup successful! Please login.");
        setIsSignup(false); // Switch to login form after signup
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch user data from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          alert(`Login successful! Welcome, ${userData.username} (${userData.role})`);
          navigate(redirectTo); // Redirect after login
        } else {
          alert("User data not found. Please contact support.");
          console.error("User data not found in Firestore.");
        }
      }
    } catch (error) {
      console.error("Authentication error:", error.message);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  return (
    <div>
      <h2>{isSignup ? "Signup" : "Login"}</h2>
      <form onSubmit={handleAuth}>
        {isSignup && (
          <>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="donor">Donor</option>
              <option value="ngo">NGO</option>
            </select>
          </>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : isSignup ? "Signup" : "Login"}
        </button>
      </form>
      <p onClick={() => setIsSignup(!isSignup)} style={{ cursor: "pointer", color: "blue" }}>
        {isSignup ? "Already have an account? Login" : "Don't have an account? Signup"}
      </p>
    </div>
  );
};

export default Auth;
