import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export default create(subscribeWithSelector((set) => {
  return {
    blocksCount: 12,
    blocksSeed: 0,
    bumpersOn: false,
    toggleBumpers: () => set((state) => ({ bumpersOn: !state.bumpersOn })),

    // Time
    startTime: 0,
    endTime: 0,
    bestTime: 0,

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
        if (state.phase === 'playing' || state.phase === 'ended') return { phase: 'ready', blocksSeed: Math.random(), finishSound: false, finishSoundPlayed: false}
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
