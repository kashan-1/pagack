/*!
 * Pagack - Open Source Project
 *
 * MIT License
 *
 * Copyright (c) 2025 Kashan Ali
 *
 * This software is open source and may be used, copied, modified, merged,
 * published, distributed, sublicensed, and/or sold under the terms of the
 * MIT License. However, it remains the intellectual property of Kashan Ali.
 * Attribution is appreciated.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
 */
/* global chrome */

document.addEventListener("DOMContentLoaded", () => {
  const status = document.getElementById("status");
  const statusText = document.getElementById("statusText");
  const toggleSwitch = document.getElementById("toggleSwitch");

  chrome.storage.local.get(["pagackEnabled"], (result) => {
    const isEnabled = result.pagackEnabled !== false;
    updateUI(isEnabled);
    toggleSwitch.checked = isEnabled;
  });

  toggleSwitch.addEventListener("change", () => {
    const newState = toggleSwitch.checked;
    chrome.storage.local.set({ pagackEnabled: newState }, () => {
      updateUI(newState);
    });
  });

  function updateUI(isEnabled) {
    if (isEnabled) {
      status.className = "on";
      statusText.textContent = "Extension is active";
      statusText.classList.remove("text-inactive");
      statusText.classList.add("text-active");
    } else {
      status.className = "off";
      statusText.textContent = "Extension is stopped";
      statusText.classList.remove("text-active");
      statusText.classList.add("text-inactive");
    }
  }
});
