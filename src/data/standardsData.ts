import { StandardClause, MCBCurveDefinition } from '../types/standards';

export const IS_IEC_60898_1_CLAUSES: StandardClause[] = [
  {
    clauseNumber: 'Clause 9.8',
    title: 'Test of Temperature-Rise & Measurement of Power Loss',
    scope: 'Verifies that with rated continuous current (In) passing through the circuit breaker, temperature rise on terminals and accessible surfaces does not exceed standard limits.',
    testCurrentFormula: 'I = 1.00 × In (Continuous until thermal equilibrium)',
    trippingTimeRequirement: 'Must NOT trip during test; steady-state thermal plateau reached.',
    acceptanceCriteria: 'Terminal rise ≤ 60 K (Kelvin); external handles/touchable parts ≤ 40 K.',
    prototypeRelevance: 'Monitored in real-time via NTC 100k probe array on MCB terminal lugs.',
    simulationNote: 'Configurable thermal coefficient; simulated ambient reference 26.5°C.'
  },
  {
    clauseNumber: 'Clause 9.10.1',
    title: 'Tripping Characteristics — Thermal Tripping (Overload Band)',
    scope: 'Tests response to conventional non-tripping current (1.13 In) and conventional tripping current (1.45 In) using calibrated resistive load.',
    testCurrentFormula: 'I_nt = 1.13 × In (Hold ≥ 1h) | I_t = 1.45 × In (Trip < 1h for In ≤ 63A)',
    trippingTimeRequirement: '1.13 In: No trip for t ≥ 1 hour. 1.45 In: Must trip within t < 1 hour (t < 2 hours for In > 63A).',
    acceptanceCriteria: 'Bimetallic deflection successfully unlatches mechanism and extinguishes opening arc without external damage.',
    prototypeRelevance: 'Primary automated test performed by Load Coil Bank A current regulation.',
    simulationNote: 'Simulation scales the thermal time constant to provide interactive visualization in seconds.'
  },
  {
    clauseNumber: 'Clause 9.10.2',
    title: 'Tripping Characteristics — Instantaneous Magnetic Trip (Short-Circuit Band)',
    scope: 'Tests rapid electromagnetic tripping under high surge current without intentional time delay.',
    testCurrentFormula: 'Type B: 3–5 In | Type C: 5–10 In | Type D: 10–20 In',
    trippingTimeRequirement: 'Type C: No trip at 5 In within 0.1s; MUST trip at 10 In within 0.1s (typically 10–30 ms).',
    acceptanceCriteria: 'Instantaneous contact opening; arc chute de-ionizes plasma arc; contacts remain isolated.',
    prototypeRelevance: 'Verified with high-current step burst through Bank B low-impedance loop.',
    simulationNote: 'Microcontroller timer registers capture sub-cycle trip timestamp (T_trip).'
  },
  {
    clauseNumber: 'Clause 9.11',
    title: 'Mechanical and Electrical Endurance',
    scope: 'Verifies the breaker is capable of performing repeated operating cycles under load and no-load conditions without mechanical failure.',
    testCurrentFormula: 'Operating cycles: 4,000 cycles with current at rated In + 6,000 cycles without current (total 10,000 operations).',
    trippingTimeRequirement: 'Rate of 240 operating cycles per hour (or 120 cycles/h for In > 32A).',
    acceptanceCriteria: 'No mechanical jamming, contact welding, or dielectric breakdown post-endurance test.',
    prototypeRelevance: 'Can be demonstrated in automated cyclic endurance loop mode.',
    simulationNote: 'Cycle count tracker logged in system EEPROM memory.'
  },
  {
    clauseNumber: 'Clause 9.12',
    title: 'Short-Circuit Performance at Rated Breaking Capacity (Icn)',
    scope: 'Evaluates capability of the circuit breaker to interrupt prospective short-circuit current (e.g. 6 kA / 10 kA) at rated voltage and power factor.',
    testCurrentFormula: 'Icn = 6,000 A (6 kA) at cos φ = 0.6–0.7',
    trippingTimeRequirement: 'Interruption completed within 1/2 to 1 full AC cycle (< 20 ms).',
    acceptanceCriteria: 'No permanent flashover between live poles and grounded enclosure; dielectric integrity preserved.',
    prototypeRelevance: 'Represented conceptually in the digital twin as high-current magnetic surge scenario.',
    simulationNote: 'Certified short-circuit laboratory testing requires specialized high-power generator test cells; this demonstrator shows the sequence and sensor response.'
  }
];

export const MCB_TRIP_CURVES: MCBCurveDefinition[] = [
  {
    curve: 'B',
    name: 'Type B Curve (Sensitive / Resistive Loads)',
    thermalBand: '1.13× to 1.45× In',
    magneticBand: '3× to 5× In Instantaneous Trip',
    typicalLoads: 'Domestic lighting, electric heaters, long cable runs with low fault current.',
    color: '#00f2fe'
  },
  {
    curve: 'C',
    name: 'Type C Curve (Standard / Inductive Loads)',
    thermalBand: '1.13× to 1.45× In',
    magneticBand: '5× to 10× In Instantaneous Trip',
    typicalLoads: 'General commercial/industrial circuits, fluorescent lighting, small motors, fans.',
    color: '#38bdf8'
  },
  {
    curve: 'D',
    name: 'Type D Curve (High Inrush Loads)',
    thermalBand: '1.13× to 1.45× In',
    magneticBand: '10× to 20× In Instantaneous Trip',
    typicalLoads: 'Heavy induction motors, welding equipment, X-ray machines, high-power transformers.',
    color: '#f59e0b'
  }
];
