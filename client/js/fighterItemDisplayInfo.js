import StatsList from './components/stats/statsList.js'
import { StatsDisplayStyle } from './statsDisplayInfo.js'
import ItemDetails from './components/itemDetails.js'
import AbilityDescription from './components/abilityDescription.js'
import { makeEl, toDisplayName, wrapContent } from '../../game/utilFunctions.js'
import Stats from '../../game/stats/stats.js'

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

    if(this.itemInstance.hasAbilities){
      tt.appendChild(new AbilityDescription(this.itemInstance))
    }

    if(this.itemInstance.itemData.stats){
      const statsList = new StatsList()
      statsList.setOptions({
        showTooltips: false,
        statsDisplayStyle: StatsDisplayStyle.ADDITIONAL
      })
      statsList.setStats(new Stats(this.itemInstance.itemData.stats))
      tt.appendChild(statsList)
    }

    if(this.itemInstance.itemData.mods){
      const modsEl = makeEl({
        class: 'mods-list'
      })
      this.itemInstance.mods.list.forEach(mod => {
        if(mod.description){
          modsEl.appendChild(wrapContent(toDisplayName(mod.name)))
        }
      })
      tt.appendChild(modsEl)
    }

    if(this.itemInstance.itemData.conditions){
      const conditionsEl = makeEl({
        class: 'conditions-list'
      })
      Object.entries(this.itemInstance.itemData.conditions).forEach(([key, val]) => {
        conditionsEl.appendChild(wrapContent(describeCondition(key, val)))
      })
      tt.appendChild(conditionsEl)
    }

    return tt
  }

  makeDetails(){
    return new ItemDetails(this.itemInstance)
  }
}

function describeCondition(key, val){
  if(key === 'combatTimeAbove'){
    return `Activates ${val/1000}s into combat.`
  }
}