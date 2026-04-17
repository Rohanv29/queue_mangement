import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import firebaseConfig from "./firebase.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// SIGNUP FUNCTION
async function signup() {
  console.log("Signup clicked");

  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Signup successful");
    window.location.href = "index.html";
  } catch (err) {
    console.log(err);
    alert(err.message);
  }
}

// LOGIN FUNCTION
async function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful");
    window.location.href = "home.html";
  } catch (err) {
    alert(err.message);
  }
}

// LOGOUT
window.logout = async function () {
  await signOut(auth);
  window.location.href = "index.html";
};

// 🔐 PROTECT PAGES
onAuthStateChanged(auth, (user) => {
  const protectedPages = ["home.html", "admin.html", "display.html"];
  const currentPage = window.location.pathname.split("/").pop();

  if (protectedPages.includes(currentPage) && !user) {
    window.location.href = "index.html";
  }
});

// ✅ EVENT LISTENERS (BOTTOM ME — IMPORTANT)
document.getElementById("signupBtn")?.addEventListener("click", signup);
document.getElementById("loginBtn")?.addEventListener("click", login);