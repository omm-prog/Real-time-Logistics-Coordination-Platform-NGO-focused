from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, firestore, auth
from flask_cors import CORS
import os
import jwt
import datetime

# ✅ Load environment variables
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

CORS(app, resources={r"/api/*": {"origins": "*"}})  # ✅ Allow all frontend requests

# ✅ Initialize Firebase
cred = credentials.Certificate("firebase_key.json")  # Ensure correct path
firebase_admin.initialize_app(cred)
db = firestore.client()

# ✅ JWT Token Generator
def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=12)  # 12-hour expiry
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

# ✅ User Signup API
@app.route("/api/signup", methods=["POST"])
def signup():
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")
        username = data.get("username")
        role = data.get("role", "donor")  # Default role

        if not email or not password or not username:
            return jsonify({"error": "⚠️ All fields are required"}), 400

        # ✅ Create user in Firebase Auth
        user = auth.create_user(email=email, password=password)

        # ✅ Store user in Firestore
        db.collection("users").document(user.uid).set({
            "email": email,
            "username": username,
            "role": role
        })

        return jsonify({"message": "✅ Signup successful!", "user_id": user.uid}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ User Login API
@app.route("/api/login", methods=["POST"])
def login():
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "⚠️ Email and password required"}), 400

        # ✅ Fetch user from Firestore
        users_ref = db.collection("users").where("email", "==", email).stream()
        user_doc = next(users_ref, None)

        if not user_doc:
            return jsonify({"error": "❌ User not found"}), 404

        user_data = user_doc.to_dict()
        user_id = user_doc.id

        # ✅ Generate JWT Token
        token = generate_token(user_id)

        return jsonify({"token": token, "username": user_data["username"], "role": user_data["role"]}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/post_food", methods=["POST"])
def post_food():
    try:
        data = request.json
        token = request.headers.get("Authorization")

        if not token:
            return jsonify({"error": "⚠️ Unauthorized"}), 401

        try:
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "⚠️ Token expired. Please log in again."}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "⚠️ Invalid token"}), 401

        user_id = payload["user_id"]

        # ✅ Debugging: Print user ID
        print(f"✅ User ID: {user_id}")

        # ✅ Get user details
        user_ref = db.collection("users").document(user_id)
        user_doc = user_ref.get()
        if not user_doc.exists:
            return jsonify({"error": "⚠️ User not found"}), 404

        username = user_doc.to_dict().get("username", "Unknown")

        # ✅ Debugging: Print received data
        print(f"📦 Received Data: {data}")

        # ✅ Validate all required fields
        required_fields = ["food_description", "quantity", "expiry_date", "latitude", "longitude"]
        if not all(field in data and data[field] for field in required_fields):
            return jsonify({"error": "⚠️ All fields are required"}), 400

        # ✅ Debugging: Print before storing
        print(f"📤 Storing Food Post for {username}")

        # ✅ Store food post in Firestore
        food_post = {
            "food_description": data["food_description"],
            "quantity": data["quantity"],
            "expiry_date": data["expiry_date"],
            "latitude": float(data["latitude"]),
            "longitude": float(data["longitude"]),
            "posted_by": username,
            "status": "Available"
        }

        post_ref = db.collection("food_posts").add(food_post)
        post_id = post_ref[1].id  # 🔥 Debugging: Check if this is returning correctly

        # ✅ Debugging: Print post ID
        print(f"✅ Food Post Added: {post_id}")

        return jsonify({"message": "✅ Food post successful!", "post_id": post_id}), 201

    except Exception as e:
        print(f"❌ Error: {e}")  # ✅ Debugging: Print error logs
        return jsonify({"error": str(e)}), 500

# ✅ Get All Food Posts API
@app.route("/api/get_food_posts", methods=["GET"])
def get_food_posts():
    try:
        posts_ref = db.collection("food_posts")
        docs = posts_ref.stream()

        posts = []
        for doc in docs:
            post = doc.to_dict()
            post["id"] = doc.id  # ✅ Include Firestore document ID
            posts.append(post)

        return jsonify({"status": "success", "posts": posts})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ Update Food Post Status API
@app.route("/api/update_food_status/<post_id>", methods=["PUT"])
def update_food_status(post_id):
    try:
        data = request.json
        new_status = data.get("status")

        if not new_status:
            return jsonify({"error": "⚠️ Status field is required"}), 400

        post_ref = db.collection("food_posts").document(post_id)
        post_ref.update({"status": new_status})

        return jsonify({"message": "✅ Food status updated successfully!"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ Run Flask Server
if __name__ == '__main__':
    app.run(debug=True)
