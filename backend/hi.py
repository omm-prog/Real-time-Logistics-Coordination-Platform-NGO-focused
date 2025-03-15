import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime

# 🔥 Firebase Service Account Key Load Karo
cred = credentials.Certificate("firebase_key.json")
firebase_admin.initialize_app(cred)

# 🔹 Firestore Client
db = firestore.client()

# 📌 ngoProfile Collection Me Sample Data Dalna
def create_ngo_profile():
    ngo_id = "NGO123"  # 🔥 Document ID (Change kar sakte ho)
    ngo_data = {
        "ngoId": ngo_id,
        "ngoName": "Helping Hands",
        "ourWork": "Providing food to homeless people",
        "ngoLocation": "Mumbai, India",
        "websiteLink": "https://helpinghands.org",
        "timestamp": datetime.utcnow()
    }

    # 🔥 Firestore Me Data Dalna
    db.collection("ngoProfile").document(ngo_id).set(ngo_data)
    print(f"✅ NGO Profile Created for {ngo_id}")

# ✅ Function Call Karo
create_ngo_profile()
