import { arrayize, deepClone, pushOrCreate } from './utilFunctions.js'

export default class MetaEffectCollection{
  constructor(fighterInstance){
    this.fighterInstance = fighterInstance
    this.categories = {
      slots: [[],[]],
      ids: {},
      all: []
    }
    this.cache = {}

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
        const key = meDef.subject.key
        if(key){
          if(key === 'attached' && ei.slotInfo){
            add(this.categories.slots, ei.slotInfo.col + 1 % 2, ei.slotInfo.row, meDef)
          }else if(key === 'self'){
            pushOrCreate(this.categories.ids, ei.uniqueID, meDef)
          }else if(key === 'all'){
            this.categories.all.push(meDef)
          }else if(key.row){
            add(this.categories.slots, key.col ?? 0, key.row, meDef)
          }
        }
        if(meDef.subject.id){
          pushOrCreate(this.categories.ids, meDef.subject.id, meDef)
        }
      }
    })
  }

  apply(effectInstance){
    if(effectInstance.fighterInstance !== this.fighterInstance){
      throw 'Huh?'
    }
    if(!this.cache[effectInstance.uniqueID]){
      const toApply = []
      if(effectInstance.slotInfo){
        toApply.push(...get(this.categories.slots, effectInstance.slotInfo.col, effectInstance.slotInfo.row))
      }
      toApply.push(...(this.categories.ids[effectInstance.uniqueID] ?? []))
      toApply.push(...this.categories.all)
      const filtered = toApply.filter((meDef => {
        return effectInstance.fighterInstance.meetsConditions(meDef.conditions?.owner)
      }))
      this.cache[effectInstance.uniqueID] = merge(effectInstance.baseEffectData, filtered)
      this.cache[effectInstance.uniqueID] = merge(effectInstance.baseEffectData, filtered)
    }
    return this.cache[effectInstance.uniqueID]
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
    if(modification.addAbility){
      baseEffect.abilities = [...(baseEffect.abilities ?? []), modification.addAbility]
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
    if(amod.newTrigger){
      newDef.trigger = amod.newTrigger
    }
    return newDef
  })
}