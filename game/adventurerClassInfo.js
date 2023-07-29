import { FIGHTER_CLASS_INFO } from './adventurerClasses/fighter.js'
import { MAGE_CLASS_INFO } from './adventurerClasses/mage.js'
import { PALADIN_CLASS_INFO } from './adventurerClasses/paladin.js'
import { ROGUE_CLASS_INFO } from './adventurerClasses/rogue.js'
import { CHIMERA_CLASS_INFO } from './adventurerClasses/chimera.js'

const INFO = {
  fighter: FIGHTER_CLASS_INFO,
  mage: MAGE_CLASS_INFO,
  paladin: PALADIN_CLASS_INFO,
  rogue: ROGUE_CLASS_INFO,
  chimera: CHIMERA_CLASS_INFO,
}

for(let advClass in INFO){
  INFO[advClass].skills.forEach((s, i) => s.index = i)
  INFO[advClass].items.forEach((rarity, i) => {
    rarity.forEach(item => item.rarity = i)
  })
}

export function getClassInfo(className){
  return INFO[className]
}

export function getAllItemsByClass(){
  const items = {}
  for(let className in INFO){
    items[className] = INFO[className].items.flat()
  }
  return items
}

export function getAllItemKeys(){
  const keys = []
  for(let className in INFO){
    INFO[className].items.forEach(arr => {
      arr.forEach(item => {
        keys.push(item.id)
      })
    })
  }
  return keys
}

export function getAllSkillKeys(){
  const keys = []
  for(let className in INFO){
    INFO[className].skills.forEach(skill => {
      keys.push(skill.id)
    })
  }
  return keys
}
