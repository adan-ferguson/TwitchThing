export default class OrbsData{

  constructor(maxOrbs = {}, usedOrbs = {}){
    this._maxOrbs = toObj(maxOrbs)
    this._usedOrbs = toObj(usedOrbs)
  }

  get classes(){
    const classes = {}
    Object.keys(this._maxOrbs).forEach(cls => classes[cls] = 1)
    Object.keys(this._usedOrbs).forEach(cls => classes[cls] = 1)
    return Object.keys(classes)
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

function toObj(objOrArray){
  if(Array.isArray(objOrArray)){
    objOrArray = objOrArray.reduce((current, next) => {
      for(let group in next){
        if(!current[group]){
          current[group] = 0
        }
        current[group] += next[group]
      }
      return current
    }, {})
  }
  return objOrArray || {}
}