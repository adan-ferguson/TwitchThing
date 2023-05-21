import DIElement from './diElement.js'
import { roundToNearestIntervalOf, wrapContent, wrapText } from '../../../game/utilFunctions.js'
import { attachedItem, attachedSkill, neighbouring, orbEntries, wrapStat } from './common.js'
import AdventurerItem from '../../../game/items/adventurerItem.js'
import Stats from '../../../game/stats/stats.js'
import StatsList from './stats/statsList.js'
import AbilityDescription from './abilityDescription.js'
import { StatsDisplayStyle } from '../displayInfo/statsDisplayInfo.js'
import { getAbilityDisplayInfoForObj } from '../displayInfo/abilityDisplayInfo.js'
import { modDisplayInfo } from '../displayInfo/modDisplayInfo.js'

export default class EffectDetails extends DIElement{

  get defaultOptions(){
    return {
      showTooltips: false,
    }
  }

  get isItem(){
    return this._obj instanceof AdventurerItem || this._obj?.obj instanceof AdventurerItem
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
    this._addStats()
    this._addMods()
    this._addLoadoutModifiers()
    this._addDuration()
  }

  _addConditions(){
    const conditions = this._obj.conditions
    if(!conditions){
      return
    }
    if(conditions.deepestFloor){
      this.appendChild(wrapText('While on this adventurer\'s deepest explored floor:'))
    }
  }

  _addMeta(){
    const metaEffect = this._obj.effectData.metaEffect
    if(!metaEffect){
      return
    }
    for(let subjectKey in metaEffect){
      const el = metaToEl(subjectKey, metaEffect[subjectKey], this.isItem)
      if(el){
        this.appendChild(el)
      }
    }
  }

  _addLoadoutModifiers(){
    const baseObj = this._obj.obj ?? this._obj
    const loadoutModifiers = baseObj.loadoutModifiers
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
    const stats = new Stats(this._obj.stats)
    if(!stats.isEmpty){
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

  _addMods(){
    this._obj.totalMods.forEach(mod => {
      const mdi = modDisplayInfo(mod)
      if(mdi.description){
        this.appendChild(wrapText(mdi.description))
      }
    })
  }
}

customElements.define('di-effect-details', EffectDetails)

function loadoutModifierToEl(subjectKey, modifierKey, value, isItem){

  const placeholders = []
  let html = subjectDescription(subjectKey, isItem)

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

function metaToEl(subjectKey, metaEffect, isItem){
  const chunks = []
  chunks.push(subjectDescription(subjectKey, isItem))

  const subchunks = []
  if(metaEffect.exclusiveStats){
    let statHtml = 'benefits from '
    for(let statKey in metaEffect.exclusiveStats){
      statHtml += wrapStat(statKey, metaEffect.exclusiveStats[statKey])
    }
    subchunks.push(statHtml)
  }
  if(metaEffect.exclusiveMods){
    metaEffect.exclusiveMods.forEach(mod => {
      const mdi = modDisplayInfo(mod)
      if(mdi.metaDescription){
        subchunks.push(mdi.metaDescription)
      }
    })
  }
  if(subchunks.length){
    chunks.push(subchunks.join(' and '))
  }

  return chunks.length ? wrapContent(chunks.join(' ')) : null
}

function subjectDescription(subjectKey, isItem){
  if(subjectKey === 'self'){
    return 'This '
  }else if(subjectKey === 'allItems'){
    return 'Each equipped item '
  }else if(subjectKey === 'attached'){
    const icon = isItem ? attachedSkill() : attachedItem()
    return `${icon} Attached ${isItem ? 'skill' : 'item'} `
  }else if(subjectKey === 'neighbouring'){
    return`${neighbouring()} Neighbouring ${isItem ? 'Items' : 'Skills'} `
  }
  return ''
}