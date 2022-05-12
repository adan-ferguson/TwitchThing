import { chooseMulti, chooseOne, randomRound } from '../../game/rando.js'
import scaledValue from '../../game/scaledValue.js'
import { StatDefinitions, StatType } from '../../game/stats/statDefinitions.js'
import OrbsData from '../../game/orbsData.js'
import Users from '../collections/users.js'

export async function generateBonusOptions(dungeonRun, level){

  const user = await Users.findOne(dungeonRun.userID)
  const orbsData = OrbsData.fromAdventurer(dungeonRun.adventurer, null)
  const classOptions = orbsData.classes.slice(0,3)

  for(let i = classOptions.length; i < 3; i++){
    classOptions[i] = randomClass()
  }

  return classOptions.map(className => {
    return {
      className,
      bonus: generateBonus(className, orbsData.max(className))
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

  function generateBonus(className, orbCount){

  }
}