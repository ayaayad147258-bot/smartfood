import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

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

const createAdmin = async () => {
    const username = 'admin';
    const password = '123';
    const restaurantId = '-sol--mm5g4uv7'; // مطعم السلطان

    try {
        console.log("Attempting to create user...");
        await setDoc(doc(db, 'users', username), {
            username,
            password,
            role: 'admin',
            restaurantId,
            permissions: ['pos', 'online_orders', 'kds', 'dashboard', 'inventory', 'customers', 'drivers', 'expenses', 'reports', 'settings'],
            created_at: new Date().toISOString()
        });
        console.log(`SUCCESS: User [${username}] created with password [${password}]`);
    } catch (e) {
        console.error("FAILED to create user:", e.message);
        console.error("Make sure you published the Security Rules in Firebase Console.");
    }
};

createAdmin();
