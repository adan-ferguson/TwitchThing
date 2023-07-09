import { expandActionDef } from '../../../game/actionDefs/expandActionDef.js'
import { healthIcon, iconAndValue, scalingWrap, statScaling, wrapStat } from '../components/common.js'
import { arrayize, roundToFixed, toPct } from '../../../game/utilFunctions.js'
import { modDisplayInfo } from './modDisplayInfo.js'
import { statusEffectApplicationDescription } from './statusEffectDisplayInfo.js'

const ACTION_DEFS = {
  attack: (def, abilityInstance) => {
    const damageType = def.damageType
    const scalingStr = statScaling(def.scaling, abilityInstance, def.range)
    const times = def.hits > 1 ?  def.hits + ' times' : ''
    const chunks = ['Attack', times ,`for ${scalingStr} ${damageType} damage.`]

    if(def.cantDodge){
      chunks.push('This can\'t be dodged.')
    }

    if(def.lifesteal){
      chunks.push(`Benefits from ${wrapStat('lifesteal', def.lifesteal)}.`)
    }

    abilityInstance?.parentEffect.exclusiveMods.forEach(mod => {
      const mdi = modDisplayInfo(mod)
      if(mdi.abilityDescription){
        chunks.push(mdi.abilityDescription)
      }
    })

    return chunks
  },
  dealDamage: (def, abilityInstance) => {
    const damageType = def.damageType
    const scalingStr = statScaling(def.scaling, abilityInstance, def.range)
    return `Deal an extra ${scalingStr} ${damageType} damage.`
  },
  takeDamage: (def, abilityInstance) => {
    let amount
    if(def.scaling.hp){
      amount = iconAndValue(healthIcon(), toPct(def.scaling.hp) + ' current')
    }else if(def.scaling.flat){
      amount = Math.ceil(def.scaling.flat)
    }
    return ['Take', '<b>' + amount + '</b>', def.damageType, 'damage.']
  },
  furiousStrikes: (def, abilityInstance) => {
    const scaling = {
      physPower: def.damagePer
    }
    if(abilityInstance){
      const count = def.base + Math.max(0, Math.floor(abilityInstance.totalStats.get('speed').value / def.per))
      return `Attack ${scalingWrap('speed', count)} times for ${statScaling(scaling, abilityInstance)}`
    }else{
      return `Attack ${def.base} times, plus an extra time for each ${scalingWrap('speed', `${def.per}`)}, for ${statScaling(scaling)} phys damage.`
    }
  },
  elementalBreath: (def, abilityInstance) => {
    const chunks = []
    chunks.push(`Attack for ${statScaling({ magicPower: def.magicPower }, abilityInstance)} magic damage, and apply one at random:`)
    chunks.push(`
    <ul>
      <li>Fire: Take ${statScaling({ magicPower: def.burn }, abilityInstance)} magic damage per 3s</li>
      <li>Ice: ${wrapStat('speed', def.slow)}</li>
      <li>Necrotic: ${wrapStat('damageDealt', def.weaken)}</li>
    </ul>
    `)
    chunks.push('If your health is at 50% or lower, apply all 3.')
    return chunks
  },
  applyStatusEffect: (def, abilityInstance) => {
    return statusEffectApplicationDescription(def, abilityInstance)
  },
  returnDamage: def => {
    return `Reflect <b>${toPct(def.pct)}</b> ${def.damageType} damage back.`
  },
  gainHealth: (actionDef, abilityInstance) => {
    const scaling = actionDef.scaling
    if(scaling.hpMax){
      return [`Recover <b>${toPct(scaling.hpMax)}</b> max health.`]
    }else if(scaling.hpMissing){
      return [`Recover <b>${toPct(scaling.hpMissing)}</b> missing health.`]
    }else{
      return [`Recover ${statScaling(scaling, abilityInstance)} health.`]
    }
  },
  // dealDamage: (actionDef, abilityInstance) => {
  //   const damageType = actionDef.damageType
  //   const scalingStr = statScaling(actionDef.scaling, abilityInstance, actionDef.range)
  //   return [`Deal an extra ${scalingStr} ${damageType} damage.`]
  // },
  // modifyAbility: (actionDef, abilityInstance) => {
  //   return [`Refresh your active cooldowns by ${msToS(actionDef.modification.cooldownRemaining * -1)}s.`]
  //
  // },
  // removeStatusEffect: (actionDef, abilityInstance) => {
  //   return `Remove all ${actionDef.polarity}s from ${actionDef.targets === 'self' ? 'yourself' : 'the enemy'}.`
  // }
  // balancedSmite: (actionDef, ability) => {
  //   const phys = statScaling({
  //     physPower: actionDef.power
  //   }, ability)
  //   const magic = statScaling({
  //     magicPower: actionDef.power
  //   }, ability)
  //   return {
  //     description: `Attack for ${phys} phys damage or ${magic} magic damage, whichever is lower. (Phys if tie)`
  //   }
  // },
  // shieldsUp: (actionDef, ability) => {
  //   return {
  //     description: `Restore your block barrier with an extra <b>${toPct(actionDef.multiplier - 1)}</b> strength. Only use when your block barrier is down.`
  //   }
  // },
  // penance: (actionDef, ability) => {
  //   return {
  //     description: `Whenever you heal, deal damage equal to <b>${toPct(actionDef.pct)}</b> of the amount healed.`
  //   }
  // },
  // breakItem: (actionDef, ability) => {
  //   const duration = statusEffectDuration(actionDef.statusEffect ?? {}, ability)
  //   return {
  //     description: `Break ${actionDef.count ?? 1} of the target's items${duration ? ' ' + duration : ''}.`
  //   }
  // },
  // theBountyCollectorKill: (actionDef, ability) => {
  //   const goldStr = `Enemy Lvl x ${actionDef.value}`
  //   return {
  //     description: `When you kill an enemy with ${attachedActiveSkill()} get a bounty chest containing ${goldEntry(goldStr)}.`
  //   }
  // }
}

export function actionArrayDescriptions(actions, abilityInstance){
  const chunks = []
  actions = actions ?? []
  actions.forEach(actionDef => {
    if(Array.isArray(actionDef)){
      chunks.push(...actionArrayDescriptions(actionDef, abilityInstance))
    }else{
      actionDef = expandActionDef(actionDef) ?? actionDef
      const key = Object.keys(actionDef)[0]
      if(ACTION_DEFS[key]){
        chunks.push(...arrayize(ACTION_DEFS[key](actionDef[key], abilityInstance)))
      }
    }
  })
  return chunks
}