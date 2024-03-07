import { RigidBody } from '@react-three/rapier'
import { boxGeometry, materials } from '../materials'

export default function BlockBridgeLeft ({ position = [0, 0, 0]}) {
  return <group position={ position }>
    {/* Floor */}
    <RigidBody type="fixed" restitution={ 0.2 } friction={ 0 }>
      <mesh geometry={ boxGeometry } material={ materials.aqua }
        position-y={ -0.1 }
        position-x={ -1.5 }
        scale={[ 1, 0.2, 4 ]} receiveShadow />
    </RigidBody>
  </group>
}
