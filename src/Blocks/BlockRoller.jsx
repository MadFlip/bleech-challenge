import { useGLTF } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import { useRef, useState } from 'react'
import useGame from '../stores/useGame'
import { useFrame } from '@react-three/fiber'
import { audio, playAudio } from '../Audio'
import * as THREE from 'three'
import { boxGeometry, materials } from '../Materials'

export default function BlockRoller ({ position = [0, 0, 0] }) {
  const obstacle = useRef()
  const { nodes } = useGLTF('./obstacle-1.glb')
  const [ timeOffset ] = useState(() => Math.random() * Math.PI * 2)
  const sound = useGame((state) => state.sound)
  const decreaseHealth = useGame((state) => state.decreaseHealth)

  useFrame((state, delta) => {
    if (!obstacle.current) return
    const time = state.clock.getElapsedTime()
    const x = Math.sin(time + timeOffset) * 1.25
    obstacle.current.setNextKinematicTranslation({ x: position[0] + x, y: position[1] + 0.75, z: position[2] })
    // rotate the obstacle a bit on z axis back and forth
    const euler = new THREE.Euler(0, 0, -Math.sin(time + timeOffset) * Math.PI / 2)
    const quaternion = new THREE.Quaternion().setFromEuler(euler)
    obstacle.current.setNextKinematicRotation(quaternion) 
  })

  return <group position={ position }>
    {/* Floor */}
    <RigidBody type="fixed" restitution={ 0.2 } friction={ 0 }>
      <mesh geometry={ boxGeometry } material={ materials.aqua } position-y={ -0.1 }
        scale={[ 4, 0.2, 4 ]} receiveShadow />
    </RigidBody>
    {/* Obstacle  */}
    <RigidBody ref={ obstacle }
      onCollisionEnter={ () => playAudio(audio.hit, 0.75, false, sound)}
      onCollisionExit={ (e) => (e.other.colliderObject.name === 'player') ? decreaseHealth(25) : null}
      type="kinematicPosition" position={[ 0, 0.3, 0 ]} restitution={ 0.2 } friction={ 0 }>
      <group scale={1.4}>
        {/* Segment Blue Light */}
        <mesh
          castShadow
          receiveShadow
          geometry={ nodes.BlueSegment1.geometry }
          material={ materials.blueLight }
        />
        {/* Segment Blue */}
        <mesh
          castShadow
          receiveShadow
          geometry={ nodes.DarkBlueSegment.geometry }
          material={ materials.blue }
        />
        {/* Segment Aqua */}
        <mesh
          castShadow
          receiveShadow
          geometry={ nodes.DownySegment.geometry }
          material={ materials.aqua }
        />
      </group>
    </RigidBody>
  </group>
}
