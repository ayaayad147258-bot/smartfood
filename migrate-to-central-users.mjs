import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";

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

const migrate = async () => {
    console.log("--- MIGRATING TO COMPOSITE CENTRAL IDS ---");
    const snap = await getDocs(collection(db, "users"));

    for (const d of snap.docs) {
        const data = d.data();
        const oldId = d.id;

        // Skip if already in composite format (contains underscore)
        if (oldId.includes("_") && oldId.split("_")[0] === data.restaurantId) {
            console.log(`Skipping already migrated user: ${oldId}`);
            continue;
        }

        const newId = `${data.restaurantId}_${data.username}`;
        console.log(`Migrating ${oldId} -> ${newId}`);

        await setDoc(doc(db, "users", newId), data);

        // Only delete the old one if the ID was just the username
        if (oldId === data.username) {
            await deleteDoc(doc(db, "users", oldId));
            console.log(`Deleted old ID: ${oldId}`);
        }
    }
    console.log("--- DONE ---");
};

migrate();
