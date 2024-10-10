
import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import { getFirestore} from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAGtnEmKSj3Ec6m5x4wNyuJHWpHsV4wFAA",
  authDomain: "doctor-booking-web.firebaseapp.com",
  projectId: "doctor-booking-web",
  storageBucket: "doctor-booking-web.appspot.com",
  messagingSenderId: "328944882366",
  appId: "1:328944882366:web:3295ef4102fa52e380c4ef"
};


const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth();