import { useFrame, useLoader } from "@react-three/fiber";
import { RigidBody, useRapier } from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import useGame from "./stores/useGame";

export function Player() {
  const [ subscribeKeys, getKeys] = useKeyboardControls()
  const body = useRef()
  const { rapier, world } = useRapier()
  const [ smoothedCameraPosition ] = useState(() => new THREE.Vector3(10, 10, 10))
  const [ smoothedCameraTarget ] = useState(() => new THREE.Vector3())

  const matcapTexture = useLoader(THREE.TextureLoader, './matcaps/DEE3E8_A6AEB5_BCC4CC_BCC4C4-512px.png')
  

  const start = useGame((state) => state.start)
  const end = useGame((state) => state.end)
  const blocksCount = useGame((state) => state.blocksCount)
  const restart = useGame((state) => state.restart)

  const jump = () => {
    const origin = body.current.translation()
    origin.y -= 0.31
    const direction = { x: 0, y: -1, z: 0 }
    const ray = new rapier.Ray(origin, direction)
    const hit = world.castRay(ray, 10, true)

    if (hit.toi < 0.15) {
      body.current.applyImpulse({ x: 0, y: 0.5, z: 0 })
    }
  }

  const reset = () => {
    body.current.setTranslation({ x: 0, y: 1, z: 0 })
    body.current.setLinvel({ x: 0, y: 0, z: 0 })
    body.current.setAngvel({ x: 0, y: 0, z: 0 })
  }

  useEffect(() => {
    const unsubscribeReset = useGame.subscribe(
      (state) => state.phase,
      (value) =>{
        if (value === 'ready') reset()
      }
    )

    const unsubscribeJump = subscribeKeys(
      (state) => state.jump,
      (value) => {
        if (value) jump()
      }
    )

    const unsubscribeAnyKey = subscribeKeys(() => {
      start()
    })

    return () => {
      unsubscribeReset()
      unsubscribeJump()
      unsubscribeAnyKey()
    }
  }, [])

  useFrame((state, delta) => {
    //  Keyboard controls of the player
    const { forward, backward, left, right } = getKeys()
    const impulse = { x: 0, y: 0, z: 0 }
    const torque = { x: 0, y: 0, z: 0 }

    const impulseStrength = 0.6 * delta
    const torqueStrength = 0.2 * delta

    if (forward) {
      impulse.z -= impulseStrength
      torque.x -= torqueStrength
    }
    
    if (backward) {
      impulse.z += impulseStrength
      torque.x += torqueStrength
    }

    if (left) {
      impulse.x -= impulseStrength
      torque.z += torqueStrength
    }

    if (right) {
      impulse.x += impulseStrength
      torque.z -= torqueStrength
    }

    body.current.applyImpulse(impulse)
    body.current.applyTorqueImpulse(torque)
  
    // Move Camera with the player
    const bodyPosition = body.current.translation()
    const cameraPosition = new THREE.Vector3()
    cameraPosition.copy(bodyPosition)
    cameraPosition.y += 0.65
    cameraPosition.z += 2.25

    const cameraTarget = new THREE.Vector3()
    cameraTarget.copy(bodyPosition)
    cameraTarget.y += 0.25

    smoothedCameraPosition.lerp(cameraPosition, 5 * delta)
    smoothedCameraTarget.lerp(cameraTarget, 5 * delta)

    state.camera.position.copy(smoothedCameraPosition)
    state.camera.lookAt(smoothedCameraTarget)

    // Phases
    // reach the end of the level
    if (bodyPosition.z < -(blocksCount * 4 + 2)) {
      end()
    }

    // if the player falls
    if (bodyPosition.y < -4) {
      restart()
    }
  })

  return <RigidBody ref={ body } 
    canSleep={ false } 
    colliders="ball" 
    restitution={ 0.5 }
    linearDamping={ 0.5 }
    angularDamping={ 0.5 }
    friction={ 1 } 
    position={[ 0, 1, 0]}>
    <mesh castShadow>
      <icosahedronGeometry args={[0.3, 4]} />
      <meshMatcapMaterial matcap={ matcapTexture } 
        flatShading 
        toneMapped={ false } />
    </mesh>
  </RigidBody>
}
