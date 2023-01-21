import AbilityDescription from './abilityDescription.js'
import StatsList from './stats/statsList.js'
import { StatsDisplayStyle } from '../statsDisplayInfo.js'
import DIElement from './diElement.js'
import { parseDescriptionString } from '../descriptionString.js'
import { wrapContent } from '../../../game/utilFunctions.js'

export default class EffectDetails extends DIElement{

  get defaultOptions(){
    return {
      showTooltips: false,
    }
  }

  setEffect(effectInstance){
    this._effectInstance = effectInstance
    this._update()
    return this
  }

  _update(){
    this.innerHTML = ''
    if(!this._effectInstance){
      return
    }
    this._addAbilityDescription()
    this._addDescription()
    this._addStats()
  }

  _addAbilityDescription(){
    if(this._effectInstance.hasAbilities){
      const desc = new AbilityDescription().setItem(this._effectInstance, this._options.showTooltips)
      if(desc){
        this.appendChild(desc)
      }
    }
  }

  _addStats(){
    const statsList = new StatsList()
    statsList.setOptions({
      // showTooltips: false,
      statsDisplayStyle: StatsDisplayStyle.ADDITIONAL
    })
    if(!this._effectInstance.effectData.scaledStats){
      statsList.setStats(this._effectInstance.stats)
    }
    if(!statsList.empty){
      this.appendChild(statsList)
    }
  }

  _addDescription(){
    const description = parseDescriptionString(this._effectInstance.description ?? '')
    description.classList.add('effect-description')
    this._effectInstance.mods.list.forEach(mod => {
      if(mod.description){
        description.append(wrapContent(mod.description))
      }
    })
    if(description.innerHTML.length){
      this.appendChild(description)
    }
  }

}

customElements.define('di-effect-details', EffectDetails)