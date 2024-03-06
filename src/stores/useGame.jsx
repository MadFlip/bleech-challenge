import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export default create(subscribeWithSelector((set) => {
  const url = new URL(window.location.href)
  const level = url.searchParams.get('level')
  const score = url.searchParams.get('score')
  let levelBlocks = []
  let levelLimit = 20

  if (level) {
    const levelSanitized = level.replace(/[^A-F]/g, '')
    levelBlocks = levelSanitized.split('').slice(0, levelLimit)
    // trim url if it's too long
    if (levelBlocks.length < level.length) {
      url.searchParams.set('level', levelBlocks.join(''))
      window.history.replaceState({}, '', url)
    }
  }

  let scoreSanitized = '0.00'
  if (score) {
    scoreSanitized = score.replace(/[^0-9]/g, '')
    // convert to seconds and 2 decimal places
    scoreSanitized = (scoreSanitized / 1000).toFixed(2)
    // limit max length to 6
    if (scoreSanitized.length > 6) {
      scoreSanitized = scoreSanitized.slice(0, 6)
    }
  }

  return {
    blocksCount: level && levelBlocks.length ? levelBlocks.length : 12,
    blocksSeed: 0,
    level: level && levelBlocks.length ? levelBlocks : null,
    difficulty: 'normal',
      toggleDifficulty: () => {
      set((state) => {
        if (state.difficulty === 'normal') return { difficulty: 'hard' }
        if (state.difficulty === 'hard') return { difficulty: 'easy' }
        return { difficulty: 'normal' }
      })
    },
    health: 100,
    decreaseHealth:
    (value) => {
      set((state) => {
        if (state.difficulty === 'hard') return { health: state.health - value }
        return {}
      })
    },

    // Time
    startTime: 0,
    endTime: 0,
    bestTime: scoreSanitized,

    // Sounds control
    sound: false,
    firstInteraction: false,
    finishSound: false,
    finishSoundPlayed: false,
    toggleSound: () => set((state) => ({ sound: !state.sound })),

    // Phases
    phase: 'ready',
    start: () => {
      set((state) => {
        if (state.phase === 'ready') return { phase: 'playing', startTime: Date.now(), firstInteraction: true }
        return {}
      })
    },
    restart: () => {
      set((state) => {
        if (state.phase === 'playing' || state.phase === 'ended') return { phase: 'ready', blocksSeed: Math.random(), finishSound: false, finishSoundPlayed: false, health: 100 }
        return {}
      })
    },
    end: () => {
      set((state) => {
        if (state.phase === 'playing') return { phase: 'ended', endTime: Date.now(), finishSound: true}
        return {}
      })
    },

    // Mobile controls
    altForward: false,
    altBackward: false,
    altLeft: false,
    altRight: false,
    altJump: false,
  }
}))
