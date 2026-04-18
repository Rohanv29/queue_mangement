import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import firebaseConfig from "./firebase.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// ================= SIGNUP =================
async function signup() {
  const email = document.getElementById("signup-email")?.value;
  const password = document.getElementById("signup-password")?.value;

  if (!email || !password) {
    alert("Fill all fields");
    return;
  }

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    await setDoc(doc(db, "users", user.uid), {
      email: email,
      role: "user"
    });

    alert("Signup successful");
    window.location.href = "index.html";
  } catch (err) {
    alert(err.message);
  }
}


// ================= LOGIN =================
async function login() {
  const email = document.getElementById("login-email")?.value;
  const password = document.getElementById("login-password")?.value;

  if (!email || !password) {
    alert("Enter email & password");
    return;
  }

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    const snap = await getDoc(doc(db, "users", user.uid));

    if (!snap.exists()) {
      alert("No role found");
      return;
    }

    const role = snap.data().role;

    if (role === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "home.html";
    }

  } catch (err) {
    alert(err.message);
  }
}


// ================= LOGOUT =================
window.logout = async function () {
  await signOut(auth);
  window.location.href = "index.html";
};


// ================= ADMIN PROTECTION (FIXED) =================
function protectAdminPage() {
  const currentPage = window.location.pathname.split("/").pop();

  if (currentPage !== "admin.html") return;

  let checked = false; // 🔥 prevents multiple runs

  onAuthStateChanged(auth, async (user) => {
    if (checked) return;
    checked = true;

    if (!user) {
      window.location.replace("index.html");
      return;
    }

    try {
      const snap = await getDoc(doc(db, "users", user.uid));

      if (!snap.exists() || snap.data().role !== "admin") {
        window.location.replace("home.html");
      } else {
        // ✅ show page only after verification
        document.body.style.display = "block";
      }

    } catch (err) {
      console.error(err);
      window.location.replace("index.html");
    }
  });
}


// ================= INIT =================
protectAdminPage();


// ================= EVENTS =================
document.getElementById("signupBtn")?.addEventListener("click", signup);
document.getElementById("loginBtn")?.addEventListener("click", login);