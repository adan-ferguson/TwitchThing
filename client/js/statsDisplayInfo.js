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
    icon: healthIcon,
    displayedValueFn: (value, { style, owner }) => {
      if(style === StatsDisplayStyle.CUMULATIVE && owner?.baseHp){
        return Math.ceil(value * owner.baseHp)
      }
    },
    descriptionFn: (value, { style, owner }) => {
      if(style === StatsDisplayStyle.CUMULATIVE && owner?.baseHp){
        return `Max Health (${owner.baseHp} + ${value * 100 - 100}%)`
      }
      return 'Max Health'
    },
    scope: StatsDisplayScope.ALL
  },
  physPower: {
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
    icon: magicPowerIcon,
    displayedValueFn: (value, { style, owner }) => {
      if(style === StatsDisplayStyle.CUMULATIVE && owner?.basePower){
        return Math.ceil(value * owner.basePower)
      }
    },
    description: 'Magic power',
    scope: StatsDisplayScope.ALL
  },
  speed: {
    icon: actionIcon,
    displayedValueFn: (value, { style }) => {
      if(style === StatsDisplayStyle.CUMULATIVE){
        return roundToFixed(COMBAT_BASE_TURN_TIME / (1000 * value), 2) + 's'
      }
    },
    description: 'Combat action time (speed)',
    scope: StatsDisplayScope.NONE
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
  lifesteal: {
    text: 'Lifesteal',
    valueFormat: value => `${Math.floor(value)}%`,
    description: 'Gain health when dealing physical damage.',
    scope: StatsDisplayScope.COMBAT
  },
  xpGain: {
    text: 'XP Gain',
    description: 'Increases XP gained by adventurer.',
    scope: StatsDisplayScope.ALL
  },
  stairFind: {
    text: 'Stair Find Chance',
    description: 'Find stairs faster. Important as floors contain more and more rooms the deeper you go.',
    scope: StatsDisplayScope.EXPLORING
  },
  relicFind: {
    text: 'Relic Find Chance',
    description: 'Increased chance to find relics. Relics get more powerful but are harder to find the deeper you go.',
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
    info.displayedValue = toText(stat.type, stat.value, options)
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
  }
  return `${value > 0 && style === StatsDisplayStyle.ADDITIONAL ? '+' : ''}${value}`
}