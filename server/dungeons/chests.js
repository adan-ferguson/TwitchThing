import { generateRandomItemDef } from '../items/generator.js'
import { toNumberOfDigits } from '../../game/utilFunctions.js'
import { geometricProgession } from '../../game/exponentialValue.js'

const GOLD_CHANCE = 0.5
const GOLD_BASE = 10
const GOLD_GROWTH = 5
const GOLD_GROWTH_PCT = 0.12

const TYPE_TO_SIZE = {
  normal: 1,
  boss: 5
}

export function generateRandomChest(options = {}){

  const chest = {
    name: 'Chest',
    type: 'normal', // 'normal' | 'boss'
    contents: {
      gold: 0,
      items: []
    },
    level: 1,
    noGold: false,
    ...options
  }

  for(let i = 0; i < TYPE_TO_SIZE[chest.type]; i++){
    if(!options.noGold && Math.random() < GOLD_CHANCE){
      chest.contents.gold += addGold(chest.level)
    }else{
      chest.contents.items.push(generateRandomItemDef(chest.level))
    }
  }

  return chest
}

function addGold(level){
  const gold = GOLD_BASE + Math.ceil(geometricProgession(level - 1, GOLD_GROWTH_PCT, GOLD_GROWTH))
  return toNumberOfDigits(gold,2)
}