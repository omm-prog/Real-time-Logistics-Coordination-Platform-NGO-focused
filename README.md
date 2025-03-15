# Smart Waste & Food Management System

## Overview
The **Smart Waste & Food Management System** is a web and mobile-based platform designed to reduce food waste by efficiently connecting **donors** and **NGOs**. The system leverages **IoT, Flutter, Firebase, and Google Maps API** to enable real-time food donation tracking and automated NGO notifications.

## Technologies Used
- **IoT** - Sensors for waste and food monitoring
- **Flutter** - Cross-platform mobile and web application
- **Firebase** - Authentication and real-time database
- **Google Maps API** - Location tracking and radius-based donation matching

## Key Features
- **Real-Time Food Donation Tracking**: Donors can post available surplus food with location data.
- **Automated NGO Notifications**: Nearby NGOs receive alerts when food is available for pickup.
- **Dynamic Radius Expansion**:
  - If no NGO responds within **2 km**, the search radius expands to **5 km, 10 km, and up to 200 km**.
- **Web & Mobile Support**: Ensures accessibility across different devices.
- **User Profiles**:
  - Donors can track their past contributions.
  - NGOs can view available donations in their area.

## Real-World Use Case
The system significantly reduces **food waste** by ensuring that surplus food reaches **NGOs** efficiently. This helps in addressing hunger while promoting sustainability.

## Installation & Setup
1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-repository-url.git
   cd smart-waste-food-management
   ```
2. **Install Dependencies:**
   ```sh
   flutter pub get
   ```
3. **Run the application:**
   ```sh
   flutter run
   ```
4. **Set up Firebase:**
   - Configure Firebase Authentication and Firestore.
   - Add `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) to respective directories.

## Contribution
Feel free to contribute by submitting **pull requests** or **reporting issues**!

## License
This project is licensed under the **MIT License**.
