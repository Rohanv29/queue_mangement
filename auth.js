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
    window.location.replace("index.html");
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

    const docRef = doc(db, "users", user.uid);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      alert("No role found");
      return;
    }

    const role = snap.data().role;

    console.log("ROLE:", role);

    if (role === "admin") {
      window.location.replace("admin.html");
    } else {
      window.location.replace("home.html");
    }

  } catch (err) {
    alert(err.message);
  }
}


// ================= LOGOUT =================
window.logout = async function () {
  await signOut(auth);
  window.location.replace("index.html");
};


// ================= GLOBAL AUTH CONTROL =================
function handleRouting(user) {
  const currentPage = window.location.pathname.split("/").pop();

  // Not logged in
  if (!user) {
    if (currentPage !== "index.html" && currentPage !== "signup.html") {
      window.location.replace("index.html");
    }
    return;
  }

  // Logged in → check role
  (async () => {
    const docRef = doc(db, "users", user.uid);
    const snap = await getDoc(docRef);

    if (!snap.exists()) return;

    const role = snap.data().role;

    console.log("AUTH ROLE:", role);

    // Admin routing
    if (role === "admin") {
      if (currentPage !== "admin.html") {
        window.location.replace("admin.html");
      }
    }

    // User routing
    if (role === "user") {
      if (currentPage === "admin.html") {
        window.location.replace("home.html");
      }
    }
  })();
}


// ================= AUTH LISTENER =================
onAuthStateChanged(auth, (user) => {
  handleRouting(user);
});


// ================= EVENT LISTENERS =================
document.getElementById("signupBtn")?.addEventListener("click", signup);
document.getElementById("loginBtn")?.addEventListener("click", login);