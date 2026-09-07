# Enterprise Homelab: Hybrid Proxmox & Kubernetes DevOps Cluster

<div align="center">
  <img src="https://img.shields.io/badge/Hypervisor-Proxmox_VE-E57000?style=for-the-badge&logo=proxmox&logoColor=white" alt="Proxmox VE" />
  <img src="https://img.shields.io/badge/Orchestration-Kubernetes_%26_K3s-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white" alt="Kubernetes & K3s" />
  <img src="https://img.shields.io/badge/Certifications-CKA_%26_DCA_Prep-D32F2F?style=for-the-badge&logo=linuxfoundation&logoColor=white" alt="CKA & DCA Prep" />
  <img src="https://img.shields.io/badge/Compute-4x_Mini_PC_Cluster-B80000?style=for-the-badge" alt="4x Mini PC Cluster" />
  <img src="https://img.shields.io/badge/Observability-LGTM_Stack-F46800?style=for-the-badge&logo=grafana&logoColor=white" alt="LGTM Stack" />
  <img src="https://img.shields.io/badge/Storage_%26_Media-HexOS_%26_Jellyfin-00A4DC?style=for-the-badge&logo=jellyfin&logoColor=white" alt="HexOS & Jellyfin" />
  <img src="https://img.shields.io/badge/Automation-Home_Assistant-41BDF5?style=for-the-badge&logo=homeassistant&logoColor=white" alt="Home Assistant" />
</div>

---

## Executive Overview

This project documents the architectural design, physical topology, and service deployment strategy for an enterprise-grade hybrid homelab environment. Designed to mirror modern cloud-native engineering patterns, the cluster fulfills two core organizational objectives:

1. **DevOps & Cloud Engineering Acceleration:** Serving as a rigorous, bare-metal validation ground to master containerization, orchestration, and declarative infrastructure—targeting both the **Docker Certified Associate (DCA)** and **Certified Kubernetes Administrator (CKA)** certifications.
2. **Centralized Infrastructure & Observability Hub:** Offloading telemetry aggregation, log indexing, and security analytics from the edge gateway developed in [Project Ironclad (Custom Router)](projects/custom-router.md), while consolidating automated media processing and local AI inference pipelines.

The cluster emphasizes low power consumption, high physical density, and zero-trust network tiering. The primary compute backbone is segregated on **VLAN 20** across a quartet of micro x86 enterprise PCs running Proxmox VE. A converted legacy gaming rig running **HexOS** operates as a dual-homed bridge between the primary client network (**VLAN 10**) and the cluster network (**VLAN 20**), delivering line-rate Jellyfin media streaming, centralized **Home Assistant** automation controlling all IoT devices throughout the home via distributed voice command endpoints, and secure administrative ingress without burdening edge router buffers. High-performance GPU compute is anchored by an RTX 5080 workstation currently on VLAN 10, with a planned migration to VLAN 20 as it transitions to a headless cluster node.

---

## Certifications & Technical Roadmap

The lab provides an isolated, failure-resilient playground where real-world production outages and deployment topologies can be replicated and resolved.

```
       [ Stage 1: DCA Foundation ]                   [ Stage 2: CKA Cluster Mastery ]
   +---------------------------------+             +----------------------------------+
   | - Container Runtime Mechanics   |             | - etcd Backup, Restore & Quorum  |
   | - Multi-Stage Image Builds      |    ====>    | - CNI Network Policy Enforcement |
   | - Custom Docker Bridge Networks |             | - Ingress, Storage & CSI Drivers |
   | - Volume Plugins & Secrets Mgmt |             | - Node Drain, Cordon & Upgrades  |
   +---------------------------------+             +----------------------------------+
```

* **Target 1: Docker Certified Associate (DCA)**  
  Focuses on core container lifecycle operations, daemon configuration, internal network drivers, storage volume management, and security sandboxing.
* **Target 2: Certified Kubernetes Administrator (CKA)**  
  Focuses on bare-metal cluster bootstrapping, control plane isolation, declarative reconciliation via Cluster API (CAPI), multi-node etcd operations, pod scheduling policies, CNI configuration (e.g., Cilium/Flannel), and aggressive break-fix troubleshooting drills.

