import { chooseRandomBasicItem } from '../items/generator.js'
import { toNumberOfDigits } from '../../game/utilFunctions.js'
import { geometricProgression } from '../../game/growthFunctions.js'
import AdventurerItem from '../../game/items/adventurerItem.js'

const GOLD_BASE = 15
const GOLD_GROWTH = 6
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
    classes: null,
    itemLimit: 1,
    rarities: null,
    ...options
  }

  if(!chest.classes){
    throw 'Random chest did not get a list of classes to choose from, probably a bug.'
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
    const chestClasses = chest.type === 'tutorial' && Math.random() > 0.75 ? ['fighter'] : chest.classes
    const item = new AdventurerItem(chooseRandomBasicItem(valueRemaining, chestClasses, options.rarities).id)
    items.push(item)
    valueRemaining -= item.rarityInfo.value
  }

  if(items.length > chest.itemLimit){
    items = items.sort((a, b) => (b.rarity ?? 0) - (a.rarity ?? 0)).slice(0, chest.itemLimit)
  }

  let leftoverValue = totalValue
  items.forEach(item => {
    addItem(chest.contents.items.basic, item.baseItemId)
    leftoverValue -= item.rarityInfo.value
  })

  if(leftoverValue > 0 && !chest.noGold){
    chest.contents.gold += addGold(leftoverValue)
  }

  return chest
}

export function applyChestToUser(userDoc, chest){
  mergeBasicItems(chest.contents.items.basic, userDoc.inventory.items.basic)
  if (chest.contents.gold){
    userDoc.inventory.gold += chest.contents.gold
  }
}

function mergeBasicItems(source, target){
  for(let name in source){
    addItem(target, name, source[name])
  }
}

function addGold(valueRemaining){
  valueRemaining = Math.ceil(Math.random() * valueRemaining)
  const gold = GOLD_BASE + Math.ceil(geometricProgression(GOLD_GROWTH_PCT, valueRemaining, GOLD_GROWTH))
  return toNumberOfDigits(gold,2)
}

function addItem(obj, name, count = 1){
  if(!obj[name]){
    obj[name] = 0
  }
  obj[name] += count
}