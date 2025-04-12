import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase, ref, set, push, get } from "firebase/database";

// Firebase config (uses .env values)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: "G-ZL2EBV00H7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);

// Email + Password Registration
export async function registerUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user info to Realtime Database
    await set(ref(database, `users/${user.uid}`), {
      email: user.email,
      // Do NOT store plain text passwords
      firstName: "",
      lastName: "",
      displayName: "",
      billingInfo: {
        address: "",
        city: "",
        phone: "",
        zipCode: ""
      }
    });

    // Sign out after registration
    await signOut(auth);

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Google Sign-In registration
export async function registerGoogleUser(user) {
  try {
    await set(ref(database, `users/${user.uid}`), {
      email: user.email,
      displayName: user.displayName || "",
      firstName: "",
      lastName: "",
      billingInfo: {
        address: "",
        city: "",
        phone: "",
        zipCode: ""
      }
    });
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Facebook Sign-In registration
export async function registerFacebookUser(user) {
  try {
    await set(ref(database, `users/${user.uid}`), {
      email: user.email,
      displayName: user.displayName || "",
      firstName: "",
      lastName: "",
      billingInfo: {
        address: "",
        city: "",
        phone: "",
        zipCode: ""
      }
    });
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Facebook & Google providers
const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope("email");

const googleProvider = new GoogleAuthProvider();

export {
  auth,
  db,
  database,
  push,
  ref,
  set,
  get,
  facebookProvider,
  googleProvider,
};
