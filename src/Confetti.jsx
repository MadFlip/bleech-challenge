import { InstancedRigidBodies } from '@react-three/rapier'
import { useMemo } from 'react'
import useGame from './stores/useGame'

export default function Confetti() {
    const gameEnded = useGame((state) => state.phase) === 'ended'
    const cubesCount = 25
    const pyramidsCount = 25
    const spheresCount = 25
    const scaleMin = 0.1
    const scaleMax = 0.2

    const cubeIntances = useMemo(() => {
        const instances = []
        for (let i = 0; i < cubesCount; i++) {
        instances.push({
            key: 'cube_' + i,
            position: [
            0.2,
            1,
            1],
            rotation: [
            Math.random(),
            Math.random(),
            Math.random(),
            ],
            scale: scaleMin + Math.random() * (scaleMax - scaleMin)
        })
        }

        return instances
    }, [])

    const pyramidIntances = useMemo(() => {
        const instances = []
        for (let i = 0; i < pyramidsCount; i++) {
        instances.push({
            key: 'pyramid_' + i,
            position: [
            0,
            1,
            1 ],
            rotation: [
            Math.random(),
            Math.random(),
            Math.random(),
            ],
            scale: scaleMin + Math.random() * (scaleMax - scaleMin)
        })
        }

        return instances
    }, [])


    const sphereIntances = useMemo(() => {
        const instances = []
        for (let i = 0; i < spheresCount; i++) {
        instances.push({
            key: 'sphere_' + i,
            position: [
            -0.2,
            1.2,
            1 ],
            rotation: [
            Math.random(),
            Math.random(),
            Math.random(),
            ],
            scale: scaleMin + Math.random() * (scaleMax - scaleMin)
        })
        }

        return instances
    }, [])

    if (!gameEnded) return null

    return (
        <group>

            <InstancedRigidBodies instances={ cubeIntances } restitution={ 1 }>
                <instancedMesh castShadow args={[ null, null, cubesCount ]} frustumCulled={false}>
                    <boxGeometry />
                    <meshPhongMaterial color="#ffffff" />
                </instancedMesh>
            </InstancedRigidBodies>

            <InstancedRigidBodies colliders='hull' instances={ pyramidIntances } restitution={ 1 }>
                <instancedMesh castShadow args={[ null, null, pyramidsCount ]} frustumCulled={false}>
                    <tetrahedronGeometry />
                    <meshPhongMaterial color="#1EBF99" />
                </instancedMesh>
            </InstancedRigidBodies>

            <InstancedRigidBodies colliders='ball' instances={ sphereIntances } restitution={ 1 }>
                <instancedMesh castShadow args={[ null, null, spheresCount ]} frustumCulled={false}>
                    <sphereGeometry />
                    <meshPhongMaterial color="#2B53E4" />
                </instancedMesh>
            </InstancedRigidBodies>
        </group>
    )
}
