import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

// 確定した人を入れておくドキュメント。週ごとに1つのドキュメントにまとめる。
// 形: { slots: { "mon-14:00": ["Name1", "Name2"], ... } }
const ASSIGNMENTS_DOC = doc(db, "assignments", "week");

const cells = document.querySelectorAll("tbody td");
const roster = document.getElementById("roster");
const legend = document.getElementById("legend");
const slotDetail = document.getElementById("slot-detail");
const publishButton = document.getElementById("publish-button");       // M8で追加
const publishMessage = document.getElementById("publish-message");     // M8で追加

// 曜日の略称 → 表示用ラベル
const DAY_LABELS = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu" };

// 人ごとに色を順番に割り当てる(何人になっても足りるよう、6色を使い回す)
const COLORS = ["#cfb991", "#4a6670", "#a9622f", "#6b5b7b", "#3f7d5c", "#b23b3b"];

// 今の画面の状態を覚えておく変数(Assign/Removeのあとに再描画するために使う)
let currentMembers = [];
let currentSlotMap = {};
let currentColorByName = {};
let currentAssignments = {};        // { "mon-14:00": ["Name1", ...], ... }
let currentSelected = null;         // { day, time } どのマスが選ばれてるか

function colorForIndex(i) {
  return COLORS[i % COLORS.length];
}

// 名前から頭文字を作る(例: "Ryunosuke Matsuda" → "RM")
function initials(name) {
  return name.trim().split(/\s+/).map(function (part) {
    return part[0].toUpperCase();
  }).slice(0, 2).join("");
}

// Firestoreから、全員分の空き時間データを取ってくる
async function loadMembers() {
  const snapshot = await getDocs(collection(db, "availability"));
  const members = [];
  snapshot.forEach(function (docSnap) {
    members.push(docSnap.data());
  });
  return members;
}

// Firestoreから、確定済みの割り当てを取ってくる(まだ無ければ空の状態で返す)
async function loadAssignments() {
  const snap = await getDoc(ASSIGNMENTS_DOC);
  if (!snap.exists()) {
    return {};
  }
  return snap.data().slots || {};
}

// 「tue-10:00のマスには誰がいるか」の対応表を作る
function buildSlotMap(members) {
  const map = {};
  members.forEach(function (member) {
    (member.slots || []).forEach(function (slotKey) {
      if (!map[slotKey]) {
        map[slotKey] = [];
      }
      map[slotKey].push(member);
    });
  });
  return map;
}

// その人がそのマスで「確定済み」かどうか
function isAssigned(slotKey, name) {
  return (currentAssignments[slotKey] || []).includes(name);
}

// M7: その人が、今すでに何時間分アサインされてるか(1マス=30分=0.5時間として数える)
function getAssignedHours(name) {
  let slots = 0;
  Object.keys(currentAssignments).forEach(function (slotKey) {
    if (currentAssignments[slotKey].includes(name)) {
      slots += 1;
    }
  });
  return slots * 0.5;
}

// 凡例(誰が何色か)を表示する
function renderLegend(members) {
  legend.innerHTML = "";
  members.forEach(function (member, i) {
    const span = document.createElement("span");
    const swatch = document.createElement("i");
    swatch.className = "swatch on";
    swatch.style.background = colorForIndex(i);
    swatch.style.borderColor = colorForIndex(i);
    span.appendChild(swatch);
    span.append(" " + member.name);
    legend.appendChild(span);
  });
}

// グリッドの各マスに、その時間にいる人のチップを並べる。
function renderGrid() {
  cells.forEach(function (cell) {
    const day = cell.dataset.day;
    const time = cell.parentElement.dataset.time;
    const slotKey = day + "-" + time;
    const people = currentSlotMap[slotKey] || [];

    cell.innerHTML = "";
    cell.classList.remove("has-people", "selected-slot");

    if (people.length > 0) {
      cell.classList.add("has-people");
      people.forEach(function (person) {
        const chip = document.createElement("div");
        chip.className = "chip";
        if (isAssigned(slotKey, person.name)) {
          chip.classList.add("assigned");
        }
        chip.textContent = initials(person.name);
        chip.style.background = currentColorByName[person.name];
        cell.appendChild(chip);
      });
    }

    if (currentSelected && currentSelected.day === day && currentSelected.time === time) {
      cell.classList.add("selected-slot");
    }

    // マスをタップ(クリック)したら、その時間に空いてる人を下のパネルに表示する
    cell.onclick = function () {
      currentSelected = { day: day, time: time };
      renderGrid();
      renderSlotDetail(day, time);
    };
  });
}

