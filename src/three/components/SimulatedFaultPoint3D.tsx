import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

interface Props {
  isFaultActive: boolean;
  isSelected: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  isXRay: boolean;
  explodedOffset?: [number, number, number];
  onClick?: (e: any) => void;
  onPointerOver?: (e: any) => void;
  onPointerOut?: (e: any) => void;
}

export const SimulatedFaultPoint3D: React.FC<Props> = ({
  isFaultActive,
  isSelected,
  isHovered,
  isDimmed,
  isXRay,
  explodedOffset = [0, 0, 0],
  onClick,
  onPointerOver,
  onPointerOut,
}) => {
  const sparkGroupRef = useRef<THREE.Group>(null);
  const flashLightRef = useRef<THREE.PointLight>(null);

  // Downstream position: between sensor and load coil
  const basePos: [number, number, number] = [-0.48, -0.28, 0.32];

  // Pre-generate spark particle directions
  const sparkPoints = useMemo(() => {
    return Array.from({ length: 16 }, () => {
      const v = new THREE.Vector3(
        (Math.random() - 0.5) * 0.08,
        (Math.random() - 0.5) * 0.08,
        (Math.random() - 0.5) * 0.08
      );
      return v;
    });
  }, []);

  useFrame(({ clock }) => {
    if (sparkGroupRef.current) {
      if (isFaultActive) {
        sparkGroupRef.current.visible = true;
        const scale = 0.8 + Math.random() * 0.6;
        sparkGroupRef.current.scale.set(scale, scale, scale);
        sparkGroupRef.current.rotation.z = Math.random() * Math.PI;
      } else {
        sparkGroupRef.current.visible = false;
      }
    }

    if (flashLightRef.current) {
      if (isFaultActive) {
        flashLightRef.current.intensity = 3.0 + Math.random() * 4.0;
      } else {
        flashLightRef.current.intensity = 0;
      }
    }
  });

  const housingMat = new THREE.MeshStandardMaterial({
    color: isFaultActive ? '#ef4444' : isSelected ? '#38bdf8' : '#334155',
    metalness: 0.6,
    roughness: 0.3,
    transparent: isXRay || isDimmed,
    opacity: isDimmed ? 0.3 : (isXRay ? 0.5 : 1.0),
    emissive: isFaultActive ? '#dc2626' : '#000000',
    emissiveIntensity: isFaultActive ? 0.8 : 0,
  });

  const terminalMat = new THREE.MeshStandardMaterial({
    color: '#d97706',
    metalness: 0.9,
    roughness: 0.2,
  });

  return (
    <group
      position={[
        basePos[0] + explodedOffset[0],
        basePos[1] + explodedOffset[1],
        basePos[2] + explodedOffset[2],
      ]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* Insulated Terminal Block Mounting for Fault Point */}
      <mesh material={housingMat} castShadow receiveShadow>
        <boxGeometry args={[0.07, 0.09, 0.04]} />
      </mesh>

      {/* High-Current Fault Electrodes / Terminal Lugs */}
      <mesh position={[-0.018, 0, 0.02]} material={terminalMat}>
        <cylinderGeometry args={[0.006, 0.006, 0.04, 12]} />
      </mesh>
      <mesh position={[0.018, 0, 0.02]} material={terminalMat}>
        <cylinderGeometry args={[0.006, 0.006, 0.04, 12]} />
      </mesh>

      {/* Spark Discharge Group (Active only during short-circuit trigger) */}
      <group ref={sparkGroupRef} visible={false} position={[0, 0, 0.035]}>
        {/* Central bright plasma core */}
        <mesh>
          <sphereGeometry args={[0.016, 12, 12]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.026, 12, 12]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} />
        </mesh>

        {/* Branching sparks */}
        {sparkPoints.map((pt, i) => (
          <mesh key={i} position={[pt.x, pt.y, pt.z]}>
            <sphereGeometry args={[0.004, 6, 6]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#f59e0b' : '#38bdf8'} />
          </mesh>
        ))}
      </group>

      {/* Dynamic Flash Light */}
      <pointLight
        ref={flashLightRef}
        color="#38bdf8"
        intensity={0}
        distance={2.5}
        position={[0, 0, 0.1]}
      />

      {/* Label Badge */}
      {(isSelected || isFaultActive || isHovered) && (
        <Html position={[0, 0.08, 0.04]} center distanceFactor={2.8}>
          <div className="pointer-events-none select-none px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap shadow-md border bg-slate-950/95 border-amber-500/60 text-amber-300">
            {isFaultActive ? '⚡ DOWNSTREAM SHORT CIRCUIT' : 'SIMULATED FAULT POINT'}
          </div>
        </Html>
      )}
    </group>
  );
};
