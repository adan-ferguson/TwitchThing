import { makeEl, roundToFixed } from '../../../game/utilFunctions.js'
import tippy from 'tippy.js'
import abilityDisplayInfo from '../abilityDisplayInfo.js'
import { ABILITY_DESCRIPTION_COLORS, ITEM_ROW_COLORS } from '../colors.js'

export default class AbilityDescription extends HTMLElement{

  constructor(itemInstance){
    super()
    if(itemInstance){
      this.setItem(itemInstance)
    }
  }

  setItem(itemInstance, tooltips = false){

    const displayInfo = abilityDisplayInfo(itemInstance)
    this.innerHTML = ''

    if(!displayInfo || displayInfo.phantom){
      this.classList.add('displaynone')
      return
    }

    this.style.borderColor = ITEM_ROW_COLORS[displayInfo.type]
    this.style.backgroundColor = ABILITY_DESCRIPTION_COLORS[displayInfo.type]
    this.setAttribute('ability-type', displayInfo.type)

    this.appendChild(displayInfo.descriptionEl)
    this.appendChild(makeBotRow(displayInfo))

    if(tooltips){
      tooltip(this.querySelector('.initial-cooldown'), 'Initial Cooldown / Cooldown')
      tooltip(this.querySelector('.cooldown'), 'Cooldown')
    }

    return this
  }
}

customElements.define('di-ability-description', AbilityDescription)

function makeBotRow(adi){

  const row = makeEl({
    class: ['bot-row', 'flex-centered', 'flex-columns', 'flex-spaced']
  })

  let botLeftText = adi.type === 'active' ? 'Active' : ''
  if(adi.ability.uses){
    botLeftText += (botLeftText.length ? ', ' : '')
    botLeftText += `${adi.ability.uses} use${adi.ability.uses > 1 ? 's' : ''}`
  }
  row.appendChild(makeEl({ text: botLeftText }))

  if(adi.ability.cooldown){
    let str = ''
    if(adi.ability.initialCooldown){
      str += d2(adi.ability.cooldown - adi.ability.initialCooldown) + '/'
    }
    str += d2(adi.ability.cooldown)
    row.appendChild(makeEl({
      class: adi.ability.initialCooldown ? 'initial-cooldown' : 'cooldown',
      content: '<i class="fa-solid fa-hourglass"></i>' + str
    }))
  }else if(!botLeftText){
    row.classList.add('displaynone')
  }

  return row

  function d2(num){
    return roundToFixed(num / 1000, 1)
  }
}

function tooltip(el, content){
  if(!el){
    return
  }
  tippy(el, {
    theme: 'light',
    content
  })
  el.classList.add('clickable')
}