---

## System Architecture & Interconnect Topology

```
                               +----------------------------------------+
                               |     Project Ironclad Security Gateway  |
                               |    (Raspberry Pi 5 - Edge Router/FW)   |
                               +----------------------------------------+
                                                   |
                                                   | 2.5GbE Trunk Uplink
                                                   v
                               +----------------------------------------+
                               |   UniFi Multi-Gig Managed Switch Tier  |
                               +----------------------------------------+
                                     |             |                  |
                   +-----------------+             |                  +---------+
                   | (VLAN 20)                     | (VLAN 10)                  | (VLAN 10)
                   v                               v                            v
+------------------------------------+  +------------------+  +--------------------------------+
|      PROXMOX VE 4-NODE CLUSTER     |  | DAILY DRIVERS    |  | HIGH-PERFORMANCE WORKSTATION   |
|      (VLAN 20: Lab / Compute)      |  | (VLAN 10: LAN)   |  | (VLAN 10 -> Future Cluster 20) |
|                                    |  |                  |  | (Custom Mini ITX Build)        |
| [Node 04: Control Plane]           |  | - Framework      |  |                                |
| Lenovo ThinkCentre M900 Tiny       |  |   Laptop         |  | - Intel Core i9-14900F         |
| i5-6500T | 8GB RAM | 1TB SSD       |  | - Mac Mini       |  | - 32GB RAM                     |
| * k8s API, etcd, Scheduler         |  |                  |  | - Nvidia RTX 5080 (16GB)       |
|                                    |  | (SSH / kubectl / |  | * Odysseus Local AI Inference  |
| [Nodes 01-03: Compute Workers]     |  |  Web Consoles)   |  | * Headless Remote Powerhouse   |
| 2x HP EliteDesk 800 G3 (16GB each) |  +------------------+  | * 5" Embedded Hardware Monitor |
| 1x HP EliteDesk 800 G2 (16GB)      |           |            +--------------------------------+
| * Total: 48GB Worker RAM Pool      |           |                             |
| * LGTM Observability Stack         |           | (VLAN 10 Access)            | Steam Remote Play /
| * Dynamic k8s Workloads (CAPI/K3s) |           | To Jellyfin & Cluster       | Moonlight Streaming
| * DCA/CKA Break-Fix Scenarios      |           v                             v
+------------------------------------+  +------------------+  +--------------------------------+
               |                        | HEXOS DUAL-HOMED |  | LIVING ROOM / HTPC CLIENTS     |
               | (VLAN 20 Storage Link) | GATEWAY & NAS    |  |                                |
               +----------------------->| (VLAN 10 & 20)   |  | - Samsung Laptop (HTPC)        |
                                        | * Jellyfin Server|  | - Steam Link / Steam Deck      |
                                        | * Auto Ripping   |  +--------------------------------+
                                        | * Intel Arc A770 |  +--------------------------------+
                                        | * Home Assistant |<-| DISTRIBUTED VOICE SATELLITES   |
                                        |   (IoT & Voice)  |  | - Voice Command Endpoints      |
                                        +------------------+  | - Whole-Home IoT Control       |
                                                              +--------------------------------+
```

---

## Hardware Inventory & Node Allocation

The hardware lineup deliberately separates perimeter routing, virtualization compute, heavy local AI workloads, and client access:

