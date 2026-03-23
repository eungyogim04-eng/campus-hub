'use client'

import dynamic from 'next/dynamic'

const FloatingIcon = dynamic(() => import('./FloatingIcon'), { ssr: false })
const ParticleField = dynamic(() => import('./ParticleField'), { ssr: false })

export function Hero3D() {
  return <FloatingIcon />
}

export function HeroParticles() {
  return <ParticleField />
}

export { default as TiltCard } from './TiltCard'
