import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBMQibVD3PR7N-ZgcvQR-qIWX5D3-4Wn_g",
  authDomain: "chitchat-47d73.firebaseapp.com",
  projectId: "chitchat-47d73",
  storageBucket: "chitchat-47d73.appspot.com",
  messagingSenderId: "558959608232",
  appId: "1:558959608232:web:9470304d2c99f3d7be5d9d"};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
