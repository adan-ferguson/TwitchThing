import { roundToFixed, wrapContent } from '../../game/utilFunctions.js'
import healthIcon from '../assets/icons/health.svg'
import physPower from '../assets/icons/physPower.svg'
import magicPower from '../assets/icons/magicPower.svg'
import { parseAbilityDescriptionString } from './abilityDescription.js'
import { silencedMod } from '../../game/mods/combined.js'

const ICONS = {
  magic: magicPower,
  phys: physPower,
  health: healthIcon
}

export const AbilityState = {
  NONE: 'none',
  DISABLED: 'disabled',
  READY: 'ready',
  RECHARGING: 'recharging'
}

export default class AbilityDisplayInfo{
  constructor(effectInstance){
    this._abilities = effectInstance.abilities
    this._owner = effectInstance.owner
  }

  get noAbility(){
    return !this.mainAbility
  }

  get mainAbility(){
    const active = this._abilities.active
    if(active){
      return { type: 'active', instance: active }
    }
    const type = Object.keys(this._abilities)[0]
    if(!type){
      return null
    }
    return { type, instance: this._abilities[type] }
  }

  get type(){
    if(this.noAbility){
      return 'none'
    }
    return this.mainAbility.type === 'active' ? 'active' : 'triggered'
  }

  get descriptionHTML(){
    if(this.mainAbility.instance.description){
      return toHTML(this.mainAbility.instance.description, this._owner)
    }
    // Derived descriptions
    // TODO: add the trigger
    return this.mainAbility.instance.actions.map(action => {
      if(action.type === 'attack'){
        return attackDescription(action, this._owner)
      }
      if(action.type === 'gainHealth'){
        return gainHealthDescription(action, this._owner)
      }
      // if(action.type === 'effect'){
      //   return effectAction(action, this._owner)
      // }
      // if(action.type === 'time'){
      //   return timeAction(action.ms)
      // }
    }).join(' ')
  }

  get state(){
    if(!this.mainAbility){
      return AbilityState.NONE
    }else if(this._owner.mods.contains(silencedMod)){
      return AbilityState.DISABLED
    }else if(this.mainAbility.instance.ready){
      return AbilityState.READY
    }else if(this.mainAbility.instance.enabled){
      return AbilityState.RECHARGING
    }
    return AbilityState.DISABLED
  }

  get barPct(){
    if(!this.mainAbility || this.state === AbilityState.DISABLED){
      return 0
    }
    if(this.mainAbility.instance.cooldown){
      return 1 - this.mainAbility.instance.cooldownRemaining / this.mainAbility.instance.cooldown
    }else if(this.mainAbility.instance.uses){
      return 1 - this.mainAbility.instance.timesUsed / this.mainAbility.instance.uses
    }
    return 0
  }
}

function toHTML(description, owner){
  const { chunks, props } = parseAbilityDescriptionString(description)
  let formatted = ''
  chunks.forEach((chunk, i) => {
    if(i !== 0){
      let { type, val } = props[i-1]
      if(type === 'P'){
        val *= owner.physPower
      }else if(type === 'M'){
        val *= owner.magicPower
      }
      formatted += scalingWrap(type === 'P' ? 'phys' : 'magic', val)
    }
    formatted += `<span>${chunk}</span>`
  })
  return formatted
}

function attackDescription(action, owner){
  let amount = action.damageMulti
  let showFlat = owner ? true : false
  if(showFlat){
    amount = Math.ceil(amount * owner[action.damageType + 'Power'])
  }
  return `Attack for ${showFlat ? '' : 'x'}${scalingWrap(action.damageType, amount)} damage.`
}

function gainHealthDescription(action, owner){
  const strs = []
  if(action.magicScaling){
    strs.push(`Restore ${scalingWrap('magic', action.magicScaling * owner.magicPower)} health.`)
  }
  if(action.pct){
    strs.push(`Restore ${scalingWrap('health', action.pct * owner.hpMax)} health.`)
  }
  return strs.join(' ')
}

function timeAction(ms){
  if(ms > 0){
    return descWrap(`User's next turn is ${roundToFixed(ms/1000, 2)}s faster`)
  }
  return descWrap(`User's next turn is ${roundToFixed(ms/-1000, 2)}s slower`)
}

function descWrap(txt){
  return wrapContent(txt, {
    elementType: 'span',
    class: 'action-description',
    allowHTML: true
  })
}

function scalingWrap(damageType, amount){
  return `
<span class="scaling-type scaling-type-${damageType}">
  <img src="${ICONS[damageType]}">
  ${amount}
</span>
`
}

function targetString(affectsVal, type = 0){
  return affectsVal === 'enemy' ? 'the enemy' : 'yourself'
}

function durationString(duration){
  if(duration === 'combat'){
    return 'until the end of combat.'
  }
  return `for ${roundToFixed(duration / 1000, 2)} seconds`
}