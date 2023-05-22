import DIElement from './diElement.js'
import { roundToNearestIntervalOf, wrapContent, wrapText } from '../../../game/utilFunctions.js'
import { isAdventurerItem, orbEntries } from './common.js'
import AdventurerItem from '../../../game/items/adventurerItem.js'
import Stats from '../../../game/stats/stats.js'
import StatsList from './stats/statsList.js'
import AbilityDescription from './abilityDescription.js'
import { StatsDisplayStyle } from '../displayInfo/statsDisplayInfo.js'
import { getAbilityDisplayInfoForObj } from '../displayInfo/abilityDisplayInfo.js'
import { modDisplayInfo } from '../displayInfo/modDisplayInfo.js'
import { metaEffectDisplayInfo } from '../displayInfo/metaEffectDisplayInfo.js'
import { subjectDescription } from '../../../game/subjectFns.js'

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
    this._addConditions()
    this._addAbilities()
    this._addStats()
    this._addMeta()
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
    }else if(conditions.bossFight){
      this.appendChild(wrapText('During boss fights:'))
    }
  }

  _addMeta(){
    const metaEffect = this._obj.effectData.metaEffect
    if(!metaEffect){
      return
    }
    for(let subjectKey in metaEffect){
      const el = metaEffectDisplayInfo(subjectKey, metaEffect[subjectKey], this._obj)
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