import Items from './items/combined.js'
import OrbsData from './orbsData.js'
import { uniqueID } from './utilFunctions.js'
import { ITEM_RARITIES } from '../server/items/generator.js'
import _  from 'lodash'
import FighterSlotInstance from './fighterSlotInstance.js'

export default class AdventurerSlotInstance extends FighterSlotInstance{

  constructor({ item = null, skill = null }, state = null, owner = null){
    super(expandEffectData(item, skill), state, owner )
    this._item = item
    this._skill = skill
  }

  get baseItem(){
    return Items[this._itemDef.group][this._itemDef.name] ?? {}
  }

  get id(){
    return this._itemDef.id
  }

  get item(){
    return this._item
  }

  get skill(){
    return this._skill
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

/**
 * An adventurer slot is a combination of an AdventurerItem and an AdventurerSkill (possibly null)
 * @param item
 * @param skill
 */
function expandEffectData(item, skill){
  return {
    ...(item?.effectData ?? {}),
    ...(skill?.effectData ?? {})
  }
}