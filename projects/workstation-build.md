# Custom Mini ITX Workstation & Telemetry Dashboard

<div align="center">
  <img src="https://img.shields.io/badge/CPU-Intel_Core_i9--14900F-0068B5?style=for-the-badge&logo=intel&logoColor=white" alt="Intel Core i9-14900F" />
  <img src="https://img.shields.io/badge/GPU-Nvidia_RTX_5080_(16GB)-76B900?style=for-the-badge&logo=nvidia&logoColor=white" alt="Nvidia RTX 5080" />
  <img src="https://img.shields.io/badge/RAM-32GB-black?style=for-the-badge" alt="32GB RAM" />
  <img src="https://img.shields.io/badge/Form_Factor-Mini_ITX-gray?style=for-the-badge" alt="Mini ITX" />
  <img src="https://img.shields.io/badge/Case-Custom_3D_Printed-orange?style=for-the-badge" alt="Custom 3D Printed Case" />
  <img src="https://img.shields.io/badge/Monitor-Raspberry_Pi_Zero_2_W-C51A4A?style=for-the-badge&logo=raspberrypi&logoColor=white" alt="Raspberry Pi Zero 2 W" />
  <img src="https://img.shields.io/badge/Display-5%22_Touchscreen-blue?style=for-the-badge" alt="5 inch Touchscreen" />
  <img src="https://img.shields.io/badge/Software-Python_&_Flask-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python & Flask" />
  <img src="https://img.shields.io/badge/Role-Homelab_Remote_Node-4B32C3?style=for-the-badge&logo=home-assistant&logoColor=white" alt="Homelab Remote Node" />
</div>

---

## Executive Overview

Designed and built a high-performance Mini ITX workstation optimized for 3D rendering, photo editing, and multitasking in creative and IT workflows. At the core of this system is an Intel Core i9-14900F processor paired with 32GB of RAM, ensuring smooth performance during intense multitasking and long render jobs. Graphics are handled by a 16GB Nvidia GeForce RTX 5080, providing incredible power for 3D rendering and demanding creative workloads.

This build is housed in a custom 3D-printed and designed case, made specifically to hold a 5-inch touch screen monitor that acts as a custom-made dashboard, hardware monitor, and power controller. 

---

## Integrated Hardware Monitor Dashboard

A Raspberry Pi Zero 2 W and a 5" HDMI touchscreen are embedded directly into the custom 3D-printed case (modified from the Modcase Evolution EVO ITX). This display provides live hardware stats, full power control, and a screensaver when idle — powered entirely by the PC's 5Vsb standby rail to ensure continuous availability even when the PC is off.

### Features
- **Live telemetry** — Displays CPU/GPU load, temperatures, clock speeds, RAM, and VRAM usage, updated every second via a local Server-Sent Events (SSE) stream.
- **Dual-mode UI** — Automatically switches between the telemetry display (PC on) and a standby screen with a power-on button (PC off).
- **Full power control** — Boot, shut down, restart, or sleep the PC directly from the panel.
- **Hardware Integration** — A PC817 optocoupler electrically isolates the Pi's GPIO from the motherboard power header to safely simulate physical button presses.

### The Software Stack
The system is built on a lightweight, modular architecture:
- **PC Server (Windows)**: A Python/Flask app reads hardware stats via `psutil` and `pynvml` and streams them over the local network. 
- **Pi Server (Raspberry Pi)**: A Python/Flask app handles GPIO for power control, manages PC state detection, and serves the frontend. 
- **Frontend**: Plain HTML/CSS/Vanilla JavaScript running in Firefox kiosk mode on the Pi.

```
PC hardware stats
      │
      ▼  (SSE stream, local network)
Raspberry Pi
      │
      ▼
Firefox (kiosk mode, fullscreen)
      │
      ▼
Touchscreen display
```

---

## Future Roadmap: Homelab & Remote Access

While currently functioning as a direct-attached workstation, the end goal is to integrate this powerhouse into a broader **homelab cluster**. 

The machine will transition to a headless remote powerhouse:
- **Productivity & Creative Work**: Accessed remotely using a laptop or Mac Mini as the thin client for rendering and heavy lifting.
- **Living Room Gaming**: Streamed directly to a TV via a laptop, Steam Link, or Steam Deck using Steam Remote Play, allowing for flexible, high-end gaming in different rooms without moving the physical hardware.
