import AbilityDescription from './abilityDescription.js'
import StatsList from './stats/statsList.js'
import { StatsDisplayStyle } from '../statsDisplayInfo.js'
import DIElement from './diElement.js'
import { parseDescriptionString } from '../descriptionString.js'
import { magicAttackMod } from '../../../game/mods/combined.js'
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
      this.appendChild(
        new AbilityDescription().setItem(this._effectInstance, this._options.showTooltips)
      )
    }
  }

  _addStats(){
    const statsList = new StatsList()
    statsList.setOptions({
      // showTooltips: false,
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
    const description = parseDescriptionString(this._effectInstance.description ?? '')
    description.classList.add('effect-description')
    if(this._effectInstance.mods.contains(magicAttackMod)){
      description.append(wrapContent('Use magic power for basic attacks.'))
    }
    if(description.innerHTML.length){
      this.appendChild(description)
    }
  }

}

customElements.define('di-effect-details', EffectDetails)