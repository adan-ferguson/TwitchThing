import { expandActionDef } from '../../../game/actionDefs/expandActionDef.js'
import {
  attachedActiveSkill,
  attachedItem, attachedSkill,
  describeStat, goldEntry,
  healthIcon,
  iconAndValue, pluralize,
  scalingWrap,
  statScaling,
  wrapStat
} from '../components/common.js'
import { arrayize, msToS, toPct } from '../../../game/utilFunctions.js'
import { modDisplayInfo } from './modDisplayInfo.js'
import { statusEffectApplicationDescription, statusEffectDuration } from './statusEffectDisplayInfo.js'
import { shieldBashCalcStun } from '../../../game/commonMechanics/shieldBashCalcStun.js'
import { dimret, keyword } from './keywordDisplayInfo.js'

const ABILITY_ACTION_HARDCODES = {
  hex: () => {
    return 'Turn the enemy into a random critter for 60 seconds.'
  },
  hydraMultiHeaded: () => {
    return 'Sprout 6 hydra heads.'
  },
  hydraSproutHead: () => {
    return 'Sprout 2 more hydra heads.'
  },
  bountyCollector: ability => {
    return `When you kill an enemy with ${attachedSkill(false)}, its gold reward is multiplied by <b>${ability.vars.goldReward}</b>.`
  }
}

const ACTION_DEFS = {
  attack: (def, abilityInstance) => {
    let scalingStr = statScaling(def.scaling, abilityInstance, def.range)
    return attackDescription(def, scalingStr)
  },
  dealDamage: (def, abilityInstance) => {
    const damageType = def.damageType
    const scalingStr = statScaling(def.scaling, abilityInstance, def.range)
    if(def.targets === 'target'){
      return `Deal an extra ${scalingStr} ${damageType} damage.`
    }else if(def.targets === 'enemy'){
      return `Deal ${scalingStr} ${damageType} damage to the enemy.`
    }
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
      <li>Ice: ${wrapStat('speed', -def.slow)}</li>
      <li>Necrotic: ${wrapStat('physPower', def.weaken)} & ${wrapStat('physPower', def.weaken)}</li>
    </ul>
    `)
    chunks.push('If your health is at 65% or lower, apply all 3.')
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
      return modifyCooldownRemaining(actionDef, actionDef.modification.cooldownRemaining)
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
      const polarity = actionDef.subject.polarity
      const str = actionDef.count ? pluralize(polarity, actionDef.count) : `all ${polarity}s`
      return `Remove ${str} from ${actionDef.targets === 'self' ? 'yourself' : 'the enemy'}.`
    }else if(actionDef.modification.stacks){
      if(actionDef.modification.stacks > 0){
        return `Add ${pluralize('stack', actionDef.modification.stacks)}`
      }else{
        return `Remove ${pluralize('stack', -actionDef.modification.stacks)}`
      }
    }
  },
  spikedShield: actionDef => {
    return `Return <b>${toPct(actionDef.pctReturn)}</b> of blocked phys damage back at the attacker.`
  },
  breakItem: (actionDef, ability) => {
    const duration = ' until end of combat.'
    return `Break ${actionDef.count ?? 1} of the enemy's items${duration ? ' ' + duration : ''}.`
  },
  theBountyCollectorKill: (actionDef, ability) => {
    const goldStr = `Enemy Lvl x ${actionDef.value}`
    return `When you kill an enemy with ${attachedActiveSkill(true)}, gain an extra ${goldEntry(goldStr)}.`
  },
  mushroomSpores: () => {
    return 'Release spores which give the attacker a random debuff.'
  },
  explode: (actionDef, ability) => {
    return `Explode, dealing ${scalingWrap('health', toPct(actionDef.scaling.hp))} magic damage to the enemy.`
  },
  targetScaledAttack: (def, abilityInstance) => {
    let scalingStr = statScaling(def.scaling, abilityInstance, def.range, ' target\'s')
    return attackDescription(def, scalingStr)
  },
  maybe: (actionDef, ability) => {
    const key = Object.keys(actionDef.action)[0]
    return [`${toPct(actionDef.chance)} chance:`, ...arrayize(ACTION_DEFS[key](actionDef.action[key]))]
  },
  terribleCurse: (actionDef, ability) => {
    const str = statScaling({
      magicPower: actionDef.attackScaling
    }, ability)
    const countStr = pluralize('TERRIBLE curse', actionDef.count, 'a')
    return `Give the opponent ${countStr}, or if they have one already, attack for ${str} magic damage.`
  },
  fireSpiritExplode: (actionDef, ability) => {
    return `Explode! Deal ${actionDef.ratio}x remaining barrier magic damage.`
  }
}

export function abilityActionsDescriptions(ability, abilityInstance){
  if (ABILITY_ACTION_HARDCODES[ability.abilityId]){
    return [ABILITY_ACTION_HARDCODES[ability.abilityId](ability, abilityInstance)]
  }
  return arrayToDescriptions(ability.actions, abilityInstance)
}

function arrayToDescriptions(actions, abilityInstance){
  const chunks = []
  actions = actions ?? []
  actions.forEach(actionDef => {
    if(Array.isArray(actionDef)){
      chunks.push(...arrayToDescriptions(actionDef, abilityInstance))
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

function modifyCooldownRemaining(actionDef, cdrDef){

  //  TODO: this is hacky/incomplete
  if(actionDef.targets === 'self'){
    return `Refresh your active cooldowns by <b>${factor(cdrDef)}</b>.`
  }else{
    return `Increase the enemy's active cooldowns by <b></b>${factor(cdrDef)}</b>.`
  }

  function factor(cdrDef){
    if(cdrDef.flat){
      return msToS(cdrDef.flat) + 's'
    }else if(cdrDef.total){
      return toPct(1 - cdrDef.total) + ' of max'
    }else if(cdrDef.remaining){
      return toPct(1 - cdrDef.remaining) + ' of remaining'
    }
  }
}

function attackDescription(def, str, abilityInstance){

  const damageType = def.damageType
  const times = def.hits > 1 ?  def.hits + ' times' : ''
  const chunks = ['Attack', times ,`for ${str} ${damageType} damage.`]

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
}