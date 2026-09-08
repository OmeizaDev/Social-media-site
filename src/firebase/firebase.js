// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDGkalYkpcNrq5EdHlDM53y0x6QioLiBnA",
  authDomain: "sayhi-aa530.firebaseapp.com",
  projectId: "sayhi-aa530",
  storageBucket: "sayhi-aa530.firebasestorage.app",
  messagingSenderId: "336756740846",
  appId: "1:336756740846:web:3b2e02d6cbb5e1e9b299ff",
  measurementId: "G-8M88PZCNK2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);