export default class Stats{

  constructor(statAffectors){
    this._statAffectors = statAffectors
  }

  getCompositeStat(type, base = 0){
    return this.getFlatStatMod(type, base) * this.getPctStatMod(type + 'Pct')
  }

  getFlatStatMod(type, base = 0){
    return this._statAffectors.reduce((val, statAffector) => {
      return val + (statAffector[type] || 0)
    }, base)
  }

  getPctStatMod(type, base = 1){
    return this._statAffectors.reduce((val, statAffector) => {
      return val * (statAffector[type] || 1)
    }, base)
  }
}