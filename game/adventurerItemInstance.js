import Items from './items/combined.js'
import FighterItemInstance from './fighterItemInstance.js'
import OrbsData from './orbsData.js'
import { uniqueID } from './utilFunctions.js'

const BASE_UPGRADE_SCRAP = 5

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
      return `Lv.${this.level} ${super.displayName}`
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
    return this.orbs.total * this.level
  }

  upgradeInfo(){

    const upgradedItemDef = {
      id: uniqueID(),
      ...this.itemDef,
      level: this.level + 1
    }

    const components = []
    components.push({ type: 'scrap', count: BASE_UPGRADE_SCRAP * this.level })
    components.push({ type: 'item', itemDef: this.itemDef, count: this.level })

    return { upgradedItemDef, components }
  }
}