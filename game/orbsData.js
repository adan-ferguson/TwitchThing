import _ from 'lodash'

export default class OrbsData{

  constructor(maxOrbs = {}, usedOrbs = {}){
    this._maxOrbs = toObj(maxOrbs)
    this._usedOrbs = toObj(usedOrbs)
  }

  get maxOrbs(){
    return this._maxOrbs
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

  get total(){
    return _.sum(Object.values(this._maxOrbs))
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

  // Remove negatives, maybe shouldn't always be the case?
  for(let key in objOrArray){
    objOrArray[key] = Math.max(0, objOrArray[key])
  }

  return objOrArray || {}
}