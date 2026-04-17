import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyDNm3yTeCKqBr0prMhGX0yRbx-jg9S4de0",
  authDomain: "my-queue-app-38901.firebaseapp.com",
  projectId: "my-queue-app-38901",
  storageBucket: "my-queue-app-38901.firebasestorage.app",
  messagingSenderId: "23985289943",
  appId: "1:23985289943:web:6a371e356244592fac8e92"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ EXPORT THIS
export default firebaseConfig;