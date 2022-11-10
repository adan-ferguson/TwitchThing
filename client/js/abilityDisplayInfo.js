import { parseDescriptionString } from './descriptionString.js'
import { silencedMod } from '../../game/mods/combined.js'

export const AbilityState = {
  NONE: 'none',
  DISABLED: 'disabled',
  READY: 'ready',
  RECHARGING: 'recharging',
  IDLE: 'idle'
}

export default function(effectInstance){
  const { ability, trigger } = getMainAbility(effectInstance.abilities)
  if(!ability){
    return null
  }
  const idle = !effectInstance.fighterInstance || effectInstance.fighterInstance.idle
  return {
    ability,
    trigger,
    type: trigger === 'active' ? 'active' : 'triggered',
    descriptionEl: descriptionEl(ability),
    idle,
    state: idle ? AbilityState.IDLE : state(ability),
    barValue: idle ? 0 : barValue(ability),
    barMax: idle ? 1 : barMax(ability)
  }
}

function getMainAbility(abilities){
  const active = abilities.active
  if(active){
    return { trigger: 'active', ability: active }
  }
  const trigger = Object.keys(abilities)[0]
  if(!trigger){
    return {}
  }
  return { trigger, ability: abilities[trigger] }
}

function descriptionEl(ability){
  const descStr = ability.description ?? deriveDescriptionString(ability)
  if(descStr){
    return parseDescriptionString(descStr, ability.parentEffect.exclusiveStats)
  }
  return null
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
  return 0
}

function deriveDescriptionString(ability){
  const chunks = []
  ability.actions.forEach(a => {
    if(a.description){
      chunks.push(a.description)
    }else if(a.type === 'attack'){
      chunks.push(toAttackString(a))
    }
  })
  return chunks.join(' ')
}

function toAttackString(action){
  const scaling = action.damageScaling === 'auto' ? action.damageType : action.damageScaling
  return `Attack for [${scaling}Attack${action.damageMulti}] ${action.damageType} damage.`
}

