import DIElement from './diElement.js'
import { roundToNearestIntervalOf, wrapContent, wrapText } from '../../../game/utilFunctions.js'
import { activeAbility, isAdventurerItem, scrapEntry, triggeredAbility, wrapStats } from './common.js'
import Stats from '../../../game/stats/stats.js'
import StatsList from './stats/statsList.js'
import AbilityDescription from './abilityDescription.js'
import { StatsDisplayStyle } from '../displayInfo/statsDisplayInfo.js'
import { getAbilityDisplayInfoForObj } from '../displayInfo/abilityDisplayInfo.js'
import { modDisplayInfo } from '../displayInfo/modDisplayInfo.js'
import { metaEffectDisplayInfo } from '../displayInfo/metaEffectDisplayInfo.js'
import { effectDisplayInfo } from '../displayInfo/effectDisplayInfo.js'
import tippy from 'tippy.js'
import { loadoutModifierToEl } from '../displayInfo/loadoutModifierDisplayInfo.js'
import { flavorDisplayInfo } from '../displayInfo/flavorDisplayInfo.js'

export default class EffectDetails extends DIElement{

  get defaultOptions(){
    return {
      showTooltips: false
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
    this._addMisc()
    this._addFlavor()
    this._addTooltips()
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
    const loadoutModifiers = this._obj.loadoutModifiers ?? []
    for (let modifier of loadoutModifiers){
      const el = loadoutModifierToEl(modifier, this.isItem)
      if(el){
        this.appendChild(el)
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
    const statsList = new StatsList().setOptions({
      statsDisplayStyle: StatsDisplayStyle.ADDITIONAL,
      stats: new Stats(stats)
    })
    if(!statsList.empty){
      this.appendChild(statsList)
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
        this.appendChild(wrapContent(mdi.description))
      }else if(mdi.metaDescription && this._isMeta){
        this.appendChild(wrapContent(mdi.metaDescription))
      }
    })
  }

  _addDescription(){
    const edi = effectDisplayInfo(this._obj)
    if(edi.description){
      this.appendChild(wrapContent(edi.description))
    }
  }

  _addMisc(){
    if(this._obj.data?.scrapValue){
      this.appendChild(wrapContent(`Worth ${scrapEntry(this._obj.data.scrapValue)}`))
    }
    if(this._obj.statMultiplier && this._obj.statMultiplier !== 1 && this._isMeta){
      this.appendChild(wrapContent(`Stats are multiplied by ${this._obj.statMultiplier}.<br/> (Generally doesn't affect ${activeAbility('these')} or ${triggeredAbility('these')})`))
    }
  }

  _addFlavor(){
    const flav = flavorDisplayInfo(this._obj)
    if(flav){
      this.appendChild(wrapContent(flav, { elementType: 'i' }))
    }
  }

  _addTooltips(){
    requestAnimationFrame(() => {
      if(this.inTooltip){
        return
      }
      this.querySelectorAll('[tooltip]').forEach(el => {
        tippy(el, {
          theme: 'light',
          content: el.getAttribute('tooltip')
        })
        el.removeAttribute('tooltip')
      })
    })
  }
}

customElements.define('di-effect-details', EffectDetails)