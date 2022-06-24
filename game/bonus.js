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
  const orbs = {}
  orbs[bonusDef.group] = bonusDef.orbs || 1
  return new OrbsData(orbs)
}

export function getBonusStats(bonusDef){
  bonusDef = getBonusDef(bonusDef)
  return new Stats(bonusDef.stats)
}