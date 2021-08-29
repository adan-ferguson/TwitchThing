const BASE_HEALTH = 42
const HEALTH_PER_LEVEL = 8

const BASE_MIN_DAMAGE = 3
const MIN_DAMAGE_PER_LEVEL = 1

const BASE_MAX_DAMAGE = 3
const MAX_DAMAGE_PER_LEVEL = 1

export default class Stats {

  constructor(character){
    this.character = character
  }

  get maxHealth(){
    return Math.ceil(this.getStat('MaxHealth', BASE_HEALTH, HEALTH_PER_LEVEL))
  }

  get minDamage(){
    return Math.ceil(this.getStat('MinDamage', BASE_MIN_DAMAGE, MIN_DAMAGE_PER_LEVEL))
  }

  get maxDamage(){
    return Math.ceil(this.minDamage + this.getStat('MaxDamage', BASE_MAX_DAMAGE, MAX_DAMAGE_PER_LEVEL))
  }

  get statAffectors(){
    return this.character.innateBonuses.concat(this.character.filteredItems.map(item => item.itemDefinition))
  }

  getStat(type, base = 0, perLevel = 0){
    let val = base + this._getFlatStatMod(type)
    val += this.character.level * (perLevel + this._getFlatStatMod(type + 'PerLevel'))
    val *= this._getPctStatMod(type + 'Pct')
    return val
  }

  _getFlatStatMod(type){
    return this.statAffectors.reduce((val, statAffector) => {
      return val + (statAffector.statMods[type] || 0)
    }, 0)
  }

  _getPctStatMod(type){
    return this.statAffectors.filteredItems.reduce((val, statAffector) => {
      return val * (statAffector.statMods[type] || 1)
    }, 1)
  }
}