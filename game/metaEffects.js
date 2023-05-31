import { arrayize, deepClone, pushOrCreate } from './utilFunctions.js'

export default class MetaEffectCollection{
  constructor(fighterInstance){
    this.fighterInstance = fighterInstance
    this.categories = {
      slots: [[],[]],
      ids: {},
      all: []
    }

    fighterInstance.effectInstances.forEach(ei => {
      const metaEffects = ei.baseEffectData.metaEffects
      if(!metaEffects){
        return
      }
      for(let metaEffect of metaEffects){
        const meDef = {
          ...metaEffect,
          source: ei.uniqueID
        }
        if(meDef.subject === 'attached' && ei.slotInfo){
          add(this.categories.slots, ei.slotInfo.col + 1 % 2, ei.slotInfo.row, meDef)
        }else if(meDef.subject === 'self'){
          pushOrCreate(this.categories.ids, ei.uniqueID, meDef)
        }else if(meDef.subject === 'all'){
          this.categories.all.push(meDef)
        }
      }
    })
  }

  apply(effectInstance){
    if(effectInstance.fighterInstance !== this.fighterInstance){
      throw 'Huh?'
    }
    const toApply = []
    if(effectInstance.slotInfo){
      toApply.push(...get(this.categories.slots, effectInstance.slotInfo.col, effectInstance.slotInfo.row))
    }
    toApply.push(...(this.categories.ids[effectInstance.uniqueID] ?? []))
    toApply.push(...this.categories.all)
    const filtered = toApply.filter((meDef => {
      return effectInstance.fighterInstance.meetsConditions(meDef.conditions)
    }))
    return merge(effectInstance.baseEffectData, filtered)
  }
}

function add(slots, x, y, obj){
  if(!slots[x][y]){
    slots[x][y] = []
  }
  slots[x][y].push(obj)
}

function get(slots, x, y){
  return slots[x][y] ?? []
}

function merge(baseEffect, metaEffects){
  baseEffect = deepClone(baseEffect)
  metaEffects.forEach(metaEffect => {
    pushOrCreate(baseEffect, 'appliedMetaEffects', metaEffect)
    const effect = metaEffect.effect
    for(let key in effect){
      if(key === 'stats'){
        baseEffect.stats = [...arrayize(baseEffect.stats), effect.stats]
      }
      if(key === 'exclusiveStats'){
        baseEffect.exclusiveStats = [...arrayize(baseEffect.exclusiveStats), effect.exclusiveStats]
      }
      if(key === 'exclusiveMods'){
        pushOrCreate(baseEffect, 'exclusiveMods', effect.exclusiveMods)
      }
      if(key === 'statMultiplier'){
        baseEffect.statMultiplier = (baseEffect.statMultiplier ?? 1) * effect.statMultiplier
      }
    }
  })
  return baseEffect
}