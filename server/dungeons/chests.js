import { generateRandomItemDef } from '../items/generator.js'
import { fillArray } from '../../game/utilFunctions.js'

export function generateRandomChest(dungeonRun, options = {}){

  if(!dungeonRun.user.accomplishments.firstRunFinished){
    return
  }

  const contents = {}
  const level = options.level || dungeonRun.floor
  const tier = options.tier || 0

  contents.items = fillArray(() => {
    const val = Math.ceil(level * Math.pow(Math.random(), 1.5))
    return generateRandomItemDef(val)
  }, tier + 1)

  return generateChest(contents, { ...options, level })
}

export function generateChest(contents, options = {}){
  return {
    contents,
    name: 'Chest',
    level: 1,
    tier: 1,
    ...options
  }
}