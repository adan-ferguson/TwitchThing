import { arrayize, deepClone, pushOrCreate } from './utilFunctions.js'

export default class MetaEffectCollection{
  constructor(fighterInstance){
    this.fighterInstance = fighterInstance
    this.categories = {
      slots: [[],[]]
    }

    fighterInstance.effectInstances.forEach(ei => {
      const me = ei.baseEffectData.metaEffect
      if(!me){
        return
      }
      for(let subjectKey in me){
        if(subjectKey === 'attached' && ei.slotInfo){
          add(this.categories.slots, ei.slotInfo.col + 1 % 2, ei.slotInfo.row, me[subjectKey])
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
    return merge(effectInstance.baseEffectData, toApply)
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
    for(let key in metaEffect){
      if(key === 'metaEffectId'){
        continue
      }
      if(key === 'stats'){
        baseEffect.stats = [...arrayize(baseEffect.stats), metaEffect.stats]
      }
      if(key === 'exclusiveStats'){
        baseEffect.exclusiveStats = [...arrayize(baseEffect.exclusiveStats), metaEffect.exclusiveStats]
      }
      if(key === 'exclusiveMods'){
        pushOrCreate(baseEffect, 'exclusiveMods', metaEffect.exclusiveMods)
      }
    }
  })
  return baseEffect
}