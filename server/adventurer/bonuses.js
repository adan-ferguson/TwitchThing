import Users from '../collections/users.js'
import { chooseOne } from '../../game/rando.js'
import Bonuses from '../../game/bonuses/combined.js'
import Adventurers from '../collections/adventurers.js'
import AdventurerInstance from '../../game/adventurerInstance.js'
import { toArray } from '../../game/utilFunctions.js'
import BonusInstance from '../../game/bonusInstance.js'
import { oneTwoFive } from '../../game/exponentialValue.js'
import { spendGold } from '../loadouts/inventory.js'

const FIRST_LEVEL_BONUSES = {
  fighter: 'strength',
  tank: 'toughness',
  ranger: 'fleetFoot'
}

const RARITY_TO_WEIGHT = [
  1,
  0.5,
  0.25
]

export function firstLevelBonus(className){
  return FIRST_LEVEL_BONUSES[className]
}

export async function generateLevelup(adventurerDoc){
  const advInstance = new AdventurerInstance(adventurerDoc)
  if(!advInstance.shouldLevelUp){
    return null
  }
  const nextLevel = advInstance.bonusesData.levelTotal + 1
  const userDoc = await Users.findByID(adventurerDoc.userID)
  return {
    options: await generateBonusOptions(userDoc, adventurerDoc, nextLevel),
    level: nextLevel
  }
}

export async function selectBonus(adventurerDoc, index){
  if(!adventurerDoc.nextLevelUp){
    throw { message: 'Adventurer does not have a pending levelup, can not select bonus.' }
  }
  const selected = adventurerDoc.nextLevelUp.options[index]
  if(!adventurerDoc.bonuses[selected.group]){
    adventurerDoc.bonuses[selected.group] = {}
  }
  adventurerDoc.bonuses[selected.group][selected.name] = selected.level
  adventurerDoc.nextLevelUp = await generateLevelup(adventurerDoc)
  await Adventurers.save(adventurerDoc)
  return adventurerDoc.nextLevelUp
}

export function getRerollCost(adventurerDoc){
  return adventurerDoc.rerolls > 0 ? oneTwoFive(adventurerDoc.rerolls + 1) * 10: 0
}

export async function rerollBonus(userDoc, adventurerDoc){

  if(!adventurerDoc.nextLevelUp){
    throw { message: 'Adventurer does not have a pending levelup, can not reroll bonus.' }
  }

  spendGold(userDoc, getRerollCost(adventurerDoc))
  Users.saveAndEmit(userDoc)

  adventurerDoc.nextLevelUp = await generateLevelup(adventurerDoc)
  adventurerDoc.rerolls++
  await Adventurers.save(adventurerDoc)
  return adventurerDoc.nextLevelUp
}

export async function generateBonusOptions(userDoc, adventurerDoc){

  return ['fighter', 'mage', 'paladin'].map(className => {
    const existing = adventurerDoc.bonuses[className]?.[className + 'orb'] ?? 0
    return {
      group: className,
      name: className + 'orb',
      level: existing + 1
    }
  })

  // const ai = new AdventurerInstance(adventurerDoc)
  // const orbsData = ai.orbs
  // const classOptions = orbsData.classes.slice(0,3)
  //
  // for(let i = classOptions.length; i < 3; i++){
  //   classOptions[i] = 'fighter' //randomClass()
  // }
  //
  // return classOptions.map(className => {
  //   return chooseBonus(className)
  // })

  // function randomClass(){
  //   const exclude = classOptions
  //   const choices = []
  //   Object.keys(userDoc.features.advClasses)
  //     .filter(className => userDoc.features.advClasses[className] > 0)
  //     .forEach(className => {
  //       if(exclude.indexOf(className) > -1){
  //         return
  //       }
  //       choices.push(className)
  //     })
  //   return chooseOne(choices)
  // }
  //
  // function chooseBonus(className){
  //   const choices = Object.values(Bonuses[className]).map(bonus => {
  //     return { weight: calcBonusWeight(bonus), value: bonus }
  //   })
  //   const chosen = chooseOne(choices)
  //   const existing = adventurerDoc.bonuses[className]?.[chosen.name]
  //   return {
  //     group: className,
  //     name: chosen.name,
  //     level: existing ? existing + 1 : 1
  //   }
  // }
  //
  // function calcBonusWeight(bonus){
  //   const orbCount = orbsData.get(bonus.group).max
  //   if(bonus.minOrbs > orbCount){
  //     return 0
  //   }
  //   if(!new BonusInstance(bonus).upgradable){
  //     if(ai.bonusesData.get(bonus)){
  //       return 0
  //     }
  //   }
  //   if(bonus.requires){
  //     const arr = toArray(bonus.requires)
  //     if(!arr.every(requirement => {
  //       return ai.bonusesData.get({ group: bonus.group, name: requirement }) ? true : false
  //     })){
  //       return 0
  //     }
  //   }
  //   return RARITY_TO_WEIGHT[bonus.rarity ?? 0]
  // }
}