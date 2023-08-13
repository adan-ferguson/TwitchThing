import { arrayize } from './utilFunctions.js'
import { CombatResult } from './combatResult.js'

export default function calculateResults(dungeonRunInstance){

  const eventsList = dungeonRunInstance.events.map(e => e.data)
  const chests = dungeonRunInstance.rewards.chests

  const rewards = toRewards(eventsList)
  const results = {
    xp: xp(rewards),
    monstersKilled: monstersKilled(eventsList),
    chests
  }

  if(!eventsList.length){
    return
  }

  results.time = eventsList.at(-1).time
  results.startingFloor = eventsList[0].floor
  results.endingFloor = eventsList.at(-1).floor

  if(eventsList.at(-1)?.runFinished){
    results.finalEvent = eventsList.at(-1)
  }

  return results
}

function monstersKilled(eventsList){
  const obj = {}
  eventsList.forEach(event => {
    if(event.monster && event.result === CombatResult.F1_WIN){
      obj[event.monster.baseType] = (obj[event.monster.baseType] ?? 0) + 1
    }
  })
  return Object.keys(obj).map(name => { return { name, amount: obj[name] }} )
}

function toRewards(eventsList){
  const arr = []
  eventsList.forEach(e => {
    arr.push(...arrayize(e.rewards))
  })
  return arr
}

function xp(rewards){
  return rewards.reduce((prev, r) => prev + (r.xp ?? 0), 0) ?? 0
}