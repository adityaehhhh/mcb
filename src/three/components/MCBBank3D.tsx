import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ComponentStatus } from '../../types/components';

interface Props {
  isSelected: boolean;
  isHovered: boolean;
  status: ComponentStatus;
  isDimmed: boolean;
  isXRay: boolean;
  isTrippingNow?: boolean;
  explodedOffset?: [number, number, number];
  onClick: (e: any) => void;
  onPointerOver: (e: any) => void;
  onPointerOut: (e: any) => void;
}

export const MCBBank3D: React.FC<Props> = ({
  isSelected,
  isHovered,
  status,
  isDimmed,
  isXRay,
  isTrippingNow = false,
  explodedOffset = [0, 0, 0],
  onClick,
  onPointerOver,
  onPointerOut,
}) => {
  const leverRef = useRef<THREE.Group>(null);
  const arcLightRef = useRef<THREE.PointLight>(null);
  const contactArcRef = useRef<THREE.Group>(null);
  const arcTimerRef = useRef<number>(0);

  // Status-dependent states
  const isTripped = status === 'TRIPPED' || status === 'FAULT';
  const isEnergized = status === 'ENERGIZED' || status === 'ACTIVE';

  // Tiny spark particles at contact gap
  const contactSparks = useMemo(() => {
    return Array.from({ length: 8 }, () => ({
      dir: new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
      )
    }));
  }, []);

  // Smooth lever animation & contact separation arc trigger
  useFrame((_, delta) => {
    if (leverRef.current) {
      const targetRotX = isTripped ? 0.45 : -0.35; // Down for trip, Up for closed/ON
      const wasClosed = leverRef.current.rotation.x < 0;
      leverRef.current.rotation.x = THREE.MathUtils.damp(
        leverRef.current.rotation.x,
        targetRotX,
        isTripped ? 22 : 8,
        delta
      );

      // Trigger contact opening arc flash if transitioning to tripped
      if (isTripped && wasClosed && arcTimerRef.current === 0) {
        arcTimerRef.current = 0.35; // 350ms duration
      }
    }

    // Decay contact arc
    if (arcTimerRef.current > 0) {
      arcTimerRef.current = Math.max(0, arcTimerRef.current - delta);
      if (contactArcRef.current) {
        contactArcRef.current.visible = true;
        const s = (arcTimerRef.current / 0.35) * (0.8 + Math.random() * 0.4);
        contactArcRef.current.scale.set(s, s, s);
      }
      if (arcLightRef.current) {
        arcLightRef.current.intensity = (arcTimerRef.current / 0.35) * 4.5;
      }
    } else {
      if (contactArcRef.current) contactArcRef.current.visible = false;
      if (arcLightRef.current) arcLightRef.current.intensity = 0;
    }
  });

  const housingColor = isSelected ? '#38bdf8' : isHovered ? '#60a5fa' : '#e2e8f0';
  const mcbBodyMaterial = new THREE.MeshStandardMaterial({
    color: isDimmed ? '#475569' : housingColor,
    roughness: 0.3,
    metalness: 0.1,
    transparent: isXRay || isDimmed,
    opacity: isDimmed ? 0.3 : (isXRay ? 0.4 : 1.0),
    emissive: isSelected ? '#0284c7' : (isEnergized ? '#0369a1' : '#000000'),
    emissiveIntensity: isSelected ? 0.4 : (isEnergized ? 0.2 : 0),
  });

  const leverMaterial = new THREE.MeshStandardMaterial({
    color: '#0284c7', // Bright blue toggle lever
    roughness: 0.2,
    metalness: 0.1,
  });

  const terminalLugMaterial = new THREE.MeshStandardMaterial({
    color: '#b45309', // Copper / Brass
    metalness: 0.85,
    roughness: 0.2,
  });

  const indicatorFlagMaterial = new THREE.MeshBasicMaterial({
    color: isTripped ? '#22c55e' : (isEnergized ? '#ef4444' : '#64748b'),
  });

  return (
    <group
      position={[-0.65 + explodedOffset[0], 0.45 + explodedOffset[1], 0.28 + explodedOffset[2]]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* Main MCB Outer Enclosure */}
      <mesh material={mcbBodyMaterial} castShadow receiveShadow>
        <boxGeometry args={[0.075, 0.22, 0.12]} />
      </mesh>

      {/* Front Beveled Nose Section */}
      <mesh position={[0, 0, 0.05]} material={mcbBodyMaterial} castShadow>
        <boxGeometry args={[0.072, 0.13, 0.05]} />
      </mesh>

      {/* Toggle Lever Pivot Group */}
      <group ref={leverRef} position={[0, 0.01, 0.08]}>
        <mesh position={[0, 0.02, 0.015]} material={leverMaterial} castShadow>
          <boxGeometry args={[0.032, 0.05, 0.02]} />
        </mesh>
      </group>

      {/* Contact Separation Arc Chute Opening Window */}
      <mesh position={[0, -0.015, 0.072]}>
        <boxGeometry args={[0.02, 0.015, 0.01]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* Internal Contact Arc / Spark Burst (Visible only at trip instant) */}
      <group ref={contactArcRef} position={[0, -0.015, 0.078]} visible={false}>
        {/* Core Electric Arc Plasma */}
        <mesh>
          <sphereGeometry args={[0.01, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.018, 8, 8]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.85} />
        </mesh>

        {/* Micro contact separation sparks */}
        {contactSparks.map((sp, idx) => (
          <mesh key={`spark-${idx}`} position={[sp.dir.x, sp.dir.y, sp.dir.z]}>
            <sphereGeometry args={[0.002, 4, 4]} />
            <meshBasicMaterial color={idx % 2 === 0 ? '#ffffff' : '#38bdf8'} />
          </mesh>
        ))}
      </group>

      {/* Point Light for Contact Separation Arc Flash */}
      <pointLight
        ref={arcLightRef}
        color="#38bdf8"
        intensity={0}
        distance={1.5}
        position={[0, -0.015, 0.1]}
      />

      {/* Status Flag Optical Indicator Window */}
      <mesh position={[0, 0.045, 0.076]} material={indicatorFlagMaterial}>
        <boxGeometry args={[0.025, 0.015, 0.002]} />
      </mesh>

      {/* Top Terminal Lug (Phase IN) */}
      <mesh position={[0, 0.105, 0]} material={terminalLugMaterial} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.03, 16]} />
      </mesh>
      {/* Top Screw Head */}
      <mesh position={[0, 0.12, 0.01]}>
        <cylinderGeometry args={[0.007, 0.007, 0.005, 12]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Bottom Terminal Lug (Phase OUT to Contactor) */}
      <mesh position={[0, -0.105, 0]} material={terminalLugMaterial} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.03, 16]} />
      </mesh>
      {/* Bottom Screw Head */}
      <mesh position={[0, -0.12, 0.01]}>
        <cylinderGeometry args={[0.007, 0.007, 0.005, 12]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* MCB Under Test Label Strip */}
      <mesh position={[0, -0.055, 0.076]}>
        <planeGeometry args={[0.06, 0.02]} />
        <meshBasicMaterial color="#0284c7" />
      </mesh>

      {/* Selection Glow Ring */}
      {isSelected && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.09, 0.24, 0.14]} />
          <meshBasicMaterial color="#00f2fe" wireframe transparent opacity={0.65} />
        </mesh>
      )}
    </group>
  );
};
