import Users from '../collections/users.js'
import { chooseOne } from '../../game/rando.js'
import Bonuses from '../../game/bonuses/combined.js'
import { getAdventurerOrbsData } from '../../game/adventurer.js'

export async function generateLevelup(adventurerDoc){
  const nextLevel = adventurerDoc.bonuses.length + 1
  if(nextLevel > adventurerDoc.level){
    throw { message: 'Tried to generate a levelup but it was crazy.' }
  }
  return {
    options: await generateBonusOptions(adventurerDoc, nextLevel),
    level: nextLevel
  }
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
      className,
      bonus: generateBonus(className),
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

  function generateBonus(className){
    const choices = Bonuses[className].map(bonus => {
      return { weight: calcBonusWeight(bonus), value: bonus }
    })
    return chooseOne(choices)
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