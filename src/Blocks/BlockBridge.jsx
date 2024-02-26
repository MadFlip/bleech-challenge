import { RigidBody } from '@react-three/rapier'
import { boxGeometry, materials } from '../Materials'

export default function BlockNarrowBridge ({ position = [0, 0, 0]}) {
  // set random x position -1.5, 0, 1.5
  const xPosition = [-1.5, 0, 1.5][Math.floor(Math.random() * 3)]

  return <group position={ position }>
    {/* Floor */}
    <RigidBody type="fixed" restitution={ 0.2 } friction={ 0 }
      // whem key value is changed, the component will be re-rendered
      key={xPosition}
      >
      <mesh geometry={ boxGeometry } material={ materials.aqua }
        position-y={ -0.1 }
        position-x={ xPosition }
        scale={[ 1, 0.2, 4 ]} receiveShadow />
    </RigidBody>
  </group>
}
