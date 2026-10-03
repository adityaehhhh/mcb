import { useState, useEffect, useRef, useCallback } from 'react';
import { ComponentStatus, ComponentMetadata } from '../types/components';
import { 
  StageDefinition, 
  StageId, 
  SimulationScenarioId, 
  ScenarioDefinition, 
  SimulationVerdict, 
  TelemetryPoint, 
  LogEvent, 
  TestResultSummary 
} from '../types/simulation';
import { PROTOTYPE_COMPONENTS } from '../data/componentsData';
import { SIMULATION_STAGES } from '../data/stagesData';
import { SIMULATION_SCENARIOS } from '../data/scenariosData';
import { audioEngine } from './audioEngine';
import confetti from 'canvas-confetti';

export type ViewMode = 'DEFAULT' | 'XRAY' | 'EXPLODED' | 'ISOLATED' | 'PRESENTATION';
export type CameraPreset = 'DEFAULT' | 'FRONT' | 'SIDE' | 'TOP' | 'MCB' | 'SENSORS' | 'LOAD';

export interface TestConfig {
  mcbRatingA: number;
  mcbCurve: 'B' | 'C' | 'D';
  poles: string;
  simulationSpeed: number;
}

export interface ActiveFaultData {
  scenarioId: string;
  title: string;
  locationLabel: string;
  locationComponentId: string;
  metricBefore: string;
  metricAfter: string;
  statusText: string;
  rootCause: string;
}

export interface SimulationState {
  currentStageIndex: number;
  stage: StageDefinition;
  scenario: ScenarioDefinition;
  isRunning: boolean;
  isEmergencyStopped: boolean;
  isMuted: boolean;
  verdict: SimulationVerdict;
  selectedComponentId: string | null;
  hoveredComponentId: string | null;
  viewMode: ViewMode;
  explodedProgress: number;
  cameraPreset: CameraPreset;
  guidedMode: boolean;
  testConfig: TestConfig;
  telemetry: {
    voltage: number;
    current: number;
    temperature: number;
    power: number;
    tripTimeMs: number;
    elapsedMs: number;
  };
  telemetryHistory: TelemetryPoint[];
  componentStates: Record<string, {
    status: ComponentStatus;
    voltage: number;
    current: number;
    temp: number;
    stateText: string;
  }>;
  logs: LogEvent[];
  lastTestResult: TestResultSummary | null;
  activeModal: 'STANDARDS' | 'REPORT' | 'CONFIG' | 'GUIDE' | null;
  faultScreenPos: { x: number; y: number; visible: boolean } | null;
}

// Initial state builder
function getInitialComponentStates(): Record<string, { status: ComponentStatus; voltage: number; current: number; temp: number; stateText: string }> {
  const initial: Record<string, { status: ComponentStatus; voltage: number; current: number; temp: number; stateText: string }> = {};
  for (const [id, comp] of Object.entries(PROTOTYPE_COMPONENTS)) {
    initial[id] = {
      status: comp.status,
      voltage: comp.liveMetrics.voltage ?? 0,
      current: comp.liveMetrics.current ?? 0,
      temp: comp.liveMetrics.temperature ?? 26.5,
      stateText: comp.liveMetrics.stateText ?? 'Idle'
    };
  }
  return initial;
}

const DEFAULT_SCENARIO = SIMULATION_SCENARIOS[1]; // Standard Thermal Overload (1.45 In)

// Global simulation store singleton for React synchronization
type Listener = () => void;
let globalState: SimulationState = {
  currentStageIndex: 0,
  stage: SIMULATION_STAGES[0],
  scenario: DEFAULT_SCENARIO,
  isRunning: false,
  isEmergencyStopped: false,
  isMuted: false,
  verdict: 'IDLE',
  selectedComponentId: 'mcb_bank',
  hoveredComponentId: null,
  viewMode: 'DEFAULT',
  explodedProgress: 0,
  cameraPreset: 'DEFAULT',
  guidedMode: false,
  testConfig: {
    mcbRatingA: 16,
    mcbCurve: 'C',
    poles: '1P',
    simulationSpeed: 1.0,
  },
  telemetry: {
    voltage: 230.0,
    current: 0.0,
    temperature: 26.5,
    power: 0.0,
    tripTimeMs: 0,
    elapsedMs: 0,
  },
  telemetryHistory: [
    { timestampMs: 0, voltage: 230, current: 0, temperature: 26.5, power: 0, stageId: 'POWER_ON' }
  ],
  componentStates: getInitialComponentStates(),
  logs: [
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString(),
      timeMs: 0,
      level: 'INFO',
      source: 'System',
      message: 'MCB Testing System 3D Digital Twin Initialized. Model ready in idle state.'
    }
  ],
  lastTestResult: null,
  activeModal: null,
  faultScreenPos: null,
};

