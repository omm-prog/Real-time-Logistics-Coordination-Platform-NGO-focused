import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, collection, query, where, onSnapshot, updateDoc } from "firebase/firestore";  // Ensure updateDoc is imported
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUserEdit, FaCheck } from "react-icons/fa";
import "./Dashboard.css";

const DonorPage = () => {
  const [donor, setDonor] = useState(null);
  const [foodDonations, setFoodDonations] = useState([]);
  const [ngos, setNgos] = useState({});  // Track NGO details for each donation
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [nameSaved, setNameSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/auth"); // Redirect unauthenticated users
      return;
    }

    const fetchDonorData = async () => {
      const donorRef = doc(db, "users", auth.currentUser.uid); // Fetch from users
      const donorSnap = await getDoc(donorRef);
      if (donorSnap.exists()) {
        setDonor(donorSnap.data());
        setNewName(donorSnap.data().name);
      }
    };

    // Real-time fetching of food donations
    const fetchFoodDonations = () => {
      const foodDonationsQuery = query(
        collection(db, "food_posts"),
        where("posted_by_uid", "==", auth.currentUser.uid) // Only fetch the donor's posts
      );

      const unsubscribe = onSnapshot(foodDonationsQuery, async (querySnapshot) => {
        const foodData = [];
        const ngosData = {}; // Track NGO names for each post ID

        // Loop through each donation and fetch NGO data
        const promises = querySnapshot.docs.map(async (docSnap) => {
          const foodDataItem = docSnap.data();
          foodData.push({
            id: docSnap.id,
            ...foodDataItem,
          });

          // Check if food is picked
          if (foodDataItem.picked_by_uid) {
            const userRef = doc(db, "users", foodDataItem.picked_by_uid); // Query the users collection with picked_by_uid as document ID
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
              ngosData[docSnap.id] = userDoc.data().name; // Store NGO name from users collection
            } else {
              ngosData[docSnap.id] = "No user found"; // In case no user document is found
            }
          } else {
            ngosData[docSnap.id] = "Not picked yet"; // If not picked, show "Not picked yet"
          }
        });

        await Promise.all(promises);

        setFoodDonations(foodData);
        setNgos(ngosData); // Update the NGOs state with fetched names
      });

      return () => unsubscribe();
    };

    fetchDonorData();
    return fetchFoodDonations(); // Return the unsubscribe function to clean up
  }, [navigate]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/auth");
  };

  const handleNameChange = async () => {
    if (newName.trim() && newName !== donor?.name) {
      const donorRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(donorRef, { name: newName });
      setDonor(prevDonor => ({ ...prevDonor, name: newName }));
      setNameSaved(true);
      setIsEditing(false);
      setTimeout(() => setNameSaved(false), 3000);
    }
  };

  return (
    <div className="dashboard">
      <div className="top-right-buttons">
        {/* <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button> */}
      </div>

      <main className="content">
        <h1>Welcome, {donor?.name || "Donor"}!</h1>

        <section className="grid">
          {/* Donor Profile */}
          <div className="card profile">
            <h2>👤 Donor Profile</h2>
            <div className="name-section">
              <strong>Name:</strong>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="name-input"
                    autoFocus
                  />
                  <button className="save-btn" onClick={handleNameChange}>
                    <FaCheck /> Save
                  </button>
                </>
              ) : (
                <>
                  <span className="donor-name">{donor?.name}</span>
                  <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                    <FaUserEdit /> Edit Name
                  </button>
                </>
              )}
              {nameSaved && <span className="saved-confirmation">Name saved successfully!</span>}
            </div>
            <p><strong>Email:</strong> {donor?.email}</p>
          </div>

          {/* Donation History */}
          <div className="card history">
            <h2>📜 Donation History</h2>
            {foodDonations.length > 0 ? (
              <div className="table-container">
                <table className="donation-table">
                  <thead>
                    <tr>
                      <th>Food Item</th>
                      <th>Quantity</th>
                      <th>Location</th>
                      <th>Expiry</th>
                      <th>Donated At</th>
                      <th>Picked By NGO</th> {/* Added column for NGO info */}
                    </tr>
                  </thead>
                  <tbody>
                    {foodDonations.map((donation) => (
                      <tr key={donation.id}>
                        <td>{donation.food_description}</td> {/* Correct field name */}
                        <td>{donation.quantity}</td>
                        <td>
                          📍 {donation.latitude}, {donation.longitude} {/* Show Lat/Long */}
                        </td>
                        <td>
                          {donation.expiry_date?.seconds
                            ? new Date(donation.expiry_date.seconds * 1000).toLocaleString()
                            : "N/A"}
                        </td>
                        <td>
                          {donation.timestamp?.seconds
                            ? new Date(donation.timestamp.seconds * 1000).toLocaleString()
                            : "N/A"}
                        </td>
                        <td>
                          {/* Display the NGO name if food was picked */}
                          {ngos[donation.id] ? ngos[donation.id] : "Not picked yet"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-donations">No donations yet. Start donating today!</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DonorPage;
