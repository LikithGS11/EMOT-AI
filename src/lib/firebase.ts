// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "emotion-mentor",
  appId: "1:37068652775:web:d248e143e65e3d74046242",
  storageBucket: "emotion-mentor.firebasestorage.app",
  apiKey: "AIzaSyC4CIfJagf5XeKKx1FuYRjDXRw9SmAFXq8",
  authDomain: "emotion-mentor.firebaseapp.com",
  messagingSenderId: "37068652775",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
