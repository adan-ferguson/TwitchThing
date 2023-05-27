import { statScaling } from '../../../components/common.js'

export function derivedGainHealthDescription(healingDef, abilityInstance){
  const scaling = healingDef.scaling
  if(scaling.hpMax){
    return [`Recover ${scaling.hpMax * 100}% max health.`]
  }else{
    return [`Recover ${statScaling(scaling, abilityInstance)} health.`]
  }
}