# Project Dossier: Custom USB/Wireless Flight Controller (v1)

<div align="center">
  <img src="https://img.shields.io/badge/MCU-RP2040-B80000?style=for-the-badge&logo=raspberrypi&logoColor=white" alt="RP2040" />
  <img src="https://img.shields.io/badge/Hardware-Custom_PCB-005C0F?style=for-the-badge&logo=altiumdesigner&logoColor=white" alt="Custom PCB" />
  <img src="https://img.shields.io/badge/Sensors-Hall_Effect-005C8A?style=for-the-badge&logo=stmicroelectronics&logoColor=white" alt="Hall Effect Sensors" />
  <img src="https://img.shields.io/badge/Interface-USB_%26_Wireless-FFB000?style=for-the-badge&logo=usb&logoColor=white" alt="USB & Wireless" />
</div>

---
## 1. Executive Summary
A custom high-performance, zero-jitter flight controller built on a 4-layer custom PCB. It features direct sampling for high-priority flight axes, multiplexed sampling for secondary controls, an anti-ghosting digital button matrix, haptic feedback, a digital rotary encoder, and an uninterrupted diode-OR power-path management system for seamless USB/battery operation.

Note: This project is in progress and the details are subject to change.

---

## 2. System Architecture

```
                      +-------------------+
                      |   Adafruit KB2040 |
                      |      (RP2040)     |
                      +---------+---------+
                                |
       +------------------------+-----------------------+
       |                        |                       |
[Direct Analog]           [SPI/Digital]           [I2C Pins]
  A1: Stick Pitch           CLK: Mux S0             SDA: Encoder A
  A2: Stick Roll            MI:  Mux S1             SCL: Encoder B
  A3: Brake (Hall)          MO:  Mux S2
  A0: Mux Output (SIG)      10:  Mux S3
       |                        |
       |                  [Matrix GPIO]
       |                    2-5: Rows (Out)
       |                    6-9: Cols (In)
       |                        |
       |                  [Haptics PWM]
       |                    11: Motor 1
       |                    12: Motor 2
       |
+------+------+
| CD74HC4067  |
| 16-Ch Mux   |<--- Secondary Axes (Look Stick, Throttle, Mixture, etc.)
+-------------+
```

---

## 3. Complete Bill of Materials (BOM)

### Core ICs & Modules
| Part | Quantity | Package / Form | Function |
| :--- | :--- | :--- | :--- |
| **Adafruit KB2040** | 1 | Breadboard/SMD Module | Main MCU (RP2040, 133 MHz) |
| **CD74HC4067SM96** | 1 | SOIC-24 | 16-Channel Analog Multiplexer |
| **SS49E** | 5 | TO-92 (THT) | Linear Hall Effect Sensors |
| **TP4056 Module** | 1 | Breakout Module | 1S LiPo Battery Charger |
| **LiPo Battery (3.7V)** | 1 | Single-Cell Pack | Power Source |
| **Rotary Encoder** | 1 | Panel/Through-Hole | Digital Scroll Wheel |
| **Tactile Switches** | 14–16 | Through-Hole (THT) | Matrix Buttons |
| **Vibration Motors** | 2 | Pancake / 3–5V ERM | Haptic Feedback |

### Discrete Semis & Passives
| Part | Quantity | Value / Rating | Placement & Function |
| :--- | :--- | :--- | :--- |
| **Resistors** | 4 | 1 kΩ (0805) | **In series** on analog lines (A0, A1, A2, A3) |
| **Resistors** | 2 | 1 kΩ (0805) | **In series** on PN2222 base pins (D11, D12) |
| **Resistor** | 1 | 10 kΩ (0805) | **In parallel** (pull-down) on Mux Pin 15 (EN) to GND |
| **Capacitors** | 4 | 0.1 µF Ceramic | **In parallel** to GND after series resistors (A0–A3) |
| **Capacitors** | 6 | 0.1 µF Ceramic | **In parallel** (VCC to GND decoupling for MUX + 5 Hall ICs) |
| **Capacitor** | 1 | 470 µF Electrolytic | **In parallel** across KB2040 RAW and GND (Power Buffer) |
| **Diodes** | 16 | 1N4148W | **In series** with each button (Cathode towards Row) |
| **Schottky Diodes**| 2 | 1N5817 (THT/DO-41)| **In series** for Power-Path OR-ing (USB & Battery to RAW) |
| **Flyback Diodes** | 2 | 1N4001 | **In parallel** across motor terminals (reverse biased) |
| **Transistors** | 2 | PN2222 (NPN) | Motor low-side drivers |

---

## 4. Hardware Pin Mapping

