import physPowerIcon from '../assets/icons/physPower.svg'
import magicPowerIcon from '../assets/icons/magicPower.svg'
import { wrap } from '../../game/utilFunctions.js'

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
    })
  }
}

function attackDescription(action, owner){
  let amount = action.damageMulti
  let showFlat = owner ? true : false
  if(showFlat){
    amount = Math.ceil(amount * owner.physPower)
  }
  const txt = `Attack for ${showFlat ? '' : 'x'}${damageWrap(action.damageType, amount)} damage`
  return descWrap(txt)
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