// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBII5szb7Wfr1lFWem7w4jXiwTYsYecrHA",
  authDomain: "linkasa-2b589.firebaseapp.com",
  projectId: "linkasa-2b589",
  storageBucket: "linkasa-2b589.appspot.com",
  messagingSenderId: "996397762801",
  appId: "1:996397762801:web:e3c952fd2c672929914150"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