export function getScenarioFaultData(scenarioId: string): ActiveFaultData {
  switch (scenarioId) {
    case 'POWER_FAILURE':
      return {
        scenarioId,
        title: 'MAINS SUPPLY\nVOLTAGE COLLAPSE',
        locationLabel: 'AC INPUT / POWER SUPPLY',
        locationComponentId: 'power_supply',
        metricBefore: '230 V',
        metricAfter: '68 V',
        statusText: 'SEQUENCE HALTED',
        rootCause: 'Mains AC grid supply voltage dropped to 68V under load. Sequence halted and master contactor opened to isolate testing circuit.'
      };
    case 'CURRENT_SENSOR_FAILURE':
      return {
        scenarioId,
        title: 'CURRENT SENSOR\nSIGNAL LOSS',
        locationLabel: 'CURRENT SENSOR (ACS758)',
        locationComponentId: 'sensor_current',
        metricBefore: '16.0 A',
        metricAfter: '0.0 A (Open Circuit)',
        statusText: 'SEQUENCE HALTED',
        rootCause: 'Hall Current Sensor output dropped to open circuit during live contactor engagement. Telemetry safety interlock engaged.'
      };
    case 'VOLTAGE_SENSOR_FAILURE':
      return {
        scenarioId,
        title: 'VOLTAGE TRANSDUCER\nPRIMARY DROPOUT',
        locationLabel: 'VOLTAGE SENSOR (ZMPT101B)',
        locationComponentId: 'sensor_voltage',
        metricBefore: '230 V',
        metricAfter: '0.0 V (Dropout)',
        statusText: 'SEQUENCE HALTED',
        rootCause: 'Voltage Transducer returned 0.0V RMS on live mains bus. System blocked from energization due to unverified bus potential.'
      };
    case 'TEMPERATURE_SENSOR_FAILURE':
      return {
        scenarioId,
        title: 'NTC THERMISTOR\nSENSOR DISCONNECT',
        locationLabel: 'TEMP SENSOR ARRAY',
        locationComponentId: 'sensor_temp',
        metricBefore: '26.8 °C',
        metricAfter: 'DISCONNECTED',
        statusText: 'SEQUENCE HALTED',
        rootCause: 'NTC Terminal Thermistor open-circuit detected during baseline check. Thermal safety monitoring disabled, test inhibited.'
      };
    case 'CONTACTOR_FAILURE':
      return {
        scenarioId,
        title: 'AC CONTACTOR\nAUXILIARY MISMATCH',
        locationLabel: 'HEAVY-DUTY AC CONTACTOR',
        locationComponentId: 'ac_contactor',
        metricBefore: 'COIL 230V ARMED',
        metricAfter: 'AUX NO OPEN',
        statusText: 'SEQUENCE HALTED',
        rootCause: 'Contactor auxiliary status contact mismatch after coil trigger pulse. Power path unverified, relay drive disabled.'
      };
    case 'MCB_FAILS_TO_TRIP':
      return {
        scenarioId,
        title: 'MCB MECHANISM JAM\nCONTACT WELD FAULT',
        locationLabel: 'MCB UNDER TEST (UUT)',
        locationComponentId: 'mcb_bank',
        metricBefore: '23.2 A Overload',
        metricAfter: 'TIMEOUT EXCEEDED',
        statusText: 'SEQUENCE HALTED',
        rootCause: 'MCB failed to open contacts within maximum allowable threshold (IS/IEC 60898-1 Cl. 9.10). Backup watchdog isolated circuit.'
      };
    case 'OVER_TEMPERATURE_HAZARD':
      return {
        scenarioId,
        title: 'LOAD COIL THERMAL\nRUNAWAY (> 85°C)',
        locationLabel: 'TESTING LOAD COILS',
        locationComponentId: 'load_coil_01',
        metricBefore: '40.8 A',
        metricAfter: 'TEMP > 85.0 °C',
        statusText: 'SEQUENCE HALTED',
        rootCause: 'Load coil temperature exceeded 85.0°C safety ceiling due to continuous high-current dissipation. Thermal cutoff tripped.'
      };
    case 'EMERGENCY_STOP_TRIGGER':
      return {
        scenarioId,
        title: 'HARDWARE E-STOP\nBUTTON PRESSED',
        locationLabel: 'EMERGENCY STOP BUTTON',
        locationComponentId: 'emergency_stop',
        metricBefore: 'LOOP ARMED',
        metricAfter: 'LOOP BROKEN',
        statusText: 'SEQUENCE HALTED',
        rootCause: 'Manual red mushroom E-STOP button depressed by operator. Hardwired safety loop broken, contactors forced open.'
      };
    case 'CONTROLLER_WATCHDOG_FAULT':
      return {
        scenarioId,
        title: 'MCU FIRMWARE\nWATCHDOG RESET',
        locationLabel: 'ESP32 CONTROL UNIT',
        locationComponentId: 'controller_unit',
        metricBefore: '5 kS/s LOOP',
        metricAfter: 'WDT RESET',
        statusText: 'SEQUENCE HALTED',
        rootCause: 'Microcontroller main sequencer loop missed 100ms heartbeat refresh. Fail-safe relay driver dropped power rails.'
      };
    case 'SAFETY_INTERLOCK_FAULT':
      return {
        scenarioId,
        title: 'SAFETY SHIELD\nINTERLOCK OPEN',
        locationLabel: 'ENCLOSURE SAFETY BARRIER',
        locationComponentId: 'frame_rack',
        metricBefore: 'INTERLOCK CLOSED',
        metricAfter: 'MICROSWITCH OPEN',
        statusText: 'SEQUENCE HALTED',
        rootCause: 'High-voltage chamber safety door opened by operator while test was armed. Test start blocked.'
      };
    default:
      return {
        scenarioId,
        title: 'SYSTEM FAULT\nDETECTED',
        locationLabel: 'ELECTRICAL CIRCUIT',
        locationComponentId: 'power_supply',
        metricBefore: 'NORMAL',
        metricAfter: 'FAULT',
        statusText: 'SEQUENCE HALTED',
        rootCause: 'Anomalous operational telemetry detected. System de-energized.'
      };
  }
}

