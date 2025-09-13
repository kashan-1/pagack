console.log("[Pagack] Content script loaded");

function runAutoAck() {
  chrome.storage.local.get(["pagackEnabled"], (res) => {
    if (!res.pagackEnabled) {
      console.log("[Pagack] Extension is disabled.");
      return;
    }

    console.log("[Pagack] Extension is active. Running auto-ack...");

    setTimeout(() => {
      const incidentRows = document.querySelectorAll("tr.ember-view");
      let incidentSelected = false;

      incidentRows.forEach((row) => {
        const statusCell = row.querySelector(".incident-status");
        const checkbox = row.querySelector('input[type="checkbox"]');
        if (statusCell && checkbox) {
          const statusText = statusCell.textContent?.trim().toLowerCase();
          if (statusText.includes("triggered")) {
            checkbox.click();
            incidentSelected = true;
            waitAndClickAcknowledge();
            return;
          }
        }
      });

      if (!incidentSelected)
        console.log("[Pagack] No triggered incidents found.");
    }, 10000);
  });
}

function waitAndClickAcknowledge() {
  const startTime = Date.now();
  const maxWait = 15000;
  const interval = 500;

  const intervalId = setInterval(() => {
    chrome.storage.local.get(["pagackEnabled"], (res) => {
      if (!res.pagackEnabled) return clearInterval(intervalId);

      const ackButton = document.querySelector("a.ack-incidents");
      if (ackButton && ackButton.offsetParent !== null && !ackButton.disabled) {
        ackButton.click();
        clearInterval(intervalId);
      } else if (Date.now() - startTime > maxWait) {
        clearInterval(intervalId);
      }
    });
  }, interval);
}

// Optional: reload page every 3 minutes if enabled
setInterval(() => {
  chrome.storage.local.get(["pagackEnabled"], (res) => {
    if (res.pagackEnabled) location.reload();
  });
}, 180000);

// Run immediately on page load
runAutoAck();
