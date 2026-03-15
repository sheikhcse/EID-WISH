import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, ref, onValue, set, get } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCMQgtwUGSuwWPH2ZnI1Ihp6XKcxop_FI90E",
  authDomain: "eid-surprise-6f2c0.firebaseapp.com",
  databaseURL: "https://eid-surprise-6f2c0-default-rtdb.firebaseio.com",
  projectId: "eid-surprise-6f2c0",
  storageBucket: "eid-surprise-6f2c0.firebasestorage.app",
  messagingSenderId: "618352884835",
  appId: "1:618352884835:web:01166b60d1c62ce1e4c56",
  measurementId: "G-KLCJZ3789P"
};

const adminPassword = "Jannat";
const chandRaatAutoDate = new Date("2026-03-21T18:00:00");

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const unlockRef = ref(db, "eid2026/chandRaatUnlocked");

let countdownStarted = false;
let isAdmin = false;
let isUnlocked = false;
let eidModeShown = false;
let giftOpened = false;

const welcomeScreen = document.getElementById("welcomeScreen");
const welcomeCard = document.getElementById("welcomeCard");
const mainContent = document.getElementById("mainContent");
const countdownEl = document.getElementById("countdown");
const countdownView = document.getElementById("countdownView");
const eidView = document.getElementById("eidView");
const content = document.getElementById("content");
const messageBox = document.getElementById("messageBox");
const eidiBox = document.getElementById("eidiBox");
const sky = document.getElementById("sky");
const lanternLayer = document.getElementById("lanternLayer");
const eidTitle = document.getElementById("eidTitle");
const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
const publicStatus = document.getElementById("publicStatus");
const adminPanel = document.getElementById("adminPanel");
const adminStatus = document.getElementById("adminStatus");
const lockBox = document.getElementById("lockBox");
const eidPopup = document.getElementById("eidPopup");
const moonWrap = document.querySelector(".moon-wrap");

if (bgMusic) bgMusic.volume = 0.35;

function makeStars(){
  for(let i = 0; i < 56; i++){
    const star = document.createElement("span");
    star.className = "star";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.animationDelay = (Math.random() * 4) + "s";
    star.style.opacity = Math.random().toFixed(2);
    sky.appendChild(star);
  }
}

function makeLanterns(){
  const lanternPositions = [8, 18, 82, 92];
  lanternPositions.forEach((x, idx) => {
    const l = document.createElement("div");
    l.className = "lantern";
    l.style.left = x + "%";
    l.style.top = (idx % 2 === 0 ? 12 : 18) + "px";
    l.style.animationDelay = (idx * 0.6) + "s";
    lanternLayer.appendChild(l);
  });
}

makeStars();
makeLanterns();

const messages = [
  "Hope your Eid is full of smiles 😊",
  "May your day be peaceful, cozy, and pretty 🌙",
  "Hope your Eidi mood stays high all day 😄",
  "May your selfies come out perfect on the first try 📸",
  "Good food, soft moments, and zero awkward relative questions ✨",
  "Eat first, be cute later. Eid priorities 🍰",
  "May your plate stay full and your problems stay quiet 😌"
];

window.randomMessage = function(){
  const random = messages[Math.floor(Math.random() * messages.length)];
  messageBox.textContent = random;
};

window.eidi = function(){
  eidiBox.textContent = "You received 0.00000001 tk virtual Eidi 😄";
};

function fireworksBurst(){
  if (!window.confetti) return;
  window.confetti({ particleCount: 220, spread: 140, origin: { y: 0.6 } });
  setTimeout(() => {
    window.confetti({ particleCount: 140, spread: 100, origin: { y: 0.55 } });
  }, 400);
  setTimeout(() => {
    window.confetti({ particleCount: 180, spread: 160, origin: { y: 0.5 } });
  }, 850);
}

window.celebrate = function(){
  fireworksBurst();
};

window.secretSurprise = function(){
  fireworksBurst();
  messageBox.textContent = "Secret Eid surprise unlocked ✨ Tiny joy delivered successfully 😌";
  eidiBox.textContent = "Bonus hidden Eidi: 0.00000001 tk + extra Eid vibe 🎁";
};

window.toggleMusic = function(){
  if (bgMusic.paused) {
    bgMusic.play().then(() => {
      musicBtn.textContent = "Pause soft music 🎵";
    }).catch(() => {
      messageBox.textContent = "Music file add korle song play hobe 🎵";
    });
  } else {
    bgMusic.pause();
    musicBtn.textContent = "Play soft music 🎵";
  }
};

