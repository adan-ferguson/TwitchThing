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
  },
  physDef: {
    text: 'Phys Defense',
    description: 'Blocks physical damage.\nThis is multiplicative, so 50% + 50% = 75%.',
  },
  magicDef: {
    text: 'Magic Defense',
    description: '',
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
  },
  critChance: {
    text: 'Crit Chance',
    description: 'Chance to deal bonus damage.',
    displayedValueFn: value => `${Math.round(value * 100)}%`,
  },
  critDamage: {
    text: 'Crit Damage',
    description: 'Bonus damage from critical strikes.',
    displayedValueFn: (value, { style }) => {
      if(style === StatsDisplayStyle.CUMULATIVE){
        return `${Math.round(100 + value * 100)}%`
      }
    },
  },
  dodgeChance: {
    text: 'Dodge Chance',
    description: 'Chance to dodge attacks.',
  },
  lifesteal: {
    text: 'Lifesteal',
    displayedValueFn: value => `${Math.round(value * 100)}%`,
    description: 'Gain health when dealing physical damage.',
  },
  combatHarderChance: {
    text: 'Stronger Monster Chance',
    description: 'Increases chance to fight stronger monsters.',
  },
  combatXP: {
    text: 'Combat XP Gain',
    description: 'Increases XP gained from combat.',
  },
  relicSolveChance: {
    text: 'Relic Solve Chance',
    description: 'Increased chance to solve relic puzzles. Rarer relics are harder to solve.',
  },
  relicRareChance: {
    text: 'Increased Relic Rarity',
    displayedValueFn: value => `${Math.floor(value)}%`,
    description: 'Chance to find high quality relics.'
  },
  regen: {
    text: 'Health Regeneration',
    displayedValueFn: value => `${roundToFixed(value * 100, 1)}%`,
    descriptionFn: (value, { style, owner }) => {
      if(style === StatsDisplayStyle.CUMULATIVE && owner?.baseHp){
        return `Recover ${value * owner.baseHp} health every 5 seconds, both in and out of combat (scales with level).`
      }
      return `Recover (${value}% x Base Health) health every 5 seconds, both in and out of combat.`
    },
  },
  chestFind: {
    text: 'Chest Find',
    description: 'Increased chance to find treasure chests from combat rewards or from treasure relics.',
  }
}

const DEFAULTS = {
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

function toText(statType, value, style){
  if(statType === StatType.MULTIPLIER){
    return `${value > 1 ? '+' : ''}${Math.round((value - 1) * 100)}%`
  }else if(statType === StatType.PERCENTAGE){
    return `${style === StatsDisplayStyle.ADDITIONAL ? '+' : ''}${roundToFixed(value * 100, 1)}%`
  }
  return `${value > 0 && style === StatsDisplayStyle.ADDITIONAL ? '+' : ''}${value}`
}