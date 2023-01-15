import Items from './items/combined.js'
import FighterItemInstance from './fighterItemInstance.js'
import OrbsData from './orbsData.js'
import { uniqueID } from './utilFunctions.js'

const BASE_UPGRADE_SCRAP = 3

export default class AdventurerItemInstance extends FighterItemInstance{

  constructor(itemDef, state = null, owner = null){

    const baseItem = Items[itemDef.group][itemDef.name] ?? {}
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
    return new OrbsData([
      { [this.itemData.group]: this.itemData.orbs },
      ...this.applicableSlotEffects.map(slotEffect => slotEffect.orbs ?? {})
    ])
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

  get scrapValue(){
    return this.orbs.total + (this.orbs.total + BASE_UPGRADE_SCRAP) * (this.level * (this.level - 1)) / 2
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