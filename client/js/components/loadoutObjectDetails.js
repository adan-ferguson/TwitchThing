import DIElement from './diElement.js'
import { wrapContent } from '../../../game/utilFunctions.js'
import { attachedItem, attachedSkill, orbEntries } from './common.js'
import AdventurerItem from '../../../game/adventurerItem.js'
import Stats from '../../../game/stats/stats.js'
import StatsList from './stats/statsList.js'
import { loadoutObjectDisplayInfo } from '../loadoutObjectDisplayInfo.js'
import AbilityDescription from './abilityDescription.js'
import { getIdleAbilityDisplayInfo } from '../abilityDisplayInfo.js'

export default class LoadoutObjectDetails extends DIElement{

  get defaultOptions(){
    return {
      showTooltips: false,
    }
  }

  get isItem(){
    return this._obj instanceof AdventurerItem
  }

  setObject(obj){
    this._obj = obj
    this._update()
    return this
  }

  _update(){
    this.innerHTML = ''
    if(!this._obj){
      return
    }
    this._addMeta()
    this._addAbility()
    // this._addDescription()
    // this._addStats()
    this._addLoadoutModifiers()
  }

  _addMeta(){
    const metaEffect = this._obj.effect.metaEffect
    if(!metaEffect){
      return
    }
    for(let subjectKey in metaEffect){
      for(let modifierKey in metaEffect[subjectKey]){
        const el = loadoutModifierToEl(subjectKey, modifierKey, metaEffect[subjectKey][modifierKey], this.isItem)
        if(el){
          this.appendChild(el)
        }
      }
    }
  }

  _addLoadoutModifiers(){
    const loadoutModifiers = this._obj.loadoutModifiers
    if (!loadoutModifiers){
      return
    }

    for (let subjectKey in loadoutModifiers){
      for (let modifierKey in loadoutModifiers[subjectKey]){
        const el = loadoutModifierToEl(subjectKey, modifierKey, loadoutModifiers[subjectKey][modifierKey], this.isItem)
        if(el){
          this.appendChild(el)
        }
      }
    }
  }

  _addAbility(){
    const info = getIdleAbilityDisplayInfo(this._obj)
    if(info){
      this.appendChild(new AbilityDescription().setAbilityDisplayInfo(info))
    }
  }
  //
  // _addStats(){
  //   const statsList = new StatsList()
  //   statsList.setOptions({
  //     // showTooltips: false,
  //     statsDisplayStyle: StatsDisplayStyle.ADDITIONAL
  //   })
  //   if(!this._effectInstance.effectData.scaledStats){
  //     statsList.setStats(this._effectInstance.stats)
  //   }
  //   if(!statsList.empty){
  //     this.appendChild(statsList)
  //   }
  // }
  //
  // _addDescription(){
  //   const description = parseDescriptionString(this._effectInstance.description ?? '')
  //   description.classList.add('effect-description')
  //   this._effectInstance.mods.list.forEach(mod => {
  //     if(mod.description){
  //       description.append(wrapContent(mod.description))
  //     }
  //   })
  //   if(description.innerHTML.length){
  //     this.appendChild(description)
  //   }
  // }

}

customElements.define('di-loadout-object-details', LoadoutObjectDetails)

function loadoutModifierToEl(subjectKey, modifierKey, value, isItem){

  const placeholders = []
  let html = ''
  if(subjectKey === 'self'){
    html += 'This '
  }else if(subjectKey === 'allItems'){
    html += 'Each equipped item '
  }else if(subjectKey === 'attached'){
    html += isItem ? attachedSkill() : attachedItem()
    html += `Attached ${isItem ? 'item' : 'skill'} `
  }else if(subjectKey === 'neighbouring'){
    html += `Neighbouring ${isItem ? 'items' : 'skills'} `
  }

  if(modifierKey === 'orbs'){
    const key = Object.keys(value)[0]
    let moreOrLess = 'more'
    value = { ...value }
    if(value[key] < 0){
      value[key] *= -1
      moreOrLess = 'less'
    }
    html += `cost ${orbEntries(value)} ${moreOrLess}.`
  }else if(modifierKey === 'restrictions'){
    if(value.slot){
      html += `must be in slot ${value.slot}.`
    }else if(value.empty){
      html += ' must be empty.'
    }
  }
  // else if(modifierKey === 'stats'){
  //   // wrapStat()
  //   placeholders.push(new StatsList().setOptions({ inline: true, stats: new Stats(value) }))
  //   html += `benefits from <div class="placeholder-${placeholders.length - 1}"></div>`
  // }

  if(html){
    const el = wrapContent(html)
    placeholders.forEach((ph, i) => {
      el.querySelector('.placeholder-' + i).replaceWith(placeholders[i])
    })
    return el
  }
}