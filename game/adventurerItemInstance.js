import Items from './items/combined.js'
import FighterItemInstance from './fighterItemInstance.js'
import OrbsData from './orbsData.js'
import { dualWieldBonus, signatureWeaponBonus } from './bonuses/combined.js'

export default class AdventurerItemInstance extends FighterItemInstance{

  constructor(itemDef, state = null, owner = null){

    const baseItem = Items[itemDef.baseType.group][itemDef.baseType.name] ?? {}
    const level = itemDef.level ?? 1
    const itemData = {
      ...baseItem,
      ...baseItem.levelFn(level),
      orbs: baseItem.orbs * level
    }

    super(itemData, state, owner)
    this._itemDef = itemDef
  }

  get id(){
    return this._itemDef.id
  }

  get itemDef(){
    return this._itemDef
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

  get isSignatureWeapon(){
    if(!this.owner){
      return false
    }
    // TODO: figure out a real system for this
    if(this.owner.bonusesData.contains(signatureWeaponBonus)){
      if(this.slot === 0){
        return true
      }else if(this.slot === 1 && this.owner.bonusesData.contains(dualWieldBonus)){
        return true
      }
    }
    return false
  }

  get attackMultiplier(){
    if(this.isSignatureWeapon){
      return this.owner.stats.get('mainHandDamage').value
    }
    return 1
  }

  get cooldownReduction(){
    if(this.isSignatureWeapon){
      return this.owner.stats.get('mainHandCooldownReduction').value
    }
    return 0
  }
}