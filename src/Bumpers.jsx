import { CuboidCollider, InstancedRigidBodies, RigidBody } from '@react-three/rapier'
import { useMemo, useRef } from 'react'
import useGame from './stores/useGame'
import { Grid, Instance, Instances } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { materials } from './materials'
import * as THREE from 'three'

const bumperGeometry = new THREE.BoxGeometry(0.02, 0.195, 4)

export default function Bumpers() {
  const blocksCount = useGame((state) => state.blocksCount)
  const bumpersOn = useGame((state) => state.difficulty === 'easy' ? true : false)
  const bumpersCount = 2
  const bumperOffset = 2 + 0.01
  const rigidBumpers = useRef()
  const bumpersGroup = useRef()
  const bumpersVisual = useRef()
  const grid = useRef()

  const bumperIntances = useMemo(() => {
    const instances = []
    for (let i = 0; i < bumpersCount; i++) {
    instances.push({
      key: 'bumper_' + i,
      // position first on the -2 and second on the 2
      position: [i % 2 === 0 ? bumperOffset * -1 : bumperOffset, -0.1, 0],
    })
    }
    return instances
  }, [])

  useFrame((state, delta) => {
    const duration = 0.5

    if (!bumpersOn) {
      rigidBumpers.current.map((instance, index) => {
        instance.setTranslation({
          x: instance.translation().x,
          y: Math.max(instance.translation().y - delta * duration, -0.1),
          z: instance.translation().z })
      })

      grid.current.position.y = Math.max(grid.current.position.y - delta * duration * 6, -2)
      bumpersVisual.current.position.y = Math.max(bumpersVisual.current.position.y - delta * duration, 0)
    } else {
      rigidBumpers.current.map((instance, index) => {
        instance.setTranslation({ x: instance.translation().x,
        y: Math.min(instance.translation().y + delta * duration, 0.2),
        z: instance.translation().z })
      })

      grid.current.position.y = Math.min(grid.current.position.y + delta * duration * 6, -0.2)
      bumpersVisual.current.position.y = Math.min(bumpersVisual.current.position.y + delta * duration, 0.3)
    }
  })

  return (
    <group>
      <group ref={ bumpersGroup } scale-z={ blocksCount } position-z={(blocksCount) / 2 * -4 - 2}>
        <InstancedRigidBodies includeInvisible={ true } ref={ rigidBumpers } type="fixed" instances={ bumperIntances } restitution={ 1 }>
          <instancedMesh visible={ false } args={[ null, null, bumpersCount ]} geometry={ bumperGeometry }>
          </instancedMesh>
        </InstancedRigidBodies>
        { bumpersOn && <RigidBody key={ bumpersOn } type="fixed" restitution={ 0.2 } friction={ 0 } colliders={ false }>
          <CuboidCollider args={[ 2, 0.05, 2 ]} position={[ 0, -0.25, 0 ]}/>
        </RigidBody>}
      </group>
      <Instances ref={ bumpersVisual } geometry={ bumperGeometry } material={ materials.blueLight } receiveShadow>
        <Instance
          position={[-2.01, -0.025, -4 * blocksCount / 2 - 2]}
          scale={[1, 0.25, blocksCount]}
        />
        <Instance
          position={[2.01, -0.025, -4 * blocksCount / 2 - 2]}
          scale={[1, 0.25, blocksCount]}
        />
        <Instance
          position={[-2.01, -0.175, -4 * blocksCount / 2 - 2]}
          scale={[1, 0.25, blocksCount]}
        />
        <Instance
          position={[2.01, -0.175, -4 * blocksCount / 2 - 2]}
          scale={[1, 0.25, blocksCount]}
        />
      </Instances>
      <Grid ref={ grid }
        infiniteGrid={ true }
        position={[0, -2, 0]}
        fadeDistance={ 60 }
        fadeStrength={ 5 }
        cellSize={ 0 }
        sectionColor={ '#2B53E4' }
        sectionSize={ 2 }
        sectionThickness={ 1 }
        followCamera={ true }
        />
    </group>
  )
}
