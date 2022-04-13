export default class OrbsData{
  constructor(adventurer, items = adventurer.loadout){
    this.adventurer = adventurer
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
    // TODO: not this
    return this.adventurer.level
  }

  get isValid(){
    return this.remaining >= 0
  }
}