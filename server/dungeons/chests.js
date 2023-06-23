import { chooseRandomBasicItem } from '../items/generator.js'
import { toNumberOfDigits } from '../../game/utilFunctions.js'
import { geometricProgression } from '../../game/growthFunctions.js'
import AdventurerItem, { ITEM_RARITIES } from '../../game/items/adventurerItem.js'
import { unlockedClasses } from '../../game/user.js'
import { chooseOne } from '../../game/rando.js'

const GOLD_BASE = 15
const GOLD_GROWTH = 2
const GOLD_GROWTH_PCT = 0.01

/**
 * @param dri {DungeonRunInstance}
 * @param mi {MonsterInstance}
 */
export function generateMonsterChest(dri, mi){

  const ai = dri.adventurerInstance
  const preSkillTutorial = dri.user.features.skills ? false : true
  const fighterSkewed = dri.user.deepestFloor < 11

  const options = {
    value: 1,
    level: mi.level,
    itemLimit: 1,
    type: 'normal',
    noGold: preSkillTutorial ? true : false,
    rarities: preSkillTutorial ? [0] : null,
    goldMultiplier: ai.stats.get('goldFind').value,
    rareFind: ai.stats.get('rareFind').value,
    goldOnly: ai.hasMod('goldOnly'),
  }

  if(mi.isBoss){
    if(dri.adventurer.accomplishments.deepestFloor <= dri.floor){
      options.type = 'zoneReward'
      options.itemLimit = 6
      options.value = 4
      options.goldMultiplier *= 2
    }else{
      options.type = 'boss'
      options.itemLimit = 3
      options.value = 2
      options.goldMultiplier *= 1.5
    }
  }

  options.classes = preSkillTutorial ? ['fighter'] : unlockedClasses(dri.user).map(cls => {
    return { value: cls, weight: fighterSkewed && cls === 'fighter' ? 6 : 1 }
  })

  const midas = ai.modsOfType('midas')[0]
  if(midas && !options.noGold){
    options.goldOnly = true
  }

  return generateRandomChest(options)
}

export function generateRandomChest(options = {}){

  options = {
    type: 'normal',
    level: 1,
    value: 1,
    noGold: false,
    goldOnly: false,
    baseGold: 0,
    goldMultiplier: 1,
    rareFind: 1,
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
  while(valueRemaining > 0 && !options.goldOnly){
    const advClass = chooseOne(options.classes)
    const rarity = chooseRarity(options.rarities, valueRemaining, options.rareFind)
    const item = new AdventurerItem(chooseRandomBasicItem(valueRemaining, advClass, rarity))
    items.push(item)
    valueRemaining -= item.rarityInfo.value
  }

  if(items.length > options.itemLimit){
    items = items.sort((a, b) => (b.rarity ?? 0) - (a.rarity ?? 0)).slice(0, options.itemLimit)
  }

  items.forEach(item => {
    addItem(contents.items.basic, item.name)
  })

  if(!options.noGold){
    contents.gold += addGold(totalValue, options.goldMultiplier)
  }

  return {
    options,
    contents,
  }
}

export function applyChestToUser(userDoc, chest){
  if(chest.contents.items){
    mergeBasicItems(chest.contents.items.basic, userDoc.inventory.items.basic)
  }
  if (chest.contents.gold){
    userDoc.inventory.gold += Math.round(chest.contents.gold)
  }
}

function mergeBasicItems(source, target){
  for(let name in source){
    addItem(target, name, source[name])
  }
}

function addGold(valueRemaining, multi = 1){
  valueRemaining = Math.ceil(Math.random() * valueRemaining)
  const gold = GOLD_BASE + Math.ceil(geometricProgression(GOLD_GROWTH_PCT, valueRemaining, GOLD_GROWTH))
  return toNumberOfDigits(gold * multi,2)
}

function addItem(obj, name, count = 1){
  if(!obj[name]){
    obj[name] = 0
  }
  obj[name] += count
}

function chooseRarity(rarities, valueRemaining, rareFind){
  if(!rarities){
    rarities = [0,1,2]
  }
  return chooseOne(rarities.map(r => {
    const info = ITEM_RARITIES[r]
    const pct = Math.min(1, valueRemaining / info.value)
    return { value: r, weight: pct * info.weight * (r === 2 ? rareFind : 1) }
  }))
}