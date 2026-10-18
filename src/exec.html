import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

const cells = document.querySelectorAll("tbody td");
const roster = document.getElementById("roster");
const legend = document.getElementById("legend");
const slotDetail = document.getElementById("slot-detail");   // M5で追加: クリックした時間の詳細を出す場所

// 曜日の略称 → 表示用ラベル(M5のパネルで「Mon 14:00」みたいに出すために使う)
const DAY_LABELS = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu" };

// 人ごとに色を順番に割り当てる(何人になっても足りるよう、6色を使い回す)
const COLORS = ["#cfb991", "#4a6670", "#a9622f", "#6b5b7b", "#3f7d5c", "#b23b3b"];

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
// M5: ここでマスごとに「クリックされたら何を表示するか(slotKey・people)」も一緒に仕込んでおく。
function renderGrid(members, slotMap) {
  const colorByName = {};
  members.forEach(function (member, i) {
    colorByName[member.name] = colorForIndex(i);
  });

  cells.forEach(function (cell) {
    const day = cell.dataset.day;
    const time = cell.parentElement.dataset.time;
    const slotKey = day + "-" + time;
    const people = slotMap[slotKey] || [];

    cell.innerHTML = "";
    cell.classList.remove("has-people", "selected-slot");

    if (people.length > 0) {
      cell.classList.add("has-people");
      people.forEach(function (person) {
        const chip = document.createElement("div");
        chip.className = "chip";
        chip.textContent = initials(person.name);
        chip.style.background = colorByName[person.name];
        cell.appendChild(chip);
      });
    }

    // M5: マスをタップ(クリック)したら、その時間に空いてる人を下のパネルに表示する
    cell.onclick = function () {
      cells.forEach(function (c) { c.classList.remove("selected-slot"); });
      cell.classList.add("selected-slot");
      renderSlotDetail(day, time, people, colorByName);
    };
  });
}

// M5: クリックされたマスの「曜日・時刻」と「その時間に空いてる人のフルネーム一覧」をパネルに出す
function renderSlotDetail(day, time, people, colorByName) {
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
    const color = colorByName[person.name];
    html +=
      "<li><i class='swatch on' style='background:" + color + ";border-color:" + color + "'></i>" +
      person.name + "</li>";
  });
  html += "</ul>";
  slotDetail.innerHTML = html;
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

async function init() {
  const members = await loadMembers();
  const slotMap = buildSlotMap(members);

  renderLegend(members);
  renderGrid(members, slotMap);
  renderRosterList(members);
}

init();
