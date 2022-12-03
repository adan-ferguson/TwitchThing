import { chooseRandomBasicItem } from '../items/generator.js'
import { toNumberOfDigits } from '../../game/utilFunctions.js'
import { geometricProgession } from '../../game/exponentialValue.js'

const GOLD_ONLY_CHANCE = 0.3
const GOLD_BASE = 10
const GOLD_GROWTH = 5
const GOLD_GROWTH_PCT = 0.12

const CHEST_SIZE = {
  normal: 1,
  boss: 5,
  shop: 5
}

export function generateRandomChest(options = {}){

  const chest = {
    name: 'Chest',
    type: 'normal', // 'normal' | 'boss' | 'shop'
    contents: {
      gold: 0,
      items: {
        basic: {}
      }
    },
    level: 1,
    noGold: false,
    singlesOnly: false,
    class: null,
    ...options
  }

  if(chest.type === 'shop'){
    chest.noGold = true
    chest.singlesOnly = true
  }

  for(let i = 0; i < CHEST_SIZE[chest.type]; i++){
    let valueRemaining = chest.level
    if(options.noGold || Math.random() > GOLD_ONLY_CHANCE){
      const baseType = chooseRandomBasicItem(chest.level, chest.class)
      const count = options.singlesOnly ? 1 : multiplyItem(valueRemaining, baseType.orbs)
      valueRemaining -= toValue(count, baseType.orbs)
      addItem(chest.items.basic, baseType.group, baseType.name, count)
    }
    if(!options.noGold){
      chest.contents.gold += addGold(valueRemaining)
    }
  }

  return chest
}

export function applyChestToUser(userDoc, chest){
  mergeBasicItems(chest.items.basic, userDoc.inventory.items.basic)
  function mergeBasicItems(source, target){
    for(let group in source){
      for(let name in source[group]){
        addItem(target, group, name, source[group][name])
      }
    }
  }
}

function addGold(valueRemaining){
  valueRemaining = Math.ceil(Math.random() * valueRemaining)
  const gold = GOLD_BASE + Math.ceil(geometricProgession(valueRemaining, GOLD_GROWTH_PCT, GOLD_GROWTH))
  return toNumberOfDigits(gold,2)
}

function multiplyItem(valueRemaining, itemLevel){
  let maxCount = 1
  while(toValue(maxCount + 1, itemLevel) < valueRemaining){
    maxCount++
  }
  return Math.max(1, Math.floor(Math.random() * maxCount))
}

function toValue(count, itemLevel){
  const baseVal = itemLevel * 4
  return baseVal * count + baseVal * count * (count - 1) / 4
}

function addItem(obj, group, name, count){
  if(!obj[group]){
    obj[group] = {}
  }
  if(!obj[group][name]){
    obj[group][name] = 0
  }
  obj[group][name] += count
}