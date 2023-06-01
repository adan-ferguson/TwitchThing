import DIElement from './diElement.js'
import { roundToNearestIntervalOf, wrapContent, wrapText } from '../../../game/utilFunctions.js'
import { activeAbility, isAdventurerItem, orbEntries, wrapStats } from './common.js'
import Stats from '../../../game/stats/stats.js'
import StatsList from './stats/statsList.js'
import AbilityDescription from './abilityDescription.js'
import { StatsDisplayStyle } from '../displayInfo/statsDisplayInfo.js'
import { getAbilityDisplayInfoForObj } from '../displayInfo/abilityDisplayInfo.js'
import { modDisplayInfo } from '../displayInfo/modDisplayInfo.js'
import { metaEffectDisplayInfo } from '../displayInfo/metaEffectDisplayInfo.js'
import { subjectDescription } from '../subjectClientFns.js'
import { effectDisplayInfo } from '../displayInfo/effectDisplayInfo.js'

export default class EffectDetails extends DIElement{

  get defaultOptions(){
    return {
      showTooltips: false,
    }
  }

  get isItem(){
    return isAdventurerItem(this._obj)
  }

  setObject(obj, isMeta = false){
    this._obj = obj
    this._isMeta = isMeta
    this._update()
    return this
  }

  _update(){
    this.innerHTML = ''
    if(!this._obj){
      return
    }
    this._addAbilities()
    this._addStats()
    this._addExclusiveStats()
    this._addMeta()
    this._addMods()
    this._addLoadoutModifiers()
    this._addDescription()
  }

  _addMeta(){
    const metaEffects = this._obj.metaEffects ?? []
    metaEffects.forEach(metaEffect => {
      const el = metaEffectDisplayInfo(metaEffect, this._obj)
      if(el){
        this.appendChild(el)
      }
    })
  }

  _addLoadoutModifiers(){
    const loadoutModifiers = this._obj.loadoutModifiers ?? {}
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
    const stats = new Stats(this._obj.stats ?? {})
    if(!stats.isEmpty){
      this.appendChild(
        new StatsList().setOptions({
          statsDisplayStyle: StatsDisplayStyle.ADDITIONAL,
          stats: new Stats(stats)
        })
      )
    }
  }

  _addExclusiveStats(){
    if(!this._isMeta){
      return
      // TODO: ?
    }
    const stats = new Stats(this._obj.exclusiveStats ?? {})
    if(!stats.isEmpty){
      this.appendChild(wrapContent('Benefits from ' + wrapStats(stats)))
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
    [...(this._obj.exclusiveMods ?? []), ...(this._obj.mods ?? [])].forEach(mod => {
      const mdi = modDisplayInfo(mod)
      if(mdi.description && !this._isMeta){
        this.appendChild(wrapText(mdi.description))
      }else if(mdi.metaDescription && this._isMeta){
        this.appendChild(wrapText(mdi.metaDescription))
      }
    })
  }

  _addDescription(){
    const edi = effectDisplayInfo(this._obj)
    if(edi.description){
      this.appendChild(wrapText(edi.description))
    }
  }
}

customElements.define('di-effect-details', EffectDetails)

function loadoutModifierToEl(subjectKey, modifierKey, value, isItem){

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
    }else if(value.hasAbility === 'active'){
      html += ` must have an ${activeAbility()}`
    }
  }

  if(html){
    return wrapContent(html)
  }
}