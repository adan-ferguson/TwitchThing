import _ from 'lodash'
import { calculateCompositeValue } from './stats/statValueFns.js'

export default class OrbsData{

  constructor(usedOrbs = {}, maxOrbs = {}, ){
    this._usedOrbs = toObj(usedOrbs, 'used')
    this._maxOrbs = toObj(maxOrbs, 'max')
  }

  get maxOrbs(){
    return this._maxOrbs
  }

  get usedOrbs(){
    return this._usedOrbs
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

function toObj(objOrArray, key){
  if(Array.isArray(objOrArray)){
    const byClass = {}
    objOrArray.forEach(next => {
      if (next instanceof OrbsData){
        next = next[key + 'Orbs']
      }
      for (let group in next){
        if (!byClass[group]){
          byClass[group] = []
        }
        byClass[group].push(next[group])
      }
    })
    const all = byClass.all ?? []
    objOrArray = {}
    for(let advClass in byClass){
      if(advClass === 'all'){
        continue
      }
      objOrArray[advClass] = calculateCompositeValue([
        ...byClass[advClass],
        ...all
      ])
    }
  }else if(objOrArray instanceof OrbsData){
    objOrArray = objOrArray[key + 'Orbs']
  }

  // Remove negatives, maybe shouldn't always be the case?
  for(let key in objOrArray){
    objOrArray[key] = Math.max(0, Math.round(objOrArray[key]))
  }

  return objOrArray || {}
}