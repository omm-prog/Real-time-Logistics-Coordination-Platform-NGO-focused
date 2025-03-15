import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase"; // ✅ Ensure correct Firebase config
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs, addDoc } from "firebase/firestore";
import "./Community.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("User");
  const [myPosts, setMyPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // ✅ Food Post Form State
  const [formData, setFormData] = useState({
    food_description: "",
    quantity: "",
    expiry_date: "",
    latitude: "",
    longitude: "",
  });

  const [error, setError] = useState("");

  // ✅ Fetch Current User Info
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUsername(userDoc.data().username || "User");
        }
      } else {
        setUser(null);
        setUsername("User");
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ Fetch All Food Posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "food_posts"));
      const posts = [];

      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();

        // ✅ Convert Timestamp to Readable Date
        const formattedExpiryDate = data.expiry_date?.toDate
          ? data.expiry_date.toDate().toLocaleDateString()
          : "N/A";

        // ✅ Fetch the username from Firestore using UID
        let postedByUsername = "Unknown";
        if (data.posted_by_uid) {
          const userRef = doc(db, "users", data.posted_by_uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            postedByUsername = userDoc.data().username || "Unknown";
          }
        }

        posts.push({
          id: docSnap.id,
          ...data,
          expiry_date: formattedExpiryDate, // ✅ Store formatted expiry date
          posted_by: postedByUsername,
        });
      }

      setAllPosts(posts);

      if (user) {
        // ✅ Filter current user's posts
        const userPosts = posts.filter((post) => post.posted_by_uid === user.uid);
        setMyPosts(userPosts);
      }
    } catch (error) {
      console.error("❌ Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]); // ✅ Refetch posts when user changes

  // ✅ Get User Location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (error) => console.error("❌ Error getting location:", error)
      );
    }
  }, []);

  // ✅ Handle Input Changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Function to Add Food Post
  const handleAddPost = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.food_description || !formData.quantity || !formData.expiry_date || !formData.latitude || !formData.longitude) {
      setError("⚠️ Please fill all fields.");
      return;
    }

    try {
      const newPost = {
        ...formData,
        posted_by_uid: user.uid, // ✅ Store UID instead of username
        status: "Available",
        expiry_date: new Date(formData.expiry_date), // ✅ Convert to Date before saving
      };

      await addDoc(collection(db, "food_posts"), newPost);
      setShowForm(false);
      fetchPosts(); // ✅ Refresh posts after adding
    } catch (error) {
      console.error("❌ Error adding post:", error);
      setError("⚠️ Failed to add post. Try again.");
    }
  };

  // ✅ Get Background Color for Expiry
  const getBackgroundColor = (post) => {
    if (post.status === "Picked") return "yellow";

    try {
      const today = new Date();
      const expDate = new Date(post.expiry_date);
      const daysLeft = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));

      if (daysLeft <= 2) return "#ff7f7f"; // 🔴 Red (Near expiry)
      if (daysLeft <= 5) return "#ffbf47"; // 🟠 Orange (Medium expiry)
      return "#8bc34a"; // 🟢 Green (Long expiry)
    } catch (error) {
      return "#ccc"; // Default grey if there's an error
    }
  };

  // ✅ Logout Function
  const logout = () => {
    auth.signOut().then(() => {
      window.location.href = "/login";
    });
  };

  return (
    <div className="container">
      <h2>Welcome, {username}! 👋</h2>
      {/* <button onClick={logout} className="logout-btn">🚪 Logout</button> */}

      <button onClick={() => setShowForm(!showForm)} className="add-btn">
        ➕ Add Food Post
      </button>

      {showForm && (
        <form className="post-form" onSubmit={handleAddPost}>
          <input type="text" name="food_description" placeholder="Food Description" onChange={handleInputChange} required />
          <input type="number" name="quantity" placeholder="Quantity" onChange={handleInputChange} required />
          <input type="date" name="expiry_date" onChange={handleInputChange} required />
          <input type="text" name="latitude" placeholder="Latitude" value={formData.latitude} onChange={handleInputChange} required />
          <input type="text" name="longitude" placeholder="Longitude" value={formData.longitude} onChange={handleInputChange} required />
          <button type="submit">✅ Submit</button>
        </form>
      )}

      <h3>📌 My Uploaded Food Posts</h3>
      <div className="grid-container">
        {myPosts.map((post) => (
          <div key={post.id} className="card" style={{ backgroundColor: getBackgroundColor(post) }}>
            <h5>🍲 {post.food_description}</h5>
            <p>📦 Quantity: {post.quantity}</p>
            <p>⏳ Expiry: {post.expiry_date}</p>
            <p>📍 Location: {post.latitude}, {post.longitude}</p>
          </div>
        ))}
      </div>

      <h3>📌 All Food Posts</h3>
      <div className="grid-container">
        {allPosts.map((post) => (
          <div key={post.id} className="card" style={{ backgroundColor: getBackgroundColor(post) }}>
            <h5>🍲 {post.food_description}</h5>
            <p>📦 Quantity: {post.quantity}</p>
            <p>⏳ Expiry: {post.expiry_date}</p>
            <p>📍 Location: {post.latitude}, {post.longitude}</p>
            <p>👤 Posted by: <strong>{post.posted_by}</strong></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
