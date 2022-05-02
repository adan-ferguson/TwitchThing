import { StatType } from '../../game/stats/statDefinitions.js'
import { COMBAT_BASE_TURN_TIME } from '../../game/combat/fighterInstance.js'
import { roundToFixed } from '../../game/utilFunctions.js'

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
  attack: {
    text: 'Attack',
    description: () => 'Physical damage dealt while attacking.',
    scope: StatsDisplayScope.COMBAT
  },
  hpMax: {
    text: 'HP',
    description: () => 'Maximum health.',
    scope: StatsDisplayScope.ALL
  },
  speed: {
    text: style => style === StatsDisplayStyle.ADDITIONAL ? 'Combat Speed' : 'Combat Turn Time',
    description: stat => 'Time between actions during combat.',
    valueFormat: speedFormat(COMBAT_BASE_TURN_TIME),
    scope: StatsDisplayScope.COMBAT
  },
  physDef: {
    text: 'Phys Defense',
    description: stat => 'Blocks physical damage.\nThis is multiplicative, so 50% + 50% = 75%.',
    scope: StatsDisplayScope.COMBAT
  },
  lifesteal: {
    text: 'Lifesteal',
    valueFormat: value => `${Math.floor(value)}%`,
    description: () => 'Gain health when dealing physical damage.',
    scope: StatsDisplayScope.COMBAT
  },
  xpGain: {
    text: 'XP Gain',
    description: () => 'Increases XP gained by adventurer.',
    scope: StatsDisplayScope.ALL
  },
  stairFind: {
    text: 'Stair Find Chance',
    description: () => 'Find stairs faster. Important as floors contain more and more rooms the deeper you go.',
    scope: StatsDisplayScope.EXPLORING
  },
  relicFind: {
    text: 'Relic Find Chance',
    description: () => 'Increased chance to find relics. Relics get more powerful but are harder to find the deeper you go.',
    scope: StatsDisplayScope.EXPLORING
  }
}

const DEFAULTS = {
  description: null,
  displayedValue: null,
  scope: StatsDisplayScope.NONE
}

export function getStatDisplayInfo(stat, style){
  const info = { ...statDefinitionsInfo[stat.name] }
  if(!info){
    return null
  }
  if(info.valueFormat){
    info.displayedValue = info.valueFormat(stat.value, style)
  }
  if(info.displayedValue === undefined){
    info.displayedValue = toText(stat.type, stat.value, style)
  }
  if(typeof info.text === 'function'){
    info.text = info.text(style)
  }
  return { ...DEFAULTS, ...info, stat }
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
  if(statType === StatType.ADDITIVE_MULTIPLIER || statType === StatType.MULTIPLIER){
    return `${value > 1 ? '+' : ''}${Math.round((value - 1) * 100)}%`
  }else if(statType === StatType.PERCENTAGE){
    return `${value > 0 && style === StatsDisplayStyle.ADDITIONAL ? '+' : ''}${roundToFixed(value * 100, 1)}%`
  }
  return `${value > 0 && style === StatsDisplayStyle.ADDITIONAL ? '+' : ''}${value}`
}

function speedFormat(base){
  return (val, style) => {
    if(style === StatsDisplayStyle.ADDITIONAL){
      return undefined
    }
    return roundToFixed(base / (1000 * val), 2) + 's'
  }
}