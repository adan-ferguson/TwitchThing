import { chooseRandomBasicItem } from '../items/generator.js'
import AdventurerItem, { ITEM_RARITIES } from '../../game/items/adventurerItem.js'
import { unlockedClasses } from '../../game/user.js'
import { chooseOne } from '../../game/rando.js'

export function generateMonsterChest(dri, mi){

  const ai = dri.adventurerInstance
  const preSkillTutorial = dri.user.features.skills ? false : true
  const fighterSkewed = dri.user.deepestFloor < 11

  const options = {
    value: 1,
    level: mi.level,
    itemLimit: 1,
    type: 'normal',
    rarities: preSkillTutorial ? [0] : null,
    rareFind: ai.stats.get('rareFind').value,
  }

  if(mi.isBoss){
    if(dri.adventurer.accomplishments.deepestFloor <= dri.floor){
      options.type = 'zoneReward'
      options.itemLimit = 6
      options.value = 4
    }else{
      options.type = 'boss'
      options.itemLimit = 3
      options.value = 2
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
    items: {
      basic: {}
    }
  }

  const totalValue = options.level * options.value
  let valueRemaining = totalValue
  let items = []
  while(valueRemaining > 0){
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

  return {
    options,
    contents,
  }
}

export function applyChestToUser(userDoc, chest){
  if(chest.contents.items){
    mergeBasicItems(chest.contents.items.basic, userDoc.inventory.items.basic)
  }
}

function mergeBasicItems(source, target){
  for(let name in source){
    addItem(target, name, source[name])
  }
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
  const chances = rarities.map(r => {
    const info = ITEM_RARITIES[r]
    const pct = Math.min(1, Math.pow(valueRemaining / info.value, 2))
    return { value: r, weight: pct * info.weight * (r === 2 ? rareFind : 1) }
  })
  return chooseOne(chances)
}