| Device / Node | Specifications | Primary Architecture & Role | Network & Status |
| :--- | :--- | :--- | :--- |
| **HP EliteDesk 800 G3 Mini (Node 01)** | Intel Core i5-7500T (4C/4T), 16GB RAM, Fast SSD | Proxmox VE Compute Node / Kubernetes Worker. Hosts the LGTM observability pipeline. | **VLAN 20** / Core Cluster Member |
| **HP EliteDesk 800 G3 Mini (Node 02)** | Intel Core i5-7500T (4C/4T), 16GB RAM, Fast SSD | Proxmox VE Compute Node / Kubernetes Worker. Application workloads and container orchestration. | **VLAN 20** / Core Cluster Member |
| **HP EliteDesk 800 G2 Mini (Node 03)** | Intel Core i5-6600T (4C/4T), 16GB RAM, Fast SSD | Proxmox VE Compute Node / Kubernetes Worker. Dynamic lab scaling and CKA failure injection drills. | **VLAN 20** / Core Cluster Member |
| **Lenovo ThinkCentre M900 Tiny (Node 04)** | Intel Core i5-6500T (4C/4T), 8GB RAM, 1TB SSD | Proxmox VE Node / Dedicated Kubernetes Control Plane (`kube-apiserver`, `etcd`, controller manager). | **VLAN 20** / Core Cluster Member |
| **High-Performance Mini ITX Workstation** | Intel Core i9-14900F, 32GB RAM, Nvidia RTX 5080 (16GB) | Odysseus AI Workspace (local LLMs/vision in Docker/WSL2), 3D rendering, and remote compute engine. | **VLAN 10** (Future **VLAN 20** Cluster Node) / Active (Disclosed in [Workstation Build](projects/workstation-build.md)) |
| **Legacy Gaming Rig (Conversion Target)** | Custom ATX Chassis, Multi-bay storage, Intel Arc A770 (16GB) | HexOS appliance: ZFS storage pool, Automatic Ripping Machine (ARM) for optical media, Jellyfin AV1/HEVC transcoding, Home Assistant whole-home IoT controller with distributed voice satellites, and VLAN 10-to-20 gateway. | **Dual-Homed (VLAN 10 & 20)** / Phase 2 Expansion |
| **Asus Gaming Laptop (Evaluation Node)** | High-Performance Mobile CPU, Nvidia RTX 3050 Ti (4GB) | Candidate auxiliary GPU worker node for hardware-accelerated container tasks. | Under Evaluation |
| **Framework Laptop & Mac Mini** | Dual Architecture Client Tier | Daily driver workstations utilized as administrative thin clients (SSH, `kubectl`, Proxmox UI, Portainer) accessing the lab through HexOS. | **VLAN 10** / Active Daily Drivers |
| **Samsung Laptop** | Repurposed Portable Client | Living room HTPC terminal for Jellyfin playback and game streaming (evaluated alongside Steam Link / Steam Deck). | **VLAN 10** / Active Endpoint |

### Crucial Architectural Boundaries & Network Segmentation

* **Zero-Trust Network Segmentation (VLAN 10 vs. VLAN 20):**  
  * **VLAN 20 (Lab / Compute):** Isolates all Proxmox hypervisors, Kubernetes nodes, dynamic CAPI test VMs, container overlays (CNI), and `etcd` raft quorum traffic. This protects personal devices on the home network from broadcast noise, multicast discovery, and transient disruptions during aggressive CKA break-fix failure drills.
  * **VLAN 10 (Client LAN):** The primary network for daily drivers, portable endpoints, and living room streaming devices.
* **HexOS as a Dual-Homed Bridge & Ingress Gateway:**  
  Rather than routing high-bandwidth 4K video streams across the Raspberry Pi edge router's single 2.5GbE trunk interface, HexOS is **dual-homed with interfaces on both VLAN 10 and VLAN 20**:
  * **Zero-Router-Hop Media Streaming:** Daily drivers and HTPC endpoints on VLAN 10 access Jellyfin directly over line-rate switch connections without loading edge router firewall buffers.
  * **Secure Administrative Ingress:** Acts as a controlled access jump/proxy point allowing authorized daily drivers on VLAN 10 to reach cluster management APIs and web consoles on VLAN 20.
* **Workstation Phasing (VLAN 10 to VLAN 20 Migration):**  
  The high-performance workstation is currently connected to **VLAN 10** to facilitate direct, low-latency local creative rendering, photo editing, and living room game streaming. As cluster requirements scale, the workstation will transition to a headless compute node—migrating its network connection to **VLAN 20** to join the Kubernetes cluster directly alongside the mini PCs.
