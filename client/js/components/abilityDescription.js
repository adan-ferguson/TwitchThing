import { roundToFixed, toArray, wrap } from '../../../game/utilFunctions.js'
import AbilityDisplayInfo from '../abilityDisplayInfo.js'
import actionIcon from '../../assets/icons/action.svg'
import tippy from 'tippy.js'

const HTML = (actionTime, cooldown, initialCooldown = 0) => {
  return `
  <span class="description"></span>
  <div class="bot-row">
    <span class="initial-cooldown${!initialCooldown ? ' displaynone' : ''}"><i class="fa-solid fa-lock"></i>${roundToFixed(initialCooldown / 1000, 2)}s</span>
    <span class="cooldown${!cooldown ? ' displaynone' : ''}"><i class="fa-solid fa-hourglass"></i>${roundToFixed(cooldown / 1000, 2)}s</span>
  </div>
  `
}

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

    this.innerHTML = HTML(displayInfo.actionTimeMultiplier, displayInfo.cooldown, displayInfo.initialCooldown)

    tippy(this.querySelector('.initial-cooldown'), {
      theme: 'light',
      content: 'Initial cooldown of the ability when combat starts'
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
