import StatsList from './components/stats/statsList.js'
import { StatsDisplayStyle } from './statsDisplayInfo.js'
import ItemDetails from './components/itemDetails.js'
import AbilityDescription from './components/abilityDescription.js'
import { makeEl, wrapContent } from '../../game/utilFunctions.js'
import Stats from '../../game/stats/stats.js'
import { silencedMod } from '../../game/mods/combined.js'

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

  get abilityStateInfo(){

    const abilities = this.itemInstance.generateAbilitiesData().instances
    if(!Object.values(abilities).length){
      return null
    }
    
    const [eventName, ability] = Object.entries(abilities)[0]

    let state
    if(this.itemInstance.owner.mods.contains(silencedMod)){
      state = 'disabled'
    }else if(ability.ready){
      state = 'ready'
    }else if(ability.enabled){
      state = 'recharging'
    }else{
      state = 'disabled'
    }

    return {
      type: eventName === 'active' ? 'active' : 'triggered',
      state,
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
      // Use this instead of itemInstance.stats because stats might be 0 if the item is disabled
      statsList.setStats(new Stats(this.itemInstance.itemData.stats))
      tt.appendChild(statsList)
    }

    if(this.itemInstance.itemData.mods){
      const modsEl = makeEl({
        class: 'mods-list'
      })
      this.itemInstance.mods.list.forEach(mod => {
        if(mod.description){
          modsEl.appendChild(wrapContent(mod.description))
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

    if(this.itemInstance.itemData.description){
      const descriptionEl = makeEl({
        class: 'item-description',
        text: this.itemInstance.itemData.description
      })
      tt.appendChild(descriptionEl)
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