import { COMBAT_BASE_TURN_TIME } from '../../game/combat/fighterInstance.js'
import { ADVENTURER_BASE_ROOM_TIME } from '../../game/adventurerInstance.js'
import { StatType } from '../../game/stats/statDefinitions.js'

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
    description: stat => 'Blocks physical damage.'
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
  }
}

const DEFAULTS = {
  description: null,
  displayedValue: null
}

export default function getStatDisplayInfo(stat){
  const info = statDefinitionsInfo[stat.name]
  if(info.valueFormat){
    info.displayedValue = info.valueFormat(stat.value)
  }else{
    info.displayedValue = toText(stat.type, stat.value)
  }
  return { ...DEFAULTS, ...(statDefinitionsInfo[stat.name] || {}) }
}

function speedToPct(val, base){
  return Math.floor(base / val) / 1000
}

function toText(statType, value){
  if(statType === StatType.ADDITIVE_MULTIPLIER){
    return `${value >= 1 ? '+' : ''}${(100 * (value - 1)).toFixed(1)}%`
  }else if(statType === StatType.PERCENTAGE){
    return `${(value * 100).toFixed(1)}%`
  }
  return value
}