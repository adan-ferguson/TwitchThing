import { chooseRandomBasicItem } from '../items/generator.js'
import { toNumberOfDigits } from '../../game/utilFunctions.js'
import { geometricProgession } from '../../game/growthFunctions.js'

const GOLD_ONLY_CHANCE = 0.33
const GOLD_BASE = 20
const GOLD_GROWTH = 5
const GOLD_GROWTH_PCT = 0.15

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

  if(chest.type === 'boss'){
    // Guarantee 100 from boss chests so they can buy adv slot
    chest.contents.gold += 100
  }

  for(let i = 0; i < CHEST_SIZE[chest.type]; i++){
    let valueRemaining = chest.level
    if(chest.noGold || Math.random() > GOLD_ONLY_CHANCE){
      const baseType = chooseRandomBasicItem(chest.level, chest.class)
      const count = chest.singlesOnly ? 1 : multiplyItem(valueRemaining, baseType.orbs)
      valueRemaining -= toValue(count, baseType.orbs)
      addItem(chest.contents.items.basic, baseType.group, baseType.name, count)
    }
    if(!chest.noGold && valueRemaining > 0){
      chest.contents.gold += addGold(valueRemaining)
    }
  }

  return chest
}

export function applyChestToUser(userDoc, chest){
  mergeBasicItems(chest.contents.items.basic, userDoc.inventory.items.basic)
  if(chest.contents.gold){
    userDoc.inventory.gold += chest.contents.gold
  }
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
  const gold = GOLD_BASE + Math.ceil(geometricProgession(GOLD_GROWTH_PCT, valueRemaining, GOLD_GROWTH))
  return toNumberOfDigits(gold,2)
}

function multiplyItem(valueRemaining, itemLevel){
  let maxCount = 1
  while(toValue(maxCount + 1, itemLevel) < valueRemaining){
    maxCount++
  }
  return Math.max(1, Math.round(Math.random() * maxCount))
}

function toValue(count, itemLevel){
  const baseVal = itemLevel * 5
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