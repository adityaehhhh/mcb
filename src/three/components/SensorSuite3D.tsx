import React from 'react';
import * as THREE from 'three';
import { ComponentStatus } from '../../types/components';

interface Props {
  sensorId: 'sensor_current' | 'sensor_voltage' | 'sensor_temp';
  position: [number, number, number];
  isSelected: boolean;
  isHovered: boolean;
  status: ComponentStatus;
  isDimmed: boolean;
  isXRay: boolean;
  explodedOffset?: [number, number, number];
  onClick: (e: any) => void;
  onPointerOver: (e: any) => void;
  onPointerOut: (e: any) => void;
}

export const SensorSuite3D: React.FC<Props> = ({
  sensorId,
  position,
  isSelected,
  isHovered,
  status,
  isDimmed,
  isXRay,
  explodedOffset = [0, 0, 0],
  onClick,
  onPointerOver,
  onPointerOut,
}) => {
  const isFault = status === 'FAULT';

  const pcbMaterial = new THREE.MeshStandardMaterial({
    color: isFault ? '#ef4444' : (isDimmed ? '#1e293b' : (isSelected ? '#0284c7' : '#0369a1')),
    roughness: 0.4,
    metalness: 0.1,
    transparent: isXRay || isDimmed,
    opacity: isDimmed ? 0.3 : (isXRay ? 0.4 : 1.0),
    emissive: isFault ? '#ef4444' : (isSelected ? '#0284c7' : '#000000'),
    emissiveIntensity: isFault ? 0.4 : (isSelected ? 0.2 : 0),
  });

  const copperBusMaterial = new THREE.MeshStandardMaterial({
    color: '#b45309',
    metalness: 0.9,
    roughness: 0.15,
  });

  return (
    <group
      position={[position[0] + explodedOffset[0], position[1] + explodedOffset[1], position[2] + explodedOffset[2]]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {sensorId === 'sensor_current' && (
        // Hall-Effect Current Sensor Module (ACS758)
        <group>
          <mesh material={pcbMaterial} castShadow>
            <boxGeometry args={[0.13, 0.09, 0.01]} />
          </mesh>
          {/* Main ACS758 IC with thick integrated copper tabs */}
          <mesh position={[0, 0, 0.015]} castShadow>
            <boxGeometry args={[0.045, 0.045, 0.02]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} />
          </mesh>
          {/* Heavy Copper In/Out High Current Busbars */}
          <mesh position={[-0.045, 0, 0.01]} material={copperBusMaterial} castShadow>
            <boxGeometry args={[0.025, 0.04, 0.012]} />
          </mesh>
          <mesh position={[0.045, 0, 0.01]} material={copperBusMaterial} castShadow>
            <boxGeometry args={[0.025, 0.04, 0.012]} />
          </mesh>
          {/* 3-Pin Low-Voltage Analog Signal Header */}
          <mesh position={[0, -0.035, 0.015]}>
            <boxGeometry args={[0.03, 0.01, 0.018]} />
            <meshStandardMaterial color="#020617" />
          </mesh>
        </group>
      )}

      {sensorId === 'sensor_voltage' && (
        // AC Active Voltage Transformer Module (ZMPT101B)
        <group>
          <mesh material={pcbMaterial} castShadow>
            <boxGeometry args={[0.13, 0.09, 0.01]} />
          </mesh>
          {/* Blue Micro-Voltage Transformer Cube */}
          <mesh position={[0.01, 0.01, 0.02]} castShadow>
            <boxGeometry args={[0.045, 0.045, 0.035]} />
            <meshStandardMaterial color="#2563eb" roughness={0.3} />
          </mesh>
          {/* Multi-turn Precision Calibration Trimmer */}
          <mesh position={[-0.035, 0.01, 0.015]}>
            <boxGeometry args={[0.015, 0.02, 0.02]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
          {/* 2-Pin High Voltage Input Terminal */}
          <mesh position={[0, 0.035, 0.015]}>
            <boxGeometry args={[0.03, 0.012, 0.02]} />
            <meshStandardMaterial color="#15803d" />
          </mesh>
        </group>
      )}

      {sensorId === 'sensor_temp' && (
        // Multi-Point Thermistor / Thermocouple Array
        <group>
          <mesh material={pcbMaterial} castShadow>
            <boxGeometry args={[0.13, 0.09, 0.01]} />
          </mesh>
          {/* Stainless Steel Probe Sheath Cylinders */}
          {[-0.03, 0, 0.03].map((x, i) => (
            <mesh key={`probe-${i}`} position={[x, 0.01, 0.02]} castShadow>
              <cylinderGeometry args={[0.006, 0.006, 0.04, 12]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
            </mesh>
          ))}
          {/* Signal Amplifier IC */}
          <mesh position={[0, -0.025, 0.01]}>
            <boxGeometry args={[0.025, 0.025, 0.008]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>
      )}

      {/* Selection Glow */}
      {isSelected && (
        <mesh position={[0, 0, 0.015]}>
          <boxGeometry args={[0.15, 0.11, 0.05]} />
          <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.65} />
        </mesh>
      )}
    </group>
  );
};
