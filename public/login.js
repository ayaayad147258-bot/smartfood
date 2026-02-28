import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, query, where, getDocs, collectionGroup } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBkieBAwbbRe6iDAs-kqD28L8D7qkfJD6k",
    authDomain: "crepree.firebaseapp.com",
    projectId: "crepree",
    storageBucket: "crepree.firebasestorage.app",
    messagingSenderId: "136152032204",
    appId: "1:136152032204:web:e28ccbfd225f44953a3369",
    measurementId: "G-NLY4XJ8C4V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const usernameInput = document.getElementById('username-input');
const passwordInput = document.getElementById('password-input');
const loginBtn = document.getElementById('login-btn');

async function handleLogin() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        alert('يرجى إدخال اسم المستخدم وكلمة المرور');
        return;
    }

    loginBtn.disabled = true;
    const originalText = loginBtn.innerText;
    loginBtn.innerText = 'جاري التحميل...';

    try {
        // Multi-tenant login: search across all restaurants' users
        const q = query(
            collectionGroup(db, 'users'),
            where('username', '==', username),
            where('password', '==', password)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();

            // Extract restaurantId from path if not in data
            // Path: restaurants/{restaurantId}/users/{userId}
            const pathSegments = userDoc.ref.path.split('/');
            const restaurantId = userData.restaurantId || pathSegments[1];

            const user = {
                id: userDoc.id,
                ...userData,
                restaurantId
            };

            localStorage.setItem('pos_user', JSON.stringify(user));

            // Redirect to main application
            window.location.href = '/';
        } else {
            alert('بيانات الدخول غير صحيحة');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('حدث خطأ أثناء تسجيل الدخول. تأكد من الاتصال بالإنترنت.');
    } finally {
        loginBtn.disabled = false;
        loginBtn.innerText = originalText;
    }
}

loginBtn.addEventListener('click', handleLogin);

// Allow login on Enter key
[usernameInput, passwordInput].forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });
});