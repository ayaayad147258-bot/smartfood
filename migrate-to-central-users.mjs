import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc } from "firebase/firestore";

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

async function migrate() {
    console.log("--- STARTING USER MIGRATION ---");
    try {
        const restaurantsSnap = await getDocs(collection(db, "restaurants"));
        let count = 0;

        for (const resDoc of restaurantsSnap.docs) {
            const restaurantId = resDoc.id;
            console.log(`Processing restaurant: ${restaurantId}`);

            const usersSnap = await getDocs(collection(db, "restaurants", restaurantId, "users"));

            for (const userDoc of usersSnap.docs) {
                const userData = userDoc.data();
                const username = userData.username;

                if (!username) {
                    console.log(`  ! Skipping user with no username (ID: ${userDoc.id})`);
                    continue;
                }

                // Write to top-level users collection
                // Document ID is the username for direct lookup
                await setDoc(doc(db, "users", username), {
                    ...userData,
                    restaurantId: restaurantId, // Ensure restaurantId is always present
                    migrated_at: new Date().toISOString()
                });

                console.log(`  > Migrated: ${username} (Restaurant: ${restaurantId})`);
                count++;
            }
        }
        console.log(`--- MIGRATION FINISHED: ${count} users migrated ---`);
    } catch (e) {
        console.error("MIGRATION ERROR:", e.message);
    }
}

migrate();