const listeners = new Set<Listener>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

let simulationTimer: number | null = null;
let telemetryTimer: number | null = null;
let testStartTime = 0;
let energizeTime = 0;
let tripTimeRecorded = 0;

export const SimulationController = {
  getState(): SimulationState {
    return globalState;
  },

  setScenario(scenarioId: SimulationScenarioId) {
    const found = SIMULATION_SCENARIOS.find((s) => s.id === scenarioId) || SIMULATION_SCENARIOS[0];
    if (globalState.isRunning) {
      SimulationController.stopSimulation('Scenario switched during test');
    }
    globalState = {
      ...globalState,
      scenario: found,
      verdict: 'IDLE',
      lastTestResult: null,
      currentStageIndex: 0,
      stage: SIMULATION_STAGES[0],
    };
    SimulationController.addLog('INFO', 'Scenario Engine', `Loaded Scenario: "${found.name}" (${found.category})`);
    emitChange();
  },

  selectComponent(id: string | null) {
    globalState = { ...globalState, selectedComponentId: id };
    emitChange();
  },

  setHoveredComponent(id: string | null) {
    if (globalState.hoveredComponentId !== id) {
      globalState = { ...globalState, hoveredComponentId: id };
      emitChange();
    }
  },

  setViewMode(mode: ViewMode) {
    globalState = {
      ...globalState,
      viewMode: mode,
      explodedProgress: mode === 'EXPLODED' ? (globalState.explodedProgress || 0.65) : (mode === 'DEFAULT' ? 0 : globalState.explodedProgress)
    };
    SimulationController.addLog('INFO', '3D Viewport', `View Mode changed to [${mode}]`);
    emitChange();
  },

  setExplodedProgress(val: number) {
    globalState = {
      ...globalState,
      explodedProgress: Math.max(0, Math.min(1, val)),
      viewMode: val > 0.05 ? 'EXPLODED' : 'DEFAULT'
    };
    emitChange();
  },

  setFaultScreenPos(pos: { x: number; y: number; visible: boolean } | null) {
    globalState = { ...globalState, faultScreenPos: pos };
    emitChange();
  },

  setCameraPreset(preset: CameraPreset) {
    globalState = { ...globalState, cameraPreset: preset };
    SimulationController.addLog('INFO', 'Camera System', `Switched camera orientation preset to: ${preset}`);
    emitChange();
  },

  toggleGuidedMode() {
    globalState = { ...globalState, guidedMode: !globalState.guidedMode };
    SimulationController.addLog('INFO', 'Guided Tour', `Guided Tour mode ${globalState.guidedMode ? 'ENABLED' : 'DISABLED'}`);
    emitChange();
  },

  updateTestConfig(partial: Partial<TestConfig>) {
    globalState = {
      ...globalState,
      testConfig: { ...globalState.testConfig, ...partial }
    };
    SimulationController.addLog('INFO', 'Config', `Test parameters updated: Rating=${globalState.testConfig.mcbRatingA}A, Curve=${globalState.testConfig.mcbCurve}`);
    emitChange();
  },

  openModal(modal: 'STANDARDS' | 'REPORT' | 'CONFIG' | 'GUIDE') {
    globalState = { ...globalState, activeModal: modal };
    emitChange();
  },

  closeModal() {
    globalState = { ...globalState, activeModal: null };
    emitChange();
  },

  addLog(level: LogEvent['level'], source: string, message: string, stageIndex?: number) {
    const newLog: LogEvent = {
      id: 'log-' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      timeMs: Date.now() - testStartTime,
      level,
      source,
      message,
      stageIndex: stageIndex ?? globalState.currentStageIndex + 1
    };
    globalState = {
      ...globalState,
      logs: [newLog, ...globalState.logs.slice(0, 150)]
    };
    emitChange();
  },

  toggleSound() {
    const nextMuted = !globalState.isMuted;
    globalState = { ...globalState, isMuted: nextMuted };
    audioEngine.setMuted(nextMuted);
    SimulationController.addLog('INFO', 'Audio Engine', `Sound effects ${nextMuted ? 'MUTED' : 'UNMUTED'}`);
    emitChange();
  },

  // START SIMULATION
  startSimulation() {
    if (globalState.isRunning) return;

    if (globalState.isEmergencyStopped) {
      SimulationController.addLog('DANGER', 'Safety Interlock', 'CANNOT START: Emergency Stop button is depressed. Twist to reset and clear.');
      return;
    }

    // Audio gesture activation & Power On sound
    audioEngine.playPowerOn();

    testStartTime = Date.now();
    energizeTime = 0;
    tripTimeRecorded = 0;

    // Reset runtime states
    globalState = {
      ...globalState,
      isRunning: true,
      verdict: 'RUNNING',
      currentStageIndex: 0,
      stage: SIMULATION_STAGES[0],
      telemetry: {
        voltage: 230.0,
        current: 0.0,
        temperature: 26.5,
        power: 0.0,
        tripTimeMs: 0,
        elapsedMs: 0,
      },
      telemetryHistory: [],
      lastTestResult: null,
      componentStates: getInitialComponentStates(),
    };

    SimulationController.addLog('SUCCESS', 'Test Sequencer', `▶ STARTED SIMULATION for [${globalState.scenario.name}]. Beginning Stage 1 / 18.`);
    emitChange();

    // Start High-Frequency Telemetry Generator Loop (20Hz)
    if (telemetryTimer) clearInterval(telemetryTimer);
    telemetryTimer = window.setInterval(() => {
      SimulationController.tickTelemetry();
    }, 50);

    // Start Stage Progression Engine
    SimulationController.scheduleNextStage(0);
  },

  // STOP SIMULATION
  stopSimulation(reason = 'Operator pressed STOP button') {
    if (simulationTimer) clearTimeout(simulationTimer);
    if (telemetryTimer) clearInterval(telemetryTimer);

    audioEngine.stopCurrentHum();
    const wasRunning = globalState.isRunning;

    // Safely de-energize outputs
    const safeCompStates = { ...globalState.componentStates };
    for (const id of Object.keys(safeCompStates)) {
      safeCompStates[id] = {
        ...safeCompStates[id],
        status: (id === 'emergency_stop' && globalState.isEmergencyStopped) ? 'FAULT' : 'ISOLATED',
        voltage: 0,
        current: 0,
        stateText: 'Circuit Safely De-energized & Isolated'
      };
    }

    globalState = {
      ...globalState,
      isRunning: false,
      verdict: wasRunning ? 'STOPPED' : globalState.verdict,
      telemetry: {
        ...globalState.telemetry,
        current: 0.0,
        power: 0.0
      },
      componentStates: safeCompStates,
      lastTestResult: wasRunning ? {
        verdict: 'STOPPED',
        scenarioId: globalState.scenario.id,
        scenarioName: globalState.scenario.name,
        mcbRating: `${globalState.testConfig.mcbRatingA}A (${globalState.testConfig.mcbCurve}-Curve)`,
        curveType: globalState.testConfig.mcbCurve,
        appliedCurrent: globalState.telemetry.current,
        tripDetected: tripTimeRecorded > 0,
        tripTimeMs: tripTimeRecorded,
        peakCurrentA: globalState.telemetry.current,
        maxTemperatureC: globalState.telemetry.temperature,
        standardClause: 'IS/IEC 60898-1 Test Abort / Interlock Halt',
        notes: `Test safely halted by operator. Reason: ${reason}. Circuit completely isolated.`,
        timestamp: new Date().toLocaleString(),
      } : globalState.lastTestResult
    };

    SimulationController.addLog('WARN', 'Safety Isolation', `■ TEST STOPPED: ${reason}. All outputs de-energized.`);
    emitChange();
  },

  // RESET SIMULATION
  resetSimulation() {
    if (simulationTimer) clearTimeout(simulationTimer);
    if (telemetryTimer) clearInterval(telemetryTimer);

    globalState = {
      ...globalState,
      isRunning: false,
      isEmergencyStopped: false,
      verdict: 'IDLE',
      currentStageIndex: 0,
      stage: SIMULATION_STAGES[0],
      telemetry: {
        voltage: 230.0,
        current: 0.0,
        temperature: 26.5,
        power: 0.0,
        tripTimeMs: 0,
        elapsedMs: 0,
      },
      telemetryHistory: [
        { timestampMs: 0, voltage: 230, current: 0, temperature: 26.5, power: 0, stageId: 'POWER_ON' }
      ],
      componentStates: getInitialComponentStates(),
      lastTestResult: null,
    };

    SimulationController.addLog('INFO', 'System Reset', '↻ Master Reset executed. All registers, graphs, and hardware states restored to READY.');
    emitChange();
  },

  // EMERGENCY STOP
  triggerEmergencyStop() {
    const isNowStopped = !globalState.isEmergencyStopped;
    globalState = { ...globalState, isEmergencyStopped: isNowStopped };

    if (isNowStopped) {
      audioEngine.playEmergencyStop();
      SimulationController.addLog('DANGER', 'E-STOP', '🚨 EMERGENCY STOP ENGAGED! Hardwired safety loop broken. Dropping contactors immediately.');
      SimulationController.stopSimulation('Hardware Emergency Stop Mushroom Switch Activated');
      globalState = {
        ...globalState,
        verdict: 'ABORTED',
        componentStates: {
          ...globalState.componentStates,
          emergency_stop: {
            status: 'FAULT',
            voltage: 0,
            current: 0,
            temp: 26.5,
            stateText: 'E-STOP LATCHED OPEN (Twist to Reset)'
          }
        }
      };
      emitChange();
    } else {
      SimulationController.addLog('SUCCESS', 'E-STOP', 'E-STOP Button unlatched and rotated back to normal. Press RESET to re-arm.');
      globalState = {
        ...globalState,
        componentStates: {
          ...globalState.componentStates,
          emergency_stop: {
            status: 'READY',
            voltage: 0,
            current: 0,
            temp: 26.5,
            stateText: 'E-STOP Loop Armed (Ready for Test)'
          }
        }
      };
      emitChange();
    }
  },

  // STAGE PROGRESSION ENGINE
  scheduleNextStage(stageIdx: number) {
    if (!globalState.isRunning) return;

    if (stageIdx >= SIMULATION_STAGES.length) {
      SimulationController.completeTest('PASS');
      return;
    }

    const currentStage = SIMULATION_STAGES[stageIdx];
    const scenario = globalState.scenario;
    const speed = globalState.testConfig.simulationSpeed || 1.0;

    // Trigger physical audio for specific stages
    if (currentStage.id === 'CONTACTOR_ACTIVATION') {
      audioEngine.playContactorClose();
    } else if (currentStage.id === 'CIRCUIT_ENERGIZATION' || currentStage.id === 'LOAD_APPLICATION') {
      audioEngine.startCurrentHum(scenario.targetCurrentA / 16.0);
    } else if (currentStage.id === 'TEST_CONDITION_DEVELOPMENT' && scenario.id === 'SHORT_CIRCUIT_HIGH_CURRENT') {
      audioEngine.playShortCircuitSpark();
    }

    // Check for Fault Injections in this stage
    if (scenario.faultTriggerStageIndex === currentStage.index) {
      SimulationController.handleFaultTrigger(currentStage, scenario);
      return;
    }

    // Update active stage
    globalState = {
      ...globalState,
      currentStageIndex: stageIdx,
      stage: currentStage,
      selectedComponentId: currentStage.activeComponentIds[0] || globalState.selectedComponentId
    };

    // Update component statuses based on stage
    SimulationController.updateComponentsForStage(currentStage, scenario);

    SimulationController.addLog(
      'INFO',
      `Stage ${String(currentStage.index).padStart(2, '0')}/18`,
      `[${currentStage.title}] — ${currentStage.description}`,
      currentStage.index
    );
    emitChange();

    // Timestamp energization
    if (currentStage.id === 'CIRCUIT_ENERGIZATION') {
      energizeTime = Date.now();
    }

    // Handle trip event
    if (currentStage.id === 'TRIP_DETECTION') {
      if (scenario.id !== 'NORMAL_OPERATION' && scenario.expectedVerdict === 'PASS') {
        audioEngine.playMcbTrip();
        tripTimeRecorded = Math.round((Date.now() - (energizeTime || testStartTime)) * speed);
        if (scenario.id === 'SHORT_CIRCUIT_HIGH_CURRENT') tripTimeRecorded = Math.floor(Math.random() * 20 + 25); // 25-45ms
        globalState = {
          ...globalState,
          telemetry: {
            ...globalState.telemetry,
            tripTimeMs: tripTimeRecorded
          }
        };
        SimulationController.addLog('SUCCESS', 'Trip Detector', `⚡ TRIP CONFIRMED: Circuit breaker tripped in ${tripTimeRecorded} ms. Contacts isolated.`);
      }
    }

    const duration = Math.max(300, currentStage.durationMs / speed);
    simulationTimer = window.setTimeout(() => {
      SimulationController.scheduleNextStage(stageIdx + 1);
    }, duration);
  },

  updateComponentsForStage(stage: StageDefinition, scenario: ScenarioDefinition) {
    const compStates = { ...globalState.componentStates };
    const currentA = (stage.powerFlowActive ? scenario.targetCurrentA : 0);
    const voltageV = (stage.energizedComponents.includes('power_supply') ? 230.0 : 0);

    for (const [id, comp] of Object.entries(PROTOTYPE_COMPONENTS)) {
      const isActive = stage.activeComponentIds.includes(id);
      const isEnergized = stage.energizedComponents.includes(id);

      let status: ComponentStatus = 'READY';
      if (id === 'mcb_bank') {
        if (stage.id === 'TRIP_DETECTION' || stage.id === 'CIRCUIT_ISOLATION' || stage.id === 'POST_TEST_VERIFICATION' || stage.id === 'RESULT_VALIDATION' || stage.id === 'REPORT_COMPLETE') {
          status = scenario.id === 'MCB_FAILS_TO_TRIP' ? 'FAULT' : 'TRIPPED';
        } else if (isEnergized) {
          status = 'ENERGIZED';
        }
      } else if (id === 'ac_contactor') {
        if (stage.index >= 8 && stage.index <= 14) {
          status = 'ACTIVE';
        } else if (stage.index >= 15) {
          status = 'ISOLATED';
        }
      } else if (id.startsWith('load_coil')) {
        if (stage.powerFlowActive) {
          status = 'ACTIVE';
        }
      } else if (isEnergized) {
        status = isActive ? 'ACTIVE' : 'ENERGIZED';
      }

      let stateText = 'Nominal Standby';
      if (id === 'mcb_bank') {
        stateText = (status === 'TRIPPED') ? 'Contacts Isolated (Tripped)' : (status === 'FAULT') ? 'Mechanism Fault / Jammed' : isEnergized ? 'Contacts Closed (Conducting)' : 'Contacts Closed (Ready)';
      } else if (id === 'ac_contactor') {
        stateText = (status === 'ACTIVE') ? 'Coil Energized (Contacts Closed)' : (status === 'ISOLATED') ? 'Coil De-energized (Contacts Open)' : 'Coil Standby (Open)';
      } else if (id === 'controller_unit') {
        stateText = (status === 'ACTIVE' || isEnergized) ? 'Processing (Telemetry Acquisition & Timing Loop Active)' : 'Firmware Sequencer Ready';
      } else if (id === 'power_supply') {
        stateText = isEnergized ? 'DC Rails Active (+24V, +12V, +5V Stabilized)' : 'Power Supply Standby';
      } else if (id.startsWith('sensor_')) {
        stateText = isActive ? 'High-Speed Telemetry Acquisition Active' : isEnergized ? 'Sensor Channel Online & Monitoring' : 'Calibrated Zero Baseline';
      } else if (id.startsWith('load_coil')) {
        stateText = (status === 'ACTIVE') ? 'Load Dissipation Active (Calibrated Load Step)' : 'Load Coil De-energized (Cooling)';
      } else if (id === 'emergency_stop') {
        stateText = (status === 'FAULT') ? 'E-STOP Button Latched Open (Safety Loop Broken)' : 'Safety Loop Armed (Closed)';
      } else if (id === 'simulated_fault_point') {
        stateText = (scenario.id === 'SHORT_CIRCUIT_HIGH_CURRENT' && stage.id === 'TEST_CONDITION_DEVELOPMENT') ? 'Bolted Short-Circuit Shunt Active' : 'Fault Shunt Open (Normal Circuit Path)';
      } else {
        stateText = isActive ? 'Active in Test Circuit' : isEnergized ? 'Energized' : 'Nominal Standby';
      }

      compStates[id] = {
        status,
        voltage: isEnergized ? voltageV : 0,
        current: (isEnergized && stage.powerFlowActive) ? currentA : (compStates[id]?.current || 0),
        temp: compStates[id]?.temp || 26.5,
        stateText
      };
    }

    globalState = {
      ...globalState,
      componentStates: compStates
    };
  },

  handleFaultTrigger(stage: StageDefinition, scenario: ScenarioDefinition) {
    if (simulationTimer) clearTimeout(simulationTimer);
    if (telemetryTimer) clearInterval(telemetryTimer);

    const faultMessage = scenario.faultMessage || `Fault triggered during ${stage.title}`;
    const safetyAlert = scenario.safetyAlert || 'Safety Interlock Engaged. Test aborted.';
    const verdict: SimulationVerdict = scenario.expectedVerdict === 'FAIL' ? 'FAIL' : 'FAULT';

    SimulationController.addLog('DANGER', 'FAULT INJECTION', `⚠️ ${faultMessage}`, stage.index);
    SimulationController.addLog('WARN', 'Safety Interlock', `🛡️ ${safetyAlert}`, stage.index);

    const compStates = { ...globalState.componentStates };
    if (scenario.id === 'POWER_FAILURE') {
      compStates['power_supply'].status = 'FAULT';
      compStates['power_supply'].voltage = 68.0;
      compStates['power_supply'].current = 0.0;
      compStates['power_supply'].stateText = 'AC Mains Voltage Collapse (68V Undervoltage)';
      compStates['ac_contactor'].status = 'ISOLATED';
      compStates['ac_contactor'].stateText = 'Safety Dropout (Contacts Open)';
    }
    if (scenario.id === 'CURRENT_SENSOR_FAILURE') compStates['sensor_current'].status = 'FAULT';
    if (scenario.id === 'VOLTAGE_SENSOR_FAILURE') compStates['sensor_voltage'].status = 'FAULT';
    if (scenario.id === 'TEMPERATURE_SENSOR_FAILURE') compStates['sensor_temp'].status = 'FAULT';
    if (scenario.id === 'CONTACTOR_FAILURE') compStates['ac_contactor'].status = 'FAULT';
    if (scenario.id === 'MCB_FAILS_TO_TRIP') compStates['mcb_bank'].status = 'FAULT';
    if (scenario.id === 'OVER_TEMPERATURE_HAZARD') compStates['load_coil_01'].status = 'OVERHEATED';
    if (scenario.id === 'EMERGENCY_STOP_TRIGGER') compStates['emergency_stop'].status = 'FAULT';
    if (scenario.id === 'CONTROLLER_WATCHDOG_FAULT') compStates['controller_unit'].status = 'FAULT';
    if (scenario.id === 'SAFETY_INTERLOCK_FAULT') compStates['frame_rack'].status = 'FAULT';

    const faultData = getScenarioFaultData(scenario.id);

    const targetVoltage = scenario.id === 'POWER_FAILURE' ? 68.0 : (scenario.id === 'VOLTAGE_SENSOR_FAILURE' ? 0.0 : globalState.telemetry.voltage);

    const updatedTelemetry = {
      ...globalState.telemetry,
      voltage: targetVoltage,
      current: 0.0,
      power: 0.0
    };

    const newHistoryPoint: TelemetryPoint = {
      timestampMs: Date.now() - testStartTime,
      voltage: targetVoltage,
      current: 0.0,
      temperature: globalState.telemetry.temperature,
      power: 0.0,
      stageId: stage.id,
    };

    globalState = {
      ...globalState,
      isRunning: false,
      verdict,
      selectedComponentId: null, // Keep right inspector closed until user explicitly clicks Inspect
      telemetry: updatedTelemetry,
      telemetryHistory: [...globalState.telemetryHistory.slice(-60), newHistoryPoint],
      componentStates: compStates,
      lastTestResult: {
        verdict,
        scenarioId: scenario.id,
        scenarioName: scenario.name,
        mcbRating: `${globalState.testConfig.mcbRatingA}A (${globalState.testConfig.mcbCurve}-Curve)`,
        curveType: scenario.curveType,
        appliedCurrent: 0.0,
        tripDetected: false,
        tripTimeMs: -1,
        peakCurrentA: globalState.telemetry.current,
        maxTemperatureC: globalState.telemetry.temperature,
        standardClause: 'IS/IEC 60898-1 Safety & Interlock Check',
        notes: `${faultMessage} ${safetyAlert}`,
        timestamp: new Date().toLocaleString()
      }
    };
    emitChange();
  },

  tickTelemetry() {
    if (!globalState.isRunning) return;

    const stage = globalState.stage;
    const scenario = globalState.scenario;
    const elapsed = Date.now() - testStartTime;

    let targetI = 0;
    let targetV = 230.0;
    let targetT = 26.5;

    if (stage.powerFlowActive) {
      targetI = scenario.targetCurrentA;
      // Add slight electrical noise
      const noise = (Math.random() - 0.5) * 0.15;
      targetI = Math.max(0, targetI + noise);

      // Voltage sag during high load
      const sag = (targetI / 16.0) * 1.8;
      targetV = Math.max(0, 230.0 - sag + (Math.random() - 0.5) * 0.4);

      // Thermal rise
      const tempRise = (targetI / 16.0) * (elapsed / 4000) * 2.5;
      targetT = 26.5 + tempRise;
    } else {
      targetI = 0.0;
      targetV = (stage.energizedComponents.includes('power_supply') ? 230.0 : 0);
      targetT = Math.max(26.5, globalState.telemetry.temperature - 0.02);
    }

    // Clamp values
    const power = (targetV * targetI) / 1000; // in kW

    const newTelemetry = {
      voltage: Number(targetV.toFixed(1)),
      current: Number(targetI.toFixed(2)),
      temperature: Number(targetT.toFixed(1)),
      power: Number(power.toFixed(2)),
      tripTimeMs: globalState.telemetry.tripTimeMs,
      elapsedMs: elapsed,
    };

    // Update history (keep last 60 points)
    const newPoint: TelemetryPoint = {
      timestampMs: elapsed,
      voltage: newTelemetry.voltage,
      current: newTelemetry.current,
      temperature: newTelemetry.temperature,
      power: newTelemetry.power,
      stageId: stage.id,
    };

    // Update LCD state text in component states
    const compStates = { ...globalState.componentStates };
    if (compStates['lcd_display']) {
      compStates['lcd_display'].stateText = `V:${newTelemetry.voltage}V I:${newTelemetry.current}A T:${newTelemetry.temperature}C S:${stage.index}/18`;
    }
    if (compStates['mcb_bank']) {
      compStates['mcb_bank'].voltage = newTelemetry.voltage;
      compStates['mcb_bank'].current = newTelemetry.current;
      compStates['mcb_bank'].temp = newTelemetry.temperature;
    }

    globalState = {
      ...globalState,
      telemetry: newTelemetry,
      telemetryHistory: [...globalState.telemetryHistory.slice(-60), newPoint],
      componentStates: compStates,
    };
    emitChange();
  },

  completeTest(verdict: SimulationVerdict = 'PASS') {
    if (telemetryTimer) clearInterval(telemetryTimer);
    audioEngine.stopCurrentHum();
    audioEngine.playTestComplete();

    const scenario = globalState.scenario;
    const finalVerdict = scenario.expectedVerdict === 'PASS' ? 'PASS' : scenario.expectedVerdict;

    if (finalVerdict === 'PASS') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.8 },
          colors: ['#00f2fe', '#10b981', '#38bdf8']
        });
      } catch (e) {
        // ignore in non-browser env
      }
    }

    globalState = {
      ...globalState,
      isRunning: false,
      verdict: finalVerdict,
      lastTestResult: {
        verdict: finalVerdict,
        scenarioId: scenario.id,
        scenarioName: scenario.name,
        mcbRating: `${globalState.testConfig.mcbRatingA}A (${globalState.testConfig.mcbCurve}-Curve)`,
        curveType: scenario.curveType,
        appliedCurrent: scenario.targetCurrentA,
        tripDetected: tripTimeRecorded > 0,
        tripTimeMs: tripTimeRecorded,
        peakCurrentA: scenario.targetCurrentA,
        maxTemperatureC: globalState.telemetry.temperature,
        standardClause: scenario.id === 'NORMAL_OPERATION' ? 'IS/IEC 60898-1 Cl. 9.8 / 9.10 Non-Tripping' : 'IS/IEC 60898-1 Cl. 9.10 Tripping Characteristics',
        notes: finalVerdict === 'PASS' 
          ? `Test passed verification criteria successfully. Breaker operated within specified envelope.` 
          : `Test completed with verdict: ${finalVerdict}.`,
        timestamp: new Date().toLocaleString()
      }
    };

    SimulationController.addLog(
      finalVerdict === 'PASS' ? 'SUCCESS' : 'WARN',
      'Test Completed',
      `🏆 TEST FINISHED. Overall Verdict: [${finalVerdict}]. Trip Time: ${tripTimeRecorded > 0 ? tripTimeRecorded + ' ms' : 'N/A'}. Telemetry curves saved.`
    );
    emitChange();
  }
};

