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

// Execが作業中の割り当て(Assign/Removeのたびにここに書き込む。ホームページはここを直接見ない)
// 形: { slots: { "mon-14:00": ["Name1", "Name2"], ... } }
const ASSIGNMENTS_DOC = doc(db, "assignments", "week");

// Publishを押した瞬間にここへコピーされる、公開用のスナップショット。ホームページはこっちを見る。
const PUBLISHED_DOC = doc(db, "published", "current");

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

// 「tue-10:00のマスには誰がいるか」の対応表を作る。
// 同じ人が何度もavailabilityを送信してて同じスロットに重複して入ってても、1人1マス1回だけになるようにする。
function buildSlotMap(members) {
  const map = {};
  members.forEach(function (member) {
    (member.slots || []).forEach(function (slotKey) {
      if (!map[slotKey]) {
        map[slotKey] = [];
      }
      const alreadyThere = map[slotKey].some(function (m) { return m.name === member.name; });
      if (!alreadyThere) {
        map[slotKey].push(member);
      }
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

// そのスロットに出すべき名前の一覧を作る。
// 「今まだavailabilityにある人」と「assignmentsだけに残ってる人(Publishでavailabilityが消えた後の確定者)」の両方を含める。
function getDisplayNamesForSlot(slotKey) {
  const availableNames = (currentSlotMap[slotKey] || []).map(function (p) { return p.name; });
  const assignedNames = currentAssignments[slotKey] || [];
  const names = availableNames.slice();
  assignedNames.forEach(function (name) {
    if (names.indexOf(name) === -1) {
      names.push(name);
    }
  });
  return names;
}

// グリッドの各マスに、その時間にいる人(空いてる人+確定済みの人)のチップを並べる。
function renderGrid() {
  cells.forEach(function (cell) {
    const day = cell.dataset.day;
    const time = cell.parentElement.dataset.time;
    const slotKey = day + "-" + time;
    const names = getDisplayNamesForSlot(slotKey);

    cell.innerHTML = "";
    cell.classList.remove("has-people", "selected-slot");

    if (names.length > 0) {
      cell.classList.add("has-people");
      names.forEach(function (name) {
        const chip = document.createElement("div");
        chip.className = "chip";
        if (isAssigned(slotKey, name)) {
          chip.classList.add("assigned");
        }
        chip.textContent = initials(name);
        // availabilityが消えてて色が無い人は、グレーで出す
        chip.style.background = currentColorByName[name] || "#999999";
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

// クリックされたマスの「曜日・時刻」「その時間の人のフルネーム一覧」「Assign/Removeボタン」を出す
function renderSlotDetail(day, time) {
  const slotKey = day + "-" + time;
  const names = getDisplayNamesForSlot(slotKey);
  const label = (DAY_LABELS[day] || day) + " " + time;

  if (names.length === 0) {
    slotDetail.innerHTML =
      "<p class='slot-detail-time'>" + label + "</p>" +
      "<p class='slot-detail-empty'>No one marked themselves available at this time.</p>";
    return;
  }

  let html =
    "<p class='slot-detail-time'>" + label + " — " + names.length + "</p>" +
    "<ul class='slot-detail-list'>";

  names.forEach(function (name) {
    const color = currentColorByName[name] || "#999999";
    const assigned = isAssigned(slotKey, name);
    // availabilityがもう無い(Publish後に残ってる確定者)人は、Assignし直せないのでRemoveだけ出す
    const hasAvailability = (currentSlotMap[slotKey] || []).some(function (p) { return p.name === name; });
    const showButton = assigned || hasAvailability;
    html +=
      "<li>" +
        "<i class='swatch on' style='background:" + color + ";border-color:" + color + "'></i>" +
        "<span>" + name + (assigned && !hasAvailability ? " (confirmed, no longer in this week's submissions)" : "") + "</span>" +
        (showButton ?
          "<button type='button' class='" + (assigned ? "remove-btn" : "assign-btn") + "' " +
            "data-day='" + day + "' data-time='" + time + "' data-name='" + name + "'>" +
            (assigned ? "Remove" : "Assign") +
          "</button>"
          : "") +
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
//   1. 今の assignments(Execが組んだ割り当て)を published/current にコピーする → ホームページはこれを見る
//   2. availability コレクションのドキュメントを全部消す(=メンバーの入力を次の週に向けてリセット)
//   3. assignments(作業中の割り当て)もクリアして、Execが次の週をまっさらから組めるようにする
async function publishAndReset() {
  const confirmed = window.confirm(
    "This will publish the current assignments to the homepage, delete everyone's submitted availability, " +
    "and clear the working assignment board so you can start fresh for next week. This can't be undone. Continue?"
  );
  if (!confirmed) {
    return;
  }

  publishButton.disabled = true;
  publishMessage.hidden = true;

  try {
    // 1. 公開用のスナップショットに今のassignmentsをコピー(前のPublish内容は丸ごと上書き)
    await setDoc(PUBLISHED_DOC, { slots: currentAssignments }, { merge: false });

    // 2. availabilityを全部消す
    const snapshot = await getDocs(collection(db, "availability"));
    const deletions = [];
    snapshot.forEach(function (docSnap) {
      deletions.push(deleteDoc(docSnap.ref));
    });
    await Promise.all(deletions);

    // 3. 作業中のassignmentsもクリア(次の週はまっさらから)
    await setDoc(ASSIGNMENTS_DOC, { slots: {} }, { merge: false });

    // 画面側の状態もリセットして、入力が無くなったことを反映する
    currentMembers = [];
    currentSlotMap = {};
    currentColorByName = {};
    currentAssignments = {};
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

// 同じ名前のドキュメントが複数あったら、一番最後のものだけ残す(ロスター・凡例の重複防止)
function dedupeByName(members) {
  const byName = {};
  members.forEach(function (member) {
    byName[member.name] = member;
  });
  return Object.values(byName);
}

async function init() {
  currentMembers = dedupeByName(await loadMembers());
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
