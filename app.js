const MAX_HOURS = 200;
const STORAGE_KEY = "its-assenze-hours";

const hoursEl = document.getElementById("hours");
const percentageEl = document.getElementById("percentage");
const remainingEl = document.getElementById("remaining");
const remainingBigEl = document.getElementById("remainingBig");
const progressBar = document.getElementById("progressBar");
const minusBtn = document.getElementById("minusBtn");
const plusBtn = document.getElementById("plusBtn");
const resetBtn = document.getElementById("resetBtn");
const toast = document.getElementById("toast");

let hours = Number.parseInt(localStorage.getItem(STORAGE_KEY), 10);

if (!Number.isFinite(hours)) {
  hours = 0;
}

hours = Math.max(0, Math.min(MAX_HOURS, hours));

function save() {
  localStorage.setItem(STORAGE_KEY, String(hours));
}

function updateUI() {
  const remaining = MAX_HOURS - hours;
  const percentage = (hours / MAX_HOURS) * 100;

  hoursEl.textContent = hours;
  percentageEl.textContent = `${percentage.toFixed(percentage % 1 === 0 ? 0 : 1)}% utilizzato`;
  remainingEl.textContent = `${remaining} h rimaste`;
  remainingBigEl.textContent = `${remaining} ${remaining === 1 ? "ora" : "ore"}`;
  progressBar.style.width = `${percentage}%`;

  if (percentage >= 90) {
    progressBar.style.background = "var(--red)";
  } else if (percentage >= 70) {
    progressBar.style.background = "var(--orange)";
  } else {
    progressBar.style.background = "var(--green)";
  }

  minusBtn.disabled = hours <= 0;
  plusBtn.disabled = hours >= MAX_HOURS;

  document.title = `${hours}h / 200h • ITS Assenze`;
}

function addHours(amount) {
  const oldHours = hours;
  hours = Math.min(MAX_HOURS, hours + amount);
  save();
  updateUI();

  if (hours !== oldHours) {
    showToast(`+${hours - oldHours} ${hours - oldHours === 1 ? "ora" : "ore"}`);
  } else {
    showToast("Hai raggiunto il limite di 200 ore");
  }
}

function removeHour() {
  if (hours <= 0) return;

  hours--;
  save();
  updateUI();
  showToast("-1 ora");
}

function resetCounter() {
  if (hours === 0) return;

  const confirmed = window.confirm(
    "Vuoi davvero azzerare il contatore delle assenze?"
  );

  if (!confirmed) return;

  hours = 0;
  save();
  updateUI();
  showToast("Contatore azzerato");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 1600);
}

minusBtn.addEventListener("click", removeHour);
plusBtn.addEventListener("click", () => addHours(1));
resetBtn.addEventListener("click", resetCounter);

document.querySelectorAll("[data-add]").forEach(button => {
  button.addEventListener("click", () => {
    addHours(Number(button.dataset.add));
  });
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}

updateUI();
