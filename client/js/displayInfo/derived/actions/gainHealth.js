import { statScaling } from '../../../components/common.js'

export function derivedGainHealthDescription(healingDef, abilityInstance){
  const scaling = healingDef.scaling
  if(scaling.hpMax){
    return [`recover <b>${scaling.hpMax * 100}%</b> max health.`]
  }else{
    return [`recover ${statScaling(scaling, abilityInstance)} health.`]
  }
}