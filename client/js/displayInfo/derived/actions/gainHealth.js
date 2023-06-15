import { statScaling } from '../../../components/common.js'

export function derivedGainHealthDescription(healingDef, abilityInstance){
  const scaling = healingDef.scaling
  if(scaling.hpMax){
    return [`recover <b>${scaling.hpMax * 100}%</b> max health.`]
  }else if(scaling.hpMissing){
    return [`recover <b>${scaling.hpMissing * 100}%</b> missing health.`]
  }else{
    return [`recover ${statScaling(scaling, abilityInstance)} health.`]
  }
}