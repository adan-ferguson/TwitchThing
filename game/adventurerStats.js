import Stats from './stats.js'

const BASE_HP = 80
const HP_PER_LEVEL = 20
const BASE_ATTACK = 8
const ATTACK_PER_LEVEL = 2

export default class AdventurerStats extends Stats {

  constructor(adventurer){
    super()
    this.adventurer = adventurer
    this._extraStatAffectors = {
      hp: BASE_HP,
      hpPerLevel: HP_PER_LEVEL,
      attack: BASE_ATTACK,
      attackPerLevel: ATTACK_PER_LEVEL
    }
  }

  get level(){
    return this.adventurer.level
  }

  get statAffectors(){
    return [this._extraStatAffectors]
    // return this.adventurer.innateBonuses.concat(this.adventurer.filteredItems.map(item => item.itemDefinition))
  }

  get hp(){
    return this._getStat('hp')
  }

  get attack(){
    return this._getStat('attack')
  }
}