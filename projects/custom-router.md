# Project Ironclad: Enterprise-Grade Pi 5 Security Gateway & Router

<div align="center">
  <img src="https://img.shields.io/badge/Hardware-Raspberry_Pi_5_(16GB)-C51A4A?style=for-the-badge&logo=raspberrypi&logoColor=white" alt="Raspberry Pi 5" />
  <img src="https://img.shields.io/badge/OS-Raspberry_Pi_OS_Lite_64--bit-A22846?style=for-the-badge&logo=debian&logoColor=white" alt="Debian Bookworm Lite" />
  <img src="https://img.shields.io/badge/Networking-UniFi_Switch_&_Wi--Fi_7_WAP-0559C9?style=for-the-badge&logo=ubiquiti&logoColor=white" alt="UniFi Stack" />
  <img src="https://img.shields.io/badge/Firewall-nftables_%26_NAT-E95420?style=for-the-badge&logo=linux&logoColor=white" alt="nftables Firewall" />
  <img src="https://img.shields.io/badge/Platform-Docker_&_Portainer-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Stack" />
  <img src="https://img.shields.io/badge/VPN-Tailscale_Subnet_Router-5D43E9?style=for-the-badge&logo=tailscale&logoColor=white" alt="Tailscale VPN" />
</div>

---

## Executive Overview

**Project Ironclad** is a bare-metal custom router, zero-trust firewall, and network controller deployed directly on a **Raspberry Pi 5 (16GB)**. Designed to eliminate commercial off-the-shelf router vulnerabilities and proprietary lock-in, Ironclad brings datacenter-grade network architecture to a prosumer home lab.

The system delivers line-rate multi-gigabit routing, automated IEEE 802.1Q VLAN network segmentation, hardened `nftables` stateful packet filtering with DNS hijacking prevention, containerized service orchestration via Docker, and out-of-band management redundancy.

```
                  +-------------------------------------------------------------+
                  |                    ISP Internet Gateway                     |
                  +-------------------------------------------------------------+
                                                 | (Direct WAN Feed)
                                                 v
+---------------------------------------------------------------------------------------------------+
|  PROJECT IRONCLAD CORE ROUTER (Raspberry Pi 5 - 16GB)                                             |
|  * Storage & Power: 500GB NVMe M.2 via PCIe Gen2 | 52pi EP-0241 PoE+ HAT (25.5W via eth0)         |
|  * Networking: systemd-networkd + Kernel IPv4 Forwarding + udev persistent naming                 |
|                                                                                                   |
|  [ Interfaces ]                                                                                   |
|  - wan0 (Top USB 3.0 Realtek 2.5GbE)  ---> DHCP from ISP Gateway (RouteMetric=100)                |
|  - lan0 (Bottom USB 3.0 Realtek 2.5GbE) -> Trunk Port (802.1Q: VLAN 10, 20, 30)                   |
|  - eth0 (Onboard 1GbE NIC)            ---> Native Out-of-Band Mgmt (192.168.99.1/24) + PoE+ In    |
|                                                                                                   |
|  [ Security & Packet Filter (nftables) ]                                                          |
|  - Default DROP policy on input & forward chains                                                  |
|  - Inter-VLAN isolation with pinhole exceptions (e.g., Main -> Home Assistant)                    |
|  - NAT Postrouting Masquerade on wan0                                                             |
|  - Mandatory Port 53 DNAT Redirection + Port 853 DoT Drop + DoH IP/Domain Blackholing             |
|                                                                                                   |
|  [ Core Container Infrastructure (/opt/stacks/) ]                                                 |
|  - UniFi Network Application + MongoDB 7.0 (Manages Switches & Wi-Fi 7 AP)                        |
|  - DNS Pipeline: Pi-hole (Ad-blocking Sinkhole) + Unbound (Recursive Root Resolver)               |
|  - Reverse Proxy: Nginx Proxy Manager (Internal HTTPS SSL & Friendly Hostnames)                   |
|  - Observability & Ingress: Node Exporter (Port 9100) + Tailscale Subnet Router                   |
+---------------------------------------------------------------------------------------------------+
             |                                              |
             | (PoE+ Power In & Out-of-Band Mgmt)           | (802.1Q VLAN Trunk: 10, 20, 30)
             v                                              v
+---------------------------------------------------------------------------------------------------+
|  UBIQUITI USW-Flex-2.5G-8-PoE (Central 2.5GbE Distribution Switch)                                |
|  - Port 1: Pi eth0 [Native: Default/Mgmt (PoE+ 25.5W out)]                                        |
|  - Port 2: Trunk to Ubiquiti U7 Pro XG AP [SSIDs: Main (10), IoT (20), Guest (30)]                |
|  - Port 3: PoE Out Uplink to UniFi US-8 Switch                                                    |
|  - Port 4: Trunk from Pi lan0 [Carries VLANs 10, 20, 30]                                          |
|  - Port 5: Dedicated Home Assistant Server (Main VLAN 10 Interface)                               |
|  - Port 6: Dedicated Home Assistant Server (IoT VLAN 20 Discovery Interface)                      |
+---------------------------------------------------------------------------------------------------+
             |
             | (PoE Passthrough & Uplink)
             v
+---------------------------------------------------------------------------------------------------+
|  UNIFI US-8 SWITCH (1GbE Cascaded Expansion & Emergency Console)                                  |
|  - Port 1: Physical Maintenance Port [VLAN 99 Native / DHCP -> Emergency SSH to 192.168.99.1]     |
|  - Ports 2-7: Available Gigabit Access Ports                                                      |
+---------------------------------------------------------------------------------------------------+
```

