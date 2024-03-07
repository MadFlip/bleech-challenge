import { useMemo } from 'react'
import Bumpers from './Bumpers.jsx'
import BlockStart from './Blocks/BlockStart.jsx'
import BlockEnd from './Blocks/BlockEnd.jsx'
import BlockHammer from './Blocks/BlockHammer.jsx'
import BlockRockets from './Blocks/BlockRockets.jsx'
import BlockRoller from './Blocks/BlockRoller.jsx'
import BlockBridge from './Blocks/BlockBridge.jsx'
import useGame from './stores/useGame.jsx'

export function Level({ count = 5, types = [
  BlockHammer,
  BlockRoller,
  BlockBridge,
  BlockRockets,
  BlockBridge
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
          blocks.push(BlockBridge)
        } else if (letter === 'E') {
          blocks.push(BlockBridge)
        } else if (letter === 'F') {
          blocks.push(BlockBridge)
        }
      })
    } else {
      for (let i = 0; i < count; i++) {
        const type = types[Math.floor(Math.random() * types.length)]
        blocks.push(type)
      }
    }
    
    return blocks
  }, [ count, types, seed])

  return <>
    <Bumpers />
    <BlockStart position={[0, 0, 0]}/>
    {blocks.map((Block, index) => {
      return <Block key={index} position={[0, 0, -(index + 1) * 4 ]}
        alignment={ level ? (level[index] === 'E' ? 'left' : level[index] === 'F' ? 'right' : 'center') : 'random' }
      />
    })}
    <BlockEnd position={[0, 0, -(count + 1) * 4]}/>
  </>
}