function hidePopup(){
  eidPopup.classList.remove("show");
  eidPopup.classList.add("hidden");
  eidPopup.style.display = "none";
}

function openPopup(){
  eidPopup.classList.remove("hidden");
  eidPopup.classList.add("show");
  eidPopup.style.display = "flex";

  setTimeout(() => {
    hidePopup();
  }, 2000);
}

window.openGift = function(){
  if (giftOpened) return;
  giftOpened = true;
  openPopup();
  fireworksBurst();
  eidiBox.textContent = "Gift opened successfully 🎁";
};

function updateCountdown(){
  const now = new Date();
  const diff = chandRaatAutoDate.getTime() - now.getTime();

  if (diff <= 0) {
    countdownEl.textContent = "Chand Raat is here 🌙";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  countdownEl.textContent = `${days}d ${hours}h ${mins}m ${secs}s`;
}

function startCountdown(){
  if (countdownStarted) return;
  countdownStarted = true;
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function showLockedView(){
  countdownView.classList.remove("hidden");
  lockBox.classList.remove("hidden");
  eidView.classList.add("hidden");
  content.classList.add("hidden");
  hidePopup();
  giftOpened = false;
  eidModeShown = false;
}

function showEidMode(){
  countdownView.classList.add("hidden");
  eidView.classList.remove("hidden");
  content.classList.remove("hidden");
  lockBox.classList.add("hidden");
  eidTitle.classList.add("reveal-animate");

  if (!eidModeShown) {
    eidModeShown = true;

    if (moonWrap) {
      moonWrap.classList.add("moon-glow-strong");
    }

    openPopup();
    fireworksBurst();

    if (bgMusic && bgMusic.paused) {
      bgMusic.play().then(() => {
        musicBtn.textContent = "Pause soft music 🎵";
      }).catch(() => {
        messageBox.textContent = "Music file add korle song play hobe 🎵";
      });
    }
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

window.enterPage = function(){
  welcomeCard.classList.add("opening");
  setTimeout(() => {
    welcomeScreen.classList.add("hidden");
    mainContent.classList.remove("hidden");
    mainContent.classList.add("showing");
    startCountdown();
  }, 650);
};

window.tryOpenEidContent = function(){
  if (isUnlocked || isAdmin) {
    showEidMode();
  } else {
    showLockedView();
    if (publicStatus) {
      publicStatus.textContent = "Locked by admin. You cannot open it now 🔒";
      publicStatus.className = "status danger";
    }
  }
};

window.openAdminLogin = function(){
  const entered = prompt("Enter admin password:");
  if (!entered) return;

  if (entered === adminPassword) {
    isAdmin = true;
    welcomeScreen.classList.add("hidden");
    mainContent.classList.remove("hidden");
    mainContent.classList.add("showing");
    adminPanel.classList.remove("hidden");
    adminStatus.textContent = "Admin mode active. Tumi sob dekhte parbe.";
    adminStatus.className = "status ok";

    if (publicStatus) {
      publicStatus.textContent = "Admin mode: full control active.";
      publicStatus.className = "status ok";
    }

    startCountdown();
  } else {
    alert("Wrong password");
  }
};

window.openEverythingForAdmin = function(){
  if (!isAdmin) return;
  showEidMode();
};

window.unlockForEveryone = async function(){
  if (!isAdmin) return;
  await set(unlockRef, true);
  adminStatus.textContent = "Unlocked for everyone. Ora jekono time page open korte parbe.";
  adminStatus.className = "status ok";
};

window.lockForEveryone = async function(){
  if (!isAdmin) return;
  await set(unlockRef, false);
  adminStatus.textContent = "Locked again. Ora ekhon page open korte parbe na.";
  adminStatus.className = "status danger";
};

onValue(unlockRef, (snapshot) => {
  const wasUnlocked = isUnlocked;
  isUnlocked = snapshot.val() === true;

  if (isUnlocked) {
    if (publicStatus) {
      publicStatus.textContent = "Unlocked by admin. You can open it now 🌙";
      publicStatus.className = "status ok";
    }

    if (!wasUnlocked && !isAdmin && !mainContent.classList.contains("hidden")) {
      showEidMode();
    }
  } else {
    if (publicStatus) {
      publicStatus.textContent = "Locked by admin. You cannot open it now 🔒";
      publicStatus.className = "status danger";
    }

    if (!isAdmin && !mainContent.classList.contains("hidden")) {
      showLockedView();
    }
  }

  updateCountdown();
});

get(unlockRef).then((snap) => {
  if (!snap.exists()) {
    set(unlockRef, false);
  }
}).catch((error) => {
  console.error("Firebase read error:", error);
});
