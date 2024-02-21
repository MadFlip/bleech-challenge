const audio = {
  bg: new Audio('./audio/bg-full.mp3'),
  hit: new Audio('./audio/soft-hit.mp3'),
  bang: new Audio('./audio/bang.mp3'),
  jump: new Audio('./audio/jump.mp3')
}


function playAudio(audio, volume = 1, loop = false, sound = true, fromStart = true) {
    if (sound) {
      if (fromStart) {
        audio.currentTime = 0 
      }
      audio.volume = volume
      audio.loop = loop
      audio.play()
    } else audio.pause()
  }

  export { audio, playAudio }
