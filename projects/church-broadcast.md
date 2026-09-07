# Low-Cost Church Live Broadcast System

<div align="center">
  <img src="https://img.shields.io/badge/Platform-YouTube_Live-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="YouTube Live" />
  <img src="https://img.shields.io/badge/Hardware-IP_Camera-0078D4?style=for-the-badge&logo=camera&logoColor=white" alt="IP Camera" />
  <img src="https://img.shields.io/badge/Networking-Travel_Router-F24E1E?style=for-the-badge&logo=wi-fi&logoColor=white" alt="Travel Router" />
  <img src="https://img.shields.io/badge/Protocol-RTMP-000000?style=for-the-badge&logo=obsstudio&logoColor=white" alt="RTMP Protocol" />
</div>

---
A reliable, budget-friendly, and interference-proof live streaming solution designed for worship services and public community meetings. This setup bypasses restrictive local network firewalls, minimizes mid-service operational complexity, and eliminates unintended audience audio/video disruptions.

---

## 1. Executive Summary & Philosophy

In many multi-use facilities or shared church buildings, AV and broadcast teams encounter rigid network restrictions and administrative firewalls that cannot be reconfigured. Furthermore, interactive video conferencing platforms (such as Zoom or Google Meet) introduce substantial operational risk during services:
* Accidental unmuting by attendees
* Unintended screen sharing or video feeds
* Cognitive overload for the volunteer host managing participants instead of paying attention to the service

### Why YouTube Live over Video Conferencing?
* **Unidirectional Broadcast Control:** Eliminates audio feedback, background noise, and visual disruptions from remote viewers.
* **Open & Welcoming Access:** Security through restriction was not a goal—our services welcome all participants. YouTube provides universal accessibility across Smart TVs, tablets, and phones without requiring accounts or app installations. However, the broadcasts are intentionally kept unlisted to prevent unwanted attention and interaction.
* **Zero-Host Interruption:** The broadcast runs cleanly from the pulpit/stage to the public stream without requiring an active moderator to police participant permissions. Both comments and the chat functionalities were turned off for this reason.

---

## 2. Architecture & Signal Flow

```
[ Podium / Stage Area ]
            |
      (75ft Cat6 Cable)
            v
   [ Travel Router (NAT/Subnet) ] <--- Upstream Church Network (Restricted Firewall)
            |
      (Local Ethernet)
            v
     [ Budget IP Camera ]
            |
            |-- (RTMP Push via WAN) --> [ YouTube Live Stream Server ] --> Remote Congregation
            |
     [ Handheld IR/RF Remote ] (Pan/Tilt/Zoom & Presets during service)
```

---

## 3. Hardware Bill of Materials (BOM)

| Component | Purpose / Specification | Why Selected |
| :--- | :--- | :--- |
| **Budget IP Camera** | PTZ IP camera with native RTMP/RTSP support | Standalone hardware encoding; pushes stream directly to CDN without a dedicated capture PC. |
| **Portable Travel Router** | Pocket-sized router (e.g., GL.iNet series or TP-Link) | Creates an isolated sub-network / NAT traversal; bypasses local client-isolation and restricted church firewall rules. |
| **75ft Cat6 Cable** | Long-distance backbone connection | Provides reliable wired backhaul from church drop to optimal router/camera placement without Wi-Fi dropouts. |
| **Dedicated Remote Control** | Handheld IR / RF Remote | Enables volunteers to switch presets, zoom, or pan without touching the web management UI mid-stream. |
| **Standard Power Supply** | Wall adapter | Consistent power delivery. |

---

## 4. Key Network & Firewall Strategy

### Overcoming Locked Church Firewalls
Institutional networks often implement:
1. **Client Isolation:** Preventing local devices from seeing each other.
2. **Strict Inbound Filtering / Captive Portals:** Blocking custom administrative ports (e.g., HTTP/80, RTSP/554, ONVIF/8000).

### The Travel Router Solution:
* **Private Subnet Creation:** The travel router accepts the church upstream connection via WAN (DHCP/Wired) and instantiates its own isolated LAN (e.g., `192.168.8.x`).
* **Direct Granular Access:** Connecting an admin laptop/tablet to the travel router's Wi-Fi or LAN gives full administrative access to the IP camera’s web console regardless of church IT policies.
* **Standard Outbound RTMP:** Pushing video via standard outbound ports (`TCP 1935`) to YouTube Live is treated as normal outbound traffic by the upstream router, avoiding blocking rules.

