import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ComponentStatus } from '../../types/components';

interface Props {
  isSelected: boolean;
  isHovered: boolean;
  status: ComponentStatus;
  isPressed: boolean;
  isDimmed: boolean;
  isXRay: boolean;
  explodedOffset?: [number, number, number];
  onClick: (e: any) => void;
  onPointerOver: (e: any) => void;
  onPointerOut: (e: any) => void;
}

export const EmergencyStop3D: React.FC<Props> = ({
  isSelected,
  isHovered,
  isPressed,
  isDimmed,
  isXRay,
  explodedOffset = [0, 0, 0],
  onClick,
  onPointerOver,
  onPointerOut,
}) => {
  const mushroomRef = useRef<THREE.Group>(null);

  // Animate button depression when pressed
  useFrame((_, delta) => {
    if (mushroomRef.current) {
      const targetZ = isPressed ? 0.03 : 0.055;
      mushroomRef.current.position.z = THREE.MathUtils.damp(
        mushroomRef.current.position.z,
        targetZ,
        22,
        delta
      );
    }
  });

  const yellowBoxMaterial = new THREE.MeshStandardMaterial({
    color: isDimmed ? '#854d0e' : (isSelected ? '#0284c7' : '#eab308'),
    roughness: 0.35,
    metalness: 0.1,
    transparent: isXRay || isDimmed,
    opacity: isDimmed ? 0.3 : (isXRay ? 0.4 : 1.0),
  });

  const mushroomMaterial = new THREE.MeshStandardMaterial({
    color: '#dc2626', // Industrial safety red
    roughness: 0.25,
    metalness: 0.1,
    emissive: isPressed ? '#ef4444' : '#000000',
    emissiveIntensity: isPressed ? 0.6 : 0,
  });

  return (
    <group
      position={[-0.65 + explodedOffset[0], 0.95 + explodedOffset[1], 0.32 + explodedOffset[2]]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* Industrial Yellow Surface Enclosure Box */}
      <mesh material={yellowBoxMaterial} castShadow receiveShadow>
        <boxGeometry args={[0.16, 0.16, 0.07]} />
      </mesh>

      {/* Yellow Safety Warning Ring Plate */}
      <mesh position={[0, 0, 0.036]}>
        <cylinderGeometry args={[0.055, 0.055, 0.005, 32]} />
        <meshStandardMaterial color="#facc15" roughness={0.3} />
      </mesh>

      {/* Mushroom Push-Lock Actuator Head */}
      <group ref={mushroomRef} position={[0, 0, 0.055]}>
        {/* Main 40mm Mushroom Dome */}
        <mesh rotation={[Math.PI / 2, 0, 0]} material={mushroomMaterial} castShadow>
          <sphereGeometry args={[0.042, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
        {/* Button Neck / Shaft */}
        <mesh position={[0, 0, -0.015]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.03, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Selection Glow */}
      {isSelected && (
        <mesh position={[0, 0, 0.03]}>
          <boxGeometry args={[0.18, 0.18, 0.12]} />
          <meshBasicMaterial color="#ef4444" wireframe transparent opacity={0.65} />
        </mesh>
      )}
    </group>
  );
};
