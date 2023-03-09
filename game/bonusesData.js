// import BonusInstance from './bonusInstance.js'

export default class BonusesData{

  owner = null
  _instances = []

  constructor(bonusesObj, owner = null){

    this._owner = owner

    // for(let group in bonusesObj){
    //   for(let name in bonusesObj[group]){
    //     this._instances.push(new BonusInstance({
    //       group,
    //       name,
    //       level: bonusesObj[group][name]
    //     }, owner))
    //   }
    // }
  }

  get({ name, group }){
    return this._instances.find(i => i.name === name && i.group === group)
  }

  get instances(){
    return [...this._instances]
  }

  get levelTotal(){
    return this._instances.reduce((prev, val) => prev + val.level, 0)
  }
}