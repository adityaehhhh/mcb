import React from 'react';
import { ChassisFrame } from './components/ChassisFrame';
import { BackboardAndRails } from './components/BackboardAndRails';
import { MCBBank3D } from './components/MCBBank3D';
import { ACContactor3D } from './components/ACContactor3D';
import { RelayModule3D } from './components/RelayModule3D';
import { ControllerMCU3D } from './components/ControllerMCU3D';
import { LCDDisplay3D } from './components/LCDDisplay3D';
import { PowerSupply3D } from './components/PowerSupply3D';
import { TerminalBlocks3D } from './components/TerminalBlocks3D';
import { LoadCoils3D } from './components/LoadCoils3D';
import { SensorSuite3D } from './components/SensorSuite3D';
import { EmergencyStop3D } from './components/EmergencyStop3D';
import { ControlSwitches3D } from './components/ControlSwitches3D';
import { SimulatedFaultPoint3D } from './components/SimulatedFaultPoint3D';
import { FaultLeaderAnchor3D } from './components/FaultLeaderAnchor3D';
import { WiringHarness3D } from './wiring/WiringHarness3D';
import { ElectricalFlowParticles } from './wiring/ElectricalFlowParticles';
import { Component3DLabels } from './labels/Component3DLabels';
import { useSimulationStore } from '../simulation/useSimulationStore';

