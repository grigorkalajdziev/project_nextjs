import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  FacebookAuthProvider,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase, ref, set, push, get, update, remove } from "firebase/database";

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

// Prevent duplicate app initialization (important in Next.js)
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);

// Set persistence to LOCAL so session survives new tabs and page refreshes
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error("Failed to set auth persistence:", err);
});

const generateCoupon = () => {
  const prefixes = ["MAKEUP", "BEAUTY", "GLAM", "KIKA"];
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return `${randomPrefix}${randomNumber}`;
};

export async function checkUserExists(userId) {
  try {
    const database = getDatabase();
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);
    return snapshot.exists();
  } catch (error) {
    console.error("Error checking user existence:", error);
    return false;
  }
}

export async function checkPhoneExists(phoneNumber) {
  try {
    const snapshot = await get(ref(database, "users"));
    if (!snapshot.exists()) return false;
    const users = snapshot.val();
    const exists = Object.values(users).some(
      (user) => user?.billingInfo?.phone === phoneNumber
    );
    return exists;
  } catch (error) {
    console.error("Error checking phone:", error);
    return false;
  }
}

// Email + Password Registration
export async function registerUser(email, password, firstName, lastName) {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    const coupon = generateCoupon();
    await set(ref(database, `users/${user.uid}`), {
      email: user.email,
      firstName: firstName,
      lastName: lastName,
      displayName: `${firstName} ${lastName}`,
      billingInfo: { address: "", city: "", phone: "", zipCode: "" },
      role: "guest",
      password: password,
      coupon: coupon,
    });
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
  remove,
};