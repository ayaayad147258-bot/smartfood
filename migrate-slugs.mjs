import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";

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

function toSlug(text) {
    if (!text) return "";
    return text
        .toLowerCase()
        .replace(/\s+/g, '') // Remove spaces
        .replace(/[^a-z0-9]/g, ""); // Keep only alphanumeric
}

async function migrate() {
    console.log("Starting migration...");
    const querySnapshot = await getDocs(collection(db, "restaurants"));
    for (const d of querySnapshot.docs) {
        const data = d.data();
        const slug = toSlug(data.name_en || data.name);
        if (slug) {
            await updateDoc(doc(db, "restaurants", d.id), { slug });
            console.log(`Updated ${d.id} | Name: ${data.name} | Slug: ${slug}`);
        }
    }
    console.log("Migration finished.");
}

migrate();
