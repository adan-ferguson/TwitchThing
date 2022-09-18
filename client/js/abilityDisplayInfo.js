import physPowerIcon from '../assets/icons/physPower.svg'
import magicPowerIcon from '../assets/icons/magicPower.svg'
import { roundToFixed, wrap } from '../../game/utilFunctions.js'

export default class AbilityDisplayInfo{
  constructor(ability, owner = null){
    if(!ability){
      return
    }
    this._ability = ability
    this._owner = owner
  }

  get noAbility(){
    return this._ability ? false : true
  }

  get type(){
    return this._ability.type
  }

  get cooldown(){
    return this._ability.cooldown ?? null
  }

  get initialCooldown(){
    return this._ability.initialCooldown ?? null
  }

  get actionTimeMultiplier(){
    return this._ability?.actionTime ?? 1
  }

  get triggerText(){
    return null
  }

  get actionDescriptions(){
    if(this._ability.name === 'dodge'){
      return descWrap('Automatically dodge an enemy action.')
    }
    return this._ability.actions.map(action => {
      if(action.type === 'attack'){
        return attackDescription(action, this._owner)
      }
      if(action.type === 'effect'){
        return effectAction(action, this._owner)
      }
    })
  }
}

function attackDescription(action, owner){
  let amount = action.damageMulti
  let showFlat = owner ? true : false
  if(showFlat){
    amount = Math.ceil(amount * owner.physPower)
  }
  return descWrap(`Attack for ${showFlat ? '' : 'x'}${damageWrap(action.damageType, amount)} damage.`)
}

function effectAction(action, owner){
  if(action.effect.type === 'slow'){
    return descWrap(`Slow ${targetString(action.affects)} by ${toPct(action.effect.amount)} ${durationString(action.effect.duration)}`)
  }
}

function descWrap(txt){
  return wrap(txt, {
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

function toPct(amount){
  return amount * 100 + '%'
}

function durationString(duration){
  if(duration === 'combat'){
    return 'until the end of combat.'
  }
  return `for ${roundToFixed(duration / 1000, 2)} seconds.`
}