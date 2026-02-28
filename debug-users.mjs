import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, collectionGroup } from "firebase/firestore";

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

async function debugUsers() {
    console.log("Fetching users via collectionGroup...");
    try {
        const querySnapshot = await getDocs(collectionGroup(db, "users"));
        console.log(`Found ${querySnapshot.docs.length} users.`);
        querySnapshot.forEach((doc) => {
            console.log(`User: ${doc.data().username} | Path: ${doc.ref.path}`);
        });
    } catch (e) {
        console.error("Error fetching users:", e.message);
    }
}

debugUsers();
