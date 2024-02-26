import { useRef } from 'react'
import { TextureLoader } from 'three'
import { Float, Text, useGLTF } from '@react-three/drei'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useFrame, useLoader } from '@react-three/fiber'
import Confetti from '../Confetti'
import { boxGeometry, materials } from '../Materials'

export default function BlockEnd ({ position = [0, 0, 0] }) {
  const flyntRef = useRef()
  const matcapTexture = useLoader(TextureLoader, './matcaps/D07E3F_FBBD1F_8D2840_24120C-512px.png')
  const { nodes } = useGLTF('./flynt.glb')
  const flyntScale = 0.45

  useFrame((state, delta) => {
    flyntRef.current.rotation.y += delta * 0.5
  })

  return <group position={ position }>
    {/* Floor */}
    <RigidBody type="fixed" colliders={ false } restitution={ 0.2 } friction={ 0 }>
      <mesh geometry={ boxGeometry } material={ materials.aquaLight } position-y={ -0.1 }
        scale={[ 4, 0.2, 4 ]} receiveShadow />
      {/* Floor Collider */}a
      <CuboidCollider args={[ 2, 0.1, 2 ]} position={[ 0, -0.1, 0 ]} />
      {/* Back Invisible Wall */}
      <CuboidCollider args={[ 2.1, 0.5, 0.1 ]} position={[ 0, 0.5, -2 ]} />
      {/* Left Invisible Wall */}
      <CuboidCollider args={[ 0.1, 0.5, 1.5 ]} position={[ -2.1, 0.5, -0.3 ]} />
      {/* Right Invisible Wall */}
      <CuboidCollider args={[ 0.1, 0.5, 1.5 ]} position={[ 2.1, 0.5, -0.3 ]} />
    </RigidBody>
    {/* Flynt Model */}
    <RigidBody type="fixed" colliders="hull" restitution={ 0.2 } friction={ 0 } position={[0, 1, 0]}>
      <Float floatIntensity={ 0.5 } rotationIntensity={ 0.2 }>
        <mesh ref={ flyntRef }
          castShadow
          receiveShadow
          geometry={ nodes.Stone.geometry }
          scale={[ 1.3 * flyntScale, 2 * flyntScale, 1.5 * flyntScale ]}>
          <meshMatcapMaterial matcap={ matcapTexture }  toneMapped={ false }/>
        </mesh>
      </Float>
    </RigidBody>
    {/* Finish */}
    <Text
      font='./fonts/bebas-neue-v9-latin-regular.woff'
      scale={ 1 }
      maxWidth={ 0.25 }
      lineHeight={ 0.75 }
      textAlign='right'
      position={[ 0, 2.5, 0 ]}
      rotation-y={ -0.25}
      ><meshBasicMaterial toneMapped={ false } />
        FINISH
    </Text>
    <Confetti />
  </group>
}
