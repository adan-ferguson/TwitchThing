import { roundToFixed, toDisplayName } from '../../../game/utilFunctions.js'
import { StatType } from '../../../game/stats/statType.js'
import statValueFns from '../../../game/stats/statValueFns.js'
import { ICON_SVGS } from '../assetLoader.js'

export const StatsDisplayStyle = {
  CUMULATIVE: 0, // Eg. "50%", i.e. our total of this stat is 50%
  ADDITIONAL: 1, // Eg. "+50%", i.e. we're adding 50%
}

const statDefinitionsInfo = {
  hpMax: {
    text: 'Max Health',
    icon: ICON_SVGS.health,
    description: 'Max Health (good description)'
  },
  physPower: {
    text: 'Phys Power',
    icon: ICON_SVGS.physPower,
    description: 'Phys power (basic attack damage)'
  },
  magicPower: {
    text: 'Magic Power',
    icon: ICON_SVGS.magicPower,
    description: 'Magic power'
  },
  physDef: {
    text: 'Phys Defense',
    icon: ICON_SVGS.physDef,
    description: 'Blocks physical damage.\nThis is multiplicative, so 50% + 50% = 75%.',
  },
  magicDef: {
    text: 'Magic Defense',
    icon: ICON_SVGS.magicDef,
    description: 'Blocks magical damage.\nThis is multiplicative, so 50% + 50% = 75%.',
  },
  missChance: {},
  speed: {
    text: 'Speed',
    displayInverted: true,
    icon: ICON_SVGS.action,
    description: 'Speed. Each extra 100 speed is about +1 turn per 3 seconds.',
  },
  damageDealt: {},
  damageTaken: {},
  critChance: {
    text: 'Crit Chance',
    description: 'Chance to deal bonus damage.',
    displayedValueFn: flatValuePercentageDisplay
  },
  enemyCritChance: {
    text: 'Enemy Crit Chance',
    description: 'Increases enemy\'s crit chance.',
    displayedValueFn: flatValuePercentageDisplay
  },
  critDamage: {
    text: 'Crit Damage',
    description: 'Increases damage deal by crits.',
    displayedValueFn: (value, { style }) => {
      if(style === StatsDisplayStyle.CUMULATIVE){
        return roundToFixed(1 + value, 2) + 'x'
      }
      return `+${Math.round((value - 1) * 100)}%`
    }
  },
  dodgeChance: {
    text: 'Dodge Chance',
    description: 'Chance to dodge attacks.',
  },
  blockChance: {
    text: 'Block Chance',
    description: 'Chance to block attacks.',
  },
  lifesteal: {
    text: 'Lifesteal',
    displayedValueFn: (value, { style }) => {
      if(style === StatsDisplayStyle.CUMULATIVE){
        return `${Math.round(value * 100)}%`
      }
      return `+${Math.round(value * 100)}%`
    }
  },
  critLifesteal: {
    text: 'Crit Lifesteal',
    displayedValueFn: (value, { style }) => {
      if(style === StatsDisplayStyle.CUMULATIVE){
        return `${Math.round(value * 100)}%`
      }
      return `+${Math.round(value * 100)}%`
    }
  },
  combatXP: {
    text: 'XP Gain'
  },
  startingFood: {
    text: 'Starting Food'
  },
  cooldownReduction: {
    text: 'Cooldown Reduction'
  },
  chestLevel: {
    text: 'Increased Chest Level',
    description: 'Chests you find are higher level.'
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
    info.displayedValue = toText(stat, options.style)
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

function toText(stat, style){
  const value = stat.value
  const statType = stat.type
  if(!value && statType === StatType.COMPOSITE){
    return toCompositeText(stat.mods, style)
  }
  if(statType === StatType.MULTIPLIER){
    return `${value > 1 ? '+' : ''}${Math.round((value - 1) * 100)}%`
  }else if(statType === StatType.PERCENTAGE){
    return `${plusSign(style, value)}${roundToFixed(value * 100, 1)}%`
  }
  return `${plusSign(style, value)}${value}`
}

function flatValuePercentageDisplay(value, { style }){
  let str = ''
  if(style === StatsDisplayStyle.ADDITIONAL && value > 0){
    str += '+'
  }
  return str + `${Math.round(value * 100)}%`
}

function toCompositeText(mods, style){
  // TODO: support multipliers
  if(!mods.all.pct.length){
    return '0'
  }
  const multiValue = statValueFns[StatType.MULTIPLIER](mods.all.pct.map(v => v + '%'))
  multiValue.type = StatType.MULTIPLIER
  return toText(multiValue, style)
}

function plusSign(style, value){
  if(style !== StatsDisplayStyle.ADDITIONAL){
    return ''
  }
  if(value < 0){
    return ''
  }
  return '+'
}