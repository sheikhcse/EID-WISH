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

/* আজ সন্ধ্যা 6:30 PM পর্যন্ত countdown */
const countdownTargetDate = new Date("2026-03-20T18:30:00");

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
const adminPanel = document.getElementById("adminPanel");
const adminStatus = document.getElementById("adminStatus");
const lockBox = document.getElementById("lockBox");
const eidPopup = document.getElementById("eidPopup");
const moonWrap = document.querySelector(".moon-wrap");

if (bgMusic) {
  bgMusic.volume = 0.35;
}

function makeStars() {
  if (!sky) return;

  for (let i = 0; i < 56; i++) {
    const star = document.createElement("span");
    star.className = "star";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.animationDelay = Math.random() * 4 + "s";
    star.style.opacity = Math.random().toFixed(2);
    sky.appendChild(star);
  }
}

function makeLanterns() {
  if (!lanternLayer) return;

  const lanternPositions = [8, 18, 82, 92];
  lanternPositions.forEach((x, idx) => {
    const lantern = document.createElement("div");
    lantern.className = "lantern";
    lantern.style.left = x + "%";
    lantern.style.top = (idx % 2 === 0 ? 12 : 18) + "px";
    lantern.style.animationDelay = idx * 0.6 + "s";
    lanternLayer.appendChild(lantern);
  });
}

makeStars();
makeLanterns();

const messages = [
  "Hope your Eid is full of smiles 😊",
  "May your day be peaceful, cozy, and pretty 🌙",
  "Hope your Eid mood stays soft and happy all day 😄",
  "May your selfies come out perfect on the first try 📸",
  "Good food, soft moments, and zero awkward relative questions ✨",
  "Eat first, be cute later. Eid priorities 🍰",
  "May your plate stay full and your worries stay quiet 😌"
];

window.randomMessage = function () {
  if (!messageBox) return;
  const random = messages[Math.floor(Math.random() * messages.length)];
  messageBox.textContent = random;
};

window.eidi = function () {
  if (!eidiBox) return;
  eidiBox.textContent = "You received 0.00000001 tk virtual Eidi 😄";
};

function fireworksBurst() {
  if (!window.confetti) return;

  window.confetti({
    particleCount: 220,
    spread: 140,
    origin: { y: 0.6 }
  });

  setTimeout(() => {
    window.confetti({
      particleCount: 140,
      spread: 100,
      origin: { y: 0.55 }
    });
  }, 400);

  setTimeout(() => {
    window.confetti({
      particleCount: 180,
      spread: 160,
      origin: { y: 0.5 }
    });
  }, 850);
}

window.celebrate = function () {
  fireworksBurst();
};

window.secretSurprise = function () {
  fireworksBurst();

  if (messageBox) {
    messageBox.textContent = "Secret Eid surprise unlocked ✨ Tiny joy delivered successfully 😌";
  }

  if (eidiBox) {
    eidiBox.textContent = "Bonus hidden Eidi: 0.00000001 tk + extra Eid vibe 🎁";
  }
};

window.toggleMusic = function () {
  if (!bgMusic || !musicBtn) return;

  if (bgMusic.paused) {
    bgMusic.volume = 0.35;
    bgMusic.play()
      .then(() => {
        musicBtn.textContent = "Pause soft music 🎵";
      })
      .catch((error) => {
        console.error("Play error:", error);
      });
  } else {
    bgMusic.pause();
    musicBtn.textContent = "Play soft music 🎵";
  }
};

function hidePopup() {
  if (!eidPopup) return;
  eidPopup.classList.remove("show");
  eidPopup.classList.add("hidden");
  eidPopup.style.display = "none";
}

function openPopup() {
  if (!eidPopup) return;

  eidPopup.classList.remove("hidden");
  eidPopup.classList.add("show");
  eidPopup.style.display = "flex";

  setTimeout(() => {
    hidePopup();
  }, 2000);
}

window.openGift = function () {
  if (giftOpened) return;

  giftOpened = true;
  fireworksBurst();
  openPopup();

  if (eidiBox) {
    eidiBox.textContent = "Gift opened successfully 🎁";
  }
};

