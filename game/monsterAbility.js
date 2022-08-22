import Stats from './stats/stats.js'

export default class MonsterAbilityInstance{
  constructor(abilityDef){
    this.abilityDef = abilityDef.abilityDef ?? abilityDef
  }
  get name(){
    return this.abilityDef.name || ''
  }
  get stats(){
    return new Stats(this.abilityDef.stats ?? {})
  }
  get mods(){
    return this.abilityDef.mods || []
  }
  get description(){
    return this.abilityDef.description || ''
  }
}