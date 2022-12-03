import { roundToFixed } from '../../../game/utilFunctions.js'
import tippy from 'tippy.js'
import abilityDisplayInfo from '../abilityDisplayInfo.js'

const HTML = (cooldown, initialCooldown = 0) => {
  return `
  <span class="description"></span>
  <div class="bot-row">
    <span class="initial-cooldown${!initialCooldown ? ' displaynone' : ''}"><i class="fa-solid fa-lock"></i>${roundToFixed(initialCooldown / 1000, 2)}s</span>
    <span class="cooldown${!cooldown ? ' displaynone' : ''}"><i class="fa-solid fa-hourglass"></i>${roundToFixed(cooldown / 1000, 2)}s</span>
  </div>
  `
}

export default class AbilityDetails extends HTMLElement{

  constructor(itemInstance){
    super()
    if(itemInstance){
      this.setItem(itemInstance)
    }
  }

  setItem(itemInstance, tooltips = false){

    const displayInfo = abilityDisplayInfo(itemInstance)

    if(!displayInfo){
      this.innerHTML = ''
      this.classList.add('displaynone')
      return
    }

    this.setAttribute('ability-type', displayInfo.type)
    this.innerHTML = HTML(displayInfo.ability.cooldown, displayInfo.ability.initialCooldown)

    const descriptionEl = displayInfo.descriptionEl
    if(descriptionEl){
      this.querySelector('.description').appendChild(descriptionEl)
    }

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

    return this
  }
}

customElements.define('di-ability-description', AbilityDetails)