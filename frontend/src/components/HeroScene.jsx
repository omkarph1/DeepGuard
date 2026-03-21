import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particles({ count = 500, isDark }) {
  const mesh = useRef()
  const color = isDark ? '#00D4E8' : '#0284c7' 
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return pos
  }, [count])

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.05
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.1
    }
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isDark ? 0.06 : 0.08}
        color={color}
        transparent
        opacity={isDark ? 0.8 : 0.6}
        sizeAttenuation
      />
    </points>
  )
}

function WireframeSphere({ isDark }) {
  const mesh = useRef()
  const color = isDark ? '#00D4E8' : '#0284c7'

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.15
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.3
    }
  })

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[3.5, 3]} />
      <meshBasicMaterial
        color={color}
        wireframe
        transparent
        opacity={isDark ? 0.25 : 0.20}
      />
    </mesh>
  )
}

function InnerSphere({ isDark }) {
  const mesh = useRef()
  const color = isDark ? '#7B61FF' : '#4f46e5'

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = -state.clock.elapsedTime * 0.1
      mesh.current.rotation.z = state.clock.elapsedTime * 0.08
    }
  })

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[2.0, 2]} />
      <meshBasicMaterial
        color={color}
        wireframe
        transparent
        opacity={isDark ? 0.2 : 0.15}
      />
    </mesh>
  )
}

export default function HeroScene() {
  const [isDark, setIsDark] = useState(
    typeof window !== 'undefined' ? document.documentElement.classList.contains('dark') : true
  )

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <WireframeSphere isDark={isDark} />
        <InnerSphere isDark={isDark} />
        <Particles count={600} isDark={isDark} />
      </Canvas>
    </div>
  )
}
