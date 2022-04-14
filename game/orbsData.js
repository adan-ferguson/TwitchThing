export default class OrbsData{

  static fromFighter(adventurer){
    if(!adventurer){
      return new OrbsData()
    }
    return new OrbsData(adventurer.level, adventurer.items)
  }

  constructor(maxOrbs = 0, items = []){
    this.maxOrbs = maxOrbs
    this.items = items
  }

  get used(){
    return this.items.reduce((val, item) => {
      return val + (item?.orbs || 0)
    }, 0)
  }

  get remaining(){
    return this.max - this.used
  }

  get max(){
    return this.maxOrbs
  }

  get isValid(){
    return this.remaining >= 0
  }
}