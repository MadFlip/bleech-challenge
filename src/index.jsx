import './style.scss'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'
import { KeyboardControls } from '@react-three/drei'
import Interface from './interface.jsx'
import { Suspense } from 'react'

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
  <KeyboardControls
    map={[
      { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
      { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
      { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
      { name: 'right', keys: ['ArrowRight', 'KeyD'] },
      { name: 'jump', keys: ['Space'] },
      { name: 'restartKey', keys: ['KeyR', 'Enter']}
    ]}>
    <Canvas
      shadows
      camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [ 2.5, 4, 6 ]
      }}>
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
    </Canvas>
    <Interface />
  </KeyboardControls>
)
