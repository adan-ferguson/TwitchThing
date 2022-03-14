import { StatType } from '../../game/stats/statDefinitions.js'

export const StatsDisplayStyle = {
  CUMULATIVE: 0, // Eg. "50%", i.e. our total of this stat is 50%
  ADDITIONAL: 1, // Eg. "+50%", i.e. we're adding 50%
}

const statDefinitionsInfo = {
  attack: {
    text: 'Attack',
    description: () => 'Physical damage dealt while attacking.'
  },
  hpMax: {
    text: 'HP',
    description: () => 'Maximum health.'
  },
  speed: {
    text: 'Combat Speed',
    description: stat => 'Time between actions during combat.'
  },
  physDef: {
    text: 'Phys Defense',
    description: stat => 'Blocks physical damage.\nThis is multiplicative, so 50% + 50% = 75%.'
  },
  lifesteal: {
    text: 'Lifesteal',
    valueFormat: value => `${Math.floor(value)}%`,
    description: () => 'Gain health when dealing physical damage.'
  },
  adventuringSpeed: {
    text: 'Adventuring Speed',
    description: stat => 'Time between rooms while adventuring.'
  },
  xpGain: {
    text: 'XP Gain',
    description: () => 'Increases XP gained by adventurer.'
  },
  stairFind: {
    text: 'Stair Find Chance',
    description: () => 'Find stairs faster. Important as floors contain more and more rooms the deeper you go.'
  },
  relicFind: {
    text: 'Relic Find Chance',
    description: () => 'Increased chance to find relics. Relics get more powerful but are harder to find the deeper you go.'
  },
  power: {
    text: 'Power',
    description: () => '\'Power weight of this monster, based on the current floor right now. This is a debugging value.'
  }
}

const DEFAULTS = {
  description: null,
  displayedValue: null
}

export function getStatDisplayInfo(stat, style){
  const info = statDefinitionsInfo[stat.name]
  if(!info){
    return null
  }
  if(info.valueFormat){
    info.displayedValue = info.valueFormat(stat.value, style)
  }else{
    info.displayedValue = toText(stat.type, stat.value, style)
  }
  return { ...DEFAULTS, ...(statDefinitionsInfo[stat.name] || {}) }
}

function toText(statType, value, style){
  if(statType === StatType.ADDITIVE_MULTIPLIER){
    return `${value > 1 ? '+' : '-'}${Math.floor((value - 1) * 100)}%`
  }else if(statType === StatType.PERCENTAGE){
    return `${value > 0 && style === StatsDisplayStyle.ADDITIONAL ? '+' : ''}${(value * 100).toFixed(1)}%`
  }
  return `${value > 0 && style === StatsDisplayStyle.ADDITIONAL ? '+' : ''}${value}`
}