import { deepClone } from './utilFunctions.js'

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
          add(this.categories.slots, ei.slotInfo[0] + 1 % 2, ei.slotInfo[1], me[subjectKey])
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
      toApply.push(...get(this.categories.slots, ...effectInstance.slotInfo))
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
    debugger
  })
  return baseEffect
}