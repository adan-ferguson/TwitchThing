import Items from './items/combined.js'
import OrbsData from './orbsData.js'
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

  get level(){
    return this.itemDef.level ?? 1
  }

  get isMulticlass(){
    return this.orbs.classes.length > 1
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