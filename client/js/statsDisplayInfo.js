import { all as StatDefs } from '../../game/stats/combined.js'
import { roundToFixed, toDisplayName } from '../../game/utilFunctions.js'
import healthIcon from '../assets/icons/health.svg'
import actionIcon from '../assets/icons/action.svg'
import physPowerIcon from '../assets/icons/physPower.svg'
import physDefIcon from '../assets/icons/physDef.svg'
import magicPowerIcon from '../assets/icons/magicPower.svg'
import magicDefIcon from '../assets/icons/magicDef.svg'
import { StatType } from '../../game/stats/statType.js'

export const StatsDisplayStyle = {
  CUMULATIVE: 0, // Eg. "50%", i.e. our total of this stat is 50%
  ADDITIONAL: 1, // Eg. "+50%", i.e. we're adding 50%
}

const statDefinitionsInfo = {
  [StatDefs.hpMax.name]: {
    text: 'Max Health',
    icon: healthIcon,
    description: 'Max Health (good description)'
  },
  [StatDefs.physPower.name]: {
    text: 'Phys Power',
    icon: physPowerIcon,
    description: 'Phys power (basic attack damage)',
    displayedValueFn: value => `${Math.round(value)}`
  },
  [StatDefs.magicPower.name]: {
    text: 'Magic Power',
    icon: magicPowerIcon,
    description: 'Magic power',
    displayedValueFn: value => `${Math.round(value)}`
  },
  [StatDefs.physDef.name]: {
    text: 'Phys Defense',
    icon: physDefIcon,
    description: 'Blocks physical damage.\nThis is multiplicative, so 50% + 50% = 75%.',
  },
  [StatDefs.magicDef.name]: {
    text: 'Magic Defense',
    icon: magicDefIcon,
    description: 'Blocks magical damage.\nThis is multiplicative, so 50% + 50% = 75%.',
  },
  [StatDefs.missChance.name]: {},
  [StatDefs.speed.name]: {
    text: 'Speed',
    displayInverted: true,
    icon: actionIcon,
    description: 'Speed. Each extra 100 speed is about +1 turn per 3 seconds.',
  },
  [StatDefs.damageDealt.name]: {},
  [StatDefs.damageTaken.name]: {},
  [StatDefs.critChance.name]: {
    text: 'Crit Chance',
    description: 'Chance to deal bonus damage.',
    displayedValueFn: value => {
      return `${Math.round(value * 100)}%`
    },
  },
  [StatDefs.enemyCritChance.name]: {
    text: 'Enemy Crit Chance',
    description: 'Increases enemy\'s crit chance.',
    displayedValueFn: value => {
      return `${Math.round(value * 100)}%`
    },
  },
  [StatDefs.critDamage.name]: {
    text: 'Crit Damage',
    description: 'Increases damage deal by crits.',
    displayedValueFn: (value, { style }) => {
      if(style === StatsDisplayStyle.CUMULATIVE){
        return roundToFixed(1 + value, 2) + 'x'
      }
      return `+${Math.round((value - 1) * 100)}%`
    }
  },
  [StatDefs.dodgeChance.name]: {
    text: 'Dodge Chance',
    description: 'Chance to dodge attacks.',
  },
  [StatDefs.lifesteal.name]: {
    text: 'Lifesteal',
    displayedValueFn: value => `${Math.round(value * 100)}%`,
    description: 'Gain health when dealing physical damage.',
  },
  [StatDefs.combatXP.name]: {
    text: 'Combat XP Gain',
    description: 'Increases XP gained from combat.',
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
  if(!statDefinitionsInfo[stat.name]){
    return null
  }
  const info = { ...statDefinitionsInfo[stat.name] }
  if(info.displayedValueFn){
    info.displayedValue = info.displayedValueFn(stat.value, options)
    delete info.displayedValueFn
  }
  if(info.displayedValue === undefined){
    info.displayedValue = toText(stat.type, stat.value, options.style)
  }
  if(info.descriptionFn){
    info.description = info.descriptionFn(stat.value, options)
    delete info.descriptionFn
  }
  return {
    ...DEFAULTS,
    text: toDisplayName(stat.name),
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