import { StatType } from '../../game/stats/statDefinitions.js'
import { COMBAT_BASE_TURN_TIME } from '../../game/combat/fighterInstance.js'
import { ADVENTURER_BASE_ROOM_TIME } from '../../game/adventurerInstance.js'
import { roundToFixed } from '../../game/utilFunctions.js'

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
    text: style => style === StatsDisplayStyle.ADDITIONAL ? 'Combat Speed' : 'Combat Turn Time',
    description: stat => 'Time between actions during combat.',
    valueFormat: speedFormat(COMBAT_BASE_TURN_TIME)
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
    text: style => style === StatsDisplayStyle.ADDITIONAL ? 'Adventuring Speed' : 'Adventuring Room Time',
    description: stat => 'Time between rooms while adventuring.',
    valueFormat: speedFormat(ADVENTURER_BASE_ROOM_TIME)
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
    description: () => '\'Power weight of this monsters, based on the current floor right now. This is a debugging value.'
  }
}

const DEFAULTS = {
  description: null,
  displayedValue: null
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
  return { ...DEFAULTS, ...info }
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