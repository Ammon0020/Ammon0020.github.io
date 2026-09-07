# Project: Custom CoreXY 3D Printer Build

<div align="center">
  <img src="https://img.shields.io/badge/Frame-Aluminum_Extrusion-607D8B?style=for-the-badge" alt="Frame" />
  <img src="https://img.shields.io/badge/Enclosure-Full_Plexiglass-795548?style=for-the-badge" alt="Enclosure" />
  <img src="https://img.shields.io/badge/Kinematics-CoreXY-0059B3?style=for-the-badge" alt="CoreXY" />
  <img src="https://img.shields.io/badge/Firmware-Klipper_%2B_Fluidd-000000?style=for-the-badge&logo=klipper&logoColor=white" alt="Firmware" />
  <img src="https://img.shields.io/badge/Host-BTT_Pi-C51A4A?style=for-the-badge" alt="BTT Pi" />
</div>

---

## Executive Overview

A ground-up engineering redesign of a custom CoreXY 3D printer engineered for high-speed motion, rigid mechanical stability, and clean aesthetics. While originally born from an abandoned entry-level bedslinger, the project has evolved through multiple iterations into a completely custom machine featuring an aluminum extrusion chassis, full plexiglass enclosure, remote CPAP part cooling, and CAN bus umbilical architecture running Klipper and Fluidd.

---

## Project History & Evolution

The project traces back through several distinct development milestones, transitioning from a salvage restoration into a custom machine design platform:

* **Maker Lab Salvage (2021)**: My roommate and I discovered an abandoned Anet A8 at our university maker lab. After obtaining permission from the lab's supervising professor, my roommate took the printer home, flashed the mainboard with Marlin firmware, and set up OctoPrint for networked print management.
* **The CoreXY Conversion (2022)**: A year later, my roommate gifted the printer to me. Together, we completely rebuilt the motion system—converting it from a traditional bedslinger into a CoreXY architecture using 3D-printed brackets and lightweight carbon-fiber rods to reduce moving mass on a budget. At this stage, we migrated the firmware to Klipper with Mainsail.
* **The Operational Shift (2023)**: After acquiring a Bambu Lab A1 and A1 Mini to handle reliable daily 3D printing, the role of this custom printer changed fundamentally. With daily production offloaded to commercially available machines, the custom build was set off to the side collecting dust.
* **Current Phase (Ground-Up Redesign)**: Retiring all remaining Anet A8 parts and printed structural brackets. The machine is being completely rebuilt from scratch around a rigid aluminum extrusion frame, a plexiglass enclosure, and modern electronics.

---

## Hardware Architecture & Engineering

### 1. Frame & Kinematics
* **Extrusion Chassis**: Replacing the previous 3D-printed joints and carbon-fiber rods with a rigid, squared aluminum extrusion frame engineered to resist deflection under high-acceleration CoreXY motion.
* **Total Plexiglass Enclosure**: Fully enclosed build volume providing thermal stability for high-temperature engineering filaments (ABS, ASA, PC) while enhancing user safety and noise containment.
* **Remote CPAP Part Cooling**: Removing heavy blower fans from the printhead by ducting high-pressure airflow directly from a stationary off-toolhead CPAP machine blower, drastically reducing toolhead inertia.
* **Zero Legacy Hardware**: Complete mechanical departure from the Anet A8; all motion components (linear rails, pulleys, belts, lead screws) are modern, high-precision assemblies.

### 2. Electronics & Communication
* **Host SBC**: Dedicated BigTreeTech (BTT) Pi running Linux, Klipper, and the Fluidd web interface.
* **Distributed CAN Bus Architecture**: Implementing a toolhead CAN board communicating over a 4-wire umbilical (Power, Ground, CAN_H, CAN_L). This eliminates massive multi-conductor cable drag chains and reduces moving mass.
* **Extreme Cable Management**: Priority design emphasis on integrated wire channels, concealed harness routing, and wireless telemetry to eliminate exposed, dangling wiring harnesses.

---

## Strategic Roadmap & Future Capabilities

```text
[ PHASE 1: SALVAGE & MARLIN ]          [ PHASE 2: COREXY PROTOTYPE ]         [ PHASE 3: MODERN REDESIGN (CURRENT) ]
* University Lab Recovery (2021)       * Gifted & Converted to CoreXY        * Aluminum Extrusion Frame Sourcing
* Marlin Flash & OctoPrint Setup       * Carbon Fiber Rods & Printed Mounts  * Total Plexiglass Enclosure Build
* Bed-Slinger Baseline Operation       * Klipper + Mainsail Migration        * Klipper + Fluidd on BTT Pi + CAN Bus
```

### Planned Advanced Features
* **Multi-Tool Changer**: Implementation of a physical tool changer supporting at least 4 independent toolheads for true multi-material and multi-color printing without purge waste.
* **Dual-Camera Vision & Inspection System**:
  * **Nozzle Camera**: Real-time toolhead-mounted camera providing close-up layer deposition monitoring.
  * **Off-Bed Extruder Camera**: Dedicated off-bed camera positioned at an upward angle to inspect the nozzle tip for filament accumulation or debris.
* **Automated Nozzle Purge & Wipe Routine**: G-code macro integration allowing the printer to transit to the off-bed camera position, inspect for nozzle buildup, and route to a silicone brush cleaner before resuming extrusion.
* **Chamber Illumination**: High-CRI LED bar integration wired into macro-controlled host relays.
* **Multiangle Live Video Feed**: Integration of multiple camera feeds to provide comprehensive remote monitoring of the build environment.

### Immediate Next Steps
- [ ] **Frame Finalization**: Finalize 2020/2040 extrusion dimensions, cut lists, and structural corner bracket BOM.
- [ ] **Electronics Specification**: Select mainboard, BTT Pi mount, and CAN toolhead board with appropriate stepper driver ratings.
- [ ] **Toolhead & CPAP Duct Design**: Model the high-flow hotend mount with integrated CPAP air ducting and strain relief.
