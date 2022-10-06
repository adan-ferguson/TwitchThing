import EffectInstance from './effectInstance.js'

export default class FighterItemInstance extends EffectInstance{

  constructor(itemData, state = {}, owner = null){
    super(state, owner)
    this.itemData = itemData
  }

  get effectData(){
    return this.itemData
  }

  /**
   * @return {string}
   */
  get id(){
    throw 'id getter not defined'
  }

  get activeAbility(){
    return this.abilitiesData.instances.active
  }
}
