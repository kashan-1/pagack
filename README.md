# Pagack

## `</>` Project Status

[![Code Quality](https://img.shields.io/github/actions/workflow/status/kashan-1/pagack/code-quality.yml?branch=main&style=flat-square&label=Code%20Quality)](https://github.com/kashan-1/pagack/actions/workflows/code-quality.yml)

## PagerDuty Auto-Acknowledge Extension

This Chrome extension automatically acknowledges **triggered alerts** on [PagerDuty](https://www.pagerduty.com). Its main purpose is to help reduce manual effort by periodically checking for active alerts and acknowledging them on your behalf.

## How It Works

- Every **3 minutes**, the extension refreshes any open tab where the URL matches `pagerduty.com`.
- It then checks for **triggered alerts** and attempts to acknowledge them every **10 seconds**.
- This cycle continues until the extension is either **turned off** or **uninstalled**.

> ⚠️ Note: This is intended for use in specific scenarios where automated acknowledgement is acceptable. Use with caution in production environments.

## Usage

1. Open Google Chrome.
2. Go to `chrome://extensions/`.
3. Enable **Developer Mode** (toggle switch in the top right).
4. Click on **"Load unpacked"**.
5. Select the folder where this extension's files are located.
6. Make sure the extension is enabled.

> Once installed and active, it will automatically begin monitoring for PagerDuty alerts.

## It looks like this when correctly installed: 

<img width="453" height="266" alt="image" src="https://github.com/user-attachments/assets/b159764d-732d-4a4f-8b4b-4c0e474b8d91" />
