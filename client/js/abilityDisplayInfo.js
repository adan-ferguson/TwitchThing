import physPowerIcon from '../assets/icons/physPower.svg'
import magicPowerIcon from '../assets/icons/magicPower.svg'
import { roundToFixed, wrapContent } from '../../game/utilFunctions.js'
import { expandStatusEffectsDef } from '../../game/statusEffectsData.js'

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
    // Hardcoded descriptions
    if(this.mainAbility.instance.name === 'dodgeOne'){
      return 'Automatically dodge an attack.'
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
    amount = Math.ceil(amount * owner.physPower)
  }
  return `Attack for ${showFlat ? '' : 'x'}${damageWrap(action.damageType, amount)} damage.`
}

function statusEffectDescription(action, owner){
  const data = expandStatusEffectsDef(owner, action.effect)
  if(data.name === 'poisoned'){
    return `Poisons the target for ${damageWrap('magic', data.params.dps)} dps for ${data.duration / 1000} seconds.`
  }

  // if(action.effect.id === 'spiderweb'){
  //   return descWrap(`Slows ${targetString(action.affects)}, increasing their turn time by ${action.effect.stats.slow/1000}s. Lasts ${durationString(action.effect.duration)}`)
  // }else if(action.effect.id === 'stun'){
  //   return descWrap(`Stuns the target for ${roundToFixed(action.effect.duration/1000, 2)}s`)
  // }
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

function damageWrap(damageType, amount){
  return `
<span class="damage-type damage-type-${damageType}">
  <img src="${damageType === 'phys' ? physPowerIcon : magicPowerIcon}">
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