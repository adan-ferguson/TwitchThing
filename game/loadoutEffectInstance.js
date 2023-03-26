import EffectInstance from './effectInstance.js'

export default class LoadoutEffectInstance extends EffectInstance{
  constructor(loadoutObject, owner, state = {}){
    super(owner, state)
  }
}