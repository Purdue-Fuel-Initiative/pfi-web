import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
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

const cells = document.querySelectorAll("tbody td");   // 全部のマス
const summary = document.getElementById("summary");
const nameInput = document.getElementById("name-input");
const hoursInput = document.getElementById("hours-input");
const saveButton = document.getElementById("save-button");
const message = document.getElementById("message");
const result = document.getElementById("result");
 
    // 1. それぞれのマスに「クリックされたら実行する処理」をつける
cells.forEach(function (cell) {
  cell.addEventListener("click", function () {
    cell.classList.toggle("selected");   // ついていれば外す、なければつける
    updateSummary();
  });
});
 
    // 希望時間数を変えたときも、下の表示(差分)を更新する
hoursInput.addEventListener("input", updateSummary);
 
    // マスから「tue-10:00」のような目印の文字列を作る(曜日は td、時刻は親の tr が持っている)
function makeKey(cell) {
  return cell.dataset.day + "-" + cell.parentElement.dataset.time;
}
 
    // 選ばれているマスの目印を、配列(リスト)にして返す
function getSelectedSlots() {
  const slots = [];
  cells.forEach(function (cell) {
    if (cell.classList.contains("selected")) {
      slots.push(makeKey(cell));
    }
  });
  return slots;
}
 
    // 2. 「選んだ数」と「希望時間数との差」の表示を更新する(1マス = 30分 = 0.5時間)
function updateSummary() {
  const count = getSelectedSlots().length;
  const selectedHours = count * 0.5;
  const wanted = parseFloat(hoursInput.value);   // 空欄や数字以外なら NaN になる
 
  let text = "Selected: " + count + " slots (" + selectedHours + " hours)";
 
  if (!isNaN(wanted) && wanted > 0) {
    const diff = selectedHours - wanted;
    if (diff < 0) {
      text += " — " + Math.abs(diff) + " hrs below what you asked for";
    } else if (diff > 0) {
      text += " — " + diff + " hrs above what you asked for";
    } else {
      text += " — matches what you asked for";
    }
  }
 
  summary.textContent = text;
}

// 今が「受付期間中」かどうかを判定する
function isSubmissionOpen() {
  
  const now = new Date();
  const day = now.getDay();   // 0=日曜, 1=月曜, ..., 5=金曜, 6=土曜
  const hour = now.getHours();

  if (day === 5 && hour >= 12) return true;   // 金曜12:00以降
  if (day === 6) return true;                 // 土曜は終日
  if (day === 0) return true;                 // 日曜も終日(23:59まで)
  
  return false;
}

// ページが開いたときに1回チェックする
if (!isSubmissionOpen()) {
  // マスをクリックできなくする
  cells.forEach(function (cell) {
    cell.style.pointerEvents = "none";
    cell.style.opacity = "0.4";
  });

  // 名前欄・希望時間数欄・Saveボタンも無効にする
  nameInput.disabled = true;
  hoursInput.disabled = true;
  saveButton.disabled = true;

  // 案内文を出す
  message.textContent = "Submissions are closed. They open Friday at 12:00 PM and close Sunday at 11:59 PM.";
}
 
    // 3. Saveボタン
saveButton.addEventListener("click", function () {
  const name = nameInput.value.trim();
  const slots = getSelectedSlots();
  const wanted = parseFloat(hoursInput.value);
 
  if (name === "") {
    message.textContent = "Enter your name first.";
    return;
  }
  if (isNaN(wanted) || wanted <= 0) {
    message.textContent = "Enter how many hours you'd like per week.";
    return;
  }
  if (slots.length === 0) {
    message.textContent = "Select at least one time slot.";
    return;
  }
 
  message.textContent = "";
  saveAvailability({ name: name, hoursWanted: wanted, slots: slots });
});
 
    /* ------------------------------------------------
       保存する処理は、この関数の中だけにまとめてある。
       今は画面に表示するだけ。
       M3では、この中身をFirebaseへの保存に書き換える。
       ログインを入れるときも、渡す data の name を
       ログイン中のユーザー情報に変えるだけで済む。
       ------------------------------------------------ */
async function saveAvailability(data) {
  try {
    // "availability" というコレクションに、名前をIDにして保存する
    await setDoc(doc(db, "availability", data.name), data);

    // ちゃんと保存できたか、もう一度読み込んで確認する
    const savedDoc = await getDoc(doc(db, "availability", data.name));

    result.hidden = false;
    result.textContent = JSON.stringify(savedDoc.data(), null, 2);
    message.textContent = "Saved!";
  } catch (error) {
    message.textContent = "Something went wrong: " + error.message;
    console.error(error);
  }
}
