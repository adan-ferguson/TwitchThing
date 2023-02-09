import { chooseRandomBasicItem, getItemRarity } from '../items/generator.js'
import { toNumberOfDigits } from '../../game/utilFunctions.js'
import { geometricProgession } from '../../game/growthFunctions.js'

const GOLD_BASE = 20
const GOLD_GROWTH = 10
const GOLD_GROWTH_PCT = 0.01

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
    value: 1,
    noGold: false,
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

  const totalValue = chest.level * chest.value
  let valueRemaining = totalValue
  let items = []
  while(valueRemaining > 0){
    // tutorial chests drop more fighter items
    const chestClass = chest.class ?? (chest.type === 'tutorial' && Math.random() > 0.75 ? 'fighter' : null)
    const baseType = chooseRandomBasicItem(valueRemaining, chestClass)
    items.push(baseType)
    valueRemaining -= getItemRarity(baseType.rarity).value
  }

  if(items.length > chest.itemLimit){
    items = items.sort((a, b) => (b.rarity ?? 0) - (a.rarity ?? 0)).slice(0, chest.itemLimit)
  }

  let leftoverValue = totalValue
  items.forEach(item => {
    addItem(chest.contents.items.basic, item.group, item.name)
    leftoverValue -= getItemRarity(item.rarity).value
  })

  if(leftoverValue > 0 && !chest.noGold){
    chest.contents.gold += addGold(leftoverValue)
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