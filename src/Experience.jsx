import { OrbitControls } from '@react-three/drei'
import Lights from './Lights.jsx'
import { Level } from './Level.jsx'
import { Player } from './Player.jsx'
import { Physics } from '@react-three/rapier'
import useGame from './stores/useGame.jsx'
import { Noise, ToneMapping, EffectComposer, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

export default function Experience()
{
    const blocksCount = useGame((state) => state.blocksCount)
    const blocksSeed = useGame((state) => state.blocksSeed)
    const isMobile = window.matchMedia('(max-width: 767px)').matches
        return <>
        <EffectComposer disableNormalPass>
          {/* <Noise
            opacity={0.2} // Amount of noise
            blendFunction={BlendFunction.MULTIPLY} // blend mode
            /> */}
          {!isMobile && <ChromaticAberration
            blendFunction={BlendFunction.NORMAL} // blend mode
            offset={[0.0015, 0.0015]} // color offset
            opacity={1} // Amount of chromatic aberration
            /> }
          <ToneMapping />
        </EffectComposer>
        <OrbitControls makeDefault />
        <color attach="background" args={['#0B1E81']} />
        <fog attach="fog" args={['#0B1E81',1, 80]} />
        <Physics debug = { 0 }>
          <Lights />
          <Level count={ blocksCount } seed={ blocksSeed } />
          <Player />
        </Physics>
    </>
}
