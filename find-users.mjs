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

async function findAnyUser() {
    console.log("--- SEARCHING FOR USERS ---");
    try {
        const restaurantsSnap = await getDocs(collection(db, "restaurants"));
        for (const resDoc of restaurantsSnap.docs) {
            console.log(`Checking restaurant: ${resDoc.id} (${resDoc.data().name})`);
            const usersSnap = await getDocs(collection(db, "restaurants", resDoc.id, "users"));
            usersSnap.forEach(userDoc => {
                const u = userDoc.data();
                console.log(`  > FOUND USER: [${u.username}] Password: [${u.password}]`);
            });
        }
    } catch (e) {
        console.error("ERROR:", e.message);
    }
}

findAnyUser();
