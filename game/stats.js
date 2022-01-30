export default class Stats {

  /**
   * @return array
   */
  get statAffectors(){
    throw 'statAffectors getter not implemented'
  }

  get level(){
    throw 'level getter not implemented'
  }

  _getStat(type){
    let val = this._getFlatStatMod(type)
    val += this.level * this._getFlatStatMod(type + 'PerLevel')
    val *= this._getPctStatMod(type + 'Pct')
    return val
  }

  _getFlatStatMod(type){
    return this.statAffectors.reduce((val, statAffector) => {
      return val + (statAffector[type] || 0)
    }, 0)
  }

  _getPctStatMod(type){
    return this.statAffectors.reduce((val, statAffector) => {
      return val * (statAffector[type] || 1)
    }, 1)
  }
}