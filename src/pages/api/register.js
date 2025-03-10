// firebaseRegister.js
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase, ref, set, push, get } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: "G-ZL2EBV00H7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase authentication instance
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);

/**
 * registerUser - Creates a new user and then immediately signs them out.
 * This ensures that the Navigation component does not show "My Account"
 * until the user explicitly logs in.
 *
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} - Returns an object with success status and user data or error.
 */
export async function registerUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    const user = userCredential.user;

    // Save initial user record to Realtime Database under "users/{user.uid}"
    await set(ref(database, `users/${user.uid}`), {
      email: user.email,
      password: password, // WARNING: Storing plaintext passwords is insecure.
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
    
    // Immediately sign the user out so the Navigation remains in "Login/Register" mode.
    await signOut(auth);
    
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * registerGoogleUser - Creates a user record for a Google sign‑in.
 * This should be called when a user logs in with Google for the first time.
 */
export async function registerGoogleUser(user) {
  try {
    // Save user record in the Realtime Database. You might want to extract parts of displayName if needed.
    await set(ref(database, `users/${user.uid}`), {
      email: user.email,
      password: "", // No password for Google sign
      firstName: "",
      lastName: "",
      displayName: user.displayName || "",
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

export { auth, db, database, push, ref, set, get };
