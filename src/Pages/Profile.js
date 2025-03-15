import React, { useState, useEffect } from 'react';
import { auth, db, doc, getDoc, setDoc } from '../firebase/firebase';  // Correct import

function Profile() {
    const [ngoProfile, setNgoProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        ngoName: '',
        description: '',
        latitude: '',
        longitude: '',
        link: '',
    });

    // Fetch profile when component mounts or when the user logs in
    useEffect(() => {
        const fetchProfile = async () => {
            const user = auth.currentUser;
            if (user) {
                const ngoRef = doc(db, 'ngoProfile', user.uid);  // Reference to the user's ngoProfile document using their UID
                const docSnap = await getDoc(ngoRef);  // Fetch document using getDoc()

                if (docSnap.exists()) {
                    setNgoProfile(docSnap.data());  // Get data from the document snapshot
                } else {
                    console.log('No NGO profile found');
                }
            }
        };

        auth.onAuthStateChanged((user) => {
            if (user) {
                fetchProfile();
            } else {
                console.log('User not authenticated');
            }
        });
    }, []);

    // Handle form field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Save the updated profile
    const saveProfile = async () => {
        const user = auth.currentUser;
        if (user) {
            const ngoRef = doc(db, 'ngoProfile', user.uid);  // Reference to the user's ngoProfile document
            const updatedData = {
                ngoName: formData.ngoName,
                description: formData.description,
                location: {
                    latitude: parseFloat(formData.latitude),
                    longitude: parseFloat(formData.longitude),
                },
                link: formData.link,
            };

            try {
                // Save or update the user's profile in Firestore
                await setDoc(ngoRef, updatedData, { merge: true });  // Use setDoc() for updating
                alert('Profile updated successfully!');
                setIsEditing(false);
                setNgoProfile(updatedData);
            } catch (error) {
                console.error('Error updating profile:', error);
            }
        }
    };

    // Cancel editing
    const cancelEdit = () => {
        setIsEditing(false);
    };

    // Display the profile
    return (
        <div>
            {ngoProfile && !isEditing ? (
                <div id="profile-container">
                    <h2>{ngoProfile.ngoName}</h2>
                    <p>
                        <strong>Description:</strong> {ngoProfile.description}
                    </p>
                    <p>
                        <strong>Location:</strong> Latitude: {ngoProfile.location.latitude}, Longitude:{' '}
                        {ngoProfile.location.longitude}
                    </p>
                    <p>
                        <strong>Website:</strong> <a href={ngoProfile.link} target="_blank" rel="noopener noreferrer">
                            {ngoProfile.link}
                        </a>
                    </p>
                    <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                </div>
            ) : (
                <div id="edit-form">
                    <h3>Edit Profile</h3>
                    <label htmlFor="ngo-name">NGO Name:</label>
                    <input
                        type="text"
                        id="ngo-name"
                        name="ngoName"
                        value={formData.ngoName}
                        onChange={handleInputChange}
                    />
                    <br />
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                    <br />
                    <label htmlFor="latitude">Latitude:</label>
                    <input
                        type="text"
                        id="latitude"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleInputChange}
                    />
                    <br />
                    <label htmlFor="longitude">Longitude:</label>
                    <input
                        type="text"
                        id="longitude"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleInputChange}
                    />
                    <br />
                    <label htmlFor="link">Website Link:</label>
                    <input
                        type="text"
                        id="link"
                        name="link"
                        value={formData.link}
                        onChange={handleInputChange}
                    />
                    <br />
                    <button onClick={saveProfile}>Save Profile</button>
                    <button onClick={cancelEdit}>Cancel</button>
                </div>
            )}
        </div>
    );
}

export default Profile;