export const MachineModel: React.FC = () => {
  const {
    selectedComponentId,
    hoveredComponentId,
    viewMode,
    explodedProgress,
    guidedMode,
    stage,
    scenario,
    verdict,
    isRunning,
    isEmergencyStopped,
    telemetry,
    componentStates,
    selectComponent,
    setHoveredComponent,
  } = useSimulationStore();

  const isXRay = viewMode === 'XRAY';
  const isIsolatedMode = viewMode === 'ISOLATED' && selectedComponentId !== null;

  // Helper for isolation dimming
  const getIsDimmed = (id: string) => {
    if (!isIsolatedMode) return false;
    return selectedComponentId !== id;
  };

  // Compute exploded offset based on progress
  const getExplodedOffset = (
    dir: [number, number, number]
  ): [number, number, number] => {
    const scale = explodedProgress * 0.45;
    return [dir[0] * scale, dir[1] * scale, dir[2] * scale];
  };

  const isShortCircuitActive =
    scenario.id === 'SHORT_CIRCUIT_HIGH_CURRENT' &&
    stage.id === 'TEST_CONDITION_DEVELOPMENT';

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Structural Chassis Frame */}
      <ChassisFrame
        isXRay={isXRay}
        explodedOffset={getExplodedOffset([0, 0, -0.6])}
      />

      {/* 2. White Backboard & DIN Rails */}
      <BackboardAndRails
        isXRay={isXRay}
        explodedOffset={getExplodedOffset([0, 0, -0.2])}
      />

      {/* 3. Hero Component: MCB Under Test */}
      <MCBBank3D
        isSelected={selectedComponentId === 'mcb_bank'}
        isHovered={hoveredComponentId === 'mcb_bank'}
        status={componentStates['mcb_bank']?.status || 'READY'}
        isDimmed={getIsDimmed('mcb_bank')}
        isXRay={isXRay}
        isTrippingNow={stage.id === 'TRIP_DETECTION' || stage.id === 'MCB_RESPONSE'}
        explodedOffset={getExplodedOffset([-0.5, 0.4, 0.4])}
        onClick={(e) => {
          e.stopPropagation();
          selectComponent('mcb_bank');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredComponent('mcb_bank');
        }}
        onPointerOut={() => setHoveredComponent(null)}
      />

      {/* 4. Heavy-Duty AC Contactor */}
      <ACContactor3D
        isSelected={selectedComponentId === 'ac_contactor'}
        isHovered={hoveredComponentId === 'ac_contactor'}
        status={componentStates['ac_contactor']?.status || 'READY'}
        isDimmed={getIsDimmed('ac_contactor')}
        isXRay={isXRay}
        explodedOffset={getExplodedOffset([0, 0.4, 0.4])}
        onClick={(e) => {
          e.stopPropagation();
          selectComponent('ac_contactor');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredComponent('ac_contactor');
        }}
        onPointerOut={() => setHoveredComponent(null)}
      />

      {/* 5. 4-Channel Optocoupler Relay Module */}
      <RelayModule3D
        isSelected={selectedComponentId === 'relay_module'}
        isHovered={hoveredComponentId === 'relay_module'}
        status={componentStates['relay_module']?.status || 'READY'}
        isDimmed={getIsDimmed('relay_module')}
        isXRay={isXRay}
        explodedOffset={getExplodedOffset([0.5, 0.4, 0.4])}
        onClick={(e) => {
          e.stopPropagation();
          selectComponent('relay_module');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredComponent('relay_module');
        }}
        onPointerOut={() => setHoveredComponent(null)}
      />

      {/* 6. Industrial Microcontroller (MCU) */}
      <ControllerMCU3D
        isSelected={selectedComponentId === 'controller_unit'}
        isHovered={hoveredComponentId === 'controller_unit'}
        status={componentStates['controller_unit']?.status || 'READY'}
        isDimmed={getIsDimmed('controller_unit')}
        isXRay={isXRay}
        explodedOffset={getExplodedOffset([0.5, 0.12, 0.4])}
        onClick={(e) => {
          e.stopPropagation();
          selectComponent('controller_unit');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredComponent('controller_unit');
        }}
        onPointerOut={() => setHoveredComponent(null)}
      />

      {/* 7. 20x4 Alphanumeric LCD Display */}
      <LCDDisplay3D
        isSelected={selectedComponentId === 'lcd_display'}
        isHovered={hoveredComponentId === 'lcd_display'}
        status={componentStates['lcd_display']?.status || 'READY'}
        isDimmed={getIsDimmed('lcd_display')}
        isXRay={isXRay}
        voltage={telemetry.voltage}
        current={telemetry.current}
        temp={telemetry.temperature}
        stageIndex={stage.index}
        stageTitle={stage.title}
        verdict={verdict}
        isRunning={isRunning}
        explodedOffset={getExplodedOffset([0.5, 0.8, 0.4])}
        onClick={(e) => {
          e.stopPropagation();
          selectComponent('lcd_display');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredComponent('lcd_display');
        }}
        onPointerOut={() => setHoveredComponent(null)}
      />

      {/* 8. Industrial SMPS Power Supply */}
      <PowerSupply3D
        isSelected={selectedComponentId === 'power_supply'}
        isHovered={hoveredComponentId === 'power_supply'}
        status={componentStates['power_supply']?.status || 'READY'}
        isDimmed={getIsDimmed('power_supply')}
        isXRay={isXRay}
        explodedOffset={getExplodedOffset([-0.5, -0.2, 0.4])}
        onClick={(e) => {
          e.stopPropagation();
          selectComponent('power_supply');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredComponent('power_supply');
        }}
        onPointerOut={() => setHoveredComponent(null)}
      />

      {/* 9. Terminal Blocks */}
      <TerminalBlocks3D
        isSelected={selectedComponentId === 'terminal_blocks'}
        isHovered={hoveredComponentId === 'terminal_blocks'}
        status={componentStates['terminal_blocks']?.status || 'READY'}
        isDimmed={getIsDimmed('terminal_blocks')}
        isXRay={isXRay}
        explodedOffset={getExplodedOffset([0, -0.2, 0.4])}
        onClick={(e) => {
          e.stopPropagation();
          selectComponent('terminal_blocks');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredComponent('terminal_blocks');
        }}
        onPointerOut={() => setHoveredComponent(null)}
      />

      {/* 10. Heating Load Coil 1 */}
      <LoadCoils3D
        coilId="load_coil_01"
        position={[-0.52, -0.75, 0.25]}
        isSelected={selectedComponentId === 'load_coil_01'}
        isHovered={hoveredComponentId === 'load_coil_01'}
        status={componentStates['load_coil_01']?.status || 'READY'}
        isDimmed={getIsDimmed('load_coil_01')}
        isXRay={isXRay}
        temp={telemetry.temperature}
        label="COIL 1"
        explodedOffset={getExplodedOffset([-0.4, -0.7, 0.4])}
        onClick={(e) => {
          e.stopPropagation();
          selectComponent('load_coil_01');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredComponent('load_coil_01');
        }}
        onPointerOut={() => setHoveredComponent(null)}
      />

      {/* 11. Heating Load Coil 2 */}
      <LoadCoils3D
        coilId="load_coil_02"
        position={[0.0, -0.75, 0.25]}
        isSelected={selectedComponentId === 'load_coil_02'}
        isHovered={hoveredComponentId === 'load_coil_02'}
        status={componentStates['load_coil_02']?.status || 'READY'}
        isDimmed={getIsDimmed('load_coil_02')}
        isXRay={isXRay}
        temp={telemetry.temperature}
        label="COIL 2"
        explodedOffset={getExplodedOffset([0.0, -0.7, 0.4])}
        onClick={(e) => {
          e.stopPropagation();
          selectComponent('load_coil_02');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredComponent('load_coil_02');
        }}
        onPointerOut={() => setHoveredComponent(null)}
      />

      {/* 12. Heating Load Coil 3 */}
      <LoadCoils3D
        coilId="load_coil_03"
        position={[0.52, -0.75, 0.25]}
        isSelected={selectedComponentId === 'load_coil_03'}
        isHovered={hoveredComponentId === 'load_coil_03'}
        status={componentStates['load_coil_03']?.status || 'READY'}
        isDimmed={getIsDimmed('load_coil_03')}
        isXRay={isXRay}
        temp={telemetry.temperature}
        label="COIL 3"
        explodedOffset={getExplodedOffset([0.4, -0.7, 0.4])}
        onClick={(e) => {
          e.stopPropagation();
          selectComponent('load_coil_03');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredComponent('load_coil_03');
        }}
        onPointerOut={() => setHoveredComponent(null)}
      />

      {/* 13. Measurement Suite Sensors */}
      <SensorSuite3D
        sensorId="sensor_current"
        position={[-0.35, 0.12, 0.32]}
        isSelected={selectedComponentId === 'sensor_current'}
        isHovered={hoveredComponentId === 'sensor_current'}
        status={componentStates['sensor_current']?.status || 'READY'}
        isDimmed={getIsDimmed('sensor_current')}
        isXRay={isXRay}
        explodedOffset={getExplodedOffset([-0.3, 0.1, 0.5])}
        onClick={(e) => {
          e.stopPropagation();
          selectComponent('sensor_current');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredComponent('sensor_current');
        }}
        onPointerOut={() => setHoveredComponent(null)}
      />

      <SensorSuite3D
        sensorId="sensor_voltage"
        position={[0.0, 0.12, 0.32]}
        isSelected={selectedComponentId === 'sensor_voltage'}
        isHovered={hoveredComponentId === 'sensor_voltage'}
        status={componentStates['sensor_voltage']?.status || 'READY'}
        isDimmed={getIsDimmed('sensor_voltage')}
        isXRay={isXRay}
        explodedOffset={getExplodedOffset([0, 0.1, 0.5])}
        onClick={(e) => {
          e.stopPropagation();
          selectComponent('sensor_voltage');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredComponent('sensor_voltage');
        }}
        onPointerOut={() => setHoveredComponent(null)}
      />

      <SensorSuite3D
        sensorId="sensor_temp"
        position={[0.35, 0.12, 0.32]}
        isSelected={selectedComponentId === 'sensor_temp'}
        isHovered={hoveredComponentId === 'sensor_temp'}
        status={componentStates['sensor_temp']?.status || 'READY'}
        isDimmed={getIsDimmed('sensor_temp')}
        isXRay={isXRay}
        explodedOffset={getExplodedOffset([0.3, 0.1, 0.5])}
        onClick={(e) => {
          e.stopPropagation();
          selectComponent('sensor_temp');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredComponent('sensor_temp');
        }}
        onPointerOut={() => setHoveredComponent(null)}
      />

      {/* 14. Simulated Downstream Fault Point */}
      <SimulatedFaultPoint3D
        isFaultActive={isShortCircuitActive}
        isSelected={selectedComponentId === 'simulated_fault_point'}
        isHovered={hoveredComponentId === 'simulated_fault_point'}
        isDimmed={getIsDimmed('simulated_fault_point')}
        isXRay={isXRay}
        explodedOffset={getExplodedOffset([-0.4, -0.3, 0.4])}
        onClick={(e) => {
          e.stopPropagation();
          selectComponent('simulated_fault_point');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredComponent('simulated_fault_point');
        }}
        onPointerOut={() => setHoveredComponent(null)}
      />

      {/* 15. Emergency Stop */}
      <EmergencyStop3D
        isSelected={selectedComponentId === 'emergency_stop'}
        isHovered={hoveredComponentId === 'emergency_stop'}
        status={componentStates['emergency_stop']?.status || 'READY'}
        isPressed={isEmergencyStopped}
        isDimmed={getIsDimmed('emergency_stop')}
        isXRay={isXRay}
        explodedOffset={getExplodedOffset([-0.5, 0.8, 0.4])}
        onClick={(e) => {
          e.stopPropagation();
          selectComponent('emergency_stop');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredComponent('emergency_stop');
        }}
        onPointerOut={() => setHoveredComponent(null)}
      />

      {/* 16. Control Switches */}
      <ControlSwitches3D
        isSelected={selectedComponentId === 'control_switches'}
        isHovered={hoveredComponentId === 'control_switches'}
        status={componentStates['control_switches']?.status || 'READY'}
        isDimmed={getIsDimmed('control_switches')}
        isXRay={isXRay}
        explodedOffset={getExplodedOffset([0, 0.8, 0.4])}
        onClick={(e) => {
          e.stopPropagation();
          selectComponent('control_switches');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredComponent('control_switches');
        }}
        onPointerOut={() => setHoveredComponent(null)}
      />

      {/* 17. Wiring Loom Harness */}
      <WiringHarness3D
        isXRay={isXRay}
        explodedOffset={getExplodedOffset([0, 0, 0.2])}
      />

      {/* 18. Animated Electrical Flow Particles */}
      <ElectricalFlowParticles
        powerFlowActive={stage.powerFlowActive}
        isTripped={componentStates['mcb_bank']?.status === 'TRIPPED'}
        currentMagnitude={telemetry.current}
        explodedOffset={getExplodedOffset([0, 0, 0.2])}
      />

      {/* 19. Fault Leader Anchor & 3D Beacon */}
      <FaultLeaderAnchor3D
        explodedOffset={getExplodedOffset([-0.5, -0.2, 0.4])}
      />

      {/* 20. 3D Component Labels */}
      <Component3DLabels
        selectedComponentId={selectedComponentId}
        hoveredComponentId={hoveredComponentId}
        viewMode={viewMode}
        guidedMode={guidedMode}
        activeStageComponents={stage.activeComponentIds}
        onSelectComponent={selectComponent}
      />
    </group>
  );
};
