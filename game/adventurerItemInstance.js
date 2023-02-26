import Items from './items/combined.js'
import FighterItemInstance from './fighterItemInstance.js'
import OrbsData from './orbsData.js'
import { uniqueID } from './utilFunctions.js'
import { ITEM_RARITIES } from '../server/items/generator.js'
import _  from 'lodash'

export default class AdventurerItemInstance extends FighterItemInstance{

  constructor(itemDef, state = null, owner = null){

    if(!Items[itemDef.group] || !Items[itemDef.group][itemDef.name]){
      super()
      return
    }

    const baseItem = Items[itemDef.group][itemDef.name]
    const level = itemDef.level ?? 1
    const itemData = {
      ...baseItem,
      ...baseItem.levelFn(level),
      orbs: baseItem.orbs
    }

    super(itemData, state, owner)
    this._itemDef = itemDef
  }

  get baseItem(){
    return Items[this._itemDef.group][this._itemDef.name] ?? {}
  }

  get id(){
    return this._itemDef.id
  }

  get itemDef(){
    return this._itemDef
  }

  get displayName(){
    if(this.level > 1){
      return `L${this.level} ${super.displayName}`
    }
    return super.displayName
  }

  /**
   * @returns {OrbsData}
   */
  get orbs(){
    let baseOrbs
    if(_.isObject(this.itemData.orbs)){
      baseOrbs = this.itemData.orbs
    }else{
      baseOrbs = { [this.itemData.group]: this.itemData.orbs }
    }
    return new OrbsData([
      baseOrbs,
      ...this.applicableSlotEffects.map(slotEffect => slotEffect.orbs ?? {})
    ])
  }

  get classes(){
    return this.orbs.classes
  }

  get slotBonus(){
    return this.owner.getEquippedSlotBonus(this.slot)
  }

  get slotTags(){
    return this.slotBonus?.tags ?? []
  }

  get isBasic(){
    return this.id ? false : true
  }

  get level(){
    return this.itemDef.level ?? 1
  }

  get rarityInfo(){
    return ITEM_RARITIES[this.baseItem.rarity ?? 0]
  }

  get scrapValue(){
    const scrapVal = this.rarityInfo.value
    return scrapVal * (1 + this.level * (this.level - 1) / 2)
  }

  get isMulticlass(){
    return this.orbs.classes.length > 1
  }

  upgradeInfo(){

    const upgradedItemDef = {
      id: uniqueID(),
      ...this.itemDef,
      level: this.level + 1
    }

    const upgradedItem = new AdventurerItemInstance(upgradedItemDef)

    const components = []
    components.push({ type: 'scrap', count: upgradedItem.scrapValue - this.scrapValue })

    if(this.level > 1){
      components.push({ type: 'item', group: this.itemDef.group, name: this.itemDef.name, count: this.level - 1 })
    }

    return { upgradedItemDef, components }
  }
}