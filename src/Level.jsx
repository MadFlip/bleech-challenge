import * as THREE from 'three'
import { CuboidCollider, RigidBody, InstancedRigidBodies } from '@react-three/rapier'
import { useMemo, useRef, useState } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'
import { Text, Float, useGLTF } from '@react-three/drei'
import Confetti from './Confetti'

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const floor1Material = new THREE.MeshPhongMaterial({ color: '#65CEB5', toneMapped: false })
const floor2Material = new THREE.MeshPhongMaterial({ color: '#1EBF99', toneMapped: false })
const obstacleMaterial = new THREE.MeshPhongMaterial({ color: '#132BA8', toneMapped: false })
const wallMaterial = new THREE.MeshPhongMaterial({ color: '#2B53E4', toneMapped: false })

export function BlockStart ({ position = [0, 0, 0] }) {
  const isMobile = window.matchMedia('(max-width: 479px)').matches

  return <group position={ position }>
    {/* Floor */}
    <mesh geometry={ boxGeometry } material={ floor1Material } position-y={ -0.1 }
      scale={[ 4, 0.2, 4 ]} receiveShadow />

    <Float floatIntensity={ 0.25 } rotationIntensity={ 0.5 }>
      <Text 
        font='./fonts/bebas-neue-v9-latin-regular.woff'
        scale={ isMobile ? 0.2 : 0.25 }
        maxWidth={ 0.25 }
        lineHeight={ 0.95 }
        textAlign={isMobile ? 'center' : 'right'}
        position={isMobile ? [ 0, 0.92, 0.5 ] : [ 0.75, 0.75, 0 ]}
        rotation-y={ -0.25}
        >Rolling Rush
          <meshBasicMaterial toneMapped={ false } />
        </Text>
    </Float>
  </group>
}

export function BlockRockets ({ position = [0, 0, 0] }) {
  const obstacle = useRef()
  const rocketTail = useRef()
  const { nodes } = useGLTF('./obstacle-3.glb')
  const [ speed ] = useState(() => (Math.random() + 0.5) * (Math.random() < 0.5 ? -1 : 1))
  const rotationDirection = speed > 0 ? -1 : 1

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
      <mesh geometry={ boxGeometry } material={ floor2Material } position-y={ -0.1 }
        scale={[ 4, 0.2, 4 ]} receiveShadow />
    </RigidBody>
    {/* Obstacle  */}
    <RigidBody colliders={ false } ref={ obstacle } type="kinematicPosition" position={[ 0, 0.3, 0 ]} restitution={ 0.2 } friction={ 0 }>
      <group scale={1.25}>
        <group position={[1, 0, 0]} rotation={[0, Math.PI / 2 * rotationDirection, 0]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.rocketBody.geometry}
            material={obstacleMaterial}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.rocketNose.geometry}
            material={wallMaterial}
          />
          <mesh ref={ rocketTail }
            castShadow
            receiveShadow
            geometry={nodes.rocketTail.geometry}
            material={floor1Material}
          />
        </group>
        <group position={[-1, 0, 0]} rotation={[0, Math.PI / -2 * rotationDirection, 0]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.rocketBody.geometry}
            material={obstacleMaterial}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.rocketNose.geometry}
            material={wallMaterial}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.rocketTail.geometry}
            material={floor1Material}
          />
        </group>
      </group>
      <CuboidCollider args={[ 0.25, 0.25, 0.5 ]} position={[ 1.25, 0.25, 0 ]} />
      <CuboidCollider args={[ 0.25, 0.25, 0.5 ]} position={[ -1.25, 0.25, 0 ]} />
    </RigidBody>
  </group>
}

