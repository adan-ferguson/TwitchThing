import { roundToFixed } from '../../../game/utilFunctions.js'
import AbilityDisplayInfo from '../abilityDisplayInfo.js'
import tippy from 'tippy.js'

const HTML = (cooldown, initialCooldown = 0) => {
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

  setItem(itemInstance, tooltips = false){

    if(!itemInstance.hasAbilities){
      this.innerHTML = ''
      this.classList.add('displaynone')
      return
    }

    const displayInfo = new AbilityDisplayInfo(itemInstance)
    this.setAttribute('ability-type', displayInfo.type)
    this.innerHTML = HTML(displayInfo.mainAbility.instance.cooldown, displayInfo.mainAbility.instance.initialCooldown)

    const descriptionEl = this.querySelector('.description')
    descriptionEl.innerHTML = displayInfo.descriptionHTML

    if(tooltips){
      tippy(this.querySelector('.initial-cooldown'), {
        theme: 'light',
        content: 'Initial cooldown of the ability when combat starts'
      })
      tippy(this.querySelector('.cooldown'), {
        theme: 'light',
        content: 'Cooldown time of this ability'
      })
      // TODO: description tooltips
    }
  }
}

customElements.define('di-ability-description', AbilityDescription)
