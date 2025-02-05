import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase, ref, set, push } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAI4eJ4KU7tfrsv1WLlT7nUWmqFSX2wxj8",
  authDomain: "kikamakeupandbeautyacademy.firebaseapp.com",
  databaseURL: "https://kikamakeupandbeautyacademy-default-rtdb.firebaseio.com",
  projectId: "kikamakeupandbeautyacademy",
  storageBucket: "kikamakeupandbeautyacademy.firebasestorage.app",
  messagingSenderId: "182562636039",
  appId: "1:182562636039:web:ef9692a202af3fbe4345a2",
  measurementId: "G-ZL2EBV00H7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase authentication instance
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);

export { auth, db };
