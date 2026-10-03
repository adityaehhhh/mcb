import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { MachineModel } from './MachineModel';
import { useSimulationStore, CameraPreset } from '../simulation/useSimulationStore';
import { SimulationVerdict } from '../types/simulation';

interface CameraTargetDef {
  pos: THREE.Vector3;
  target: THREE.Vector3;
}

// Map stage index to smooth spatial camera focal points
function getStageCameraFocus(stageIndex: number, scenarioId: string): CameraTargetDef {
  switch (stageIndex) {
    case 1: // Power on
      return {
        pos: new THREE.Vector3(-0.75, -0.05, 1.45),
        target: new THREE.Vector3(-0.45, -0.15, 0.32),
      };
    case 2: // MCU / LCD initialization
      return {
        pos: new THREE.Vector3(0.75, 0.25, 1.45),
        target: new THREE.Vector3(0.45, 0.25, 0.32),
      };
    case 3: // Sensor self check
      if (scenarioId === 'TEMPERATURE_SENSOR_FAILURE') {
        return {
          pos: new THREE.Vector3(0.45, 0.18, 1.4),
          target: new THREE.Vector3(0.28, 0.08, 0.32),
        };
      }
      return {
        pos: new THREE.Vector3(0, 0.2, 1.35),
        target: new THREE.Vector3(0, 0.12, 0.32),
      };
    case 4: // Safety check / E-Stop
      return {
        pos: new THREE.Vector3(-0.7, 0.75, 1.45),
        target: new THREE.Vector3(-0.45, 0.7, 0.35),
      };
    case 5: // MCB Profile
    case 6: // Pre-test inspection
      return {
        pos: new THREE.Vector3(-0.85, 0.45, 1.25),
        target: new THREE.Vector3(-0.6, 0.42, 0.28),
      };
    case 7: // Circuit preparation
    case 8: // Contactor activation
      return {
        pos: new THREE.Vector3(0.1, 0.45, 1.35),
        target: new THREE.Vector3(0, 0.4, 0.32),
      };
    case 9: // Energization
    case 10: // Load Application
    case 11: // Live Measurement
      return {
        pos: new THREE.Vector3(0.75, 0.2, 1.7),
        target: new THREE.Vector3(-0.05, 0.05, 0.28),
      };
    case 12: // Condition Development (Fault / Overload)
      if (scenarioId === 'SHORT_CIRCUIT_HIGH_CURRENT') {
        return {
          pos: new THREE.Vector3(-0.65, -0.2, 1.15),
          target: new THREE.Vector3(-0.45, -0.25, 0.32),
        };
      }
      return {
        pos: new THREE.Vector3(-0.35, -0.45, 1.3),
        target: new THREE.Vector3(-0.35, -0.65, 0.25),
      };
    case 13: // MCB Response
    case 14: // MCB Trip Detection
      return {
        pos: new THREE.Vector3(-0.78, 0.45, 1.15),
        target: new THREE.Vector3(-0.6, 0.42, 0.28),
      };
    case 15: // Circuit Isolation
      return {
        pos: new THREE.Vector3(0.25, 0.4, 1.45),
        target: new THREE.Vector3(0, 0.32, 0.32),
      };
    default: // Overview / Report / Ready
      return {
        pos: new THREE.Vector3(0.85, 0.15, 1.85),
        target: new THREE.Vector3(0, -0.05, 0.2),
      };
  }
}

// Auto-framing camera when a fault occurs
function getFaultCameraFocus(scenarioId: string): CameraTargetDef {
  switch (scenarioId) {
    case 'TEMPERATURE_SENSOR_FAILURE':
      return {
        pos: new THREE.Vector3(0.45, 0.18, 1.4),
        target: new THREE.Vector3(0.28, 0.08, 0.32),
      };
    case 'POWER_FAILURE':
      return {
        pos: new THREE.Vector3(-0.65, 0.02, 1.5),
        target: new THREE.Vector3(-0.4, -0.08, 0.32),
      };
    case 'CURRENT_SENSOR_FAILURE':
      return {
        pos: new THREE.Vector3(-0.35, 0.18, 1.4),
        target: new THREE.Vector3(-0.15, 0.08, 0.32),
      };
    case 'VOLTAGE_SENSOR_FAILURE':
      return {
        pos: new THREE.Vector3(0.0, 0.18, 1.4),
        target: new THREE.Vector3(0.0, 0.08, 0.32),
      };
    case 'CONTACTOR_FAILURE':
      return {
        pos: new THREE.Vector3(0.1, 0.48, 1.4),
        target: new THREE.Vector3(0.0, 0.35, 0.32),
      };
    case 'MCB_FAILS_TO_TRIP':
      return {
        pos: new THREE.Vector3(-0.75, 0.48, 1.4),
        target: new THREE.Vector3(-0.5, 0.35, 0.28),
      };
    case 'OVER_TEMPERATURE_HAZARD':
      return {
        pos: new THREE.Vector3(0.0, -0.45, 1.5),
        target: new THREE.Vector3(-0.1, -0.55, 0.25),
      };
    default:
      return {
        pos: new THREE.Vector3(0.85, 0.15, 1.85),
        target: new THREE.Vector3(0, -0.05, 0.2),
      };
  }
}

