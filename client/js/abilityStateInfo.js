import { silencedMod } from '../../game/mods/combined.js'

export function getAbilityStateInfo(effectInstance){

  if(!effectInstance){
    return null
  }

  const abilities = effectInstance.generateAbilitiesData().instances
  if(!Object.values(abilities).length){
    return null
  }

  const [eventName, ability] = Object.entries(abilities)[0]

  let state
  if(effectInstance.owner.mods.contains(silencedMod)){
    state = 'disabled'
  }else if(ability.ready){
    state = 'ready'
  }else if(ability.enabled){
    state = 'recharging'
  }else{
    state = 'disabled'
  }

  return {
    type: eventName === 'active' ? 'active' : 'triggered',
    state,
    ability
  }
}