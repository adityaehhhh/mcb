export type ComponentStatus = 
  | 'READY' 
  | 'ACTIVE' 
  | 'ENERGIZED' 
  | 'WARNING' 
  | 'FAULT' 
  | 'TRIPPED' 
  | 'OFF' 
  | 'ISOLATED'
  | 'OVERHEATED';

export type ComponentSubsystem = 
  | 'Structural'
  | 'Protection UUT'
  | 'Power Switching'
  | 'Control Logic'
  | 'Processing'
  | 'UI / Readout'
  | 'Power Supply'
  | 'Distribution'
  | 'Testing Load'
  | 'Measurement'
  | 'Safety System'
  | 'Operator Input'
  | 'Wiring System'
  | 'Fault Injection';

export interface ComponentMetadata {
  id: string;
  name: string;
  shortLabel?: string;
  subsystem: ComponentSubsystem;
  type: string;
  status: ComponentStatus;
  purpose: string;
  technicalSpecs: {
    manufacturer?: string;
    modelOrPart?: string;
    ratedVoltage?: string;
    ratedCurrent?: string;
    operatingTemp?: string;
    responseSpeed?: string;
    accuracyOrTolerance?: string;
    mountingType?: string;
    [key: string]: string | undefined;
  };
  liveMetrics: {
    voltage?: number;
    current?: number;
    temperature?: number;
    power?: number;
    stateText?: string;
  };
  circuitRole: string;
  testRelevance: string;
  safetyConsiderations: string;
  failureModes: string[];
  threePosition: [number, number, number];
  threeRotation?: [number, number, number];
  threeScale?: [number, number, number];
  colorAccent?: string;
}
