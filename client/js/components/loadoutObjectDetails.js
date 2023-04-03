import AbilityDescription from './abilityDescription.js'
import StatsList from './stats/statsList.js'
import { StatsDisplayStyle } from '../statsDisplayInfo.js'
import DIElement from './diElement.js'
import { parseDescriptionString } from '../descriptionString.js'
import { wrapContent } from '../../../game/utilFunctions.js'
import { orbEntries, orbEntry } from './common.js'
import AdventurerSkill from '../../../game/skills/adventurerSkill.js'
import AdventurerItem from '../../../game/adventurerItem.js'
import { loadoutObjectDisplayInfo } from '../loadoutObjectDisplayInfo.js'

export default class LoadoutObjectDetails extends DIElement{

  get defaultOptions(){
    return {
      showTooltips: false,
    }
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
    // this._addAbilityDescription()
    // this._addDescription()
    // this._addStats()
    this._addLoadoutModifiers()
  }

  _addLoadoutModifiers(){
    // const loadoutModifiersOverride = loadoutObjectDisplayInfo(this._obj)?.loadoutModifiers
    if (!this._obj.loadoutModifiers){
      return
    }

    for (let subjectKey in this._obj.loadoutModifiers){
      for (let modifierKey in this._obj.loadoutModifiers[subjectKey]){
        const el = loadoutModifierToEl(subjectKey, modifierKey, this._obj.loadoutModifiers[subjectKey][modifierKey])
        if(el){
          this.appendChild(el)
        }
      }
    }
  }

  // _addAbilityDescription(){
  //   if(this._effectInstance.hasAbilities){
  //     const desc = new AbilityDescription().setItem(this._effectInstance, this._options.showTooltips)
  //     if(desc){
  //       this.appendChild(desc)
  //     }
  //   }
  // }
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

function loadoutModifierToEl(subjectKey, modifierKey, value){

  let html = ''
  if(subjectKey === 'self'){
    html += 'This '
  }else if(subjectKey === 'allItems'){
    html += 'All items '
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
    }
  }

  if(html){
    return wrapContent(html)
  }
}