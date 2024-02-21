import { useKeyboardControls } from "@react-three/drei"
import useGame from "./stores/useGame"
import { useRef, useEffect, useState } from "react"
import { addEffect } from "@react-three/fiber"
import { audio, playAudio } from './Audio.jsx'

export default function Interface() {
  
    const restart = useGame((state) => state.restart)
    const phase = useGame((state) => state.phase)
    const altJump = useGame((state) => state.altJump)
    const altForward = useGame((state) => state.altForward)
    const altBackward = useGame((state) => state.altBackward)
    const altLeft = useGame((state) => state.altLeft)
    const altRight = useGame((state) => state.altRight)

    const forward = useKeyboardControls((state) => state.forward)
    const backward = useKeyboardControls((state) => state.backward)
    const left = useKeyboardControls((state) => state.left)
    const right = useKeyboardControls((state) => state.right)
    const jump = useKeyboardControls((state) => state.jump)
    const timer = useRef()
    const bestTime = useRef()
    const firstInteraction = useGame((state) => state.firstInteraction)
    const finishSound = useGame((state) => state.finishSound)
    const finishSoundPlayed = useGame((state) => state.finishSoundPlayed)
    const sound = useGame((state) => state.sound)
    const toggleSound = useGame((state) => state.toggleSound)

    // Play background sound, listen to sound on/off changes
    useEffect(() => {
      playAudio(audio.bg, 0.2, true, sound, false)
    }, [firstInteraction, sound])

    // Play finish sound, listen to sound on/off changes
    useEffect(() => {
      if (!finishSoundPlayed && finishSound) {
        playAudio(audio.bang, 1, false, sound)
        useGame.setState({ finishSoundPlayed: true })
      } else {
        playAudio(audio.bang, 0, false, sound)
      }
    }, [finishSound, sound])

    const handleJump = () => {
      useGame.setState({ altJump: true })

      setTimeout(() => {
        useGame.setState({ altJump: false })
      }, 100)
    }

    const moveForward = () => useGame.setState({ altForward: true })
    const stopForward = () => useGame.setState({ altForward: false })
    const moveLeft = () => useGame.setState({ altLeft: true })
    const stopLeft = () => useGame.setState({ altLeft: false })
    const moveRight = () => useGame.setState({ altRight: true })
    const stopRight = () => useGame.setState({ altRight: false })
    const moveBackward = () => useGame.setState({ altBackward: true })
    const stopBackward = () => useGame.setState({ altBackward: false })

    useEffect(() => {
      const unsubscribeEffect = addEffect(() => {
        const state = useGame.getState()
        let elapsedTime = 0

        if (state.phase === 'playing') {
          elapsedTime = (Date.now() - state.startTime)
        } else if (state.phase === 'ended') {
          elapsedTime = (state.endTime - state.startTime)
        }
        elapsedTime /= 1000
        elapsedTime = elapsedTime.toFixed(2)
        
        if (timer.current) {
          timer.current.textContent = elapsedTime
          // Update best time
          if (state.phase === 'ended' && (elapsedTime * 1 < state.bestTime * 1 || state.bestTime * 1 === 0)) {
            bestTime.current.textContent = `Best: ${elapsedTime}`
            useGame.setState({ bestTime: elapsedTime })
          }
        }
      })

      return () => {
        unsubscribeEffect()
      }
    }, [])

    return <div className="interface">
      <div className="time">
        <div className="time-best" ref={ bestTime }>Best: 0.00</div>
        <div className="time-active" ref={ timer }>0.00</div>
      </div>
      <div className="sound" onClick={() => toggleSound()}>
        sound
        <br />
        <span className={ sound ? 'sound-state sound-state--on' : 'sound-state sound-state--off' }>{sound ? 'on' : 'off'}</span>
      </div>
      {phase === 'ended' && <div className="restart" onClick={ restart }>Restart</div>}

      <div className="controls">
        <div className="left">
          <div className="row">
            <div className={`key ${forward || altForward ? 'active' : ''}`} 
              onTouchStart={moveForward}
              onTouchEnd={stopForward}
            >↑</div>
          </div>
          <div className="row">
            <div className={`key ${left||altLeft ? 'active' : ''}`} 
              onTouchStart={moveLeft}
              onTouchEnd={stopLeft}
            >←</div>
            <div className={`key ${backward || altBackward ? 'active' : ''}`}
              onTouchStart={moveBackward}
              onTouchEnd={stopBackward}
            >↓</div>
            <div className={`key ${right || altRight ? 'active' : ''}`}
              onTouchStart={moveRight}
              onTouchEnd={stopRight}
            >→</div>
          </div>
        </div>
        <div className="row right">
          <div className={`key large ${jump || altJump ? 'active' : ''}`}
            onTouchStart={handleJump}
          >Jump</div>
        </div>
      </div>
  </div>
}
