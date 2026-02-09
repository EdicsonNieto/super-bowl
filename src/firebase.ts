import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4DXmSInfXiyz5J0tD_-km0rAffslbfZs",
  authDomain: "super-bowl-92a40.firebaseapp.com",
  databaseURL: "https://super-bowl-92a40-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "super-bowl-92a40",
  storageBucket: "super-bowl-92a40.firebasestorage.app",
  messagingSenderId: "380635577126",
  appId: "1:380635577126:web:51cec9a63b4f6ba9229fe7",
  measurementId: "G-CES90FDMJQ"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);