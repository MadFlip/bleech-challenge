import { Environment, Grid, OrbitControls } from '@react-three/drei'
import Lights from './Lights.jsx'
import { Level } from './Level.jsx'
import { Player } from './Player.jsx'
import { Physics } from '@react-three/rapier'
import useGame from './stores/useGame.jsx'
import { Noise, ToneMapping, EffectComposer } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { TextureLoader } from 'three'
import { useLoader } from '@react-three/fiber'

export default function Experience()
{
    const blocksCount = useGame((state) => state.blocksCount)
    const blocksSeed = useGame((state) => state.blocksSeed)
    // const matcapTexture = useLoader(TextureLoader, './matcaps/046363_0CC3C3_049B9B_04ACAC-512px.png')

    return <>
        <EffectComposer disableNormalPass>  
          {/* <Bloom 
              intensity={ 0.1 }
              mipmapBlur 
              luminanceThreshold={ 0 } /> */}
          {/* <Noise 
            opacity={ 0.5 } 
            blendFunction={BlendFunction.DARKEN}
            /> */}
          <ToneMapping />
        </EffectComposer>
        <OrbitControls makeDefault />
        <color attach="background" args={['#0B1E81']} />
        {/* <fog attach="fog" args={['#0B1E81',1, 60]} /> */}
        <Physics debug = { 0 }>
          <Lights />
          <Level count={ blocksCount } seed={ blocksSeed } />
          <Player />
        </Physics>
        {/* <Grid infiniteGrid={ true } position-y={ -2 }/> */}
        {/* <mesh scale={50} position={[0, -65, -(blocksCount) * 4 ]}> 
          <icosahedronGeometry args={[1, 6]} />
          <meshMatcapMaterial matcap={matcapTexture} flatShading 
        toneMapped={ false }/> 
        </mesh> */}
    </>
}
