import { RigidBody } from '@react-three/rapier'
import { boxGeometry, materials } from '../Materials'

export default function BlockBridge ({ position = [0, 0, 0], alignment = 'random'}) {
  switch (alignment) {
    case 'random':
      alignment = [-1.5, 0, 1.5][Math.floor(Math.random() * 3)]
      break
    case 'left':
      alignment = -1.5
      break
    case 'center':
      alignment = 0
      break
    case 'right':
      alignment = 1.5
      break
  }

  const xPosition = alignment
  
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
