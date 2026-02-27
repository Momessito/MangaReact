import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDPTB8hf38K89Sf4vN3hLDNg1dGOPwHTMM",
    authDomain: "etec-dc9a1.firebaseapp.com",
    databaseURL: "https://etec-dc9a1-default-rtdb.firebaseio.com",
    projectId: "etec-dc9a1",
    storageBucket: "etec-dc9a1.firebasestorage.app",
    messagingSenderId: "435768310362",
    appId: "1:435768310362:web:03f0df5f3a7bdc6a0fb663",
    measurementId: "G-4V6WBT0WRL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
