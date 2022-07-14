import { StatType } from '../../game/stats/statDefinitions.js'
import { COMBAT_BASE_TURN_TIME } from '../../game/combat/fighterInstance.js'
import { roundToFixed } from '../../game/utilFunctions.js'
import healthIcon from '../assets/icons/health.svg'
import actionIcon from '../assets/icons/action.svg'
import physPowerIcon from '../assets/icons/physPower.svg'
import magicPowerIcon from '../assets/icons/magicPower.svg'

export const StatsDisplayStyle = {
  CUMULATIVE: 0, // Eg. "50%", i.e. our total of this stat is 50%
  ADDITIONAL: 1, // Eg. "+50%", i.e. we're adding 50%
}

export const StatsDisplayScope = {
  NONE: 0,
  COMBAT: 1,
  EXPLORING: 2,
  ALL: 3
}

const statDefinitionsInfo = {
  hpMax: {
    text: 'Max Health',
    icon: healthIcon,
    displayedValueFn: (value, { style, owner }) => {
      if(style === StatsDisplayStyle.CUMULATIVE && owner?.baseHp){
        return Math.ceil(value * owner.baseHp)
      }
    },
    descriptionFn: (value, { style, owner }) => {
      if(style === StatsDisplayStyle.CUMULATIVE && owner?.baseHp){
        return `Max Health (${owner.baseHp} + ${Math.ceil(value * 100 - 100)}%)`
      }
      return 'Max Health'
    },
    scope: StatsDisplayScope.ALL
  },
  physPower: {
    text: 'Phys Power',
    icon: physPowerIcon,
    displayedValueFn: (value, { style, owner }) => {
      if(style === StatsDisplayStyle.CUMULATIVE && owner?.basePower){
        return Math.ceil(value * owner.basePower)
      }
    },
    description: 'Phys power (basic attack damage)',
    scope: StatsDisplayScope.ALL
  },
  magicPower: {
    text: 'Magic Power',
    icon: magicPowerIcon,
    displayedValueFn: (value, { style, owner }) => {
      if(style === StatsDisplayStyle.CUMULATIVE && owner?.basePower){
        return Math.ceil(value * owner.basePower)
      }
    },
    description: 'Magic power',
    scope: StatsDisplayScope.ALL
  },
  physDef: {
    text: 'Phys Defense',
    description: 'Blocks physical damage.\nThis is multiplicative, so 50% + 50% = 75%.',
    scope: StatsDisplayScope.COMBAT
  },
  magicDef: {
    text: 'Magic Defense',
    description: '',
    scope: StatsDisplayScope.COMBAT
  },
  speed: {
    text: 'Speed',
    icon: actionIcon,
    displayedValueFn: (value, { style }) => {
      if(style === StatsDisplayStyle.CUMULATIVE){
        return roundToFixed(COMBAT_BASE_TURN_TIME / (1000 * value), 2) + 's'
      }
    },
    description: 'Speed (combat turn time)',
    scope: StatsDisplayScope.COMBAT
  },
  critChance: {
    text: 'Critical Strike Chance',
    description: 'Chance to deal bonus damage.',
    scope: StatsDisplayScope.COMBAT
  },
  critDamage: {
    text: 'Critical Strike Damage',
    description: 'Bonus damage from critical strikes.',
    displayedValueFn: (value, { style }) => {
      if(style === StatsDisplayStyle.CUMULATIVE){
        return `${Math.round(value * 100)}%`
      }
    },
    scope: StatsDisplayScope.COMBAT
  },
  dodgeChance: {
    text: 'Dodge Chance',
    description: 'Chance to dodge attacks.',
    scope: StatsDisplayScope.COMBAT
  },
  lifesteal: {
    text: 'Lifesteal',
    displayedValueFn: value => `${roundToFixed(value, 2)}%`,
    description: 'Gain health when dealing physical damage.',
    scope: StatsDisplayScope.COMBAT
  },
  combatHarderChance: {
    text: 'Stronger Monster Chance',
    description: 'Increases chance to fight stronger monsters.',
    scope: StatsDisplayScope.EXPLORING
  },
  combatXP: {
    text: 'Combat XP Gain',
    description: 'Increases XP gained from combat.',
    scope: StatsDisplayScope.EXPLORING
  },
  relicSolveChance: {
    text: 'Relic Solve Chance',
    description: 'Increased chance to solve relic puzzles. Rarer relics are harder to solve.',
    scope: StatsDisplayScope.EXPLORING
  },
  relicRareChance: {
    text: 'Increased Relic Rarity',
    displayedValueFn: value => `${Math.floor(value)}%`,
    description: 'Chance to find high quality relics.'
  },
  regen: {
    text: 'Health Regeneration',
    displayedValueFn: value => `${roundToFixed(value, 2)}%`,
    descriptionFn: (value, { style, owner }) => {
      if(style === StatsDisplayStyle.CUMULATIVE && owner?.baseHp){
        return `Recover ${roundToFixed(owner.baseHp * value / 100, 2)} health per 5 seconds, both in and out of combat.`
      }
      return 'Recover this much health per second.'
    },
    scope: StatsDisplayScope.ALL
  },
  chestFind: {
    text: 'Chest Find',
    description: 'Increased chance to find treasure chests from combat rewards or from treasure relics.',
    scope: StatsDisplayScope.EXPLORING
  }
}

const DEFAULTS = {
  scope: StatsDisplayScope.NONE,
  description: null,
  text: null,
  icon: null
}

export function getStatDisplayInfo(stat, options = {}){
  options = {
    style: StatsDisplayStyle.CUMULATIVE,
    owner: null,
    ...options
  }
  const info = { ...statDefinitionsInfo[stat.name] }
  if(!info){
    return null
  }
  if(info.displayedValueFn){
    info.displayedValue = info.displayedValueFn(stat.value, options)
  }
  if(info.displayedValue === undefined){
    info.displayedValue = toText(stat.type, stat.value, options.style)
  }
  if(info.descriptionFn){
    info.description = info.descriptionFn(stat.value, options)
  }
  delete info.descriptionFn
  delete info.displayedValueFn
  return {
    ...DEFAULTS,
    ...info,
    stat,
    order: Object.keys(statDefinitionsInfo).indexOf(stat.name)
  }
}

export function scopesMatch(scope1, scope2){
  if(scope1 === StatsDisplayScope.NONE || scope2 === StatsDisplayScope.NONE){
    return false
  }
  if(scope1 === StatsDisplayScope.ALL || scope2 === StatsDisplayScope.ALL){
    return true
  }
  return scope1 === scope2
}

function toText(statType, value, style){
  if(statType === StatType.MULTIPLIER){
    return `${value > 1 ? '+' : ''}${Math.round((value - 1) * 100)}%`
  }else if(statType === StatType.PERCENTAGE){
    return `${style === StatsDisplayStyle.ADDITIONAL ? '+' : ''}${roundToFixed(value * 100, 1)}%`
  }
  return `${value > 0 && style === StatsDisplayStyle.ADDITIONAL ? '+' : ''}${value}`
}