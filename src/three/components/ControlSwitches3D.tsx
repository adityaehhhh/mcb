import React from 'react';
import * as THREE from 'three';
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

export const ControlSwitches3D: React.FC<Props> = ({
  isSelected,
  isHovered,
  isDimmed,
  isXRay,
  explodedOffset = [0, 0, 0],
  onClick,
  onPointerOver,
  onPointerOut,
}) => {
  const panelMaterial = new THREE.MeshStandardMaterial({
    color: isDimmed ? '#1e293b' : (isSelected ? '#0284c7' : '#0f172a'),
    roughness: 0.4,
    metalness: 0.3,
    transparent: isXRay || isDimmed,
    opacity: isDimmed ? 0.3 : (isXRay ? 0.4 : 1.0),
  });

  const bezelMaterial = new THREE.MeshStandardMaterial({
    color: '#cbd5e1',
    metalness: 0.9,
    roughness: 0.15,
  });

  return (
    <group
      position={[0.0 + explodedOffset[0], 0.95 + explodedOffset[1], 0.32 + explodedOffset[2]]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* Operator Switch Panel Enclosure */}
      <mesh material={panelMaterial} castShadow receiveShadow>
        <boxGeometry args={[0.36, 0.16, 0.04]} />
      </mesh>

      {/* START Push Button (Green with Chrome Bezel) */}
      <group position={[-0.1, 0, 0.02]}>
        <mesh material={bezelMaterial} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.024, 0.024, 0.015, 24]} />
        </mesh>
        <mesh position={[0, 0, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 0.01, 24]} />
          <meshStandardMaterial color="#22c55e" roughness={0.3} emissive="#15803d" emissiveIntensity={0.4} />
        </mesh>
      </group>

      {/* STOP Push Button (Red with Guard Shroud) */}
      <group position={[0.1, 0, 0.02]}>
        <mesh material={bezelMaterial} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.024, 0.024, 0.015, 24]} />
        </mesh>
        <mesh position={[0, 0, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 0.01, 24]} />
          <meshStandardMaterial color="#ef4444" roughness={0.3} emissive="#b91c1c" emissiveIntensity={0.4} />
        </mesh>
      </group>

      {/* Center 2-Position Rotary Key / Selector Switch */}
      <group position={[0, 0, 0.02]}>
        <mesh material={bezelMaterial} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.012, 24]} />
        </mesh>
        <mesh position={[0, 0, 0.015]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.008, 0.032, 0.015]} />
          <meshStandardMaterial color="#020617" roughness={0.5} />
        </mesh>
      </group>

      {/* Selection Glow */}
      {isSelected && (
        <mesh position={[0, 0, 0.01]}>
          <boxGeometry args={[0.38, 0.18, 0.08]} />
          <meshBasicMaterial color="#22c55e" wireframe transparent opacity={0.65} />
        </mesh>
      )}
    </group>
  );
};
