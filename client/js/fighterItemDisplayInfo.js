import StatsList from './components/stats/statsList.js'
import { StatsDisplayStyle } from './statsDisplayInfo.js'
import ItemDetails from './components/itemDetails.js'
import ActiveAbilityDescription from './components/activeAbilityDescription.js'

export default class FighterItemDisplayInfo{

  constructor(itemInstance){
    this.itemInstance = itemInstance
  }

  get orbs(){
    return this.itemInstance.orbs
  }

  get displayName(){
    return this.itemInstance.displayName
  }

  get isNew(){
    return this.itemInstance.itemDef.isNew
  }

  get activeAbilityState(){
    if(!this.itemInstance.activeAbility){
      return null
    }
    return {
      ready: this.itemInstance.activeAbilityReady,
      cooldown: this.itemInstance.cooldown,
      cooldownRemaining: this.itemInstance.cooldownRemaining
    }
  }

  makeTooltip(){

    const tt = document.createElement('div')

    if(this.itemInstance.activeAbility){
      tt.appendChild(new ActiveAbilityDescription(this.itemInstance))
    }

    if(this.itemInstance.stats){
      const statsList = new StatsList()
      statsList.setOptions({
        showTooltips: false,
        statsDisplayStyle: StatsDisplayStyle.ADDITIONAL
      })
      statsList.setStats(this.itemInstance.stats)
      tt.appendChild(statsList)
    }

    // if(this.itemInstance.description){
    //   tt.appendChild(wrap(this.itemInstance.description, {
    //     class: 'subtitle'
    //   }))
    // }

    return tt.innerHTML
  }

  makeDetails(){
    return new ItemDetails(this.itemInstance)
  }
}