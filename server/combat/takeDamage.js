import { randomBetween } from '../../game/rando.js'

export function takeDamage(combat, subject, damageInfo){

  damageInfo = {
    damage: 0,
    damageType: 'phys',
    ignoreDefense: false,
    range: null,
    ...damageInfo
  }

  const result = {
    baseDamage:  damageInfo.damage,
    blocked: 0,
    damageType: damageInfo.damageType
  }

  let damage = result.baseDamage * subject.stats.get('damageTaken').value

  if(damageInfo.range){
    damage *= randomBetween(...damageInfo.range)
  }

  if(!damageInfo.ignoreDefense){
    const blocked = Math.floor(damage * subject.stats.get(damageInfo.damageType + 'Def').value)
    damage = damage - blocked
    result.blocked = blocked
  }

  damage = Math.ceil(damage)

  // result.damageDistribution = subject.statusEffectsData.ownerTakingDamage(damage)
  // subject.hp -= result.damageDistribution.hp
  // result.totalDamage = Object.values(result.damageDistribution).reduce((prev, val) => prev + val)

  subject.hp -= damage
  result.totalDamage = damage

  if(damage > 0){
    combat.triggerEvent(subject, 'takeDamage')
  }

  return result
}