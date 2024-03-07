import { useGLTF } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import { useRef, useState } from 'react'
import useGame from '../stores/useGame'
import { useFrame } from '@react-three/fiber'
import { audio, playAudio } from '../Audio'
import * as THREE from 'three'
import { boxGeometry, materials } from '../materials'

export default function BlockHammer ({ position = [0, 0, 0] }) {
  const obstacle = useRef()
  const { nodes } = useGLTF('./obstacle-2.glb')
  const [ timeOffset ] = useState(() => Math.random() * Math.PI * 2)
  const sound = useGame((state) => state.sound)
  const decreaseHealth = useGame((state) => state.decreaseHealth)

  useFrame((state, delta) => {
    if (!obstacle.current) return
    const time = state.clock.getElapsedTime()
    const y = Math.sin(time * 2 + timeOffset) + 1.25
    obstacle.current.setNextKinematicTranslation({ x: position[0], y: position[1] + y / 2, z: position[2] })

    // Rotate the obstacle a bit on z axis back and forth
    const euler = new THREE.Euler(0, 0, -Math.sin(time * 2 + timeOffset) * 0.25)
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
      <group>
        {/* Hammer Head */}
        <mesh
          castShadow
          receiveShadow
          geometry={ nodes.HammerHead.geometry }
          material={ materials.blue }
          position={[-0.285, 0.501, 0]}
          rotation={[0, 0, -Math.PI / 2]}
          scale={[1, 0.427, 0.358]}
        />
        {/* Hammer Handle */}
        <mesh
          castShadow
          receiveShadow
          geometry={ nodes.HammerHandle.geometry }
          material={ materials.aqua }
          position={[0, 0.432, 0]}
          scale={[1, 0.285, 0.285]}
        />
      </group>
    </RigidBody>
  </group>
}
