import DIElement from './diElement.js'
import { roundToNearestIntervalOf, wrapContent, wrapText } from '../../../game/utilFunctions.js'
import { isAdventurerItem, orbEntries } from './common.js'
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
    this._addAbilities()
    this._addStats()
    this._addMeta()
    this._addMods()
    this._addLoadoutModifiers()
    this._addDescription()
  }

  _addMeta(){
    const metaEffect = this._obj.metaEffect ?? {}
    for(let subjectKey in metaEffect){
      const el = metaEffectDisplayInfo(subjectKey, metaEffect[subjectKey], this._obj)
      if(el){
        this.appendChild(el)
      }
    }
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
    const stats = new Stats(this._obj.exclusiveStats ?? {})
    // TODO: exclusive stats need some sort of indication
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
    [...(this._obj.exclusiveMods ?? []), ...(this._obj.mods ?? [])].forEach(mod => {
      const mdi = modDisplayInfo(mod)
      if(mdi.description){
        this.appendChild(wrapText(mdi.description))
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
    }
  }

  if(html){
    return wrapContent(html)
  }
}