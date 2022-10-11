import EffectInstance from './effectInstance.js'

export default class FighterItemInstance extends EffectInstance{

  constructor(itemData, state = {}, owner = null){
    super(owner, state)
    this.itemData = itemData
  }

  get effectData(){
    return this.itemData
  }

  get activeAbility(){
    return this.getAbility('active')
  }
}
