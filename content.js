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

console.log("[Pagack] Script loaded, checking if enabled...");

chrome.storage.local.get(["pagackEnabled"], (result) => {
  const isEnabled = result.pagackEnabled !== false;

  if (!isEnabled) {
    console.log("[Pagack] Extension is currently disabled.");
    return;
  }

  console.log("[Pagack] Extension is active. Starting auto-ack logic...");

  setTimeout(() => {
    console.log("[Pagack] Searching incident rows for triggered incidents...");
    const incidentRows = document.querySelectorAll("tr.ember-view");
    let incidentSelected = false;

    incidentRows.forEach((row) => {
      const statusCell = row.querySelector(".incident-status");
      const checkbox = row.querySelector('input[type="checkbox"]');

      if (statusCell && checkbox) {
        const statusText = statusCell.textContent?.trim().toLowerCase();

        if (statusText.includes("triggered")) {
          console.log(
            "[Pagack] Found triggered incident, selecting checkbox...",
          );
          checkbox.click();
          incidentSelected = true;
          waitAndClickAcknowledge();
          return;
        }
      }
    });

    if (!incidentSelected) {
      console.log("[Pagack] No triggered incidents found on this page.");
    }
  }, 10000);

  function waitAndClickAcknowledge() {
    console.log("[Pagack] Waiting for Acknowledge button to become enabled...");

    const startTime = Date.now();
    const maxWait = 15000;
    const interval = 500;

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const ackButton = document.querySelector("a.ack-incidents");

      if (ackButton) {
        const isVisible = ackButton.offsetParent !== null;
        const isDisabled =
          ackButton.getAttribute("aria-disabled") === "true" ||
          ackButton.classList.contains("disabled");

        if (isVisible && !isDisabled) {
          console.log("[Pagack] Acknowledge button enabled, clicking...");
          ackButton.click();
          clearInterval(intervalId);
          return;
        } else {
          console.log(
            "[Pagack] Acknowledge button found but still disabled...",
          );
        }
      } else {
        console.log("[Pagack] Acknowledge button not yet in DOM...");
      }

      if (elapsed > maxWait) {
        console.log("[Pagack] Timed out waiting for Acknowledge button.");
        clearInterval(intervalId);
      }
    }, interval);
  }

  setTimeout(() => {
    console.log("[Pagack] Reloading PagerDuty tab...");
    location.reload();
  }, 180000); // 3 minutes
});
