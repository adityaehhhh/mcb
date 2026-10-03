import React from 'react';
import * as THREE from 'three';

interface Props {
  isXRay: boolean;
  explodedOffset?: [number, number, number];
}

export const ChassisFrame: React.FC<Props> = ({ isXRay, explodedOffset = [0, 0, 0] }) => {
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: isXRay ? '#1e293b' : '#1e2430',
    metalness: 0.85,
    roughness: 0.35,
    transparent: isXRay,
    opacity: isXRay ? 0.22 : 1.0,
    wireframe: isXRay,
  });

  const footMaterial = new THREE.MeshStandardMaterial({
    color: '#0f172a',
    roughness: 0.9,
  });

  const shieldMaterial = new THREE.MeshPhysicalMaterial({
    color: '#38bdf8',
    transparent: true,
    opacity: 0.15,
    roughness: 0.1,
    transmission: 0.85,
    thickness: 0.02,
  });

  return (
    <group position={explodedOffset}>
      {/* 4 Vertical Slotted Angle Posts */}
      <mesh position={[-0.85, 0.1, -0.45]} material={frameMaterial} castShadow receiveShadow>
        <boxGeometry args={[0.04, 2.1, 0.04]} />
      </mesh>
      <mesh position={[0.85, 0.1, -0.45]} material={frameMaterial} castShadow receiveShadow>
        <boxGeometry args={[0.04, 2.1, 0.04]} />
      </mesh>
      <mesh position={[-0.85, 0.1, 0.45]} material={frameMaterial} castShadow receiveShadow>
        <boxGeometry args={[0.04, 2.1, 0.04]} />
      </mesh>
      <mesh position={[0.85, 0.1, 0.45]} material={frameMaterial} castShadow receiveShadow>
        <boxGeometry args={[0.04, 2.1, 0.04]} />
      </mesh>

      {/* Top Crossbeams */}
      <mesh position={[0, 1.15, -0.45]} material={frameMaterial} castShadow>
        <boxGeometry args={[1.74, 0.04, 0.04]} />
      </mesh>
      <mesh position={[0, 1.15, 0.45]} material={frameMaterial} castShadow>
        <boxGeometry args={[1.74, 0.04, 0.04]} />
      </mesh>
      <mesh position={[-0.85, 1.15, 0]} material={frameMaterial} castShadow>
        <boxGeometry args={[0.04, 0.04, 0.86]} />
      </mesh>
      <mesh position={[0.85, 1.15, 0]} material={frameMaterial} castShadow>
        <boxGeometry args={[0.04, 0.04, 0.86]} />
      </mesh>

      {/* Middle Support Rails */}
      <mesh position={[0, -0.05, -0.45]} material={frameMaterial} castShadow>
        <boxGeometry args={[1.74, 0.035, 0.035]} />
      </mesh>
      <mesh position={[0, -0.05, 0.45]} material={frameMaterial} castShadow>
        <boxGeometry args={[1.74, 0.035, 0.035]} />
      </mesh>
      <mesh position={[-0.85, -0.05, 0]} material={frameMaterial} castShadow>
        <boxGeometry args={[0.04, 0.035, 0.86]} />
      </mesh>
      <mesh position={[0.85, -0.05, 0]} material={frameMaterial} castShadow>
        <boxGeometry args={[0.04, 0.035, 0.86]} />
      </mesh>

      {/* Bottom Base Frame */}
      <mesh position={[0, -0.95, -0.45]} material={frameMaterial} castShadow receiveShadow>
        <boxGeometry args={[1.74, 0.04, 0.04]} />
      </mesh>
      <mesh position={[0, -0.95, 0.45]} material={frameMaterial} castShadow receiveShadow>
        <boxGeometry args={[1.74, 0.04, 0.04]} />
      </mesh>
      <mesh position={[-0.85, -0.95, 0]} material={frameMaterial} castShadow receiveShadow>
        <boxGeometry args={[0.04, 0.04, 0.86]} />
      </mesh>
      <mesh position={[0.85, -0.95, 0]} material={frameMaterial} castShadow receiveShadow>
        <boxGeometry args={[0.04, 0.04, 0.86]} />
      </mesh>

      {/* 4 Heavy Rubber Machine Vibration Dampening Feet */}
      <mesh position={[-0.85, -0.99, -0.45]} material={footMaterial}>
        <cylinderGeometry args={[0.035, 0.04, 0.04, 16]} />
      </mesh>
      <mesh position={[0.85, -0.99, -0.45]} material={footMaterial}>
        <cylinderGeometry args={[0.035, 0.04, 0.04, 16]} />
      </mesh>
      <mesh position={[-0.85, -0.99, 0.45]} material={footMaterial}>
        <cylinderGeometry args={[0.035, 0.04, 0.04, 16]} />
      </mesh>
      <mesh position={[0.85, -0.99, 0.45]} material={footMaterial}>
        <cylinderGeometry args={[0.035, 0.04, 0.04, 16]} />
      </mesh>

      {/* Acrylic Transparent Top Safety Guard */}
      <mesh position={[0, 1.17, 0]} material={shieldMaterial}>
        <boxGeometry args={[1.68, 0.008, 0.86]} />
      </mesh>

      {/* Slotted Angle Perforation Highlights */}
      {[-0.6, -0.3, 0, 0.3, 0.6].map((x, i) => (
        <group key={`perfs-${i}`} position={[x, 0, 0]}>
          <mesh position={[0, -0.95, 0.47]}>
            <boxGeometry args={[0.015, 0.01, 0.002]} />
            <meshBasicMaterial color="#0b0f19" />
          </mesh>
        </group>
      ))}
    </group>
  );
};
