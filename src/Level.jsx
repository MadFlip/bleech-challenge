import { useEffect, useMemo } from 'react'
import Bumpers from './Bumpers.jsx'
import BlockStart from './Blocks/BlockStart.jsx'
import BlockEnd from './Blocks/BlockEnd.jsx'
import BlockHammer from './Blocks/BlockHammer.jsx'
import BlockRockets from './Blocks/BlockRockets.jsx'
import BlockRoller from './Blocks/BlockRoller.jsx'
import BlockBridgeLeft from './Blocks/BlockBridgeLeft.jsx'
import BlockBridgeRight from './Blocks/BlockBridgeRight.jsx'
import BlockBridgeCenter from './Blocks/BlockBridgeCenter.jsx'
import useGame from './stores/useGame.jsx'

export function Level({ count = 6, types = [
  BlockHammer,
  BlockRoller,
  BlockRockets,
  BlockBridgeLeft,
  BlockBridgeRight,
  BlockBridgeCenter
], seed = 0}) {
  const level = useGame((state) => state.level)
  const blocks = useMemo(() => {
    const blocks = []
    if (level) {
      level.forEach((letter, index) => {
        if (letter === 'A') {
          blocks.push(BlockHammer)
        } else if (letter === 'B') {
          blocks.push(BlockRoller)
        } else if (letter === 'C') {
          blocks.push(BlockRockets)
        } else if (letter === 'D') {
          blocks.push(BlockBridgeLeft)
        } else if (letter === 'E') {
          blocks.push(BlockBridgeCenter)
        } else if (letter === 'F') {
          blocks.push(BlockBridgeRight)
        }
      })
    } else {
      for (let i = 0; i < count; i++) {
        const type = types[Math.floor(Math.random() * types.length)]
        blocks.push(type)
      }
    }

    return blocks
  }, [ count, types, seed ])

  let currentLevel = []
  const setLevelCode = useGame((state) => state.setLevelCode)
  useEffect(() => {
    // go through the blocks and add the letter to the level
    blocks.forEach((Block, index) => {
      if (Block === BlockHammer) {
        currentLevel.push('A')
      } else if (Block === BlockRoller) {
        currentLevel.push('B')
      } else if (Block === BlockRockets) {
        currentLevel.push('C')
      } else if (Block === BlockBridgeLeft) {
        currentLevel.push('D')
      } else if (Block === BlockBridgeCenter) {
        currentLevel.push('E')
      } else if (Block === BlockBridgeRight) {
        currentLevel.push('F')
      }
    })
    setLevelCode(currentLevel.join(''))
  }, [seed])

  return <>
    <Bumpers />
    <BlockStart position={[0, 0, 0]}/>
    {blocks.map((Block, index) => {
      return <Block key={index} position={[0, 0, -(index + 1) * 4 ]} />
    })}
    <BlockEnd position={[0, 0, -(count + 1) * 4]}/>
  </>
}
