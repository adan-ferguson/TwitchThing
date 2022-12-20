import { makeEl, roundToFixed, toDisplayName } from '../../../game/utilFunctions.js'
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

    if(!displayInfo){
      this.classList.add('displaynone')
      return
    }

    this.style.borderColor = ITEM_ROW_COLORS[displayInfo.type]
    this.style.backgroundColor = ABILITY_DESCRIPTION_COLORS[displayInfo.type]
    this.setAttribute('ability-type', displayInfo.type)

    this.appendChild(displayInfo.descriptionEl)
    this.appendChild(makeBotRow(displayInfo))

    if(tooltips){
      // tippy(this.querySelector('.initial-cooldown'), {
      //   theme: 'light',
      //   content: 'Initial cooldown of the ability when combat starts'
      // })
      // tippy(this.querySelector('.cooldown'), {
      //   theme: 'light',
      //   content: 'Cooldown time of this ability'
      // })
      // TODO: description tooltips
    }

    return this
  }
}

customElements.define('di-ability-description', AbilityDescription)

function makeBotRow(ado){

  const row = makeEl({
    class: ['bot-row', 'flex-centered', 'flex-columns', 'flex-spaced']
  })

  row.appendChild(makeEl({ text: toDisplayName(ado.type) }))

  if(ado.ability.cooldown){
    let str = ''
    if(ado.ability.initialCooldown){
      debugger
      str += d2(ado.ability.initialCooldown) + '/'
    }
    str += d2(ado.ability.cooldown)
    row.appendChild(makeEl({
      class: ado.ability.initialCooldown ? 'initial-cooldown' : 'cooldown',
      content: '<i class="fa-solid fa-hourglass"></i>' + str
    }))
  }

  return row

  function d2(num){
    return roundToFixed(num / 1000, 1)
  }
}