// Camera controller that smoothly interpolates camera position & target based on preset, stage, or fault
const CameraController: React.FC<{
  preset: CameraPreset;
  stageIndex: number;
  isRunning: boolean;
  verdict: SimulationVerdict;
  scenarioId: string;
}> = ({ preset, stageIndex, isRunning, verdict, scenarioId }) => {
  const controlsRef = useRef<any>(null);
  const targetCameraPos = useRef(new THREE.Vector3(0.85, 0.15, 1.85));
  const targetLookAt = useRef(new THREE.Vector3(0, -0.05, 0.2));

  const isFault = verdict === 'FAULT' || verdict === 'ABORTED' || verdict === 'FAIL';

  useEffect(() => {
    if (preset !== 'DEFAULT') {
      switch (preset) {
        case 'FRONT':
          targetCameraPos.current.set(0, -0.02, 1.95);
          targetLookAt.current.set(0, -0.05, 0.2);
          break;
        case 'SIDE':
          targetCameraPos.current.set(1.9, 0.1, 0.35);
          targetLookAt.current.set(0, -0.05, 0.2);
          break;
        case 'TOP':
          targetCameraPos.current.set(0, 2.1, 0.25);
          targetLookAt.current.set(0, -0.05, 0.2);
          break;
        case 'MCB':
          targetCameraPos.current.set(-0.8, 0.45, 1.05);
          targetLookAt.current.set(-0.6, 0.42, 0.28);
          break;
        case 'SENSORS':
          targetCameraPos.current.set(0, 0.2, 1.25);
          targetLookAt.current.set(0, 0.12, 0.32);
          break;
        case 'LOAD':
          targetCameraPos.current.set(0, -0.55, 1.25);
          targetLookAt.current.set(0, -0.7, 0.25);
          break;
      }
    } else if (isFault) {
      const faultFocus = getFaultCameraFocus(scenarioId);
      targetCameraPos.current.copy(faultFocus.pos);
      targetLookAt.current.copy(faultFocus.target);
    } else if (isRunning) {
      const focus = getStageCameraFocus(stageIndex, scenarioId);
      targetCameraPos.current.copy(focus.pos);
      targetLookAt.current.copy(focus.target);
    } else {
      targetCameraPos.current.set(0.85, 0.15, 1.85);
      targetLookAt.current.set(0, -0.05, 0.2);
    }
  }, [preset, stageIndex, isRunning, isFault, scenarioId]);

  useFrame((state, delta) => {
    if (!controlsRef.current) return;

    // Smooth camera damping towards target during automated stages or fault trigger
    if ((isRunning || isFault) && preset === 'DEFAULT') {
      state.camera.position.lerp(targetCameraPos.current, 0.045);
      controlsRef.current.target.lerp(targetLookAt.current, 0.045);
    }

    controlsRef.current.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={0.5}
      maxDistance={4.5}
      maxPolarAngle={Math.PI / 2 + 0.08}
      target={[0, -0.05, 0.2]}
    />
  );
};

export const DigitalTwinCanvas: React.FC = () => {
  const { cameraPreset, stage, isRunning, verdict, scenario, selectComponent } = useSimulationStore();

  return (
    <div
      className="w-full h-full relative select-none cursor-grab active:cursor-grabbing bg-[#090d13]"
      onClick={() => selectComponent(null)}
    >
      <Canvas
        camera={{ position: [0.85, 0.15, 1.85], fov: 38, near: 0.1, far: 100 }}
        shadows
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        {/* Engineering Studio Lighting */}
        <ambientLight intensity={0.65} color="#f1f5f9" />
        <directionalLight
          position={[4, 6, 4]}
          intensity={1.1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0001}
        />
        <directionalLight position={[-4, 3, -2]} intensity={0.35} color="#94a3b8" />
        <pointLight position={[0, 1.2, 0.8]} intensity={0.4} color="#ffffff" distance={3.5} />

        {/* 3D Physical Machine Model */}
        <MachineModel />

        {/* Floor Contact Shadows */}
        <ContactShadows
          position={[0, -1.02, 0]}
          opacity={0.55}
          scale={3.5}
          blur={1.6}
          far={1.5}
        />

        {/* Engineering Ground Reference Grid */}
        <gridHelper
          args={[8, 32, '#1e293b', '#0f172a']}
          position={[0, -1.025, 0]}
        />

        {/* Smooth Camera Control */}
        <CameraController
          preset={cameraPreset}
          stageIndex={stage.index}
          isRunning={isRunning}
          verdict={verdict}
          scenarioId={scenario.id}
        />
      </Canvas>
    </div>
  );
};
