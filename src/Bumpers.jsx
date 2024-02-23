import { InstancedRigidBodies } from '@react-three/rapier'
import { useMemo, useRef } from 'react'
import useGame from './stores/useGame'
import { Instance, Instances} from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
// #65CEB5
// #2B53E4
export default function Bumpers() {
    const blocksCount = useGame((state) => state.blocksCount)
    const bumpersOn = useGame((state) => state.bumpersOn)
    const bumpersCount = 2
    const bumperLegsCount = 2 * bumpersCount * blocksCount
    const bumperOffset = 2.1
    const bumpersLegs = useRef()
    const rigidBumpers = useRef()
    const bumpersGroup = useRef()

    const bumperIntances = useMemo(() => {
        const instances = []
        for (let i = 0; i < bumpersCount; i++) {
        instances.push({
            key: 'bumper_' + i,
            // position first on the -2 and second on the 2
            position: [i % 2 === 0 ? bumperOffset * -1 : bumperOffset, -0.8, blocksCount * 4 / -2 - 2],
        })
        }

        return instances
    }, [])

    // position instanced mesh position on left and right of the bumpers
    const bumperLegsPosition = useMemo(() => {
        const positions = []
        for (let i = 0; i < bumperLegsCount; i++) {
        positions.push([
            i % 2 === 0 ? (bumperOffset + 0.1) * -1 : bumperOffset + 0.1,
            -1.05,
            // evently distribute the legs from the end to start of the bumper Z axis
            blocksCount * -4 / 2 + (i % 2 === 0 ? i : i - 1) - blocksCount * 2 - 1
        ])
        }
        return positions
    }, [])

    useFrame((state, delta) => {
        bumpersLegs.current.position.y = !bumpersOn ? Math.max(bumpersLegs.current.position.y - delta * 0.5, 0) : Math.min(bumpersLegs.current.position.y + delta * 0.5, 1)
        
        // when animation is done, set visible to false
        bumpersLegs.current.position.y === 0 ?  bumpersGroup.current.visible = false :  bumpersGroup.current.visible = true

        const y = bumpersLegs.current.position.y - 0.75
        rigidBumpers.current.map((instance, index) => {
            instance.setTranslation({ x: instance.translation().x, y, z: instance.translation().z })
        })
        
    })
    

    return (
        <group ref={ bumpersGroup }>
            <InstancedRigidBodies ref={ rigidBumpers } type="fixed" instances={ bumperIntances } restitution={ 1 }>
                <instancedMesh args={[ null, null, bumpersCount ]}>
                    <boxGeometry args={[ 0.1, 0.1, 4 * blocksCount ]} />
                    <meshPhongMaterial color="#2B53E4"/>
                </instancedMesh>
            </InstancedRigidBodies>
            <Instances ref={ bumpersLegs }>
                <boxGeometry args={[ 0.1, 0.5, 0.1 ]} />
                <meshPhongMaterial color="#fff"/>
                {bumperLegsPosition.map((position, index) => (
                    <Instance key={index} position={position} />
                ))}
            </Instances>
        </group>
    )
}