export function BlockHammer ({ position = [0, 0, 0] }) {
  const obstacle = useRef()
  const { nodes } = useGLTF('./obstacle-2.glb')
  const [ timeOffset ] = useState(() => Math.random() * Math.PI * 2)

  useFrame((state, delta) => {
    if (!obstacle.current) return
    const time = state.clock.getElapsedTime()
    const y = Math.sin(time * 2 + timeOffset) + 1.25
    obstacle.current.setNextKinematicTranslation({ x: position[0], y: position[1] + y / 2, z: position[2] })
    // rotate the obstacle a bit on z axis back and forth
    const euler = new THREE.Euler(0, 0, -Math.sin(time * 2 + timeOffset) * 0.25)
    const quaternion = new THREE.Quaternion().setFromEuler(euler)
    obstacle.current.setNextKinematicRotation(quaternion)
  })

  return <group position={ position }>
    {/* Floor */}
    <RigidBody type="fixed" restitution={ 0.2 } friction={ 0 }>
      <mesh geometry={ boxGeometry } material={ floor2Material } position-y={ -0.1 }
        scale={[ 4, 0.2, 4 ]} receiveShadow />
    </RigidBody>
    {/* Obstacle  */}
    <RigidBody ref={ obstacle } type="kinematicPosition" position={[ 0, 0.3, 0 ]} restitution={ 0.2 } friction={ 0 }>
      <group>
        {/* Hammer Head */}
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.HammerHead.geometry}
          material={obstacleMaterial}
          position={[-0.285, 0.501, 0]}
          rotation={[0, 0, -Math.PI / 2]}
          scale={[1, 0.427, 0.358]}
        />
        {/* Hammer Handle */}
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.HammerHandle.geometry}
          material={floor1Material}
          position={[0, 0.432, 0]}
          scale={[1, 0.285, 0.285]}
        />
      </group>
    </RigidBody>
  </group>
}

export function BlockAxe ({ position = [0, 0, 0] }) {
  const obstacle = useRef()
  const { nodes } = useGLTF('./obstacle-1.glb')
  const [ timeOffset ] = useState(() => Math.random() * Math.PI * 2)

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
      <mesh geometry={ boxGeometry } material={ floor2Material } position-y={ -0.1 }
        scale={[ 4, 0.2, 4 ]} receiveShadow />
    </RigidBody>
    {/* Obstacle  */}
    <RigidBody ref={ obstacle } type="kinematicPosition" position={[ 0, 0.3, 0 ]} restitution={ 0.2 } friction={ 0 }>
      <group scale={1.4}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.BlueSegment1.geometry}
          material={wallMaterial}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.DarkBlueSegment.geometry}
          material={obstacleMaterial}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.DownySegment.geometry}
          material={floor1Material}
        />
      </group>
    </RigidBody>
  </group>
}

export function BlockNarrowBridgeLeft ({ position = [0, 0, 0]}) {
  return <group position={ position }>
    {/* Floor */}
    <RigidBody type="fixed" restitution={ 0.2 } friction={ 0 }>
      <mesh geometry={ boxGeometry } material={ floor2Material }
        position-y={ -0.1 }
        position-x={ -1.5 }
        scale={[ 1, 0.2, 4 ]} receiveShadow />
    </RigidBody>
  </group>
}

export function BlockNarrowBridgeRight ({ position = [0, 0, 0]}) {
  return <group position={ position }>
    {/* Floor */}
    <RigidBody type="fixed" restitution={ 0.2 } friction={ 0 }>
      <mesh geometry={ boxGeometry } material={ floor2Material }
        position-y={ -0.1 }
        position-x={ 1.5 }
        scale={[ 1, 0.2, 4 ]} receiveShadow />
    </RigidBody>
  </group>
}

export function BlockNarrowBridgeCenter ({ position = [0, 0, 0]}) {
  return <group position={ position }>
    {/* Floor */}
    <RigidBody type="fixed" restitution={ 0.2 } friction={ 0 }>
      <mesh geometry={ boxGeometry } material={ floor2Material }
        position-y={ -0.1 }
        position-x={ 0 }
        scale={[ 1, 0.2, 4 ]} receiveShadow />
    </RigidBody>
  </group>
}

