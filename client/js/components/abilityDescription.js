import { roundToFixed, toArray, wrap } from '../../../game/utilFunctions.js'
import AbilityDisplayInfo from '../abilityDisplayInfo.js'
import actionIcon from '../../assets/icons/action.svg'
import tippy from 'tippy.js'

const HTML = (actionTime, cooldown) => `
<span class="description"></span>
<div class="bot-row">
  <span class="action-time subtitle${actionTime === 1 ? ' displaynone' : ''}"><img src="${actionIcon}">${actionTime * 100}%</span>
  <span class="cooldown subtitle"><i class="fa-solid fa-hourglass"></i>${roundToFixed(cooldown / 1000, 2)}s</span>
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

    this.innerHTML = HTML(displayInfo.actionTimeMultiplier, displayInfo.cooldown)

    tippy(this.querySelector('.action-time'), {
      theme: 'light',
      content: 'Next action time is multiplied by this'
    })

    tippy(this.querySelector('.cooldown'), {
      theme: 'light',
      content: 'Cooldown time of this ability'
    })

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
