import DIElement from './diElement.js'
import { roundToFixed, roundToNearestIntervalOf, wrapContent, wrapText } from '../../../game/utilFunctions.js'
import { attachedItem, attachedSkill, orbEntries } from './common.js'
import AdventurerItem from '../../../game/items/adventurerItem.js'
import Stats from '../../../game/stats/stats.js'
import StatsList from './stats/statsList.js'
import AbilityDescription from './abilityDescription.js'
import { StatsDisplayStyle } from '../displayInfo/statsDisplayInfo.js'
import { getAbilityDisplayInfoForObj } from '../displayInfo/abilityDisplayInfo.js'

export default class EffectDetails extends DIElement{

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
    this._addConditions()
    this._addMeta()
    this._addAbilities()
    // this._addDescription()
    this._addStats()
    this._addLoadoutModifiers()
    this._addDuration()
    // this._addUsesRemaining()
  }

  _addConditions(){
    const conditions = this._obj.conditions
    if(!conditions){
      return
    }
    if(conditions.deepestFloor){
      this.appendChild(wrapText('While exploring this Adventurer\'s deepest floor:'))
    }
  }

  _addMeta(){
    const metaEffect = this._obj.effectData.metaEffect
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

  _addAbilities(){
    const infos = getAbilityDisplayInfoForObj(this._obj)
    infos.filter(i => i).forEach(adi => {
      this.appendChild(new AbilityDescription().setAbilityDisplayInfo(adi))
    })
  }

  _addStats(){
    const stats = this._obj.effectData.stats
    if(stats){
      this.appendChild(
        new StatsList().setOptions({
          statsDisplayStyle: StatsDisplayStyle.ADDITIONAL,
          stats: new Stats(stats)
        })
      )
    }
  }

  _addDuration(){
    const chunks = []
    if(this._obj.duration){
      chunks.push(roundToNearestIntervalOf(this._obj.duration/1000, 0.01) + 's')
    }
    if(this._obj.persisting){
      chunks.push('Persisting')
    }
    if(chunks.length){
      this.appendChild(wrapText(chunks.join(', ')))
    }
  }

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

customElements.define('di-effect-details', EffectDetails)

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