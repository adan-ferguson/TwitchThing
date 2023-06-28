import statValueFns from './statValueFns.js'
import { calcStatDiff } from './statDiff.js'
import { arrayize, isolate, roundToFixed } from '../utilFunctions.js'
import { makeStatObject } from './statObject.js'
import _ from 'lodash'
import { wrappedPct } from '../growthFunctions.js'

export default class Stats{

  _cache = {}
  baseAffectors = []
  additionalAffectors = []

  constructor(baseStats = null, additionalStats = null, transStats = [], modifiers = []){

    this.baseAffectors = toAffectorsArray(baseStats)
    this.additionalAffectors = toAffectorsArray(additionalStats)

    transStats = arrayize(transStats).flat().filter(t => t)
    transStats.forEach(ts => {
      // TODO: this only works with multiplier type
      const value = (this.get(ts.from, false).value - 1)
      this.baseAffectors.push({
        [ts.to]: wrappedPct(100 * value * (ts.ratio ?? 1))
      })
    })

    this.modifiers = arrayize(modifiers).flat().filter(t => t)
  }

  get isEmpty(){
    return this.affectors.find(a => Object.keys(a).length) ? false : true
  }

  get affectors(){
    return this.baseAffectors.concat(this.additionalAffectors)
  }

  has(nameOrStat){
    const obj = this.get(nameOrStat)
    return obj.value !== obj.defaultValue
  }

  get(nameOrStat, useCache = true){

    const name = nameOrStat.name ?? nameOrStat

    if(this._cache[name] && useCache){
      return this._cache[name]
    }

    const statObj = makeStatObject(name, isolate(this.modifiers, name))

    const fn = statValueFns[statObj.type]

    if(!fn){
      throw 'Missing value function for stat type: ' + statObj.type
    }

    const base = fn(extractValues(this.baseAffectors, name), statObj.defaultValue)
    statObj.baseValue = shine(base.value)
    statObj.baseMods = base.mods

    const current = fn(extractValues(this.affectors, name), statObj.defaultValue)
    statObj.value = shine(current.value)
    statObj.mods = current.mods

    statObj.diff = calcStatDiff(statObj)

    if(useCache){
      this._cache[name] = statObj
    }

    return statObj

    function extractValues(affectors, name){
      return affectors
        .map(affector => affector[name] || null)
        .filter(val => val)
    }

    function shine(val){
      if(_.isNumber(statObj.minValue)){
        val = Math.max(statObj.minValue, val)
      }
      if(_.isNumber(statObj.maxValue)){
        val = Math.min(statObj.maxValue, val)
      }
      return roundToFixed(val, statObj.roundingDecimals)
    }
  }

  getAll(forced = []){
    const all = {}
    forced.forEach(name => all[name] = true)
    this.affectors.forEach(affector => {
      Object.keys(affector).forEach(key => {
        all[key] = true
      })
    })
    this.modifiers.forEach(modifier => {
      Object.keys(modifier).forEach(key => {
        all[key] = true
      })
    })
    const allStats = {}
    Object.keys(all).forEach(type => {
      allStats[type] = this.get(type)
    })
    return allStats
  }

  serialize(){
    const serialized = {}
    Object.entries(this.getAll()).forEach(([statName, statDef]) => {
      serialized[statName] = statDef.value
    })
    return serialized
  }
}

export function mergeStats(...statsObjs){
  return new Stats(
    merge('baseAffectors'),
    merge('additionalAffectors')
  )
  function merge(propName){
    return statsObjs
      .filter(o => o)
      .reduce((arr, statsObj) => {
        return [...arr, ...statsObj[propName]]
      }, [])
  }
}

/**
 * @param val Turn whatever nonsense into a nice affectors array.
 * @returns [object]
 */
function toAffectorsArray(val){
  if(!val){
    return []
  }
  const arr = Array.isArray(val) ? val : [val]
  const affectors = []
  arr.forEach(value => {
    if(value instanceof Stats){
      affectors.push(...value.affectors)
    }else if(Array.isArray(value)){
      affectors.push(...toAffectorsArray(value))
    }else{
      affectors.push(value)
    }
  })
  return affectors.filter(a => a)
}