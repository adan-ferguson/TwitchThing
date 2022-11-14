import { generateRandomItemDef } from '../items/generator.js'
import { toNumberOfDigits } from '../../game/utilFunctions.js'
import { geometricProgession } from '../../game/exponentialValue.js'

const DEFAULTS = {
  name: 'Chest',
  level: 1,
  size: 1,
  contents: {}
}

const GOLD_CHANCE = 0.5
const GOLD_BASE = 10
const GOLD_GROWTH = 5
const GOLD_GROWTH_PCT = 0.12

export function generateRandomChest(dungeonRun, options = {}){

  if(!dungeonRun.user.accomplishments.firstRunFinished){
    return
  }

  const chest = {
    ...DEFAULTS,
    contents: {
      gold: 0,
      items: []
    },
    level: options.level || dungeonRun.floor,
    ...options
  }

  for(let i = 0; i < chest.size; i++){
    if(Math.random() < GOLD_CHANCE){
      chest.contents.gold += addGold(chest.level)
    }else{
      chest.contents.items.push(generateRandomItemDef(chest.level))
    }
  }

  return chest
}

export function generateChest(contents, options = {}){
  return {
    ...DEFAULTS,
    contents,
    ...options
  }
}

function addGold(level){
  const gold = GOLD_BASE + Math.ceil(geometricProgession(level - 1, GOLD_GROWTH_PCT, GOLD_GROWTH))
  return toNumberOfDigits(gold,2)
}