
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAx4JlfadHzE_jHb_71P95t5XNqbD3sS4g",
  authDomain: "portal-57ccd.firebaseapp.com",
  projectId: "portal-57ccd",
  storageBucket: "portal-57ccd.firebasestorage.app",
  messagingSenderId: "468963089288",
  appId: "1:468963089288:web:6ef34a3dee25590bf0383d"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };





