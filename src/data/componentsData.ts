import { ComponentMetadata } from '../types/components';

export const PROTOTYPE_COMPONENTS: Record<string, ComponentMetadata> = {
  frame_rack: {
    id: 'frame_rack',
    name: 'Perforated Industrial Steel Rack',
    shortLabel: 'Chassis Frame',
    subsystem: 'Structural',
    type: 'Heavy Slotted Angle Chassis',
    status: 'READY',
    purpose: 'Provides rigid structural mounting, electrical ground bonding, and modular chassis housing for DIN rails and power components.',
    technicalSpecs: {
      material: 'Mild Steel (Powder-coated Matte Black)',
      dimensions: '580mm × 360mm × 740mm',
      earthing: 'Bonded with Copper Earth Lug (≤ 0.1 Ω)',
      mountingStandard: 'Standard 35mm DIN Rail (EN 50022)',
      cooling: 'Natural Convection & Perforated Heat Dissipation'
    },
    liveMetrics: {
      temperature: 26.2,
      stateText: 'Chassis Structurally Grounded'
    },
    circuitRole: 'Equipotential chassis ground reference and mechanical isolation barrier.',
    testRelevance: 'Prevents chassis leakage current and provides rigid backing against mechanical shock during high-current magnetic trip.',
    safetyConsiderations: 'Continuous earth continuity monitoring prevents touch potential hazard.',
    failureModes: ['Ground bond degradation', 'Structural fastener looseness', 'Vibration fatigue'],
    threePosition: [0, 0, 0],
    colorAccent: '#64748b'
  },

  mcb_bank: {
    id: 'mcb_bank',
    name: 'MCB Under Test (UUT)',
    shortLabel: 'MCB UNDER TEST',
    subsystem: 'Protection UUT',
    type: 'Miniature Circuit Breaker (Single Pole / C-Curve)',
    status: 'READY',
    purpose: 'Primary Device Under Test. Provides automated overcurrent protection via thermal bimetal strip (overload) and electromagnetic solenoid (short-circuit).',
    technicalSpecs: {
      standard: 'IS/IEC 60898-1',
      ratedCurrent: '16 A (Configurable 6A / 10A / 16A / 32A)',
      ratedVoltage: '230/400 V AC, 50 Hz',
      tripCurve: 'Type C (5–10 In Instantaneous Magnetic Band)',
      breakingCapacity: '6000 A (6kA)',
      poles: '1P (Single Pole DIN Rail Mount)',
      mechanism: 'Thermal Bimetallic + Solenoid Plunger'
    },
    liveMetrics: {
      voltage: 0,
      current: 0,
      temperature: 26.5,
      stateText: 'MCB Contacts CLOSED (Ready for Energization)'
    },
    circuitRole: 'Series in-line safety breaker placed between mains contactor and calibrated testing load coils.',
    testRelevance: 'Primary subject of verification: measure exact trip time vs applied current multiplier against standard time-current curves.',
    safetyConsiderations: 'High arc energy generated during contact separation; de-ionizing arc chute extinguishes the electrical plasma.',
    failureModes: ['Contact welding', 'Bimetal calibration drift', 'Magnetic mechanism sticking', 'Arc chute erosion'],
    threePosition: [-0.65, 0.45, 0.28],
    colorAccent: '#00f2fe'
  },

  ac_contactor: {
    id: 'ac_contactor',
    name: 'Heavy-Duty AC Contactor',
    shortLabel: 'AC Contactor',
    subsystem: 'Power Switching',
    type: 'Electromagnetic Power Contactor with Aux Feedback',
    status: 'READY',
    purpose: 'Provides safe, galvanic relay-controlled mains switching to energize and isolate the testing circuit during automated sequences.',
    technicalSpecs: {
      coilVoltage: '230 V AC / 50 Hz (or 24V DC driver)',
      mainContacts: '3-Pole Normally Open (NO), 32A AC-3 Rating',
      auxiliaryContact: '1 NO + 1 NC Status Feedback to MCU',
      switchingLife: '1,000,000 Mechanical Operations',
      operatingTime: 'Closing: 12–22 ms, Opening: 4–19 ms'
    },
    liveMetrics: {
      voltage: 0,
      current: 0,
      temperature: 27.0,
      stateText: 'Coil DE-ENERGIZED (Contacts OPEN)'
    },
    circuitRole: 'High-speed master power disconnect controlled by MCU relay output and hardwired emergency stop circuit.',
    testRelevance: 'Controls precision energization timing and provides fail-safe circuit isolation upon MCB trip or safety abort.',
    safetyConsiderations: 'In event of contactor weld, auxiliary NC contact fails to close, triggering immediate safety lockout.',
    failureModes: ['Coil burnout', 'Contact chatter / pitting', 'Welded main contacts', 'Auxiliary feedback disconnect'],
    threePosition: [0.0, 0.45, 0.28],
    colorAccent: '#38bdf8'
  },

  relay_module: {
    id: 'relay_module',
    name: 'Optocoupler Relay Control Board',
    shortLabel: 'Relay Board',
    subsystem: 'Control Logic',
    type: '4-Channel 5V Optoisolated Relay Module',
    status: 'READY',
    purpose: 'Interfaces low-voltage MCU digital outputs (5V) with high-voltage AC contactor coils and load coil bank selection relays.',
    technicalSpecs: {
      channels: '4 Independent SPDT Relays',
      isolation: 'PC817 Optocouplers (Galvanic Isolation 5000Vrms)',
      contactRating: '10A 250VAC / 10A 30VDC',
      controlLogic: 'Active LOW / HIGH Configurable with Status LEDs',
      coilCurrent: 'Approx 70 mA per active channel'
    },
    liveMetrics: {
      voltage: 5.0,
      current: 0.08,
      temperature: 28.1,
      stateText: 'All Relays Standby (LEDs OFF)'
    },
    circuitRole: 'Translates MCU stage automation commands into high-power switching pulses.',
    testRelevance: 'Executes synchronized load step switching and energization pulse sequences.',
    safetyConsiderations: 'Optical isolation prevents lethal mains AC transients from entering the digital microcontroller plane.',
    failureModes: ['Optocoupler degradation', 'Flyback diode failure', 'Relay contact bounce'],
    threePosition: [0.65, 0.45, 0.28],
    colorAccent: '#818cf8'
  },

  controller_unit: {
    id: 'controller_unit',
    name: 'ESP32 Industrial Microcontroller (MCU)',
    shortLabel: 'ESP32 / MCU',
    subsystem: 'Processing',
    type: 'ESP32-WROOM / Industrial MCU Shield',
    status: 'READY',
    purpose: 'Core test sequencer: executes state machine routines, reads analog sensor telemetry at high speed, calculates True-RMS metrics, and updates LCD & serial link.',
    technicalSpecs: {
      controllerArchitecture: 'ESP32 32-Bit Dual-Core MCU (ADC & Digital I/O Shield)',
      adcResolution: '12-bit Multichannel Analog Converter with Low-Noise Amp',
      samplingRate: '5 kS/s high-speed true-RMS reconstruction sampling',
      interfaces: 'I2C Bus (LCD/Sensors), SPI, Hardware Interrupts, UART',
      hardwareVerification: 'Physical prototype board — verified from prototype photos'
    },
    liveMetrics: {
      voltage: 5.02,
      current: 0.18,
      temperature: 31.4,
      stateText: 'Processing Unit Active (Firmware Loop Running)'
    },
    circuitRole: 'Master automated controller computing trip time delta with microsecond hardware timer registers.',
    testRelevance: 'Logs trip event timestamp (T_trip - T_energize) with high precision.',
    safetyConsiderations: 'Integrated hardware watchdog timer resets outputs to SAFE state if code execution hangs.',
    failureModes: ['Watchdog timeout', 'Brownout reset under high load', 'ADC reference drift'],
    threePosition: [0.62, 0.12, 0.28],
    colorAccent: '#10b981'
  },

  lcd_display: {
    id: 'lcd_display',
    name: '20x4 Alphanumeric LCD Display',
    shortLabel: 'LCD Display',
    subsystem: 'UI / Readout',
    type: 'HD44780 Industrial I2C Character Display',
    status: 'READY',
    purpose: 'Provides on-panel operator feedback showing live stage index, RMS current, line voltage, terminal temperature, and trip time verdict.',
    technicalSpecs: {
      format: '20 Characters × 4 Lines',
      interface: 'PCF8574 I2C Expander (Address 0x27 / 100kHz)',
      backlight: 'High-Contrast Blue with White LED Text',
      supplyVoltage: '5.0 V DC',
      refreshRate: '10 Hz Telemetry Update Window'
    },
    liveMetrics: {
      voltage: 5.0,
      current: 0.04,
      temperature: 29.0,
      stateText: 'Screen Active: Displaying Live Telemetry'
    },
    circuitRole: 'Local visual readout on the physical enclosure panel.',
    testRelevance: 'Allows standalone operation without host PC connection.',
    safetyConsiderations: 'Displays immediate FAULT and E-STOP notifications.',
    failureModes: ['I2C bus lockup', 'Backlight LED open circuit', 'Contrast pot misalignment'],
    threePosition: [0.65, 0.95, 0.32],
    colorAccent: '#3b82f6'
  },

  power_supply: {
    id: 'power_supply',
    name: 'Industrial SMPS Dual Power Unit',
    shortLabel: 'SMPS Unit',
    subsystem: 'Power Supply',
    type: 'Regulated Switching Power Supply (24V / 12V / 5V)',
    status: 'READY',
    purpose: 'Converts 230V AC mains into stabilized, isolated DC power rails for the microcontroller, sensors, relay coils, and display.',
    technicalSpecs: {
      inputVoltage: '100–240 V AC (Wide Range)',
      outputRails: '24V DC @ 2A, 12V DC @ 3A, 5V DC @ 4A',
      efficiency: '> 88% with Active Power Factor Correction',
      protection: 'Overload (Hiccup mode), Overvoltage & Short-Circuit Cutoff',
      cooling: 'Perforated Aluminum Enclosure'
    },
    liveMetrics: {
      voltage: 24.0,
      current: 0.42,
      temperature: 33.5,
      stateText: 'DC Rails Stable (+5.0V, +12.0V, +24.0V OK)'
    },
    circuitRole: 'Low-voltage DC bus supplier isolated from the high-current testing load circuit.',
    testRelevance: 'Ensures noise-free sensor analog ground references during heavy magnetic trip arcs.',
    safetyConsiderations: 'Dual barrier insulation prevents high-voltage mains leakage into logic lines.',
    failureModes: ['Input surge fuse blowout', 'Electrolytic capacitor thermal dry-out', 'Thermal shutdown'],
    threePosition: [-0.65, -0.15, 0.28],
    colorAccent: '#f59e0b'
  },

  terminal_blocks: {
    id: 'terminal_blocks',
    name: 'DIN-Rail Feed-Through Terminal Bank',
    shortLabel: 'Terminals',
    subsystem: 'Distribution',
    type: 'UK-5N / Ground Modular Screw Terminals',
    status: 'READY',
    purpose: 'Organizes high-current power distribution and low-voltage signal breakout with color-coded safety partitioning.',
    technicalSpecs: {
      wireCapacity: '0.2 to 6 mm² (10 AWG Heavy Flexible Copper)',
      ratedVoltage: '800 V AC/DC',
      ratedCurrent: '41 A Continuous',
      clampingType: 'Screw Clamp with High-Torque Zinc-Coated Steel',
      colorCoding: 'Grey (Phase L1), Blue (Neutral N), Green/Yellow (PE Earth)'
    },
    liveMetrics: {
      voltage: 0,
      current: 0,
      temperature: 25.8,
      stateText: 'Terminals Secure / Nominal Impedance'
    },
    circuitRole: 'Main interconnection hub between mains inlet, contactor, MCB bank, and load coils.',
    testRelevance: 'Monitored for contact thermal rise in accordance with IS/IEC 60898-1 Clause 9.8.',
    safetyConsiderations: 'Finger-safe touch proof shroud prevents accidental contact with live conductors.',
    failureModes: ['Loose screw terminal high resistance', 'Thermal overheating', 'Insulation tracking'],
    threePosition: [0.0, -0.15, 0.28],
    colorAccent: '#a855f7'
  },

  load_coil_01: {
    id: 'load_coil_01',
    name: 'High-Current Heating Load Coil 1',
    shortLabel: 'COIL 1',
    subsystem: 'Testing Load',
    type: 'Heavy Spiral Nichrome Resistance Element (Primary Stage)',
    status: 'READY',
    purpose: 'Primary heating resistance coil drawing calibrated test current to induce thermal rise in the MCB bimetallic strip.',
    technicalSpecs: {
      resistance: '3.6 Ω Calibrated Element',
      wireType: 'High-Gauge Nichrome 80/20 Resistance Spiral',
      coreMount: 'High-Temperature Steatite Ceramic Spool Core',
      thermalRating: 'Up to 500°C with Open Convection Cooling'
    },
    liveMetrics: {
      voltage: 0,
      current: 0,
      temperature: 27.4,
      power: 0,
      stateText: 'Coil 1 Standby (De-energized)'
    },
    circuitRole: 'Primary test circuit load element in series with contactor and MCB under test.',
    testRelevance: 'Provides base calibrated test current for 1.00x and 1.45x In thermal overload verification.',
    safetyConsiderations: 'Operates at high temperatures under sustained overload; monitored by temperature sensor array.',
    failureModes: ['Resistance coil open-circuit', 'Thermal fatigue'],
    threePosition: [-0.52, -0.75, 0.25],
    colorAccent: '#ef4444'
  },

  load_coil_02: {
    id: 'load_coil_02',
    name: 'High-Current Heating Load Coil 2',
    shortLabel: 'COIL 2',
    subsystem: 'Testing Load',
    type: 'Heavy Spiral Nichrome Resistance Element (Secondary Stage)',
    status: 'READY',
    purpose: 'Secondary switched spiral heating coil engaging in parallel with Coil 1 to generate higher overload current steps (2.55x In).',
    technicalSpecs: {
      resistance: '2.4 Ω Switched Stage',
      wireType: 'Heavy Gauge Spiral Nichrome Element',
      coreMount: 'Steatite Ceramic Spool Standoff',
      thermalRating: 'Up to 500°C Rated Element'
    },
    liveMetrics: {
      voltage: 0,
      current: 0,
      temperature: 26.8,
      power: 0,
      stateText: 'Coil 2 Standby (De-energized)'
    },
    circuitRole: 'Secondary switched stage for progressive thermal current ramping.',
    testRelevance: 'Enables multi-step current testing matching IS/IEC 60898-1 overload thresholds.',
    safetyConsiderations: 'High thermal heat dissipation during multi-stage testing.',
    failureModes: ['Relay step weld', 'Thermal runaway'],
    threePosition: [0.0, -0.75, 0.25],
    colorAccent: '#f97316'
  },

  load_coil_03: {
    id: 'load_coil_03',
    name: 'High-Current Heating Load Coil 3',
    shortLabel: 'COIL 3',
    subsystem: 'Testing Load',
    type: 'Low-Impedance High-Current Spiral Surge Element',
    status: 'READY',
    purpose: 'Tertiary high-current spiral coil switched in for severe thermal overloads and instantaneous magnetic surge simulations.',
    technicalSpecs: {
      resistance: '1.2 Ω Surge Stage',
      wireType: 'High-Current Low-Resistance Nichrome Spiral',
      coreMount: 'Ceramic Spool Core with Heavy Brass Terminals',
      surgeCapacity: 'Instantaneous 150A Peak Pulse Response'
    },
    liveMetrics: {
      voltage: 0,
      current: 0,
      temperature: 26.5,
      power: 0,
      stateText: 'Coil 3 Standby (De-energized)'
    },
    circuitRole: 'High-current surge stage generating peak instantaneous currents.',
    testRelevance: 'Verifies instantaneous magnetic trip response (< 30ms) under high-current surges.',
    safetyConsiderations: 'Extreme rapid temperature ramp (ΔT/dt > 5°C/s during high-current burst).',
    failureModes: ['Coil flashover', 'Ceramic core mechanical shock'],
    threePosition: [0.52, -0.75, 0.25],
    colorAccent: '#eab308'
  },

  sensor_current: {
    id: 'sensor_current',
    name: 'Hall-Effect True RMS Current Sensor',
    shortLabel: 'Current Sensor',
    subsystem: 'Measurement',
    type: 'ACS758 / ACS712 Precision Current Transducer Module',
    status: 'READY',
    purpose: 'Measures continuous circuit current in real-time with galvanic isolation and microsecond bandwidth for instant trip detection.',
    technicalSpecs: {
      sensingRange: '-50 A to +50 A / -100A to +100A AC/DC',
      sensitivity: '40 mV / A (Calibrated with Low Noise Filter)',
      bandwidth: '120 kHz Internal Hall Bandwidth',
      isolationVoltage: '3000 Vrms Galvanic Dielectric Strength',
      linearityError: '± 1.0 % across calibrated operating range'
    },
    liveMetrics: {
      current: 0.0,
      voltage: 5.0,
      temperature: 27.2,
      stateText: 'Baseline Zero Current Calibrated (0.00 A)'
    },
    circuitRole: 'In-series transducer feeding analog telemetry into MCU ADC pin A0.',
    testRelevance: 'Primary measurement tool to detect exact millisecond timestamp when current drops below threshold (Trip Detected).',
    safetyConsiderations: 'Galvanic isolation protects logic plane from load circuit potential.',
    failureModes: ['Sensor open circuit', 'Zero-offset drift', 'Amplifier saturation on extreme surge'],
    threePosition: [-0.35, 0.12, 0.32],
    colorAccent: '#06b6d4'
  },

  sensor_voltage: {
    id: 'sensor_voltage',
    name: 'AC Line Voltage Transducer Module',
    shortLabel: 'Voltage Sensor',
    subsystem: 'Measurement',
    type: 'ZMPT101B Active Voltage Transformer & Filter',
    status: 'READY',
    purpose: 'Monitors line AC voltage, voltage sag during load application, and verifies complete dielectric isolation upon breaker opening.',
    technicalSpecs: {
      inputRange: '0 to 250 V AC True RMS',
      outputSignal: '0 to 5.0 V Analog Sine with DC Offset',
      phaseShift: '< 20 arcminutes (Phase Angle Preservation)',
      dielectricRating: '4000 V Isolation Voltage'
    },
    liveMetrics: {
      voltage: 231.4,
      temperature: 26.5,
      stateText: 'Mains Supply Validated (230V AC @ 50.0 Hz)'
    },
    circuitRole: 'Parallel potential transducer sensing supply stability and contact separation.',
    testRelevance: 'Validates zero residual voltage across load terminals post-trip.',
    safetyConsiderations: 'Ensures no phantom voltage remains present before user touch is permitted.',
    failureModes: ['Transformer primary winding open', 'Operational amplifier clipping'],
    threePosition: [0.0, 0.12, 0.32],
    colorAccent: '#3b82f6'
  },

  sensor_temp: {
    id: 'sensor_temp',
    name: 'Multi-Point Thermistor / Thermocouple Array',
    shortLabel: 'Temp Sensor',
    subsystem: 'Measurement',
    type: 'NTC 100K Precision Bead / K-Type Thermocouple Probes',
    status: 'READY',
    purpose: 'Monitors thermal rise on MCB terminals, bimetal housing, and load coils in compliance with IS/IEC 60898-1 Clause 9.8 limits.',
    technicalSpecs: {
      tempRange: '-20°C to +300°C',
      accuracy: '± 0.5°C with Steinhart-Hart Equation Linearization',
      locations: 'Sensor 1: MCB Terminal Lugs, Sensor 2: Load Coil A, Sensor 3: Chassis Ambient',
      timeConstant: '< 1.5 seconds in air'
    },
    liveMetrics: {
      temperature: 26.8,
      stateText: 'Ambient Reference: 26.8°C'
    },
    circuitRole: 'Over-temperature safety interlock and temperature-rise verification.',
    testRelevance: 'Ensures terminal rise remains ≤ 60K above ambient during rated endurance.',
    safetyConsiderations: 'Triggers automatic emergency shutdown if thermal threshold (85°C) is exceeded.',
    failureModes: ['Thermistor detachment', 'Lead wire short to ground', 'Thermal lag error'],
    threePosition: [0.35, 0.12, 0.32],
    colorAccent: '#ec4899'
  },

  emergency_stop: {
    id: 'emergency_stop',
    name: 'Emergency Stop Push-Lock Button',
    shortLabel: 'E-STOP',
    subsystem: 'Safety System',
    type: 'IEC 60947-5-5 Twist-to-Reset Mushroom E-STOP',
    status: 'READY',
    purpose: 'Hardwired manual safety kill-switch that instantly de-energizes the contactor coil and commands the MCU into locked safety state.',
    technicalSpecs: {
      actuator: '40mm Red Mushroom Button with Bright Yellow Bezel',
      contacts: '2 Normally Closed (NC) Positive Opening Contacts (Direct Drive)',
      latching: 'Mechanical Push-to-Lock, Turn-to-Reset Mechanism',
      rating: '600V, 10A AC-15 Industrial Safety Grade'
    },
    liveMetrics: {
      stateText: 'E-STOP Normal (Contacts CLOSED / Safety Loop ARMED)'
    },
    circuitRole: 'Master hardware safety interlock wired in series with contactor coil.',
    testRelevance: 'Allows immediate manual abort of any simulation or hardware run.',
    safetyConsiderations: 'Must be manually unlatched and system reset before any new test can be initiated.',
    failureModes: ['Contact oxidation', 'Mechanical latch jamming'],
    threePosition: [-0.65, 0.95, 0.32],
    colorAccent: '#ef4444'
  },

  control_switches: {
    id: 'control_switches',
    name: 'Operator Control Switch Panel',
    shortLabel: 'Control Switches',
    subsystem: 'Operator Input',
    type: 'Illuminated Industrial Push Buttons & Key Selector',
    status: 'READY',
    purpose: 'Provides tactile control interface for START, STOP, RESET, and Auto/Manual test mode selection.',
    technicalSpecs: {
      startButton: 'Green Momentary Pushbutton with 24V LED Ring',
      stopButton: 'Red Momentary Pushbutton with Shroud Guard',
      selector: '2-Position Rotary Key Switch (Manual / Automated Loop)',
      contactType: 'Snap-action Silver Alloy Contacts'
    },
    liveMetrics: {
      stateText: 'System Armed / Ready for Operator Command'
    },
    circuitRole: 'Operator trigger inputs to the MCU firmware interrupt pins.',
    testRelevance: 'Provides physical hardware counterpart to the digital interface controls.',
    safetyConsiderations: 'Recessed stop button prevents accidental de-activation.',
    failureModes: ['Switch contact bounce', 'LED pilot indicator burnout'],
    threePosition: [0.0, 0.95, 0.32],
    colorAccent: '#22c55e'
  },

  wiring_harness: {
    id: 'wiring_harness',
    name: 'Industrial Wire Loom & Power Bus',
    shortLabel: 'Wiring Loom',
    subsystem: 'Wiring System',
    type: 'Color-Coded Flame-Retardant Heavy Gauge Loom',
    status: 'READY',
    purpose: 'Routes high-current test power and shielded low-voltage logic signals through organized slotted cable ducts and terminal channels.',
    technicalSpecs: {
      powerWires: '4.0 mm² High-Flex Copper (Red: Phase, Blue/Black: Neutral, Yellow/Green: Earth)',
      signalWires: '0.5 mm² Twisted Shielded Instrumentation Cable',
      insulation: 'FR-PVC 105°C Flame-Retardant (VW-1 / IEC 60332)',
      lacing: 'DIN Slotted Wiring Ducts with Snap-on Covers'
    },
    liveMetrics: {
      stateText: 'Insulation Integrity Verified'
    },
    circuitRole: 'Complete electrical interconnection network with live particle flow visualization.',
    testRelevance: 'Visualizes exact current paths from source -> MCB -> contactor -> load -> return.',
    safetyConsiderations: 'Proper wire sizing prevents dangerous conductor heating during surge currents.',
    failureModes: ['Chafing against sharp sheet metal edges', 'Terminal ferrule crimp looseness'],
    threePosition: [0, 0, 0.15],
    colorAccent: '#e2e8f0'
  },

  simulated_fault_point: {
    id: 'simulated_fault_point',
    name: 'Downstream Simulated Fault Point',
    shortLabel: 'Fault Point',
    subsystem: 'Fault Injection',
    type: 'High-Current Switched Shunt / Test Fault Contactor',
    status: 'READY',
    purpose: 'Simulates a bolted short-circuit or high-current ground fault DOWNSTREAM of the MCB and Contactor to verify the protective response of the circuit breaker.',
    technicalSpecs: {
      location: 'Downstream of MCB & Contactor (Load Circuit)',
      surgeCurrentCapacity: '100A+ Instantaneous Inrush',
      switchType: 'Solid-State / High-Speed Mechanical Shunt',
      safetyIsolation: 'Enclosed with Arc Containment Barrier'
    },
    liveMetrics: {
      voltage: 0,
      current: 0,
      temperature: 26.5,
      stateText: 'Fault Shunt OPEN (Normal Circuit Operation)'
    },
    circuitRole: 'Designated fault injection location downstream of the protective breaker.',
    testRelevance: 'Validates instantaneous electromagnetic trip speed (< 30ms) of the MCB under severe downstream short-circuit faults.',
    safetyConsiderations: 'Downstream fault causes intense current surge; MCB must trip rapidly to de-energize and protect the circuit.',
    failureModes: ['Shunt electrode welding', 'Arc flash residue buildup'],
    threePosition: [-0.48, -0.28, 0.32],
    colorAccent: '#ef4444'
  }
};
