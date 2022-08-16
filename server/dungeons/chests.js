import { generateRandomItemDef } from '../items/generator.js'
import { fillArray } from '../../game/utilFunctions.js'

const DEFAULTS = {
  name: 'Chest',
  level: 1,
  tier: 0,
  contents: {}
}

export function generateRandomChest(dungeonRun, options = {}){

  if(!dungeonRun.user.accomplishments.firstRunFinished){
    return
  }

  const chest = {
    ...DEFAULTS,
    contents: {},
    level: options.level || dungeonRun.floor,
    ...options
  }

  chest.contents.items = fillArray(() => {
    const val = Math.ceil(chest.level * Math.pow(Math.random(), 1.8))
    return generateRandomItemDef(val)
  }, chest.tier + 1)

  return chest
}

export function generateChest(contents, options = {}){
  return {
    ...DEFAULTS,
    contents,
    ...options
  }
}