import { roundToFixed, wrap } from '../../../game/utilFunctions.js'
import physPowerIcon from '../../assets/icons/physPower.svg'
import magicPowerIcon from '../../assets/icons/magicPower.svg'

const HTML = (cooldown, name) => `
<span class="top-row">
  <span class="name">${name}</span> 
  <span class="cooldown subtitle"><i class="fa-solid fa-hourglass"></i> ${roundToFixed(cooldown / 1000, 2)}s</span>
</span>
<span class="description"></span>
`

export default class ActiveAbilityDescription extends HTMLElement{

  constructor(itemInstance){
    super()
    if(itemInstance){
      this.setItem(itemInstance)
    }
  }

  setItem(itemInstance){
    const aa = itemInstance.activeAbility
    if(!aa || !aa.actions){
      this.innerHTML = ''
      return
    }
    this.innerHTML = HTML(aa.cooldown, aa.displayName)
    this
      .querySelector('.description')
      .append(...aa.actions.map(action => makeActionRow(action, itemInstance.owner)))
  }
}

customElements.define('di-active-ability-description', ActiveAbilityDescription)

function makeActionRow(action, owner = null){

  let amount = action.damageMulti
  let showFlat = owner ? true : false
  if(showFlat){
    amount = Math.ceil(amount * owner.physPower)
  }

  const txt = `Attack for ${showFlat ? '' : 'x'}${damageWrap(action.damageType, amount)} damage`

  return wrap(txt, {
    class: 'action-row',
    allowHTML: true
  })
}

function damageWrap(damageType, amount){
  return `
<div class="damage-type damage-type-${damageType}">
  <img src="${damageType === 'phys' ? physPowerIcon : magicPowerIcon}">
  ${amount}
</div>
`
}