---

## Current Implementation Status

Ironclad is deployed and running as the primary production gateway. All hardware, operating system adaptations, container stacks, and security rules detailed below are fully validated against the production build baseline.

### 1. Hardware Engineering & Architecture
* **Compute Node**: Raspberry Pi 5 (Broadcom BCM2712 Quad-Core Cortex-A76 @ 2.4GHz, 16GB LPDDR4X RAM).
* **Storage & Bus Expansion**: 500GB NVMe SSD seated on a **52pi EP-0241 PoE+ NVMe M.2 HAT** communicating across the Pi 5 PCIe FFC ribbon interface locked at Gen 2 speeds (`dtparam=pciex1_gen=2`).
* **Power Delivery (PoE+)**: Powered exclusively through IEEE 802.3at PoE+ (25.5W) extracted via `eth0` by the 52pi HAT directly from the upstream switch, eliminating wall warts and preventing dual-power electrical conflicts.
* **USB Controller Decoupling**: Utilizes two separate Realtek RTL8156B 2.5GbE USB 3.0 adapters plugged into separate physical USB root controllers (top and bottom blue ports) to prevent cross-interface PCI/USB bus saturation between ingress WAN and egress LAN traffic.
* **Physical Redundancy**: A cascaded Ubiquiti US-8 PoE switch acts as an out-of-band hardware console, providing an untagged physical fallback port directly into the management plane.

### 2. Operating System & Hardware-Level Tuning
* **OS Platform**: Raspberry Pi OS Lite (64-bit, headless Debian Bookworm) initialized without bloated desktop environments to conserve compute cycles for networking interrupts.
* **EEPROM Bootloader Customization**:
  * `BOOT_ORDER=0xf416`: Prioritizes NVMe boot while retaining SD/USB recovery paths.
  * `PCIE_PROBE=1`: Forcefully polls the PCIe bus during initialization to guarantee HAT detection.
  * `PSU_MAX_CURRENT=5000`: Unlocks full 5A threshold support over PoE+ power rails.
* **Kernel USB Stability**: Global USB autosuspend disabled in `cmdline.txt` via `usbcore.autosuspend=-1` to stop the Linux kernel from putting USB network interfaces into low-power states.
* **Driver Mode-Switching (udev)**: RTL8156B chipsets default to USB CDC-NCM plug-and-play configuration. A low-level udev rule (`50-usb-realtek-net.rules`) intercepts adapter detection and forces USB Vendor Configuration 1 (`bConfigurationValue="1"`), unlocking native `r8152` driver control and sustained 2.5Gbps throughput.
* **Interface Determinism**: Custom udev rules (`10-network.rules`) bind hardware MAC addresses directly to canonical interface names `wan0` and `lan0`.

