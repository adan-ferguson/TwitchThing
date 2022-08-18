import { StatType } from '../../game/stats/statDefinitions.js'
import { COMBAT_BASE_TURN_TIME } from '../../game/combat/fighterInstance.js'
import { roundToFixed } from '../../game/utilFunctions.js'
import healthIcon from '../assets/icons/health.svg'
import actionIcon from '../assets/icons/action.svg'
import physPowerIcon from '../assets/icons/physPower.svg'
import physDefIcon from '../assets/icons/physDef.svg'
import magicPowerIcon from '../assets/icons/magicPower.svg'
import magicDefIcon from '../assets/icons/magicDef.svg'

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
    icon: physDefIcon,
    description: 'Blocks physical damage.\nThis is multiplicative, so 50% + 50% = 75%.',
  },
  magicDef: {
    text: 'Magic Defense',
    icon: magicDefIcon,
    description: 'Blocks magical damage.\nThis is multiplicative, so 50% + 50% = 75%.',
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
    description: 'Increases damage deal by crits.',
    displayedValueFn: (value, { style }) => {
      if(style === StatsDisplayStyle.CUMULATIVE){
        return roundToFixed(1 + value, 2) + 'x'
      }
      return value
    }
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
    description: 'Increases chance to fight stronger (higher level) monsters.',
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
    text: 'Rare Relic Chance',
    description: 'Chance to find high quality relics.'
  },
  regen: {
    text: 'Health Regeneration',
    displayedValueFn: value => `${roundToFixed(value * 100, 1)}%`,
    descriptionFn: (value, { style, owner }) => {
      if(style === StatsDisplayStyle.CUMULATIVE && owner?.baseHp){
        return `Recover ${value * owner.baseHp} health every 5 seconds, both in and out of combat (scales with level).`
      }
      return `Recover (${roundToFixed(value * 100, 1)}% x Base Health) health every 5 seconds, both in and out of combat.`
    },
  },
  chestFind: {
    text: 'Chest Find',
    description: 'Increased chance to find treasure chests from combat rewards or from treasure relics.',
  },
  rewards: {
    text: 'Rewards',
    description: 'More xp for killing, better chests.'
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