// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration object you got from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDkRl-rXPp3nCHwxrP3yfY0eAXnh_fmk30",
  authDomain: "formalyze-ec725.firebaseapp.com",
  projectId: 'formalyze-ec725',
  storageBucket: "formalyze-ec725.appspot.com",
  messagingSenderId: "1037229349268",
  appId: "1:1037229349268:web:ac131cca3befa5edced781",
  measurementId: "G-GNX6BVZ069"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore (the database service)
const db = getFirestore(app);
const auth = getAuth(app);
export { db, auth };
