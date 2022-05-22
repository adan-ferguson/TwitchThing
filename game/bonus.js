import Bonuses from './bonuses/combined.js'
import Stats from './stats/stats.js'
import OrbsData from './orbsData.js'

export function getBonusDef(group, name){
  return Bonuses[group][name]
}

export function getBonusOrbsData(bonusDef){
  const orbs = bonusDef.orbs || {}
  if(!orbs[bonusDef.group]){
    orbs[bonusDef.group] = 0
  }
  orbs[bonusDef.group]++
  return new OrbsData(orbs)
}

export function getBonusStats(bonusDef){
  return new Stats(bonusDef.stats)
}