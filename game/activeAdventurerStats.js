export default class ActiveAdventurerStats {
  constructor(adventurerStats, adventurerState){
    this.adventurerStats = adventurerStats
    this.adventurerState = adventurerState

    this._maxHp = adventurerStats.maxHp
    this._hp = adventurerStats.maxHp
  }

  get hp(){
    return this._hp
  }

  get maxHp(){
    return this._maxHp
  }
}