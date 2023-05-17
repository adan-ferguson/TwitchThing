import { randomBetween } from '../../game/rando.js'
import { processAbilityEvents } from './abilities.js'

export function takeDamage(combat, subject, damageInfo){

  damageInfo = {
    damage: 0,
    damageType: 'phys',
    ignoreDefense: false,
    range: null,
    ignoreOvertime: false,
    ...damageInfo
  }

  let result = {
    baseDamage:  damageInfo.damage,
    blocked: 0,
    damageType: damageInfo.damageType
  }

  let damage = result.baseDamage * subject.stats.get('damageTaken').value

  if(damageInfo.range){
    damage *= randomBetween(...damageInfo.range)
  }

  if(!damageInfo.ignoreDefense){
    const mitigated = Math.floor(damage * subject.stats.get(damageInfo.damageType + 'Def').value)
    damage = damage - mitigated
    result.mitigated = mitigated
  }

  if(!damageInfo.ignoreOvertime){
    damage *= combat.overtimeDamageBonus
  }

  damage = Math.ceil(damage)

  // TODO: iterate over damage replacements

  result.damageDistribution = { hp: damage }
  result.totalDamage = Object.values(result.damageDistribution).reduce((prev, val) => prev + val)
  subject.hp -= result.damageDistribution.hp

  if(damage > 0){
    result = processAbilityEvents(combat, 'takeDamage', subject, result)
  }

  return result
}