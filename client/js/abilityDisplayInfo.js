import { parseDescriptionString } from './descriptionString.js'
import { silencedMod } from '../../game/mods/combined.js'
import { isArray } from 'lodash'

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
  const idle = !effectInstance.owner || effectInstance.owner.idle || false
  const stats = effectInstance.owner ? ability.parentEffect.exclusiveStats : null
  return {
    ability,
    trigger,
    type: trigger === 'active' ? 'active' : 'triggered',
    descriptionEl: descriptionEl(ability, stats),
    idle,
    state: idle ? AbilityState.IDLE : state(ability),
    barValue: idle ? 0 : barValue(ability),
    barMax: idle ? 1 : barMax(ability),
    cooldownRefreshing: ability.cooldownRefreshing,
    phantom: ability.phantom ? true : false
  }
}

function getMainAbility(abilities){
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

function descriptionEl(ability, useStats = null){
  const derived = deriveActionStrings(ability.actions)
  let str
  if(ability.description){
    str = ability.description.replace(/{A(\d+)}/g, (a, b, c) => {
      return derived[b]
    })
  }else{
    str = derived.filter(s => s).join(' ')
  }
  return parseDescriptionString(str, useStats)
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

function deriveActionStrings(actions){
  const strs = []
  derive(actions)
  function derive(actions){
    actions.forEach(action => {
      if(isArray(action)){
        return derive(action)
      }
      if(action.description){
        strs.push(action.description)
      }else if(action.type === 'attack'){
        strs.push(toAttackString(action))
      }else if(action.type === 'gainHealth'){
        strs.push(toGainHealthString(action))
      }else{
        strs.push('')
      }
    })
  }
  return strs
}

function toAttackString(action){
  const scaling = action.damageScaling === 'auto' ? action.damageType : action.damageScaling
  let valStr
  if(action.damageRange){
    valStr = `[${scaling}Attack${action.damageRange.min}] to [${scaling}Attack${action.damageRange.max}]`
  }else{
    valStr = `[${scaling}Attack${action.damageMulti}]`
  }
  return `Attack for ${valStr} ${action.damageType} damage.`
}

function toGainHealthString(action){
  if(action.scaling.magicPower){
    return `Recover [magicScaling${action.scaling.magicPower}] health.`
  }
  return 'Recover <BUGGED AMOUNT LOL> health.'
}