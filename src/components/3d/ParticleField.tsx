'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo, Suspense } from 'react'
import * as THREE from 'three'

function Particles({ count = 80 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)

  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      temp.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6 - 2
        ),
        speed: 0.2 + Math.random() * 0.5,
        offset: Math.random() * Math.PI * 2,
        scale: 0.03 + Math.random() * 0.06,
        color: new THREE.Color().setHSL(
          0.07 + Math.random() * 0.08, // warm orange range
          0.6 + Math.random() * 0.3,
          0.6 + Math.random() * 0.3
        ),
      })
    }
    return temp
  }, [count])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state) => {
    if (!meshRef.current) return
    particles.forEach((p, i) => {
      const t = state.clock.elapsedTime
      dummy.position.set(
        p.position.x + Math.sin(t * p.speed + p.offset) * 0.5,
        p.position.y + Math.cos(t * p.speed * 0.7 + p.offset) * 0.4,
        p.position.z + Math.sin(t * p.speed * 0.5 + p.offset * 2) * 0.3
      )
      dummy.scale.setScalar(p.scale * (1 + Math.sin(t * p.speed * 2 + p.offset) * 0.3))
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
      meshRef.current!.setColorAt(i, p.color)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        transparent
        opacity={0.6}
        emissive="#FB8C00"
        emissiveIntensity={0.4}
      />
    </instancedMesh>
  )
}

function GlowOrbs() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.children.forEach((child, i) => {
      const t = state.clock.elapsedTime
      child.position.y = Math.sin(t * 0.3 + i * 1.8) * 1.5
      child.position.x = Math.cos(t * 0.2 + i * 2.5) * 2
    })
  })

  const orbs = [
    { pos: [-3, 0, -3] as [number, number, number], color: '#FB8C00', scale: 0.4 },
    { pos: [3, 1, -4] as [number, number, number], color: '#5DCAA5', scale: 0.3 },
    { pos: [0, -1, -5] as [number, number, number], color: '#EF9F27', scale: 0.35 },
    { pos: [-2, 2, -4] as [number, number, number], color: '#F0997B', scale: 0.25 },
  ]

  return (
    <group ref={groupRef}>
      {orbs.map((orb, i) => (
        <mesh key={i} position={orb.pos} scale={orb.scale}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color={orb.color}
            transparent
            opacity={0.15}
            emissive={orb.color}
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function ParticleField() {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      zIndex: 0, overflow: 'hidden',
    }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} style={{ background: 'transparent' }}>
        <ambientLight intensity={0.3} />
        <Suspense fallback={null}>
          <Particles count={80} />
          <GlowOrbs />
        </Suspense>
      </Canvas>
    </div>
  )
}
