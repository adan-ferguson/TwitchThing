const BASE_HEALTH = 90
const HEALTH_PER_LEVEL = 10

export default class Stats {

  constructor(character){
    this.character = character
  }

  get maxHealth(){
    const baseVal = BASE_HEALTH + this.character.level * HEALTH_PER_LEVEL
    return Math.ceil(baseVal + this.getStat('maxHealth'))
  }

  get statAffectors(){
    return this.character.innateBonuses.concat(this.character.filteredItems.map(item => item.itemDefinition))
  }

  getStat(type){
    let val = this._getFlatStatMod(type)
    val += this.character.level * this._getFlatStatMod(type + 'PerLevel')
    val *= this._getPctStatMod(type + 'Pct')
    return val
  }

  _getFlatStatMod(type){
    return this.statAffectors.reduce((val, statAffector) => {
      return val + (statAffector.statMods[type] || 0)
    }, 0)
  }

  _getPctStatMod(type){
    return this.statAffectors.reduce((val, statAffector) => {
      return val * (statAffector.statMods[type] || 1)
    }, 1)
  }
}