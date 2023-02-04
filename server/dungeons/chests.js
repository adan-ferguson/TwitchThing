import { chooseRandomBasicItem, getItemRarity } from '../items/generator.js'
import { toNumberOfDigits } from '../../game/utilFunctions.js'
import { geometricProgession } from '../../game/growthFunctions.js'

const GOLD_BASE = 20
const GOLD_GROWTH = 4
const GOLD_GROWTH_PCT = 0.03

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
    multipleItems: false,
    class: null,
    itemLimit: 1,
    ...options
  }

  if(chest.type === 'shop'){
    chest.noGold = true
    chest.itemLimit = 10
  }

  if(chest.type === 'tutorial'){
    chest.noGold = true
  }

  if(chest.type === 'boss'){
    chest.itemLimit = 5
    chest.value *= 3
    chest.contents.gold = addGold(chest.level)
  }

  let valueRemaining = chest.level * chest.value
  let items = 0
  while(valueRemaining > 0 && items < chest.itemLimit){
    // tutorial chests drop more fighter items
    const chestClass = chest.class ?? (chest.type === 'tutorial' && Math.random() > 0.75 ? 'fighter' : null)
    const baseType = chooseRandomBasicItem(valueRemaining, chestClass)
    addItem(chest.contents.items.basic, baseType.group, baseType.name)
    valueRemaining -= getItemRarity(baseType.rarity).value
    if(!chest.multipleItems){
      break
    }
    items++
  }

  if(valueRemaining){
    chest.contents.gold += addGold(valueRemaining)
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

function addItem(obj, group, name){
  if(!obj[group]){
    obj[group] = {}
  }
  if(!obj[group][name]){
    obj[group][name] = 0
  }
  obj[group][name] += 1
}