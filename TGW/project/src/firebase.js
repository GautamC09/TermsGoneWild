// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAw-AXXa0I8I2bwG4w8m5meEbVHmosYphw",
    authDomain: "termsgonewild.firebaseapp.com",
    projectId: "termsgonewild",
    storageBucket: "termsgonewild.firebasestorage.app",
    messagingSenderId: "101142206254",
    appId: "1:101142206254:web:748c09cedc1ca146034cbf"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };