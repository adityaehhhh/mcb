# MCB Testing System — 3D Engineering Digital Twin
## Project Source of Truth (`memory.md`)

### 1. Project Overview
A production-grade, interactive 3D engineering digital twin of an actual student-built Miniature Circuit Breaker (MCB) Testing System.
The system faithfully represents the physical prototype: exposed black slotted/perforated metal frame, white electrical mounting backboards, DIN rail components, MCB bank under test, high-current AC contactors, relay modules, Arduino/microcontroller control section, 20x4 I2C LCD readout, dual-rail industrial SMPS power supply, terminal blocks, manual toggle switches, emergency stop mushroom button, toroidal/nichrome testing load coils, current/voltage/temperature sensors, and industrial color-coded wire looms.

---

### 2. Hardware Architecture & Component Inventory
Every component in the 3D scene and simulation engine is keyed by a stable, standardized identifier:

| Component ID | Display Name | Subsystem | Description & Function |
|---|---|---|---|
| `frame_rack` | Black Perforated Metal Chassis | Structural | Slotted-angle & perforated steel enclosure with isolation feet and acrylic safety shield |
| `mcb_bank` | MCB Bank (Unit Under Test) | Protection UUT | DIN-rail mounted C-Curve/B-Curve miniature circuit breaker with toggle lever, arc chute, bimetal strip & magnetic trip solenoid |
| `ac_contactor` | Heavy-Duty AC Contactor | Power Switching | 3-phase/single-phase 25A/40A magnetic contactor with 230V coil and auxiliary NO/NC status feedback |
| `relay_module` | 4-Channel Optocoupler Relay Board | Control Logic | 5V relay module with optoisolation, flyback diodes, and status indicator LEDs for stage triggering |
| `controller_unit` | Industrial Arduino Mega / MCU Board | Processing | Microcontroller with ADC, digital I/O shield, SPI/I2C communication, and test-routine firmware |
| `lcd_display` | 20x4 Alphanumeric LCD | UI / Readout | Blue backlit HD44780 I2C display rendering live system state, voltage, current, temperature & trip timing |
| `power_supply` | Industrial Dual-Rail SMPS (24V/12V/5V) | Power Supply | Perforated metal caged switching power supply with EMI filter and terminal barrier strip |
| `terminal_blocks` | DIN-Rail UK/Phoenix Terminal Strips | Distribution | Color-coded modular terminal blocks for Phase, Neutral, Ground and low-voltage control signals |
| `load_coil_01` | Testing Load Coil A (Toroidal / Resistive) | Testing Load | Primary high-current load element generating calibrated thermal/overload current draw |
| `load_coil_02` | Testing Load Coil B (Auxiliary Bank) | Testing Load | Secondary switched resistive/inductive load stage for multi-step overcurrent testing |
| `sensor_current` | Hall-Effect Current Sensor (ACS758/ACS712) | Measurement | Galvanically isolated high-precision current transducer measuring true RMS circuit current |
| `sensor_voltage` | AC Voltage Transducer Module | Measurement | Step-down transformer/resistor divider sensing line voltage and voltage drop during trip |
| `sensor_temp` | NTC Thermistor / Thermocouple Array | Measurement | High-temperature probe attached to MCB terminal lugs and load coils to monitor thermal rise (ΔT) |
| `emergency_stop` | Emergency Stop Push-Lock Button | Safety System | Latching red mushroom push button with yellow bezel hardwired to master safety contactor coil |
| `control_switches` | Control Selector & Push Buttons | Operator Input | Panel-mounted START/STOP illuminated push buttons and Auto/Manual mode selector switches |
| `wiring_harness` | Color-Coded Power & Control Loom | Wiring System | Red (Live/Phase), Black/Blue (Neutral), Green/Yellow (Earth), Orange/Yellow (5V/12V Control Lines) with animated particle flow |

---

### 3. Centralized Simulation State Machine
The test sequence executes through 18 discrete, deterministic engineering stages:
1. `POWER_ON` (Mains power applied, SMPS active)
2. `SYSTEM_INITIALIZATION` (MCU boot, I2C peripherals initialized)
3. `COMPONENT_SELF_CHECK` (Sensor baseline validation, zero-offset calibration)
4. `SAFETY_CHECK` (Emergency stop status, safety interlock verification)
5. `MCB_IDENTIFICATION` (UUT profile verification: In, Poles, Curve)
6. `PRE_TEST_INSPECTION` (Line voltage stability check, cold resistance check)
7. `CIRCUIT_PREPARATION` (Pre-energization routing, relay arming)
8. `CONTACTOR_ACTIVATION` (Contactor coil energized, auxiliary contact closed)
9. `CIRCUIT_ENERGIZATION` (Mains voltage applied across MCB terminals, animated power flow)
10. `LOAD_APPLICATION` (Load coil bank switched in, current rises to test level)
11. `LIVE_MEASUREMENT` (RMS current, terminal voltage & temperature rise monitoring)
12. `TEST_CONDITION_DEVELOPMENT` (Thermal bimetal heating or magnetic solenoid flux buildup)
13. `MCB_RESPONSE` (Bimetallic deflection or plunger actuation begins)
14. `TRIP_DETECTION` (Circuit break detected: current drops to 0A, toggle lever snaps to OFF)
15. `CIRCUIT_ISOLATION` (Contactor opens, load coil de-energized, safety disarm)
16. `POST_TEST_VERIFICATION` (Dielectric gap check, residual voltage discharge)
17. `RESULT_VALIDATION` (Trip time evaluated against configured simulation curve)
18. `REPORT_COMPLETE` (Summary report generated with PASS/FAIL verdict, telemetry frozen)

---

### 4. Scenario Catalog
1. `NORMAL_OPERATION`: Rated current (1.00x In) continuous run, no trip, PASS.
2. `OVERLOAD_145`: Thermal overload (1.45x In) bimetallic strip trip, PASS (thermal trip time ~15–60s).
3. `OVERLOAD_255`: High thermal overload (2.55x In) rapid thermal trip, PASS (trip time ~3–8s).
4. `SHORT_CIRCUIT_HIGH_CURRENT`: Magnetic instantaneous trip (5x–10x In), solenoid trip within <30ms, PASS.
5. `MCB_FAILS_TO_TRIP`: Mechanical jamming or contact welding fault, fails to trip before timeout, FAIL.
6. `CURRENT_SENSOR_FAILURE`: Current sensor output open-circuit / out of bounds, safety abort.
7. `VOLTAGE_SENSOR_FAILURE`: Line voltage sensor loss / zero reading, safety abort.
8. `TEMPERATURE_SENSOR_FAILURE`: Thermistor disconnected / thermal runaway flag, safety abort.
9. `CONTACTOR_FAILURE`: Contactor auxiliary contact mismatch / welded contactor, test blocked.
10. `POWER_FAILURE`: Mains power dropout mid-test, immediate safe de-energization.
11. `EMERGENCY_STOP_TRIGGER`: Manual emergency stop button pressed, instant hardware trip & lockout.
12. `CONTROLLER_WATCHDOG_FAULT`: Microcontroller communication lost, fail-safe disengage.
13. `OVER_TEMPERATURE_HAZARD`: Chassis or load coil exceeds 85°C limit, emergency shutdown.
14. `SAFETY_INTERLOCK_FAULT`: Safety shield / chassis access interlock opened during test, instant cutoff.

---

### 5. Standards & Compliance Reference: IS/IEC 60898-1
- Applicable Framework: **IS/IEC 60898-1** (Electrical accessories — Circuit-breakers for overcurrent protection for household and similar installations)
- Test Categories Reference:
  - Clause 9.10: Tripping characteristic (Type B: 3–5 In, Type C: 5–10 In, Type D: 10–20 In)
  - Clause 9.8: Temperature-rise test (Terminals ≤ 60K rise, External handles ≤ 40K rise)
  - Clause 9.11: Mechanical and electrical endurance
  - Clause 9.12: Short-circuit capability tests
- **Compliance Disclaimer**: *This software is a Digital Simulation and Test Workflow Demonstrator. All parameters are simulation references; exact thresholds and compliance evaluations must be performed with calibrated laboratory equipment in accordance with verified standard procedures.*

---

### 6. Main Interface & Clean Layout Architecture
The main interface prioritizes the 3D machine as the HERO (65–75%+ visual focus):
- **Hero 3D Viewport**: Large, realistic student-built prototype featuring slotted black frame, white mounting backboards, exposed multi-color wiring looms, spaced circular light rings (`○ ○ ○`) following wire geometry, 3 spiral heating load coils (`COIL 1`, `COIL 2`, `COIL 3`), distinct `MCB UNDER TEST` unit, relay board with active LEDs, contactor mechanical closure, and live 20x4 blue LCD display.
- **Top-Right Compact Floating Telemetry Graph**: Compact widget (240px wide) rendering real-time Current vs Time or Temp vs Time with rated benchmark threshold.
- **Top-Left Compact Fault Inspector**: Ultra-compact engineering notification (270px wide) reporting exact fault identity, affected location, telemetry delta (e.g. 26.8°C → DISCONNECTED or 230V → 68V), and sequence status with `[ INSPECT ]` and `[ RESET ]` controls.
- **Single Context Panel Rule**: Full right-side component inspector NEVER opens automatically during faults; it only opens when the user explicitly clicks `[ INSPECT ]` or clicks a 3D component.
- **Slim Unified Bottom Action Bar**: Floating slim bar (height ~58px) housing camera view presets, primary action buttons (`[ ▶ START ]`, `[ ■ STOP ]`, `[ ↻ RESET ]`), and a single-line stage/fault status badge without extra overlapping stage cards.

---

### 7. 3D Digital Twin Visual Refinements & Current Flow Architecture
1. **Accurate Fault Localization & Local 3D Anchor**:
   - For any fault scenario (e.g., *Thermistor Disconnect / Thermal Sensor Fault* or *Mains Supply Voltage Collapse Mid-Test*), the fault visually originates directly from the affected component (`sensor_temp` or `power_supply`), with a local pulsing red warning beacon and compact 3D callout.
   - Long screen-crossing diagonal lines removed in favor of direct local 3D markers.
   - Smooth auto-framing adjusts the camera towards the affected component while keeping the full machine clearly visible.
2. **Clear Control Electronics Hierarchy & MCU Visibility**:
   - Explicit spatial separation: `POWER SUPPLY (Bottom Left)` → `ESP32 / MCU (Mid Right)` → `RELAY MODULE (Top Right)` → `AC CONTACTOR (Top Center)` → `TEST CIRCUIT (MCB & Load Coils)`.
   - Subtle world-space label `ESP32 / CONTROL UNIT` attached near the board standoffs.
3. **Animated Traveling Spaced Circular Light Rings (`○ ○ ○`)**:
   - Thin, spaced cyan light rings (`#38bdf8` with soft `#00f2fe` halo) oriented perpendicular to wire curve tangents via `TorusGeometry`.
   - Complete circuit path traversal: `Power Source → MCB In/Out → AC Contactor L1/T1 → Current Sensor → Downstream Shunt → Load Coils 1, 2, 3 → Return Loom → Neutral Terminal`.
   - Dynamic physics: speed and glow scale synchronously with True-RMS current; during sensor disconnect, electrical flow continues physically while the measurement path is flagged faulty and test safely halted.