* **NAS Expansion Phasing:**  
  A dedicated multi-bay NAS chassis is currently on hold until enterprise hard drives reach target pricing thresholds. Initial shared network storage and media ingestion will be consolidated onto the legacy gaming desktop running HexOS.

---

## Key Functional Stacks & Engineering Implementation

### 1. Proxmox VE Hypervisor Foundation
All four mini PCs run Proxmox VE as their foundational hypervisor, delivering enterprise virtualization capabilities on power-efficient hardware:
* **Resource Slicing & Overcommit:** Fine-grained allocation of CPU cores and memory balloons to run multiple VM and LXC environments simultaneously.
* **Instant Snapshotting & Clones:** Ability to capture complete cluster state prior to executing destructive CKA drills, enabling instantaneous rollbacks.
* **Corosync Cluster Quorum:** Multi-node cluster configuration enabling centralized management across all physical mini PC nodes from a single dashboard.

### 2. Dynamic Kubernetes Orchestration (CKA/DCA Focus)
* **Control Plane Segregation:** The Lenovo M900 Tiny (8GB RAM) is reserved exclusively for the Kubernetes control plane (`etcd`, API server, scheduler), safeguarding cluster state stability.
* **Worker Pool Capacity:** The three 16GB HP mini PCs provide a collective **48GB of RAM** dedicated strictly to worker nodes, containerized applications, and simulation targets.
* **Lightweight Distros & Declarative Lifecycle:** Implementing lightweight distributions such as **K3s** or **Talos Linux** alongside **Cluster API (CAPI)** to manage node provisioning, automated bootstrapping, and declarative rolling upgrades.

### 3. Edge Observability & Security Offloading
In [Project Ironclad](projects/custom-router.md), the edge router runs a minimal telemetry exporter footprint to conserve memory and CPU power. The homelab mini PC cluster absorbs the heavy analytics overhead:
* **The LGTM Stack:** Deploying **Loki** (log aggregation), **Grafana** (unified visualization), **Tempo** (distributed tracing), and **Mimir** (long-term metric storage).
* **Metric Scraping & Alerts:** Prometheus instances collect time-series data from `node_exporter` across the network, while Alertmanager triggers notifications on anomalous connection spikes or port-scan attempts detected by router firewalls.

### 4. Storage, Media Pipeline & Whole-Home Automation (Phase 2)
The old gaming PC will be transformed into an autonomous ingest, media distribution, and smart home automation appliance:
* **HexOS Platform:** Leveraging HexOS for an intuitive, streamlined storage management platform combining drive pooling and self-hosted apps.
* **Automatic Ripping Machine (ARM):** Equipping the rig with an optical drive configured to automatically detect inserted media, rip discs headlessly, encode streams, tag metadata, and deposit content directly into storage libraries.
* **Intel Arc A770 (16GB) Transcoding Engine:** Capitalizing on Intel's dual AV1 hardware encoders and QuickSync capabilities to support multiple concurrent high-bitrate 4K transcodes in **Jellyfin** with minimal power consumption and near-zero host CPU load.
* **Home Assistant Whole-Home IoT Controller:** Running Home Assistant containerized on HexOS as the local centralized brain controlling all smart home devices, sensors, and lighting across the house.
* **Distributed Voice Command Satellites:** Deploying dedicated voice assistant endpoints scattered throughout the house to process voice commands locally and pass instructions directly to Home Assistant on HexOS—eliminating reliance on third-party cloud voice assistants and ensuring total privacy.

### 5. Odysseus AI Workspace & Workstation Integration
As detailed in the [Workstation Build](projects/workstation-build.md), local artificial intelligence inference is housed entirely within the high-performance desktop:
* **Privacy-Preserving Inference:** Running local large language models and computer vision pipelines inside Docker via WSL2 on the Nvidia RTX 5080. Zero sensitive telemetry or query data leaves the local network.
* **Remote Thin-Client Workflow:** The cluster and workstation are administered headlessly from the Framework laptop and Mac Mini. When high-fidelity gaming or GPU processing is needed across the house, video is streamed seamlessly to living room endpoints (Samsung laptop, Steam Link, or Steam Deck).
