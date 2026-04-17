import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
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

// 🔴 PASTE YOUR CONFIG HERE
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const queueRef = collection(db, "queue");

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
  await addDoc(queueRef, {
    name: name,
    time: Date.now()
  });
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