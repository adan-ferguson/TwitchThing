import { scalingWrap } from '../../../components/common.js'
import { wrappedPct } from '../../../../../game/growthFunctions.js'

export function derivedGainHealthDescription(healingDef, abilityInstance){
  const scaling = healingDef.scaling
  if(scaling.hpMax){
    return [`Recover ${scaling.hpMax * 100}% max health.`]
  }else if(scaling.physPower){
    return [`Recover ${scalingWrap('physPower', wrappedPct(scaling.physPower * 100))} health.`]
  }else if(scaling.magicPower){
    return [`Recover ${scalingWrap('magicPower', wrappedPct(scaling.magicPower * 100))} health.`]
  }
  throw 'Missing gain health description'
}