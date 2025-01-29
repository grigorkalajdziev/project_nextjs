import firebase from "firebase/app";
import "firebase/auth";  // Import Firebase Authentication module

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

// Initialize Firebase (Check if Firebase app already exists)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // Use the existing app
}

// Firebase authentication
const auth = firebase.auth(); // Firebase authentication instance

export { auth };
