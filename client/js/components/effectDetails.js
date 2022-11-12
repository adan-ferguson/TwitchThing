import AbilityDetails from './abilityDetails.js'
import StatsList from './stats/statsList.js'
import { StatsDisplayStyle } from '../statsDisplayInfo.js'
import DIElement from './diElement.js'
import { parseDescriptionString } from '../descriptionString.js'

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
    this._addStats()
    this._addDescription()
  }

  _addAbilityDescription(){
    if(this._effectInstance.hasAbilities){
      this.appendChild(
        new AbilityDetails().setItem(this._effectInstance, this._options.showTooltips)
      )
    }
  }

  _addStats(){
    const statsList = new StatsList()
    statsList.setOptions({
      showTooltips: false,
      statsDisplayStyle: StatsDisplayStyle.ADDITIONAL
    })
    statsList.setStats(this._effectInstance.stats)
    // TODO: what was this for, I remember it being important
    // statsList.setStats(new Stats(this._effectInstance.itemData.stats))
    if(!statsList.empty){
      this.appendChild(statsList)
    }
  }

  _addDescription(){
    if(this._effectInstance.description){
      this.appendChild(parseDescriptionString(this._effectInstance.description))
    }
  }

}

customElements.define('di-effect-details', EffectDetails)