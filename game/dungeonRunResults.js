import { toArray } from './utilFunctions.js'

export default function calculateResults(eventsList){
  eventsList = eventsList.events ?? eventsList
  const results = {
    xp: eventsList.reduce((prev, e) => prev + (e.rewards?.xp ?? 0), 0),
    monstersKilled: monstersKilled(eventsList),
    relics: relics(eventsList),
    chests: chests(eventsList)
  }

  if(eventsList.at(-1)?.runFinished){
    results.killedByMonster = eventsList.at(-2).monster
  }

  return results
}


function monstersKilled(eventsList){
  const arr = []
  eventsList.forEach(event => {
    if(event.monster?.defeated){
      arr.push(event.monster)
    }
  })
  return arr
}

function relics(eventsList){
  const arr = []
  eventsList.forEach(e => {
    if('relicSolved' in e){
      const tier = e.relic.tier
      if(!arr[tier]){
        arr[tier] = { attempted: 0, solved: 0 }
      }
      arr[tier].attempted++
      if(e.relicSolved){
        arr[tier].solved++
      }
    }
  })
  return arr
}

function chests(eventsList){
  const arr = []
  eventsList.forEach(e => {
    const chests = toArray(e.rewards?.chests ?? [])
    chests.forEach(chest => {
      debugger
      if(!arr[chest.tier]){
        arr[chest.tier] = 0
      }
      arr[chest.tier]++
    })
  })
  return arr
}