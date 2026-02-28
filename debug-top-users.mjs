import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBkieBAwbbRe6iDAs-kqD28L8D7qkfJD6k",
    authDomain: "crepree.firebaseapp.com",
    projectId: "crepree",
    storageBucket: "crepree.firebasestorage.app",
    messagingSenderId: "136152032204",
    appId: "1:136152032204:web:e28ccbfd225f44953a3369",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function debugTopUsers() {
    console.log("Fetching users from top-level collection...");
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        console.log(`Found ${querySnapshot.docs.length} users in top-level.`);
    } catch (e) {
        console.error("Error fetching top-level users:", e.message);
    }
}

debugTopUsers();
