import { damageActionCalcDamage } from '../../../../game/mechanicsFns.js'
import { dealDamage } from '../../dealDamage.js'

export default function(combat, actor, subject, abilityInstance = null, actionDef = {}, triggerData = {}){
  let damage = damageActionCalcDamage(abilityInstance ?? actor, actionDef.scaling)
  if(actionDef.miscScaling?.blockedPhysDamage){
    damage += actionDef.miscScaling?.blockedPhysDamage * calcBlockedPhysDamage(actor, triggerData)
  }
  damage = Math.ceil(damage)
  return {
    damageInfo: dealDamage(combat, actor, subject, {
      ...actionDef,
      damage
    })
  }
}

function calcBlockedPhysDamage(actor, triggerData){
  if(triggerData.damageType !== 'phys'){
    return 0
  }
  return triggerData.damageDistribution
    .reduce((prev, val) => prev + (val.name === 'block' ? val.amount : 0), 0)
}