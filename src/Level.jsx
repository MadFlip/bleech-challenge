import { useMemo } from 'react'
import Bumpers from './Bumpers.jsx'
import BlockStart from './Blocks/BlockStart.jsx'
import BlockEnd from './Blocks/BlockEnd.jsx'
import BlockHammer from './Blocks/BlockHammer.jsx'
import BlockRockets from './Blocks/BlockRockets.jsx'
import BlockRoller from './Blocks/BlockRoller.jsx'
import BlockBridge from './Blocks/BlockBridge.jsx'

export function Level({ count = 5, types = [
  BlockHammer,
  BlockRoller,
  BlockBridge,
  BlockRockets,
  BlockBridge
  ], seed = 0}) {
  const blocks = useMemo(() => {
    const blocks = []

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)]
      blocks.push(type)
    }
    return blocks
  }, [ count, types, seed])

  return <>
    <Bumpers />
    <BlockStart position={[0, 0, 0]}/>
    {blocks.map((Block, index) => {
      return <Block key={index} position={[0, 0, -(index + 1) * 4 ]}/>
    })}
    <BlockEnd position={[0, 0, -(count + 1) * 4]}/>
  </>
}
