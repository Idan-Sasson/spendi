// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_XN7paxd2ZBLtRsZQXbYme2GRyVdH7lw",
  authDomain: "spendi-fb5c7.firebaseapp.com",
  projectId: "spendi-fb5c7",
  storageBucket: "spendi-fb5c7.firebasestorage.app",
  messagingSenderId: "388426573473",
  appId: "1:388426573473:web:8823aa82fa956b427372e0",
  measurementId: "G-C51G86YEZ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app, "expenses");