---

## 5. Implementation & Setup Guide

### Step 1: Physical Cabling & Placement
1. Run the **75ft Cat6 cable** from the available church network wall jack/switch to the designated travel router station.
2. Connect the WAN port of the travel router to the 75ft Cat6 cable.
3. Patch the IP camera to the travel router's LAN port using a short Cat6 patch cable.
4. Position the IP camera with an unobstructed sightline to the pulpit, choir, and altar.

### Step 2: YouTube Live Event Creation (Day of Service)
1. Open [YouTube Studio](https://studio.youtube.com) on a laptop/phone connected to the travel router.
2. Click **Create** > **Go Live**.
3. Select **Schedule Stream** or start an instant broadcast:
   * **Title:** Sunday Morning Worship Service - `[Date]`
   * **Visibility:** Unlisted (welcoming all visitors but with no unwanted attention)
   * **Category:** Nonprofits & Activism / Community
4. Copy the generated **Stream URL** (`rtmp://a.rtmp.youtube.com/live2`) and unique **Stream Key**.

### Step 3: IP Camera RTMP Configuration
1. Connect to the travel router's network and navigate to the camera's local web GUI.
2. Navigate to **Network** > **RTMP / Push Stream Settings**.
3. Enable RTMP/RTMPS.
4. Set the destination URL:
   ```text
   rtmp://a.rtmp.youtube.com/live2/<YOUR_STREAM_KEY>
   ```
5. Apply and save settings. The camera will immediately negotiate the RTMP handshake and initiate streaming.

---

## 6. Volunteer & Sunday Operations Workflow

To ensure seamless operation by non-technical church volunteers:

### Zero Web Interface Interaction During Broadcast
* **No browser logins during service:** Volunteers do not touch the IP camera's web UI while the service is live, avoiding accidental configuration breaks, reboots, or stream dropouts.
* **Handheld Remote Operations:**
  * **Preset 1:** Wide shot (Sanctuary / Communion table).
  * **Preset 2:** Medium shot (Pulpit / Speaker).
  * **Preset 3:** Wide choir / musical ensemble.
  * Dedicated pan/tilt and optical zoom buttons allow framing changes on the fly.

### Pre-Service Checklist
- [ ] Connect 75ft Cat6 to the church uplink.
- [ ] Power on Travel Router & verify WAN Internet light is green.
- [ ] Power on IP Camera.
- [ ] Connect wireless microphone to camera.
- [ ] Hand remote control to the broadcast operator.
- [ ] Click **"Go Live"** on YouTube Studio.

### Post-Service Checklist
- [ ] Click **"End Stream"** in YouTube Studio.
- [ ] Power down camera and router.
- [ ] Leave all equipment ready for the next service.

---

## 7. Troubleshooting & Recovery

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| **No Internet on Travel Router** | Captive portal or DHCP lease failure on upstream network | Connect phone/laptop to travel router, open browser, and complete captive portal authorization if prompted. |
| **YouTube shows "No data received"** | Incorrect RTMP URL or stream key typo | Verify that the stream key does not contain leading/trailing whitespaces. Confirm camera RTMP toggle is set to `Enabled`. Power cycle camera to reinitiate RTMP handshake with YouTube. |
| **Remote Control unresponsive** | IR line-of-sight obstruction or low batteries | Ensure direct line of sight to the camera sensor; test IR emitter using a smartphone camera. |
| **Choppy / Dropped Frames** | Upstream church bandwidth throttling | In camera video settings, lower bitrate from 4000 kbps to 2500 kbps and ensure framerate is set to 30 fps (720p/1080p). |

---

## 8. Summary of Benefits

* **Cost-Efficient:** Built using accessible consumer off-the-shelf equipment rather than expensive proprietary broadcast switchers.
* **Resilient Architecture:** Travel router shields hardware from strict facility IT constraints.
* **Distraction-Free:** YouTube Live eliminates user-side audio/video disruptions, delivering a polished, worshipful experience for online congregants.