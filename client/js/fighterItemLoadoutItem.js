import ItemFullDetails from './components/itemFullDetails.js'
import abilityDisplayInfo from './abilityDisplayInfo.js'

export default class FighterItemLoadoutItem{

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
    return abilityDisplayInfo(this.itemInstance)
  }

  get isBasic(){
    return this.itemInstance.isBasic
  }

  get scrapValue(){
    return this.itemInstance.scrapValue
  }

  setOwner(owner){
    this.itemInstance.owner = owner
  }

  makeDetails(){
    return new ItemFullDetails().setItem(this.itemInstance)
  }

  equals(fidi){
    if(this === fidi){
      return true
    }
    if(this.itemInstance.isBasic && fidi.itemInstance.isBasic){
      if(this.itemInstance.baseItem === fidi.itemInstance.baseItem){
        return true
      }
    }
    return false
  }
}