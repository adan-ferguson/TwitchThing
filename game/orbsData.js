export default class OrbsData{

  constructor(maxOrbs = {}, usedOrbs = {}){
    this._maxOrbs = maxOrbs
    this._usedOrbs = usedOrbs
  }

  get classes(){
    return Object.keys(this._maxOrbs)
  }

  get isValid(){
    return this.list.find(data => data.remaining < 0) ? false : true
  }

  get list(){
    return this.classes.map(className => this.get(className))
  }

  get(className){
    const orbDatum = {
      className,
      used: this._usedOrbs[className] || 0,
      max: this._maxOrbs[className] || 0
    }
    orbDatum.remaining = orbDatum.max - orbDatum.used
    return orbDatum
  }
}