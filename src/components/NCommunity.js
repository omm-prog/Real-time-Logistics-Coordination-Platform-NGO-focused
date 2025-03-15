import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase"; // ✅ Ensure correct Firebase config
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs, addDoc, updateDoc } from "firebase/firestore";
import "./NCommunity.css";

// Haversine formula to calculate the distance between two points on the Earth's surface
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

const NDashboard = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("User");
  const [userRole, setUserRole] = useState(""); // Track role
  const [myPosts, setMyPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    food_description: "",
    quantity: "",
    expiry_date: "",
    latitude: "",
    longitude: "",
  });
  const [ngoLocation, setNgoLocation] = useState({ latitude: 0, longitude: 0 });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUsername(userDoc.data().username || "User");
          setUserRole(userDoc.data().role || "user"); // Fetch role
        }

        // Fetch NGO's location when the user is logged in and is an NGO
        if (userDoc.data().role === "ngo") {
          const ngoRef = doc(db, "ngoProfile", currentUser.uid); // Assuming NGO profile is stored here
          const ngoDoc = await getDoc(ngoRef);
          if (ngoDoc.exists()) {
            const ngoData = ngoDoc.data();
            setNgoLocation({
              latitude: ngoData.location.latitude,
              longitude: ngoData.location.longitude,
            });
          }
        }
      } else {
        setUser(null);
        setUsername("User");
        setUserRole("");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [user]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "food_posts"));
      const posts = [];
      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();

        const formattedExpiryDate = data.expiry_date?.toDate
          ? data.expiry_date.toDate().toLocaleDateString() // Convert Firestore Timestamp to Date
          : "N/A";

        let postedByUsername = "Unknown";
        if (data.posted_by_uid) {
          const userRef = doc(db, "users", data.posted_by_uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            postedByUsername = userDoc.data().username || "Unknown";
          }
        }

        // Get the NGO who picked the food (if any)
        let pickedBy = "Not picked yet";
        if (data.picked_by_uid) {
          const ngoRef = doc(db, "ngoProfile", data.picked_by_uid);
          const ngoDoc = await getDoc(ngoRef);
          if (ngoDoc.exists()) {
            pickedBy = ngoDoc.data().ngo_name || "Unknown NGO";
          }
        }

        posts.push({
          id: docSnap.id,
          ...data,
          expiry_date: formattedExpiryDate, // Store formatted expiry date
          posted_by: postedByUsername,
          picked_by: pickedBy, // Add picked by NGO
        });
      }
      setAllPosts(posts);
    } catch (error) {
      console.error("❌ Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmFood = async (postId) => {
    try {
      // Update the food post to "Picked"
      const postRef = doc(db, "food_posts", postId);
      await updateDoc(postRef, {
        status: "Picked",
        picked_by_uid: user.uid, // Store the NGO's UID
      });

      // Optimistically update the UI without waiting for the database update to reflect
      setAllPosts((prevPosts) => 
        prevPosts.map((post) =>
          post.id === postId ? { ...post, status: "Picked", picked_by: username } : post
        )
      );
    } catch (error) {
      console.error("❌ Error confirming food:", error);
    }
  };

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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    try {
      const newPost = {
        ...formData,
        posted_by_uid: user.uid, // Store UID instead of username
        status: "Available",
        expiry_date: new Date(formData.expiry_date), // Convert to Date before saving
      };

      await addDoc(collection(db, "food_posts"), newPost);
      setShowForm(false);
      fetchPosts(); // Refresh posts after adding
    } catch (error) {
      console.error("❌ Error adding post:", error);
    }
  };

  if (userRole !== "ngo") {
    return <div>You are not authorized to view this page.</div>; // Restrict non-NGOs
  }

  return (
    <div className="container">
      <h2>Welcome, {username}! 👋</h2>

      {showForm && (
        <form className="post-form" onSubmit={handleAddPost}>
          <input
            type="text"
            name="food_description"
            placeholder="Food Description"
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            onChange={handleInputChange}
            required
          />
          <input
            type="date"
            name="expiry_date"
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="latitude"
            placeholder="Latitude"
            value={formData.latitude}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="longitude"
            placeholder="Longitude"
            value={formData.longitude}
            onChange={handleInputChange}
            required
          />
          <button type="submit">✅ Submit</button>
        </form>
      )}

      <h3>📌 All Food Posts</h3>
      <div className="grid-container">
        {allPosts.map((post) => {
          const distance = haversineDistance(
            post.latitude,
            post.longitude,
            ngoLocation.latitude,
            ngoLocation.longitude
          ).toFixed(2); // Distance in km, rounded to 2 decimal places

          return (
            <div
              key={post.id}
              className="card"
              style={{
                backgroundColor: getBackgroundColor(post),
                marginBottom: "20px",
              }}
            >
              <h5>🍲 {post.food_description}</h5>
              <p>📦 Quantity: {post.quantity}</p>
              <p>⏳ Expiry: {post.expiry_date}</p>
              <p>📍 Location: {post.latitude}, {post.longitude}</p>
              <p>👤 Posted by: <strong>{post.posted_by}</strong></p>
              <p>📍 Distance: {distance} km from your location</p>
              <p>🛍️ Picked by: <strong>{post.picked_by}</strong></p>

              {post.status === "Available" && (
                <button onClick={() => handleConfirmFood(post.id)}>Confirm Food</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NDashboard;
