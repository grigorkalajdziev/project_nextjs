import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  FacebookAuthProvider,
  GoogleAuthProvider,  
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase, ref, set, push, get, update } from "firebase/database";

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

const generateCoupon = () => {
  const prefixes = ["MAKEUP", "BEAUTY", "GLAM", "KIKA"];
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit number
  return `${randomPrefix}${randomNumber}`;
};

// Email + Password Registration
export async function registerUser(email, password) {
  try {
    // 1) Create auth user
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    const coupon = generateCoupon();
    // 2) Write user profile to RTDB
    await set(ref(database, `users/${user.uid}`), {
      email: user.email,
      firstName: "",
      lastName: "",
      displayName: "",
      billingInfo: { address: "", city: "", phone: "", zipCode: "" },
      role: "guest",
      coupon: coupon,
    });

    // 3) Sign out so client handles next login
    await signOut(auth);
    return { success: true, user, coupon };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Google Sign-In registration
export async function registerGoogleUser(user) {
  try {
    const coupon = generateCoupon(); 
    // Write user profile to RTDB
    await set(ref(database, `users/${user.uid}`), {
      email: user.email,
      displayName: user.displayName || "",
      firstName: "",
      lastName: "",
      billingInfo: { address: "", city: "", phone: "", zipCode: "" },
      role: "guest",
      coupon: coupon, 
    });
    return { success: true, user, coupon };
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
  update,
};
