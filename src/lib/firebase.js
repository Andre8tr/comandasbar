// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAktoR_vgTLAKqvyeAAJmSnDgxYL1rHkl0",
  authDomain: "comandasbar-eb427.firebaseapp.com",
  projectId: "comandasbar-eb427",
  storageBucket: "comandasbar-eb427.firebasestorage.app",
  messagingSenderId: "160261295338",
  appId: "1:160261295338:web:d55576c6722438b37b1b93",
  measurementId: "G-L9BQFQDZE6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };
