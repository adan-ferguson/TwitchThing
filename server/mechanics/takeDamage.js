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
    baseDamage: damageInfo.damage,
    damageType: damageInfo.damageType
  }

  let damage = result.baseDamage * subject.stats.get('damageTaken').value

  if(damageInfo.range){
    damage *= randomBetween(...damageInfo.range)
  }

  if(!damageInfo.ignoreDefense){
    const mitigated = Math.floor(
      damage *
      subject.stats.get(damageInfo.damageType + 'Def').value *
      subject.stats.get('damageTaken').value
    )
    damage = damage - mitigated
    result.mitigated = mitigated

    const maxDamage = Math.ceil(subject.hpMax * subject.stats.get('damageCeiling').value)
    if(damage > maxDamage){
      result.mitigated += damage - maxDamage
      damage = maxDamage
    }

    const minDamage = Math.ceil(subject.hpMax * subject.stats.get('damageThreshold').value)
    if(damage < minDamage){
      result.mitigated += damage
      damage = 0
    }
  }

  if(!damageInfo.ignoreOvertime){
    damage *= combat.overtimeDamageBonus
  }

  result.damageDistribution = distributeDamage(subject, Math.ceil(damage))
  result.totalDamage = Object.values(result.damageDistribution).reduce((prev, val) => prev + val.amount, 0)

  if(damage > 0){
    result = processAbilityEvents(combat, 'takeDamage', subject, null, result)
  }

  if(!subject.hp && subject.canDie){
    const deathResult = processAbilityEvents(combat, 'dying', subject, null)
    if(deathResult.cancelled){
      subject.deathPreventedViaAbility = true
    }else{
      processAbilityEvents(combat, 'dead', subject, null, result)
      subject.dead = true
      result.dead = true
    }
  }

  if(!subject.dead && !subject.hp){
    subject.hp = 1
    result.damageDistribution.at(-1).finalValue = 1
  }

  return result
}

function distributeDamage(subject, damageLeft){
  const distribution = []

  subject.effectInstances.forEach(ei => {
    if(!damageLeft){
      return
    }
    if(ei.barrier){
      const toReduce = Math.ceil(Math.min(damageLeft, ei.barrierHp))
      damageLeft -= toReduce
      ei.barrierHp -= toReduce
      distribution.push({ id: ei.uniqueID, type: 'barrier', name: ei.name, amount: toReduce })
    }
  })

  subject.hp -= damageLeft
  distribution.push({ id: 'hp', amount: damageLeft })
  return distribution
}