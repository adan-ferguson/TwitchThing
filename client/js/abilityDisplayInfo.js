import { roundToFixed, wrapContent } from '../../game/utilFunctions.js'
import { expandStatusEffectsDef } from '../../game/statusEffectsData.js'
import healthIcon from '../assets/icons/health.svg'
import physPower from '../assets/icons/physPower.svg'
import magicPower from '../assets/icons/magicPower.svg'

const ICONS = {
  magic: magicPower,
  phys: physPower,
  health: healthIcon
}

export default class AbilityDisplayInfo{
  constructor(abilities, owner = null){
    this._abilities = abilities
    this._owner = owner
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
      return this.mainAbility.instance.description
    }
    // Derived descriptions
    // TODO: add the trigger
    return this.mainAbility.instance.actions.map(action => {
      if(action.type === 'attack'){
        return attackDescription(action, this._owner)
      }
      if(action.type === 'statusEffect'){
        return statusEffectDescription(action, this._owner)
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
}

function attackDescription(action, owner){
  let amount = action.damageMulti
  let showFlat = owner ? true : false
  if(showFlat){
    amount = Math.ceil(amount * owner[action.damageType + 'Power'])
  }
  return `Attack for ${showFlat ? '' : 'x'}${scalingWrap(action.damageType, amount)} damage.`
}

function statusEffectDescription(action, owner){
  const data = expandStatusEffectsDef(owner, action.effect)
  if(data.name === 'poisoned'){
    return `Poisons the target for ${scalingWrap('magic', data.params.dps)} dps for ${data.duration / 1000} seconds.`
  }
  if(data.name === 'barrier'){
    return `Gain a barrier that blocks ${scalingWrap('magic', data.params.barrierPoints)} damage.`
  }
}

function gainHealthDescription(action, owner){
  const strs = []
  if(action.scaledPower){
    strs.push(`Restore ${scalingWrap('magic', action.scaledPower * owner.magicPower)} health.`)
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