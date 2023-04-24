import FighterInstance from './fighterInstance.js'
import { minMax } from './utilFunctions.js'
import LoadoutObjectInstance from './loadoutObjectInstance.js'
import { adventurerLevelToHp, adventurerLevelToPower } from './adventurer.js'

export default class AdventurerInstance extends FighterInstance{

  _adventurer
  _itemInstances = []
  _skillInstances = []

  constructor(adventurer, initialState = {}){
    super()
    this._adventurer = adventurer
    this.state = initialState
  }

  get adventurer(){
    return this._adventurer
  }

  get accomplishments(){
    return this.fighterData.accomplishments
  }

  get bonuses(){
    return this.bonusesData.instances
  }

  get displayName(){
    return this.fighterData.name
  }

  get loadoutEffectInstances(){
    const leis = []
    for(let i = 0; i < 8; i++){
      leis.push(this._itemInstances[i], this._skillInstances[i])
    }
    return leis.filter(l => l)
  }

  get baseHp(){
    return adventurerLevelToHp(this.adventurer.level)
  }

  get basePower(){
    return adventurerLevelToPower(this.adventurer.level)
  }

  get baseStats(){
    return [
      { startingFood: 3 }
    ]
  }

  get maxFood(){
    return this.stats.get('startingFood').value
  }

  get food(){
    return this._state.food ?? this.maxFood
  }

  set food(val){
    this._state.food = minMax(0, val, this.maxFood)
  }

  get loadoutState(){
    const stateDef = { items: [], skills: [] }
    for(let i = 0; i < 8; i++){
      stateDef.items[i] = this._itemInstances[i]?.state
      stateDef.skills[i] = this._skillInstances[i]?.state
    }
    return stateDef
  }

  set loadoutState(stateDef){
    const items = stateDef?.items ?? []
    const skills = stateDef?.skills ?? []
    const loadout = this.adventurer.loadout
    for(let i = 0; i < 8; i++){
      if(loadout.items[i]){
        this._itemInstances[i] = new LoadoutObjectInstance({
          obj: loadout.items[i],
          owner: this,
          state: items[i]
        })
      }
      if(loadout.skills[i]){
        this._skillInstances[i] = new LoadoutObjectInstance({
          obj: loadout.skills[i],
          owner: this,
          state: skills[i]
        })
      }
    }
  }
}