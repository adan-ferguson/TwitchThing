import AbilityDescription from './abilityDescription.js'
import StatsList from './stats/statsList.js'
import { StatsDisplayStyle } from '../statsDisplayInfo.js'
import DIElement from './diElement.js'
import { parseDescriptionString } from '../descriptionString.js'
import { wrapContent } from '../../../game/utilFunctions.js'
import { orbEntries, orbEntry } from './common.js'

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
    this._addOrbModifiers()
    this._addLoadoutRestrictions()
  }

  _addOrbModifiers(){
    if(!this._obj.loadoutOrbModifiers){
      return
    }
    let str = ''
    for(let modifierKey in this._obj.loadoutOrbModifiers){
      const mod = this._obj.loadoutOrbModifiers[modifierKey]
      if(modifierKey === 'allItems'){
        str += `All items cost ${orbEntries(mod)} less.`
      }
    }
    if(str){
      this.appendChild(wrapContent(str))
    }
  }

  _addLoadoutRestrictions(){
    if(!this._obj.loadoutRestrictions){
      return
    }
    let str = ''
    for(let restrictionKey in this._obj.loadoutRestrictions){
      const res = this._obj.loadoutRestrictions[restrictionKey]
      if(restrictionKey === 'self' && res.slot){
        str += `Must be equipped in Slot ${res.slot}.`
      }
    }
    if(str){
      this.appendChild(wrapContent(str))
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