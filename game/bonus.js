import Bonuses from './bonuses/combined.js'
import Stats from './stats/stats.js'
import OrbsData from './orbsData.js'

export function getBonusDef({ group, name }){
  return Bonuses[group][name] ?? {
    name: 'Blank',
    group
  }
}

export function getBonusOrbsData(bonusDef){
  bonusDef = getBonusDef(bonusDef)
  const orbs = bonusDef.orbs || {}
  if(!orbs[bonusDef.group]){
    orbs[bonusDef.group] = 0
  }
  orbs[bonusDef.group]++
  return new OrbsData(orbs)
}

export function getBonusStats(bonusDef){
  bonusDef = getBonusDef(bonusDef)
  return new Stats(bonusDef.stats)
}