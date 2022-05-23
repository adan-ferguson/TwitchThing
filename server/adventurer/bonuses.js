import Users from '../collections/users.js'
import { chooseOne } from '../../game/rando.js'
import Bonuses from '../../game/bonuses/combined.js'
import { getAdventurerOrbsData } from '../../game/adventurer.js'
import Adventurers from '../collections/adventurers.js'

export function firstLevelBonus(className){
  const first = {
    warrior: Bonuses.warrior.strength,
    mage: Bonuses.mage.placeholdering,
    ranger: Bonuses.ranger.fleetFoot
  }[className]
  return { group: first.group, name: first.name, level: 1 }
}

export async function generateLevelup(adventurerDoc){
  const nextLevel = adventurerDoc.bonuses.length + 1
  if(nextLevel > adventurerDoc.level){
    return null
  }
  return {
    options: await generateBonusOptions(adventurerDoc, nextLevel),
    level: nextLevel
  }
}

export async function selectBonus(adventurerDoc, index){
  if(!adventurerDoc.nextLevelUp){
    throw { message: 'Adventurer does not have a pending levelup, can not select bonus.' }
  }
  adventurerDoc.bonuses.push(adventurerDoc.nextLevelUp.options[index])
  adventurerDoc.nextLevelUp = await generateLevelup(adventurerDoc)
  await Adventurers.save(adventurerDoc)
  return adventurerDoc.nextLevelUp
}

async function generateBonusOptions(adventurerDoc, level){

  const user = await Users.findOne(adventurerDoc.userID)
  const orbsData = getAdventurerOrbsData(adventurerDoc)
  const classOptions = orbsData.classes.slice(0,3)

  for(let i = classOptions.length; i < 3; i++){
    classOptions[i] = randomClass()
  }

  return classOptions.map(className => {
    return {
      group: className,
      name: chooseBonusType(className),
      level
    }
  })

  function randomClass(){
    const exclude = orbsData.classes
    const choices = []
    Object.keys(user.features.advClasses)
      .filter(className => user.features.advClasses[className] > 0)
      .forEach(className => {
        if(exclude.indexOf(className) > -1){
          return
        }
        choices.push(className)
      })
    return chooseOne(choices)
  }

  function chooseBonusType(className){
    const choices = Object.values(Bonuses[className]).map(bonus => {
      return { weight: calcBonusWeight(bonus), value: bonus }
    })
    return chooseOne(choices).name
  }

  function calcBonusWeight(bonus){
    const orbCount = orbsData.get(bonus.group).max
    if(bonus.minOrbs > orbCount){
      return 0
    }
    if(bonus.unique){
      if(adventurerDoc.bonuses.find(existingBonus => {
        return existingBonus.name === bonus.name && existingBonus.group === bonus.group
      }))
        return 0
    }
    // TODO: not sure what to do for this exactly
    return 1
  }
}