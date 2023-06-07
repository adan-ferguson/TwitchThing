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
        if(meDef.subjectKey === 'attached' && ei.slotInfo){
          add(this.categories.slots, ei.slotInfo.col + 1 % 2, ei.slotInfo.row, meDef)
        }else if(meDef.subjectKey === 'self'){
          pushOrCreate(this.categories.ids, ei.uniqueID, meDef)
        }else if(meDef.subjectKey === 'all'){
          this.categories.all.push(meDef)
        }else if(meDef.subjectKey.row){
          add(this.categories.slots, meDef.subjectKey.col ?? 0, meDef.subjectKey.row, meDef)
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
      return effectInstance.fighterInstance.meetsConditions(meDef.conditions?.owner)
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
    const modification = metaEffect.effectModification
    if(modification.stats){
      baseEffect.stats = [...arrayize(baseEffect.stats), modification.stats]
    }
    if(modification.exclusiveStats){
      baseEffect.exclusiveStats = [...arrayize(baseEffect.exclusiveStats), modification.exclusiveStats]
    }
    if(modification.mods){
      pushOrCreate(baseEffect, 'mods', modification.mods)
    }
    if(modification.exclusiveMods){
      pushOrCreate(baseEffect, 'exclusiveMods', modification.exclusiveMods)
    }
    if(modification.statMultiplier){
      baseEffect.statMultiplier = (baseEffect.statMultiplier ?? 1) * modification.statMultiplier
    }
    if(modification.abilityModification && baseEffect.abilities){
      baseEffect.abilities = mergeAbilityModification(modification.abilityModification, baseEffect.abilities)
    }
  })
  return baseEffect
}

function mergeAbilityModification(amod, abilities){
  return abilities.map(abilityDef => {
    const newDef = deepClone(abilityDef)
    if(amod.trigger && abilityDef.trigger !== amod.trigger){
      return newDef
    }
    if(amod.turnRefund){
      newDef.turnRefund = (newDef.turnTime ?? 0) + amod.turnRefund
    }
    if(amod.repetitions){
      newDef.repetitions = (newDef.repetitions ?? 1) + amod.repetitions
    }
    if(amod.exclusiveStats){
      newDef.exclusiveStats = [...arrayize(newDef.exclusiveStats), amod.exclusiveStats]
    }
    if(amod.addAction){
      newDef.actions.push(amod.addAction)
    }
    return newDef
  })
}