---

## Network Architecture & VLAN Topology

Routing and local DHCP are handled entirely on the host via `systemd-networkd`. Ubiquiti switching and wireless hardware operate in **Third-Party Gateway mode**, delegating all routing and lease assignments to the Pi.

| Segment / VLAN | Subnet Range | Gateway IP | Native DHCP Pool | Isolation Policy & Operational Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **VLAN 10<br>(Main)** | `192.168.10.0/24` | `192.168.10.1` | `.100 - .249` | **Trusted Production Zone**: Laptops, workstations, and smartphones. Unrestricted outbound WAN access. Permitted to access local container UIs (Portainer, Pi-hole, NPM, UniFi) and SSH into the router. |
| **VLAN 20<br>(IoT)** | `192.168.20.0/24` | `192.168.20.1` | `.100 - .199` | **Zero-Trust Device Zone**: Smart home sensors, cameras, and appliances. **WAN blocked by default**. Strict inter-VLAN quarantine. Local broadcast discovery confined to this segment. Home assistant connects to both Main and IoT VLANs to control devices. |
| **VLAN 30<br>(Guest)** | `192.168.30.0/24` | `192.168.30.1` | `.100 - .149` | **Untrusted Transit Zone**: Isolated internet-only pipe for guest and untrusted mobile devices. Complete isolation from all RFC 1918 subnets and Pi management consoles. |
| **Out-of-Band<br>(Management)** | `192.168.99.0/24` | `192.168.99.1` | `.10 - .29` | **Administrative Control Plane**: Direct untagged physical link on `eth0` and US-8 Port 1. Houses switch management profiles, UniFi inform communication, and emergency headless SSH. |

### Home Assistant Dual-Homed Integration Pattern
To achieve seamless smart home control without compromising security, Home Assistant is wired across two dedicated switch ports:
1. **Management / Web UI on VLAN 10 (Switch Port 5)**: Trusted personal devices access the web interface directly on the Main subnet.
2. **mDNS & Local Control on VLAN 20 (Switch Port 6)**: Placed natively in the IoT subnet to intercept local broadcast frames and control offline IoT accessories without routing across network boundaries.
3. **One-Way Pinhole Firewall Rule**: `nftables` explicitly authorizes Main clients to initiate connections to Home Assistant on the IoT subnet (`iifname "vlan10" oifname "vlan20" ip daddr 192.168.20.50 accept`), while completely barring IoT devices from initiating connections back into VLAN 10.

---

## Defensive Engineering: Stateful Firewalling & DNS Hijacking Prevention

The security layer runs on modern `nftables`, completely discarding legacy `iptables` scripts while retaining full compatibility with Docker bridge networking.

### 1. Default-Deny Stateful Filtering (`/etc/nftables.conf`)
* **Input Chain (`policy drop`)**: Only drops incoming packets unless explicitly matched to established/related states, loopback, router-bound ICMP, DNS (port 53), DHCP (port 67), or administrative SSH originating strictly from VLAN 10 and `eth0`.
* **Forward Chain (`policy drop`)**: Prevents any inter-VLAN forwarding by default. Automatically approves container DNAT translation for permitted zones, permits VLAN 10 and VLAN 30 outbound WAN routing, and drops invalid packets immediately.
* **Targeted Flushes**: Uses isolated table flushes (`flush table inet filter`, `flush table inet nat`) rather than global rule resets (`flush ruleset`), protecting Docker's dynamic bridge routing table from accidental corruption during firewall reloads.
* **Docker IPTables Bypass Daemon (`docker-iptables-fix.service`)**: Docker dynamically injects iptables forward rules that can intercept or break host-routed VLAN traffic. A custom systemd oneshot unit automatically re-injects acceptance rules into Docker's `DOCKER-USER` chain upon daemon launch, guaranteeing sustained WAN packet forwarding.

