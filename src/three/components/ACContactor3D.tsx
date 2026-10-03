import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ComponentStatus } from '../../types/components';

interface Props {
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

export const ACContactor3D: React.FC<Props> = ({
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
  const plungerRef = useRef<THREE.Mesh>(null);
  const isActive = status === 'ACTIVE' || status === 'ENERGIZED';

  // Animate mechanical plunger pull-in
  useFrame((_, delta) => {
    if (plungerRef.current) {
      const targetZ = isActive ? 0.055 : 0.075; // Depressed when coil energized
      plungerRef.current.position.z = THREE.MathUtils.damp(
        plungerRef.current.position.z,
        targetZ,
        20,
        delta
      );
    }
  });

  const bodyColor = isSelected ? '#38bdf8' : isHovered ? '#60a5fa' : '#1e293b';
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: isDimmed ? '#334155' : bodyColor,
    roughness: 0.35,
    metalness: 0.2,
    transparent: isXRay || isDimmed,
    opacity: isDimmed ? 0.3 : (isXRay ? 0.4 : 1.0),
    emissive: isSelected ? '#0369a1' : (isActive ? '#0284c7' : '#000000'),
    emissiveIntensity: isSelected ? 0.35 : (isActive ? 0.2 : 0),
  });

  const screwMaterial = new THREE.MeshStandardMaterial({
    color: '#cbd5e1',
    metalness: 0.9,
    roughness: 0.15,
  });

  const plungerMaterial = new THREE.MeshStandardMaterial({
    color: isActive ? '#f59e0b' : '#ea580c',
    emissive: isActive ? '#f59e0b' : '#000000',
    emissiveIntensity: isActive ? 0.5 : 0,
    roughness: 0.3,
  });

  return (
    <group
      position={[0.0 + explodedOffset[0], 0.45 + explodedOffset[1], 0.28 + explodedOffset[2]]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* Contactor Main Body */}
      <mesh material={bodyMaterial} castShadow receiveShadow>
        <boxGeometry args={[0.18, 0.22, 0.13]} />
      </mesh>

      {/* Front Face Plate */}
      <mesh position={[0, 0, 0.066]} material={bodyMaterial} castShadow>
        <boxGeometry args={[0.16, 0.18, 0.02]} />
      </mesh>

      {/* Magnetic Core Status Plunger Indicator */}
      <mesh ref={plungerRef} position={[0, 0, 0.075]} material={plungerMaterial}>
        <boxGeometry args={[0.045, 0.045, 0.02]} />
      </mesh>

      {/* Top 3-Phase + Aux Screw Terminals (L1, L2, L3, 13NO) */}
      {[-0.06, -0.02, 0.02, 0.06].map((x, i) => (
        <group key={`top-term-${i}`} position={[x, 0.095, 0.04]}>
          <mesh material={screwMaterial} castShadow>
            <cylinderGeometry args={[0.008, 0.008, 0.02, 12]} />
          </mesh>
          <mesh position={[0, 0.012, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.004, 12]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Bottom 3-Phase + Aux Screw Terminals (T1, T2, T3, 14NO) */}
      {[-0.06, -0.02, 0.02, 0.06].map((x, i) => (
        <group key={`bot-term-${i}`} position={[x, -0.095, 0.04]}>
          <mesh material={screwMaterial} castShadow>
            <cylinderGeometry args={[0.008, 0.008, 0.02, 12]} />
          </mesh>
          <mesh position={[0, -0.012, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.004, 12]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Auxiliary Coil Terminals A1 / A2 */}
      <mesh position={[-0.07, 0.04, 0.06]} material={screwMaterial}>
        <cylinderGeometry args={[0.005, 0.005, 0.015, 8]} />
      </mesh>
      <mesh position={[0.07, 0.04, 0.06]} material={screwMaterial}>
        <cylinderGeometry args={[0.005, 0.005, 0.015, 8]} />
      </mesh>

      {/* Selection Glow Ring */}
      {isSelected && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.2, 0.24, 0.15]} />
          <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.65} />
        </mesh>
      )}
    </group>
  );
};
