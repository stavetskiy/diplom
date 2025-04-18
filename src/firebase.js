// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC4cyMkB00mqlzbJg_7O_Wrj2qo9DTE_aU",
  authDomain: "table-reserv-ab094.firebaseapp.com",
  projectId: "table-reserv-ab094",
  storageBucket: "table-reserv-ab094.firebasestorage.app",
  messagingSenderId: "632081945088",
  appId: "1:632081945088:web:cf07a61bab3c447eea3ee5",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
