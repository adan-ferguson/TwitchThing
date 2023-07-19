import { expandActionDef } from '../../../game/actionDefs/expandActionDef.js'
import {
  attachedActiveSkill,
  attachedItem,
  describeStat, goldEntry,
  healthIcon,
  iconAndValue,
  scalingWrap,
  statScaling,
  wrapStat
} from '../components/common.js'
import { arrayize, msToS, toPct } from '../../../game/utilFunctions.js'
import { modDisplayInfo } from './modDisplayInfo.js'
import { statusEffectApplicationDescription, statusEffectDuration } from './statusEffectDisplayInfo.js'
import { shieldBashCalcStun } from '../../../game/commonMechanics/shieldBashCalcStun.js'
import { dimret, keyword } from './keywordDisplayInfo.js'

const ACTION_DEFS = {
  attack: (def, abilityInstance) => {
    const damageType = def.damageType
    let scalingStr = ''
    if(Object.keys(def.scaling).length){
      scalingStr += statScaling(def.scaling, abilityInstance, def.range)
    }
    if(Object.keys(def.targetScaling).length){
      scalingStr += statScaling(def.targetScaling, abilityInstance, def.range)
    }
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
  modifyAbility: (actionDef, ai) => {
    if(actionDef.modification.cooldownRemaining){
      return modifyCooldownRemaining(actionDef)
    }
  },
  shieldBash: (actionDef, ai) => {

    const chunks = []
    chunks.push(`Bash the enemy for ${statScaling({
      physPower: actionDef.physPower
    }, ai)} phys damage.`)

    if(ai){
      const block = shieldBashCalcStun(ai, actionDef)
      if(block){
        chunks.push(`The target becomes ${keyword('stunned')}${dimret()} <b>${msToS(block)}s</b>.`)
      }
    }else{
      chunks.push(`If ${attachedItem()} has ${describeStat('block')}, the target becomes ${keyword('stunned')}${dimret()}`)
      chunks.push(`for at least <b>${msToS(actionDef.stunMin)}s</b> (increases with that block value).`)
    }

    return chunks
  },
  balancedSmite: (actionDef, ability) => {
    const phys = statScaling({
      physPower: actionDef.power
    }, ability)
    const magic = statScaling({
      magicPower: actionDef.power
    }, ability)
    return `Attack for ${phys} phys damage or ${magic} magic damage, whichever is lower. (Phys if tie)`
  },
  shieldsUp: (actionDef, ability) => {
    return `Restore your block barrier with an extra <b>${toPct(actionDef.multiplier - 1)}</b> strength. Only use when your block barrier is down.`
  },
  penance: (actionDef, ability) => {
    return `Whenever you heal, attack for magic damage equal to <b>${toPct(actionDef.pct)}</b> of the amount healed.`
  },
  modifyStatusEffect: (actionDef, abilityInstance) => {
    if(actionDef.modification.remove){
      return `Remove all ${actionDef.subject.polarity}s from ${actionDef.targets === 'self' ? 'yourself' : 'the enemy'}.`
    }
  },
  spikedShield: actionDef => {
    return `Return <b>${toPct(actionDef.pctReturn)}</b> of blocked phys damage back at the attacker.`
  },
  breakItem: (actionDef, ability) => {
    const duration = statusEffectDuration(actionDef.statusEffect ?? {}, ability)
    return `Break ${actionDef.count ?? 1} of the enemy's items${duration ? ' ' + duration : ''}`
  },
  theBountyCollectorKill: (actionDef, ability) => {
    const goldStr = `Enemy Lvl x ${actionDef.value}`
    return `When you kill an enemy with ${attachedActiveSkill(true)}, get a bounty chest containing ${goldEntry(goldStr)}.`
  },
  mushroomSpores: () => {
    return 'Release spores which give the attacker a random debuff.'
  },
  explode: (actionDef, ability) => {
    return `Explode, dealing ${scalingWrap('health', toPct(actionDef.scaling.hp))} magic damage to the enemy.`
  }
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

function modifyCooldownRemaining(def){
  //  TODO: hacky
  if(def.targets === 'self'){
    return `Refresh your active cooldowns by ${msToS(-def.modification.cooldownRemaining)}s.`
  }else{
    return `Increase enemy's action cooldowns by ${msToS(def.modification.cooldownRemaining)}s.`
  }
}