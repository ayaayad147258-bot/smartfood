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

async function verifyUsers() {
    console.log("Searching for all users in 'users' collection group...");
    try {
        const querySnapshot = await getDocs(collectionGroup(db, "users"));
        if (querySnapshot.empty) {
            console.log("No users found anywhere in the 'users' collection group.");
            return;
        }
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log(`User: [${data.username}] | Pass: [${data.password}] | Role: ${data.role} | Restaurant: ${data.restaurantId} | Path: ${doc.ref.path}`);
        });
    } catch (e) {
        console.error("Error searching users:", e.message);
    }
}

verifyUsers();
