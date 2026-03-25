'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Text3D, Center, MeshTransmissionMaterial } from '@react-three/drei'
import { useRef, Suspense } from 'react'
import * as THREE from 'three'

function GraduationCap() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.15
    }
  })

  return (
    <group ref={groupRef}>
      {/* Cap base (square) */}
      <mesh position={[0, 0.35, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[1.6, 0.08, 1.6]} />
        <meshStandardMaterial color="#FB8C00" metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Cap dome */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.55, 0.7, 0.35, 6]} />
        <meshStandardMaterial color="#c47a2a" metalness={0.2} roughness={0.5} />
      </mesh>

      {/* Button on top */}
      <mesh position={[0, 0.42, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#EF9F27" metalness={0.6} roughness={0.2} />
      </mesh>

      {/* Tassel string */}
      <mesh position={[0.5, 0.35, 0.5]}>
        <cylinderGeometry args={[0.015, 0.015, 0.5, 8]} />
        <meshStandardMaterial color="#EF9F27" />
      </mesh>

      {/* Tassel end */}
      <mesh position={[0.5, 0.08, 0.5]}>
        <cylinderGeometry args={[0.04, 0.01, 0.12, 8]} />
        <meshStandardMaterial color="#EF9F27" metalness={0.3} roughness={0.3} />
      </mesh>
    </group>
  )
}

function Trophy() {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.4
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.1
    }
  })

  return (
    <group ref={ref} position={[2.2, -0.3, -1]} scale={0.5}>
      {/* Cup */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.35, 0.25, 0.6, 16]} />
        <meshStandardMaterial color="#EF9F27" metalness={0.7} roughness={0.15} />
      </mesh>
      {/* Base */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.15, 16]} />
        <meshStandardMaterial color="#BA7517" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Star */}
      <mesh position={[0, 0.8, 0]}>
        <octahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial color="#fff" emissive="#EF9F27" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

function Rocket() {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.15
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.2 + 0.3
      ref.current.position.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <group ref={ref} position={[-2.2, 0, -1]} scale={0.45} rotation={[0, 0, 0.3]}>
      {/* Body */}
      <mesh>
        <capsuleGeometry args={[0.2, 0.7, 8, 16]} />
        <meshStandardMaterial color="#FB8C00" metalness={0.3} roughness={0.4} />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 0.65, 0]}>
        <coneGeometry args={[0.2, 0.35, 16]} />
        <meshStandardMaterial color="#F0997B" metalness={0.2} roughness={0.4} />
      </mesh>
      {/* Window */}
      <mesh position={[0, 0.15, 0.18]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#E5F0FB" emissive="#4090d0" emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

function FloatingBubbles() {
  const bubblesRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (bubblesRef.current) {
      bubblesRef.current.children.forEach((child, i) => {
        child.position.y = Math.sin(state.clock.elapsedTime * 0.5 + i * 1.5) * 0.3
        child.position.x = Math.cos(state.clock.elapsedTime * 0.3 + i * 2) * 0.15
      })
    }
  })

  const positions: [number, number, number][] = [
    [-1.5, 1, -2], [1.8, 0.8, -1.5], [-0.8, -0.8, -1],
    [1.2, -0.5, -2], [0, 1.2, -1.8], [-2, -0.2, -1.5],
    [2.5, 0.3, -2.5], [-1, 0.5, -2.2],
  ]

  const colors = ['#F0A85C', '#5DCAA5', '#EF9F27', '#F0997B', '#F0A85C', '#5DCAA5', '#4090d0', '#5da030']

  return (
    <group ref={bubblesRef}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.06 + Math.random() * 0.06, 16, 16]} />
          <meshStandardMaterial
            color={colors[i]}
            transparent
            opacity={0.5}
            emissive={colors[i]}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function FloatingIcon() {
  return (
    <div style={{ width: '100%', height: 320, position: 'relative' }}>
      <Canvas camera={{ position: [0, 0.5, 4], fov: 45 }} style={{ background: 'transparent' }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#fff" />
        <directionalLight position={[-3, 3, -3]} intensity={0.4} color="#F0A85C" />
        <pointLight position={[0, 2, 2]} intensity={0.5} color="#EF9F27" />

        <Suspense fallback={null}>
          <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
            <GraduationCap />
          </Float>
          <Trophy />
          <Rocket />
          <FloatingBubbles />
        </Suspense>
      </Canvas>
    </div>
  )
}
