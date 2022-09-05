import Stats from './stats/stats.js'

// Stupid
new Stats()

export const COMBAT_BASE_TURN_TIME = 3000

/**
 * Format:
 * {
 *   timeSinceLastAction: 0,
 *   hp: 0,
 *   itemStates: []
 * }
 */
export default class FighterInstance{

  _baseFighterDef
  _currentState
  _itemInstances

  startState

  constructor(fighterData, initialState = {}){
    this._fighterData = fighterData
    this.startState = { ...this._currentState }

    const itemStates = initialState.itemStates ?? []
    this._itemInstances = []
    for(let i = 0; i < 8; i++){
      if(fighterData.items[i]){
        this._itemInstances[i] = new this.ItemClass(fighterData.items[i], itemStates[i])
      }else{
        this._itemInstances[i] = null
      }
    }

    this._currentState = { ...initialState }
    delete this._currentState.itemStates
  }

  /**
   * @return {object}
   */
  get fighterData(){
    return this._fighterData
  }

  get ItemClass(){
    throw 'Not implemented'
  }

  /**
   * @return {string}
   */
  get uniqueID(){
    throw 'Not implemented'
  }

  get itemInstances(){
    return this._itemInstances
  }

  /**
   * @return {number}
   */
  get baseHp(){
    throw 'Not implemented'
  }

  /**
   * @returns {number}
   */
  get basePower(){
    throw 'Not implemented'
  }

  /**
   * @returns {Stats}
   */
  get stats(){
    throw 'Not implemented'
  }

  /**
   * @returns {ModsCollection}
   */
  get mods(){
    throw 'Not implemented'
  }

  get orbs(){
    return null
  }

  get currentState(){
    const baseState = { ...this._currentState }
    baseState.itemStates = this._itemInstances.map(ii => {
      if(ii){
        return null
      }else{
        return ii.currentState
      }
    })
    return { ...this._currentState }
  }

  get actionTime(){
    return COMBAT_BASE_TURN_TIME / this.stats.get('speed').value
  }

  get timeUntilNextAction(){
    return Math.ceil(Math.max(0, (this.actionTime - this._currentState.timeSinceLastAction)))
  }

  get actionReady(){
    return this.hp > 0 && !this.timeUntilNextAction
  }

  get hp(){
    return Math.floor(this._currentState.hp ?? this.hpMax)
  }

  set hp(val){
    if(isNaN(val)){
      debugger
    }
    this._currentState.hp = Math.max(0, Math.min(this.hpMax, val))
    if(this.hp === this.hpMax){
      this._currentState.hpRemainder = 0
    }
  }

  get hpMax(){
    const hpMax = Math.round(this.baseHp * this.stats.get('hpMax').value)
    if(hpMax === 0){
      debugger
    }
    return hpMax
  }

  get hpPct(){
    return this.hp / this.hpMax
  }

  advanceTime(ms){
    this._currentState.timeSinceLastAction += ms
    this.itemInstances.forEach((itemInstance, index) => {
      if(itemInstance){
        itemInstance.advanceTime(ms)
        this._currentState.itemStates[index] = itemInstance.state
      }
    })
    // TODO advance buff/debuff times
  }

  nextActiveItemIndex(){
    return this.itemInstances.findIndex(itemInstance => {
      if(itemInstance.activeAbilityReady){
        return true
      }
    })
  }

  resetTimeSinceLastAction(){
    this._currentState.timeSinceLastAction = 0
  }

  /**
   * Use this for things like regen/dots so that 0.3 per second doesn't result in nothing happening.
   * @param amount
   */
  changeHpWithDecimals(amount){
    amount = amount + (this._currentState.hpRemainder ?? 0)
    this._currentState.hpRemainder = amount % 1
    this.hp += Math.floor(amount)
  }
}