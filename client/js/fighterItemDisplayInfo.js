import StatsList from './components/stats/statsList.js'
import { StatsDisplayStyle } from './statsDisplayInfo.js'
import ItemDetails from './components/itemDetails.js'
import AbilityDescription from './components/abilityDescription.js'
import { makeEl } from '../../game/utilFunctions.js'

export default class FighterItemDisplayInfo{

  constructor(itemInstance){
    this.itemInstance = itemInstance
  }

  get obj(){
    return this.itemInstance
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

  get abilityState(){
    const abilities = this.itemInstance.generateAbilitiesData().instances
    if(!Object.values(abilities).length){
      return null
    }
    const [eventName, ability] = Object.entries(abilities)[0]
    return {
      type: eventName === 'active' ? 'active' : 'triggered',
      ability
    }
  }

  makeTooltip(){

    const tt = makeEl({
      class: 'tooltip-content'
    })

    if(this.itemInstance.ability){
      tt.appendChild(new AbilityDescription(this.itemInstance))
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

    return tt
  }

  makeDetails(){
    return new ItemDetails(this.itemInstance)
  }
}