import { Float, Text } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import { boxGeometry, materials } from '../materials'

export default function BlockStart ({ position = [0, 0, 0] }) {
  const isMobile = window.matchMedia('(max-width: 560px)').matches
  const isDesktop = window.matchMedia('(min-width: 1280px)').matches
  
  return <group position={ position }>
    {/* Floor */}
    <RigidBody type="fixed" restitution={ 0.2 } friction={ 0 }>
      <mesh geometry={ boxGeometry } material={ materials.aquaLight } position-y={ -0.1 }
        scale={[ 4, 0.2, 4 ]} receiveShadow />
    </RigidBody>
    {/* Intro Text */}
    <Float floatIntensity={ 0.25 } rotationIntensity={ 0.5 }>
      <Text
        font='./fonts/bebas-neue-v9-latin-regular.woff'
        scale={ isMobile ? 0.18 : isDesktop ? 0.4 : 0.25 }
        maxWidth={ 0.25 }
        lineHeight={ 0.95 }
        textAlign={isMobile ? 'center' : 'right'}
        position={isMobile ? [ 0, 0.92, 0.5 ] : isDesktop ? [ 0.75, 0.75, 0 ] : [ 0.3, 0.75, 0 ]}
        rotation-y={isDesktop ? -0.5 : -0.25}
        >Warp Zone
          <meshBasicMaterial toneMapped={ false } />
        </Text>
    </Float>
  </group>
}