### KB2040 Connections
| KB2040 Pin | Label | Target Device | Notes |
| :--- | :--- | :--- | :--- |
| **Pin 0** | RX | *UNASSIGNED* | Reserved / Hardware Serial debug |
| **Pin 1** | TX | *UNASSIGNED* | Reserved / Hardware Serial debug |
| **Pin 2** | D2 | Button Matrix Row 1 | Output |
| **Pin 3** | D3 | Button Matrix Row 2 | Output |
| **Pin 4** | D4 | Button Matrix Row 3 | Output |
| **Pin 5** | D5 | Button Matrix Row 4 | Output |
| **Pin 6** | D6 | Button Matrix Col 1 | Input (`INPUT_PULLUP`) |
| **Pin 7** | D7 | Button Matrix Col 2 | Input (`INPUT_PULLUP`) |
| **Pin 8** | D8 | Button Matrix Col 3 | Input (`INPUT_PULLUP`) |
| **Pin 9** | D9 | Button Matrix Col 4 | Input (`INPUT_PULLUP`) |
| **Pin 10** | D10 | CD74HC4067 Pin 13 (S3) | Binary address bit 3 |
| **Pin 11** | D11 | Motor Driver 1 (Left Grip) | PWM via 1 kΩ base resistor |
| **Pin 12** | D12 | Motor Driver 2 (Right Grip)| PWM via 1 kΩ base resistor |
| **Pin 18** | CLK | CD74HC4067 Pin 10 (S0) | Binary address bit 0 |
| **Pin 19** | MI | CD74HC4067 Pin 11 (S1) | Binary address bit 1 |
| **Pin 20** | MO | CD74HC4067 Pin 14 (S2) | Binary address bit 2 |
| **Pin 26** | A0 | CD74HC4067 Pin 1 (SIG) | 1 kΩ in series + 0.1 µF in parallel |
| **Pin 27** | A1 | Joystick 1 X-Axis (Pitch) | 1 kΩ in series + 0.1 µF in parallel |
| **Pin 28** | A2 | Joystick 1 Y-Axis (Roll) | 1 kΩ in series + 0.1 µF in parallel |
| **Pin 29** | A3 | Push-Pull Brake (Hall) | 1 kΩ in series + 0.1 µF in parallel |
| **SDA** | GPIO 2 | Rotary Encoder Phase A | Quadrature pulse input |
| **SCL** | GPIO 3 | Rotary Encoder Phase B | Quadrature pulse input |

---

## 5. Subsystem Schematics & Topologies

### A. Analog Low-Pass Filter (A0, A1, A2, A3)
Placed immediately before the KB2040 analog inputs to filter multiplexer transients and EMI:
```
Sensor/Mux Out -----> [ 1 kΩ Resistor (In Series) ] ----+----> KB2040 Pin
                                                        |
                                            [ 0.1 µF Capacitor ] (In Parallel)
                                                        |
                                                       GND
```

### B. Multiplexer Configuration (CD74HC4067)
* **VCC (Pin 24):** 3.3V rail (with 0.1 µF ceramic cap to GND).
* **GND (Pin 12):** Ground plane.
* **EN (Pin 15):** 10 kΩ pull-down resistor to GND (chip enabled continuously).
* **S0–S3 (Pins 10, 11, 14, 13):** Connected to KB2040 `CLK`, `MI`, `MO`, `10`.
* **C0–C15:** Secondary analog controls (Look X/Y, Flaps, Throttle levers).
* **SIG (Pin 1):** Routes to KB2040 `A0` through the RC low-pass filter.

### C. Power-Path Management (Uninterrupted Supply)
Allows seamless hot-plugging between 5V USB and 3.7V battery without brownout resets:
```
USB 5V (RAW Pad Jumped) ----> [ 1N5817 Diode ] ----+
                                                    |
Battery (+) ----------------> [ 1N5817 Diode ] ----+----> KB2040 RAW Pin
                                                    |
                                          [ 470 µF Buffer Cap ] (In Parallel)
                                                    |
                                                   GND

Charging Path:
USB 5V (Before Diode) ----> TP4056 IN+
TP4056 BAT+ --------------> Battery (+)
All Grounds (Common) -----> System GND
```

### D. Low-Side Transistor Motor Driver
```
KB2040 PWM Pin ----> [ 1 kΩ (In Series) ] ----> Base (PN2222)
                                                Collector ---> Motor (-)
RAW Rail (High Current) -------------------------------------> Motor (+)
                                                Emitter -----> GND

* Flyback Diode (1N4001) connected in parallel across Motor (+) and Motor (-) 
  with Cathode (stripe) facing Motor (+).
```

---

## 6. 4-Layer PCB Stack-up & Layout Guidelines

### Layer Allocation
* **Layer 1 (Top):** Components, SMD pads, short interconnects, and clean analog traces (`A0`–`A3`, Hall outputs).
* **Layer 2 (Inner 1):** Solid, unbroken Ground plane (`GND`).
* **Layer 3 (Inner 2):** Digital routing (`S0`–`S3`, Matrix Rows/Cols, Motor PWM).
* **Layer 4 (Bottom):** Solid Ground plane (`GND`) with secondary power routing.

### Critical Routing Rules
1. **Antenna Keep-out:** Zero copper traces or planes beneath the KB2040 antenna area.
2. **Motor Isolation:** Run a dedicated trace from the RAW power rail to the motor driver circuit. Do not share return traces with analog sensor grounds.
3. **THT Via Clearance:** Group through-hole button pads away from the inner analog routing to avoid perforating Layer 2's ground shield directly below sensitive traces.
4. **Decoupling Placement:** Locate every 0.1 µF capacitor directly adjacent to its corresponding IC/sensor power pins before dropping vias to ground.
