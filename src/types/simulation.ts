import { ComponentStatus } from './components';

export type StageId =
  | 'POWER_ON'
  | 'SYSTEM_INITIALIZATION'
  | 'COMPONENT_SELF_CHECK'
  | 'SAFETY_CHECK'
  | 'MCB_IDENTIFICATION'
  | 'PRE_TEST_INSPECTION'
  | 'CIRCUIT_PREPARATION'
  | 'CONTACTOR_ACTIVATION'
  | 'CIRCUIT_ENERGIZATION'
  | 'LOAD_APPLICATION'
  | 'LIVE_MEASUREMENT'
  | 'TEST_CONDITION_DEVELOPMENT'
  | 'MCB_RESPONSE'
  | 'TRIP_DETECTION'
  | 'CIRCUIT_ISOLATION'
  | 'POST_TEST_VERIFICATION'
  | 'RESULT_VALIDATION'
  | 'REPORT_COMPLETE';

export type SimulationScenarioId =
  | 'NORMAL_OPERATION'
  | 'OVERLOAD_145'
  | 'OVERLOAD_255'
  | 'SHORT_CIRCUIT_HIGH_CURRENT'
  | 'MCB_FAILS_TO_TRIP'
  | 'CURRENT_SENSOR_FAILURE'
  | 'VOLTAGE_SENSOR_FAILURE'
  | 'TEMPERATURE_SENSOR_FAILURE'
  | 'CONTACTOR_FAILURE'
  | 'POWER_FAILURE'
  | 'EMERGENCY_STOP_TRIGGER'
  | 'CONTROLLER_WATCHDOG_FAULT'
  | 'OVER_TEMPERATURE_HAZARD'
  | 'SAFETY_INTERLOCK_FAULT';

export type SimulationVerdict = 'IDLE' | 'RUNNING' | 'PASS' | 'FAIL' | 'ABORTED' | 'STOPPED' | 'FAULT';

export interface StageDefinition {
  id: StageId;
  index: number;
  title: string;
  description: string;
  durationMs: number; // Configurable stage duration
  activeComponentIds: string[];
  energizedComponents: string[];
  powerFlowActive: boolean;
  flowOrigin?: string;
  flowDestination?: string;
  safetyState: 'NORMAL' | 'ARMED' | 'ENERGIZED' | 'TRIPPED' | 'HAZARD';
  hardwareChecklist?: string[];
}

export interface ScenarioDefinition {
  id: SimulationScenarioId;
  name: string;
  category: 'Standard Verification' | 'Overcurrent & Tripping' | 'Sensor & Component Fault' | 'Emergency & Safety';
  description: string;
  expectedVerdict: 'PASS' | 'FAIL' | 'ABORTED' | 'FAULT';
  multiplierIn: number; // e.g., 1.0, 1.45, 2.55, 6.0
  targetCurrentA: number;
  targetVoltageV: number;
  expectedTripTimeRange: [number, number]; // in milliseconds [min, max], or [-1, -1] if no trip expected
  faultTriggerStageIndex?: number;
  faultMessage?: string;
  safetyAlert?: string;
  curveType: 'B' | 'C' | 'D';
}

export interface TelemetryPoint {
  timestampMs: number;
  voltage: number;
  current: number;
  temperature: number;
  power: number;
  stageId: StageId;
}

export interface LogEvent {
  id: string;
  timestamp: string;
  timeMs: number;
  level: 'INFO' | 'SUCCESS' | 'WARN' | 'DANGER' | 'TELEMETRY';
  stageIndex?: number;
  source: string;
  message: string;
}

export interface TestResultSummary {
  verdict: SimulationVerdict;
  scenarioId: SimulationScenarioId;
  scenarioName: string;
  mcbRating: string;
  curveType: string;
  appliedCurrent: number;
  tripDetected: boolean;
  tripTimeMs: number;
  peakCurrentA: number;
  maxTemperatureC: number;
  standardClause: string;
  notes: string;
  timestamp: string;
}