### 2. DNS Hijacking Defense & Forced Local Resolution
To prevent smart TVs, IoT sensors, or browser software from bypassing local filtering using hardcoded public resolvers (e.g., `8.8.8.8` or `1.1.1.1`), the firewall executes a three-tier enforcement strategy:
1. **Standard Port 53 DNAT Interception**: The `prerouting` NAT hook inspects all outbound UDP/TCP port 53 packets originating from VLANs 10, 20, and 30. Any query destined for an external address is redirected straight into the local gateway IP (Pi-hole).
2. **DNS-over-TLS (DoT) Drop**: Port 853 is universally dropped at the top of the `forward` chain across all internal VLANs (`iifname { "vlan10", "vlan20", "vlan30" } tcp dport 853 drop`), preventing encrypted bypasses and forcing clients to downgrade to standard inspectable DNS.
3. **DNS-over-HTTPS (DoH) Blackholing**: Because DoH operates over standard TLS port 443, port blocking would break web transit. Ironclad mitigates DoH by subscribing Pi-hole to curated lists (`Hagezi DoH/VPN Bypass`, `MohamedElashri DoH`, `Bryantdl7 DNS-HTTPS`), actively returning `0.0.0.0` for public DoH bootstrap resolvers and compelling clients to fall back to local DNS.

---

## Containerized Application Stack

All network applications are organized cleanly under `/opt/stacks/` on the NVMe drive and managed as version-controlled Docker Compose declarations.

```
/opt/stacks/
├── unifi/                  # UniFi Network Application + MongoDB 7.0
├── dns/                    # Pi-hole Ad-blocking + Unbound Recursive DNS
├── npm/                    # Nginx Proxy Manager (Internal SSL & Local Routing)
├── node-exporter/          # Host Metrics Exporter (Scraped by external Prometheus)
└── portainer/              # Web GUI Container Management
```

### Deployed Services Architecture
* **UniFi Network Application (`/opt/stacks/unifi/`)**: Runs `linuxserver/unifi-network-application` connected to an internal `mongo:7.0` container. Manages the USW-Flex switch, US-8 switch, and U7 Pro XG AP. Listens on port `8443` (Web UI) and port `8080` (Device Inform channel).
* **Pi-hole (`/opt/stacks/dns/`)**: Local DNS sinkhole mapped to ports `53/udp`, `53/tcp`, and Web UI on `8081`. Intercepts advertisements, malware telemetry, and tracking networks. Configured with upstream resolution pointing exclusively to Unbound via Docker's internal container network (`unbound#53`).
* **Unbound (`/opt/stacks/dns/`)**: Cryptographically validating recursive DNS caching server running on the same network bridge as Pi-hole. Queries the global Internet Root Servers directly rather than forwarding queries to upstream commercial DNS providers (Cloudflare, Google, ISP), enhancing end-to-end privacy and preventing upstream query logging.
* **Nginx Proxy Manager (`/opt/stacks/npm/`)**: Provides internal reverse-proxy ingress, enabling internal HTTPS certificates and human-readable domain names (`portainer.local`, `pihole.local`, `unifi.local`, `npm.local`). An `nftables` forward patch (`iifname { "br-*", "docker*" } ct status dnat accept`) permits container-to-container proxy communication over host-mapped ports without encountering firewall drops.
* **Node Exporter (`/opt/stacks/node-exporter/`)**: Lightweight host daemon exposing hardware telemetry, CPU load, and network interface metrics on port `9100`. It allows a dedicated external homelab Prometheus and Grafana instance to scrape router vitals without taxing the Pi 5's memory and write cycles.
* **Tailscale Subnet Gateway**: Installed bare-metal on the OS (`--advertise-routes=192.168.10.0/24 --accept-dns=false`). Provides an authenticated, encrypted TailScale tunnel into the trusted Main VLAN from remote mobile devices without exposing open ports to the WAN.

---

## Operational Tooling & Disaster Recovery

