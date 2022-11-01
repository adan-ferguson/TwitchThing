import StatsList from './components/stats/statsList.js'
import { StatsDisplayStyle } from './statsDisplayInfo.js'
import ItemFullDetails from './components/itemFullDetails.js'
import AbilityDetails from './components/abilityDetails.js'
import { makeEl, wrapContent } from '../../game/utilFunctions.js'
import Stats from '../../game/stats/stats.js'
import AbilityDisplayInfo from './abilityDisplayInfo.js'

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

  get abilityDisplayInfo(){
    return new AbilityDisplayInfo(this.itemInstance)
  }

  makeDetails(){
    return new ItemFullDetails(this.itemInstance)
  }
}