// クリックされたマスの「曜日・時刻」「空いてる人のフルネーム一覧」「Assign/Removeボタン」を出す
function renderSlotDetail(day, time) {
  const slotKey = day + "-" + time;
  const people = currentSlotMap[slotKey] || [];
  const label = (DAY_LABELS[day] || day) + " " + time;

  if (people.length === 0) {
    slotDetail.innerHTML =
      "<p class='slot-detail-time'>" + label + "</p>" +
      "<p class='slot-detail-empty'>No one marked themselves available at this time.</p>";
    return;
  }

  let html =
    "<p class='slot-detail-time'>" + label + " — " + people.length + " available</p>" +
    "<ul class='slot-detail-list'>";

  people.forEach(function (person) {
    const color = currentColorByName[person.name];
    const assigned = isAssigned(slotKey, person.name);
    html +=
      "<li>" +
        "<i class='swatch on' style='background:" + color + ";border-color:" + color + "'></i>" +
        "<span>" + person.name + "</span>" +
        "<button type='button' class='" + (assigned ? "remove-btn" : "assign-btn") + "' " +
          "data-day='" + day + "' data-time='" + time + "' data-name='" + person.name + "'>" +
          (assigned ? "Remove" : "Assign") +
        "</button>" +
      "</li>";
  });

  html += "</ul>";
  slotDetail.innerHTML = html;

  // ボタンにクリック処理をつける(Assign/Removeどっちもここでまとめて拾う)
  slotDetail.querySelectorAll(".assign-btn, .remove-btn").forEach(function (button) {
    button.addEventListener("click", function () {
      const name = button.dataset.name;
      const key = button.dataset.day + "-" + button.dataset.time;
      if (button.classList.contains("assign-btn")) {
        assignPerson(key, name);
      } else {
        removePerson(key, name);
      }
    });
  });
}

// M7: この人をこの時間に確定させる前に、2つチェックする。
//   1. 同じ人を同じ時間に2回Assignしようとしてないか
//   2. 確定させると、本人の希望時間数(hoursWanted)を超えてしまわないか
async function assignPerson(slotKey, name) {
  // チェック1: 二重Assign
  if (isAssigned(slotKey, name)) {
    alert(name + " is already assigned to this slot.");
    return;
  }

  // チェック2: 希望時間数オーバー
  const member = currentMembers.find(function (m) { return m.name === name; });
  const hoursSoFar = getAssignedHours(name);
  const hoursAfter = hoursSoFar + 0.5;

  if (member && typeof member.hoursWanted === "number" && hoursAfter > member.hoursWanted) {
    const proceed = window.confirm(
      name + " asked for " + member.hoursWanted + " hrs/week, but this would put them at " +
      hoursAfter + " hrs. Assign anyway?"
    );
    if (!proceed) {
      return;
    }
  }

  await setDoc(ASSIGNMENTS_DOC, { slots: { [slotKey]: arrayUnion(name) } }, { merge: true });

  if (!currentAssignments[slotKey]) {
    currentAssignments[slotKey] = [];
  }
  if (!currentAssignments[slotKey].includes(name)) {
    currentAssignments[slotKey].push(name);
  }

  renderGrid();
  if (currentSelected) {
    renderSlotDetail(currentSelected.day, currentSelected.time);
  }
}

// 確定を取り消す(Firestoreから外してから、画面を更新する)
async function removePerson(slotKey, name) {
  await setDoc(ASSIGNMENTS_DOC, { slots: { [slotKey]: arrayRemove(name) } }, { merge: true });

  if (currentAssignments[slotKey]) {
    currentAssignments[slotKey] = currentAssignments[slotKey].filter(function (n) {
      return n !== name;
    });
  }

  renderGrid();
  if (currentSelected) {
    renderSlotDetail(currentSelected.day, currentSelected.time);
  }
}

// 右側のロスター(名前と希望時間数のリスト)を表示する
function renderRosterList(members) {
  roster.innerHTML = "<h2>Roster</h2>";
  members.forEach(function (member) {
    const row = document.createElement("div");
    row.className = "roster-row";
    row.innerHTML =
      "<span class='roster-name'>" + member.name + "</span>" +
      "<span class='roster-hours'>" + member.hoursWanted + " hrs requested</span>";
    roster.appendChild(row);
  });
}

// M8: Publishボタンの処理。
//   - availability コレクションのドキュメントを全部消す(=メンバーの入力を次の週に向けてリセット)
//   - assignments(今週確定した割り当て)はそのまま残す
async function publishAndReset() {
  const confirmed = window.confirm(
    "This will permanently delete everyone's submitted availability, so members can submit fresh for next week. " +
    "Confirmed assignments will be kept. This can't be undone. Continue?"
  );
  if (!confirmed) {
    return;
  }

  publishButton.disabled = true;
  publishMessage.hidden = true;

  try {
    const snapshot = await getDocs(collection(db, "availability"));
    const deletions = [];
    snapshot.forEach(function (docSnap) {
      deletions.push(deleteDoc(docSnap.ref));
    });
    await Promise.all(deletions);

    // 画面側の状態もリセットして、入力が無くなったことを反映する
    currentMembers = [];
    currentSlotMap = {};
    currentColorByName = {};
    currentSelected = null;

    renderLegend(currentMembers);
    renderGrid();
    renderRosterList(currentMembers);

    publishMessage.textContent = "Published. Availability has been reset for next week.";
    publishMessage.hidden = false;
  } catch (err) {
    publishMessage.textContent = "Something went wrong while resetting availability: " + err.message;
    publishMessage.hidden = false;
  } finally {
    publishButton.disabled = false;
  }
}

publishButton.addEventListener("click", publishAndReset);

async function init() {
  currentMembers = await loadMembers();
  currentSlotMap = buildSlotMap(currentMembers);
  currentAssignments = await loadAssignments();

  currentColorByName = {};
  currentMembers.forEach(function (member, i) {
    currentColorByName[member.name] = colorForIndex(i);
  });

  renderLegend(currentMembers);
  renderGrid();
  renderRosterList(currentMembers);
}

init();
