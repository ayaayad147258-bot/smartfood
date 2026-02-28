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

async function debugSubCollection() {
    console.log("Fetching users from specific restaurant...");
    try {
        const querySnapshot = await getDocs(collection(db, "restaurants", "--mm5hu4nx", "users"));
        console.log(`Found ${querySnapshot.docs.length} users.`);
    } catch (e) {
        console.error("Error fetching sub-collection users:", e.message);
    }
}

debugSubCollection();
