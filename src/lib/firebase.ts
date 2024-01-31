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
  apiKey: "AIzaSyD_emHrV_k4cemw5tN7IOlU3kqw0WI-SVA",
  authDomain: "chat-app-b434a.firebaseapp.com",
  projectId: "chat-app-b434a",
  storageBucket: "chat-app-b434a.appspot.com",
  messagingSenderId: "243730906539",
  appId: "1:243730906539:web:a2fbd27bbef445186926ee",
  measurementId: "G-PTF63HFQ62",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