// React hook to subscribe to simulation store
export function useSimulationStore() {
  const [state, setState] = useState<SimulationState>(SimulationController.getState());

  useEffect(() => {
    const handleChange = () => {
      setState(SimulationController.getState());
    };
    listeners.add(handleChange);
    return () => {
      listeners.delete(handleChange);
    };
  }, []);

  return {
    ...state,
    startSimulation: SimulationController.startSimulation,
    stopSimulation: SimulationController.stopSimulation,
    resetSimulation: SimulationController.resetSimulation,
    triggerEmergencyStop: SimulationController.triggerEmergencyStop,
    toggleSound: SimulationController.toggleSound,
    setScenario: SimulationController.setScenario,
    selectComponent: SimulationController.selectComponent,
    setHoveredComponent: SimulationController.setHoveredComponent,
    setViewMode: SimulationController.setViewMode,
    setExplodedProgress: SimulationController.setExplodedProgress,
    setCameraPreset: SimulationController.setCameraPreset,
    toggleGuidedMode: SimulationController.toggleGuidedMode,
    updateTestConfig: SimulationController.updateTestConfig,
    openModal: SimulationController.openModal,
    closeModal: SimulationController.closeModal,
    setFaultScreenPos: SimulationController.setFaultScreenPos,
  };
}
