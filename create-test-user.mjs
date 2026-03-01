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

const createTestUser = async () => {
    const username = 'admin_test';
    const password = 'password123';
    const restaurantId = '-sol--mm5g4uv7'; // مطعم السلطان

    try {
        await setDoc(doc(db, 'users', username), {
            username,
            password,
            role: 'admin',
            restaurantId,
            permissions: ['pos', 'online_orders', 'kds', 'dashboard', 'inventory', 'customers', 'drivers', 'expenses', 'reports', 'settings'],
            created_at: new Date().toISOString()
        });
        console.log(`User ${username} created successfully for restaurant ${restaurantId}`);
    } catch (e) {
        console.error("Error creating user:", e);
    }
};

createTestUser();
