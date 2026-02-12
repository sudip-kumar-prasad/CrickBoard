import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, deleteDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDJqUctoIOg_DD01wLQhVlmlvWJAGZBrbU",
    authDomain: "crickboard-14347.firebaseapp.com",
    projectId: "crickboard-14347",
    storageBucket: "crickboard-14347.firebasestorage.app",
    messagingSenderId: "514566619653",
    appId: "1:514566619653:web:9f7fb9097e697a1ee3526c",
    measurementId: "G-YXR3PG7Q3N"
};

async function verifyConnection() {
    console.log("1. Initializing Firebase...");
    try {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const auth = getAuth(app);
        console.log("✅ Firebase App Initialized");

        console.log("2. Testing Firestore Connectivity...");
        try {
            // Attempt to read a test collection
            // Even if empty or permission denied, it proves we reached the server
            const querySnapshot = await getDocs(collection(db, "connectivity_check"));
            console.log("✅ Firestore Reachable (Read successful)");
        } catch (error) {
            if (error.code === 'permission-denied') {
                console.log("✅ Firestore Reachable (Permission Denied - expected if not logged in)");
            } else {
                console.error("❌ Firestore Connection Failed:", error.message);
                process.exit(1);
            }
        }

        console.log("\n🎉 Firebase Integration Verification Passed!");
        console.log("The app is correctly configured to talk to Project ID: " + firebaseConfig.projectId);
        process.exit(0);

    } catch (error) {
        console.error("❌ Setup Failed:", error);
        process.exit(1);
    }
}

verifyConnection();
