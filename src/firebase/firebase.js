import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, collection } from "firebase/firestore";  // Import setDoc

const firebaseConfig = {

};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, doc, getDoc, setDoc, collection }; // Export setDoc
