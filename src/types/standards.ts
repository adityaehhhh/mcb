export interface StandardClause {
  clauseNumber: string;
  title: string;
  scope: string;
  testCurrentFormula: string;
  trippingTimeRequirement: string;
  acceptanceCriteria: string;
  prototypeRelevance: string;
  simulationNote: string;
}

export interface MCBCurveDefinition {
  curve: 'B' | 'C' | 'D';
  name: string;
  thermalBand: string;
  magneticBand: string;
  typicalLoads: string;
  color: string;
}
