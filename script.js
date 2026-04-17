import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import firebaseConfig from "./firebase.js";



const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const queueRef = collection(db, "queue");
function formatTime(timestamp) {
  const date = new Date(timestamp);

  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

  return hours + ":" + formattedMinutes;
}
// ✅ LISTEN QUEUE
window.listenToQueue = function (callback) {
  const q = query(queueRef, orderBy("time"));

  onSnapshot(q, (snapshot) => {
    let queue = [];
    let count = 1;

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      queue.push({
        id: docSnap.id,
        name: data.name,
        tokenNumber: count++,
        timestamp: data.time
      });
    });

    callback(queue);
  });
};

// ✅ ADD USER
window.joinQueue = async function (name) {
  const user = auth.currentUser;

  if (!user) {
    alert("Login required");
    return;
  }

  const now = Date.now();

  const snapshot = await getDocs(query(queueRef, orderBy("time")));
  const token = snapshot.size + 1;

  await addDoc(queueRef, {
    name: name,
    time: now,
    userId: user.uid
  });

  return {
    tokenNumber: token,
    joinTime: now
  };
};

// ✅ SERVE NEXT
window.serveNext = async function () {
  const q = query(queueRef, orderBy("time"));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const first = snapshot.docs[0];
  const data = first.data();

  await deleteDoc(doc(db, "queue", first.id));

  return {
    name: data.name,
    tokenNumber: 1
  };
};

// ✅ REMOVE USER
window.removeFromQueue = async function (id) {
  await deleteDoc(doc(db, "queue", id));
};

// ✅ CURRENT SERVING (basic version)
window.listenToCurrentServing = function (callback) {
  callback(null); // simple for now
};