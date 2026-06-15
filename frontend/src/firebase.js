import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  // apiKey: "AIzaSyDypUdBXqNBFS9p7E3hldH6xOVcM1Fb7D4",
  // authDomain: "mars-cervejaria-f72ae.firebaseapp.com",
  // projectId: "mars-cervejaria-f72ae",
  // storageBucket: "mars-cervejaria-f72ae.firebasestorage.app",
  // messagingSenderId: "566352360030",
  // appId: "1:566352360030:web:5e387e877dc7d1db84facf",
  // measurementId: "G-B5Z5CWKNMV"
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;