import { chooseRandomBasicItem } from '../items/generator.js'
import { toNumberOfDigits } from '../../game/utilFunctions.js'
import { geometricProgression } from '../../game/growthFunctions.js'
import AdventurerItem from '../../game/items/adventurerItem.js'
import { unlockedClasses } from '../../game/user.js'
import { chooseOne } from '../../game/rando.js'

const GOLD_BASE = 15
const GOLD_GROWTH = 4
const GOLD_GROWTH_PCT = 0.01

/**
 * @param dri {DungeonRunInstance}
 * @param mi {MonsterInstance}
 */
export function generateMonsterChest(dri, mi){

  const preSkillTutorial = dri.user.features.skills ? false : true
  const fighterSkewed = dri.user.deepestFloor < 11

  const options = {
    value: 1,
    level: mi.level,
    itemLimit: 1,
    type: 'normal',
    noGold: preSkillTutorial ? true : false,
    rarities: preSkillTutorial ? [0] : null,
    goldMultiplier: dri.adventurerInstance.stats.get('goldFind').value
  }

  if(mi.isBoss){
    if(dri.adventurer.accomplishments.deepestFloor <= dri.floor){
      options.type = 'zoneReward'
      options.itemLimit = 6
      options.value = 4
      options.baseGold = addGold(mi.level * 2)
    }else{
      options.type = 'boss'
      options.itemLimit = 3
      options.value = 2
      options.baseGold = addGold(mi.level)
    }
  }

  options.classes = preSkillTutorial ? ['fighter'] : unlockedClasses(dri.user).map(cls => {
    return { value: cls, weight: fighterSkewed && cls === 'fighter' ? 6 : 1 }
  })

  return generateRandomChest(options)
}

export function generateRandomChest(options = {}){

  options = {
    type: 'normal',
    level: 1,
    value: 1,
    noGold: false,
    baseGold: 0,
    goldMultiplier: 1,
    classes: null,
    itemLimit: 1,
    rarities: null,
    ...options
  }

  if(!options.classes || !options.classes.length){
    throw 'No classes provided uhhh'
  }

  const contents = {
    gold: options.baseGold,
    items: {
      basic: {}
    }
  }

  const totalValue = options.level * options.value
  let valueRemaining = totalValue
  let items = []
  while(valueRemaining > 0){
    const advClass = chooseOne(options.classes)
    const item = new AdventurerItem(chooseRandomBasicItem(valueRemaining, advClass, options.rarities).id)
    items.push(item)
    valueRemaining -= item.rarityInfo.value
  }

  if(items.length > options.itemLimit){
    items = items.sort((a, b) => (b.rarity ?? 0) - (a.rarity ?? 0)).slice(0, options.itemLimit)
  }

  let leftoverValue = totalValue
  items.forEach(item => {
    addItem(contents.items.basic, item.baseItemId)
    leftoverValue -= item.rarityInfo.value
  })

  if(leftoverValue > 0 && !options.noGold){
    contents.gold += addGold(leftoverValue) * options.goldMultiplier
  }

  return {
    options,
    contents,
  }
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
  valueRemaining = Math.ceil((0.5 + Math.random() / 2) * valueRemaining)
  const gold = GOLD_BASE + Math.ceil(geometricProgression(GOLD_GROWTH_PCT, valueRemaining, GOLD_GROWTH))
  return toNumberOfDigits(gold,2)
}

function addItem(obj, name, count = 1){
  if(!obj[name]){
    obj[name] = 0
  }
  obj[name] += count
}