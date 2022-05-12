import Item from './item.js'

export default class OrbsData{

  static fromAdventurer(adventurer, items = adventurer.items){
    const orbsMap = {}
    adventurer.bonuses.forEach(bonus => {
      if(!bonus.orbs){
        return
      }
      for(let className of bonus.orbs){
        if(!orbsMap[className]){
          orbsMap[className] = 0
        }
        orbsMap[className] += bonus.orbs[className]
      }
    })
    return new OrbsData(orbsMap)
  }

  constructor(maxOrbs, usedOrbs = {}){
    this._maxOrbs = maxOrbs
    this._usedOrbs = usedOrbs
  }

  get classes(){
    return Object.keys(this._maxOrbs)
  }

  get isValid(){
    return this.classes.find(className => this.remaining(className) < 0) ? false : true
  }

  used(className){
    return this._usedOrbs[className] || 0
  }

  max(className){
    return this._maxOrbs[className] || 0
  }

  remaining(className){
    return this.max(className) - this.used(className)
  }
}