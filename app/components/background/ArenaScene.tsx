/// <reference types="@react-three/fiber" />
import { Float, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";

const GEMS = [
  { pos: [-22, 7, -10] as [number, number, number], color: "#f0a832", size: 0.65, speed: 0.35 },
  { pos: [25, -5, -14] as [number, number, number], color: "#4a6cf7", size: 0.95, speed: 0.22 },
  { pos: [-10, -11, -8] as [number, number, number], color: "#ffd700", size: 0.38, speed: 0.62 },
  { pos: [18, 11, -12] as [number, number, number], color: "#4a6cf7", size: 0.55, speed: 0.38 },
  { pos: [8, -7, -6] as [number, number, number], color: "#f0a832", size: 0.28, speed: 0.85 },
  { pos: [-19, 3, -16] as [number, number, number], color: "#4a6cf7", size: 1.1, speed: 0.18 },
  { pos: [30, 4, -20] as [number, number, number], color: "#f0a832", size: 0.82, speed: 0.14 },
  { pos: [-27, -8, -18] as [number, number, number], color: "#ffd700", size: 0.47, speed: 0.52 },
  { pos: [12, 16, -15] as [number, number, number], color: "#4a6cf7", size: 0.68, speed: 0.28 },
  { pos: [-14, 9, -9] as [number, number, number], color: "#f0a832", size: 0.32, speed: 0.74 },
  { pos: [20, -13, -11] as [number, number, number], color: "#a855f7", size: 0.5, speed: 0.41 },
  { pos: [-32, 1, -22] as [number, number, number], color: "#4a6cf7", size: 1.3, speed: 0.11 },
] as const;

interface GemProps {
  pos: [number, number, number];
  color: string;
  size: number;
  speed: number;
}

function Gem({ pos, color, size, speed }: GemProps) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * speed * 0.4;
      ref.current.rotation.y += delta * speed * 0.7;
      ref.current.rotation.z += delta * speed * 0.2;
    }
  });

  return (
    <Float speed={1.2 + speed} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={ref} position={pos} scale={size}>
        <octahedronGeometry args={[1, 0]} />
        <meshPhongMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.35}
          shininess={120}
          transparent
          opacity={0.5}
        />
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
      <ambientLight intensity={0.12} />
      <pointLight position={[15, 10, 8]} intensity={0.8} color="#4a6cf7" />
      <pointLight position={[-15, -8, 5]} intensity={0.6} color="#f0a832" />
      <pointLight position={[0, 20, -5]} intensity={0.4} color="#a855f7" />

      <Stars radius={120} depth={60} count={1800} factor={2.5} saturation={0.4} fade speed={0.3} />

      {GEMS.map((gem, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static array
        <Gem key={i} {...gem} />
      ))}
    </Canvas>
  );
}
