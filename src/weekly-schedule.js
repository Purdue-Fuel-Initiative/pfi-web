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

// ExecがPublishを押した時だけ更新される、公開用のスナップショットを見る(作業中のassignmentsは見ない)
const PUBLISHED_DOC = doc(db, "published", "current");

const cells = document.querySelectorAll("tbody td");
const emptyNote = document.getElementById("empty-note");
const slotDetail = document.getElementById("slot-detail");

const DAY_LABELS = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu" };

let currentSlots = {};     // { "mon-14:00": ["Name1", "Name2"], ... }
let currentSelected = null;

// マスをクリックしたら、その時間の確定者をパネルに出すだけ(編集操作は無い)
function renderSlotDetail(day, time) {
  const slotKey = day + "-" + time;
  const names = currentSlots[slotKey] || [];
  const label = (DAY_LABELS[day] || day) + " " + time;

  if (names.length === 0) {
    slotDetail.innerHTML =
      "<p class='slot-detail-time'>" + label + "</p>" +
      "<p class='slot-detail-empty'>No one is confirmed for this time yet.</p>";
    return;
  }

  let html = "<p class='slot-detail-time'>" + label + " — " + names.length + " confirmed</p><ul class='slot-detail-list'>";
  names.forEach(function (name) {
    html += "<li><span>" + name + "</span></li>";
  });
  html += "</ul>";
  slotDetail.innerHTML = html;
}

function renderGrid() {
  cells.forEach(function (cell) {
    const day = cell.dataset.day;
    const time = cell.parentElement.dataset.time;
    const slotKey = day + "-" + time;
    const names = currentSlots[slotKey] || [];

    cell.classList.remove("has-people", "selected-slot");
    if (names.length > 0) {
      cell.classList.add("has-people");
    }
    if (currentSelected && currentSelected.day === day && currentSelected.time === time) {
      cell.classList.add("selected-slot");
    }

    cell.onclick = function () {
      currentSelected = { day: day, time: time };
      renderGrid();
      renderSlotDetail(day, time);
    };
  });
}

async function init() {
  const snap = await getDoc(PUBLISHED_DOC);
  currentSlots = snap.exists() ? (snap.data().slots || {}) : {};

  const anyConfirmed = Object.keys(currentSlots).some(function (key) {
    return currentSlots[key] && currentSlots[key].length > 0;
  });

  emptyNote.hidden = anyConfirmed;
  renderGrid();
}

init();
