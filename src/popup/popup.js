document.addEventListener("DOMContentLoaded", () => {
  const status = document.getElementById("status");
  const statusText = document.getElementById("statusText");
  const toggleSwitch = document.getElementById("toggleSwitch");
  const hoursInput = document.getElementById("hours");
  const minutesInput = document.getElementById("minutes");
  const secondsInput = document.getElementById("seconds");
  const timerDisplay = document.getElementById("timerDisplay");
  const startBtn = document.getElementById("startTimer");
  const stopBtn = document.getElementById("stopTimer");

  let timerInterval = null;

  // Initialize UI and timer from storage
  chrome.storage.local.get(["pagackEnabled", "timerEnd"], (res) => {
    toggleSwitch.checked = res.pagackEnabled !== false;
    updateUI(toggleSwitch.checked);

    if (res.timerEnd) {
      const remaining = Math.max(
        Math.floor((res.timerEnd - Date.now()) / 1000),
        0,
      );
      if (remaining > 0) {
        startDisplayInterval(res.timerEnd);
      } else {
        // 🔹 PATCH: timer already expired → reset everything
        chrome.storage.local.set(
          { pagackEnabled: false, timerEnd: null },
          () => {
            toggleSwitch.checked = false;
            updateUI(false);
            updateTimerDisplay(0);
          },
        );
      }
    } else {
      updateTimerDisplay(0);
    }
  });

  toggleSwitch.addEventListener("change", () => {
    chrome.storage.local.set({ pagackEnabled: toggleSwitch.checked });
    updateUI(toggleSwitch.checked);
  });

  startBtn.addEventListener("click", () => {
    if (!toggleSwitch.checked) return;

    const h = parseInt(hoursInput.value) || 0;
    const m = parseInt(minutesInput.value) || 0;
    const s = parseInt(secondsInput.value) || 0;
    const totalSeconds = h * 3600 + m * 60 + s;
    if (totalSeconds <= 0) return;

    const timerEnd = Date.now() + totalSeconds * 1000;
    chrome.storage.local.set({ timerEnd });
    startDisplayInterval(timerEnd);
  });

  stopBtn.addEventListener("click", () => {
    chrome.storage.local.remove("timerEnd");
    stopDisplayInterval();
    updateTimerDisplay(0);
    toggleSwitch.checked = false;
    chrome.storage.local.set({ pagackEnabled: false });
    updateUI(false);
  });

  function startDisplayInterval(timerEnd) {
    stopDisplayInterval();

    timerInterval = setInterval(() => {
      const remaining = Math.max(Math.floor((timerEnd - Date.now()) / 1000), 0);
      updateTimerDisplay(remaining);

      if (remaining <= 0) {
        stopDisplayInterval();
        chrome.storage.local.set(
          { pagackEnabled: false, timerEnd: null },
          () => {
            toggleSwitch.checked = false;
            updateUI(false);
            updateTimerDisplay(0);
          },
        );
      }
    }, 1000);
  }

  function stopDisplayInterval() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
  }

  function updateTimerDisplay(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    timerDisplay.textContent =
      `${h.toString().padStart(2, "0")}:` +
      `${m.toString().padStart(2, "0")}:` +
      `${s.toString().padStart(2, "0")}`;
  }
  // ---------------------------------- JS Dark/Light Theme Code ------------------------>
  const themeButton = document.getElementById("themeButton");

  // Load saved theme
  chrome.storage.sync.get(["theme"], (result) => {
    if (result.theme === "dark") {
      document.body.classList.add("dark-mode");
      themeButton.classList.add("dark");
      themeButton.querySelector(".icon").textContent = "🌙";
    } else {
      document.body.classList.add("light-mode");
      themeButton.classList.remove("dark");
      themeButton.querySelector(".icon").textContent = "🌞";
    }
  });

  // On button click, toggle theme
  themeButton.addEventListener("click", () => {
    if (document.body.classList.contains("dark-mode")) {
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
      themeButton.classList.remove("dark");
      themeButton.querySelector(".icon").textContent = "🌞";
      chrome.storage.sync.set({ theme: "light" });
    } else {
      document.body.classList.remove("light-mode");
      document.body.classList.add("dark-mode");
      themeButton.classList.add("dark");
      themeButton.querySelector(".icon").textContent = "🌙";
      chrome.storage.sync.set({ theme: "dark" });
    }
  });

  //======================= END Dark/Light Theme Code ==================================>

  function updateUI(isEnabled) {
    if (isEnabled) {
      status.className = "on";
      statusText.textContent = "Extension is active";
    } else {
      status.className = "off";
      statusText.textContent = "Extension is stopped";
    }
  }
});
