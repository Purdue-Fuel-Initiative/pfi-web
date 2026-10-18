import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyArS_lN0ekRaZApytFoneEoQIxpQctlM3E",
  authDomain: "power-and-fuel-initiative.firebaseapp.com",
  projectId: "power-and-fuel-initiative",
  storageBucket: "power-and-fuel-initiative.firebasestorage.app",
  messagingSenderId: "251543698776",
  appId: "1:251543698776:web:8b7e81574c492137f2392d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ASSIGNMENTS_DOC = doc(db, "assignments", "week");

const cells = document.querySelectorAll("tbody td");
const emptyNote = document.getElementById("empty-note");

// 確定済みの割り当てを読み込んで、各マスに名前を表示するだけ(クリック操作は無し)
async function init() {
  const snap = await getDoc(ASSIGNMENTS_DOC);
  const slots = snap.exists() ? (snap.data().slots || {}) : {};

  let anyConfirmed = false;

  cells.forEach(function (cell) {
    const slotKey = cell.dataset.day + "-" + cell.parentElement.dataset.time;
    const names = slots[slotKey] || [];

    cell.innerHTML = "";
    if (names.length > 0) {
      anyConfirmed = true;
      cell.classList.add("has-people");
      names.forEach(function (name) {
        const tag = document.createElement("div");
        tag.className = "confirmed-name";
        tag.textContent = name;
        cell.appendChild(tag);
      });
    }
  });

  emptyNote.hidden = anyConfirmed;
}

init();
