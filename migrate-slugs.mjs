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

function makeSlug(name) {
    return name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // remove non-word chars
        .trim()
        .replace(/\s+/g, '-') // spaces to hyphens
        .replace(/-+/g, '-'); // collapse hyphens
}

async function migrate() {
    console.log("--- MIGRATING SLUGS ---");
    const snap = await getDocs(collection(db, "restaurants"));
    for (const d of snap.docs) {
        const data = d.data();
        let slug = "";

        if (d.id === "-sol--mm5g4uv7") slug = "sultan";
        else if (d.id === "--mm5hu4nx") slug = "pizza-hot";
        else slug = makeSlug(data.name_en || data.name);

        console.log(`Restaurant: ${data.name} | New Slug: ${slug}`);
        await updateDoc(doc(db, "restaurants", d.id), { slug });
    }
    console.log("--- DONE ---");
}

migrate();
