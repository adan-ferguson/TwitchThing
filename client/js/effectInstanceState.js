export function effectInstanceState(ei){
  if(!ei){
    return null
  }
  console.log('state')
  const ai = ei.abilities[0]
  return {
    disabled: ei.disabled,
    abilityType: type(ai),
    abilityState: state(ai),
    cooldownRefreshing: ai?.cooldownRefreshing ?? false,
    abilityBarValue: barValue(ai),
    abilityBarMax: barMax(ai),
  }
}

function type(ai){
  if(!ai){
    return 'none'
  }else if(ai.trigger === 'active'){
    return 'active'
  }else{
    return 'nonactive'
  }
}

function state(ai){
  if(!ai){
    return 'none'
  }else if(ai.ready){
    return 'ready'
  }else{
    return 'recharging'
  }
}

function barValue(ai){
  if(ai){
    if(ai.cooldown){
      return ai.cooldown - ai.cooldownRemaining
    }
    if(ai.uses){
      return ai.uses - ai.timesUsed
    }
  }
  return 0
}

function barMax(ai){
  if(ai){
    if(ai.cooldown){
      return ai.cooldown
    }
    if(ai.uses){
      return ai.uses
    }
  }
  return 1
}