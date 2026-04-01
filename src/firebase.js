// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // ← ADD THIS LINE

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSQBubZOxwjSw0o70IRcUoEwwiqhItRwA",
  authDomain: "note-app-c0cd6.firebaseapp.com",
  projectId: "note-app-c0cd6",
  storageBucket: "note-app-c0cd6.firebasestorage.app",
  messagingSenderId: "641794632661",
  appId: "1:641794632661:web:952c2fbe927f13bcf02b5c",
  measurementId: "G-WCPWESMR6J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app); // ← ADD THIS LINE