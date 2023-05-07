import { makeEl, roundToFixed } from '../../../game/utilFunctions.js'
import tippy from 'tippy.js'
import { ABILITY_DESCRIPTION_COLORS, ITEM_ROW_COLORS } from '../colors.js'
import DIElement from './diElement.js'

export default class AbilityDescription extends DIElement{

  setAbilityDisplayInfo(displayInfo){

    this.innerHTML = ''

    this.style.borderColor = ITEM_ROW_COLORS[displayInfo.type]
    this.style.backgroundColor = ABILITY_DESCRIPTION_COLORS[displayInfo.type]
    this.setAttribute('ability-type', displayInfo.type)

    this.innerHTML += displayInfo.descriptionHTML
    this.appendChild(makeBotRow(displayInfo))

    if(!this.inTooltip){
      tooltip(this.querySelector('.initial-cooldown'), 'Initial Cooldown / Cooldown')
      tooltip(this.querySelector('.cooldown'), 'Cooldown')
    }

    return this
  }
}

customElements.define('di-ability-description', AbilityDescription)

function makeBotRow(displayInfo){

  const row = makeEl({
    class: ['bot-row', 'flex-centered', 'flex-columns', 'flex-spaced']
  })

  let botLeftText = displayInfo.type === 'active' ? 'Active Ability' : ''
  if(displayInfo.ability.uses){
    botLeftText += (botLeftText.length ? ', ' : '')
    botLeftText += `${displayInfo.ability.uses} use${displayInfo.ability.uses > 1 ? 's' : ''}`
  }
  row.appendChild(makeEl({ text: botLeftText }))

  if(displayInfo.ability.cooldown){
    let str = ''
    if(displayInfo.ability.initialCooldown){
      str += d2(displayInfo.ability.cooldown - displayInfo.ability.initialCooldown) + '/'
    }
    str += d2(displayInfo.ability.cooldown)
    row.appendChild(makeEl({
      class: displayInfo.ability.initialCooldown ? 'initial-cooldown' : 'cooldown',
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