import { Instance, Instances, useGLTF } from '@react-three/drei'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { useRef, useState } from 'react'
import useGame from '../stores/useGame'
import { useFrame } from '@react-three/fiber'
import { audio, playAudio } from '../Audio'
import * as THREE from 'three'
import { boxGeometry, materials } from '../Materials'

export default function BlockRockets ({ position = [0, 0, 0] }) {
  const obstacle = useRef()
  const rocketTail = useRef()
  const { nodes } = useGLTF('./obstacle-3.glb')
  const [ speed ] = useState(() => (Math.random() + 0.5) * (Math.random() < 0.5 ? -1 : 1))
  const rotationDirection = speed > 0 ? -1 : 1
  const sound = useGame((state) => state.sound)

  useFrame((state, delta) => {
    if (!obstacle.current) return
    const time = state.clock.getElapsedTime()
    const euler = new THREE.Euler(0, time * speed, 0)
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
  <RigidBody 
    colliders={ false } 
    ref={ obstacle } type="kinematicPosition" 
    position={[ 0, 0.3, 0 ]} restitution={ 0.2 }
    friction={ 0 }
    onCollisionEnter={ () => playAudio(audio.hit, 0.75, false, sound)}
    >
    <group scale={1.25}>
      <group position={[1, 0, 0]} rotation={[0, Math.PI / 2 * rotationDirection, 0]}>
        {/* Rocket Body */}
        <mesh
          castShadow
          receiveShadow
          geometry={ nodes.rocketBody.geometry }
          material={ materials.blue }
        />
        {/* Rocket Head */}
        <mesh
          castShadow
          receiveShadow
          geometry={ nodes.rocketNose.geometry }
          material={ materials.blueLight }
        />
        {/* Rocket Tail */}
        <mesh ref={ rocketTail }
          castShadow
          receiveShadow
          geometry={ nodes.rocketTail.geometry }
          material={ materials.aqua }
        />
      </group>
      <group position={[-1, 0, 0]} rotation={[0, Math.PI / -2 * rotationDirection, 0]}>
        {/* Rocket Body */}
        <mesh
          castShadow
          receiveShadow
          geometry={ nodes.rocketBody.geometry }
          material={ materials.blue }
        />
        {/* Rocket Head */}
        <mesh
          castShadow
          receiveShadow
          geometry={ nodes.rocketNose.geometry }
          material={ materials.blueLight }
        />
        {/* Rocket Tail */}
        <mesh ref={ rocketTail }
          castShadow
          receiveShadow
          geometry={ nodes.rocketTail.geometry }
          material={ materials.aqua }
        />
      </group>
    </group>
    <CuboidCollider args={[ 0.25, 0.25, 0.5 ]} position={[ 1.25, 0.25, 0 ]} />
    <CuboidCollider args={[ 0.25, 0.25, 0.5 ]} position={[ -1.25, 0.25, 0 ]} />
  </RigidBody>
</group>
}
