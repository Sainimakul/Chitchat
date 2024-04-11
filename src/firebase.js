import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD2oA82M2_OWgNS2dBuQz1ykqDHWaJ-_Ko",
  authDomain: "chat-6d403.firebaseapp.com",
  projectId: "chat-6d403",
  storageBucket: "chat-6d403.appspot.com",
  messagingSenderId: "310874836798",
  appId: "1:310874836798:web:2574784ba6443cc0a2e66f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
