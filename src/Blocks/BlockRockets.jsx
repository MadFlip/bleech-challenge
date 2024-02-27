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
      {/* Rocket Nose */}
      <Instances range={ 2 } geometry={ nodes.rocketNose.geometry }   material={ materials.blueLight }>
        <Instance position={[1, 0, 0]} rotation={[0, Math.PI / 2 * rotationDirection, 0]}/>
        <Instance position={[-1, 0, 0]} rotation={[0, Math.PI / -2 * rotationDirection, 0]}/>
      </Instances>
      {/* Rocket Body */}
      <Instances range={ 2 } geometry={ nodes.rocketBody.geometry }   material={ materials.blue }>
        <Instance position={[1, 0, 0]} rotation={[0, Math.PI / 2 * rotationDirection, 0]}/>
        <Instance position={[-1, 0, 0]} rotation={[0, Math.PI / -2 * rotationDirection, 0]}/>
      </Instances>
      {/* Rocket Tail */}
      <Instances range={ 2 } geometry={ nodes.rocketTail.geometry }   material={ materials.aqua }>
        <Instance position={[1, 0, 0]} rotation={[0, Math.PI / 2 * rotationDirection, 0]}/>
        <Instance position={[-1, 0, 0]} rotation={[0, Math.PI / -2 * rotationDirection, 0]}/>
      </Instances>
    </group>
    <CuboidCollider args={[ 0.25, 0.25, 0.5 ]} position={[ 1.25, 0.25, 0 ]} />
    <CuboidCollider args={[ 0.25, 0.25, 0.5 ]} position={[ -1.25, 0.25, 0 ]} />
  </RigidBody>
</group>
}
