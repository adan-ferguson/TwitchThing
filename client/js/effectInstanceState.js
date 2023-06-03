export function effectInstanceState(ei){
  if(!ei){
    return null
  }
  const ai = ei.abilities[0]
  return {
    disabled: ei.disabled,
    abilityInstance: ai,
    abilityType: type(ai),
    abilityState: state(ai),
    abilityUses: uses(ai),
    abilityBarValue: barValue(ai),
    abilityBarMax: barMax(ai),
    extreme: izExtreme(ei),
    next: isNext(ai)
  }
}

function type(ai){
  if(!ai){
    return 'none'
  }else if(ai.trigger.active){
    if(ai.fighterInstance.hasMod('silenced')){
      return 'none'
    }
    return 'active'
  }else{
    return 'nonactive'
  }
}

function state(ai){
  if(!ai){
    return 'none'
  }else if(ai.uses && !ai.usesRemaining){
    return 'out-of-uses'
  }else if(ai.cooldownRefreshing){
    return 'cooldown-refreshing'
  }else if(!ai.ready){
    return 'not-ready'
  }
  return 'ready'
}

function uses(ai){
  if(!ai){
    return 0
  }
  return ai.uses > 1 ? ai?.usesRemaining : 0
}

function barValue(ai){
  if(ai){
    if(ai.cooldown){
      return ai.cooldown - ai.cooldownRemaining
    }
  }
  return 0
}

function barMax(ai){
  if(ai){
    if(ai.cooldown){
      return ai.cooldown
    }
  }
  return 1
}

function isNext(ai){
  if(!ai){
    return false
  }
  return ai === ai.fighterInstance.getNextActiveAbility()
}

function izExtreme(ei){
  for(let ame of (ei.effect?.appliedMetaEffects ?? [])){
    if(ame.subjectKey === 'self'){
      return true
    }
  }
  return false
}