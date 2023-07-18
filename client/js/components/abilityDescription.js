import { makeEl, roundToFixed, wrapContent } from '../../../game/utilFunctions.js'
import tippy from 'tippy.js'
import { ABILITY_DESCRIPTION_COLORS, ITEM_ROW_COLORS } from '../colors.js'
import DIElement from './diElement.js'
import { addTooltipToSvg, magicPowerIcon, pluralize } from './common.js'

export default class AbilityDescription extends DIElement{

  setAbilityDisplayInfo(displayInfo){

    this.innerHTML = ''

    this.style.borderColor = ITEM_ROW_COLORS[displayInfo.type]
    this.style.backgroundColor = ABILITY_DESCRIPTION_COLORS[displayInfo.type]
    this.setAttribute('ability-type', displayInfo.type)

    this.appendChild(wrapContent(displayInfo.descriptionHTML))
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

  const botLeftChunks = []
  if(displayInfo.type === 'active'){
    botLeftChunks.push('Active')
  }
  if(displayInfo.ability.uses && displayInfo.ability.trigger !== 'startOfCombat'){
    botLeftChunks.push(pluralize('use', displayInfo.ability.uses))
    if(displayInfo.ability.resetAfterCombat){
      botLeftChunks.push('per combat')
    }
  }
  if(displayInfo.ability.tags?.length){
    const tagsEls = tagsToIcons(displayInfo.ability.tags)
    if(tagsEls.length){
      botLeftChunks.push(tagsEls.join(''))
    }
  }
  if(botLeftChunks.length){
    row.appendChild(wrapContent(botLeftChunks.join(' ')))
  }

  if(displayInfo.cooldown){
    let str = ''
    if(displayInfo.initialCooldown){
      str += d2(displayInfo.cooldown - displayInfo.initialCooldown) + '/'
    }
    str += d2(displayInfo.cooldown)
    row.appendChild(makeEl({
      class: displayInfo.initialCooldown ? 'initial-cooldown' : 'cooldown',
      content: '<i class="fa-solid fa-hourglass"></i>' + str
    }))
  }else if(!botLeftChunks.length){
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

function tagsToIcons(tags){
  const icons = []
  tags.forEach(tag => {
    if(tag === 'spell'){
      icons.push(addTooltipToSvg(magicPowerIcon(), 'Spell'))
    }
  })
  return icons
}