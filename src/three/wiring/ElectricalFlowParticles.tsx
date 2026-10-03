import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface Props {
  powerFlowActive: boolean;
  isTripped: boolean;
  currentMagnitude: number;
  explodedOffset?: [number, number, number];
}

export const ElectricalFlowParticles: React.FC<Props> = ({
  powerFlowActive,
  isTripped,
  currentMagnitude,
  explodedOffset = [0, 0, 0],
}) => {
  const ringMeshRef = useRef<THREE.InstancedMesh>(null);
  const haloMeshRef = useRef<THREE.InstancedMesh>(null);
  const opacityRef = useRef<number>(0);
  const progressRef = useRef<number>(0);

  // Number of spaced circular light rings along the circuit
  const ringCount = 32;

  // Complete, seamless electrical circuit path through physical prototype:
  // AC Phase Terminal -> Slotted Duct -> MCB In Top -> MCB Arc Chute & Contacts -> MCB Out Bottom ->
  // Interconnect Wire -> Contactor In L1 -> Contactor Main Contacts -> Contactor Out T1 ->
  // Current Transducer ACS758 In -> Out -> Downstream Shunt ->
  // Load Coil 1 -> Load Coil 2 -> Load Coil 3 -> Return Loom -> Neutral Terminal N
  const powerCurve = useMemo(() => {
    const points = [
      new THREE.Vector3(-0.08, -0.10, 0.32), // Terminal Phase L1
      new THREE.Vector3(-0.08, 0.16, 0.32),  // Up into middle duct
      new THREE.Vector3(-0.65, 0.16, 0.32),  // Left across to MCB bay
      new THREE.Vector3(-0.65, 0.55, 0.28),  // MCB Line In Top Lug
      new THREE.Vector3(-0.65, 0.45, 0.28),  // MCB Internal Contact Chamber
      new THREE.Vector3(-0.65, 0.35, 0.28),  // MCB Load Out Bottom Lug
      new THREE.Vector3(-0.65, 0.22, 0.32),  // Down to cross-feed duct
      new THREE.Vector3(-0.06, 0.22, 0.32),  // Across to AC Contactor
      new THREE.Vector3(-0.06, 0.54, 0.32),  // Contactor Line Terminal L1
      new THREE.Vector3(-0.06, 0.45, 0.32),  // Contactor Contact Chamber
      new THREE.Vector3(-0.06, 0.36, 0.32),  // Contactor Load Terminal T1
      new THREE.Vector3(-0.06, 0.15, 0.32),  // Down to sensor harness
      new THREE.Vector3(-0.39, 0.15, 0.32),  // Across to Current Sensor ACS758
      new THREE.Vector3(-0.39, 0.12, 0.33),  // ACS758 Transducer In
      new THREE.Vector3(-0.31, 0.12, 0.33),  // ACS758 Transducer Out
      new THREE.Vector3(-0.31, -0.15, 0.32), // Downstream Shunt Path
      new THREE.Vector3(-0.48, -0.28, 0.32), // Downstream Fault Point
      new THREE.Vector3(-0.52, -0.50, 0.32), // Feed down to Load Chamber
      new THREE.Vector3(-0.52, -0.70, 0.28), // Load Coil 1 (Toroidal/Nichrome A)
      new THREE.Vector3(-0.43, -0.70, 0.28),
      new THREE.Vector3(-0.25, -0.65, 0.28), // Coil 1 -> 2 Jumper
      new THREE.Vector3(-0.09, -0.70, 0.28),
      new THREE.Vector3(0.0, -0.70, 0.28),   // Load Coil 2 (Nichrome B)
      new THREE.Vector3(0.09, -0.70, 0.28),
      new THREE.Vector3(0.25, -0.65, 0.28),  // Coil 2 -> 3 Jumper
      new THREE.Vector3(0.43, -0.70, 0.28),
      new THREE.Vector3(0.52, -0.70, 0.28),  // Load Coil 3 (Surge Stage)
      new THREE.Vector3(0.52, -0.45, 0.32),  // Up from Load Chamber
      new THREE.Vector3(0.08, -0.45, 0.32),  // Return Duct across to Neutral
      new THREE.Vector3(0.08, -0.21, 0.32),  // Return Feed
      new THREE.Vector3(0.08, -0.10, 0.32)   // Neutral Terminal N Return
    ];
    return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.2);
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const dummyHalo = useMemo(() => new THREE.Object3D(), []);
  const ringGeo = useMemo(() => new THREE.TorusGeometry(0.012, 0.0018, 10, 24), []);
  const haloGeo = useMemo(() => new THREE.TorusGeometry(0.015, 0.003, 8, 20), []);

  const ringMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#38bdf8', // Light Cyan Blue
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    []
  );

  const haloMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#00f2fe', // Soft Glowing Cyan Halo
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    []
  );

  // Update ring animation and spatial orientation along wire curve
  useFrame((_, delta) => {
    if (!ringMeshRef.current || !haloMeshRef.current) return;

    // Determine target opacity based on power state and current
    const shouldFlow = powerFlowActive && !isTripped && currentMagnitude > 0.05;
    const targetOpacity = shouldFlow
      ? Math.min(0.92, 0.4 + (currentMagnitude / 20.0) * 0.45)
      : 0;

    // Smooth transition (weakens gradually upon voltage collapse or stops on trip)
    opacityRef.current = THREE.MathUtils.damp(
      opacityRef.current,
      targetOpacity,
      isTripped ? 25 : 8,
      delta
    );

    ringMat.opacity = opacityRef.current;
    haloMat.opacity = opacityRef.current * 0.45;

    // If completely faded out, park instances away to save GPU fill
    if (opacityRef.current < 0.01) {
      for (let i = 0; i < ringCount; i++) {
        dummy.position.set(0, -999, 0);
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        ringMeshRef.current.setMatrixAt(i, dummy.matrix);
        haloMeshRef.current.setMatrixAt(i, dummy.matrix);
      }
      ringMeshRef.current.instanceMatrix.needsUpdate = true;
      haloMeshRef.current.instanceMatrix.needsUpdate = true;
      return;
    }

    // Speed scales dynamically with True-RMS current (synced with graph)
    // Low current: slow calm glide. High current: rapid traveling rings.
    const speedMultiplier = Math.max(0.08, Math.min(1.4, (currentMagnitude / 16.0) * 0.45));
    progressRef.current = (progressRef.current + delta * speedMultiplier) % 1.0;

    const isHighCurrent = currentMagnitude > 30;
    const baseScale = isHighCurrent ? 1.15 : 1.0;

    for (let i = 0; i < ringCount; i++) {
      // Evenly spaced progression along the complete electrical path
      const t = (i / ringCount + progressRef.current) % 1.0;

      // Sample 3D position and tangent along the actual wire curve
      const pos = powerCurve.getPointAt(t);
      const tangent = powerCurve.getTangentAt(t).normalize();

      dummy.position.copy(pos);
      dummy.position.add(new THREE.Vector3(...explodedOffset));

      // Align circular ring perpendicular to the wire axis at this exact point
      // Default TorusGeometry normal is in Z direction (0, 0, 1)
      dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);

      // Subtle traveling pulse
      const pulse = Math.sin(t * Math.PI * 8 + progressRef.current * 10) * 0.08;
      const s = Math.max(0.7, baseScale + pulse);
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();

      ringMeshRef.current.setMatrixAt(i, dummy.matrix);

      // Outer soft glow halo ring
      dummyHalo.position.copy(dummy.position);
      dummyHalo.quaternion.copy(dummy.quaternion);
      dummyHalo.scale.set(s * 1.12, s * 1.12, s * 1.12);
      dummyHalo.updateMatrix();

      haloMeshRef.current.setMatrixAt(i, dummyHalo.matrix);
    }

    ringMeshRef.current.instanceMatrix.needsUpdate = true;
    haloMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* Primary Circular Light Rings */}
      <instancedMesh
        ref={ringMeshRef}
        args={[ringGeo, ringMat, ringCount]}
        frustumCulled={false}
      />

      {/* Soft Cyan Halo Glow */}
      <instancedMesh
        ref={haloMeshRef}
        args={[haloGeo, haloMat, ringCount]}
        frustumCulled={false}
      />
    </group>
  );
};