function updateCountdown() {
  if (!countdownEl) return;

  const now = new Date();
  const diff = countdownTargetDate.getTime() - now.getTime();

  if (diff <= 0) {
    countdownEl.textContent = "The wait is over 🌙";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  countdownEl.textContent = `${days}d ${hours}h ${mins}m ${secs}s`;
}

function startCountdown() {
  if (countdownStarted) return;
  countdownStarted = true;
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function showLockedView() {
  if (countdownView) countdownView.classList.remove("hidden");
  if (lockBox) lockBox.classList.remove("hidden");
  if (eidView) eidView.classList.add("hidden");
  if (content) content.classList.add("hidden");

  hidePopup();
  giftOpened = false;
  eidModeShown = false;
}

function showEidMode() {
  if (countdownView) countdownView.classList.add("hidden");
  if (eidView) eidView.classList.remove("hidden");
  if (content) content.classList.remove("hidden");
  if (lockBox) lockBox.classList.add("hidden");

  if (eidTitle) {
    eidTitle.textContent = "Eid Mubarak 🌙";
    eidTitle.classList.add("reveal-animate");
  }

  if (!eidModeShown) {
    eidModeShown = true;

    if (moonWrap) {
      moonWrap.classList.add("moon-glow-strong");
    }

    openPopup();
    fireworksBurst();

    if (bgMusic && bgMusic.paused && musicBtn) {
      bgMusic.play()
        .then(() => {
          musicBtn.textContent = "Pause soft music 🎵";
        })
        .catch((error) => {
          console.error("Auto music play error:", error);
        });
    }
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

window.enterPage = function () {
  if (!welcomeCard || !welcomeScreen || !mainContent) return;

  welcomeCard.classList.add("opening");

  setTimeout(() => {
    welcomeScreen.classList.add("hidden");
    mainContent.classList.remove("hidden");
    mainContent.classList.add("showing");
    startCountdown();
  }, 650);
};

window.tryOpenEidContent = function () {
  const now = new Date();

  if (isUnlocked || isAdmin || now >= countdownTargetDate) {
    showEidMode();
  } else {
    showLockedView();
  }
};

window.openAdminLogin = function () {
  const entered = prompt("Enter admin password:");
  if (!entered) return;

  if (entered === adminPassword) {
    isAdmin = true;

    if (welcomeScreen) welcomeScreen.classList.add("hidden");

    if (mainContent) {
      mainContent.classList.remove("hidden");
      mainContent.classList.add("showing");
    }

    if (adminPanel) adminPanel.classList.remove("hidden");

    if (adminStatus) {
      adminStatus.textContent = "Admin mode active. You can preview and control everything.";
      adminStatus.className = "status ok";
    }

    startCountdown();
  } else {
    alert("Wrong password");
  }
};

window.openEverythingForAdmin = function () {
  if (!isAdmin) return;
  showEidMode();
};

window.unlockForEveryone = async function () {
  if (!isAdmin || !adminStatus) return;

  await set(unlockRef, true);
  adminStatus.textContent = "Unlocked for everyone. They can open the Eid surprise now.";
  adminStatus.className = "status ok";
};

window.lockForEveryone = async function () {
  if (!isAdmin || !adminStatus) return;

  await set(unlockRef, false);
  adminStatus.textContent = "Locked again. Users cannot open the Eid surprise right now.";
  adminStatus.className = "status danger";
};

onValue(unlockRef, (snapshot) => {
  const wasUnlocked = isUnlocked;
  isUnlocked = snapshot.val() === true;

  if (isUnlocked) {
    if (!wasUnlocked && !isAdmin && mainContent && !mainContent.classList.contains("hidden")) {
      showEidMode();
    }
  } else {
    if (!isAdmin && mainContent && !mainContent.classList.contains("hidden")) {
      const now = new Date();
      if (now < countdownTargetDate) {
        showLockedView();
      }
    }
  }

  updateCountdown();
});

get(unlockRef)
  .then((snap) => {
    if (!snap.exists()) {
      set(unlockRef, false);
    }
  })
  .catch((error) => {
    console.error("Firebase read error:", error);
  });

window.openCard = function () {
  const card = document.getElementById("openEidCard");
  if (card) {
    card.classList.toggle("open");
  }
};
