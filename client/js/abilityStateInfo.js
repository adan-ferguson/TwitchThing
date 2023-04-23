export const AbilityState = {
  NONE: 'none',
  DISABLED: 'disabled',
  READY: 'ready',
  RECHARGING: 'recharging',
  IDLE: 'idle'
}

export function abilityStateInfo(obj){
  const ability = getMainAbility(loadoutObject.effect.abilities)
  if(!ability){
    return null
  }
  return {
    ability,
    trigger,
    type: trigger === 'active' ? 'active' : 'triggered',
    descriptionEl: descriptionEl(ability, stats),
    idle: true,
    state: idle ? AbilityState.IDLE : state(ability),
    barValue: idle ? 0 : barValue(ability),
    barMax: idle ? 1 : barMax(ability),
    cooldownRefreshing: ability.cooldownRefreshing,
    phantom: ability.phantom ? true : false
  }
}

function getMainAbility(abilities){
  if(!abilities){
    return {}
  }
  const active = abilities.active
  if(active){
    return { trigger: 'active', ability: active }
  }
  for(let trigger in abilities){
    // TODO: actually choose
    if(abilities[trigger]){
      return { trigger, ability: abilities[trigger] }
    }
  }
  return {}
}


function state(ability){
  if(!ability){
    return AbilityState.NONE
  }else if(ability.fighterInstance.mods.contains(silencedMod)){
    return AbilityState.DISABLED
  }else if(ability.ready){
    return AbilityState.READY
  }else if(ability.enabled){
    return AbilityState.RECHARGING
  }
  return AbilityState.DISABLED
}

function barValue(ability){
  if(ability?.cooldown){
    return ability.cooldown - ability.cooldownRemaining
  }
  if(ability?.uses){
    return ability.uses - ability.timesUsed
  }
  return 0
}

function barMax(ability){
  if(ability?.cooldown){
    return ability.cooldown
  }
  if(ability?.uses){
    return ability.uses
  }
  return 1
}