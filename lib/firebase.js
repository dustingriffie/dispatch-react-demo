import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "XXX",
  databaseURL: "XXX",
  projectId: "XXX",
  storageBucket: "XXX",
  messagingSenderId: "XXX",
  appId: "XXX"
}


// Initialize Firebase & Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore()



// Initialize Firebase Authentication and get a reference to the service
export const database = db
export const auth = getAuth(app);
export default app;


// // Initialize Firebase
// const firebase = initializeApp(firebaseConfig);

// export default firebase;
