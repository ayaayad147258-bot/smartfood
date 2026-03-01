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

const users = [
    { username: 'admin', password: '123', restaurantId: '-sol--mm5g4uv7' }, // السلطان
    { username: 'pizza_admin', password: '123', restaurantId: '--mm5hu4nx' }, // بيتزا هت
    { username: 'nasser', password: '1212', restaurantId: '--mm5hu4nx' } // بيتزا هت
];

const setup = async () => {
    for (const u of users) {
        try {
            await setDoc(doc(db, 'users', u.username), {
                ...u,
                role: 'admin',
                permissions: ['pos', 'online_orders', 'kds', 'dashboard', 'inventory', 'customers', 'drivers', 'expenses', 'reports', 'settings'],
                created_at: new Date().toISOString()
            });
            console.log(`Created/Updated: ${u.username}`);
        } catch (e) { console.error(`Failed ${u.username}:`, e.message); }
    }
};

setup();
