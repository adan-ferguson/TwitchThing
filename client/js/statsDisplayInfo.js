import { COMBAT_BASE_TURN_TIME } from '../../game/combat/fighterInstance.js'
import { ADVENTURER_BASE_ROOM_TIME } from '../../game/adventurerInstance.js'

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
    text: 'Speed',
    description: stat => `Time between actions while in combat. ${stat.value} = ${speedToPct(stat.convertedValue, COMBAT_BASE_TURN_TIME)}s`
  },
  armor: {
    text: 'Armor',
    description: stat => `Physical damage taken reduced by ${Math.floor(100 * (1 - stat.convertedValue))}%.`
  },
  lifesteal: {
    text: 'Lifesteal',
    description: () => 'Gain health when dealing physical damage.'
  },
  adventuringSpeed: {
    text: 'Adventuring Speed',
    description: stat => `Time between rooms while adventuring. ${stat.value} = ${speedToPct(stat.convertedValue, ADVENTURER_BASE_ROOM_TIME)}s`
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
  description: null
}

export default function getStatDisplayInfo(stat){
  return { ...DEFAULTS, ...(statDefinitionsInfo[stat.name] || {}) }
}

function speedToPct(val, base){
  return Math.floor(base / val) / 1000
}