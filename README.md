# 🌍 Smart Waste & Food Management System

## 🚀 Technologies Used
**React, Firebase, Google Maps API (Web & Mobile)**

## 🔥 Project Overview
The **Smart Waste & Food Management System** is an innovative **web and mobile platform** designed to **bridge the gap between food donors and NGOs**, ensuring that surplus food reaches those in need **before it goes to waste**.

## ⚡ Key Features
- ✅ **Automated NGO Notifications:** Whenever a donor posts surplus food, nearby NGOs receive instant alerts.
- ✅ **Intelligent Location-Based Tracking:** The system dynamically identifies and **matches donors with nearby NGOs** using **Google Maps API**.
- ✅ **Dynamic Radius Expansion:** If no NGO responds within **2 km**, the search radius **expands to 5 km, then 10 km, and up to 200 km** to maximize reach.
- ✅ **Real-World Impact:** This system plays a **crucial role** in reducing food wastage, promoting sustainability, and supporting NGOs in their humanitarian efforts.

## 🎯 Why It Matters?
- **🌱 Sustainability:** Helps reduce food waste by ensuring redistribution to those in need.
- **📡 Efficiency:** Automated alerts and real-time tracking make the process **seamless** and **fast**.
- **📊 Scalable Solution:** Can be expanded to **multiple cities and regions** for maximum impact.

This project is a step towards a **smarter, more responsible society** where food surplus isn't wasted but **redistributed efficiently**. 🚀♻️

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository  
```sh
git clone https://github.com/omm-prog/Food-Waste-Management.git
cd Food-Waste-Management
```

### 2️⃣ Install Dependencies  
Make sure you have **Node.js** installed. Then, run:
```sh
npm install
```

### 3️⃣ Configure Firebase  
- Go to **[Firebase Console](https://console.firebase.google.com/)**.
- Create a new Firebase project and enable **Firestore & Authentication**.
- Get your **Firebase config** and update the `firebaseConfig.js` file.

### 4️⃣ Start the Development Server  
```sh
npm start
```
This will start the app at `http://localhost:3000`.

---

## 🚀 How It Works

### 👨‍💻 For Donors:
1. **Sign up/login** and post food details (location, quantity, etc.).
2. Nearby NGOs receive **instant notifications**.
3. Once an NGO claims the food, the donor is notified.

### 🏢 For NGOs:
1. **View available food donations** within their area.
2. **Claim a donation** and coordinate pickup.
3. If no NGO claims within **2 km**, the system expands the search radius **up to 200 km**.

---

## 📜 License  
This project is **open-source** under the **MIT License**.  

📢 If you like this project, **drop a ⭐ on GitHub**!  
