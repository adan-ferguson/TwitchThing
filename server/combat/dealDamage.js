import { takeDamage } from './takeDamage.js'
import { gainHealth } from './gainHealth.js'

export function dealDamage(combat, actor, target, damageInfo){

  const damageResult = takeDamage(combat, target, damageInfo)

  let lifesteal = actor.stats.get('lifesteal').value
  if(damageInfo.crit){
    lifesteal += actor.stats.get('critLifesteal').value
  }

  const hpToGain = Math.ceil(
    Math.min(actor.hpMax - actor.hp, lifesteal * damageResult.totalDamage)
  )

  if(hpToGain){
    const healthGainResult = gainHealth(combat, actor, { flat: hpToGain })
    damageInfo.lifesteal = healthGainResult.amount
  }

  return damageInfo
}