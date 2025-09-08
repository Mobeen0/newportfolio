import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, OrbitControls, Stars, Grid } from '@react-three/drei'
import { Suspense, useRef } from 'react'

function Torus() {
  const ref = useRef()
  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.x += delta * 0.25
    ref.current.rotation.y += delta * 0.35
  })
  return (
    <mesh ref={ref} castShadow receiveShadow position={[0, 0.2, 0]}>
      <torusKnotGeometry args={[0.9, 0.28, 220, 32]} />
      <meshStandardMaterial
        color="#22d3ee"
        emissive="#0ea5b7"
        emissiveIntensity={0.35}
        roughness={0.2}
        metalness={0.5}
      />
    </mesh>
  )
}

export default function Hero3D() {
  return (
    <div className="hero-3d">
      <Canvas shadows camera={{ position: [0, 0.3, 4.2], fov: 36 }}>
        <color attach="background" args={[0, 0, 0, 0]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 4, 5]} intensity={1.2} castShadow />
        <directionalLight position={[-4, -2, -3]} intensity={0.25} color="#22d3ee" />
        <Suspense fallback={null}>
          <Torus />
          <Stars radius={50} depth={20} count={1000} factor={4} saturation={0} fade speed={0.6} />
          <Grid
            position={[0, -1.4, 0]}
            args={[20, 20]}
            cellSize={0.6}
            cellThickness={0.6}
            sectionSize={3.6}
            sectionThickness={1}
            sectionColor="#0ea5b7"
            cellColor="#0b7285"
            fadeDistance={20}
            fadeStrength={1}
            infiniteGrid
          />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
      </Canvas>
    </div>
  )
}


