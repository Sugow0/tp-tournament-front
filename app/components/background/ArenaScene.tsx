/// <reference types="@react-three/fiber" />
import { Float } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type * as THREE from "three";
import { dndPalette } from "~/theme/tokens";

/* ─── Embers: slow torch sparks drifting upward ─── */
const EMBER_COUNT = 320;

function EmberParticles() {
  const ref = useRef<THREE.Points>(null);

  const { positions, speeds, phases } = useMemo(() => {
    const positions = new Float32Array(EMBER_COUNT * 3);
    const speeds = new Float32Array(EMBER_COUNT);
    const phases = new Float32Array(EMBER_COUNT);
    for (let i = 0; i < EMBER_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = -8 - Math.random() * 18;
      speeds[i] = 0.35 + Math.random() * 0.85;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { positions, speeds, phases };
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const attr = ref.current.geometry.attributes.position;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < EMBER_COUNT; i++) {
      arr[i * 3 + 1] += delta * speeds[i] * 2.0;
      arr[i * 3] += Math.sin(arr[i * 3 + 1] * 0.28 + phases[i]) * delta * 0.22;
      if (arr[i * 3 + 1] > 32) {
        arr[i * 3 + 1] = -32;
        arr[i * 3] = (Math.random() - 0.5) * 100;
      }
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute args={[positions, 3]} attach="attributes-position" />
      </bufferGeometry>
      <pointsMaterial
        color={dndPalette.ember}
        size={0.09}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ─── Brass sparks: smaller, faster ─── */
const SPARK_COUNT = 150;

function GoldSparks() {
  const ref = useRef<THREE.Points>(null);

  const { positions, speeds, phases } = useMemo(() => {
    const positions = new Float32Array(SPARK_COUNT * 3);
    const speeds = new Float32Array(SPARK_COUNT);
    const phases = new Float32Array(SPARK_COUNT);
    for (let i = 0; i < SPARK_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 70;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = -4 - Math.random() * 12;
      speeds[i] = 0.9 + Math.random() * 1.6;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { positions, speeds, phases };
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const attr = ref.current.geometry.attributes.position;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < SPARK_COUNT; i++) {
      arr[i * 3 + 1] += delta * speeds[i] * 2.8;
      arr[i * 3] += Math.sin(arr[i * 3 + 1] * 0.5 + phases[i]) * delta * 0.35;
      if (arr[i * 3 + 1] > 32) {
        arr[i * 3 + 1] = -32;
        arr[i * 3] = (Math.random() - 0.5) * 70;
      }
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute args={[positions, 3]} attach="attributes-position" />
      </bufferGeometry>
      <pointsMaterial
        color={dndPalette.goldBright}
        size={0.045}
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ─── Arcane orbs: wireframe icosahedra slowly tumbling ─── */
const ORBS = [
  {
    pos: [-24, 7, -14] as [number, number, number],
    color: dndPalette.gold,
    size: 4.0,
    rx: 0.07,
    ry: 0.12,
  },
  {
    pos: [26, -5, -20] as [number, number, number],
    color: dndPalette.crimson,
    size: 5.5,
    rx: 0.05,
    ry: 0.09,
  },
  {
    pos: [-15, -11, -16] as [number, number, number],
    color: dndPalette.magic,
    size: 3.2,
    rx: 0.09,
    ry: 0.06,
  },
  {
    pos: [18, 13, -18] as [number, number, number],
    color: dndPalette.gold,
    size: 2.6,
    rx: 0.11,
    ry: 0.08,
  },
  {
    pos: [35, 2, -24] as [number, number, number],
    color: dndPalette.crimson,
    size: 6.0,
    rx: 0.04,
    ry: 0.07,
  },
] as const;

interface OrbProps {
  pos: [number, number, number];
  color: string;
  size: number;
  rx: number;
  ry: number;
}

function ArcaneOrb({ pos, color, size, rx, ry }: OrbProps) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * rx;
    ref.current.rotation.y += delta * ry;
    ref.current.rotation.z += delta * 0.03;
  });
  return (
    <Float speed={0.4} rotationIntensity={0.2} floatIntensity={2.5}>
      <mesh ref={ref} position={pos} scale={size}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.14} />
      </mesh>
    </Float>
  );
}

export function ArenaScene() {
  return (
    <Canvas
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0, 15], fov: 65 }}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <fog attach="fog" args={[dndPalette.arenaBg, 35, 90]} />
      <ambientLight intensity={0.06} />
      <pointLight position={[-18, -8, 6]} intensity={1.5} color={dndPalette.torch} decay={2} />
      <pointLight position={[18, 16, 8]} intensity={0.9} color={dndPalette.gold} decay={2} />
      <pointLight position={[0, 5, -2]} intensity={0.5} color={dndPalette.magic} decay={3} />

      <EmberParticles />
      <GoldSparks />

      {ORBS.map((orb, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static constant array
        <ArcaneOrb key={i} {...orb} />
      ))}
    </Canvas>
  );
}