* **Automated Cold-State Backups (`/opt/scripts/backup.sh`)**: A scheduled weekly cron job (`0 2 * * 0`) generates timestamped `.tar.gz` archives containing all system-critical files:
  * Stateful firewall rules (`/etc/nftables.conf`)
  * Network interfaces and VLAN declarations (`/etc/systemd/network/`)
  * Persistent device naming rules (`/etc/udev/rules.d/10-network.rules`)
  * Entire containerized stack definitions and data volumes (`/opt/stacks/`)
  * The script enforces an 8-week rolling retention policy, automatically pruning older archives.
* **Atomic Firewall Reload Helper (`/opt/scripts/reload-firewall.sh`)**: A utility script ensuring that changes to `/etc/nftables.conf` can be applied live without severing Docker routing. The script sequentially updates nftables, restarts Docker, re-injects the custom `docker-iptables-fix` rule, and prints live status checks.

---

## Strategic Roadmap & Future Goals

The core routing and security engine is complete. The following milestones represent the next phase of the project's engineering lifecycle:

```
[ PHASE 1: COMPLETED ]                 [ PHASE 2: IN COMPLETED ]             [ PHASE 3: FUTURE EXPANSION ]
* Pi 5 NVMe + PoE+ HAT Hardware        * Dynamic DNS Redirection (DNAT)     * External Cluster Suricata IDS Offload
* Dual 2.5GbE Decoupled USB NICs       * Port 853 DoT Drop & DoH Blackhole  * Strict Management VLAN Consolidation
* systemd-networkd 4-VLAN Architecture * Nginx Proxy Local HTTPS Domains    * Kernel Hardening & Strict Reverse Path
* nftables Zero-Trust Matrix           * Dedicated Maintenance Failover     * Speed benchmarks.
* Docker Services (UniFi, DNS, NPM)    * 3D-Printed Rackmount Enclosure     
```

### Security & Protocol Hardening
- [ ] **Lock Down Management Interfaces to VLAN 99**: Restrict SSH access exclusively to the Out-of-Band Management network (disabling SSH on VLAN 10 entirely). Migrate Nginx Proxy Manager, Portainer, and the UniFi Controller Web UI to listen only on VLAN 99 addresses, preventing compromised workstations on the Main subnet from attempting administrative brute-force.
- [ ] **Key-Based Authentication & Intrusion Prevention**: Transition SSH exclusively to hardware-backed Ed25519 public keys, disable password authentication globally in `sshd_config`, and deploy `fail2ban` on the host.
- [ ] **Kernel Hardening (`sysctl`)**: Implement strict reverse path filtering (`net.ipv4.conf.all.rp_filter = 1`), disable ICMP redirects, and disable source packet routing to harden against IP spoofing and man-in-the-middle attacks.
- [ ] **Docker Socket Protection**: Place an access-controlled Docker Socket Proxy between Portainer and the host's `/var/run/docker.sock` to prevent potential container escapes from obtaining root host control.
- [ ] **Switch Physical Port Security**: Implement 802.1X RADIUS or MAC authentication bypass (MAB) on accessible switch ports to block unauthorized devices from tapping into open physical jacks.

### Advanced Threat Mitigation & Performance Validation
- [ ] **Suricata IDS Offload**: Implement full deep packet inspection (DPI) by mirroring core traffic to an external multi-node compute cluster running Suricata, avoiding CPU bottlenecks on the primary router.
- [ ] **Geo-Blocking Integration**: Ingest MaxMind or IPSet country blocks into `nftables` sets to unconditionally drop ingress/egress traffic associated with high-threat foreign network blocks.
- [ ] **IoT Dynamic Whitelisting**: Transition IoT policies from total internet blackholing to granular destination-address whitelisting for verified vendor firmware updates and local NTP sync.
- [ ] **Comprehensive iperf3 Benchmarking**: Execute multi-stream `iperf3` benchmarks across the PCIe bus, 2.5GbE USB NICs, and the Wi-Fi 7 320MHz wireless link to document thermal stability and line-rate forwarding ceilings under maximum synthetic load.
- [ ] **Custom Enclosure Fabrication**: Design and 3D-print a custom, active-cooled 1U desk/rack enclosure consolidating the Raspberry Pi 5, PoE+ HAT, dual RTL8156B NICs, and the Ubiquiti USW-Flex switch into a clean physical unit.