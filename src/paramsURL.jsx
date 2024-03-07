const url = new URL(window.location.href)
const level = url.searchParams.get('level')
const score = url.searchParams.get('score')
let levelBlocks = []
let levelLimit = 14

function decryptScore(score) {
  // Decode the base64 score and then convert it back to a number
  return parseInt(atob(score), 10);
}

if (level) {
  const levelSanitized = level.replace(/[^A-F]/g, '')
  // trim url if it's too long
  levelBlocks = levelSanitized.split('').slice(0, levelLimit)
  if (levelBlocks.length < level.length) {
    url.searchParams.set('level', levelBlocks.join(''))
    window.history.replaceState({}, '', decodeURIComponent(url))
  }
}

let scoreSanitized = '0.00'
if (score) {
  const decryptedScore = decryptScore(score).toString()
  scoreSanitized = decryptedScore.replace(/[^0-9]/g, '')
  // convert to seconds and 2 decimal places
  scoreSanitized = (scoreSanitized / 1000).toFixed(2)
  // limit max length to 6 characters
  if (scoreSanitized.length > 6) {
    scoreSanitized = scoreSanitized.slice(0, 6)
  }
}

export { level, levelBlocks, scoreSanitized }
