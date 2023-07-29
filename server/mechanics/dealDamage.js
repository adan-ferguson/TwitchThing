import { takeDamage } from './takeDamage.js'

export function dealDamage(combat, actor, target, damageInfo){

  const damageResult = takeDamage(combat, target, damageInfo)

  let lifesteal = actor.stats.get('lifesteal').value + damageInfo.lifesteal
  if(damageInfo.crit){
    lifesteal += actor.stats.get('critLifesteal').value
  }

  const hpToGain = Math.ceil(
    Math.min(actor.hpMax - actor.hp, lifesteal * damageResult.totalDamage)
  )

  if(hpToGain){
    combat.addPendingTriggers({
      performAction: true,
      actor,
      def: {
        gainHealth: {
          scaling: { flat: hpToGain }
        }
      }
    })
  }

  return damageResult
}