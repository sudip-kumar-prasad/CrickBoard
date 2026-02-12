import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics"; 
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJqUctoIOg_DD01wLQhVlmlvWJAGZBrbU",
  authDomain: "crickboard-14347.firebaseapp.com",
  projectId: "crickboard-14347",
  storageBucket: "crickboard-14347.firebasestorage.app",
  messagingSenderId: "514566619653",
  appId: "1:514566619653:web:9f7fb9097e697a1ee3526c",
  measurementId: "G-YXR3PG7Q3N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); // Analytics might require specific setup in RN, keeping disabled for now to avoid errors on some environments
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