export function BlockEnd ({ position = [0, 0, 0] }) {
  const flyntRef = useRef()
  const matcapTexture = useLoader(TextureLoader, './matcaps/D07E3F_FBBD1F_8D2840_24120C-512px.png')
  const { nodes } = useGLTF('./flynt.glb')
  const flyntScale = 0.45

  useFrame((state, delta) => {
    flyntRef.current.rotation.y += delta * 0.5
  })


  return <group position={ position }>
    {/* Floor */}
    <RigidBody type="fixed" colliders={ false } restitution={ 0.2 } friction={ 0 }>
      <mesh geometry={ boxGeometry } material={ floor1Material } position-y={ -0.1 }
        scale={[ 4, 0.2, 4 ]} receiveShadow />
      {/* Floor Collider */}a
      <CuboidCollider args={[ 2, 0.1, 2 ]} position={[ 0, -0.1, 0 ]} />
      {/* Front Back Wall */}
      <CuboidCollider args={[ 2.1, 0.5, 0.1 ]} position={[ 0, 0.5, -2 ]} />
      {/* Left Invisible Wall */}
      <CuboidCollider args={[ 0.1, 0.5, 1.5 ]} position={[ -2.1, 0.5, -0.3 ]} />
      {/* Right Invisible Wall */}
      <CuboidCollider args={[ 0.1, 0.5, 1.5 ]} position={[ 2.1, 0.5, -0.3 ]} />
    </RigidBody>
    {/* Flynt */}
    <RigidBody type="fixed" colliders="hull" restitution={ 0.2 } friction={ 0 } position={[0, 1, 0]}>
      <Float floatIntensity={ 0.5 } rotationIntensity={ 0.2 }>
        <mesh ref={ flyntRef }
          castShadow
          receiveShadow
          geometry={nodes.Stone.geometry}
          scale={[1.3 * flyntScale, 2 * flyntScale, 1.5 * flyntScale]}>
          <meshMatcapMaterial matcap={matcapTexture}  toneMapped={ false }/>
        </mesh>
      </Float>
    </RigidBody>
    <Text 
      font='./fonts/bebas-neue-v9-latin-regular.woff'
      scale={ 1 }
      maxWidth={ 0.25 }
      lineHeight={ 0.75 }
      textAlign='right'
      position={[ 0, 2.5, 0 ]}
      rotation-y={ -0.25}
      >FINISH
        <meshBasicMaterial toneMapped={ false } />
    </Text>
    <Confetti />
  </group>
}

export function Bounds({ length = 1 }) {
  return <>
    <RigidBody type="fixed" restitution={ 0.2 } friction={ 0 }>
      {/* Right Wall */}
      {/* <mesh geometry={ boxGeometry } material={ wallMaterial } position={[ 2.15, 0.75, -(length * 2) + 2 ]}
        scale={[ 0.3, 1.5, 4 * length ]} receiveShadow castShadow /> */}
      {/* Left Wall */}
      {/* <mesh geometry={ boxGeometry } material={ wallMaterial } position={[ -2.15, 0.75, -(length * 2) + 2 ]}
        scale={[ 0.3, 1.5, 4 * length ]} receiveShadow /> */}
      {/* Finish Wall */}
      {/* <mesh geometry={ boxGeometry } material={ wallMaterial } position={[ 0, 0.75, -(length * 4) + 2 ]}
        scale={[ 4, 1.5, 0.3 ]} receiveShadow castShadow /> */}
      {/* Floor Collider */}
      <CuboidCollider
        args={[ 2, 0.1, 2 * 1 ]}
        position={[0, -0.1, 0]}
        restitution={ 0.2 }
        friction={ 1 }
      />
    </RigidBody>
  </>
}

export function Level({ count = 5, types = [ 
    BlockHammer,
    BlockNarrowBridgeLeft,
    BlockNarrowBridgeRight,
    BlockNarrowBridgeCenter,
    BlockRockets,
    BlockAxe
  ], seed = 0}) {
  const blocks = useMemo(() => {
    const blocks = []

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)]
      blocks.push(type)
    }
    return blocks
  }, [ count, types, seed])

  return <>
    <BlockStart position={[0, 0, 0]} />
    {blocks.map((Block, index) => {
      return <Block key={index} position={[0, 0, -(index + 1) * 4 ]} />
    })}
    <BlockEnd position={[0, 0, -(count + 1) * 4]} />
    <Bounds length={count + 2} />
  </>
}
