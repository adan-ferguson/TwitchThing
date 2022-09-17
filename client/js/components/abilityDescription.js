import { roundToFixed, toArray, wrap } from '../../../game/utilFunctions.js'
import AbilityDisplayInfo from '../abilityDisplayInfo.js'

const HTML = (cooldown) => `
<span class="description"></span>
<div>
  <span class="cooldown subtitle"><i class="fa-solid fa-hourglass"></i> ${roundToFixed(cooldown / 1000, 2)}</span>
</div>
`

export default class AbilityDescription extends HTMLElement{

  constructor(itemInstance){
    super()
    if(itemInstance){
      this.setItem(itemInstance)
    }
  }

  setItem(itemInstance){
    const displayInfo = new AbilityDisplayInfo(itemInstance.ability, itemInstance.owner)
    if(displayInfo.noAbility){
      this.innerHTML = ''
      this.classList.add('displaynone')
      return
    }
    this.setAttribute('ability-type', displayInfo.type)
    this.innerHTML = HTML(displayInfo.cooldown)
    const desc = this.querySelector('.description')

    if(displayInfo.triggerText){
      desc.append(wrap(displayInfo.triggerText + ':', {
        class: 'trigger-text'
      }))
    }

    desc.append(...toArray(displayInfo.actionDescriptions))
  }
}

customElements.define('di-ability-description', AbilityDescription)
